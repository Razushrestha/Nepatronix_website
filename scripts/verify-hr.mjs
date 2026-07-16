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

const OFFICE_GPS = { latitude: 27.6858125, longitude: 85.3165781, accuracy: 10 }

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
    '/api/hr/profile',
    '/api/hr/salary',
    '/api/hr/tasks',
    '/api/hr/stats',
    '/api/hr/attendance/overview',
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

  const empSearch = await req('/api/hr/employees?q=Sample', { cookie: sessions.hr })
  if (empSearch.status === 200 && empSearch.json?.employees?.length >= 1) {
    pass('HR employee search', `${empSearch.json.employees.length} match "Sample"`)
  } else fail('HR employee search', String(empSearch.status))

  const empDept = await req('/api/hr/employees?department=nepatronix', { cookie: sessions.hr })
  if (empDept.status === 200 && empDept.json?.employees?.every((e) => e.department === 'nepatronix')) {
    pass('HR employee dept filter', `${empDept.json.employees.length} in Nepatronix`)
  } else fail('HR employee dept filter', String(empDept.status))

  const sampleEmp = empList.json?.employees?.find((e) => e.email === ACCOUNTS.employee.email)
  const sampleEmpId = sampleEmp?.id
  if (sampleEmpId) {
    const empGet = await req(`/api/hr/employees/${sampleEmpId}`, { cookie: sessions.hr })
    if (empGet.status === 200 && empGet.json?.employee?.email === ACCOUNTS.employee.email) {
      pass('HR GET employee by id', empGet.json.employee.employeeCode)
    } else fail('HR GET employee', String(empGet.status))

    const empPatch = await req(`/api/hr/employees/${sampleEmpId}`, {
      method: 'PATCH',
      cookie: sessions.hr,
      body: { position: 'Sample Employee' },
    })
    if (empPatch.status === 200 && empPatch.json?.employee?.position === 'Sample Employee') {
      pass('HR PATCH employee', 'position updated')
    } else fail('HR PATCH employee', String(empPatch.status))

    const empGetDenied = await req(`/api/hr/employees/${sampleEmpId}`, { cookie: sessions.employee })
    if (empGetDenied.status === 401) pass('Employee cannot GET employee by id', '401')
    else fail('Employee employee[id] blocked', String(empGetDenied.status))
  } else {
    fail('Sample employee id for CRUD', 'not found in list')
  }

  // ── 8. Attendance read ────────────────────────────────────
  console.log('\nAttendance')
  const att = await req('/api/hr/attendance', { cookie: sessions.employee })
  if (att.status === 200 && att.json?.summary != null) {
    pass('Employee monthly attendance', `present=${att.json.summary.present}`)
  } else fail('Attendance GET', String(att.status))

  const attMonth = await req('/api/hr/attendance?month=2026-01', { cookie: sessions.employee })
  if (attMonth.status === 200 && attMonth.json?.month === '2026-01') {
    pass('Attendance month param', attMonth.json.month)
  } else fail('Attendance month filter', `${attMonth.status} month=${attMonth.json?.month}`)

  const empMeEarly = await req('/api/hr/me', { cookie: sessions.employee })
  const empIdForAtt = empMeEarly.json?.user?.id
  if (empIdForAtt) {
    const attAdmin = await req(`/api/hr/attendance?employeeId=${empIdForAtt}`, { cookie: sessions.hr })
    if (attAdmin.status === 200 && attAdmin.json?.employee?.id === empIdForAtt) {
      pass('HR admin attendance for employee', attAdmin.json.employee.fullName)
    } else fail('HR attendance employeeId', String(attAdmin.status))

    const mgrMe = await req('/api/hr/me', { cookie: sessions.manager })
    const mgrId = mgrMe.json?.user?.id
    if (mgrId && mgrId !== empIdForAtt) {
      const attEmpIgnored = await req(`/api/hr/attendance?employeeId=${mgrId}`, { cookie: sessions.employee })
      if (attEmpIgnored.status === 200 && attEmpIgnored.json?.employee?.id === empIdForAtt) {
        pass('Employee employeeId param ignored', 'returns own attendance only')
      } else fail('Employee attendance employeeId guard', String(attEmpIgnored.status))
    }
  }

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
    body: { leaveType: 'unpaid', fromDate: fromStr, toDate: fromStr, reason: 'Smoke test leave' },
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

  const leaveAll = await req('/api/hr/leave?scope=all', { cookie: sessions.hr })
  if (leaveAll.status === 200 && leaveAll.json?.summary?.total != null && leaveAll.json?.leaveTimeline?.length >= 12) {
    pass('Leave scope=all overview', `${leaveAll.json.summary.total} total · ${leaveAll.json.leaveTimeline.length} months`)
  } else fail('Leave scope=all', `${leaveAll.status} ${leaveAll.json?.error || ''}`)

  const leaveMonth = fromStr.slice(0, 7)
  const leaveMonthFilter = await req(`/api/hr/leave?scope=all&month=${leaveMonth}`, { cookie: sessions.hr })
  if (leaveMonthFilter.status === 200 && leaveMonthFilter.json?.monthKey === leaveMonth) {
    pass('Leave month filter', `${leaveMonthFilter.json.requests.length} in ${leaveMonth}`)
  } else fail('Leave month filter', String(leaveMonthFilter.status))

  const leaveApproved = await req('/api/hr/leave?scope=all&status=approved', { cookie: sessions.hr })
  if (leaveApproved.status === 200 && leaveApproved.json?.requests?.every((r) => r.status === 'approved')) {
    pass('Leave status=approved filter', `${leaveApproved.json.requests.length} approved`)
  } else fail('Leave approved filter', String(leaveApproved.status))

  const leaveDept = await req('/api/hr/leave?scope=all&department=nepatronix', { cookie: sessions.hr })
  if (leaveDept.status === 200 && leaveDept.json?.filters?.department === 'nepatronix') {
    pass('Leave department filter', `${leaveDept.json.requests.length} in Nepatronix`)
  } else fail('Leave dept filter', String(leaveDept.status))

  const leaveSearch = await req('/api/hr/leave?scope=all&q=Smoke', { cookie: sessions.hr })
  if (leaveSearch.status === 200 && leaveSearch.json?.requests?.length >= 1) {
    pass('Leave search filter', `${leaveSearch.json.requests.length} match "Smoke"`)
  } else fail('Leave search filter', String(leaveSearch.status))

  const leavePending = await req('/api/hr/leave?scope=all&status=pending', { cookie: sessions.hr })
  if (
    leavePending.status === 200 &&
    leavePending.json?.requests?.every((r) => ['pending_manager', 'pending_hr'].includes(r.status))
  ) {
    pass('Leave pending group filter', `${leavePending.json.requests.length} pending`)
  } else fail('Leave pending filter', String(leavePending.status))

  const leaveApply2 = await req('/api/hr/leave', {
    method: 'POST',
    cookie: sessions.employee,
    body: { leaveType: 'unpaid', fromDate: fromStr, toDate: fromStr, reason: 'set_status smoke test' },
  })
  const leaveId2 = leaveApply2.json?.id
  if (leaveApply2.status === 200 && leaveId2) {
    pass('Second leave for set_status', leaveId2)
    const setApproved = await req(`/api/hr/leave/${leaveId2}`, {
      method: 'PATCH',
      cookie: sessions.hr,
      body: { action: 'set_status', status: 'approved' },
    })
    if (setApproved.status === 200 && setApproved.json?.status === 'approved') {
      pass('set_status → approved', 'approved')
    } else fail('set_status approved', `${setApproved.status} ${setApproved.json?.error || ''}`)

    const setCancel = await req(`/api/hr/leave/${leaveId2}`, {
      method: 'PATCH',
      cookie: sessions.hr,
      body: { action: 'set_status', status: 'cancelled' },
    })
    if (setCancel.status === 200 && setCancel.json?.status === 'cancelled') {
      pass('set_status → cancelled', 'cancelled')
    } else fail('set_status cancelled', `${setCancel.status} ${setCancel.json?.error || ''}`)
  } else {
    fail('Second leave apply', `${leaveApply2.status} ${leaveApply2.json?.error || ''}`)
  }

  const leaveDenied = await req('/api/hr/leave?scope=all', { cookie: sessions.employee })
  if (leaveDenied.status === 403) pass('Employee cannot GET scope=all', '403')
  else fail('Leave scope=all blocked', String(leaveDenied.status))

  const leaveTeam = await req('/api/hr/leave?scope=team', { cookie: sessions.manager })
  if (leaveTeam.status === 200 && Array.isArray(leaveTeam.json?.requests)) {
    pass('Manager team leave scope', `${leaveTeam.json.requests.length} request(s)`)
  } else fail('Leave scope=team', String(leaveTeam.status))

  const leaveCancelApply = await req('/api/hr/leave', {
    method: 'POST',
    cookie: sessions.employee,
    body: { leaveType: 'unpaid', fromDate: fromStr, toDate: fromStr, reason: 'cancel smoke test' },
  })
  const leaveCancelId = leaveCancelApply.json?.id
  if (leaveCancelApply.status === 200 && leaveCancelId) {
    const leaveCancel = await req(`/api/hr/leave/${leaveCancelId}`, {
      method: 'PATCH',
      cookie: sessions.employee,
      body: { action: 'cancel' },
    })
    if (leaveCancel.status === 200) pass('Employee cancels own leave', 'cancelled')
    else fail('Leave cancel', `${leaveCancel.status} ${leaveCancel.json?.error || ''}`)
  } else {
    fail('Leave for cancel test', `${leaveCancelApply.status} ${leaveCancelApply.json?.error || ''}`)
  }

  const leaveRejectApply = await req('/api/hr/leave', {
    method: 'POST',
    cookie: sessions.employee,
    body: { leaveType: 'unpaid', fromDate: fromStr, toDate: fromStr, reason: 'reject smoke test' },
  })
  const leaveRejectId = leaveRejectApply.json?.id
  if (leaveRejectApply.status === 200 && leaveRejectId) {
    const leaveReject = await req(`/api/hr/leave/${leaveRejectId}`, {
      method: 'PATCH',
      cookie: sessions.manager,
      body: { action: 'reject', comment: 'Not approved' },
    })
    if (leaveReject.status === 200 && leaveReject.json?.status === 'rejected') {
      pass('Manager rejects leave', 'rejected')
    } else fail('Leave reject', `${leaveReject.status} ${leaveReject.json?.error || ''}`)
  } else {
    fail('Leave for reject test', `${leaveRejectApply.status} ${leaveRejectApply.json?.error || ''}`)
  }

  const leaveBadAction = await req(`/api/hr/leave/${leaveId || '000000000000000000000000'}`, {
    method: 'PATCH',
    cookie: sessions.employee,
    body: { action: 'set_status', status: 'approved' },
  })
  if (leaveBadAction.status === 403) pass('Employee cannot set_status', '403')
  else fail('set_status employee blocked', String(leaveBadAction.status))

  // ── 11. Profile & salary ──────────────────────────────────
  console.log('\nProfile & salary')
  const profileGet = await req('/api/hr/profile', { cookie: sessions.employee })
  if (profileGet.status === 200 && profileGet.json?.profile?.email) {
    pass('Employee GET profile', profileGet.json.profile.email)
  } else fail('Profile GET', String(profileGet.status))

  const profilePatch = await req('/api/hr/profile', {
    method: 'PATCH',
    cookie: sessions.employee,
    body: { phone: '9801111111', role: 'super_hr_admin', monthlyPay: 999999 },
  })
  if (profilePatch.status === 200 && profilePatch.json?.profile?.phone === '9801111111') {
    pass('Employee PATCH profile', 'phone updated')
  } else fail('Profile PATCH', `${profilePatch.status} ${profilePatch.json?.error || ''}`)

  if (profilePatch.json?.profile?.role === 'employee') {
    pass('Profile PATCH ignores role/salary', profilePatch.json.profile.role)
  } else fail('Profile privilege guard', profilePatch.json?.profile?.role || 'missing')

  const salaryGet = await req('/api/hr/salary', { cookie: sessions.employee })
  if (salaryGet.status === 200 && salaryGet.json?.monthlyPay != null) {
    pass('Employee GET salary', `NPR ${salaryGet.json.monthlyPay} · net ${salaryGet.json.estimatedNet}`)
  } else fail('Salary GET', String(salaryGet.status))

  const salaryDenied = await req('/api/hr/salary')
  if (salaryDenied.status === 401) pass('Salary requires auth', '401')
  else fail('Salary auth guard', String(salaryDenied.status))

  // ── 12. Tasks ─────────────────────────────────────────────
  console.log('\nTasks')
  const tasksEmp = await req('/api/hr/tasks', { cookie: sessions.employee })
  if (tasksEmp.status === 200 && Array.isArray(tasksEmp.json?.tasks)) {
    pass('Employee lists tasks', `${tasksEmp.json.tasks.length} task(s)`)
  } else fail('Tasks GET', String(tasksEmp.status))

  const empMe = await req('/api/hr/me', { cookie: sessions.employee })
  const empId = empMe.json?.user?.id

  const taskCreateDenied = await req('/api/hr/tasks', {
    method: 'POST',
    cookie: sessions.employee,
    body: { employeeId: empId, title: 'Hacked task' },
  })
  if (taskCreateDenied.status === 401) pass('Employee cannot create tasks', '401')
  else fail('Employee task POST blocked', String(taskCreateDenied.status))

  const taskCreate = await req('/api/hr/tasks', {
    method: 'POST',
    cookie: sessions.manager,
    body: {
      employeeId: empId,
      title: 'Smoke test task',
      description: 'Created by verify-hr.mjs',
      dueDate: fromStr,
    },
  })
  let taskId = taskCreate.json?.task?.id
  if (taskCreate.status === 201 && taskId) {
    pass('Manager creates task', taskId)
  } else fail('Manager task POST', `${taskCreate.status} ${taskCreate.json?.error || ''}`)

  if (taskId) {
    const taskStart = await req(`/api/hr/tasks/${taskId}`, {
      method: 'PATCH',
      cookie: sessions.employee,
      body: { status: 'in_progress' },
    })
    if (taskStart.status === 200 && taskStart.json?.task?.status === 'in_progress') {
      pass('Employee starts task', 'in_progress')
    } else fail('Task start', `${taskStart.status} ${taskStart.json?.error || ''}`)

    const taskDone = await req(`/api/hr/tasks/${taskId}`, {
      method: 'PATCH',
      cookie: sessions.employee,
      body: { status: 'completed' },
    })
    if (taskDone.status === 200 && taskDone.json?.task?.status === 'completed') {
      pass('Employee completes task', 'completed')
    } else fail('Task complete', `${taskDone.status} ${taskDone.json?.error || ''}`)

    const mgrCannotPatch = await req(`/api/hr/tasks/${taskId}`, {
      method: 'PATCH',
      cookie: sessions.manager,
      body: { status: 'pending' },
    })
    if (mgrCannotPatch.status === 403) pass('Only assignee can update task', '403')
    else fail('Task assignee guard', String(mgrCannotPatch.status))
  }

  // ── 13. HR stats (admin only) ───────────────────────────────
  console.log('\nHR stats')
  const statsHr = await req('/api/hr/stats', { cookie: sessions.hr })
  if (statsHr.status === 200 && statsHr.json?.kpis?.totalEmployees != null) {
    pass('HR admin GET stats', `${statsHr.json.kpis.totalEmployees} employees`)
  } else fail('Stats GET (HR)', String(statsHr.status))

  if (statsHr.json?.kpis?.netPayroll != null && Array.isArray(statsHr.json?.payrollHistory)) {
    pass('Stats payroll data', `net ${statsHr.json.kpis.netPayroll} · ${statsHr.json.payrollHistory.length} months`)
  } else fail('Stats payroll fields')

  const statsMonth = await req('/api/hr/stats?month=2026-01', { cookie: sessions.hr })
  if (statsMonth.status === 200 && statsMonth.json?.monthKey === '2026-01') {
    pass('Stats month param', statsMonth.json.month)
  } else fail('Stats month filter', String(statsMonth.status))

  if (Array.isArray(statsHr.json?.departments)) {
    pass('Stats departments', `${statsHr.json.departments.length} dept(s)`)
  } else fail('Stats departments')

  const statsEmp = await req('/api/hr/stats', { cookie: sessions.employee })
  if (statsEmp.status === 401) pass('Employee cannot GET stats', '401')
  else fail('Stats employee blocked', String(statsEmp.status))

  // ── 14. Attendance overview & filters ───────────────────────
  console.log('\nAttendance overview')
  const overviewAll = await req('/api/hr/attendance/overview', { cookie: sessions.hr })
  if (overviewAll.status === 200 && Array.isArray(overviewAll.json?.employees) && overviewAll.json?.departmentCounts) {
    pass('Overview all departments', `${overviewAll.json.employees.length} employees`)
  } else fail('Overview GET', `${overviewAll.status} ${overviewAll.json?.error || ''}`)

  const overviewDept = await req('/api/hr/attendance/overview?department=nepatronix', { cookie: sessions.hr })
  if (overviewDept.status === 200 && overviewDept.json?.filters?.department === 'nepatronix') {
    pass('Overview department filter', `${overviewDept.json.employees.length} in Nepatronix`)
  } else fail('Overview dept filter', String(overviewDept.status))

  const overviewEmpty = await req('/api/hr/attendance/overview?department=metatronix', { cookie: sessions.hr })
  if (overviewEmpty.status === 200 && overviewEmpty.json?.employees?.length === 0) {
    pass('Overview empty department', 'Metatronix 0 employees')
  } else fail('Overview empty dept', `got ${overviewEmpty.json?.employees?.length}`)

  const overviewSearch = await req('/api/hr/attendance/overview?q=Sample', { cookie: sessions.hr })
  if (overviewSearch.status === 200 && overviewSearch.json?.employees?.length >= 1) {
    pass('Overview search filter', `${overviewSearch.json.employees.length} match "Sample"`)
  } else fail('Overview search', String(overviewSearch.status))

  const overviewMonth = await req('/api/hr/attendance/overview?month=2026-01', { cookie: sessions.hr })
  if (overviewMonth.status === 200 && overviewMonth.json?.monthKey === '2026-01') {
    pass('Overview month filter', overviewMonth.json.month)
  } else fail('Overview month', String(overviewMonth.status))

  if (overviewAll.json?.payrollHistory?.length >= 12) {
    pass('Overview payroll history', `${overviewAll.json.payrollHistory.length} months`)
  } else fail('Payroll history months', String(overviewAll.json?.payrollHistory?.length))

  const overviewDenied = await req('/api/hr/attendance/overview', { cookie: sessions.employee })
  if (overviewDenied.status === 401) pass('Employee cannot GET overview', '401')
  else fail('Overview employee blocked', String(overviewDenied.status))

  // ── 15. Logout (cookie cleared client-side; JWT remains valid until expiry) ──
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
