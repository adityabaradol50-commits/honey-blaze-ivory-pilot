import { a as getServerFnById, i as TSS_SERVER_FUNCTION, r as createServerFn } from "./ssr.mjs";
import { Vt as _enum, Yt as object } from "../_libs/@better-auth/core+[...].mjs";
import { t as authMiddleware } from "./middleware-BIq_-QLX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-D9UqmnTx.js
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var getProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("e7aab92be0c3745d5cbac14a6374ff8ce6c163f44e3aee84373dd15a6814760b"));
var listCreditEvents = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("be1a1abd20d0ae2c70513aceb7c450429329709864c50ef97aa6488203bea912"));
var upgradePlan = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => object({ plan: _enum([
	"starter",
	"creator",
	"business"
]) }).parse(input)).handler(createSsrRpc("f27e1b0297f5c479a3a9e12035af854d18022e1f75d986ba2d0b86bb1078f3b4"));
//#endregion
export { upgradePlan as i, getProfile as n, listCreditEvents as r, createSsrRpc as t };
