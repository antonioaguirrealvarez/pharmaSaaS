import React, { useState } from 'react';
import { createModuleLogger } from '../../lib/logger';

const logger = createModuleLogger('logger-test');

export default function LoggerTest() {
  const [message, setMessage] = useState('');
  const [level, setLevel] = useState<'error' | 'warn' | 'info' | 'debug'>('info');
  const [output, setOutput] = useState<string[]>([]);

  const handleLog = () => {
    const meta = { timestamp: new Date().toISOString() };
    
    switch (level) {
      case 'error':
        logger.error(message, meta);
        break;
      case 'warn':
        logger.warn(message, meta);
        break;
      case 'info':
        logger.info(message, meta);
        break;
      case 'debug':
        logger.debug(message, meta);
        break;
    }

    setOutput(prev => [...prev, `[${level.toUpperCase()}] ${message}`]);
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Logger Test</h1>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Message</label>
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="block w-full p-2 border rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Log Level</label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as typeof level)}
            className="block w-full p-2 border rounded"
          >
            <option value="error">Error</option>
            <option value="warn">Warning</option>
            <option value="info">Info</option>
            <option value="debug">Debug</option>
          </select>
        </div>

        <button
          onClick={handleLog}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Log Message
        </button>

        <div>
          <h3 className="font-semibold mb-2">Log Output:</h3>
          <pre className="bg-gray-100 p-4 rounded max-h-60 overflow-y-auto">
            {output.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))}
          </pre>
        </div>
      </div>
    </div>
  );
}