import { Environment } from "Common/enums/common-enum";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

// Extend dayjs with plugins
dayjs.extend(utc);
dayjs.extend(timezone);

export const isDev = process.env.REACT_APP_ENV === "development";

export const getEnvironment = (): Environment => {
  const env = process.env.REACT_APP_ENV as Environment;
  const validEnvs = [Environment.PRODUCTION, Environment.STAGING, Environment.DEVELOPMENT];

  if (!env || !validEnvs.includes(env)) {
    throw new Error("Invalid environment");
  }

  return env;
};

export const getS3ImageUrl = (path: string) => {
  if (!path) return "";

  // Check if path start with http, if so, return path as is
  if (path.startsWith("http")) {
    return path;
  }

  const {
    REACT_APP_ENABLE_CDN,
    REACT_APP_CDN_URL,
    REACT_APP_S3_URL,
    REACT_APP_S3_BUCKET,
  } = process.env;

  if (REACT_APP_ENABLE_CDN === "true") {
    return `${REACT_APP_CDN_URL}/${REACT_APP_S3_BUCKET}/${path}`;
  }

  return `${REACT_APP_S3_URL}/${REACT_APP_S3_BUCKET}/${path}`;
};

export const convertObjToQueryString = (params: Record<string, any>) => {
  return Object.keys(params)
    .filter(
      (key) =>
        params[key] !== undefined && params[key] !== null && params[key] !== "",
    )
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
};

export const cleanObject = <T extends Record<string, any>>(
  obj: T,
): Partial<T> => {
  const cleaned: Partial<T> = {};

  Object.keys(obj).forEach((key) => {
    const value = obj[key];
    if (value !== undefined && value !== null && value !== "") {
      cleaned[key as keyof T] = value;
    }
  });

  return cleaned;
};

export const formatMoney = (amount: number) => {
  if (!amount) return "";
  return amount.toLocaleString("vi-VN", { currency: "VND" });
};

export const formatMoneyWithVND = (amount: number) => {
  if (!amount) return "";

  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export const formatNumberWithSeparator = (number: number) => {
  if (!number && number !== 0) return "";
  return number.toLocaleString("vi-VN");
};

export const formatDateTime = (dateString: string, convertFromUTC: boolean = false, format: string = "DD/MM/YYYY HH:mm") => {
  if (!dateString) return "";

  let date = dayjs(dateString);

  // Convert from UTC to local time if requested
  if (convertFromUTC) {
    date = date.utc(true).local();
  }

  return date.format(format);
};

export const formatDateTimeLocale = (dateString: string) => {
  if (!dateString) return "";

  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });
};

export const isHasKey = (obj: Record<string, any>) => {
  return Object.keys(obj).length;
};

export const parseCurrencyInput = (value: string): number => {
  // Remove all non-digit characters and parse to number
  return parseInt(value.replace(/\D/g, "")) || 0;
};
