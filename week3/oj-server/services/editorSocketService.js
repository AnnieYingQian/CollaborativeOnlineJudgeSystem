var redisClient = require('../module/redisClient');
const TIMEOUT_IN_SECOND = 3600;

module.exports = function(io) {
    // redis can serve different application
    // each application has their own session
    var sessionPath = '/temp_session';

    var collaborations = {};

    // map from socketId to sessionId
    var socketIdToSessionId = {};

    io.on('connection', (socket) => {
        // console.log(socket);
        // var message = socket.handshake.query['message'];
        // console.log(message);

        // io.to(socket.id).emit('message', 'hehe from server');
        let sessionId = socket.handshake.query['sessionId'];

        socketIdToSessionId[socket.id] = sessionId;
        // when connection, first check in collaborations
        if (sessionId in collaborations) {
            // add current socketId to participants
            collaborations[sessionId]['participants'].push(socket.id);
        } else {
            // not in memory check in redis
            redisClient.get(sessionPath + '/' + sessionId, function(data) {
                if (data) {
                    console.log("session terminated previously, get back from redis");
                    collaborations[sessionId] = {
                        'cachedInstructions': JSON.parse(data),
                        'participants': [] //empty, we willl add to the current participant later
                    } 
                } else {
                    // this may be the first time created or expired
                    // create new session
                    console.log("creating new session");
                    collaborations[sessionId] = {
                        'cachedInstructions': [],
                        'participants': []
                    }
                }
                // add the current socket into participants list
                collaborations[sessionId]['participants'].push(socket.id);
            })
        }

        
        // // no one does this problem before
        // if (!(sessionId in collaborations)) {
        //     collaborations[sessionId] = {
        //         'participants': []
        //     };
        // }

        // collaborations[sessionId]['participants'].push(socket.id);

        //socket event listeners
        //delta is the change info
        //it records the row and column of the changes
        socket.on('change', delta => {
            console.log("change " + socketIdToSessionId[socket.id] + " " + delta);
            //get session id based on socket.id
            let sessionId = socketIdToSessionId[socket.id];
            if (sessionId in collaborations) {
                //store the changes
                collaborations[sessionId]['cachedInstructions'].push(['change',delta,Date.now()]);
            }

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

        socket.on('restoreBuffer', () => {
            // get sessionId
            let sessionId = socketIdToSessionId[socket.id];
            console.log("restore buffer for session" + sessionId, "socket id:" + socket.id);

            // first chech if the session in memory
            if (sessionId in collaborations) {
                // get the history instructions
                let instructions = collaborations[sessionId]['cachedInstructions'];
                //emit change event for every history changes
                // so that participants can get the history changes
                for (let i = 0; i < instructions.length; i++) {
                    // instructions[i][0]: change
                    // instructions[i][1]: change value (delta)
                    socket.emit(instructions[i][0], instructions[i][1]);
                }
            } else {
                console.log("could not find any collaboration for this session");
            }
        }) 

        // disconnect happens when participants close the session
        socket.on('disconnect', function() {
            let sessionId = socketIdToSessionId[socket.id];
            console.log("disconnect session" + sessionId, "sockect id:" + socket.id);

            let foundAndRemoved = false;

            if (sessionId in collaborations) {
                let participants = collaborations[sessionId]['participants'];
                let index = participants.indexOf(socket.id);

                // if find then removed
                if (index >= 0) {
                    //remove the participants
                    participants.splice(index, 1);
                    foundAndRemoved = true;
                    //then check if this is the last participant
                    if (participants.length == 0) {
                        console.log("last participant in collaboration, committing to redis and remove from memory");
                        let key = sessionPath + '/' + sessionId;
                        //convert to JSON object into string
                        let value = JSON.stringify(collaborations[sessionId]['cachedInstructions']);
                        //store in redis
                        redisClient.set(key, value, redisClient.redisPrint);

                        // set expire time
                        redisClient.expire(key, TIMEOUT_IN_SECOND);

                        delete collaborations[sessionId];
                    }
                }
            }

            if (!foundAndRemoved) {
                // if reach here ,debug needed
                console.log("Warning: cound not find the socket.id in collaborations");
            }
        })
    })
}