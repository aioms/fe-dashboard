import { HttpStatusCode } from "Common/constants/http-code-constant";
import { request } from "helpers/axios";
import { ErrorHandler } from "helpers/error/error-handler";
import { IHttpResponse } from "types";
import type { IAiConnection } from "types/ai-connection";

export const getAiConnections = async (): Promise<IAiConnection[]> => {
  const response: IHttpResponse<IAiConnection[]> = await request.get(
    "/ai-connections"
  );
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response.data ?? [];
};

export const revokeAiConnection = async (id: string): Promise<string> => {
  const response: IHttpResponse = await request.delete(
    `/ai-connections/${id}`
  );
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return id;
};
