import Image from 'next/image'
import { getDatabase, ref, get, child } from 'firebase/database'
import app from './lib/db'
import {buildSchema} from "@/app/lib/gameSchema";
import Schema from "@/app/components/schema";
import './home.css'


export default async function Home() {
  const pokemons = await getData()
  let schema = buildSchema(pokemons);

  return (
    <main className="container-fluid">
      <p>The schema is currently: </p>

        <Schema schema={schema} pokemons={pokemons} />
    </main>
  )
}

async function getData() {

  const dbRef = ref(getDatabase(app),"data")
  const data = await get(child(dbRef,"pokemons"))
  let pokemons = Array.from(new Map(Object.entries(data.val())).values())
  return pokemons.map(p => p.sprite_url === '' ? {...p, sprite_url: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/0.png'} : p)
}
