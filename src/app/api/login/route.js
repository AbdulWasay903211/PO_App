import pool from '../../../app/db.js';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

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

    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    const user = result.rows[0];

    // 🔐 Compare password with bcrypt hash
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid username or password' }, { status: 401 });
    }

    // ✅ Login successful — include user_type
    return NextResponse.json({
      message: 'Login successful',
      user: {
        id: user.user_id,
        firstName: user.first_name,
        lastName: user.last_name,
        username,
        user_type: user.user_type, // <-- important for dashboard/sidebar
      },
    }, { status: 200 });

  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}
