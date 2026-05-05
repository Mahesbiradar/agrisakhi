import { createContext, useContext, useState } from 'react'
import jobsData from '../data/jobs'
import servicesData from '../data/services'
import usersData from '../data/users'

const JOBS_STORAGE_KEY = 'agrisakhi_jobs'
const SERVICES_STORAGE_KEY = 'agrisakhi_services'
const USERS_STORAGE_KEY = 'agrisakhi_users'

const DataContext = createContext(null)

function readStoredList(storageKey) {
  if (typeof window === 'undefined') {
    return []
  }

  try {
    const storedValue = window.localStorage.getItem(storageKey)
    return storedValue ? JSON.parse(storedValue) : []
  } catch {
    return []
  }
}

function persistStoredList(storageKey, items) {
  window.localStorage.setItem(storageKey, JSON.stringify(items))
}

export function DataProvider({ children }) {
  const [jobs, setJobs] = useState(() => [...jobsData, ...readStoredList(JOBS_STORAGE_KEY)])
  const [services, setServices] = useState(() => [
    ...servicesData,
    ...readStoredList(SERVICES_STORAGE_KEY),
  ])
  const [users] = useState(() => [...usersData, ...readStoredList(USERS_STORAGE_KEY)])

  const addJob = (jobData) => {
    const newJob = {
      id: jobData.id ?? Date.now().toString(),
      postedAt: jobData.postedAt ?? new Date().toISOString(),
      status: jobData.status ?? 'open',
      ...jobData,
    }

    setJobs((currentJobs) => {
      const storedJobs = [...readStoredList(JOBS_STORAGE_KEY), newJob]
      persistStoredList(JOBS_STORAGE_KEY, storedJobs)

      return [...currentJobs, newJob]
    })
  }

  const addService = (serviceData) => {
    const newService = {
      id: serviceData.id ?? Date.now().toString(),
      available: serviceData.available ?? true,
      ...serviceData,
    }

    setServices((currentServices) => {
      const storedServices = [...readStoredList(SERVICES_STORAGE_KEY), newService]
      persistStoredList(SERVICES_STORAGE_KEY, storedServices)

      return [...currentServices, newService]
    })
  }

  const value = {
    jobs,
    services,
    users,
    addJob,
    addService,
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>
}

export function useData() {
  const context = useContext(DataContext)

  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }

  return context
}
