import Head from 'next/head';

export default function CustomHead({ title }: { title: string }) {
  return (
    <Head>
      <title>{`Flea Market`}</title>
    </Head>
  );
}
