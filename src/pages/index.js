
import Head from "next/head";
import PageLoader from "./cms/PadeLoader";



export default function Home() {
  return (
    <>
      <Head>
        <title>Title</title>
      </Head>
      <div>
        <h1>Load Specific Page</h1>

        <PageLoader pagePath="/travel" />
      </div>
    </>
  )
}