'use client'
import {useState} from "react";
import {regions} from "@/app/lib/constants";
import {getRandomArrayElement} from "@/app/lib/utils";
import Button from "@/app/components/button";

export default function RegionQuiz({pokemons}) {
    let [score, setScore] = useState(0)
    let [error, setError] = useState(null)
    let [disabled, setDisabled] = useState([...regions,"Hisui"].map(r=>false))
    let [current, setCurrent] = useState(getRandomArrayElement(pokemons))

    function handleClick(r,i) {
        if (current.region === r) {
            setScore(score + 1)
            setError(null)
            setDisabled(disabled.map(x => false))
            setCurrent(getRandomArrayElement(pokemons))
        } else {
            setScore(0)
            setError('Wrong guess! Try again')
            setDisabled(disabled.map((region,index) => index === i ? true : region))
        }
    }

    return <div className={"flex flex-col flex-nowrap gap-2 px-2"}>
        <h1 className={"font-bold text-2xl mt-2"}>Guess the region</h1>
        <h2 className={"font-semibold text-xl"}>Score: {score}</h2>
        <img className={"w-3/6"} src={current.sprite_url} alt={current.name}/>
        <h3 className={"text-lg"}>{current.display_name}</h3>
        {error !== null && <span style={{color:"red"}}>{error}</span>}
        <div className={"flex flex-row flex-wrap place-content-stretch"}>
            {[...regions,"Hisui"]
                .map((r,i) =>
                    <div className={"basis-1/3 px-3"} key={r}>
                        <button className={"w-full mb-2 disabled:bg-gray-500 bg-blue-800 hover:bg-blue-500 rounded-full py-1 px-2 font-semibold"}
                                disabled={disabled[i]} onClick={() => handleClick(r,i)}>{r}</button>
                    </div> )}
        </div>
    </div>
}

