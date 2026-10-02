import { type AxiosResponse, type Method } from "axios";
import axios from "#/infra/http/axios-client";

type Resp = any;

const getMethod = (method: Method) =>
  (
    ({
      GET: axios.get,
      DELETE: axios.delete,
      HEAD: axios.head,
      POST: axios.post,
      PUT: axios.put,
      PATCH: axios.patch,
    }) as any
  )[method];

export const getIsOk = (res: AxiosResponse<any>) =>
  [200, 202, 201, 204, 203].includes(res.status);

const getErrorObj = (data: any) => {
  return data || { errors: [] };
};

export const getPath = (path: string, method: Method, props: any) => {
  if (["DELETE", "GET"].includes(method)) {
    return `${path}${
      props
        ? `?${Object.entries(props)
            .filter((e) => e[1] !== undefined)
            .map((e) => e.join("="))
            .join("&")}`
        : ""
    }`;
  }

  return path;
};

export const callAction = <T>(
  path: string,
  method: Method,
  isForm?: boolean,
): ((props?: T) => Promise<Resp>) => {
  const action = (props?: T, ops?: any) => {
    return getMethod(method)(getPath(path, method, props), props, ops)
      .then((res: AxiosResponse<any>) => {
        if (isForm) {
          if (!getIsOk(res)) {
            return { errors: getErrorObj(res.data) };
          }
          return res.data;
        } else if (!getIsOk(res)) {
          return null;
        }

        return res.data;
      })
      .catch(({ response }: any) => {
        if (response?.status >= 500) {
          throw response;
        }

        if (isForm) {
          return { errors: getErrorObj(response?.data as any) };
        }

        return response?.data as any;
      });
  };

  (action as any).queryKey = `${method}:${path}`;

  return action as (props?: T) => Promise<Resp>;
};

export const callActionWithId = <T>(
  path: string,
  method: Method,
  isForm?: boolean,
  options?: {
    customUrlFunc?: (id: any, props: any) => string;
  },
): ((id: any, props?: T) => Promise<Resp | null>) => {
  return (id: any, props?: T) => {
    return getMethod(method)(
      options?.customUrlFunc?.(id, props) || path.replace(/{.+}/, id),
      props,
    )
      .then((res: AxiosResponse<any>) => {
        if (isForm) {
          if (!getIsOk(res)) {
            console.error("Failed to perform action");
            return { errors: getErrorObj(res.data) };
          }
          return res.data;
        } else if (!getIsOk(res)) {
          console.error("Failed to perform action");
          return null;
        }

        return res.data;
      })
      .catch(({ response }: any) => {
        if (response?.status >= 500) {
          throw response;
        }

        if (isForm) {
          return { errors: getErrorObj(response?.data as any) };
        }
        return response?.data as any;
      });
  };
};
