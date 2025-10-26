import { useState, useEffect, useRef, useCallback } from "react"

/**
 * Hook personalizado para manejar la reproducción de audio, incluyendo segmentos con bucle.
 *
 * @param {string} audioSrc - URL o ruta del archivo de audio a cargar.
 * @param {Object} [options={}] - Opciones de configuración del audio.
 * @param {boolean} [options.loop=false] - Indica si el audio debe reproducirse en bucle completo.
 * @param {number} [options.volume=1] - Volumen inicial del audio (0 a 1).
 * @returns {{playSegment: function, stop: function}} Objeto con funciones para controlar la reproducción.
 */
function useAudio(audioSrc, { loop = false, volume = 1 } = {}) {
    const [audio] = useState(new Audio())
    const [isLoaded, setIsLoaded] = useState(false);
    const segmentStartRef = useRef(0);
    const segmentEndRef = useRef(0);
    const isPlayingSegmentRef = useRef(false);

    useEffect(() => {
        audio.src = audioSrc;
        audio.volume = volume;
        audio.loop = loop;

        audio.addEventListener('canplaythrough', () => {
            setIsLoaded(true);
        });

        const handleTimeUpdate = () => {
            if (isPlayingSegmentRef.current && audio.currentTime >= segmentEndRef.current) {
                audio.currentTime = segmentStartRef.current;
            }
        };

        audio.addEventListener('timeupdate', handleTimeUpdate);

        return () => {
            setIsLoaded(false);
            audio.removeEventListener('timeupdate', handleTimeUpdate);
            audio.pause(); // Asegurarse de que el audio se detenga
            audio.src = ''; // Liberar el recurso de audio
        };
    }, [audio, loop, volume, audioSrc]);

    /**
     * Reproduce un segmento específico del audio o el audio completo.
     *
     * @param {number} [start=0] - Tiempo de inicio en segundos.
     * @param {number} [duration] - Duración del segmento en segundos. Si se omite, se reproduce el audio completo.
     */
    const playSegment = useCallback((start = 0, duration) => {
        if (!isLoaded || isPlayingSegmentRef.current) return;

        if (duration !== undefined) {
            audio.loop = false; // Desactivar el bucle completo del audio
            segmentStartRef.current = start;
            segmentEndRef.current = start + duration;
            isPlayingSegmentRef.current = true;
            return
        } else {
            // Si no hay duración, se reproduce el audio completo (y respeta audio.loop)
            segmentStartRef.current = 0;
            segmentEndRef.current = audio.duration;
            isPlayingSegmentRef.current = false;
            audio.loop = loop;
        }

        audio.currentTime = start;
        audio.play();
    }, [audio, loop, isLoaded]);

    /**
     * Detiene la reproducción y reinicia el tiempo del audio.
     */
    const stop = useCallback(() => {
        isPlayingSegmentRef.current = false;
        audio.pause();
        audio.currentTime = 0;
        audio.loop = loop;
    }, [audio, loop]);

    return { playSegment, stop };
}
export default useAudio