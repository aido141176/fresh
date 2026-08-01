// src/pages/api/login.js
export const POST = async ({ request, cookies }) => {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return new Response(JSON.stringify({ error: 'Missing credentials' }), { status: 400 });
    }

    // Handshake with your live WordPress instance
    const wpResponse = await fetch('https://amcd.com.au', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });

    const data = await wpResponse.json();

    if (!wpResponse.ok) {
      return new Response(JSON.stringify({ error: data.message || 'Authentication failed' }), { 
        status: wpResponse.status 
      });
    }

    // Securely lock down the JWT token in an HTTP-Only cookie
    cookies.set('wp_jwt_token', data.token, {
      path: '/',
      httpOnly: true, // Prevents client-side JS from stealing the token
      secure: true,   // Mandates HTTPS
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // Cookie lives for 7 days
    });

    return new Response(JSON.stringify({ success: true, user: data.user_display_name }), { status: 200 });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Server error occurred' }), { status: 500 });
  }
};
