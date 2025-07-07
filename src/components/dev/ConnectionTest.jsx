import React, { useState } from 'react';

const ConnectionTest = () => {
  const [testResult, setTestResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setTestResult('Testing connection...');

    try {
      const response = await fetch('https://nextgame.onrender.com/health');
      const data = await response.json();
      setTestResult(`✅ Connection successful! Server response: ${JSON.stringify(data)}`);
    } catch (error) {
      console.error('Connection test error:', error);
      setTestResult(`❌ Connection failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testAdminLogin = async () => {
    setLoading(true);
    setTestResult('Testing admin login...');

    try {
      const response = await fetch('https://nextgame.onrender.com/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: 'superadmin',
          password: 'SuperAdmin123!'
        })
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTestResult(`✅ Admin login successful! Response: ${JSON.stringify(data)}`);
      } else {
        setTestResult(`❌ Admin login failed: ${data.message || 'Unknown error'}`);
      }
    } catch (error) {
      console.error('Admin login test error:', error);
      setTestResult(`❌ Admin login test failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-md">
      <div className="flex">
        <div className="flex-shrink-0">
          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <h3 className="text-sm font-medium text-blue-800">
            Connection Test (Development Only)
          </h3>
          <div className="mt-2 space-y-2">
            <button
              onClick={testConnection}
              disabled={loading}
              className="btn-secondary text-xs px-3 py-1 mr-2"
            >
              Test Server Connection
            </button>
            <button
              onClick={testAdminLogin}
              disabled={loading}
              className="btn-secondary text-xs px-3 py-1"
            >
              Test Admin Login
            </button>
            {testResult && (
              <div className="mt-2 text-xs text-blue-700 bg-white p-2 rounded border">
                <pre className="whitespace-pre-wrap">{testResult}</pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConnectionTest; 