import axios from "axios";
import type { IExtraConfig, IHttpRequestConfig } from "../../types";

const {
  REACT_APP_ENV,
  REACT_APP_API_VERSION,

  REACT_APP_API_URL_LOCAL,
  REACT_APP_SERVER_URL_LOCAL,

  REACT_APP_API_URL_STG,
  REACT_APP_SERVER_URL_STG,

  REACT_APP_API_URL_PROD,
  REACT_APP_SERVER_URL_PROD,
} = process.env;

const serverUrl: Record<string, string> = {
  development: REACT_APP_SERVER_URL_LOCAL!,
  staging: REACT_APP_SERVER_URL_STG!,
  production: REACT_APP_SERVER_URL_PROD!,
};
const apiUrl: Record<string, string> = {
  development: REACT_APP_API_URL_LOCAL!,
  staging: REACT_APP_API_URL_STG!,
  production: REACT_APP_API_URL_PROD!,
};

export const defaultConfig: IHttpRequestConfig = {
  server: {
    api: apiUrl[REACT_APP_ENV!],
    baseUrl: serverUrl[REACT_APP_ENV!],
    version: REACT_APP_API_VERSION!,
    headers: {
      "Content-Type": "application/json",
    },
  },
};

export class HttpRequest {
  private config: Partial<IExtraConfig> = {};

  public addVersion(v: string | boolean) {
    if (typeof v === "boolean" && v) {
      this.config.apiVersion = defaultConfig.server.version;
    } else if (typeof v === "string") {
      this.config.apiVersion = v;
    }

    return this.init();
  }

  public addHeaders(headers: Record<string, any>) {
    this.config.headers = headers;
  }

  public init() {
    const { apiVersion, headers } = this.config;
    const { api, headers: _headers } = defaultConfig.server;

    const options: Record<string, any> = {
      baseURL: api,
      headers: _headers,
      withCredentials: false,
    };

    if (apiVersion) {
      options.baseURL = `${api}/${apiVersion}`;
    }

    if (headers && Object.keys(headers).length) {
      Object.keys(headers).forEach((key) => {
        options.headers[key] = headers[key];
      });
    }

    const instance = axios.create(options);

    instance.interceptors.request.use(
      function (config) {
        const token = localStorage.getItem("jwt"); // Retrieve the token from localStorage
        if (token) {
          config.headers.Authorization = `Bearer ${token}`; // Attach the token to the Authorization header
        }
        return config;
      },
      function (error) {
        // Do something with request error
        return Promise.reject(error);
      },
    );

    instance.interceptors.response.use(
      function (response) {
        if (response.status === 204) {
          return {
            statusCode: response.status,
            statusText: response.statusText,
          };
        }

        return response.data;
      },
      function (error) {
        const resp = error.response;
        const data = resp?.data;
        console.log({ data, resp, error });

        if (resp.status === 401 || resp.statusText === "Unauthorized") {
          localStorage.removeItem("jwt");
          localStorage.removeItem("authUser");
          window.location.replace("/login");
        }

        return data;
      },
    );

    return instance;
  }
}

const initHttpRequest = Object.freeze(new HttpRequest());

export const request = initHttpRequest.addVersion(true);
export default initHttpRequest;
