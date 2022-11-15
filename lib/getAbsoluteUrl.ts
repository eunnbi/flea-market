import { GetServerSidePropsContext } from "next";

export const getAbsoluteUrl = (
  req: GetServerSidePropsContext["req"]
) => {
  const protocol = req.headers["x-forwarded-proto"] || "http";
  const host = req.headers["x-forwarded-host"] || req.headers["host"];
  const url = `${protocol}://${host}`;
  return url;
};