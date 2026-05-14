import mysql from 'mysql2/promise';
import { parse } from 'url';

const dbUrl = process.env.DATABASE_URL;
const url = parse(dbUrl, true);
const config = {
  host: url.hostname,
  port: url.port || 3306,
  user: url.auth?.split(':')[0],
  password: url.auth?.split(':')[1],
  database: url.pathname?.slice(1),
  ssl: 'amazon',
};

const testimonials = [
  { customerName: 'Thabo M.', rating: 5, comment: 'Best sneaker cleaning service in Johannesburg! My Jordans look brand new. Highly recommend!' },
  { customerName: 'Zara K.', rating: 5, comment: 'Professional service, quick turnaround, and amazing results. Will definitely use again!' },
  { customerName: 'Sipho N.', rating: 5, comment: 'The Deep Clean package is worth every rand. My collection has never looked better!' },
  { customerName: 'Lerato S.', rating: 4, comment: 'Great service and friendly staff. Prices are fair for the quality of work.' },
  { customerName: 'Marcus J.', rating: 5, comment: 'Sneaker Care Department saved my limited edition kicks. Absolutely fantastic!' },
];

async function seedTestimonials() {
  const connection = await mysql.createConnection(config);
  try {
    for (const testimonial of testimonials) {
      await connection.execute(
        'INSERT INTO testimonials (customerName, rating, comment, isApproved) VALUES (?, ?, ?, ?)',
        [testimonial.customerName, testimonial.rating, testimonial.comment, 1]
      );
    }
    console.log('Testimonials seeded successfully');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await connection.end();
  }
}

seedTestimonials();
