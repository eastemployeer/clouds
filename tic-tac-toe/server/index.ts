import * as http from 'http';
import express from 'express';
import cors from 'cors';
import { Server, Socket } from "socket.io"
import router from '../routes';
import cookieParser from 'cookie-parser';

interface Clients {
    [key: string]: Socket;
}

interface Players {
    [key: string]: {
        opponent: string | null,
        symbol: string,
        socket: Socket
    }
}

const app = express();

const server = http.createServer(app);
server.listen(8080);
const io = new Server(server, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"]
      }
});
const clients: Clients = {};

app.use(express.json({ limit: '10kb' })); 
app.use(cors());
app.use(cookieParser());
app.use(express.static(__dirname + "/../node_modules/"));
app.use('/', router)

let players: Players = {}; 
let unmatched: string | null = '';


// When a client connects
io.on("connection", (socket: Socket) => {
    let id = socket.id;

    console.log("New client connected. ID: ", socket.id);
    clients[socket.id] = socket;

    socket.on("disconnect", () => {// Bind event for that socket (player)
        console.log("Client disconnected. ID: ", socket.id);
        delete clients[socket.id];
        socket.broadcast.emit("clientdisconnect", id);
    });

    join(socket);

    const opponent = opponentOf(socket);

    if (opponent) { // If the current player has an opponent the game can begin
        socket.emit("game.begin", { // Send the game.begin event to the player
            player: socket.id,
            symbol: players[socket.id].symbol
        });

        opponent.emit("game.begin", { // Send the game.begin event to the opponent
            player: opponent.id,
            symbol: players[opponent.id].symbol 
        });
    }


    // Event for when any player makes a move
    socket.on("make.move", (data) => {
        const opponent = opponentOf(socket)

        if (!opponent) return;
        
        // Validation of the moves can be done here

        socket.emit("move.made", data); // Emit for the player who made the move

        opponent.emit("move.made", data); // Emit for the opponent
    });

    // Event to inform player that the opponent left
    socket.on("disconnect", () => {
        const opponent = opponentOf(socket);
        if (opponent) opponent.emit("opponent.left");
    });
});


function join(socket: Socket) {
    players[socket.id] = {
        opponent: unmatched,
        symbol: "X",
        socket: socket
    };

    // If 'unmatched' is defined it contains the socket.id of the player who was waiting for an opponent
    // then, the current socket is player #2
    if (unmatched) { 
        players[socket.id].symbol = "O";
        players[unmatched].opponent = socket.id;
        unmatched = null;
    } else { //If 'unmatched' is not define it means the player (current socket) is waiting for an opponent (player #1)
        unmatched = socket.id;
    }
}

function opponentOf(socket: Socket) {
    let opponent = players[socket.id].opponent;
    if (!opponent) return;
    
    return players[opponent].socket;
}