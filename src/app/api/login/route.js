import pool from '../../../app/db.js';

export async function POST(req) {
  const { username, password } = await req.json();

  try {
    const result = await pool.query(
      `SELECT ac.password_hash, up.first_name, up.last_name, up.user_type, ac.user_id
       FROM account_credentials ac
       JOIN user_profiles up ON ac.user_id = up.id
       WHERE ac.username = $1`,
      [username]
    );

    if (result.rows.length === 0 || result.rows[0].password_hash !== password) {
      return new Response(JSON.stringify({ error: 'Invalid username or password' }), { status: 401 });
    }

    const user = result.rows[0];

    return new Response(
      JSON.stringify({
        message: 'Login successful',
        user: {
          id: user.user_id,
          firstName: user.first_name,
          lastName: user.last_name,
          type: user.user_type,
          username,
        },
      }),
      { status: 200 }
    );
  } catch (err) {
    console.error('Login error:', err);
    return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}