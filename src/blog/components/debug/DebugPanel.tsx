import React, { useState } from 'react';
import { Tabs, TabList, Tab, TabPanel } from '../../../components/Tabs';
import {
  ConnectionStatus,
  ServiceHealthDebug,
  ContentfulCacheDebug,
  ErrorHistory,
  ContentfulDebugEnhanced
} from './';

/**
 * Props for the DebugPanel component
 */
interface DebugPanelProps {
  className?: string;
  initialTab?: number;
}

/**
 * Debug Panel component that consolidates all debugging tools
 * Implemented as a functional component
 */
const DebugPanel: React.FC<DebugPanelProps> = ({ className = '', initialTab = 0 }) => {
  const [activeTab, setActiveTab] = useState(initialTab);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 ${className}`}>
      <h2 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Debug Panel</h2>
      
      <Tabs activeTab={activeTab} onChange={setActiveTab}>
        <TabList>
          <Tab>Connection Status</Tab>
          <Tab>Service Health</Tab>
          <Tab>Cache Monitor</Tab>
          <Tab>Contentful Debug</Tab>
          <Tab>Error History</Tab>
        </TabList>

        <TabPanel>
          <ConnectionStatus />
        </TabPanel>

        <TabPanel>
          <ServiceHealthDebug showDetails />
        </TabPanel>

        <TabPanel>
          <ContentfulCacheDebug />
        </TabPanel>

        <TabPanel>
          <ContentfulDebugEnhanced />
        </TabPanel>

        <TabPanel>
          <ErrorHistory />
        </TabPanel>
      </Tabs>
    </div>
  );
};

export default DebugPanel; 