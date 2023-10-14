import getData from "@/app/lib/db";
import RegionQuiz from "@/app/components/regionQuiz";
import {promises as fs} from "fs";

export default async function RegionQuizHome() {
    const file = await fs.readFile(process.cwd() + '/app/db.json', 'utf8')
    const json = JSON.parse(file)
    const pokemons = Array.from(new Map(Object.entries(json['data']['pokemons'])).values())


    return <main className={"bg-slate-800"}>
        <RegionQuiz pokemons={pokemons} />
    </main>
}

