import './styles/App.css'
import useApp from './hooks/useApp'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import useAudio from './hooks/useAudio'
import audioSrc from '../../assets/sounds/beep.mp3'
import CardMose from './components/cardMorse/CardMose'
import GameOver from './components/gameOver/GameOver.jsx'
import { MORSE_MAP_ES } from '../../shared/utils/morse'

function App() {
  const navigate = useNavigate()
  const BASE_TIME_SEC = 10
  const [score, setScore] = useState({
    good: 0
  })

  const { good } = score
  const [lives, setLives] = useState(3)
  const [error, setError] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [playerName] = useState(() => localStorage.getItem('playerName') || 'anónimo')
  const [timeLeft, setTimeLeft] = useState(BASE_TIME_SEC)
  const [paused, setPaused] = useState(false)

  const [inputText, setInputText] = useState('')
  const [outputText, setOutputText] = useState('')
  const [morseInputComplete, setMorseInputComplete] = useState(false); // Nuevo estado

  // Función para seleccionar una letra aleatoria del diccionario Morse
  const getRandomLetter = useCallback(() => {
    const letters = Object.keys(MORSE_MAP_ES)
    const randomIndex = Math.floor(Math.random() * letters.length)
    return letters[randomIndex]
  }, [])

  const [press, setPress] = useState(false)

  /// inicio de fragmento de codigo de prueba para la animacion
  const [style, setStyle] = useState('w-24 h-24')
  const { playSegment, stop } = useAudio(audioSrc, { loop: true, volume: 0.5 })

  const handleKeyPress = useCallback((e) => {
    if (gameOver || paused) return
    setMorseInputComplete(false); // Restablecemos la señal de entrada Morse
    if (e.key === ' ') {
      setStyle('w-48 h-48')
      setOutputText((prev) => prev + '.')
      playSegment() // Reproducir el audio completo al presionar
    }

    if (e.key === 'Backspace') {
      // Eliminar el último carácter de la entrada Morse
      setOutputText((prev) => prev.slice(0, -1))
    }
  }, [playSegment, gameOver, paused])

  const handleKeyHold = useCallback((e) => {
    if (gameOver || paused) return
    if (e.key === ' ') {
      setMorseInputComplete(false); // Restablecemos la señal de entrada Morse
      setPress(true)
      setStyle('w-48 h-24 shadow-xl')
      playSegment(0, 0.5) // Reproducir un segmento en bucle al mantener
      !press && setOutputText((prev) => {
        const oldText = prev.split('').slice(0, -1).join('')
        return oldText + '-'
      })
    }
  }, [playSegment, press, gameOver, paused])

  const handleKeyRelease = useCallback((e) => {
    if (gameOver || paused) return
    if (e.key === ' ') {
      setPress(false)
      setStyle('w-24 h-24')
      stop()
      setMorseInputComplete(true); // Señalamos que la entrada Morse ha finalizado
    }
  }, [stop, gameOver, paused])

  useApp({ onKeyPress: handleKeyPress, onKeyHold: handleKeyHold, onKeyRelease: handleKeyRelease })

  // Cronómetro por letra con penalización al agotarse el tiempo
  useEffect(() => {
    if (gameOver || paused) return
    const id = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          // Tiempo agotado: se resta una vida, se marca error visual y se reinicia el cronómetro de la misma letra
          setError(true)
          setLives((l) => {
            const next = l - 1
            if (next <= 0) setGameOver(true)
            return Math.max(next, 0)
          })
          setOutputText('')
          return BASE_TIME_SEC
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(id)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameOver, paused])

  // Si se pausa, detener audio y entrada mantenida
  useEffect(() => {
    if (paused) {
      stop()
      setPress(false)
    }
  }, [paused, stop])

  useEffect(() => {
    if (!inputText) setInputText(getRandomLetter())
    if (!morseInputComplete || gameOver) return; // Solo ejecutamos si la entrada Morse está completa y el juego no terminó

    const currentLetter = inputText[0]
    const currentOutput = outputText.split('')

    const currentLetterCode = MORSE_MAP_ES[currentLetter]

    if (currentOutput.length === 0 || currentOutput.length < currentLetterCode.length) return

    const isCorrect = currentLetterCode === outputText

    if (isCorrect) {
      setError(false)
      setScore((prev) => ({ ...prev, good: prev.good + 1 }))
      // Sumar el tiempo sobrante al cronómetro de la nueva letra
      setTimeLeft((prev) => BASE_TIME_SEC + prev)
      // Seleccionar nueva letra aleatoria después de un acierto
      setInputText(getRandomLetter())
      setOutputText('')
    } else {
      setError(true)
      // No pasamos a otra letra; restamos una vida y reiniciamos la salida
      setLives((prev) => {
        const next = prev - 1
        if (next <= 0) {
          setGameOver(true)
        }
        return Math.max(next, 0)
      })
      setOutputText('')
      // Mantenemos la misma letra en caso de error
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morseInputComplete])

  const resetGame = useCallback(() => {
    setScore({ good: 0 })
    setLives(3)
    setError(false)
    setGameOver(false)
    setInputText(getRandomLetter())
    setOutputText('')
    setTimeLeft(BASE_TIME_SEC)
  }, [getRandomLetter])

  const goHome = useCallback(() => {
    navigate('/')
  }, [navigate])

  const circleClasses = useMemo(() => {
    const base = `${style} rounded-full transition-all bg-radial-[at_25%_30%] from-blue-400/70 to-blue-700`
    return error ? `${base} ring-4 ring-red-500` : base
  }, [style, error])

  const formatTime = useCallback((s) => {
    const m = Math.floor(s / 60)
    const ss = s % 60
    const mmStr = String(m).padStart(2, '0')
    const ssStr = String(ss).padStart(2, '0')
    return `${mmStr}:${ssStr}`
  }, [])

  return (
    <section className='w-full h-full flex flex-col items-center justify-center overflow-hidden max-h-dvh'>
      <header className='text-3xl font-bold text-gray-700 min-w-full px-4 flex justify-between items-center'>
        <div className='py-5 mt-3'>
          <h1 className='leading-1'>Codigo Retro</h1>
          <span className='text-sm text-gray-400 leading-none'>Bienvenido {playerName}</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl from-gray-900/60 to-gray-800/60 backdrop-blur-sm -mt-1">
          <span id="timer" className={`font-mono ${paused ? 'text-yellow-700' : 'text-gray-900'} px-2 py-1`}>{formatTime(timeLeft)}</span>
          <div className="w-px h-5 bg-cyan-400/40 mx-1"></div>
          <div className="flex flex-row items-center text-md items-center gap-2">
            <span id="lives" className="font-mono text-white bg-red-700/60 px-2 rounded shadow-inner">
              {Array.from({ length: lives }).map((_, i) => (
                <span key={i} className="mx-0.5">❤</span>
              ))}
            </span>
            <span id="score-good" className=" font-mono text-white bg-green-700/60 px-2 rounded shadow-inner">{good}</span>
            <button onClick={resetGame} className="text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 px-2 py-1 rounded">Reset</button>
            <button onClick={() => setPaused(p => !p)} disabled={gameOver} className={`text-sm px-2 py-1 rounded ${paused ? 'bg-yellow-500 text-white hover:bg-yellow-600' : 'bg-gray-200 text-gray-800 hover:bg-gray-300'} ${gameOver ? 'opacity-50 cursor-not-allowed' : ''}`}>
              {paused ? 'Reanudar' : 'Pausar'}
            </button>
          </div>
        </div>
      </header>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-12' >
        <div className='flex flex-col items-center justify-center gap-4'>
          <span className={`text-5xl font-bold ${error ? 'text-red-700 animate-pulse' : 'text-zinc-900'}`}>{inputText}</span>
          <span className='text-xl text-gray-700 h-8 flex'>{outputText} <div className='min-h-4 w-0.5 bg-gray-400 animate-bounce ml-1 rounded-full' /></span>
          {gameOver && (
            <span className='text-red-700 text-sm font-semibold'>Sin vidas — pulsa Reset para reiniciar</span>
          )}
        </div>
        <div className={circleClasses} />
      </div>
      <div className='absolute bottom-0 w-full h-24 overflow-hidden has-[.card-morse:hover]:overflow-visible group hover:min-h-48 transition-all duration-400'>
        <CardMose />
      </div>
      {paused && !gameOver && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-sm p-6 text-center">
            <h2 className="text-2xl font-bold text-yellow-600">Pausa</h2>
            <p className="mt-2 text-gray-700">El juego está pausado</p>
            <div className="mt-6 flex gap-3">
              <button onClick={() => setPaused(false)} className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded">Reanudar</button>
            </div>
          </div>
        </div>
      )}
      {gameOver && (
        <GameOver good={good} onReset={resetGame} onHome={goHome} />
      )}
    </section>
  )
}

export default App
