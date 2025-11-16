import { Environment } from "Common/enums/common-enum";

export const isDev = process.env.REACT_APP_ENV === "development";

export const getEnvironment = (): Environment => {
  const env = process.env.REACT_APP_ENV;

  switch (env) {
    case "production":
      return Environment.PRODUCTION;
    case "staging":
      return Environment.STAGING;
    case "development":
      return Environment.DEVELOPMENT;
    default:
      throw new Error("Invalid environment");
  }
};

export const getS3ImageUrl = (path: string) => {
  // Check if path start with http, if so, return path as is
  if (path.startsWith('http')) {
    return path;
  }

  return `${process.env.REACT_APP_S3_URL}/${process.env.REACT_APP_S3_BUCKET}/${path}`;
}

export const convertObjToQueryString = (params: Record<string, any>) => {
  return Object.keys(params)
    .filter((key) => params[key] !== undefined && params[key] !== null && params[key] !== "")
    .map((key) => key + "=" + encodeURIComponent(params[key]))
    .join("&");
};

export const cleanObject = <T extends Record<string, any>>(obj: T): Partial<T> => {
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

export const formatDateTime = (dateString: string) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false
  });
};

export const formatDateTimeLong = (dateString: string) => {
  if (!dateString) return "";
  
  const date = new Date(dateString);
  return date.toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true
  });
};

export const isHasKey = (obj: Record<string, any>) => {
  return Object.keys(obj).length;
};

export const parseCurrencyInput = (value: string): number => {
  // Remove all non-digit characters and parse to number
  return parseInt(value.replace(/\D/g, "")) || 0;
};
