import Search from "@/app/components/search";

export default function Dialog({children,show, handleClick}) {
    return <>
        <div hidden={!show}
             className={"min-h-[14%] absolute rounded-lg pb-5 top-20 left-[5%] bg-slate-800 w-[90%] z-20 pt-5"}>
            {children}
        </div>
        <div hidden={!show} onClick={handleClick}
             className={"z-10 bg-black/70 w-full h-full absolute top-0 left-0"}></div>
    </>
}