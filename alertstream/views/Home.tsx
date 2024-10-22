import type { FC } from "hono/jsx";
import Layout from "../components/Layout.tsx";

const HomePageView: FC = () => {
  return (
    <Layout title={'Home'}>
      <h1>Home page!</h1>
      <p>this is a hono/jsx item and it needs to be setup.</p>
    </Layout>
  )
}

export default HomePageView;