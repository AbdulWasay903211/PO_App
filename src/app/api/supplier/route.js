import pool from "../../../app/db.js";

/* ================================
   GET ALL SUPPLIERS
================================ */
export async function GET() {
  try {
    const result = await pool.query("SELECT * FROM suppliers ORDER BY id");
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to fetch suppliers" }),
      { status: 500 }
    );
  }
}

/* ================================
   CREATE SUPPLIER
================================ */
export async function POST(req) {
  try {
    const { name, unit_of_measurement } = await req.json();

    const result = await pool.query(
      `INSERT INTO suppliers (name, unit_of_measurement)
       VALUES ($1, $2)
       RETURNING *`,
      [name, unit_of_measurement]
    );

    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(
      JSON.stringify({ error: "Failed to add supplier" }),
      { status: 500 }
    );
  }
}

/* ================================
   DELETE SUPPLIER
================================ */
export async function DELETE(req) {
  try {
    const { id } = await req.json();

    if (!id) {
      return new Response(
        JSON.stringify({ error: "Supplier ID is required" }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      "DELETE FROM suppliers WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: "Supplier not found" }),
        { status: 404 }
      );
    }

    return new Response(
      JSON.stringify({ message: "Supplier deleted successfully" }),
      { status: 200 }
    );
  } catch (err) {
    console.error("Error deleting supplier:", err);
    return new Response(
      JSON.stringify({ error: "Failed to delete supplier" }),
      { status: 500 }
    );
  }
}

/* ================================
   UPDATE SUPPLIER
================================ */
export async function PUT(req) {
  try {
    const { id, name, unit_of_measurement } = await req.json();

    if (!id || !name || !unit_of_measurement) {
      return new Response(
        JSON.stringify({ error: "All fields are required for update" }),
        { status: 400 }
      );
    }

    const result = await pool.query(
      `UPDATE suppliers
       SET name = $1, unit_of_measurement = $2
       WHERE id = $3
       RETURNING *`,
      [name, unit_of_measurement, id]
    );

    if (result.rowCount === 0) {
      return new Response(
        JSON.stringify({ error: "Supplier not found" }),
        { status: 404 }
      );
    }

    return new Response(JSON.stringify(result.rows[0]), { status: 200 });
  } catch (err) {
    console.error("Error updating supplier:", err);
    return new Response(
      JSON.stringify({ error: "Failed to update supplier" }),
      { status: 500 }
    );
  }
}
