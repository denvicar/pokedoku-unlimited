import getData from './lib/db'
import Schema from "@/app/components/schema";
import './home.css'
import {promises as fs} from 'fs'


export default async function Home() {
    const file = await fs.readFile(process.cwd() + '/app/db.json', 'utf8')
    const json = JSON.parse(file)
    const pokemons = Array.from(new Map(Object.entries(json['data']['pokemons'])).values())

    return (
        <main className={"bg-slate-800"}>
            <Schema pokemons={pokemons}/>
        </main>
    )
}


