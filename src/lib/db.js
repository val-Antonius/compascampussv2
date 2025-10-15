import mysql from 'mysql2/promise';

// Koneksi database
const db = mysql.createPool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  database: process.env.DB_NAME || 'compasscampus',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Fungsi untuk mengeksekusi query dengan parameter
export async function query(sql, params) {
  try {
    const [results] = await db.execute(sql, params);
    return results;
  } catch (error) {
    console.error('Database query error:', error);
    throw error;
  }
}

// Fungsi untuk mendapatkan satu record
export async function getOne(sql, params) {
  const results = await query(sql, params);
  return results.length ? results[0] : null;
}

// Fungsi untuk menambahkan record
export async function insert(table, data) {
  const keys = Object.keys(data);
  const values = Object.values(data);
  const placeholders = keys.map(() => '?').join(', ');
  
  const sql = `INSERT INTO ${table} (${keys.join(', ')}) VALUES (${placeholders})`;
  
  const result = await query(sql, values);
  return result;
}

// Fungsi untuk mengupdate record
export async function update(table, data, whereClause, whereParams) {
  const setClause = Object.keys(data).map(key => `${key} = ?`).join(', ');
  const values = [...Object.values(data), ...whereParams];
  
  const sql = `UPDATE ${table} SET ${setClause} WHERE ${whereClause}`;
  
  const result = await query(sql, values);
  return result;
}

// Fungsi untuk menghapus record
export async function remove(table, whereClause, whereParams) {
  const sql = `DELETE FROM ${table} WHERE ${whereClause}`;
  
  const result = await query(sql, whereParams);
  return result;
}

export default db;
