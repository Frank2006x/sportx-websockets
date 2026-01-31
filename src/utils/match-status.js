import { MATCH_STATUS } from "../validation/matches.js";

export function getMatchStatus(endTime, startTime, currentTime = new Date()) {
  const start = new Date(startTime);
  const end = new Date(endTime);

  if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime())) {
    throw new Error("Invalid date format");
  }

  if (currentTime < start) {
    return MATCH_STATUS.SCHEDULED;
  } else if (currentTime >= start && currentTime <= end) {
    return MATCH_STATUS.LIVE;
  } else {
    return MATCH_STATUS.FINISHED;
  }
}
