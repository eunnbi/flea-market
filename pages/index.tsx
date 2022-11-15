import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import React from 'react'
import { getAbsoluteUrl } from '../lib/getAbsoluteUrl'

const Homepage = ({ users }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  return (
    <div>
      {users.map((user: User) => (
        <div key={user.id}>
          <p>{user.id}</p>
          <p>{user.birthYear}</p>
          <p>{user.name}</p>
        </div>
      ))}
    </div>
  )
}

export const getServerSideProps = async ({ req }: GetServerSidePropsContext) => {
  const baseUrl = getAbsoluteUrl(req);
  const response = await fetch(`${baseUrl}/api/user`, {
    method: "GET"
  });
  const users = await response.json();

  // Convert the updatedAt and createdAt in each user to string
  // Otherwise, Next.js will throw an error
  // Not required if you are not using the date fields

  const updatedUsers = users.map((user: User) => ({
    ...user,
    updatedAt: user.updatedAt.toString(),
    createdAt: user.createdAt.toString()
  }))

  return { props: { users: updatedUsers } }
}

export default Homepage