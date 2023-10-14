import getData from './lib/db'
import Schema from "@/app/components/schema";
import './home.css'


export default async function Home() {
  const pokemons = await getData()

  return (
    <main className={"bg-slate-800"}>
        <Schema pokemons={pokemons} />
    </main>
  )
}


