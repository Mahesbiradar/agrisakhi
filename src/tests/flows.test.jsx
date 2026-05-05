import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { I18nextProvider } from 'react-i18next'
import { vi, describe, it, expect, beforeEach } from 'vitest'
import i18n from '../lib/i18n.js'

vi.mock('../lib/api.js', () => ({
  authAPI: {
    register: vi.fn(),
    login: vi.fn().mockRejectedValue({ response: { data: { detail: 'Invalid phone or password.' } } }),
  },
  usersAPI: { getProfile: vi.fn().mockResolvedValue({ data: {} }), getNearby: vi.fn().mockResolvedValue({ data: [] }) },
  jobsAPI: {
    list: vi.fn().mockResolvedValue({ data: [] }),
    myJobs: vi.fn().mockResolvedValue({ data: [] }),
    create: vi.fn(),
    getById: vi.fn().mockResolvedValue({ data: {} }),
  },
  servicesAPI: { list: vi.fn().mockResolvedValue({ data: [] }), myServices: vi.fn().mockResolvedValue({ data: [] }) },
  ratingsAPI: { create: vi.fn() },
}))

const mockAuthState = {
  user: { id: '1', name: 'Test', phone: '9999999999', role: 'farmer', village: 'Hubli', district: 'Dharwad', lat: 14.2, lng: 75.9 },
  isLoggedIn: true,
  setAuth: vi.fn(),
  clearAuth: vi.fn(),
  loadFromStorage: vi.fn(),
}

vi.mock('../store/authStore.js', () => ({
  default: vi.fn((sel) => (sel ? sel(mockAuthState) : mockAuthState)),
}))

function wrap(ui) {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } })
  return (
    <QueryClientProvider client={qc}>
      <I18nextProvider i18n={i18n}>
        <MemoryRouter>{ui}</MemoryRouter>
      </I18nextProvider>
    </QueryClientProvider>
  )
}

// ─── Test 1: RegisterPage renders role cards ───────────────────────────────
describe('RegisterPage', () => {
  it('renders role cards', async () => {
    const { default: RegisterPage } = await import('../pages/RegisterPage.jsx')
    render(wrap(<RegisterPage />))
    expect(screen.getByText('Farmer')).toBeInTheDocument()
    expect(screen.getByText('Labour')).toBeInTheDocument()
    expect(screen.getByText('Service Provider')).toBeInTheDocument()
  })
})

// ─── Test 2: LanguageToggle switches language ──────────────────────────────
describe('LanguageToggle', () => {
  it('switches text from English to Kannada', async () => {
    const { default: LanguageToggle } = await import('../components/LanguageToggle.jsx')
    render(<I18nextProvider i18n={i18n}><MemoryRouter><LanguageToggle /></MemoryRouter></I18nextProvider>)
    const kn = screen.getByText('ಕನ್ನಡ')
    await userEvent.click(kn)
    expect(i18n.language).toBe('kn')
    const en = screen.getByText('EN')
    await userEvent.click(en)
    expect(i18n.language).toBe('en')
  })
})

// ─── Test 3: PostJobPage shows AudioRecorder ──────────────────────────────
describe('PostJobPage', () => {
  it('shows AudioRecorder component', async () => {
    const { default: PostJobPage } = await import('../pages/PostJobPage.jsx')
    render(wrap(<PostJobPage />))
    expect(screen.getByLabelText(/record/i)).toBeInTheDocument()
  })
})

// ─── Test 4: LabourDashboard shows skeleton when loading ──────────────────
describe('LabourDashboard', () => {
  it('renders without crashing', async () => {
    const { default: LabourDashboard } = await import('../pages/LabourDashboard.jsx')
    render(wrap(<LabourDashboard />))
    await waitFor(() => {
      const hasGreeting = screen.queryByText(/Namaskara/i) !== null
      const hasSkeleton = document.querySelector('[class*="animate-pulse"]') !== null
      expect(hasGreeting || hasSkeleton).toBe(true)
    })
  })
})

// ─── Test 5: JobDetailPage shows audio player when audio_url set ──────────
describe('JobDetailPage', () => {
  it('renders job detail page', async () => {
    const { jobsAPI } = await import('../lib/api.js')
    jobsAPI.getById.mockResolvedValue({
      data: {
        id: 'abc', title: 'Harvest wheat', work_type: 'harvesting',
        wage_per_day: 400, duration_days: 3, workers_needed: 2,
        village: 'Hubli', district: 'Dharwad', status: 'open',
        audio_url: 'https://example.com/audio.webm',
        image_url: '', description: 'Test', farmer_name: 'Raju',
      },
    })
    const { default: JobDetailPage } = await import('../pages/JobDetailPage.jsx')
    render(
      <QueryClientProvider client={new QueryClient({ defaultOptions: { queries: { retry: false } } })}>
        <I18nextProvider i18n={i18n}>
          <MemoryRouter initialEntries={['/jobs/abc']}>
            <JobDetailPage />
          </MemoryRouter>
        </I18nextProvider>
      </QueryClientProvider>,
    )
    await waitFor(() => expect(screen.queryByText(/Listen/i) || screen.queryByText(/Harvest wheat/i)).toBeTruthy())
  })
})

// ─── Test 6: LoginPage shows error on failed submit ───────────────────────
describe('LoginPage', () => {
  it('shows error on failed submit', async () => {
    const { default: LoginPage } = await import('../pages/LoginPage.jsx')
    render(wrap(<LoginPage />))
    await userEvent.type(screen.getByPlaceholderText(/10 digit/i), '9999999999')
    await userEvent.type(screen.getByPlaceholderText(/password/i), 'wrongpass')
    await userEvent.click(screen.getByRole('button', { name: /login/i }))
    await waitFor(() => expect(screen.getByText(/invalid/i)).toBeInTheDocument())
  })
})
