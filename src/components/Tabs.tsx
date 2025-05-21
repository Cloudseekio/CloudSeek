import React, { useState, ReactNode } from 'react';

interface TabsProps {
  activeTab: number;
  onChange: (index: number) => void;
  children: ReactNode;
}

interface TabListProps {
  children: ReactNode;
}

interface TabProps {
  children: ReactNode;
}

interface TabPanelProps {
  children: ReactNode;
}

export const Tabs: React.FC<TabsProps> = ({ activeTab, onChange, children }) => {
  const tabs: ReactNode[] = [];
  const panels: ReactNode[] = [];
  
  React.Children.forEach(children, (child) => {
    if (React.isValidElement(child)) {
      if (child.type === TabList) {
        tabs.push(child);
      } else if (child.type === TabPanel) {
        panels.push(child);
      }
    }
  });
  
  return (
    <div className="tabs">
      {tabs}
      {React.Children.toArray(panels)[activeTab]}
    </div>
  );
};

export const TabList: React.FC<TabListProps> = ({ children }) => {
  return (
    <div className="flex border-b border-gray-200 dark:border-gray-700 mb-4">
      {React.Children.map(children, (child, index) => {
        if (React.isValidElement(child) && child.type === Tab) {
          return React.cloneElement(child as React.ReactElement<any>, { index });
        }
        return child;
      })}
    </div>
  );
};

export const Tab: React.FC<TabProps & { index?: number }> = ({ children, index }) => {
  // Get the activeTab and onChange from the closest Tabs ancestor
  const context = React.useContext(TabContext);
  
  if (context === null || typeof index !== 'number') {
    return <div>{children}</div>;
  }
  
  const { activeTab, onChange } = context;
  const isActive = activeTab === index;
  
  return (
    <button
      className={`py-2 px-4 font-medium text-sm focus:outline-none ${
        isActive 
          ? 'text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400' 
          : 'text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300'
      }`}
      onClick={() => onChange(index)}
    >
      {children}
    </button>
  );
};

export const TabPanel: React.FC<TabPanelProps> = ({ children }) => {
  return <div className="tab-panel">{children}</div>;
};

// Create a context to pass activeTab and onChange down to Tab components
const TabContext = React.createContext<{ activeTab: number; onChange: (index: number) => void } | null>(null);

// Wrap the Tabs component to provide context
const TabsWithContext: React.FC<TabsProps> = (props) => {
  return (
    <TabContext.Provider value={{ activeTab: props.activeTab, onChange: props.onChange }}>
      <Tabs {...props} />
    </TabContext.Provider>
  );
};

export { TabsWithContext as Tabs };
export default TabsWithContext; 