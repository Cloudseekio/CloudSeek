import type { ChangeEvent } from 'react';
import {
  useSafeState,
  useSafeEffect,
  useWindowSize,
  useLocalStorage,
  useMediaQuery,
  useOnlineStatus,
  useStandaloneMode,
  useScrollPosition,
  isBrowser
} from '../hooks/useSafeHooks';

/**
 * Example component that demonstrates the use of safe hooks
 */
export default function SafeHooksExample() {
  // Basic safe state usage
  const [count, setCount] = useSafeState(0);
  
  // Window size hook
  const windowSize = useWindowSize();
  
  // Local storage hook
  const [savedName, setSavedName] = useLocalStorage<string>('exampleName', '');
  
  // Media query hook
  const isLargeScreen = useMediaQuery('(min-width: 1024px)');
  const isDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  // Online status hook
  const isOnline = useOnlineStatus();
  
  // Standalone mode hook
  const isStandalone = useStandaloneMode();
  
  // Scroll position hook
  const scrollPosition = useScrollPosition();
  
  // Demonstrate safe effect
  useSafeEffect(() => {
    // This code will only run in browser environments
    console.log('Component mounted in browser environment');
    
    // Clean up function also only runs in browser environments
    return () => {
      console.log('Component unmounted in browser environment');
    };
  }, []);
  
  // Input change handler
  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setSavedName(e.target.value);
  };
  
  // Render environment info
  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Safe Hooks Demo</h1>
      
      <div className="grid gap-6 mb-8">
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Environment</h2>
          <p>Running in {isBrowser ? 'browser' : 'server'} environment</p>
        </section>
        
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Basic Counter</h2>
          <p className="mb-2">Count: {count}</p>
          <div className="flex gap-2">
            <button 
              onClick={() => setCount(c => c - 1)}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
              Decrease
            </button>
            <button 
              onClick={() => setCount(c => c + 1)}
              className="px-4 py-2 bg-green-500 text-white rounded"
            >
              Increase
            </button>
          </div>
        </section>
        
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Window Size</h2>
          <p>Width: {windowSize.width}px</p>
          <p>Height: {windowSize.height}px</p>
        </section>
        
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Local Storage</h2>
          <div className="mb-2">
            <label htmlFor="name" className="block mb-1">Your Name:</label>
            <input
              id="name"
              type="text"
              value={savedName}
              onChange={handleNameChange}
              className="w-full px-3 py-2 border rounded"
              placeholder="Enter your name"
            />
          </div>
          <p>Saved name: {savedName || '(none)'}</p>
          <p className="text-sm text-gray-600">
            This value persists across page refreshes
          </p>
        </section>
        
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Media Queries</h2>
          <p>Large screen: {isLargeScreen ? 'Yes' : 'No'}</p>
          <p>Dark mode: {isDarkMode ? 'Yes' : 'No'}</p>
        </section>
        
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Online Status</h2>
          <div className="flex items-center gap-2">
            <span 
              className={`inline-block w-3 h-3 rounded-full ${
                isOnline ? 'bg-green-500' : 'bg-red-500'
              }`}
            />
            {isOnline ? 'Online' : 'Offline'}
          </div>
        </section>
        
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">App Mode</h2>
          <p>
            Running in {isStandalone ? 'standalone (installed)' : 'browser'} mode
          </p>
        </section>
        
        <section className="border p-4 rounded-lg">
          <h2 className="text-xl font-semibold mb-2">Scroll Position</h2>
          <p>X: {scrollPosition.x}px</p>
          <p>Y: {scrollPosition.y}px</p>
        </section>
      </div>
      
      <div className="bg-gray-100 p-4 rounded">
        <h2 className="text-lg font-semibold mb-2">Implementation Notes</h2>
        <ul className="list-disc pl-5 space-y-1">
          <li>All hooks safely handle non-browser environments</li>
          <li>Effects only run in browser context</li>
          <li>Default values are provided for server rendering</li>
          <li>Browser APIs are checked before access</li>
          <li>Memory leaks are prevented with proper cleanup</li>
        </ul>
      </div>
    </div>
  );
} 