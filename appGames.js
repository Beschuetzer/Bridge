//Note: These are all of the function that the server uses to process game objects
//I chose to write them as functions, because, at the time, I didn't want to take the time to learn Object-Oriented JS.  A decision I regret...
//app.js calls them by calling gameUtils.functionName(gameObj, ...params);

//#region Initialization
const userUtils = require('./appUsers');
const constants = require('./appConstants');
const games = {};
const gamesInSession = [];
const sortOrders = {
    Ascending: "Ascending",
    Descending: "Descending",
    AscendingAlternatingColors: "AscendingAlternatingColors",
    DescendingAlternatingColors: "DescendingAlternatingColors",
};

//#endregion
//#region Functions
function createNewGame(room) {
    try {
        console.log('game.js - createNewGame---------------------------------------------');
        const game = constants.getNewGame(room);
        setUsersInGame(room.name);
        games[game.name] = game;
        gamesInSession.push(game.name);
        return game;
    } catch (error) {
        console.error('error =', error);
    }
}
function getHandsObj() {
    try {
        console.log('game.js - getHandsObj---------------------------------------------');
        const cards = generateArraySeriesNonInclusive(52);
        const hands = deal(cards, 13);
        const handsObj = {
            north: hands[0],
            south: hands[1],
            east: hands[2],
            west: hands[3],
        };
        return handsObj;
    } catch (error) {
        console.error('error =', error);
    }
}
function generateArraySeriesNonInclusive(number) {
    try {
        console.log('game.js - generateArraySeriesNonInclusive---------------------------------------------');
        const array = [];
        for (let i = 0; i < number; i++) {
        array.push(i);
        }
        return array;
    } catch (error) {
        console.error('error =', error);
    }
}
function deal(cards, cardsPerPlayer) {
    try {
        console.log('game.js - deal---------------------------------------------');
        const hands = [];
        hand = shuffle(cards);
        for (let player = 0; player < 4; player++) {
        const hand = getHand(cards.splice(0, cardsPerPlayer));
        hands.push(hand);
        }
        return hands;
    } catch (error) {
        console.error('error =', error);
    }
}
function getHand(hand) {
    try {
        console.log('game.js - getHand---------------------------------------------');
        let sorted = [];
        let clubs = [];
        let diamonds = [];
        let hearts = [];
        let spades = [];
        for (let i = 0; i < hand.length; i++) {
        const card = hand[i];
        if (card >= 0 && card <= 12) {
            clubs.push(card);
        } else if (card >= 13 && card <= 25) {
            diamonds.push(card);
        } else if (card >= 26 && card <= 38) {
            hearts.push(card);
        } else if (card >= 39 && card <= 51) {
            spades.push(card);
        }
        }
        clubs.sort(function (a, b) {
            return b - a;
        });
        diamonds.sort(function (a, b) {
            return b - a;
        });
        hearts.sort(function (a, b) {
            return b - a;
        });
        spades.sort(function (a, b) {
            return b - a;
        });
        // if (spades.length > 0) {
            sorted.push(spades);
        // }
        // if (hearts.length > 0) {
            sorted.push(hearts);
        // }
        // if (clubs.length > 0) {
            sorted.push(clubs);
        // }
        // if (diamonds.length > 0) {
            sorted.push(diamonds);
        // }
        return sorted;
    } catch (error) {
        console.error('error =', error);
    }
}
//#region Bidding Functions
function setUsersInGame(roomName) {
    try {
        console.log('game.js - setUsersInGame---------------------------------------------');
        // console.log('setUsers-----------------------------------');
        if (!roomName) return null;
        const usersInRoom = userUtils.getRoomUsers(roomName);
        const game = getGame(roomName);
        if (!usersInRoom || !game) return null;
        for (let i = 0; i < usersInRoom.length; i++) {
            const userObj = usersInRoom[i];
            game.users[userObj.username] = userObj.socketId;
        }
        game.room.users = null;
        game.room.usersWhoMadeSeatingChoice = null;
        game.room.usersWhoWantRandomSeating = null;
        game.room.usersReady = null;
        game.room.length = null;
        return true;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUsersHand(game, username) {
    try {
        console.log('game.js - getUsersHand---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal || lastDeal.hands === undefined || lastDeal.hands === null || !username) return null;
        const handToReturn = lastDeal.hands[username];
        const playedCards = getPlayedCards(game);
        if (!handToReturn || !playedCards) return null;
        return handToReturn.filter((card) => !playedCards.includes(card));
    } catch (error) {
        console.error('error =', error);
    }
}
function getHandForSocketID(game, socketId) {
    try {
        console.log('game.js - getHandForSocketID---------------------------------------------');
        // console.log('getHandForSocketID----------------------------------');
        let username = null;
        for (const usernameInGame in game.originalSocketIds) {
            if (game.originalSocketIds.hasOwnProperty(usernameInGame)) {
                const originalSocketId = game.originalSocketIds[usernameInGame];
                if (socketId === originalSocketId) username = usernameInGame;
            }
        }

        if (!username) {
            for (const usernameInGame in game.users) {
                if (game.users.hasOwnProperty(usernameInGame)) {
                    const currentSocketId = game.users[usernameInGame];
                    if (socketId === currentSocketId ) username = usernameInGame;
                }
            }
        }
        return getUsersHand(game, username);
    } catch (error) {
        console.error('error =', error);
    }
}
function getPartnersName(game, username) {
    try {
        console.log('game.js - getPartnersName---------------------------------------------');
        if (game === undefined || game === null || username === undefined || username === null) return null;
        const userSpot = getUserSpot(game, username);
        if (userSpot.toLowerCase() === 'north') return game.seating.south;
        if (userSpot.toLowerCase() === 'south') return game.seating.north;
        if (userSpot.toLowerCase() === 'east') return game.seating.west;
        if (userSpot.toLowerCase() === 'west') return game.seating.east;
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getAllowedToDouble(game, bid, username) {
    try {
        console.log('game.js - getAllowedToDouble---------------------------------------------');
        if (game === undefined || game === null || bid === undefined || bid === null || username === undefined || username === null) return false;
        // console.log('getAllowedToDouble------------------------------------------');
        const bidderDirectionOriginal = getUserSpot(game.seating, username, true);
        const lastDeal = getLastDeal(game);

        for (let i = 0; i < lastDeal.bids.length; i++) {
            if (game.hasMadeBid.northSouth === true && game.hasMadeBid.eastWest === true) return true;
            const bidInLoop = lastDeal.bids[i];
            if (isActualBid(bidInLoop)) {
                const biddersSpot = getUserSpot(game.seating, bidInLoop[0], true);
                if (biddersSpot.toLowerCase() === 'north' || biddersSpot.toLowerCase() === 'south') {
                    game.hasMadeBid.northSouth = true;
                    if (bidderDirectionOriginal.toLowerCase() === 'east' || bidderDirectionOriginal.toLowerCase() === 'west') return true;
                } 
                if (biddersSpot.toLowerCase() === 'east' || biddersSpot.toLowerCase() === 'west') {
                    game.hasMadeBid.eastWest = true;
                    if (bidderDirectionOriginal.toLowerCase() === 'north' || bidderDirectionOriginal.toLowerCase() === 'south') return true;
                } 
            }
        }

        console.log('1------------------------------------------------');
        const bidsSinceLastBid = getBidsPastLastActualBid(lastDeal.bids);
        let doubleCount = 0;
        for (let i = 0; i < bidsSinceLastBid.length; i++) {
            const bidToCheck = bidsSinceLastBid[i];
            if (bidToCheck[1].match(/double/)) doubleCount++;
        }
        if (doubleCount <= 1) return true;
        return false;
    } catch (error) {
        console.error('error =', error);
    }
}
function setHasMadeBid(game, direction, value) {
    try {
        console.log('game.js - setHasMadeBid---------------------------------------------');
        if (direction === undefined || direction === null || value === undefined || value === null) return;
        if (direction.toLowerCase() === 'north' || direction.toLowerCase() === 'south') {
            game.hasMadeBid.northSouth = true;
        } 
        if (direction.toLowerCase() === 'east' || direction.toLowerCase() === 'west') {
            game.hasMadeBid.eastWest = true;
        } 
    } catch (error) {
        console.error('error =', error);
    }
}
function isActualBid(bid) {
    try {
        console.log('game.js - isActualBid---------------------------------------------');
        if (bid === undefined || bid === null) return false;
        return !bid[1].match(/pass/i) && !bid[1].match(/double/i);
    } catch (error) {
        console.error('error =', error);
    }
}
function getBidsPastLastActualBid(bids) {
    try {
        console.log('game.js - getBidsPastLastActualBid---------------------------------------------');
        if (bids === undefined || bids === null) return [];
        let lastIndex = -1;
        for (let i = 0; i < bids.length; i++) {
            const bid = bids[i];
            if (isActualBid(bid)) lastIndex = i;
        }
        if (lastIndex !== -1) return bids.slice(lastIndex);
        return [];
    } catch (error) {
        console.error('error =', error);
    }
}
function getNextDealer(game) {
    try {
        console.log('game.js - getNextDealer---------------------------------------------');
        const dealer = getDealer(game);
        let dealerSpot;
        if (!dealer) return null;
        for (const key in game.seating) {
            if (game.seating.hasOwnProperty(key)) {
                const user = game.seating[key];
                if (user === dealer) {
                    dealerSpot = key;
                    break;
                }
            }
        }
        console.log('dealerSpot =', dealerSpot);
        if (dealerSpot.toLowerCase() === "north") return game.seating.east;
        else if (dealerSpot.toLowerCase() === "east") return game.seating.south;
        else if (dealerSpot.toLowerCase() === "south") return game.seating.west;
        else if (dealerSpot.toLowerCase() === "west") return game.seating.north;
    } catch (error) {
        console.error('error =', error);
    }
}  
function getDealer(game) {
    try {
        console.log('game.js - getDealer---------------------------------------------');
        if (game === undefined || game === null) return;
        const lastDeal = getLastDeal(game.name);
        if (lastDeal === undefined || lastDeal === null) return '';
        return lastDeal.dealer;
    } catch (error) {
        console.error('error =', error);
    }
}
function getDeal(game, index) {
    try {
        console.log('game.js - getDeal---------------------------------------------');
        if (game.deals) {
            if (index < 0) {
                return game.deals[game.deals.length + index];
            }
            else if (index >= 0 && index <= game.deals.length - 1) {
                return game.deals[index];
            }
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getLastDeal(game) {
    try {
        console.log('game.js - getLastDeal---------------------------------------------');
        if (!game) return null;
        if (typeof game === 'string') {
            gameObj = getGame(game);
            if (!gameObj) return;
            return gameObj.deals[gameObj.deals.length - 1];
        }
        return game.deals[game.deals.length - 1];
    } catch (error) {
        console.error('error =', error);
    }
}
function getLastBid(game) {
    try {
        console.log('game.js - getLastBid---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal || !lastDeal.bids) return null;
        return lastDeal.bids[lastDeal.bids.length - 1];
    } catch (error) {
        console.error('error =', error);
    }
}
function getLastContractBid(game) {
    try {
        console.log('game.js - getLastContractBid---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        let lastContractBid = -1;
        if (!lastDeal) return null;
        if (!lastDeal || !lastDeal.length === 0) return -1;
        for (let i = 0; i < lastDeal.bids.length; i++) {
            const bid = lastDeal.bids[i];
            if (!bid[1].match(/pass/i) && !bid[1].match(/double/i)) lastContractBid = bid[1];
        }
        return lastContractBid;
    } catch (error) {
        console.error('error =', error);
    }
}
function getBidFromDeal(game, bidindex = -1, dealIndex = -1) {
    try {
        console.log('game.js - getBidFromDeal---------------------------------------------');
        const deal = getDeal(game, dealIndex);
        if (!deal) return null;
        if (game.deals) {
            if (bidindex < 0) {
                return deal.bids[deal.bids.length + bidindex]
            }
            else if (bidindex >= 0 && bidindex <= game.deals.length - 1) {
                return deal.bids[bidindex];
            }
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function makeBid(game, bid) {
    try {
        console.log('game.js - makeBid---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        const dealer = getDealer(game);
        const nextBidder = getNextBidder(game);
        if (!bid || !lastDeal || !dealer || !nextBidder) return null;
        if (nextBidder === dealer) {
            lastDeal.bids.push([dealer, bid]);
        }
        else {
            lastDeal.bids.push([nextBidder, bid]);
        }
        return lastDeal.bids;
    } catch (error) {
        console.error('error =', error);
    }
}
function getNextBidder(game) {
    try {
        console.log('game.js - getNextBidder---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        if (game.room.dealer !== null && game.deals.length === 1 && lastDeal.bids.length === 0) return game.room.dealer;

        const dealCount = game.deals.length;
        const bidCount = lastDeal.bids.length;
        if (bidCount >= 0) {
            let modulo = (bidCount + lastDeal.redealCount + dealCount - 1) % 4;
            if (game.pencilInStart) modulo = (bidCount + lastDeal.redealCount + dealCount - 1 + game.pencilInStart) % 4;
            console.log('bidCount =', bidCount);
            console.log('lastDeal.redealCount =', lastDeal.redealCount);
            console.log('dealCount =', dealCount);
            console.log('modulo =', modulo);

            if (modulo === 0) return getUserInSpot(game, "north");
            if (modulo === 1) return getUserInSpot(game, "east");
            if (modulo === 2) return getUserInSpot(game, "south");
            if (modulo === 3) return getUserInSpot(game, "west");
        }
        else {
            return null;
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function getDeclarer(game){
    try {
        console.log('game.js - getDeclarer---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        return lastDeal.declarer;
    } catch (error) {
        console.error('error =', error);
    }
}
function getDeclarersSpot(game) {
    try {
        console.log('game.js - getDeclarersSpot---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (lastDeal) return getUserSpot(game, lastDeal.declarer);
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getExposedHandSpot(game) {
    try {
        console.log('game.js - getExposedHandSpot---------------------------------------------');
        const declarersSpot = getDeclarersSpot(game);
        if (!declarersSpot) return null;
        if (declarersSpot.toLowerCase() === 'north') return 'south';
        if (declarersSpot.toLowerCase() === 'south') return 'north';
        if (declarersSpot.toLowerCase() === 'east') return 'west';
        if (declarersSpot.toLowerCase() === 'west') return 'east';
    } catch (error) {
        console.error('error =', error);
    }
}
function getExposedHandName(game) {
    try {
        console.log('game.js - getExposedHandName---------------------------------------------');
        const exposedHandSpot = getExposedHandSpot(game);
        if (!exposedHandSpot) return null;
        return getUserInSpot(game, exposedHandSpot);
    } catch (error) {
        console.error('error =', error);
    }
}
function setContractAndDeclarer(game) {
    try {
        console.log('game.js - setContractAndDeclarer---------------------------------------------');
        let contract, lastBidder, firstNotrumpBid, firstSpadeBid, firstHeartBid, firstDiamondBid, firstClubBid;
        const lastDeal = getLastDeal(game.name);

        //#region Getting Contract
        for (let i = 0; i < lastDeal.bids.length; i++) {
            const bid = lastDeal.bids[i];
            if (bid[1].toLowerCase() !== 'pass' && !bid[1].match(/double/i)) {
            contract = bid[1];  
            lastBidder = bid[0];
            }
        }
        //#endregion

        //#region Getting Declarer
        const playingTeam = [lastBidder, getPartnersName(game, lastBidder)];

        for (let i = 0; i < lastDeal.bids.length; i++) {
            const bid = lastDeal.bids[i];
            console.log('bid =', bid);
            if (!playingTeam.includes(bid[0])) continue;
            if (!firstNotrumpBid && bid[1].match(/trump/i)) firstNotrumpBid = bid;
            if (!firstSpadeBid && bid[1].match(/spade/i)) firstSpadeBid = bid;
            if (!firstHeartBid && bid[1].match(/heart/i)) firstHeartBid = bid;
            if (!firstDiamondBid && bid[1].match(/diamond/i)) firstDiamondBid = bid;
            if (!firstClubBid && bid[1].match(/club/i)) firstClubBid = bid;
        }

        let declarer;
        if (contract.match(/trump/i)) declarer = firstNotrumpBid[0];
        if (contract.match(/spade/i)) declarer = firstSpadeBid[0];
        if (contract.match(/heart/i)) declarer = firstHeartBid[0];
        if (contract.match(/diamond/i)) declarer = firstDiamondBid[0];
        if (contract.match(/club/i)) declarer = firstClubBid[0];
        //#endregion


        lastDeal.declarer = declarer;
        lastDeal.contract = contract;
        return [contract, declarer];
    } catch (error) {
        console.error('error =', error);
    }
}
function getContract(game) {
    try {
        console.log('game.js - getContract---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (lastDeal) return lastDeal.contract;
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getDeclarersHand (game) {
    try {
        console.log('game.js - getDeclarersHand---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal || !lastDeal.hands) return null;
        return lastDeal.hands[lastDeal.declarer];
    } catch (error) {
        console.error('error =', error);
    }
}
function getDeclarersHandRemaining(game) {
    try {
        console.log('game.js - getDeclarersHandRemaining---------------------------------------------');
        const lastDeal = getLastDeal(game);
        if (game === undefined || game === null || lastDeal === undefined || lastDeal === null) return;
        const declarersHand = getDeclarersHand(game);
        return declarersHand.flatten(3).filter(card => !lastDeal.cardPlayOrder.includes(card));
    } catch (error) {
        console.error('error =', error);
    }
}
function getPartnersHand(game, username) {
    try {
        console.log('game.js - getPartnersHand---------------------------------------------');
        if (!username) return null;
        const lastDeal = getLastDeal(game.name);
        if (lastDeal) {
            const spot = getUserSpot(game, username);
            if (spot) {
                let partnerName;
                switch (spot.toLowerCase()) {
                    case 'north':
                        partnerName = getUserInSpot(game, 'south');
                        break;
                    case 'south':
                        partnerName = getUserInSpot(game, 'north');
                        break;
                    case 'east':
                        partnerName = getUserInSpot(game, 'west');
                        break;
                    case 'west':
                        partnerName = getUserInSpot(game, 'east');
                        break;
                }
                if (partnerName) return getUsersHand(game, partnerName);
            }
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUserInSpot(game, spot) {
    try {
        console.log('game.js - getUserInSpot---------------------------------------------');
        if (!spot) return null;
        if (spot.toLowerCase() !== "north" && spot.toLowerCase() !== "south" && spot.toLowerCase() !== "east" && spot.toLowerCase() !== "west") {
            return null; 
        }
        if (spot.toLowerCase() === "north") return game.seating.north;
        if (spot.toLowerCase() === "south") return game.seating.south;
        if (spot.toLowerCase() === "east") return game.seating.east;
        if (spot.toLowerCase() === "west") return game.seating.west;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUserSpot (game, username, isOnlySeating = false) {
    try {
        console.log('game.js - getUserSpot---------------------------------------------');
        if (!username) return null;
        const seating = isOnlySeating ? game : game.seating;
        for (const key in seating) {
            if (seating.hasOwnProperty(key)) {
                const userInSeating = seating[key];
                if(userInSeating === username) {
                    return key;
                }
            }
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function isbiddingFinished(game) {
    try {
        console.log('game.js - isbiddingFinished---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        if (lastDeal.bids.length < 3) return false;
        
        //return false if bid are only double or pass
        let isValid = false;
        for (let i = 0; i < lastDeal.bids.length; i++) {
            const bid = lastDeal.bids[i];
            if (!bid[1].match(/double/i) && !bid[1].match(/pass/i)) isValid = true;
        }

        return isValid && getBidFromDeal(game, -1)[1].toLowerCase() === "pass" && getBidFromDeal(game, -2)[1].toLowerCase() === "pass" && getBidFromDeal(game, -3)[1].toLowerCase() === "pass";
    } catch (error) {
        console.error('error =', error);
    }
}
function dealIsABust(game) {
    try {
        console.log('game.js - dealIsABust---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        if (lastDeal.bids.length < 4) return false;
        for (let i = 0; i < lastDeal.bids.length; i++) {
            const bid = lastDeal.bids[i];
            if (!bid[1].match(/double/i) && !bid[1].match(/pass/i)) return false;
        }

        const p1 = getBidFromDeal(game, -1)[1].match(/pass/i);
        const p2 = getBidFromDeal(game, -2)[1].match(/pass/i);
        const p3 = getBidFromDeal(game, -3)[1].match(/pass/i);
        return !!p3 && !!p2 && !!p1
    } catch (error) {
        console.error('error =', error);
    }
}
function addUser(game, user) {
    try {
        console.log('game.js - addUser---------------------------------------------');
        if(!user) return null;
        game.users.push(user);
    } catch (error) {
        console.error('error =', error);
    }
}
function removeUser(game, username) {
    try {
        console.log('game.js - removeUser---------------------------------------------');
        const index = game.users.findIndex(user => user.username === username);
        if (index) {
            return game.users.splice(index, 1)[0];
        }
        return -1;
    } catch (error) {
        console.error('error =', error);
    }
}
function sortHands(game, hands, cardSortPreferences, suitSortPreferences) {
    try {
        console.log('game.js - sortHands---------------------------------------------');
        let sortedHands = {};
        for (const key in hands) {
            if (hands.hasOwnProperty(key)) {
                const hand = hands[key];
                let tempHand = sortHandBySuitPreference(hand, suitSortPreferences[key]);
                sortedHands[getUserInSpot(game, key)] = sortHandByCardPreference(tempHand, cardSortPreferences[key]);
            }
        }
        return sortedHands;
    } 
    catch (error) {
        console.log('error sorting Hands------------------------------------------------');
        console.error('error =', error);
        return null;
    }
}
function sortHandBySuitPreference(hand, suitSortPreferences){
    try {
        console.log('game.js - sortHandBySuitPreference---------------------------------------------');
        if (!hand || !suitSortPreferences) {
            return null;
        }

        let sorted = [];
        let spades, hearts, diamonds, clubs;
        for (let i = 0; i < hand.length; i++) {
            const suit = hand[i];
            if (suit[0] >= 39 && suit[0] < 52) spades = suit;
            else if (suit[0] >= 26 && suit[0] < 39) hearts = suit;
            else if (suit[0] >= 13 && suit[0] < 26) diamonds = suit;
            else if (suit[0] < 13) clubs = suit;
        }
        
        if (hand.length === 1) sorted[0] = hand[0];    //spades
        else if (hand.length === 2) {
            if (spades) sorted.push(spades);
            if (hearts) sorted.push(hearts);
            if (clubs) sorted.push(clubs);
            if (diamonds) sorted.push(diamonds);
        } 
        else if (hand.length === 3) {
            if (spades && hearts && diamonds) {
                sorted.push(hearts);
                sorted.push(spades);
                sorted.push(diamonds);
            }
            else if (spades && hearts && clubs) {
                sorted.push(spades);
                sorted.push(hearts);
                sorted.push(clubs);
            }
            else if (spades && diamonds && clubs) {
                sorted.push(spades);
                sorted.push(diamonds);
                sorted.push(clubs);
            }
            else if (hearts && diamonds && clubs) {
                sorted.push(hearts);
                sorted.push(clubs);
                sorted.push(diamonds);
            }
        } 
        else if (hand.length === 4) {
            sorted = hand;
        } 
        else return null;

        if (suitSortPreferences === sortOrders.Ascending){
            return sorted.reverse();
        }
        return sorted;
    } catch (error) {
        console.error('error =', error);
    }
}
function sortHandByCardPreference(hand, cardSortPreference){
    try {
        console.log('game.js - sortHandByCardPreference---------------------------------------------');
        if (!hand || !cardSortPreference) {
            return null;
        }
        if (cardSortPreference === sortOrders.Descending) return hand;

        const sorted = [];
        for (let i = 0; i < hand.length; i++) {
            const suit = hand[i];
            if (suit) sorted.push(suit.reverse());
        }
        return sorted; 
    } catch (error) {
        console.error('error =', error);
    }
}
function createNewDeal(game, isFirstDeal = false) {
    try {
        console.log('game.js - createNewDeal---------------------------------------------');
        //#region Initialization
        if (!game)return;
        const lastDeal = getLastDeal(game.name);
        const tryCount = 5;
        let count = 0, handsObj, preferences, sortedHands; 

        while (!sortedHands && count < tryCount) {
            console.log('sortedHand while loop------------------------------------------------');
            handsObj = getHandsObj(game);
            preferences = getSortPreferences(game);
            sortedHands = sortHands(game, handsObj, preferences.cardSortPreferences, preferences.suitSortPreferences);
            count++;
        }
        //#endregion
        //#region Get Scoring Object
        let newScoring = {};
        if (isFirstDeal || lastDeal === undefined || lastDeal === null) {
            newScoring = {
                northSouth: {
                    aboveTheLine: game.room.northSouthAbove,
                    belowTheLine: game.room.northSouthBelow,
                    totalBelowTheLineScore: game.room.northSouthBelow,
                    isVulnerable: game.room.northSouthVulnerable,
                    vulnerableTransitionIndex: game.room.northSouthVulnerable === true ? -1 : null,
                }, 
                eastWest: {
                    aboveTheLine: game.room.eastWestAbove,
                    belowTheLine: game.room.eastWestBelow,
                    totalBelowTheLineScore: game.room.eastWestBelow,
                    isVulnerable: game.room.eastWestVulnerable,
                    vulnerableTransitionIndex: game.room.eastWestVulnerable === true ? -1 : null,
                }, 
            }
            // newScoring = constants.getDefaultScoring();
        }
        else {
            newScoring = {
                northSouth: lastDeal.northSouth,
                eastWest: lastDeal.eastWest,
            } 
        }
        //#endregion
        //#region Getting newDealer
        let newDealerSpot = null;
        if (!lastDeal){
            if (game.room.dealer !== null) {
                newDealer = game.room.dealer;
                newDealerSpot = getUserSpot(game, newDealer);
            }
            else {
            newDealer = getUserInSpot(game, 'north');
            }
        }
        else {
            newDealer = getNextDealer(game);
        }
        //#endregion

        const deal = constants.getNewDeal(sortedHands, newScoring, newDealer);
        if (newDealerSpot && newDealerSpot.toLowerCase() === 'east') game.pencilInStart = 1;
        else if (newDealerSpot && newDealerSpot.toLowerCase() === 'south') game.pencilInStart = 2;
        else if (newDealerSpot && newDealerSpot.toLowerCase() === 'west') game.pencilInStart = 3;
        game.gameState = constants.gameStates.bidding;
        game.hasMadeBid = constants.getNewHasMadeBid();
        if (isFirstDeal) game.deals = [];
        game.deals.push(deal);
    } catch (error) {
        console.error('error =', error);
    }
}
//#endregion
//#region Playing Functions
function getMinMaxOfSuit(cardAsNumber) {
    try {
        console.log('game.js - getMinMaxOfSuit---------------------------------------------');
        let suitMinValue, suitMaxValue;
        if (cardAsNumber >= 0 && cardAsNumber <= 12) {
        suitMinValue = 0;
        suitMaxValue = 12;
        }
        else if (cardAsNumber >= 13 && cardAsNumber <= 25) {
        suitMinValue = 13;
        suitMaxValue = 25;
        }
        else if (cardAsNumber >= 26 && cardAsNumber <= 38) {
        suitMinValue = 26;
        suitMaxValue = 38;
        }
        else if (cardAsNumber >= 39 && cardAsNumber <= 51) {
        suitMinValue = 39;
        suitMaxValue = 51;
        }
        else if (cardAsNumber === null) {
        suitMinValue = 0;
        suitMaxValue = 51;
        }
        return {min: suitMinValue, max: suitMaxValue};
    } catch (error) {
        console.error('error =', error);
    }
}
function getSuitFromNumber(cardAsNumber) {
    try {
        console.log('game.js - getSuitFromNumber---------------------------------------------');
        const lengthOfSuit = 13;
        const suitsArray = [constants.suits.clubs, constants.suits.diamonds, constants.suits.hearts, constants.suits.spades];
        const index = Math.floor(cardAsNumber / lengthOfSuit);
        return suitsArray[index];
    } catch (error) {
        console.error('error =', error);
    }
}
function getNumberOfCardsInSuit(handArray, cardAsNumber) {
    try {
        console.log('game.js - getNumberOfCardsInSuit---------------------------------------------');
        // console.log('getNumberOfCardsInSuit-------------------');
        if (cardAsNumber === undefined || cardAsNumber === null || handArray === undefined || handArray === null) return;
        const suitMinMax = getMinMaxOfSuit(cardAsNumber);
        const flatHand = handArray.flatten(3);
        
        let suitCount = 0;
        for (let i = 0; i < flatHand.length; i++) {
        const cardAsNumberInHand = parseInt(flatHand[i]);
        if (cardAsNumberInHand >= suitMinMax.min && cardAsNumberInHand <= suitMinMax.max ) suitCount++;
        }
        return suitCount;            
    } catch (error) {
        console.error('error =', error);
    }
}
function verifyOtherHandPickedCards(game, usersTurnToPlay, claimingCards, otherHandPickedCards) {
    try {
        console.log('game.js - verifyOtherHandPickedCards---------------------------------------------');
        //#region Getting claimingHand and otherHand
        const lastDeal = getLastDeal(game.name);
        const exposedHand = getExposedHand(game);
        const declarersHand = getDeclarersHand(game);
        let claimingHand = declarersHand;
        let otherHand = exposedHand; 
        if (usersTurnToPlay === 2) {
        claimingHand = exposedHand;
        otherHand = declarersHand;
        }
        //#endregion
        //#region Getting Flat Hands
        const flatOtherHandPickedCards = otherHandPickedCards.flatten(3);
        const flatOtherHand = otherHand.flatten(3).filter(card => !lastDeal.cardPlayOrder.includes(card));
        const flatClaimingCards = claimingCards.flatten(3);
        const flatClaimingHand = claimingHand.flatten(3).filter(card => !lastDeal.cardPlayOrder.includes(card));;

        // console.log('flatOtherHandPickedCards =', flatOtherHandPickedCards);
        // console.log('flatClaimingCards =', flatClaimingCards);
        if (flatOtherHandPickedCards.length !== flatClaimingCards.length) return false;
        //#endregion

        // console.log('flatClaimingHand =', flatClaimingHand);
        //#region Verify that each card in claimingCards is in claimingHand.
        for (let i = 0; i < flatClaimingCards.length; i++) {
        const claimingCard = flatClaimingCards[i];
        console.log('claimingCard =', claimingCard);
        if (!flatClaimingHand.includes(parseInt(claimingCard))) return false;
        }
        //#endregion
        // console.log('flatOtherHandPickedCards =', flatOtherHandPickedCards);
        //#region Verify that each card in otherHandPickedCards is in otherHand
        for (let i = 0; i < flatOtherHandPickedCards.length; i++) {
        const otherHandPickedCard = flatOtherHandPickedCards[i];
        console.log('otherHandPickedCard =', otherHandPickedCard);
        if (!flatOtherHand.includes(parseInt(otherHandPickedCard))) return false;
        }
        //#endregion
        //#region Populating SuitCount objects and Verifiying Minimum Amount Met
        let claimingCardsSuitCounts = {}, otherHandPickedCardsSuitCounts = {}, otherHandSuitCounts = {};
        for (let i = 0; i < flatClaimingCards.length; i++) {
        const claimingCard = flatClaimingCards[i];
        const suitOfCard = getSuitFromNumber(claimingCard);

        if (claimingCardsSuitCounts[suitOfCard] === null || claimingCardsSuitCounts[suitOfCard] === undefined) {
            const numberOfCardsInSuit = getNumberOfCardsInSuit(flatClaimingCards, claimingCard);
            claimingCardsSuitCounts[suitOfCard] = numberOfCardsInSuit;
        }

        if (otherHandPickedCardsSuitCounts[suitOfCard] === null || otherHandPickedCardsSuitCounts[suitOfCard] === undefined) {
            const numberOfCardsInSuit = getNumberOfCardsInSuit(flatOtherHandPickedCards, claimingCard);
            otherHandPickedCardsSuitCounts[suitOfCard] = numberOfCardsInSuit;
        }

        if (otherHandSuitCounts[suitOfCard] === null || otherHandSuitCounts[suitOfCard] === undefined) {
            const numberOfCardsInSuit = getNumberOfCardsInSuit(flatOtherHand, claimingCard);
            otherHandSuitCounts[suitOfCard] = numberOfCardsInSuit;
        }

        let minAmountNeeded = claimingCardsSuitCounts[suitOfCard];
        if (otherHandSuitCounts[suitOfCard] < claimingCardsSuitCounts[suitOfCard]) minAmountNeeded = otherHandSuitCounts[suitOfCard];

        //   console.log('minAmountNeeded =', minAmountNeeded);
        //   console.log('otherHandPickedCardsSuitCounts =', otherHandPickedCardsSuitCounts);
        //   console.log('claimingCardsSuitCounts =', claimingCardsSuitCounts);
        //   console.log('otherHandSuitCounts =', otherHandSuitCounts);

        if (otherHandPickedCardsSuitCounts[suitOfCard] < minAmountNeeded) return {shouldContinue: false, minAmountNeeded, suitMissing: suitOfCard};
        }
        //#endregion
        return {shouldContinue: true, minAmountNeeded: null, suitMissing: null};
    } catch (error) {
        console.error('error =', error);
    }
}
function usersHandContainsCard(game, cardAsNumber, username) {
    try {
        console.log('game.js - usersHandContainsCard---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        const usersHand = getUsersHand(game, username);
        if (!usersHand || !lastDeal) return null;
        for (let i = 0; i < usersHand.length; i++) {
            const suit = usersHand[i];
            for (let j = 0; j < suit.length; j++) {
                const cardAsNumberInHand = suit[j];
                if (cardAsNumber === cardAsNumberInHand) {
                    return true;
                }
            }
        }
        return false;
    } catch (error) {
        console.error('error =', error);
    }
}
function getCurrentPlayer(game) {
    try {
        console.log('game.js - getCurrentPlayer---------------------------------------------');
        //is the current person in the deal who played first (every fourth play in cardsPlayOrder (0,4,8,12,etc))
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        if (lastDeal.cardPlayOrder.length === 0) return getUserInSpot(game, getRotationsAround(getDeclarersSpot(game), 1));
        else if (lastDeal.cardPlayOrder.length % 4 === 0) {
            const roundWinners = getRoundWinners(game);
            if (!roundWinners) return null;
            return roundWinners[roundWinners.length - 1];
        }
        else {
            const nthRound = Math.floor(lastDeal.cardPlayOrder.length / 4) * 4;
            const roundStartCardPlayed =  lastDeal.cardPlayOrder[nthRound];
            const roundStartPlayer = getUserNameWhoHasCard(game, roundStartCardPlayed, lastDeal);
            
            if (!roundStartPlayer) return null;

            const roundStartPlayerSpot = getUserSpot(game, roundStartPlayer);
            const currentPlaySpot = getRotationsAround(roundStartPlayerSpot,  lastDeal.cardPlayOrder.length - (nthRound * 4))
            if (!currentPlaySpot) return null;
            return getUserInSpot(game, currentPlaySpot);
        } 
    } catch (error) {
        console.error('error =', error);
    }
}
function getRotationsAround(roundStartPlayerSpot, rotations) {
    try {
        console.log('game.js - getRotationsAround---------------------------------------------');
        if (typeof roundStartPlayerSpot !== 'string') return null;
        if (rotations < 0) rotations = rotations % 4 + 4;
        if (rotations > 4 ) rotations = rotations % 4;
        const spotRotationOrder = ['north', 'east', 'south', 'west','north', 'east', 'south', 'west']
        if (roundStartPlayerSpot.toLowerCase() === 'north') return spotRotationOrder[rotations]
        else if (roundStartPlayerSpot.toLowerCase() === 'east') return spotRotationOrder[1 + rotations]
        else if (roundStartPlayerSpot.toLowerCase() === 'south') return spotRotationOrder[2 + rotations]
        else if (roundStartPlayerSpot.toLowerCase() === 'west') return spotRotationOrder[3 + rotations]
        else return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getUserNameWhoHasCard(game, cardAsNumber, lastDeal){
    try {
        console.log('game.js - getUserNameWhoHasCard---------------------------------------------');
        lastDeal = (lastDeal == undefined) ? getLastDeal(game.name) : lastDeal;
        if (cardAsNumber === undefined || cardAsNumber === null || !lastDeal) return null;
        for (const username in lastDeal.hands) {
            if (lastDeal.hands.hasOwnProperty(username)) {
                const usersHand = lastDeal.hands[username];
                for (let i = 0; i < usersHand.length; i++) {
                    const suit = usersHand[i];
                    for (let j = 0; j < suit.length; j++) {
                        const cardInHand = suit[j];
                        if (cardInHand === cardAsNumber) return username;
                    }
                }
            }
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function setContract(game, contract) {
    try {
        console.log('game.js - setContract---------------------------------------------');
        if (!contract) return null;
        const lastDeal = getLastDeal(game.name);
        lastDeal.contract = contract;
    } catch (error) {
        console.error('error =', error);
    }
}
function getTrumpSuitFromContract(game) {
    try {
        console.log('game.js - getTrumpSuitFromContract---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        if (lastDeal.contract.toLowerCase().includes('club')) return constants.suits.clubs;
        if (lastDeal.contract.toLowerCase().includes('diamond')) return constants.suits.diamonds;
        if (lastDeal.contract.toLowerCase().includes('heart')) return constants.suits.hearts;
        if (lastDeal.contract.toLowerCase().includes('spade')) return constants.suits.spades;
        if (lastDeal.contract.toLowerCase().includes('trump')) return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function evaluateWinner(game) {
    try {
        console.log('game.js - evaluateWinner---------------------------------------------');
        const playedCards = getLastFourPlayedCards(game);
        if (playedCards.length !== 4) return null;
        const trumpSuit = getTrumpSuitFromContract(game);
        const nameOfCard = constants.cardValuesOrder[playedCards[0]].split(' ');
        const playedSuit = nameOfCard[2];
        let winningValue = playedCards[0];
        let winningSuit = playedSuit;
        for (let i = 1; i < playedCards.length; i++) {
            const cardAsNumber = playedCards[i];
            const cardSuit = getSuitOfCard(cardAsNumber);
            if (trumpSuit === null) {
                if (cardAsNumber > winningValue && cardSuit === playedSuit) {
                    winningValue = cardAsNumber;
                    winningSuit = cardSuit;
                }
            }
            else {
                if (winningSuit.toLowerCase() === trumpSuit.toLowerCase()) {
                    if (cardSuit.toLowerCase() === trumpSuit.toLowerCase() && cardAsNumber > winningValue) {
                        winningValue = cardAsNumber;
                        winningSuit = cardSuit;
                    }
                }
                else{
                    if (cardSuit.toLowerCase() === trumpSuit.toLowerCase()) {
                        winningValue = cardAsNumber;
                        winningSuit = cardSuit;
                    }
                    else if (cardSuit === playedSuit && cardAsNumber > winningValue) {
                        winningValue = cardAsNumber;
                        winningSuit = cardSuit;
                    }
                }
            }
        }
        let playerWhoHasCard = getUserNameWhoHasCard(game, winningValue);
        return playerWhoHasCard;
    } catch (error) {
        console.error('error =', error);
    }
}
function getWinningCard(game, leadCard, followedCard) {
    try {
        if (!game) return null;
        const trumpSuit = getTrumpSuitFromContract(game);
        const leadCardSuit = getSuitFromNumber(leadCard);
        const followedCardSuit = getSuitFromNumber(followedCard);

        if (leadCardSuit === followedCardSuit) {
        if (leadCard > followedCard) return leadCard;
        else return followedCard;
        }
        else {
        if (leadCardSuit === trumpSuit) return leadCard;
        else if (followedCardSuit === trumpSuit) return followedCard;
        else return leadCard;
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function getSuitOfCard(cardAsNumber) {
    try {
        console.log('game.js - getSuitOfCard---------------------------------------------');
        if (cardAsNumber >= 0 && cardAsNumber <= 12) return constants.suits.clubs;
        else if (cardAsNumber >= 13 && cardAsNumber <= 25) return constants.suits.diamonds;
        else if (cardAsNumber >= 26 && cardAsNumber <= 38) return constants.suits.hearts;
        else if (cardAsNumber >= 39 && cardAsNumber <= 51) return constants.suits.spades;
        else return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function getLastFourPlayedCards(game) {
    try {
        console.log('game.js - getLastFourPlayedCards---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        return lastDeal.cardPlayOrder.slice(lastDeal.cardPlayOrder.length - 4);
    } catch (error) {
        console.error('error =', error);
    }
}  
function playCard(game, cardAsNumber) {
    try {
        console.log('game.js - playCard---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        lastDeal.cardPlayOrder.push(cardAsNumber);
        return lastDeal.cardPlayOrder;
    } catch (error) {
        console.error('error =', error);
    }
}
function usersTurnToPlay(game, username) {
    try {
        console.log('game.js - usersTurnToPlay---------------------------------------------');
        //returns 1 if user is playing from hand, 2 if playing from exposed and 0 otherwise
        // console.log('usersTurnToPlay----------------------------------');
        const exposedHandName = getExposedHandName(game);
        const declarersName = getDeclarer(game);
        const handLengths = getHandLengths(game);
        //#region If all the same lengths
        if (handLengths.north === handLengths.east && handLengths.east === handLengths.south && handLengths.south === handLengths.west ) {
            const roundWinners = getRoundWinners(game);
            const lastRoundWinner = roundWinners[roundWinners.length - 1];
            const declarersSpot = getDeclarersSpot(game);
            const spotToGetUserFor = getRotationsAround(declarersSpot, 1);
            const userInSpot = getUserInSpot(game, spotToGetUserFor);

            if (handLengths.north === 13 && username === userInSpot) return 1;
            else if (username === declarersName) {
                if (lastRoundWinner === exposedHandName) return 2;
                else if (lastRoundWinner === declarersName) return 1;
            }
            else if (username == lastRoundWinner) {
                return 1;
            }
            else return 0;
        }
        //#endregion
        //#region Finding the minimum
        let min = 13;
        let minCount = 0
        for (const key in handLengths) {
            if (handLengths.hasOwnProperty(key)) {
            const handLength = handLengths[key];
            if (handLength < min) {
                min = handLength;
                minCount++;
            }
            if (minCount >= 2) break;
            }
        }
        //#endregion
        //#region Getting the indexes for the max values
        const directions = ['north','east','south','west'];
        const maxIndexes = [];
        const handLengthsArray = [handLengths.north, handLengths.east, handLengths.south, handLengths.west];
        
        for (let i = 0; i < handLengthsArray.length; i++) {
            const handLength = handLengthsArray[i];
            if (handLength != min) {
                maxIndexes.push(i);
            }
        }
        //#endregion
        //#region Getting whether contiguous
        let isContiguous = true;
        let gapIndex = 0;
        for (let i = 0; i < maxIndexes.length - 1; i++) {
            const maxIndex = maxIndexes[i];
            if (maxIndex + 1 !== maxIndexes[i+1]) {
            isContiguous = false;
            gapIndex = i+1;
            break;
            }
        }
        //#endregion

        //use the first index if [i]s are contiguous (no gap between) otherwise use the one after the gap
        let userToPlay;
        if (isContiguous) userToPlay = game.seating[directions[maxIndexes[0]]];
        else userToPlay = game.seating[directions[maxIndexes[gapIndex]]];

        //If user refreshes at beginning of new round userToPlay is []
        if (userToPlay === undefined || userToPlay === null ) {
            const roundWinners = getRoundWinners(game);
            if (!roundWinners) return 1;
            userToPlay = roundWinners[roundWinners.length - 1];
        }

        const partnersName = getPartnersName(game, username);
        // console.log('TROUBLESHOOTING---------------------- =');
        // console.log('username =', username);
        // console.log('userToPlay =', userToPlay);
        // console.log('partnersName =', partnersName);
        // console.log('exposedHandName =', exposedHandName);

        if (exposedHandName === partnersName && userToPlay === exposedHandName) return 2;
        else if (username !== exposedHandName && username === userToPlay) return 1;
        else return 0;
    } catch (error) {
        console.error('error =', error);
    }
}
function getPlayedCards(game){
    try {
        console.log('game.js - getPlayedCards---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        return lastDeal.cardPlayOrder;
    } catch (error) {
        console.error('error =', error);
    }
}
function getHandLengths(game){
    try {
        console.log('game.js - getHandLengths---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        const northHand = getUsersHand(game, game.seating.north);
        const southHand = getUsersHand(game, game.seating.south);
        const eastHand = getUsersHand(game, game.seating.east);
        const westHand = getUsersHand(game, game.seating.west);
        if (!northHand || !southHand || !eastHand || !westHand) return null;
        return {
            north: northHand.flatten(3).filter(card => !lastDeal.cardPlayOrder.includes(card)).length,
            south: southHand.flatten(3).filter(card => !lastDeal.cardPlayOrder.includes(card)).length,
            east: eastHand.flatten(3).filter(card => !lastDeal.cardPlayOrder.includes(card)).length,
            west: westHand.flatten(3).filter(card => !lastDeal.cardPlayOrder.includes(card)).length,
        }   
    } catch (error) {
        console.error('error =', error);
    }
}
function getTeamTrickCount(game, spot) {
    try {
        console.log('game.js - getTeamTrickCount---------------------------------------------');
        //returns the number of times the team with the spot given is in roundWinners
        let team;
        if (spot.toLowerCase() === 'north' || spot.toLowerCase() === 'south') {
            team = [game.seating.north, game.seating.south];
        }
        else if (spot.toLowerCase() === 'east' || spot.toLowerCase() === 'west') {
            team = [game.seating.east, game.seating.west];
        }
        
        const roundWinners = getRoundWinners(game);
        let tricks = 0;
        for (let i = 0; i < team.length; i++) {
            const user = team[i];
            tricks += roundWinners.reduce((acc, winner) => {
                if (user === winner) acc++;
                return acc;
            }, 0);
        }
        return tricks;
    } catch (error) {
        console.error('error =', error);
    }
}
function getRoundStartPlayer(game, round) {
    try {
        console.log('game.js - getRoundStartPlayer---------------------------------------------');
        // console.log('getRoundStartPlayer---------------------------');
        if (round && round.length === 0) return null;
        let roundToGet = round;
        if (roundToGet === undefined || roundToGet === null) roundToGet = getCurrentRound(game); 
        for (const spot in game.seating) {
            if (game.seating.hasOwnProperty(spot)) {
                const user = game.seating[spot];
                if (usersHandContainsCard(game, roundToGet[0], user)) {
                    return user;
                }
            }
        }  
    } catch (error) {
        console.error('error =', error);
    }
}
function getCurrentRoundWinner(game) {
    try {
        console.log('game.js - getCurrentRoundWinner---------------------------------------------');
        const roundToGet = getCurrentRound(game); 
        if (!roundToGet) return null
        if (roundToGet && roundToGet.length % 4 === 0) {
            const roundWinners = getRoundWinners(game);
            if (roundWinners && roundWinners.length > 0) return roundWinners[roundWinners.length - 1];
            else return getDeclarer(game);
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function getCurrentRound(game) {
    try {
        console.log('game.js - getCurrentRound---------------------------------------------');
        const playedCards = getPlayedCards(game);
        if (!playedCards) return [];
        const nthRound = Math.floor(playedCards.length / 4);
        const isRoundEnd = (playedCards.length / 4) % 1 === 0;
        let currentRound 
        if (isRoundEnd) {
            const startIndex = (nthRound - 1) * 4;
            currentRound = playedCards.slice(startIndex, startIndex + 4);
        }
        else {
            currentRound = playedCards.slice(nthRound * 4);
        }
        if (!currentRound) return [];
        return currentRound;
    } catch (error) {
        console.error('error =', error);
    }
}
function getSocketIdsOfDefense(game) {
    try {
        console.log('game.js - getSocketIdsOfDefense---------------------------------------------');
        if (!game) return null;
        const declarersSpot = getDeclarersSpot(game);
        if (declarersSpot.toLowerCase() === 'north' || declarersSpot.toLowerCase() === 'south') {
            console.log(`returning ${userUtils.getUserId(game.seating.east), userUtils.getUserId(game.seating.west)}`);
            console.log('userUtils.getUserId(game.seating.east =', userUtils.getUserId(game.seating.east));
            console.log('userUtils.getUserId(game.seating.west =', userUtils.getUserId(game.seating.west));
            return [userUtils.getUserId(game.seating.east), userUtils.getUserId(game.seating.west)];
        }
        else if (declarersSpot.toLowerCase() === 'east' || declarersSpot.toLowerCase() === 'west') {
            console.log(`returning ${[userUtils.getUserId(game.seating.north), userUtils.getUserId(game.seating.south)]}`);
            console.log('userUtils.getUserId(game.seating.north =', userUtils.getUserId(game.seating.north));
            console.log('userUtils.getUserId(game.seating.south =', userUtils.getUserId(game.seating.south));
            console.log(' =', );
            return [userUtils.getUserId(game.seating.north), userUtils.getUserId(game.seating.south)];
        }
        console.log('--------------------');
    } catch (error) {
        console.error('error =', error);
    }
}
function getUsersnamesOfDefense(game) {
    try { 
        console.log('game.js - getUsersnamesOfDefense---------------------------------------------');
        if (!game) return null;
        const declarersSpot = getDeclarersSpot(game);
        if (declarersSpot.toLowerCase() === 'north' || declarersSpot.toLowerCase() === 'south') {
            return [game.seating.east, game.seating.west];
        }
        else if (declarersSpot.toLowerCase() === 'east' || declarersSpot.toLowerCase() === 'west') {
            return [game.seating.north, game.seating.south];
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function declarerClaimsAll(game) {
    try {
        console.log('game.js - declarerClaimsAll---------------------------------------------');
        if (game === undefined || game === null) return;
        const lastDeal = getLastDeal(game);
        // const numberOfCardsPlayed = lastDeal.cardPlayOrder.length;
        // const tricksClaimed = lastDeal.agreeWithClaim.claimAmount;
        if (lastDeal.agreeWithClaim.isClaimingAll) {
            populatePlayCardOrderWithNA(lastDeal);
            populateRoundWinner(getDeclarer(game), lastDeal);
        }
        else {
            populatePlayCardOrderWithNA(lastDeal);
            const opposingTeamMember = getOpposingTeamMember(game, getDeclarer(game));
            populateRoundWinner(opposingTeamMember, lastDeal);
        }
    } catch (error) {
        console.error('error =', error);
    }

}
function populatePlayCardOrderWithNA(lastDeal) {
    try {
        console.log('game.js - populatePlayCardOrderWithNA---------------------------------------------');
        if (lastDeal && lastDeal.cardPlayOrder) {
            for (let i = 0; i < 52; i++) {
                if (lastDeal.cardPlayOrder.length >= 52) return;
                lastDeal.cardPlayOrder.push('N/A');
            }
        }
    } catch (error) {
        console.error('error =', error);
    }
}
//#endregion
//#region Scoring Functions
function getScoring(game) {
    try {
        console.log('game.js - getScoring---------------------------------------------');
        const lastDeal = getLastDeal(game.name);
        if (!lastDeal) return null;
        const belowTheLines = {
            northSouth: [],
            eastWest: [],
        };
        
        for (let i = 0; i < game.deals.length; i++) {
            const deal = game.deals[i];
            belowTheLines.northSouth.push(deal.northSouth.belowTheLine);
            belowTheLines.eastWest.push(deal.eastWest.belowTheLine);
        }

        return {northSouth: lastDeal.northSouth, eastWest: lastDeal.eastWest, belowTheLines, gameRoundEndingScores: game.gameRoundEndingScores};
    } catch (error) {
        console.error('error =', error);
    }   
}
function checkForSpamming(game) {
    try {
        console.log('game.js - checkForSpamming---------------------------------------------');
        if (game.deals.length < constants.maxConsecutiveNoBidGames) return false;
        let lastAboveNS = 0;
        let lastBelowNS = 0;
        let lastAboveEW = 0;
        let lastBelowEW = 0;
        let timesScoreSame = 0;
        for (let i = 0; i < game.deals.length; i++) {
            const currentDeal = game.deals[i];
            if (lastAboveNS === currentDeal.northSouth.aboveTheLine && lastBelowNS === currentDeal.northSouth.belowTheLine && lastAboveEW === currentDeal.eastWest.aboveTheLine && lastBelowEW === currentDeal.eastWest.belowTheLine) {
                timesScoreSame++;
            }
            else {
                timesScoreSame = 0;
            }
            lastAboveNS = currentDeal.northSouth.aboveTheLine;
            lastBelowNS = currentDeal.northSouth.belowTheLine;
            lastAboveEW = currentDeal.eastWest.aboveTheLine;
            lastBelowEW = currentDeal.eastWest.belowTheLine;
            if (timesScoreSame >= constants.maxConsecutiveNoBidGames) {
                delete games[game.name];
                return true;
            }
        }
        return false;
    } catch (error) {
        console.error('error =', error);
    }
}
function getBaseValue(contract) {
    try {
        console.log('game.js - getBaseValue---------------------------------------------');
        if (!contract) return null;
        if (contract.match(/club/i) || contract.match(/diamond/i)) return 20 ;
        else if (contract.match(/heart/i) || contract.match(/spade/i) || contract.match(/trump/i)) return 30;
        else {
            // console.log(`Error getting base value from ${contract}`);
            return null;
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function getContractAsNumber(contract) {
    try {
        console.log('game.js - getContractAsNumber---------------------------------------------');
        if (!contract) return null;
        const splitStr = contract.split(' ');
        switch (splitStr[0].toLowerCase()) {
            case 'one':
                return 1;
            case 'two':
                return 2;
            case 'three':
                return 3;
            case 'four':
                return 4;
            case 'five':
                return 5;
            case 'six':
                return 6;
            case 'seven':
                return 7;
        }
    } catch (error) {
        console.error('error =', error);
    }
}
function getContractPoints(game, lastDeal, declaringTeamScoring) {
    try {
        console.log('game.js - getContractPoints---------------------------------------------');
        if (!lastDeal || !lastDeal.contract || !declaringTeamScoring) return null;
        const contract = lastDeal.contract;
        const contractAsNumber = getContractAsNumber(contract);
        const baseValue = getBaseValue(contract);
        const doubleMultiplier = getDoubleMultiplier(game);
        if (contract.match(/trump/i)) {
            return (40 + ((contractAsNumber - 1) * baseValue)) * doubleMultiplier;
        }
        return contractAsNumber * baseValue * doubleMultiplier;
    } catch (error) {
        console.error('error =', error);
    }
}
function getOverTrickPoints(game, contract, tricksOver, isVulnerable) {
    try {
        console.log('game.js - getOverTrickPoints---------------------------------------------');
        // console.log('getOverTrickPoints--------------------------------');
        if (contract === undefined || contract === null || tricksOver === undefined || tricksOver === null || isVulnerable === undefined || isVulnerable === null) return null;
        let baseValue = getBaseValue(contract);
        const doubleMultiplier = getDoubleMultiplier(game);
        if (tricksOver === 0) return 0;
        if (doubleMultiplier !== 1){
            if (isVulnerable === false) {
                if (doubleMultiplier === 2) baseValue = 100;
                else if (doubleMultiplier === 4) baseValue = 200;
            }
            else {
                if (doubleMultiplier === 2) baseValue = 200;
                else if (doubleMultiplier === 4) baseValue = 400;
            }
        }
        return baseValue * tricksOver;
    } catch (error) {
        console.error('error =', error);
    }
}
function scoreLastDeal(game) {
    try {
        console.log('game.js - scoreLastDeal---------------------------------------------');
        // console.log('scoreLastDeal() ---------------------------------------');
        //#region Init
        let declaringTeamScoring = {}, nonDeclaringTeamScoring = {};
        let gameOver = false;
        let contractPoints = 0, overTrickPoints = 0, underTrickPoints = 0, rubberBonus = 0, slamBonus = 0, honorPoints = 0;
        let declaringIsNorthSouth = false;
        const lastDeal = getLastDeal(game.name);
        const declarerSpot = getDeclarersSpot(game);
        const contractAsNumber = getContractAsNumber(lastDeal.contract);
        const tricks = getTeamTrickCount(game, declarerSpot);
        const tricksNeeded = 6 + contractAsNumber;
        const scoring = getScoring(game);
        const doubleMultiplier = getDoubleMultiplier(game);
        if (tricks === undefined || tricks === null || tricksNeeded === undefined || tricksNeeded === null || scoring === undefined || scoring === null || lastDeal === undefined || lastDeal === null) {
            // console.log('Issue with setting up scoring vars');
            return null;
        }
        // console.log('contract predicted: someValue; actual =', lastDeal.contract);
        // console.log('tricks made by declarers team =', tricks);
        // console.log('tricksNeeded by declarers team =', tricksNeeded);
        // console.log('made bid =', tricks >= tricksNeeded);
        // console.log('declarerSpot predicted: someValue; actual =', declarerSpot);
        // console.log('scoring after initializatio =', scoring);
        //#endregion
        //#region Getting declaringTeamScoring
        if (declarerSpot.toLowerCase() === 'north' || declarerSpot.toLowerCase() === 'south') { 
            declaringTeamScoring = scoring.northSouth;  
            nonDeclaringTeamScoring = scoring.eastWest;
            declaringIsNorthSouth = true;
        }
        else if (declarerSpot.toLowerCase() === 'east' || declarerSpot.toLowerCase() === 'west') {
            declaringTeamScoring = scoring.eastWest;   
            nonDeclaringTeamScoring = scoring.northSouth;
        }
        else {
            // console.log('SOMETHING WENT WRONG GETTING DECLARERSPOT');
            return null;
        }
        //#endregion
        //#region Setting Vulnerable Status
        if (declaringTeamScoring.vulnerableTransitionIndex !== null) declaringTeamScoring.isVulnerable = true;
        if (nonDeclaringTeamScoring.vulnerableTransitionIndex !== null) nonDeclaringTeamScoring.isVulnerable = true;
        console.log('declaringTeamScoring.isVulnerable =', declaringTeamScoring.isVulnerable);
        console.log('declaringTeamScoring.vulnerableTransitionIndex =', declaringTeamScoring.vulnerableTransitionIndex);
        if (declaringTeamScoring.isVulnerable === true && declaringTeamScoring.vulnerableTransitionIndex === null) {
            declaringTeamScoring.vulnerableTransitionIndex = game.deals.length - 2;
        }
        if (nonDeclaringTeamScoring.isVulnerable === true && nonDeclaringTeamScoring.vulnerableTransitionIndex === null) {
            nonDeclaringTeamScoring.vulnerableTransitionIndex = game.deals.length - 2;
        }
        //#endregion
        //#region Declaring Team Made contract
        if (tricks >= tricksNeeded) {
            

            slamBonus = getSlamBonus(contractAsNumber, declaringTeamScoring);
            contractPoints = getContractPoints(game, lastDeal, declaringTeamScoring);
            overTrickPoints = getOverTrickPoints(game, lastDeal.contract, Math.abs(tricks - tricksNeeded), declaringTeamScoring.isVulnerable);
        
            declaringTeamScoring.belowTheLine += contractPoints;
            declaringTeamScoring.aboveTheLine += overTrickPoints;

            if (declaringTeamScoring.belowTheLine >= 100 ) {
                //Adding below line to above the line and resetting below line
                
                //the totalBelowTheLineScore is a cumulative scoring of below the line points (used to calculate the final score)
                declaringTeamScoring.totalBelowTheLineScore += declaringTeamScoring.belowTheLine;
                nonDeclaringTeamScoring.totalBelowTheLineScore += nonDeclaringTeamScoring.belowTheLine;

                //gameEndingScores keeps track of the belowTheLIne scores when someone has won a game round.
                game.gameRoundEndingScores.northSouth.push(declaringIsNorthSouth ? declaringTeamScoring.belowTheLine + slamBonus : nonDeclaringTeamScoring.belowTheLine);
                game.gameRoundEndingScores.eastWest.push(declaringIsNorthSouth ? nonDeclaringTeamScoring.belowTheLine : declaringTeamScoring.belowTheLine + slamBonus);

                declaringTeamScoring.belowTheLine = 0;
                nonDeclaringTeamScoring.belowTheLine = 0;

                // console.log('doubleMultiplier predicted: someValue; actual =', doubleMultiplier);
                if (doubleMultiplier === 2) declaringTeamScoring.aboveTheLine += 50;
                else if (doubleMultiplier === 4) declaringTeamScoring.aboveTheLine += 100;

                console.log('declaringTeamScoring =', declaringTeamScoring);
                console.log('nonDeclaringTeamScoring.isVulnerable =', nonDeclaringTeamScoring.isVulnerable);
                if (declaringTeamScoring.isVulnerable === true) {
                    rubberBonus = getRubberBonus(game);
                    gameOver = true;
                }
                else {
                    declaringTeamScoring.isVulnerable = true;
                }
            }                    
        }
        //#endregion
        //#region Declaring Team Failed to Make Contract
        else {
            underTrickPoints = getUnderTrickPoints(game, tricksNeeded - tricks, declaringTeamScoring);
            // console.log('underTrickPoints predicted: someValue; actual =', underTrickPoints);
            nonDeclaringTeamScoring.aboveTheLine += underTrickPoints;
            // console.log('scoring after point scoring =', scoring);
        }
        //#endregion
        console.log('game.room.shouldCountHonors =', game.room.shouldCountHonors);
        if (game.room.shouldCountHonors === true) {
            honorPoints = getHonorPoints(getDeclarersHand(game), lastDeal.contract);
            console.log(`honor points: ${honorPoints}------------------------------------------------`);
            declaringTeamScoring.aboveTheLine += honorPoints;
        }
        game.isGameOver = gameOver;
        const dealSummary = {overTrickPoints, underTrickPoints, rubberBonus, contractPoints, tricksNeeded, tricks, slamBonus, honorPoints};
        lastDeal.dealSummary = dealSummary;
    } catch (error) {
        console.error('error =', error);
    }
}
function getHonorPoints(handArray, contract) {
    try {
        console.log('game.js - getHonorPoints---------------------------------------------');
        if (handArray === undefined || handArray === null || contract === undefined || contract === null) {
            console.log('error getting Honors initial------------------------------------------------');
            return 0;
        }

        if (contract.match(/trump/i)) {
            let hasClubAce = false, hasDiamondAce = false, hasHeartAce = false, hasSpadeAce = false;
            for (let i = 0; i < handArray.length; i++) {
                const suit = handArray[i];
                if (suit.length <= 0) return 0;
                const suitName = getSuitFromNumber(suit[0]);
                for (let j = 0; j < suit.length; j++) {
                    const cardAsNumber = suit[j];
                    if (cardAsNumber % 13 === 12) {
                        if (suitName.match(/club/i)) hasClubAce = true;
                        if (suitName.match(/diamond/i)) hasDiamondAce = true;
                        if (suitName.match(/heart/i)) hasHeartAce = true;
                        if (suitName.match(/spade/i)) hasSpadeAce = true;
                    }
                }
            }
            if (hasClubAce && hasDiamondAce && hasHeartAce && hasSpadeAce) return 150;
        }
        else {
            const contractSuit = contract.split(' ')[1].toLowerCase();
            let honorCount = 0;
            if (handArray.length !== 4) return console.log('Error in Assumption regarding Handarray being lenght of 4 even if voids');
            for (let i = 0; i < handArray.length; i++) {
                const suit = handArray[i];
                const suitName = suit && suit.length > 0 ? getSuitFromNumber(suit[0]).toLowerCase() : null;
                if (suitName && !suitName.match(contractSuit)) continue;
                for (let j = 0; j < suit.length; j++) {
                    const cardAsNumber = suit[j];
                    if (cardAsNumber % 13 === 12) honorCount++;
                    if (cardAsNumber % 13 === 11) honorCount++;
                    if (cardAsNumber % 13 === 10) honorCount++;
                    if (cardAsNumber % 13 === 9) honorCount++;
                    if (cardAsNumber % 13 === 8) honorCount++;
                }
            }
            if (honorCount === 4) return 100
            if (honorCount === 5) return 150;
        }
        return 0;
    } catch (error) {
        console.error('error =', error);
    }
}
//#endregion
//#region DealSummary Functions
function getPreferencesForSocketId(socketId) {
    try {
        console.log('game.js - getPreferencesForSocketId---------------------------------------------');
        if (!socketId) return null;
        const username = userUtils.getUser(socketId);
        return username.preferences;
    } catch (error) {
        console.error('error =', error);
    }
}
//#endregion
//#region Misc
function getGame(gameName) {
    try {
        console.log('game.js - getGame---------------------------------------------');
        return games[gameName];
    } catch (error) {
        console.error('error =', error);
    }
}
function removeUserFromReadyToContinue(leavingUser) {
    try {
        console.log('game.js - removeUserFromReadyToContinue---------------------------------------------');
        const newObj = JSON.parse(JSON.stringify({}));
        const game = getGame(leavingUser.room);
        for (const username in game.usersReadyToContinue) {
            if (game.usersReadyToContinue.hasOwnProperty(username)) {
                const socketId = game.usersReadyToContinue[username];
                if (username !== leavingUser.username) newObj[username] = socketId;
            }
        }
        game.usersReadyToContinue = newObj;
    } catch (error) {
        console.error('error =', error);
    }
}
function removeUserFromGame(userObj){
    try {
        console.log('game.js - removeUserFromGame---------------------------------------------');
        let gameToRemoveFrom = getGame(userObj.room);
        if (gameToRemoveFrom) {
            if (!gameToRemoveFrom || !gameToRemoveFrom.users) return; 
            gameToRemoveFrom.users[userObj.username] = null;
            setTimeout(() => {
                let shouldDelete = true;
                for (const username in gameToRemoveFrom.users) {
                    if (gameToRemoveFrom.users.hasOwnProperty(username)) {
                        const socketId = gameToRemoveFrom.users[username];
                        if (socketId !== null) {
                            shouldDelete = false; 
                            break;
                        }
                    }
                }
                if (shouldDelete) {
                    removeGame(gameToRemoveFrom.name);
                }
            }, constants.waitToRemoveUserFromGame);
            return true;
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function removeFromGamesInSession(name) {
    try {
        console.log('game.js - removeFromGamesInSession---------------------------------------------');
        const index = gamesInSession.findIndex(game => game === name);
        if (index !== -1) {
            return gamesInSession.splice(index, 1)[0];
        }
        return null;
    } catch (error) {
        console.error('error =', error);
    }
}
function removeGameFromGames(gameName) {
    try {
        console.log('game.js - removeGameFromGames---------------------------------------------');
        if (!gameName) return null;
        delete games[gameName];
    } catch (error) {
        console.error('error =', error);
    }
}
function removeGame(gameName) {
    try {
        console.log('game.js - removeGame---------------------------------------------');
        console.log('removeGame---------------------------------------');
        removeGameFromGames(gameName);
        removeFromGamesInSession(gameName);
    } catch (error) {
        console.error('error =', error);
    }
}
function shuffle (array) {
    try {
        console.log('game.js - shuffle---------------------------------------------');
        let currentIndex = array.length;
        let temporaryValue = null;
        let randomIndex = null;
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;
            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
        }
        return array;
    } catch (error) {
        console.error('error =', error);
    }
}
function getSumOfItems(array) {
    try {
        if (!Array.isArray(array)) return 0;
        return array.reduce((acc, item) => {
        return (acc += item);
        }, 0);
    } catch (error) {
        console.error('error =', error);
    }
}
function getWonGame(game, username) {
    console.log('getWonGameAmount------------------------------------------------');
    try {
        const lastDeal = getLastDeal(game);
        if (game === undefined || game === null || lastDeal === undefined || lastDeal === null) return 0;
        
        let rubberBonusEastWest = 0, rubberBonusNorthSouth = 0;
        const usersSpot = getUserSpot(game, username);
        const rubberBonus = getRubberBonus(game);

        if (game.gameRoundEndingScores.northSouth[game.gameRoundEndingScores.northSouth.length - 1] >= 100) rubberBonusNorthSouth = rubberBonus;
        else rubberBonusEastWest = rubberBonus;

        const  eastWestScore = lastDeal.eastWest.aboveTheLine + getSumOfItems(game.gameRoundEndingScores.eastWest) + rubberBonusEastWest;
        const northSouthScore = lastDeal.northSouth.aboveTheLine + getSumOfItems(game.gameRoundEndingScores.northSouth) + rubberBonusNorthSouth;

        if (northSouthScore === eastWestScore) return -1;
        if (usersSpot.toLowerCase() === 'north' || usersSpot.toLowerCase() === 'south') return northSouthScore > eastWestScore ? 1 : 0;
        if (usersSpot.toLowerCase() === 'east' || usersSpot.toLowerCase() === 'west' ) return eastWestScore > northSouthScore ? 1 : 0;
        
    } catch (error) {
        console.log('error getWonGameAmount------------------------------------------------', error);
    }
}
function getWonDeal(game, deal, username) {
    console.log('getWonDeal------------------------------------------------');
    try {
        const declarer = deal.declarer;
        const exposedHandName = getPartnersName(game, declarer);
        const partnersName = getPartnersName(game, username);
        const requiredAmount = convertContractToInt(deal.contract) + 6;
        let roundsWon = 0;

        // console.log('username =', username);
        // console.log('declarer =', declarer);
        // console.log('exposedHandName =', exposedHandName);
        // console.log('deal.roundWinners =', deal.roundWinners);
        // console.log('requiredAmount =', requiredAmount);
        // console.log('13-requiredAmount =', 13-requiredAmount);

        for (let i = 0; i < deal.roundWinners.length; i++) {
            const roundWinner = deal.roundWinners[i];
            if (roundWinner === partnersName || roundWinner === username) {
                roundsWon++;
                
                if (roundsWon >= requiredAmount && (username === declarer || username === exposedHandName)){
                    console.log('roundsWon =', roundsWon);
                    console.log('1st------------------------------------------------');
                    return true;

                }
                else if (roundsWon > (13 - requiredAmount) && username !== declarer && username !== exposedHandName) {
                    console.log('roundsWon =', roundsWon);
                    console.log('2nd------------------------------------------------');
                    return true;
                }
            }
            
        }
        return false;
    } catch (error) {
        console.log('error getWonDeal------------------------------------------------', error);
    }

}
function getUserWhoDoubled(game, deal) {
    console.log('getUserWhoDoubled------------------------------------------------');
    const exposedHandName = getPartnersName(game, deal.declarer);
    for (let i = deal.bids.length - 1; i >= 0; i--) {
        const bid = deal.bids[i];
        if (bid[1].match(/double/i)) {
            const bidder = bid[0];
            if (bidder !== deal.declarer && bidder !== exposedHandName) return bidder;
        }
    } 
    return null;
}
function getGameDoubledByUser(game, username) {
    console.log('getGameDoubledByUser------------------------------------------------');
    try {
        let dealsWonDoubled = 0, dealsDoubled = 0;
        for (let i = 0; i < game.deals.length; i++) {
            const deal = game.deals[i];
            if (deal.doubleValue === 1 || deal.cardPlayOrder.length < 52) continue;
            const userWhoDoubled = getUserWhoDoubled(game, deal);
            if (username === userWhoDoubled) {
                dealsDoubled++;
                if (getWonDeal(game, deal, username)) dealsWonDoubled++;
            }
        }
        return {dealsDoubled, dealsWonDoubled};
    } catch (error) {
        console.log('error getGameDoubledByUser------------------------------------------------', error);
        return {dealsDoubled: 0, dealsWonDoubled: 0};
    }
}


//#endregion
//#endregion

//#region Prototype Extenstions
Object.size = function(obj) {
    let size = 0;
    for (key in obj) {
        if (obj.hasOwnProperty(key)) size++;
    }
    return size;
};
Object.defineProperty(Array.prototype, 'flatten', {
    value: function(depth = 1) {
    return this.reduce(function (flat, toFlatten) {
        return flat.concat((Array.isArray(toFlatten) && (depth>1)) ? toFlatten.flatten(depth-1) : toFlatten);
    }, []);
    }
});
String.prototype.capitalize = function () {
    return this.split(' ').map(word => word[0].toUpperCase() + word.slice(1)).join(' ');
};
//#endregion
module.exports = {
    createNewGame, 
    getGame,
    removeGame,
    removeUserFromGame,
    removeGameFromGames,
    removeFromGamesInSession,
    shuffle,
    gamesInSession,
    games,
    verifyOtherHandPickedCards,
    getNumberOfCardsInSuit,
    getMinMaxOfSuit,
    getSuitFromNumber,
    removeUserFromReadyToContinue,
    setUsersInGame,
    getUsersHand,
    getHandForSocketID,
    getPartnersName,
    getNextDealer,
    getSocketIdsOfDefense,
    setHasMadeBid,
    getDealer,
    getDeal,
    getLastDeal,
    getLastBid,
    getLastContractBid,
    getBidFromDeal,
    makeBid,
    getNextBidder,
    getDeclarer,
    getDeclarersSpot,
    getExposedHandSpot,
    getExposedHandName,
    getExposedHand,
    isFromExposedHand,
    setContractAndDeclarer,
    getContract,
    getDeclarersHand ,
    getPartnersHand,
    getUserInSpot,
    getUserSpot ,
    isbiddingFinished,
    dealIsABust,
    addUser,
    removeUser,
    sortHands,
    sortHandBySuitPreference,
    sortHandByCardPreference,
    getSortPreferences,
    getPreferences,
    createNewDeal,
    getHandsObj,
    generateArraySeriesNonInclusive,
    deal,
    getHand,
    usersHandContainsCard,
    getLastLeadCard,
    userHasAtLeastOneCardInSuit ,
    isFollowingSuit,
    usersPlayIsValid ,
    getAllowedToDouble,
    getCurrentPlayer,
    getRotationsAround,
    getUserNameWhoHasCard,
    setContract,
    getTrumpSuitFromContract,
    evaluateWinner,
    getWinningCard,
    getSuitOfCard,
    getLastFourPlayedCards,
    playCard,
    usersTurnToPlay,
    getPlayedCards,
    getHandLengths,
    getTeamTrickCount,
    getRoundStartPlayer,
    getCurrentRoundWinner,
    getCurrentRound,
    getLastRoundWinner,
    getLastRound,
    getRoundWinners,
    pushRoundWinner,
    getScoring,
    checkForSpamming,
    getBaseValue,
    getContractAsNumber,
    getDoubleMultiplier,
    getSlamBonus,
    getRubberBonus,
    getContractPoints,
    getNthUnderTrick,
    getUnderTrickPoints,
    getOverTrickPoints,
    scoreLastDeal,
    getPreferencesForSocketId,
    declarerClaimsAll,
    declarerClaimsSome,
    getUsersnamesOfDefense,
    getDeclarersHandRemaining,
    getWonGame,
    getGameDoubledByUser,
    getDealStats,
}
