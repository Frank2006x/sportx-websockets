import { z } from "zod";

export const MATCH_STATUS = {
  SCHEDULED: "SCHEDULED",
  LIVE: "LIVE",
  FINISHED: "FINISHED",
};

export const listMatchesQuerySchema = z.object({
  limit: z.coerce.number().int().positive().max(100).optional(),
});

export const matchIdParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});

// Match status enum validation to match database enum
export const matchStatusSchema = z.enum(["SCHEDULED", "LIVE", "FINISHED"]);

export const createMatchSchema = z
  .object({
    sport: z.string().min(1),
    homeTeam: z.string().min(1),
    awayTeam: z.string().min(1),
    status: matchStatusSchema.optional(),
    startTime: z.iso.datetime(),
    endTime: z.iso.datetime(),
    homeScore: z.coerce.number().int().nonnegative().optional(),
    awayScore: z.coerce.number().int().nonnegative().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.startTime && data.endTime) {
      const start = new Date(data.startTime);
      const end = new Date(data.endTime);
      if (end <= start) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "endTime must be chronologically after startTime",
          path: ["endTime"],
        });
      }
    }
  });

// Commentary validation schemas to match database schema
export const createCommentarySchema = z.object({
  matchId: z.coerce.number().int().positive(),
  minute: z.coerce.number().int().min(0).optional(),
  sequence: z.coerce.number().int().min(0).optional(),
  period: z.string().optional(),
  eventType: z.string().optional(),
  author: z.string().optional(),
  team: z.string().optional(),
  message: z.string().min(1),
  metadata: z.record(z.any()).optional(),
  tags: z.array(z.string()).optional(),
});

export const updateScoreSchema = z.object({
  homeScore: z.coerce.number().int().nonnegative(),
  awayScore: z.coerce.number().int().nonnegative(),
});
