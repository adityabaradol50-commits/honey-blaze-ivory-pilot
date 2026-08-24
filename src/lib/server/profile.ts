import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { PLANS, type PlanId, type Profile } from "@/lib/types";
import { z } from "zod";

async function ensureProfile(userId: string): Promise<Profile> {
  const sql = await getSql();
  const existing = await sql<Profile>`
    select user_id as "userId", plan, credits, videos_this_month as "videosThisMonth",
           video_limit as "videoLimit"
    from profiles where user_id = ${userId}
  `;
  if (existing[0]) return existing[0];
  await sql`
    insert into profiles (user_id, plan, credits, videos_this_month, video_limit)
    values (${userId}, 'free', 50, 0, 3)
  `;
  return {
    userId,
    plan: "free",
    credits: 50,
    videosThisMonth: 0,
    videoLimit: 3,
  };
}

export const getProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => ensureProfile(context.userId));

export const listCreditEvents = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    return sql<{
      id: number;
      amount: number;
      reason: string;
      createdAt: string;
    }>`
      select id, amount, reason, created_at as "createdAt"
      from credit_events
      where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
  });

export const upgradePlan = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ plan: z.enum(["starter", "creator", "business"]) }).parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureProfile(context.userId);
    const spec = PLANS[data.plan as PlanId];
    await sql`
      update profiles
      set plan = ${data.plan},
          credits = credits + ${spec.credits},
          video_limit = ${spec.videos}
      where user_id = ${context.userId}
    `;
    await sql`
      insert into credit_events (user_id, amount, reason)
      values (${context.userId}, ${spec.credits}, ${"Plan upgrade: " + spec.label})
    `;
    return ensureProfile(context.userId);
  });
