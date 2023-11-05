'use client'
import {useEffect, useState} from "react";
import {regions} from "@/app/lib/constants";
import {getRandomArrayElement} from "@/app/lib/utils";
import Button from "@/app/components/button";

export default function RegionQuiz({pokemons}) {
    const [score, setScore] = useState(0)
    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState(regions.map(r=>false))
    const [current, setCurrent] = useState(getRandomArrayElement(pokemons))
    const [image, setImage] = useState()

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            let loadedArt = 'sprite_url'
            if (localStorage.getItem("defaultArt")) loadedArt = localStorage.getItem("defaultArt")
            setImage(loadedArt)
        }
        return () => {ignore = true}
    }, []);

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

    function handleSwitchClick() {
        let art = ""
        if (image === 'sprite_url') art = 'artwork_url'
        else art = 'sprite_url'
        setImage(art)
        localStorage.setItem("defaultArt",art)
    }

    return <div className={"flex flex-col flex-nowrap gap-2 px-2"}>
        <h1 className={"font-bold text-2xl mt-2"}>Guess the region</h1>
        <div className={"flex flex-row gap-5 h-8"}><h2 className={"font-semibold text-xl"}>Score: {score}</h2> <Button handleClick={() => handleSwitchClick()} label={image === 'sprite_url' ? 'Switch to art' : 'Switch to sprite'} /></div>
        <img className={"w-3/6"} src={current[image]} alt={current.name}/>
        <h3 className={"text-lg"}>{current.display_name}</h3>
        {error !== null && <span style={{color:"red"}}>{error}</span>}
        <div className={"flex flex-row flex-wrap place-content-stretch"}>
            {regions
                .map((r,i) =>
                    <div className={"basis-1/3 px-3"} key={r}>
                        <button className={"w-full mb-2 disabled:bg-gray-500 bg-blue-200 dark:bg-blue-800 hover:bg-blue-500 rounded-full py-1 px-2 font-semibold"}
                                disabled={disabled[i]} onClick={() => handleClick(r,i)}>{r}</button>
                    </div> )}
        </div>
    </div>
}

