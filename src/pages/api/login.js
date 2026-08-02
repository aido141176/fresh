// src/pages/api/login.js

export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return new Response(JSON.stringify({ error: 'Missing username or password fields.' }), { status: 400 });
    }

    const { username, password } = body;

    // Options mapping matching your successful browser dashboard link test exactly
    const options = {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    };

    // Target the specific token endpoint on your active api subdomain
    const wpTargetEndpoint = 'https://amcd.com.au';

    const wpResponse = await fetch(wpTargetEndpoint, options);
    const data = await wpResponse.json().catch(() => null);

    if (!wpResponse.ok || !data || !data.token) {
      return new Response(JSON.stringify({ 
        error: data?.message || 'Authentication rejected by WordPress.' 
      }), { status: wpResponse.status || 401 });
    }

    // Save the valid token string into an HTTP-only browser cookie
    cookies.set('wp_jwt_token', data.token, {
      path: '/',
      httpOnly: true,
      secure: true, 
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // Logged in for 7 days
    });

    return new Response(JSON.stringify({ 
      success: true, 
      user: data.user_display_name 
    }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ 
      error: 'Internal handler crash.', 
      details: err.message 
    }), { status: 500 });
  }
};
