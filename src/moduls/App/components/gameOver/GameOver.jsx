function GameOver({ good, onReset, onHome }) {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 text-center">
        <h2 className="text-3xl font-bold text-red-700">Game Over</h2>
        <p className="mt-2 text-gray-700">Aciertos: <span className="font-mono font-semibold">{good}</span></p>
        <div className="mt-6 flex gap-3">
          <button onClick={onReset} className="flex-1 bg-cyan-600 hover:bg-cyan-700 text-white font-semibold py-2 rounded">Reintentar</button>
          <button onClick={onHome} className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 rounded">Inicio</button>
        </div>
      </div>
    </div>
  )
}

export default GameOver