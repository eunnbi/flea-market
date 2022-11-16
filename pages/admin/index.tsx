import MemberTable from '@components/admin/MemberTable';
import CustomHead from '@components/common/CustomHead';
import styled from '@emotion/styled';
import { getAbsoluteUrl } from '@lib/getAbsoluteUrl';
import { User } from '@prisma/client';
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next';

const Admin = ({ members }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <>
      <CustomHead title="Dashboard" />
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
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user`, {
    method: 'GET',
  });
  const members: User[] = await response.json();

  // Convert the updatedAt and createdAt in each user to string
  // Otherwise, Next.js will throw an error
  // Not required if you are not using the date fields

  return { props: { members } };
};
