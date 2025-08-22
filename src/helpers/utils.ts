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

export const convertObjToQueryString = (params: Record<string, any>) => {
  return Object.keys(params)
    .map((key) => key + "=" + params[key])
    .join("&");
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

export const isHasKey = (obj: Record<string, any>) => {
  return Object.keys(obj).length;
};