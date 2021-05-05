//NOTE: I created this website before I had learned about React
//I also didn't know about modules, so I ended up writing all of the code in the same file...

window.onload = function () {
  window.addEventListener('keyup', keyUpHandler);
  window.addEventListener('keydown', keyDownHandler);
  // window.addEventListener('click', clickHandler);
  //#region Initializtion
  let pos = { top: 0, left: 0, x: 0, y: 0 };
  let contracts, quote = '',
    seatingGlobal,
    scoringGlobal,
    hand,
    timerDurationValue,
    timerValues,
    timerCountdown,
    lastDealSummary,
    dealComplete = false, shouldAutoPass = false, autoPassWaitDuration = 1000,
    colorThemeSources = {}, currentTheme;
  let currentBidColumn = 0, currentBidRow = null, keyCodes = [];
  let thinkingDivTop, thinkingDivLeft, thinkingDivRight, thinkingDivBottom;
  let topBorder, bottomBorder, rightBorder, leftBorder;
  let continueButton,
    quitButton,
    readyToContinueTable,
    readyToContinueStatus = false,
    dealSummaryButtons,
    shouldSetupContinueAndQuitButons = true,
    shouldSetupReadyToContinueTable = true;
  let firstBidExtraTime = 60,
    amountLeft;
  let isStartOfBidding = true;
  let topLabelUsername, rightLabelUsername, leftLabelUsername;
  let highCardPoints,
    distributionPoints,
    clubsHasNonHighCard,
    diamondsHasNonHighCard,
    heartsHasNonHighCard,
    spadesHasNonHighCard,
    clubsCount,
    diamondsCount,
    heartsCount,
    spadesCount;
  let callsToDisplayAsSpan = 0;
  let bidCount,
    isSecondDouble = false;
  let leftIsDealer, rightIsDealer, topIsDealer, bottomIsDealer;
  let shouldSetupThinking = true;
  let currentSelection = null;
  let clientPreferences;
  let claimingCards = [],
    otherHandCards = [],
    claimSomeCardPlayOrder = [],
    isOffense = false,
    exposedHandName = "";
  let hasChangedVolume = false;
  let windowWidth = window.innerWidth, windowHeight = window.innerHeight;
  let docStyle = getComputedStyle(document.documentElement);
  let hasDownloadedStats = false;
  const varName = "--sliderBackgroundColor";
  const isMobile = window.innerWidth <= 479;
  const socket = io();
  const closeModalWaitDuration = 2000;
  // const usernamesWithBidContainerIssue = ["Dan", "Andrew"];
  const friends = ['Dan', 'Andrew', 'Ruthann', 'Garrett', 'James', 'Tim', "Ann", 'Adam'];
  const claimSomeVerbs = ['sacfice to the Bridge Gods', 'burn up in protest', 'give up over your dead body', 'hand over to the Bridge authorities', 'flush down the toilet', 'toss down an immeasurably-deep wishing well', 'eat and $hi! out for breakfast'];
  const claimSomeVerbsPast = ['sacficed to the Bridge Gods', 'burnt up in protest', 'gave up over his/her dead body', 'handed over to the Bridge authorities', 'flushed down the toilet', 'tossed down an immeasurably-deep wishing well', 'at and $h@! out for breakfast'];
  const deselectDiv = `
    <div id='deselectDiv'>
      <input checked id="deselectEnabled" type="checkbox" value="true">
      <label id='deselectEnabledLabel' for='deselectEnabled'>De-select: Enabled</label>
    </div>
  `;
  const suits = {
    clubs: "clubs",
    diamonds: "diamonds",
    hearts: "hearts",
    spades: "spades",
    noTrump: null,
  };
  const cardValuesOrder = [
    "two of " + suits.clubs,
    "three of " + suits.clubs,
    "four of " + suits.clubs,
    "five of " + suits.clubs,
    "six of " + suits.clubs,
    "seven of " + suits.clubs,
    "eight of " + suits.clubs,
    "nine of " + suits.clubs,
    "ten of " + suits.clubs,
    "jack of " + suits.clubs,
    "queen of " + suits.clubs,
    "king of " + suits.clubs,
    "ace of " + suits.clubs,
    "two of " + suits.diamonds,
    "three of " + suits.diamonds,
    "four of " + suits.diamonds,
    "five of " + suits.diamonds,
    "six of " + suits.diamonds,
    "seven of " + suits.diamonds,
    "eight of " + suits.diamonds,
    "nine of " + suits.diamonds,
    "ten of " + suits.diamonds,
    "jack of " + suits.diamonds,
    "queen of " + suits.diamonds,
    "king of " + suits.diamonds,
    "ace of " + suits.diamonds,
    "two of " + suits.hearts,
    "three of " + suits.hearts,
    "four of " + suits.hearts,
    "five of " + suits.hearts,
    "six of " + suits.hearts,
    "seven of " + suits.hearts,
    "eight of " + suits.hearts,
    "nine of " + suits.hearts,
    "ten of " + suits.hearts,
    "jack of " + suits.hearts,
    "queen of " + suits.hearts,
    "king of " + suits.hearts,
    "ace of " + suits.hearts,
    "two of " + suits.spades,
    "three of " + suits.spades,
    "four of " + suits.spades,
    "five of " + suits.spades,
    "six of " + suits.spades,
    "seven of " + suits.spades,
    "eight of " + suits.spades,
    "nine of " + suits.spades,
    "ten of " + suits.spades,
    "jack of " + suits.spades,
    "queen of " + suits.spades,
    "king of " + suits.spades,
    "ace of " + suits.spades,
  ];
  const numbersAsString = ['One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven'];
  const keyAssignments = {
    suits: {
      clubs: 67,
      diamonds: 68,
      hearts: 72,
      spades: 83,
      noTrump: 78,
    },
    noTrump: 78,
    makeBid: 13,
    makeBid2: 66,
    double: 76,
    pass: 80,
    reset: 82,
    undo: 85,
    backspace: 8,
    delete: 46,
    autoPassToggle: 65,
    autoPassDuration: 79,
    theme: 84,
    ok: 79,
    done: 68,
    confirm: 89,
    decline: 78,
    continue: 67,
    quit: 81,
    stats: 73,
    claimAll: 65,
    claimAllYes: 83,
    claimSome: 88,
    claimSomeCanel: 67,
    claimSomeDeselectEnabled: 68,
    claimNone: 78,
    cardValues: {
      ace: 49,
      king: 75,
      queen: 81,
      jack: 74,
      ten: 48,
      nine: 57,
      eight: 56,
      seven: 55,
      six: 54,
      five: 53,
      four: 52,
      three: 51,
      two: 50,
    }
  }
  const keyCodeCardValues = {
    [keyAssignments.cardValues.ace]: 12,
    [keyAssignments.cardValues.king]: 11,
    [keyAssignments.cardValues.queen]: 10,
    [keyAssignments.cardValues.jack]: 9,
    [keyAssignments.cardValues.ten]: 8,
    [keyAssignments.cardValues.nine]: 7,
    [keyAssignments.cardValues.eight]: 6,
    [keyAssignments.cardValues.seven]: 5,
    [keyAssignments.cardValues.six]: 4,
    [keyAssignments.cardValues.five]: 3,
    [keyAssignments.cardValues.four]: 2,
    [keyAssignments.cardValues.three]: 1,
    [keyAssignments.cardValues.two]: 0,
  }
  const suitOrder = ['Club', 'Diamond', 'Heart', 'Spade', 'No_Trump'];
  const keyCodeSuitValues = {
    [keyAssignments.suits.clubs]: suitOrder[0],
    [keyAssignments.suits.diamonds]: suitOrder[1],
    [keyAssignments.suits.hearts]: suitOrder[2],
    [keyAssignments.suits.spades]: suitOrder[3],
  }
  const suitKeyCodes = Object.values(keyAssignments.suits);
  const cardValueKeyCodes = Object.values(keyAssignments.cardValues);
  const suitsCharacters = ["&clubs;", "&diams;", "&hearts;", "&spades;"];
  const volumeSlider = document.querySelector("#volumeSlider");
  const volumeAndUndoDiv = document.querySelector("#volumeAndUndoDiv");
  const copyright = document.querySelector("#copyright");
  const playingButtons = document.querySelector("#playingButtons");
  const closeModalButton = document.querySelector("#closeClaim");
  const overlay = document.querySelector("#overlay");
  const flashMsg = document.querySelector("#flashMsg");
  const topUser = document.querySelector("#topUser");
  const bottomUser = document.querySelector("#bottomUser");
  const rightUser = document.querySelector("#rightUser");
  const leftUser = document.querySelector("#leftUser");
  const highCardPointsLabel = document.querySelector("#highCardPoints");
  const distributionPointsLabel = document.querySelector("#distributionPoints");
  const bidContainer = document.querySelector("#bidContainer");
  const rowContainer = document.querySelector("#rowContainer");
  const currentBidderName = document.querySelector("#currentBidderName");
  const lastBid = document.querySelector("#lastBid");
  const topBid = document.querySelector("#topBids");
  const bottomBid = document.querySelector("#bottomBids");
  const rightBid = document.querySelector("#rightBids");
  const leftBid = document.querySelector("#leftBids");
  const seatingTable = document.querySelector("#table");
  const cardsDiv = document.querySelector("#cardsDiv");
  const autoPass = document.querySelector("#autoPass");
  const autoPassDuration = document.querySelector("#autoPassDuration");
  const autoPassDurationDiv = document.querySelector("#autoPassDurationDiv");
  
  const playingCanvas = document.querySelector("#playingCanvas");
  const yourBelowTheLinePoints = document.querySelector(
    "#yourBelowTheLinePoints"
  );
  const yourAboveTheLinePoints = document.querySelector(
    "#yourAboveTheLinePoints"
  );
  const yourGameOnePoints = document.querySelector("#yourGameOnePoints");
  const yourGameTwoPoints = document.querySelector("#yourGameTwoPoints");
  const yourGameOnePointsLabel = document.querySelector(
    "#yourGameOnePointsLabel"
  );
  const yourGameTwoPointsLabel = document.querySelector(
    "#yourGameTwoPointsLabel"
  );
  const yourVulnerable = document.querySelector("#yourVulnerable");
  const opponentBelowTheLinePoints = document.querySelector(
    "#opponentBelowTheLinePoints"
  );
  const opponentAboveTheLinePoints = document.querySelector(
    "#opponentAboveTheLinePoints"
  );
  const opponentGameOnePoints = document.querySelector(
    "#opponentGameOnePoints"
  );
  const opponentGameTwoPoints = document.querySelector(
    "#opponentGameTwoPoints"
  );
  const opponentGameOnePointsLabel = document.querySelector(
    "#opponentGameOnePointsLabel"
  );
  const opponentGameTwoPointsLabel = document.querySelector(
    "#opponentGameTwoPointsLabel"
  );
  const opponentVulnerable = document.querySelector("#opponentVulnerable");
  const dealInformationDiv = document.querySelector("#dealInformationDiv");
  const undoBidButton = document.querySelector("#undoBidButton");
  const undoPlayButton = document.querySelector("#undoPlayButton");
  const undoPlayButtonDiv = document.querySelector("#undoPlayButtonDiv");
  const dealInfoButton = document.querySelector("#dealInfoButton");
  const closeDealInfo = document.querySelector("#closeDealInfo");
  const startPlayingButton = document.querySelector("#startPlaying");
  const navbar = document.querySelector("#navbar");
  //#region Claim Code
  const claim = document.querySelector("#claim");
  let claimYes = document.querySelector("#claimYes");
  let claimNo = document.querySelector("#claimNo");
  const claimNoneButton = document.querySelector("#claimButtonNone");
  const claimSomeButton = document.querySelector("#claimButtonSome");
  const claimAllButton = document.querySelector("#claimButtonAll");
  const claimBody = document.querySelector("#claimBody");
  //#endregion
  //#region Deal Info Code
  const directions = {
    north: "north",
    south: "south",
    east: "east",
    west: "west",
  };
  const locations = {
    top: "top",
    bottom: "bottom",
    left: "left",
    right: "right",
  };
  const tricksNeededNumerator = document.querySelector(
    "#tricksNeededNumerator"
  );
  const tricksNeededDenominator = document.querySelector(
    "#tricksNeededDenominator"
  );
  const contract = document.querySelector("#contract");
  const doubleLabel = document.querySelector("#doubleLabel");
  const vulnerable = document.querySelector("#vulnerable");
  const tricksNeededLabel = document.querySelector("#tricksNeededLabel");
  const youNeedTrickCount = document.querySelector("#youNeedTrickCount");
  const youCanLoseCount = document.querySelector("#youCanLoseCount");
  const tricksLeft = document.querySelector("#tricksLeft");
  const firstPlayerName = document.querySelector("#firstPlayerName");
  const firstPlayerCardPlayed = document.querySelector(
    "#firstPlayerCardPlayed"
  );
  const secondPlayerName = document.querySelector("#secondPlayerName");
  const secondPlayerCardPlayed = document.querySelector(
    "#secondPlayerCardPlayed"
  );
  const thirdPlayerName = document.querySelector("#thirdPlayerName");
  const thirdPlayerCardPlayed = document.querySelector(
    "#thirdPlayerCardPlayed"
  );
  const fourthPlayerName = document.querySelector("#fourthPlayerName");
  const fourthPlayerCardPlayed = document.querySelector(
    "#fourthPlayerCardPlayed"
  );
  const fontSizeSlider = document.querySelector("#fontSizeSlider");
  const colorTheme = document.querySelector("#colorTheme");
  const colorThemeBidding = document.querySelector("#colorThemeBidding");
  //#endregion
  //#region Game Info Code
  const gameInformationDiv = document.querySelector("#gameInfoDiv");
  const gameInfoButton = document.querySelector("#gameInfoButton");
  const aboveWe = document.querySelector("#aboveWe");
  const aboveThey = document.querySelector("#aboveThey");
  const firstGameWe = document.querySelector("#firstGameWe");
  const firstGameThey = document.querySelector("#firstGameThey");
  const secondGameWe = document.querySelector("#secondGameWe");
  const secondGameThey = document.querySelector("#secondGameThey");
  const thirdGameWe = document.querySelector("#thirdGameWe");
  const thirdGameThey = document.querySelector("#thirdGameThey");
  const closeGameInfo = document.querySelector("#closeGameInfo");
  //#endregion
  //#region Stats Stuff
  const sidebarFull = document.querySelector("#sidebarFull");
  const sidebar = document.querySelector("#sidebar");
  const closeSidebar = document.querySelector("#closeSidebar");
  const averageHighCardPoints = document.querySelector("#averageHighCardPoints");
  const averageDistributionPoints = document.querySelector("#averageDistributionPoints");
  const highestIndividualHighCardPoints = document.querySelector("#highestIndividualHighCardPoints");
  const highestIndividualdDistributionPoints = document.querySelector("#highestIndividualdDistributionPoints");
  const highestTotalHighCardPoints = document.querySelector("#highestTotalHighCardPoints");
  const highestTotaldDistributionPoints = document.querySelector("#highestTotaldDistributionPoints");
  const dealsPlayed = document.querySelector("#dealsPlayed");
  const dealsWon = document.querySelector("#dealsWon");
  const dealsWonAsDeclarer = document.querySelector("#dealsWonAsDeclarer");
  const dealsPlayedAsDeclarer = document.querySelector("#dealsPlayedAsDeclarer");
  const dealsWonAsDummy = document.querySelector("#dealsWonAsDummy");
  const dealsPlayedAsDummy = document.querySelector("#dealsPlayedAsDummy");
  const dealsWonAsDefense = document.querySelector("#dealsWonAsDefense");
  const dealsPlayedAsDefense = document.querySelector("#dealsPlayedAsDefense");
  const dealWinPercentageTotal = document.querySelector("#dealWinPercentageTotal");
  const dealWinPercentageDeclarer = document.querySelector("#dealWinPercentageDeclarer");
  const dealWinPercentageDummy = document.querySelector("#dealWinPercentageDummy");
  const dealWinPercentageDefense = document.querySelector("#dealWinPercentageDefense");
  const dealsDoubled = document.querySelector("#dealsDoubled");
  const dealsWonDoubled = document.querySelector("#dealsWonDoubled");
  const dealsDoubledPercentage = document.querySelector("#dealsDoubledPercentage");
  const gamesPlayed = document.querySelector("#gamesPlayed");
  const gamesWon = document.querySelector("#gamesWon");
  const gameWinPercentage = document.querySelector("#gameWinPercentage");
  const ties = document.querySelector("#ties");

  //#endregion
  const { username, room, password, spot, socketId } = Qs.parse(
    location.search,
    {
      ignoreQueryPrefix: true,
    }
  );
  //#region initialize info divs
  const defaultLocations = {top: {}, bottom: {}, left: {}, right: {}};
  let dealInfoLocations = JSON.parse(JSON.stringify(defaultLocations));
  let gameInfoLocations = JSON.parse(JSON.stringify(defaultLocations));
  //Setting dealInfoLocations in local storage
  if (!window.localStorage.getItem('dealInfoLocations')) {
    window.localStorage.setItem('dealInfoLocations', JSON.stringify(defaultLocations));
  }
  if (!window.localStorage.getItem('gameInfoLocations')) {
    window.localStorage.setItem('gameInfoLocations', JSON.stringify(defaultLocations));
  }
  //#endregion

  socket
    .binary(false)
    .emit("updateSocketIdAfterRedirect", {
      username,
      room,
      originalSocketId: socketId,
    });
  socket.binary(false).emit("getClientPreferences", { username });
  const themeList = ['dark', 'light', 'lightBlue', 'darkBlue', 'green', 'orange', 'purple', 'yellow'];
  setStyleVariables({target: {children: themeList, value: window.localStorage.getItem('theme')}});
  colorThemeBidding.value = window.localStorage.getItem('theme') ? window.localStorage.getItem('theme') : 'darkBlue';
  colorTheme.value = window.localStorage.getItem('theme') ? window.localStorage.getItem('theme') : 'darkBlue';

  //#endregion
  //#region Event Listener
  bidButtons.forEach((button) => {
    button.addEventListener("click", selectBid);
  });
  makeBidButton.addEventListener("click", () => {
    if (currentSelection) {
      makeBid(currentSelection);
    }
  });
  resetButton.addEventListener("click", resetBid);
  claimNoneButton.addEventListener("click", claimNoneHandler);
  claimSomeButton.addEventListener("click", claimSomeHandler);
  claimAllButton.addEventListener("click", claimAllHandler);
  closeModalButton.addEventListener("click", (e) => {
    scrollToTop();
    const ans = confirm(`Closing this is the same as choosing 'No Thanks'`);
    if (ans === true) {
      socket.binary(false).emit("sendClaimResponse", { room, response: false });
      closeModal(claim);
    }
  });
  dealInfoButton.addEventListener("click", (e) => {
    animateDealInfo();
  });
  closeDealInfo.addEventListener("click", (e) => {
    e.stopPropagation();
    animateDealInfo(false);
  });
  gameInfoButton.addEventListener("click", (e) => {
    animateGameInfo();
  });
  closeGameInfo.addEventListener("click", (e) => {
    e.stopPropagation();
    animateGameInfo(false);
  });
  colorTheme.addEventListener("change", changeColorThemeHandler);
  colorThemeBidding.addEventListener('change', changeColorThemeHandlerBidding);
  autoPass.addEventListener('change', autoPassHandler);

  function closeSidebarHandler(e) {
    sidebarFull.classList.remove('showSidebar');
    sidebar.classList.add('showSidebar');
  }
  function sidebarHandler(e) {
    if (sidebarFull.classList.contains('showSidebar')) return;
    else {
      sidebarFull.classList.add('showSidebar');
      sidebar.classList.remove('showSidebar');
    }
    if (!hasDownloadedStats) getStatsFromServer();
    // e.target.className = 'hidden';
  }
  function fontSizeSliderHandler(e) {
    try {
      const newValue = `--modalInfoFullFontSize: ${e.target.value}vmin`;
      document.documentElement.style.cssText += newValue;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function deselectEnabledHandler(e) {
    const label = document.querySelector("#deselectEnabledLabel");
    const pickedCards = document.querySelectorAll('.picked');
    for (let i = 0; i < pickedCards.length; i++) {
      const cardElement = pickedCards[i];
      e.target.checked ? cardElement.classList.remove('notDeselectable') : cardElement.classList.add('notDeselectable');
    }

    label.textContent = e.target.checked ?'Deselect: Enabled' :  'Deselect: Disabled';
  }
  function claimAllHandler(e) {
    try {
      scrollToTop();
      displayConfirmationAndEmit(globals.getTricksLeft());
    } catch (error) {
      console.error('error =', error);
    }
  }
  function claimSomeHandler(e) {
    try {
      scrollToTop();
      const usersTurnToPlay = globals.getUsersTurnToPlay();
      claim.innerHTML = `
        <div id="claimHeader">
            <div id="claimTitle">Select the cards to claim starting from the top hand:</div>
            <button id="closeClaim">&times;</button>
        </div>
        <div id="claimBody">
            <div id='claimBodyTopDiv'>
                <div id="claimBodyTopHand">
                    <div id='claimingHandDiv'>${
                      usersTurnToPlay === 1 ? "Hand" : "Dummy"
                    } (${globals.getTrumpSuit()} are trump): </div>
                    <div id="declarersHandDivTop" class="claimPicking"> </div>
                </div>
                <div id="claimBodyBottomHand">
                    <div id='otherHandDiv'>${
                      usersTurnToPlay === 2 ? "Hand" : "Dummy"
                    }:</div>
                    <div id="declarersHandDivBottom" class="claimPicking"></div>
                </div>
                ${deselectDiv}
            </div>
            <div id='claimSomeClaimOrderDiv'>
              <div id='claimSomeClaimOrder'></div>
            </div>

            <div id="claimButtons">
              <button class='btn btn-md btn-success disabled' id="claimYes">Ok</button>
              <button class='btn btn-md btn-warning disabled' id="claimReset">Reset</button>
              <button class='btn btn-md btn-danger' id="claimNo">Cancel</button>
            </div>
        </div>
      `;
      claim.className = "";
      document.querySelector("#closeClaim").addEventListener("click", (e) => {
        closeModal(claim);
      });
      document.querySelector("#deselectEnabled").addEventListener("click", deselectEnabledHandler);
      resetClaimSome();
      getTricksToClaim();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function claimNoneHandler(e) {
    try {
      scrollToTop();
      displayConfirmationAndEmit(0);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function cancelClaimHandler(e) {
    try {
      closeModal(claim);
      socket.binary(false).emit('cancelClaim', {room, username});
    } catch (error) {
      console.error('error =', error);
    }
  }
  function volumeSliderHandlerInput(e) {
    try {
      hasChangedVolume = true;
      const newAlpha = getNewAlpha(e.target.value);
      const redSuit = docStyle.getPropertyValue('--redSuit')
      const newValue = `${varName}: ${redSuit + newAlpha}`;
      document.documentElement.style.cssText += newValue;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function volumeSliderHandlerChange(e) {
    try {
      window.localStorage.setItem('defaultVolume', e.target.value);
      globals.changeSoundVolumes(e.target.value);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getNewAlpha(current) {
    try {
      const floatValue = parseFloat(current);
      const hexChars = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
      ];
      const stepValue1st = 1 / 16;

      let mutliples = floatValue / stepValue1st;
      let integer = parseInt(mutliples);
      let decimal = mutliples - integer;
      const firstChar = hexChars[integer];

      multiples = decimal / stepValue1st;
      integer = parseInt(multiples);
      const secondChar = hexChars[integer];

      let result = firstChar + secondChar;
      if (result === "undefined0") result = "FF";
      return result;
    } catch (error) {
      console.error('error =', error);
    }
  }
  globals.removeTouchHandler = function (e) {
    document.removeEventListener('touchmove', touchMoveHandler);
  }
  globals.touchStartHandler = function(e) {
    currentTop = document.documentElement.scrollTop || document.body.scrollTop;
    currentLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    pos = {
        // The current scroll 
        left: currentLeft,
        top: currentTop,
        // Get the current mouse position
        x: e.downPoint.x,
        y: e.downPoint.y,
    };

    document.addEventListener('touchmove', touchMoveHandler);

    // playingCanvas.style.cursor = 'grabbing';
    // playingCanvas.style.userSelect = 'none';
  }
  function touchMoveHandler(e) {
    // How far the mouse has been moved
    const dx = e.touches[0].clientX - pos.x;
    const dy = e.touches[0].clientY - pos.y;

    // Scroll the element
    currentTop = document.documentElement.scrollTop || document.body.scrollTop;
    currentLeft = document.documentElement.scrollLeft || document.body.scrollLeft;
    document.documentElement.scrollTop >=0 ? document.documentElement.scrollTop = pos.top - dy : document.body.scrollTop = pos.top - dy;
    document.documentElement.scrollLeft >= 0 ? document.documentElement.scrollLeft = pos.top - dx : document.body.scrollLeft = pos.top - dx;
  }
  function keyDownHandler(e) {
    try {
      if (e.isComposing || e.keyCode === 229) {
        return;
      }
      if (!keyCodes.includes(e.keyCode)) keyCodes.push(e.keyCode);

      if (!playingCanvas.classList.contains('hidden')) {
        //#region Arrows
        //left
        if (keyCodes[keyCodes.length - 1] === 37) {
          if(parseFloat(fontSizeSlider.value) >= 1.55) {
            let valueToSend = parseFloat(fontSizeSlider.value) - .1;
            if (valueToSend < 1.5) valueToSend = 1.5;
            fontSizeSlider.value = valueToSend
            fontSizeSliderHandler({target: {value: valueToSend}})
          }
        }   
        //up
        if (keyCodes[keyCodes.length - 1] === 38) {
          if(parseFloat(volumeSlider.value) <= .95) volumeSlider.value = parseFloat(volumeSlider.value) + .05;
          if (parseFloat(volumeSlider.value) > 1) volumeSlider.value = 1;
        }   
        //right
        if (keyCodes[keyCodes.length - 1] === 39) {
          if(parseFloat(fontSizeSlider.value) <= 7.25) {
            let valueToSend = parseFloat(fontSizeSlider.value) + .1;
            if (valueToSend > 7.25) valueToSend = 7.25;
            fontSizeSlider.value = valueToSend;
            fontSizeSliderHandler({target: {value: valueToSend}})
          }
        }   
        //down
        if (keyCodes[keyCodes.length - 1] === 40) {
          if(parseFloat(volumeSlider.value) >= .05) volumeSlider.value = parseFloat(volumeSlider.value) - .05;
          if (parseFloat(volumeSlider.value) < 0) volumeSlider.value = 0;
        }   
        //#endregion
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function keyUpHandler(e) {
    try {
      if (e.isComposing || e.keyCode === 229) {
        return;
      }
      console.log('e.keyCode =', e.keyCode);
      if (playingCanvas.classList.contains('hidden')) {
        keyUpBiddingPhase(e);
      } 
      else {
        keyUpPlayingPhase(e);
      }
      keyCodes = [];
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getIndexOfCurrentBidsSuit(currentBid) {
    if (!currentBid) return { bidNumberToUse: 'One', indexOfCurrentSuit: -1}
    const suitOrder = ['Club', 'Diamond', 'Heart', 'Spade', 'No Trump'];
    const split  = currentBid.split(' ');
    let currentBidNumber = split[0];
    const currentBidSuit = split.length === 3 ? [split[1], split[2]].join(' ') : split[1];
    return {bidNumberToUse: currentBidNumber, indexOfCurrentSuit: suitOrder.indexOf(currentBidSuit)};
  }
  function addStringAndInt(string, int) {
    const stringInt = convertNumberAsStringToInt(string);
    const newInt = stringInt + int;
    return convertIntToNumberString(newInt);
  }
  function convertIntToNumberString(int) {
    switch (int) {
      case 1:
        return "One";
      case 2:
        return "Two";
      case 3:
        return "Three";
      case 4:
        return "Four";
      case 5:
        return "Five";
      case 6:
        return "Six";
      case 7:
        return "Seven";
      default:
        return null;
    }
  }
  function getNextBidRow(currentNumber, isPreviousRow) {
    try {
      const currentIndex = numbersAsString.findIndex(ele => ele === currentNumber);
      let nextIndex =  currentIndex + (isPreviousRow ? -1 : 1);

      if (isPreviousRow && nextIndex < 0) nextIndex = numbersAsString.length - 1;
      if (!isPreviousRow && nextIndex > numbersAsString.length - 1) nextIndex = 0;
      return numbersAsString[nextIndex ];
    } catch (error) {
      console.error('error =', error);
    }
  }
  function focusDefaultButton() {
    try {
      focusBidButton({number: 'One', suit: 'Club'});
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getSuitFromKeyCode(keyCodes) {
    try {
      if (keyCodes.includes(keyAssignments.suits.clubs)) return 'Club';
      else if (keyCodes.includes(keyAssignments.suits.diamonds)) return 'Diamond';
      else if (keyCodes.includes(keyAssignments.suits.hearts)) return 'Heart';
      else if (keyCodes.includes(keyAssignments.suits.spades)) return 'Spade';
      else if (keyCodes.includes(keyAssignments.suits.noTrump)) return 'No_Trump';
    } catch (error) {
      console.error('error =', error);
    }
  }
  function focusBidButton ({number, suit = null, isRecursive = false, isPreviousColumn = false, isVerticalMovement = null}) {
    try {
      let element;

      if (number === currentBidRow) {
        if (isPreviousColumn) {
          if (currentBidColumn === 0) currentBidColumn = 4;
          else currentBidColumn--;
        }
        else {
          if (currentBidColumn === 4) currentBidColumn = 0;
          else currentBidColumn++;
        }
      }
      else currentBidColumn = 0;

      currentBidRow = number;
      resetBid(false);

      if (suit) element = document.querySelector(`#${number}_${suit}`);
      else element = document.querySelector(`#${number}_${suitOrder[currentBidColumn]}`);

      if (isRecursive) return element;
      else if (element.classList.contains('disabled')) {
        //Down Arrow
        if (typeof isVerticalMovement === 'number' && isVerticalMovement === 1) {
          const currentRowIndex = numbersAsString.findIndex(ele => ele === number);
          for (let i = 0; i < numbersAsString.length; i++) {
            const newNumber = getNextBidRow(numbersAsString[currentRowIndex + i], false);
            element = focusBidButton({number: newNumber, suit, isRecursive: true});
            if (!element.classList.contains('disabled')) {
              currentBidColumn = i;
              break;
            }
          }
        }
        //Up Arrow
        else if (typeof isVerticalMovement === 'number' && isVerticalMovement === -1) {
          const currentRowIndex = numbersAsString.findIndex(ele => ele === number);
          for (let i = 0; i < numbersAsString.length; i++) {
            const newNumber = getNextBidRow(numbersAsString[currentRowIndex - i], true);
            element = focusBidButton({number: newNumber, suit, isRecursive: true});
            if (!element.classList.contains('disabled')) {
              currentBidColumn = i;
              break;
            }
          }
        }
        //Left Arrow
        else if (isPreviousColumn) {
          for (let i = suitOrder.length - 1; i >= currentBidColumn; i--) {
            const suit = suitOrder[i];
            element = focusBidButton({number, suit, isRecursive: true});
            if (!element.classList.contains('disabled')) {
              currentBidColumn = i;
              break;
            }
          }
        }
        //Right Arrow
        else {
          for (let i = 1; i < suitOrder.length; i++) {
            const suit = suitOrder[i];
            element = focusBidButton({number, suit, isRecursive: true});
            if (!element.classList.contains('disabled')) {
              break;
            }
          }
        }
        
      }

      if (suit && !isPreviousColumn) currentBidColumn = suitOrder.indexOf(suit);
      
      element.classList.add('selected');
      currentSelection = {target: element};
      makeBidButton.className = 'btn btn-sm btn-outline-success bidButtonAnimation';
      resetButton.className = 'btn btn-sm btn-outline-danger';
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#region Drag Div
  // Make the DIV element draggable:
  dragElement(dealInformationDiv);
  dragElement(gameInformationDiv, true);

  function dragElement(elmnt, isGameInfoDiv) {
    try {
      let pos1 = 0,
        pos2 = 0,
        pos3 = 0,
        pos4 = 0;
      let bottomAsPercent;
      const header = document.getElementById(elmnt.id + "Header");
      if (header) {
        header.onmousedown = dragMouseDown;
      } else {
        elmnt.onmousedown = dragMouseDown;
      }

      function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();

        if (isGameInfoDiv) {
          // elmnt.style.bottom = 'auto';
        }

        // get the mouse cursor position at startup:
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;

        // call a function whenever the cursor moves:
        document.onmousemove = elementDrag;
      }

      function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        e.stopPropagation();

        // calculate the new cursor position:
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;

        // set the element's new position:
        const boundingRect = elmnt.getBoundingClientRect();
        let leftValue = elmnt.offsetLeft - pos1;
        let topValue = elmnt.offsetTop - pos2;
        let bottomValue = boundingRect.bottom;
        let bottomValueCalc = topValue + boundingRect.height;
        const addedPaddingToPreventStuckage = 600;

        if (
          leftValue < 0 ||
          topValue < 0 ||
          leftValue + elmnt.clientWidth > window.innerWidth
        )
          return;
        if (bottomValue < 0 || bottomValueCalc >= window.innerHeight + addedPaddingToPreventStuckage) {
          return;
        }

        elmnt.style.left = leftValue + "px";
        elmnt.style.top = topValue + "px";

        const bottomPercentDifference = (pos2 / window.innerHeight) * 100;
        if (isGameInfoDiv)
          elmnt.style.bottom = bottomAsPercent + bottomPercentDifference + "%";
        console.log("bottomAsPercent =", bottomAsPercent);
        console.log("bottomPercentDifference =", bottomPercentDifference);
      }

      function closeDragElement() {
        // stop moving when mouse button is released:
        document.onmouseup = null;
        document.onmousemove = null;
      }
      } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#endregion
  //#region Deal Summary Functions
  function createLastDealSummaryTable(
    lastDeal,
    nthDeal,
    isGameOver = false,
    isLastGame = true
  ) {
    appendDealSummaryTable(lastDeal, nthDeal, isGameOver);
    setTrickPoints(lastDeal, nthDeal);
    setupDealSummaryDetailButton(nthDeal);
    displayHandAsSpan(
      lastDeal.hands,
      nthDeal,
      null,
      "HandName",
      "Hand",
      null,
      "",
      lastDeal.contract
    );
    if (isLastGame) setupEventListenersForTable();
  }
  //#region Setting Up Event Listeners for Table
  function addRemoveClassFromChild(
    parentNode,
    classToApplyTo,
    classToAddRemove,
    shouldRemove
  ) {
    if (
      !parentNode ||
      !classToApplyTo ||
      shouldRemove === undefined ||
      shouldRemove === null
    )
      return;
    for (let i = 0; i < parentNode.childNodes.length; i++) {
      const childNode = parentNode.childNodes[i];
      if (childNode.classList && childNode.classList.contains(classToApplyTo)) {
        if (shouldRemove) childNode.classList.remove(classToAddRemove);
        else childNode.classList.add(classToAddRemove);
      }
    }
  }
  function setupEventListenersForTable() {
    try {
      const currentDealSummaryCardsDivs = [
        ...document.querySelectorAll(`.dealSummaryCardsPlayedRow`),
      ];
      for (let index = 0; index < currentDealSummaryCardsDivs.length; index++) {
        const div = currentDealSummaryCardsDivs[index];
        div.addEventListener("click", (e) => {
          e.preventDefault();
          let replaced = e.currentTarget.id.replace(/row/i, "Trick");
          replaced = replaced.replace(/played/i, "InHandDeal");
          const selection = document.querySelector(`#${replaced}`);
          if (selection.classList.contains("isNotSelected")) {
            selection.classList.remove("isNotSelected");
            selection.classList.add("isSelected");
            addRemoveClassFromChild(
              selection,
              "notSelectedItems",
              "selectedItems",
              false
            );
            addRemoveClassFromChild(
              selection,
              "notSelectedItems",
              "notSelectedItems",
              true
            );
          } else {
            selection.classList.remove("isSelected");
            selection.classList.add("isNotSelected");
            addRemoveClassFromChild(
              selection,
              "selectedItems",
              "notSelectedItems",
              false
            );
            addRemoveClassFromChild(
              selection,
              "selectedItems",
              "selectedItems",
              true
            );
          }
        });
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region appendDealSummaryTable Code
  function appendDealSummaryTable(lastDeal, nthDeal, isGameOver) {
    try {
      if (
        lastDeal === undefined ||
        lastDeal === null ||
        nthDeal === undefined ||
        nthDeal === null
      )
        return null;
      setupDealTableOutline(lastDeal, nthDeal, isGameOver);
      //getting the details of the table and setting the for this row
      for (let i = 0; i < lastDeal.cardPlayOrder.length; i++) {
        const cardAsNumber = lastDeal.cardPlayOrder[i];
        const roundNumber = Math.floor(i / 4);
        const trickNumber = roundNumber + 1;
        const roundWinners = lastDeal.roundWinners;
        // const round = lastDeal.cardPlayOrder.slice(roundNumber * 4, roundNumber * 4 + 4);
        //#region Get Lead Player and add a New Row
        if (i % 4 === 0) {
          //#region Add New Row Outline
          const wonRound = isRoundWon(roundWinners[roundNumber]);
          const dealSummaryTableBodyCurrent = document.querySelector(
            `#dealSummaryTableBody${nthDeal}`
          );
          dealSummaryTableBodyCurrent.innerHTML += `
                      <tr class=${wonRound ? "table-success" : "table-danger"}>
                          <th scope="row">${trickNumber}</th>
                          <td class="dealSummaryCardsPlayedRow" id="dealSummaryCardsPlayed${nthDeal}Row${roundNumber}">
                              <div class="dealSummaryCardsPlayedRowTop" id="dealSummary${nthDeal}CardsPlayedRowTop${roundNumber}"></div>
                              <div class="dealSummaryCardsPlayedRowBottom" id="dealSummary${nthDeal}CardsPlayedRowBottom${roundNumber}"></div>
                              <div class="dealSummaryCardsInHand isNotSelected" id="dealSummaryCardsInHandDeal${nthDeal}Trick${roundNumber}">
                                  <h5 class="notSelectedItems">Hands At Start of Trick ${
                                    roundNumber + 1
                                  }: </h5>
                              </div>
                          </td>
                          <td>${wonRound ? "Yes" : "No"}</td>
                      </tr>
                  `;
          const roundStartPlayer = getRoundStartPlayer(
            lastDeal,
            lastDeal.cardPlayOrder[i]
          );
          addDivsToCardsInHandDiv(
            nthDeal,
            roundNumber ? roundNumber : lastDeal.declarer,
            roundStartPlayer
          );
          //#endregion
        }
        //#endregion
        //#region Populate the currentRow
        const currentRowTop = document.querySelector(
          `#dealSummary${nthDeal}CardsPlayedRowTop${roundNumber}`
        );
        const currentRowBottom = document.querySelector(
          `#dealSummary${nthDeal}CardsPlayedRowBottom${roundNumber}`
        );
        const playerOfCard = getPlayerOfCard(cardAsNumber, lastDeal);
        const suitSpan = getSuitSpanElement(
          globals.getSuitFromNumber(cardAsNumber),
          roundNumber,
          "",
          false,
          true,
        );
        let suffix = ", ";
        if (i % 4 === 3) suffix = "";
        const boldCondition = roundWinners[roundNumber] === playerOfCard;
        const shouldBoldStart = boldCondition ? "<strong>" : "";
        const shouldBoldEnd = boldCondition ? "</strong>" : "";
        const topRowSpan = document.createElement("span");
        topRowSpan.innerHTML = `${shouldBoldStart}${convertIntCardValueToCharacter(
          cardAsNumber % 13
        )}${shouldBoldEnd}`;
        if (suitSpan) {
          topRowSpan.insertBefore(suitSpan, null);
        } else {
          topRowSpan.innerHTML = "N/A";
        }
        topRowSpan.innerHTML += `${suffix}`;
        const bottomRowHTML = `${shouldBoldStart}${
          playerOfCard ? playerOfCard : "N/A"
        }${shouldBoldEnd}${suffix}`;
        currentRowTop.appendChild(topRowSpan);
        currentRowBottom.innerHTML += bottomRowHTML;
        //#endregion
      }

      for (let i = 0; i < lastDeal.cardPlayOrder.length; i++) {
        if (i % 4 === 0) {
          const roundNumber = Math.floor(i / 4);
          populateDealSummaryCardsInHandDeal(lastDeal, nthDeal, roundNumber, i);
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function addDivsToCardsInHandDiv(nthDeal, roundNumber, roundStartPlayer) {
    try {
      const directions = ["north", "east", "south", "west"];
      const cardsInHandDiv = document.querySelector(
        `#dealSummaryCardsInHandDeal${nthDeal}Trick${roundNumber}`
      );
      if (!cardsInHandDiv) return;
      const roundStartPlayerSpot = getDirectionFromLocation(
        getLabelLocationFromBidder(roundStartPlayer)
      );

      let order;
      if (typeof roundStartPlayer !== "string")
        order = [directions[0], directions[1], directions[2], directions[3]];
      if (roundStartPlayerSpot.toLowerCase() === "north") {
        order = [directions[0], directions[1], directions[2], directions[3]];
      } else if (roundStartPlayerSpot.toLowerCase() === "east") {
        order = [directions[1], directions[2], directions[3], directions[0]];
      } else if (roundStartPlayerSpot.toLowerCase() === "south") {
        order = [directions[2], directions[3], directions[0], directions[1]];
      } else if (roundStartPlayerSpot.toLowerCase() === "west") {
        order = [directions[3], directions[0], directions[1], directions[2]];
      }

      for (let i = 0; i < order.length; i++) {
        const direction = order[i];
        const innerHTMLToAdd = `
                  <span id="${direction}HandName${nthDeal}Trick${roundNumber}" class="handNameTable">Tom</span> 
                  <span class="handDivider"> - </span> 
                  <span id="${direction}Hand${nthDeal}Trick${roundNumber}" class="handSpan"></span>
              `;
        const divToAdd = createElementFromInnerHTML(
          "div",
          {
            id: `${direction}HandDiv${nthDeal}Trick${roundNumber}`,
            classList: ["handDivTable", "notSelectedItems"],
          },
          innerHTMLToAdd
        );
        cardsInHandDiv.insertBefore(divToAdd, null);
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getRoundStartPlayer(lastDeal, roundStartCard) {
    try {
      if (
        lastDeal === undefined ||
        lastDeal === null ||
        roundStartCard === undefined ||
        roundStartCard === null
      )
        return null;
      for (const spot in seatingGlobal) {
        if (seatingGlobal.hasOwnProperty(spot)) {
          const user = seatingGlobal[spot];
          if (usersHandContainsCard(lastDeal, roundStartCard, user)) return user;
        }
      }
      return lastDeal.declarer;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function usersHandContainsCard(lastDeal, cardAsNumber, username) {
    try {
      const usersHand = lastDeal.hands[username];
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
  function setupDealTableOutline(lastDeal, nthDeal, isGameOver) {
    try {
      const contractSuitSpan = getSuitSpanElement(lastDeal.contract, nthDeal, "", true);
      const contractNumber = lastDeal.contract ? convertNumberAsStringToInt(lastDeal.contract) : "N/A";
      const isDeclarerVulnerable = getIsVulnerableFromDeal(lastDeal, nthDeal);
      const vulnerableValue = lastDeal.contract ? isDeclarerVulnerable ? "Yes" : "No" : 'N/A';
      const doubleValue =
        lastDeal.contract ? 
          lastDeal.doubleValue === 4
            ? "x4"
            : lastDeal.doubleValue === 2
            ? "Yes"
            : "No"
        : 
          'N/A'
        ;
      const honorsDiv =
        lastDeal.dealSummary.honorPoints !== null
          ? `
              <div class='dealSummaryHonors hidden'>
                  <h5>Honors: <strong><span id="dealSummaryInfo${nthDeal}Honors">N/A</span></strong></h5>
              </div>
          `
          : "";
      const dealSummaryTableInnerHTML = `
              <h4 id="dealSummaryHeaderTop"><span>Deal #</span><span>${
                nthDeal + 1
              }</span>:</h4>
              <div id="dealSummaryInfo${nthDeal}" class='dealSummaryInfo'>
                  <div class="dealSummaryHeaderBottomLeft">
                      <h5>Declarer: <strong><span class="dealSummaryInfoDeclarer" id="dealSummaryInfo${nthDeal}Declarer">${
        lastDeal.declarer
      }</span></strong></h5>              
                      <h5>Contract: <strong><span class="dealSummaryInfoContract" id="dealSummaryInfo${nthDeal}Contract">${contractNumber}</strong></h5>
                  </div>
                  <div id="dealSummaryDetailsButtonDiv">
                      <button id="dealSummaryTable${nthDeal}DetailsButton" class="btn btn-sm btn-secondary detailsButton">Show Details</button>
                  </div>
                  <div class="dealSummaryHeaderBottomRight">
                      <h5>Doubled: <strong><span id="dealSummaryInfo${nthDeal}Doubled">${doubleValue}</span></strong></h5>
                      <h5>Vulnerable: <strong><span id="dealSummaryInfo${nthDeal}Vulnerable">${vulnerableValue}</span></strong></h5>
                  </div>
              </div>
              <div id="dealSummaryTable${nthDeal}" class="mx-auto dealSummaryTable notSelectedTable">
                  <div id="handsDiv">
                      <div class="handDiv" id="northHandDiv">
                          <span class="handName" id='northHandName${nthDeal}'>North</span> - <span class="handDivTableTop" id="northHand${nthDeal}"></span>
                      </div>
                      <div class="handDiv" id="southHandDiv">
                          <span class="handName" id='southHandName${nthDeal}'>South</span> - <span class="handDivTableTop" id="southHand${nthDeal}"></span>
                      </div>
                      <div class="handDiv" id="eastHandDiv">
                          <span class="handName" id='eastHandName${nthDeal}'>East</span> - <span class="handDivTableTop" id="eastHand${nthDeal}"></span>
                      </div>
                      <div class="handDiv" id="westHandDiv">
                          <span class="handName" id='westHandName${nthDeal}'>West</span> - <span class="handDivTableTop" id="westHand${nthDeal}"></span>
                      </div>
                  </div>
                  <div class='biddingDivSummary' id='biddingDivSummary${nthDeal}'></div>
                  <table class="text-center table table-bordered">
                      <thead class="thead-dark">
                      <tr>
                          <th scope="col">Trick</th>
                          <th scope="col">Cards Played</th>
                          <th scope="col">Won</th>
                      </tr>
                      </thead>
                      <tbody class="dealSummaryTableBody" id="dealSummaryTableBody${nthDeal}"></tbody>
                  </table>
              </div>
              <div id="dealSummaryBottom">
                  <div class="dealSummaryBottomLeft">
                      <div class="dealSummaryTricksWon">
                          <h5 id="">Tricks Won: </h5>
                          <h5 id="dealSummary${nthDeal}TricksWonTotal" class="dealSummaryTricksWonTotal"><strong>0</strong></h5>
                      </div>
                      <div class="dealSummaryPointsContractPoints">
                          <h5 id="">Contract Pts: </h5>
                          <h5 id="dealSummary${nthDeal}PointsContractPointsTotal" class="dealSummaryPointsContractPointsTotal"><strong>0</strong></h5>
                      </div>
                  </div>
                  <div class="dealSummaryBottomMiddle">
                      <div class="dealSummaryTricksNeeded">
                          <h5 id="dealSummary${nthDeal}TricksNeededLabel">Needed: </h5>
                          <h5 id="dealSummary${nthDeal}TricksNeededTotal" class="dealSummaryTricksNeededTotal"><strong>0</strong></h5>
                      </div>
                      <div class="dealSummaryPointsOverTrickPoints">
                          <h5 id="">Overtrick Pts: </h5>
                          <h5 id="dealSummary${nthDeal}PointsOverTrickPointsTotal" class="dealSummaryPointsOverTrickPointsTotal"><strong>0</strong></h5>
                      </div>
                  </div>
                  <div class="dealSummaryBottomRight">
                      <div class="dealSummaryTricksResult">
                          <h5 id="dealSummary${nthDeal}TricksResultLabel">Result: </h5>
                          <h5 id="dealSummary${nthDeal}TricksResultTotal" class="dealSummaryTricksResultTotal"><strong>0</strong></h5>
                      </div>
                      <div class="dealSummaryPointsUnderTrickPoints">
                          <h5 id="">Undertrick Pts: </h5>
                          <h5 id="dealSummary${nthDeal}PointsUnderTrickPointsTotal" class="dealSummaryPointsUnderTrickPointsTotal"><strong>0</strong></h5>
                      </div>
                  </div>
              </div>
              ${honorsDiv}
              <div class="hidden slamBonusDiv" id="slamBonusDiv${nthDeal}">
                  <h3 id="slamBonus${nthDeal}Label">Small Slam!</h3>
                  <h5>Slam Bonus: <span id="slamBonus${nthDeal}">Points Go Here</span></h5>
              </div>
          `;
      const declarerMadeContract =
        lastDeal.dealSummary.tricks >= lastDeal.dealSummary.tricksNeeded;

      //#region Getting clientsTeamWon
      let clientsTeamWon = false;
      if (
        declarersSpot.toLowerCase() === "north" ||
        declarersSpot.toLowerCase() === "south"
      ) {
        if (
          declarerMadeContract &&
          (spot.toLowerCase() === "north" || spot.toLowerCase() === "south")
        )
          clientsTeamWon = true;
        else if (
          !declarerMadeContract &&
          (spot.toLowerCase() === "east" || spot.toLowerCase() === "west")
        )
          clientsTeamWon = true;
      } else if (
        declarersSpot.toLowerCase() === "east" ||
        declarersSpot.toLowerCase() === "west"
      ) {
        if (
          declarerMadeContract &&
          (spot.toLowerCase() === "east" || spot.toLowerCase() === "west")
        )
          clientsTeamWon = true;
        else if (
          !declarerMadeContract &&
          (spot.toLowerCase() === "north" || spot.toLowerCase() === "south")
        )
          clientsTeamWon = true;
      }
      //#endregion

      const sounds = globals.getSounds();
      if (sounds) {
        if (clientsTeamWon && !isGameOver) sounds.dealSummaryWon.play();
        else if (!isGameOver) sounds.dealSummaryLost.play();
      }

      const dealSummaryButtons = document.querySelector('#dealSummaryButtons');
      dealSummaryButtons.classList.remove('won');
      dealSummaryButtons.classList.remove('loss');
      if (clientsTeamWon) dealSummaryButtons.classList.add('won');
      else  dealSummaryButtons.classList.add('loss');

      const attributesAndValues = {
        id: `dealSummary${nthDeal}`,
        classList: [
          isGameOver ? null : "dealSummaryLast",
          "dealSummary",
          "container",
          "jumbotron",
          "text-center",
          lastDeal.contract ? clientsTeamWon ? "won" : "loss" : "dealSummaryUnplayed",
        ],
      };
      const dealSummaryTable = createElementFromInnerHTML(
        "div",
        attributesAndValues,
        dealSummaryTableInnerHTML
      );
      document.body.insertBefore(dealSummaryTable, readyToContinueTable);
      const contractSpan = document.querySelector(
        `#dealSummaryInfo${nthDeal}Contract`
      );
      contractSpan.insertBefore(contractSuitSpan, null);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function populateDealSummaryCardsInHandDeal(
    lastDeal,
    nthDeal,
    roundNumber,
    iterationCount
  ) {
    displayHandAsSpan(
      lastDeal.hands,
      nthDeal,
      roundNumber,
      "HandName",
      "Hand",
      lastDeal.cardPlayOrder.slice(0, iterationCount),
      `Trick${roundNumber}`,
      lastDeal.contract
    );
  }
  function getPlayerOfCard(cardAsNumber, lastDeal) {
    try {
      //returns a string representing the person who had the cardAsNumber in their hand
      if (cardAsNumber === undefined || cardAsNumber === null || !lastDeal)
        return null;
      for (const direction in seatingGlobal) {
        if (seatingGlobal.hasOwnProperty(direction)) {
          const usernameToCheck = seatingGlobal[direction];
          const usersHand = lastDeal.hands[usernameToCheck];
          if (!usersHand) return null;
          for (let i = 0; i < usersHand.length; i++) {
            const suit = usersHand[i];
            for (let j = 0; j < suit.length; j++) {
              const cardAsNumberInHand = suit[j];
              if (cardAsNumber === cardAsNumberInHand) {
                return usernameToCheck;
              }
            }
          }
        }
      }
      return null;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function isRoundWon(roundWinner) {
    try {
      if (roundWinner === undefined || roundWinner === null) return null;
      if (seatingGlobal === undefined || seatingGlobal === null) return null;
      let partnerName;
      if (spot.toLowerCase() === "north") partnerName = seatingGlobal.south;
      else if (spot.toLowerCase() === "south") partnerName = seatingGlobal.north;
      else if (spot.toLowerCase() === "east") partnerName = seatingGlobal.west;
      else if (spot.toLowerCase() === "west") partnerName = seatingGlobal.east;
      else partnerName = "";
      return username === roundWinner || partnerName === roundWinner;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getIsVulnerableFromDeal(deal, nthDeal) {
    try {
      //returns true or false if declarer for deal is vulnerable this deal
      if (!deal || !deal.northSouth || !deal.eastWest) return false;
      console.log("deal.northSouth =", deal.northSouth);
      console.log("deal.eastWest =", deal.eastWest);

      //#region get declarer's spot
      for (const spotInDeal in seatingGlobal) {
        if (seatingGlobal.hasOwnProperty(spotInDeal)) {
          const username = seatingGlobal[spotInDeal];
          if (username === deal.declarer) declarersSpot = spotInDeal;
        }
      }
      //#endregion

      //#region Get teamToGet
      let teamToGet;
      if (
        declarersSpot.toLowerCase() === "north" ||
        declarersSpot.toLowerCase() === "south"
      )
        teamToGet = deal.northSouth;
      else if (
        declarersSpot.toLowerCase() === "east" ||
        declarersSpot.toLowerCase() === "west"
      )
        teamToGet = deal.eastWest;
      //#endregion

      if (
        teamToGet.vulnerableTransitionIndex === null ||
        nthDeal <= teamToGet.vulnerableTransitionIndex
      )
        return false;
        else return true;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function createElementFromInnerHTML(
    elementName,
    attributesAndValues,
    innerHTML = ""
  ) {
    try {
      const element = document.createElement(elementName);
      for (const attribute in attributesAndValues) {
        if (attributesAndValues.hasOwnProperty(attribute)) {
          const value = attributesAndValues[attribute];
          if (attribute.match(/classlist/i)) {
            for (let i = 0; i < value.length; i++) {
              const classToAdd = value[i];
              if (classToAdd) element.classList.add(classToAdd);
            }
          } else {
            element[attribute] = value;
          }
        }
      }
      element.innerHTML = innerHTML;
      return element;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function hideAllDealSummaryTables(showLastTable) {
    try {
      const dealSummaryTables = document.querySelectorAll(".dealSummary");
      for (let i = 0; i < dealSummaryTables.length; i++) {
        const dealSummaryTable = dealSummaryTables[i];
        if (showLastTable && i === dealSummaryTables.length - 1) break;
        dealSummaryTable.classList.add("hidden");
        dealSummaryTable.classList.remove("dealSummaryLast");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function showAllDealSummaryTables() {
    try {
      const dealSummaryTables = document.querySelectorAll(".dealSummary");
      for (let i = 0; i < dealSummaryTables.length; i++) {
        const dealSummaryTable = dealSummaryTables[i];
        dealSummaryTable.classList.remove("hidden");
        dealSummaryTable.classList.remove("dealSummaryLast");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region displayHandAsSpan Code
  function displayHandAsSpan(
    hands,
    nthDeal,
    roundNumber,
    handNameSpanName,
    handSpanName,
    cardsToSkipArray,
    handSpanNameSuffix = "",
    contract
  ) {
    try {
      if (!hands) return null;
      callsToDisplayAsSpan++;
      let i = -0;
      for (const usernameInHands in hands) {
        if (hands.hasOwnProperty(usernameInHands)) {
          const userSpot = getUsersSpot(usernameInHands).toLowerCase();
          nameHandLabel(
            handNameSpanName,
            usernameInHands,
            userSpot,
            roundNumber,
            nthDeal
          );
          const usersHand = sortHandAccordingToPreference(
            hands[usernameInHands],
            contract
          );
          const toAdd = [];
          usersHand.flatten(3).forEach((cardAsNumber) => {
            if (
              cardsToSkipArray === undefined ||
              cardsToSkipArray === null ||
              (Array.isArray(cardsToSkipArray) &&
                !cardsToSkipArray.includes(cardAsNumber))
            ) {
              toAdd.push(cardAsNumber);
            }
          });

          let currentSuit = null,
            spanElement,
            j = -1;
          const handDiv = document.querySelector(
            `#${userSpot}${handSpanName}${nthDeal}${handSpanNameSuffix}`
          );
          toAdd.forEach((cardAsNumber) => {
            const value = cardAsNumber % 13;
            const suitOfCard = globals.getSuitFromNumber(cardAsNumber);
            let valueAsCharacter = convertIntCardValueToCharacter(value);
            if (valueAsCharacter === "10") valueAsCharacter = "T";

            if (suitOfCard !== currentSuit) {
              j++;
              spanElement = getSuitSpanElement(
                suitOfCard,
                `${callsToDisplayAsSpan}${i}${j}`,
                userSpot,
                false,
                true,
              );
              spanElement.innerHTML += `: ${valueAsCharacter}`;
              if (handDiv) handDiv.insertBefore(spanElement, null);
              currentSuit = suitOfCard;
            } else {
              const spanToAddTo = document.querySelector(
                `#${suitOfCard.toLowerCase()}Span${userSpot}Round${callsToDisplayAsSpan}${i}${j}`
              );
              if (spanToAddTo) spanToAddTo.innerHTML += `${valueAsCharacter}`;
            }
          });
        }
        i++;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function sortHandAccordingToPreference(handArray, contract) {
    try {
      if (!handArray) return null;
      return globals.reArrangeHandArray(
        handArray,
        clientPreferences.suitSortPreference,
        clientPreferences.trumpOnLeftHand,
        contract
      );
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getUsersSpot(username) {
    try {
      if (!username) return "";
      for (const direction in seatingGlobal) {
        if (seatingGlobal.hasOwnProperty(direction)) {
          const userInSeating = seatingGlobal[direction];
          if (userInSeating === username) return direction;
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region Setting Up Buttons and Table
  function setupDealSummaryDetailButton(nthDeal) {
    try {
      const detailsButton = document.querySelector(
        `#dealSummaryTable${nthDeal}DetailsButton`
      );
      detailsButton.addEventListener("click", (e) => {
        const tableToToggle = document.querySelector(
          `#dealSummaryTable${nthDeal}`
        );
        tableToToggle.classList.toggle("selectedTable");

        if (detailsButton.innerHTML.match(/hide/i))
          detailsButton.innerHTML = "Show Details";
        else detailsButton.innerHTML = "Hide Details";
      });
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setupDealSummaryContinueQuitButtons(gameState) {
    try {
      // if (currentBidder) currentBidder.classList.add("hidden");
      if (bidContainer) bidContainer.classList.add('hidden');
      if (!shouldSetupContinueAndQuitButons) {
        dealSummaryButtons.classList.remove("hidden");
        continueButton.classList.remove("disabled");
        quitButton.classList.remove("disabled");
        setupDealSummaryButtonsListeners(gameState);
        return;
      }
      const buttonsDiv = document.createElement("div");
      buttonsDiv.classList.add("container");
      buttonsDiv.id = "dealSummaryButtons";
      const innerHTML = `
              <button id='dealSummaryContinueButton' class="btn btn-md btn-success">Continue</button>
              <button id='dealSummaryQuitButton' class="btn btn-md btn-danger">Quit</button>`;
      buttonsDiv.innerHTML = innerHTML;
      document.body.insertBefore(buttonsDiv, copyright);

      setupDealSummaryButtonsListeners(gameState);

      shouldSetupContinueAndQuitButons = false;
      dealSummaryButtons = document.querySelector("#dealSummaryButtons");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function continuePlaying() {
    try {
      keyCodes = [];
      socket
        .binary(false)
        .emit("sendReadyToContinueStatus", {
          username,
          roomName: room,
          originalSocketId: socketId,
          isReady: true,
        });
      readyToContinueStatus = true;
      continueButton.classList.add("disabled");
      quitButton.classList.add("disabled");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function continueBidding() {
    try {
      keyCodes = [];
      socket.binary(false).emit("readyToContinueToPlaying", { username, room });
      readyToContinueStatus = true;
      continueButton.classList.remove("startAnimation");
      continueButton.classList.add("disabled");
      quitButton.classList.add("disabled");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function quitPlaying() {
    try {
      const ans = confirm("Are you sure you want to quit?");
      if (!ans) return;
      socket.binary(false).emit("userQuit", { username, roomName: room });
      window.location.href = `/start?username=${username}`;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setupDealSummaryButtonsListeners(gameState) {
    try {
      if (!continueButton)
        continueButton = document.querySelector("#dealSummaryContinueButton");
      if (!quitButton)
        quitButton = document.querySelector("#dealSummaryQuitButton");
      quitButton.addEventListener("click", quitPlaying);

      if (gameState === "playing") {
        continueButton.removeEventListener("click", continueBidding);
        continueButton.addEventListener("click", continuePlaying);
      } else if (gameState === "bidding") {
        continueButton.removeEventListener("click", continuePlaying);
        continueButton.addEventListener("click", continueBidding);
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function toggleBiddingForReadyToContinueTable(gameState) {
    try {
      const readyToContinueBiddingLabel = document.querySelector(
        "#readyToContinueBiddingLabel"
      );
      if (gameState == "bidding") {
        sidebar.classList.add("hidden");
        sidebarFull.classList.add("hidden");
        readyToContinueTable.classList.add("bidding");
        dealSummaryButtons.classList.add("bidding");
        if (dealSummaryButtons) dealSummaryButtons.classList.remove("hidden");
        readyToContinueBiddingLabel.classList.remove("hidden");
        readyToContinueTable.classList.remove("hidden");
        
        const sound = new Howl({
          src: ['/sounds/bell.mp3'],
          volume: window.localStorage.getItem('defaultVolume') ? parseFloat(window.localStorage.getItem('defaultVolume')) : clientPreferences.sound.defaultVolume,
        });
        sound.play();
        scrollToBottom();
      } else {
        readyToContinueTable.classList.remove("bidding");
        dealSummaryButtons.classList.remove("bidding");
        readyToContinueBiddingLabel.classList.add("hidden");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setupReadyToContinueTable(gameState = "playing", exposedHandName) {
    try {
      if (!shouldSetupReadyToContinueTable) {
        readyToContinueTable.classList.remove("hidden");
        const readySymbols = document.querySelectorAll(".readySymbol");
        for (let i = 0; i < readySymbols.length; i++) {
          const readySymbol = readySymbols[i];
          readySymbol.classList.add("hidden");
        }
        const notReadySymbols = document.querySelectorAll(".notReadySymbol");
        for (let i = 0; i < notReadySymbols.length; i++) {
          const notReadySymbol = notReadySymbols[i];
          notReadySymbol.classList.remove("hidden");
        }
        
        if (exposedHandName) {
          const hiddenPlayer = document.querySelector(`#${exposedHandName}Row`);
          hiddenPlayer.classList.add('hidden');
        }
        
        toggleBiddingForReadyToContinueTable(gameState);
        return;
      }
      const attributesAndValues = {
        id: `readyToContinueTable`,
        classList: ["container", "jumbotron", "text-center"],
      };
      const innerHTML = `
              <div id='readyToContinueBiddingLabel'>Click 'Continue' to Start</div>
              <table class="table text-center">
                  <thead>
                    <tr>
                      <th scope="col">Username</th>
                      <th id='readyToContinueLabel' scope="col">Ready To Continue</th>
                    </tr>
                  </thead>
                  <tbody id="readyToContinueTableBody"></tbody>
              </table>`;
      readyToContinueTable = createElementFromInnerHTML(
        "div",
        attributesAndValues,
        innerHTML
      );
      document.body.insertBefore(readyToContinueTable, dealSummaryButtons);
      populateUsersInReadyToContinueTable(exposedHandName);
      shouldSetupReadyToContinueTable = false;
      toggleBiddingForReadyToContinueTable(gameState);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function populateUsersInReadyToContinueTable(exposedHandName) {
    try {
      const readyToContinueTableBody = document.querySelector(
        "#readyToContinueTableBody"
      );
      for (const direction in seatingGlobal) {
        if (seatingGlobal.hasOwnProperty(direction)) {
          const usernameOfPlayer = seatingGlobal[direction];
          const newRowHTML = `
                      <tr id="${usernameOfPlayer}Row">
                          <td>${
                            usernameOfPlayer === username
                              ? "You"
                              : usernameOfPlayer
                          }</td>
                          <td>
                            <span id="ready${usernameOfPlayer}" class="hidden readySymbol">&check;</span>
                            <span id="notReady${usernameOfPlayer}" class="notReadySymbol">&times;</span>
                          </td>
                      </tr>
                  `;
          readyToContinueTableBody.innerHTML += newRowHTML;
          if (usernameOfPlayer === exposedHandName) {
            document.querySelector(`#${usernameOfPlayer}Row`).classList.add('hidden');
            continue
          };
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region setTrickPoints Code
  function setTrickPoints(lastDeal, nthDeal) {
    try {
      if (!lastDealSummary) return null;
      console.log("setTrickPoints-------------------------------------------");
      console.dir(lastDealSummary);
      //#region Init
      const tricksNeededLabel = document.querySelector(
        `#dealSummary${nthDeal}TricksNeededLabel`
      );
      const tricksWonTotal = document.querySelector(
        `#dealSummary${nthDeal}TricksWonTotal`
      );
      const tricksNeededTotal = document.querySelector(
        `#dealSummary${nthDeal}TricksNeededTotal`
      );
      const tricksResult = document.querySelector(
        `#dealSummary${nthDeal}TricksResultTotal`
      );
      const contractPointsLabel = document.querySelector(
        `#dealSummary${nthDeal}PointsContractPointsTotal`
      );
      const overTrickPointsLabel = document.querySelector(
        `#dealSummary${nthDeal}PointsOverTrickPointsTotal`
      );
      const underTrickPointsLabel = document.querySelector(
        `#dealSummary${nthDeal}PointsUnderTrickPointsTotal`
      );
      const slamPointsLabel = document.querySelector(`#slamBonus${nthDeal}`);
      const trickDifference =
        lastDealSummary.tricks - lastDealSummary.tricksNeeded;
      const result =
        trickDifference === 0
          ? "<strong>Made It</strong>"
          : trickDifference > 0
          ? `<strong>+${trickDifference}</strong>`
          : `<strong>${trickDifference}</strong>`;
      //#endregion

      if (tricksResult) {
        if (result.search(/NaN/) === -1) tricksResult.innerHTML = result;
        else tricksResult.innerHTML = '<strong>N/A</strong>';
      }

      if (lastDeal.contract) {
        //#region Setting Labels for Winning Team
        if (tricksWonTotal)
          tricksWonTotal.innerHTML = lastDealSummary.tricks
            ? `<strong>${lastDealSummary.tricks}</strong>`
            : `<strong>0</strong>`;
        if (tricksNeededTotal)
          tricksNeededTotal.innerHTML = lastDealSummary.tricksNeeded
            ? `<strong>${lastDealSummary.tricksNeeded}</strong>`
            : `<strong>0</strong>`;
            
      
        if (contractPointsLabel)
          contractPointsLabel.innerHTML = lastDealSummary.contractPoints
            ? `<strong>${lastDealSummary.contractPoints}</strong>`
            : `<strong>0</strong>`;
        if (overTrickPointsLabel)
          overTrickPointsLabel.innerHTML = lastDealSummary.overTrickPoints
            ? `<strong>${lastDealSummary.overTrickPoints}</strong>`
            : `<strong>0</strong>`;
        if (underTrickPointsLabel)
          underTrickPointsLabel.innerHTML = lastDealSummary.underTrickPoints
            ? `<strong>-${lastDealSummary.underTrickPoints}</strong>`
            : `<strong>0</strong>`;
        if (slamPointsLabel)
          slamPointsLabel.innerHTML = lastDealSummary.slamBonus
            ? `<strong>${lastDealSummary.slamBonus}</strong>`
            : `<strong>0</strong>`;
        if (lastDealSummary.slamBonus > 0)
          document
            .querySelector(`#slamBonusDiv${nthDeal}`)
            .classList.remove("hidden");
        if (
          lastDealSummary.slamBonus === 1000 ||
          lastDealSummary.slamBonus === 1500
        )
          document.querySelector(`#slamBonus${nthDeal}Label`).textContent =
            "Grand Slam!";
        console.log("honorPoints =", lastDeal.dealSummary.honorPoints);
        if (lastDeal.dealSummary.honorPoints !== null) {
          document.querySelector(`#dealSummaryInfo${nthDeal}Honors`).textContent =
            lastDeal.dealSummary.honorPoints;
        }
        //#endregion
        //#region Setting Labels for Losing Team
        const shouldChangeLabel = isClientOnDealersTeam(lastDeal);
        if (!shouldChangeLabel) {
          if (
            !tricksNeededLabel ||
            !tricksNeededTotal ||
            !tricksWonTotal ||
            !underTrickPointsLabel ||
            !contractPointsLabel ||
            !overTrickPointsLabel
          )
            return;
          // tricksNeededLabel.innerHTML = "Tricks to Set: ";
          // tricksNeededTotal.innerHTML = `<strong>${14 - lastDealSummary.tricksNeeded}</strong>`;
          // tricksWonTotal.innerHTML = `<strong>${13 - lastDealSummary.tricks}</strong>`
          underTrickPointsLabel.innerHTML = `<strong>${lastDealSummary.underTrickPoints}</strong>`;
          overTrickPointsLabel.innerHTML = lastDealSummary.overTrickPoints
            ? `<strong>-${lastDealSummary.overTrickPoints}</strong>`
            : `<strong>0</strong>`;
          contractPointsLabel.innerHTML = lastDealSummary.contractPoints
            ? `<strong>-${
                lastDealSummary.slamBonus
                  ? lastDealSummary.slamBonus + lastDealSummary.contractPoints
                  : lastDealSummary.contractPoints
              }</strong>`
            : `<strong>0</strong>`;
          document.querySelector(`#slamBonusDiv${nthDeal}`).classList.add("hidden");
        }
        //#endregion
      }
      else {
        debugger
        const NALabel = '<strong>N/A</strong>';
        if (tricksWonTotal) tricksWonTotal.innerHTML = NALabel; 
        if (tricksNeededTotal) tricksNeededTotal.innerHTML = NALabel; 
        if (tricksResult) tricksResult.innerHTML = NALabel; 
        if (contractPointsLabel) contractPointsLabel.innerHTML = NALabel; 
        if (overTrickPointsLabel) overTrickPointsLabel.innerHTML = NALabel; 
        if (underTrickPointsLabel) underTrickPointsLabel.innerHTML = NALabel; 
        if (slamPointsLabel) slamPointsLabel.innerHTML = NALabel;
      }

    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#endregion
  //#region Game Over Functions
  function gameDoneSummary(toDisplay, gameRoundEndingScores) {
    try {
      //#region Changing Continue Button to Play Again and X icons to ?
      document.querySelector("#readyToContinueLabel").textContent =
        "Want to Play Again?";
      continueButton.textContent = "Play Again";
      const notReadysIcons = document.querySelectorAll(`.fa-times`);
      for (let i = 0; i < notReadysIcons.length; i++) {
        const iconItem = notReadysIcons[i];
        iconItem.classList.remove("fa-times");
        iconItem.classList.add("fa-question");
      }
      //#endregion
      //#region Removing All Tables Created
      const tables = document.querySelectorAll(".dealSummary");
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        table.remove();
      }
      //#endregion
      //#region Generating All Tables with Dividers
      for (let i = 0; i < toDisplay.length; i++) {
        const deal = toDisplay[i];
        lastDealSummary = deal.dealSummary;
        const lastDeal = i === toDisplay.length - 1;

        if (deal.cardPlayOrder.length < 52) {
          deal.contract = null;
          deal.declarer = '<strong>N/A</strong>'
        }

        createLastDealSummaryTable(deal, i, true, lastDeal);
        addDivider(`dealSummary${i}`, i);
        isSecondDouble = false;
        const firstFourBids = deal.bids.slice(0,4);
        debugger;
        populateBiddingDiv(deal.bids, i, true, firstFourBids);
      }
      //#endregion
      createGameSummaryTable();
      addDivider("finalScoreSummary");
      const { totalScores, winningTeam } = populateGameSummaryTable(
        toDisplay,
        gameRoundEndingScores
      );
      document.querySelector("#resultSentence").textContent = quote.text;
      showAllDealSummaryTables();
      hideThirdRow();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function createGameSummaryTable() {
    try {
      const finalSummaryInnerHTML = `
              <h4>Score Summary</h4>
                  <div id="finalScoreTable">
                      <h5 class="tableTopLeft">Team:</h5>
                      <h5 class="tableTopLeft">We:</h5>
                      <h5 class="tableTopLeft tableRight">They:</h5>
                      <h5 class="tableTopLeft">Above Points:</h5>
                      <h5 class="tableTopLeft" id="aboveScoreWe">N/A</h5>
                      <h5 class="tableTopLeft tableRight" id="aboveScoreThey">N/A</h5>
                      <h5 class="tableTopLeft">1st Game:</h5>
                      <h5 class="tableTopLeft" id="firstGameScoreWe">N/A</h5>
                      <h5 class="tableTopLeft tableRight" id="firstGameScoreThey">N/A</h5>
                      <h5 class="tableTopLeft">2nd Game:</h5>
                      <h5 class="tableTopLeft" id="secondGameScoreWe">N/A</h5>
                      <h5 class="tableTopLeft tableRight" id="secondGameScoreThey">N/A</h5>
                      <h5 class="tableTopLeft" id='thirdGameLabel'>3rd Game:</h5>
                      <h5 class="tableTopLeft" id="thirdGameScoreWe">N/A</h5>
                      <h5 class="tableTopLeft tableRight" id="thirdGameScoreThey">N/A</h5>
                      <h5 class="tableTopLeft">Rubber Bonus:</h5>
                      <h5 class="tableTopLeft" id="rubberBonusWe">N/A</h5>
                      <h5 class="tableTopLeft tableRight" id="rubberBonusThey">N/A</h5>
                      <h5 class="tableTopLeft tableBottom">Total:</h5>
                      <h5 class="tableTopLeft tableBottom" id="totalScoreWe">N/A</h5>
                      <h5 class="tableTopLeft tableBottom tableRight" id="totalScoreThey">N/A</h5>
                  </div>
              <p id='resultSentence' class="">Game Over!</p>
          `;
      const finalScoreSummary = createElementFromInnerHTML(
        "div",
        { classList: ["text-center", "container"] },
        finalSummaryInnerHTML
      );
      finalScoreSummary.id = "finalScoreSummary";
      const readyToContinueTable = document.querySelector(
        "#readyToContinueTable"
      );
      document.body.insertBefore(finalScoreSummary, readyToContinueTable);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getWinningTeam(gameRoundEndingScores) {
    try {
      if (
        gameRoundEndingScores.northSouth[
          gameRoundEndingScores.northSouth.length - 1
        ] >= 100
      )
        return "north";
      else if (
        gameRoundEndingScores.eastWest[
          gameRoundEndingScores.eastWest.length - 1
        ] >= 100
      )
        return "east";
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
  function addDivider(idOfItemToInsertBefore) {
    try {
      const itemToInsertBefore = document.querySelector(
        `#${idOfItemToInsertBefore}`
      );
      const divider = document.createElement("hr");
      divider.classList.add("divider");
      document.body.insertBefore(divider, itemToInsertBefore);
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region Deal Info Code
  function animateDealInfo(isOpening = true) {
    try {
      if (isOpening) {
        dealInfoButton.classList.toggle("slide");
        dealInformationDiv.classList.toggle("slide");
        if (dealInformationDiv.classList.contains("top"))
          dealInformationDiv.classList.toggle("topZero");
        else dealInformationDiv.classList.toggle("leftZero");
      } else {
        dealInformationDiv.classList.toggle("slide");
        if (dealInformationDiv.classList.contains("top"))
          dealInformationDiv.classList.toggle("topZero");
        else dealInformationDiv.classList.toggle("leftZero");
        dealInfoButton.classList.toggle("slide");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function fillInDealInfoDetails(
    exposedHandLocation,
    exposedHandSpot,
    contractFromServer,
    trickCounts,
    roundWinner,
    doubleMultiplier
  ) {
    try {
      if (exposedHandLocation.toLowerCase() === locations.left) {
        dealInfoButton.classList.add("top");
        dealInformationDiv.classList.add("top");
      } else if (exposedHandLocation.toLowerCase() === locations.bottom) {
        dealInfoButton.classList.add("exposedBottom");
        dealInformationDiv.classList.add("exposedBottom");
      }

      contract.innerHTML = getImgHTMLFromBid(contractFromServer).replace('redSuitBidding', 'redSuitPlaying');
      vulnerable.innerHTML = globals.getVulnerableStatus();
      tricksLeft.innerHTML = globals.getTricksLeft();
      const denomenator = setTrickLabelAndGetDenomenator(contractFromServer, exposedHandSpot);
      const numerator = setTrickNumerator(
        trickCounts ? trickCounts.northSouthTrickCount : null,
        trickCounts ? trickCounts.eastWestTrickCount : null
      );
      setYouNeed(parseInt(tricksNeededDenominator.textContent - tricksNeededNumerator.textContent));
      setLastTrick(roundWinner);
      checkMadeSetBid(tricksNeededDenominator.textContent - tricksNeededNumerator.textContent);
      setDoubleLabel(doubleMultiplier);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setYouNeed(youNeedAmount) {
    try {
      if (youNeedAmount <= 0) youNeedAmount = 0;
      youNeedTrickCount.textContent = youNeedAmount;
      youCanLoseCount.textContent = parseInt(tricksLeft.textContent) - youNeedAmount;
      if (parseInt(youCanLoseCount.textContent) < 0) youCanLoseCount.textContent = '-1';
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setDoubleLabel(doubleMultiplier) {
    try {
      let textToUse = '';
      if (doubleMultiplier === 2) textToUse = "x2";
      else if (doubleMultiplier === 4) textToUse = "x4";

      contract.innerHTML += `
        <span id="doubleLabel"> ${textToUse}</span>
      `;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setTrickLabelAndGetDenomenator(contract, exposedHandSpot) {
    try {
      if (contract === undefined || contract === null) contract = "";

      const number = convertNumberAsStringToInt(contract.split(" ")[0]);
      isOffense = false;
      if (
        exposedHandSpot.toLowerCase() === directions.north ||
        exposedHandSpot.toLowerCase() === directions.south
      ) {
        if (
          spot.toLowerCase() === directions.north ||
          spot.toLowerCase() === directions.south
        ) {
          isOffense = true;
        }
      } else if (
        exposedHandSpot.toLowerCase() === directions.east ||
        exposedHandSpot.toLowerCase() === directions.west
      ) {
        if (
          spot.toLowerCase() === directions.east ||
          spot.toLowerCase() === directions.west
        ) {
          isOffense = true;
        }
      }

      let numberToUse = -1;
      if (isOffense) numberToUse = 6 + number;
      else {
        tricksNeededLabel.innerHTML = "To Set: ";
        numberToUse = 13 - (6 + number) + 1;
      }
      tricksNeededDenominator.textContent = numberToUse;
      return numberToUse;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setTrickNumerator(northSouthTrickCount, eastWestTrickCount) {
    try {
      if (northSouthTrickCount !== null && eastWestTrickCount !== null) {
        if (spot.toLowerCase() === "north" || spot.toLowerCase() === "south")
          tricksNeeded = String(northSouthTrickCount);
        else tricksNeeded = String(eastWestTrickCount);
        tricksNeededNumerator.textContent = tricksNeeded;
      } else {
        tricksNeededNumerator.textContent = 0;
      }
      return tricksNeeded;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setTricksLeft() {
    try {
      tricksLeft.textContent = globals.getTricksLeft();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setLastTrick(roundWinner = null) {
    try {
      if (roundWinner === null) return;
      const roundWinnerLocation = getLabelLocationFromBidder(
        globals.getRoundStartPlayerFromClient()
      );
      const playedCards = globals.getPlayedCardsFromClient();
      const lastRound = getLastRound(playedCards);
      let orderOfNames = [bottomUser, leftUser, topUser, rightUser];
      if (roundWinnerLocation && roundWinnerLocation.toLowerCase() === locations.left) {
        orderOfNames = [leftUser, topUser, rightUser, bottomUser];
      } else if (roundWinnerLocation && roundWinnerLocation.toLowerCase() === locations.top) {
        orderOfNames = [topUser, rightUser, bottomUser, leftUser];
      } else if (roundWinnerLocation && roundWinnerLocation.toLowerCase() === locations.right) {
        orderOfNames = [rightUser, bottomUser, leftUser, topUser];
      }

      if (orderOfNames[0] && orderOfNames[0].textContent)
        firstPlayerName.textContent = orderOfNames[0].textContent
          .replace("(Dealer):", "")
          .trim();
      if (orderOfNames[1] && orderOfNames[1].textContent)
        secondPlayerName.textContent = orderOfNames[1].textContent
          .replace("(Dealer):", "")
          .trim();
      if (orderOfNames[2] && orderOfNames[2].textContent)
        thirdPlayerName.textContent = orderOfNames[2].textContent
          .replace("(Dealer):", "")
          .trim();
      if (orderOfNames[3] && orderOfNames[3].textContent)
        fourthPlayerName.textContent = orderOfNames[3].textContent
          .replace("(Dealer):", "")
          .trim();

      firstPlayerCardPlayed.innerHTML = convertCardNumberToImgHTML(
        lastRound[lastRound.length - 4]
      ).replace('redSuitBidding', 'redSuitPlaying');
      secondPlayerCardPlayed.innerHTML = convertCardNumberToImgHTML(
        lastRound[lastRound.length - 3]
      ).replace('redSuitBidding', 'redSuitPlaying');
      thirdPlayerCardPlayed.innerHTML = convertCardNumberToImgHTML(
        lastRound[lastRound.length - 2]
      ).replace('redSuitBidding', 'redSuitPlaying');
      fourthPlayerCardPlayed.innerHTML = convertCardNumberToImgHTML(
        lastRound[lastRound.length - 1]
      ).replace('redSuitBidding', 'redSuitPlaying');

      boldRoundWinner(roundWinner);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getLastRound(playedCards) {
    try {
      if (!playedCards) return [];
      const nthRound = Math.floor(playedCards.length / 4);
      const lastRound = playedCards.slice(
        (nthRound - 1) * 4,
        (nthRound - 1) * 4 + 4
      );
      if (!lastRound) return [];
      return lastRound;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function boldRoundWinner(roundWinner) {
    try {
      firstPlayerName.classList.remove("bold");
      secondPlayerName.classList.remove("bold");
      thirdPlayerName.classList.remove("bold");
      fourthPlayerName.classList.remove("bold");
      firstPlayerCardPlayed.classList.remove("bold");
      secondPlayerCardPlayed.classList.remove("bold");
      thirdPlayerCardPlayed.classList.remove("bold");
      fourthPlayerCardPlayed.classList.remove("bold");

      let boldHasBeenSet = false;
      if (roundWinner.trim() === firstPlayerName.textContent.trim()) {
        boldFirstPlayer();
        boldHasBeenSet = true;
      } else if (roundWinner.trim() === secondPlayerName.textContent.trim()) {
        boldSecondPlayer();
        boldHasBeenSet = true;
      } else if (roundWinner.trim() === thirdPlayerName.textContent.trim()) {
        boldThirdPlayer();
        boldHasBeenSet = true;
      } else if (roundWinner.trim() === fourthPlayerName.textContent.trim()) {
        boldFourthPlayer();
        boldHasBeenSet = true;
      }

      if (!boldHasBeenSet) {
        if (firstPlayerName.textContent.trim() === "You") boldFirstPlayer();
        else if (secondPlayerName.textContent.trim() === "You")
          boldSecondPlayer();
        else if (thirdPlayerName.textContent.trim() === "You") boldThirdPlayer();
        else if (fourthPlayerName.textContent.trim() === "You")
          boldFourthPlayer();
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function boldFirstPlayer() {
    try {
      firstPlayerName.classList.add("bold");
      firstPlayerCardPlayed.classList.add("bold");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function boldSecondPlayer() {
    try {
      secondPlayerName.classList.add("bold");
      secondPlayerCardPlayed.classList.add("bold");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function boldThirdPlayer() {
    try {
      thirdPlayerName.classList.add("bold");
      thirdPlayerCardPlayed.classList.add("bold");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function boldFourthPlayer() {
    try {
      fourthPlayerName.classList.add("bold");
      fourthPlayerCardPlayed.classList.add("bold");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function checkMadeSetBid(numberNeeded) {
    try {
      console.log('checkMadeSetBid------------------------------------------------');
      console.log('test - isOffense =', isOffense);
      console.log('test - parseInt(tricksNeededNumerator.textContent) =', parseInt(tricksNeededNumerator.textContent));
      console.log('test - parseInt(tricksNeededDenominator.textContent) =', parseInt(tricksNeededDenominator.textContent));
      console.log('test -  parseInt(tricksLeft.textContent) =',  parseInt(tricksLeft.textContent));
     
      
      if (
          parseInt(numberNeeded) <= 0
      ) {
        tricksNeededNumerator.classList.add("hasMadeBid");
        tricksNeededDenominator.classList.add("hasMadeBid");
        tricksNeededLabel.classList.add("hasMadeBid");
        youNeedTrickCount.classList.add('hasMadeBid');
        // tricksNeededDiv.classList.add('hasMadeBid');
      } 
      else if ((
        parseInt(tricksNeededDenominator.textContent) >
        (parseInt(tricksNeededNumerator.textContent) +
        parseInt(tricksLeft.textContent))) 
        )
      {
        console.log('setting isSet------------------------------------------------');
        tricksNeededNumerator.classList.add("isSet");
        tricksNeededDenominator.classList.add("isSet");
        tricksNeededLabel.classList.add("isSet");
        youNeedTrickCount.classList.add('isSet');
        tricksLeft.classList.add('isSet');
      } 
      else {
        tricksNeededNumerator.classList.remove("hasMadeBid");
        tricksNeededDenominator.classList.remove("hasMadeBid");
        tricksNeededLabel.classList.remove("hasMadeBid");
        youNeedTrickCount.classList.remove('hasMadeBid');
        tricksNeededNumerator.classList.remove("isSet");
        tricksNeededDenominator.classList.remove("isSet");
        tricksNeededLabel.classList.remove("isSet");
        tricksLeft.classList.remove('isSet');
        youNeedTrickCount.classList.remove('isSet');
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region Game Info Code
  function animateGameInfo(isOpening = true) {
    try {
      if (isOpening) {
        gameInfoButton.classList.toggle("slide");
        gameInformationDiv.classList.toggle("slide");
        if (gameInformationDiv.classList.contains("top"))
          gameInformationDiv.classList.toggle("topZero");
        else gameInformationDiv.classList.toggle("leftZero");
      } else {
        gameInformationDiv.classList.toggle("slide");
        if (gameInformationDiv.classList.contains("top"))
          gameInformationDiv.classList.toggle("topZero");
        else gameInformationDiv.classList.toggle("leftZero");
        gameInfoButton.classList.toggle("slide");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function fillInGameInfoDetails(scoring, exposedHandLocation) {
    try {
      if (exposedHandLocation.toLowerCase() === "right") {
        gameInfoButton.classList.add("top");
        gameInformationDiv.classList.add("top");
      } else if (exposedHandLocation.toLowerCase() === locations.bottom) {
        gameInfoButton.classList.add("exposedBottom");
        gameInformationDiv.classList.add("exposedBottom");
      }
      if (scoring === undefined || scoring === null) return;
      let isNorthSouth = false;

      //#region Above the Line Scores
      if (
        spot.toLowerCase() === directions.north ||
        spot.toLowerCase() === directions.south
      ) {
        aboveWe.textContent = scoring.northSouth.aboveTheLine;
        aboveThey.textContent = scoring.eastWest.aboveTheLine;
        isNorthSouth = true;
      } else {
        aboveWe.textContent = scoring.eastWest.aboveTheLine;
        aboveThey.textContent = scoring.northSouth.aboveTheLine;
      }
      //#endregion
      //#region Below the Line Scores
      const gamesWe = [firstGameWe, secondGameWe, thirdGameWe];
      const gamesThey = [firstGameThey, secondGameThey, thirdGameThey];
      let currentGameIndex = 0;
      const roundEndingScoresLength =
        scoring.gameRoundEndingScores.northSouth.length;
      for (let i = 0; i < roundEndingScoresLength; i++) {
        const belowTheLineScoreEW = scoring.gameRoundEndingScores.eastWest[i];
        const belowTheLineScoreNS = scoring.gameRoundEndingScores.northSouth[i];
        if (
          i === roundEndingScoresLength - 1 ||
          belowTheLineScoreEW >= 100 ||
          belowTheLineScoreNS >= 100
        ) {
          if (isNorthSouth) {
            gamesWe[currentGameIndex].textContent = belowTheLineScoreNS;
            gamesThey[currentGameIndex].textContent = belowTheLineScoreEW;
          } else {
            gamesWe[currentGameIndex].textContent = belowTheLineScoreEW;
            gamesThey[currentGameIndex].textContent = belowTheLineScoreNS;
          }
          gamesWe[currentGameIndex].classList.remove("hidden");
          gamesThey[currentGameIndex].classList.remove("hidden");
          currentGameIndex++;
        }
      }
      if (isNorthSouth) {
        gamesWe[roundEndingScoresLength].textContent =
          scoring.northSouth.belowTheLine;
        gamesThey[roundEndingScoresLength].textContent =
          scoring.eastWest.belowTheLine;
      } else {
        gamesWe[roundEndingScoresLength].textContent =
          scoring.eastWest.belowTheLine;
        gamesThey[roundEndingScoresLength].textContent =
          scoring.northSouth.belowTheLine;
      }
      gamesWe[roundEndingScoresLength].classList.remove("hidden");
      gamesThey[roundEndingScoresLength].classList.remove("hidden");
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region onFire Functions
  function setOnFire(roundWinners, declarersSpot, exposedHandSpot) {
    try {
      if (roundWinners === undefined || roundWinners === null)
        return removeOnFire();
      if (roundWinners.length < 3) return removeOnFire();

      if (declarersSpot) {
        isOffense =
          spot.toLowerCase() === declarersSpot.toLowerCase() ||
          spot.toLowerCase() === exposedHandSpot.toLowerCase();
        exposedHandName = globals.getNameFromLocation(
          globals.getLocationFromDirection(exposedHandSpot)
        );
      }

      for (let i = 1; i < 4; i++) {
        const nthRoundWinner = roundWinners[roundWinners.length - i];
        if (isOffense) {
          if (nthRoundWinner !== username && nthRoundWinner !== exposedHandName)
            return removeOnFire();
        } else if (nthRoundWinner !== username) return removeOnFire();
      }
      addOnFire();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function addOnFire() {
    try {
      if (tricksNeededLabel.classList.contains("isSet")) return;
      gameInformationDiv.classList.add("onFire");
      dealInformationDiv.classList.add("onFire");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function removeOnFire() {
    try {
      gameInformationDiv.classList.remove("onFire");
      dealInformationDiv.classList.remove("onFire");
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#region Misc Functions
  function removeBottomBordersOfBottomRow() {
    try {
      const biddingDiv = document.querySelector('#biddingDiv');
      const childrenCount = biddingDiv.children.length;
      const lastRowStart = Math.floor((childrenCount - 1) / 4) * 4;
      for (let i = 0; i < childrenCount; i++) {
        const child = biddingDiv.children[i];
        child.classList.remove('noBorderBottom');
        if (i >= lastRowStart) child.classList.add('noBorderBottom');
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function loadInfoDivLocations(exposedHandLocation) {
    try {
      resetInfoDivStyles();

      if (windowWidth !== window.innerWidth) {
        resetInfoDivLocations();
        // return window = window.innerWidth;
      }
      if (windowHeight !== window.innerHeight) {
        resetInfoDivLocations();
        // return window = window.innerHeight;
      }
      
      const dealInfoLocationsInLocalStorage = JSON.parse(window.localStorage.getItem('dealInfoLocations'));
      const gameInfoLocationsInLocalStorage = JSON.parse(window.localStorage.getItem('gameInfoLocations'));

      if (dealInfoLocationsInLocalStorage) dealInfoLocations = JSON.parse(JSON.stringify(dealInfoLocationsInLocalStorage));
      if (gameInfoLocationsInLocalStorage) gameInfoLocations = JSON.parse(JSON.stringify(gameInfoLocationsInLocalStorage));

      for (const style in dealInfoLocations[exposedHandLocation]) {
        if (Object.hasOwnProperty.call(dealInfoLocations[exposedHandLocation], style)) {
          let styleValue = dealInfoLocations[exposedHandLocation][style];
          if (dealInfoLocations[exposedHandLocation]) {
            const heightOfDealDiv = dealInformationDiv.getBoundingClientRect().height;
            const widthOfDealDiv = dealInformationDiv.getBoundingClientRect().width;
            const styleValueAsNumber = styleValue.slice(0, -2);
            if (style === 'top' && parseFloat(styleValueAsNumber) >= window.innerHeight - heightOfDealDiv) {
              styleValue = window.innerHeight - heightOfDealDiv;
            }
            else if (style === 'left' && parseFloat(styleValueAsNumber) >= window.innerWidth - widthOfDealDiv) {
              styleValue = `${window.innerWidth - (widthOfDealDiv + 25)}px`;
            }
            dealInformationDiv.style[style] = styleValue;
          }
        }
      }

      for (const style in gameInfoLocations[exposedHandLocation]) {
        if (Object.hasOwnProperty.call(gameInfoLocations[exposedHandLocation], style)) {
          let styleValue = gameInfoLocations[exposedHandLocation][style];
          if (gameInfoLocations[exposedHandLocation]) {
            const heightOfGameDiv = gameInformationDiv.getBoundingClientRect().height;
            const widthOfGameDiv = gameInformationDiv.getBoundingClientRect().width;
            const styleValueAsNumber = styleValue.slice(0, -2);
            if (style === 'top' && parseFloat(styleValueAsNumber) >= window.innerHeight - heightOfGameDiv) {
              styleValue = window.innerHeight - heightOfGameDiv;
            }
            else if (style === 'left' && parseFloat(styleValueAsNumber) >= window.innerWidth - widthOfGameDiv) {
              styleValue = `${window.innerWidth - (widthOfGameDiv + 25)}px`;
            }
            gameInformationDiv.style[style] = styleValue;
          }
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function saveInfoDivLocations() {
    try {
      const exposedHandLocation = globals.getExposedHandLocation();

      for (let i = 0; i < dealInformationDiv.style.length; i++) {
        const style = dealInformationDiv.style[i];
        let styleValue = dealInformationDiv.style[style];
        dealInfoLocations[exposedHandLocation][style] = styleValue;
      }
      for (let i = 0; i < gameInformationDiv.style.length; i++) {
        const style = gameInformationDiv.style[i];
        let styleValue = gameInformationDiv.style[style];
        gameInfoLocations[exposedHandLocation][style] = styleValue;
      }

      window.localStorage.setItem('gameInfoLocations', JSON.stringify(gameInfoLocations));
      window.localStorage.setItem('dealInfoLocations', JSON.stringify(dealInfoLocations));
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetInfoDivLocations() {
    try {
      gameInfoLocations = {top: {}, bottom: {}, left: {}, right: {}};
      dealInfoLocations = {top: {}, bottom: {}, left: {}, right: {}};
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetInfoDivStyles() {
    try {
      gameInformationDiv.style = '';
      dealInformationDiv.style = '';
    } catch (error) {
      console.error('error =', error);
    }
  }
  function enableBidContainer() {
    try {
      const bidButtons = document.querySelectorAll('.bidButton');
      enableButtons();
      for (let i = 0; i < bidButtons.length; i++) {
          const bidButton = bidButtons[i];
          bidButton.classList.remove('isNotUsersTurn');
          bidButton.classList.add('bidButtontransition');
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function disableBidContainer() {
    try {
      disableButtons();
      const bidButtons = document.querySelectorAll('.bidButton');
      for (let i = 0; i < bidButtons.length; i++) {
          const bidButton = bidButtons[i];
          bidButton.classList.remove('isNotUsersTurn');
          if (!bidButton.classList.contains('disabled')) bidButton.classList.add('isNotUsersTurn');
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setupNewDeal(dealer, contractsFromServer) {
    try {
      if (
        dealer === undefined ||
        dealer === null ||
        contractsFromServer === undefined ||
        contractsFromServer === null
      )
      return null;
      autoPass.checked = false;
      playingCanvas.classList.add("hidden");
      document.body.style.backgroundColor = "#fff";
      doubleButton.classList.remove("hidden");
      doubleButton.classList.remove("disabled");
      doubleButton.textContent = "Double";
      topIsDealer.classList.add("hidden");
      sidebar.classList.remove("hidden");
      sidebarFull.classList.remove("hidden");
      bidContainer.classList.remove("hidden");
      rightIsDealer.classList.add("hidden");
      bottomIsDealer.classList.add("hidden");
      leftIsDealer.classList.add("hidden");
      makeBidButton.classList.add("disabled");
      makeBidButton.classList.remove("bidButtonAnimation");
      if(dealSummaryButtons) dealSummaryButtons.classList.remove('won');
      if(dealSummaryButtons) dealSummaryButtons.classList.remove('loss');
      topBid.innerHTML = "";
      bottomBid.innerHTML = "";
      leftBid.innerHTML = "";
      rightBid.innerHTML = "";
      cardsDiv.innerHTML = "";
      biddingDiv.innerHTML = "";
      firstPlayerName.textContent = "";
      firstPlayerCardPlayed.textContent = "";
      secondPlayerName.textContent = "";
      secondPlayerCardPlayed.textContent = "";
      thirdPlayerName.textContent = "";
      thirdPlayerCardPlayed.textContent = "";
      fourthPlayerName.textContent = "";
      fourthPlayerCardPlayed.textContent = "";

      setDealerLabel(dealer);
      seatingTable.classList.add("noMarginTop");
      seatingTable.classList.remove("hidden");
      rowContainer.classList.remove("hidden");
      lastBid.classList.remove("hidden");
      flashMsg.innerHTML = ``;
      flashMsg.classList.remove("hidden");
      copyright.classList.remove("hidden");
      tricksNeededLabel.innerHTML = "Have: ";

      if (username === dealer) {
        makeBidSetup();
      } 
      currentBidderName.textContent = username === dealer ? "You" : dealer;
      setupThinking();
      displayThinking(dealer);
      contracts = contractsFromServer;
      resetBids();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetBidContainer() {
    try {
      const bidButtons = document.querySelectorAll('.bidButton');
      for (let i = 0; i < bidButtons.length; i++) {
        const bidButton = bidButtons[i];
        bidButton.className = 'btn btn-sm btn-outline-dark bidButton isNotUsersTurn';
      }
      doubleButton.className = 'btn btn-sm btn-outline-dark bidButton isNotUsersTurn';
      passButton.className = 'btn btn-sm btn-outline-dark bidButton isNotUsersTurn';
      resetButton.className = 'btn btn-sm btn-outline-dark bidButton isNotUsersTurn disabled';
      makeBidButton.className = 'btn btn-sm btn-outline-dark bidButton isNotUsersTurn disabled';
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setupSeating(seating, dealer) {
    try {
      setLastBidSentence(dealer, null, dealer);
      if (seating) {
        seatingGlobal = seating;
        currentBidderName.textContent = dealer;
        for (const key in seating) {
          if (seating.hasOwnProperty(key)) {
            const userInSpot = seating[key];
            if (userInSpot === username) {
              setSeatingLabels(key, seating);
              break;
            }
          }
        }
      } else {
        setLastBidSentence(null, null, dealer);
        currentBidderName.textContent = username === dealer ? "You" : dealer;
      }
      setDealerLabel(dealer);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setupHand(handFromServer) {
    try {
      if (handFromServer === undefined || handFromServer === null) return null;
      hand = handFromServer;
      (clubsCount = 0), (diamondsCount = 0), (heartsCount = 0), (spadesCount = 0);
      getHighCardPoints(hand);
      getDistributionPoints(hand);
      drawCardsInHTML({
        hand,
        containerName: 'cardsDiv',
        outerContainerName: 'rowContainer',
        location: 'bottom',
        isModalUse: false,
      })
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setupThinking() {
    try {
      //loads the html into place for usage
      const bidBorders = document.querySelectorAll(".bidBorder");
      for (let i = 0; i < bidBorders.length; i++) {
        const bidBorder = bidBorders[i];
        let suffix, bidSpan;
        if (bidBorder.id.match(/top/i)) {
          suffix = "Top";
          bidSpan = `topBidsDiv`;
        } else if (bidBorder.id.match(/bottom/i)) {
          suffix = "Bottom";
          bidSpan = `bottomBidsDiv`;
        } else if (bidBorder.id.match(/left/i)) {
          suffix = "Left";
          bidSpan = `leftBidsDiv`;
        } else if (bidBorder.id.match(/right/i)) {
          suffix = "Right";
          bidSpan = `rightBidsDiv`;
        }

        const bidSpanNode = document.getElementById(bidSpan);
        const thinkingDivNode = document.createElement("div");
        thinkingDivNode.id = `thinkingDiv${suffix}`;
        thinkingDivNode.classList.add("thinkingDiv");
        thinkingDivNode.innerHTML = `
                  <label class="timerValue"> </label>
                  <div id="thinkingSuits">
                      <span id="diamondThinking" class="diamondIcon redSuitBidding">&diams;</span>
                      <span id="clubThinking" class="clubIcon blackSuitBidding">&clubs;</span>
                      <span id="heartThinking" class="heartIcon redSuitBidding">&hearts;</span>
                      <span id="spadeThinking" class="spadeIcon blackSuitBidding">&spades;</span>
                  </div>
                  <label class="timerValue"> </label>
              `;
        if (!document.querySelector(`#${thinkingDivNode.id}`))
          bidBorder.insertBefore(thinkingDivNode, bidSpanNode);
        thinkingDivNode.classList.add("hidden");
      }
      shouldSetupThinking = false;
      thinkingDivTop = document.querySelector("#thinkingDivTop");
      thinkingDivLeft = document.querySelector("#thinkingDivLeft");
      thinkingDivRight = document.querySelector("#thinkingDivRight");
      thinkingDivBottom = document.querySelector("#thinkingDivBottom");

      topBorder = document.querySelector("#topBorder");
      bottomBorder = document.querySelector("#bottomBorder");
      leftBorder = document.querySelector("#leftBorder");
      rightBorder = document.querySelector("#rightBorder");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function displayThinking(bidder) {
    try {
      if (bidder === undefined || bidder === null) return null;
      hideThinking();

      const locationOfBidder = getLabelLocationFromBidder(bidder);
      switch (locationOfBidder.toLowerCase()) {
        case "top":
          if (thinkingDivTop) thinkingDivTop.classList.remove("hidden");
          topBidsDiv.classList.add("hidden");
          if (topBorder) topBorder.classList.add("isUsersTurnToBid");
          break;
        case "left":
          if (thinkingDivLeft) thinkingDivLeft.classList.remove("hidden");
          leftBidsDiv.classList.add("hidden");
          if (leftBorder) leftBorder.classList.add("isUsersTurnToBid");
          break;
        case "right":
          if (thinkingDivRight) thinkingDivRight.classList.remove("hidden");
          rightBidsDiv.classList.add("hidden");
          if (rightBorder) rightBorder.classList.add("isUsersTurnToBid");
          break;
        case "bottom":
          if (thinkingDivBottom) thinkingDivBottom.classList.remove("hidden");
          bottomBidsDiv.classList.add("hidden");
          if (bottomBorder) bottomBorder.classList.add("isUsersTurnToBid");
          break;
      }
      if (typeof timerDurationValue !== "string") {
        clearInterval(timerCountdown);
        startTimer(bidder);
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function hideThinking() {
    try {
      if (thinkingDivTop) thinkingDivTop.classList.add("hidden");
      if (thinkingDivLeft) thinkingDivLeft.classList.add("hidden");
      if (thinkingDivRight) thinkingDivRight.classList.add("hidden");
      if (thinkingDivBottom) thinkingDivBottom.classList.add("hidden");
      if (topBidsDiv) topBidsDiv.classList.remove("hidden");
      if (bottomBidsDiv) bottomBidsDiv.classList.remove("hidden");
      if (leftBidsDiv) leftBidsDiv.classList.remove("hidden");
      if (rightBidsDiv) rightBidsDiv.classList.remove("hidden");
      if (topBorder) topBorder.classList.remove("isUsersTurnToBid");
      if (bottomBorder) bottomBorder.classList.remove("isUsersTurnToBid");
      if (leftBorder) leftBorder.classList.remove("isUsersTurnToBid");
      if (rightBorder) rightBorder.classList.remove("isUsersTurnToBid");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetBid(shouldDisable = true) {
    try {
      if (shouldDisable) {
        resetButton.classList.add("disabled");
        makeBidButton.className = 'btn btn-sm btn-outline-success disabled';
      }

      if (currentSelection) {
        if (
          currentSelection.classList &&
          currentSelection.classList.contains("btn")
        ) {
          currentSelection.classList.remove("selected");
        } else currentSelection.target.classList.remove("selected");
        currentSelection = null;
      } else {
        makeBidButton.classList.add("disabled");
        makeBidButton.classList.remove("bidButtonAnimation");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function selectBid(e) {
    try {
      currentBidRow = numbersAsString[e.target.textContent.trim()[0] - 1];
      currentBidColumn = getCurrentColumnFromBidButton(e);
      makeBidButton.className = 'btn btn-sm btn-outline-success bidButtonAnimation';
      resetButton.classList.remove("disabled");

      if (e === undefined || e === null) return null;
      if (currentSelection) {
        resetBid(false);
      }

      const parent = e.target.parentNode;
      if (parent.classList.contains("btn")) {
        currentSelection = parent;
        parent.classList.add("selected");
      } else if (
        parent.classList.contains("redSuitBidding") ||
        parent.classList.contains("blackSuitBidding")
      ) {
        const grandParent = parent.parentNode;
        grandParent.classList.add("selected");
        currentSelection = grandParent;
      } else {
        e.target.classList.add("selected");
        currentSelection = e;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getCurrentColumnFromBidButton(e) {
    try {
      if (e.target.parentNode.id.match(/club/i)) {
        return suitOrder.indexOf('Club');
      }
      else if (e.target.parentNode.id.match(/spade/i)) {
        return suitOrder.indexOf('Spade');
      }
      else if (e.target.id.match(/trump/i)) {
        return suitOrder.indexOf('No_Trump');
      }
      else if (e.target.parentNode.id.match(/diamond/i)) {
        return suitOrder.indexOf('Diamond');
      }
      else if (e.target.parentNode.id.match(/heart/i)) {
        return suitOrder.indexOf('Heart');
      }
      else if (e.target.parentNode.parentNode.id.match(/diamond/i)) {
        return suitOrder.indexOf('Diamond');
      }
      else if (e.target.parentNode.parentNode.id.match(/heart/i)) {
        return suitOrder.indexOf('Heart');
      }
    } catch (error) {
      console.log('error getCurrentColumnFromBidButton ------------------------------------------------');
      console.log('error =', error);
      return suitOrder.indexOf('Club');
    }
  }
  function disableUpToLastBid(bids) {
    try {
      if (!bids) return null;
      resetAllBidButtons();
      let lastBid,
        indexOfLastBid = -1;
      for (let i = 0; i < bids.length; i++) {
        const bid = bids[i];
        if (!bid[1].match(/pass/i) && !bid[1].match(/double/i)) {
          lastBid = bid[1];
        }
      }
      indexOfLastBid = contracts.findIndex((contract) => contract === lastBid);
      if (lastBid && indexOfLastBid !== -1)
        disableBids(contracts.slice(0, indexOfLastBid + 1));
    } catch (error) {
      console.error('error =', error);
    }
  }
  function populateBids(bids) {
    try {
      if (bids === undefined || bids === null) return null;
      //need to disable up to highest bid
      let imgHTML;
      disableUpToLastBid(bids);
      disableBidContainer();

      //#region populate bids with html
      for (let i = 0; i < bids.length; i++) {
        const bidArray = bids[i];
        const bidder = bidArray[0];
        const bid = bidArray[1];
        imgHTML = getImgHTMLFromBid(bid);
        setBidLabel(getLabelLocationFromBidder(bidder), imgHTML);
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getImgHTMLFromBid(bid) {
    try {
      if (bid === undefined || bid === null) return;
      const number = convertNumberAsStringToInt(bid);
      if (bid.toLowerCase() === "pass") return `Pass`;
      else if (bid.toLowerCase() === "double") return `Double`;
      else if (bid.match(/club/i)) return getImgHTMLForBid(number, 0);
      else if (bid.match(/diamond/i)) return getImgHTMLForBid(number, 1, true);
      else if (bid.match(/heart/i)) return getImgHTMLForBid(number, 2, true);
      else if (bid.match(/spade/i)) return getImgHTMLForBid(number, 3);
      else if (bid.match(/trump/i)) return `${number}NT`;
      else return "";
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getImgHTMLForBid(number, suitIndex, isRed = false) {
    try {
      let classToAdd = "blackSuitBidding";
      if (suitIndex === 1 || suitIndex === 2) classToAdd = "redSuitBidding";
      return `<span class='${classToAdd}'><span class="${isRed ? 'blackText' : ''}">${number}</span>${suitsCharacters[suitIndex]}</span>`;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function convertNumberAsStringToInt(numberAsString) {
    try {
      if (numberAsString === undefined || numberAsString === null) return null;
      if (typeof numberAsString === "number") return numberAsString;
      const splitStr = numberAsString.split(" ");
      switch (splitStr[0].toLowerCase()) {
        case "one":
          return 1;
        case "two":
          return 2;
        case "three":
          return 3;
        case "four":
          return 4;
        case "five":
          return 5;
        case "six":
          return 6;
        case "seven":
          return 7;
        case "eight":
          return 8;
        case "nine":
          return 9;
        case "ten":
          return 10;
        case "jack":
          return "J";
        case "queen":
          return "Q";
        case "king":
          return "K";
        case "ace":
          return "A";
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getLabelLocationFromBidder(bidder) {
    try {
      if (bidder === undefined || bidder === null) return null;
      if (topLabelUsername === bidder) return "top";
      if (leftLabelUsername === bidder) return "left";
      if (rightLabelUsername === bidder) return "right";
      return "bottom";
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getNextBidderFromSeating(bidder) {
    try {
      if (bidder === undefined || bidder === null) return null;
      let dealerSpot;
      for (const key in seatingGlobal) {
        if (seatingGlobal.hasOwnProperty(key)) {
          const username = seatingGlobal[key];
          if (username === bidder) {
            dealerSpot = key;
            break;
          }
        }
      }
      if (dealerSpot.toLowerCase() === "north") return seatingGlobal.east;
      if (dealerSpot.toLowerCase() === "south") return seatingGlobal.west;
      if (dealerSpot.toLowerCase() === "east") return seatingGlobal.south;
      if (dealerSpot.toLowerCase() === "west") return seatingGlobal.north;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getDirectionFromLocation(location) {
    try {
      if (location === undefined || location === null) return null;
      const rotations = {
        bottom: 0,
        left: 1,
        top: 2,
        right: 3,
      };
      const directions = ["north", "east", "south", "west"];
      const numberOfRotations = rotations[location];
      const directionIndex = directions.findIndex(function (direction) {
        return direction === spot;
      });
      return directions[(numberOfRotations + directionIndex) % 4];
    } catch (error) {
      console.error('error =', error);
    }
  }
  function removeAllDealSummaryTables() {
    try {
      const tables = document.querySelectorAll(".dealSummary");
      for (let i = 0; i < tables.length; i++) {
        const table = tables[i];
        table.remove();
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setLastBidSentence(bidder, imgHTML, nextBidder) {
    try {
      lastBid.classList.remove("hidden");
      if (imgHTML) {
        currentBidderName.textContent = nextBidder;
        if (!nextBidder) {
          nextBidder = getNextBidderFromSeating(bidder);
        }
        if (imgHTML.trim().toLowerCase() === "pass") {
          lastBid.innerHTML = `<strong>
                      ${
                        bidder === username ? "You" : bidder
                      } passed</strong>.  It is <strong>${
            nextBidder === username ? "your" : `${nextBidder}'s`
          }</strong> turn to bid.
                  `;
        } else if (imgHTML.trim().toLowerCase() === "double") {
          lastBid.innerHTML = `<strong>
                      ${
                        bidder === username ? "You" : bidder
                      } doubled</strong>.  It is <strong>${
            nextBidder === username ? "your" : `${nextBidder}'s`
          }</strong> turn to bid.
                  `;
        } else {
          lastBid.innerHTML = `<strong>
                      ${
                        bidder === username ? "You" : bidder
                      }</strong> bid ${imgHTML}.  It is <strong>${
            nextBidder === username ? "your" : `${nextBidder}'s`
          }</strong> turn to bid.
                  `;
        }
      } else {
        lastBid.innerHTML = `
                  '<strong>${nextBidder}'</strong> dealt this ${getFunnyNounForDeal()}
              `;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setBidLabel(labelLocation, bidHTML) {
    try {
      const bidsDivs = document.querySelectorAll(".bidsDiv");
      for (let i = 0; i < bidsDivs.length; i++) {
        const bidDiv = bidsDivs[i];
        bidDiv.classList.remove("hidden");
      }

      let bidToChange;
      if (labelLocation === undefined || labelLocation === null) return null;
      switch (labelLocation) {
        case "bottom":
          bottomBid.innerHTML = bidHTML.trim();
          bidToChange = bottomBid;
          break;
        case "top":
          topBid.innerHTML = bidHTML.trim();
          bidToChange = topBid;
          break;
        case "right":
          rightBid.innerHTML = bidHTML.trim();
          bidToChange = rightBid;
          break;
        case "left":
          leftBid.innerHTML = bidHTML.trim();
          bidToChange = leftBid;
          break;
      }
      const isRealBid = !bidHTML.match(/pass/i) && !bidHTML.match(/double/i);
      if (!isRealBid) bidToChange.classList.add("doublePassBid");
      else bidToChange.classList.remove("doublePassBid");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function populateBiddingDiv(bidding, nthDeal = null, isGameOver = false, firstFourBids = []) {
    for (let i = 0; i < bidding.length; i++) {
      const bid = bidding[i];
      if (isSecondDouble && bid[1].match(/double/i)) {
        bid[1] = "Re-Double";
        isSecondDouble = false;
      }
      if (bid[1].match(/double/i)) isSecondDouble = true;
      else if (!bid[1].match(/pass/i)) isSecondDouble = false;

      if (bid[1].match(/pass/i) || bid[1].match(/double/i)) addBidToBiddingDiv(bid[1].capitalize(), nthDeal, isGameOver, firstFourBids);
      else {
        const split = bid[1].split(" ");
        const number = convertNumberAsStringToInt(split[0]);
        let imgHTML = `${number}NT`;

        if (bid[1].match(/club/i)) imgHTML = getImgHTMLForBid(number, 0);
        else if (bid[1].match(/diamond/i)) imgHTML = getImgHTMLForBid(number, 1, true);
        else if (bid[1].match(/heart/i)) imgHTML = getImgHTMLForBid(number, 2, true);
        else if (bid[1].match(/spade/i)) imgHTML = getImgHTMLForBid(number, 3);
        addBidToBiddingDiv(imgHTML, nthDeal, isGameOver, firstFourBids);
      }
    }
  }
  function addBidToBiddingDiv(imgHTML, nthDeal = null, isGameOver = false, firstFourBids = []) {
    try {
      if (imgHTML === undefined || imgHTML === null) return;
      let biddingDiv = document.querySelector("#biddingDiv");
      if (nthDeal !== null) biddingDiv = document.querySelector(`#biddingDivSummary${nthDeal}`);
      if (!biddingDiv) {
        console.log(imgHTML);
        return;
      }
      const biddingHeaderClassName = "biddingHeader";
      bidCount = biddingDiv.children.length;
      //#region Adding Names to Header Row
      if (
        bidCount === 0 ||
        (biddingDiv &&
          biddingDiv.innerHTML &&
          !biddingDiv.innerHTML.match(biddingHeaderClassName))
      ) {
        if (isGameOver) {
          const usernamesToAdd = firstFourBids.map(bid => bid[0]);
          addUsernamesToTableHeader(usernamesToAdd, biddingDiv, biddingHeaderClassName);
        }
        else {
          const topUsername = topUser
            ? topUser.innerHTML &&
              topUser.innerHTML.match(/strong>(.+)<\/strong/i)[1]
            : "";
          const rightUsername = rightUser
            ? rightUser.innerHTML &&
              rightUser.innerHTML.match(/strong>(.+)<\/strong/i)[1]
            : "";
          const leftUsername = leftUser
            ? leftUser.innerHTML &&
              leftUser.innerHTML.match(/strong>(.+)<\/strong/i)[1]
            : "";
          const labelsToCheck = [
            [topIsDealer, "topUser"],
            [bottomIsDealer, "bottomUser"],
            [leftIsDealer, "leftUser"],
            [rightIsDealer, "rightUser"],
          ];
          for (let i = 0; i < labelsToCheck.length; i++) {
            const label = labelsToCheck[i];
            if (!label[0].classList.contains("hidden")) {
              const location = label[1];
              const dealerSpan = document.querySelector(`#${location}`);
              const match = dealerSpan.innerHTML.match(/strong>(.+)<\/strong/i);
              const dealer = match[1];

              let usernamesToAdd = [];
              if (dealer.match(/you/i)) {
                usernamesToAdd = ["You", leftUsername, topUsername, rightUsername];
              } else if (location.match(/top/i)) {
                usernamesToAdd = [topUsername, rightUsername, "You", leftUsername];
              } else if (location.match(/left/i)) {
                usernamesToAdd = [leftUsername, topUsername, rightUsername, "You"];
              } else if (location.match(/right/i)) {
                usernamesToAdd = [rightUsername, "You", leftUsername, topUsername];
              }
              addUsernamesToTableHeader(usernamesToAdd, biddingDiv, biddingHeaderClassName);
              break;
            }
          }
        }
      }
      //#endregion
      biddingDiv.innerHTML += `<span class='biddingTableItem'>${imgHTML}</span>`;
      removeBottomBordersOfBottomRow();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function addUsernamesToTableHeader(usernamesToAdd, biddingDiv, biddingHeaderClassName) {
    for (let i = 0; i < usernamesToAdd.length; i++) {
      const usernameToAdd = usernamesToAdd[i];
      biddingDiv.innerHTML += `<span class='transition biddingTableItem ${biddingHeaderClassName}'>${usernameToAdd}</span>`;
    }
  }
  function disableBids(bids) {
    try {
      if (bids === undefined || bids === null) return null;
      for (let i = 0; i < bids.length; i++) {
        const bid = bids[i];
        const bidButton = document.querySelector(`#${bid.replace(/\s/g, "_")}`);
        bidButton.classList.add("disabled");
        if (
          !bidButton.innerHTML.match(/blackFiltered/i) &&
          (bidButton.value.match(/spade/i) || bidButton.value.match(/club/i))
        ) {
          // bidButton.classList.add('blackFiltered')
          const classes = bidButton.innerHTML.match(/class="(.+?)"/i);
          bidButton.innerHTML = String(bidButton.innerHTML).replace(
            /class=".+?"/i,
            `class="blackFiltered ${classes[1]}"`
          );
        } else if (
          !bidButton.innerHTML.match(/redFiltered/i) &&
          (bidButton.value.match(/heart/i) || bidButton.value.match(/diamond/i))
        ) {
          const classes = bidButton.innerHTML.match(/class="(.+?)"/i);
          bidButton.innerHTML = String(bidButton.innerHTML).replace(
            /class=".+?"/i,
            `class="redFiltered ${classes[1]}"`
          );
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetBids() {
    try {
      for (let i = 0; i < bidButtons.length; i++) {
        const bidButton = bidButtons[i];
        bidButton.classList.remove("disabled");
        bidButton.classList.remove("selected");
        if (bidButton.value.match(/spade/i) || bidButton.value.match(/club/i)) {
          bidButton.innerHTML = bidButton.innerHTML.replace("blackFiltered", "");
        } else if (
          bidButton.value.match(/heart/i) ||
          bidButton.value.match(/diamond/i)
        ) {
          bidButton.innerHTML = bidButton.innerHTML.replace("redFiltered", "");
        }
      }
      passButton.classList.remove("selected");
      doubleButton.classList.remove("selected");
      makeBidButton.classList.remove("selected");
      resetButton.classList.remove("selected");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function makeBidSetup() {
    try {
      if (currentSelection) {
        if (currentSelection.target) currentSelection.target.classList.remove("selected");
        else currentSelection.classList.remove("selected");
        currentSelection = null;
      }
      makeBidButton.className = 'btn btn-sm btn-outline-success disabled';
      resetButton.className = 'btn btn-sm btn-outline-danger disabled';

      bidContainer.classList.remove("hidden");
      enableBidContainer();
      // currentBidder.classList.add("hidden");
      flashMsg.innerHTML = `
              <div class="alert text-center alert-success">
                  <h3>It is your turn to bid!</h3>
              </div>
          `;
      seatingTable.classList.add("noMarginTop");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function makeBid(currentSelection, useCurrentSelection = false) {
    try {
      if (currentSelection === undefined || currentSelection === null) return null;

      if (typeof currentSelection !== "object") {
        socket
          .binary(false)
          .emit("sendBidToServer", {
            username,
            bid: useCurrentSelection ? currentSelection : "Pass",
            room,
            spot,
            imgHTML: useCurrentSelection ? currentSelection : "Pass",
          });
      } else {
        let bid = currentSelection.value;
        let imgHTML = currentSelection.innerHTML;
        if (currentSelection.target) {
          bid = currentSelection.target.value;
          imgHTML = currentSelection.target.innerHTML;
        }
        socket
          .binary(false)
          .emit("sendBidToServer", { username, bid, room, spot, imgHTML });
      }
      passButton.classList.remove("selected");
      doubleButton.classList.remove("selected");
      scrollToTop();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function adjustMarginHeight(items, offSet = 0) {
    try {
      // console.log("adjustMarginHeight-----------------");
      let itemsHeight = 0;
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        console.dir(item);
        itemsHeight = item.getBoundingClientRect().height;
      }

      const windowHeight = window.innerHeight;
      if (itemsHeight < windowHeight) {
        items[0].style.marginTop = `${
          Math.abs(windowHeight - itemsHeight) / 2 + offSet
        }px`;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function startTimer(bidder) {
    try {
      if (bidder === undefined || bidder === null) return null;
      if (typeof timerDurationValue !== "string") {
        timerValues = document.querySelectorAll(".timerValue");
        if (!timerValues) return null;
        amountLeft = isStartOfBidding
          ? firstBidExtraTime + timerDurationValue
          : timerDurationValue;
        isStartOfBidding = false;
        for (let i = 0; i < timerValues.length; i++) {
          const timerValue = timerValues[i];
          timerValue.innerHTML = amountLeft;
        }
        timerCountdown = setInterval(function () {
          amountLeft -= 1;
          for (let i = 0; i < timerValues.length; i++) {
            const timerValue = timerValues[i];
            timerValue.innerHTML = amountLeft;
          }
          if (
            parseInt(amountLeft) === 0 &&
            bidder === seatingGlobal[getDirectionFromLocation("bottom")]
          ) {
            amountLeft = timerDurationValue;
            if (currentSelection) makeBid(currentSelection);
            else makeBid("Pass");
            clearInterval(timerCountdown);
          } else if (parseInt(amountLeft) <= 0) amountLeft = 1;
        }, 1000);
      } else {
        for (let i = 0; i < timerValues.length; i++) {
          const timerValue = timerValues[i];
          timerValue.innerHTML = "";
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setSeatingLabels(spot, seating) {
    try {
      if (
        spot === undefined ||
        spot === null ||
        seating === undefined ||
        seating === null
      )
        return null;

      bottomUser.innerHTML = `<strong>You</strong><span class="mt-0 hidden dealer" id="bottomIsDealer"><em> (Dealer):</em></span>`;
      switch (spot.toLowerCase()) {
        case "north":
          topUser.innerHTML = `<strong>${seating.south}</strong><span class="mt-0 hidden dealer" id="topIsDealer"><em> (Dealer):</em></span>`;
          rightUser.innerHTML = `<strong>${seating.west}</strong><span class="mt-0 hidden dealer" id="rightIsDealer"><em> (Dealer):</em></span>`;
          leftUser.innerHTML = `<strong>${seating.east}</strong><span class="mt-0 hidden dealer" id="leftIsDealer"><em> (Dealer):</em></span>`;
          break;
        case "south":
          topUser.innerHTML = `<strong>${seating.north}</strong><span class="mt-0 hidden dealer" id="topIsDealer"><em> (Dealer):</em></span>`;
          rightUser.innerHTML = `<strong>${seating.east}</strong><span class="mt-0 hidden dealer" id="rightIsDealer"><em> (Dealer):</em></span>`;
          leftUser.innerHTML = `<strong>${seating.west}</strong><span class="mt-0 hidden dealer" id="leftIsDealer"><em> (Dealer):</em></span>`;
          break;
        case "east":
          topUser.innerHTML = `<strong>${seating.west}</strong><span class="mt-0 hidden dealer" id="topIsDealer"><em> (Dealer):</em></span>`;
          rightUser.innerHTML = `<strong>${seating.north}</strong><span class="mt-0 hidden dealer" id="rightIsDealer"><em> (Dealer):</em></span>`;
          leftUser.innerHTML = `<strong>${seating.south}</strong><span class="mt-0 hidden dealer" id="leftIsDealer"><em> (Dealer):</em></span>`;
          break;
        case "west":
          topUser.innerHTML = `<strong>${seating.east}</strong><span class="mt-0 hidden dealer" id="topIsDealer"><em> (Dealer):</em></span>`;
          rightUser.innerHTML = `<strong>${seating.south}</strong><span class="mt-0 hidden dealer" id="rightIsDealer"><em> (Dealer):</em></span>`;
          leftUser.innerHTML = `<strong>${seating.north}</strong><span class="mt-0 hidden dealer" id="leftIsDealer"><em> (Dealer):</em></span>`;
          break;
      }
      const regExp = /\<strong\>(.+)\<\/strong\>/i;
      topLabelUsername = topUser.innerHTML.match(regExp)[1];
      bottomLabelUsername = bottomUser.innerHTML.match(regExp)[1];
      rightLabelUsername = rightUser.innerHTML.match(regExp)[1];
      leftLabelUsername = leftUser.innerHTML.match(regExp)[1];
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setDealerLabel(dealer) {
    try {
      if (dealer === undefined || dealer === null) return null;
      leftIsDealer = document.querySelector("#leftIsDealer");
      rightIsDealer = document.querySelector("#rightIsDealer");
      topIsDealer = document.querySelector("#topIsDealer");
      bottomIsDealer = document.querySelector("#bottomIsDealer");
      leftIsDealer.classList.add("hidden");
      rightIsDealer.classList.add("hidden");
      topIsDealer.classList.add("hidden");
      bottomIsDealer.classList.add("hidden");
      if (leftLabelUsername === dealer) {
        leftIsDealer.classList.remove("hidden");
        if (!topUser.innerHTML.match(/:/i)) topUser.innerHTML += ":";
        if (!bottomUser.innerHTML.match(/:/i)) bottomUser.innerHTML += ":";
        if (!rightUser.innerHTML.match(/:/i)) rightUser.innerHTML += ":";
      } else if (rightLabelUsername === dealer) {
        rightIsDealer.classList.remove("hidden");
        if (!topUser.innerHTML.match(/:/i)) topUser.innerHTML += ":";
        if (!bottomUser.innerHTML.match(/:/i)) bottomUser.innerHTML += ":";
        if (!leftUser.innerHTML.match(/:/i)) leftUser.innerHTML += ":";
      } else if (topLabelUsername === dealer) {
        topIsDealer.classList.remove("hidden");
        if (!leftUser.innerHTML.match(/:/i)) leftUser.innerHTML += ":";
        if (!bottomUser.innerHTML.match(/:/i)) bottomUser.innerHTML += ":";
        if (!rightUser.innerHTML.match(/:/i)) rightUser.innerHTML += ":";
      } else {
        bottomIsDealer.classList.remove("hidden");
        if (!topUser.innerHTML.match(/:/i)) topUser.innerHTML += ":";
        if (!leftUser.innerHTML.match(/:/i)) leftUser.innerHTML += ":";
        if (!rightUser.innerHTML.match(/:/i)) rightUser.innerHTML += ":";
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function convertNumberToCardString(cardAsNumber) {
    try {
      if (cardAsNumber === undefined || cardAsNumber === null) return null;
      const suits = ["Clubs", "Diamonds", "Hearts", "Spades"];
      const cardValuesAsString = [
        "Two",
        "Three",
        "Four",
        "Five",
        "Six",
        "Seven",
        "Eight",
        "Nine",
        "Ten",
        "Jack",
        "Queen",
        "King",
        "Ace",
      ];
      //0 = Two of Clubs
      //51 = Ace of Spades
      if (cardAsNumber < 0 || cardAsNumber > 51) return -1;
      const cardValue = cardValuesAsString[cardAsNumber % 13];
      const index = Math.floor(cardAsNumber / 13);
      const suit = suits[index];
      return cardValue + " of " + suit;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function drawCardsInHTML({
    hand,
    containerName,
    outerContainerName,
    location = "bottom",
    isModalUse = false,
    isClaimSome = false,
    isBottomHand = false,
    minWidth = 25,
    maxWidth = 100,
    minCardCount = 2,
    maxCardCount = 13,
  }) {
    try {
      if (
        hand === undefined ||
        hand === null ||
        containerName === undefined ||
        containerName === null
      )
        return null;
      if (location === "bottom") {
        const declarersHandDiv = document.querySelector("#declarersHandDiv");
        if (declarersHandDiv !== undefined && declarersHandDiv !== null)
          declarersHandDiv.height = "100%";
      }
      if (
        isModalUse &&
        isClaimSome &&
        (location.toLowerCase() === "left" || location.toLowerCase() === "right")
      )
        document.querySelector("#claimBody").classList.add("isClaimSome");

      const container = document.querySelector(`#${containerName}`);
      const outerContainer = document.querySelector(`#${outerContainerName}`);
      container.innerHTML = "";
      container.clientWidth = outerContainer.clientWidth;
      const aspectRatio = window.innerHeight / window.innerWidth;
      const flatHand = hand.flatten(3);
      const spacing = 100 / flatHand.length;
      let percentFromStart = 0;
      let cardCount = 1;
      let boundToStartFrom;
      let className = "cards";

      for (let i = 0; i < flatHand.length; i++) {
        const cardAsNumber = flatHand[i];
        const newCardName = convertNumberToCardString(cardAsNumber);
        let classToAdd = "claimCard";
        //#region Left and Right Code
        if (
          (isModalUse && location.toLowerCase() === "left") ||
          location.toLowerCase() === "right"
        ) {
          let height ;        
          try {
          //#region Adjusting Left and Right Spacing
          if (container.style.height === '') {
            let startOutPutToUse = 10,
              endOutPutToUse = 66;
            if (
              window.innerWidth <= 769 &&
              window.innerHeight <= 700 &&
              aspectRatio < 1.2
            ) {
              (startOutPutToUse = 50), (endOutPutToUse = 100);
            } else if (window.innerWidth >= 769) {
              (startOutPutToUse = 20), (endOutPutToUse = 100);
            }
            if (isClaimSome) {
              startOutPutToUse = 80;
              endOutPutToUse = 100;
            }
            const claimSomeStartOutputs = {
              1: 17.5,
              2: 22.5,
              3: 33,
              4: 50,
              5: 66,
            }
            const startOutputsLength = Object.values(claimSomeStartOutputs).length;
            if (isClaimSome && (flatHand.length <= startOutputsLength)) {
              height = claimSomeStartOutputs[flatHand.length];
            } 
            else {
              height = globals.getLinearPercentOfMaxMatchWithinRange(
                flatHand.length,
                isClaimSome ? startOutputsLength + 1 : minCardCount,
                maxCardCount,
                startOutPutToUse,
                endOutPutToUse,
              );
            }
          }
          //#endregion
          }
          catch {height = 100}
          container.style.height = `${height}%`;
          if (flatHand.length <= 9) claimBody.classList.add("shortHand");
          if (isClaimSome && location.toLowerCase() === "left") {
            classToAdd = "claimSomeLeft";
          } else if (isClaimSome && location.toLowerCase() === "right") {
            classToAdd = "claimSomeRight";
          }
        } else if (
          (isModalUse && location.toLowerCase() === "top") ||
          location.toLowerCase() === "bottom"
        ) {
          let width = globals.getLinearPercentOfMaxMatchWithinRange(
            flatHand.length,
            minCardCount,
            maxCardCount,
            minWidth,
            maxWidth,
          );
          if (window.innerWidth <= 769 && window.innerHeight <= 700) {
            width = globals.getLinearPercentOfMaxMatchWithinRange(
              flatHand.length,
              minCardCount,
              maxCardCount,
              minWidth,
              maxWidth,
            );
          } else if (window.innerWidth >= 769) {
            width = globals.getLinearPercentOfMaxMatchWithinRange(
              flatHand.length,
              minCardCount,
              maxCardCount,
              minWidth,
              maxWidth,
            );
          }
          container.style.width = `${width}%`;
          if (flatHand.length <= 9) claimBody.classList.add("shortHand");

          if (isClaimSome && !isBottomHand) {
            classToAdd = "claimCardTop";
          } else if (isClaimSome && isBottomHand) {
            classToAdd = "claimCardBottom";
          }
        }
        if (location.toLowerCase() === "left") className = "cardsLeft";
        else if (location.toLowerCase() === "right") className = "cardsRight";
        //#endregion
        let colorTheme = clientPreferences.colorTheme ? `${clientPreferences.colorTheme}/` : '';
        if (currentTheme) colorTheme = `${currentTheme}/`;
        const imgHTML = isMobile
          ? `
                  <img id="card${containerName}${cardAsNumber}" class="${className} ${classToAdd}" src="/imgs/cards/mobile/${newCardName}.png" alt="">
              `
          : `
                  <img id="card${containerName}${cardAsNumber}" class="${className} ${classToAdd}" src="/imgs/cards/${colorTheme}${newCardName}.png" alt="">
            `;
        container.innerHTML += imgHTML;
        const currentCard = document.getElementById(
          `card${containerName}${cardAsNumber}`
        );
        currentCard.style.position = "absolute";

        if (location.toLowerCase() === "bottom") {
          boundToStartFrom = "left";
          currentCard.style.zIndex = `${cardCount * 5}`;
        } else if (location.toLowerCase() === "top") {
          boundToStartFrom = "left";
          currentCard.style.zIndex = `${cardCount * 5}`;
        } else if (location.toLowerCase() === "left") {
          boundToStartFrom = "top";
          currentCard.style.zIndex = `${cardCount * 5}`;
          let amountToTranslate = "translate(-75%, 22.5%)";
          if (isClaimSome)
            amountToTranslate = `translate(50%, ${
              aspectRatio <= 1.2 ? "0" : "0"
            }%)`;
          currentCard.style.transform = `rotate(90deg) ${amountToTranslate}`;
        } else if (location.toLowerCase() === "right") {
          boundToStartFrom = "bottom";
          currentCard.style.zIndex = `${cardCount * 5}`;
          let amountToTranslate = "translate(75%, -22.5%)";
          if (isClaimSome)
            amountToTranslate = `translate(-50%, ${
              aspectRatio <= 1.2 ? "0" : "0"
            }%)`;
          currentCard.style.transform = `rotate(90deg) ${amountToTranslate}`;
        }

        currentCard.style[boundToStartFrom] = `${percentFromStart}%`;
        percentFromStart += spacing;
        cardCount++;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setScoringLabels(scoring) {
    try {
      scoringGlobal = scoring;
      if (scoring === undefined || scoring === null) return null;
      let isNorthSouth = false;
      if (spot.toLowerCase() === "north" || spot.toLowerCase() === "south") {
        yourBelowTheLinePoints.textContent = scoring.northSouth.belowTheLine;
        yourAboveTheLinePoints.textContent = scoring.northSouth.aboveTheLine;
        yourVulnerable.textContent =
          scoring.northSouth.isVulnerable === true ? "Yes" : "No";
        opponentBelowTheLinePoints.textContent = scoring.eastWest.belowTheLine;
        opponentAboveTheLinePoints.textContent = scoring.eastWest.aboveTheLine;
        opponentVulnerable.textContent =
          scoring.eastWest.isVulnerable === true ? "Yes" : "No";
        isNorthSouth = true;
      } else {
        yourBelowTheLinePoints.textContent = scoring.eastWest.belowTheLine;
        yourAboveTheLinePoints.textContent = scoring.eastWest.aboveTheLine;
        yourVulnerable.textContent =
          scoring.eastWest.isVulnerable === true ? "Yes" : "No";
        opponentBelowTheLinePoints.textContent = scoring.northSouth.belowTheLine;
        opponentAboveTheLinePoints.textContent = scoring.northSouth.aboveTheLine;
        opponentVulnerable.textContent =
          scoring.northSouth.isVulnerable === true ? "Yes" : "No";
      }

      const gamesWe = [yourGameOnePoints, yourGameTwoPoints];
      const gamesThey = [opponentGameOnePoints, opponentGameTwoPoints];
      const gamesWeLabels = [yourGameOnePointsLabel, yourGameTwoPointsLabel];
      const gamesTheyLabels = [
        opponentGameOnePointsLabel,
        opponentGameTwoPointsLabel,
      ];
      let currentGameIndex = 0;
      const roundEndingScoresLength =
        scoring.gameRoundEndingScores.northSouth.length;

      for (let i = 0; i < roundEndingScoresLength; i++) {
        const belowTheLineScoreEW = scoring.gameRoundEndingScores.eastWest[i];
        const belowTheLineScoreNS = scoring.gameRoundEndingScores.northSouth[i];
        if (
          i === roundEndingScoresLength - 1 ||
          belowTheLineScoreEW >= 100 ||
          belowTheLineScoreNS >= 100
        ) {
          if (isNorthSouth) {
            if (gamesWe[currentGameIndex])
              gamesWe[currentGameIndex].textContent = belowTheLineScoreNS;
            if (gamesThey[currentGameIndex])
              gamesThey[currentGameIndex].textContent = belowTheLineScoreEW;
          } else {
            if (gamesWe[currentGameIndex])
              gamesWe[currentGameIndex].textContent = belowTheLineScoreEW;
            if (gamesThey[currentGameIndex])
              gamesThey[currentGameIndex].textContent = belowTheLineScoreNS;
          }
          if (gamesWeLabels[currentGameIndex])
            gamesWeLabels[currentGameIndex].classList.remove("hidden");
          if (gamesTheyLabels[currentGameIndex])
            gamesTheyLabels[currentGameIndex].classList.remove("hidden");
          currentGameIndex++;
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function convertIntCardValueToCharacter(int) {
    try {
      switch (int) {
        case 0:
          return "2";
        case 1:
          return "3";
        case 2:
          return "4";
        case 3:
          return "5";
        case 4:
          return "6";
        case 5:
          return "7";
        case 6:
          return "8";
        case 7:
          return "9";
        case 8:
          return "10";
        case 9:
          return "J";
        case 10:
          return "Q";
        case 11:
          return "K";
        case 12:
          return "A";
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function convertCardNumberToImgHTML(cardAsNumber) {
    try {
      if (
        typeof cardAsNumber !== "number" ||
        cardAsNumber < 0 ||
        cardAsNumber > 51
      )
        return "";
      const cardAsString = convertNumberToCardString(cardAsNumber);
      return getImgHTMLFromBid(cardAsString);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function handleDoubleButton(bids, hasMadeBid) {
    try {
      debugger
      let yourTeamHasBid, opponentHasBid;
      if ((spot.toLowerCase() === "north" || spot.toLowerCase() === "south")) {
        yourTeamHasBid = hasMadeBid.northSouth;
        opponentHasBid = hasMadeBid.eastWest;
      }
      else {
        yourTeamHasBid = hasMadeBid.eastWest;
        opponentHasBid = hasMadeBid.northSouth;
      }

      //#region  handle visibility of double button
      let hasPartnerBid;
      if (bids.length >= 2) {
        hasPartnerBid = !bids[bids.length - 2][1].match(/double/i) && !bids[bids.length - 2][1].match(/pass/i);
      }
      let youHaveBid;
      if (bids.length >= 4) {
        youHaveBid = !bids[bids.length - 4][1].match(/double/i) && !bids[bids.length - 4][1].match(/pass/i);
      }

      let shouldHide = false;
      if (bids.length === 2 && bids[bids.length - 1][1].match(/double/i)) shouldHide = false;
      else if (youHaveBid && bids[bids.length - 3][1].match(/double/i) && bids[bids.length - 2][1].match(/pass/i) && bids[bids.length - 1][1].match(/pass/i)) shouldHide = false;
      else if (!opponentHasBid && !hasPartnerBid) shouldHide = true;
      else if (
        bids.length >= 2 &&
        bids[bids.length - 2][1].match(/double/i) &&
        bids[bids.length - 1][1].match(/pass/i)
      )
        shouldHide = true;
      else if (
        bids.length >= 2 &&
        bids[bids.length - 2][1].match(/double/i) &&
        bids[bids.length - 1][1].match(/double/i)
      )
        shouldHide = true;
      else if (
        bids.length >= 2 &&
        !bids[bids.length - 2][1].match(/pass/i) &&
        !bids[bids.length - 2][1].match(/double/i) &&
        bids[bids.length - 1][1].match(/pass/i)
      )
        shouldHide = true;
      else if (
        bids.length >= 4 &&
        bids[bids.length - 4][1].match(/double/i) &&
        bids[bids.length - 3][1].match(/pass/i) &&
        bids[bids.length - 2][1].match(/pass/i) &&
        bids[bids.length - 1][1].match(/double/i)
      )
        shouldHide = true;
      else if (
        bids.length >= 4 &&
        bids[bids.length - 4][1].match(/double/i) &&
        bids[bids.length - 3][1].match(/double/i) &&
        bids[bids.length - 2][1].match(/pass/i) &&
        bids[bids.length - 1][1].match(/pass/i)
      )
        shouldHide = true;
      else if (
        bids.length >= 6 &&
        bids[bids.length - 6][1].match(/double/i) &&
        bids[bids.length - 5][1].match(/pass/i) &&
        bids[bids.length - 4][1].match(/pass/i) &&
        bids[bids.length - 3][1].match(/double/i) &&
        bids[bids.length - 2][1].match(/pass/i) &&
        bids[bids.length - 1][1].match(/pass/i)
      )
        shouldHide = true;

      if (shouldHide) {
        doubleButton.classList.add("hidden");
        doubleButton.classList.add("disabled");
        return;
      } else {
        doubleButton.classList.remove("hidden");
        doubleButton.classList.remove("disabled");
      }
      //#endregion
      //#region Change Double button text
      doubleButton.textContent = "Double";
      let indexOfDoubleBid = -1;
      for (let i = 0; i < bids.length; i++) {
        const bid = bids[i];
        if (bid[1].match(/double/i)) {
          indexOfDoubleBid = i;
        }
      }
      if (indexOfDoubleBid !== -1) {
        const allBidsAfterLastDoubleBid = bids.slice(indexOfDoubleBid + 1);
        for (let i = 0; i < allBidsAfterLastDoubleBid.length; i++) {
          const bidAfterLastDoubleBid = allBidsAfterLastDoubleBid[i];
          if (!bidAfterLastDoubleBid[1].match(/pass/i)) return;
        }
        doubleButton.textContent = "Re-Double";
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function openModal(modal) {
    try {
      if (modal === null || modal === undefined) return;
      modal.classList.add("active");
      modal.classList.remove("hidden");
      overlay.classList.remove("hidden");
      overlay.classList.add("active");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function closeModal(modal) {
    try {
      if (modal === null || modal === undefined) return;
      setTimeout(() => {
        claimBody.classList.remove("isDeclarer");
        claimBody.classList.remove("staticPosition");
      }, 666);
      claim.className = "";
      modal.classList.remove("active");
      overlay.classList.remove("active");
      (claimingCards = []), (otherHandCards = []);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function disableClaimButtons() {
    try {
      const usersTurnToPlay = globals.getUsersTurnToPlay();
      const playedCards = globals.getPlayedCardsFromClient();
      const nthCardPlayed = playedCards.length % 4;
      if (nthCardPlayed !== 0 || !usersTurnToPlay) {
        // claimAllButton.classList.add('disabled');
        claimSomeButton.classList.add("disabled");
      }
      // if (!usersTurnToPlay) claimNoneButton.classList.add('disabled');
    } catch (error) {
      console.error('error =', error);
    }
  }
  function enableClaimButtons(playedCardsInput) {
    try {
      const isDeclarer = globals.isDeclarer();
      if (!isDeclarer) return;
      const playedCards = playedCardsInput
        ? playedCardsInput
        : globals.getPlayedCardsFromClient();
      const nthCardPlayed = playedCards.length % 4;
      const usersTurnToPlay = globals.getUsersTurnToPlay();

      if (nthCardPlayed === 0 && usersTurnToPlay) {
        claimSomeButton.classList.remove("disabled");
        // claimAllButton.classList.remove('disabled');
      }
      // if (usersTurnToPlay) claimNoneButton.classList.remove('disabled');
    } catch (error) {
      console.error('error =', error);
    }
  }
  function hideClaimButtons() {
    try {
      claimNoneButton.classList.add("hidden");
      claimSomeButton.classList.add("hidden");
      claimAllButton.classList.add("hidden");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function showClaimButtons() {
    try {
      claimNoneButton.classList.remove("hidden");
      claimSomeButton.classList.remove("hidden");
      claimAllButton.classList.remove("hidden");
    } catch (error) {
      console.error('error =', error);
    }
  }
  function displayConfirmationAndEmit(numberOfTricksClaimed) {
    try {
      let msgToDisplay = `Are you sure you want to claim ${numberOfTricksClaimed} tricks?  This will show your hand to the other players.`;
      if (numberOfTricksClaimed === 0)
        msgToDisplay = `Are you sure you want to give up that easily?`;
      const ans = confirm(msgToDisplay);
      if (ans === true) {
        socket.binary(false).emit("claim", { room, numberOfTricksClaimed });
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function createHandArrayFromFlatArray(flatArray) {
    try {
      let spades = [],
        hearts = [],
        diamonds = [],
        clubs = [];
      for (let i = 0; i < flatArray.length; i++) {
        const cardAsNumber = parseInt(flatArray[i]);
        if (cardAsNumber >= 0 && cardAsNumber <= 12) clubs.push(cardAsNumber);
        else if (cardAsNumber >= 13 && cardAsNumber <= 25)
          diamonds.push(cardAsNumber);
        else if (cardAsNumber >= 26 && cardAsNumber <= 38)
          hearts.push(cardAsNumber);
        else if (cardAsNumber >= 39 && cardAsNumber <= 51)
          spades.push(cardAsNumber);
      }
      return [spades, hearts, diamonds, clubs];
    } catch (error) {
      console.error('error =', error);
    }
  }
  function claimSomeDeclarerInitial() {
    try {
      const claimSomeCardPlayOrderAsNumbers = [];
      for (let i = 0; i < claimSomeCardPlayOrder.length; i++) {
        const card = claimSomeCardPlayOrder[i];
        const cardAsNumber = parseInt(card.id.match(/\d+/i)[0]);
        if (!claimSomeCardPlayOrderAsNumbers.includes(cardAsNumber)) claimSomeCardPlayOrderAsNumbers.push(cardAsNumber);
      }

      socket
        .binary(false)
        .emit("claimSome", {
          room,
          claimingCards,
          otherHandCards,
          claimSomeCardPlayOrder: claimSomeCardPlayOrderAsNumbers,
          claimSomeClaimOrderHTML: document.querySelector('#claimSomeClaimOrder').innerHTML,
        });
      closeModal(claim);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function claimSomeClientResponse(e) {
    try {
      socket.binary(false).emit("sendClaimResponse", { room, response: true });
      closeModal(claim);
      displayWaiting(null, false)
    } catch (error) {
      console.error('error =', error);
    }
  }
  function claimSomeClientSubmit(e) {
    try {
      socket
        .binary(false)
        .emit("sendClaimResponse", {
          room,
          response: true,
          username,
          cardsChosen: otherHandCards,
        });
      closeModal(claim);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function claimNoResponse() {
    socket
    .binary(false)
    .emit("sendClaimResponse", { room, response: false });
    closeModal(claim);
  }
  function autoPassHandler (e) {
    try {
      shouldAutoPass = e.target.checked;
      if (shouldAutoPass) autoPassDurationDiv.classList.remove('hidden');
      else autoPassDurationDiv.classList.add('hidden');
      if (!makeBidButton.classList.contains('isNotUsersTurn')) makeBid('Pass');
    } catch (error) {
      console.error('error =', error);
    }
  }
  function autoPassDurationHandler (e) {
    try {
     autoPassWaitDuration = parseInt(e.target.value) * 1000;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getTricksToClaim() {
    try {
      claim.classList.add("claimSome");

      const usersTurnToPlay = globals.getUsersTurnToPlay();
      let claimingHand = globals.getHandFromClient();
      let otherHand = globals.getExposedHandFromClient();

      if (usersTurnToPlay === 2) {
        claimingHand = globals.getExposedHandFromClient();
        otherHand = globals.getHandFromClient();
      }

      drawCardsInHTML({
        hand: claimingHand,
        containerName: "declarersHandDivTop",
        outerContainerName: "claimBody",
        location: "bottom",
        isModalUse: true,
        isClaimSome: true,
        isBottomHand: false,
      });
      drawCardsInHTML({
        hand: otherHand,
        containerName: "declarersHandDivBottom",
        outerContainerName: "claimBody",
        location: "bottom",
        isModalUse: true,
        isClaimSome: true,
        isBottomHand: true
      });
      openModal(claim);
      obscureHand('claimCardBottom');
      addEventListenersToClaimCards(null, "claimCardTop");
      addEventListenersToClaimCards(null, "claimCardBottom");

      //#region ClaimYes and ClaimNo Button Listeners
      claimYes = document.querySelector("#claimYes");
      claimNo = document.querySelector("#claimNo");
      claimNo.addEventListener("click", (e) => {
        closeModal(claim);
        resetClaimSome();
      });
      claimYes.addEventListener("click", claimSomeDeclarerInitial);
      const claimReset = document.querySelector("#claimReset");
      if (claimReset) {
        claimReset.classList.add("disabled");
        claimReset.addEventListener("click", claimResetHandler);
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function claimSomeDefenseReset(e){
    try {
      clearPickedCards();
      hideCardsNotOfSuitsNeeded();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetClaimSome() {
    try {
      claimSomeCardPlayOrder = [];
      document.querySelector('#claimSomeClaimOrder').innerHTML = '';
    } catch (error) {
      console.error('error =', error);
    }
  }
  function addEventListenersToClaimCards(cardsToShow, className) {
    try {
      const cards = document.querySelectorAll(`.${className}`);
      for (let i = 0; i < cards.length; i++) {
        const card = cards[i];
        card.addEventListener("click", (e) => {
          if (e.target.classList.contains('unplayable') || e.target.classList.contains('notDeselectable')) return;
          e.stopPropagation();
          e.stopImmediatePropagation();
          e.target.classList.toggle("picked");
          const cardAsNumber = e.target.id.match(/\d{1,2}$/)[0];
          if (e.target.classList.contains("picked")) {
            if (e.target.classList.contains("claimCardTop")) {
              if (!claimingCards.includes(cardAsNumber))
                claimingCards.push(cardAsNumber);
            } 
            else if (e.target.classList.contains("claimCardBottom")) {
              if (!otherHandCards.includes(cardAsNumber))
                otherHandCards.push(cardAsNumber);
            }
            if (!claim.classList.contains('claimSomeDefense') && !claimSomeCardPlayOrder.includes(e.target)) claimSomeCardPlayOrder.push(e.target);
          } 
          else {
            if (e.target.classList.contains("claimCardTop")) {
              const index = claimingCards.findIndex(
                (number) => number === cardAsNumber
              );
              if (index !== -1) claimingCards.splice(index, 1);
            } 
            else if (e.target.classList.contains("claimCardBottom")) {
              const index = otherHandCards.findIndex(
                (number) => number === cardAsNumber
              );
              
              if (index !== -1) {
                if (!claim.classList.contains('claimSomeDefense')) {
                  otherHandCards.splice(index, 1);
                }
                else {
                  let cardsToRemovePicked = otherHandCards.splice(index);
                  const picked = document.querySelectorAll('.picked');
                  cardsToRemovePicked = getCardHTMLElementFromString(picked, cardsToRemovePicked);
                  removePicked(cardsToRemovePicked);
                  cardsToShow = otherHandCards;
                }
              }
            }         
            if (!claim.classList.contains('claimSomeDefense')) {
              const index = claimSomeCardPlayOrder.findIndex((cardLocal) => cardLocal.id.match(/\d+/i)[0] === e.target.id.match(/\d+/i)[0]);
              if (index !== -1) {
                const toRemovePicked = claimSomeCardPlayOrder.splice(index, claimSomeCardPlayOrder.length - index);
                removePicked(toRemovePicked);
                if (claimSomeCardPlayOrder.length === 0) {
                  illuminateHand('claimCardTop');
                  document.querySelector('#claimReset').classList.add('disabled');
                }
                else {
                  obscureHand('claimCardTop');
                }
                obscureHand('claimCardBottom');
              }
            }
          }
    
          if (claim.classList.contains('claimSomeDefense')) {
            hideCardsNotOfSuitsNeeded();
          }
          else {
            navigateDeclarerCardSelection(e, claimSomeCardPlayOrder[claimSomeCardPlayOrder.length - 1]);
          }
    
          const deselectEnabled = document.querySelector('#deselectEnabled');
          if (deselectEnabled) {
            if (deselectEnabled.checked) e.target.classList.remove('notDeselectable');
            else e.target.classList.add('notDeselectable');
          }
          enableClaimYes(cardsToShow);
        });
      }

      if (cardsToShow) {
        const claimYes = document.querySelector("#claimYes");
        claimYes.removeEventListener("click", claimSomeDeclarerInitial);
        claimYes.removeEventListener("click", claimSomeClientResponse);
        claimYes.addEventListener("click", claimSomeClientSubmit);
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function changeClaimSomeClaimOrderHTML(leftClaimingStatus, leftHandOrigin, rightClaimingStatus, rightHandOrigin) {
    try {
      const claimSomeClaimOrder = document.querySelector('#claimSomeClaimOrder');
      if (!claimSomeClaimOrder) return '';
      let newInnerHTML, charToReplace, newCharacter;

      if (leftHandOrigin && leftHandOrigin.match(/dummy/i)) charToReplace = 'D';
      else charToReplace = 'H';
      newCharacter = leftClaimingStatus.split(' ')[0].substr(0,1);
      newInnerHTML = claimSomeClaimOrder.innerHTML.replaceAll(charToReplace, newCharacter);

      if (rightHandOrigin && rightHandOrigin.match(/dummy/i)) charToReplace = 'D';
      else charToReplace = 'H';
      newCharacter = rightClaimingStatus.split(' ')[0].substr(0,1);
      newInnerHTML = newInnerHTML.replaceAll(charToReplace, newCharacter);

      document.querySelector('#claimSomeClaimOrder').innerHTML = newInnerHTML;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getCardsToTossHTML(cards) {
    try {
      let innerHTML = '';
      for (let i = 0; i < cards.length; i++) {
        const cardAsNumber = parseInt(cards[i].id.match(/\d{1,2}$/i)[0]);
        
        if (i === cards.length - 1 && cards.length === 2) innerHTML += ' and ';
        else if (i === cards.length - 1 && cards.length > 2) innerHTML += ', and ';
        innerHTML += convertCardNumberToImgHTML(parseInt(cardAsNumber));
        if (i >= 0 && i < cards.length - 2 && cards.length > 2) innerHTML += ', ';
      }
      return innerHTML;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function hideCardsNotOfSuitsNeeded() {
    try {
      const currentCardToSelect = document.querySelector('#currentCardToSelect');
      let msg;
      obscureHand('claimCardBottom');
      let selectedCards = document.querySelectorAll('.picked');
      if (selectedCards && selectedCards.length * 2 === claimSomeCardPlayOrder.length) {
        const cardsToTossHTML = getCardsToTossHTML(selectedCards);
        msg  = `Sacrifice the ${cardsToTossHTML}?<br>(${globals.getTrumpSuit()} are trump)`;
      }
      else {
        if (!selectedCards || selectedCards.length === 0) selectedCards = [];
        const leadCardAsNumber = claimSomeCardPlayOrder[selectedCards.length * 2];
        const followingCardAsNumber = claimSomeCardPlayOrder[selectedCards.length * 2 + 1];
        illuminatePlayableCards({pickedCardHandClass: 'claimCardBottom', cardsToUse: leadCardAsNumber, isSingleCard: true});
        msg = displayCurrentCardToSelectMessage(leadCardAsNumber, followingCardAsNumber);
      }
      currentCardToSelect.innerHTML = msg;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function displayCurrentCardToSelectMessage(leadCardAsNumber, followingCardAsNumber) {
    try {
      const suit = globals.getSuitFromNumber(leadCardAsNumber);
      return `If possible, select a ${suit.substr(0, suit.length - 1)} to sacrifice to the ${convertCardNumberToImgHTML(leadCardAsNumber)} and ${convertCardNumberToImgHTML(followingCardAsNumber)}:<br>(${globals.getTrumpSuit()} are trump)`;
    } 
    catch (error) {
      console.log('error displaying Current cardto Select------------------------------------------------');  
      console.log('error =', error);
      return "Error";
    }
  }
  function navigateDeclarerCardSelection(e, card) {
    try {
      populateClaimOrder();
      const pickedCardHandClass = card.classList.contains('claimCardTop') ? 'claimCardTop' : 'claimCardBottom';

      if (claimSomeCardPlayOrder.length % 2 !== 0) {
        obscureHand(pickedCardHandClass);
        illuminatePlayableCards({pickedCardHandClass, cardsToUse: claimSomeCardPlayOrder});
      }
      else {
        obscureHand('claimCardTop');
        obscureHand('claimCardBottom');
        const winningCard = getWinningCard(
          parseInt(claimSomeCardPlayOrder[claimSomeCardPlayOrder.length - 2].id.match(/\d{1,2}$/)[0]),
          parseInt(claimSomeCardPlayOrder[claimSomeCardPlayOrder.length - 1].id.match(/\d{1,2}$/)[0]),
        );
        const {handWinningCardIsIn, otherHand} = getWinningHandName(winningCard);
        if (handWinningCardIsIn && otherHand) {
          illuminateHand(handWinningCardIsIn);
          obscureHand(otherHand);
        }
      }

    } catch (error) {
      console.log('error in navigateCardSelection------------------------------------------------');
      console.log('error =', error);
    }
  }
  function populateClaimOrder() {
    try {
      const claimSomeClaimOrder = document.querySelector('#claimSomeClaimOrder');
      if (claimSomeClaimOrder) claimSomeClaimOrder.innerHTML = '';
      if (!claimSomeClaimOrder) return;

      for (let i = 0; i < claimSomeCardPlayOrder.length; i++) {
        const cardElement = claimSomeCardPlayOrder[i];
        if (i === 0) {
          claimSomeClaimOrder.innerHTML += `
            <span>Trick</span>
            <span>Lead</span>
            <span>Follow</span>
            <span>In</span>
          `;
        }
        if (i % 2 !== 0) {
          const innerHTMLFirst = convertCardNumberToImgHTML(parseInt(claimSomeCardPlayOrder[i-1].id.match(/\d{1,2}$/)[0]));
          const innerHTMLSecond = convertCardNumberToImgHTML(parseInt(cardElement.id.match(/\d{1,2}$/)[0]));

          claimSomeClaimOrder.innerHTML += `<span>${(i - 1) / 2 + 1}${i === 1 ? 'st' : i === 3 ? 'nd' : i === 5 ? 'rd' : 'th'}:</span>`
          claimSomeClaimOrder.innerHTML += innerHTMLFirst;
          claimSomeClaimOrder.innerHTML += innerHTMLSecond;
          claimSomeClaimOrder.innerHTML += getTakenByHandSpan(parseInt(claimSomeCardPlayOrder[i - 1].id.match(/\d{1,2}$/)[0]), parseInt(claimSomeCardPlayOrder[i].id.match(/\d{1,2}$/)[0]));
        }
      }
    } catch (error) {
      console.log('error populatingClaimOrder------------------------------------------------');
      console.log('error =', error);
    }
  }
  function getTakenByHandSpan(leadCard, followedCard) {
    try {
      const winningCard = getWinningCard(leadCard, followedCard);
      const {handWinningCardIsIn, otherHand} = getWinningHandName(winningCard);
      let divToUse;
      if (handWinningCardIsIn === 'claimCardTop') divToUse = 'claimingHandDiv';
      else divToUse = 'otherHandDiv';
      
      divToUse = document.querySelector(`#${divToUse}`);
      let winningHand = divToUse.textContent.substr(0, 1);
      return `<span>${winningHand}</span>`;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function removePicked(cardsToRemovePickedFrom) {
    try {
      for (let i = 0; i < cardsToRemovePickedFrom.length; i++) {
        const card = cardsToRemovePickedFrom[i];
        const cardAsNumber = card.id.match(/\d{1,2}$/)[0];
        otherHandCards = otherHandCards.filter(card => card !== cardAsNumber);
        claimingCards = claimingCards.filter(card => card !== cardAsNumber);
        card.classList.remove('picked');
        card.classList.add('unplayable');

      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getWinningHandName(winningCard) {
    try {
      const topHand = document.querySelectorAll('.claimCardTop');
      for (let i = 0; i < topHand.length; i++) {
        const card = topHand[i];
        const cardAsNumber = card.id.match(/\d{1,2}$/)[0];
        if (parseInt(cardAsNumber) === winningCard) return {handWinningCardIsIn: 'claimCardTop', otherHand: 'claimCardBottom'};
      }

      const bottomHand = document.querySelectorAll('.claimCardBottom');
      for (let i = 0; i < bottomHand.length; i++) {
        const card = bottomHand[i];
        const cardAsNumber = card.id.match(/\d{1,2}$/)[0];
        if (parseInt(cardAsNumber) === winningCard) return {handWinningCardIsIn: 'claimCardBottom', otherHand: 'claimCardTop'};
      }
      return null;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function illuminateHand(handToShow) {
    try {
      const cardsToShow = document.querySelectorAll(`.${handToShow}`);
      for (let i = 0; i < cardsToShow.length; i++) {
        const card = cardsToShow[i];
        card.classList.remove('unplayable');
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function obscureHand(handToHide) {
    try {
      const cardsToHide = document.querySelectorAll(`.${handToHide}`);
      for (let i = 0; i < cardsToHide.length; i++) {
        const card = cardsToHide[i];
        if (!card.classList.contains('picked')) {
          card.classList.add('unplayable');
        }
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function illuminatePlayableCards({pickedCardHandClass, cardsToUse, isSingleCard = false}) {
    try {
      let classTouse = 'claimCardBottom';
      if (!isSingleCard && pickedCardHandClass === 'claimCardBottom') classTouse = 'claimCardTop';
      const cardsFromOtherhand = document.querySelectorAll(`.${classTouse}`);
      const cardAsNumber = isSingleCard ? cardsToUse : cardsToUse[cardsToUse.length - 1].id.match(/\d+/i)[0];;
      const suitOfLastCardPlayed = globals.getSuitFromNumber(cardAsNumber);

      //#region Showing Cards of Same Suit
      let cardsShown = 0;
      for (let i = 0; i < cardsFromOtherhand.length; i++) {
        const card = cardsFromOtherhand[i];
        const cardAsNumber = card.id.match(/\d{1,2}$/)[0];
        const suitOfCard = globals.getSuitFromNumber(cardAsNumber);
        if (suitOfCard === suitOfLastCardPlayed && !card.classList.contains('picked')) {
          card.classList.remove('unplayable');
          cardsShown++;
        }
        else if(!card.classList.contains('picked')) {
          card.classList.add('unplayable');
        }
      }
      //#endregion
      //#region Showing All cards if none are same suit
      if (cardsShown === 0) {
        for (let i = 0; i < cardsFromOtherhand.length; i++) {
          const card = cardsFromOtherhand[i];
          card.classList.remove('unplayable');
        }
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getWinningCard(leadCard, followedCard) {
    try {
      const trumpSuit = globals.getTrumpSuit();
      const leadCardSuit = globals.getSuitFromNumber(leadCard);
      const followedCardSuit = globals.getSuitFromNumber(followedCard);

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
  function handleClaimReset() {
    try {
      const claimReset = document.querySelector("#claimReset");
      if (claimReset) {
        if (claimingCards.length >= 1 || otherHandCards.length >= 1)
          claimReset.classList.remove("disabled");
        else claimReset.classList.add("disabled");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function enableClaimYes(cardsToShow) {
    try {
      const claimYes = document.querySelector("#claimYes");
      handleClaimReset();
      //#region Handling Declarer Initial Choices
      if (!cardsToShow) {
        if (claimSomeCardPlayOrder.length % 2 === 0) return claimYes.classList.remove('disabled');
        else return claimYes.classList.add('disabled');
      } 
      //#endregion
      //#region Handling Defense Card Choices
      else {
        const requiredLength = claimSomeCardPlayOrder.length / 2;
        const pickedCards = document.querySelectorAll('.picked');
        if (
          ((pickedCards && pickedCards.length === 0)) || requiredLength === 0 ||
          pickedCards.length !== requiredLength
        )
          return claimYes.classList.add("disabled");
        else {
          obscureHand('claimCardBottom');
          return claimYes.classList.remove('disabled');
        }
      } 
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function displayWaiting(usernames, isDeclarer = false) {
    try {
      claimYes.classList.add("hidden");
      claimNo.classList.add("hidden");
      closeModalButton.classList.add("hidden");
      let playerThreeDiv = !usernames
        ? `
          <div id="playerThreeStatus">
              <span id='playerThree'></span>
              <div id="rightPlayerDecision">
                  <span class="dotOne">.</span>
                  <span class="dotTwo">.</span>
                  <span class="dotThree">.</span>
              </div>  
          </div>`
        : "";
      claim.innerHTML = `
              <div id="claimHeader">
                  <div id="claimTitle">
                      ${isDeclarer ? 'Waiting for Responses' : 'Waiting for Partner'}:
                  </div>
                  <button id="closeClaim" class="hidden">&times;</button>
              </div>
              <div id="claimBody" class='isDeclarer ${!isDeclarer ? 'isDefense' : ''}'>
                  <div id='usersReady'>
                    <div id="leftUserReadyStatus" class=''>
                        <span id='leftPlayer'>Ann </span>
                        <div id="leftPlayerDecision">
                            <span class="dotOne">.</span>
                            <span class="dotTwo">.</span>
                            <span class="dotThree">.</span>
                        </div>  
                    </div>
                    <div id="rightUserReadyStatus" class='hidden'>
                        <span id='rightPlayer'>Garrett </span>
                        <div id="rightPlayerDecision">
                            <span class="dotOne">.</span>
                            <span class="dotTwo">.</span>
                            <span class="dotThree">.</span>
                        </div>  
                    </div>
                    ${playerThreeDiv}
                  </div>
                  <div id='responseDiv'> </div>
                  <button id='cancelClaimButton' class='btn btn-md'>Cancel</button>
              </div>
          `;
          
      claim.classList.add("isDeclarer");
      const leftPlayer = document.querySelector("#leftPlayer");
      const rightPlayer = document.querySelector("#rightPlayer");

      if (isDeclarer) {
          document.querySelector('#rightUserReadyStatus').classList.remove('hidden');
        if (!usernames) {
          const playerThree = document.querySelector("#playerThree");
          playerThree.textContent = leftUser.textContent.replace("(Dealer):", "");
          leftPlayer.textContent = rightUser.textContent.replace("(Dealer):", "");
          rightPlayer.textContent = topUser.textContent.replace("(Dealer):", "");
        } else  {
          leftPlayer.textContent = usernames[0].trim();
          rightPlayer.textContent = usernames[1].trim();
        }
      }
      else {
          if (usernames && usernames.length >= 1) { 
            leftPlayer.textContent = usernames[0].trim();
            document.querySelector('#leftUserReadyStatus').classList.add('extraPaddingTop');
          }
          else {
            claim.innerHTML = `
            <div id="claimHeader">
                <div id="claimTitle">
                    Waiting for Partner:
                    <div id="">
                      <span class="dotOne">.</span>
                      <span class="dotTwo">.</span>
                      <span class="dotThree">.</span>      
                    </div>              
                </div>
                <button id="closeClaim" class="hidden">&times;</button>
            </div>
            <div id="claimBody" class='isDeclarer ${!isDeclarer ? 'isDefense' : ''}'>
            <div id='usersReady'>
              <div id="leftUserReadyStatus" class=''>
                  <span id='leftPlayer'>You:</span>
                  <div id="leftPlayerDecision" class='greenCheck'>
                     &check;
                  </div>  
              </div>
              <div id="rightUserReadyStatus" class='hidden'>
                  <span id='rightPlayer'>Partner </span>
                  <div id="rightPlayerDecision">
                      <span class="dotOne">.</span>
                      <span class="dotTwo">.</span>
                      <span class="dotThree">.</span>
                  </div>  
              </div>
              </div>
                <button id='cancelClaimButton' class='btn btn-md'>Cancel</button>
            </div>`;
          }
      }
      document.querySelector('#cancelClaimButton').addEventListener('click', cancelClaimHandler);
      openModal(claim);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getNumberOfCardsInSuit(handArray, cardAsNumber) {
    try {
      if (
        cardAsNumber === undefined ||
        cardAsNumber === null ||
        handArray === undefined ||
        handArray === null
      )
        return;
      const suitMinMax = globals.getMinMaxOfSuit(cardAsNumber);
      const flatHand = handArray.flatten(3);

      let suitCount = 0;
      for (let i = 0; i < flatHand.length; i++) {
        const cardAsNumberInHand = parseInt(flatHand[i]);
        if (
          cardAsNumberInHand >= suitMinMax.min &&
          cardAsNumberInHand <= suitMinMax.max
        )
          suitCount++;
      }
      return suitCount;
    } catch (error) {
      console.error('error =', error);
    }
  }
  function drawCardsForClaim(cardsToShow, otherHandCards, declarersTurnToPlay) {
    try {
      //#region Drawing claimSome offense
      if (declarersTurnToPlay === null) {
        if (globals.getIsExposedLeft()) {
          claim.className = "claimRight";
          drawCardsInHTML({
            hand: globals.reArrangeHandArray(
              cardsToShow,
              clientPreferences.suitSortPreference,
              clientPreferences.trumpOnLeftHand
            ),
            containerName: "declarersHandDiv",
            outerContainerName:"claimBody",
            location: "right",
            isModalUse: true,
          });
        } else {
          claim.className = "claimLeft";
          drawCardsInHTML({
            hand: globals.reArrangeHandArray(
              cardsToShow,
              clientPreferences.suitSortPreference,
              clientPreferences.trumpOnLeftHand
            ),
            containerName: "declarersHandDiv",
            outerContainerName: "claimBody",
            location: "left",
            isModalUse: true,
          });
        }
      }
      //#endregion
      //#region Drawing claimSomeDefense
      else {
        claim.classList.add("claimSomeDefense");
        document.querySelector("#claimBody").className = "claimSomeDefense";
        document.querySelector("#usersHandDiv").className = "claimSomeDefense";
        document.querySelector("#usersHand").className = "claimSomeDefense";
        cardsToShow = globals.reArrangeHandArray(
          cardsToShow,
          clientPreferences.suitSortPreference,
          clientPreferences.trumpOnLeftHand
        );
        otherHandCards = globals.reArrangeHandArray(
          otherHandCards,
          clientPreferences.suitSortPreference,
          clientPreferences.trumpOnLeftHand
        );

        const isExposedLeft = globals.getIsExposedLeft();
        let leftClaimingStatus = "",
          rightClaimingStatus = "",
          firstHand,
          secondHand;
        let leftHandOrigin = isExposedLeft
          ? "(Dummy Hand):"
          : "(Declarer's Hand):";
        let rightHandOrigin = isExposedLeft
          ? "(Declarer's Hand):"
          : "(Dummy Hand):";

        if (
          (isExposedLeft && declarersTurnToPlay === 1) ||
          (!isExposedLeft && declarersTurnToPlay === 2)
        ) {
          leftClaimingStatus = "Following Hand";
          rightClaimingStatus = "Leading Hand";

          firstHand = otherHandCards;
          secondHand = cardsToShow;
        } else {
          leftClaimingStatus = "Leading Hand";
          rightClaimingStatus = "Following Hand";

          firstHand = cardsToShow;
          secondHand = otherHandCards;
        }

        document.querySelector("#claimBodyLeftDiv").innerHTML = `
                  <div>${leftClaimingStatus}</div>
                  <div>${leftHandOrigin}</div>
              `;
        document.querySelector("#claimBodyRightDiv").innerHTML = `
                  <div>${rightClaimingStatus}</div>
                  <div>${rightHandOrigin}</div>
              `;

        changeClaimSomeClaimOrderHTML(leftClaimingStatus, leftHandOrigin, rightClaimingStatus, rightHandOrigin);

        drawCardsInHTML({
          hand: firstHand,
          containerName: "declarersHandDivLeft",
          outerContainerName: "claimBody",
          location: "left",
          isModalUse: true,
          isClaimSome: true,
          isBottomHand: false,
        });
        drawCardsInHTML({
          hand: secondHand,
          containerName: "declarersHandDivRight",
          outerContainerName: "claimBody",
          location: "right",
          isModalUse: true,
          isClaimSome: true,
          isBottomHand: false,
        });
        drawCardsInHTML({
          hand: globals.getHandFromClient(),
          containerName: "usersHand",
          outerContainerName: "usersHandDiv",
          location: "bottom",
          isModalUse: true,
          isClaimSome: true,
          isBottomHand: true,
        });
        hideCardsNotOfSuitsNeeded();
        addEventListenersToClaimCards(cardsToShow, "claimCardBottom");
      }
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getIsAppleDevice() {
    try {
      return (
        [
          "iPad Simulator",
          "iPhone Simulator",
          "iPod Simulator",
          "iPad",
          "iPhone",
          "iPod",
        ].includes(navigator.platform) ||
        // iPad on iOS 13 detection
        (navigator.userAgent.includes("Mac") && "ontouchend" in document)
      );
    } catch (error) {
      console.error('error =', error);
    }
  }
  function undoLastBid() {
    socket
      .binary(false)
      .emit("undoLastBid", { username, room, originalSocketId: socketId });
  }
  function undoLastPlay() {
    scrollToTop();
    socket
      .binary(false)
      .emit("undoLastPlay", { username, room, originalSocketId: socketId });
  }
  function resetAllBidButtons() {
    try {
      const bidButtonsActive = document.querySelectorAll(".disabled");
      for (let i = 0; i < bidButtonsActive.length; i++) {
        const bidButton = bidButtonsActive[i];
        resetBidButton(bidButton);
      }
      resetBid();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function resetBidButton(bidButton) {
    try {
      bidButton.classList.remove("disabled");
      for (let i = 0; i < bidButton.children.length; i++) {
        const childNode = bidButton.children[i];
        childNode.classList.remove("redFiltered");
        childNode.classList.remove("blackFiltered");
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setBidLabels(currentBidder, lastThreeBids) {
    try {
      if (
        currentBidder === undefined ||
        currentBidder === null ||
        lastThreeBids === undefined ||
        lastThreeBids === null
      )
        return;

      const currentBidderLocation = getLabelLocationFromBidder(currentBidder);

      let bidLocations;
      if (currentBidderLocation.toLowerCase() === "bottom")
        bidLocations = ["left", "top", "right"];
      if (currentBidderLocation.toLowerCase() === "left")
        bidLocations = ["top", "right", "bottom"];
      else if (currentBidderLocation.toLowerCase() === "top")
        bidLocations = ["right", "bottom", "left"];
      else if (currentBidderLocation.toLowerCase() === "right")
        bidLocations = ["bottom", "left", "top"];

      for (let i = lastThreeBids.length - 1; i >= 0; i--) {
        const bidArray = lastThreeBids[i];
        const imgHTML = getImgHTMLFromBid(bidArray[1]);
        const labelLocation = bidLocations[i];
        setBidLabel(labelLocation, imgHTML);
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function getLastThreeBids(bids) {
    try {
      if (bids === undefined || bids === null) return;
      if (bids.length >= 3) {
        return bids.slice(bids.length - 3);
      } else {
        const toReturn = [];
        for (let i = 0; i < 3 - bids.length; i++) {
          toReturn.push(["", ""]);
        }
        for (let i = 0; i < 3 - (3 - bids.length); i++) {
          const bid = bids[i];
          if (bid) toReturn.push(bid);
        }
        return toReturn;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  function undoYesResponse(e) {
    try {
      socket
        .binary(false)
        .emit("sendUndoResponse", {
          usernameOfRequester: e.target.dataset["usernameofrequester"],
          username,
          room,
          response: true,
          isDuringPlaying: e.target.dataset["isduringplaying"],
        });
      resetOverlayAndClaim();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function undoNoResponse(e) {
    try {
      socket
        .binary(false)
        .emit("sendUndoResponse", {
          usernameOfRequester: e.target.dataset["usernameofrequester"],
          username,
          room,
          response: false,
          isDuringPlaying: e.target.dataset["isduringplaying"],
        });
      resetOverlayAndClaim();
    } catch (error) {
      console.error('error =', error);
    }
  }
  function changeColorThemeHandlerBidding(e) {
    try {
      currentTheme = e.target.value;
      changeColorTheme(e);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function changeColorThemeHandler(e) {
    try {
      changeColorThemeHandlerBidding(e);
      globals.loadNewCards(e.target.value);
    } catch (error) {
      console.error('error =', error);
    }
  }
  function changeColorTheme(e) {
    try {
      const pathToUse = currentTheme ? `${currentTheme}/` : clientPreferences.colorTheme ? `${clientPreferences.colorTheme}/` : ''
      document.querySelector('#club').src = `/imgs/suitIcons/${pathToUse}Club.png`;
      document.querySelector('#diamond').src = `/imgs/suitIcons/${pathToUse}Diamond.png`;
      document.querySelector('#heart').src = `/imgs/suitIcons/${pathToUse}Heart.png`;
      document.querySelector('#spade').src = `/imgs/suitIcons/${pathToUse}Spade.png`;
      setStyleVariables(e);
      window.localStorage.setItem('theme', currentTheme ? currentTheme : clientPreferences.colorTheme);
      globals.setCanvasColors(
        docStyle.getPropertyValue('--color'),
        docStyle.getPropertyValue('--instructionsColor'),
        docStyle.getPropertyValue('--backgroundColor'),
        docStyle.getPropertyValue('--playAreaFillColor'),
      );
      //#region Set Volume Slider Color
      setTimeout(() => {
        const alpha = getNewAlpha(volumeSlider.value);
        document.documentElement.style.setProperty(varName, docStyle.getPropertyValue('--redSuit') + alpha);
      }, 10);
      //#endregion
    } catch (error) {
      console.error('error =', error);
    }
  }
  function setStyleVariables(e) {
    try {
      const htmlElement = document.querySelector('html');
      for (let i = 0; i < colorTheme.children.length; i++) {
        const child = colorTheme.children[i];
        htmlElement.classList.remove(child.value);
      }
      htmlElement.classList.add(e.target.value);
    } catch (error) {
      console.error('error =', error);
    }
  }
  async function getStatsFromServer() {
    //TODO: undo the comments when done with setStats
    try {
      const stream = await fetch(`/stats`);
      const statsObj = await stream.json();
      if (!statsObj) return;
      hasDownloadedStats = true;
      setStats(statsObj);
    } catch (error) {
      console.log('error getting stats------------------------------------------------', error);
    }
  }
  function setStats(statsObj) {
    const roundingSpecificity = 100;
    const avgHCP = Math.round(statsObj.totalPoints.highCard / statsObj.dealsPlayed * roundingSpecificity) / roundingSpecificity;
    const avgDist = Math.round(statsObj.totalPoints.distribution / statsObj.dealsPlayed * roundingSpecificity) / roundingSpecificity;
    const dblPercent = Math.round(statsObj.dealsWonDoubled / statsObj.dealsDoubled * roundingSpecificity * 100) / roundingSpecificity;
    const winPercentage = Math.round(statsObj.dealsWon / statsObj.dealsPlayed * roundingSpecificity * 100) / roundingSpecificity;
    const winPercentageDeclarer = Math.round(statsObj.dealsWonAsDeclarer / statsObj.dealsPlayedAsDeclarer * roundingSpecificity * 100) / roundingSpecificity;
    const winPercentageDefense = Math.round((statsObj.dealsWonAsDefense) / (statsObj.dealsPlayedAsDefense) * roundingSpecificity * 100) / roundingSpecificity; 
    const gameWinPercent = Math.round((statsObj.gamesWon) / (statsObj.gamesPlayed) * roundingSpecificity * 100) / roundingSpecificity; 
    const dealsPlayedAsDummyValue = statsObj.dealsPlayed - (statsObj.dealsPlayedAsDeclarer + statsObj.dealsPlayedAsDefense);
    const dealsWonAsDummyValue = statsObj.dealsWon - (statsObj.dealsWonAsDeclarer + statsObj.dealsWonAsDefense);
    const winPercentageDummy = Math.round(dealsWonAsDummyValue / dealsPlayedAsDummyValue * roundingSpecificity * 100) / roundingSpecificity;

    averageHighCardPoints.textContent = isNaN(avgHCP) ? "N/A" : avgHCP;
    averageDistributionPoints.textContent = isNaN(avgDist) ? "N/A" : avgDist;
    highestIndividualHighCardPoints.textContent = statsObj.maximums.highCard === 0 ? "N/A" : statsObj.maximums.highCard;
    highestIndividualdDistributionPoints.textContent = statsObj.maximums.distribution === 0 ? "N/A" : statsObj.maximums.distribution;
    highestTotalHighCardPoints.textContent = statsObj.maximums.combined.highCard === 0 ? "N/A" : statsObj.maximums.combined.highCard;
    highestTotaldDistributionPoints.textContent = statsObj.maximums.combined.distribution === 0 ? "N/A" : statsObj.maximums.combined.distribution;

    dealsPlayed.textContent = statsObj.dealsPlayed === 0 ? 'N/A' : statsObj.dealsPlayed;
    dealsWon.textContent = statsObj.dealsPlayed === 0 ? 'N/A' : statsObj.dealsWon;
    
    dealWinPercentageTotal.textContent = statsObj.dealsPlayed === 0 ? 'N/A' : isNaN(winPercentage) ? 0 : winPercentage;
    dealWinPercentageDeclarer.textContent = statsObj.dealsPlayedAsDeclarer === 0 ? 'N/A' : isNaN(winPercentageDeclarer) ? 0 : winPercentageDeclarer;
    dealWinPercentageDummy.textContent = dealsPlayedAsDummyValue === 0 ? 'N/A' : isNaN(winPercentageDummy) ? 0 : winPercentageDummy;
    dealWinPercentageDefense.textContent = statsObj.dealsPlayedAsDefense === 0 ? 'N/A' : isNaN(winPercentageDefense) ? 0 : winPercentageDefense;

    dealsPlayedAsDeclarer.textContent = statsObj.dealsPlayedAsDeclarer === 0 ? 'N/A' : statsObj.dealsPlayedAsDeclarer;
    dealsPlayedAsDummy.textContent = dealsPlayedAsDummyValue === 0 ? 'N/A' : dealsPlayedAsDummyValue;
    dealsPlayedAsDefense.textContent = statsObj.dealsPlayedAsDefense === 0 ? 'N/A' : statsObj.dealsPlayedAsDefense;

    dealsWonAsDeclarer.textContent = statsObj.dealsPlayedAsDeclarer === 0 ? 'N/A' : statsObj.dealsWonAsDeclarer;
    dealsWonAsDummy.textContent = dealsPlayedAsDummyValue === 0 ? 'N/A' : dealsWonAsDummyValue;
    dealsWonAsDefense.textContent = statsObj.dealsPlayedAsDefense === 0 ? 'N/A' : statsObj.dealsWonAsDefense;

    dealsDoubled.textContent = statsObj.dealsDoubled === 0 ? 'N/A' : statsObj.dealsDoubled;
    dealsWonDoubled.textContent = statsObj.dealsDoubled === 0 ? 'N/A' : statsObj.dealsWonDoubled;
    dealsDoubledPercentage.textContent = statsObj.dealsDoubled === 0 ? 'N/A' : isNaN(dblPercent) ? 0 : dblPercent;

    gamesPlayed.textContent = statsObj.gamesPlayed === 0 ? 'N/A' : statsObj.gamesPlayed;
    gamesWon.textContent = statsObj.gamesPlayed === 0 ? 'N/A' : statsObj.gamesWon;
    gameWinPercentage.textContent = statsObj.gamesPlayed === 0 ? 'N/A' : isNaN(gameWinPercent) ? 0 : gameWinPercent;
    ties.textContent = typeof statsObj.ties === 'number' ? statsObj.ties : 'N/A';
  }
  //#region Getting Hand Point Values
  const highCardPointValues = {
    hcp: {
      ace: 4,
      king: 3,
      queen: 2,
      jack: 1,
    },
    alternative: {
      ace: 4.5,
      king: 3,
      queen: 1.5,
      jack: 0.75,
      ten: 0.25,
    },
  };
  const suitLengthRequiredToCount = {
    king: 2,
    queen: 3,
    jack: 4,
    ten: 5,
  }
  const distributionPointValues = {
    //suits with n cards get n-4 points (0 for 4 and below card suits)
    shortness: {
      void: 3,
      singleton: 2,
      doubleton: 1,
    },
    length: {
      fiveCardSuit: 1,
      sixCardsSuit: 2,
      sevenCardsSuit: 3,  
    },
  };
  function getHighCardPoints(hand) {
    try {
      let pointCountsToUse = highCardPointValues.hcp;
      if (
        clientPreferences.pointCountingConvention.toLowerCase() === "alternative"
      ) {
        pointCountsToUse = highCardPointValues.alternative;
      }

      if (hand === undefined || hand === null) return -1;
      let points = 0;
      for (let i = 0; i < hand.length; i++) {
        const suit = hand[i];
        for (let j = 0; j < suit.length; j++) {
          const cardValue = suit[j];
          if (
            cardValue % 13 === 8 &&
            clientPreferences.pointCountingConvention.toLowerCase() ===
              "alternative" && suit.length >= suitLengthRequiredToCount.ten
          ) {
            points += pointCountsToUse.ten;
          } else if (cardValue % 13 === 9 && suit.length >= suitLengthRequiredToCount.jack) {
            points += pointCountsToUse.jack;
          } else if (cardValue % 13 === 10 && suit.length >= suitLengthRequiredToCount.queen) {
            points += pointCountsToUse.queen;
          } else if (cardValue % 13 === 11 && suit.length >= suitLengthRequiredToCount.king) {
            points += pointCountsToUse.king;
          } else if (cardValue % 13 === 12) {
            points += pointCountsToUse.ace;
          }
        }
        highCardPoints = points;
        highCardPointsLabel.innerHTML = points;
      }
    } catch (error) {
      console.error('error =', error);
    }
  }
  //#endregion
  //#endregion
  //#region Socket Listeners
  try {
  //#region Bidding Phase
  //#region UndoBidButton
  socket
    .binary(false)
    .on("sendUndoBidRequestToClients", ({ usernameOfRequester, nameOfBid }) => {
      if (
        usernameOfRequester === undefined ||
        usernameOfRequester === null ||
        nameOfBid === undefined ||
        nameOfBid === null
      )
        return;

      const msg = `'${usernameOfRequester}' would like to undo his/her last bid of '${getImgHTMLFromBid(
        nameOfBid
      )}'.`;
      setupClaimForUndo(msg, usernameOfRequester);
    });
  socket
    .binary(false)
    .on(
      "sendUndoPlayRequestToClients",
      ({ usernameOfRequester, lastCardPlayed }) => {
        if (
          usernameOfRequester === undefined ||
          usernameOfRequester === null ||
          lastCardPlayed === undefined ||
          lastCardPlayed === null
        )
          return;
        const cardImgHTML = convertCardNumberToImgHTML(lastCardPlayed);
        const msg = `'${usernameOfRequester}' would like to undo his/her last play of '${cardImgHTML}'.`;
        setupClaimForUndo(msg, usernameOfRequester, true);
      }
    );
  socket
    .binary(false)
    .on("sendUndoRequestDenied", ({ usernameOfRequester }) => {
      closeModal(claim);
      let msg;
      if (!usernameOfRequester) msg = `Request Denied.`;
      else {
        let specialForDan = "";
        const adverbs = [
          "remorselessly",
          "unapologetically",
          "happily",
          "unsurprisingly",
        ];
        const verbs = ["shut down", "rejected", "denied"];
        const randomAdverbInt = Math.floor(Math.random() * adverbs.length);
        const randomVerbInt = Math.floor(Math.random() * verbs.length);
        if (username === "Dan")
          specialForDan = "You are the UNHAPPY one because ";
        msg = `${specialForDan}${
          usernameOfRequester === username
            ? specialForDan
              ? "your"
              : "Your"
            : `${usernameOfRequester}'s`
        } request to undo ${
          usernameOfRequester === username ? "your" : "his/her"
        } last bid was ${adverbs[randomAdverbInt]} ${verbs[randomVerbInt]}...`;
      }
      displayFlashMessage(msg, "warning", 5000, true);
    });
  socket.binary(false).on("disableUndoBidButton", () => {
    undoBidButton.className = "btn btn-md btn-outline-warning disabled";
  });
  socket.binary(false).on("disableUndoPlayButton", () => {
    undoPlayButton.className = "btn btn-md btn-primary disabled";
  });
  socket.binary(false).on("closeBidContainer", () => {
    // if (!usernamesWithBidContainerIssue.includes(username)) disableBidContainer();
  });
  socket.binary(false).on("setThinkingLocation", ({ currentBidder }) => {
    displayThinking(currentBidder);
  });
  socket.binary(false).on("setBidLabels", ({ currentBidder, bids }) => {
    topBid.innerHTML = "";
    bottomBid.innerHTML = "";
    leftBid.innerHTML = "";
    rightBid.innerHTML = "";
    if (
      currentBidder === undefined ||
      currentBidder === null ||
      bids === undefined ||
      bids === null ||
      bids.length === 0
    )
      return;
    const lastThreeBids = getLastThreeBids(bids);
    setBidLabels(currentBidder, lastThreeBids);
  });
  socket.binary(false).on("hideReadyToContinueItems", () => {
    if (readyToContinueTable) readyToContinueTable.classList.add("hidden");
    if (dealSummaryButtons) dealSummaryButtons.classList.add("hidden");
  });

  //#endregion
    socket
      .binary(false)
      .on("displayFlashMessage", ({ msg, type, duration, isDuringPlaying }) => {
        displayFlashMessage(msg, type, duration, isDuringPlaying);
      });
    socket.binary(false).on("sendScoringToClient", ({ scoring }) => {
      setScoringLabels(scoring);
    });
    socket.binary(false).on("sendHandToClient", ({ handFromServer }) => {
      console.log(
        "sendHandToClient-------------------------------------------------"
      );
      setupHand(handFromServer);
      socket.binary(false).emit("getContractsFromServer");
      socket.binary(false).emit("getScoring", { room });
      socket
        .binary(false)
        .emit("getGameState", { username, room, originalSocketId: socketId });
      socket.binary(false).emit("getBidding", { room });
    });
    socket.binary(false).on("sendBidsToClient", ({ bids }) => {
      if (bids) {
        populateBids(bids);
      } else {
        console.log("no bids atm");
      }
    });
    socket
      .binary(false)
      .on("sendBiddingToClient", ({ bidding, shouldResetTable }) => {
        if (shouldResetTable) biddingDiv.innerHTML = "";
        if (bidding === undefined || bidding === null || bidding.length === 0)
          return;
          populateBiddingDiv(bidding);
      });
    socket
      .binary(false)
      .on("sendContractsToClient", ({ contractsFromServer }) => {
        contracts = contractsFromServer;
      });
    socket.binary(false).on("sendPreferencesToClient", ({ preferences }) => {
      console.log(
        "sendPreferencesToClient-----------------------------------------------"
      );
      clientPreferences = preferences;
      window.localStorage.setItem('defaultVolume', clientPreferences.sound.defaultVolume);
      socket
        .binary(false)
        .emit("getHand", { username, room, originalSocketId: socketId });
    });
    socket.binary(false).on("newDeal", ({ dealer, contractsFromServer }) => {
      resetVariables();
      setupNewDeal(dealer, contractsFromServer);
      if (username === dealer) {
        flashMsg.innerHTML = `
                  <div$ class="alert text-center alert-warning">
                      <h3>
                          Hands redealt (no contract).  It is your turn to bid. 
                      </h3>
                  </div$>
              `;
      } else {
        flashMsg.innerHTML = `
                  <div class="alert text-center alert-warning">
                      <h3>
                          Hands redealt (no contract). 
                      </h3>
                  </div>
              `;
      }
    });
    socket
      .binary(false)
      .on("updateOtherClientsAfterBid", ({ bid, nextBidder, imgHTML }) => {
        clearInterval(timerCountdown);
        if (imgHTML) setBidLabel(getLabelLocationFromBidder(bid[0]), imgHTML);
        setLastBidSentence(bid[0], imgHTML, nextBidder);
        addBidToBiddingDiv(imgHTML);
        displayThinking(nextBidder);
      });
    socket.binary(false).on("notInSession", ({ room, type, code }) => {
      if (username && room && type) {
        window.location.href = `/start?username=${username}&room=${room}&notInSession=true&type=${type}&code=${code};`;
      } else {
        window.location.href = `/start?notInSession=true&code=${code}`;
      }
    });
    socket
      .binary(false)
      .on(
        "sendSeatingToClientInBid",
        ({ seating, dealer, biddingTimerDurationValue }) => {
          navbar.classList.add("hidden");
          timerDurationValue = biddingTimerDurationValue;
          setupSeating(seating, dealer);
        }
      );
    socket
      .binary(false)
      .on("incorrectSocketId", ({ username, room, socketId }) => {
        window.location.href = `/start?username=${username}&room=${room}&socketId=${socketId}&incorrectSocketId=true;`;
      });
    socket.binary(false).on("userNotFound", ({ username, room }) => {
      window.location.href = `/start?username=${username}&room=${room}&userAlreadyInRoom=true;`;
    });
    socket.binary(false).on("handNotFound", ({ username, room }) => {
      window.location.href = `/start?username=${username}&room=${room}&handNotFound=true`;
    });
    socket.binary(false).on("cheatPrevention", ({ type }) => {
      seatingTable.classList.add("noMarginTop");
      let errorMsg;
      switch (type) {
        case "invalidBidder":
          errorMsg = `
                      <div class="alert text-center alert-danger">
                          <h3>It is not your turn to bid.</h3>
                      </div>
                  `;
          // if (!usernamesWithBidContainerIssue.includes(username)) disableBidContainer();
          // currentBidder.classList.remove("hidden");
          break;
        case "invalidBid":
          errorMsg = `
                      <div class="alert text-center alert-danger">
                          <h3>That is not a valid bid.</h3>
                      </div>
                  `;
          break;
      }
      flashMsg.innerHTML = errorMsg;
    });
    socket.binary(false).on("validBid", () => {
      disableBidContainer();
      let toRemove = currentSelection;
      if (currentSelection && currentSelection.target) toRemove = currentSelection.target;
      if (toRemove) toRemove.classList.add('disabled');
      

      // currentBidder.classList.remove("hidden");
      flashMsg.innerHTML = "";
      seatingTable.classList.remove("noMarginTop");
      undoBidButton.classList.remove("disabled");
    });
    socket.binary(false).on("isAllowedToMakeBid", ({ bids, hasMadeBid }) => {
      console.log("isAllowedToMakeBid------------------------------------------------------------");
      
      try {
        window.autoBid.autoBid(bids, hand, scoringGlobal, seatingGlobal, spot, clientPreferences.pointCountingConvention.toLowerCase())
      } 
      catch {
        console.log('error with autobid');
      }
      
      seatingTable.style.marginTop = "0px";
      handleDoubleButton(bids, hasMadeBid);
      disableUpToLastBid(bids);
      makeBidSetup();
      window.scroll({
        top: document.body.scrollHeight,
        left: 0,
        behavior: "smooth",
      });
      if (shouldAutoPass) {
        setTimeout(() => {
          makeBid('Pass');
        }, autoPassWaitDuration);
      }
      else {
        const sound = new Howl({
          src: ['/sounds/'+clientPreferences.sound.isYourTurnHand+'.mp3'],
          volume: window.localStorage.getItem('defaultVolume') ? parseFloat(window.localStorage.getItem('defaultVolume')) : clientPreferences.sound.defaultVolume,
        });
        sound.play();
      }
    });
    socket.binary(false).on('disableUpToLastBid', ({bids}) => {
      disableUpToLastBid(bids);
      disableButtons();
    });
    socket.binary(false).on("startThinkingBidding", ({ bidder }) => {
      if (shouldSetupThinking) {
        setupThinking();
      }
      displayThinking(bidder);
    });
    socket.binary(false).on("showContinueButton", ({seating, exposedHandName}) => {
      if (seating) seatingGlobal = seating;
      setupDealSummaryContinueQuitButtons("bidding");
      setupReadyToContinueTable("bidding", exposedHandName);
      continueButton.classList.add("startAnimation");
      seatingTable.classList.add('biddingDone');
      hideThinking();
    });
    socket.binary(false).on("resetContinueToPlayingButton", () => {
      startPlayingButton.classList.remove("disabled");
    });
    socket.binary(false).on("biddingFinished", ({
          handFromServer,
          declarersHand,
          exposedHand,
          exposedHandName,
          exposedHandSpot,
          contract,
          preferences,
          spotFromServer,
          declarersSpot: declarersSpotFromServer,
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
          roundWinSounds,
          colorThemeSourcesFromServer,
        }) => {
          colorThemeSources = colorThemeSourcesFromServer;
          const colorThemeValues = {
            color: docStyle.getPropertyValue('--color'),
            playAreaFillColor: docStyle.getPropertyValue('--playAreaFillColor'),
            instructionsColor: docStyle.getPropertyValue('--instructionsColor'),
          }
          // clientPreferences = preferences;
          globals.resetEverything();
          declarersSpot = declarersSpotFromServer;
          dealComplete = false;
          if (handFromServer !== undefined && handFromServer !== null) {
            hand = handFromServer;
          }
          if (declarersHand) {
            hand = declarersHand;
          }
          timerDurationValue = biddingTimerDurationValue;
          console.log({ hand });
          console.log({ declarersHand });
          console.log({ exposedHand });
          console.log({ exposedHandSpot });
          console.log({ contract });
          console.log({ preferences });
          console.log({ spotFromServer });
          console.log({ declarersSpot: declarersSpotFromServer });
          console.log({ playedCards });
          console.log({ handLengths });
          console.log({ trickCounts });
          console.log({ usersTurnToPlay });
          console.log({ scoring });
          console.log(cardPlayTimerDurationValue);
          console.log({ timerDurationValue });
          console.log({ doubleMultiplier });
          console.log({ roundWinSounds });
          const exposedHandLocation = getLabelLocationFromBidder(exposedHandName);
          seatingTable.classList.add("hidden");
          claim.className = "hidden";
          overlay.className = "hidden";
          tricksNeededLabel.className = "";
          tricksNeededNumerator.className = "";
          tricksNeededDenominator.className = "";
          playingCanvas.classList.remove("hidden");
          undoPlayButtonDiv.classList.remove("hidden");
          undoPlayButton.classList.remove("hidden");
          dealInfoButton.classList.remove("hidden");
          dealInfoButton.classList.add("slide");
          dealInfoButton.classList.remove("topZero");
          dealInfoButton.classList.remove("leftZero");
          dealInfoButton.classList.remove("top");
          dealInfoButton.classList.remove("exposedBottom");
          dealInformationDiv.classList.remove("slide");
          gameInfoButton.classList.remove("hidden");
          gameInfoButton.classList.add("slide");
          gameInfoButton.classList.remove("topZero");
          gameInfoButton.classList.remove("leftZero");
          gameInfoButton.classList.remove("top");
          gameInfoButton.classList.remove("exposedBottom");
          gameInformationDiv.classList.remove("slide");
          gameInformationDiv.classList.remove("hidden");
          bidContainer.classList.add("hidden");
          volumeAndUndoDiv.classList.remove("hidden");

          if (exposedHandLocation.toLowerCase() === locations.left)
            dealInformationDiv.classList.add("topZero");
          else dealInformationDiv.classList.add("leftZero");
          if (exposedHandLocation.toLowerCase() === locations.right)
            gameInformationDiv.classList.add("topZero");
          else gameInformationDiv.classList.add("leftZero");

          document.body.style.backgroundColor = "#000";
          flashMsg.classList.add("hidden");
          navbar.classList.add("hidden");
          sidebar.classList.add("hidden");

          biddingDiv.innerHTML = "";
          bottomBid.innerHTML = "";
          topBid.innerHTML = "";
          rightBid.innerHTML = "";
          leftBid.innerHTML = "";

          if (dealSummaryButtons) dealSummaryButtons.classList.add("hidden");
          if (readyToContinueTable) readyToContinueTable.classList.add("hidden");

          let extraDir = isMobile ? "/mobile/" : "";
          document.getElementById(
            "cardBack"
          ).src = `/imgs/cardBacks/${extraDir}cardBack${clientPreferences.cardBackPreference}.png`;

          initializeGlobals();

          const clientWidth = document.documentElement.clientWidth;
          const clientHeight = document.documentElement.clientHeight;
          playingCanvas.width = clientWidth;
          playingCanvas.height = clientHeight;
          copyright.classList.add("hidden");

          loadInfoDivLocations(exposedHandLocation);
          //#region Set Volume Slider Level
          if (hasChangedVolume)
            clientPreferences.sound.defaultVolume = volumeSlider.value;
          else {
            volumeSlider.value = clientPreferences.sound.defaultVolume;
            hasChangedVolume = true;
          }
          //#endregion
          //#region Getting isAppleDevice
          //#endregion
          const isAppleDevice = getIsAppleDevice();
          if (isAppleDevice) {
            clientPreferences.shouldAnimateRoundEnd = false
            clientPreferences.shouldAnimateCardPlay = false
          }

          globals.draw(
            hand,
            exposedHand,
            exposedHandLocation,
            exposedHandSpot,
            contract,
            clientWidth,
            clientHeight,
            spotFromServer,
            seatingGlobal,
            declarersSpotFromServer,
            playedCards,
            handLengths,
            usersTurnToPlay,
            roundStartPlayer,
            roundWinners,
            clientPreferences,
            trickCounts,
            scoring,
            cardPlayTimerDurationValue,
            doubleMultiplier,
            lastRoundStartPlayer,
            isAppleDevice,
            roundWinSounds,
            colorThemeSources,
            colorThemeValues,
          );

          if (usersTurnToPlay === 0 || usersTurnToPlay === null) {
            disableClaimButtons();
            hideClaimButtons();
          } else if (spot.toLowerCase() === declarersSpot.toLowerCase()) {
            enableClaimButtons(playedCards);
            showClaimButtons();
          }

          if (declarersSpot.toLowerCase() === spot.toLowerCase()) {
            playingButtons.classList.remove("hidden");
            showClaimButtons();
          }
          if (exposedHandLocation.toLowerCase() === "bottom")
            undoPlayButton.classList.add("disabled");
          else undoPlayButton.classList.remove("disabled");
          scrollToTop();
          setOnFire(roundWinners, declarersSpotFromServer, exposedHandSpot);
          fillInDealInfoDetails(
            exposedHandLocation,
            exposedHandSpot,
            contract,
            trickCounts,
            roundWinners ? roundWinners[roundWinners.length - 1] : null,
            doubleMultiplier
          );
          fillInGameInfoDetails(scoring, exposedHandLocation);
    });
    function sendPointsToServer() {
      try {
        socket.binary(false).emit('sendPointsToServer', {room, highCardPoints: highCardPoints.textContent, distributionPoints: distributionPoints.textContent});
      } catch (error) {
        console.log('error sending points------------------------------------------------', error);
      }
    }
  //#endregion
  //#region Playing Phase
  socket
    .binary(false)
    .on("displayExposedHand", ({ exposedHand, handLengths, playedCards }) => {
      globals.sendExposedHandToClient(exposedHand, handLengths, playedCards);
    });
  socket.binary(false).on("startThinkingPlaying", ({isUndo}) => {
    console.log('isUndo =', isUndo);
    if (isUndo) {
      setTimeout(() => {
        console.log('setting thinking------------------------------------------------');
        return globals.startThinking();
      }, 3000);
    }
    globals.startThinking();
  });
  socket.binary(false).on("resetTimer", () => {
    globals.resetTimer();
  }); 
  socket
    .binary(false)
    .on("startPlayTimer", ({ startTime, playerName, isRefresh }) => {
      globals.startPlayTimer(startTime, playerName, isRefresh);
    });
  socket
    .binary(false)
    .on("invalidCardPlayed", ({ cardAsNumber, playedCards }) => {
      console.log('invalid play------------------------------------------------');
      globals.invalidCardPlayed(cardAsNumber, playedCards);
    });
  socket
    .binary(false)
    .on(
      "validCardPlayed",
      ({ cardAsNumber, playedCards, handLengths, roundStartPlayer }) => {
        undoPlayButton.classList.remove("disabled");
        socket
          .binary(false)
          .emit("cardPlayAnimationCompletion", { roomName: room });
        globals.validCardPlayed(
          cardAsNumber,
          playedCards,
          handLengths,
          roundStartPlayer
        );
        disableClaimButtons();
      }
    );
  socket
    .binary(false)
    .on(
      "updateClients",
      ({ cardAsNumber, currentPlayer, playedCards, handLengths }) => {
        const animationLocation = getLabelLocationFromBidder(currentPlayer);
        globals.updateClients(
          cardAsNumber,
          animationLocation,
          playedCards,
          handLengths
        );
      }
    );
  socket.binary(false).on("isAllowedToPlay", ({ playedCards }) => {
    console.log("isAllowedToPlay----------");
    globals.isAllowedToPlay(playedCards);
    enableClaimButtons();
  });
  socket
    .binary(false)
    .on("isAllowedToPlayFromExposedHand", ({ playedCards }) => {
      console.log("isAllowedToPlayFromExposedHand--------------");
      globals.isAllowedToPlayFromExposedHand(playedCards);
      enableClaimButtons();
    });
  socket
    .binary(false)
    .on(
      "sendRoundWinnerAndTrickCounts",
      ({ roundWinner, northSouthTrickCount, eastWestTrickCount }) => {
        globals.sendRoundWinnerAndTrickCounts(
          roundWinner,
          northSouthTrickCount,
          eastWestTrickCount
        );
        setTrickNumerator(northSouthTrickCount, eastWestTrickCount);
        setTricksLeft();
        setLastTrick(roundWinner);
        checkMadeSetBid(parseInt(tricksNeededDenominator.textContent - tricksNeededNumerator.textContent));
        setYouNeed(parseInt(tricksNeededDenominator.textContent - tricksNeededNumerator.textContent));
          }
        );
        setOnFire(globals.getRoundWinners());
  socket
    .binary(false)
    .on("playingSendHandToClient", ({ hand, handLengths, playedCards }) => {
      globals.sendHandToClient(hand, handLengths, playedCards);
    });
  socket
    .binary(false)
    .on(
      "playingSendExposedHandToClient",
      ({ exposedHand, handLengths, playedCards }) => {
        globals.sendExposedHandToClient(exposedHand, handLengths, playedCards);
      }
    );
  socket
    .binary(false)
    .on("sendLastRoundStartPlayerToClient", ({ lastRoundStartPlayer }) => {
      globals.sendLastRoundStartPlayerToClient(lastRoundStartPlayer);
    });
  socket
    .binary(false)
    .on("sendRoundStartPlayerToClient", ({ roundStartPlayer }) => {
      globals.sendRoundStartPlayerToClient(roundStartPlayer);
    });
  socket
    .binary(false)
    .on(
      "playNewDeal",
      ({
        dealer,
        contractsFromServer,
        seating,
        handFromServer,
        scoring,
        timerValue,
      }) => {
        const sounds = globals.getSounds();
        if (sounds) {
          sounds.dealSummaryLost.stop();
          sounds.dealSummaryWon.stop();
        }
        resetBidContainer();    
        removeAllDealSummaryTables();
        resetVariables();
        timerDurationValue = timerValue;
        setupNewDeal(dealer, contractsFromServer);
        setupHand(handFromServer);
        setupSeating(seating, dealer);
        setScoringLabels(scoring);
        hideAllDealSummaryTables();
        if (dealSummaryButtons) dealSummaryButtons.classList.add("hidden");
        if (readyToContinueTable) readyToContinueTable.classList.add("hidden");
        scrollToTop();
      }
    );
  socket
    .binary(false)
    .on(
      "sendClaimToClient",
      ({
        cardsToShow,
        otherHandCards,
        declarersTurnToPlay,
        username,
        claimTitle,
        claimSomeClaimOrderHTML,
        claimSomeCardPlayOrderFromServer
      }) => {
        //#region Setting Claim innerHTMl based on declarersTurntoPlay
        claim.classList.remove("claimSome");
        claim.classList.add("claimSomeDefense");
        overlay.className = ''

        claimSomeCardPlayOrder = claimSomeCardPlayOrderFromServer;
        if (declarersTurnToPlay !== null) {
          claim.innerHTML = `
            <div id="claimHeader">
              <div id="claimTitle">${claimTitle}</div>
              <button id="closeClaim">&times;</button>
            </div>
            <div id="claimBodyTitle"> 
              <div id='claimBodyLeftDiv'>Leading Hand: </div>
              <div id='claimBodyRightDiv'>Following Hand: </div>
            </div>
            <div id="claimBody" class='claimSomeDefense'>
              <div id="claimBodyLeftHand">
                <div id="declarersHandDivLeft" class="claimSomeDefense"> </div>
              </div>
              <div id='claimSomeClaimOrderDiv'>
                <div id='claimSomeClaimOrder'>
                  ${claimSomeClaimOrderHTML}                  
                </div>
                <div id='usersHandLabel'>'L' means won in <em>Leading</em> Hand.  'F' means won in <em>Following</em> hand.</div>
              </div>
              <div id="claimBodyRightHand">
                <div id="declarersHandDivRight" class="claimSomeDefense"></div>
              </div>
            </div>
            <div id="usersHandDiv">             
              <div id='currentCardToSelect'></div>
              <div id="claimButtons" class='claimSomeDefense'>
                <button class='btn btn-md btn-success disabled' id="claimYes">Sure</button>
                <button class='btn btn-md btn-warning claimSomeDefense' id="claimReset">Reset</button>
                <button class='btn btn-md btn-danger' id="claimNo">Nope</button>
              </div>
              <div id="usersHand" class="claimSomeDefense"></div>
            </div>
            
          `;
          // displayUsefulMessage();
        } 
        else {
          claim.classList.add("claimAllDefense");
          claim.innerHTML = `
                <div id="claimHeader">
                    <div id="claimTitle">${claimTitle}</div>
                    <button id="closeClaim">&times;</button>
                </div>
                <div id="claimBody">
                    <div id="declarersHandDiv"></div>
                    <div id="claimButtons">
                        <button class='btn btn-md btn-success' id="claimYes">Sure</button>
                        <button class='btn btn-md btn-danger' id="claimNo">Nope</button>
                    </div>
                </div>
            `;
            overlay.classList.add('claimAll');
        }
        //#endregion
        claim.className = "";
        //#region Setting up closeClaim and claimYes/No Button Listeners
        claimYes = document.querySelector("#claimYes");
        claimNo = document.querySelector("#claimNo");
        document.querySelector("#claimingUser").textContent = `'${username}'`;

        claimYes.addEventListener("click", claimSomeClientResponse);
        claimNo.addEventListener("click", claimNoResponse);
        document.querySelector("#closeClaim").addEventListener("click", claimNoResponse);

        const claimReset = document.querySelector("#claimReset");
        if (claimReset) {
          claimReset.classList.add("disabled");
          claimReset.addEventListener("click", claimSomeDefenseReset);
        }
        //#endregion
        //#region Sorting CardsToDisplay To Match Preferences
        if (clientPreferences.cardSortPreference === "Descending") {
          cardsToShow.sort((a, b) => b - a);
          otherHandCards.sort((a, b) => b - a);
        } else {
          cardsToShow.sort((a, b) => a - b);
          otherHandCards.sort((a, b) => a - b);
        }

        cardsToShow = createHandArrayFromFlatArray(cardsToShow);
        otherHandCards = createHandArrayFromFlatArray(otherHandCards);

        if (clientPreferences.suitSortPreference !== "Descending") {
          cardsToShow.reverse();
          otherHandCards.reverse();
        }
        //#endregion
        drawCardsForClaim(cardsToShow, otherHandCards, declarersTurnToPlay);
        openModal(claim);
      }
    );
  socket.binary(false).on("sendDeclarerClaimDisplay", ({ usernames }) => {
    displayWaiting(usernames, true);
  });
  socket.binary(false).on("sendWaitingForPartner", ({ usernames }) => {
    displayWaiting(usernames, false);
  });
  socket.binary(false).on("disableClaimButtons", ({ disableOnly }) => {
    closeModal(claim);
    disableClaimButtons();
    if (!disableOnly) hideClaimButtons();
  });
  socket.binary(false).on("closeClaim", ({ isAccepted }) => {
    if (isAccepted) {
      const responseDiv = document.querySelector("#responseDiv");
      responseDiv.textContent = "Your offer has been accepted.";
      responseDiv.classList.add("greenCheck");
      setTimeout(() => {
        closeModal(claim);
      }, closeModalWaitDuration);
    } else {
      closeModal(claim);
    }
  });
  socket.binary(false).on("declarerCancelledClaim", ({ username }) => {
    displayFlashMessage(`'${username}' hit cancel`, 'success', 2500, true);
    closeModal(claim);
  });
  socket
    .binary(false)
    .on(
      "sendNewHandAfterClaimSome",
      ({ hand, exposedHand, handLengths, playedCards, roundWinners }) => {
        globals.sendNewHandAfterClaimSome(
          hand,
          exposedHand,
          handLengths,
          playedCards,
          roundWinners
        );
      }
    );
  socket
    .binary(false)
    .on("sendDeclarerClaimSomeResponse", ({ declarerClaimedCards, cardsPlayed, endInHand }) => {
      if (cardsPlayed === undefined || cardsPlayed === null)
        throw "Error in sendDeclarerClaimSomeResponse";
      if (endInHand === true) globals.isAllowedToPlay();
      else globals.isAllowedToPlayFromExposedHand();

      closeModal(claim);
      claim.innerHTML = `
            <div id="claimHeader">
                <div id="claimTitle">Claim Summary:</div>
                <button id="closeClaim">&times;</button>
            </div>
            <div id="claimBodyTitle">               
                <div id="claimBodyLeftHand">
                    <div id='claimBodyLeftDiv'>
                      '${leftLabelUsername}' sacrificed:
                    </div>
                    <div id="declarersHandDivLeft" class="claimSomeDefense declarerClaimResponse"> </div>
                </div>
                <div id="claimBodyRightHand">
                    <div id='claimBodyRightDiv'>
                      '${rightLabelUsername}' sacrificed: 
                    </div>
                    <div id="declarersHandDivRight" class="claimSomeDefense declarerClaimResponse"></div>
                </div>
            </div>
            <div id="claimBody" class='claimSomeDefense declarerClaimResponse'>
                <h5 id='allClaimedCardsTitle'>All Cards Claimed:</h5>
                <div id='allClaimedCards'></div>
                <div id="claimButtons" class='claimSomeDefense declarerClaimResponse claimSomeDefenseSummary'>
                    <button class='btn btn-md btn-success' id="claimNo">Done</button>
                </div>
            </div>
        `;

      let leftCards = cardsPlayed[leftLabelUsername];
      let rightCards = cardsPlayed[rightLabelUsername];
      
      if (clientPreferences.cardSortPreference.toLowerCase() === 'descending') {
        leftCards = leftCards.sort((a, b)=> parseInt(b) - parseInt(a));
        rightCards = rightCards.sort((a, b)=> parseInt(b) - parseInt(a));
      }
      else {
        leftCards = leftCards.sort((a, b)=> parseInt(a) - parseInt(b));
        rightCards = rightCards.sort((a, b)=> parseInt(a) - parseInt(b));
      }
      const leftToUse = globals.reArrangeHandArray(createHandArrayFromFlatArray(cardsPlayed[leftLabelUsername]), clientPreferences.suitSortPreference, clientPreferences.trumpOnLeftHand);
      const rightToUse = globals.reArrangeHandArray(createHandArrayFromFlatArray(cardsPlayed[rightLabelUsername]), clientPreferences.suitSortPreference, clientPreferences.trumpOnLeftHand);
      
      drawCardsInHTML({
        hand: leftToUse,
        containerName: "declarersHandDivLeft",
        outerContainerName: "claimBody",
        location: "left",
        isModalUse: true,
        isClaimSome: true,
        isBottomHand: false,
      });
      drawCardsInHTML({
        hand: rightToUse,
        containerName: "declarersHandDivRight",
        outerContainerName: "claimBody",
        location: "right",
        isModalUse: true,
        isClaimSome: true,
        isBottomHand: false,
      });

      //#region Drawing All of the Cards Claimed
      let allCardsClaimedSorted = [...declarerClaimedCards, ...leftCards, ...rightCards];
      if (clientPreferences.cardSortPreference.toLowerCase() === 'descending') {
        allCardsClaimedSorted = allCardsClaimedSorted.sort((a, b)=> parseInt(b) - parseInt(a));
      }
      else {
        allCardsClaimedSorted = allCardsClaimedSorted.sort((a, b)=> parseInt(a) - parseInt(b));
      }

      allCardsClaimedSorted = globals.reArrangeHandArray(createHandArrayFromFlatArray(allCardsClaimedSorted), clientPreferences.suitSortPreference, clientPreferences.trumpOnLeftHand);

      drawCardsInHTML({
        hand: allCardsClaimedSorted,
        containerName: "allClaimedCards",
        outerContainerName: "claimBody",
        location: "bottom",
        isModalUse: true,
        isClaimSome: true,
        isBottomHand: false,
        minWidth: 20,
        maxWidth: 100,
        maxCardCount: 52,
      });
      //#endregion


      document.querySelector("#claimNo").addEventListener("click", (e) => {
        closeModal(claim);
      });
      document.querySelector("#closeClaim").addEventListener("click", (e) => {
        closeModal(claim);
      });
      claim.classList.add("declarerClaimSomeResult");
      openModal(claim);
    });
  socket
    .binary(false)
    .on(
      "sendThrowInsToOtherDefensePlayer",
      ({ throwInCardsForUser, partnerThrowInCards, partnersName, declarersCards }) => {
        if (throwInCardsForUser === undefined || throwInCardsForUser === null)
          throw "Error getting throwInCardsForUser";
        console.log("throwInCardsForUser =", throwInCardsForUser);

        let verbToUse = 'sacrificed';
        if (friends.includes(username)) {
          const randomValue = 0 + Math.floor(Math.random() * (claimSomeVerbsPast.length - 1));
          verbToUse = claimSomeVerbsPast[randomValue];
        }

        claim.innerHTML = `
            <div id="claimHeader">
                <div id="claimTitle">Claim Summary:</div>
                <button id="closeClaim">&times;</button>
            </div>
            <div id="claimBodyTitle" class='claimSomeDefenseSummary'> 
                <div id='claimBodyPartner'>Here ${
                  throwInCardsForUser.length >= 1
                    ? "are the cards"
                    : "is the card"
                } your partner ${verbToUse}:</div>
            </div>
            <div id="claimBody" class='claimSomeDefenseSummary'>
                <div id="partnersClaimedCards"></div>
                <h5 id='allClaimedCardsTitle'>All Cards Claimed:</h5>
                <div id='allClaimedCards'></div>
                <div id="claimButtons" class='claimSomeDefense declarerClaimResponse'>
                    <button class='btn btn-md btn-success' id="claimNo">Done</button>
                </div>
            </div>
        `;

        claim.className = "claimSome active";
        document.querySelector("#closeClaim").addEventListener("click", (e) => {
          closeModal(claim);
        });
        document.querySelector("#claimNo").addEventListener("click", (e) => {
          closeModal(claim);
        });

        //#region Drawing Partners Cards
        let sortedCards = throwInCardsForUser;
        if (clientPreferences.cardSortPreference.toLowerCase() === 'descending') {
          sortedCards = sortedCards.sort((a, b)=> parseInt(b) - parseInt(a));
        }
        else {
          sortedCards = sortedCards.sort((a, b)=> parseInt(a) - parseInt(b));
        }
        
        sortedCards = globals.reArrangeHandArray(createHandArrayFromFlatArray(sortedCards), clientPreferences.suitSortPreference, clientPreferences.trumpOnLeftHand);

        drawCardsInHTML({
          hand: sortedCards,
          containerName: "partnersClaimedCards",
          outerContainerName: "claimBody",
          location: "top",
          isModalUse: true,
          isClaimSome: true,
          isBottomHand: false,
          minWidth: 15,
          maxWidth: 50,
      });
        //#endregion

        //#region Drawing All of the Cards Claimed
        let allCardsClaimedSorted = [...throwInCardsForUser, ...declarersCards, ...partnerThrowInCards];
        if (clientPreferences.cardSortPreference.toLowerCase() === 'descending') {
          allCardsClaimedSorted = allCardsClaimedSorted.sort((a, b)=> parseInt(b) - parseInt(a));
        }
        else {
          allCardsClaimedSorted = allCardsClaimedSorted.sort((a, b)=> parseInt(a) - parseInt(b));
        }
        
        allCardsClaimedSorted = globals.reArrangeHandArray(createHandArrayFromFlatArray(allCardsClaimedSorted), clientPreferences.suitSortPreference, clientPreferences.trumpOnLeftHand);

        drawCardsInHTML({
          hand: allCardsClaimedSorted,
          containerName: "allClaimedCards",
          outerContainerName: "claimBody",
          location: "bottom",
          isModalUse: true,
          isClaimSome: true,
          isBottomHand: false,
          minWidth: 20,
          maxWidth: 100,
          maxCardCount: 52,
        });
        //#endregion
      }
    );
  socket
    .binary(false)
    .on(
      "sendUpdateAfterUndo",
      ({
        playedCards,
        roundWinners,
        northSouthTrickCount,
        eastWestTrickCount,
        handLengths,
      }) => {
        globals.sendUpdateAfterUndo(
          playedCards,
          roundWinners,
          northSouthTrickCount,
          eastWestTrickCount,
          handLengths
        );
        closeModal(claim);
        setLastTrick(roundWinners[roundWinners.length - 1]);
      }
    );
  socket.binary(false).on("sendDeclarersHandToDummy", ({ declarersHand }) => {
    globals.sendDeclarersHandToDummy(declarersHand);
  });
  socket.binary(false).on('sendQuoteToClient', ({quoteFromServer}) => {
    quote = quoteFromServer;
  });
  //#endregion
  //#region Deal Summary
  socket
    .binary(false)
    .on(
      "dealComplete",
      ({ toDisplay, nthDeal, isGameOver, gameRoundEndingScores, isClaim }) => {
        // console.log('dealComplete--------------------');
        if (dealComplete === true) return;
        dealComplete = true;
        isSecondDouble = false;
        sendPointsToServer();
        saveInfoDivLocations();

        setTimeout(() => {
          volumeAndUndoDiv.classList.add("hidden");
          seatingTable.classList.add("hidden");
          seatingTable.classList.remove("biddingDone");
          playingButtons.classList.add("hidden");
          undoPlayButton.classList.add("hidden");
          dealInfoButton.classList.add("hidden");
          gameInfoButton.classList.add("hidden");
          dealInformationDiv.className =
            "transitionInfoModals slideTransition slide";
          gameInformationDiv.className =
            "transitionInfoModals slideTransition slide";
          undoPlayButtonDiv.classList.add("hidden");
          hideClaimButtons();
          lastDealSummary = toDisplay.dealSummary;

          if (
            toDisplay === undefined ||
            toDisplay === null ||
            nthDeal === undefined ||
            nthDeal === null
          ) {
            return socket
              .binary(false)
              .emit("getDealComplete", { roomName: room });
          }

          //If isGameOver toDisplay IS ALL DEALS ARRAY OTHERWISE LASTDEAL
          loadGameSummaryWaitAnimation();
          hideAllDealSummaryTables();
          setupDealSummaryContinueQuitButtons("playing");
          setupReadyToContinueTable();

          Object.values(seatingGlobal).forEach(username => {
            document.querySelector(`#${username}Row`).classList.remove('hidden');
          });

          if (isGameOver) {
            document
              .querySelector("#gameSummaryLoading")
              .classList.remove("hidden");
            document
              .querySelector("#gameSummaryLoading")
              .classList.remove("selectedItems");
            gameDoneSummary(toDisplay, gameRoundEndingScores);
            document
              .querySelector("#gameSummaryLoading")
              .classList.add("notSelectedItems");
          } else {
            createLastDealSummaryTable(toDisplay, nthDeal);
            adjustMarginHeight(
              [
                document.querySelector(`#dealSummary${nthDeal}`),
                readyToContinueTable,
              ],
              -(window.innerHeight / 10)
            );
            populateBiddingDiv(toDisplay.bids, nthDeal);
          }
          playingCanvas.classList.add("hidden");
          document.body.style.backgroundColor = "#fff";
          showHonors();
          continueButton.classList.add("startAnimation");
        },  isClaim ? 0 : 4500);
      }
    );
  socket.binary(false).on("getReadyToContinueStatus", () => {
    socket
      .binary(false)
      .emit("sendReadyToContinueStatus", {
        username,
        roomName: room,
        originalSocketId: socketId,
        isReady: readyToContinueStatus,
      });
  });
  socket
    .binary(false)
    .on("sendClientUsersReadyToContinue", ({ usersReadyToContinue }) => {
      //#region Get the names of the users ready
      if (usersReadyToContinue.includes(username)) {
        continueButton.classList.add("disabled");
        continueButton.classList.remove("startAnimation");
        quitButton.classList.add("disabled");
      }
      for (const direction in seatingGlobal) {
        if (seatingGlobal.hasOwnProperty(direction)) {
          const userInSeating = seatingGlobal[direction];
          const readyCheck = document.querySelector(`#ready${userInSeating}`);
          const notReadyCheck = document.querySelector(
            `#notReady${userInSeating}`
          );
          if (!readyCheck || !notReadyCheck) return;
          if (usersReadyToContinue.includes(userInSeating)) {
            readyCheck.classList.remove("hidden");
            notReadyCheck.classList.add("hidden");
          } else {
            notReadyCheck.classList.remove("hidden");
            readyCheck.classList.add("hidden");
          }
        }
      }
    });
  //#endregion
  socket.binary(false).on("joinLobby", () => {
    // globals.resetEverything();
    window.location.href = `/lobby?username=${username}&room=${room}&password=${password}`;
  });
  //#endregion
  } catch (error) {
    console.error('error =', error);
  }
  //#endregion
};


