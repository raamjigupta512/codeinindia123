/**
 * Utility to calculate upcoming Friday and Tuesday live batch dates dynamically based on current calendar time.
 * Target time: 07:00 PM (19:00).
 * Once Friday 07:00 PM passes, the upcoming batch automatically switches to Tuesday 07:00 PM, and vice versa.
 */

export interface BatchSchedule {
  nextTuesday: Date;
  nextFriday: Date;
  nearestBatch: Date;
  isNearestFriday: boolean;
  nextTuesdayFormatted: string;
  nextFridayFormatted: string;
  nearestBatchFormatted: string;
  nearestBatchFullFormatted: string;
  shortTuesdayFormatted: string;
  shortFridayFormatted: string;
  combinedShortDates: string;
}

export function getUpcomingBatchSchedule(now: Date = new Date()): BatchSchedule {
  const current = new Date(now);

  const getNextDayOfWeek = (targetDay: number): Date => {
    const result = new Date(current);
    const currentDay = result.getDay();
    let daysToAdd = (targetDay - currentDay + 7) % 7;
    
    // If today is targetDay, check if 7:00 PM (19:00) has passed
    if (daysToAdd === 0 && (result.getHours() > 19 || (result.getHours() === 19 && result.getMinutes() > 0))) {
      daysToAdd = 7;
    }

    result.setDate(result.getDate() + daysToAdd);
    result.setHours(19, 0, 0, 0); // 7:00 PM
    return result;
  };

  const nextTuesday = getNextDayOfWeek(2); // Tuesday = 2
  const nextFriday = getNextDayOfWeek(5);  // Friday = 5

  const isNearestFriday = nextFriday.getTime() < nextTuesday.getTime();
  const nearestBatch = isNearestFriday ? nextFriday : nextTuesday;

  const dateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  const fullDateOpts: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  };

  const shortOpts: Intl.DateTimeFormatOptions = {
    weekday: 'short',
    day: 'numeric',
    month: 'short'
  };

  const fmt = (d: Date, opts: Intl.DateTimeFormatOptions) => new Intl.DateTimeFormat('en-IN', opts).format(d);

  const nextTuesdayFormatted = fmt(nextTuesday, dateOpts);
  const nextFridayFormatted = fmt(nextFriday, dateOpts);
  const nearestBatchFormatted = fmt(nearestBatch, dateOpts);
  const nearestBatchFullFormatted = fmt(nearestBatch, fullDateOpts);

  const shortTuesdayFormatted = fmt(nextTuesday, shortOpts);
  const shortFridayFormatted = fmt(nextFriday, shortOpts);

  const combinedShortDates = `${shortFridayFormatted} & ${shortTuesdayFormatted}`;

  return {
    nextTuesday,
    nextFriday,
    nearestBatch,
    isNearestFriday,
    nextTuesdayFormatted,
    nextFridayFormatted,
    nearestBatchFormatted,
    nearestBatchFullFormatted,
    shortTuesdayFormatted,
    shortFridayFormatted,
    combinedShortDates
  };
}
