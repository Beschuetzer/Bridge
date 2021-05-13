//NOTE: Creating and Maintaining Lobbies (the screen where users change the settings for the game)

const constants = require('./appConstants');
const helpers = require('./helpers');
const rooms = {};

const removeEmptyRoomsInterval = setInterval(() => {
    console.log('running removeEmptyrooms------------------------------------------------');
    for (const roomName in rooms) {
        if (Object.hasOwnProperty.call(rooms, roomName)) {
            const room = rooms[roomName];
            if (room && room.users && room.users.length <= 0) {
                delete rooms[room.name];
            }
        }
    }
}, constants.removeEmptyRoomsInterval);

function roomCreation(socketId, name, password, shouldAddSocketId=true) {
    try {
        console.log('room.js - roomCreation-----------------------------------');
        const room = constants.getNewRoom(name, password);
        if (shouldAddSocketId === true) room.users.push(socketId);
        rooms[name] = room;
        return room;
    } catch (error) {
        console.error('error =', error);
    }
}
function resetTimer(room) {
    try {
        console.log('room.js - resetTimer-----------------------------------');
        room.usernameOfCurrentPlayer = null;
        room.turnStartTime = null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getRoom(name) {
    try {
        console.log('room.js - getRoom-----------------------------------');
        return rooms[name];
    } catch (error) {
        console.error('error =', error);
    }
}
function getPublicRoomCount () {
    try {
        console.log('room.js - getPublicRoomCount-----------------------------------');
        let count = 0;
        for (const name in rooms) {
            if (Object.hasOwnProperty.call(rooms, name)) {
                const room = rooms[name];
                if (room) count++;
            }
        }
        return count;
    } catch (error) {
        console.error('error =', error);
    }
}
function getTenPublicRooms(){
    try {
        // console.log('room.js - getTenPublicRooms-----------------------------------');
        const copy = Object.values(rooms);
        let publicRooms = [];
        let toReturn = [];
        while (publicRooms.length < constants.maxRoomsToLoad && copy.length > 0) {
            const randomIndex = 0 + Math.floor(Math.random() * (copy.length - 1));
            const randomRoom = copy.splice(randomIndex, 1);
            if (randomRoom[0] && randomRoom[0].password === "" && randomRoom[0].users && randomRoom[0].users.length < 4 && randomRoom[0].users.length >= 0) publicRooms.push(rooms[randomRoom[0].name]);
        }
        for (let i = 0; i < publicRooms.length; i++) {
            const room = publicRooms[i];
            toReturn.push({name: room.name, length: room.users.length, password: ""})
        }
        return toReturn;
    } catch (error) {
        console.error('error =', error);
    }
}
function removeRoom(name){
    try {
        console.log('room.js - removeRoom-----------------------------------');
        delete rooms[name];
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function removeUserFromRoom(socketId, room) {
    try {
        console.log('room.js - removeUserFromRoom-----------------------------------');
        console.log('socketId =', socketId);
        const roomToChange = getRoom(room);
        if (roomToChange) {
            const index = roomToChange.users.findIndex(user => user === socketId);
            if (index !== -1) {
                roomToChange.users.splice(index, 1)[0];
                // setTimeout(() => {
                    // console.log('roomToChange =', roomToChange);
                    // if (roomToChange.users && roomToChange.users.length === 0) removeRoom(room);
                // }, 10000);
                return roomToChange;
            }
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function removeCompletionStates(socketId, room) {
    try {
        console.log('room.js - removeCompletionStates-----------------------------------');
        const roomToChange = getRoom(room);
        if (roomToChange) {
            const propertiesToChange = ['cardPlayAnimationCompletion', 'roundEndAnimationCompletion'];
            for (let i = 0; i < propertiesToChange.length; i++) {
                const propertyToChange = propertiesToChange[i];
                if (helpers.objectLength(roomToChange[propertyToChange]) > 0) {
                    const copy = JSON.parse(JSON.stringify(roomToChange[propertyToChange]));
                    roomToChange[propertyToChange] = {};
                    for (const socketIdInObj in copy) {
                        if (copy.hasOwnProperty(socketIdInObj)) {
                            const value = copy[socketIdInObj];
                            if (socketId !== socketIdInObj) {
                                roomToChange[propertyToChange][socketIdInObj] = value;
                            }
                        }
                    }
                }
            }
            return;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function joinRoom(socketId, roomName) {
    try {
        console.log('room.js - joinRoom-----------------------------------');
        const roomToAddTo = rooms[roomName];
        if (roomToAddTo){
            if (!roomToAddTo.users.includes(socketId)) {
                roomToAddTo.users.push(socketId);
            }
            return roomToAddTo.users;
        }
        return false;
    } catch (error) {
        console.error('error =', error);
    }
}
function getRoomPassword(roomName){
    try {
        console.log('room.js - getRoomPassword-----------------------------------');
        const roomToReturn = rooms[roomName];
        if (roomToReturn) {
            return roomToReturn.password;
        }
        return "";
    } catch (error) {
        console.error('error =', error);
    }
}
function setSeatingSpot(username, room, spot) {
    try {
        console.log('room.js - setSeatingSpot-----------------------------------');
        const foundRoom = getRoom(room);
        if (foundRoom){
            foundRoom.seating[spot.toLowerCase()] = username;
            return foundRoom;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function setUserSeatingChoice (socketId, room) {
    try {
        console.log('room.js - setUserSeatingChoice-----------------------------------');
        const foundRoom = getRoom(room);
        if (foundRoom) {
            if (!foundRoom.usersWhoMadeSeatingChoice.includes(socketId)) {
                foundRoom.usersWhoMadeSeatingChoice.push(socketId);
                removeFromRoomArray(socketId, foundRoom.usersReady);
                return foundRoom.usersWhoMadeSeatingChoice;
            }
            return -1;
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function removeFromRoomArray(socketId, arrayToRemoveFrom) {
    try {
        console.log('room.js - removeFromRoomArray-----------------------------------');
        const index = arrayToRemoveFrom.findIndex((socketIdOfUser => socketIdOfUser === socketId));
        if (index !== -1) arrayToRemoveFrom.splice(index, 1);
    } catch (error) {
        console.error('error =', error);
    }
}
function setUserReady (socketId, room) {
    try {
        console.log('room.js - setUserReady-----------------------------------');
        const foundRoom = getRoom(room);
        if (foundRoom) {
            if (foundRoom.usersReady && !foundRoom.usersReady.includes(socketId)) {
                foundRoom.usersReady.push(socketId);
            }
            return foundRoom;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function removeUserSeatingChoice (socketId, room) {
    try {
        console.log('room.js - removeUserSeatingChoice-----------------------------------');
        const foundRoom = getRoom(room);
        if (!foundRoom) return null;
        const index = foundRoom.usersWhoMadeSeatingChoice.findIndex(user => user === socketId);
        if (index !== -1) {
            return foundRoom.usersWhoMadeSeatingChoice.splice(index, 1)[0];
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function resetSeatingSpots(username, room, spot, spotToRemove) {
    try {
        console.log('room.js - resetSeatingSpots-----------------------------------');
        const foundRoom = getRoom(room);
        if (foundRoom){
            foundRoom.seating[spot.toLowerCase()] = username;
            foundRoom.seating[spotToRemove.toLowerCase()] = spotToRemove;
            return foundRoom;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function resetUsersReadyandWhoMadeSeatingChoices(room) {
    try {
        console.log('room.js - resetUsersReadyandWhoMadeSeatingChoices-----------------------------------');
        const foundRoom = getRoom(room);
        if (foundRoom) {
            foundRoom.usersWhoMadeSeatingChoice = [];
            foundRoom.usersReady = [];
            foundRoom.continueFromIncomplete = false;
            return foundRoom;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function resetRoom(roomName) {
    try {
        console.log('room.js - resetRoom-----------------------------------');
        if (roomName && roomName !== -1) {
            const roomToReset = getRoom(roomName);
            if(roomToReset) {
                roomToReset.seating = {north: "North", south: "South", east: "East", west: "West"};
                return roomToReset;
            }
            return -1;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function resetSeatingSpot (room, spot) {
    try {
        console.log('room.js - resetSeatingSpot-----------------------------------');
        // console.log('resetSeatingSpot----------------------');
        // console.log('spot =', spot);
        const roomToResetSpot = getRoom(room);
        if (roomToResetSpot) {
            if (spot) {
                roomToResetSpot.seating[spot.toLowerCase()] = helpers.capitalize(spot);
                return roomToResetSpot.seating;
            }
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function resetArrays(room) {
    try {
        console.log('room.js - resetArrays-----------------------------------');
        const roomToResetSpot = getRoom(room);
        if (!roomToResetSpot) return null;
        // console.log('roomToResetSpot before =', roomToResetSpot);
        roomToResetSpot.usersReady = [];
        roomToResetSpot.usersWhoMadeSeatingChoice = [];
        roomToResetSpot.seating = constants.getDefaultSeating();
        resetInitialScoring(roomToResetSpot);
    } catch (error) {
        console.error('error =', error);
    }
}
function resetInitialScoring(room) {
    try {
        console.log('room.js - resetInitialScoring-----------------------------------');
        room.northSouthAbove = 0;
        room.northSouthBelow = 0;
        room.northSouthVulnerable = false;
        room.eastWestAbove = 0;
        room.eastWestBelow = 0;
        room.eastWestVulnerable = false;
        room.dealer = null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getSeating(room) {
    try {
        console.log('room.js - getSeating-----------------------------------');
        const foundRoom = getRoom(room);
        if (foundRoom) {
            return foundRoom.seating;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
module.exports = {
    rooms,
    resetTimer,
    roomCreation, 
    getRoom,
    getTenPublicRooms,
    removeRoom,
    joinRoom,
    getRoomPassword,
    removeUserFromRoom,
    setSeatingSpot,
    getSeating,
    resetSeatingSpots,
    resetSeatingSpot,
    resetArrays,
    resetRoom,
    setUserSeatingChoice,
    removeUserSeatingChoice,
    removeFromArray: removeFromRoomArray,
    setUserReady,
    resetUsersReadyandWhoMadeSeatingChoices,
    removeCompletionStates,
    getPublicRoomCount,
}
