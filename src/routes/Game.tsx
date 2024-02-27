import { useState, useEffect } from 'react';

const Game = () => {
  const [player1Y, setPlayer1Y] = useState(0);
  const [player2Y, setPlayer2Y] = useState(0);
  const [ballX, setBallX] = useState(0);
  const [ballY, setBallY] = useState(0);
  const [ballSpeedX, setBallSpeedX] = useState(2);
  const [ballSpeedY, setBallSpeedY] = useState(2);
  const [score, setScore] = useState({ player1: 0, player2: 0 });
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPlayer1MovingUp, setIsPlayer1MovingUp] = useState(false);
  const [isPlayer1MovingDown, setIsPlayer1MovingDown] = useState(false);
  const [isPlayer2MovingUp, setIsPlayer2MovingUp] = useState(false);
  const [isPlayer2MovingDown, setIsPlayer2MovingDown] = useState(false);
  const paddleHeight = 100;
  const paddleWidth = 10;
  const ballSize = 15;
  const gameWidth = 700;
  const gameHeight = 400;
  const moveStep = 5;

  const handlePlayer1MoveUp = () => {
    setPlayer1Y((prevY) => Math.max(prevY - moveStep, 0));
  };

  const handlePlayer1MoveDown = () => {
    setPlayer1Y((prevY) => Math.min(prevY + moveStep, gameHeight - paddleHeight));
  };

  const handlePlayer2MoveUp = () => {
    setPlayer2Y((prevY) => Math.max(prevY - moveStep, 0));
  };

  const handlePlayer2MoveDown = () => {
    setPlayer2Y((prevY) => Math.min(prevY + moveStep, gameHeight - paddleHeight));
  };

useEffect(() => {
  if (!isPlaying) return;

  const updateBall = () => {
    let newBallX = ballX + ballSpeedX;
    let newBallY = ballY + ballSpeedY;

    if (newBallY <= 0 || newBallY >= gameHeight - ballSize) {
      setBallSpeedY((prevSpeedY) => -prevSpeedY);
      newBallY = newBallY <= 0 ? 0 : gameHeight - ballSize;
    }

    if (
      newBallX <= paddleWidth &&
      newBallY + ballSize >= player1Y &&
      newBallY <= player1Y + paddleHeight
    ) {
      setBallSpeedX((prevSpeedX) => -prevSpeedX);
      newBallX = paddleWidth;
    }

    if (
      newBallX + ballSize >= gameWidth - paddleWidth &&
      newBallY + ballSize >= player2Y &&
      newBallY <= player2Y + paddleHeight
    ) {
      setBallSpeedX((prevSpeedX) => -prevSpeedX);
      newBallX = gameWidth - paddleWidth - ballSize;
    }

    if (newBallX <= 0) {
      setScore((prevScore) => ({ ...prevScore, player2: prevScore.player2 + 1 }));
      setIsPlaying(false);
    } else if (newBallX + ballSize >= gameWidth) {
      setScore((prevScore) => ({ ...prevScore, player1: prevScore.player1 + 1 }));
      setIsPlaying(false);
    }

    setBallX(newBallX);
    setBallY(newBallY);
  };

  const gameLoop = setInterval(updateBall, 5);

  return () => clearInterval(gameLoop);
}, [isPlaying, ballX, ballY, player1Y, player2Y]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'w') {
        setIsPlayer1MovingUp(true);
      } else if (e.key === 's') {
        setIsPlayer1MovingDown(true);
      } else if (e.key === 'ArrowUp') {
        setIsPlayer2MovingUp(true);
      } else if (e.key === 'ArrowDown') {
        setIsPlayer2MovingDown(true);
      } else if (e.key === ' ') {
        startRound();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'w') {
        setIsPlayer1MovingUp(false);
      } else if (e.key === 's') {
        setIsPlayer1MovingDown(false);
      } else if (e.key === 'ArrowUp') {
        setIsPlayer2MovingUp(false);
      } else if (e.key === 'ArrowDown') {
        setIsPlayer2MovingDown(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  const startRound = () => {
    setBallX(gameWidth / 2 - ballSize / 2);
    setBallY(gameHeight / 2 - ballSize / 2);
    setBallSpeedX(2);
    setBallSpeedY(2);
    setIsPlaying(true);
  };

  useEffect(() => {
    const movePlayer1 = () => {
      if (isPlayer1MovingUp) {
        handlePlayer1MoveUp();
      } else if (isPlayer1MovingDown) {
        handlePlayer1MoveDown();
      }
    };

    const player1MoveInterval = setInterval(movePlayer1, 10);

    return () => clearInterval(player1MoveInterval);
  }, [isPlayer1MovingUp, isPlayer1MovingDown]);

  useEffect(() => {
    const movePlayer2 = () => {
      if (isPlayer2MovingUp) {
        handlePlayer2MoveUp();
      } else if (isPlayer2MovingDown) {
        handlePlayer2MoveDown();
      }
    };

    const player2MoveInterval = setInterval(movePlayer2, 10);

    return () => clearInterval(player2MoveInterval);
  }, [isPlayer2MovingUp, isPlayer2MovingDown]);

  return (
    <>
      <div className="score">
          <div>Player1: <span className="score-number">{score.player1}</span></div>
          <div>Player2: <span className="score-number">{score.player2}</span></div>
        </div>
      <div className="game">
        <div
          className="paddle"
          style={{ top: player1Y, left: 0, height: paddleHeight }}
        />
        <div
          className="paddle"
          style={{ top: player2Y, right: 0, height: paddleHeight }}
        />
        <div
          className="ball"
          style={{ top: ballY, left: ballX, width: ballSize, height: ballSize }}
        />
      </div>
    </>
  );
};

export default Game;
