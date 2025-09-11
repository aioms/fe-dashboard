import { HttpStatusCode } from "Common/constants/http-code-constant";
import { request } from "helpers/axios";
import { ErrorHandler } from "helpers/error/error-handler";
import { convertObjToQueryString } from "helpers/utils";
import { IHttpResponse } from "types";

export const getOrders = async (payload: Record<string, string | number>) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(`/orders?${query}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return {
    data: response.data,
    metadata: response.metadata,
  };
};

export const getOrder = async (id: string) => {
  const response: IHttpResponse = await request.get(`/orders/${id}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

export const createOrder = async (payload: Record<string, any>) => {
  const response: IHttpResponse = await request.post(`/orders`, payload);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.CREATED
  );

  if (isHasError) {
    throw new Error(message);
  }

  const { id, code, orderCode } = response.data;
  const data = {
    ...payload,
    id,
    code,
    orderCode,
  };

  return data;
};

export const updateOrder = async (payload: Record<string, any>) => {
  const { id, ...body } = payload;
  const response: IHttpResponse = await request.put(`/orders/${id}`, body);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return {
    id: response.data?.id,
    ...body,
  };
};