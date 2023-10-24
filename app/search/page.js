
import {promises as fs} from "fs";
import ExtendedSearch from "@/app/components/extSearch";

export default async function SpecialSearchHome() {
    const file = await fs.readFile(process.cwd() + '/app/db.json', 'utf8')
    const json = JSON.parse(file)
    const pokemons = Array.from(new Map(Object.entries(json['data']['pokemons'])).values())


    return <main>
        <ExtendedSearch pokemons={pokemons} />
    </main>
}

