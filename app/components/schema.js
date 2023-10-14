'use client'
import {useEffect, useState} from "react";

import Search from "@/app/components/search";
import { types as constTypes} from "@/app/lib/constants";
import {buildSchema, buildSchemaCode, decodeSchemaCode} from "@/app/lib/gameSchema";
import PokemonList from "@/app/components/pokemonList";
import '../home.css'
import {checkWinningPicks, pokemonToCategoryArray} from "@/app/lib/utils";
import Button from "@/app/components/button";

export default function Schema({pokemons}) {
    let [show, setShow] = useState(false)
    let [picked, setPicked] = useState([[null, null, null], [null, null, null], [null, null, null]])
    let [types, setTypes] = useState([])
    let [lastIndexes, setLastIndexes] = useState([])
    let [guess,setGuess] = useState('')
    let [guessColor, setGuessColor] = useState('')
    let [schema,setSchema] = useState()
    let [solutionTypes,setSolutionTypes] = useState([])
    let [surrender,setSurrender] = useState(false)
    let [win,setWin] = useState(false)
    let [schemaCode,setSchemaCode] = useState("")
    let [insertingCode,setInsertingCode] = useState(false)
    let [inputCode,setInputCode] = useState("")

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            if (localStorage.getItem("schema")) {
                let s = JSON.parse(localStorage.getItem("schema"))
                setSchema(s)
                setSchemaCode(buildSchemaCode(s))
            } else {
                let s = buildSchema(pokemons)
                setSchemaCode(buildSchemaCode(s))
                setSchema(s)
                localStorage.setItem("schema", JSON.stringify(s))
            }
        }
        return ()=>{ignore=true}
    }, [pokemons]);

    useEffect(() => {
        let ignore = false;
        if (!ignore) {
            if (localStorage.getItem("picks")) {
                let picks = JSON.parse(localStorage.getItem("picks"))
                setPicked(picks)
                if (checkWinningPicks(picks)) setWin(true)
            }
        }
        return ()=>{ignore=true}
    }, [pokemons]);

    function updatePicks(p) {
        let newPicked = picked.map((row, i) => i !== lastIndexes[0] ? row : row.map((col, j) => j !== lastIndexes[1] ? col : p))
        setPicked(newPicked)
        if (checkWinningPicks(newPicked)) setWin(true)
        localStorage.setItem("picks",JSON.stringify(newPicked))
    }

    function handleTableClick(rowIndex, colIndex) {
        setGuessColor('')
        setGuess('')
        if(!surrender && !win) {
            setTypes([schema[0][rowIndex], schema[1][colIndex]])
            setLastIndexes([rowIndex, colIndex])
            console.log("Picked cell with types ", types)
            setShow(true)
        } else {
            console.log('Surrendered so showing solution')
            setSolutionTypes([schema[0][rowIndex],schema[1][colIndex]])
        }
    }

    function handlePokemonPick(p) {
        setShow(false)
        let pokemonCategoryArray = pokemonToCategoryArray(p)

        if (pokemonCategoryArray.includes(types[0]) && pokemonCategoryArray.includes(types[1])) {
            updatePicks(p)
            setGuessColor("green")
            setGuess("Correct guess!")
        } else {
            setGuessColor("red")
            setGuess("Wrong guess!")
        }
    }

    function getCellContent(row, col) {
        if (picked[row][col] === null) {
            return <div className={"hover:bg-orange-200 border h-full"} style={{backgroundColor: types[0]===schema[0][row]&& types[1]===schema[1][col] ? "coral":""}} onClick={() => handleTableClick(row, col)}></div>
        } else {
            if(!surrender && !win) {
                return <div className={"h-full w-full border"} ><img src={picked[row][col].sprite_url} alt={picked[row][col].name} /></div>
            } else {
                return <div className={"h-full w-full border"} ><img src={picked[row][col].sprite_url} alt={picked[row][col].name} onClick={()=>handleTableClick(row,col)}/></div>
            }
        }
    }

    function handleSurrender() {
        if (!surrender) {
            setWin(false)
            setSurrender(true)
            setGuess('')
            setGuessColor('')
            setShow(false)
        } else {
            handleRegenerate()
        }
    }

    function handleRegenerate() {
        setWin(false)
        setPicked([[null, null, null], [null, null, null], [null, null, null]])
        setShow(false)
        setGuess('')
        setGuessColor('')
        setTypes([])
        setLastIndexes([])
        setSolutionTypes([])
        setSurrender(false)
        setInsertingCode(false)
        setInputCode("")
        let s = buildSchema(pokemons)
        setSchemaCode(buildSchemaCode(s))
        setSchema(s)
        localStorage.setItem("schema",JSON.stringify(s))
        localStorage.removeItem("picks")

    }

    function handleInsertCode(inputText) {
        setInputCode(inputText)
        if (inputText.trim().length===6 && new Set([...inputText]).size===inputText.length) {
            handleRegenerate()
            setInsertingCode(false)
            setInputCode("")
            setSchemaCode(inputText)
            setSchema(decodeSchemaCode(inputText))
            localStorage.setItem("schema",JSON.stringify(decodeSchemaCode(inputText)))
        }
    }


    return schema && <div className={"flex flex-col flex-nowrap gap-3"}>
        {/*title*/}
        <h3 className={"text-2xl font-bold text-center"}>Pokedoku Unlimited - {schemaCode}</h3>

        {/*Buttons*/}
        <div className={"flex flex-row flex-nowrap justify-center gap-4"}>
            <Button handleClick={()=> handleRegenerate()} label={"New schema"} />
            <Button handleClick={() => handleSurrender()} label={surrender ? 'Restart':'Surrender'} />
            {insertingCode ? <input className={"bg-slate-800 px-2 rounded-full border border-slate-50 w-5/6 hover:bg-slate-600 focus:bg-slate-600 focus:outline-none"} maxLength={6} minLength={6} type={"text"} value={inputCode} onChange={(e) => handleInsertCode(e.target.value)} /> : <Button handleClick={() => setInsertingCode(true)} label={"Insert code"} /> }
        </div>

        {/*Schema*/}
        <div className={"flex flex-col flex-nowrap"}>
            <div className={"flex flex-row flex-nowrap justify-end"}>
                <div className={"w-1/4"}></div>
                {schema[1].map(t => <div className={"w-1/4 flex-none text-center"} key={t}>{constTypes.includes(t) ? <img className={"w-5/6 m-auto"} src={t+".png"}  alt={t}/> : <span className={"font-semibold uppercase font-poke text-[0.6rem] text-center align-middle break-words leading-[3rem] m-auto"}>{t}</span> }</div>)}
            </div>
            {schema[0].map((type, i) => {
                return <div key={type} className={"flex flex-row flex-nowrap justify-around"}>
                    <div className={"w-1/4 flex-none aspect-square text-center"}>{constTypes.includes(type) ? <img className={"w-5/6 mx-auto mt-7"} src={type+".png"}  alt={type}/> : <span className={"font-semibold uppercase font-poke text-[0.6rem] text-center align-middle break-words leading-[5.5rem]"}>{type}</span>}</div>
                    <div className={"flex-none w-1/4 aspect-square"}>
                        {getCellContent(i, 0)}
                    </div>
                    <div className={"w-1/4 flex-none aspect-square"}>
                        {getCellContent(i, 1)}
                    </div>
                    <div className={"w-1/4 flex-none aspect-square"}>
                        {getCellContent(i, 2)}
                    </div>
                </div>
            })}

        </div>


        {/*<table >*/}
        {/*    <thead>*/}
        {/*    <tr>*/}
        {/*        <th scope="col"><div style={{width:"4em"}}></div></th>*/}
        {/*        {schema[1].map(t => <th scope="col" key={t}>{constTypes.includes(t) ? <img width={75} height={"auto"} src={"/"+t+".png"}  alt={t}/> : <span className={"schema-text"}>{t}</span> }</th>)}*/}
        {/*    </tr>*/}
        {/*    </thead>*/}
        {/*    <tbody>*/}
        {/*    {schema[0].map((type, i) => {*/}
        {/*        return <tr key={type}>*/}
        {/*            <th scope="row">{constTypes.includes(type) ? <img width={75} height={"auto"} src={"/"+type+".png"}  alt={type}/> : <span className={"schema-text"}>{type}</span>}</th>*/}
        {/*            <td>*/}
        {/*                {getCellContent(i, 0)}*/}
        {/*            </td>*/}
        {/*            <td>*/}
        {/*                {getCellContent(i, 1)}*/}
        {/*            </td>*/}
        {/*            <td>*/}
        {/*                {getCellContent(i, 2)}*/}
        {/*            </td>*/}
        {/*        </tr>*/}
        {/*    })}*/}
        {/*    </tbody>*/}
        {/*</table>*/}

        {guess!=='' && <span className={"ml-2"} style={{color:guessColor}}>{guess}</span>}
        {show && <Search pokemons={pokemons} handlePick={handlePokemonPick}/>}
        <PokemonList pokemons={pokemons} types={solutionTypes} />
    </div>
}

