import MyWallet from "../components/MyWallet";

type HomePageProps = {
  params: { wallet_id: string}
}

export default async function HomePage({ params }: HomePageProps) {

  return (
     <main className="container mx-auto px-2">
      <article className="format">
        <h1>Meus Investimentos</h1>
      </article>
      <MyWallet wallet_id={params.wallet_id}></MyWallet>
    </main>
  )
}
