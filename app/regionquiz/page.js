import getData from "@/app/lib/db";
import RegionQuiz from "@/app/components/regionQuiz";

export default async function RegionQuizHome() {
    const pokemons = await getData()


    return <main className={"bg-slate-800"}>
        <RegionQuiz pokemons={pokemons} />
    </main>
}

