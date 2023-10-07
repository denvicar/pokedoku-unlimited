'use client'

export default function ModalPicker({pokemons, hidden}) {
    if (hidden) return null
    return <dialog>
        <article>
            <header>
                <a href="#" aria-label="Close" className="close"></a>
                Pick a pokemon
            </header>
            Body
        </article>
    </dialog>
}