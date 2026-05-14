import mysql from 'mysql2/promise';
import { readFileSync } from 'fs';
import { parse } from 'url';

const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) {
  console.error('DATABASE_URL not set');
  process.exit(1);
}

const url = parse(dbUrl, true);
const config = {
  host: url.hostname,
  port: url.port || 3306,
  user: url.auth?.split(':')[0],
  password: url.auth?.split(':')[1],
  database: url.pathname?.slice(1),
  ssl: 'amazon',
};

async function executeMigration() {
  const connection = await mysql.createConnection(config);
  try {
    const sql = readFileSync('./drizzle/0002_demonic_la_nuit.sql', 'utf-8');
    await connection.execute(sql);
    console.log('Migration executed successfully');
  } catch (error) {
    console.error('Migration failed:', error.message);
  } finally {
    await connection.end();
  }
}

executeMigration();
