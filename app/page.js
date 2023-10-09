import Image from 'next/image'
import { getDatabase, ref, get, child } from 'firebase/database'
import getData from './lib/db'
import Schema from "@/app/components/schema";
import './home.css'
import Link from "next/link";


export default async function Home() {
  const pokemons = await getData()

  return (
    <main>
      <h3>Pokedoku Unlimited</h3>
        <Schema pokemons={pokemons} />
    </main>
  )
}


