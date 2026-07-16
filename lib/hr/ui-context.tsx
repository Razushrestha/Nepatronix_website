'use client'

import { createContext, useContext } from 'react'

export type HrUiRoot = 'portal' | 'admin'

type HrUiPaths = {
  employees: string
  employeesNew: string
  employeeView: (id: string) => string
  employeeEdit: (id: string) => string
  attendance: string
  attendanceEmployee: (id: string) => string
  leave: string
  settings: string
}

const PORTAL_PATHS: HrUiPaths = {
  employees: '/hr/manage/employees',
  employeesNew: '/hr/manage/employees/new',
  employeeView: (id) => `/hr/manage/employees/${id}`,
  employeeEdit: (id) => `/hr/manage/employees/${id}/edit`,
  attendance: '/hr/manage/attendance',
  attendanceEmployee: (id) => `/hr/manage/attendance/${id}`,
  leave: '/hr/manage/leave',
  settings: '/hr/manage/settings',
}

const ADMIN_PATHS: HrUiPaths = {
  employees: '/admin/hr/employees',
  employeesNew: '/admin/hr/employees/new',
  employeeView: (id) => `/admin/hr/employees/${id}`,
  employeeEdit: (id) => `/admin/hr/employees/${id}/edit`,
  attendance: '/admin/hr/attendance',
  attendanceEmployee: (id) => `/admin/hr/attendance/${id}`,
  leave: '/admin/hr/leave',
  settings: '/admin/hr/settings',
}

const HrUiContext = createContext<HrUiPaths>(PORTAL_PATHS)

export function HrUiProvider({ root, children }: { root: HrUiRoot; children: React.ReactNode }) {
  return (
    <HrUiContext.Provider value={root === 'admin' ? ADMIN_PATHS : PORTAL_PATHS}>
      {children}
    </HrUiContext.Provider>
  )
}

export function useHrPaths() {
  return useContext(HrUiContext)
}
