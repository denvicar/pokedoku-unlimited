import Image from 'next/image'
import { getDatabase, ref, get, child } from 'firebase/database'
import getData from './lib/db'
import Schema from "@/app/components/schema";
import './home.css'
import {buildSchema} from "@/app/lib/gameSchema";
import Link from "next/link";


export default async function Home() {
  const pokemons = await getData()
  let schema = buildSchema(pokemons)

  return (
    <main className="container-fluid">
      <h3>Pokedoku Unlimited</h3>
      <Link href="/typequiz/">Type quiz </Link>
      <Link href="/">Classic</Link>
        <Schema pokemons={pokemons} firstSchema={schema} />
    </main>
  )
}


