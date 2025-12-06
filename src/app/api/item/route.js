import pool from "../../../app/db.js";

export async function GET() {
  try {
    const result = await pool.query(`
      SELECT items.id, items.name, items.price_per_unit, items.supplier_id, suppliers.name AS supplier_name
      FROM items
      JOIN suppliers ON items.supplier_id = suppliers.id
      ORDER BY items.id
    `);
    return new Response(JSON.stringify(result.rows), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to fetch items" }), { status: 500 });
  }
}

export async function POST(req) {
  try {
    const { name, price_per_unit, supplier_id } = await req.json();
    const result = await pool.query(
      "INSERT INTO items (name, price_per_unit, supplier_id) VALUES ($1, $2, $3) RETURNING *",
      [name, price_per_unit, supplier_id]
    );
    return new Response(JSON.stringify(result.rows[0]), { status: 201 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to add item" }), { status: 500 });
  }
}

export async function DELETE(req) {
  try {
    const { id } = await req.json();
    await pool.query("DELETE FROM items WHERE id = $1", [id]);
    return new Response(JSON.stringify({ success: true }), { status: 200 });
  } catch (err) {
    console.error(err);
    return new Response(JSON.stringify({ error: "Failed to delete item" }), { status: 500 });
  }
}
