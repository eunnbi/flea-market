import MemberTable from '@components/admin/MemberTable';
import CustomHead from '@components/common/CustomHead';
import Header from '@components/common/Header';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { User } from '@prisma/client';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const Admin = ({ members, isLogin }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="Dashboard" />
      <Header isLogin={isLogin} />
      <Main>
        <h1>Member Management</h1>
        <MemberTable initialMembers={members} />
      </Main>
    </>
  );
};

const Main = styled.main`
  padding: 0 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
`;

export default Admin;

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const { cookies } = req;
  const baseUrl = getAbsoluteUrl(req);
  const res = await fetch(`${baseUrl}/api/user/verify`, {
    headers: {
      Authorization: cookies.access_token ? `Bearer ${cookies.access_token}` : 'Bearer ',
    },
  });
  const { verify, user } = await res.json();
  if (verify) {
    if (user.role === 'ADMIN') {
      const response = await fetch(`${baseUrl}/api/user`, {
        method: 'GET',
      });
      const members: User[] = await response.json();
      return { props: { members, isLogin: verify } };
    }
    if (user.role === 'SELLER') {
      return {
        redirect: {
          destination: '/sell',
          permanent: false,
        },
      };
    }
  }
  return {
    redirect: {
      destination: '/',
      permanent: false,
    },
  };
};
