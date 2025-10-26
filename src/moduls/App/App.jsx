import './styles/App.css'
import useApp from './hooks/useApp'
import { useCallback, useEffect, useState } from 'react'
import useAudio from './hooks/useAudio'
import audioSrc from '../../assets/sounds/beep.mp3'
import CardMose from './components/cardMorse/CardMose'
import { MORSE_MAP_ES } from '../../shared/utils/morse'

function App() {
  const [score, setScore] = useState({
    bad: 0,
    good: 0
  })

  const { bad, good } = score

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
    setMorseInputComplete(false); // Restablecemos la señal de entrada Morse
    if (e.key === ' ') {
      setStyle('w-48 h-48')
      setOutputText((prev) => prev + '.')
      playSegment() // Reproducir el audio completo al presionar
    }
  }, [playSegment])

  const handleKeyHold = useCallback((e) => {
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
  }, [playSegment, press])

  const handleKeyRelease = useCallback((e) => {
    if (e.key === ' ') {
      setPress(false)
      setStyle('w-24 h-24')
      stop()
      setMorseInputComplete(true); // Señalamos que la entrada Morse ha finalizado
    }
  }, [stop])

  useApp({ onKeyPress: handleKeyPress, onKeyHold: handleKeyHold, onKeyRelease: handleKeyRelease })

  useEffect(() => {
    if (!inputText) setInputText(getRandomLetter())
    if (!morseInputComplete) return; // Solo ejecutamos si la entrada Morse está completa

    const currentLetter = inputText[0]
    const currentOutput = outputText.split('')

    const currentLetterCode = MORSE_MAP_ES[currentLetter]

    if (currentOutput.length === 0 || currentOutput.length < currentLetterCode.length) return

    const isCorrect = currentLetterCode === outputText

    if (isCorrect) {
      setScore((prev) => ({ ...prev, good: prev.good + 1 }))
    } else {
      setScore((prev) => ({ ...prev, bad: prev.bad + 1 }))
    }

    // Seleccionar nueva letra aleatoria después de cada intento
    setInputText(getRandomLetter())
    setOutputText('')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [morseInputComplete])

  return (
    <section className='w-full h-full flex flex-col items-center justify-center overflow-hidden max-h-dvh'>
      <header className='text-3xl font-bold text-gray-700 min-w-full px-4 flex justify-between items-center'>
        <div className='py-5 mt-3'>
          <h1 className='leading-1'>Codigo Retro</h1>
          <span className='text-sm text-gray-400 leading-none'>Bienvenido anónimo</span>
        </div>
        <div className="flex items-center gap-3 rounded-xl from-gray-900/60 to-gray-800/60 backdrop-blur-sm -mt-1">
          <span id="timer" className=" font-mono text-gray-900 px-2 py-1">00:00</span>
          <div className="w-px h-5 bg-cyan-400/40 mx-1"></div>
          <div className="flex flex-row items-center text-md">
            <span id="score-bad" className=" font-mono text-white bg-red-700/50 px-2 rounded-s shadow-inner">{bad}</span>
            <span id="score-good" className=" font-mono text-white bg-green-700/50 px-2 rounded-e shadow-inner">{good}</span>
          </div>
        </div>
      </header>
      <div className='absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center gap-12' >
        <div className='flex flex-col items-center justify-center gap-4'>
          <span className='text-5xl text-zinc-900 font-bold'>{inputText}</span>
          <span className='text-xl text-gray-700 h-8 flex'>{outputText} <div className='min-h-4 w-0.5 bg-gray-400 animate-bounce ml-1 rounded-full' /></span>
        </div>
        <div className={`${style} rounded-full transition-all bg-radial-[at_25%_30%] from-blue-400/70 to-blue-700`} />
      </div>
      <div className='absolute bottom-0 w-full h-24 overflow-hidden has-[.card-morse:hover]:overflow-visible group hover:min-h-48 transition-all duration-400'>
        <CardMose />
      </div>
    </section>
  )
}

export default App
