import React, { useCallback, useEffect, useState } from 'react';
import { Button, Segment } from 'semantic-ui-react';
import { io, Socket } from "socket.io-client";
import useLocalUser from '../hooks/useLocalUser';
import * as userAPI from '../utils/api/user';
import './TicTacToePage.scss';

function TicTacToePage() {
  const [boardState, setBoardState] = useState([["", "", ""], ["", "", ""], ["", "", ""]]);
  const [boardDisabled, setBoardDisabled] = useState(true);
  const [message, setMessage] = useState("Waiting for an opponent...");
  const [myTurn, setMyTurn] = useState(true);
  const [nextTurnSymbol, setNextTurnSymbol] = useState('');
  const [mySymbol, setMySymbol] = useState('');
  const [gameStarted, setGameStarted] = useState(false);
  const [recentMove, setRecentMove] = useState({rowIndex: 0, columnIndex: 0, symbol: ''})
  const [socket, setSocket] = useState<Socket | null>(null);
  const [formDisabled, setFormDisabled] = useState(true);
  const {user} = useLocalUser(true);

  const isGameOver = useCallback(() => {
    let matches = ["XXX", "OOO"];

    let rows = [
      boardState[0][0] + boardState[0][1] + boardState[0][2], // 1st line
      boardState[1][0] + boardState[1][1] + boardState[1][2], // 2nd line
      boardState[2][0] + boardState[2][1] + boardState[2][2], // 3rd line
      boardState[0][0] + boardState[1][0] + boardState[2][0], // 1st column
      boardState[0][1] + boardState[1][1] + boardState[2][1], // 2nd column
      boardState[0][2] + boardState[1][2] + boardState[2][2], // 3rd column
      boardState[0][0] + boardState[1][1] + boardState[2][2], // Primary diagonal
      boardState[0][2] + boardState[1][1] + boardState[2][0]  // Secondary diagonal
    ];

    // Loop through all the rows looking for a match
    for (let i = 0; i < rows.length; i++) {
        if (rows[i] === matches[0] || rows[i] === matches[1]) {
            return true;
        }
    }

    return false;
  }, [boardState])

  const renderTurnMessage = useCallback(() => {
    if (!myTurn) { // If not player's turn disable the board
        setMessage("Your opponent's turn")
        setBoardDisabled(true);
    } else { // Enable it otherwise
        setMessage("Your turn.");
        setBoardDisabled(false);
    }
  }, [myTurn])

  const onBoardElementClick = useCallback((rowIndex: number, columnIndex: number) => {
    if (!myTurn) return; 
    if (boardState[rowIndex][columnIndex]) return;

    socket?.emit("make.move", { // Valid move (on client side) -> emit to server
        symbol: mySymbol,
        rowIndex,
        columnIndex
    });
  }, [mySymbol, boardState, myTurn, socket]);

  const onStartGame = useCallback(() => {
    const newSocket = io('http://localhost:8080')
    setSocket(newSocket)
  
    newSocket.on("game.begin", (data) => {
      const symbol = data.symbol;
      setGameStarted(true);
      setMySymbol(symbol);
      setNextTurnSymbol("X");
    });

    // Bind event on players move
    newSocket.on("move.made", (data) => {
      setRecentMove({rowIndex: data.rowIndex, columnIndex: data.columnIndex, symbol: data.symbol})
      if (data.symbol === 'X') setNextTurnSymbol('O');
      else setNextTurnSymbol('X');
    });

    // Bind on event for opponent leaving the game
    newSocket.on("opponent.left", () => {
        setMessage("Your opponent left the game.");
        setBoardDisabled(true);
    });
    setFormDisabled(false);
  }, [])

  const checkGameOver = useCallback(async () => {
    if(gameStarted) {
      if (!isGameOver()) renderTurnMessage();
      else  { // Else show win/lose message
        if (myTurn) {
          await userAPI.incrementLoses(user.id);
          setMessage("You lost.");
        }
        else {
          await userAPI.incrementWins(user.id)
          setMessage("You won!");
        }
        setBoardDisabled(true); // Disable board
      }
    }
  }, [isGameOver, renderTurnMessage, myTurn, gameStarted, user.id])

  useEffect(() => {
    if (gameStarted) {
      let isMyTurn = nextTurnSymbol === mySymbol;
      setMyTurn(isMyTurn);
  }
  }, [nextTurnSymbol, mySymbol, gameStarted]);

  useEffect(() => {
    checkGameOver();
  }, [checkGameOver])

  useEffect(() => {
    setBoardState(prevState => {
      let boardStateCopy = prevState;
      boardStateCopy[recentMove.rowIndex][recentMove.columnIndex] = recentMove.symbol;
      return boardStateCopy;
    });
  }, [recentMove])

  useEffect(() => {
    return () => {
      socket?.off('opponent.left');
      socket?.off('move.made');
      socket?.off('game.begin');
      socket?.disconnect();
    };
  }, [socket])

  return (
    <div className="TicTacToePage">
      <Segment disabled={formDisabled} className='wrapper'>
        <div id="message">{formDisabled ? "" : message}</div>
        <div className="board">
          {boardState.map((row, rowIndex) => row.map((_, columnIndex) => 
            <BoardElement rowIndex={rowIndex} columnIndex={columnIndex} onCheck={onBoardElementClick} value={boardState[rowIndex][columnIndex]} disabled={boardDisabled} />
          ))}
        </div>
      </Segment>
      <Button disabled={!boardDisabled} onClick={onStartGame}>Start a game</Button>
    </div>
  );
}

interface BoardElementProps {
  value: string;
  rowIndex: number;
  columnIndex: number;
  onCheck: (rowIndex: number, columnIndex: number) => void;
  disabled: boolean
}

const BoardElement = ({rowIndex, columnIndex, onCheck, disabled, value}: BoardElementProps) => {
  const onClick = useCallback(() => {
    onCheck(rowIndex, columnIndex);
  }, [rowIndex, columnIndex, onCheck]);

  return <button disabled={disabled} onClick={onClick}>{value}</button>
}

export default TicTacToePage;