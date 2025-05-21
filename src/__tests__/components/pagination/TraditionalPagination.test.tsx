import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { TraditionalPagination } from '../../../components/pagination/TraditionalPagination';

// Mock the PaginationBase component that TraditionalPagination might depend on
jest.mock('../../../components/pagination/PaginationBase', () => ({
  __esModule: true,
  default: ({ 
    currentPage,
    totalItems, 
    pageSize, 
    onPageChange, 
    onPageSizeChange,
    children 
  }: {
    currentPage: number;
    totalItems: number;
    pageSize: number;
    onPageChange: (page: number) => void;
    onPageSizeChange: (size: number) => void;
    children: React.ReactNode;
  }) => (
    <div data-testid="pagination-base">
      <div data-testid="pagination-controls">
        <select 
          data-testid="page-size-select"
          aria-label="Items per page:"
          onChange={(e) => onPageSizeChange(Number(e.target.value))}
          disabled={false}
        >
          <option value="10">10</option>
          <option value="20">20</option>
          <option value="50">50</option>
        </select>
        <div data-testid="jump-to-page">
          <label htmlFor="go-to-page">Go to page:</label>
          <input 
            id="go-to-page" 
            type="number" 
            min="1" 
            max={Math.ceil(totalItems / pageSize)} 
            defaultValue={String(currentPage)}
            onChange={(e) => onPageChange(Number(e.target.value))}
            disabled={false}
          />
          <button onClick={() => onPageChange(currentPage + 1)} disabled={false}>Go</button>
        </div>
      </div>
      {children}
    </div>
  )
}));

// Mock utility functions that TraditionalPagination might use
jest.mock('../../../utils/paginationUtils', () => ({
  generatePaginationItems: (
    currentPage: number, 
    totalPages: number, 
    siblingCount: number
  ) => {
    const items = [];
    // Use siblingCount to determine how many pages to show
    const pagesToShow = Math.min(siblingCount * 2 + 1, totalPages);
    
    for (let i = 1; i <= pagesToShow; i++) {
      items.push({
        type: i === currentPage ? 'active' : 'page',
        page: i,
        label: String(i)
      });
    }
    if (totalPages > pagesToShow) {
      items.push({ type: 'ellipsis', page: null, label: '...' });
    }
    return items;
  }
}));

describe('TraditionalPagination', () => {
  const defaultProps = {
    totalItems: 100,
    currentPage: 1,
    onPageChange: jest.fn(),
    pageSize: 10,
    onPageSizeChange: jest.fn(),
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with default props', () => {
    render(<TraditionalPagination {...defaultProps} />);
    
    // Page number buttons should be visible
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText('2')).toBeInTheDocument();
    
    // Navigation buttons should be visible
    expect(screen.getByText('Previous')).toBeInTheDocument();
    expect(screen.getByText('Next')).toBeInTheDocument();
    
    // Page size selector should be visible
    expect(screen.getByLabelText('Items per page:')).toBeInTheDocument();
    
    // Jump to page should be visible
    expect(screen.getByLabelText('Go to page:')).toBeInTheDocument();
  });

  it('disables Previous button on first page', () => {
    render(<TraditionalPagination {...defaultProps} currentPage={1} />);
    expect(screen.getByText('Previous')).toBeDisabled();
    expect(screen.getByText('Next')).not.toBeDisabled();
  });

  it('disables Next button on last page', () => {
    render(
      <TraditionalPagination 
        {...defaultProps} 
        currentPage={10} 
        pageSize={10} 
        totalItems={100} 
      />
    );
    expect(screen.getByText('Previous')).not.toBeDisabled();
    expect(screen.getByText('Next')).toBeDisabled();
  });

  it('calls onPageChange when clicking page numbers', () => {
    render(<TraditionalPagination {...defaultProps} />);
    fireEvent.click(screen.getByText('2'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking Next button', () => {
    render(<TraditionalPagination {...defaultProps} currentPage={1} />);
    fireEvent.click(screen.getByText('Next'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange when clicking Previous button', () => {
    render(<TraditionalPagination {...defaultProps} currentPage={2} />);
    fireEvent.click(screen.getByText('Previous'));
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageSizeChange when changing page size', () => {
    render(<TraditionalPagination {...defaultProps} />);
    fireEvent.change(screen.getByLabelText('Items per page:'), { target: { value: '20' } });
    expect(defaultProps.onPageSizeChange).toHaveBeenCalledWith(20);
  });

  it('handles jump to page submission', () => {
    render(<TraditionalPagination {...defaultProps} />);
    const input = screen.getByLabelText('Go to page:');
    const submitButton = screen.getByText('Go');
    
    fireEvent.change(input, { target: { value: '5' } });
    fireEvent.click(submitButton);
    
    expect(defaultProps.onPageChange).toHaveBeenCalledWith(5);
  });

  it('does not jump to invalid page numbers', () => {
    render(<TraditionalPagination {...defaultProps} totalItems={100} pageSize={10} />);
    const input = screen.getByLabelText('Go to page:');
    const submitButton = screen.getByText('Go');
    
    // Try jumping to page 0
    fireEvent.change(input, { target: { value: '0' } });
    fireEvent.click(submitButton);
    expect(defaultProps.onPageChange).not.toHaveBeenCalled();
    
    // Try jumping to page beyond total pages
    fireEvent.change(input, { target: { value: '20' } });
    fireEvent.click(submitButton);
    expect(defaultProps.onPageChange).not.toHaveBeenCalled();
  });

  it('shows loading state when isLoading is true', () => {
    render(<TraditionalPagination {...defaultProps} isLoading={true} />);
    
    // Buttons should be disabled
    expect(screen.getByText('Next')).toBeDisabled();
    
    // Page size selector should be disabled
    expect(screen.getByLabelText('Items per page:')).toBeDisabled();
    
    // Jump to page input should be disabled
    expect(screen.getByLabelText('Go to page:')).toBeDisabled();
  });

  it('renders ellipsis for large page ranges', () => {
    render(
      <TraditionalPagination 
        {...defaultProps} 
        totalItems={500} 
        pageSize={10} 
        currentPage={25} 
      />
    );
    
    // Should show ellipsis
    const ellipses = screen.getAllByText('...');
    expect(ellipses.length).toBeGreaterThan(0);
  });
}); 