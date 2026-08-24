import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import type { CaptionCue, Project, ProjectType, Scene } from "@/lib/types";
import { z } from "zod";

type ProjectRow = {
  id: string;
  userId: string;
  title: string;
  type: ProjectType;
  status: string;
  script: string;
  voiceId: string;
  voiceData: string | null;
  captionsJson: string;
  scenesJson: string;
  sourceUrl: string | null;
  durationSec: number;
  creditsSpent: number;
  createdAt: string;
  updatedAt: string;
};

function mapProject(row: ProjectRow): Project {
  let captions: CaptionCue[] = [];
  let scenes: Scene[] = [];
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
    updatedAt: row.updatedAt,
  };
}

const createSchema = z.object({
  title: z.string().min(1).max(120),
  type: z.enum(["story", "commentary", "ranking", "clip"]),
  sourceUrl: z.string().optional(),
});

export const listProjects = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<ProjectRow>`
      select id, user_id as "userId", title, type, status, script,
             voice_id as "voiceId", voice_data as "voiceData",
             captions_json as "captionsJson", scenes_json as "scenesJson",
             source_url as "sourceUrl", duration_sec as "durationSec",
             credits_spent as "creditsSpent",
             created_at as "createdAt", updated_at as "updatedAt"
      from projects
      where user_id = ${context.userId}
      order by updated_at desc
    `;
    return rows.map(mapProject);
  });

export const getProject = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const rows = await sql<ProjectRow>`
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

export const createProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => createSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const id = crypto.randomUUID();
    await sql`
      insert into projects (id, user_id, title, type, source_url)
      values (${id}, ${context.userId}, ${data.title}, ${data.type}, ${data.sourceUrl ?? null})
    `;
    const rows = await sql<ProjectRow>`
      select id, user_id as "userId", title, type, status, script,
             voice_id as "voiceId", voice_data as "voiceData",
             captions_json as "captionsJson", scenes_json as "scenesJson",
             source_url as "sourceUrl", duration_sec as "durationSec",
             credits_spent as "creditsSpent",
             created_at as "createdAt", updated_at as "updatedAt"
      from projects where id = ${id} and user_id = ${context.userId}
    `;
    return mapProject(rows[0]);
  });

const saveSchema = z.object({
  id: z.string(),
  title: z.string().min(1).max(120).optional(),
  script: z.string().optional(),
  voiceId: z.string().optional(),
  scenes: z
    .array(
      z.object({
        id: z.string(),
        text: z.string(),
        caption: z.string(),
        durationSec: z.number(),
        visualHint: z.string(),
      }),
    )
    .optional(),
  captions: z
    .array(z.object({ start: z.number(), end: z.number(), text: z.string() }))
    .optional(),
  status: z.string().optional(),
  durationSec: z.number().optional(),
});

export const saveProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => saveSchema.parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const existing = await sql<ProjectRow>`
      select id, user_id as "userId", title, type, status, script,
             voice_id as "voiceId", voice_data as "voiceData",
             captions_json as "captionsJson", scenes_json as "scenesJson",
             source_url as "sourceUrl", duration_sec as "durationSec",
             credits_spent as "creditsSpent",
             created_at as "createdAt", updated_at as "updatedAt"
      from projects where id = ${data.id} and user_id = ${context.userId}
    `;
    if (!existing[0]) throw new Error("Project not found");
    const title = data.title ?? existing[0].title;
    const script = data.script ?? existing[0].script;
    const voiceId = data.voiceId ?? existing[0].voiceId;
    const scenesJson = data.scenes
      ? JSON.stringify(data.scenes)
      : existing[0].scenesJson;
    const captionsJson = data.captions
      ? JSON.stringify(data.captions)
      : existing[0].captionsJson;
    const status = data.status ?? existing[0].status;
    const durationSec = data.durationSec ?? existing[0].durationSec;
    await sql`
      update projects
      set title = ${title},
          script = ${script},
          voice_id = ${voiceId},
          scenes_json = ${scenesJson},
          captions_json = ${captionsJson},
          status = ${status},
          duration_sec = ${durationSec},
          updated_at = now()
      where id = ${data.id} and user_id = ${context.userId}
    `;
    return getProject({ data: { id: data.id } });
  });

export const deleteProject = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ id: z.string() }).parse(input))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`delete from projects where id = ${data.id} and user_id = ${context.userId}`;
    return { ok: true };
  });
