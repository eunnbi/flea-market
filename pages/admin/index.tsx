import AlertMessage from "@components/admin/AlertMessage";
import MemberTable from "@components/admin/MemberTable";
import RoleFilter from "@components/admin/RoleFilter";
import CustomHead from "@components/common/CustomHead";
import Header from "@components/common/Header";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { User } from "@prisma/client";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

const Admin = ({
  members,
  isLogin,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="Dashboard" />
      <Header isLogin={isLogin} />
      <main className="flex flex-col items-center gap-10">
        <h1 className="font-bold text-2xl">Member Management</h1>
        <AlertMessage />
        <RoleFilter />
        <MemberTable initialMembers={members} />
      </main>
    </>
  );
};

export default Admin;

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const res = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token
        ? `Bearer ${cookies.access_token}`
        : "Bearer ",
    },
  });
  const { verify, user } = await res.json();
  if (verify) {
    if (user.role === "ADMIN") {
      const response = await fetch(`${baseUrl}/api/user`, {
        method: "GET",
      });
      const members: User[] = await response.json();
      return { props: { members, isLogin: verify } };
    }
    if (user.role === "SELLER") {
      return {
        redirect: {
          destination: "/sell",
          permanent: false,
        },
      };
    }
  }
  return {
    redirect: {
      destination: "/",
      permanent: false,
    },
  };
};
