import { HttpStatusCode } from "Common/constants/http-code-constant";
import { request } from "helpers/axios";
import { ErrorHandler } from "helpers/error/error-handler";
import { convertObjToQueryString } from "helpers/utils";
import { TransactionSummaryResponse } from "pages/Dashboards/SummaryReport/types";

export const getTransactionSummary = async (payload: Record<string, string | number>) => {
  const query = convertObjToQueryString(payload);

  const response: any = await request.get(`/transactions/summary?${query}`);
  const { isHasError, message } = ErrorHandler.checkResponse(
    response,
    HttpStatusCode.OK
  );

  if (isHasError) {
    throw new Error(message);
  }

  return response as TransactionSummaryResponse;
};
