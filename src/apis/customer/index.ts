import { HttpStatusCode } from "Common/constants/http-code-constant";
import { request } from "helpers/axios";
import { ErrorHandler } from "helpers/error/error-handler";
import { convertObjToQueryString } from "helpers/utils";
import { IHttpResponse } from "types";

export const getCustomers = async (
  payload: Record<string, string | number>
) => {
  const query = convertObjToQueryString(payload);

  const response: IHttpResponse = await request.get(`/customers?${query}`);
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

export const getCustomer = async (
  id: string
) => {
  const response: IHttpResponse = await request.get(`/customers/${id}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data;
};

export const createCustomer = async (payload: Record<string, any>) => {
  const response: IHttpResponse = await request.post(`/customers`, payload);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.CREATED
  );

  if (isHasError) {
    throw new Error(message);
  }

  const { id } = response.data;
  const data = {
    id,
    ...payload,
  };

  return data;
};

export const updateCustomer = async (payload: Record<string, any>) => {
  const { id, ...body } = payload;
  const response: IHttpResponse = await request.put(
    `/customers/${id}`,
    body
  );
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

export const deleteCustomer = async (id: string) => {
  const response: IHttpResponse = await request.delete(`/customers/${id}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.NO_CONTENT
  );

  if (isHasError) {
    throw new Error(message);
  }

  return id;
};
