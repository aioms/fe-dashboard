import { HttpStatusCode } from "Common/constants/http-code-constant";
import { request } from "helpers/axios";
import { ErrorHandler } from "helpers/error/error-handler";
import { convertObjToQueryString } from "helpers/utils";
import { IHttpResponse } from "types";

const PREFIX_PATH = "inventory";

export const getTotalInventory = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(`/${PREFIX_PATH}/total?${query}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

export const getTotalValueInventory = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(`/${PREFIX_PATH}/value?${query}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

export const getTotalOfImportNew = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/import-new?${query}`
  );
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

export const getTotalOfReturn = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/return?${query}`
  );
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

export const getImportProductsDataset = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/import-products?${query}`
  );

  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
}

export const getTotalInventoryByCategory = async (category: string) => {
  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/category/total?category=${category}`
  );

  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
}

export const getInventoryByCategory = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/category?${query}`
  );

  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response;
}

export const getProductInventoryTurnOver = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/turnover?${query}`
  );

  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response;
}

export const getTopInventoryProducts = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/top-stock?${query}`
  );

  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response;
}

export const getDeadInventoryProducts = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/dead-stock?${query}`
  );

  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response;
}

export const getOutOfStockProducts = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(
    `/${PREFIX_PATH}/out-of-stock-dates?${query}`
  );

  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response;
}