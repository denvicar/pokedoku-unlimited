'use client'
import {useEffect, useMemo, useRef, useState} from "react";

import Search from "@/app/components/search";
import {SCHEMA_SIZE, types as constTypes} from "@/app/lib/constants";
import {buildHardSchema, buildSchema, buildSchemaCode, decodeSchemaCode} from "@/app/lib/gameSchema.js";
import PokemonList from "@/app/components/pokemonList";
import '../home.css'
import {checkWinningPicks, pokemonToCategoryArray} from "@/app/lib/utils";
import Button from "@/app/components/button";
import Dialog from "@/app/components/dialog";
import {pick} from "next/dist/lib/pick";

export default function Schema({pokemons}) {
    const searchInput = useRef(null)

    const [picked, setPicked] = useState()
    const [schema, setSchema] = useState()
    const [pickedTypesIndexes, setPickedTypesIndexes] = useState({})
    const [correct, setCorrect] = useState(null)
    const [surrender, setSurrender] = useState(false)
    const [insertingCode, setInsertingCode] = useState(false)
    const [inputCode, setInputCode] = useState("")
    const [showModal, setShowModal] = useState(false)
    const [imageToShow, setImageToShow] = useState()
    const [mode, setMode] = useState('Normal')

    const pickedTypes = schema ? {row: schema[0][pickedTypesIndexes.row], col: schema[1][pickedTypesIndexes.col], third: schema[schema.length-1][pickedTypesIndexes.col]} : {}
    const schemaCode = useMemo(() => buildSchemaCode(schema), [schema])
    const guess = correct ? 'Correct guess!' : 'Wrong guess!'
    const guessColor = correct ? 'green' : 'red'
    const win = useMemo(() => checkWinningPicks(picked), [picked])
    const isHard = mode === 'Hard'

    useEffect(() => {
        let ignore = false
        if (!ignore) {
            let loadedSchema = [[null, null, null], [null, null, null]]
            let loadedPicks = Array.from({length: SCHEMA_SIZE}, () => Array.from({length: SCHEMA_SIZE}, () => null))
            let loadedImages = "sprite_url"
            if (localStorage.getItem("schema")) {
                loadedSchema = JSON.parse(localStorage.getItem("schema"))
            } else {
                loadedSchema = buildSchema(pokemons)
                localStorage.setItem("schema", JSON.stringify(loadedSchema))
            }
            if (localStorage.getItem("picks")) {
                loadedPicks = JSON.parse(localStorage.getItem("picks"))
            }
            if (localStorage.getItem("defaultArt")) loadedImages = localStorage.getItem("defaultArt")
            setSchema(loadedSchema)
            setPicked(loadedPicks)
            setImageToShow(loadedImages)
            setMode(loadedSchema.length === 2 ? 'Normal' : 'Hard')
        }
        return () => {ignore = true}
    }, [pokemons]);

    useEffect(() => {
        if(showModal) {
            searchInput.current.focus()
        }
    }, [showModal]);

    function getNewSchema(schemaFunction) {
        let s = schemaFunction(pokemons)
        console.log(s)
        setSchema(s)
        localStorage.setItem("schema",JSON.stringify(s))
        localStorage.removeItem("picks")
    }

    function updatePicks(p) {
        let newPicked = picked.map((row, i) => i !== pickedTypesIndexes.row ? row : row.map((col, j) => j !== pickedTypesIndexes.col ? col : p))
        setPicked(newPicked)
        localStorage.setItem("picks", JSON.stringify(newPicked))
    }

    function handleTableClick(rowIndex, colIndex) {
        setCorrect(null)
        setShowModal(true)
        setPickedTypesIndexes({row: rowIndex, col: colIndex})
    }

    function handlePokemonPick(p) {
        setShowModal(false)
        let pokemonCategoryArray = pokemonToCategoryArray(p)

        if (pokemonCategoryArray.includes(pickedTypes.row) && pokemonCategoryArray.includes(pickedTypes.col) && pokemonCategoryArray.includes(pickedTypes.third)) {
            updatePicks(p)
            setCorrect(true)
        } else {
            setCorrect(false)
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
                return <div className={"h-full w-full border relative"}><img src={picked[row][col][imageToShow]}
                                                                             alt={picked[row][col].name}/><span
                    className={"rounded-full px-2 text-[0.7em] text-white absolute bottom-2 left-2 bg-black/70"}>{picked[row][col].display_name}</span>
                </div>
            } else {
                // eslint-disable-next-line @next/next/no-img-element
                return <div className={"h-full w-full border relative"}><img src={picked[row][col][imageToShow]}
                                                                             alt={picked[row][col].name}
                                                                             onClick={() => handleTableClick(row, col)}/><span
                    className={"rounded-full px-2 text-[0.7em] text-white absolute bottom-2 left-2 bg-black/70"}>{picked[row][col].display_name}</span>
                </div>
            }
        }
    }

    function handleSurrender() {
        if (!surrender) {
            setSurrender(true)
            setCorrect(null)
            setShowModal(false)
        } else {
            setPicked(picked.map(row => row.map(() => null)))
            setShowModal(false)
            setCorrect(null)
            setPickedTypesIndexes({})
            setSurrender(false)
            setInsertingCode(false)
            setInputCode("")
            localStorage.removeItem("picks")
        }
    }

    function handleRegenerate() {
        setPicked(picked.map(row => row.map(() => null)))
        setShowModal(false)
        setCorrect(null)
        setPickedTypesIndexes({})
        setSurrender(false)
        setInsertingCode(false)
        setInputCode("")
        getNewSchema(isHard ? buildHardSchema : buildSchema)
    }

    function handleInsertCode(inputText) {
        setInputCode(inputText)
        const expectedLength = isHard ? 9 : 6
        if (inputText.trim().length === expectedLength && new Set([...inputText]).size === inputText.length) {
            handleRegenerate()
            setInsertingCode(false)
            setInputCode("")
            setSchema(decodeSchemaCode(inputText))
            localStorage.setItem("schema", JSON.stringify(decodeSchemaCode(inputText)))
        }
    }

    function handleSwitchClick() {
        let art = ""
        if (imageToShow === 'sprite_url') art = 'artwork_url'
        else art = 'sprite_url'
        setImageToShow(art)
        localStorage.setItem("defaultArt",art)
    }

    function handleModeChange() {
        if (isHard) {
            setMode('Normal')
            getNewSchema(buildSchema)
        } else {
            setMode('Hard')
            getNewSchema(buildHardSchema)
        }
    }

    return schema && <div>
        <Dialog handleClick={() => setShowModal(!showModal)} show={showModal && (!win && !surrender)}>
            <div className={"text-center"}><span className={"font-bold text-lg"}>Guess</span> - <span
                className={"italic capitalize"}>{pickedTypes.row}/{pickedTypes.col}{isHard && "/"+ pickedTypes.third}</span></div>
            {showModal && <Search imageToShow={imageToShow} inputRef={searchInput} pokemons={pokemons} handlePick={handlePokemonPick}/>}
        </Dialog>

        <Dialog handleClick={() => setShowModal(!showModal)} show={showModal && (win || surrender)}>
            <div className={"text-center"}><span className={"font-bold text-lg"}>Solution</span> - <span
                className={"italic capitalize"}>{pickedTypes.row}/{pickedTypes.col}{isHard && "/"+ pickedTypes.third}</span></div>

            {showModal && <PokemonList imageToShow={imageToShow} pokemons={pokemons} types={[pickedTypes.row, pickedTypes.col, pickedTypes.third]}/>}
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
                        maxLength={9} minLength={6} type={"text"} value={inputCode}
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
                            className={"font-semibold uppercase font-poke text-[0.55rem] text-center align-middle m-auto"}>{t}</span>}</div>)}
                </div>
                {schema[0].map((type, i) => {
                    return <div key={type} className={"flex flex-row flex-nowrap justify-around"}>
                        <div className={"w-1/4 flex-none aspect-square text-center"}>{constTypes.includes(type) ?
                            // eslint-disable-next-line @next/next/no-img-element
                            <img className={"w-5/6 mx-auto mt-7"} src={type + ".png"} alt={type}/> : <div
                                className={"font-semibold uppercase font-poke text-[0.55rem] leading-normal text-center mt-[40%]"}>{type}</div>}</div>
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
                {schema.length > 2 && <div className={"flex flex-row flex-nowrap justify-end"}>
                    <div className={"w-1/4"}></div>
                    {schema[2].map(t => <div className={"w-1/4 flex-none text-center"} key={t}>{constTypes.includes(t) ?
                        // eslint-disable-next-line @next/next/no-img-element
                        <img className={"w-5/6 m-auto"} src={t + ".png"} alt={t}/> : <span
                            className={"font-semibold uppercase font-poke text-[0.55rem] text-center align-middle m-auto"}>{t}</span>}</div>)}
                </div>}

            </div>
            <Button handleClick={() => handleSwitchClick()} label={imageToShow === 'sprite_url' ? 'Switch to art' : 'Switch to sprite'} />
            <Button handleClick={() => handleModeChange()} label={isHard ? 'Switch to Normal' : 'Switch to Hard'} />

            {correct !== null && <span className={"ml-2"} style={{color: guessColor}}>{guess}</span>}



        </div>
    </div>
}

