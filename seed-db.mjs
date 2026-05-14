import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

if (!DATABASE_URL) {
  console.error('DATABASE_URL environment variable is not set');
  process.exit(1);
}

async function seedDatabase() {
  let connection;
  try {
    // Parse the DATABASE_URL
    const url = new URL(DATABASE_URL);
    const config = {
      host: url.hostname,
      port: url.port || 3306,
      user: url.username,
      password: url.password,
      database: url.pathname.slice(1),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {},
    };

    const pool = mysql.createPool(config);
    connection = await pool.getConnection();
    console.log('✓ Connected to database');

    // Clear existing data (optional)
    await connection.execute('DELETE FROM payments');
    await connection.execute('DELETE FROM bookings');
    await connection.execute('DELETE FROM galleryImages');
    await connection.execute('DELETE FROM services');
    await connection.execute('DELETE FROM operatingHours');
    console.log('✓ Cleared existing data');

    // Seed services
    const services = [
      {
        name: 'Basic Clean',
        description: 'Light surface cleaning of uppers and midsole. Perfect for regular maintenance.',
        price: 15000, // R 150.00 in cents
        duration: 45,
      },
      {
        name: 'Deep Clean',
        description: 'Thorough cleaning including deep midsole cleaning and stain removal.',
        price: 25000, // R 250.00 in cents
        duration: 60,
      },
      {
        name: 'Premium Restoration',
        description: 'Intensive restoration including stubborn stain removal and material conditioning.',
        price: 40000, // R 400.00 in cents
        duration: 90,
      },
      {
        name: 'Luxury Restoration',
        description: 'Full restoration with specialized treatment for premium materials and collectibles.',
        price: 70000, // R 700.00 in cents
        duration: 120,
      },
    ];

    for (const service of services) {
      await connection.execute(
        'INSERT INTO services (name, description, price, duration, isActive) VALUES (?, ?, ?, ?, 1)',
        [service.name, service.description, service.price, service.duration]
      );
    }
    console.log(`✓ Seeded ${services.length} services`);

    // Seed operating hours (7 days a week, 9 AM to 6 PM)
    const days = [
      { day: 0, name: 'Sunday', open: '09:00', close: '18:00', closed: 0 },
      { day: 1, name: 'Monday', open: '09:00', close: '18:00', closed: 0 },
      { day: 2, name: 'Tuesday', open: '09:00', close: '18:00', closed: 0 },
      { day: 3, name: 'Wednesday', open: '09:00', close: '18:00', closed: 0 },
      { day: 4, name: 'Thursday', open: '09:00', close: '18:00', closed: 0 },
      { day: 5, name: 'Friday', open: '09:00', close: '18:00', closed: 0 },
      { day: 6, name: 'Saturday', open: '09:00', close: '18:00', closed: 0 },
    ];

    for (const day of days) {
      await connection.execute(
        'INSERT INTO operatingHours (day, dayName, openTime, closeTime, isClosed) VALUES (?, ?, ?, ?, ?)',
        [day.day, day.name, day.open, day.close, day.closed]
      );
    }
    console.log(`✓ Seeded operating hours for 7 days`);

    console.log('\n✓ Database seeding completed successfully!');
  } catch (error) {
    console.error('✗ Error seeding database:', error.message);
    process.exit(1);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
}

seedDatabase();
