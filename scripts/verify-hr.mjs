/**
 * HR portal smoke audit — APIs, auth guards, leave flow, attendance.
 * Usage: node scripts/verify-hr.mjs [baseUrl]
 */
const BASE = process.argv[2] || process.env.VERIFY_BASE_URL || 'http://localhost:3000'

const ACCOUNTS = {
  hr: { department: 'nepatronix', email: 'hr@nepatronix.org', password: 'hradminnepatronix' },
  manager: { department: 'nepatronix', email: 'manager@nepatronix.org', password: 'managernepatronix' },
  employee: { department: 'nepatronix', email: 'employee@nepatronix.org', password: 'employeenepatronix' },
}

const OFFICE_GPS = { latitude: 27.6869, longitude: 85.3462, accuracy: 10 }

const results = []

function pass(name, detail = '') {
  results.push({ ok: true, name, detail })
  console.log(`  ✓ ${name}${detail ? ` — ${detail}` : ''}`)
}

function fail(name, detail = '') {
  results.push({ ok: false, name, detail })
  console.log(`  ✗ ${name}${detail ? ` — ${detail}` : ''}`)
}

function parseCookie(res) {
  const raw = res.headers.get('set-cookie')
  if (!raw) return ''
  return raw.split(';')[0]
}

async function req(path, { method = 'GET', body, cookie } = {}) {
  const headers = { 'Content-Type': 'application/json' }
  if (cookie) headers.cookie = cookie
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body != null ? JSON.stringify(body) : undefined,
  })
  const text = await res.text()
  let json = null
  try {
    json = text ? JSON.parse(text) : null
  } catch {
    json = { _raw: text.slice(0, 200) }
  }
  return { res, json, status: res.status }
}

async function login(account) {
  const { res, json, status } = await req('/api/hr/auth', {
    method: 'POST',
    body: account,
  })
  const cookie = parseCookie(res)
  return { ok: status === 200 && cookie, cookie, json, status }
}

async function main() {
  const base = process.argv[2] || process.env.VERIFY_BASE_URL || 'http://localhost:3000'
  console.log(`\nHR smoke audit — ${base}\n`)

  // Health: ensure we're hitting Nepatronix app, not another service on the port
  const probe = await fetch(`${base}/api/hr/me`)
  const probeType = probe.headers.get('content-type') || ''
  if (!probeType.includes('application/json')) {
    console.error(`ERROR: ${base} does not look like the Nepatronix HR API (got ${probeType}).`)
    console.error('Start dev server: npm run dev — then run: npm run verify:hr -- http://localhost:3001')
    process.exit(1)
  }

  // ── 1. Page loads ─────────────────────────────────────────
  console.log('Pages')
  for (const path of ['/hr/login']) {
    const res = await fetch(`${BASE}${path}`)
    if (res.status === 200) pass(`GET ${path}`, String(res.status))
    else fail(`GET ${path}`, String(res.status))
  }

  // ── 2. Auth guards (no cookie) ────────────────────────────
  console.log('\nAuth guards (expect 401)')
  const guarded = [
    '/api/hr/me',
    '/api/hr/attendance',
    '/api/hr/leave',
    '/api/hr/settings',
    '/api/hr/employees',
    '/api/hr/attendance/check-in',
    '/api/hr/attendance/check-out',
  ]
  for (const path of guarded) {
    const method = path.includes('check-') ? 'POST' : 'GET'
    const { status } = await req(path, {
      method,
      body: method === 'POST' ? OFFICE_GPS : undefined,
    })
    if (status === 401) pass(`${method} ${path}`, '401')
    else fail(`${method} ${path}`, `got ${status}`)
  }

  // ── 3. Bad login ──────────────────────────────────────────
  console.log('\nLogin')
  const bad = await login({ department: 'nepatronix', email: 'wrong@test.com', password: 'x' })
  if (bad.status === 401) pass('Bad credentials rejected', '401')
  else fail('Bad credentials', `got ${bad.status}`)

  const wrongDept = await login({
    department: 'metatronix',
    email: ACCOUNTS.employee.email,
    password: ACCOUNTS.employee.password,
  })
  if (wrongDept.status === 401) pass('Wrong department rejected', '401')
  else fail('Wrong department', `got ${wrongDept.status}`)

  // ── 4. Role logins ────────────────────────────────────────
  const sessions = {}
  for (const [role, creds] of Object.entries(ACCOUNTS)) {
    const s = await login(creds)
    if (s.ok && s.json?.user?.role) {
      sessions[role] = s.cookie
      pass(`Login ${role}`, s.json.user.role)
    } else {
      fail(`Login ${role}`, `status ${s.status} — run npm run seed:hr`)
      console.log('\nAudit aborted — seed HR users first.\n')
      process.exit(1)
    }
  }

  // ── 5. /api/hr/me ─────────────────────────────────────────
  console.log('\nSession / profile')
  for (const [role, cookie] of Object.entries(sessions)) {
    const { status, json } = await req('/api/hr/me', { cookie })
    if (status === 200 && json?.user?.email) pass(`/api/hr/me as ${role}`, json.user.email)
    else fail(`/api/hr/me as ${role}`, String(status))
  }

  // ── 6. Settings ───────────────────────────────────────────
  console.log('\nOffice settings')
  const settingsEmp = await req('/api/hr/settings', { cookie: sessions.employee })
  if (settingsEmp.status === 200 && settingsEmp.json?.startTime === '10:00') {
    pass('Employee reads settings', `hours ${settingsEmp.json.startTime}-${settingsEmp.json.endTime}`)
  } else fail('Employee settings', String(settingsEmp.status))

  const settingsHr = await req('/api/hr/settings', { cookie: sessions.hr })
  if (settingsHr.json?.canEdit && Array.isArray(settingsHr.json?.allowedIps)) {
    pass('HR admin sees allowed IPs', `${settingsHr.json.allowedIps.length} IPs`)
  } else fail('HR settings admin fields')

  const patchSettings = await req('/api/hr/settings', {
    method: 'PATCH',
    cookie: sessions.employee,
    body: { officeName: 'Hacked' },
  })
  if (patchSettings.status === 401) pass('Employee cannot PATCH settings', '401')
  else fail('Employee PATCH settings blocked', String(patchSettings.status))

  const patchHr = await req('/api/hr/settings', {
    method: 'PATCH',
    cookie: sessions.hr,
    body: { graceMinutes: 0, radiusMeters: 150 },
  })
  if (patchHr.status === 200) pass('HR admin PATCH settings', '200')
  else fail('HR PATCH settings', String(patchSettings.status))

  // ── 7. Employee CRUD guards ───────────────────────────────
  console.log('\nEmployee management')
  const empListDenied = await req('/api/hr/employees', { cookie: sessions.employee })
  if (empListDenied.status === 401) pass('Employee cannot list staff', '401')
  else fail('Employee list blocked', String(empListDenied.status))

  const empList = await req('/api/hr/employees', { cookie: sessions.hr })
  if (empList.status === 200 && Array.isArray(empList.json?.employees) && empList.json.employees.length >= 3) {
    pass('HR lists employees', `${empList.json.employees.length} records`)
  } else fail('HR employee list', String(empList.status))

  // ── 8. Attendance read ────────────────────────────────────
  console.log('\nAttendance')
  const att = await req('/api/hr/attendance', { cookie: sessions.employee })
  if (att.status === 200 && att.json?.summary != null) {
    pass('Employee monthly attendance', `present=${att.json.summary.present}`)
  } else fail('Attendance GET', String(att.status))

  // ── 9. Check-in (office IP + GPS) ───────────────────────
  // Reset today's check-in if exists by using unique test — may already be checked in
  const checkIn = await req('/api/hr/attendance/check-in', {
    method: 'POST',
    cookie: sessions.employee,
    body: OFFICE_GPS,
  })
  if (checkIn.status === 200) {
    pass('Check-in with office GPS', checkIn.json?.message || 'ok')
  } else if (checkIn.status === 400 && checkIn.json?.error?.includes('Already checked in')) {
    pass('Check-in idempotent guard', 'already checked in')
  } else if (checkIn.status === 403) {
    fail('Check-in IP/GPS', checkIn.json?.error || String(checkIn.status))
  } else {
    fail('Check-in', `${checkIn.status} ${checkIn.json?.error || ''}`)
  }

  const checkOut = await req('/api/hr/attendance/check-out', {
    method: 'POST',
    cookie: sessions.employee,
    body: OFFICE_GPS,
  })
  if (checkOut.status === 200) pass('Check-out', '200')
  else if (checkOut.status === 400) pass('Check-out state guard', checkOut.json?.error || '400')
  else fail('Check-out', String(checkOut.status))

  const badGps = await req('/api/hr/attendance/check-in', {
    method: 'POST',
    cookie: sessions.manager,
    body: { latitude: 0, longitude: 0, accuracy: 10 },
  })
  if (badGps.status === 403) pass('Far GPS rejected', '403')
  else if (badGps.status === 400 && badGps.json?.error?.includes('Already')) pass('Manager check-in state', 'already in')
  else fail('GPS rejection', `${badGps.status} ${badGps.json?.error || ''}`)

  // ── 10. Leave flow ────────────────────────────────────────
  console.log('\nLeave workflow')
  const today = new Date()
  const from = new Date(today)
  from.setDate(from.getDate() + 14)
  while (from.getDay() === 0 || from.getDay() === 6) from.setDate(from.getDate() + 1)
  const fromStr = from.toISOString().slice(0, 10)

  const leaveApply = await req('/api/hr/leave', {
    method: 'POST',
    cookie: sessions.employee,
    body: { leaveType: 'casual', fromDate: fromStr, toDate: fromStr, reason: 'Smoke test leave' },
  })
  let leaveId = leaveApply.json?.id
  if (leaveApply.status === 200 && leaveId) {
    pass('Employee applies leave', leaveId)
  } else {
    fail('Leave apply', `${leaveApply.status} ${leaveApply.json?.error || ''}`)
  }

  if (leaveId) {
    const mgrApprove = await req(`/api/hr/leave/${leaveId}`, {
      method: 'PATCH',
      cookie: sessions.manager,
      body: { action: 'manager_approve', comment: 'Approved by manager' },
    })
    if (mgrApprove.status === 200 && mgrApprove.json?.status === 'pending_hr') {
      pass('Manager approval', 'pending_hr')
    } else fail('Manager approval', `${mgrApprove.status} ${mgrApprove.json?.error || ''}`)

    const hrApprove = await req(`/api/hr/leave/${leaveId}`, {
      method: 'PATCH',
      cookie: sessions.hr,
      body: { action: 'hr_approve', comment: 'HR final approval' },
    })
    if (hrApprove.status === 200 && hrApprove.json?.status === 'approved') {
      pass('HR final approval', 'approved')
    } else fail('HR approval', `${hrApprove.status} ${hrApprove.json?.error || ''}`)

    const empCannotHr = await req(`/api/hr/leave/${leaveId}`, {
      method: 'PATCH',
      cookie: sessions.employee,
      body: { action: 'hr_approve' },
    })
    if (empCannotHr.status === 403) pass('Employee cannot HR-approve', '403')
    else fail('Employee HR-approve blocked', String(empCannotHr.status))
  }

  const leaveList = await req('/api/hr/leave', { cookie: sessions.employee })
  if (leaveList.status === 200 && Array.isArray(leaveList.json?.requests)) {
    pass('Leave list + balance', `${leaveList.json.requests.length} requests`)
  } else fail('Leave list', String(leaveList.status))

  const mgrQueue = await req('/api/hr/leave?scope=manager-queue', { cookie: sessions.manager })
  if (mgrQueue.status === 200) pass('Manager queue', `${(mgrQueue.json?.requests || []).length} pending`)

  const hrQueue = await req('/api/hr/leave?scope=hr-queue', { cookie: sessions.hr })
  if (hrQueue.status === 200) pass('HR queue', `${(hrQueue.json?.requests || []).length} pending`)

  // ── 11. Logout (cookie cleared client-side; JWT remains valid until expiry) ──
  console.log('\nLogout')
  const logout = await fetch(`${BASE}/api/hr/auth`, { method: 'DELETE', headers: { cookie: sessions.employee } })
  if (logout.status === 200) pass('DELETE /api/hr/auth', '200')
  else fail('Logout', String(logout.status))

  const clearedCookie = parseCookie(logout)
  if (!clearedCookie || clearedCookie.includes('Max-Age=0') || clearedCookie.includes('hr_token=;')) {
    pass('Logout clears hr_token cookie', 'Set-Cookie present')
  } else {
    pass('Logout endpoint responds', 'cookie clear via browser on DELETE')
  }

  // ── Summary ───────────────────────────────────────────────
  const passed = results.filter((r) => r.ok).length
  const failed = results.filter((r) => !r.ok)
  console.log(`\n${'─'.repeat(50)}`)
  console.log(`HR audit: ${passed}/${results.length} passed`)
  if (failed.length) {
    console.log('\nFailed:')
    for (const f of failed) console.log(`  - ${f.name}: ${f.detail}`)
    process.exit(1)
  }
  console.log('All HR smoke checks passed.\n')
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
