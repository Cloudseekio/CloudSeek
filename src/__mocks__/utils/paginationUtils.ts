/**
 * Mock pagination utilities for testing
 */

export interface PaginationItem {
  type: 'page' | 'active' | 'ellipsis' | 'prev' | 'next' | 'first' | 'last';
  page: number | null;
  label: string;
}

/**
 * Generates an array of pagination items for testing
 */
export function generatePaginationItems(
  currentPage: number,
  totalPages: number,
  siblingCount: number = 1,
  showFirstLastButtons: boolean = false,
  showPrevNextButtons: boolean = true
): PaginationItem[] {
  const items: PaginationItem[] = [];
  
  // Add first page button if requested
  if (showFirstLastButtons && currentPage > 1) {
    items.push({ type: 'first', page: 1, label: 'First' });
  }
  
  // Add previous button if not on first page
  if (showPrevNextButtons && currentPage > 1) {
    items.push({ type: 'prev', page: currentPage - 1, label: 'Previous' });
  }
  
  // Calculate what pages to display
  const startPage = Math.max(1, currentPage - siblingCount);
  const endPage = Math.min(totalPages, currentPage + siblingCount);
  
  // Add leading ellipsis if needed
  if (startPage > 1) {
    items.push({ type: 'page', page: 1, label: '1' });
    if (startPage > 2) {
      items.push({ type: 'ellipsis', page: null, label: '...' });
    }
  }
  
  // Add page numbers
  for (let i = startPage; i <= endPage; i++) {
    items.push({
      type: i === currentPage ? 'active' : 'page',
      page: i,
      label: String(i)
    });
  }
  
  // Add trailing ellipsis if needed
  if (endPage < totalPages) {
    if (endPage < totalPages - 1) {
      items.push({ type: 'ellipsis', page: null, label: '...' });
    }
    items.push({ type: 'page', page: totalPages, label: String(totalPages) });
  }
  
  // Add next button if not on last page
  if (showPrevNextButtons && currentPage < totalPages) {
    items.push({ type: 'next', page: currentPage + 1, label: 'Next' });
  }
  
  // Add last page button if requested
  if (showFirstLastButtons && currentPage < totalPages) {
    items.push({ type: 'last', page: totalPages, label: 'Last' });
  }
  
  return items;
}

export function calculatePageBounds(currentPage: number, itemsPerPage: number, totalItems: number) {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);
  return { startItem, endItem };
}

export default {
  generatePaginationItems,
  calculatePageBounds
}; 