import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { CREDIT_COSTS, type CaptionCue, type Scene } from "@/lib/types";
import { z } from "zod";

async function spendCredits(userId: string, amount: number, reason: string, projectId: string) {
  const sql = await getSql();
  const rows = await sql<{ credits: number }>`
    select credits from profiles where user_id = ${userId}
  `;
  const credits = rows[0]?.credits ?? 0;
  if (credits < amount) {
    throw new Error(`Not enough credits. Need ${amount}, have ${credits}.`);
  }
  await sql`update profiles set credits = credits - ${amount} where user_id = ${userId}`;
  await sql`
    insert into credit_events (user_id, amount, reason, project_id)
    values (${userId}, ${-amount}, ${reason}, ${projectId})
  `;
}

function scenesFromScript(script: string, title: string): Scene[] {
  const chunks = script
    .split(/\n+/)
    .map((s) => s.replace(/^\d+[\).\s-]+/, "").trim())
    .filter(Boolean);
  const parts = chunks.length ? chunks : [script.trim() || title];
  return parts.slice(0, 8).map((text, i) => ({
    id: crypto.randomUUID(),
    text,
    caption: text.slice(0, 90),
    durationSec: Math.min(6.5, Math.max(3.2, 3.8 + (text.length % 3))),
    visualHint: i === 0 ? "hook" : i === parts.length - 1 ? "cta" : "beat",
  }));
}

function captionsFromScenes(scenes: Scene[]): CaptionCue[] {
  let t = 0;
  return scenes.map((s) => {
    const start = t;
    t += s.durationSec;
    return { start, end: t, text: s.caption };
  });
}

async function grokScript(prompt: string): Promise<{ title: string; script: string; scenes: Scene[] } | null> {
  const apiKey = process.env.XAI_API_KEY;
  if (!apiKey) return null;
  const res = await fetch("https://api.x.ai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "grok-4.5",
      max_tokens: 900,
      messages: [
        {
          role: "system",
          content:
            "You write short-form vertical video scripts. Return ONLY valid JSON with keys title, hook, scenes. scenes is an array of {text, caption, durationSec, visualHint}. 5-7 scenes, spoken lines under 22 words, captions under 10 words, durationSec 3-6. No markdown.",
        },
        { role: "user", content: prompt },
      ],
    }),
  });
  if (!res.ok) return null;
  const body = (await res.json()) as { choices?: { message?: { content?: string } }[] };
  const raw = body.choices?.[0]?.message?.content ?? "";
  const jsonText = raw.replace(/^```json\s*|```$/g, "").trim();
  try {
    const parsed = JSON.parse(jsonText) as {
      title?: string;
      scenes?: { text?: string; caption?: string; durationSec?: number; visualHint?: string }[];
    };
    const scenes: Scene[] = (parsed.scenes ?? []).slice(0, 8).map((s) => ({
      id: crypto.randomUUID(),
      text: String(s.text ?? "").trim(),
      caption: String(s.caption ?? s.text ?? "").slice(0, 90),
      durationSec: Math.min(7, Math.max(2.5, Number(s.durationSec) || 4)),
      visualHint: String(s.visualHint ?? "beat"),
    }));
    const script = scenes.map((s) => s.text).join("\n\n");
    return { title: parsed.title || "Untitled short", script, scenes };
  } catch {
    return null;
  }
}

const generateSchema = z.object({
  projectId: z.string(),
  topic: z.string().min(3).max(400),
  type: z.enum(["story", "commentary", "ranking", "clip"]),
  sourceUrl: z.string().optional(),
});

export const generateScript = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => generateSchema.parse(input))
  .handler(async ({ context, data }) => {
    await spendCredits(context.userId, CREDIT_COSTS.script, "AI script", data.projectId);
    const prompt =
      data.type === "ranking"
        ? `Write a viral ranking short about: ${data.topic}. Count down 5 items with a punchy hook and CTA.`
        : data.type === "commentary"
          ? `Write a 45-second commentary voiceover about this clip/topic: ${data.topic}. Source: ${data.sourceUrl || "none"}. Opinionated, fast, hook in first line.`
          : data.type === "clip"
            ? `Propose 5 highlight beats to cut from a long video about: ${data.topic}. Each beat is a spoken caption for a Short.`
            : `Write a faceless story short about: ${data.topic}. Hook, 4 beats, CTA.`;

    const ai = await grokScript(prompt);
    const title = ai?.title ?? data.topic.slice(0, 60);
    const scenes = ai?.scenes?.length ? ai.scenes : scenesFromScript(data.topic, title);
    const script = ai?.script ?? scenes.map((s) => s.text).join("\n\n");
    const captions = captionsFromScenes(scenes);
    const durationSec = scenes.reduce((a, s) => a + s.durationSec, 0);
    const sql = await getSql();
    await sql`
      update projects
      set title = ${title},
          script = ${script},
          scenes_json = ${JSON.stringify(scenes)},
          captions_json = ${JSON.stringify(captions)},
          duration_sec = ${durationSec},
          status = 'ready',
          credits_spent = credits_spent + ${CREDIT_COSTS.script},
          updated_at = now()
      where id = ${data.projectId} and user_id = ${context.userId}
    `;
    return { title, script, scenes, captions, durationSec, usedAi: Boolean(ai) };
  });

export const generateVoice = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({ projectId: z.string(), voiceId: z.string(), text: z.string().min(1).max(2500) }).parse(input),
  )
  .handler(async ({ context, data }) => {
    const apiKey = process.env.XAI_API_KEY;
    if (!apiKey) {
      throw new Error("Voice generation is unavailable in this environment.");
    }
    await spendCredits(context.userId, CREDIT_COSTS.voice, "AI voiceover", data.projectId);
    const res = await fetch("https://api.x.ai/v1/tts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        text: data.text.slice(0, 1800),
        voice_id: data.voiceId || "eve",
        language: "en",
      }),
    });
    if (!res.ok) {
      throw new Error(`Voice API error ${res.status}`);
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const voiceData = `data:audio/mpeg;base64,${buf.toString("base64")}`;
    const sql = await getSql();
    await sql`
      update projects
      set voice_id = ${data.voiceId},
          voice_data = ${voiceData},
          credits_spent = credits_spent + ${CREDIT_COSTS.voice},
          updated_at = now()
      where id = ${data.projectId} and user_id = ${context.userId}
    `;
    return { voiceData, voiceId: data.voiceId };
  });

export const generateCaptions = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ projectId: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    await spendCredits(context.userId, CREDIT_COSTS.captions, "Auto captions", data.projectId);
    const sql = await getSql();
    const rows = await sql<{ scenesJson: string; script: string }>`
      select scenes_json as "scenesJson", script from projects
      where id = ${data.projectId} and user_id = ${context.userId}
    `;
    if (!rows[0]) throw new Error("Project not found");
    let scenes: Scene[] = [];
    try {
      scenes = JSON.parse(rows[0].scenesJson || "[]");
    } catch {
      scenes = [];
    }
    if (!scenes.length) scenes = scenesFromScript(rows[0].script, "Short");
    const captions = captionsFromScenes(scenes);
    await sql`
      update projects
      set captions_json = ${JSON.stringify(captions)},
          credits_spent = credits_spent + ${CREDIT_COSTS.captions},
          updated_at = now()
      where id = ${data.projectId} and user_id = ${context.userId}
    `;
    return { captions };
  });

export const markRendered = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ projectId: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    await spendCredits(context.userId, CREDIT_COSTS.render, "Export render", data.projectId);
    const sql = await getSql();
    await sql`
      update profiles
      set videos_this_month = videos_this_month + 1
      where user_id = ${context.userId}
    `;
    await sql`
      update projects
      set status = 'exported',
          credits_spent = credits_spent + ${CREDIT_COSTS.render},
          updated_at = now()
      where id = ${data.projectId} and user_id = ${context.userId}
    `;
    return { ok: true };
  });
