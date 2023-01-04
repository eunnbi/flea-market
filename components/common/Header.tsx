import styled from "@emotion/styled";
import { Button, IconButton } from "@mui/material";
import Link from "next/link";
import { useRouter } from "next/router";
import axios from "axios";
import React, { useState } from "react";
import LoginForm from "@components/auth/LoginForm";
import { BiMenu } from "react-icons/bi";

const getHeaderInfo = (pathname: string, isLogin: boolean) => {
  const page = pathname.split("/")[1];
  if (page === "admin") {
    return {
      basePath: `/${page}`,
      NAV: [],
    };
  } else if (page === "sell") {
    return {
      basePath: `/${page}`,
      NAV: [{ to: "/sell/register", name: "Register Product" }],
    };
  } else {
    return {
      basePath: "/",
      NAV: isLogin
        ? [
            { to: "/products/search", name: "Search Product" },
            { to: "/shopping", name: "Shopping List" },
            { to: "/wishlist", name: "Wish List" },
          ]
        : [],
    };
  }
};

const buttonClassName =
  "text-white border-white hover:border-white max-md:w-full max-md:py-4 max-md:text-center ";

const navClassName =
  "flex gap-8 items-center z-10 text-lg max-md:flex-col max-md:gap-0";

const linkClassName = "max-md:w-full max-md:text-center max-md:py-4";
const activeLinkClassName = `${linkClassName} font-bold`;

const Header = ({ isLogin }: { isLogin: boolean }) => {
  const router = useRouter();
  const { pathname, query } = router;
  const [open, setOpen] = useState(false);
  const { basePath, NAV } = getHeaderInfo(pathname, isLogin);
  const onLogout = () => {
    axios.post("/api/auth/logout").then(() => {
      router.push("/");
    });
  };
  const onToggle = () => setOpen((open) => !open);
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-10 text-white bg-black h-header">
        <div className="flex justify-between items-center max-w-screen-lg h-full mx-auto my-0 px-4 max-md:px-0 max-md:block">
          <div className="flex justify-between items-center h-full max-md:px-4 max-md:w-full">
            <Link href={basePath}>
              <h1 className="text-4xl">
                {basePath === "/admin" ? "DashBoard" : "Flea Market"}
              </h1>
            </Link>
            <IconButton
              sx={{ color: "white" }}
              className="hidden max-md:block"
              onClick={onToggle}
            >
              <BiMenu className="text-4xl" />
            </IconButton>
          </div>
          <div className="flex items-center gap-12 max-md:hidden">
            <nav className={navClassName}>
              {NAV.map((elem, index) => (
                <Link
                  className={
                    elem.to === pathname ? activeLinkClassName : linkClassName
                  }
                  key={index}
                  href={elem.to}
                >
                  {elem.name}
                </Link>
              ))}
            </nav>
            {!isLogin ? (
              <Button
                variant="outlined"
                className={buttonClassName}
                onClick={() =>
                  router.push(
                    `${window.location.pathname}?login=true`,
                    window.location.pathname
                  )
                }
              >
                로그인
              </Button>
            ) : (
              <Button
                variant="outlined"
                className={buttonClassName}
                onClick={onLogout}
              >
                로그아웃
              </Button>
            )}
          </div>
          <div className={open ? "hidden max-md:block bg-black" : "hidden"}>
            <nav className={navClassName}>
              {NAV.map((elem, index) => (
                <Link
                  className={
                    elem.to === pathname ? activeLinkClassName : linkClassName
                  }
                  key={index}
                  href={elem.to}
                >
                  {elem.name}
                </Link>
              ))}
            </nav>
            {!isLogin ? (
              <Button
                onClick={() =>
                  router.push(
                    `${window.location.pathname}?login=true`,
                    window.location.pathname
                  )
                }
                className={buttonClassName}
              >
                로그인
              </Button>
            ) : (
              <Button onClick={onLogout} className={buttonClassName}>
                로그아웃
              </Button>
            )}
          </div>
        </div>
      </header>
      {!isLogin && query && query.login && <LoginForm />}
    </>
  );
};

export default React.memo(Header);
