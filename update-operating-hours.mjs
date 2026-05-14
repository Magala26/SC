import mysql from 'mysql2/promise';

const connection = await mysql.createConnection({
  host: process.env.DATABASE_URL.split('@')[1].split('/')[0],
  user: process.env.DATABASE_URL.split('//')[1].split(':')[0],
  password: process.env.DATABASE_URL.split(':')[2].split('@')[0],
  database: process.env.DATABASE_URL.split('/').pop(),
  ssl: 'Amazon RDS',
});

const operatingHours = [
  { day: 1, dayName: 'Monday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { day: 2, dayName: 'Tuesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { day: 3, dayName: 'Wednesday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { day: 4, dayName: 'Thursday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { day: 5, dayName: 'Friday', openTime: '09:00', closeTime: '17:00', isClosed: false },
  { day: 6, dayName: 'Saturday', openTime: '09:00', closeTime: '15:00', isClosed: false },
  { day: 0, dayName: 'Sunday', openTime: '00:00', closeTime: '00:00', isClosed: true },
];

for (const hours of operatingHours) {
  await connection.execute(
    'UPDATE operating_hours SET openTime = ?, closeTime = ?, isClosed = ? WHERE day = ?',
    [hours.openTime, hours.closeTime, hours.isClosed, hours.day]
  );
}

console.log('Operating hours updated successfully!');
await connection.end();
