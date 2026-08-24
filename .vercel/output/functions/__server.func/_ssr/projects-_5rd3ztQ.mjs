import { r as createServerFn } from "./ssr.mjs";
import { Jt as number, Qt as string, Ut as array, Vt as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-BIq_-QLX.mjs";
import { r as getSql } from "./db-Dor3oCSh.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-_5rd3ztQ.js
function mapProject(row) {
	let captions = [];
	let scenes = [];
	try {
		captions = JSON.parse(row.captionsJson || "[]");
	} catch {
		captions = [];
	}
	try {
		scenes = JSON.parse(row.scenesJson || "[]");
	} catch {
		scenes = [];
	}
	return {
		id: row.id,
		userId: row.userId,
		title: row.title,
		type: row.type,
		status: row.status,
		script: row.script,
		voiceId: row.voiceId,
		voiceData: row.voiceData,
		captions,
		scenes,
		sourceUrl: row.sourceUrl,
		durationSec: row.durationSec,
		creditsSpent: row.creditsSpent,
		createdAt: row.createdAt,
		updatedAt: row.updatedAt
	};
}
var createSchema = object({
	title: string().min(1).max(120),
	type: _enum([
		"story",
		"commentary",
		"ranking",
		"clip"
	]),
	sourceUrl: string().optional()
});
var listProjects_createServerFn_handler = createServerRpc({
	id: "0ab656f523a4a1840e55ff3fc0260d6c05d6398ec40527baec32aad1d39c60b9",
	name: "listProjects",
	filename: "src/lib/server/projects.ts"
}, (opts) => listProjects.__executeServer(opts));
var listProjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listProjects_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select id, user_id as "userId", title, type, status, script,
             voice_id as "voiceId", voice_data as "voiceData",
             captions_json as "captionsJson", scenes_json as "scenesJson",
             source_url as "sourceUrl", duration_sec as "durationSec",
             credits_spent as "creditsSpent",
             created_at as "createdAt", updated_at as "updatedAt"
      from projects
      where user_id = ${context.userId}
      order by updated_at desc
    `).map(mapProject);
});
var getProject_createServerFn_handler = createServerRpc({
	id: "7a46f2d87e585938c9d2af069361195068a7b78cd354e58c7440b8edc0cfd103",
	name: "getProject",
	filename: "src/lib/server/projects.ts"
}, (opts) => getProject.__executeServer(opts));
var getProject = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ id: string() }).parse(input)).handler(getProject_createServerFn_handler, async ({ context, data }) => {
	const rows = await (await getSql())`
      select id, user_id as "userId", title, type, status, script,
             voice_id as "voiceId", voice_data as "voiceData",
             captions_json as "captionsJson", scenes_json as "scenesJson",
             source_url as "sourceUrl", duration_sec as "durationSec",
             credits_spent as "creditsSpent",
             created_at as "createdAt", updated_at as "updatedAt"
      from projects
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return rows[0] ? mapProject(rows[0]) : null;
});
var createProject_createServerFn_handler = createServerRpc({
	id: "090d58db5bd3d48fd0ac6f4142ce8f3c0b86d6eb835de8383ba24570a4a07324",
	name: "createProject",
	filename: "src/lib/server/projects.ts"
}, (opts) => createProject.__executeServer(opts));
var createProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => createSchema.parse(input)).handler(createProject_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const id = crypto.randomUUID();
	await sql`
      insert into projects (id, user_id, title, type, source_url)
      values (${id}, ${context.userId}, ${data.title}, ${data.type}, ${data.sourceUrl ?? null})
    `;
	return mapProject((await sql`
      select id, user_id as "userId", title, type, status, script,
             voice_id as "voiceId", voice_data as "voiceData",
             captions_json as "captionsJson", scenes_json as "scenesJson",
             source_url as "sourceUrl", duration_sec as "durationSec",
             credits_spent as "creditsSpent",
             created_at as "createdAt", updated_at as "updatedAt"
      from projects where id = ${id} and user_id = ${context.userId}
    `)[0]);
});
var saveSchema = object({
	id: string(),
	title: string().min(1).max(120).optional(),
	script: string().optional(),
	voiceId: string().optional(),
	scenes: array(object({
		id: string(),
		text: string(),
		caption: string(),
		durationSec: number(),
		visualHint: string()
	})).optional(),
	captions: array(object({
		start: number(),
		end: number(),
		text: string()
	})).optional(),
	status: string().optional(),
	durationSec: number().optional()
});
var saveProject_createServerFn_handler = createServerRpc({
	id: "9a27dc5afbf70799c1297c681cba6a6b942d9646ed0023e5d15453c6f0e29d26",
	name: "saveProject",
	filename: "src/lib/server/projects.ts"
}, (opts) => saveProject.__executeServer(opts));
var saveProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => saveSchema.parse(input)).handler(saveProject_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const existing = await sql`
      select id, user_id as "userId", title, type, status, script,
             voice_id as "voiceId", voice_data as "voiceData",
             captions_json as "captionsJson", scenes_json as "scenesJson",
             source_url as "sourceUrl", duration_sec as "durationSec",
             credits_spent as "creditsSpent",
             created_at as "createdAt", updated_at as "updatedAt"
      from projects where id = ${data.id} and user_id = ${context.userId}
    `;
	if (!existing[0]) throw new Error("Project not found");
	await sql`
      update projects
      set title = ${data.title ?? existing[0].title},
          script = ${data.script ?? existing[0].script},
          voice_id = ${data.voiceId ?? existing[0].voiceId},
          scenes_json = ${data.scenes ? JSON.stringify(data.scenes) : existing[0].scenesJson},
          captions_json = ${data.captions ? JSON.stringify(data.captions) : existing[0].captionsJson},
          status = ${data.status ?? existing[0].status},
          duration_sec = ${data.durationSec ?? existing[0].durationSec},
          updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
	return getProject({ data: { id: data.id } });
});
var deleteProject_createServerFn_handler = createServerRpc({
	id: "7bee002a2979088d64fde80f7c73aa74f4f89d0447f7384f85cdfe39d1a01339",
	name: "deleteProject",
	filename: "src/lib/server/projects.ts"
}, (opts) => deleteProject.__executeServer(opts));
var deleteProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ id: string() }).parse(input)).handler(deleteProject_createServerFn_handler, async ({ context, data }) => {
	await (await getSql())`delete from projects where id = ${data.id} and user_id = ${context.userId}`;
	return { ok: true };
});
//#endregion
export { createProject_createServerFn_handler, deleteProject_createServerFn_handler, getProject_createServerFn_handler, listProjects_createServerFn_handler, saveProject_createServerFn_handler };
