import getData from "@/app/lib/db";
import TypeQuiz from "@/app/components/typeQuiz";
import {promises as fs} from "fs";

export default async function TypeQuizHome() {
    const file = await fs.readFile(process.cwd() + '/app/db.json', 'utf8')
    const json = JSON.parse(file)
    const pokemons = Array.from(new Map(Object.entries(json['data']['pokemons'])).values())


    return <main className={"bg-slate-800"}>
        <TypeQuiz pokemons={pokemons} />
    </main>
}

