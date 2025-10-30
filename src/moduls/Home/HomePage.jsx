import { useState } from 'react'
import { useNavigate } from 'react-router'

function HomePage() {
    const navigate = useNavigate()
    const [name, setName] = useState(() => localStorage.getItem('playerName') || '')

    const handlePlay = () => {
        const trimmed = name.trim()
        localStorage.setItem('playerName', trimmed || 'anónimo')
        navigate('/play')
    }

    return (
        <section className='w-full h-full flex flex-col items-center justify-center min-h-dvh'>
            <header className='text-3xl font-bold text-gray-700 px-4'>
                <h1 className='leading-1'>Codigo Retro</h1>
            </header>
            <div className='mt-10 flex flex-col items-center gap-4 w-full max-w-md px-4'>
                <input
                    type='text'
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder='Tu nombre'
                    className='w-full border border-gray-300 rounded px-3 py-2 text-gray-800 focus:outline-none focus:ring-2 focus:ring-cyan-500'
                />
                <button
                    onClick={handlePlay}
                    className='w-full bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded shadow'
                >
                    Play
                </button>
            </div>
        </section>
    )
}

export default HomePage