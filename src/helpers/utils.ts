export const isDev = process.env.REACT_APP_ENV === "development";

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
