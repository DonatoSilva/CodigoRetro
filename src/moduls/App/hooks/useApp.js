import React, { useEffect, useRef } from 'react'

// Define los retrasos para la detección de la tecla mantenida
const INITIAL_HOLD_DELAY = 150; // Tiempo antes de que onKeyHold comience a repetirse (ms)
const HOLD_REPEAT_INTERVAL = 50;  // Intervalo para la repetición de onKeyHold (ms)

/**
 * Hook personalizado que gestiona eventos de teclado global.
 * Detecta cuando una tecla se presiona por primera vez y cuando se mantiene presionada.
 *
 * @param {Object} params - Parámetros del hook.
 * @param {Function} params.onKeyPress - Función que se ejecuta cuando una tecla se presiona por primera vez.
 * @param {Function} params.onKeyHold - Función que se ejecuta mientras una tecla permanece presionada.
 * @param {Function} params.onKeyRelease - Función que se ejecuta cuando una tecla se suelta.
 *
 * @returns {Object} Objeto vacío (reservado para futura extensión).
 */
function useApp({ onKeyPress, onKeyHold, onKeyRelease }) {
    if (typeof onKeyPress !== 'function') {
        throw new Error('useApp: onKeyPress must be a function')
    }
    if (typeof onKeyHold !== 'function') {
        throw new Error('useApp: onKeyHold must be a function')
    }
    if (typeof onKeyRelease !== 'function') {
        throw new Error('useApp: onKeyRelease must be a function')
    }

    const pressedKeys = useRef(new Set())
    const keyHoldTimers = useRef({});

    useEffect(() => {
        const handleKeyDown = (e) => {
            const key = e.key;

            if (pressedKeys.current.has(key)) return
            // Esta es la primera vez que se presiona esta tecla
            pressedKeys.current.add(key);
            onKeyPress && onKeyPress(e);

            // Inicia un temporizador para detectar si la tecla se mantiene presionada
            const initialTimeoutId = setTimeout(() => {
                if (pressedKeys.current.has(key)) {
                    onKeyHold && onKeyHold(e); // Llama a onKeyHold una vez inmediatamente después del retraso inicial

                    const repeatIntervalId = setInterval(() => {
                        if (!pressedKeys.current.has(key)) {
                            clearInterval(repeatIntervalId);
                            delete keyHoldTimers.current[key].repeatIntervalId;
                        }

                        onKeyHold && onKeyHold(e);
                    }, HOLD_REPEAT_INTERVAL);
                    keyHoldTimers.current[key].repeatIntervalId = repeatIntervalId;
                }
                delete keyHoldTimers.current[key].initialTimeoutId; // Limpia la referencia del temporizador inicial
            }, INITIAL_HOLD_DELAY);

            keyHoldTimers.current[key] = { initialTimeoutId };
        };

        const handleKeyUp = (e) => {
            const key = e.key;
            if (pressedKeys.current.has(key)) {
                pressedKeys.current.delete(key);
                onKeyRelease && onKeyRelease(e);

                // Limpia cualquier temporizador pendiente para esta tecla
                if (keyHoldTimers.current[key]) {
                    if (keyHoldTimers.current[key].initialTimeoutId) {
                        clearTimeout(keyHoldTimers.current[key].initialTimeoutId);
                    }
                    if (keyHoldTimers.current[key].repeatIntervalId) {
                        clearInterval(keyHoldTimers.current[key].repeatIntervalId);
                    }
                    delete keyHoldTimers.current[key];
                }
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);

            // Limpia todos los temporizadores al desmontar el componente
            for (const key in keyHoldTimers.current) {
                if (keyHoldTimers.current[key].initialTimeoutId) {
                    clearTimeout(keyHoldTimers.current[key].initialTimeoutId);
                }
                if (keyHoldTimers.current[key].repeatIntervalId) {
                    clearInterval(keyHoldTimers.current[key].repeatIntervalId);
                }
            }
            keyHoldTimers.current = {};
        };
    }, [onKeyPress, onKeyHold, onKeyRelease]);

    return {};
}
export default useApp