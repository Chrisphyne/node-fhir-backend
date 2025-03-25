import { io } from "../app";

import { Server } from "socket.io";
import { registerOfficerSocket } from "./socket/officer";

export function socketsManager() {
    const maximum = process.env.MAXIMUM || 100;


    let users = {};
    let usersData = {};

    let socketToRoom = {};
    let mess = []
    let activeProduct = 0
io.on('connection', socket => {
    
        
    socket.on('service_Number', data => {
        console.log('====================================');
        console.log(data,socket.id, "register service number");
        console.log('====================================');

        registerOfficerSocket({ serviceNumber: data, socketId: socket.id });

    })




    socket.on('message', data => {
        mess.push(data)
        io.emit('message', mess)
        console.log('====================================');
        console.log(mess);
        console.log('====================================');

    })
    socket.on('product', data => {
        activeProduct = data
        io.emit('product', activeProduct);
    })

    socket.on('users', data => {

        socket.to(socket.id).emit('users', users)

    })
    socket.on('join_room', data => {

        io.emit('message', mess)
        if (users[data.room]) {
            const length = users[data.room].length;
            if (length === maximum) {
                socket.to(socket.id).emit('room_full');
                return;
            }
            users[data.room].push({ id: socket.id, email: data.email });
        } else {
            users[data.room] = [{ id: socket.id, email: data.email }];
        }
        socketToRoom[socket.id] = data.room;

        socket.join(data.room);
        console.log(`[${socketToRoom[socket.id]}]: ${socket.id} enter`);

        const usersInThisRoom = users[data.room].filter(user => user.id !== socket.id);


        io.sockets.to(socket.id).emit('all_users', usersInThisRoom);
    });

    socket.on('offer', data => {

        socket.to(data.offerReceiveID).emit('getOffer', { sdp: data.sdp, offerSendID: data.offerSendID, offerSendEmail: data.offerSendEmail });
    });

    socket.on('answer', data => {
        //console.log(data.sdp);
        socket.to(data.answerReceiveID).emit('getAnswer', { sdp: data.sdp, answerSendID: data.answerSendID });
    });

    socket.on('candidate', data => {
        //console.log(data.candidate);
        socket.to(data.candidateReceiveID).emit('getCandidate', { candidate: data.candidate, candidateSendID: data.candidateSendID });
        // socket.broadcast().e 
    })

    socket.on('disconnect', () => {
        const roomID = socketToRoom[socket.id];
        let room = users[roomID];
        if (room) {
            room = room.filter(user => user.id !== socket.id);
            users[roomID] = room;
            if (room.length === 0) {
                delete users[roomID];
                return;
            }
        }
        socket.to(roomID).emit('user_exit', { id: socket.id });

    })
});
}


