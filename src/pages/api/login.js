// src/pages/api/login.js

export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return new Response(JSON.stringify({ error: 'Missing username or password fields.' }), { status: 400 });
    }

    const { username, password } = body;
    
    // ✅ SWITCH THIS URL to your newly created cPanel subdomain endpoint!
    // Example: 'https://amcd.com.au'
    const wpTargetEndpoint = 'https://api.amcd.com.au/wp-json/jwt-auth/v1/token';

    console.log(`Routing handshake directly to unmapped destination: ${wpTargetEndpoint}`);

    const wpResponse = await fetch(wpTargetEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({ username, password }),
    });

    const rawText = await wpResponse.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      console.error("Vercel routing caught unexpected server text structure instead of JSON:", rawText);
      return new Response(JSON.stringify({ 
        error: 'The server route returned a webpage template instead of API data.',
        details: rawText.substring(0, 100)
      }), { status: 502 });
    }

    if (!wpResponse.ok || !data || !data.token) {
      return new Response(JSON.stringify({ error: data?.message || 'Invalid user login parameters.' }), { status: 401 });
    }

    // Save your authenticated tenant/agent session into a secure cookie
    cookies.set('wp_jwt_token', data.token, {
      path: '/',
      httpOnly: true,
      secure: true, 
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // Session locked for 7 days
    });

    return new Response(JSON.stringify({ success: true, user: data.user_display_name }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Serverless execution gateway timed out.', details: err.message }), { status: 500 });
  }
};
