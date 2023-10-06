import Image from 'next/image'
import { getDatabase, ref, get, child } from 'firebase/database'
import app from './lib/db'
import {buildSchema} from "@/app/lib/gameSchema";


export default async function Home() {
  const pokemons = new Map(Object.entries(await getData()))
  let schema = buildSchema(pokemons)

  return (
    <main>
      <p>The schema is currently: </p>

        <table>
            <thead>
            <tr>
                <th></th>
                {schema[1].map(t=><th key={t}>{t}</th>)}
            </tr>
            </thead>
            <tbody>
            {schema[0].map(type => {
                return <tr key={type}>
                    <td>{type}</td>
                    <td></td>
                    <td></td>
                    <td></td>
                </tr>
            })}
            </tbody>
        </table>
    </main>
  )
}

async function getData() {

  const dbRef = ref(getDatabase(app),"data")
  const data = await get(child(dbRef,"pokemons"))
  return data.val();
}
