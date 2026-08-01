// src/pages/api/login.js

export const POST = async ({ request, cookies }) => {
  try {
    const body = await request.json().catch(() => null);
    if (!body || !body.username || !body.password) {
      return new Response(JSON.stringify({ error: 'Missing username or password fields.' }), { status: 400 });
    }

    const { username, password } = body;
    const wpTargetEndpoint = 'https://amcd.com.au';

    const wpResponse = await fetch(wpTargetEndpoint, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        // Forces a clean web browser signature to bypass automated web host firewalls
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36'
      },
      body: JSON.stringify({ username, password }),
    });

    const rawText = await wpResponse.text();

    let data;
    try {
      data = JSON.parse(rawText);
    } catch (e) {
      // Captures the raw HTML firewall webpage to print directly inside your Vercel logs
      console.error("FIREWALL ROADBLOCK DETECTED. RAW REJECTION HTML:", rawText);
      return new Response(JSON.stringify({ 
        error: 'Your WordPress web host firewall dropped Vercel\'s connection request.',
        details: rawText.substring(0, 120)
      }), { status: 502 });
    }

    if (!wpResponse.ok || !data || !data.token) {
      return new Response(JSON.stringify({ error: data?.message || 'Invalid user credentials.' }), { status: 401 });
    }

    cookies.set('wp_jwt_token', data.token, {
      path: '/',
      httpOnly: true,
      secure: true, 
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7 // 7 days duration
    });

    return new Response(JSON.stringify({ success: true, user: data.user_display_name }), { status: 200 });

  } catch (err) {
    return new Response(JSON.stringify({ error: 'Serverless function exception.', details: err.message }), { status: 500 });
  }
};
