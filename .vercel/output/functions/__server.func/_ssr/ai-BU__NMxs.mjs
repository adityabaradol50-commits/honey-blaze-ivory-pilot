import { r as createServerFn } from "./ssr.mjs";
import { Qt as string, Vt as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-BIq_-QLX.mjs";
import { t as createSsrRpc } from "./profile-D9UqmnTx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-BU__NMxs.js
var generateSchema = object({
	projectId: string(),
	topic: string().min(3).max(400),
	type: _enum([
		"story",
		"commentary",
		"ranking",
		"clip"
	]),
	sourceUrl: string().optional()
});
var generateScript = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => generateSchema.parse(input)).handler(createSsrRpc("d196f3658b22a9d5428268f103ac0946139f6700f7c6f0485fa697294a6a1aa9"));
var generateVoice = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({
	projectId: string(),
	voiceId: string(),
	text: string().min(1).max(2500)
}).parse(input)).handler(createSsrRpc("d4a32f5032408368a2787580dc0a7e5fb4dddeccb6918020079d16f2cb898845"));
var generateCaptions = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ projectId: string() }).parse(input)).handler(createSsrRpc("1fb37908e92580afdbded1934e572e966ff29b1e457dff974c42699c991a154f"));
var markRendered = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ projectId: string() }).parse(input)).handler(createSsrRpc("feec33b9dc896acf6a66114e84772581e80350aec538c006a702f9a5d08f9a12"));
//#endregion
export { markRendered as i, generateScript as n, generateVoice as r, generateCaptions as t };
