import type { DutyLog } from "../types";

interface GenerateLogParams {
  startTime: number; // starting hour of day (e.g. 6 = 06:00)
  totalDriveHrs: number; // total drive time for trip (hrs)
  pickupHrs?: number; // default 1 hr
  dropoffHrs?: number; // default 1 hr
  maxDrivePerDay?: number; // default 11
  maxWorkDay?: number; // default 14
  restBreak?: number; // default 10 (hrs rest between days)
}

export function generateLogs({
  startTime,
  totalDriveHrs,
  pickupHrs = 1,
  dropoffHrs = 1,
  maxDrivePerDay = 11,
  maxWorkDay = 14,
  restBreak = 10,
}: GenerateLogParams): DutyLog[] {
  let remainingDrive = totalDriveHrs;
  let logs: DutyLog[] = [];
  let currentDay = 1;
  let cursor = startTime; // current hour pointer

  while (remainingDrive > 0) {
    let driveToday = Math.min(remainingDrive, maxDrivePerDay);
    let workStart = cursor;
    let workEnd = cursor;

    // 1️⃣ Pickup on Day 1 only
    if (currentDay === 1 && pickupHrs > 0) {
      logs.push({
        day: currentDay,
        status: "onduty",
        start: workEnd,
        end: workEnd + pickupHrs,
      });
      workEnd += pickupHrs;
    }

    // 2️⃣ Driving (may need 30 min break if > 8 hrs)
    if (driveToday > 8) {
      // drive first 8 hrs
      logs.push({
        day: currentDay,
        status: "drive",
        start: workEnd,
        end: workEnd + 8,
      });
      workEnd += 8;

      // 30-min break
      logs.push({
        day: currentDay,
        status: "off",
        start: workEnd,
        end: workEnd + 0.5,
      });
      workEnd += 0.5;

      // drive remaining hrs
      const remainingAfterBreak = driveToday - 8;
      logs.push({
        day: currentDay,
        status: "drive",
        start: workEnd,
        end: workEnd + remainingAfterBreak,
      });
      workEnd += remainingAfterBreak;
    } else {
      logs.push({
        day: currentDay,
        status: "drive",
        start: workEnd,
        end: workEnd + driveToday,
      });
      workEnd += driveToday;
    }

    // 3️⃣ Drop-off only if this is last day
    remainingDrive -= driveToday;
    if (remainingDrive <= 0 && dropoffHrs > 0) {
      logs.push({
        day: currentDay,
        status: "onduty",
        start: workEnd,
        end: workEnd + dropoffHrs,
      });
      workEnd += dropoffHrs;
    }

    // 4️⃣ End of Day: 10 hr off-duty rest if there’s still drive left
    if (remainingDrive > 0) {
      logs.push({
        day: currentDay,
        status: "off",
        start: workEnd,
        end: workEnd + restBreak,
      });
      workEnd += restBreak;
    }

    // move to next day start (6 AM typical start, adjust if you want)
    cursor = workEnd % 24;
    if (cursor < startTime) cursor = startTime;
    currentDay++;
  }

  return logs;
}
