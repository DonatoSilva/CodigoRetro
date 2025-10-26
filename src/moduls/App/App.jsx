import './styles/App.css'
import useApp from './hooks/useApp'
import { useCallback, useState } from 'react'
import useAudio from './hooks/useAudio'
import audioSrc from '../../assets/sounds/beep.mp3'

function App() {

  /// inicio de fragmento de codigo de prueba para la animacion
  const [style, setStyle] = useState('w-24 h-24')
  const { playSegment, stop } = useAudio(audioSrc, { loop: true, volume: 0.5 })

  const handleKeyPress = useCallback((e) => {
    if (e.key === ' ') {
      setStyle('w-48 h-48')
      playSegment() // Reproducir el audio completo al presionar
    }
  }, [playSegment])

  const handleKeyHold = useCallback((e) => {
    if (e.key === ' ') {
      setStyle('w-48 h-24 shadow-xl')
      playSegment(0, 0.5) // Reproducir un segmento en bucle al mantener
    }
  }, [playSegment])

  const handleKeyRelease = useCallback((e) => {
    if (e.key === ' ') {
      setStyle('w-24 h-24')
      stop()
    }
  }, [stop])

  useApp({ onKeyPress: handleKeyPress, onKeyHold: handleKeyHold, onKeyRelease: handleKeyRelease })

  return (
    <div className={`${style} rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all bg-radial-[at_25%_30%] from-blue-400/70 to-blue-700`} />
  )
}

export default App
