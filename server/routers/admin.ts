import { z } from "zod";
import { adminProcedure, router } from "../_core/trpc";
import { getDb } from "../db";
import { bookings, services } from "../../drizzle/schema";
import { eq, desc, gte, lte, and } from "drizzle-orm";
import {
  getAllTestimonials,
  updateTestimonialStatus,
  deleteTestimonial,
} from "../db";

export const adminRouter = router({
  bookings: router({
    list: adminProcedure
      .input(
        z.object({
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]).optional(),
          startDate: z.date().optional(),
          endDate: z.date().optional(),
          limit: z.number().default(50),
          offset: z.number().default(0),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return [];

        const conditions = [];

        if (input.status) {
          conditions.push(eq(bookings.status, input.status));
        }

        if (input.startDate) {
          conditions.push(gte(bookings.createdAt, input.startDate));
        }

        if (input.endDate) {
          const endOfDay = new Date(input.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          conditions.push(lte(bookings.createdAt, endOfDay));
        }

        if (conditions.length > 0) {
          return db
            .select()
            .from(bookings)
            .where(and(...conditions))
            .orderBy(desc(bookings.createdAt))
            .limit(input.limit)
            .offset(input.offset);
        }

        return db
          .select()
          .from(bookings)
          .orderBy(desc(bookings.createdAt))
          .limit(input.limit)
          .offset(input.offset);
      }),

    countByStatus: adminProcedure.query(async () => {
      const db = await getDb();
      if (!db) return { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

      const allBookings = await db.select().from(bookings);
      
      return {
        pending: allBookings.filter(b => b.status === "pending").length,
        confirmed: allBookings.filter(b => b.status === "confirmed").length,
        completed: allBookings.filter(b => b.status === "completed").length,
        cancelled: allBookings.filter(b => b.status === "cancelled").length,
      };
    }),

    countByStatusWithDateRange: adminProcedure
      .input(
        z.object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return { pending: 0, confirmed: 0, completed: 0, cancelled: 0 };

        const conditions = [];

        if (input.startDate) {
          conditions.push(gte(bookings.createdAt, input.startDate));
        }

        if (input.endDate) {
          const endOfDay = new Date(input.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          conditions.push(lte(bookings.createdAt, endOfDay));
        }

        let filteredBookings;
        if (conditions.length > 0) {
          filteredBookings = await db
            .select()
            .from(bookings)
            .where(and(...conditions));
        } else {
          filteredBookings = await db.select().from(bookings);
        }

        return {
          pending: filteredBookings.filter(b => b.status === "pending").length,
          confirmed: filteredBookings.filter(b => b.status === "confirmed").length,
          completed: filteredBookings.filter(b => b.status === "completed").length,
          cancelled: filteredBookings.filter(b => b.status === "cancelled").length,
        };
      }),

    updateStatus: adminProcedure
      .input(
        z.object({
          bookingId: z.number(),
          status: z.enum(["pending", "confirmed", "completed", "cancelled"]),
        })
      )
      .mutation(async ({ input }) => {
        const db = await getDb();
        if (!db) throw new Error("Database not available");

        await db
          .update(bookings)
          .set({ status: input.status })
          .where(eq(bookings.id, input.bookingId));

        return { success: true };
      }),

    analytics: adminProcedure
      .input(
        z.object({
          startDate: z.date().optional(),
          endDate: z.date().optional(),
        })
      )
      .query(async ({ input }) => {
        const db = await getDb();
        if (!db) return null;

        const conditions = [];

        if (input.startDate) {
          conditions.push(gte(bookings.createdAt, input.startDate));
        }

        if (input.endDate) {
          const endOfDay = new Date(input.endDate);
          endOfDay.setHours(23, 59, 59, 999);
          conditions.push(lte(bookings.createdAt, endOfDay));
        }

        let filteredBookings;
        if (conditions.length > 0) {
          filteredBookings = await db
            .select()
            .from(bookings)
            .where(and(...conditions));
        } else {
          filteredBookings = await db.select().from(bookings);
        }

        const allServices = await db.select().from(services);

        let totalRevenue = 0;
        for (const booking of filteredBookings) {
          if (booking.status === "completed") {
            const service = allServices.find(s => s.id === booking.serviceId);
            if (service) {
              totalRevenue += service.price;
            }
          }
        }

        const serviceBookingCounts: Record<number, number> = {};
        for (const booking of filteredBookings) {
          serviceBookingCounts[booking.serviceId] = (serviceBookingCounts[booking.serviceId] || 0) + 1;
        }

        const topServices = allServices
          .map(service => ({
            id: service.id,
            name: service.name,
            bookingCount: serviceBookingCounts[service.id] || 0,
            revenue: (serviceBookingCounts[service.id] || 0) * service.price,
          }))
          .sort((a, b) => b.bookingCount - a.bookingCount)
          .slice(0, 5);

        return {
          totalBookings: filteredBookings.length,
          totalRevenue,
          completedBookings: filteredBookings.filter(b => b.status === "completed").length,
          pendingBookings: filteredBookings.filter(b => b.status === "pending").length,
          topServices,
        };
      }),
  }),

  testimonials: router({
    list: adminProcedure.query(async () => {
      return getAllTestimonials();
    }),

    updateStatus: adminProcedure
      .input(
        z.object({
          testimonialId: z.number(),
          isApproved: z.number().min(0).max(1),
        })
      )
      .mutation(async ({ input }) => {
        const success = await updateTestimonialStatus(input.testimonialId, input.isApproved);
        return { success };
      }),

    delete: adminProcedure
      .input(z.object({ testimonialId: z.number() }))
      .mutation(async ({ input }) => {
        const success = await deleteTestimonial(input.testimonialId);
        return { success };
      }),
  }),
});
