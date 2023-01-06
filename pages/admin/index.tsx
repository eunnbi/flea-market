import AlertMessage from "@components/admin/AlertMessage";
import MemberTable from "@components/admin/MemberTable";
import RoleFilter from "@components/admin/RoleFilter";
import CustomHead from "@components/common/CustomHead";
import Header from "@components/common/Header";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { userAPI } from "api/user";
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
  const absoluteUrl = getAbsoluteUrl(req);
  const { data } = await userAPI.verify({
    absoluteUrl,
    token: cookies.access_token,
  });
  const { verify, user } = data;
  if (verify && user) {
    if (user.role === "ADMIN") {
      const { data } = await userAPI.getUsers(absoluteUrl);
      return { props: { members: data, isLogin: verify } };
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
