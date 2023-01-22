import { User } from "@prisma/client";
import { userAPI } from "api/user";
import { IncomingMessage } from "http";
import axios from "axios";
import { getAbsoluteUrl } from "./getAbsoluteUrl";

export const verifyUser = async (
  req: IncomingMessage & {
    cookies: Partial<{
      [key: string]: string;
    }>;
  },
  options: {
    role: User["role"];
    login?: false;
  }
) => {
  const { cookies } = req;
  const absoluteUrl = getAbsoluteUrl(req);
  const token = cookies.access_token;
  axios.defaults.headers.common["Authorization"] = token
    ? `Bearer ${token}`
    : "";
  const { data } = await userAPI.verify(absoluteUrl);
  const { verify, user } = data;
  if (user && user.role === options.role) {
    return {
      redirect: null,
      isLogin: verify,
      token: token || null,
      user,
    };
  } else if (user) {
    if (user.role === "SELLER") {
      return {
        redirect: {
          destination: "/sell",
          permanent: false,
        },
      };
    }
    if (user.role === "ADMIN") {
      return {
        redirect: {
          destination: "/admin",
          permanent: false,
        },
      };
    }
  } else if (options.login === false) {
    return {
      redirect: null,
      isLogin: verify,
      token: token || null,
      user,
    };
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
