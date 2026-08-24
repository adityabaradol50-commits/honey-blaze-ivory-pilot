import { r as createServerFn } from "./ssr.mjs";
import { Jt as number, Qt as string, Ut as array, Vt as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-BIq_-QLX.mjs";
import { t as createSsrRpc } from "./profile-D9UqmnTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/projects-CqbO5R_0.js
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
var listProjects = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("0ab656f523a4a1840e55ff3fc0260d6c05d6398ec40527baec32aad1d39c60b9"));
var getProject = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => object({ id: string() }).parse(input)).handler(createSsrRpc("7a46f2d87e585938c9d2af069361195068a7b78cd354e58c7440b8edc0cfd103"));
var createProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => createSchema.parse(input)).handler(createSsrRpc("090d58db5bd3d48fd0ac6f4142ce8f3c0b86d6eb835de8383ba24570a4a07324"));
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
var saveProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => saveSchema.parse(input)).handler(createSsrRpc("9a27dc5afbf70799c1297c681cba6a6b942d9646ed0023e5d15453c6f0e29d26"));
var deleteProject = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ id: string() }).parse(input)).handler(createSsrRpc("7bee002a2979088d64fde80f7c73aa74f4f89d0447f7384f85cdfe39d1a01339"));
//#endregion
export { saveProject as a, listProjects as i, deleteProject as n, getProject as r, createProject as t };
