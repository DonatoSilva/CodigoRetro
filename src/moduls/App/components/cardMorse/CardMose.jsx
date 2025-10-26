import React from 'react'
import { MORSE_MAP_ES } from '../../../../shared/utils/morse'

function CardMose() {
    return (
        <div className="absolute top-12 bottom-auto hover:top-auto hover:bottom-4 -rotate-12 group-hover:rotate-0 left-4 bg-radial-[at_05%_10%] from-gray-500/70 to-gray-900 text-white p-4 rounded-lg max-w-md transition-transform duration-300 cursor-pointer card-morse">
            <h2 className="text-sm font-semibold">Código Morse</h2>
            <hr className="my-2 border-gray-600" />
            <div className="grid grid-cols-5 gap-x-4 gap-0.5 text-xs">
                {Object.entries(MORSE_MAP_ES).map(([letter, code]) => (
                    <div key={letter} className='hover:bg-gray-700 flex flex-col py-2 items-center justify-center rounded-md text-center'>{letter} <span className='text-lg block'>{code}</span></div>
                ))}
            </div>
        </div>
    )
}

export default CardMose