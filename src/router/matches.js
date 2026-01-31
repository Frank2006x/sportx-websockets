import { Router } from "express";
import { createMatchSchema,listMatchesQuerySchema } from "../validation/matches.js";
import { db } from "../db/db.js";
import { matches } from "../db/schema.js";
import { getMatchStatus } from "../utils/match-status.js";
import { desc } from "drizzle-orm";

const matchesRouter = new Router();
const MAX_LIMIT = 100;
matchesRouter.get("/", async (req, res) => {
    const parsed=listMatchesQuerySchema.safeParse(req.query);
    if(!parsed.success){
        return res.status(400).json({error:parsed.error});
    }
    const limit=Math.min(parsed.data.limit ?? 50 , MAX_LIMIT);

    try{
        const allMatches=await db.select().from(matches).orderBy((desc(matches.createdAt))).limit(limit);
        return res.status(200).json({data: allMatches});
    }catch(err){
        return res.status(500).json({error:"Internal server error"});
    }
});

matchesRouter.post("/", async (req, res) => {
  console.log("Request Body:", req.body); // Debugging line
  let parsed = createMatchSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error });
  }
  const {
    data: { startTime, endTime, homeScore, awayScore },
  } = parsed;

  try {
    const [event] = await db
      .insert(matches)
      .values({
        ...parsed.data,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        status: getMatchStatus(endTime, startTime),
        homeScore: homeScore || 0,
        awayScore: awayScore || 0,
      })
      .returning();

    return res.status(201).json(event);
  } catch (err) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default matchesRouter;
