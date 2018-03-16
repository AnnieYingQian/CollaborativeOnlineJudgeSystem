module.exports = function(io) {
    var collaborations = {};

    // map from socketId to sessionId
    var socketIdTSessionId = {};

    io.on('connection', (socket) => {
        // console.log(socket);
        // var message = socket.handshake.query['message'];
        // console.log(message);

        // io.to(socket.id).emit('message', 'hehe from server');
        let sessionId = socket.handshake.query['sessionId'];

        socketIdTSessionId[socket.id] = sessionId;
        
        // no one does this problem before
        if (!(sessionId in collaborations)) {
            collaborations[sessionId] = {
                'participants': []
            };
        }

        collaborations[sessionId]['participants'].push(socket.id);

        //socket event listeners
        //delta is the change info
        //it records the row and column of the changes
        socket.on('change', delta => {
            console.log("change " + socketIdTSessionId[socket.id] + " " + delta);
            //get session id based on socket.id
            let sessionId = socketIdTSessionId[socket.id];
            if (sessionId in collaborations) {
                //get all participants on this session
                let participants = collaborations[sessionId]['participants'];
                //send changes to all participants
                for (let i = 0; i < participants.length; i++) {
                    //skip one who create this change
                    if (socket.id != participants[i]) {
                        io.to(participants[i]).emit("change", delta);
                    }
                }
            } else {
                console.log("could not tie socket id to any collboration");
            }
        })
    })
}