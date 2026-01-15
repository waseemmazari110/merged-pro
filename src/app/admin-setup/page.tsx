'use client';

import { useState } from 'react';

export default function AdminSetupPage() {
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<any>(null);
  const [error, setError] = useState('');

  const handleSetup = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!secret.trim()) {
      setError('Please enter the setup secret');
      return;
    }

    setLoading(true);
    setError('');
    setResponse(null);

    try {
      const res = await fetch('/api/admin/setup', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${secret}`
        }
      });

      const data = await res.json();
      
      if (res.ok) {
        setResponse(data);
      } else {
        setError(data.error || 'Setup failed');
      }
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '20px',
    }}>
      <div style={{
        background: 'white',
        borderRadius: '10px',
        boxShadow: '0 20px 60px rgba(0, 0, 0, 0.3)',
        padding: '40px',
        maxWidth: '500px',
        width: '100%',
      }}>
        <h1 style={{ color: '#333', marginBottom: '10px', fontSize: '28px' }}>🔐 Admin Setup</h1>
        <p style={{ color: '#666', marginBottom: '30px', lineHeight: '1.6' }}>
          Create or verify the admin user account for the system.
        </p>

        <div style={{
          background: '#e7f3ff',
          border: '1px solid #b3d9ff',
          color: '#004085',
          padding: '12px 15px',
          borderRadius: '5px',
          fontSize: '13px',
          marginBottom: '20px',
          fontFamily: 'monospace',
        }}>
          <strong>Default Credentials:</strong><br />
          Email: cswaseem110@gmail.com<br />
          Password: Admin123
        </div>

        <form onSubmit={handleSetup} style={{ marginBottom: '20px' }}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{
              display: 'block',
              color: '#333',
              fontWeight: 500,
              marginBottom: '8px',
              fontSize: '14px',
            }}>
              Setup Secret (from environment):
            </label>
            <input
              type="password"
              value={secret}
              onChange={(e) => setSecret(e.target.value)}
              placeholder="Enter the setup secret token"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                fontFamily: 'monospace',
                boxSizing: 'border-box',
              }}
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '12px 20px',
              background: loading ? '#999' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'transform 0.2s',
            }}
            onMouseDown={(e) => !loading && (e.currentTarget.style.transform = 'translateY(2px)')}
            onMouseUp={(e) => !loading && (e.currentTarget.style.transform = 'translateY(0)')}
          >
            {loading ? 'Setting up...' : 'Setup Admin User'}
          </button>
        </form>

        {error && (
          <div style={{
            background: '#f8d7da',
            border: '1px solid #f5c6cb',
            color: '#721c24',
            padding: '12px 15px',
            borderRadius: '5px',
            fontSize: '13px',
            marginBottom: '20px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {error}
          </div>
        )}

        {response && (
          <div style={{
            background: '#d4edda',
            border: '1px solid #c3e6cb',
            color: '#155724',
            padding: '12px 15px',
            borderRadius: '5px',
            fontSize: '13px',
            fontFamily: 'monospace',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}>
            {JSON.stringify(response, null, 2)}
          </div>
        )}
      </div>
    </div>
  );
}
