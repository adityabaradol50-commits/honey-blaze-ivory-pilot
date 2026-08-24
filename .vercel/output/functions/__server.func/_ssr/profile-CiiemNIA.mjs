import { r as createServerFn } from "./ssr.mjs";
import { Vt as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-BIq_-QLX.mjs";
import { r as getSql } from "./db-Dor3oCSh.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as PLANS } from "./types-Bqql5BzU.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-CiiemNIA.js
async function ensureProfile(userId) {
	const sql = await getSql();
	const existing = await sql`
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
		videoLimit: 3
	};
}
var getProfile_createServerFn_handler = createServerRpc({
	id: "e7aab92be0c3745d5cbac14a6374ff8ce6c163f44e3aee84373dd15a6814760b",
	name: "getProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => getProfile.__executeServer(opts));
var getProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getProfile_createServerFn_handler, async ({ context }) => ensureProfile(context.userId));
var listCreditEvents_createServerFn_handler = createServerRpc({
	id: "be1a1abd20d0ae2c70513aceb7c450429329709864c50ef97aa6488203bea912",
	name: "listCreditEvents",
	filename: "src/lib/server/profile.ts"
}, (opts) => listCreditEvents.__executeServer(opts));
var listCreditEvents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listCreditEvents_createServerFn_handler, async ({ context }) => {
	return (await getSql())`
      select id, amount, reason, created_at as "createdAt"
      from credit_events
      where user_id = ${context.userId}
      order by created_at desc
      limit 20
    `;
});
var upgradePlan_createServerFn_handler = createServerRpc({
	id: "f27e1b0297f5c479a3a9e12035af854d18022e1f75d986ba2d0b86bb1078f3b4",
	name: "upgradePlan",
	filename: "src/lib/server/profile.ts"
}, (opts) => upgradePlan.__executeServer(opts));
var upgradePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ plan: _enum([
	"starter",
	"creator",
	"business"
]) }).parse(input)).handler(upgradePlan_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfile(context.userId);
	const spec = PLANS[data.plan];
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
//#endregion
export { getProfile_createServerFn_handler, listCreditEvents_createServerFn_handler, upgradePlan_createServerFn_handler };
