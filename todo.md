# Sneaker Care Department - Project TODO

## Database & Schema
- [x] Create services table with name, description, price, duration
- [x] Create operating_hours table with day, open_time, close_time, is_closed
- [x] Create bookings table with customer info, service, date, time, status
- [x] Create gallery_images table with image URL, caption, upload_date
- [x] Seed sample services (Basic Clean, Deep Clean, Restoration, Premium Restoration)
- [x] Seed operating hours for all 7 days
- [x] Create migrations and run database setup

## tRPC API Procedures
- [x] Create services.list procedure (public)
- [x] Create services.getById procedure (public)
- [x] Create operatingHours.list procedure (public)
- [x] Create bookings.create procedure (public with validation)
- [x] Create bookings.getById procedure (public)
- [x] Create gallery.list procedure (public)
- [x] Create gallery.upload procedure (protected, owner only)
- [x] Create gallery.delete procedure (protected, owner only)
- [x] Implement owner notification on booking creation

## Design System & Layout
- [x] Define Brutalist color palette (black bg, white text, red accent line)
- [x] Update global CSS with Brutalist design tokens
- [x] Create Navigation component with logo and responsive menu
- [x] Design and implement cursive "Sneaker Care Department" logo
- [x] Create Layout wrapper with header, footer, and main content area
- [x] Implement red horizontal divider component

## Pages - Home
- [x] Create hero section with bold headline
- [x] Add business introduction section
- [x] Display service highlights (4 key services)
- [x] Add price list summary table
- [x] Display operating hours from database
- [x] Add CTA buttons to Services and Booking pages

## Pages - Services
- [x] Create full service catalog grid/list layout
- [x] Display each service: name, description, price, duration
- [x] Add "Book Now" button for each service
- [x] Responsive design for mobile/tablet/desktop

## Pages - Booking
- [x] Create date picker component with calendar
- [x] Implement time slot generator (30-min intervals)
- [x] Filter available slots based on operating hours
- [x] Create service selector dropdown
- [x] Build customer info form (name, email, phone)
- [x] Display selected booking summary
- [x] Add form validation
- [x] Submit booking to database via tRPC
- [x] Show confirmation message after booking

## Pages - Gallery
- [x] Create responsive image grid layout
- [x] Display gallery images from database
- [x] Add image captions
- [x] Implement admin upload interface (protected)
- [x] Add file upload handler to cloud storage
- [x] Add image delete functionality (admin only)
- [x] Show loading state during upload

## Pages - Checkout
- [x] Create order summary section
- [x] Display selected service details and price
- [x] Build customer details form
- [ ] Integrate Stripe payment form (placeholder form ready)
- [ ] Handle payment processing (placeholder ready)
- [x] Show payment confirmation after success
- [x] Display order confirmation details

## Stripe Integration
- [ ] Set up Stripe account and get API keys (optional - EFT available)
- [ ] Add Stripe environment variables (optional)
- [ ] Create payment intent procedure in tRPC (optional)
- [ ] Implement Stripe Elements on Checkout page (optional)
- [ ] Handle payment success/error states (optional)
- [ ] Create order record after successful payment (optional)

## Owner Notifications
- [x] Implement notifyOwner helper for booking submissions
- [x] Test notification delivery on new booking
- [x] Verify notification includes booking details

## Testing
- [x] Write vitest tests for services procedures
- [x] Write vitest tests for bookings procedures
- [x] Write vitest tests for operating hours procedures
- [x] Write vitest tests for gallery procedures
- [x] Write vitest tests for payment procedures
- [x] Test booking form validation
- [x] Test date/time slot generation logic

## Polish & Deployment
- [x] Test responsive design on mobile/tablet/desktop
- [x] Test all navigation links
- [x] Test booking flow end-to-end
- [x] Test EFT payment method
- [x] Verify owner notifications are sent
- [x] Check accessibility (contrast, keyboard nav)
- [x] Performance optimization
- [x] Create checkpoint
- [x] Ready for deployment via Management UI Publish button

## User Updates (May 1, 2026)
- [x] Allow multiple service selection on booking page
- [x] Change all pricing from USD to ZAR (South African Rand)
- [x] Update operating hours: Mon-Fri 09:00-17:00, Sat 09:00-15:00, Sun Closed
- [x] Update seed data with new operating hours
- [x] Update price display format to show ZAR currency

## Color Scheme Update (May 1, 2026)
- [x] Update CSS color palette from red/black/white to blue/white/black/grey
- [x] Update accent color from red to blue
- [x] Update all divider colors from red to blue
- [x] Update button colors to use blue theme
- [x] Update hover states to use blue/grey
- [x] Test all pages with new color scheme

## Design Enhancement (May 1, 2026)
- [x] Add elegant/stylish font (Poppins, Playfair Display, or similar)
- [x] Enhance typography hierarchy and spacing
- [x] Add gradient effects and modern design elements
- [x] Improve button designs with better hover effects
- [x] Add card shadows and depth effects
- [x] Enhance hero section with more visual impact
- [x] Add accent colors and design flourishes
- [x] Optimize spacing and padding throughout
- [x] Add smooth animations and transitions
- [x] Test all pages for visual appeal

## Operating Hours Update (May 1, 2026)
- [x] Update database operating hours to new schedule
- [x] Mon-Fri: 9am-5pm, Sat: 9am-3pm, Sun: Closed, Public Holidays: 9am-1pm
- [x] Update all pages displaying operating hours (Footer, Contact, Booking)
- [x] Test operating hours display on all pages

## Logo Integration (May 1, 2026)
- [x] Upload official Sneaker Care Department logo to cloud storage
- [x] Add logo to Navigation component header
- [x] Add logo to Home page hero section
- [x] Add logo to Footer
- [x] Update all pages to display logo consistently
- [x] Test logo display on all pages

## Service Update (May 1, 2026)
- [x] Update services with new offerings and pricing
- [x] Added all 21 services from three product lists
- [x] Main Services: Standard Clean, The 95 Deluxe, Deep Clean, Intense Deep Clean, Suede/Nubuck Maintenance
- [x] Additional Services: Sole Whitening, Customisations, Colour Restoration, Protector, Nano Coating, Undergrail Tape
- [x] Products: Sponge Buffer, Cleaning Brush, Trees, Crease Guards, Shampoo, Wipes, Deodorizer, Protector, Detailer
- [x] All pricing in ZAR (R)
- [x] Update database with new services
- [x] Test all pages display new services correctly

## Social Media Integration (May 1, 2026)
- [x] Add WhatsApp link using business number 0665884466
- [x] Add Instagram link @welovesneakercare
- [x] Add TikTok link @welovesneakercare
- [x] Display social media icons on Contact page
- [x] Add social media links to Footer
- [x] Test all social media links

## Admin Dashboard (May 1, 2026)
- [x] Create protected admin dashboard page
- [x] Build bookings management table with filtering and search
- [x] Add booking status management (pending, confirmed, completed, cancelled)
- [x] Build business analytics dashboard with charts
- [x] Add key metrics (total bookings, revenue, popular services)
- [x] Implement admin-only navigation and access control
- [x] Write vitest tests for admin procedures
- [x] Test admin access control and security

## Date Range Filter for Analytics (May 1, 2026)
- [x] Add date range picker component to admin dashboard
- [x] Create tRPC procedure to filter analytics by date range
- [x] Update analytics charts to use date range filter
- [x] Add preset date ranges (Last 7 days, Last 30 days, Last 90 days)
- [x] Filter bookings table by date range
- [x] Add countByStatusWithDateRange procedure for pie chart
- [x] Update booking status pie chart to respect date range
- [x] Write vitest tests for date range filtering
- [x] Test date range filtering functionality

## Testimonials Section (May 1, 2026)
- [x] Create testimonials table in database
- [x] Add testimonials tRPC procedures (list, create, delete)
- [x] Build testimonials carousel component on Home page
- [x] Add admin interface to manage testimonials
- [x] Display star ratings with testimonials
- [x] Add customer name and date to testimonials
- [x] Test testimonials display and functionality

## Address Update (May 1, 2026)
- [x] Update Contact page with new address (96 Vorster Avenue, Glenanda, Johannesburg South)
- [x] Update Footer with new address
- [x] Add address to Home page or other pages if needed
- [x] Test address display across all pages
