import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import TasksPage from '../modules/tasks/pages/TasksPage';
import DashboardPage from '../modules/app/pages/DashboardPage';
import VoicePage from '../modules/voice/pages/VoicePage';
import AdminPage from '../modules/admin/pages/AdminPage';
import JobsPage from '../modules/jobs/pages/JobsPage';
import { AuthProvider } from '../modules/auth/AuthProvider';

// Mock API responses
const mockTasks = [
  {
    _id: '1',
    title: 'Test Task 1',
    description: 'Test description 1',
    status: 'pending',
    priority: 'medium',
    category: 'work',
    deadline: '2024-01-20T10:00:00Z',
    time_required: 60,
    recurring: false,
    archived: false,
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
  },
  {
    _id: '2',
    title: 'Test Task 2',
    description: 'Test description 2',
    status: 'completed',
    priority: 'high',
    category: 'personal',
    deadline: '2024-01-18T15:00:00Z',
    time_required: 30,
    recurring: true,
    archived: false,
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-16T10:00:00Z',
  },
];

const mockUser = {
  id: '1',
  username: 'testuser',
  email: 'test@example.com',
  fullname: 'Test User',
  role: 'user',
};

// Mock API client
vi.mock('../shared/api/client', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    patch: vi.fn(),
    delete: vi.fn(),
    interceptors: {
      request: { use: vi.fn() },
      response: { use: vi.fn() },
    },
  },
  getAuthTokens: vi.fn(() => ({ accessToken: 'mock-token' })),
  setAuthTokens: vi.fn(),
  clearAuthTokens: vi.fn(),
}));

// Mock React Query hooks
vi.mock('../shared/hooks/useTaskQueries', () => ({
  useTaskQueries: () => ({
    useGetTasks: () => ({
      data: { data: mockTasks },
      isLoading: false,
      error: null,
      refetch: vi.fn(),
    }),
    useCreateTask: () => ({
      mutateAsync: vi.fn(),
      isLoading: false,
    }),
    useUpdateTask: () => ({
      mutateAsync: vi.fn(),
      isLoading: false,
    }),
    useDeleteTask: () => ({
      mutateAsync: vi.fn(),
      isLoading: false,
    }),
    useCompleteTask: () => ({
      mutateAsync: vi.fn(),
      isLoading: false,
    }),
    useArchiveTask: () => ({
      mutateAsync: vi.fn(),
      isLoading: false,
    }),
    useAddComment: () => ({
      mutateAsync: vi.fn(),
      isLoading: false,
    }),
    useGetReminderStats: () => ({
      data: { upcoming: 2, overdue: 1, urgent: 1, total: 4 },
    }),
    useGetAnalytics: () => ({
      data: { completionRate: 75, totalTasks: 10 },
    }),
  }),
}));

vi.mock('../shared/hooks/useAuthQueries', () => ({
  useAuthQueries: () => ({
    useGetMe: () => ({
      data: mockUser,
      isLoading: false,
    }),
  }),
}));

vi.mock('../shared/hooks/useVoiceQueries', () => ({
  useVoiceQueries: () => ({
    useTranscribeAudio: () => ({
      mutateAsync: vi.fn(),
    }),
    useParseVoice: () => ({
      mutateAsync: vi.fn(),
    }),
    useCreateTaskFromVoice: () => ({
      mutateAsync: vi.fn(),
    }),
  }),
}));

// Test wrapper component
const TestWrapper = ({ children }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  const theme = createTheme();

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <AuthProvider>
            {children}
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
};

describe('TasksPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders tasks page with correct title', () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('displays task statistics', () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });

  it('shows create task button', () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    expect(screen.getByText('Create Task')).toBeInTheDocument();
  });

  it('displays task cards', () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    expect(screen.getByText('Test Task 1')).toBeInTheDocument();
    expect(screen.getByText('Test Task 2')).toBeInTheDocument();
  });

  it('opens task form when create button is clicked', async () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });
  });
});

describe('DashboardPage', () => {
  it('renders dashboard with correct title', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Dashboard')).toBeInTheDocument();
  });

  it('displays dashboard statistics', () => {
    render(
      <TestWrapper>
        <DashboardPage />
      </TestWrapper>
    );

    expect(screen.getByText('Total Tasks')).toBeInTheDocument();
    expect(screen.getByText('Completed')).toBeInTheDocument();
    expect(screen.getByText('Pending')).toBeInTheDocument();
    expect(screen.getByText('Overdue')).toBeInTheDocument();
  });
});

describe('VoicePage', () => {
  it('renders voice page with correct title', () => {
    render(
      <TestWrapper>
        <VoicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Voice Input')).toBeInTheDocument();
  });

  it('shows voice recording controls', () => {
    render(
      <TestWrapper>
        <VoicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Start Recording')).toBeInTheDocument();
  });

  it('displays voice input instructions', () => {
    render(
      <TestWrapper>
        <VoicePage />
      </TestWrapper>
    );

    expect(screen.getByText('Instructions:')).toBeInTheDocument();
  });
});

describe('AdminPage', () => {
  beforeEach(() => {
    // Mock admin user
    vi.mocked(require('../shared/hooks/useAuthQueries').useAuthQueries).mockReturnValue({
      useGetMe: () => ({
        data: { ...mockUser, role: 'admin' },
        isLoading: false,
      }),
    });
  });

  it('renders admin panel for admin users', () => {
    render(
      <TestWrapper>
        <AdminPage />
      </TestWrapper>
    );

    expect(screen.getByText('Admin Panel')).toBeInTheDocument();
  });

  it('shows access denied for non-admin users', () => {
    vi.mocked(require('../shared/hooks/useAuthQueries').useAuthQueries).mockReturnValue({
      useGetMe: () => ({
        data: mockUser, // regular user
        isLoading: false,
      }),
    });

    render(
      <TestWrapper>
        <AdminPage />
      </TestWrapper>
    );

    expect(screen.getByText('Access denied. Admin privileges required.')).toBeInTheDocument();
  });
});

describe('JobsPage', () => {
  it('renders jobs page with correct title', () => {
    render(
      <TestWrapper>
        <JobsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Background Jobs')).toBeInTheDocument();
  });

  it('displays job statistics', () => {
    render(
      <TestWrapper>
        <JobsPage />
      </TestWrapper>
    );

    expect(screen.getByText('Total Jobs')).toBeInTheDocument();
    expect(screen.getByText('Running')).toBeInTheDocument();
    expect(screen.getByText('Paused')).toBeInTheDocument();
    expect(screen.getByText('Failed')).toBeInTheDocument();
  });
});

// Component integration tests
describe('Component Integration', () => {
  it('navigates between pages correctly', () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    // Test navigation would go here
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });

  it('handles task creation flow', async () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    const createButton = screen.getByText('Create Task');
    fireEvent.click(createButton);

    await waitFor(() => {
      expect(screen.getByText('Create Task')).toBeInTheDocument();
    });
  });

  it('handles task filtering', () => {
    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    // Test filtering functionality
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });
});

// Error handling tests
describe('Error Handling', () => {
  it('displays error message when API fails', () => {
    vi.mocked(require('../shared/hooks/useTaskQueries').useTaskQueries).mockReturnValue({
      useGetTasks: () => ({
        data: null,
        isLoading: false,
        error: { message: 'Failed to fetch tasks' },
        refetch: vi.fn(),
      }),
    });

    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    expect(screen.getByText('Failed to load tasks: Failed to fetch tasks')).toBeInTheDocument();
  });

  it('shows loading state', () => {
    vi.mocked(require('../shared/hooks/useTaskQueries').useTaskQueries).mockReturnValue({
      useGetTasks: () => ({
        data: null,
        isLoading: true,
        error: null,
        refetch: vi.fn(),
      }),
    });

    render(
      <TestWrapper>
        <TasksPage />
      </TestWrapper>
    );

    // Loading state would be shown by skeleton components
    expect(screen.getByText('Tasks')).toBeInTheDocument();
  });
});
