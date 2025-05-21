import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from 'react';

type KeyCombo = string | string[]; // e.g. 'ctrl+k' or ['ctrl+k', 'meta+k']
type KeyHandler = (e: KeyboardEvent) => void;

interface KeyboardShortcut {
  id: string;
  keys: KeyCombo;
  handler: KeyHandler;
  description?: string;
  allowInInputs?: boolean;
  disabled?: boolean;
  global?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

interface KeyboardContextType {
  registerShortcut: (shortcut: Omit<KeyboardShortcut, 'id'>) => string;
  unregisterShortcut: (id: string) => void;
  updateShortcut: (id: string, updates: Partial<Omit<KeyboardShortcut, 'id'>>) => void;
  triggerShortcut: (id: string) => void;
  getRegisteredShortcuts: () => KeyboardShortcut[];
  enableShortcut: (id: string) => void;
  disableShortcut: (id: string) => void;
  setGlobalEnabled: (enabled: boolean) => void;
}

const KeyboardContext = createContext<KeyboardContextType | null>(null);

/**
 * Parse a keyboard shortcut string into individual keys
 * Examples: "ctrl+k", "shift+a", "meta+shift+z"
 */
function parseKeyCombo(combo: string): { key: string; ctrl: boolean; shift: boolean; alt: boolean; meta: boolean } {
  const parts = combo.toLowerCase().split('+');
  
  // The last part is always the key
  const key = parts[parts.length - 1];
  
  return {
    key,
    ctrl: parts.includes('ctrl') || parts.includes('control'),
    shift: parts.includes('shift'),
    alt: parts.includes('alt'),
    meta: parts.includes('meta') || parts.includes('cmd') || parts.includes('command'),
  };
}

/**
 * Check if a keyboard event matches a key combo
 */
function matchesKeyCombo(event: KeyboardEvent, combo: string): boolean {
  const { key, ctrl, shift, alt, meta } = parseKeyCombo(combo);
  
  // Check if the key matches (case insensitive)
  const keyMatches = event.key.toLowerCase() === key || 
                    event.code.toLowerCase() === key;
  
  // Check if modifiers match
  const modifiersMatch = event.ctrlKey === ctrl &&
                         event.shiftKey === shift &&
                         event.altKey === alt &&
                         event.metaKey === meta;
  
  return keyMatches && modifiersMatch;
}

/**
 * Convert a key combo to a display-friendly format
 */
export function formatKeyCombo(combo: string): string {
  const { key, ctrl, shift, alt, meta } = parseKeyCombo(combo);
  
  const parts = [];
  if (ctrl) parts.push('Ctrl');
  if (shift) parts.push('Shift');
  if (alt) parts.push('Alt');
  if (meta) parts.push(navigator.platform.includes('Mac') ? '⌘' : 'Win');
  
  // Format the key nicely
  let formattedKey = key;
  if (key === 'arrowup') formattedKey = '↑';
  else if (key === 'arrowdown') formattedKey = '↓';
  else if (key === 'arrowleft') formattedKey = '←';
  else if (key === 'arrowright') formattedKey = '→';
  else if (key === 'escape') formattedKey = 'Esc';
  else if (key.length === 1) formattedKey = key.toUpperCase();
  
  parts.push(formattedKey);
  return parts.join('+');
}

export const KeyboardProvider: React.FC<{
  children: React.ReactNode;
  enabled?: boolean;
}> = ({ children, enabled = true }) => {
  const [shortcuts, setShortcuts] = useState<KeyboardShortcut[]>([]);
  const [globalEnabled, setGlobalEnabled] = useState(enabled);
  const lastId = useRef(0);
  
  // Generate a unique ID for each shortcut
  const generateId = useCallback(() => {
    lastId.current += 1;
    return `shortcut-${lastId.current}`;
  }, []);
  
  // Register a new keyboard shortcut
  const registerShortcut = useCallback((shortcut: Omit<KeyboardShortcut, 'id'>): string => {
    const id = generateId();
    setShortcuts(prev => [...prev, { ...shortcut, id }]);
    return id;
  }, [generateId]);
  
  // Unregister a keyboard shortcut
  const unregisterShortcut = useCallback((id: string) => {
    setShortcuts(prev => prev.filter(s => s.id !== id));
  }, []);
  
  // Update an existing shortcut
  const updateShortcut = useCallback((id: string, updates: Partial<Omit<KeyboardShortcut, 'id'>>) => {
    setShortcuts(prev => prev.map(s => 
      s.id === id ? { ...s, ...updates } : s
    ));
  }, []);
  
  // Enable a shortcut
  const enableShortcut = useCallback((id: string) => {
    updateShortcut(id, { disabled: false });
  }, [updateShortcut]);
  
  // Disable a shortcut
  const disableShortcut = useCallback((id: string) => {
    updateShortcut(id, { disabled: true });
  }, [updateShortcut]);
  
  // Manually trigger a shortcut
  const triggerShortcut = useCallback((id: string) => {
    const shortcut = shortcuts.find(s => s.id === id);
    if (shortcut && !shortcut.disabled) {
      shortcut.handler(new KeyboardEvent('keydown'));
    }
  }, [shortcuts]);
  
  // Get all registered shortcuts
  const getRegisteredShortcuts = useCallback(() => {
    return shortcuts;
  }, [shortcuts]);
  
  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't run shortcuts when globally disabled
      if (!globalEnabled) return;
      
      // Skip if the active element is an input element and the shortcut doesn't allow it
      const isInput = event.target instanceof HTMLInputElement ||
                      event.target instanceof HTMLTextAreaElement || 
                      (event.target as HTMLElement)?.isContentEditable;
      
      for (const shortcut of shortcuts) {
        // Skip disabled shortcuts
        if (shortcut.disabled) continue;
        
        // Skip shortcuts that don't allow inputs when we're in an input
        if (isInput && !shortcut.allowInInputs) continue;
        
        // Check if the key combo matches
        const keyMatches = typeof shortcut.keys === 'string'
          ? matchesKeyCombo(event, shortcut.keys)
          : shortcut.keys.some(combo => matchesKeyCombo(event, combo));
        
        if (keyMatches) {
          if (shortcut.preventDefault !== false) {
            event.preventDefault();
          }
          
          if (shortcut.stopPropagation) {
            event.stopPropagation();
          }
          
          shortcut.handler(event);
          break; // Only trigger one shortcut per keydown
        }
      }
    };
    
    // Add the event listener to window
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [shortcuts, globalEnabled]);
  
  const contextValue: KeyboardContextType = {
    registerShortcut,
    unregisterShortcut,
    updateShortcut,
    triggerShortcut,
    getRegisteredShortcuts,
    enableShortcut,
    disableShortcut,
    setGlobalEnabled,
  };
  
  return (
    <KeyboardContext.Provider value={contextValue}>
      {children}
    </KeyboardContext.Provider>
  );
};

export function useKeyboardShortcuts() {
  const context = useContext(KeyboardContext);
  if (!context) {
    throw new Error("useKeyboardShortcuts must be used within a KeyboardProvider");
  }
  return context;
}

/**
 * Hook to easily register a keyboard shortcut
 */
export function useShortcut(
  keys: KeyCombo,
  handler: KeyHandler,
  options: {
    description?: string;
    allowInInputs?: boolean;
    disabled?: boolean;
    global?: boolean;
    preventDefault?: boolean;
    stopPropagation?: boolean;
  } = {}
) {
  const { registerShortcut, unregisterShortcut } = useKeyboardShortcuts();
  
  // Register the shortcut on mount, unregister on unmount
  useEffect(() => {
    const id = registerShortcut({
      keys,
      handler,
      ...options
    });
    
    return () => {
      unregisterShortcut(id);
    };
  }, [registerShortcut, unregisterShortcut, keys, handler, options]);
} 