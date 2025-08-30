import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CreateFolderDialog } from '../CreateFolderDialog'
import { useFolders, useCreateFolder } from '@/api/folders'

// Mock the API hooks
vi.mock('@/api/folders', () => ({
  useFolders: vi.fn(),
  useCreateFolder: vi.fn(),
}))

const mockUseFolders = vi.mocked(useFolders)
const mockUseCreateFolder = vi.mocked(useCreateFolder)

// Test wrapper with QueryClient
const TestWrapper = ({ children }: { children: React.ReactNode }) => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  })
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
}

describe('CreateFolderDialog', () => {
  const mockCreateFolder = vi.fn()
  const mockOnClose = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    
    mockUseFolders.mockReturnValue({
      data: [
        { id: '1', name: 'Parent Folder', description: 'Test parent' },
        { id: '2', name: 'Another Folder', description: 'Another test' },
      ],
      isLoading: false,
      isError: false,
      error: null,
    } as ReturnType<typeof useFolders>)

    mockUseCreateFolder.mockReturnValue({
      mutateAsync: mockCreateFolder,
      isPending: false,
      mutate: vi.fn(),
      isError: false,
      error: null,
      isSuccess: false,
      reset: vi.fn(),
    } as ReturnType<typeof useCreateFolder>)
  })

  it('should render dialog when open', () => {
    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    expect(screen.getByText('Create New Folder')).toBeInTheDocument()
    expect(screen.getByLabelText('Folder Name*')).toBeInTheDocument()
    expect(screen.getByLabelText('Description (Optional)')).toBeInTheDocument()
  })

  it('should not render dialog when closed', () => {
    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={false} onClose={mockOnClose} />
      </TestWrapper>
    )

    expect(screen.queryByText('Create New Folder')).not.toBeInTheDocument()
  })

  it('should disable create button when folder name is empty', () => {
    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    const createButton = screen.getByRole('button', { name: 'Create Folder' })
    expect(createButton).toBeDisabled()
  })

  it('should enable create button when folder name is provided', async () => {
    const user = userEvent.setup()
    
    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    const nameInput = screen.getByLabelText('Folder Name*')
    await user.type(nameInput, 'New Folder')

    const createButton = screen.getByRole('button', { name: 'Create Folder' })
    expect(createButton).toBeEnabled()
  })

  it('should create folder with correct data', async () => {
    const user = userEvent.setup()
    mockCreateFolder.mockResolvedValue({ id: '3', name: 'New Folder' })

    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    // Fill form
    await user.type(screen.getByLabelText('Folder Name*'), 'New Folder')
    await user.type(screen.getByLabelText('Description (Optional)'), 'Test description')

    // Submit
    await user.click(screen.getByRole('button', { name: 'Create Folder' }))

    await waitFor(() => {
      expect(mockCreateFolder).toHaveBeenCalledWith({
        name: 'New Folder',
        description: 'Test description',
        color: expect.any(String),
        icon: expect.any(String),
      })
    })

    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should create subfolder when parentId is provided', async () => {
    const user = userEvent.setup()
    mockCreateFolder.mockResolvedValue({ id: '3', name: 'Sub Folder' })

    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} parentId="1" />
      </TestWrapper>
    )

    expect(screen.getByText(/Creating subfolder in:/)).toBeInTheDocument()
    expect(screen.getByText('Parent Folder')).toBeInTheDocument()

    await user.type(screen.getByLabelText('Folder Name*'), 'Sub Folder')
    await user.click(screen.getByRole('button', { name: 'Create Folder' }))

    await waitFor(() => {
      expect(mockCreateFolder).toHaveBeenCalledWith({
        name: 'Sub Folder',
        description: undefined,
        parent_id: '1',
        color: expect.any(String),
        icon: expect.any(String),
      })
    })
  })

  it('should handle form submission with Enter key', async () => {
    const user = userEvent.setup()
    mockCreateFolder.mockResolvedValue({ id: '3', name: 'New Folder' })

    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    const nameInput = screen.getByLabelText('Folder Name*')
    await user.type(nameInput, 'New Folder')
    await user.keyboard('{Enter}')

    await waitFor(() => {
      expect(mockCreateFolder).toHaveBeenCalled()
    })
  })

  it('should close dialog on cancel', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    await user.click(screen.getByRole('button', { name: 'Cancel' }))
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should close dialog on escape key', async () => {
    const user = userEvent.setup()

    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    await user.keyboard('{Escape}')
    expect(mockOnClose).toHaveBeenCalled()
  })

  it('should show loading state during creation', async () => {
    const user = userEvent.setup()
    
    mockUseCreateFolder.mockReturnValue({
      mutateAsync: mockCreateFolder,
      isPending: true,
      mutate: vi.fn(),
      isError: false,
      error: null,
      isSuccess: false,
      reset: vi.fn(),
    } as ReturnType<typeof useCreateFolder>)

    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    await user.type(screen.getByLabelText('Folder Name*'), 'New Folder')

    const createButton = screen.getByRole('button', { name: /Create Folder/ })
    expect(createButton).toHaveAttribute('data-disabled', 'true')
  })

  it('should be mobile responsive', () => {
    render(
      <TestWrapper>
        <CreateFolderDialog isOpen={true} onClose={mockOnClose} />
      </TestWrapper>
    )

    const modal = screen.getByRole('dialog')
    expect(modal).toHaveClass('mx-4') // Mobile margins
  })
})
