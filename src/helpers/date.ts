import dayjs from "dayjs";
import timezone from "dayjs/plugin/timezone";
import utc from 'dayjs/plugin/utc';

dayjs.extend(utc);
dayjs.extend(timezone)
dayjs.tz.setDefault("Asia/Ho_Chi_Minh");

export const convertToUTC = (date: Date) => {
  return dayjs.utc(date);
}

export const getDate = (date: Date | string = new Date()) => {
  return dayjs(date);
}

export const formatDate = (date: Date | string) => {
  return dayjs(date).format("DD/MM/YYYY");
}