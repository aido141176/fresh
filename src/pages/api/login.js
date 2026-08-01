// src/pages/api/login.js

export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return new Response(JSON.stringify({ error: 'Payload configuration invalid' }), { status: 400 });
    }

    const { username, password } = body;
    
    // Aligned directly with your verified plugin base path route
    const wpTargetEndpoint = 'https://amcd.com.au';

    const wpResponse = await fetch(wpTargetEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Sets a browser string profile to bypass host firewall blocks
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({ username, password }),
    });

    const rawText = await wpResponse.text();
    console.log("RAW WORDPRESS BACKEND RESPONSE:", rawText);

    let data = null;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      // If your server still drops the request, this catches the HTML text output
      return new Response(JSON.stringify({ 
        error: 'WordPress sent back non-JSON text output.', 
        details: rawText.substring(0, 150)
      }), { status: 502 });
    }

    if (!wpResponse.ok || data.data?.status === 403) {
      return new Response(JSON.stringify({ 
        error: data.message || 'Invalid username or password credentials.' 
      }), { status: 401 });
    }

    if (data && data.token) {
      // Save your user token inside a secure HTTP-only browser cookie
      cookies.set('wp_jwt_token', data.token, {
        path: '/',
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7 // Cookie remains valid for 7 days
      });

      return new Response(JSON.stringify({ success: true, user: data.user_display_name }), { status: 200 });
    }

    return new Response(JSON.stringify({ error: 'Authentication payload missing token key parameter.' }), { status: 500 });

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: 'Vercel Serverless Function Crash Exception', 
      details: err.message 
    }), { status: 500 });
  }
};
