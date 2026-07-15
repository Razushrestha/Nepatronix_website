'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { HR_DEPARTMENTS } from '@/lib/hr/constants'

export default function HrLoginPage() {
  const router = useRouter()
  const [department, setDepartment] = useState('nepatronix')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const res = await fetch('/api/hr/auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'same-origin',
      body: JSON.stringify({ department, email, password }),
    })
    if (res.ok) {
      router.push('/hr')
      router.refresh()
    } else {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Login failed')
    }
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 hr-theme">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-[#C1121F]/10 rounded-2xl mb-4 text-2xl">👔</div>
          <h1 className="text-2xl font-bold text-slate-900">HR Portal</h1>
          <p className="text-slate-500 text-sm mt-1">Nepatronix Group — employees &amp; managers</p>
        </div>
        <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Department</label>
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="hr-input"
              required
            >
              {HR_DEPARTMENTS.map((d) => (
                <option key={d.value} value={d.value}>{d.label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Work email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="hr-input" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="hr-input" required />
          </div>
          {error && <p className="text-red-600 text-sm">{error}</p>}
          <button type="submit" disabled={loading} className="hr-btn w-full">
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <p className="text-center text-xs text-slate-400 mt-6">
          Website admin? <a href="/admin/login" className="text-[#C1121F] hover:underline">CMS login</a>
        </p>
      </div>
    </div>
  )
}
