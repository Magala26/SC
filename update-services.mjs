import mysql from 'mysql2/promise';
import { config } from 'dotenv';

config();

const pool = mysql.createPool({
  host: process.env.DATABASE_URL?.split('@')[1]?.split(':')[0] || 'localhost',
  user: process.env.DATABASE_URL?.split('//')[1]?.split(':')[0] || 'root',
  password: process.env.DATABASE_URL?.split(':')[2]?.split('@')[0] || '',
  database: process.env.DATABASE_URL?.split('/').pop() || 'sneaker_care',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: 'amazon',
});

const services = [
  {
    name: 'Sole Whitening',
    description: 'Professional sole whitening service to restore the pristine white appearance of your sneaker soles.',
    price: 40000, // R400 in cents
    duration: 45,
  },
  {
    name: 'Sneaker Customisations',
    description: 'Custom design and personalization services for your sneakers. Starting from R500 depending on complexity.',
    price: 50000, // R500 in cents
    duration: 120,
  },
  {
    name: 'Colour Restoration (All Colours)',
    description: 'Restore faded colors and bring your sneakers back to life. Works on all color types and materials.',
    price: 25000, // R250 in cents
    duration: 60,
  },
  {
    name: 'Sneaker Protector',
    description: 'Premium protective coating to shield your sneakers from stains, water, and UV damage.',
    price: 5000, // R50 in cents
    duration: 30,
  },
  {
    name: 'Nano Coating',
    description: 'Advanced nano-technology coating for maximum protection and durability.',
    price: 12000, // R120 in cents
    duration: 45,
  },
  {
    name: 'Undergrail Tape',
    description: 'Protective tape application for the underside of your sneakers to prevent wear and damage.',
    price: 15000, // R150 in cents
    duration: 30,
  },
];

async function updateServices() {
  const connection = await pool.getConnection();
  try {
    // Delete existing services
    await connection.query('DELETE FROM services');
    console.log('✓ Cleared existing services');

    // Insert new services
    for (const service of services) {
      await connection.query(
        'INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
        [service.name, service.description, service.price, service.duration]
      );
      console.log(`✓ Added service: ${service.name}`);
    }

    console.log('\n✅ All services updated successfully!');
  } catch (error) {
    console.error('❌ Error updating services:', error.message);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

updateServices().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
