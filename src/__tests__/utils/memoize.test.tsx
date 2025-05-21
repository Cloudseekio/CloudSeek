import React, { useState } from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { useMemoDeep, useCallbackDeep, useStableItemKey } from '../../utils/memoize';

// Define an interface for the test window with our custom properties
interface TestWindow extends Window {
  latestCallback?: () => void;
  latestKeyFn?: (item: { id: number; name: string }) => number;
}

// Cast window to our extended interface
const testWindow = window as TestWindow;

describe('Memoization Utilities', () => {
  // Clear any global variables between tests
  afterEach(() => {
    delete testWindow.latestCallback;
    delete testWindow.latestKeyFn;
  });

  describe('useMemoDeep', () => {
    it('should only recompute when deps change deeply', () => {
      // Mock function to track execution
      const computeMock = jest.fn();

      // Test component that uses useMemoDeep
      const TestComponent = ({ obj }: { obj: { val: number } }) => {
        const memoizedValue = useMemoDeep(() => {
          computeMock();
          return `Value: ${obj.val}`;
        }, [obj]);

        return <div data-testid="result">{memoizedValue}</div>;
      };

      // Render the component
      const { rerender } = render(<TestComponent obj={{ val: 1 }} />);
      expect(screen.getByTestId('result')).toHaveTextContent('Value: 1');
      expect(computeMock).toHaveBeenCalledTimes(1);

      // Re-render with a new object but same value
      rerender(<TestComponent obj={{ val: 1 }} />);
      expect(computeMock).toHaveBeenCalledTimes(1); // Should not recompute

      // Re-render with a new value
      rerender(<TestComponent obj={{ val: 2 }} />);
      expect(computeMock).toHaveBeenCalledTimes(2); // Should recompute
      expect(screen.getByTestId('result')).toHaveTextContent('Value: 2');
    });
  });

  describe('useCallbackDeep', () => {
    it('should only recreate callback when deps change deeply', () => {
      // Test component using useCallbackDeep
      const TestComponent = ({ config }: { config: { id: string } }) => {
        const [count, setCount] = useState(0);
        
        // Create a memoized callback
        const handleClick = useCallbackDeep(() => {
          setCount(c => c + 1);
        }, [config]);

        // For testing: expose the function identity
        testWindow.latestCallback = handleClick;
        
        return (
          <div>
            <button data-testid="button" onClick={handleClick}>
              Click me ({config.id})
            </button>
            <div data-testid="count">{count}</div>
          </div>
        );
      };

      // Initial render
      const { rerender } = render(<TestComponent config={{ id: 'test1' }} />);
      const firstCallback = testWindow.latestCallback;
      
      // Re-render with same deep value
      rerender(<TestComponent config={{ id: 'test1' }} />);
      const secondCallback = testWindow.latestCallback;
      expect(secondCallback).toBe(firstCallback); // Same reference
      
      // Re-render with different value
      rerender(<TestComponent config={{ id: 'test2' }} />);
      const thirdCallback = testWindow.latestCallback;
      expect(thirdCallback).not.toBe(firstCallback); // Different reference
      
      // Verify the callback works
      fireEvent.click(screen.getByTestId('button'));
      expect(screen.getByTestId('count')).toHaveTextContent('1');
    });
  });

  describe('useStableItemKey', () => {
    it('should return a stable key extraction function', () => {
      // Define item type
      type TestItem = { id: number; name: string };
      
      // Mock key extraction function
      const keyExtractorMock = jest.fn((item: TestItem) => item.id);
      
      // Test component using useStableItemKey
      const TestComponent = ({ items }: { items: TestItem[] }) => {
        const getItemKey = useStableItemKey<TestItem, number>(keyExtractorMock);
        
        // For testing: expose the function identity
        testWindow.latestKeyFn = getItemKey;
        
        return (
          <ul>
            {items.map(item => (
              <li key={getItemKey(item)} data-testid={`item-${item.id}`}>
                {item.name}
              </li>
            ))}
          </ul>
        );
      };
      
      // Initial render
      const initialItems = [
        { id: 1, name: 'Item 1' },
        { id: 2, name: 'Item 2' }
      ];
      
      const { rerender } = render(<TestComponent items={initialItems} />);
      const firstKeyFn = testWindow.latestKeyFn;
      
      // Verify items are rendered
      expect(screen.getByTestId('item-1')).toHaveTextContent('Item 1');
      expect(screen.getByTestId('item-2')).toHaveTextContent('Item 2');
      
      // Re-render with new items
      const newItems = [
        { id: 1, name: 'Item 1 Updated' },
        { id: 2, name: 'Item 2 Updated' },
        { id: 3, name: 'Item 3' }
      ];
      
      rerender(<TestComponent items={newItems} />);
      const secondKeyFn = testWindow.latestKeyFn;
      
      // Function reference should be stable
      expect(secondKeyFn).toBe(firstKeyFn);
      
      // Verify updated items are rendered
      expect(screen.getByTestId('item-1')).toHaveTextContent('Item 1 Updated');
      expect(screen.getByTestId('item-2')).toHaveTextContent('Item 2 Updated');
      expect(screen.getByTestId('item-3')).toHaveTextContent('Item 3');
    });
  });
}); 