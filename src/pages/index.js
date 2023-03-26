export default function Home() {
  return (
    <>
    </>
  );
}

export const getServerSideProps = () => ({
  redirect: {
    destination: '/employees',
    permanent: false,
  },
});
