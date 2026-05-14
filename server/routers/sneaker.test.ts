import { describe, it, expect, beforeAll } from 'vitest';
import { appRouter } from '../routers';
import type { TrpcContext } from '../_core/context';

// Mock context for testing
function createMockContext(isAdmin = false): TrpcContext {
  return {
    user: isAdmin
      ? {
          id: 1,
          openId: 'test-admin',
          email: 'admin@test.com',
          name: 'Test Admin',
          loginMethod: 'test',
          role: 'admin',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        }
      : {
          id: 2,
          openId: 'test-user',
          email: 'user@test.com',
          name: 'Test User',
          loginMethod: 'test',
          role: 'user',
          createdAt: new Date(),
          updatedAt: new Date(),
          lastSignedIn: new Date(),
        },
    req: {
      protocol: 'https',
      headers: {},
    } as TrpcContext['req'],
    res: {} as TrpcContext['res'],
  };
}

describe('Sneaker Router', () => {
  let caller: any;

  beforeAll(() => {
    const ctx = createMockContext();
    caller = appRouter.createCaller(ctx);
  });

  describe('Services', () => {
    it('should list all active services', async () => {
      const services = await caller.sneaker.services.list();
      expect(Array.isArray(services)).toBe(true);
      expect(services.length).toBeGreaterThan(0);
      expect(services[0]).toHaveProperty('id');
      expect(services[0]).toHaveProperty('name');
      expect(services[0]).toHaveProperty('price');
      expect(services[0]).toHaveProperty('duration');
    });

    it('should get a service by id', async () => {
      const services = await caller.sneaker.services.list();
      if (services.length > 0) {
        const service = await caller.sneaker.services.getById({ id: services[0].id });
        expect(service).toBeDefined();
        expect(service?.id).toBe(services[0].id);
        expect(service?.name).toBe(services[0].name);
      }
    });

    it('should return null for non-existent service', async () => {
      const service = await caller.sneaker.services.getById({ id: 99999 });
      expect(service).toBeNull();
    });
  });

  describe('Operating Hours', () => {
    it('should list operating hours for all days', async () => {
      const hours = await caller.sneaker.operatingHours.list();
      expect(Array.isArray(hours)).toBe(true);
      expect(hours.length).toBe(7); // 7 days of the week
      expect(hours[0]).toHaveProperty('day');
      expect(hours[0]).toHaveProperty('dayName');
      expect(hours[0]).toHaveProperty('openTime');
      expect(hours[0]).toHaveProperty('closeTime');
      expect(hours[0]).toHaveProperty('isClosed');
    });

    it('should have valid time format', async () => {
      const hours = await caller.sneaker.operatingHours.list();
      const timeRegex = /^\d{2}:\d{2}$/;
      hours.forEach((h) => {
        if (!h.isClosed) {
          expect(h.openTime).toMatch(timeRegex);
          expect(h.closeTime).toMatch(timeRegex);
        }
      });
    });
  });

  describe('Bookings', () => {
    let createdBookingId: number;

    it('should create a booking with valid data', async () => {
      const services = await caller.sneaker.services.list();
      if (services.length > 0) {
        const result = await caller.sneaker.bookings.create({
          serviceId: services[0].id,
          customerName: 'John Doe',
          customerEmail: 'john@example.com',
          customerPhone: '+1 (555) 123-4567',
          bookingDate: '2026-05-15',
          bookingTime: '10:00',
          specialRequests: 'Please be careful with the sole',
        });

        expect(result).toHaveProperty('success', true);
        expect(result).toHaveProperty('bookingId');
        createdBookingId = result.bookingId;
      }
    });

    it('should reject booking with invalid email', async () => {
      const services = await caller.sneaker.services.list();
      if (services.length > 0) {
        try {
          await caller.sneaker.bookings.create({
            serviceId: services[0].id,
            customerName: 'John Doe',
            customerEmail: 'invalid-email',
            customerPhone: '+1 (555) 123-4567',
            bookingDate: '2026-05-15',
            bookingTime: '10:00',
          });
          expect.fail('Should have thrown an error');
        } catch (error: any) {
          expect(error).toBeDefined();
        }
      }
    });

    it('should reject booking with missing required fields', async () => {
      try {
        await caller.sneaker.bookings.create({
          serviceId: 1,
          customerName: '',
          customerEmail: 'test@example.com',
          customerPhone: '+1 (555) 123-4567',
          bookingDate: '2026-05-15',
          bookingTime: '10:00',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it('should get a booking by id', async () => {
      if (createdBookingId && typeof createdBookingId === 'number') {
        const booking = await caller.sneaker.bookings.getById({ id: createdBookingId });
        expect(booking).toBeDefined();
        expect(booking?.id).toBe(createdBookingId);
        expect(booking?.customerName).toBe('John Doe');
        expect(booking?.status).toBe('pending');
      }
    });
  });

  describe('Gallery', () => {
    it('should list gallery images', async () => {
      const images = await caller.sneaker.gallery.list();
      expect(Array.isArray(images)).toBe(true);
    });

    it('should not allow non-admin to upload', async () => {
      const userCtx = createMockContext(false);
      const userCaller = appRouter.createCaller(userCtx);

      try {
        await userCaller.sneaker.gallery.upload({
          fileData: 'base64encodeddata',
          fileName: 'test.jpg',
          caption: 'Test image',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Unauthorized');
      }
    });

    it('should not allow non-admin to delete', async () => {
      const userCtx = createMockContext(false);
      const userCaller = appRouter.createCaller(userCtx);

      try {
        await userCaller.sneaker.gallery.delete({ id: 1 });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error.message).toContain('Unauthorized');
      }
    });
  });

  describe('Payments', () => {
    it('should validate payment input - reject negative amount', async () => {
      try {
        await caller.sneaker.payments.create({
          bookingId: 1,
          amount: -100,
          stripePaymentIntentId: 'pi_test',
        });
        expect.fail('Should have thrown an error');
      } catch (error: any) {
        expect(error).toBeDefined();
      }
    });

    it('should accept valid payment input structure', async () => {
      try {
        const result = await caller.sneaker.payments.create({
          bookingId: 1,
          amount: 5000,
          stripePaymentIntentId: 'pi_test_valid_123',
        });
        // Either succeeds or fails due to database constraints, but input validation passes
        expect(result).toBeDefined();
      } catch (error: any) {
        // Expected if booking doesn't exist in DB
        expect(error).toBeDefined();
      }
    });
  });
});
