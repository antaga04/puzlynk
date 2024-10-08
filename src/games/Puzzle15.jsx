import { useState, useEffect, useCallback } from 'react';
import Confetti from 'react-confetti';
import BackButton from '../components/BackButton';

const GRID_SIZE = 4;
const CELL_COUNT = GRID_SIZE * GRID_SIZE;
const EMPTY_INDEX = CELL_COUNT - 1;

export default function Puzzle15() {
  const [board, setBoard] = useState(Array.from({ length: CELL_COUNT }, (_, i) => i));
  const [moves, setMoves] = useState(0);
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);
  const [initialBoard, setInitialBoard] = useState([...board]);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    shuffleBoard();
  }, []);

  useEffect(() => {
    let interval;
    if (isRunning && gameStarted) {
      interval = setInterval(() => {
        setTime((prevTime) => prevTime + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRunning, gameStarted]);

  const shuffleBoard = () => {
    const newBoard = Array.from({ length: CELL_COUNT }, (_, i) => i);
    for (let i = newBoard.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newBoard[i], newBoard[j]] = [newBoard[j], newBoard[i]]; // swaps values //! Fisher-Yates shuffle algorithm
    }
    setBoard(newBoard);
    setInitialBoard([...newBoard]);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setGameStarted(false);
    setShowConfetti(false);
  };

  const resetBoard = () => {
    setBoard([...initialBoard]);
    setMoves(0);
    setTime(0);
    setIsRunning(false);
    setGameStarted(false);
    setShowConfetti(false);
  };

  const isSolved = useCallback(() => {
    return board.every((tile, index) => tile === index);
  }, [board]);

  useEffect(() => {
    if (isSolved() && gameStarted) {
      setShowConfetti(true);
      setIsRunning(false);
    }
  }, [isSolved, gameStarted]);

  const canMoveTile = (tileIndex) => {
    const tileRow = Math.floor(tileIndex / GRID_SIZE);
    const tileCol = tileIndex % GRID_SIZE;
    const emptyRow = Math.floor(board.indexOf(EMPTY_INDEX) / GRID_SIZE);
    const emptyCol = board.indexOf(EMPTY_INDEX) % GRID_SIZE;

    return (
      (Math.abs(tileRow - emptyRow) === 1 && tileCol === emptyCol) ||
      (Math.abs(tileCol - emptyCol) === 1 && tileRow === emptyRow)
    );
  };

  const moveTile = (tileIndex) => {
    if (canMoveTile(tileIndex)) {
      const newBoard = [...board];
      const emptyIndex = newBoard.indexOf(EMPTY_INDEX);
      [newBoard[tileIndex], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[tileIndex]];
      setBoard(newBoard);
      setMoves(moves + 1);

      if (!gameStarted) {
        setGameStarted(true);
        setIsRunning(true);
      }
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const isCorrectPosition = (tile, index) => {
    return tile === index && tile !== EMPTY_INDEX;
  };

  return (
    <>
      {showConfetti && <Confetti />}
      <div className="min-h-screen flex flex-col items-center justify-center min-h-scree flex-1">
        <BackButton />

        <h1 className="text-4xl font-bold text-center neon-text text-white mb-4">15 Puzzle</h1>
        <div className="mb-4 text-lg text-slate-300">
          Moves: {moves} | Time: {formatTime(time)}
        </div>
        <div className="grid grid-cols-4 gap-2 p-4 bg-gray-300 rounded-lg shadow-lg">
          {board.map((tile, index) => (
            <button
              key={tile}
              onClick={() => moveTile(index)}
              className={`w-16 h-16 text-xl font-bold rounded-md transition-colors duration-300 focus:outline-none ${
                tile === EMPTY_INDEX
                  ? 'bg-gray-300'
                  : isCorrectPosition(tile, index)
                  ? 'bg-green-200 hover:bg-green-300'
                  : 'bg-gray-100 hover:bg-gray-200'
              } ${canMoveTile(index) ? 'cursor-pointer' : 'cursor-not-allowed'}`}
              disabled={tile === EMPTY_INDEX || !canMoveTile(index)}
            >
              {tile === EMPTY_INDEX ? '' : tile + 1}
            </button>
          ))}
        </div>
        <div className="mt-4 space-x-4">
          <button
            onClick={shuffleBoard}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors duration-300"
          >
            New Game
          </button>
          <button
            onClick={resetBoard}
            className="px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition-colors duration-300"
          >
            Reset
          </button>
        </div>
        {isSolved() && gameStarted && (
          <div className="mt-4 text-xl font-bold text-green-600">
            Congratulations! You solved the puzzle!
          </div>
        )}
      </div>
    </>
  );
}
