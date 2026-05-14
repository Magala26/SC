import mysql from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

async function main() {
  try {
    const DATABASE_URL = process.env.DATABASE_URL;
    const url = new URL(DATABASE_URL);
    
    const pool = mysql.createPool({
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      ssl: {},
    });

    const connection = await pool.getConnection();

    const days = [
      { day: 'Monday', open_time: '09:00', close_time: '17:00', is_closed: false },
      { day: 'Tuesday', open_time: '09:00', close_time: '17:00', is_closed: false },
      { day: 'Wednesday', open_time: '09:00', close_time: '17:00', is_closed: false },
      { day: 'Thursday', open_time: '09:00', close_time: '17:00', is_closed: false },
      { day: 'Friday', open_time: '09:00', close_time: '17:00', is_closed: false },
      { day: 'Saturday', open_time: '09:00', close_time: '15:00', is_closed: false },
      { day: 'Sunday', open_time: null, close_time: null, is_closed: true },
    ];

    for (const day of days) {
      await connection.execute(
        'UPDATE operatingHours SET open_time = ?, close_time = ?, is_closed = ? WHERE day = ?',
        [day.open_time, day.close_time, day.is_closed, day.day]
      );
    }

    console.log('Operating hours updated successfully');
    connection.release();
    await pool.end();
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
