//NOTE: Tracking users to make sure they are only able to join one lobby/game

const User = require('../models/user');
const roomUtils = require('./appRooms');
const constants = require('./appConstants');
const users = [];
//Join user to chat
async function userJoin(socketId, username, room) {
    try {
        console.log('users.js - userJoin----------------------------------------');
        //TODO: need to find a way to see if user is already in room
        // console.log('userJoin-------------------------------------');
        const usersInRoom = getUsersInRoom(room);
        // console.log('usersInRoom before =', usersInRoom);
        let canEnter = true;
        for (let i = 0; i < usersInRoom.length; i++) {
            const user = usersInRoom[i];
            if (user.username === username) {
                canEnter = false;
            }
        }
        // console.log('canEnter =', canEnter);
        if (canEnter){
            try {
                const foundUser = await User.findOne({username});
                if (foundUser) {
                    const user = constants.getNewUser(socketId, username, room, foundUser.preferences);
                    if (!users.includes(user)){
                        users.push(user);
                    }
                    return user;
                }
                console.log('No user found in userJoin in userutils');
                return null;
            } catch (error) {
                console.log("Error finding user in Database");
                return null;
            }
        }
        else {
            console.log('need to do something here to remove users room');
            // console.log('socket id predicted: someValue; actual =', socketId);
            //get the name of the room the user is supposedly in
            const roomUserIsIn = roomUtils.getRoom(room);
            if (!roomUserIsIn) {
                const userObj = getUser(socketId);
                if (!userObj) return null;
                // console.log(`removing ${userObj.username} from ${userObj.room}`);
                userObj.room = "";
            }
            else {
                if (roomUserIsIn.users.length <= 0) { 
                    roomUtils.removeRoom(roomUserIsIn.name);
                    // console.log('removing as is empty room name =', roomUserIsIn.name);
                }
            }
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUser(socketId) {
    try {
        console.log('users.js - getUser----------------------------------------');
        const foundUser = users.find(user => user.socketId === socketId);
        // console.log('foundUser =', foundUser);
        if (foundUser) return foundUser;
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUserObj (usernameFromOutside) {
    try {
        console.log('users.js - getUserObj----------------------------------------');
        if (!usernameFromOutside) return null;
        const index = users.findIndex(user => {
            console.log(user.username === usernameFromOutside);
            return user.username === usernameFromOutside;
        });
        if (index !== -1) return users[index];
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUserId(username) {
    try {
        console.log('users.js - getUserId----------------------------------------');
        const foundUser = users.find(user => user.username === username);
        if (foundUser) {
            return foundUser.socketId;
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function getAllUsers(){
    console.log('users.js - getAllUsers----------------------------------------');
    return users;
}
function removeUser(socketId){
    try {
        console.log('users.js - removeUser----------------------------------------');
        const index = users.findIndex(user => user.socketId === socketId);
        if (index !== -1) {
            return users.splice(index, 1)[0];
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function getUsersInRoom(room) {
    try {
        console.log(`users.js - getUsersInRoom ${room}----------------------------------------`);
        const usersToReturn = users.filter(user => user.room === room);
        return usersToReturn;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUsernamesOfUsersInRoom(room) {
    try {
        console.log('users.js - getUsernamesOfUsersInRoom----------------------------------------');
        if (!room) return null;
        const userObjs = getUsersInRoom(room);
        // console.log('userObjs =', userObjs);
        return userObjs.reduce((arrayOfUsernames, userObj) => {
            if (!arrayOfUsernames.includes(userObj.username)) arrayOfUsernames.push(userObj.username);
            // console.log('arrayOfUsernames =', arrayOfUsernames);
            return arrayOfUsernames;
        }, []);
    } catch (error) {
        console.error('error =', error);
    }
}
async function isRegisteredUser(username) {
    console.log('users.js - isRegisteredUser----------------------------------------');
    try {
        const foundUser = await User.findOne({username});
        if (foundUser) return true;
    } catch (error) {
        return -1;
    }
    return false;
}
function addUserObj(userObj) {
    try {
        console.log('users.js - addUserObj----------------------------------------');
        if (!userObj) return null;
        if (!users.includes(userObj)) {
            users.push(userObj);
            // console.log('adding UserObj-----------------------------');
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function updateStatusOfUsers(usernames, status) {
    try {
        console.log('users.js - updateStatusOfUsers----------------------------------------');
        if (!usernames || !status) return;
        usernames.forEach(username => {
            const userObj = getUserObj(username);
            userObj.status = status;
        });
    } catch (error) {
        console.error('error =', error);
    }
}
module.exports = {
    userJoin,
    getUserId, 
    getUser,
    removeUser,
    getRoomUsers: getUsersInRoom,
    getAllUsers,
    isRegisteredUser,
    addUserObj,
    getUsernamesOfUsersInRoom,
    getUserObj,
    updateStatusOfUsers,
    users,
}