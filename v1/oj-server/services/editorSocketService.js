var redisClient = require('../modules/redisClient');
const TIMEOUT_IN_SECOND = 3600;

module.exports = function(io) {

    var collaborations = {};
    var socketIdToSessionId = {};

    var sessionPath = '/editorSocket/';

    io.on('connection', (socket) => {
        let sessionId = socket.handshake.query['sessionId'];

        socketIdToSessionId[socket.id] = sessionId;

        // if(!(sessionId in collaborations)) {
		// 	collaborations[sessionId] = {
		// 		'participants': []
		// 	};
		// }
        // collaborations[sessionId]['participants'].push(socket.id);

        if (sessionId in collaborations) {
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            redisClient.get(sessionPath + sessionId, function(data) {
                if(data) {
                    console.log('session teminated previously, pulling back from redis');
                    collaborations[sessionId] = {
                        'cachedInstruction': JSON.parse(data),
                        'participants': []
                    };
                } else {
                    console.log('creating new sessionId');
                    collaborations[sessionId] = {
                        'cachedInstruction': [],
                        'participants': []
                    };
                }

                collaborations[sessionId]['participants'].push(socket.id);
            })
        }
        
        socket.on('change', delta => {
            console.log('change ' + socketIdToSessionId[socket.id] + ' ' + 
                delta);

            let sessionId = socketIdToSessionId[socket.id];
            
            if (sessionId in collaborations) {
                collaborations[sessionId]['cachedInstruction'].push(
                    ["change", delta, Date.now()]
                );
                let participants = collaborations[sessionId]['participants'];
                for (let i = 0; i < participants.length; i++) {
                    if (socket.id != participants[i]) {
                        io.to(participants[i]).emit("change", delta);
                    }
                }
            } else {
                console.log('warning: could not find socket id to any collaborations')
            }
        });

        socket.on('restoreBuffer', () => {
            let sessionId = socketIdToSessionId[socket.id];
            console.log('restore buffer for session: ' + sessionId + ', socket: ' + 
                socket.id);
            
            if (sessionId in collaborations) {
                let instructions = collaborations[sessionId]['cachedInstruction'];

                for (let i = 0; i < instructions.length; i++) {
                    socket.emit(instructions[i][0], instructions[i][1]);
                } 
            } else {
                console.log('warning: could not find socket id in collaborations');
            }
        })

        // console.log(socket);

        // var message = socket.handshake.query['message'];

        // console.log(message);

        // io.to(socket.id).emit('message', 'hehe from server');

        socket.on('disconnect', function() {
            let sessionId = socketIdToSessionId[socket.id];
            console.log("socket " + socket.id + " disconnected from session " +
                sessionId);

            let foundAndRemoved = false;

           if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];

                let index = participants.indexOf(socket.id);

                if (index >= 0) {
                    participants.splice(index, 1);
                    foundAndRemoved = true;

                    if (participants.length == 0) {
                        console.log(`last participant in collaboration,
                            commiting to redis and remove from memory`);

                        let key = sessionPath + sessionId;
                        let value = JSON.stringify(collaborations[sessionId]['cachedInstruction']);

                        redisClient.set(key, value, redisClient.redisPrint);
                        
                        redisClient.expire(key, TIMEOUT_IN_SECOND);
                        delete collaborations[sessionId];
                    }
                }
                for (let i = 0; i < participants.length; i++) {
                    io.to(participants[i]).emit("userchange", participants);
                }
            }

            if (!foundAndRemoved) {
                console.log('warning: could not find socket id in collaborations');
            }
        });
        
    });


}