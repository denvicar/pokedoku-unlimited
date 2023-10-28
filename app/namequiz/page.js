import {promises as fs} from "fs";
import NameQuiz from "@/app/components/nameQuiz";

export default async function NameQuizHome() {
    const file = await fs.readFile(process.cwd() + '/app/db.json', 'utf8')
    const json = JSON.parse(file)
    const pokemons = Array.from(new Map(Object.entries(json['data']['pokemons'])).values())

    return <main>
        <NameQuiz pokemons={pokemons} />
    </main>
}