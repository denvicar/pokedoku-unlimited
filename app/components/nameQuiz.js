'use client'
import {useEffect, useMemo, useState} from "react";
import {regions} from "@/app/lib/constants";
import {getRandomArrayElement, shuffleArray} from "@/app/lib/utils";
import Fuse from "fuse.js";
import Button from "@/app/components/button";

export default function NameQuiz({pokemons}) {
    const [score, setScore] = useState(0)
    const [error, setError] = useState(null)
    const [disabled, setDisabled] = useState([null,null,null,null].map(r=>false))
    const [current, setCurrent] = useState(getRandomArrayElement(pokemons.filter(p=>!p.name.includes("minior") && !p.name.includes("pumpkaboo"))))
    const [image, setImage] = useState()
    const [nameMode, setNameMode] = useState(true)

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            let loadedArt = 'sprite_url'
            let loadedMode = true
            if (localStorage.getItem("defaultArt")) loadedArt = localStorage.getItem("defaultArt")
            if (localStorage.getItem("mode")) loadedMode = localStorage.getItem("mode") === 'name'
            setImage(loadedArt)
            setNameMode(loadedMode)
        }
        return () => {ignore = true}
    }, []);

    const options = {
        includeScore: false,
        keys: ['display_name']
    }
    const fuse = new Fuse(pokemons,options)
    const searchResult = useMemo(() => fuse
        .search(current.display_name)
        .map(si=>si.item)
        .filter(p=>p.display_name!==current.display_name)
        .slice(0,10),[current.display_name, fuse])

    let nameOptions = useMemo(()=> {
        let ret = new Set()
        ret.add(current)
        while (ret.size<4) {
            ret.add(getRandomArrayElement(searchResult))
        }
        ret = [...ret]
        shuffleArray(ret)
        return ret
    },[current.display_name,pokemons])

    function handleClick(name,i) {
        if (current.display_name === name.display_name) {
            setScore(score + 1)
            setError(null)
            setDisabled(disabled.map(x => false))
            setCurrent(getRandomArrayElement(pokemons.filter(p=>!p.name.includes("minior") && !p.name.includes("pumpkaboo"))))
        } else {
            setScore(0)
            setError('Wrong guess! Try again')
            setDisabled(disabled.map((name,index) => index === i ? true : name))
        }
    }

    function handleSwitchClick() {
        let art = ""
        if (image === 'sprite_url') art = 'artwork_url'
        else art = 'sprite_url'
        setImage(art)
        localStorage.setItem("defaultArt",art)
    }

    function handleModeChange() {
        const newMode = !nameMode
        setNameMode(newMode)
        localStorage.setItem("mode",newMode ? 'name' : 'image')
    }

    return <div className={"flex flex-col flex-nowrap gap-2 px-2"}>
        {nameMode && <h1 className={"font-bold text-2xl mt-2"}>Guess the name</h1>}
        {!nameMode && <h1 className={"font-bold text-2xl mt-2"}>Guess the image</h1>}
        <div className={"flex flex-row gap-2 h-8"}><h2 className={"font-semibold text-xl"}>Score: {score}</h2>  </div>
        <div className={"flex flex-row gap-2 h-8"}><Button handleClick={() => handleSwitchClick()} label={image === 'sprite_url' ? 'Switch to art' : 'Switch to sprite'} />
            <Button handleClick={() => handleModeChange()} label={"Change mode"} /></div>
        {nameMode ? <img className={"w-3/6"} src={current[image]} alt={current.pokedex_number}/> : <h3 className={"font-bold text-2xl mt-2 text-center"}>{current.display_name}</h3> }
        {/*<h3 className={"text-lg"}>{current.display_name}</h3>*/}
        {error !== null && <span style={{color:"red"}}>{error}</span>}
        <div className={"flex flex-row flex-wrap place-content-stretch"}>
            {nameOptions
                .map((pokemon,i) =>
                    <div className={"basis-1/2 px-3"} key={pokemon.pokedex_number}>
                        <button className={"w-full mb-2 disabled:bg-gray-500 bg-blue-200 dark:bg-blue-800 hover:bg-blue-500 rounded-full py-1 px-2 font-semibold"}
                                disabled={disabled[i]} onClick={() => handleClick(pokemon,i)}>{nameMode ? pokemon.display_name : <img src={pokemon[image]} /> }</button>
                    </div> )}
        </div>
    </div>
}