import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Admin Setup</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .container {
            background: white;
            border-radius: 10px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
            padding: 40px;
            max-width: 500px;
            width: 100%;
        }
        h1 {
            color: #333;
            margin-bottom: 10px;
            font-size: 28px;
        }
        p {
            color: #666;
            margin-bottom: 30px;
            line-height: 1.6;
        }
        .form-group {
            margin-bottom: 20px;
        }
        label {
            display: block;
            color: #333;
            font-weight: 500;
            margin-bottom: 8px;
            font-size: 14px;
        }
        input {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 5px;
            font-size: 14px;
            font-family: monospace;
            transition: border-color 0.3s;
        }
        input:focus {
            outline: none;
            border-color: #667eea;
            box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
        }
        button {
            width: 100%;
            padding: 12px 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
            border-radius: 5px;
            font-size: 16px;
            font-weight: 600;
            cursor: pointer;
            transition: transform 0.2s, box-shadow 0.2s;
        }
        button:hover {
            transform: translateY(-2px);
            box-shadow: 0 10px 20px rgba(102, 126, 234, 0.3);
        }
        button:active {
            transform: translateY(0);
        }
        .response {
            margin-top: 30px;
            padding: 20px;
            border-radius: 5px;
            display: none;
            font-family: monospace;
            font-size: 13px;
            line-height: 1.6;
            white-space: pre-wrap;
            word-break: break-all;
        }
        .response.success {
            background: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
            display: block;
        }
        .response.error {
            background: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
            display: block;
        }
        .loading {
            display: none;
            text-align: center;
            color: #667eea;
            margin-top: 10px;
        }
        .spinner {
            border: 3px solid #f3f3f3;
            border-top: 3px solid #667eea;
            border-radius: 50%;
            width: 20px;
            height: 20px;
            animation: spin 1s linear infinite;
            display: inline-block;
            margin-right: 10px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        .info {
            background: #e7f3ff;
            border: 1px solid #b3d9ff;
            color: #004085;
            padding: 12px 15px;
            border-radius: 5px;
            font-size: 13px;
            margin-bottom: 20px;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>🔐 Admin Setup</h1>
        <p>Create or verify the admin user account for the system.</p>
        
        <div class="info">
            <strong>Default Credentials:</strong><br>
            Email: cswaseem110@gmail.com<br>
            Password: Admin123
        </div>

        <div class="form-group">
            <label for="secret">Setup Secret (from environment):</label>
            <input type="password" id="secret" placeholder="Enter the setup secret token">
        </div>

        <button onclick="setupAdmin()">Setup Admin User</button>

        <div class="loading" id="loading">
            <div class="spinner"></div>
            Setting up admin...
        </div>

        <div class="response" id="response"></div>
    </div>

    <script>
        async function setupAdmin() {
            const secret = document.getElementById('secret').value.trim();
            const responseDiv = document.getElementById('response');
            const loadingDiv = document.getElementById('loading');

            if (!secret) {
                responseDiv.textContent = 'Error: Please enter the setup secret';
                responseDiv.className = 'response error';
                return;
            }

            loadingDiv.style.display = 'block';
            responseDiv.className = 'response';
            responseDiv.textContent = '';

            try {
                const response = await fetch('/api/admin/setup', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': \`Bearer \${secret}\`
                    }
                });

                const data = await response.json();
                loadingDiv.style.display = 'none';

                if (response.ok) {
                    responseDiv.className = 'response success';
                    responseDiv.textContent = JSON.stringify(data, null, 2);
                } else {
                    responseDiv.className = 'response error';
                    responseDiv.textContent = JSON.stringify(data, null, 2);
                }
            } catch (error) {
                loadingDiv.style.display = 'none';
                responseDiv.className = 'response error';
                responseDiv.textContent = \`Error: \${error.message}\`;
            }
        }

        // Check status on page load
        async function checkStatus() {
            try {
                const secret = prompt('Enter the setup secret (or leave blank to skip):');
                if (!secret) return;

                const response = await fetch('/api/admin/setup', {
                    method: 'GET',
                    headers: {
                        'Authorization': \`Bearer \${secret}\`
                    }
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log('Admin status:', data);
                }
            } catch (error) {
                console.error('Status check failed:', error);
            }
        }

        // Allow Enter key to submit
        document.getElementById('secret').addEventListener('keypress', function(event) {
            if (event.key === 'Enter') {
                setupAdmin();
            }
        });
    </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  });
}
