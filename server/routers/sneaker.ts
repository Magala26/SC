import { z } from "zod";
import { publicProcedure, protectedProcedure, router } from "../_core/trpc";
import {
  getServices,
  getServiceById,
  getOperatingHours,
  createBooking,
  getBookingById,
  getGalleryImages,
  addGalleryImage,
  deleteGalleryImage,
  createPayment,
  getPaymentByStripeId,
  getApprovedTestimonials,
  createTestimonial,
} from "../db";
import { notifyOwner } from "../_core/notification";
import { sendWhatsAppMessage } from "../_core/whatsapp";
import { storagePut } from "../storage";

const phoneRegex = /^[\d\s\-\+\(\)]{10,20}$/;

export const sneakerRouter = router({
  // Services
  services: router({
    list: publicProcedure.query(async () => {
      return getServices();
    }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getServiceById(input.id);
    }),
  }),

  // Operating Hours
  operatingHours: router({
    list: publicProcedure.query(async () => {
      return getOperatingHours();
    }),
  }),

  // Bookings
  bookings: router({
    create: publicProcedure
      .input(
        z.object({
          serviceId: z.number(),
          customerName: z.string().min(2, "Name must be at least 2 characters"),
          customerEmail: z.string().email("Invalid email address"),
          customerPhone: z.string().regex(phoneRegex, "Invalid phone number"),
          bookingDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date format (YYYY-MM-DD)"),
          bookingTime: z.string().regex(/^\d{2}:\d{2}$/, "Invalid time format (HH:MM)"),
          specialRequests: z.string().optional(),
        })
      )
      .mutation(async ({ input }) => {
        // Validate service exists
        const service = await getServiceById(input.serviceId);
        if (!service) {
          throw new Error("Service not found");
        }

        // Create booking
        const result = await createBooking({
          serviceId: input.serviceId,
          customerName: input.customerName,
          customerEmail: input.customerEmail,
          customerPhone: input.customerPhone,
          bookingDate: input.bookingDate,
          bookingTime: input.bookingTime,
          specialRequests: input.specialRequests || null,
          status: "pending",
        });

        // Get the booking ID from the result
        const bookingId = (result as any).insertId || result;

        // Notify owner via Manus notification service
        try {
          const callType = input.specialRequests?.includes("OUTCALL") ? "OUT-CALL" : "IN-CALL";
          await notifyOwner({
            title: "New Booking Received",
            content: `New booking from ${input.customerName}\nService: ${service.name}\nType: ${callType}\nDate: ${input.bookingDate}\nTime: ${input.bookingTime}\nEmail: ${input.customerEmail}\nPhone: ${input.customerPhone}\nSpecial Requests: ${input.specialRequests || 'None'}`,
          });
        } catch (error) {
          console.error("Failed to send owner notification:", error);
        }

        // Send WhatsApp message to owner
        try {
          const callType = input.specialRequests?.includes("OUTCALL") ? "OUT-CALL" : "IN-CALL";
          const whatsappMessage = `New Booking Received\n\nCustomer: ${input.customerName}\nService: ${service.name}\nType: ${callType}\nDate: ${input.bookingDate}\nTime: ${input.bookingTime}\nPhone: ${input.customerPhone}\nEmail: ${input.customerEmail}`;
          await sendWhatsAppMessage({
            to: "0665884466",
            message: whatsappMessage,
          });
        } catch (error) {
          console.error("Failed to send WhatsApp notification:", error);
        }

        // Send to Make.com Webhook
        try {
          const callType = input.specialRequests?.includes("OUTCALL") ? "OUT-CALL" : "IN-CALL";
          await fetch('https://hook.eu2.make.com/wd9rpfpr1hxyw7wvxp4r6ogt40l10794', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              bookingId,
              serviceName: service.name,
              customerName: input.customerName,
              customerEmail: input.customerEmail,
              customerPhone: input.customerPhone,
              bookingDate: input.bookingDate,
              bookingTime: input.bookingTime,
              callType,
              specialRequests: input.specialRequests || ''
            })
          });
        } catch (webhookError) {
          console.error("Failed to send webhook:", webhookError);
        }

        return { success: true, bookingId };
      }),

    getById: publicProcedure.input(z.object({ id: z.number() })).query(async ({ input }) => {
      return getBookingById(input.id);
    }),
  }),

  // Gallery
  gallery: router({
    list: publicProcedure.query(async () => {
      return getGalleryImages();
    }),

    upload: protectedProcedure
      .input(
        z.object({
          fileData: z.string(), // Base64 encoded file data
          fileName: z.string(),
          caption: z.string().optional(),
        })
      )
      .mutation(async ({ input, ctx }) => {
        // Only allow admin/owner to upload
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: Only admins can upload gallery images");
        }

        try {
          // Convert base64 to buffer
          const buffer = Buffer.from(input.fileData, "base64");

          // Upload to storage
          const { key, url } = await storagePut(
            `gallery/${Date.now()}-${input.fileName}`,
            buffer,
            "image/jpeg"
          );

          // Save to database
          const result = await addGalleryImage({
            fileKey: key,
            fileUrl: url,
            caption: input.caption || null,
            uploadedBy: ctx.user.id,
          });

          return { success: true, url, fileKey: key };
        } catch (error) {
          console.error("Gallery upload error:", error);
          throw new Error("Failed to upload image");
        }
      }),

    delete: protectedProcedure
      .input(z.object({ id: z.number() }))
      .mutation(async ({ input, ctx }) => {
        if (ctx.user?.role !== "admin") {
          throw new Error("Unauthorized: Only admins can delete gallery images");
        }

        try {
          await deleteGalleryImage(input.id);
          return { success: true };
        } catch (error) {
          console.error("Gallery delete error:", error);
          throw new Error("Failed to delete image");
        }
      }),
  }),

  // Payments
  payments: router({
    create: publicProcedure
      .input(
        z.object({
          bookingId: z.number(),
          amount: z.number().positive(),
          stripePaymentIntentId: z.string(),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await createPayment({
            bookingId: input.bookingId,
            stripePaymentIntentId: input.stripePaymentIntentId,
            amount: input.amount,
            currency: "USD",
            status: "pending",
          });

          return { success: true, paymentId: (result as any).insertId };
        } catch (error) {
          console.error("Payment creation error:", error);
          throw new Error("Failed to create payment record");
        }
      }),

    getByStripeId: publicProcedure
      .input(z.object({ stripePaymentIntentId: z.string() }))
      .query(async ({ input }) => {
        return getPaymentByStripeId(input.stripePaymentIntentId);
      }),
  }),

  // Testimonials
  testimonials: router({
    list: publicProcedure.query(async () => {
      return getApprovedTestimonials();
    }),

    create: publicProcedure
      .input(
        z.object({
          customerName: z.string().min(2, "Name must be at least 2 characters"),
          rating: z.number().min(1).max(5),
          comment: z.string().min(10, "Comment must be at least 10 characters"),
        })
      )
      .mutation(async ({ input }) => {
        try {
          const result = await createTestimonial({
            customerName: input.customerName,
            rating: input.rating,
            comment: input.comment,
            isApproved: 0, // New testimonials need admin approval
          });

          if (result) {
            // Notify owner of new testimonial
            try {
              await notifyOwner({
                title: "New Testimonial Received",
                content: `New testimonial from ${input.customerName}\nRating: ${input.rating}/5\nComment: ${input.comment}`,
              });
            } catch (error) {
              console.error("Failed to send owner notification:", error);
            }
          }

          return { success: !!result };
        } catch (error) {
          console.error("Testimonial creation error:", error);
          throw new Error("Failed to create testimonial");
        }
      }),
  }),
});
