// src/pages/api/login.js
export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return new Response(JSON.stringify({ error: 'Payload configuration invalid' }), { status: 400 });
    }

    const { username, password } = body;

    // Securely resolve remote handshake target string
    const wpTargetEndpoint = 'https://amcd.com.au';

    const wpResponse = await fetch(wpTargetEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ username, password }),
    });

    const data = await wpResponse.json().catch(() => null);

    if (!wpResponse.ok || !data) {
      return new Response(JSON.stringify({ 
        error: data?.message || `WordPress connection error status code: ${wpResponse.status}` 
      }), { status: wpResponse.status });
    }

    if (!data.token) {
      return new Response(JSON.stringify({ error: 'JWT parsing target skipped by host api.' }), { status: 502 });
    }

    // Set cookie state cleanly
    cookies.set('wp_jwt_token', data.token, {
      path: '/',
      httpOnly: true,
      secure: true, // Vercel is strictly HTTPS, keep true for production tracking
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7
    });

    return new Response(JSON.stringify({ success: true, user: data.user_display_name }), { status: 200 });

  } catch (err) {
    // Explicitly fallback message payload mapping
    return new Response(JSON.stringify({ 
      error: 'Vercel Serverless Internal Runtime Exception', 
      details: err.message 
    }), { status: 500 });
  }
};
