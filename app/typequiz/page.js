import getData from "@/app/lib/db";
import TypeQuiz from "@/app/components/typeQuiz";

export default async function TypeQuizHome() {
    const pokemons = await getData()


    return <main className={"bg-slate-800"}>
        <TypeQuiz pokemons={pokemons} />
    </main>
}

