
import Head from "next/head";
import PageLoader from "./cms/PadeLoader";



export default function Home() {
  return (
    <>
      <Head>
        <title>Title</title>
      </Head>
      <article>
        <h1>Load Specific Page</h1>
        <hr />

        <PageLoader pagePath="/travel" />
      </article>
    </>
  )
}