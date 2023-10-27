'use client'
import {useEffect, useRef, useState} from "react";

import Search from "@/app/components/search";
import {SCHEMA_SIZE, types as constTypes} from "@/app/lib/constants";
import {buildSchema, buildSchemaCode, decodeSchemaCode} from "@/app/lib/gameSchema";
import PokemonList from "@/app/components/pokemonList";
import '../home.css'
import {checkWinningPicks, pokemonToCategoryArray} from "@/app/lib/utils";
import Button from "@/app/components/button";
import Dialog from "@/app/components/dialog";

export default function Schema({pokemons}) {
    const searchInput = useRef(null)
    const [picked, setPicked] = useState()
    const [schema, setSchema] = useState()
    const [pickedTypesIndexes, setPickedTypesIndexes] = useState({})

    const pickedTypes = schema ? {row: schema[0][pickedTypesIndexes.row], col: schema[1][pickedTypesIndexes.col]} : {}
    const schemaCode = schema ? buildSchemaCode(schema) : ""

    // unica variabile di stato per guess e guesscolor
    const [guess, setGuess] = useState('')
    const [guessColor, setGuessColor] = useState('')

    const [surrender, setSurrender] = useState(false)

    // deducibile dai pick
    const [win, setWin] = useState(false)

    const [insertingCode, setInsertingCode] = useState(false)
    const [inputCode, setInputCode] = useState("")

    const [showModal, setShowModal] = useState(false)

    useEffect(() => {
        let ignore = false
        if (!ignore) {
            let loadedSchema = [[null, null, null], [null, null, null]]
            let loadedPicks = Array.from({length: SCHEMA_SIZE}, () => Array.from({length: SCHEMA_SIZE}, () => null))
            if (localStorage.getItem("schema")) {
                loadedSchema = JSON.parse(localStorage.getItem("schema"))
            } else {
                loadedSchema = buildSchema(pokemons)
                localStorage.setItem("schema", JSON.stringify(loadedSchema))
            }
            if (localStorage.getItem("picks")) {
                loadedPicks = JSON.parse(localStorage.getItem("picks"))
            }
            setSchema(loadedSchema)
            setPicked(loadedPicks)
            if (checkWinningPicks(loadedPicks)) setWin(true)
        }
        return () => {ignore = true}
    }, [pokemons]);

    useEffect(() => {
        if(showModal) searchInput.current.focus()
    }, [showModal]);




    function updatePicks(p) {
        let newPicked = picked.map((row, i) => i !== pickedTypesIndexes.row ? row : row.map((col, j) => j !== pickedTypesIndexes.col ? col : p))
        setPicked(newPicked)
        if (checkWinningPicks(newPicked)) setWin(true)
        localStorage.setItem("picks", JSON.stringify(newPicked))
    }

    function handleTableClick(rowIndex, colIndex) {
        setGuessColor('')
        setGuess('')
        setShowModal(true)
        setPickedTypesIndexes({row: rowIndex, col: colIndex})
    }

    function handlePokemonPick(p) {
        setShowModal(false)
        let pokemonCategoryArray = pokemonToCategoryArray(p)

        if (pokemonCategoryArray.includes(pickedTypes.row) && pokemonCategoryArray.includes(pickedTypes.col)) {
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
            return <div className={"hover:bg-orange-200 border h-full"}
                        style={{backgroundColor: pickedTypes.row === schema[0][row] && pickedTypes.col === schema[1][col] ? "coral" : ""}}
                        onClick={() => handleTableClick(row, col)}></div>
        } else {
            if (!surrender && !win) {
                // eslint-disable-next-line @next/next/no-img-element
                return <div className={"h-full w-full border relative"}><img src={picked[row][col].sprite_url}
                                                                             alt={picked[row][col].name}/><span
                    className={"rounded-full px-2 text-[0.7em] text-white absolute bottom-2 left-2 bg-black/70"}>{picked[row][col].display_name}</span>
                </div>
            } else {
                // eslint-disable-next-line @next/next/no-img-element
                return <div className={"h-full w-full border relative"}><img src={picked[row][col].sprite_url}
                                                                             alt={picked[row][col].name}
                                                                             onClick={() => handleTableClick(row, col)}/><span
                    className={"rounded-full px-2 text-[0.7em] text-white absolute bottom-2 left-2 bg-black/70"}>{picked[row][col].display_name}</span>
                </div>
            }
        }
    }

    function handleSurrender() {
        if (!surrender) {
            setWin(false)
            setSurrender(true)
            setGuess('')
            setGuessColor('')
            setShowModal(false)
        } else {
            handleRegenerate()
        }
    }

    function handleRegenerate() {
        setWin(false)
        setPicked(picked.map(row => row.map(() => null)))
        setShowModal(false)
        setGuess('')
        setGuessColor('')
        setPickedTypesIndexes({})
        setSurrender(false)
        setInsertingCode(false)
        setInputCode("")
        let s = buildSchema(pokemons)
        setSchema(s)
        localStorage.setItem("schema", JSON.stringify(s))
        localStorage.removeItem("picks")
    }

    function handleInsertCode(inputText) {
        setInputCode(inputText)
        if (inputText.trim().length === 6 && new Set([...inputText]).size === inputText.length) {
            handleRegenerate()
            setInsertingCode(false)
            setInputCode("")
            setSchema(decodeSchemaCode(inputText))
            localStorage.setItem("schema", JSON.stringify(decodeSchemaCode(inputText)))
        }
    }




    return schema && <div>
        <Dialog handleClick={() => setShowModal(!showModal)} show={showModal && (!win && !surrender)}>
            <div className={"text-center"}><span className={"font-bold text-lg"}>Guess</span> - <span
                className={"italic"}>{pickedTypes.row}/{pickedTypes.col}</span></div>
            <Search inputRef={searchInput} pokemons={pokemons} handlePick={handlePokemonPick}/>
        </Dialog>

        <div className={"flex flex-col flex-nowrap gap-3"}>
            {/*title*/}
            <h3 className={"text-2xl font-bold text-center"}>Pokedoku Unlimited - {schemaCode !== "" && schemaCode}</h3>

            {/*Buttons*/}
            <div className={"flex flex-row flex-nowrap justify-center gap-4"}>
                <Button handleClick={() => handleRegenerate()} label={"New schema"}/>
                <Button handleClick={() => handleSurrender()} label={surrender ? 'Restart' : 'Surrender'}/>
                {insertingCode ? <input
                        className={"bg-slate-800 px-2 rounded-full border border-slate-50 w-5/6 hover:bg-slate-600 focus:bg-slate-600 focus:outline-none"}
                        maxLength={6} minLength={6} type={"text"} value={inputCode}
                        onChange={(e) => handleInsertCode(e.target.value)}/> :
                    <Button handleClick={() => setInsertingCode(true)} label={"Insert code"}/>}
            </div>

            {/*Schema*/}
            <div className={"flex flex-col flex-nowrap"}>
                <div className={"flex flex-row flex-nowrap justify-end"}>
                    <div className={"w-1/4"}></div>
                    {schema[1].map(t => <div className={"w-1/4 flex-none text-center"} key={t}>{constTypes.includes(t) ?
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={"w-5/6 m-auto"} src={t + ".png"} alt={t}/> : <span
                            className={"font-semibold uppercase font-poke text-[0.6rem] text-center align-middle break-words leading-[3rem] m-auto"}>{t}</span>}</div>)}
                </div>
                {schema[0].map((type, i) => {
                    return <div key={type} className={"flex flex-row flex-nowrap justify-around"}>
                        <div className={"w-1/4 flex-none aspect-square text-center"}>{constTypes.includes(type) ?
                            // eslint-disable-next-line @next/next/no-img-element
                            <img className={"w-5/6 mx-auto mt-7"} src={type + ".png"} alt={type}/> : <span
                                className={"font-semibold uppercase font-poke text-[0.6rem] text-center align-middle break-words leading-[5.5rem]"}>{type}</span>}</div>
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

            {guess !== '' && <span className={"ml-2"} style={{color: guessColor}}>{guess}</span>}
            <Dialog handleClick={() => setShowModal(!showModal)} show={showModal && (win || surrender)}>
                <div className={"text-center"}><span className={"font-bold text-lg"}>Solution</span> - <span
                    className={"italic"}>{pickedTypes.row}/{pickedTypes.col}</span></div>

                <PokemonList pokemons={pokemons} types={[pickedTypes.row, pickedTypes.col]}/>
            </Dialog>


        </div>
    </div>
}

