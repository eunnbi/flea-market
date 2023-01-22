import AlertMessage from "@components/admin/AlertMessage";
import MemberTable from "@components/admin/MemberTable";
import RoleFilter from "@components/admin/RoleFilter";
import CustomHead from "@components/common/CustomHead";
import { getAbsoluteUrl } from "@lib/getAbsoluteUrl";
import { verifyUser } from "@lib/verifyUser";
import { userAPI } from "@api/user";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";

const Admin = ({
  members,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="Dashboard" />
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
  const absoluteUrl = getAbsoluteUrl(req);
  const { redirect, isLogin } = await verifyUser(req, { role: "ADMIN" });
  if (redirect) {
    return {
      redirect,
    };
  }
  const { data } = await userAPI.getUsers(absoluteUrl);
  return {
    props: { members: data, isLogin },
  };
};
