import { redirect } from 'next/navigation';

export default function AdminSetupPage() {
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
        }}>
          <strong>Default Credentials:</strong><br />
          Email: cswaseem110@gmail.com<br />
          Password: Admin123
        </div>

        <form onSubmit={(e) => {
          e.preventDefault();
          const secret = (e.target as any).secret.value.trim();
          if (!secret) {
            alert('Please enter the setup secret');
            return;
          }
          fetch('/api/admin/setup', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${secret}`
            }
          }).then(r => r.json()).then(data => {
            alert(JSON.stringify(data, null, 2));
          }).catch(e => {
            alert(`Error: ${e.message}`);
          });
        }}>
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
              name="secret"
              placeholder="Enter the setup secret token"
              style={{
                width: '100%',
                padding: '12px 15px',
                border: '1px solid #ddd',
                borderRadius: '5px',
                fontSize: '14px',
                fontFamily: 'monospace',
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '12px 20px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            Setup Admin User
          </button>
        </form>
      </div>
    </div>
  );
}
