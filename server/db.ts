import { eq, desc } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import { InsertUser, users, services, operatingHours, bookings, galleryImages, payments, testimonials, Testimonial } from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

// Services queries
export async function getServices() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(services).where(eq(services.isActive, 1));
}

export async function getServiceById(serviceId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(services).where(eq(services.id, serviceId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Operating Hours queries
export async function getOperatingHours() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(operatingHours).orderBy(operatingHours.day);
}

// Bookings queries
export async function createBooking(booking: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  const result = await db.insert(bookings).values(booking);
  return result;
}

export async function getBookingById(bookingId: number) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(bookings).where(eq(bookings.id, bookingId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

// Gallery queries
export async function getGalleryImages() {
  const db = await getDb();
  if (!db) return [];
  return db.select().from(galleryImages);
}

export async function addGalleryImage(image: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(galleryImages).values(image);
}

export async function deleteGalleryImage(imageId: number) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.delete(galleryImages).where(eq(galleryImages.id, imageId));
}

// Payments queries
export async function createPayment(payment: any) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.insert(payments).values(payment);
}

export async function getPaymentByStripeId(stripePaymentIntentId: string) {
  const db = await getDb();
  if (!db) return null;
  const result = await db.select().from(payments).where(eq(payments.stripePaymentIntentId, stripePaymentIntentId)).limit(1);
  return result.length > 0 ? result[0] : null;
}

export async function updatePaymentStatus(paymentId: number, status: string) {
  const db = await getDb();
  if (!db) throw new Error('Database not available');
  return db.update(payments).set({ status: status as any }).where(eq(payments.id, paymentId));
}

// Testimonials queries
export async function getApprovedTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.isApproved, 1))
      .orderBy(desc(testimonials.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get testimonials:", error);
    return [];
  }
}

export async function getAllTestimonials(): Promise<Testimonial[]> {
  const db = await getDb();
  if (!db) return [];

  try {
    return await db
      .select()
      .from(testimonials)
      .orderBy(desc(testimonials.createdAt));
  } catch (error) {
    console.error("[Database] Failed to get all testimonials:", error);
    return [];
  }
}

export async function createTestimonial(data: {
  customerName: string;
  rating: number;
  comment: string;
  isApproved?: number;
}): Promise<Testimonial | null> {
  const db = await getDb();
  if (!db) return null;

  try {
    const result = await db.insert(testimonials).values({
      customerName: data.customerName,
      rating: data.rating,
      comment: data.comment,
      isApproved: data.isApproved ?? 0,
    });

    const inserted = await db
      .select()
      .from(testimonials)
      .where(eq(testimonials.id, (result[0] as any).insertId as number))
      .limit(1);

    return inserted[0] || null;
  } catch (error) {
    console.error("[Database] Failed to create testimonial:", error);
    return null;
  }
}

export async function updateTestimonialStatus(id: number, isApproved: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db
      .update(testimonials)
      .set({ isApproved })
      .where(eq(testimonials.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to update testimonial:", error);
    return false;
  }
}

export async function deleteTestimonial(id: number): Promise<boolean> {
  const db = await getDb();
  if (!db) return false;

  try {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return true;
  } catch (error) {
    console.error("[Database] Failed to delete testimonial:", error);
    return false;
  }
}
