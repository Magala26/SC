import mysql from 'mysql2/promise';
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

async function checkMigration() {
  const connection = await mysql.createConnection(config);
  try {
    // Check if testimonials table exists
    const [tables] = await connection.execute(
      "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'testimonials'",
      [config.database]
    );
    
    if (tables.length > 0) {
      console.log('✓ Testimonials table exists');
      
      // Check table structure
      const [columns] = await connection.execute(
        "SELECT COLUMN_NAME, COLUMN_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'testimonials'",
        [config.database]
      );
      
      console.log('\nTable structure:');
      columns.forEach(col => {
        console.log(`  - ${col.COLUMN_NAME}: ${col.COLUMN_TYPE}`);
      });
      
      // Count testimonials
      const [count] = await connection.execute('SELECT COUNT(*) as cnt FROM testimonials');
      console.log(`\n✓ Total testimonials: ${count[0].cnt}`);
      
      // Show sample testimonials
      const [samples] = await connection.execute('SELECT * FROM testimonials LIMIT 3');
      console.log('\nSample testimonials:');
      samples.forEach(t => {
        console.log(`  - ${t.customerName}: ${t.rating}★ - "${t.comment.substring(0, 50)}..."`);
      });
    } else {
      console.log('✗ Testimonials table does not exist');
      console.log('\nAvailable tables:');
      const [allTables] = await connection.execute(
        "SELECT TABLE_NAME FROM INFORMATION_SCHEMA.TABLES WHERE TABLE_SCHEMA = ?",
        [config.database]
      );
      allTables.forEach(t => {
        console.log(`  - ${t.TABLE_NAME}`);
      });
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await connection.end();
  }
}

checkMigration();
