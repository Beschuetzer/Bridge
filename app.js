//Note: I wrote this before I knew about modules

//#region Setting Up Packages
const express = require("express"),
  //#region Basic Requires
  app = express(),
  path = require("path"),
  mongoose = require("mongoose"),
  methodOverride = require("method-override"),
  expressSanitizer = require("express-sanitizer"),
  passport = require("passport"), //only if doing authentication
  flash = require("connect-flash"), //used to send flash messages
  localStrategy = require("passport-local"), //only if doing authentication
  session = require('express-session'),
  MongoStore = require('connect-mongo')(session),
  //#endregion
  //#region Model Requires
  User = require("./models/user"),
  Problem = require("./models/problem"),
  Deal = require("./models/deal"),
  Game = require("./models/game"),
  GameIncomplete = require("./models/gameIncomplete"),
  //#endregion
  //#region Socket.io Requires
  http = require("http"), //creating http instance
  server = http.createServer(app), //creating a server instance to pass to io
  socketio = require("socket.io"), //passing server instance to io
  io = socketio(server), //creating io instance from server
  // io = socketio(server, {pingTimeout: 30000}), //creating io instance from server
  //#endregion
  //#region Routes
  playRoutes = require("./routes/play"),
  siteRoutes = require("./routes/site"),
  miscRoutes = require("./routes/misc"),
  //#endregion
  // stripe = require('stripe')(process.env.STRIPE_SECRET_KEY_HERE), 		//used for payment processing; probably would go inside a route
  //#region Helper Requires
  userUtils = require("./helpers/users"),
  roomUtils = require("./helpers/rooms"),
  gameUtils = require("./helpers/games"),
  helpers = require("./helpers/helpers"),
  autoPlayCard = require("./helpers/autoPlay"),
  constants = require("./helpers/constants"),
  seed = require("./helpers/seed");
  //#endregion

seed.run();       //TODO: CAN REMOVE THIS WHEN DEPLOYING    
require('dotenv').config();

//#region Starting Server to Listen
const port = process.env.PORT || 3009;
server.listen(port, process.env.IP, function () {
  console.log(`Starting server port ${port}...`);
});
//#endregion
//#region Configuring Express
//tell express to serve files in 'public' (put main.css and main.js in here)
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");  //default extension to use for res.render calls
app.use(methodOverride("_method"));
//in version 4.17.1 and above of express, bodyParser is part of express.
app.use(express.urlencoded({ extended: true })); 
app.use(expressSanitizer());
app.use(flash());
app.use(express.json());
//#endregion
//#region Authentication Setup
app.use(
  session({
    secret:
      "#(kdjf9ndKDJ#JkmDfJdUH@)k**3KDmLS(#ldkd.zldk{}{201ndnw93uKSDKEIDKVMC<EPZKMCMCNDJ",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);
app.use(passport.initialize());
app.use(passport.session());

passport.use(new localStrategy(User.authenticate()));

//encodes User class/model and puts into session
passport.serializeUser(User.serializeUser()); 

//decodes User class/model and removes from session
passport.deserializeUser(User.deserializeUser()); 
//#endregion
//#region Storing global variables
app.use(function (req, res, next) {
  //'res.locals' is where vars accessible to all templates are stored
  //add as many 'res.locals.var' as you want
  //put at end of setup section otherwise it won't grab passport-added user info
  res.locals.currentUser = req.user;
  res.locals.errorMessage = req.flash("error");
  res.locals.successMessage = req.flash("success");
  next();
});
//#endregion

//importing router routes from '/router'; ADD REQUIRE ABOVE (./routes/name.js)
app.use(playRoutes);
app.use(miscRoutes);
app.use(siteRoutes); //this is where the * and other routes not related to models go;  must come last
app.use((req, res) => {
  res.render('404', {page: req.originalUrl});
})
app.use(function (err, req, res, next ) {
  //Custom error handler
  const {status = 500, message = 'Something went wrong...'} = err;
  res.status(status).send(message);
  // next(err);
});
app.set('hasSentTheme', {});
//#region Mongoose Setup
mongoose.set("useFindAndModify", false);

const dbName = "Bridge";
const portNumber = 27017;
let mongoDbURL = `mongodb+srv://admin:${process.env.mongoDBPassword}@cluster0.3trbv.mongodb.net/${dbName}?retryWrites=true&w=majority`;
// app.use(express({
//   store: new MongoStore({ url: mongoDbURL})
// }));
if (constants.mode === constants.modes.playing) mongoDbURL = `mongodb+srv://admin:${process.env.mongoDBPassword}@cluster0.3trbv.mongodb.net/${dbName}?retryWrites=true&w=majority`;
else mongoDbURL = "mongodb://localhost:" + portNumber + "/" + dbName

mongoose.connect(mongoDbURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`Connected to ${dbName} collection in MongoDB!`))
  .catch((error) => console.log(error.message));

//#endregion
//#endregion
//#region Socket IO Stuff
io.on("connection", (socket) => {
  //#region Handling Disconnections/Refreshes
  socket.binary(false).on("disconnect", () => {
    try {
        
      console.log('disconnect event-------------------------------------');
      const leavingUser = userUtils.getUser(socket.id);
      const user = userUtils.removeUser(socket.id);
      if (!user) return null;
      if (leavingUser && user.status === constants.statuses.inLobby) {
        resetLobby(leavingUser, user);
      }
      else if (leavingUser && user.status === constants.statuses.playingBridge) {
        resetBridge(leavingUser);
      }
    } catch (error) {
      console.error('error =', error);
    } 
  });
  function resetBridge(leavingUser) {
    try {
      console.log('resetBridge----------------------------------------------------');
      const game = gameUtils.getGame(leavingUser.room);
      if (!game) return;
      gameUtils.removeUserFromReadyToContinue(leavingUser);
      gameUtils.removeUserFromGame(leavingUser);
    } catch (error) {
      console.error('error =', error);
    } 
  }
  function resetLobby(leavingUser, user) {
    try {
      console.log('resetLobby----------------------------------------------------');
      //#region remove user from all arrays in room
      roomUtils.removeUserFromRoom(socket.binary(false).binary(false).id, leavingUser.room);
      roomUtils.resetUsersReadyandWhoMadeSeatingChoices(leavingUser.room);
      roomUtils.removeCompletionStates(socket.id, leavingUser.room);
      roomUtils.resetArrays(leavingUser.room);
      //#endregion
      //#region hides seating in room if user left rather than refreshed
      const roomBeingLeft = roomUtils.getRoom(leavingUser.room);
      if (roomBeingLeft && roomBeingLeft.users.length < 4) {
        socket.binary(false).to(leavingUser.room).emit("reset");
      }
      //#endregion
      //#region Sending Other Clients Leave Msg and Updating roomUsers
      if (!roomBeingLeft || !roomBeingLeft.users) return
      const usersNeeded = 4 - roomBeingLeft.users.length;
      io.binary(false).to(user.room).emit("message",formatMessage(
          constants.botName,
          `${user.username} has left the lobby. Mode set to 'Normal'.  Seating available again when ${usersNeeded} more ${usersNeeded > 1 ? 'people join' : 'person joins'}.`
        )
      );
      io.binary(false).to(user.room).emit("roomUsers", {
        room: user.room,
        users: userUtils.getUsernamesOfUsersInRoom(user.room),
      });
      //#endregion
      //#region Reset Seating in all Clients in Room
      const roomSeating = roomUtils.resetRoom(leavingUser.room);
      if (roomSeating) {
        io.binary(false).to(leavingUser.room).emit("refresh");
        io.binary(false).to(leavingUser.room).emit("sendSeatingToClient", {
          seating: roomSeating.seating,
        });
        socket.binary(false).to(leavingUser.room).emit("resetButtons");
      }
      //#endregion
      } catch (error) {
        console.error('error =', error);
      } 
  }
  //#endregion
  //#region Room Stuff
  socket.binary(false).on('startLobby', async ({username, room, password }) => {
    try{
      if (username === undefined || username === null || room === undefined || room === null) return null;
      if (room.match(/[^a-zA-Z0-9]/) || !room.match(/[a-zA-Z]{1}[a-zA-Z0-9]{0,9}/)) return socket.binary(false).emit('invalidLobbyName', {room});
      if (room.match(/\s+/i)) return null;
      if (typeof password === 'string') password = password.trim();
      const foundUser = await userUtils.isRegisteredUser(username);
      if (!foundUser) {
        return socket.binary(false).emit("userNotFound", { username, room });
      }

      //#region Rejoining a Game in Session
      const game = gameUtils.getGame(room);
      if (game) {
        for (const direction in game.seating) {
          if (game.seating.hasOwnProperty(direction)) {
            const usernameInSeating = game.seating[direction];
            if (usernameInSeating === username) {
              console.log('password =', password);
              console.log('game.room.password =', game.room.password);
              if (password === game.room.password || game.room.password.trim() === '') {
                const spot = direction;
                const socketId = game.originalSocketIds[username];
                return socket.binary(false).emit('rejoinGame', {username, room, password, spot, socketId});
              }
              else {
                return socket.binary(false).emit('incorrectPassword', {username, room});
              }
            }
          }
        }
      }
      //#endregion
      //#region Joining a Lobby if It exists is insession otherwise create

      //#region Creating a New Lobby if Empty Lobby Exists
      let roomToJoin = roomUtils.getRoom(room);
      if (roomToJoin && roomToJoin.users && roomToJoin.users.length <= 0)  {
        roomToJoin = roomUtils.roomCreation(socket.id, roomToJoin.name, roomToJoin.password);
      }
      //#endregion

      if (roomToJoin) {
        const usersNeeded = 4 - (roomToJoin.users.length + 1);
        const roomPassword = roomUtils.getRoomPassword(room);
        if (usersNeeded < 0) {
          socket.binary(false).emit("roomFull", { username, room });
        } 
        else if ((typeof password === 'string' && password.trim() === roomPassword) || roomPassword === '') {
          console.log('joining with password =', password);

          const user = await userUtils.userJoin(socket.id, username, room);
          if (user) {
            //#region Join Room and Send Users in Room to Clients 
            roomUtils.joinRoom(socket.id, room);
            sendValuesToClients(roomToJoin, socket.id);
            socket.binary(false).join(room);
            socket.binary(false).emit("joinLobby");
            socket.binary(false).emit(
              "message",
              formatMessage(
                constants.botName,
                `Welcome to A#Maj Bridge ${user.username}! ${
                  usersNeeded > 0
                    ? `When ${usersNeeded + 1} ${usersNeeded === 1 ? ' more person joins the lobby,' : ' more people join the lobby,'} you may begin the game.`
                    : constants.fullRoomMsg
                }`
              )
            );
            socket.binary(false).to(room).emit(
                "message",
                formatMessage(constants.botName, `${user.username} has joined the lobby.`)
              );
            const usernames = userUtils.getUsernamesOfUsersInRoom(room);
            io.binary(false).in(room).emit("roomUsers", {
              room,
              users: usernames,
            });
            //#endregion
            //#region Check Ready To Start
            if (usersNeeded === 0) {
              try {
                // if (roomToJoin.shouldCountHonors) setBiddingValue({room, value: true, valueChanged: 'shouldCountHonors', shouldHide: false}) 


                const incompleteGame = await findGameIncomplete(usernames);
                socket.binary(false).in(room).emit("message",formatMessage(constants.botName, constants.fullRoomMsg));
                io.binary(false).to(room).emit("showSeating", {isIncompleteGame: !!incompleteGame, immediatelyLoadSavedGame: constants.immediatelyLoadSavedGame, shouldCountHonors: roomToJoin.shouldCountHonors});
                io.binary(false).in(room).emit("message",formatMessage(constants.botName, constants.getIncompleteGameFoundMsg(new Date(incompleteGame.startDate))));
              } catch (error) {
                console.log('error getting Incomplete Game------------------------------------------------');
                console.log(error);
              }
            } else {
              socket.binary(false).to(room).emit(
                  "message",
                  formatMessage(
                    constants.botName,
                    `You will be able to start when ${usersNeeded} more ${usersNeeded === 1 ? 'person joins.' : 'people join.'}`
                  )
                );
            }
            //#endregion
          } 
          else {
              socket.binary(false).emit("userNotFound", {username, room});
          }
        } 
        else {
          socket.binary(false).emit("incorrectPassword", { username, room });
        }
      } 
      else {
        roomUtils.roomCreation(socket.id, room, password);
        socket.binary(false).emit("joinLobby");
        roomUtils.removeUserFromRoom(socket.id, room);
        
        const publicRoomCount = roomUtils.getPublicRoomCount();
        if (publicRoomCount < constants.maxRoomsToLoad) {
          const connectedClients = Object.keys(io.of('/').clients().connected);
          for (let i = 0; i < connectedClients.length; i++) {
            const socketId = connectedClients[i];
            sendRoomsToClientEmitterEvent(socketId);
          }
        } 
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("getRooms", () => {
    try {
      console.log('getRooms event-------------------------------------');
      sendRoomsToClientEmitterEvent();
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("chatMessage", ({ username, room, msg }) => {
      try{
      console.log('chatMessage event-------------------------------------');
      let members = null;
      if (io.sockets.adapter.rooms[room]) {
        members = io.sockets.adapter.rooms[room].sockets;
      } 

      if (members) {
        const users = userUtils.getRoomUsers(room);
        let userId = null;
        //get user id from username
        for (let i = 0; i < users.length; i++) {
          const user = users[i];
          if (user.username === username) {
            userId = user.socketId;
            break;
          }
        }

        //only send msg if userId is in room
        for (const key in members) {
          if (members.hasOwnProperty(key)) {
            if (key === userId) {
              io.binary(false).to(room).emit("message", formatMessage(username, msg));
              break;
            }
          }
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("roomLeave", ({ room }) => {
      try {
      console.log('roomLeave event-------------------------------------');
      //check if room is empty and removes if true
      roomUtils.removeUserSeatingChoice(socket.id, room);
      const removedUser = roomUtils.removeUserFromRoom(socket.id, room);
      let usersInRoom = null;
      if (io.sockets.adapter.rooms[room]) {
        usersInRoom = io.sockets.adapter.rooms[room].length - 1;
      } else {
        usersInRoom = 0;
      }
      if (usersInRoom <= 0) {
        //delete room from rooms
        roomUtils.removeRoom(room);
      }
      socket.binary(false).to(room).emit("resetSeating");
    } catch (error) {
      console.error('error =', error);
    }
  });
  function sendRoomsToClientEmitterEvent(socketId) {
    try {
      console.log('sendRoomsToClientEmitterEvent----------------------------------------------------');
      if (socketId) return io.binary(false).emit('sendRoomsToClient', {
        rooms: roomUtils.getTenPublicRooms(),
        gamesInSession: gameUtils.gamesInSession,
      });
      socket.binary(false).emit("sendRoomsToClient", {
        rooms: roomUtils.getTenPublicRooms(),
        gamesInSession: gameUtils.gamesInSession,
      });
    } catch (error) {
      console.error('error =', error);
    }
  }
  function removeSpaces(string) {
    try {
      if (string === undefined || string === null) return '';
      return string.replace(' ', '_');
    } catch (error) {
      console.error('error =', error);
    }
  }
  function sendValuesToClients(room, joiningSocketId) {
    try {
      if (room === undefined || room === null) return null;
      const userObj = userUtils.getUser(joiningSocketId);
      const setHonorsAutomatically = userObj.preferences.setHonorsAutomatically;
      if (setHonorsAutomatically === true) room.shouldCountHonors = true;

      console.log('room.shouldCountHonors =', room.shouldCountHonors);
      const values = {
        biddingTimerDurationValue: room.biddingTimerDurationValue,
        cardPlayTimerDurationValue: room.cardPlayTimerDurationValue,
        shouldCountHonors: setHonorsAutomatically === true ? true : room.shouldCountHonors,
        northSouthAbove: room.northSouthAbove,
        northSouthBelow: room.northSouthBelow,
        northSouthVulnerable: room.northSouthVulnerable,
        eastWestAbove: room.eastWestAbove,
        eastWestBelow: room.eastWestBelow,
        eastWestVulnerable: room.eastWestVulnerable,
        dealer: room.dealer,
        continueFromIncomplete: room.continueFromIncomplete,
      }
      io.binary(false).in(room).emit('sendValuesToClient', {values});
      io.binary(false).to(joiningSocketId).emit('sendValuesToClient', {values});
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region Seating Arrangment Stuff
  socket.binary(false).on("getSeating", ({ room }) => {
    try{
      console.log('getSeating event-------------------------------------');
      //get seating for room
      socket.binary(false).emit("sendSeatingToClient", { seating: roomUtils.getSeating(room) });
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("resetSpot", ({ room, spot }) => {
    try {
      console.log('resetSpot event-------------------------------------');
      roomUtils.removeUserSeatingChoice(socket.id, room);

      const updatedSeating = roomUtils.resetSeatingSpot(room, spot);
      console.log('updatedSeating =', updatedSeating);
      if (updatedSeating !== -1) {
        io.binary(false).to(room).emit("resetStartButton");
        io.binary(false).to(room).emit("sendSeatingToClient", { seating: updatedSeating });
      } 
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("chooseSpot", ({ username, room, spot, desiredSpot }) => {
    try {
      console.log('chooseSpot event-------------------------------------');
      roomUtils.setUserSeatingChoice(socket.id, room);
      const roomWhereSpotChosen = roomUtils.setSeatingSpot(username, room, spot);
      if (desiredSpot !== "") {
        roomUtils.resetSeatingSpots(username, room, spot, desiredSpot);
      }
      socket.binary(false).emit("resetDesiredSpot", { value: spot });
      io.binary(false).to(room).emit("sendSeatingToClient", {
        seating: roomUtils.getSeating(room),
      });
      //#region enable start button if the 4 users in the room are the users that have picked spots
      if (roomWhereSpotChosen !== -1) {
        if (roomWhereSpotChosen.usersWhoMadeSeatingChoice.length === 4) {
          shouldEnableStart = true;
          for (let i = 0; i < roomWhereSpotChosen.users.length; i++) {
            const userInRoom = roomWhereSpotChosen.users[i];
            if (
              !roomWhereSpotChosen.usersWhoMadeSeatingChoice.includes(userInRoom)
            ) {
              shouldEnableStart = false;
              break;
            }
          }
          if (shouldEnableStart) {
            io.binary(false).to(room).emit("enableStartButton");
          }
        }
      } 
      else {
        gameUtils.removeGame(room);
        return socket.binary(false).emit("notInSession", { room, type: "lobby", code: "2" });
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("startButtonPress", ({room, username}) => {
    try {
      console.log('startButtonPress event-------------------------------------');
      socket.binary(false).emit("message",formatMessage(constants.botName, `You have pressed start.`));
      socket.binary(false).to(room).emit('message', formatMessage(constants.botName, `${username} has pressed start.`))
      socket.binary(false).to(room).emit('sendReadyToStart', {username});
      const roomWhereStartButtonPressed = roomUtils.setUserReady(socket.id, room);
      if (roomWhereStartButtonPressed !== -1) {
        if (roomWhereStartButtonPressed.usersReady.length === 4) {
            const seatingLegit = checkSeating(roomWhereStartButtonPressed);
            if (typeof seatingLegit === 'object') roomWhereStartButtonPressed.seating = seatingLegit;
            const scoresLegit = checkScoring(roomWhereStartButtonPressed);
            if (seatingLegit && scoresLegit) {
              startBidding(room, roomWhereStartButtonPressed);
            } 
            else if (!seatingLegit) {
              emitReloadLobby(roomWhereStartButtonPressed.name, `There was an issue with the seating arrangement.  Please try again.`)
            }
            else if (!scoresLegit) {
              emitReloadLobby(roomWhereStartButtonPressed.name, `There was an issue with the starting scores.  Please try again.`)
            }
        }
      } else {
        gameUtils.removeGame(room);
        return socket.binary(false).emit("notInSession", { room, type: "lobby", code: "3" });
      }
    } catch (error) {
      console.error('error =', error);
    }
  });
  function emitReloadLobby(roomName, msg){
    try {
      console.log('emitReloadLobby----------------------------------------------------');
      io.binary(false).in(roomName).emit("reload", formatMessage("Error Bot", msg));
    } catch (error) {
      console.error('error =', error);
    }
  }
  socket.binary(false).on('seatingButtonPress', ({room}) => {
    try {
      console.log('seatingButtonPress event-------------------------------------');
      roomUtils.resetArrays(room);
      socket.binary(false).to(room).emit('toggleSeatingButtonEvent');
      io.binary(false).to(room).emit("sendSeatingToClient", { seating: constants.getDefaultSeating() });
      io.binary(false).to(room).emit("refresh");
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('biddingValueChange', ({room, value, valueChanged, shouldHide}) => {
    setBiddingValue({room, value, valueChanged, shouldHide})
  });
  function setBiddingValue({room, value, valueChanged, shouldHide}) {
    try {
      console.log('biddingValueChange event-------------------------------------');
      roomUtils.resetUsersReadyandWhoMadeSeatingChoices(room);
      const roomToGet = roomUtils.getRoom(room);
      if (!roomToGet) return null;
      value = convertToBoolean(value);

      const currentValue = JSON.parse(JSON.stringify(roomToGet[valueChanged]));
      const startValueSent = value;
      if (!isNaN(parseInt(value)) && typeof parseInt(value) === 'number' && typeof(value) === 'string' && !value.match(/none/i)) roomToGet[valueChanged] = parseInt(value);
      else roomToGet[valueChanged] = value;

      console.log('roomToGet =', roomToGet);
      io.binary(false).in(room).emit('timerValueUpdate', {value, valueChanged, shouldHide});

      let valueChangedMsg = '';
      let unit = 'seconds';
      // console.log('valueChanged =', valueChanged);
      switch (valueChanged.toLowerCase()) {
        case 'biddingtimerdurationvalue':
          valueChangedMsg = 'bidding timer value';
          break;
        case 'cardplaytimerdurationvalue':
          valueChangedMsg = 'play timer value';
          break;
        case 'northsouthabove':
          valueChangedMsg = 'NS above score';
          unit = 'points';
          break;
        case 'northsouthbelow':
          valueChangedMsg = 'NS below score';
          unit = 'points';
          break;
        case 'northsouthvulnerable':
          valueChangedMsg = 'NS vulnerable status';
          value = 'Yes';
          unit = '';
          break;
        case 'eastwestabove':
          valueChangedMsg = 'EW above score';
          unit = 'points';
          break;
        case 'eastwestbelow':
          valueChangedMsg = 'EW below score';
          unit = 'points';
          break;
        case 'eastwestvulnerable':
          valueChangedMsg = 'EW vulnerable status';
          value = 'Yes';
          unit = '';
          break;
        case 'dealer':
          valueChangedMsg = 'dealer';
          unit = '';
          value = `'${value}'`;
          break;
        case 'shouldcounthonors':
          valueChangedMsg = "'Count Honors' state";
          unit = '';
          value = `'${value ? "Yes" : "No"}'`;
          break;
        case 'continuefromincomplete':
          valueChangedMsg = "'Load Incomplete Game' state";
          unit = '';
          value = `'${value ? "Yes" : "No"}'`;
          break;
      }   

      // console.log('currentValue =', currentValue);
      // console.log('value =', value);
      // console.log('startValueSent =', startValueSent);
      if ((typeof currentValue === 'number' && parseInt(currentValue) !== parseInt(value))
        || (value ==='none' && currentValue !== value)
        || (valueChanged === 'shouldCountHonors' && startValueSent !== currentValue) 
        || valueChanged === 'continueFromIncomplete'
      ) {
        io.binary(false).in(room).emit("message",
        formatMessage(constants.botName, `'${userUtils.getUser(socket.id).username}' changed the ${valueChangedMsg} to ${value} ${unit}.`));
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion  
  //#region Bidding Stuff
  //#region Triggered On Client Load of Bid.ejs
  socket.binary(false).on('getClientPreferences', async ({username}) => {
    console.log('getClientPreferences event-------------------------------------');
    if (!username) return socket.binary(false).emit("notInSession", { room, type: "game", code: "6.5" });
    try {
      const userObj = await User.findOne({username});
      socket.binary(false).emit('sendPreferencesToClient', {preferences: userObj.preferences});
    } catch (error) {
      socket.emit('userNotFound', {username, room});
    }
  });
  socket.binary(false).on("updateSocketIdAfterRedirect", ({ username, room }) => {
    try {
      console.log('updateSocketIdAfterRedirect event-------------------------------------');
      const game = gameUtils.getGame(room);
      if (!checkInSession(game, room, 'game', '22.5', socket.id)) return;
      socket.binary(false).join(room);

      for (let i = 0; i < game.userObjs.length; i++) {
        const userObj = game.userObjs[i];
        if (username && userObj.username === username){
          userObj.status = constants.statuses.playingBridge;
          userObj.socketId = socket.id;
          userUtils.addUserObj(userObj);
          if(game && game.users) game.users[username] = userObj.socketId;
          break;
        }
      }

      const lastDeal = gameUtils.getLastDeal(game);
      if (lastDeal.agreeWithClaim.claimAmount !== null) {
        lastDeal.agreeWithClaim = constants.getNewAgreeWithClaim();
        io.binary(false).in(game.name).emit('closeClaim', {isAccepted: false});
      }
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("getContractsFromServer", () => {
    console.log('getContractsFromServer event-------------------------------------');
    try {
      socket.binary(false).emit("sendContractsToClient", {
        contractsFromServer: constants.contracts,
      });
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("getHand", ({ username, room, originalSocketId}) => {
    try {
      console.log('getHand event-------------------------------------');
      const game = gameUtils.getGame(room);
      if (!checkInSession(game, room, 'game', '23.5', socket.id)) return;

      
      let socketIdInGame;
      if (game.users && game.users[username]) socketIdInGame = game.users[username];
      else {
        for (let i = 0; i < game.userObjs.length; i++) {
          const userObj = game.userObjs[i];
          if (userObj.username === username) socketIdInGame = userObj.socketId;
        }
      }

      if (game) {
        return socket.binary(false).emit("sendHandToClient", {
          handFromServer: gameUtils.getHandForSocketID(game, game.originalSocketIds[username]),
          dealer: gameUtils.getDealer(game),
        });
      } 
      else {
        return socket.binary(false).emit("handNotFound", { username, room });
      }
      
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('getScoring', ({room}) => {
    try {
      console.log('getScoring event-------------------------------------');
      const game = gameUtils.getGame(room);
      if (!checkInSession(game, room, 'game', '7', socket.id)) return;

      socket.binary(false).emit('sendScoringToClient', {scoring: gameUtils.getScoring(game)});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("getGameState", ({username, room, originalSocketId }) => {
    try {
      console.log('getGameState event-------------------------------------');
      const game = gameUtils.getGame(room);
      if (game) {
        console.log('game.gameState =', game.gameState);
        if (game.gameState === constants.gameStates.bidding || game.gameState === constants.gameStates.waitingToContinueToPlaying) {
          loadBidding(game, socket.id);
          delete game.usersReadyToContinue[username];
          emitUsersReadyToContinue(game);
        } 
        else if (game.gameState === constants.gameStates.playing) {
          loadPlaying(game, socket.id, originalSocketId);
          game.usersReadyToContinue = {};
        }
        else if (game.gameState === constants.gameStates.dealSummary) {
          console.log('dealSummary refresh------------------------------------------------------');
          socket.binary(false).emit('sendSeatingToClientInBid', {seating: game.seating, dealer: gameUtils.getDealer(game), biddingTimerDurationValue: game.room.biddingTimerDurationValue});
          emitDealComplete({game, socketId: socket.id});
          emitUsersReadyToContinue(game);
        }
        else if (game.isGameOver) {
          sendGameOver(game, true);
        }
      } 
      else {
        gameUtils.removeGame(room);
        return socket.binary(false).emit("notInSession", { room, type: "game", code: "8" });
      }
    } catch (error) {
      console.error('error =', error);
    }
  });
  //#endregion
  socket.binary(false).on("sendBidToServer", async ({ username, bid, room, spot, imgHTML }) => {
    try {
      console.log('sendBidToServer event-------------------------------------');
      //#region Initialization
      const contracts = constants.contracts;
      let game = gameUtils.getGame(room);
      const userMakingBid = userUtils.getUser(socket.id);
      if (!game || !userMakingBid || !contracts) {
        gameUtils.removeGame(room);
        return socket.binary(false).emit("notInSession", { room, type: "game", code: "9" });
      }
      if (game.gameState === constants.gameStates.playing) return null;
      if (userMakingBid.username !== gameUtils.getNextBidder(game)) socket.binary(false).emit("cheatPrevention", { type: "invalidBidder" })
      const indexOfBid = bid.match(/double/i) || bid.toLowerCase() === "pass" ? -1 : contracts.findIndex((contract) => contract === bid);
      if (indexOfBid < -1 || indexOfBid > 34 || imgHTML.match(/script/i) || imgHTML.match(/style/i)) return socket.binary(false).emit("cheatPrevention", { type: "invalidBid" });
      //#endregion
      //#region Getting indexOfCurrentHighBid
      let indexOfCurrentHighBid;
      const lastBid = gameUtils.getLastContractBid(game);
      if (lastBid) {
        indexOfCurrentHighBid = contracts.findIndex(
          (contract) => contract === lastBid
        );
      } else {
        indexOfCurrentHighBid = -1;
      }
      //#endregion
      //#region Checking Bid Against Current High Bid and Responding
      const nextBidder = gameUtils.getNextBidder(game);
      if (((userMakingBid && (indexOfBid > indexOfCurrentHighBid || indexOfBid === -1))) && userMakingBid.username === nextBidder) {
        const isValidBid = getIsValidBid(game, bid, username);
        if (isValidBid === true) {
          gameUtils.makeBid(game, bid);
          saveGameIncompleteBidding(game);
          io.binary(false).in(room).emit("updateOtherClientsAfterBid", {
            bid: gameUtils.getLastBid(game),
            nextBidder: gameUtils.getNextBidder(game),
            imgHTML,
          });
          if (gameUtils.dealIsABust(game)) {
            //redeal hands and send hand to each player
            const spammingFound = gameUtils.checkForSpamming(game);
            if (spammingFound) {
              io.binary(false).in(game.name).emit('notInSession', {room, type: "spamming", code: "10"});
              return gameUtils.removeGame(game.name);
            }
            gameUtils.createNewDeal(game);
            const userObjs = userUtils.getRoomUsers(game.name);
            const dealer = gameUtils.getDealer(game);
            io.binary(false).in(game.name).emit("newDeal", {
              dealer,
              contractsFromServer: constants.contracts,
            });
            
            for (let i = 0; i < userObjs.length; i++) {
              //updating clients with new hand and dealer
              const userObj = userObjs[i];
              io.binary(false).to(userObj.socketId).emit("sendHandToClient", {
                handFromServer: gameUtils.getHandForSocketID(game, userObj.socketId),
              });
              io.binary(false).to(userObj.socketId).emit("sendSeatingToClient", {
                seating: null,
                dealer: gameUtils.getDealer(game),
              });
            }
            game.redealCount += 1;
            game.room.usernameOfCurrentBidder = dealer;
            return saveGameIncompleteBidding(game);
          } 
          else if (gameUtils.isbiddingFinished(game)) {
            gameUtils.setContractAndDeclarer(game);
            io.binary(false).in(game.name).emit('showContinueButton', {seating: null, exposedHandName: gameUtils.getExposedHandName(game)});
            console.log('setting game state to waitingToContinueToPlaying------------------------------------------------');
            game.gameState = constants.gameStates.waitingToContinueToPlaying;
            saveGameIncompleteBidding(game, true);
          } 
          else {
            const bids = gameUtils.getLastDeal(game).bids;
            io.binary(false).in(game.name).emit("disableUpToLastBid", {bids});
            io.binary(false).in(game.name).emit("validBid");
            sendIsAllowedToMakeBid(userUtils.getUserId(gameUtils.getNextBidder(game)), game, bids);
            game.room.usernameOfCurrentBidder = nextBidder;
          }
        } 
        else {
          socket.binary(false).emit("cheatPrevention", { type: "invalidBid" });
        }
      } 
      else if (indexOfBid <= indexOfCurrentHighBid) {
        socket.binary(false).emit("cheatPrevention", { type: "invalidBid" });
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('getBidding', ({room}) => {
    try {
      console.log('getBidding event-------------------------------------');
      const lastDeal = gameUtils.getLastDeal(room);
      if (!lastDeal) return [];
      socket.binary(false).emit('sendBiddingToClient', {bidding: lastDeal.bids, shouldResetTable: false});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('readyToContinueToPlaying', ({username, room}) => {
    try {
      console.log('readyToContinueToPlaying------------------------------------------------');
      if (username === undefined || username === null || room === undefined || room === null) return;
      const game = gameUtils.getGame(room);
      if (!checkInSession(game, room, 'game', '12.5', socket.id)) return;
      if (game.usersReadyToContinue && game.usersReadyToContinue[username] === true) return;
      
      if (game.usersReadyToContinue) {
        const exposedHandname = gameUtils.getExposedHandName(game);
        game.usersReadyToContinue[exposedHandname] = true;
      }
      
      const usersInRoom = Object.values(game.seating);
      if (game.usersReadyToContinue && usersInRoom.indexOf(username) > -1) game.usersReadyToContinue[username] = true;
      emitUsersReadyToContinue(game);

      if (Object.size(game.usersReadyToContinue) !== 4) return;
      if (Object.size(game.usersReadyToContinue) > 4) {
        game.usersReadyToContinue = {};
        return io.binary(false).in(game.name).emit('resetContinueToPlayingButton');
      }

      for (let i = 0; i < usersInRoom.length; i++) {
        const userInRoom = usersInRoom[i];
        if (game.usersReadyToContinue[userInRoom] === null) return;
      }

      startPlaying(game);
      game.usersReadyToContinue = {};
      saveGameIncompletePlaying(game);
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('timesUpBidding', ({room}) => {
    try {
      console.log('timesUpBidding event-------------------------------------');
      //TODO: need to finish
      const game = gameUtils.getGame(room);
      if (!game || !game.room) return null;
      game.room.timesUpComplete = true;
      game.room.usernameOfCurrentPlayer = null;
    } catch (error) {
      console.error('error =', error);
    }
  });
  function startNewGame(roomName, room, usersInRoom) {
    try {
      console.log('startNewGame------------------------------------------------');
      const newGame = gameUtils.createNewGame(room);
      if (!checkInSession(newGame, roomName, 'game', '4', socket.id)) return;
      gameUtils.createNewDeal(newGame, true);
      newGame.userObjs = JSON.parse(JSON.stringify(usersInRoom));
      for (let i = 0; i < newGame.userObjs.length; i++) {
        const userObj = newGame.userObjs[i];
        newGame.roundWinSounds[userObj.username] = userObj.preferences.sound.roundWon;
      }
      console.log('newGame.roundWinSounds =', newGame.roundWinSounds);
      createGameIncompleteDocumentInMongoDB(newGame);
    } catch (error) {
      console.error('error =', error);
    }
  }
  async function startBidding(roomName, room) {
    try {
      console.log('startBidding----------------------------------------------------');
      const usersInRoom = userUtils.getRoomUsers(roomName);
      //#region Creating New Game of Loading Incomplete One
      if (room) {
        if (room.continueFromIncomplete === true) {
          const usernames = [];
          for (let i = 0; i < usersInRoom.length; i++) {
            const userObj = usersInRoom[i];
            usernames.push(userObj.username);
          }

          //#region Loading gameIncomplete
          try {
            const incompleteGame = await findGameIncomplete(usernames);
            if (incompleteGame.name !== roomName) {
              const oldName = incompleteGame.name;
              incompleteGame.name = roomName;
              incompleteGame.room.name = roomName;
              const incompleteRoom = incompleteGame.room;
              await GameIncomplete.updateOne({
                name: oldName,
                seating: {
                  north: incompleteGame.seating.north, 
                  south: incompleteGame.seating.south,
                  east: incompleteGame.seating.east,
                  west: incompleteGame.seating.west,
                },
              }, {
                name: roomName,
                room: incompleteRoom,
              });
            }
            updateUserObjs(incompleteGame, roomName);
            updateUserPreferences(incompleteGame);
            if (incompleteGame && !incompleteGame.users) incompleteGame.users = {};
            if (incompleteGame && !incompleteGame.usersReadyToContinue) incompleteGame.usersReadyToContinue = {};
            if (incompleteGame) {
              if (gameUtils.gamesInSession.includes(incompleteGame.name)) incompleteGame.name += '-2';
              gameUtils.games[incompleteGame.name] = incompleteGame;
              gameUtils.gamesInSession.push(incompleteGame.name);
            }
            else startNewGame (roomName, room, usersInRoom);
          } catch (error) {
            console.log('error getting IncompleteGame in startbidding------------------------------------------------');
            console.log(error);
          }
          //#endregion
        }
        else {
          startNewGame(roomName, room, usersInRoom)
        }
        roomUtils.removeRoom(room.name);
      } 
      else {
        gameUtils.removeGame(roomName);
        return socket.binary(false).emit("notInSession", { room: roomName, type: "game", code: "5" });
      }
      //#endregion
      //#region Sending Each User their Socket Id and Telling to Reroute to Bid.ejs
      if (!usersInRoom) return null;
      const game = gameUtils.getGame(roomName);
      if (!checkInSession(game, roomName, 'game', '6', socket.id)) return;

      for (let i = 0; i < usersInRoom.length; i++) {
        const userObj = usersInRoom[i];
        if (userObj.username) game.originalSocketIds[userObj.username] = userObj.socketId;
        io.binary(false).to(userObj.socketId).emit("startGame", game.seating, userObj.socketId);
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function updateUserPreferences(game) {
    try {
      if (game === undefined || game === null) return null;
      console.log('updateUserPreferences------------------------------------------------');
      const users = userUtils.users;
      for (let i = 0; i < users.length; i++) {
        const userObj = users[i];
        const gameObjIndex = game.userObjs.findIndex(gameObj => gameObj.username === userObj.username);
        if(gameObjIndex != -1) game.userObjs[gameObjIndex].preferences = userObj.preferences;
      }

      for (let i = 0; i < game.userObjs.length; i++) {
        const gameObj = game.userObjs[i];
        console.log('gameObj =', gameObj);
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function updateUserObjs(game, newName) {
    try {
      if (game === undefined || game === null) return;
      for (let i = 0; i < game.userObjs.length; i++) {
        const userObj = game.userObjs[i];
        const newSocketId = userUtils.getUserId(userObj.username);
        userObj.room = newName;
        userObj.socketId = newSocketId;
        if (game.users) game.users[userObj.username] = newSocketId;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function sendIsAllowedToMakeBid(socketId, game, bids) {
    try {
      console.log('sendIsAllowedToMakeBid----------------------------------------------------');
      const userObj = userUtils.getUser(socketId);
      if (game && game.undoRequest && game.undoRequest.alreadyAsked) game.undoRequest.alreadyAsked[userObj.username] = 0;
      io.binary(false).to(socketId).emit("isAllowedToMakeBid", {bids, hasMadeBid: game.hasMadeBid});
    } catch (error) {
      console.error('error =', error);
    }
  }
  function loadBidding(game, socketId) {
    try {
      console.log('loadBidding----------------------------------------------------');
      const lastDeal = gameUtils.getLastDeal(game);
      const biddingTimerDurationValue = game.room.biddingTimerDurationValue;
      socket.binary(false).emit("sendSeatingToClientInBid", {
        seating: game.seating,
        dealer: gameUtils.getDealer(game),
        biddingTimerDurationValue,
      });
      
      if (lastDeal.bids.length > 0) {
        socket.binary(false).emit("sendBidsToClient", {
          bids: lastDeal.bids,
        });
      }
    
      const nextBidder = gameUtils.getNextBidder(game);
      if (nextBidder === -1) {
        const northId = userUtils.getUserId(game.seating.north);          
        if (socketId === northId) sendIsAllowedToMakeBid(northId, game, lastDeal.bids);
      } 
      else {
        const nextBidderSocketId = userUtils.getUserId(nextBidder);
        if (socketId === nextBidderSocketId) sendIsAllowedToMakeBid(nextBidderSocketId, game, lastDeal.bids);
      }
      
      socket.binary(false).emit("startThinkingBidding", {
        bidder: nextBidder,
      });
      game.room.usernameOfCurrentBidder = nextBidder;

      if (game.gameState === constants.gameStates.waitingToContinueToPlaying) {
          if (game.usersReadyToContinue) game.usersReadyToContinue[userUtils.getUser(socketId).username] = null;
            io.binary(false).in(game.name).emit('showContinueButton', {seating: game.seating, exposedHandName: gameUtils.getExposedHandName(game)});
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function loadPlaying(game, currentSocketId, originalSocketId) {
    try {
      console.log('loadPlaying----------------------------------------------------');
      socket.binary(false).emit("sendSeatingToClientInBid", {
        seating: game.seating,
        dealer: gameUtils.getDealer(game),
        biddingTimerDurationValue: game.room.biddingTimerDurationValue,
      });
      const user = userUtils.getUser(currentSocketId);
      if (!user) {
        gameUtils.removeGame(game.name);
        return socket.binary(false).emit("notInSession", {room: game.name, type: "game", code: "11"});
      }
      //#region On Refresh - Sending Playing Info if That is where game state is
      const exposedHandSocketId = userUtils.getUserId(gameUtils.getExposedHandName(game));
      const hand = gameUtils.getHandForSocketID(game, currentSocketId);
      const exposedHand = gameUtils.getExposedHand(game);
      console.log('exposedHand =', exposedHand);
      const exposedHandName = gameUtils.getExposedHandName(game);
      const exposedHandSpot = gameUtils.getExposedHandSpot(game);
      const contract = gameUtils.getContract(game);
      const spotFromServer = gameUtils.getUserSpot(game, userUtils.getUser(currentSocketId).username);
      const declarersSpot = gameUtils.getDeclarersSpot(game);
      const playedCards = gameUtils.getPlayedCards(game);
      const handLengths = gameUtils.getHandLengths(game);
      const usersTurnToPlay = gameUtils.usersTurnToPlay(game, user.username);
      const roundStartPlayer = gameUtils.getRoundStartPlayer(game);
      const roundWinners = gameUtils.getRoundWinners(game);
      const scoring = gameUtils.getScoring(game);
      const doubleMultiplier = gameUtils.getDoubleMultiplier(game);
      const biddingTimerDurationValue = game.room.biddingTimerDurationValue;
      const cardPlayTimerDurationValue = game.room.cardPlayTimerDurationValue;
      const lastRoundStartPlayer = gameUtils.getRoundStartPlayer(game, gameUtils.getLastRound(game));
      const trickCounts = {
        northSouthTrickCount: gameUtils.getTeamTrickCount(game, "north"),
        eastWestTrickCount: gameUtils.getTeamTrickCount(game, "east"),
      };

      if (exposedHandSocketId === currentSocketId) {
          //sending to exposedhand on refresh
          socket.binary(false).emit("biddingFinished", {
              handFromServer: hand,
              declarersHand: gameUtils.getDeclarersHand(game),
              exposedHand,
              exposedHandName,
              exposedHandSpot,
              contract,
              spotFromServer,
              declarersSpot,
              playedCards,
              handLengths,
              usersTurnToPlay,
              roundStartPlayer,
              roundWinners,
              trickCounts,
              scoring,
              biddingTimerDurationValue,
              cardPlayTimerDurationValue,
              doubleMultiplier,
              lastRoundStartPlayer,
              roundWinSounds: game.roundWinSounds,
              colorThemeSourcesFromServer: constants.colorThemes,
          });
      } else {
          //sending to everyone else on refresh
          socket.binary(false).emit("biddingFinished", {
              handFromServer: hand,
              declarersHand: null,
              exposedHand,
              exposedHandName,
              exposedHandSpot,
              contract,
              spotFromServer,
              declarersSpot,
              playedCards,
              handLengths,
              usersTurnToPlay,
              roundStartPlayer,
              roundWinners,
              trickCounts,
              scoring,
              biddingTimerDurationValue,
              cardPlayTimerDurationValue,
              doubleMultiplier,
              lastRoundStartPlayer,
              roundWinSounds: game.roundWinSounds,
              colorThemeSourcesFromServer: constants.colorThemes,
          });
      }
      refreshReSync(user.username, currentSocketId, originalSocketId, game);
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region Playing Stuff
  //#region Event Listeners
  socket.binary(false).on("playCard", ({ cardAsNumber }) => {
    console.log('playCard event-------------------------------------');
    playCardSocketEvent(socket.id, cardAsNumber);
  });
  socket.binary(false).on("getRoundWinner", () => {
    try {
      console.log('getRoundWinner event-------------------------------------');
      const { user, game } = getUserAndGame(socket.id);
      const roundWinners = gameUtils.getRoundWinners(game);
      socket.binary(false).emit("sendRoundWinner", {
        roundWinner: roundWinners[roundWinners.length - 1],
      });
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on("playingGetHand", () => {
    console.log('playingGetHand event-------------------------------------');
    const { user, game } = getUserAndGame(socket.id);
    if (!user || !game) return;
    socket.binary(false).emit("playingSendHandToClient", {
      hand: gameUtils.getUsersHand(game, user.username),
      handLengths: gameUtils.getHandLengths(game), playedCards: gameUtils.getPlayedCards(game),
    });
  });
  socket.binary(false).on("playingGetExposedHand", () => {
    sendExposedHandToClient(socket.id);
  });
  socket.binary(false).on('playingGetLastRoundStartPlayer', ({room}) => {
      try {
      console.log('playingGetLastRoundStartPlayer event-------------------------------------');
      if (room === undefined || room === null) return;
      const game = gameUtils.getGame(room);
      if (game === undefined || game === null) return;
      socket.binary(false).emit('sendLastRoundStartPlayerToClient', {lastRoundStartPlayer: gameUtils.getRoundStartPlayer(game, gameUtils.getLastRound(game))});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('playingGetRoundStartPlayer', ({room}) => {
    try { 
      console.log('playingGetRoundStartPlayer event-------------------------------------');
      if (room === undefined || room === null) return;
      const game = gameUtils.getGame(room);
      if (game === undefined || game === null) return;
      socket.binary(false).emit('sendRoundStartPlayerToClient', {roundStartPlayer: gameUtils.getRoundStartPlayer(game)});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('roundEndAnimationCompletion', ({roomName}) => {
    console.log('roundEndAnimationCompletion event-------------------------------------');
    checkIsEveryoneReady(socket.id, 'roundEndAnimationCompletion', roomName);
  });  
  socket.binary(false).on('cardPlayAnimationCompletion', ({roomName}) => {
      try {
      console.log('cardPlayAnimationCompletion event-------------------------------------');
      console.log('roomName =', roomName);
      const game = gameUtils.getGame(roomName);
      if (game === undefined || game === null) return;
      console.log('game.hasSentIsAllowedToPlay =', game.hasSentIsAllowedToPlay);
      if (game.hasSentIsAllowedToPlay === true) return;
      game.hasSentIsAllowedToPlay = true;

      const playedCards = gameUtils.getPlayedCards(game);
      if (playedCards && playedCards.length >= 52) {
        // setTimeout(() => {
          emitDealComplete({game});
        // }, constants.waitBeforeDealSummaryDuration);
      }
      else if (playedCards.length % 4 !== 0){
        sendIsAllowedToPlay(game);
      }
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('sendStatusOfAnimationToServer', ({roomName, type, readyOrNot}) => {
    try {
      console.log('sendStatusOfAnimationToServer event-------------------------------------');
      const game = gameUtils.getGame(roomName);
      if (!game || !game.room) return null
      if (game && game.room && !game.room[type]) game.room[type] = {};
      game.room[type][socket.id] = readyOrNot;
      checkIsEveryoneReady(socket.id, type, roomName);
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('timesUpPlaying', ({room}) => {
    try {
      console.log('timesUpPlaying event-------------------------------------');
      const game = gameUtils.getGame(room);
      if (!game || !game.room || game.room.timesUpComplete === true) return null;
      game.room.timesUpComplete = true;
      const socketIdOfPlayer = userUtils.getUserId(gameUtils.getCurrentPlayer(game));
      const cardToPlay = autoPlayCard.start(game.room.usernameOfCurrentPlayer, game);
      game.room.usernameOfCurrentPlayer = null;
      playCardSocketEvent(socketIdOfPlayer, cardToPlay);
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('sendReadyToContinueStatus', ({username, roomName, originalSocketId}) => {
    try {
      console.log('sendReadyToContinueStatus event-------------------------------------');
      if (!roomName) return null;
      let game = gameUtils.getGame(roomName);
      if (!checkInSession(game, roomName, 'game', '12', socket.id)) return;

      game.usersReadyToContinue[username] = originalSocketId;

      //#endregion
      //#region Deciding Course based on usersReadyToContinue length
      if (helpers.objectLength(game.usersReadyToContinue) < 4) {
        emitUsersReadyToContinue(game);
      } 
      else if (helpers.objectLength(game.usersReadyToContinue) > 4) {
        return checkIfUsersReadyToContinue(game);
      }
      else if (helpers.objectLength(game.usersReadyToContinue) === 4 ){
        //#region Validating SocketIds
        for (const userReady in this.usersReadyToContinue) {
          if (this.usersReadyToContinue.hasOwnProperty(userReady)) {
            const socketIdReady = this.usersReadyToContinue[userReady];
            let correctUsersReady = false;
            for (const usernameOfOriginalSocketId in this.originSocketIds) {
              if (this.originSocketIds.hasOwnProperty(usernameOfOriginalSocketId)) {
                const originalSocketId = this.originSocketIds[usernameOfOriginalSocketId];
                if (originalSocketId === socketIdReady) correctUsersReady = true;
              }
            }
            if (correctUsersReady === false) return checkIfUsersReadyToContinue(game);
          }
        }
        //#endregion
        game.usersReadyToContinue = {};
        if (game.isGameOver === false) {
          return startNextDeal(game);
        }
        else {
          userUtils.updateStatusOfUsers(Object.values(game.seating), constants.statuses.inLobby);
          roomUtils.roomCreation(socket.id, game.name, game.room.password, false);
          roomUtils.removeUserFromRoom(socket.id, game.name);
          io.in(game.name).binary(false).emit("joinLobby");
          gameUtils.removeGame(game.name);
          return;
        }
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('userQuit', ({username, roomName}) => {
    try {
      console.log('userQuit event-------------------------------------');
      let game = gameUtils.getGame(roomName);
      if (!checkInSession(game, roomName, 'game', '13', socket.id)) return;
      io.binary(false).in(roomName).emit('displayFlashMessage', {msg: `'${username}' has quit.`, type: 'warning'});
      gameUtils.removeGame(roomName); 
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('getDealComplete', ({roomName}) => {
    try {
      console.log('getDealComplete event-------------------------------------');
      const game = gameUtils.getGame(roomName);
      if (!checkInSession(game, roomName, 'game', '14', socket.id)) return;

      emitDealComplete({game});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('claim', ({room, numberOfTricksClaimed}) => {
    try {
      console.log('claim event-------------------------------------');
      //#region Validation
      if (room === undefined || room === null || numberOfTricksClaimed === undefined || numberOfTricksClaimed === null) return;
      const game = gameUtils.getGame(room);
      if (game === undefined || game === null) return;
      const lastDeal = gameUtils.getLastDeal(game);

      const declarer = gameUtils.getDeclarer(game);
      if (userUtils.getUserId(declarer) !== socket.id) return socket.binary(false).emit('disableClaimButtons', {disableOnly: false});

      const declarersTurnToPlay = gameUtils.usersTurnToPlay(game, declarer);
      const isDeclarersTurnToPlay = declarersTurnToPlay === 0 ? false : true;
      const isClaimAll = parseInt(numberOfTricksClaimed) >= (13 - Math.floor(lastDeal.cardPlayOrder.length / 4));
      const isClaimNone = numberOfTricksClaimed === 0;
      if ((!isClaimAll && !isDeclarersTurnToPlay && !isClaimNone)) return socket.binary(false).emit('disableClaimButtons', {disableOnly: true});
      //#endregion
      lastDeal.agreeWithClaim.isClaimingAll = false;
      lastDeal.agreeWithClaim.claimAmount = numberOfTricksClaimed;
      if (parseInt(numberOfTricksClaimed) === 0) {
        console.log('claiming None..................');
        const randomInt = 0 + Math.floor(Math.random() * (constants.claimNoneMsgs.length - 1));
        io.binary(false).in(game.name).emit('displayFlashMessage', {msg: `'${gameUtils.getDeclarer(game)}' ${constants.claimNoneMsgs[randomInt]}`, duration: 5000});

        gameUtils.declarerClaimsAll(game);
        gameUtils.scoreLastDeal(game);
        emitDealComplete({game, isClaim: true});
        saveGameIncompletePlaying(game);
      }
      else if (isClaimAll) {
        console.log('claiming ALL..................');
        emitClaimAll(game, lastDeal);
      }
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('claimSome', ({room, claimingCards, otherHandCards, claimSomeCardPlayOrder, claimSomeClaimOrderHTML}) => {
    try {
      console.log('claimSome event-------------------------------------');
      const game = gameUtils.getGame(room);
      if (game === undefined || game === null) return
      const lastDeal = gameUtils.getLastDeal(game);
      const playedCards = gameUtils.getPlayedCards(game);

      const nthCardPlayed = playedCards.length % 4;
      if (nthCardPlayed !== 0) return socket.binary(false).emit('disableClaimButtons', {disableOnly: true});
      //#region Checking if Claim WOuld End Game and Emitting ClaimAll instead if true
      const nthRound = Math.floor(playedCards.length / 4);
      if (claimingCards && claimingCards.length + nthRound >= 13) return emitClaimAll(game, lastDeal);
      //#endregion
      
      //#region Check Cards Claimed are valid
      const declarersName = gameUtils.getDeclarer(game);
      const usersTurnToPlay = gameUtils.usersTurnToPlay(game, declarersName);

      const finalWinningCard = getClaimSomeShouldContinue({game, claimingCards, otherHandCards, claimSomeCardPlayOrder, usersTurnToPlay, declarersName});
      if (!finalWinningCard) return null;
      //#endregion

      const usernames = gameUtils.getUsersnamesOfDefense(game);
      socket.binary(false).emit('sendDeclarerClaimDisplay', {usernames});

      const claimTitle = `<span id='claimingUser'>Declarer</span> wants to claim ${claimingCards.length !== 1 ? 'these tricks' : 'this trick'}.  Do you Agree?`;
      emitClaimToDefense({game, lastDeal: gameUtils.getLastDeal(game), claimTitle, cardsToShow: claimingCards, otherHandCards, declarersTurnToPlay: usersTurnToPlay, claimSomeClaimOrderHTML, claimSomeCardPlayOrder});
      const endInHand = gameUtils.getUserNameWhoHasCard(game, finalWinningCard) === declarersName;

      lastDeal.agreeWithClaim.isClaimingAll = false;
      lastDeal.agreeWithClaim.claimAmount = claimingCards.length;
      lastDeal.agreeWithClaim.claimingCards = claimingCards;
      lastDeal.agreeWithClaim.otherHandCards = otherHandCards;
      lastDeal.agreeWithClaim.claimSomeCardPlayOrder = claimSomeCardPlayOrder;
      lastDeal.agreeWithClaim.endInHand = endInHand;
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('sendClaimResponse', ({room, response, username, cardsChosen}) => {
    try {
      console.log('sendClaimResponse event-------------------------------------');
      //#region Setup and Validation
      if (room === undefined || room === null || response === undefined || response === null) return null;
      if ((username === undefined || username === null) && cardsChosen && cardsChosen.length <= 0) return null;
      const game = gameUtils.getGame(room);
      if (game === undefined || game === null) return;
      if (username) game.users[username] = socket.id;
      const lastDeal = gameUtils.getLastDeal(game);
      const declarer = gameUtils.getDeclarer(game);
      const declarerSocketId = userUtils.getUserId(declarer);
      //#endregion
    
      if (lastDeal.agreeWithClaim.socketIds[socket.id] === null) lastDeal.agreeWithClaim.socketIds[socket.id] = response;

      if (response === false) {
        io.binary(false).in(game.name).emit('closeClaim', {isAccepted: false});
        io.binary(false).in(game.name).emit('displayFlashMessage', {msg: `Someone declined the claim.`, duration: constants.playingFlashMessageDuration * 1.5, isDuringPlaying: true});
        return;
      }      

      if (cardsChosen && cardsChosen.length >= 1) {
        if (Object.size(lastDeal.agreeWithClaim.throwInCards) < 2) {
          if (username) lastDeal.agreeWithClaim.throwInCards[username] = cardsChosen;
        }
      }

      //#region Getting Whether Both People Agree to Claim
      if (Object.size(lastDeal.agreeWithClaim.socketIds) !== 2) {
        console.log('returning due to socketIds size difference');
        return;
      }

      console.log('lastDeal.agreeWithClaim.socketIds =', lastDeal.agreeWithClaim.socketIds);
      let shouldReturn = false;
      for (const socketId in lastDeal.agreeWithClaim.socketIds) {
        if (lastDeal.agreeWithClaim.socketIds.hasOwnProperty(socketId )) {
          const agreesOrNot = lastDeal.agreeWithClaim.socketIds[socketId];
          console.log('agreesOrNot =', agreesOrNot);
          if (agreesOrNot === true) {
            console.log('username', userUtils.getUser(socketId).username);
            io.binary(false).to(socketId).emit('sendWaitingForPartner', {usernames: [gameUtils.getPartnersName(game, userUtils.getUser(socketId).username)]});
          }
          if (agreesOrNot !== true) {
            shouldReturn = true;
          }
        }
      }

      if (shouldReturn) return;
      //#endregion
      //#region Handling Claim All
      if (lastDeal.agreeWithClaim.isClaimingAll === true) {
        // setTimeout(() => {
        io.binary(false).to(declarerSocketId).emit('closeClaim', {isAccepted: true});
        // }, constants.claimCloseWaitTime / 3);
        gameUtils.declarerClaimsAll(game);
        gameUtils.scoreLastDeal(game);
        emitDealComplete({game, isClaim: true});
        io.binary(false).in(game.name).emit('displayFlashMessage', {msg: `'${declarer}' has claimed the rest.`, duration: constants.playingFlashMessageDuration * 1.5, isDuringPlaying: true});
      }
      //#endregion
      //#region Handling Claim Some
      else if (lastDeal.agreeWithClaim.claimAmount > 0) {
        if (Object.size(lastDeal.agreeWithClaim.throwInCards) >= 2) {
          const shouldContinue = validateDefenseClaimSome(lastDeal);
          if (shouldContinue !== true) return io.binary(false).in(game.name).emit('displayFlashMessage', {msg: `'${shouldContinue}' is trying to cheat the system.  Reporting activities to local Bridge authorities...`, type: response, duration: 5000});

          const declarerSocketId = userUtils.getUserId(declarer);
          const endInHand = lastDeal.agreeWithClaim.endInHand;   

          const newHands = gameUtils.declarerClaimsSome(game, lastDeal);
          const exposedHandName = gameUtils.getExposedHandName(game);
          for (const username in newHands) {
            if (newHands.hasOwnProperty(username)) {
              const newHand = newHands[username];
              let handToUse = newHand;
              if (username === exposedHandName) handToUse = newHands[declarer];

              io.binary(false).to(userUtils.getUserId(username)).emit('sendNewHandAfterClaimSome', {hand: handToUse, exposedHand: newHands[exposedHandName],  handLengths: gameUtils.getHandLengths(game), playedCards: gameUtils.getPlayedCards(game), roundWinners: lastDeal.roundWinners});
            }
          }

          const declarerClaimedCards =  [...lastDeal.agreeWithClaim.claimingCards, ...lastDeal.agreeWithClaim.otherHandCards];
          emitRoundWinnerAndTrickCounts(game, false);
          io.binary(false).to(declarerSocketId).emit('sendDeclarerClaimSomeResponse', {declarerClaimedCards, cardsPlayed: lastDeal.agreeWithClaim.throwInCards, endInHand});
          sendDefenseEachOthersChoice(game, lastDeal.agreeWithClaim.throwInCards, declarerClaimedCards);
          lastDeal.agreeWithClaim = constants.getNewAgreeWithClaim();
        }
      }
      //#endregion
      console.log('saving claim------------------------------------------------');
      saveGameIncompletePlaying(game);
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('cancelClaim', ({room, username}) => {
      try {
      console.log('cancelClaim event-------------------------------------');
      if (room === undefined || room === null || username === undefined || username === null) return;
      const game = gameUtils.getGame(room);
      if (game === undefined || game === null) return;
      const lastDeal = gameUtils.getLastDeal(game);
      lastDeal.agreeWithClaim = constants.getNewAgreeWithClaim();
      io.binary(false).in(game.name).emit('declarerCancelledClaim', {username});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('sendPointsToServer', ({room, highCardPoints, distributionPoints}) => {
    console.log('sendPointsToServer------------------------------------------------');
    const game = gameUtils.getGame(room);
    if (!game) return;
    const userObj = userUtils.getUser(socket.id);
    if (!userObj) return;

    //TODO: start by testing the server calculation part then change client sent in values to test real values

    if (highCardPoints === undefined || highCardPoints === null || distributionPoints === undefined || distributionPoints === null) {
      const lastDeal = gameUtils.getLastDeal(game);
      highCardPoints = getHighCardPoints(lastDeal.hands[userObj.username], userObj.preferences.pointCountingConvention);
      distributionPoints = getDistributionPoints(lastDeal.hands[userObj.username]);
    }
    if (!game.points) game.points = {};
    if (game.points && game.points[userObj.username] && game.points[userObj.username].length === game.deals.length) return;
   
    if (game.points && (!game.points[userObj.username])) game.points[userObj.username] = {
      distributionPoints: [],
      highCardPoints: [],
    };

    game.points[userObj.username].distributionPoints.push(distributionPoints);
    game.points[userObj.username].highCardPoints.push(highCardPoints);
  });
  //#endregion
  //#region Playing Functions
  function sendExposedHandToClient(socketId) {
    try {
      console.log('playingGetExposedHand event-------------------------------------');
      const { user, game } = getUserAndGame(socketId);
      if (!user || !game) return;
      io.binary(false).to(socketId).emit("playingSendExposedHandToClient", {
        exposedHand: gameUtils.getExposedHand(game),
        handLengths: gameUtils.getHandLengths(game), playedCards: gameUtils.getPlayedCards(game),
      });
    } catch (error) {
      console.error('error =', error);
    }
  }
  function emitClaimAll(game, lastDeal) {
    try {
      console.log('emitClaimAll----------------------------------------------------');
      lastDeal.agreeWithClaim.isClaimingAll = true;
      const usernames = gameUtils.getUsersnamesOfDefense(game);
      socket.emit('sendDeclarerClaimDisplay', {usernames});
      const declarersHandRemaining = gameUtils.getDeclarersHandRemaining(game);
      const claimTitle = `<span id='claimingUser'>Declarer</span> wants to claim the rest.`;
      emitClaimToDefense({game, lastDeal, claimTitle, cardsToShow: declarersHandRemaining});
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getClaimSomeShouldContinue({game, claimingCards, otherHandCards, claimSomeCardPlayOrder, usersTurnToPlay, declarersName}) {
    try {
      if (game === undefined || game === null || claimingCards === undefined || claimingCards === null || otherHandCards === undefined || otherHandCards === null || claimSomeCardPlayOrder === undefined || claimSomeCardPlayOrder === null) return false;
      if (claimingCards.length !== otherHandCards.length) return false;
      if (claimSomeCardPlayOrder.length % 2 !== 0) return false;
      return checkValidClaimSome({game, claimSomeCardPlayOrder, usersTurnToPlay, declarersName});
    } catch (error) {
      console.error('error =', error);
    }
  }
  function checkValidClaimSome({game, claimSomeCardPlayOrder, usersTurnToPlay, declarersName}) {
    try {
      const exposedHandName = gameUtils.getExposedHandName(game);
      
      //#region //Validate first card is from the claiming hand
      if (usersTurnToPlay === 0) return false;
      else if (usersTurnToPlay === 1) {
        if (declarersName !== gameUtils.getUserNameWhoHasCard(game, claimSomeCardPlayOrder[0])) return false;
      }
      else if (usersTurnToPlay === 2) {
        if (exposedHandName !== gameUtils.getUserNameWhoHasCard(game, claimSomeCardPlayOrder[0])) return false;
      }
      //#endregion

      let finalWinningCard = null;
      for (let i = 0; i < claimSomeCardPlayOrder.length / 2; i++) {
        const leadingCard = claimSomeCardPlayOrder[i * 2];
        const followingCard = claimSomeCardPlayOrder[i * 2 + 1];
        
        //#region Validate each set of two must have one card from each hand
        const leadingCardOwner = gameUtils.getUserNameWhoHasCard(game, leadingCard);
        const followingCardOwner = gameUtils.getUserNameWhoHasCard(game, followingCard);
        if (leadingCardOwner === followingCardOwner) return false;
        //#endregion

        //#region Validate that each set of two's winner is from the same hand as the next play
        const winningCard = gameUtils.getWinningCard(game, leadingCard, followingCard);
        let currentWinnerName = leadingCardOwner;
        if (winningCard === followingCard) currentWinnerName = followingCardOwner;


        if (i === claimSomeCardPlayOrder.length / 2 - 1) {
          finalWinningCard = winningCard;
        }
        else {
          //Validating Next lead is from Same Hand as Current Winning Hand
          const nextLeadCard = claimSomeCardPlayOrder[i * 2 + 2];
          const nextLeadCardOwner = gameUtils.getUserNameWhoHasCard(game, nextLeadCard);
          if (nextLeadCardOwner !== currentWinnerName) return false;
        }
        //#endregion
      }

      return finalWinningCard;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function sendDefenseEachOthersChoice(game, throwInCards, declarersCards) {
    try {
      console.log('sendDefenseEachOthersChoice------------------------------------------------');
      const defenseUsernames = gameUtils.getUsersnamesOfDefense(game);
      for (const username in throwInCards) {
        if (throwInCards.hasOwnProperty(username)) {
          const throwInCardsForUser = throwInCards[username];
          const partnersName = gameUtils.getPartnersName(game, username);
          const partnerThrowInCards = throwInCards[partnersName];
          for (let i = 0; i < defenseUsernames.length; i++) {
            const usernameOfDefensePlayer = defenseUsernames[i];
            if (usernameOfDefensePlayer !== username) io.binary(false).to(userUtils.getUserId(usernameOfDefensePlayer)).emit('sendThrowInsToOtherDefensePlayer', {throwInCardsForUser, partnerThrowInCards, partnersName: username, declarersCards});
          }
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function validateDefenseClaimSome(lastDeal) {
    try {
      console.log('validateDefenseClaimSome------------------------------------------------');
      console.log('lastDeal.agreeWithClaim =', lastDeal.agreeWithClaim);
      for (const username in lastDeal.agreeWithClaim.throwInCards) {
        if (Object.hasOwnProperty.call(lastDeal.agreeWithClaim.throwInCards, username)) {
          const usersThrowInCards = lastDeal.agreeWithClaim.throwInCards[username];
          const claimPlayOrder = lastDeal.agreeWithClaim.claimSomeCardPlayOrder;
          let usersHandAtStart = lastDeal.hands[username].flatten(2).filter(card => !lastDeal.cardPlayOrder.includes(card));
          const cardsChecked = [];
          for (let i = 0; i < usersThrowInCards.length; i++) {
            const thrownInCard = parseInt(usersThrowInCards[i]);
            const suitOfLeadCard = gameUtils.getSuitFromNumber(claimPlayOrder[i*2]);
            const suitOfThrownInCard = gameUtils.getSuitFromNumber(thrownInCard);
            
            if (suitOfThrownInCard !== suitOfLeadCard) {
              if (!getMustFollowSuit(usersHandAtStart, suitOfLeadCard)) return username;
            }
            cardsChecked.push(parseInt(thrownInCard));
            usersHandAtStart = usersHandAtStart.filter(card => !cardsChecked.includes(card));
          }
        }
      }
      return true;
    } catch (error) {
      console.error('error =', error);
      return false;
    }
  }
  function getMustFollowSuit(usersHandAtStart, suitOfLeadCard) {
    try {
      console.log('getMustFollowSuit------------------------------------------------');
      for (let i = 0; i < usersHandAtStart.length; i++) {
        const card = usersHandAtStart[i];
        const cardsSuit = gameUtils.getSuitFromNumber(card);
        if (cardsSuit === suitOfLeadCard) return false;
      }
      return true;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function emitClaimToDefense({game, lastDeal, claimTitle , cardsToShow, otherHandCards = [], declarersTurnToPlay = null, claimSomeClaimOrderHTML = null, claimSomeCardPlayOrder = null}) {
    try {
      console.log('emitClaimToDefense----------------------------------------------------');
      const socketIdsOfDefense = gameUtils.getSocketIdsOfDefense(game);
      for (let i = 0; i < socketIdsOfDefense.length; i++) {
        const socketIdOfOpposingPlayer = socketIdsOfDefense[i];
        lastDeal.agreeWithClaim.socketIds[socketIdOfOpposingPlayer] = null;
        io.binary(false).to(socketIdOfOpposingPlayer).emit('sendClaimToClient', {cardsToShow, otherHandCards, declarersTurnToPlay, username: userUtils.getUser(socket.id).username, claimTitle, claimSomeClaimOrderHTML, claimSomeCardPlayOrderFromServer: claimSomeCardPlayOrder});
      }
    }
    catch {}
  }
  function checkIfUsersReadyToContinue(game) {
    try {
      console.log('checkIfUsersReadyToContinue----------------------------------------------------');
      if (!checkInSession(game, null, 'game', '15', socket.id)) return;

      game.usersReadyToContinue = {};
      io.binary(false).in(game.name).emit('getReadyToContinueStatus');
    } catch (error) {
      console.error('error =', error);
    }
  }
  function startNextDeal(game) {
    try {
      console.log('startNextDeal----------------------------------------------------');
      gameUtils.createNewDeal(game);
      const lastDeal = gameUtils.getLastDeal(game);
      if (!lastDeal) {
        return socket.binary(false).emit('notInSession', {room: roomName, type: 'game', code: "16"});
      }
      const usersInRoom = userUtils.getRoomUsers(game.name);
      for (let i = 0; i < usersInRoom.length; i++) {
        const userObj = usersInRoom[i];
        const handFromServer = gameUtils.getHandForSocketID(game, userObj.socketId);
        io.binary(false).to(userObj.socketId).emit("playNewDeal", {
          dealer: gameUtils.getDealer(game),
          contractsFromServer: constants.contracts,
          seating: game.seating,
          handFromServer,
          scoring: gameUtils.getScoring(game),
          timerValue: game.room.biddingTimerDurationValue,
        });            
      }
      saveGameIncompletePlaying(game);
      sendIsAllowedToMakeBid(userUtils.getUserId(gameUtils.getNextBidder(game)), game, lastDeal.bids);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getUserAndGame(socketId) {
    try {
      console.log('getUserAndGame----------------------------------------------------');
      const user = userUtils.getUser(socketId);
      if (!user) {
        return checkInSession(null, Game, 'game', '17', socketId);
      }
      const game = gameUtils.getGame(user.room);
      if (!checkInSession(game, user.room, 'game', '18', socketId)) return;
      
      return { user, game };
    } catch (error) {
      console.error('error =', error);
    }
  }
  async function playCardSocketEvent(socketIdOfPlayer, cardAsNumber) {
      try {
      console.log('playCardSocketEvent----------------------------------------------------');
      const { user, game } = getUserAndGame(socketIdOfPlayer);
      if (!user || !game) return null;
      if (gameUtils.usersPlayIsValid(game, cardAsNumber, user.username)) {
        game.hasSentIsAllowedToPlay = false;
        //#region Playing Card and Resetting Timers
        const playedCards = gameUtils.playCard(game, cardAsNumber);
        roomUtils.resetTimer(game.room);
        io.binary(false).in(game.name).emit('resetTimer');
        //#endregion
        //#region Setting Variables
        const exposedHandName = gameUtils.getExposedHandName(game);
        const numberOfCardsPlayed = playedCards.length;
        const playerToSend = gameUtils.isFromExposedHand(game, cardAsNumber) ? exposedHandName : user.username;
        const handLengths = gameUtils.getHandLengths(game);
        const roundStartPlayer = gameUtils.getRoundStartPlayer(game);
        //#endregion
        if (numberOfCardsPlayed === 1) {
          io.in(game.name).binary(false).emit('displayExposedHand', {exposedHand: gameUtils.getExposedHand(game), handLengths, playedCards});
        }
        updateAfterPlay(socketIdOfPlayer, cardAsNumber, playedCards, handLengths, roundStartPlayer, playerToSend, game.name);
        //#region Case: End of Round
        if (numberOfCardsPlayed !== 52 && numberOfCardsPlayed % 4 === 0 && numberOfCardsPlayed >= 4) {
          emitRoundWinnerAndTrickCounts(game);
          checkIsEveryoneReady(socketIdOfPlayer, 'roundEndAnimationCompletion', game.name);
        }
        //#endregion
        //#region Case: End of Deal
        else if (numberOfCardsPlayed === 52) {
          emitRoundWinnerAndTrickCounts(game);
          gameUtils.scoreLastDeal(game);
          if (game.isGameOver === true) {
            sendGameOver(game, false);
          }
          else if (game.isGameOver === false) {
            checkIsEveryoneReady(socketIdOfPlayer, 'roundEndAnimationCompletion', game.name);
          }      
        }
        //#endregion
        //#region Case: Middle of Round
        else {
          checkIsEveryoneReady(socketIdOfPlayer, 'cardPlayAnimationCompletion', game.name);
        }
        //#endregion
        saveGameIncompletePlaying(game);
      }
      //#region Sending Invalid Card Played
      else {
        socket.binary(false).emit("invalidCardPlayed", {
          cardAsNumber,
          playedCards: gameUtils.getPlayedCards(game),
        });
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function emitRoundWinnerAndTrickCounts(game, shouldEvaluateWinner = true) {
    try {
      console.log('emitRoundWinnerAndTrickCounts----------------------------------------------------');
      if (!game) return;
      let roundWinner;
      if (shouldEvaluateWinner) {
        roundWinner = gameUtils.evaluateWinner(game);
        gameUtils.pushRoundWinner(game, roundWinner);
      }
      else {
        const roundWinners = gameUtils.getRoundWinners(game);
        roundWinner = roundWinners[roundWinners.length - 1];
      }

      const northSouthTrickCount = gameUtils.getTeamTrickCount(game, "north");
      const eastWestTrickCount = gameUtils.getTeamTrickCount(game, "east");
      io.binary(false).in(game.name).emit("sendRoundWinnerAndTrickCounts", { roundWinner, northSouthTrickCount, eastWestTrickCount });
    } catch (error) {
      console.error('error =', error);
    }
  }
  function updateAfterPlay(socketId, cardAsNumber, playedCards, handLengths, roundStartPlayer, playerToSend, gameName) {
    try {
      console.log('updateAfterPlay----------------------------------------------------');
      io.binary(false).to(socketId).emit("validCardPlayed", {
        cardAsNumber,
        playedCards,
        handLengths,   
        roundStartPlayer,       
      });
      
      const usersInRoom = userUtils.getRoomUsers(gameName);
      for (let i = 0; i < usersInRoom.length; i++) {
        const userObj = usersInRoom[i];
        if (userObj.socketId !== socketId) {
          io.binary(false).to(userObj.socketId).emit("updateClients", {
            cardAsNumber,
            currentPlayer: playerToSend,
            playedCards,
            handLengths,          
          });
        }
      }

      const game = gameUtils.getGame(gameName);
      if (!game || !game.room) return;
      game.room.roundEndAnimationCompletion = {};
    } catch (error) {
      console.error('error =', error);
    }
  }
  function refreshReSync(username, currentSocketId, originalSocketId, game) {
    try {
      console.log('refreshReSync----------------------------------------------------');
      if (!checkInSession(game, null, 'game', '27.5', currentSocketId)) return;
      if (game.room.roundEndAnimationCompletion) game.room.roundEndAnimationCompletion[currentSocketId] = true;
      if (game.room.cardPlayAnimationCompletion && helpers.objectLength(game.room.cardPlayAnimationCompletion) > 0) game.room.cardPlayAnimationCompletion[currentSocketId] = true;
      game.room.timesUpComplete = false;

      let timeLeft;
      if (!game.room.turnStartTime) timeLeft = -1
      else timeLeft = Math.ceil(Math.abs(game.room.turnStartTime - Date.now()));
  
      //#region Sending Timer Start if there is more than 0 seconds left to play otherwise nothing
      if (timeLeft >= 0 && game.room.turnStartTime !== null) {
          emitStartPlayTimer(currentSocketId, game.room.turnStartTime, gameUtils.getCurrentPlayer(game));
      }
      emitStartThinkingPlaying(game.name);
      socket.binary(false).emit('getStatusOfAnimation', {type: 'cardPlayAnimationCompletion'});
      // socket.binary(false).emit('getStatusOfAnimation', {type: 'roundEndAnimationCompletion'});
      // checkIsEveryoneReady(currentSocketId, 'cardPlayAnimationCompletion', game.name);
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function checkIsEveryoneReady (socketId, type, roomName) {
    try {
      console.log('checkIsEveryoneReady----------------------------------------------------');
      console.log('checkIsEveryoneReady-------------------------------');
      const game = gameUtils.getGame(roomName);
      const usersInRoom = userUtils.getRoomUsers(roomName);
      if (!game || !game.room || !usersInRoom || !type) return null;
      const playedCards = gameUtils.getPlayedCards(game);

      //TODO: remove up to return to get back behavior of 3 users responding with ready to complete
      if (playedCards && playedCards.length >= 52) {
        emitDealComplete({game});
      }
      else {
        game.room[type] = {};
        sendIsAllowedToPlay(game);
      }
      return;


      //#region Getting the Socket Ids not Present
      let needToAdd = [];
      for (let i = 0; i < usersInRoom.length; i++) {
        const userObj = usersInRoom[i];
        let shouldAdd = true;
        for (const socketId in game.room[type]) {
          if (game.room[type].hasOwnProperty(socketId)) {
            if (socketId === userObj.socketId) {
              shouldAdd = false;
              break;
            }
          }
        }
        if (shouldAdd) {
          if(!needToAdd.includes(userObj.socketId)) needToAdd.push(userObj.socketId);
        }
      }
      //#endregion
      //#region Populating the Object is SocketIds Not Present
      for (let i = 0; i < needToAdd.length; i++) {
        const socketId = needToAdd[i];
        if (game.room[type][socketId] !== true) game.room[type][socketId] = false;
      }
      //#endregion

      //#region Automatically Setting the Dummy Hand to Be Ready
      let dummySocketId = game.dummySocketId;
      if (!dummySocketId || dummySocketId === '') {
        const exposedHandName = gameUtils.getExposedHandName(game);
        dummySocketId = userUtils.getUserId(exposedHandName);
        game.dummySocketId = dummySocketId;
      }
      game.room[type][dummySocketId] = true;
      //#endregion

      //Setting User who emitted event to ready
      game.room[type][socketId] = true;
      
      //#region Checking that There are four Users who are Ready in Room.roundEndAnimationCompletion
      const roomSize = Object.size(game.room[type]);
      if (roomSize < 4) return false;
      else if (roomSize > 4) {
        game.room[type] = {};
        io.binary(false).in(game.name).emit('getStatusOfAnimation', {type});
        return false;
      }
      let areAllReady = true;
      for (const socketId in game.room[type]) {
        if (game.room[type].hasOwnProperty(socketId)) {
          const isComplete = game.room[type][socketId];
          if (!isComplete) {
            areAllReady = false;
            break;
          }
        }
      }
      //#endregion
      //#region Starting is AllowedToPlay when everyone ready.
      if (areAllReady === true) {
        if (playedCards && playedCards.length >= 52) {
          emitDealComplete({game});
        }
        else {
          game.room[type] = {};
          sendIsAllowedToPlay(game);
        }
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function emitUsersReadyToContinue (game) {
    console.log('emitUsersReadyToContinue----------------------------------------------------');
    return io.binary(false).in(game.name).emit('sendClientUsersReadyToContinue', {usersReadyToContinue: Object.keys(game.usersReadyToContinue)});
  }
  function emitDealComplete ({game, socketId, isClaim = false}) {
    try {
      console.log('emitDealComplete----------------------------------------------------');
      console.log('emitDealComplete---------------------------------');
        if (!checkInSession(game, null, 'game', '28.5', socketId)) return;
      const toDisplay = (game.isGameOver) ? game.deals : gameUtils.getLastDeal(game);
      
      if (!game || !toDisplay) {
        gameUtils.removeGame(game.name);
        return io.binary(false).to(socketId).emit('notInSession', {room: "Game", type: 'game', code: "19"});
      }
      game.gameState = constants.gameStates.dealSummary;

      //responding to refreshes
      if (socketId) {
        console.log('sending dealComplete via refresh...');
        socket.binary(false).emit('sendSeatingToClientInBid', {seating: game.seating, dealer: gameUtils.getDealer(game), biddingTimerDurationValue: game.room.biddingTimerDurationValue});
        return socket.binary(false).emit('dealComplete', {toDisplay, nthDeal: game.deals.length - 1, isGameOver: game.isGameOver, gameRoundEndingScores: game.isGameOver ? game.gameRoundEndingScores : null});
      }

      //responding to normal flow
      saveGameAtDealComplete(game);
      // setTimeout(() => {

        if (game.isGameOver) {
          //get four random quotes and send one to each player
          const playersInRoom = userUtils.getRoomUsers(game.name);
          for (let i = 0; i < playersInRoom.length; i++) {
            const randomInt = Math.floor(Math.random() * (constants.quotes.length - 1));
            const userObj = playersInRoom[i];
            const quoteFromServer = constants.quotes[randomInt];
            io.binary(false).to(userObj.socketId).emit('sendQuoteToClient', {quoteFromServer});
          }
        }

        io.binary(false).to(game.name).emit('dealComplete', {toDisplay, nthDeal: game.deals.length - 1, isGameOver: game.isGameOver, gameRoundEndingScores: game.isGameOver ? game.gameRoundEndingScores : null, isClaim});
      // }, isClaim ? 0 : constants.waitBeforeDealSummaryDuration);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function sendGameOver(game, isRefresh) {
    try {
      console.log('sendGameOver----------------------------------------------------');
      if (!checkInSession(game, "Game", 'game', '20', socket.id)) return;
      const socketId = isRefresh ? socket.id : null;
      emitDealComplete({game, socketId});
    } catch (error) {
      console.error('error =', error);
    }
  }
  function sendIsAllowedToPlay (game, isUndo=false) {
    try {
      console.log('sendIsAllowedToPlay----------------------------------------------------');
      if (game === undefined || game === null) return null;
      //#region Initialization
      const exposedHandName = gameUtils.getExposedHandName(game);
      const playedCards = gameUtils.getPlayedCards(game);
      const declarer = gameUtils.getDeclarer(game);
      const currentPlayer = gameUtils.getCurrentPlayer(game);
      let nextPlayerToPlay;
      let playerToSendTo;
      //#endregion

      //#region Getting Player To Send To and Sending Allowed to Play
      if (playedCards && playedCards.length > 0 && playedCards.length % 4 === 0) {
        const roundWinner =  gameUtils.getLastRoundWinner(game);
        playerToSendTo = roundWinner;
      }
      else {
        playerToSendTo = currentPlayer;
      }

      if (playerToSendTo === exposedHandName) {
        io.binary(false).to(userUtils.getUserId(declarer)).emit("isAllowedToPlayFromExposedHand", {playedCards});
        nextPlayerToPlay = exposedHandName;
      }
      else {
        io.binary(false).to(userUtils.getUserId(playerToSendTo)).emit("isAllowedToPlay", {playedCards});
        nextPlayerToPlay = playerToSendTo;
      }
      //#endregion

      //#region Sending Start Timer Event to Everyone in Room
      const usersInRoom = userUtils.getRoomUsers(game.name);
      if (!game.room || !usersInRoom) return null;
      game.room.usernameOfCurrentPlayer = nextPlayerToPlay;
      game.room.timesUpComplete = false;
      game.room.turnStartTime = Date.now();
      for (let i = 0; i < usersInRoom.length; i++) {
        const userObj = usersInRoom[i];
        emitStartPlayTimer(userObj.socketId, game.room.turnStartTime, nextPlayerToPlay);
      }
      emitStartThinkingPlaying(game.name, isUndo);
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function emitStartThinkingPlaying(gameName, isUndo=false) {
    console.log('emitStartThinkingPlaying----------------------------------------------------');
    io.binary(false).in(gameName).emit('startThinkingPlaying', {isUndo});
  }
  function emitStartPlayTimer(socketId, startTime, playerName) {
    console.log('emitStartPlayTimer----------------------------------------------------');
    io.binary(false).to(socketId).emit('startPlayTimer', {startTime, playerName});
  }
  function startPlaying(game) {
    try {
      console.log('startPlaying----------------------------------------------------');
      gameUtils.setContractAndDeclarer(game);
      const scoring = gameUtils.getScoring(game);
      const exposedHandSocketId = userUtils.getUserId(
        gameUtils.getExposedHandName(game)
      );
      const declarer = gameUtils.getDeclarer(game);
      const roomWithUsers = userUtils.getRoomUsers(game.name);
      const exposedHandName = gameUtils.getExposedHandName(game);
      const exposedHandSpot = gameUtils.getExposedHandSpot(game);
      const contract = gameUtils.getContract(game);
      const declarersSpot = gameUtils.getDeclarersSpot(game);
      const handLengths = gameUtils.getHandLengths(game);
      const doubleMultiplier = gameUtils.getDoubleMultiplier(game);
      const cardPlayTimerDurationValue = game.room.cardPlayTimerDurationValue;
      for (let i = 0; i < roomWithUsers.length; i++) {
        const user = roomWithUsers[i];
        const spotFromServer = gameUtils.getUserSpot(game, userUtils.getUser(user.socketId).username);
        if (exposedHandSocketId === user.socketId) {
          //This is what is send to the exposedhand on game start
          io.binary(false).to(user.socketId).emit("biddingFinished", {
              handFromServer: null,
              declarersHand: gameUtils.getDeclarersHand(game),
              exposedHand: null,
              exposedHandName,
              exposedHandSpot,
              contract,
              spotFromServer,
              declarersSpot,
              playedCards: [],
              handLengths,
              usersTurnToPlay: null,
              roundStartPlayer: null,
              roundWinners: null,
              trickCounts: null,
              scoring,
              cardPlayTimerDurationValue,
              doubleMultiplier,
              lastRoundStartPlayer: null,
              roundWinSounds: game.roundWinSounds,
              colorThemeSourcesFromServer: constants.colorThemes,
          });
        } else {
          //this is sent to everyone else on game start
          io.binary(false).to(user.socketId).emit("biddingFinished", {
              handFromServer: null,
              declarersHand: null,
              exposedHand: null,
              exposedHandName,
              exposedHandSpot,
              contract,
              spotFromServer,
              declarersSpot,
              playedCards: [],
              handLengths,
              usersTurnToPlay: null,
              roundStartPlayer: null,
              roundWinners: null,
              trickCounts: null,
              scoring,
              cardPlayTimerDurationValue,
              doubleMultiplier,
              lastRoundStartPlayer: null,
              roundWinSounds: game.roundWinSounds,
              colorThemeSourcesFromServer: constants.colorThemes,
          });
        }
      }
      sendIsAllowedToPlay (game);
      game.gameState = constants.gameStates.playing;
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region Undo Stuff
  socket.binary(false).on('undoLastBid', ({username, room, originalSocketId}) => {
    try {
      console.log('undoLastBid event-------------------------------------');
      const {game, lastDeal} = getShouldContinueUndoInitial(username, room, true);
      if (!checkInSession(game, room, 'game', '29.5', socket.id)) return;
      if (!verifyUndoInitial(game, username, true)) return;

      const userHasBid = checkUserHasBid(username, lastDeal.bids);
      if (!userHasBid) {
        socket.binary(false).emit('displayFlashMessage', {msg: 'You must first bid before undoing your last bid...', type: 'warning'});
        return socket.binary(false).emit('disableUndoBidButton');
      }
      socket.binary(false).emit('sendDeclarerClaimDisplay', {usernames: undefined}); 
      
      game.undoRequest.numberOfResponsesNeeded = 3;
      game.undoRequest.active = true;
      game.undoRequest.responses = {};
      const nameOfBid = getNameOfLastBid(username, lastDeal.bids);
      socket.binary(false).to(room).emit('sendUndoBidRequestToClients', {usernameOfRequester: username, nameOfBid});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('undoLastPlay', ({username, room, originalSocketId}) => {
    try {
      console.log('undoLastPlay event-------------------------------------');
      const {game, lastDeal} = getShouldContinueUndoInitial(username, room, false);
      if (!checkInSession(game, room, 'game', '30', socket.id)) return;

      const exposedHandName = gameUtils.getExposedHandName(game);
      if (username === exposedHandName) return socket.binary(false).emit('disableUndoPlayButton');
      if (!verifyUndoInitial(game, username, false)) return;

      const lastCardPlayed = checkUserHasPlayedCard(game, username, lastDeal.cardPlayOrder);
      if (typeof lastCardPlayed !== 'number' || lastCardPlayed < 0 || lastCardPlayed > 51) {
        socket.binary(false).emit('displayFlashMessage', {msg: 'You must play a card before undoing...', type: 'warning', duration: constants.playingFlashMessageDuration, isDuringPlaying: true});
        return socket.binary(false).emit('disableUndoPlayButton');
      }
      
      game.undoRequest.numberOfResponsesNeeded = 2;
      game.undoRequest.active = true;
      game.undoRequest.responses = {};
      
      const defenseUsernames = gameUtils.getUsersnamesOfDefense(game);
      sendUndoRequestToOtherTwoClients(game, lastDeal, username, lastCardPlayed, defenseUsernames);
      socket.binary(false).emit('sendDeclarerClaimDisplay', {usernames: defenseUsernames});
    } catch (error) {
      console.error('error =', error);
    }
  });
  socket.binary(false).on('sendUndoResponse', ({usernameOfRequester, username, room, response, isDuringPlaying}) => {
    try {
      console.log('sendUndoResponse event-------------------------------------');
      if (!username || response === undefined || response === null || room === undefined || room === null || usernameOfRequester === undefined || usernameOfRequester === null) return;

      const game = gameUtils.getGame(room);
      if (!checkInSession(game, room, 'game', '30.5', socket.id)) return;

      const shouldContinue = getShouldContinueUndoResponse(game, usernameOfRequester, username, response);
      if (!shouldContinue) return;

      const lastDeal = gameUtils.getLastDeal(game);
      isDuringPlaying = convertToBoolean(isDuringPlaying);
      if (isDuringPlaying === false) {
        executeBidUndo(game, lastDeal, usernameOfRequester);
        saveGameIncompleteBidding(game, true);
      }
      else {
        executePlayUndo(game, lastDeal, usernameOfRequester);
        saveGameIncompletePlaying(game);
      }
    
      game.undoRequest = constants.getNewUndoRequest();
    } catch (error) {
      console.error('error =', error);
    }
  });
  function sendUndoRequestToOtherTwoClients(game, lastDeal, usernameOfRequester, lastCardPlayed, defenseUsernames) {
    try {
      console.log('sendUndoRequestToOtherTwoClients----------------------------------------------------');
      let toSendToSocketIds = [];
      const exposedHandName = gameUtils.getExposedHandName(game);
      
      if (usernameOfRequester === lastDeal.declarer || usernameOfRequester === exposedHandName) toSendToSocketIds = defenseUsernames;
      else {
        for (const location in game.seating) {
          if (game.seating.hasOwnProperty(location)) {
            const usernameLocal = game.seating[location];
            if (usernameLocal !== usernameOfRequester && usernameLocal !== exposedHandName) toSendToSocketIds.push(usernameLocal);
          }
        }
      }

      for (let i = 0; i < toSendToSocketIds.length; i++) {
        const usernameLocal = toSendToSocketIds[i];
        const socketId = userUtils.getUserId(usernameLocal);
        io.binary(false).to(socketId).emit('sendUndoPlayRequestToClients', {usernameOfRequester, lastCardPlayed});
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function  getShouldContinueUndoResponse(game, usernameOfRequester, username, response) {
      try {
      console.log( 'getShouldContinueUndoResponse----------------------------------------------------');
      if (response === false && game.undoRequest.active === true) io.binary(false).in(game.name).emit('sendUndoRequestDenied', {usernameOfRequester});
      if (response === false || Object.size(game.undoRequest.responses) > game.undoRequest.numberOfResponsesNeeded) {
        game.undoRequest.active = false;
        game.undoRequest.responses = {};
        return false;
      }

      if (username) game.undoRequest.responses[username] = response;
      if (Object.size(game.undoRequest.responses) < game.undoRequest.numberOfResponsesNeeded) return false;
      for (const username in game.undoRequest.responses) {
        if (game.undoRequest.responses.hasOwnProperty(username)) {
          const response = game.undoRequest.responses[username];
          if (username && response === false) return false;
        }
      }
      return true;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function executeBidUndo(game, lastDeal, usernameOfRequester) {
    try {
      console.log('executeBidUndo----------------------------------------------------');
      game.gameState = constants.gameStates.bidding;
      game.usersReadyToContinue = {};
      resetBiddingUpTolastBidByUsername(usernameOfRequester, lastDeal);
      sendIsAllowedToMakeBid(userUtils.getUserId(usernameOfRequester), game, lastDeal.bids);


      io.binary(false).in(game.name).emit('hideReadyToContinueItems', {bidding: lastDeal.bids, shouldResetTable: true});
      io.binary(false).in(game.name).emit('sendBiddingToClient', {bidding: lastDeal.bids, shouldResetTable: true});
      io.binary(false).in(game.name).emit("setBidLabels", {currentBidder: usernameOfRequester, bids: lastDeal.bids});
      io.binary(false).in(game.name).emit('displayFlashMessage', {msg: `Undo Accepted!  It is ${usernameOfRequester}'s Turn to Bid.`, type: 'success'});

      const roomUsers = userUtils.getRoomUsers(game.name);
      for (let i = 0; i < roomUsers.length; i++) {
        const roomUser = roomUsers[i];
        if (roomUser.username !== usernameOfRequester) io.binary(false).to(roomUser.socketId).emit('closeBidContainer');
      }

      //This needs to come last to prevent a bug
      io.binary(false).in(game.name).emit("setThinkingLocation", {currentBidder: usernameOfRequester});
    } catch (error) {
      console.error('error =', error);
    }
  }
  function executePlayUndo(game, lastDeal, usernameOfRequester) {
    try {
      console.log('executePlayUndo----------------------------------------------------');
      game.gameState = constants.gameStates.playing;
      const numberOfRoundsPlayedBefore = Math.floor(lastDeal.cardPlayOrder.length / 4);
      resetCardPlayOrderToLastPlayByUsername(game, lastDeal, usernameOfRequester);
      const numberOfRoundsPlayedAfter = Math.floor(lastDeal.cardPlayOrder.length / 4);
      const difference = Math.abs(numberOfRoundsPlayedAfter - numberOfRoundsPlayedBefore);
      if (difference !==0) lastDeal.roundWinners.splice(lastDeal.roundWinners.length - difference);

      const northSouthTrickCount = gameUtils.getTeamTrickCount(game, 'north');
      const eastWestTrickCount = gameUtils.getTeamTrickCount(game, 'east');
      const handLengths = gameUtils.getHandLengths(game);
      const exposedHandName = gameUtils.getExposedHandName(game);
      const declarersHand = gameUtils.getDeclarersHand(game);

      io.binary(false).to(userUtils.getUserId(exposedHandName)).emit('sendDeclarersHandToDummy', {declarersHand});
      sendExposedHandToClient(userUtils.getUserId(exposedHandName));
      io.binary(false).in(game.name).emit('sendUpdateAfterUndo', {playedCards: lastDeal.cardPlayOrder, roundWinners: lastDeal.roundWinners, northSouthTrickCount, eastWestTrickCount, handLengths});
      io.binary(false).in(game.name).emit('displayFlashMessage', {msg: `Undo Accepted.  It is ${usernameOfRequester}'s turn.`, type: 'success', duration: constants.playingFlashMessageDuration, isDuringPlaying: true});

      // setTimeout(() => {
      sendIsAllowedToPlay(game, true);
      // }, 1000);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetCardPlayOrderToLastPlayByUsername(game, lastDeal, usernameOfRequester) {
    try {
      console.log('resetCardPlayOrderToLastPlayByUsername----------------------------------------------------');
      const declarer = lastDeal.declarer;
      const exposedHandName = gameUtils.getExposedHandName(game);
      let index = -1;
      for (let i = lastDeal.cardPlayOrder.length - 1; i >= 0; i--) {
        const cardAsNumber = lastDeal.cardPlayOrder[i];
        if (declarer === usernameOfRequester) {
          if (gameUtils.usersHandContainsCard(game, cardAsNumber, usernameOfRequester) || gameUtils.usersHandContainsCard(game, cardAsNumber, exposedHandName)) {
            index = i;
            break;
          }
        }
        else {
          if (gameUtils.usersHandContainsCard(game, cardAsNumber, usernameOfRequester)) {
            index = i;
            break;
          }
        }
      }
      if (index !== -1) lastDeal.cardPlayOrder.splice(index);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetBiddingUpTolastBidByUsername(usernameOfRequester, lastDeal) {
    try {
      console.log('resetBiddingUpTolastBidByUsername----------------------------------------------------');
      if (usernameOfRequester === undefined || usernameOfRequester === null || lastDeal === undefined || lastDeal === null || !lastDeal.bids || lastDeal.bids.length === 0) return;
      
      let index = -1;
      for (let i = lastDeal.bids.length - 1; i >= 0; i--) {
        const bid = lastDeal.bids[i];
        if (bid[0] === usernameOfRequester) {
          index = i;
          break;
        }
      }
      if (index !== -1) lastDeal.bids.splice(index);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getNameOfLastBid (usernameOfRequester, bids) {
    try {
      console.log('getNameOfLastBid----------------------------------------------------');
      for (let i = 0; i < bids.length; i++) {
        const bid = bids[i][1];
        if (bids[i][0] === usernameOfRequester) return bid;
      }
      return null;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getShouldContinueUndoInitial(username, room, isBidding) {  
    try {
      console.log('getShouldContinueUndoInitial----------------------------------------------------');
      if (username === undefined || username === null || room === undefined || room === null) return false;
      const game = gameUtils.getGame(room);
      if (!game) return false;
      const lastDeal = gameUtils.getLastDeal(game);
      if (isBidding) {
        if (!lastDeal.bids || lastDeal.bids.length === 0) socket.binary(false).emit('disableUndoBidButton');
      }
      else {
        if (!lastDeal.cardPlayOrder || lastDeal.cardPlayOrder.length === 0) socket.binary(false).emit('disableUndoPlayButton');
      }
      return {game, lastDeal};
    } catch (error) {
      console.error('error =', error);
    }
  }
  function verifyUndoInitial(game, username, isBidding) {
    try{
      console.log('verifyUndoInitial----------------------------------------------------');
      if (game.undoRequest.alreadyAsked[username]) game.undoRequest.alreadyAsked[username]++;
      else game.undoRequest.alreadyAsked[username] = 1;
      if (game.undoRequest.alreadyAsked[username] && game.undoRequest.alreadyAsked[username] > constants.maxNumberOfUndoRequests) {
        if (isBidding) socket.binary(false).emit('disableUndoBidButton');
        else socket.binary(false).emit('disableUndoPlayButton');
        socket.binary(false).emit('displayFlashMessage', {msg: `You are only allowed to ask for an undo ${constants.maxNumberOfUndoRequests} times per ${isBidding ? 'bidding' : 'playing'} round.`, type: 'danger', duration: isBidding ? -1 : constants.playingFlashMessageDuration, isDuringPlaying: !isBidding});
        return false;
      }
      return true;
    } catch{}
  }
  //#endregion
});
//#endregion
//#region MongoDB Functions
async function createGameIncompleteDocumentInMongoDB(game) {
  console.log('createGameIncompleteDocumentInMongoDB----------------------------------------------------');
  if (game === undefined || game === null) return;
  try {
    //#region Create ObjToUse and Get SortedUsernames
    const sortedUsernames = Object.values(game.seating).sort(sortAlphabetically);
    const objToUse = {
      hasSentIsAllowedToPlay: game.hasSentIsAllowedToPlay,
      isGameOver: game.isGameOver,
      users: game.users,
      usersReadyToContinue: game.usersReadyToContinue,
      originalSocketIds: game.originalSocketIds,
      userObjs: game.userObjs,
      seating: game.seating,
      deals: game.deals,
      name: game.name,
      gameState: game.gameState,
      room: game.room,
      gameRoundEndingScores: game.gameRoundEndingScores,
      hasMadeBid: game.hasMadeBid,
      undoRequest: game.undoRequest,
      usernames: sortedUsernames,
      pencilInStart: game.pencilInStart,
      roundWinSounds: game.roundWinSounds,
      points: game.points,
      startDate: Date.now(),
    };
    //#endregion
    const foundGame = await findGameIncomplete(sortedUsernames);
    if (foundGame) {
      try {
        await GameIncomplete.updateOne({
          usernames: sortedUsernames,
        }, objToUse);
      } catch (error) {
        console.log('error updating existing gameincomplete------------------------------------------------');
        console.log(error);
      }
      return;
    }
    const createdGame = await GameIncomplete.create(objToUse);
    return createdGame;
  }
  catch (err) {
    console.log('error createGameDocumentInMongoDB------------------------------------------------');
    console.log(err)
  }
}
async function findGameIncomplete(usernames) {
  try {
    if (usernames === undefined || usernames === null) return;
    usernames = usernames.sort(sortAlphabetically);

    const foundGame = await GameIncomplete.findOne({usernames: usernames})
    return foundGame;
  } catch (error) {
    console.error('error =', error);
  }
}
async function createGameDocumentInMongoDB(game, dealIds, players, deletedGame) {
  console.log('createGameDocumentInMongoDB------------------------------------------------');
  if (dealIds === undefined || dealIds === null || game === undefined || game === null || players === undefined || players === null) return;
  try {
    const createdGame = await Game.create({
      deals: dealIds,
      room: game.room,
      gameRoundEndingScores: game.gameRoundEndingScores,
      players,
      points: game.points,
      startDate: deletedGame ? deletedGame.startDate : -1,
      completionDate: Date.now(),
    });
    return createdGame._id;
  } catch (error) {
    console.log('error archiving game------------------------------------------------');
    console.log(error);
  }
}
function sortAlphabetically(a, b) {
  try {
    for (let i = 0; i < a.length; i++) {
      let charToUseForA = a[i];
      let charToUseForB = b[i];
      if (!a[i]) charToUseForA = '';
      if (!b[i]) charToUseForB = '';
      if (charToUseForA > charToUseForB) return 1;
      else if (charToUseForA < charToUseForB) return -1;
      if (a.length < b.length && i === a.length - 1) return -1;
    }
  } catch (error) {
    console.error('error =', error);
  }
}
async function saveGameIncompleteBidding(game, shouldSaveState = false) {
  try {
    console.log('saveGameIncompleteBidding----------------------------------------------------');
    let objToUse;
    if (shouldSaveState) objToUse = {
      hasMadeBid: game.hasMadeBid,
      undoRequest: game.undoRequest,
      deals: game.deals,
      gameState: game.gameState,
      points: game.points,
    };
    else objToUse = {
      hasMadeBid: game.hasMadeBid,
      undoRequest: game.undoRequest,
      deals: game.deals,
      points: game.points,
    };

    if (game === undefined || game === null) return;
    try {
      await GameIncomplete.updateOne({
        name: game.name, 
        seating: {
          north: game.seating.north, 
          south: game.seating.south,
          east: game.seating.east,
          west: game.seating.west,
        },
      }, objToUse);
    } catch (error) {
      console.log('Error Saving GameIncomplete Bidding------------------------------------------------');
      console.error('error =', error);
    }
  } catch (error) {
    console.error('error =', error);
  }
}
async function saveGameIncompletePlaying(game) {
  console.log('saveGameIncompletePlaying----------------------------------------------------');
  if (game === undefined || game === null) return;
  try {
    await GameIncomplete.updateOne({
      name: game.name, 
      seating: {
        north: game.seating.north, 
        south: game.seating.south,
        east: game.seating.east,
        west: game.seating.west,
      },
    }, {
      undoRequest: game.undoRequest,
      deals: game.deals,
      gameState: game.gameState,
      points: game.points,
    });
  } catch (error) {
    console.log('Error Saving GameIncomplete Playing------------------------------------------------');
    console.error('error =', error);
  }
}  
async function saveGameAtDealComplete(game) {
  try {
    if (game === undefined || game === null) return;
    if (game.isGameOver) {
      try {
        const deletedGame = await GameIncomplete.findOneAndDelete({
          name: game.name, 
          seating: {
            north: game.seating.north, 
            south: game.seating.south,
            east: game.seating.east,
            west: game.seating.west,
          },
        });
        await archiveGameAndDeals(game, deletedGame);
      } catch (error) {
        console.log('Error Moving GameIncomplete To GameComplete------------------------------------------------');
        console.log(error);
      }
    }
    else {
      try {
        await GameIncomplete.updateOne({
          name: game.name, 
          seating: {
            north: game.seating.north, 
            south: game.seating.south,
            east: game.seating.east,
            west: game.seating.west,
          },
        }, {
          undoRequest: game.undoRequest,
          deals: game.deals,
          isGameOver: game.isGameOver,
          gameRoundEndingScores: game.gameRoundEndingScores,
          points: game.points,
        });
      } catch (error) {
        console.log('Error Saving GameIncomplete At Update Game DealComplete------------------------------------------------');
        console.log(error);
      }
    }
  } catch (error) {
    console.error('error =', error);
  }
}
async function archiveGameAndDeals(game, deletedGame) {
  if (game === undefined || game === null || game.sendDealComplete === true) return;
  game.sendDealComplete = true;
  try {
    const {dealIds, players} = await saveDeals(game);
    const createdGameId = await createGameDocumentInMongoDB(game, dealIds, players, deletedGame);
    await addStatsToUser(game);
  } catch (error) {
    console.log('error at archiveGameAndDeals ------------------------------------------------');
    console.log(error);
  }
}
async function saveDeals(game) {
  try {
    //#region Generate playersList
    const players = [];
    for (const direction in game.seating) {
      if (Object.hasOwnProperty.call(game.seating, direction)) {
        const username = game.seating[direction];
        const userObj = await User.findOne({username});
        players.push(userObj._id);
      }
    }
    //#endregion

    const dealIds = [];
    for (let i = 0; i < game.deals.length; i++) {
      const deal = game.deals[i];
      try {
        const dealerId = await User.findOne({username: deal.dealer});
        const declarerId = await User.findOne({username: deal.declarer});
        const createdDeal = await Deal.create({
          players,
          cardPlayOrder: deal.cardPlayOrder,
          hands: deal.hands,
          roundWinners:deal.roundWinners,
          declarer: declarerId,
          dealer: dealerId,
          bids: deal.bids,
          contract: deal.contract,
          northSouth: deal.northSouth,
          eastWest: deal.eastWest,
          redealCount: deal.redealCount,
          dealSummary: deal.dealSummary,
          doubleValue: deal.doubleValue,
        });
        dealIds.push(createdDeal._id);
      } catch (error) {
        console.log('error saving Deal------------------------------------------------');
        console.error('error =', error);
      }
      
    }
    return {dealIds, players};
  } catch (error) {
    console.error('error =', error);
  }
}
async function addStatsToUser(game) {
  console.log('addStatsToUser------------------------------------------------');
  for (const direction in game.seating) {
    if (Object.hasOwnProperty.call(game.seating, direction)) {
      const username = game.seating[direction];
      const distribution = game.points[username].distributionPoints.reduce((sum, num) => sum + num);
      const highCard = game.points[username].highCardPoints.reduce((sum, num) => sum + num);
      const {highestCombinedHighCard, highestCombinedDistribution} = getHighestCombinedHand(game, username);
      const highestHighCard = Math.max(...game.points[username].highCardPoints);
      const highestDistribution = Math.max(...game.points[username].distributionPoints);
      const wonGame = gameUtils.getWonGame(game, username);

      const {dealsDoubled, dealsWonDoubled} = gameUtils.getGameDoubledByUser(game, username);
      const {dealsPlayed, dealsPlayedAsDeclarer, dealsWonAsDeclarer, dealsWonAsDefense, dealsPlayedAsDefense, dealsWon} = gameUtils.getDealStats(game, username);


      console.log('username =', username);
      // console.log('wonGame =', wonGame);
      // console.log('dealsDoubled =', dealsDoubled);
      // console.log('dealsWonDoubled =', dealsWonDoubled);
      // console.log('distribution =', distribution);
      // console.log('highCard =', highCard);
      // console.log('dealsPlayedAsDefense =', dealsPlayedAsDefense);
      console.log('dealsWonAsDefense =', dealsWonAsDefense);
      // console.log('dealsWon =', dealsWon);
      // console.log('dealsWonAsDeclarer =', dealsWonAsDeclarer);
      // console.log('dealsPlayedAsDeclarer =', dealsPlayedAsDeclarer);
      // console.log('game.points =', game.points);
      // console.log('highestCombinedHighCard =', highestCombinedHighCard);
      // console.log('highestCombinedDistribution =', highestCombinedDistribution);
      
      await User.updateOne({
        username,
      }, {
          $inc: {"stats.totalPoints.distribution": distribution ? distribution : 0,
          "stats.totalPoints.highCard": highCard ? highCard : 0,
          "stats.gamesPlayed": 1,
          "stats.gamesWon": wonGame === 0 || wonGame === 1 ? wonGame : 0,
          "stats.ties": wonGame === -1 ? 1 : 0,
          "stats.dealsDoubled": dealsDoubled ? dealsDoubled : 0,
          "stats.dealsWonDoubled": dealsWonDoubled ? dealsWonDoubled : 0,
          "stats.dealsPlayed": dealsPlayed ? dealsPlayed : 0,
          "stats.dealsPlayedAsDeclarer": dealsPlayedAsDeclarer ? dealsPlayedAsDeclarer : 0,
          "stats.dealsPlayedAsDefense": dealsPlayedAsDefense ? dealsPlayedAsDefense : 0,
          "stats.dealsWon": dealsWon ? dealsWon : 0,
          "stats.dealsWonAsDeclarer": dealsWonAsDeclarer ? dealsWonAsDeclarer : 0,
          "stats.dealsWonAsDefense": dealsWonAsDefense ? dealsWonAsDefense : 0,
        },
        $max: {
          "stats.maximums.highCard": highestHighCard ? highestHighCard : 0,
          "stats.maximums.distribution": highestDistribution ? highestDistribution : 0,
          "stats.maximums.combined.highCard": highestCombinedHighCard ? highestCombinedHighCard : 0,
          "stats.maximums.combined.distribution": highestCombinedDistribution ? highestCombinedDistribution : 0,
        }
      })
    }
  }
}
function getHighestCombinedHand(game, username) {
  try {
    const pointsObj = game.points[username];
    let highest = 0, highestCombinedHighCard = 0, highestCombinedDistribution = 0;
    for (let i = 0; i < pointsObj.highCardPoints.length; i++) {
      const highCardPointValue = pointsObj.highCardPoints[i];
      const distributionPointValue = pointsObj.distributionPoints[i];
      temp = highCardPointValue + distributionPointValue;
      if (temp > highest) {
        highest= temp;
        highestCombinedDistribution = distributionPointValue;
        highestCombinedHighCard = highCardPointValue;
      }
    }
    return {highestCombinedHighCard, highestCombinedDistribution};
  } catch (error) {
    console.log('error getHighestCombinedHand------------------------------------------------', error);
  }
}
//#endregion
//#region Functions
function checkUserHasBid(username, bids){
  console.log('checkUserHasBid----------------------------------------------------');
  try {
    if (username === undefined || username === null || bids === undefined || bids === null || bids.length === 0) return false;
    for (let i = 0; i < bids.length; i++) {
      const bidArray = bids[i];
      if (bidArray[0] === username) return true;
    }
    return false;
  } catch (error) {
    console.error('error =', error);
  }
}
function checkUserHasPlayedCard(game, username, cardPlayOrder) {
  try {
    console.log('checkUserHasPlayedCard----------------------------------------------------');
    if (username === undefined || username === null || cardPlayOrder === undefined || cardPlayOrder === null) return false;
    const declarer = gameUtils.getDeclarer(game);
    const exposedHandName = gameUtils.getExposedHandName(game);
    for(let i = cardPlayOrder.length - 1; i >= 0; i--) {
      const cardAsNumber = cardPlayOrder[i];
      if (username === declarer) {
        if (gameUtils.usersHandContainsCard(game, cardAsNumber, username) || gameUtils.usersHandContainsCard(game, cardAsNumber, exposedHandName)) return cardAsNumber;
      }
      else {
        if (gameUtils.usersHandContainsCard(game, cardAsNumber, username)) return cardAsNumber;
      }
    }
    return false;
  } catch (error) {
    console.error('error =', error);
  }
}
function convertToBoolean(string) {
  try {
    console.log('convertToBoolean----------------------------------------------------');
    console.log('string =', string);
    if (string === undefined || string === null || typeof string !== 'string') return null;
    if (string.toLowerCase() === 'true') return true;
    if (string.toLowerCase() === 'false') return false;
    if (string.toLowerCase() === "undefined" || string.toLowerCase() === "null") return null;
    return string;
  } catch (error) {
    console.error('error =', error);
  }
}
function getIsValidBid(game, bid, username) {
  try {
    console.log('getIsValidBid----------------------------------------------------');
    let isValidBidIndex = false;
    if (bid.match(/pass/i)) isValidBidIndex = true;
    else if (bid.match(/double/i)) {
      const bids = gameUtils.getLastDeal(game).bids;
      const isTeamAllowedToDouble = gameUtils.getAllowedToDouble(game, bid, username);
      if (!isTeamAllowedToDouble) return false;
      if (bids.length >= 2 && bids[bids.length - 2][1].match(/double/i) && bids[bids.length -1][1].match(/pass/i)) return false;
      if (bids.length >= 2 && !bids[bids.length - 2][1].match(/pass/i) && !bids[bids.length - 2][1].match(/double/i) && bids[bids.length -1][1].match(/pass/i)) return false;
      if (bids.length >= 2 && bids[bids.length - 2][1].match(/double/i) && bids[bids.length - 1][1].match(/double/i)) return false;
      if (bids.length >= 4 && bids[bids.length - 4][1].match(/double/i) && bids[bids.length - 3][1].match(/pass/i) && bids[bids.length - 2][1].match(/pass/i) && bids[bids.length - 1][1].match(/double/i)) return false;
      if (bids.length >= 4 && bids[bids.length - 4][1].match(/double/i) && bids[bids.length - 3][1].match(/double/i) && bids[bids.length - 2][1].match(/pass/i) && bids[bids.length - 1][1].match(/pass/i)) return false;
      if (bids.length >= 6 && bids[bids.length - 6][1].match(/double/i) && bids[bids.length - 5][1].match(/pass/i) && bids[bids.length - 4][1].match(/pass/i) && bids[bids.length - 3][1].match(/double/i) && bids[bids.length - 2][1].match(/pass/i) && bids[bids.length - 1][1].match(/pass/i)) return false;
      isValidBidIndex = true;
    }
    else {
      isValidBidIndex = true;
      gameUtils.setHasMadeBid(game, gameUtils.getUserSpot(game.seating, username, true), true);
    }
    return isValidBidIndex;
  } catch (error) {
    console.error('error =', error);
  }
}
function checkSeating(room) {
  try {
    console.log('checkSeating----------------------------------------------------');
    //returns seating object if random otherwise true if if all of the seating spots are used by users in the room and each user is only in one spot
    if (JSON.stringify(room.seating) === JSON.stringify(constants.getDefaultSeating())) {
      const usersInRoom = userUtils.getRoomUsers(room.name);
      const usersReadyUserNames = [];
      usersInRoom.forEach(userObj => {
        if (!usersReadyUserNames.includes(userObj.username)) usersReadyUserNames.push(userObj.username);
      });
      return getRandomSeating(usersReadyUserNames);
    }
    const usersInRoom = userUtils.getRoomUsers(room.name);
    const usersReady = [];
    usersInRoom.forEach(userObj => {
      if (!usersReady.includes(userObj.username)) usersReady.push(userObj.username);
    });

    const usersInSpots = [];
    for (const direction in room.seating) {
      if (room.seating.hasOwnProperty(direction)) {
        const usernameToAdd = room.seating[direction];
        if (!direction.match(/random/i) && !usersInSpots.includes(usernameToAdd)) usersInSpots.push(usernameToAdd);
      }
    }
    return checkArraysContainSameValues(usersInSpots, usersReady);
  } catch (error) {
    console.error('error =', error);
  }
}
function checkScoring (room) {
  try {
    console.log('checkScoring----------------------------------------------------');
    if (room === undefined || room === null) return false;
    if (typeof room.northSouthAbove !== 'number' || room.northSouthAbove < 0 || room.northSouthAbove % 10 !== 0) return false;
    if (typeof room.northSouthBelow !== 'number' || room.northSouthBelow < 0 || room.northSouthBelow % 10 !== 0) return false;
    if (typeof room.northSouthVulnerable !== 'boolean') return false;
    if (typeof room.eastWestAbove !== 'number' || room.eastWestAbove < 0 || room.eastWestAbove % 10 !== 0) return false;
    if (typeof room.eastWestBelow !== 'number' || room.eastWestBelow < 0 || room.eastWestBelow % 10 !== 0) return false;
    if (typeof room.eastWestVulnerable !== 'boolean') return false;
    return true;
  } catch (error) {
    console.error('error =', error);
  }
}
function checkArraysContainSameValues(array1, array2) {
  try {
    console.log('checkArraysContainSameValues----------------------------------------------------');
    const userObj = {};
    if (array1.length !== array2.length) return false;
    for (let i = 0; i < array1.length; i++) {
      const itemInArray1 = array1[i];
      if (!array2.includes(itemInArray1)) {
        return false;
      }
      //check if item is in the array once and only once
      if (userObj[itemInArray1] && userObj[itemInArray1] === 1) {
        return false;
      } else {
        userObj[itemInArray1] = 1;
      }
    }
    return true;
  } catch (error) {
    console.error('error =', error);
  }
}
function getRandomSeating(names) {
  try {
    console.log('getRandomSeating----------------------------------------------------');
    const shuffledNames = gameUtils.shuffle(names);
    return {
      north: shuffledNames[0],
      south: shuffledNames[1],
      east: shuffledNames[2],
      west: shuffledNames[3],
    }
  } catch (error) {
    console.error('error =', error);
  }
}
function formatMessage(username, text) {
  try {
      return {
          username,
          text,
      };
  } catch (error) {
      console.error('error =', error);
    }
}
//#endregion
//#region Class Extensions
String.prototype.capitalize = function () {
  return this.split(" ")
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(" ");
};
Object.size = function(obj) {
  var size = 0, key;
  for (key in obj) {
      if (obj.hasOwnProperty(key)) size++;
  }
  return size;
};
//#endregion


