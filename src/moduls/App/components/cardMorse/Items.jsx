import React from 'react'

function Items({ letter, code }) {
    return (
        <div className='hover:bg-gray-700 flex flex-col py-2 items-center justify-center rounded-md text-center'>{letter} <span className='text-lg block'>{code}</span></div>
    )
}

export default Items