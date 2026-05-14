import mysql from 'mysql2/promise';

// Parse DATABASE_URL
const dbUrl = process.env.DATABASE_URL;
const urlObj = new URL(dbUrl);
const host = urlObj.hostname;
const user = urlObj.username;
const password = urlObj.password;
const database = urlObj.pathname.slice(1);

const pool = mysql.createPool({
  host,
  user,
  password,
  database,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  ssl: { rejectUnauthorized: false }
});

const allServices = [
  // MAIN SERVICES - SNEAKER CARE
  {
    name: 'Standard Clean',
    description: 'Focuses on Upper, Mid Sole & Laces.',
    price: 10000, // R100
    duration: 45,
  },
  {
    name: 'The 95 Deluxe',
    description: 'Focuses on Upper, Inset Stains, Mid Sole, Laces, Inner Sole, Under Sole Detailing, Deodorizing & Sneaker Protector.',
    price: 22000, // R220
    duration: 90,
  },
  {
    name: 'Deep Clean',
    description: 'Focuses on Upper, Inset Stains, Mid Sole, Laces & Inner Sole.',
    price: 12000, // R120
    duration: 60,
  },
  {
    name: 'Intense Deep Clean',
    description: 'Focuses On An Intensified Upper Clean, Inset Stains, Mid Sole, Laces, & Inner Sole.',
    price: 24000, // R240
    duration: 90,
  },
  {
    name: 'Suede/Nubuck Maintenance Clean',
    description: 'Specialized cleaning for delicate suede and nubuck materials.',
    price: 20000, // R200
    duration: 75,
  },

  // ADDITIONAL SERVICES
  {
    name: 'Sole Whitening',
    description: 'Professional sole whitening service to restore the pristine white appearance of your sneaker soles.',
    price: 40000, // R400
    duration: 45,
  },
  {
    name: 'Sneaker Customisations',
    description: 'Custom design and personalization services for your sneakers. Starting from R500 depending on complexity.',
    price: 50000, // R500
    duration: 120,
  },
  {
    name: 'Colour Restoration (All Colours)',
    description: 'Restore faded colors and bring your sneakers back to life. Works on all color types and materials.',
    price: 25000, // R250
    duration: 60,
  },
  {
    name: 'Sneaker Protector',
    description: 'Premium protective coating to shield your sneakers from stains, water, and UV damage.',
    price: 5000, // R50
    duration: 30,
  },
  {
    name: 'Nano Coating',
    description: 'Advanced nano-technology coating for maximum protection and durability.',
    price: 12000, // R120
    duration: 45,
  },
  {
    name: 'Undergrail Tape',
    description: 'Protective tape application for the underside of your sneakers to prevent wear and damage.',
    price: 15000, // R150
    duration: 30,
  },

  // PRODUCTS
  {
    name: 'Suede Sponge Buffer',
    description: 'Gentle sponge buffer for cleaning and maintaining suede and nubuck surfaces.',
    price: 7000, // R70
    duration: 0,
  },
  {
    name: 'Suede & Nubuck Cleaning Brush',
    description: 'Specialized brush for deep cleaning suede and nubuck materials.',
    price: 12000, // R120
    duration: 0,
  },
  {
    name: 'Sneaker Trees',
    description: 'Shoe trees to maintain sneaker shape and prevent creasing.',
    price: 8000, // R80
    duration: 0,
  },
  {
    name: 'Crease Guards',
    description: 'Protective guards to prevent creasing on your premium sneakers.',
    price: 10000, // R100
    duration: 0,
  },
  {
    name: 'Sneaker Shampoo (250ml)',
    description: 'Sustains Colour - Suitable for Leather, Canvas, Suede & Materials (Includes Sneaker Brush & Cloth).',
    price: 18000, // R180
    duration: 0,
  },
  {
    name: 'Sneaker Wipes - 30 Pack',
    description: 'For on the Go Sneaker Care - Suitable for Leather Canvas, Suede & Materials.',
    price: 6000, // R60
    duration: 0,
  },
  {
    name: 'Sneaker Wipes - 80 Pack',
    description: 'For on the Go Sneaker Care - Suitable for Leather Canvas, Suede & Materials.',
    price: 12000, // R120
    duration: 0,
  },
  {
    name: 'Sneaker Deodorizer (250 ML)',
    description: 'Instant Odour Control With Tea Tree Hygiene.',
    price: 10000, // R100
    duration: 0,
  },
  {
    name: 'Sneaker Protector (200 ML)',
    description: 'Stain and Water Repellant protection for your sneakers.',
    price: 15000, // R150
    duration: 0,
  },
  {
    name: 'Sneaker Detailer (100 ML)',
    description: 'Temporary Sneaker Detailer (Black/White) for quick touch-ups.',
    price: 9000, // R90
    duration: 0,
  },
];

async function seedServices() {
  const connection = await pool.getConnection();
  try {
    // Delete existing services
    await connection.query('DELETE FROM services');
    console.log('✓ Cleared existing services');

    // Insert all services
    for (const service of allServices) {
      await connection.query(
        'INSERT INTO services (name, description, price, duration) VALUES (?, ?, ?, ?)',
        [service.name, service.description, service.price, service.duration]
      );
      console.log(`✓ Added: ${service.name} - R${(service.price / 100).toFixed(2)}`);
    }

    console.log(`\n✅ Successfully added ${allServices.length} services!`);
  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    connection.release();
    await pool.end();
  }
}

seedServices().catch(err => {
  console.error('Fatal:', err);
  process.exit(1);
});
