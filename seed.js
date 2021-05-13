//Seed used to generate test mongoDB accounts

const User = require('../models/user');
const password = 'supersecretpassword123';

const testingPreferences = {
    cardSortPreference: "Descending",
    suitSortPreference: "Descending",
    trumpOnLeftExposedHand: true,
    trumpOnLeftHand: true,
    shouldAnimateCardPlay: true,
    shouldAnimateRoundEnd: true,
}

const users = [
    {
        username: "James",
        password,
        email: "Derdek@gmail.com",
        zipCode: 12345,
        preferences: {
            sound: {
                isEnabled: true,
                roundWon: 'saucisse',
            },
            hasPaid: true,
            cardSortPreference: "Descending",
            suitSortPreference: "Descending",
            trumpOnLeftExposedHand: true,
            trumpOnLeftHand: true,
            shouldAnimateCardPlay: true,
            shouldAnimateRoundEnd: true,
            cardBackPreference: 1,
            setHonorsAutomatically: true,
            colorTheme: 'light',
        },
    },
    {
        username: "Ryan",
        password,
        email: "Derdek2@gmail.com",
        zipCode: 12345,
        preferences: {
            sound: {
                isEnabled: true,
                roundWon: 'wookie',
            },
            hasPaid: true,
            cardSortPreference: "Descending",
            suitSortPreference: "Descending",
            trumpOnLeftExposedHand: true,
            trumpOnLeftHand: true,
            shouldAnimateCardPlay: true,
            shouldAnimateRoundEnd: true,
            cardBackPreference: 4,
            setHonorsAutomatically: false,
        },
    },
    {
        username: "Tim",
        password,
        email: "TommyTHEBOY3@gmail.com",
        zipCode: 12345,
        preferences: {
            sound: {
                isEnabled: true,
                roundWon: 'aLittleBit',
            },
            hasPaid: true,
            cardSortPreference: "Descending",
            suitSortPreference: "Descending",
            trumpOnLeftExposedHand: true,
            trumpOnLeftHand: true,
            shouldAnimateCardPlay: true,
            shouldAnimateRoundEnd: true,
            cardBackPreference: 2,
            setHonorsAutomatically: true,
        },
    },
    {
        username: "Dan",
        password,
        email: "margrin@gmail.com",
        zipCode: 12345,
        preferences: {
            sound: {
                isEnabled: true,
                roundWon: 'laugh2',
            },
            hasPaid: true,
            cardSortPreference: "Descending",
            suitSortPreference: "Descending",
            trumpOnLeftExposedHand: true,
            trumpOnLeftHand: true,
            shouldAnimateCardPlay: true,
            shouldAnimateRoundEnd: true,
            cardBackPreference: 7,
            setHonorsAutomatically: true,
        },
    },
    {
        username: "Ruthann",
        password,
        email: "butter@gmail.com",
        zipCode: 12345,
        preferences: {
            sound: {
                isEnabled: true,
                roundWon: 'forcedLaugh2',
            },
            hasPaid: true,
            cardSortPreference: "Descending",
            suitSortPreference: "Descending",
            trumpOnLeftExposedHand: true,
            trumpOnLeftHand: true,
            shouldAnimateCardPlay: true,
            shouldAnimateRoundEnd: true,
            cardBackPreference: 6,
            setHonorsAutomatically: true,
        },
    },
    {
        username: "Garrett",
        password,
        email: "toast@gmail.com",
        zipCode: 12345,
        preferences: {
            sound: {
                isEnabled: true,
                roundWon: 'laugh3',
            },
            hasPaid: true,
            cardSortPreference: "Descending",
            suitSortPreference: "Descending",
            trumpOnLeftExposedHand: true,
            trumpOnLeftHand: true,
            shouldAnimateCardPlay: true,
            shouldAnimateRoundEnd: true,
            cardBackPreference: 5,
            setHonorsAutomatically: true,
        },
    },
];

const stats = {
    totalPoints: {
        distribution:0,
        highCard: 0,
    },
    gamesPlayed: 0,
    gamesWon: 0,
    dealsPlayed: 0,
    dealsPlayedAsDeclarer: 0,
    dealsWonAsDeclarer: 0,
    dealsWonAsDefense: 0,
    dealsDoubled: 0,
    dealsWonDoubled: 0,
}

async function run() {
    for (let i = 0; i < users.length; i++) {
        const user = users[i];
        console.log(`registering ${user.username}`);
        const userObj = new User({
            username: user.username, 
            email: user.email,
            preferences: user.preferences,
            stats,
        });
        try {
            await User.register(userObj, user.password);
        } catch (error) {
            console.log(`error creating user ${user.username}`);
        }
    }
}

module.exports = {
    run,
}