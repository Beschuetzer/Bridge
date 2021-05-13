//Controlloer for the routes related to actually playing a game

const User = require('../models/user');
const timesRequestSent = {};

module.exports.start = async (req, res) => {
    try {
        let userObj;
        let colorTheme =  res.app.settings.hasSentTheme[res.locals.currentUser.username] ? res.app.settings.hasSentTheme[res.locals.currentUser.username] : defaultColorTheme;
        console.log('res.app.settings.hasSentTheme =', res.app.settings.hasSentTheme);
        if (!res.app.settings.hasSentTheme[res.locals.currentUser.username]) {
            console.log('getting userObj------------------------------------------------');
            userObj = await User.findOne({username: res.locals.currentUser.username});
            res.app.settings.hasSentTheme[res.locals.currentUser.username] = userObj.preferences.colorTheme;
            colorTheme = userObj.preferences.colorTheme;
        }

        if (req.query.alreadyExists) {
            req.flash('error', `The room '${req.query.room}' already exists.  Try joining instead.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.incorrectPassword){
            req.flash('error', `Incorrect Password for room '${req.query.room}'.  Try again.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.createRoomFirst) {
            req.flash('error', `Unable to join '${req.query.room}' as it doesn't exist.  Try creating it.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.full) {
            req.flash('error', `'${req.query.room}' is full.  Try creating a new lobby.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.invalidRoomName) {
            req.flash('error', `Please enter a room name that is less than 12 characters.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.gameInSession) {
            req.flash('error', `'${req.query.room}' is in session.  ${req.query.sender === 'create' ? "Create" : 'Join'} a lobby with a different name.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.notInSession) {
            if (req.query.type && req.query.type.toLowerCase() === 'spamming') {
                req.flash('error', `The room ${req.query.room} has been terminated due to spamming.  Code: ${req.query.code}.`);
                return res.redirect(`/start`);
            }
            if (req.query.room && req.query.username) {
                req.flash('error', `There is no ${req.query.type === "game" ? `game '${req.query.room}' in session` : `lobby named '${req.query.room}'`}.  Code: ${req.query.code}.`);
                return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
            } 
            else if (req.query.username) {
                req.flash('error', `There is no ${req.query.type === "game" ? `game '${req.query.room}' in session` : `lobby named '${req.query.room}'`}.  Code: ${req.query.code}.`);
                return res.redirect(`/start?username=${req.query.username}`);
            } 
            else if (req.query.room) {
                req.flash('error', `There is no ${req.query.type === "game" ? `game '${req.query.room}' in session` : `lobby named '${req.query.room}'`}.  Code: ${req.query.code}.`);
                return res.redirect(`/start?room=${req.query.room}`);
            } 
            else {
                req.flash('error', `Please create a game first.  Code: ${req.query.code}.`);
                return res.redirect('/start');
            }
        }
        else if (req.query.needUsername) {
            req.flash('error', `Please enter a username.`);
            return res.redirect(`/start?room=${req.query.room}`);
        }
        else if (req.query.userAlreadyInRoom) {
            req.flash('error', `'${req.query.username}' is already in '${req.query.room}`);
            return res.redirect(`/start`);
        }
        else if (req.query.errorOnJoin) {
            req.flash('error', `There was an error.  Wait 15 seconds and try joining again.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.incorrectSocketId) {
            req.flash('error', `'${req.query.socketId}' is not the correct SocketId for '${req.query.username}'.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.handNotFound) {
            req.flash('error', `No hand was found for '${req.query.username}' in game '${req.query.room}'.`);
            return res.redirect(`/start?username=${req.query.username}&room=${req.query.room}`);
        }
        else if (req.query.userQuit) {
            req.flash('error', `'${req.query.userQuit}' decided to quit playing.`);
            return res.redirect(`/start?username=${req.query.username}`);
        }
        else if (req.query.cheatAttempt) {
            req.flash('error', `Cheaters are not welcome here.  Also Interpol will be arriving shortly to ask some questions.`);
            return res.redirect(`/start`);
        }
        else if (req.query.loginSuccess) {
            let username = '';
            if (res.locals && res.locals.currentUser && res.locals.currentUser.username) username = res.locals.currentUser.username;
            req.flash('success', `Welcome back ${username}!`);
            return res.redirect(`/start`);
        }
        else if (req.query.invalidLobbyName) {
            let username = '';
            if (res.locals && res.locals.currentUser && res.locals.currentUser.username) username = res.locals.currentUser.username;
            req.flash('error', `Lobby names must start with a letter (a-z) and may not contain spaces or non-alphanumeric characters.`);
            return res.redirect(`/start?username=${req.body ? req.body.username : ''}`);
        }
        else
        {
            let username = '';
            if (res.locals && res.locals.currentUser && res.locals.currentUser.username) username = res.locals.currentUser.username;
            res.render(`start`, {username, colorTheme});
        }
    } catch (error) {
        console.log('error getting userObj in /start------------------------------------------------');
        console.error('error =', error);
        res.render(`start`, {username: '', colorTheme: 'darkBlue'});
    }
}
module.exports.lobby = async (req, res) => {
    const smiles = [
      "fas fa-smile-wink", 
      "fas fa-smile",
      "fas fa-smile-beam",
      "fas fa-laugh-squint",
      "fas fa-laugh-wink",
      "fas fa-laugh-beam",
    ]
    //returns a random integer from lower_bound_inclusive to upper_bound_exclusive
    const randomSmile = 0 + Math.floor(Math.random() * (smiles.length - 1));
    const usernameToUse = res.locals.currentUser && res.locals.currentUser.username ? res.locals.currentUser.username : req.query.username;
    try {
        const user = await User.find({username: usernameToUse});
        if (user.length > 0) {
            if (req.query.message) {
                return res.render(`lobby`, {message:req.query.message, messageSender:req.query.messageSender, time:req.query.time, randomSmile: smiles[randomSmile]});
            }
            return res.render(`lobby`, {message: null, randomSmile: smiles[randomSmile]});
        }
        else {
            res.redirect(`/register?invalidUser=true`);
        }
    } catch (err) {
        req.flash('error', `${req.query.username} is not a registered user.`);
        res.redirect('/start');
        return res.redirect(`/start?room=${req.query.room}`);
    }
}
module.exports.bid = (req, res) => {
    try {
        if (req.query.highBid) {
            req.flash('error', `/bid?username=${req.query.username}&spot=${req.query.spot}&room=${req.query.room}&password=${req.query.password}`);
            return res.redirect('/bid');
        }
        else if (req.query.wrongUser) {
            req.flash('error', `It is not your turn to bid.`);
            return res.redirect(`/bid?username=${req.query.username}&spot=${req.query.spot}&room=${req.query.room}&password=${req.query.password}`);
        }
        res.render('bid', {colorThemes: constants.colorThemes});
    } catch {
        console.error('error=', error);
    }
}
module.exports.stats = async (req, res) => {
    try {
        const userObj = res.locals.currentUser;
        const lastRequestTime = timesRequestSent[userObj.username];
        console.log('lastRequestTime =', lastRequestTime);
        console.log('lastRequestTime - Date.now() < 3 =', (lastRequestTime - Date.now()) < 3000);
        if (lastRequestTime && ((Math.abs(lastRequestTime - Date.now())) < constants.statsCooldown) ) return;

        timesRequestSent[userObj.username] = Date.now();
        res.send(userObj.stats);
    } catch (error) {
        console.log('error getting stats------------------------------------------------', error);
    }
}