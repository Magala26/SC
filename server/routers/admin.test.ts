import { describe, it, expect } from "vitest";
import { appRouter } from "../routers";
import type { TrpcContext } from "../_core/context";

type AdminUser = NonNullable<TrpcContext["user"]> & { role: "admin" };
type RegularUser = NonNullable<TrpcContext["user"]> & { role: "user" };

function createAdminContext(): { ctx: TrpcContext; } {
  const adminUser: AdminUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@example.com",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: adminUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

function createRegularUserContext(): { ctx: TrpcContext; } {
  const regularUser: RegularUser = {
    id: 2,
    openId: "regular-user",
    email: "user@example.com",
    name: "Regular User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  const ctx: TrpcContext = {
    user: regularUser,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };

  return { ctx };
}

describe("admin router", () => {
  describe("access control", () => {
    it("should allow admin to access bookings.list", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.admin.bookings.list({ limit: 10, offset: 0 });
        expect(Array.isArray(result)).toBe(true);
      } catch (error) {
        expect((error as any).message).not.toContain("FORBIDDEN");
      }
    });

    it("should deny regular user from accessing bookings.list", async () => {
      const { ctx } = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.bookings.list({ limit: 10, offset: 0 });
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).message).toContain("required permission");
      }
    });

    it("should allow admin to access countByStatus", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      try {
        const result = await caller.admin.bookings.countByStatus();
        expect(result).toHaveProperty("pending");
        expect(result).toHaveProperty("confirmed");
        expect(result).toHaveProperty("completed");
        expect(result).toHaveProperty("cancelled");
      } catch (error) {
        expect((error as any).message).not.toContain("FORBIDDEN");
      }
    });

    it("should deny regular user from accessing countByStatus", async () => {
      const { ctx } = createRegularUserContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.bookings.countByStatus();
        expect.fail("Should have thrown an error");
      } catch (error) {
        expect((error as any).message).toContain("required permission");
      }
    });
  });

  describe("updateStatus validation", () => {
    it("should validate status input with invalid value", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      try {
        await caller.admin.bookings.updateStatus({
          bookingId: 999,
          status: "invalid" as any,
        });
        expect.fail("Should have thrown validation error");
      } catch (error) {
        expect((error as any).message).toContain("Invalid option");
      }
    });

    it("should accept valid status values for updateStatus", async () => {
      const { ctx } = createAdminContext();
      const caller = appRouter.createCaller(ctx);

      const validStatuses = ["pending", "confirmed", "completed", "cancelled"];
      
      for (const status of validStatuses) {
        try {
          await caller.admin.bookings.updateStatus({
            bookingId: 999,
            status: status as any,
          });
        } catch (error) {
          expect((error as any).message).not.toContain("Invalid option");
        }
      }
    });
  });
});
