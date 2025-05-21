import { format, toZonedTime } from "date-fns-tz";

export function getNewDate(date = new Date()) {
  const timeZone = "Asia/Jakarta";
  const zonedDate = toZonedTime(date, timeZone);
  return format(zonedDate, "yyyy-MM-dd HH:mm:ss", { timeZone });
}
