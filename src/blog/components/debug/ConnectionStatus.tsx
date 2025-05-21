import React, { useEffect, useState } from 'react';
import { getContentfulService } from '../../services/serviceFactory';
import { CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
}

interface ConnectionState {
  isConnected: boolean;
  lastChecked: number;
  responseTime: number;
  error?: string;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<ConnectionState>({
    isConnected: false,
    lastChecked: 0,
    responseTime: 0
  });
  const [isChecking, setIsChecking] = useState(false);

  const checkConnection = async () => {
    setIsChecking(true);
    const startTime = Date.now();
    
    try {
      const service = getContentfulService();
      const connectionStatus = await service.getConnectionStatus();
      
      setStatus({
        isConnected: connectionStatus.isConnected,
        lastChecked: Date.now(),
        responseTime: Date.now() - startTime,
        error: connectionStatus.error
      });
    } catch (error) {
      setStatus({
        isConnected: false,
        lastChecked: Date.now(),
        responseTime: Date.now() - startTime,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      });
    } finally {
      setIsChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Check every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
          Connection Status
        </h2>
        <button
          onClick={() => checkConnection()}
          disabled={isChecking}
          className={`p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 
            ${isChecking ? 'opacity-50 cursor-not-allowed' : ''}`}
          aria-label="Check connection status"
        >
          <RefreshCw className={`w-5 h-5 ${isChecking ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Status:</span>
          <div className="flex items-center">
            {status.isConnected ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                <span className="text-green-500">Connected</span>
              </>
            ) : (
              <>
                <XCircle className="w-5 h-5 text-red-500 mr-2" />
                <span className="text-red-500">Disconnected</span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Response Time:</span>
          <span className="font-mono">{status.responseTime}ms</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-gray-600 dark:text-gray-400">Last Checked:</span>
          <span className="font-mono">
            {status.lastChecked ? new Date(status.lastChecked).toLocaleTimeString() : 'Never'}
          </span>
        </div>

        {status.error && (
          <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
            {status.error}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionStatus; 