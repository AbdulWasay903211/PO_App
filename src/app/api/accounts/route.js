import { NextResponse } from "next/server";
import pool from "../../../app/db.js";
import bcrypt from "bcryptjs";

/* =====================================================
   GET — Fetch all accounts
===================================================== */
export async function GET() {
  try {
    console.log("Fetching accounts from DB...");

    const result = await pool.query(
      `SELECT 
        account_credentials.id AS account_id,
        user_profiles.id AS user_id,
        user_profiles.first_name,
        user_profiles.last_name,
        user_profiles.user_type,
        account_credentials.email
      FROM account_credentials
      JOIN user_profiles 
      ON account_credentials.user_id = user_profiles.id`
    );

    console.log("Query successful:", result.rows.length, "rows");
    return new Response(JSON.stringify(result.rows), { status: 200 });

  } catch (error) {
    console.error("Error fetching accounts:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  }
}

/* =====================================================
   POST — Create account
===================================================== */
export async function POST(req) {
  console.log("📥 POST /api/accounts called");

  try {
    const body = await req.json();
    console.log("📝 Request Body:", body);

    const {
      first_name,
      last_name,
      username,
      email,
      password,
      user_type,
    } = body;

    console.log("🧪 Validating fields...");
    if (!first_name || !last_name || !username || !email || !password || !user_type) {
      console.log("❌ Missing required fields");
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // 1️⃣ HASH PASSWORD BEFORE SAVING
    console.log("🔐 Hashing password...");
    const passwordHash = await bcrypt.hash(password, 10);

    // 2️⃣ INSERT → user_profiles
    console.log("➡️ Inserting into user_profiles...");
    const userProfile = await pool.query(
      `INSERT INTO user_profiles (first_name, last_name, user_type)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [first_name, last_name, user_type]
    );

    const newUserId = userProfile.rows[0].id;
    console.log("✅ user_profiles insert success — New ID:", newUserId);

    // 3️⃣ INSERT → account_credentials WITH HASH
    console.log("➡️ Inserting into account_credentials...");
    console.log("INSERT VALUES:", { newUserId, username, email });

    await pool.query(
      `INSERT INTO account_credentials (user_id, username, email, password_hash)
       VALUES ($1, $2, $3, $4)`,
      [newUserId, username, email, passwordHash]  // <-- hashed password here
    );

    console.log("✅ account_credentials insert success");

    return NextResponse.json(
      {
        message: "Account created successfully",
        user_id: newUserId,
      },
      { status: 201 }
    );

  } catch (error) {
    console.error("🔥 ERROR in POST /api/accounts");
    console.error("PostgreSQL Error:", error);

    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}

/* =====================================================
   DELETE — Delete account by account_credentials.id
===================================================== */
export async function DELETE(req) {
  console.log("\n====== DELETE /api/accounts START ======");

  try {
    const bodyText = await req.text();
    console.log("Raw body received:", bodyText);

    let body;
    try {
      body = JSON.parse(bodyText);
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      return new Response(
        JSON.stringify({ error: "Invalid JSON in request body" }),
        { status: 400 }
      );
    }

    console.log("Parsed body:", body);

    const { user_id } = body;
    console.log("Extracted user_id:", user_id);

    if (!user_id) {
      console.error("❌ Missing user_id in request");
      return new Response(JSON.stringify({ error: "Missing user_id" }), {
        status: 400,
      });
    }

    console.log("Running SQL DELETE for user_id:", user_id);

    const result = await pool.query(
      "DELETE FROM user_profiles WHERE id = $1 RETURNING id",
      [user_id]
    );

    console.log("SQL Result:", result);

    if (result.rowCount === 0) {
      console.error("❌ No user found with user_id:", user_id);
      return new Response(JSON.stringify({ error: "User not found" }), {
        status: 404,
      });
    }

    console.log("✔ Successful delete for user_id:", user_id);

    return new Response(
      JSON.stringify({ message: "Account deleted successfully", user_id }),
      { status: 200 }
    );

  } catch (error) {
    console.error("🔥 UNEXPECTED ERROR in DELETE API:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
    });
  } finally {
    console.log("====== DELETE /api/accounts END ======\n");
  }
}

