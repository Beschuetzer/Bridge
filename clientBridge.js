//NOTE: PaperJS requires ES5.  I ended up writing everything myself in ES5 as I didn't know about Babel at the time
//I also didn't know about modules, so I ended up writing all of the code in the same file...

//#region Intialize Globals
function initializeVariables() {
  aspectRatio = (canvasHeight > canvasWidth) ? canvasHeight / canvasWidth : canvasWidth / canvasHeight;
  isHighAspectRatio = aspectRatio >= 2;
  marginAmount = marginPercent * canvasWidth;
  marginAmountMobile = 0;
  isMobile = canvasWidth <= mobileMaxWidth;
  DEFAULT_FONT_SIZE = isMobile ? canvasWidth * .035 : canvasWidth * .024;
  SMALLER_FONT_SIZE = DEFAULT_FONT_SIZE * .8;

  if (25 <= marginAmount) marginAmount = 25;
  else marginAmount = maxMarginAmountMobileInside;

  if (SMALLER_FONT_SIZE <= maxMarginAmountMobileInside) marginAmountMobileInside = SMALLER_FONT_SIZE;
  else marginAmountMobileInside = maxMarginAmountMobileInside;
}
//#region Lists of Users with Specific Issues
// var usernamesWhoCannotPlayOnTurn = ['Dan', 'Ann'];
//#endregion
//#region Get from Server
  var queryString = Qs.parse(location.search,
  {
      ignoreQueryPrefix: true,
  });
  var isTurnToPlay = false, exposedHandLocation, hand, exposedHand, exposedHandSpot, canvasWidth, canvasHeight, declarerCanPlayFromExposed = false;
  var isExposedTop, isExposedBottom, isExposedLeft, isExposedRight;
  var playedCards = [];
  var roundStartPlayer;
  var northSouthTrickCount, eastWestTrickCount;
  var trumpSuit;
  var roundWinners = [];
  var cardPlayTimerDurationValue;
  var doubleMultiplier;
  var scoring, isAppleDevice, roundWinSounds, colorThemeSources, colorThemeValues;
//#endregion
//#region Location and Size
  var minExposedHandSize;
  var exposedHandSizeFactor;
  var highAspectRatioScaleFactor = .8;
  var playAreaShrinkFactor;
  var aspectRatio, isHighAspectRatio;
  var cardWidth, cardHeight, cardName, resize, handWidthSpacingPercentOfCardWidth, exposedHandCardWidthSpacingScaleFactor, exposedHandCardHeightSpacingScaleFactor, isMaxHeight;
  var fullSizeCardWidthPercentOfCavasWidth, mobileCardWidthPercentOfCavasWidth, fullSizecardHeightMaxPercent, mobilecardHeightMaxPercent
  var hiddenCardsTop, hiddenCardsLeft, hiddenCardsRight, lengthOfHiddenHand;
  var thinkingLocation = null, previousThinkingLocation = null, cardsToAnimate = [], frameCountForCardThinkingAnimation = 0, frameCountForSuitThinkingAnimation = 0;
  var topPlayArea, bottomPlayArea, rightPlayArea, leftPlayArea, playAreaSquare;
  var exposedHandLeftStartX, exposedHandRightStartX, exposedHandBottomStartY, exposedHandTopStartY;
  var topOfCardsY, handWidth;
  var isMobile, radius, bottomHandY, spot;
  var preferences
  var exposedHandWidth, exposedHandHeight, exposedHandWidthSpacing, exposedHandHeightSpacing, exposedHandCardHeight, exposedHandCardWidth, heightAvailable, widthAvailable, numberOfSpacesBetweenCards, numberOfSuits;
  var canvasEdgeMargin = 5;
  var mobileMaxWidth = 479;
  var declarerUiYOffset, declarerHandHeightFactor;
  var amountOfBottomHandShownOffset, nonHandCardHideFactor;
  var heightTakenUpByTopHand, heightTakenUpByBottomHand, widthTakenUpBySideHands;
  var needToScaleExposedHandMobile = true;
  var greenSpaceAvailable, greenSpaceCenter, marginAmountMobileInside;
  var handLengths = {};
  // var shouldReDrawHidden = true
//#endregion
//#region Deck Creation
  var waitToLoadNewTheme, cardsLoadedCount = 0, currentTheme;
  var shouldDisplayPlayAreaCards = true;
  var needToResizeOnPlay;
  var isFirstTimeDisplayingPlayAreaCards;
  var isFirstTimeDisplayingExposedHand, isFirstTimeDisplayingExposedHandMobile;
  var checkCardLoadInterval;
  var alreadyRotated = false;
  var shouldUseHeight = false;
  var hands = [];
  var deck = [], playAreaAsPaperObj;
  var cardWidthPercentOfCavasWidth;
  var cardHeightMaxPercent;
  var cardWidthFactor =  .6666666666666666 //0.7142;
  var marginPercent = .02;
  var marginAmount;
  var handSpacing;
  var loadComplete = false;
  var topPlayAreaCard, bottomPlayAreaCard, leftPlayAreaCard, rightPlayAreaCard;
  var smallCardWidth;
  var smallCardHeight;
  var exposedHandShrinkAmountMobile = .6;
  var widthFactorTopBottomMobile = 0;
  var widthFactorLeftRightMobile = 0;
  var exposedHandSideXOffset = 0;
  var enoughHeightToDisplay;
  var enoughWidthToDisplay;
  var standardDescendingCardOrder = [suits.spades, suits.hearts, suits.clubs, suits.diamonds];
  var standardAscendingCardOrder = [suits.diamonds, suits.clubs, suits.hearts, suits.spades];
//#endregion
//#region Text Stuff
  var arrowTop, arrowBottom, arrowLeft, arrowRight;
  var exposedHandXOffset = 0;
  var texts = {};
  var maxMarginAmountMobileInside;
  var dealInformation, dealInformationLeftHalf, dealInformationRightHalf;
  var gameInformation, gameInformationLeftHalf, gameInformationRightHalf; 
  var gameInfoLayoutChangeThreshold;
  var  gameInformationWeHeader, gameInformationTheyHeader, gameInformationFirstGameWe, gameInformationFirstGameThey, gameInformationSecondGameWe, gameInformationSecondGameThey, gameInformationThirdGameWe, gameInformationThirdGameThey;
  var gameInformationHorizontalDividerLineGameTwoStart, gameInformationHorizontalDividerLineGameThreeStart;
  var shouldDrawInstructions = true;
  var bordersFillColor = '#e9ecef';
  var bordersStrokeColor = '#fff'
  var playerLabelColor;
  var belowTheLines;
  //For usernames
  var maxChars = 8;
  var maxWidth = 1400;
  var tricksNeeded = "0";
  var borderRadius = 10;
  var DEFAULT_FONT_FAMILY = "Courier New";
  var DEFAULT_FONT_SIZE;
  var SMALLER_FONT_SIZE;
  var maxFontSizeRatio;
  var textsToWrite, contractRaster;
  var seating, declarersSpot;
  var northName, southName, eastName, westName;
  var topName, bottomName, leftName, rightName;
  var contract;
  var suitScaleFactor = 0.00398174;
  var lastTrickOneImg = null, lastTrickTwoImg = null, lastTrickThreeImg = null, lastTrickFourImg = null;
  var playAreaCenter, playAreaTopLeft, playAreaTopRight, playAreaBottomLeft, playAreaBottomRight;
  var lastRoundStartPlayer;
  var textsContractRow, textsDeclarerRow, textsTricksNeededRow, textsLastTrickRow;
  var gameInformationDividerLine, gameInformationHorizontalDividerLineGameOneStart;
//#endregion
//#region Animation Stuff
  var animationDeceleration = .96;
  var animationDeclerationThreshold = 22.5;
  var cardPlayAnimationSpeeds = {
    slow: {
      animationStartSpeedLowerIsFaster: 15,
      animationStartRotationSpeed: 28.796,
    },
    medium: {
      animationStartSpeedLowerIsFaster: 12,
      animationStartRotationSpeed: 43.201,
    },
    fast: {
      animationStartSpeedLowerIsFaster: 8,
      animationStartRotationSpeed: 57.606,
    }
  }
  var clubThinking, diamondThinking, heartThinking, spadeThinking;
  var disableCardThinkingAnimation = false;
  var thinkingLocationTemp = null;
  var roundEndAnimationWaitDuration;
  var skipRoundEndAnimationWaitDuration;
  var waitForRoundEnd = true;
  var needToSleepBeforeRoundEnd = true;
  var hasEnteredRoundEndSleep = false;
  var rotationPoint;
  var cardToPlayDestination, cardToPlayAsNumber, cardToPlayHandLocation;
  var cardPlayAnimation = false;
  var vector;
  var isLastPersonToPlay = false;
  var playAreaAnimationDuration;
  var rotationAccelleration, rotationDecellerationRate, rotationStartSpeedInDegrees, rotationDecellerationStart;
  var animationStartSpeedLowerIsFaster;
  var animationStartRotationSpeed;
  var hasSentAnimationCompletion;
  var cardToPlay, playedCardToShow = null, playedCardRotation = 0, previousLayerIndex = null;
  var roundEndAnimation = false, roundWinner = null;
  var topCard, bottomCard, leftCard, rightCard, actualDestination;
  var startSpeedRoundEndStart = 1000, accelerationRoundEndStart = .1
  var topVector, bottomVector, leftVector, rightVector, startSpeedRoundEnd = startSpeedRoundEndStart, accelerationRoundEnd = accelerationRoundEndStart;
  var topDestination, bottomDestination, leftDestination, rightDestination;
  var roundEndAnimationComplete = true;
  var cardsToRemoveFromThinkingAnimation = [];
  var hasRequestedRoundStartPlayer = false;
//#endregion
//#region Initialization of Event Handler Variables
  var hitOptions = {
    segments: false,
    stroke: false,
    fill: false,
    tolerance: 5,
  };
  var randomCardAsNumber;
  var scaleOnClickAmount;
  var handScaleAmount;
  var animateEveryNthFrame;   //must be a factor of 30;
  var thinkingScaleAmount;
  var segment;
  var movePath = false;
  var previousRotation, newCenter;
  var i = 0;
  var clickedOnItem;
  var cardRotation;
  var isFromHand, isFromExposedHand;
  var roundedCardWidth;
  var roundedCardHeight;
  var shouldChangePlayableCards = true;
  var lastClickedCard = null;
  var doubleClickInterval = 250;
//#endregion
//#region Sounds 
  var sounds = {roundWinSounds: {}};
  var soundVolumes = {
    shotgunLoad: .33,
    boomerang: .868,
    dealSummaryLostMusic: .66,
    dealSummaryWonMusic: .66,
    saucisse: .75,
    imAlive: .8,
    roundWon: .25,
    cardPlayDuring: .75,
  };
//#endregion    
//#region UI Stuff 
var declarerUIHandScaleFactor;
//#endregion
//#region Automatic Card Playing
  var cardsAsNumbers = [];
  var firstPlayerStartTimeBonus = 5;
  var firstPlayer;
  var autoBidTimer;
//#endregion
//#endregion
//#region Event Handlers (Moving Cards)
function onMouseEnter(event) {
  // console.log(event.target.name);
  if (roundEndAnimation || event.target.name === undefined || event.target.name === null ) return null;

  //#region Setting thinking to null if conditions right
  var cardAsNumber = getCardAsNumberFromName(event.target.name);
  var isInExposedHand = declarerCanPlayFromExposed ? true : false;
  var handToCheck = isInExposedHand ? exposedHand : hand ;
  if (isTurnToPlay && isInHand(cardAsNumber, handToCheck)) {
    disableCardThinkingAnimation = true;
    randomCardAsNumber = null;
  }
  //#endregion
  if (!isMobile && isTurnToPlay ) {
    movePath = false;
    var hitResult = project.hitTest(event.point, hitOptions);
    if (!hitResult || !event.target || event.target.name === null) return null;
    var originalBottomLeft = event.target.bounds.bottomLeft;
    var originalCenter = event.target.bounds.center;
    event.target.scale(handScaleAmount);
    if (hand.flatten(2).includes(getCardAsNumberFromName(hitResult.item.name))) {
      event.target.bounds.bottomLeft = originalBottomLeft;
    }
    else {
      event.target.bounds.center = originalCenter;
    }
  }
}
function checkScrollDown(event) {
  if (!isMobile) return;
  if (event === undefined || event === null) return;
  var leftBound = 0;
  var rightBound = canvasWidth;
  var topBound = gameInformation.bounds.top;
  var bottomBound = gameInformation.bounds.bottom;
  var isInsideX = event.downPoint.x >= leftBound && event.downPoint.x <= rightBound;
  if (!isInsideX) return;
  var isInsideY = event.downPoint.y >= topBound && event.downPoint.y <= bottomBound;
  if (isInsideX && isInsideY && isMobile) globals.scrollDown();
}
function checkScrollUp(event) {
  if (!isMobile) return;
  if (event === undefined || event === null) return;
  var leftBound = 0;
  var rightBound = canvasWidth;
  var topBound = dealInformation.bounds.top;
  var bottomBound = dealInformation.bounds.bottom;
  var isInsideX = event.downPoint.x >= leftBound && event.downPoint.x <= rightBound;
  if (!isInsideX) return;
  var isInsideY = event.downPoint.y >= topBound && event.downPoint.y <= bottomBound;
  if (isInsideX && isInsideY && isMobile) globals.scrollUp();
}
function onMouseDown(event) {
  // checkScrollDown(event);
  // checkScrollUp(event);
  if (roundEndAnimation) return null;
  var hitResult = project.hitTest(event.point, hitOptions);
  
  if (!hitResult) return null;
  handleDoubleClick(hitResult);
  //#region Scaling PlayArea Card up To See better
  if (pointsAreColocated(topPlayArea.position, hitResult.item.position, 2) || pointsAreColocated(bottomPlayArea.position, hitResult.item.position, 2) || pointsAreColocated(leftPlayArea.position, hitResult.item.position, 2) || pointsAreColocated(rightPlayArea.position, hitResult.item.position, 2)) {
    previousLayerIndex = getItemLayerIndex(hitResult.item);
    project.activeLayer.addChild(hitResult.item);
    
    var amountToScale = scaleOnClickAmount / playAreaShrinkFactor;
    hitResult.item.scale(amountToScale);
    playedCardToShow = hitResult.item;
    playedCardRotation = hitResult.item.rotation;
    return;
  }
  //#endregion
  //#region Setting up potential play
  if (!isTurnToPlay) return null;
  isFromHand = hand.flatten(2).includes(getCardAsNumberFromName(hitResult.item.name));
  isFromExposedHand = exposedHand && exposedHand.flatten(2).includes(getCardAsNumberFromName(hitResult.item.name));
  clickedOnItem = hitResult.item;
  if (hitResult.item) cardName = hitResult.item.name;
  if (!isExposedBottom && hitResult.item.name != null) {
    cardRotation = hitResult.item.rotation;
    newCenter = event.downPoint;
    segment = null;
    if (!hitResult || cardRotation !== 0) return;
    hitResult.item.fullySelected = false;
    previousRotation = hitResult.item.rotation;
    project.activeLayer.addChild(hitResult.item);
    // var clickedOnItem = deck[cardValuesOrder.findIndex(function (card) {return card.toLowerCase() === hitResult.item.name.toLowerCase()})];
    if (clickedOnItem)  {
      clickedOnItem.rotation = 0;
      if (i == 0) {
        clickedOnItem.position = newCenter;
      }
    }
    if (hitResult) {
      if (hitResult.type == "segment") {
        segment = hitResult.segment;
      }
    }
    movePath = hitResult.type == "fill";
    if (movePath) {
      project.activeLayer.addChild(hitResult.item);
    }
  }
  //#endregion

}
function onMouseDrag(event) {
  var hitResult = project.hitTest(event.point, hitOptions);
  if (hitResult === null && !clickedOnItem) {
    return globals.touchStartHandler(event);
  }
  globals.removeTouchHandler(event);
  if (roundEndAnimation) return null;
  if (!isTurnToPlay) return null;
  if (exposedHandLocation !== 'bottom' && cardRotation == 0 && clickedOnItem && clickedOnItem.name !== undefined) {
    
    if (hitResult && hitResult.item && hitResult.item.name || (hitResult && pointsAreColocated(hitResult.item.bounds.center, event.point, 25))) {
      if (hitResult && hitResult.item && hitResult.item.name && hitResult.item === clickedOnItem) {
        project.activeLayer.addChild(hitResult.item);
        hitResult.item.position += event.delta;
        if (clickedOnItem)  {
          clickedOnItem.rotation = 0;
          if (i == 0) {
            clickedOnItem.position = newCenter;
          }
          i++;
        }
      }
    }
    else {
      clickedOnItem = null;
      if (hitResult && hitResult.item.name) redisplayHandArray(hitResult.item.name);
    }
  }
}
function onMouseUp(event) {
  i = 0;
  var hitResult = project.hitTest(event.point, hitOptions);
  //#region Scaling Card Down if Scaled up for Vision
  if (playedCardToShow) {
    var desiredSize;
    if (Math.round(playedCardRotation) === 0 || Math.round(playedCardRotation) === 180) {
      desiredSize = isMobile ? smallCardHeight : cardHeight * playAreaShrinkFactor;
    }
    else {
      desiredSize = isMobile ? smallCardWidth : cardWidth * playAreaShrinkFactor;
    }
    if (isHighAspectRatio) desiredSize *= highAspectRatioScaleFactor;
    playedCardToShow.scale(desiredSize / playedCardToShow.bounds.height);
    project.activeLayer.insertChild(previousLayerIndex, playedCardToShow);
    playedCardToShow = null;
    previousLayerIndex = null;
  }
  //#endregion
  //#region Playing Card or Not
  if (!hitResult || !clickedOnItem || !isTurnToPlay || roundEndAnimation) return null;
  if (isValidPlay(hitResult)) {
    if (hitResult.item) {
      var cardAsNumber = getCardAsNumberFromName(hitResult.item.name);
      if (typeof cardAsNumber !== 'number' || cardAsNumber === -1) return null;
      var card = deck[cardAsNumber];
      card.scale(isMobile ? (smallCardHeight / card.bounds.height) : (cardHeight / card.bounds.height));
      if (isFromHand) card.position = bottomPlayArea.bounds.center;
      if (isFromExposedHand) card.position = topPlayArea.bounds.center;
      project.activeLayer.addChild(card);
      globals.playCard(cardAsNumber);
    }
    return;
  }
  if (clickedOnItem && clickedOnItem.name || hitResult && hitResult.item.name) redisplayHandArray( !!clickedOnItem ? clickedOnItem.name : hitResult.item.name);
  clickedOnItem = null;
  //#endregion
}
function onMouseLeave(event) {
  if (!event || !event.target) return null;
  disableCardThinkingAnimation = false;
  if (roundEndAnimation) return null;
  if (!isTurnToPlay) return null;
  
  var roundedEventHeight = Math.round(event.target.bounds.height * 100) / 100;
  var roundedEventWidth = Math.round(event.target.bounds.width * 100) / 100;
  if (roundedCardHeight !== roundedEventHeight || roundedCardWidth !== roundedEventWidth) {
    redisplayHandArray(event.target.name);
    return;
  }
}
function onResize(isClientResize, cardsToLoad) {
  // if (roundEndAnimation === true) return;
  // topPlayAreaCard = null, bottomPlayAreaCard = null, rightPlayAreaCard = null, leftPlayAreaCard = null;
  if (!loadComplete) return;
  globals.saveInfoDivLocations();
  globals.loadInfoDivLocations(exposedHandLocation);
  setTimeout(function () {
    globals.toggleDealInfoFullSize(isMobile);
  }, 333);
  // if (isClientResize) globals.resetInfoDivLocations();
  project.clear();
  shouldChangePlayableCards = true;
  resetDisplayVariables();
  initializeVariables();
  if (cardHeight / canvasHeight >= cardHeightMaxPercent) {
    cardHeight = cardHeightMaxPercent * canvasHeight;
    cardWidth = cardHeight / 1.5;
    shouldUseHeight = true;
  }
  generateDeckFromImages(cardsToLoad);
  if (cardsToLoad) {
    setTimeout(function () {
      displayStuff(isClientResize);
    }, waitToLoadNewTheme);
  }
  else displayStuff(isClientResize, null);
}
function displayStuff (isClientResize, cardsToLoad) {
  display();
  if (!isMobile && isClientResize) globals.callSetCanvasColors(cardsToLoad);
  previousThinkingLocation = null;
}
function handleDoubleClick(hitResult) {
  if (hitResult.item && hitResult.item.name) {
    var cardNameAsString = hitResult.item.name;
    if (lastClickedCard === cardNameAsString) {
      globals.playCard(getCardAsNumberFromName(cardNameAsString))
      lastClickedCard = null;
    }
    lastClickedCard = cardNameAsString;
    setTimeout(function() {
      lastClickedCard = null;
    }, doubleClickInterval);
  }
}
function onFrame(event) {
  if (thinkingLocation) {
    if (previousThinkingLocation !== thinkingLocation) {
      previousThinkingLocation = thinkingLocation;
      setCardsToAnimate();
      setupSuitsForPlayAreaThinking();
      frameCountForCardThinkingAnimation = 0;
      frameCountForSuitThinkingAnimation = 0;
    }
    if (!disableCardThinkingAnimation || !isTurnToPlay) animateThinking();
    animatePlayAreaThinking();
  }
  if(cardPlayAnimation && cardToPlayAsNumber !== undefined && cardToPlayAsNumber !== null && cardToPlayHandLocation) { 
    if (preferences.shouldAnimateCardPlay) animateCardPlay();
    else {
      skipCardPlayAnimation();
    }
  }
  if (roundEndAnimation && waitForRoundEnd === true) {
    if (needToSleepBeforeRoundEnd === true && hasEnteredRoundEndSleep === false) {
      hasEnteredRoundEndSleep = true;
      sleep(isLastPersonToPlay || !preferences.shouldAnimateCardPlay ? roundEndAnimationWaitDuration : 0).then(function () { 
        resetTimerLabels();
        needToSleepBeforeRoundEnd = false;
      });
    }
    else if (needToSleepBeforeRoundEnd === false) {
      if (!preferences.shouldAnimateRoundEnd) waitForRoundEnd = false;
      if (preferences.shouldAnimateRoundEnd) animateRoundEnd();
      else {
          skipRoundEndAnimation();
      }
    }
  }
}
//#endregion
//#region Mobile Only Displaying Stuff
function displayHandsMobile() {
  displayHandMobile(hand, exposedHandLocation.toLowerCase() !== cardDisplayLocations.bottom ? cardDisplayLocations.bottom : cardDisplayLocations.top);
  displayHiddenHands();

  if (!exposedHand) return;
  var params = getParametersToDrawExposedHandMobile();
  displayExposedHandMobile(params.startPoint, params.endPoint, params.desiredHeight, params.desiredSpacing, params.x);
}  
function getParametersToDrawExposedHandMobile(){
  var startPoint = topPlayArea.bounds.top - marginAmount * 3;
  var endPoint = bottomPlayArea.bounds.bottom + marginAmount * 3;
  var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
  var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
  var x = desiredHeight / 4;
  if (isExposedRight) {
    x = canvasWidth - desiredHeight / 4;
  }
  return {
    startPoint: startPoint,
    endPoint: endPoint,
    desiredHeight: desiredHeight,
    desiredSpacing: desiredSpacing,
    x: x,
  }
}
function displayExposedHandMobile(startPoint, endPoint, desiredHeight, desiredSpacing, x) {
  if (exposedHand === undefined || exposedHand === null) return;
  var shouldWait = false;
  var flatExposed = exposedHand.flatten(2);
  for (var i = 0; i < flatExposed.length; i++) {
    var card = deck[flatExposed[i]];
    if (card.bounds.height === 0) {
      shouldWait = true;
      break;
    }
  }

  if (isFirstTimeDisplayingExposedHandMobile && shouldWait) {
    setTimeout(function () {
      displayExposedHandMobile(startPoint, endPoint, desiredHeight, desiredSpacing, x);
    }, checkCardLoadInterval);
  }
  else {
    isFirstTimeDisplayingExposedHandMobile = false;
    positionExposedHandsMobile(startPoint, endPoint, desiredHeight, desiredSpacing, x);
    // setThinkingLocation();
  }
}
function positionExposedHandsMobile(startPoint, endPoint, desiredHeight, desiredSpacing, x) {
  if (exposedHand && isExposedLeft) {
    placeCardsStartingAtPoint(exposedHand.flatten(2), x, startPoint, desiredHeight, smallCardHeight, desiredSpacing, 90, drawDirections.toBottom, orientationPoints.topRight, false, true);
  }
  else if (exposedHand && isExposedRight) {
    placeCardsStartingAtPoint(exposedHand.flatten(2), x, endPoint, desiredHeight, smallCardHeight, desiredSpacing, 90, drawDirections.toTop, orientationPoints.bottomLeft, false, true);
  }
  else if (exposedHand && isExposedTop) {
    displayHandMobile(exposedHand, exposedHandLocation);
  }
  else if (exposedHand && isExposedBottom) {
    displayHandMobile(exposedHand, exposedHandLocation);
  }
}
//#region Displaying Hand and ExposedHand
  //right side up exposedhand but more space
  function displayHandMobile(cardArray, location) {
    if (cardArray === undefined || cardArray === null || location === undefined || location === null) return null;
    //Setup for Card Placement
    var widthFactor;
    var exposedHandCardWidth, exposedHandCardHeight;
    var previousX, previousY;
    var expectedHandHeight;
    var cardCount = cardArray.flatten(2).length;
    var previousXStart, previousYStart, xSpacing, yLocation;
    var k = 0;

    //#region reversing suit order if drawing exposedhand on the right
    if (location.toLowerCase() === cardDisplayLocations.right && isExposedRight && JSON.stringify(cardArray === JSON.stringify(exposedHand))) {
      exposedHand.reverse();
    }
    //#endregion
    //#region ExposedHand Top and Bottom Setup
    if (location.toLowerCase() === cardDisplayLocations.top || location.toLowerCase() === cardDisplayLocations.bottom) {
      exposedHandCardWidth = smallCardWidth;
      exposedHandCardHeight = smallCardHeight;
      widthFactor = widthFactorTopBottomMobile;
      xSpacing = exposedHandCardWidth / 2;

      if (location.toLowerCase() === cardDisplayLocations.top && isExposedTop) {
        yLocation = exposedHandCardHeight / 2;
        widthFactor = widthFactorTopBottomMobile;
      }
      else if (location.toLowerCase() === cardDisplayLocations.bottom && isExposedBottom) {
        yLocation = canvasHeight + exposedHandCardHeight / nonHandCardHideFactor;
        widthFactor = widthFactorTopBottomMobile;
      }
      else if (location.toLowerCase() === cardDisplayLocations.top && isExposedBottom) {
        widthFactor = widthFactorTopBottomMobile;
        xSpacing = exposedHandCardWidth / 2;
        yLocation = exposedHandCardHeight / 2;
      }
      else if (location.toLowerCase() === cardDisplayLocations.top) {
        widthFactor = widthFactorTopBottomMobile;
        xSpacing = cardWidth / 2;
        yLocation = cardHeight / 2;
      }
      else if (location.toLowerCase() === cardDisplayLocations.bottom) {
        widthFactor = widthFactorTopBottomMobile;
        xSpacing = cardWidth / 2;
        yLocation = canvasHeight + amountOfBottomHandShownOffset;
      }
    }
    //#endregion
    //#region ExposedHand Left and Right Setup
    else if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.right) {
      //#region Getting Start Y location
      widthFactor = widthFactorLeftRightMobile;
      expectedHandHeight = getExpectedHandHeight(smallCardWidth, cardCount, widthFactor);
      ySpacing = cardWidth / 2;
      previousYStart = greenSpaceCenter - expectedHandHeight / 2 - smallCardWidth / 3;
      //#endregion
      //#region Getting xLocation
      if (location.toLowerCase() === cardDisplayLocations.left) xLocation = exposedHandLocation.toLowerCase() === location.toLowerCase() ? - smallCardHeight / nonHandCardHideFactor : - smallCardHeight / nonHandCardHideFactor;
      else xLocation = exposedHandLocation.toLowerCase() === location.toLowerCase() ? canvasWidth + smallCardHeight / nonHandCardHideFactor : canvasWidth + smallCardHeight / nonHandCardHideFactor;
      //#endregion
    }
    //#endregion
    //this centers the top and bottom hands 
    widthOfHand = (cardCount - 1) * widthFactor + xSpacing * 2;
    previousXStart = (widthOfHand >= canvasWidth) ? 0 : (canvasWidth - widthOfHand) / 2;
    //#region Place the cards
    for (var i = 0; i < cardCount; i++) {
      var cardAsNumber = cardArray.flatten(2)[i];
      //shrinking the card 
      if (location.toLowerCase() === exposedHandLocation.toLowerCase() || location.toLowerCase() === cardDisplayLocations.top && isExposedBottom) {
        var card = deck[cardAsNumber];
        if (needToScaleExposedHandMobile || location.toLowerCase() === exposedHandLocation.toLowerCase() && Math.round(smallCardHeight) !== Math.round(card.bounds.height) && Math.round(smallCardHeight) !== Math.round(card.bounds.width) ) {
          card.scale(exposedHandShrinkAmountMobile);
        } 
      }
      //#region setting previousX and y
      if (i === 0 ) {
        previousX = previousXStart;
        previousY = previousYStart;
      }
      else {
        previousX = previousXStart + widthFactor * k;
        previousY = previousYStart + widthFactor * k;
      }
      //#endregion
      //#region Actually positioning the card
      if (location.toLowerCase() === cardDisplayLocations.top || location.toLowerCase() === cardDisplayLocations.bottom) {
        deck[cardAsNumber].position.x = previousX + xSpacing;
        deck[cardAsNumber].position.y = yLocation;
      }
      else {
        deck[cardAsNumber].position.y = previousY + ySpacing;
        deck[cardAsNumber].position.x = xLocation;
        deck[cardAsNumber].rotation = 0;
        deck[cardAsNumber].rotate(location.toLowerCase() === cardDisplayLocations.left ? 90 : -90);
      }
      //#endregion
      k++;
      project.activeLayer.addChild(deck[cardAsNumber]);
    }
    //#endregion
    //Setting Flag for scaling of exposedhand
    if (location.toLowerCase() === exposedHandLocation.toLowerCase() || location.toLowerCase() === cardDisplayLocations.top && isExposedBottom) {
      needToScaleExposedHandMobile = false;
    }
    //Relayering Exposed Hand on Right Side
    if (isExposedRight && location.toLowerCase() === cardDisplayLocations.right) {
      reverseHandLayerOrder(cardArray);
      resizeCards(cardArray, smallCardHeight);
    }
    changePlayableCards();
  }
//#endregion
//#region Displaying Hidden Cards Mobile
function getHiddenStartingPointMobile(cardCount, location) {
  var hiddenCardHeight = smallCardHeight;
  var hiddenCardWidth = smallCardWidth;
  var widthTakenUpBySideHandsOffset = -hiddenCardHeight * 1.66;
  widthTakenUpBySideHands = hiddenCardHeight - (hiddenCardHeight / 2 - (widthTakenUpBySideHandsOffset / nonHandCardHideFactor));
  marginAmountMobile = (canvasWidth - hiddenCardHeight * 2 - widthTakenUpBySideHands * 2) / 4;
  lengthOfHiddenHand = smallCardWidth + ((cardCount - 1) * widthFactorLeftRightMobile);
  var leftRightY = greenSpaceCenter - lengthOfHiddenHand / 2 + hiddenCardWidth / 2;
  var xOffset = (smallCardHeight * 2 - lengthOfHiddenHand) / 2 + 3 * widthFactorLeftRightMobile;
  if (location.toLowerCase() === cardDisplayLocations.top) {
    return {x: leftPlayArea.position.x - hiddenCardHeight / 2 + xOffset, y: -hiddenCardHeight / 3};
  }
  else if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.bottomLeft) {
    return {x: widthTakenUpBySideHandsOffset / nonHandCardHideFactor, y: leftRightY};
  }
  else if (location.toLowerCase() === cardDisplayLocations.right || location.toLowerCase() === cardDisplayLocations.bottomRight) {
    return {x: canvasWidth - widthTakenUpBySideHandsOffset / nonHandCardHideFactor, y: leftRightY};
  }
}
//#endregion
//#endregion
//#region Full-size Only Displaying Stuff
function displayCards() {
  displayHandAsLine();
  if (exposedHand !== null) displayExposedHand(); 
  alreadyRotated = true;
}  
//#region displayExposedHand Functions
function displayExposedHand () {
  if (exposedHand === undefined || exposedHand === null) return;
  cardWidth *= exposedHandSizeFactor;
  cardHeight *= exposedHandSizeFactor;
  resize = false;
  exposedHandCardHeight = cardHeight;
  exposedHandCardWidth = cardWidth;
  calculateExposedHandHeightAndWidth();
 
  enoughHeightToDisplay = setHeightAvailable(exposedHandLocation);
  enoughWidthToDisplay = setWidthAvailable(exposedHandLocation);
  resizeExposedHandCards();
  positionCards(exposedHand, exposedHandCardHeight, exposedHandLocation);
  cardWidth /= exposedHandSizeFactor;
  cardHeight /= exposedHandSizeFactor;
  changePlayableCards();
}
//#region calculateExposedHandHeightAndWidth Functions
function calculateExposedHandHeightAndWidth() {
  numberOfSuits = getNumberOfSuits(exposedHand);
  numberOfSpacesBetweenCards = getNumberOfSpacesBetweenCards(exposedHand);
  exposedHandWidthSpacing = cardWidth / exposedHandCardWidthSpacingScaleFactor;
  exposedHandHeightSpacing = cardHeight / exposedHandCardHeightSpacingScaleFactor;
  
  if (isExposedTop || isExposedBottom) {
    exposedHandWidth = cardWidth * numberOfSuits + ((numberOfSuits - 1) * exposedHandWidthSpacing);
    exposedHandHeight = cardHeight + (numberOfSpacesBetweenCards * exposedHandHeightSpacing);
  }
  else if (isExposedLeft || isExposedRight) {
    exposedHandWidth = cardHeight + (numberOfSpacesBetweenCards * exposedHandHeightSpacing);
    exposedHandHeight = cardWidth * numberOfSuits + ((numberOfSuits - 1) * exposedHandWidthSpacing);
  }
  else {
    throw "exposedHandLocation is invalid: " + exposedHandLocation;
  }
}
function getNumberOfSuits(hand) {
  if (hand === undefined || hand === null) return;
  var numberOfSuits = 0;
  for (var i = 0; i < hand.length; i++) {
    var suit = hand[i];
    for (var j = 0; j < suit.length; j++) {
      var card = suit[j];
      if (card >= 0 && card <= 51) {
        numberOfSuits++;
        break;
      }
    }
  }
  return numberOfSuits;
}
function getNumberOfSpacesBetweenCards(hand) {
  if (hand === undefined || hand === null) return;
  var longestSuitLength = 0;
  for (var i = 0; i < hand.length; i++) {
    var suit = hand[i];
    if (suit[0] >= 0 && suit[0] <= 51) {
      if (suit.length > longestSuitLength) {
        longestSuitLength = suit.length;
      }
    }
  }
  return longestSuitLength - 1;
}
//#endregion
function setHeightAvailable(location) {
  if (location.toLowerCase() === 'top') {
    heightAvailable = topPlayArea.bounds.topLeft.y - marginAmount;
    return heightAvailable >= exposedHandHeight; 
  }
  else if (location.toLowerCase() === 'bottom') {
    heightAvailable = canvasHeight - (bottomPlayArea.bounds.bottomRight.y + marginAmount);
    return heightAvailable >= exposedHandHeight; 
  }
  else if (location.toLowerCase() === 'left'){
    heightAvailable = leftPlayArea.bounds.topLeft.x;
    ;
    return heightAvailable >= exposedHandWidth; 
  }
  else if (location.toLowerCase() === 'right') {
    heightAvailable = canvasWidth - rightPlayArea.bounds.topRight.x;
    return heightAvailable >= exposedHandWidth; 
  }
  else {
    throw "exposedHandLocation is invalid: " + exposedHandLocation;
  }
}
function setWidthAvailable(location) {
  if (location.toLowerCase() === 'top') {
    widthAvailable = canvasWidth;
    return widthAvailable >= exposedHandWidth; 
  }
  else if (location.toLowerCase() === 'bottom') {
    widthAvailable = canvasWidth;
    return widthAvailable >= exposedHandWidth; 
  }
  else if (location.toLowerCase() === 'left'){
    widthAvailable = bottomPlayArea.bounds.bottomRight.y;
    return widthAvailable >= exposedHandHeight; 
  }
  else if (location.toLowerCase() === 'right') {
    widthAvailable = bottomPlayArea.bounds.bottomRight.y;
    return widthAvailable >= exposedHandHeight; 
  }
  else {
    throw "exposedHandLocation is invalid: " + exposedHandLocation;
  }
}
function resizeExposedHandCards() {
  // console.log('resizeExposedHandCards------------------------');
  resize = true;
  var proposedHeight1 = 10000, proposedHeight2 = 10000;
  if (!enoughWidthToDisplay) {
    var proposedWidth = widthAvailable / ((numberOfSuits - 1) / exposedHandCardWidthSpacingScaleFactor + numberOfSuits);
    proposedHeight1 = proposedWidth * (1 / cardWidthFactor);
  }
  if (!enoughHeightToDisplay) {
    proposedHeight2 = heightAvailable / ((1 + (numberOfSpacesBetweenCards / 5.5)) + (cardWidthFactor / exposedHandCardWidthSpacingScaleFactor));
  } 
  if (!enoughHeightToDisplay || !enoughWidthToDisplay) exposedHandCardHeight =  proposedHeight1 >= proposedHeight2 ? proposedHeight2 : proposedHeight1;
  else exposedHandCardHeight = cardHeight;
  exposedHandCardWidth = exposedHandCardHeight * cardWidthFactor;
  exposedHandWidthSpacing = exposedHandCardWidth / exposedHandCardWidthSpacingScaleFactor;
  exposedHandHeightSpacing = exposedHandCardHeight / exposedHandCardHeightSpacingScaleFactor;
  if (isExposedBottom || isExposedTop) {
    exposedHandHeight = exposedHandCardHeight + (getNumberOfSpacesBetweenCards(exposedHand) * exposedHandHeightSpacing);
    exposedHandWidth = exposedHandCardWidth * numberOfSuits + ((numberOfSuits - 1) * exposedHandWidthSpacing);
  }
  else if (isExposedLeft || isExposedRight) {
    exposedHandWidth = exposedHandCardHeight + (getNumberOfSpacesBetweenCards(exposedHand) * exposedHandHeightSpacing);
    exposedHandHeight = exposedHandCardWidth * numberOfSuits + ((numberOfSuits - 1) * exposedHandWidthSpacing);
  }
  if (exposedHandCardHeight / cardHeight >= minExposedHandSize) resizeCards(exposedHand, exposedHandCardHeight, cardHeight / exposedHandSizeFactor);
}
function positionCards(cardsArray, height, location) {
  if (cardsArray === undefined || cardsArray === null) return null;
  if (exposedHandCardHeight / cardHeight >= minExposedHandSize) {
    placeCardsInColumns(cardsArray, height, location);
  }
  else {
    if (isExposedTop) {
      var y = topPlayArea.bounds.top - marginAmount;
      var startPoint = leftPlayArea.bounds.left;
      var endPoint = rightPlayArea.bounds.right;
      var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
      var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
      placeCardsStartingAtPoint(exposedHand, startPoint, y, desiredHeight, cardHeight / exposedHandSizeFactor, desiredSpacing, 0, drawDirections.toRight, orientationPoints.bottomLeft);
    }
    else if (isExposedBottom) {
      var y = bottomPlayArea.bounds.bottom + marginAmount;
      var startPoint = leftPlayArea.bounds.left;
      var endPoint = rightPlayArea.bounds.right;
      var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
      var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
      placeCardsStartingAtPoint(exposedHand, startPoint, y, desiredHeight, cardHeight / exposedHandSizeFactor, desiredSpacing, 0, drawDirections.toRight, orientationPoints.topLeft);
    }
    else if (isExposedLeft) {
      var x = leftPlayArea.bounds.topLeft.x - marginAmount;
      var startPoint = topPlayArea.bounds.top;
      var endPoint = bottomPlayArea.bounds.bottom;
      var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
      var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
      placeCardsStartingAtPoint(exposedHand.flatten(2).reverse(), x, endPoint, desiredHeight, cardHeight / exposedHandSizeFactor, desiredSpacing, 90, drawDirections.toTop, orientationPoints.bottomRight, true);
    }
    else if (isExposedRight) {
      var x = rightPlayArea.bounds.right + marginAmount;
      var startPoint = topPlayArea.bounds.top;
      var endPoint = bottomPlayArea.bounds.bottom;
      var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
      var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
      placeCardsStartingAtPoint(exposedHand, x, endPoint, desiredHeight, cardHeight / exposedHandSizeFactor, desiredSpacing, -90, drawDirections.toTop, orientationPoints.bottomLeft);
    }
  }
}
function getCenteringOffset(cardCount, desiredWidth, spacing) {
  if (cardCount === undefined || cardCount === null || desiredWidth === undefined || desiredWidth === null || spacing === undefined || spacing === null) return 0;
  var fullSizeHandWidth = getHandWidth(13, desiredWidth, spacing);
  var currentHandWidth = getHandWidth(cardCount, desiredWidth, spacing);
  return Math.abs(currentHandWidth - fullSizeHandWidth) / 2;
}
function placeCardsStartingAtPoint(handArray, startingX, startingY, desiredCardHeight, currentCardHeight, spacing, rotation, drawDirection, orientationPoint, reverseLayingOrder, centerAroundStartingPoints) {
  // console.log('desiredCardHeight in placeCardsStartingAtPoint =', desiredCardHeight);
  if (handArray === undefined || handArray === null || startingX === undefined || startingX === null || startingY === undefined || startingY === null) return;
  desiredCardHeight = (desiredCardHeight == undefined) ? cardHeight : desiredCardHeight;
  spacing = (spacing == undefined) ? cardWidth * handWidthSpacingPercentOfCardWidth : spacing;
  orientationPoint = (orientationPoint == undefined) ? orientationPoints.center : orientationPoint;
  currentCardHeight = (currentCardHeight == undefined) ? cardHeight : currentCardHeight;
  centerAroundStartingPoints = (centerAroundStartingPoints == undefined) ? false : centerAroundStartingPoints;

  var reverseLayingOrder = (reverseLayingOrder == undefined) ? false : reverseLayingOrder;
  var flatHand = handArray.flatten(2);
  var desiredAsDecimalPercentageOfNormalHeight = desiredCardHeight / currentCardHeight;
  var desiredCardHeight = desiredAsDecimalPercentageOfNormalHeight * currentCardHeight;
  var desiredCardWidth = desiredCardHeight * cardWidthFactor;
  var widthAdjustment = desiredCardWidth / 2;
  var heightAdjustment = desiredCardHeight / 2;
  var centeringAmount = 0;
  if (rotation === 90 || rotation === -90) {
    widthAdjustment = desiredCardHeight / 2;
    heightAdjustment = desiredCardWidth / 2;
  } 

  for (var i = 0; i < flatHand.length; i++) {
    var cardAsNumber = flatHand[i];
    var card;
    if (typeof cardAsNumber === 'object') {
      card = cardAsNumber;
      card.rotation = 0;
    }
    else card = deck[cardAsNumber];

    // card.scale(desiredAsDecimalPercentageOfNormalHeight);
    var heightToUse = (card && card.bounds && card.bounds.height === 0) ? currentCardHeight : card.bounds.height;
    card.scale(desiredCardHeight / heightToUse);
    
    if (card.rotation !== rotation) {
      card.rotation = 0;
      card.rotate(rotation, card.bounds[orientationPoint]);
    } 
    if (centerAroundStartingPoints) centeringAmount = getCenteringOffset(flatHand.length, desiredCardHeight * 2 / 3, spacing);

    if (drawDirection === drawDirections.toTop) {
      if (orientationPoint === orientationPoints.topLeft) {
        card.position.x = startingX + widthAdjustment;
        card.position.y = startingY - i * spacing + heightAdjustment - centeringAmount;
      }
      else if (orientationPoint === orientationPoints.topRight) {
        card.position.x = startingX - widthAdjustment;
        card.position.y = startingY - i * spacing + heightAdjustment - centeringAmount;
      }
      else if (orientationPoint === orientationPoints.bottomLeft) {
        card.position.x = startingX + widthAdjustment;
        card.position.y = startingY - i * spacing - heightAdjustment - centeringAmount;
      }
      else if (orientationPoint === orientationPoints.bottomRight) {
        card.position.x = startingX - widthAdjustment;
        card.position.y = startingY - i * spacing - heightAdjustment - centeringAmount;
      }
      else if (orientationPoint === orientationPoints.center) {
        card.position.x = startingX;
        card.position.y = startingY - i * spacing - centeringAmount;
      }
    }
    else if (drawDirection === drawDirections.toBottom) {
      if (orientationPoint === orientationPoints.topLeft) {
        card.position.x = startingX + widthAdjustment;
        card.position.y = startingY + i * spacing + heightAdjustment + centeringAmount;
      }
      else if (orientationPoint === orientationPoints.topRight) {
        card.position.x = startingX - widthAdjustment;
        card.position.y = startingY + i * spacing + heightAdjustment + centeringAmount;
      }
      else if (orientationPoint === orientationPoints.bottomLeft) {
        card.position.x = startingX + widthAdjustment;
        card.position.y = startingY + i * spacing - heightAdjustment + centeringAmount;
      }
      else if (orientationPoint === orientationPoints.bottomRight) {
        card.position.x = startingX - widthAdjustment;
        card.position.y = startingY + i * spacing - heightAdjustment + centeringAmount;
      }
      else if (orientationPoint === orientationPoints.center) {
        card.position.x = startingX;
        card.position.y = startingY + i * spacing + centeringAmount;
      }
    }
    else if (drawDirection === drawDirections.toLeft) {
      if (orientationPoint === orientationPoints.topLeft) {
        card.position.x = startingX - i * spacing + widthAdjustment - centeringAmount;
        card.position.y = startingY + heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.topRight) {
        card.position.x = startingX - i * spacing - widthAdjustment - centeringAmount;
        card.position.y = startingY + heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.bottomLeft) {
        card.position.x = startingX - i * spacing + widthAdjustment - centeringAmount;
        card.position.y = startingY - heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.bottomRight) {
        card.position.x = startingX - i * spacing - widthAdjustment - centeringAmount;
        card.position.y = startingY - heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.center) {
        card.position.x = startingX - i * spacing - centeringAmount;
        card.position.y = startingY;
      }
    }
    else if (drawDirection === drawDirections.toRight) {
      if (orientationPoint === orientationPoints.topLeft) {
        card.position.x = startingX + i * spacing + widthAdjustment + centeringAmount;
        card.position.y = startingY + heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.topRight) {
        card.position.x = startingX + i * spacing - widthAdjustment + centeringAmount;
        card.position.y = startingY + heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.bottomLeft) {
        card.position.x = startingX + i * spacing + widthAdjustment + centeringAmount;
        card.position.y = startingY - heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.bottomRight) {
        card.position.x = startingX + i * spacing - widthAdjustment + centeringAmount;
        card.position.y = startingY - heightAdjustment;
      }
      else if (orientationPoint === orientationPoints.center) {
        card.position.x = startingX + i * spacing + centeringAmount;
        card.position.y = startingY;
      }
    }
    if (reverseLayingOrder) project.activeLayer.insertChild(project.activeLayer.children.length - 1 - i, card);
    else project.activeLayer.addChild(card);
  }
}
function placeCardsInColumns(cardsArray, height, location) {
  var locationsOfCards = [];
  var width = height * cardWidthFactor;
  var nextPoint = getStartingPoint(location);
  if (location.toLowerCase() === cardDisplayLocations.right) {
    var flatHand = cardsArray.flatten(2);
    var hasTrump = getHasTrump(flatHand);
    if (hasTrump) {
      var firstCardIsTrump = getCardIsTrump(flatHand[0]);
      if (firstCardIsTrump) cardsArray.reverse();
    }
  }
  for (var i = 0; i < cardsArray.length; i++) {
    var suit = cardsArray[i];
    for (var j = 0; j < suit.length; j++) {
      var card = suit[j];
      locationsOfCards.push([card, nextPoint.x, nextPoint.y]);
      if (location.toLowerCase() === 'top') {
        nextPoint.y += exposedHandHeightSpacing;
      }
      else if (location.toLowerCase() === 'bottom') {
        deck[card].rotation = 0;
        deck[card].rotate(-180, deck[card].bounds.topLeft);
        nextPoint.y -= exposedHandHeightSpacing;
      }
      else if (location.toLowerCase() === 'left') {
        deck[card].rotation = 0;
        deck[card].rotate(-90, deck[card].bounds.topLeft);
        nextPoint.x += exposedHandHeightSpacing;
      }
      else if (location.toLowerCase() === 'right') {
        deck[card].rotation = 0;
        deck[card].rotate(90, deck[card].bounds.topLeft);
        nextPoint.x -= exposedHandHeightSpacing;
      }
    }
    if (location.toLowerCase() === 'top') {
      nextPoint.y = exposedHandTopStartY;
      nextPoint.x += (exposedHandWidthSpacing + width);
    }
    else if (location.toLowerCase() === 'bottom') {
      nextPoint.y = exposedHandBottomStartY;
      nextPoint.x -= (exposedHandWidthSpacing + width);
    }
    else if (location.toLowerCase() === 'left') {
      nextPoint.x = exposedHandLeftStartX;
      nextPoint.y -= (exposedHandWidthSpacing + width);
    }
    else if (location.toLowerCase() === 'right') {
      nextPoint.x = exposedHandRightStartX;
      nextPoint.y -= (exposedHandWidthSpacing + width);
    }
    else {
      throw "exposedHandLocation is invalid: " + exposedHandLocation;
    }
  }
  moveExposedHandCards(locationsOfCards, width, height, location);
}
function moveExposedHandCards(locationsOfCards, cardWidth, cardHeight, location) {
  //input array: [[card, x, y],...]
  for (var i = 0; i < locationsOfCards.length; i++) {
    var pointArray = locationsOfCards[i];
    if (location === "top") {
      deck[pointArray[0]].position.x = pointArray[1] + .5 * cardWidth;
      deck[pointArray[0]].position.y = pointArray[2] + .5 * cardHeight;
    }
    else if (location === "bottom") {
      deck[pointArray[0]].position.x = pointArray[1] - .5 * cardWidth;
      deck[pointArray[0]].position.y = pointArray[2] - .5 * cardHeight;
    }
    else if (location === "left") {
      deck[pointArray[0]].position.x = pointArray[1] + .5 * cardHeight;
      deck[pointArray[0]].position.y = pointArray[2] - .5 * cardWidth;
    }
    else if (location === "right") {
      deck[pointArray[0]].position.x = pointArray[1] - .5 * cardHeight;
      deck[pointArray[0]].position.y = pointArray[2] - .5 * cardWidth;
    }
    project.activeLayer.addChild(deck[pointArray[0]]);
  }
}
function getStartingPoint(location) {
  //return the x and y value (point obj) where the first card is to be placed (is the topLeft point in each instance and it lies on the edge of one canvas boundary )
  var topAndBottomStartOffset = (heightAvailable - exposedHandHeight) / 2;
  if (location.toLowerCase() === 'top') {
    exposedHandTopStartY = topAndBottomStartOffset;
    return {x: (canvasWidth / 2 - exposedHandWidth / 2), y: exposedHandTopStartY};
  }
  else if (location.toLowerCase() === 'bottom') {
    exposedHandBottomStartY = canvasHeight - topAndBottomStartOffset;
    return {x: (canvasWidth / 2 + exposedHandWidth / 2), y: exposedHandBottomStartY};
  }
  else if (location.toLowerCase() === 'left') {
    exposedHandLeftStartX = 0;
    if (enoughHeightToDisplay) {
      exposedHandLeftStartX = Math.abs(heightAvailable - exposedHandWidth) / 2;
    }
    return {x: exposedHandLeftStartX, y: bottomPlayArea.bounds.bottomLeft.y};
  }
  else if (location.toLowerCase() === 'right') {
    exposedHandRightStartX = canvasWidth;
    if (enoughHeightToDisplay) {
      exposedHandRightStartX = canvasWidth - Math.abs(heightAvailable - exposedHandWidth) / 2;
    }
    return {x: exposedHandRightStartX, y: bottomPlayArea.bounds.bottomRight.y};
  }
}
//#endregion
function getSpacingForHand(startPoint, endPoint, cardWidth) {
  var availableSpace = Math.abs(startPoint-endPoint);
  return (availableSpace - cardWidth) / 12;
}
function getDesiredWidthOfCard(startPoint, endPoint, returnHeight) {
  var cardWidthLocal = Math.abs(startPoint-endPoint) / 3;
  return returnHeight ? cardWidthLocal * 1.5 : cardWidthLocal;
}
//#region DisplayingHand
function displayHandAsLine() {
  var currentX = canvasWidth / 2;
  var currentY = canvasHeight;

  if (exposedHandLocation === 'bottom') currentY = 0;
  var desiredHeight = declarerUIHandScaleFactor * cardHeight;
  var desiredWidth = 2 / 3 * desiredHeight;
  handSpacing = desiredWidth * handWidthSpacingPercentOfCardWidth;
  var handWidthLocal = getHandWidth(hand.flatten(2).length, desiredWidth, handSpacing);
  var handLeftX = bottomPlayArea.position.x - handWidthLocal / 2;
  if (handLeftX + handWidthLocal > canvasWidth || handLeftX < 0) {
    currentX = (canvasWidth - handWidthLocal) / 2 
    currentY = canvasHeight - desiredHeight / 3.5;
    if (exposedHandLocation === 'bottom') currentY = desiredHeight / 6.5;
    placeCardsStartingAtPoint(hand, currentX, currentY, desiredHeight, desiredHeight / declarerUIHandScaleFactor, handSpacing, 0, drawDirections.toRight, orientationPoints.topLeft);
  }
  else {
    placeCardsCenteredAtPoint(hand, currentX, currentY, desiredHeight);
  }
  changePlayableCards();
}
function placeCardsCenteredAtPoint(handArray, centerX, centerY, desiredHeight) {
  var shouldWait = false;
  var flatHand = handArray.flatten(2);
  for (var i = 0; i < flatHand.length; i++) {
    var card = deck[flatHand[i]];
    if (card.bounds.height === 0) {
      shouldWait = true;
      break;
    }
  }

  if (isFirstTimeDisplayingExposedHand && shouldWait) {
    setTimeout(function () {
      placeCardsCenteredAtPoint(handArray, centerX, centerY, desiredHeight);
    }, checkCardLoadInterval);
  }
  else {
    isFirstTimeDisplayingExposedHand = false;
    positionCardsInHand(flatHand, centerX, centerY, desiredHeight);
  }
}
function positionCardsInHand(flatHand, centerX, centerY, desiredHeight) {
  if (!handSpacing) handSpacing = cardWidth * handWidthSpacingPercentOfCardWidth;
  var handWidthLocal = getHandWidth(flatHand.length);
  var currentX = centerX - handWidthLocal / 2 + cardWidth / 2;
  var currentY = centerY;
  if (isExposedBottom) flatHand.reverse();
  for (var i = 0; i < flatHand.length; i++) {
    var cardAsNumber = flatHand[i];
    var card = deck[cardAsNumber];
    card.scale(desiredHeight / card.bounds.height);
    declarerUiYOffset = card.bounds.height / declarerHandHeightFactor;
    card.position.x = currentX;
    card.position.y = currentY + declarerUiYOffset
    
    if (isExposedBottom) {
      card.position.y = currentY - declarerUiYOffset;
      project.activeLayer.insertChild(project.activeLayer.children.length - 1 - i, card);
    }
    else {
      project.activeLayer.addChild(card);
    }
    currentX += handSpacing;
  }
}
function getHandWidth(cardCount, cardWidthLocal, spacing) {
  spacing = (spacing == undefined) ? handSpacing : spacing;
  cardWidthLocal = (cardWidthLocal == undefined) ? cardWidth : cardWidthLocal;
  return (cardWidthLocal + ((cardCount - 1) * spacing));
}
function generateDeckFromImages(cardsToLoad) {
  cardsLoadedCount = 0;
  var newPosition = new Point(-1000,-1000);
  var newRotation = 0;
  for (var i = 0; i < cardValuesOrder.length; i++) {
    var cardAsString = capitalize(cardValuesOrder[i], " ");
    var imgSrc = 'imgs/cards/' + currentTheme + '/' + cardAsString + '.png';
    if (!currentTheme && colorThemeSources && preferences && preferences.colorTheme && colorThemeSources[preferences.colorTheme].imgSrc) imgSrc = colorThemeSources[preferences.colorTheme].imgSrc +cardAsString+'.png';
    var mobileImgSrc = 'imgs/cards/mobile/' + cardAsString + '.png';

    if (cardsToLoad) {
      imgSrc = 'imgs/cards/'+ cardsToLoad + '/' + cardAsString + '.png';
    }
    if (preferences && preferences.colorTheme) mobileImgSrc = 'imgs/cards/'+ preferences.colorTheme + '/mobile/' + cardAsString + '.png';
    var card = new Raster({
      source: isMobile ? mobileImgSrc : imgSrc,
      position: newPosition,
      rotation: newRotation,
    })
    if (shouldUseHeight) {
      var imgHeight = isMobile ? 350 : 540;
      imageScaleFactor = (cardHeightMaxPercent * canvasHeight / imgHeight);
      card.scale(imageScaleFactor);
    }
    else {
      var imgWidth =  isMobile ? 233 : 360;
      imageScaleFactor = (cardWidthPercentOfCavasWidth * canvasWidth / imgWidth);
      card.scale(imageScaleFactor);
    }
    card.name = cardAsString;
    card.rotation = 0;
    card.onMouseEnter = onMouseEnter;
    card.onMouseLeave = onMouseLeave;
    card.on('load', function () {
      cardsLoadedCount++;
    })
    deck.push(card);
  }
  if (cardsToLoad) {
    deck
  }

  //#region Remove PlayedCards From
  if (!playedCards) return;
  for (var i = 0; i < playedCards.length; i++) {
    var card = deck[playedCards[i]];
    if (card) card.remove();
  }
  //#endregion
}
function displayHandAsArc(cardsArray, x, y, rotationOffset) {
  //x and y specify the pivot point
  var rotationOffset = rotationOffset === undefined ? 1 : rotationOffset;
  var maxSpan = 90;
  if (numberOfPlayers < 4) {
    maxSpan = 150;
  }
  var degreeBetweenCards = maxSpan / numberOfCards;
  var previousRotation = -((numberOfCards / 2) * degreeBetweenCards + degreeBetweenCards * rotationOffset);
  // console.dir(cardsArray);

  for (var i = 0; i < numberOfCards; i++) {
    cardsArray[i].bounds.bottomLeft.x = x;
    cardsArray[i].bounds.bottomLeft.y = y;
    cardsArray[i].pivot = cardsArray[i].globalToLocal(cardsArray[i].bounds.bottomLeft);
    cardsArray[i].rotate(previousRotation);
    project.activeLayer.addChild(cardsArray[i]);
    previousRotation += degreeBetweenCards;
  }
}
//#endregion    
//#endregion
//#region Displaying PlayAreas
function displayCardPlayedAreas() {
  var scaleFactor = displayPlayAreas();
  displaySquareWithArrows(scaleFactor);
  drawTimerLabelBorders();
  project.activeLayer.addChild(playAreaAsPaperObj);
}
function displayPlayAreas() {
  var xPosition = canvasWidth / 2;
  var yPosition, scaleFactor = 1;
  if (isMobile) {
    yPosition = greenSpaceCenter;
    scaleFactor = exposedHandShrinkAmountMobile;
  }
  else {
    yPosition =  canvasHeight - (cardHeight * 2) - marginAmount;
    scaleFactor = playAreaShrinkFactor;
    var handCardHeight = cardHeight * declarerUIHandScaleFactor;
    yPosition = canvasHeight - handCardHeight / declarerHandHeightFactor - 2 * marginAmount - cardHeight * playAreaShrinkFactor;
    if (isExposedBottom) {
      yPosition = handCardHeight / declarerHandHeightFactor + 2.5 * marginAmount + cardHeight * playAreaShrinkFactor;
    } 
  }

  bottomPlayArea = displayPlayArea(xPosition, yPosition, 0, scaleFactor);
  topPlayArea = displayPlayArea(xPosition, yPosition, 180, scaleFactor);
  leftPlayArea = displayPlayArea(xPosition, yPosition, 90, scaleFactor);
  rightPlayArea = displayPlayArea(xPosition, yPosition, -90, scaleFactor);
  return scaleFactor;
}
function displaySquareWithArrows(scaleFactor) {
  var sizeAmount = isMobile ? smallCardHeight * 2 : cardHeight * 2;
  if (isMobile && isHighAspectRatio) {
    sizeAmount *= highAspectRatioScaleFactor;
  }
  if (scaleFactor && !isMobile) sizeAmount *= scaleFactor;

  playAreaSquare = new Path.Rectangle({
    point: [null, null],
    size: [sizeAmount, sizeAmount],
    fillColor: playAreaFillColor,
    strokeColor: playAreaStrokeColor,
    clockwise: true,
    closed: true,
    radius: 10,
  });

  playAreaSquare.bounds.center = bottomPlayArea.bounds.topCenter;
  arrowTop = getArrowPointPointingUpwards(topPlayArea.bounds.topCenter.x, topPlayArea.bounds.topCenter.y, cardWidth / 40, 90);
  arrowBottom = getArrowPointPointingUpwards(bottomPlayArea.bounds.bottomCenter.x , bottomPlayArea.bounds.bottomCenter.y, cardWidth / 40, -90);
  arrowLeft = getArrowPointPointingUpwards(leftPlayArea.bounds.leftCenter.x , leftPlayArea.bounds.leftCenter.y, cardWidth / 40, 0);
  arrowRight = getArrowPointPointingUpwards(rightPlayArea.bounds.rightCenter.x , rightPlayArea.bounds.rightCenter.y, cardWidth / 40, 180);

  playAreaAsPaperObj = new CompoundPath({
    children: [playAreaSquare, arrowBottom, arrowLeft, arrowRight, arrowTop], 
    fillColor: colorThemeValues && colorThemeValues['playAreaFillColor'] ? colorThemeValues['playAreaFillColor'] : playAreaFillColor,
    strokeColor: colorThemeValues && colorThemeValues['color'] ? colorThemeValues['color'] : playAreaStrokeColor,
    closed: true,
    clockwise: true,
    radius: 10,
  });
}
function getArrowPointPointingUpwards(centerX, centerY, length, rotation,  strokeColor) {
  var rotation = (rotation == undefined) ? 0 : rotation;
  var strokeColor = (strokeColor == undefined) ? 'black' : strokeColor;
  var arrowLeft = new Path.Line({
    from: [centerX , centerY],
    to: [centerX - length, centerY  + length],
  });

  var arrowRight = new Path.Line({
    from: [centerX , centerY],
    to: [centerX + length, centerY  + length],
  });

  var arrow = new CompoundPath({
    children: [arrowLeft, arrowRight],
    strokeColor: strokeColor,
    fillColor: 'black',
    clockwise: true,
    closed: true,
    rotation: rotation,
  });
  arrow.bounds.center.x = centerX;
  arrow.bounds.center.y = centerY;
  return arrow;
}
function displayPlayArea(x, y, rotation, scaleFactor, strokeWidth) {
  var sizeAmountX = scaleFactor ? cardWidth * scaleFactor : cardWidth
  var sizeAmountY = scaleFactor ? cardHeight * scaleFactor : cardHeight
  var centeringXAmount = isMobile ? smallCardWidth / 2 : cardWidth / 2;
  if(!isMobile) centeringXAmount *= playAreaShrinkFactor;
  if (isMobile && isHighAspectRatio) {
    sizeAmountX *= highAspectRatioScaleFactor;
    sizeAmountY *= highAspectRatioScaleFactor;
    centeringXAmount *= highAspectRatioScaleFactor;
  }

  var rect = new Path.Rectangle({
    point: [x - centeringXAmount, y],
    size: [sizeAmountX, sizeAmountY],
    fillColor: { hue: 120, saturation: 0, lightness: 1 },
    strokeColor: "black",
    strokeWidth: strokeWidth,
    clockwise: true,
    closed: true,
  });
  rect.rotate(rotation, rect.bounds.topCenter);
  rect.onMouseEnter = onMouseEnter;
  return rect;
}
//#endregion
//#region Displaying Hidden Card Methods
  function displayHiddenHands() {
    if (handLengths === undefined || handLengths === null) return;
    var leftCount = handLengths[getDirectionFromLocation(cardDisplayLocations.left)];
    var topCount = handLengths[getDirectionFromLocation(cardDisplayLocations.top)];
    var rightCount = handLengths[getDirectionFromLocation(cardDisplayLocations.right)];
    if (isMobile) {
      switch (exposedHandLocation) {
        case 'bottom':
          drawHiddenHand(leftCount, cardDisplayLocations.left);
          drawHiddenHand(rightCount, cardDisplayLocations.right);    
          break;
        case 'left':
          drawHiddenHand(topCount, cardDisplayLocations.top);
          drawHiddenHand(rightCount, cardDisplayLocations.right);
          break;
        case 'top':
          drawHiddenHand(leftCount, cardDisplayLocations.left);
          drawHiddenHand(rightCount, cardDisplayLocations.right);
          break;
        case 'right':
          drawHiddenHand(topCount, cardDisplayLocations.top);
          drawHiddenHand(leftCount, cardDisplayLocations.left);
          break;
      }
    }
    else {
      switch (exposedHandLocation) {
        case 'bottom':
          displayHiddenHandLeft(leftCount);
          displayHiddenHandRight(rightCount);
          break;
        case 'left':
          displayHiddenHandTop(topCount);
          displayHiddenHandRight(rightCount);
          break;
        case 'top':
          displayHiddenHandLeft(leftCount);
          displayHiddenHandRight(rightCount);
          break;
        case 'right':
          displayHiddenHandLeft(leftCount);
          displayHiddenHandTop(topCount);
          break;
      }
    }
  }
  function displayHiddenHandRight(rightCount) {
    drawHiddenHand(rightCount, cardDisplayLocations.right);
    var startPoint = topPlayArea.bounds.top;
    var endPoint = bottomPlayArea.bounds.bottom;
    var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
    var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
    x = rightPlayArea.bounds.right + marginAmount;
    placeCardsStartingAtPoint(hiddenCardsRight, x, startPoint, desiredHeight, cardHeight, desiredSpacing, -90, drawDirections.toBottom, orientationPoints.topLeft, false, true);
  }
  function displayHiddenHandTop(topCount) {
    drawHiddenHand(topCount, cardDisplayLocations.top);
    var y = topPlayArea.bounds.top - marginAmount;
    var startPoint = leftPlayArea.bounds.left;
    var endPoint = rightPlayArea.bounds.right;
    var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
    var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
    placeCardsStartingAtPoint(hiddenCardsTop, startPoint, y, desiredHeight, cardHeight, desiredSpacing, 0, drawDirections.toRight, orientationPoints.bottomLeft, false, true);
  }
  function displayHiddenHandLeft(leftCount) {
    drawHiddenHand(leftCount, cardDisplayLocations.left);
    var x = leftPlayArea.bounds.left - marginAmount;
    var startPoint = topPlayArea.bounds.top;
    var endPoint = bottomPlayArea.bounds.bottom;
    var desiredHeight = getDesiredWidthOfCard(startPoint, endPoint, true);
    var desiredSpacing = getSpacingForHand(startPoint, endPoint, desiredHeight * 2 / 3);
    placeCardsStartingAtPoint(hiddenCardsLeft, x, startPoint, desiredHeight, cardHeight, desiredSpacing, 90, drawDirections.toBottom, orientationPoints.topRight, false, true);
  }
  function getHiddenStartingPoint(cardCount, location) {
    lengthOfHiddenHand = cardWidth + ((cardCount - 1) * handSpacing);
    var centeringAmount = (2 * cardHeight - lengthOfHiddenHand) / 2;
    var sideY = canvasHeight - cardHeight - marginAmount - centeringAmount - cardHeight / 3;
    var topX = canvasWidth / 2 - cardWidth + centeringAmount;
    var bottomY = 3 * cardHeight + marginAmount - cardHeight / 3 - centeringAmount;
  
    if (location.toLowerCase() === cardDisplayLocations.top) {
        return {x: topX, y: canvasHeight - 3.5 * cardHeight - 2 * marginAmount};
    }
    else if (location.toLowerCase() === cardDisplayLocations.left) {
        return {x: canvasWidth / 2 - cardHeight - marginAmount - .5 * cardHeight, y: sideY};
    }
    else if (location.toLowerCase() === cardDisplayLocations.right) {
        return {x: canvasWidth / 2 + cardHeight + marginAmount  + .5 * cardHeight, y: sideY};
    }
    else if (location.toLowerCase() === cardDisplayLocations.bottomLeft) {
        return {x: canvasWidth / 2 - cardHeight - marginAmount  - .5 * cardHeight, y: bottomY};
    }
    else if (location.toLowerCase() === cardDisplayLocations.bottomRight) {
        return {x: canvasWidth / 2 + cardHeight + marginAmount  + .5 * cardHeight, y: bottomY};
    }
  }
  function drawHiddenHand(cardCount, location) {
    if (isExposedBottom) {
      if (location.toLowerCase() === cardDisplayLocations.left) location = cardDisplayLocations.bottomLeft;
      else if (location.toLowerCase() === cardDisplayLocations.right) location = cardDisplayLocations.bottomRight;
    }
    removeHiddenCards(location); 
    if (cardCount === 0) return;
    createHiddenCards(cardCount, location);
  }
  function createHiddenCards(cardCount, location){
    var hiddenCards = [];
    var startingPoint = isMobile ? getHiddenStartingPointMobile(cardCount, location) : getHiddenStartingPoint(cardCount, location);
    for (var i = 0; i < cardCount; i++) {
      var card = new Raster('cardBack');
      card.position = new Point(-1000, -1000);
      if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.right || location.toLowerCase() === cardDisplayLocations.bottomLeft || location.toLowerCase() === cardDisplayLocations.bottomRight)  card.rotate(90);
      card.scale(isMobile ? (smallCardHeight / card.size.height) : (cardHeight / card.size.height));
      card.name = null;
      if (startingPoint.x && startingPoint.y) hiddenCards.push([card, startingPoint.x, startingPoint.y]);
      if (isMobile) {
        if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.right || location.toLowerCase() === cardDisplayLocations.bottomLeft || location.toLowerCase() === cardDisplayLocations.bottomRight) startingPoint.y += widthFactorLeftRightMobile;
        if (location.toLowerCase() === 'top') startingPoint.x += widthFactorLeftRightMobile;
      }
      else {
        if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.right || location.toLowerCase() === cardDisplayLocations.bottomLeft || location.toLowerCase() === cardDisplayLocations.bottomRight) startingPoint.y -= handSpacing;
        if (location.toLowerCase() === 'top') startingPoint.x += handSpacing;
      }
      populateHiddenCardsArray(card, location);
    }
    for (var i = 0; i < hiddenCards.length; i++) {
      var card = hiddenCards[i];
      card[0].position = new Point(card[1], card[2]);
      project.activeLayer.addChild(card[0]);   
    }
  }
  function populateHiddenCardsArray(card, location){
    if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.bottomLeft) hiddenCardsLeft.push(card);
    else if (location.toLowerCase() === cardDisplayLocations.right || location.toLowerCase() === cardDisplayLocations.bottomRight) hiddenCardsRight.push(card);
    else if (location.toLowerCase() === cardDisplayLocations.top) hiddenCardsTop.push(card);
  }
  function removeHiddenCards(location) {
    var hiddenCardsToRemove = [];
    if (location.toLowerCase() === cardDisplayLocations.top) {
      hiddenCardsToRemove = hiddenCardsTop;
    }
    else if (location.toLowerCase() === cardDisplayLocations.right || location.toLowerCase() === cardDisplayLocations.bottomRight) {
      hiddenCardsToRemove = hiddenCardsRight;
    }
    else if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.bottomLeft) {
      hiddenCardsToRemove = hiddenCardsLeft;
    }
  
    if (hiddenCardsToRemove && hiddenCardsToRemove.length > 0) {
      for (var i = 0; i < hiddenCardsToRemove.length; i++) {
        var hiddenCard = hiddenCardsToRemove[i];
        if (hiddenCard && hiddenCard.position) {
          hiddenCard.remove();
          hiddenCard.position.x = -1000;
        } 
      }
    }

    if (location.toLowerCase() === cardDisplayLocations.top) hiddenCardsTop = [];
    if (location.toLowerCase() === cardDisplayLocations.bottom) hiddenCardsBottom = [];
    if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.bottomLeft) hiddenCardsLeft = [];
    if (location.toLowerCase() === cardDisplayLocations.right || location.toLowerCase() === cardDisplayLocations.bottomRight) hiddenCardsRight = [];
  }
  //#endregion
//#region Drawing Text
function getTextsDimensions() {
  var numberOfRowsLeftSide = 5;
  textsToWrite = [
    //#region Player Labels
      {
        content: "Player 3",
        x: canvasWidth / 2,
        y: exposedHandLocation === cardDisplayLocations.bottom ? (3 * cardHeight + 1.5 * marginAmount): canvasHeight - cardHeight - .5 * marginAmount,
        mobileX: canvasWidth / 2,
        mobileY: greenSpaceCenter + smallCardHeight + marginAmountMobileInside,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? DEFAULT_FONT_SIZE : marginAmountMobileInside,
        fillColor: "black",
        name: 'bottomPlayer',
        justification: 'center',
      },
      {
        content: "Player 1",
        x: canvasWidth / 2,
        y: exposedHandLocation === cardDisplayLocations.bottom ? (cardHeight + .5 * marginAmount): canvasHeight - 3 * cardHeight - 1.5 * marginAmount,
        mobileX: canvasWidth / 2,
        mobileY: greenSpaceCenter - smallCardHeight - marginAmountMobileInside,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? DEFAULT_FONT_SIZE : marginAmountMobileInside,
        fillColor: "black",
        name: 'topPlayer',
        justification: 'center',
      },
      {
        content: "Player 4",
        x: canvasWidth / 2 - cardHeight - marginAmount / 2,
        y: exposedHandLocation === cardDisplayLocations.bottom ? (2 * cardHeight + marginAmount): canvasHeight - 2 * cardHeight - 1 * marginAmount,
        mobileX: canvasWidth / 2 - smallCardHeight - marginAmountMobileInside,
        mobileY: greenSpaceCenter,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? DEFAULT_FONT_SIZE : marginAmountMobileInside,
        fillColor: "black",
        name: 'leftPlayer',
        justification: 'center',
        rotation: 90,
      },
      {
        content: "Player 2",
        x: canvasWidth / 2 + cardHeight + marginAmount / 2,
        y: exposedHandLocation === cardDisplayLocations.bottom ? (2 * cardHeight + marginAmount): canvasHeight - 2 * cardHeight - 1 * marginAmount,
        mobileX: canvasWidth / 2 + smallCardHeight + marginAmountMobileInside,
        mobileY: greenSpaceCenter,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? DEFAULT_FONT_SIZE : marginAmountMobileInside,
        fillColor: "black",
        name: 'rightPlayer',
        justification: 'center',
        rotation: -90,
      },
    //#endregion
    //#region Deal Info Labels
      //#region Play Instructions
        {
          content: "Drag and Drop",
          bottomContent: "Sit tight ",
          x: canvasWidth / 2,
          y: exposedHandLocation === cardDisplayLocations.bottom ? 2 * cardHeight + marginAmount / 2: canvasHeight - 2 * cardHeight - 1.5 * marginAmount,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: 20,
          fillColor: "black",
          name: 'instructionsOne',
          justification: 'center',
        },
        {
          content: "a Card Here",
          bottomContent: "",
          x: canvasWidth / 2,
          y: exposedHandLocation === cardDisplayLocations.bottom ? (2 * cardHeight + 1.5 * marginAmount): canvasHeight - 2 * cardHeight - 0.5 * marginAmount,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: 20,
          fillColor: "black",
          name: 'instructionsTwo',
          justification: 'center',
        },
        {
          content: "to Play it",
          bottomContent: "and Observe",
          x: canvasWidth / 2,
          y: exposedHandLocation === cardDisplayLocations.bottom ? (2 * cardHeight + 2.5 * marginAmount): canvasHeight - 2 * cardHeight + .5 * marginAmount,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: 20,
          fillColor: "black",
          name: 'instructionsThree',
          justification: 'center',
        },
      //#endregion
      //#region Tricks
        {
          content: "Tricks to Set:",
          x: -1000,
          y: -1000,
          fontWeight: "500",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'tricksNeededLabel',
          justification: 'center',
        },
        {
          content: tricksNeeded,
          x: -1000,
          y: -1000,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'tricksNeeded',
          justification: 'center',
        },
        {
          content: "/",
          x: -1000,
          y: -1000,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'tricksNeededDivider',
          justification: 'center',
        },
        {
          content: "13",
          x: -1000,
          y: -1000,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'tricksNeededTotal',
          justification: 'center',
        },
        {
          content: "Tricks Left:",
          x: -1000,
          y: -1000,
          fontWeight: "500",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'trickNumberLabel',
          justification: 'center',
        },
        {
          content: "0",
          x: -1000,
          y: -1000,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'trickNumber',
          justification: 'center',
        },
      //#endregion
      //#region Contract
        {
          content: "Contract:",
          x: -1000,
          y: -1000,
          fontWeight: "500",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'contractLabel',
          justification: 'center',
        },
        {
          content: contract,
          x: -1000,
          y: -1000,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'contract',
          justification: 'center',
        },
      //#endregion
      //#region Doubled
        {
          content: "",
          x: -1000,
          y: -1000,
          fontWeight: "500",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'doubledLabel',
          justification: 'center',
        },
      //#endregion
      //#region Declarer
        {
          content: "Vulnerable:",
          x: -1000,
          y: -1000,
          fontWeight: "500",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'vulnerableLabel',
          justification: 'center',
        },
        {
          content: "No",
          x: -1000,
          y:0,
          fontWeight: "bold",
          fontFamily: DEFAULT_FONT_FAMILY,
          fontSize: DEFAULT_FONT_SIZE,
          fillColor: "black",
          name: 'isVulnerable',
          justification: 'center',
        },
      //#endregion
      //#region Last Trick Played
      {
        content: "Last Trick:",
        x: -1000,
        y: -100,
        fontWeight: "500",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickLabel',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickOne',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickOneImg',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastRoundStartPlayer',
        justification: 'center',
      },
      
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickTwo',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickTwoImg',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickThree',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickThreeImg',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickFour',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y: -100,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'lastTrickFourImg',
        justification: 'center',
      },
    //#endregion
    //#endregion
    //#region Game Info Labels
      //#region Header Labels
      {
        content: "We:",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'weHeaderLabel',
        justification: 'center',
      },
      {
        content: "They:",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'theyHeaderLabel',
        justification: 'center',
      },
      //#endregion
      //#region Above the Line Labels
      {
        content: "Above",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'aboveLineLabelWe',
        justification: 'center',
      },
      {
        content: "Above",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'aboveLineLabelThey',
        justification: 'center',
      },
      //#endregion
      //#region First Game Labels
      {
        content: "Below",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'firstGameLabelWe',
        justification: 'center',
      },
      {
        content: "Below",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'firstGameLabelThey',
        justification: 'center',
      },
      //#endregion
      //#region Second Game Labels
      {
        content: "",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'secondGameLabelWe',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'secondGameLabelThey',
        justification: 'center',
      },
      //#endregion
      //#region Third Game Labels
      {
        content: "",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'thirdGameLabelWe',
        justification: 'center',
      },
      {
        content: "",
        x: -1000,
        y:0,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: DEFAULT_FONT_SIZE,
        fillColor: "black",
        name: 'thirdGameLabelThey',
        justification: 'center',
      //#endregion
      },
      //#endregion
    //#region Timer Locations
      {
        content: "",
        x: bottomPlayArea.position.x - cardWidth * 3 / 4,
        y: bottomPlayArea.position.y + cardHeight / 8,
        mobileX: bottomPlayArea.position.x - cardWidth * 3 / 4,
        mobileY: bottomPlayArea.position.y + cardHeight / 8,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? smallCardHeight / 2.66 : cardHeight / 2.66,
        fillColor: "black",
        name: 'timerDurationBottomLeft',
        justification: 'center',
      },
      {
        content: "",
        x: bottomPlayArea.position.x + cardWidth * 3 / 4,
        y: bottomPlayArea.position.y + cardHeight / 6,
        mobileX: bottomPlayArea.position.x - cardWidth * 3 / 4,
        mobileY: bottomPlayArea.position.y + cardHeight / 8,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? smallCardHeight / 2.66 : cardHeight / 2.66,
        fillColor: "black",
        name: 'timerDurationBottomRight',
        justification: 'center',
      },
      {
        content: "",
        x: topPlayArea.position.x - cardWidth * 3 / 4,
        y: topPlayArea.position.y - cardHeight / 10,
        mobileX: bottomPlayArea.position.x - cardWidth * 3 / 4,
        mobileY: bottomPlayArea.position.y + cardHeight / 8,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? smallCardHeight / 2.66 : cardHeight / 2.66,
        fillColor: "black",
        name: 'timerDurationTopLeft',
        justification: 'center',
      },
      {
        content: "",
        x: topPlayArea.position.x + cardWidth * 3 / 4,
        y: topPlayArea.position.y - cardHeight / 12,
        mobileX: bottomPlayArea.position.x - cardWidth * 3 / 4,
        mobileY: bottomPlayArea.position.y + cardHeight / 8,
        fontWeight: "bold",
        fontFamily: DEFAULT_FONT_FAMILY,
        fontSize: isMobile ? smallCardHeight / 2.66 : cardHeight / 2.66,
        fillColor: "black",
        name: 'timerDurationTopRight',
        justification: 'center',
      },
    //#endregion
  ];
}
function printAllTexts() {
  getTextsDimensions();
  for (var textToWrite in textsToWrite) {
    if (textsToWrite.hasOwnProperty(textToWrite)) {
      var textObj = textsToWrite[textToWrite];
      writeText(textObj);
    }
  }
  setTeamLabelsFromSeating();
  if (isMobile) {
    setLastTrick();
    changeTrickLabels()
    layoutDealLabels();
    layoutGameLabels();
  }
  if (shouldDrawInstructions || isExposedBottom) {
    layoutInstructionLabels();
  }
  else {
    resetInstructions();
  }
}
function writeText(textObj) {
  var text = new PointText(new Point(30, 30));
  //setting the instructions depending on exposedHandlocation
  if (exposedHandLocation.toLowerCase() !== cardDisplayLocations.bottom || !textObj.name.match(/instructions/i)) {
    text.content = textObj.content;
  }
  else {
    text.content = textObj.bottomContent;
  }
  text.fillColor = colorThemeValues['instructionsColor'] ? colorThemeValues['instructionsColor'] : textObj.fillColor;
  text.fontSize = textObj.fontSize;
  text.fontFamily = textObj.fontFamily;
  text.fontWeight = textObj.fontWeight;
  if (isMobile) {
    if (textObj.mobileX) {
      text.position = new Point(textObj.mobileX, textObj.mobileY);
    }
    else {
      text.position = new Point (10,10);
    }
  }
  else {
    text.position.x = textObj.x;
    text.position.y = textObj.y;
  }
  var number = 0;
  if (isMobile) {
    if (textObj.name === 'contract' &&  !textObj.content.match(/trump/i)) {
      number = convertNumStringToInt(textObj.content.split(' ')[0]);
      text.content = number;
      if (textObj.content.match(/club/i)) {
        contractRaster = new Raster('club');
        contractRaster.scale(.83);
      }
      else if (textObj.content.match(/diamond/i)) {
        contractRaster = new Raster('diamond');
        contractRaster.scale(.87);
      }
      else if (textObj.content.match(/heart/i)) {
        contractRaster = new Raster('heart');
        contractRaster.scale(.83);
      }
      else if (textObj.content.match(/spade/i)) {
        contractRaster = new Raster('spade');
        contractRaster.scale(.83);
      }
      contractRaster.scale(suitScaleFactor * DEFAULT_FONT_SIZE);
      contractRaster.smoothing = true;
    }
    else if (textObj.name === 'contract' && textObj.content.match(/trump/i)) {
      number = convertNumStringToInt(textObj.content.split(' ')[0]);
      text.content = number + "NT";
      var newRaster = new Raster('spade');
      contractRaster =  newRaster.scale(0);
    }
  }
  if (textObj.rotation) text.rotate(textObj.rotation);
  texts[textObj.name] = text;
}
function drawBorders() {
  var dealInformationSizeX, dealInformationSizeY, dealInformationLocation, gameInformationSize, gameInformationLocation, gameInformationHeaderStart, gameInformationHeaderEnd, gameInformationHeaderHeight;
  var gameInformationTopLeftPointX, gameInformationTopLeftPointY, gameInformationTopRightPointX;
  var gameInformationHalfWayX;
  var gameInformationDividerStart, gameInformationDividerEnd;
  var gameInformationHorizontalDividerSpacing;
  if (isMobile) {
    //#region Game and Deal Info
    var dealInformationLocationX = isExposedLeft && isExposedRight ? leftPlayArea.bounds.left : 0,  dealInformationSizeX = canvasWidth;
    var dealInformationLocationY = greenSpaceCenter + smallCardHeight + 2 * marginAmountMobileInside;
    var playAreaHeight = Math.abs(rightPlayArea.bounds.right - leftPlayArea.bounds.left);
    dealInformationSizeY = canvasHeight - dealInformationLocationY - heightTakenUpByBottomHand - .5 * marginAmountMobileInside;
    if (isExposedLeft || isExposedRight) {
      dealInformationLocationX = leftPlayArea.bounds.left;
      dealInformationSizeX = playAreaHeight;
    }

    dealInformationLocation = [dealInformationLocationX, dealInformationLocationY];
    dealInformationSize = [dealInformationSizeX, dealInformationSizeY] ;
   
    gameInformationLocation = [leftPlayArea.bounds.left, heightTakenUpByTopHand + .5 * marginAmountMobileInside];
    gameInformationSize = [playAreaHeight, (greenSpaceCenter - (smallCardHeight) - 2 * marginAmountMobileInside) - gameInformationLocation[1]];

    dealInformationLeftHalf = new Path.Rectangle({
      point: [dealInformationLocationX, dealInformationLocationY],
      size: [dealInformationSizeX / 2, dealInformationSize[1]],
      strokeColor: bordersStrokeColor,
      fillColor: bordersFillColor,
      radius: borderRadius,
    });
    dealInformationRightHalf = new Path.Rectangle({
      point: [dealInformationSizeX / 2 + dealInformationLocationX, dealInformationLocationY],
      size: [dealInformationSizeX / 2, dealInformationSize[1]],
      strokeColor: bordersStrokeColor,
      fillColor: bordersFillColor,
      radius: borderRadius,
    });
    // gameInformationLeftHalf = new Path.Rectangle({
    //   point: [gameInformationLocation[0], gameInformationLocation[1]],
    //   size: [gameInformationSize[0] / 2, gameInformationSize[1]],
    //   strokeColor: bordersStrokeColor,
    //   fillColor: bordersFillColor,
    //   radius: borderRadius,
    // });

    // gameInformationRightHalf = new Path.Rectangle({
    //   point: [gameInformationSize[0] / 2, gameInformationLocation[1]],
    //   size: [gameInformationSize[0] / 2, gameInformationSize[1]],
    //   strokeColor: bordersStrokeColor,
    //   fillColor: bordersFillColor,
    //   radius: borderRadius,
    // });
    //#endregion
    //#region Game Info Scoring STuff
    gameInformationTopLeftPointX = leftPlayArea.bounds.left;
    gameInformationTopRightPointX = rightPlayArea.bounds.right;
    gameInformationTopLeftPointY =  gameInformationLocation[1];
    gameInformationHeaderHeight = 1 / 8 * smallCardHeight
    gameInformationHorizontalDividerSpacing = (gameInformationSize[1] - gameInformationHeaderHeight) / 4 ;

    gameInformationHalfWayX = (gameInformationTopRightPointX - gameInformationTopLeftPointX) / 2;
    gameInformationDividerPointX = gameInformationHalfWayX + gameInformationTopLeftPointX;
    gameInformationDividerEnd = [gameInformationDividerPointX , gameInformationLocation[1] + gameInformationSize[1]];
    
    gameInformationDividerStart = [gameInformationDividerPointX, gameInformationTopLeftPointY],
    gameInformationHeaderStart = [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight],
    gameInformationHeaderEnd = [gameInformationTopRightPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight];
    //#endregion
    project.activeLayer.insertChild(0, gameInformationRightHalf);
    project.activeLayer.insertChild(0, gameInformationLeftHalf);
    project.activeLayer.insertChild(0, dealInformationRightHalf);
    project.activeLayer.insertChild(0, dealInformationLeftHalf);
  }
  dealInformation = new Path.Rectangle({
    size: [dealInformationSizeX, dealInformationSizeY],
    point: dealInformationLocation,
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: borderRadius,
  });
  //#region Game Information Stuff
  //#region Creating Containers
  gameInformationWeHeader = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHeaderHeight],
    point: [gameInformationTopLeftPointX, gameInformationTopLeftPointY],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationTheyHeader = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHeaderHeight],
    point: [gameInformationTopLeftPointX + gameInformationHalfWayX, gameInformationTopLeftPointY],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationAboveLineWe = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationAboveLineThey = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX + gameInformationHalfWayX, gameInformationTopLeftPointY + gameInformationHeaderHeight],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationFirstGameWe = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + gameInformationHorizontalDividerSpacing],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationFirstGameThey = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX + gameInformationHalfWayX, gameInformationTopLeftPointY + gameInformationHeaderHeight + gameInformationHorizontalDividerSpacing],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationSecondGameWe = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 2 * gameInformationHorizontalDividerSpacing],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationSecondGameThey = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX + gameInformationHalfWayX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 2 * gameInformationHorizontalDividerSpacing],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationThirdGameWe = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 3 * gameInformationHorizontalDividerSpacing],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformationThirdGameThey = new Path.Rectangle({
    size: [gameInformationHalfWayX, gameInformationHorizontalDividerSpacing],
    point: [gameInformationTopLeftPointX + gameInformationHalfWayX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 3 * gameInformationHorizontalDividerSpacing],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: 100,
  });
  gameInformation = new Path.Rectangle({
    size: gameInformationSize,
    point: gameInformationLocation,
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
    radius: borderRadius,
  });
  //#endregion
  //#region Divider Lines
  gameInformationDividerLine = new Path.Line({
    from: gameInformationDividerStart,
    to: gameInformationDividerEnd,
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
  });
  // var gameInformationHeaderLine = new Path.Line({
  //   from: gameInformationHeaderStart,
  //   to: gameInformationHeaderEnd,
  //   strokeColor: bordersStrokeColor,
  //   fillColor: bordersFillColor,
  //   dashArray: [10, 4],
  // });
  gameInformationHorizontalDividerLineGameOneStart = new Path.Line({
    from: [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + gameInformationHorizontalDividerSpacing],
    to: [gameInformationTopRightPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + gameInformationHorizontalDividerSpacing],
    strokeColor: bordersStrokeColor,
    fillColor: bordersFillColor,
  });
  if (scoring.northSouth.isVulnerable === true || scoring.eastWest.isVulnerable === true) {
    gameInformationHorizontalDividerLineGameTwoStart = new Path.Line({
      from: [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 2 * gameInformationHorizontalDividerSpacing],
      to: [gameInformationTopRightPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 2 * gameInformationHorizontalDividerSpacing],
      strokeColor: bordersStrokeColor,
      fillColor: bordersFillColor,
    });
  }
  if (scoring.northSouth.isVulnerable === true && scoring.eastWest.isVulnerable === true) {
    gameInformationHorizontalDividerLineGameThreeStart = new Path.Line({
      from: [gameInformationTopLeftPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 3 * gameInformationHorizontalDividerSpacing],
      to: [gameInformationTopRightPointX, gameInformationTopLeftPointY + gameInformationHeaderHeight + 3 * gameInformationHorizontalDividerSpacing],
      strokeColor: bordersStrokeColor,
      fillColor: bordersFillColor,
    });
  }
  //#endregion
  //#endregion
  //#region Relayering
  project.activeLayer.insertChild(4, dealInformation);
  project.activeLayer.insertChild(4, gameInformation);
  project.activeLayer.insertChild(4, gameInformationWeHeader);
  project.activeLayer.insertChild(4, gameInformationTheyHeader);
  project.activeLayer.insertChild(4, gameInformationAboveLineWe);
  project.activeLayer.insertChild(4, gameInformationAboveLineThey);
  project.activeLayer.insertChild(4, gameInformationFirstGameWe);
  project.activeLayer.insertChild(4, gameInformationFirstGameThey);
  project.activeLayer.insertChild(4, gameInformationSecondGameWe);
  project.activeLayer.insertChild(4, gameInformationSecondGameThey);
  project.activeLayer.insertChild(4, gameInformationThirdGameWe);
  project.activeLayer.insertChild(4, gameInformationThirdGameThey); 
  //#endregion
}
function drawTimerLabelBorders() {
  //#region Setup
  var playAreaTimerSize = isMobile ? smallCardHeight - smallCardWidth / 2 : cardHeight * playAreaShrinkFactor - cardWidth * playAreaShrinkFactor / 2;
  var leftXPoint = isMobile ? topPlayArea.position.x - smallCardHeight : topPlayArea.position.x - cardHeight * playAreaShrinkFactor;
  var rightXPoint = isMobile ? topPlayArea.position.x + smallCardWidth / 2 : topPlayArea.position.x + cardWidth  * playAreaShrinkFactor / 2
  var topYPoint = isMobile ? leftPlayArea.position.y - smallCardHeight : leftPlayArea.position.y - cardHeight * playAreaShrinkFactor;
  var bottomYPoint = isMobile ? leftPlayArea.position.y + smallCardWidth / 2 : leftPlayArea.position.y + cardWidth * playAreaShrinkFactor / 2;
  var playAreaCenterXSize = isMobile ? smallCardHeight * 2 : cardHeight * playAreaShrinkFactor * 2;
  var playAreaCenterYSize = isMobile ? smallCardWidth : cardWidth * playAreaShrinkFactor;
  var leftYPoint = isMobile ? topPlayArea.position.y + smallCardHeight / 2 - smallCardWidth / 2 : topPlayArea.position.y + cardHeight * playAreaShrinkFactor / 2 - cardWidth * playAreaShrinkFactor / 2;
  //#endregion
  //#region Setting Layout for High Aspect Ratio Devices
  if (isHighAspectRatio && isMobile) {
    playAreaCenterXSize *= highAspectRatioScaleFactor;
    playAreaCenterYSize *= highAspectRatioScaleFactor;
    playAreaTimerSize *= highAspectRatioScaleFactor;
    leftXPoint = topPlayArea.position.x - (smallCardHeight * highAspectRatioScaleFactor);
    rightXPoint = topPlayArea.position.x + (smallCardWidth / 2 * highAspectRatioScaleFactor);
    topYPoint = leftPlayArea.position.y - (smallCardHeight  * highAspectRatioScaleFactor);
    bottomYPoint = leftPlayArea.position.y + (smallCardWidth / 2  * highAspectRatioScaleFactor);
    leftYPoint = topPlayArea.position.y + (smallCardHeight / 2 * highAspectRatioScaleFactor) - (smallCardWidth / 2 * highAspectRatioScaleFactor);
  }
  //#endregion
  //#region Creating Borders
  playAreaCenter = new Path.Rectangle({
    size: [playAreaCenterXSize, playAreaCenterYSize],
    point: [leftXPoint, leftYPoint],
    strokeColor: 'none',
    fillColor: 'none',
    radius: borderRadius,
  });

  playAreaTopLeft = new Path.Rectangle({
    size: [playAreaTimerSize, playAreaTimerSize],
    point: [leftXPoint, topYPoint],
    strokeColor: 'none',
    fillColor: 'none',
    radius: borderRadius,
  });

  playAreaTopRight = new Path.Rectangle({
    size: [playAreaTimerSize, playAreaTimerSize],
    point: [rightXPoint, topYPoint],
    strokeColor: 'none',
    fillColor: 'none',
    radius: borderRadius,
  });

  playAreaBottomLeft = new Path.Rectangle({
    size: [playAreaTimerSize, playAreaTimerSize],
    point: [leftXPoint, bottomYPoint],
    strokeColor: 'none',
    fillColor: 'none',
    radius: borderRadius,
  });

  playAreaBottomRight = new Path.Rectangle({
    size: [playAreaTimerSize, playAreaTimerSize],
    point: [rightXPoint, bottomYPoint],
    strokeColor: 'none',
    fillColor: 'none',
    radius: borderRadius,
  });
  //#endregion
}
function layoutInstructionLabels() {
  var instructionsFontSize = canvasWidth > 1000 ? DEFAULT_FONT_SIZE * .8: canvasWidth > 873 ? DEFAULT_FONT_SIZE  * 1.2 : canvasWidth > 600 ? DEFAULT_FONT_SIZE  * 1.5 : 1.66 * DEFAULT_FONT_SIZE;
  var instructionRows = [
    [texts.instructionsOne],
    [texts.instructionsTwo], 
    [texts.instructionsThree], 
  ]
  var ratioToUse = getMaxFontSizeRatio(playAreaCenter, instructionRows, instructionsFontSize);
  applyFontSize(instructionRows, ratioToUse);
  centerColumns(playAreaCenter, instructionRows, instructionsFontSize, ratioToUse)
  justifyRow(playAreaCenter, [[texts.instructionsOne]], instructionsFontSize);
  justifyRow(playAreaCenter, [[texts.instructionsTwo]], instructionsFontSize);
  justifyRow(playAreaCenter, [[texts.instructionsThree]], instructionsFontSize);

  var colorToUse = colorThemeValues && colorThemeValues['instructionsColor'] ? colorThemeValues['instructionsColor'] : instructionsColor;
  
  texts.instructionsOne.fillColor = colorToUse;
  texts.instructionsTwo.fillColor = colorToUse;
  texts.instructionsThree.fillColor = colorToUse;
}
function layoutDealLabels(){
  textsContractRow = [[texts.contractLabel, [texts.contract, contractRaster], texts.doubledLabel]];
  textsDeclarerRow = [[texts.vulnerableLabel, texts.isVulnerable]];
  textsTricksNeededRow = [[texts.tricksNeededLabel, [texts.tricksNeeded, texts.tricksNeededDivider, texts.tricksNeededTotal]]];
  textsTrickNumberRow = [[texts.trickNumberLabel, texts.trickNumber]];
  textsLastTrickRow = [[[texts.lastTrickOne, lastTrickOneImg, texts.lastRoundStartPlayer]], [[texts.lastTrickTwo, lastTrickTwoImg]], [[texts.lastTrickThree, lastTrickThreeImg]], [[texts.lastTrickFour, lastTrickFourImg]]];
  
  var dealInformationRows = [
    [texts.contractLabel, texts.contract, contractRaster, texts.doubledLabel], 
    [texts.vulnerableLabel, texts.isVulnerable], 
    [texts.trickNumberLabel, texts.trickNumber],
    [texts.tricksNeededLabel, texts.tricksNeeded, texts.tricksNeededDivider, texts.tricksNeededTotal],
    [texts.lastTrickLabel],
    [texts.lastTrickOne, lastTrickOneImg, texts.lastRoundStartPlayer, texts.lastTrickTwo, lastTrickTwoImg, texts.lastTrickThree, lastTrickThreeImg, texts.lastTrickFour, lastTrickFourImg],
  ];

  if (isMobile) {
    if (isExposedTop || isExposedBottom) {
      var dealInformationLeftSideRows = [
        [texts.contractLabel, texts.contract, contractRaster, texts.doubledLabel], 
        [texts.tricksNeededLabel, texts.tricksNeeded, texts.tricksNeededDivider, texts.tricksNeededTotal],
        [texts.trickNumberLabel, texts.trickNumber],
      ];
      var dealInformationRightSideRows = [
        [texts.vulnerableLabel, texts.isVulnerable], 
        [texts.lastTrickLabel],
        [texts.lastTrickOne, lastTrickOneImg, texts.lastRoundStartPlayer, texts.lastTrickTwo, lastTrickTwoImg, texts.lastTrickThree, lastTrickThreeImg, texts.lastTrickFour, lastTrickFourImg],
      ]
      //#region 2 columns of 2 rows for offense
      justifyRow(dealInformationLeftHalf, textsContractRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationLeftHalf, textsTrickNumberRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationLeftHalf, textsTricksNeededRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationRightHalf, textsDeclarerRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationRightHalf, [[texts.lastTrickLabel]], DEFAULT_FONT_SIZE);
      justifyRow(dealInformationRightHalf, textsLastTrickRow, DEFAULT_FONT_SIZE, ',', 'center', 0);
      
      var leftRatio = getMaxFontSizeRatio(dealInformationLeftHalf, dealInformationLeftSideRows, DEFAULT_FONT_SIZE);
      var rightRatio = getMaxFontSizeRatio(dealInformationRightHalf, dealInformationRightSideRows, DEFAULT_FONT_SIZE);
      var ratioToUse = leftRatio < rightRatio ? leftRatio : rightRatio;
      applyFontSize(dealInformationLeftSideRows.concat(dealInformationRightSideRows), ratioToUse);
      centerColumns(dealInformationLeftHalf, dealInformationLeftSideRows, DEFAULT_FONT_SIZE, ratioToUse);
      centerColumns(dealInformationRightHalf, dealInformationRightSideRows, DEFAULT_FONT_SIZE, ratioToUse);
      
      justifyRow(dealInformationLeftHalf, textsContractRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationLeftHalf, textsTrickNumberRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationLeftHalf, textsTricksNeededRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationRightHalf, textsDeclarerRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformationRightHalf, [[texts.lastTrickLabel]], DEFAULT_FONT_SIZE);
      justifyRow(dealInformationRightHalf, textsLastTrickRow, DEFAULT_FONT_SIZE, ',', 'center', 0);
      // #endregion
    }
    else {
      //#region Use this section for 4 rows for defense
      justifyRow(dealInformation, textsContractRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsTrickNumberRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsTricksNeededRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsDeclarerRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, [[texts.lastTrickLabel]], DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsLastTrickRow, DEFAULT_FONT_SIZE, ',', 'center', 0);

      var ratioToUse = getMaxFontSizeRatio(dealInformation, dealInformationRows, DEFAULT_FONT_SIZE);
      applyFontSize(dealInformationRows, ratioToUse);
      centerColumns(dealInformation, dealInformationRows, DEFAULT_FONT_SIZE, ratioToUse);

      justifyRow(dealInformation, textsTrickNumberRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsContractRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsTricksNeededRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsDeclarerRow, DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, [[texts.lastTrickLabel]], DEFAULT_FONT_SIZE);
      justifyRow(dealInformation, textsLastTrickRow, DEFAULT_FONT_SIZE, ',', 'center', 0);
      //#endregion
    }
  }
}
function layoutGameLabels(){
  //#region Initialization of Variables
  var weLabel = [[texts.weHeaderLabel]];
  var theyLabel = [[texts.theyHeaderLabel]]
  var aboveLineLabelWe = [[texts.aboveLineLabelWe]]
  var aboveLineLabelThey = [[texts.aboveLineLabelThey]]
  var firstGameLabelWe = [[texts.firstGameLabelWe]]
  var firstGameLabelThey = [[texts.firstGameLabelThey]]
  var secondGameLabelWe = [[texts.secondGameLabelWe]]
  var secondGameLabelThey = [[texts.secondGameLabelThey]]
  var thirdGameLabelWe = [[texts.thirdGameLabelWe]]
  var thirdGameLabelThey = [[texts.thirdGameLabelThey]]
  //#endregion

  //#region Get all of the ratioToUses and pick the smallest one to use (Headers Just use the right header ratio)
  var ratioToUseHeaderRight = getMaxFontSizeRatio(gameInformationTheyHeader, theyLabel, DEFAULT_FONT_SIZE);
  var ratioToUseAboveLineLabelWe = getMaxFontSizeRatio(gameInformationAboveLineWe, aboveLineLabelWe, DEFAULT_FONT_SIZE);
  var ratioToUseAboveLineLabelThey = getMaxFontSizeRatio(gameInformationAboveLineThey, aboveLineLabelThey, DEFAULT_FONT_SIZE);
  var ratioToUseFirstGameLabelWe = getMaxFontSizeRatio(gameInformationFirstGameWe, firstGameLabelWe, DEFAULT_FONT_SIZE);
  var ratioToUseFirstGameLabelThey = getMaxFontSizeRatio(gameInformationFirstGameThey, firstGameLabelThey, DEFAULT_FONT_SIZE);
  var ratioToUseSecondGameLabelWe = getMaxFontSizeRatio(gameInformationSecondGameWe, secondGameLabelWe, DEFAULT_FONT_SIZE);
  var ratioToUseSecondGameLabelThey = getMaxFontSizeRatio(gameInformationSecondGameThey, secondGameLabelThey, DEFAULT_FONT_SIZE);
  var ratioToUseThirdGameLabelWe = getMaxFontSizeRatio(gameInformationThirdGameWe, thirdGameLabelWe, DEFAULT_FONT_SIZE);
  var ratioToUseThirdGameLabelThey = getMaxFontSizeRatio(gameInformationThirdGameThey, thirdGameLabelThey, DEFAULT_FONT_SIZE);
  var ratios = [ratioToUseAboveLineLabelWe, ratioToUseAboveLineLabelThey, ratioToUseFirstGameLabelWe, ratioToUseFirstGameLabelThey, ratioToUseSecondGameLabelWe, ratioToUseSecondGameLabelThey, ratioToUseThirdGameLabelWe, ratioToUseThirdGameLabelThey];
  var ratioToUseHeader = getMinMaxValues(ratios).min;
  //#endregion
  //#region Vertically Centering Each respective label with its container
  centerColumns(gameInformationWeHeader, weLabel, DEFAULT_FONT_SIZE, ratioToUseHeaderRight);
  centerColumns(gameInformationTheyHeader, theyLabel, DEFAULT_FONT_SIZE, ratioToUseHeaderRight);
  centerColumns(gameInformationAboveLineWe, aboveLineLabelWe, DEFAULT_FONT_SIZE, ratioToUseHeader);
  centerColumns(gameInformationAboveLineThey, aboveLineLabelThey, DEFAULT_FONT_SIZE, ratioToUseHeader);
  centerColumns(gameInformationFirstGameWe, firstGameLabelWe, DEFAULT_FONT_SIZE, ratioToUseHeader);
  centerColumns(gameInformationFirstGameThey, firstGameLabelThey, DEFAULT_FONT_SIZE, ratioToUseHeader);
  centerColumns(gameInformationSecondGameWe, secondGameLabelWe, DEFAULT_FONT_SIZE, ratioToUseHeader);
  centerColumns(gameInformationSecondGameThey, secondGameLabelThey, DEFAULT_FONT_SIZE, ratioToUseHeader);
  centerColumns(gameInformationThirdGameWe, thirdGameLabelWe, DEFAULT_FONT_SIZE, ratioToUseThirdGameLabelWe);
  centerColumns(gameInformationThirdGameThey, thirdGameLabelThey, DEFAULT_FONT_SIZE, ratioToUseThirdGameLabelThey);
  //#endregion
  //#region Horizontally Centering Each respective label with its container
  justifyRow(gameInformationWeHeader, weLabel, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationTheyHeader, theyLabel, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationAboveLineWe, aboveLineLabelWe, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationAboveLineThey, aboveLineLabelThey, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationFirstGameWe, firstGameLabelWe, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationFirstGameThey, firstGameLabelThey, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationSecondGameWe, secondGameLabelWe, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationSecondGameThey, secondGameLabelThey, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationThirdGameWe, thirdGameLabelWe, DEFAULT_FONT_SIZE);
  justifyRow(gameInformationThirdGameThey, thirdGameLabelThey, DEFAULT_FONT_SIZE);
  //#endregion
}
function getExpectedHeight(columns, columnSpacing) {
  var expectedHeight = 0;
  for (var i = 0; i < columns.length; i++) {
    var column = columns[i];
    if (column[0]) {
      if (i !== 0) expectedHeight += columnSpacing;
      else {
        if (column[0].bounds) expectedHeight += column[0].bounds.height;
      }
    }
  }
  return expectedHeight;
}
function getExpectedWidth(listOfLabelsGroupedTogether,interItemSpacing, intraItemSpacing, subItemSpacing) {
  var rowWidth = 0;  //calculate based on spacing
  for (var i = 0; i < listOfLabelsGroupedTogether.length; i++) {
    var group = listOfLabelsGroupedTogether[i];
    //adding interItemSpacing
    if (i === 0 && listOfLabelsGroupedTogether.length > 1) {
      rowWidth += interItemSpacing * (listOfLabelsGroupedTogether.length - 1);
    } 
    for (var j = 0; j < group.length; j++) {
      //adding intraItemSpacing
      if (j === 0 && group.length > 1) {
        rowWidth += intraItemSpacing * (group.length - 1);
      }
      var item = group[j];
      if (typeof item === 'object') {
        for (var k = 0; k < item.length; k++) {
          var subItem = item[k];
          if (k !== 0) rowWidth += subItemSpacing
          if (subItem) rowWidth += subItem.bounds.width;
        }
        if (item.bounds) {
          rowWidth += item.bounds.width;
        }
      }
      else {
        return null;
      }
    }
  } 
  return rowWidth;
}
function applyFontSize(items, ratio) {
  for (var i = 0; i < items.length; i++) {
    var row = items[i];
    if (row) {
      for (var j = 0; j < row.length; j++) {
        var item = row[j];
        if (item && item.fontSize) item.fontSize *= ratio;
        else if (item) item.scale(ratio);
      }
    }
  }
}
function setTrickCounts(northSouthTrickCountFromServer, eastWestTrickCountFromServer) {
  northSouthTrickCount = northSouthTrickCountFromServer;
  eastWestTrickCount = eastWestTrickCountFromServer;

  if (!texts.tricksNeeded) return null;
  if (spot.toLowerCase() === 'north' || spot.toLowerCase() === 'south') tricksNeeded = String(northSouthTrickCount);
  else tricksNeeded = String(eastWestTrickCount);
  texts.tricksNeeded.content = tricksNeeded;
  textsTricksNeededRow = [[texts.tricksNeededLabel, [texts.tricksNeeded, texts.tricksNeededDivider, texts.tricksNeededTotal]]];
  justifyRow(isExposedTop || isExposedBottom ? dealInformationLeftHalf : dealInformation, textsTricksNeededRow, DEFAULT_FONT_SIZE);
}
function changeTrickLabels() {
  var number = parseInt(texts.contract.content);
  var offense = false;
  if (exposedHandSpot.toLowerCase() === locations.north || exposedHandSpot.toLowerCase() === locations.south) {
    if (spot.toLowerCase() === locations.north || spot.toLowerCase() === locations.south) {
      offense = true;
    }
  }
  else if (exposedHandSpot.toLowerCase() === locations.east || exposedHandSpot.toLowerCase() === locations.west) {
    if (spot.toLowerCase() === locations.east || spot.toLowerCase() === locations.west) {
      offense = true;
    }
  }

  if (offense) { 
    texts.tricksNeededLabel.content = 'Tricks:';
    texts.tricksNeededTotal.content = 6 + number + ' Needed';
  }
  else {
    texts.tricksNeededTotal.content = 13 - (6 + number) + 1;
  }

  var tricksLeft = getTricksLeft();
  texts.trickNumber.content = tricksLeft;
}
//#endregion
//#region Animation Stuff
function animateRoundEnd() {
  //#region Setting up
  if (!roundEndAnimationComplete && (topVector === undefined || topVector === null || bottomVector === undefined || bottomVector === null || leftVector === undefined || leftVector === null || rightVector === undefined || rightVector === null)) {
    if (preferences.sound.isEnabled === true) sounds['roundEndAnimation'].play();
    rotationAccelleration = rotationDecellerationStart;
    topDestination = new Point(canvasWidth / 2, -cardHeight);
    bottomDestination = new Point(canvasWidth / 2, canvasHeight + cardHeight);
    if (isMobile) {
      var leftRightMobileY = topPlayArea.position.y + smallCardHeight / 2;
      leftDestination = new Point(-smallCardHeight, leftRightMobileY);
      rightDestination = new Point(canvasWidth + cardHeight, leftRightMobileY);
    }
    else {
      var leftRightY = topPlayArea.position.y + cardHeight / 2;
      leftDestination = new Point(-cardHeight,  leftRightY);
      rightDestination = new Point(canvasWidth + cardHeight,  leftRightY);
    }
    setPlayAreaCards();
    topCard = deck[topPlayAreaCard];
    bottomCard = deck[bottomPlayAreaCard];
    leftCard = deck[leftPlayAreaCard];
    rightCard = deck[rightPlayAreaCard];
    setLocationNameVariables();
    if (roundWinner === topName) actualDestination = topDestination; 
    else if (roundWinner === bottomName) actualDestination = bottomDestination; 
    else if (roundWinner === leftName) actualDestination = leftDestination; 
    else if (roundWinner === rightName) actualDestination = rightDestination; 
    else {
      if (roundEndAnimation === true) {
        setPlayAreaCards();
      }
      roundEndAnimation = false;
      if(topCard) {
        topCard.position = new Point(-1000,-1000);
        topCard.remove();
      }
      if(bottomCard) {
        bottomCard.position = new Point(-1000,-1000);
        bottomCard.remove();
      }
      if(leftCard) {
        leftCard.position = new Point(-1000,-1000);
        leftCard.remove();
      }
      if(rightCard) {
        rightCard.position = new Point(-1000,-1000);
        rightCard.remove();
      }
      console.log('animation failed due to no round winner');
      return;
    }
    if (!topCard || !bottomCard || !leftCard || !rightCard) {
      return null;
    }
    topVector = actualDestination - topCard.position;
    bottomVector = actualDestination - bottomCard.position;
    leftVector = actualDestination - leftCard.position;
    rightVector = actualDestination - rightCard.position;
  }
  //#endregion
  //#region Changing Position
  topCard.position += topVector / startSpeedRoundEnd;
  bottomCard.position += bottomVector / startSpeedRoundEnd;
  leftCard.position += leftVector / startSpeedRoundEnd;
  rightCard.position += rightVector / startSpeedRoundEnd;
  startSpeedRoundEnd /= accelerationRoundEnd;

  topVector = actualDestination - topCard.position;
  bottomVector = actualDestination - bottomCard.position;
  leftVector = actualDestination - leftCard.position;
  rightVector = actualDestination - rightCard.position;
  //#endregion
  //#region Rotating Cards to Correct Rotation
  rotationAccelleration += rotationDecellerationRate;
  if(actualDestination === leftDestination){
    if (topCard.rotation < 270) topCard.rotate(rotationStartSpeedInDegrees / rotationAccelleration);
    if (bottomCard.rotation > -90) bottomCard.rotate(-rotationStartSpeedInDegrees / rotationAccelleration);
  }
  else if(actualDestination === rightDestination){
  
    if (topCard.rotation > -270) topCard.rotate(-rotationStartSpeedInDegrees / rotationAccelleration);
    if (bottomCard.rotation < 90) bottomCard.rotate(rotationStartSpeedInDegrees / rotationAccelleration);
  }
  else if(actualDestination === topDestination){
    if (leftCard.rotation > 0) leftCard.rotate(-rotationStartSpeedInDegrees / rotationAccelleration);
    if (rightCard.rotation < 0) rightCard.rotate(rotationStartSpeedInDegrees / rotationAccelleration);
  }
  else if(actualDestination === bottomDestination){
    if (leftCard.rotation > 0) leftCard.rotate(rotationStartSpeedInDegrees / rotationAccelleration);
    if (rightCard.rotation < 0) rightCard.rotate(-rotationStartSpeedInDegrees / rotationAccelleration);
  }
  //#endregion
  //#region End Condition
 
  if (topCard.position.y < 0 - cardHeight || topCard.position.y > canvasHeight + cardHeight || topCard.position.x < 0 - cardHeight || topCard.position.x > canvasWidth + cardHeight || bottomCard.position.y < 0 - cardHeight || bottomCard.position.y > canvasHeight + cardHeight || bottomCard.position.x < 0 - cardHeight || bottomCard.position.x > canvasWidth + cardHeight || leftCard.position.y < 0 - cardHeight || leftCard.position.y > canvasHeight + cardHeight || leftCard.position.x < 0 - cardHeight || leftCard.position.x > canvasWidth + cardHeight || rightCard.position.y < 0 - cardHeight || rightCard.position.y > canvasHeight + cardHeight || rightCard.position.x < 0 - cardHeight || rightCard.position.x > canvasWidth + cardHeight ) {
    topCard.position = new Point(-2000, -2000);
    bottomCard.position = new Point(-2000, -2000);
    leftCard.position = new Point(-2000, -2000);
    rightCard.position = new Point(-2000, -2000);
    if (roundEndAnimation === true) resetRoundEndAnimation();
    onResize(false);
  }
//#endregion
}
function loadRastersIfNotYetLoaded() {
  if (clubThinking && clubThinking.bounds && isNaN(clubThinking.bounds.height)) {
    clubThinking = new Raster('club');
    clubThinking.on('load', function () {
      setupSuitsForPlayAreaThinking();
    })
  }
  if (diamondThinking && diamondThinking.bounds && isNaN(diamondThinking.bounds.height)) {
    diamondThinking = new Raster('diamond');
    diamondThinking.on('load', function () {
      setupSuitsForPlayAreaThinking();
    })
  }
  if (heartThinking && heartThinking.bounds && isNaN(heartThinking.bounds.height)) {
    heartThinking = new Raster('heart');
    heartThinking.on('load', function () {
      setupSuitsForPlayAreaThinking();
    })
  }
  if (spadeThinking && spadeThinking.bounds && isNaN(spadeThinking.bounds.height)) {
    spadeThinking = new Raster('spade');
    spadeThinking.on('load', function () {
      setupSuitsForPlayAreaThinking();
    })
  }
}
//#region Play Area Thinking Animation
function animatePlayAreaThinking() {
  if (thinkingLocation) {
    loadRastersIfNotYetLoaded();
    frameCountForSuitThinkingAnimation++;
    var suitThinkingFrameLength = playAreaAnimationDuration / 3.5;
    var waitIntervalInFrames = suitThinkingFrameLength / 2;
    var clubStart = 1;
    var clubTransition = suitThinkingFrameLength + clubStart;
    var clubEnd = suitThinkingFrameLength * 2;

    var diamondStart = waitIntervalInFrames;
    var diamondTransition = suitThinkingFrameLength + diamondStart;
    var diamondEnd = suitThinkingFrameLength * 2 + diamondStart;

    var heartStart = waitIntervalInFrames * 2;
    var heartTransition = suitThinkingFrameLength + heartStart;
    var heartEnd = suitThinkingFrameLength * 2 + heartStart;

    var spadeStart = waitIntervalInFrames * 3;
    var spadeTransition = suitThinkingFrameLength + spadeStart;
    var spadeEnd = suitThinkingFrameLength * 2 + spadeStart;

    var resetFrame = suitThinkingFrameLength * 2 + (3 * waitIntervalInFrames) + 1;

    //#region club
    if (frameCountForSuitThinkingAnimation >= clubStart &&  frameCountForSuitThinkingAnimation <= clubTransition) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, clubStart, clubTransition, 0, 1);
      clubThinking.opacity = amountToChange;
      // clubThinking.scale(1 / Math.pow(handScaleAmount, (1 / 30)));
    }
    else if (frameCountForSuitThinkingAnimation >= clubTransition &&  frameCountForSuitThinkingAnimation <= clubEnd) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, clubTransition + 1, clubEnd, 1, 0);
      clubThinking.opacity = amountToChange;
      // clubThinking.scale(Math.pow(handScaleAmount, (1 / 30)));
    }
    //#endregion
    //#region diamond
    if (frameCountForSuitThinkingAnimation >= diamondStart &&  frameCountForSuitThinkingAnimation <= diamondTransition) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, diamondStart, diamondTransition, 0, 1);
      diamondThinking.opacity = amountToChange;
    }
    else if (frameCountForSuitThinkingAnimation >= diamondTransition &&  frameCountForSuitThinkingAnimation <= diamondEnd) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, diamondTransition + 1, diamondEnd, 1, 0);
      diamondThinking.opacity = amountToChange;
    }
    //#endregion
    //#region heart
    if (frameCountForSuitThinkingAnimation >= heartStart &&  frameCountForSuitThinkingAnimation <= heartTransition) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, heartStart, heartTransition, 0, 1);
      heartThinking.opacity = amountToChange;
      // heartThinking.scale(1 / Math.pow(handScaleAmount, (1 / 30)));
    }
    else if (frameCountForSuitThinkingAnimation >= heartTransition &&  frameCountForSuitThinkingAnimation <= heartEnd) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, heartTransition + 1, heartEnd, 1, 0);
      heartThinking.opacity = amountToChange;
      // heartThinking.scale(Math.pow(handScaleAmount, (1 / 30)));
    }
    //#endregion
    //#region spade
    if (frameCountForSuitThinkingAnimation >= spadeStart &&  frameCountForSuitThinkingAnimation <= spadeTransition) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, spadeStart, spadeTransition, 0, 1);
      spadeThinking.opacity = amountToChange;
      // spadeThinking.scale(1 / Math.pow(handScaleAmount, (1 / 30)));
    }
    else if (frameCountForSuitThinkingAnimation >= spadeTransition &&  frameCountForSuitThinkingAnimation <= spadeEnd) {
      var amountToChange = getLinearPercentOfMaxMatchWithinRange(frameCountForSuitThinkingAnimation, spadeTransition + 1, spadeEnd, 1, 0);
      spadeThinking.opacity = amountToChange;
      // spadeThinking.scale(Math.pow(handScaleAmount, (1 / 30)));
    }
    //#endregion
    else if (frameCountForSuitThinkingAnimation % resetFrame === 0) {
      frameCountForSuitThinkingAnimation = 0;
    }
  }
}
function setupSuitsForPlayAreaThinking() {
  if (!thinkingLocation) return;
  var isThinkingLeft = thinkingLocation.toLowerCase() === cardDisplayLocations.left;
  var isThinkingRight = thinkingLocation.toLowerCase() === cardDisplayLocations.right;
  var isThinkingTop = thinkingLocation.toLowerCase() === cardDisplayLocations.top;
  var isThinkingBottom = thinkingLocation.toLowerCase() === cardDisplayLocations.bottom;
  // console.log('setupSuitsForPlayAreaThinking-----------------');
  var positions = getDeclarerUIThinkingAnimationStartPositions(isThinkingLeft, isThinkingRight, isThinkingTop, isThinkingBottom);
  if (!clubThinking) clubThinking = new Raster('club');
  if (!diamondThinking) diamondThinking = new Raster('diamond');
  if (!heartThinking) heartThinking = new Raster('heart');
  if (!spadeThinking) spadeThinking = new Raster('spade');
  clubThinking.smoothing = true;
  diamondThinking.smoothing = true;
  heartThinking.smoothing = true;
  spadeThinking.smoothing = true;

  var widthToUse = isMobile ? smallCardWidth : cardWidth;
  clubThinking.scale(widthToUse * playAreaShrinkFactor / 5 / clubThinking.bounds.width * 1);
  diamondThinking.scale(widthToUse * playAreaShrinkFactor / 5 / diamondThinking.bounds.width * 1);
  heartThinking.scale(widthToUse * playAreaShrinkFactor / 5 / heartThinking.bounds.width * 1);
  spadeThinking.scale(widthToUse * playAreaShrinkFactor / 5 / spadeThinking.bounds.width * 1);
  
  clubThinking.on('load', function () {
    clubThinking.scale(widthToUse * playAreaShrinkFactor / 5 / clubThinking.bounds.width * 1);
  });
  diamondThinking.on('load', function () {
    diamondThinking.scale(widthToUse * playAreaShrinkFactor / 5 / diamondThinking.bounds.width * 1);
  });
  heartThinking.on('load', function () {
    heartThinking.scale(widthToUse * playAreaShrinkFactor / 5 / heartThinking.bounds.width * 1);
  });
  spadeThinking.on('load', function () {
    spadeThinking.scale(widthToUse * playAreaShrinkFactor / 5 / spadeThinking.bounds.width * 1);
  });
  if (isThinkingLeft) {
    spadeThinking.position = new Point([positions.x, positions.y]);
    heartThinking.position = new Point([positions.x + positions.spacing * 1, positions.y]);
    diamondThinking.position = new Point([positions.x + positions.spacing * 2, positions.y]);
    clubThinking.position = new Point([positions.x + positions.spacing * 3, positions.y]);
    clubThinking.rotation = -90;
    diamondThinking.rotation = -90;
    heartThinking.rotation = 90;
    spadeThinking.rotation = -90;
  }
  else if (isThinkingRight) {
    clubThinking.position = new Point([positions.x, positions.y]);
    diamondThinking.position = new Point([positions.x + positions.spacing * 1, positions.y]);
    heartThinking.position = new Point([positions.x + positions.spacing * 2, positions.y]);
    spadeThinking.position = new Point([positions.x + positions.spacing * 3, positions.y]);
    clubThinking.rotation = 90;
    diamondThinking.rotation = 90;
    heartThinking.rotation = -90;
    spadeThinking.rotation = 90;
  }
  else if (isThinkingTop) {
    spadeThinking.position = new Point([positions.x, positions.y]);
    heartThinking.position = new Point([positions.x, positions.y + positions.spacing * 1]);
    diamondThinking.position = new Point([positions.x, positions.y + positions.spacing * 2]);
    clubThinking.position = new Point([positions.x, positions.y + positions.spacing * 3]);
    clubThinking.rotation = 0;
    diamondThinking.rotation = 0;
    heartThinking.rotation = 180;
    spadeThinking.rotation = 0;
  }
  else if (isThinkingBottom) {
    clubThinking.position = new Point([positions.x, positions.y]);
    diamondThinking.position = new Point([positions.x, positions.y + positions.spacing * 1]);
    heartThinking.position = new Point([positions.x, positions.y + positions.spacing * 2]);
    spadeThinking.position = new Point([positions.x, positions.y + positions.spacing * 3]);
    clubThinking.rotation = 180;
    diamondThinking.rotation = 180;
    heartThinking.rotation = 0;
    spadeThinking.rotation = 180;
  }
  clubThinking.insertAbove(playAreaAsPaperObj);
  diamondThinking.insertAbove(playAreaAsPaperObj);
  heartThinking.insertAbove(playAreaAsPaperObj);
  spadeThinking.insertAbove(playAreaAsPaperObj);
  return;
}
function getDeclarerUIThinkingAnimationStartPositions(isThinkingLeft, isThinkingRight, isThinkingTop, isThinkingBottom) {
  var declarerUIPlayAreaCardHeight = cardHeight * playAreaShrinkFactor / 5;
  var mobilePlayAreaCardHeight = smallCardHeight * playAreaShrinkFactor / 5;
  var positions = {spacing: isMobile ? mobilePlayAreaCardHeight : declarerUIPlayAreaCardHeight};
  var heightOffset = isMobile ? mobilePlayAreaCardHeight : declarerUIPlayAreaCardHeight;
  if (isThinkingLeft) {
    positions.x = leftPlayArea.bounds.topLeft.x + heightOffset;
    positions.y = leftPlayArea.position.y;
  }
  else if (isThinkingRight) {
    positions.x = rightPlayArea.bounds.topLeft.x + heightOffset;
    positions.y = leftPlayArea.position.y;
  }
  else if (isThinkingTop) {
    positions.x = topPlayArea.position.x;
    positions.y = topPlayArea.bounds.topLeft.y + heightOffset;
  }
  else if (isThinkingBottom) {
    positions.x = topPlayArea.position.x;
    positions.y = bottomPlayArea.bounds.topLeft.y + heightOffset;
  }
  else return;
  return positions;
}
//#endregion

function animateThinking() {
  if (thinkingLocation) {
    frameCountForCardThinkingAnimation++;
    if (!cardsToAnimate || cardsToAnimate.length === 0) return null;
    if (frameCountForCardThinkingAnimation === 1) {
      randomCardAsNumber = 0 + Math.floor(Math.random() * (cardsToAnimate.length));
      rotationPoint = getRotationPoint(cardsToAnimate[randomCardAsNumber]);
    }
    if (frameCountForCardThinkingAnimation >= 1 &&  frameCountForCardThinkingAnimation <= 30 && frameCountForCardThinkingAnimation % animateEveryNthFrame === 0) {
      //enlarge a card (over time)
      if (cardsToAnimate[randomCardAsNumber]) cardsToAnimate[randomCardAsNumber].scale(thinkingScaleAmount, rotationPoint);
    }
    else if (frameCountForCardThinkingAnimation >= animateEveryNthFrame & frameCountForCardThinkingAnimation <= 60 && frameCountForCardThinkingAnimation % animateEveryNthFrame === 0) {
      //shrink card (over time)
      if (cardsToAnimate[randomCardAsNumber]) cardsToAnimate[randomCardAsNumber].scale(1 / thinkingScaleAmount, rotationPoint);
    }
    else if (frameCountForCardThinkingAnimation % 61 === 0) {
      frameCountForCardThinkingAnimation = 0;
    }
  }
  else {
    resetThinkingCard()
  }
}
function playPreRoundEndSound() {
  if (playedCards && playedCards.length % 4 === 0 && preferences.sound.isEnabled && preferences.shouldAnimateRoundEnd) {
    if (preferences.sound.roundEndAnimation.match(/shotgun/i)) {
      var shellsLoaded = 0;
      var shotgunLoading = setInterval(function () {
        if (shellsLoaded >= 4) {
          return clearInterval(shotgunLoading);
        }
        sounds['shotgunLoad'].play();
        shellsLoaded++;
      }, roundEndAnimationWaitDuration / 5);
    }
  }
}
function animateCardPlay() {
  //#region Setting Up Animation
  if (!vector || !cardToPlay) {
    playPreRoundEndSound();
    hasSentAnimationCompletion = false;
    //#region Getting cardToPlay, startPosition, and startRotation
    cardToPlay = deck[playedCards[playedCards.length - 1]];
    if (clientHasHiddenHandInLocation(cardToPlayHandLocation)) {
      var startPosition, startRotation;
      if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.top) {
        var hiddenHandDirection = getDirectionFromLocation(cardDisplayLocations.top);
        var randomIndex = 0 + Math.floor(Math.random() * (hiddenCardsTop.length));
        var hiddenCard = hiddenCardsTop.splice(randomIndex, 1)[0];

        if (hiddenCard) {
          startPosition = hiddenCard.position;
          startRotation = hiddenCard.rotation;
        }
        else {
          var cardHeightAmount = isMobile ? smallCardHeight : cardHeight;
          var x = topPlayArea.bounds.center.x;
          var y = topPlayArea.bounds.top - marginAmount - cardHeightAmount / 2;
          startPosition = new Point(x, y);
          startRotation = 0;
        }
        
        if (isMobile) {
          removeHiddenCards(cardDisplayLocations.top);
          drawHiddenHand(handLengths[hiddenHandDirection], cardDisplayLocations.top);
        } 
        else displayHiddenHands()
      }
      else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.left) {
        var hiddenHandDirection = getDirectionFromLocation(cardDisplayLocations.left);
        var randomIndex = 0 + Math.floor(Math.random() * (hiddenCardsLeft.length));
        var hiddenCard = hiddenCardsLeft.splice(randomIndex, 1)[0];

        if (hiddenCard) {
          startPosition = hiddenCard.position;
          startRotation = hiddenCard.rotation;
        }
        else {
          var cardHeightAmount = isMobile ? smallCardHeight : cardHeight;
          var x = leftPlayArea.bounds.left - marginAmount - cardHeightAmount / 2;
          var y = leftPlayArea.bounds.center.y;
          startPosition = new Point(x, y);
          startRotation = 0;
        }

        if (isMobile) {
          removeHiddenCards(cardDisplayLocations.left);
          drawHiddenHand(handLengths[hiddenHandDirection], cardDisplayLocations.left);
        } 
        else displayHiddenHands();
      }
      else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.right) {
        var hiddenHandDirection = getDirectionFromLocation(cardDisplayLocations.right);
        var randomIndex = 0 + Math.floor(Math.random() * (hiddenCardsRight.length));
        var hiddenCard = hiddenCardsRight.splice(randomIndex, 1)[0];
       
        if (hiddenCard) {
          startPosition = hiddenCard.position;
          startRotation = hiddenCard.rotation;
        }
        else {
          var cardHeightAmount = isMobile ? smallCardHeight : cardHeight;
          var x = rightPlayArea.bounds.right + marginAmount + cardHeightAmount / 2;
          var y = rightPlayArea.bounds.center.y;
          startPosition = new Point(x, y);
          startRotation = 0;
        }
        
        if (isMobile) {
          removeHiddenCards(cardDisplayLocations.right);
          drawHiddenHand(handLengths[hiddenHandDirection], cardDisplayLocations.right);
        } 
        else displayHiddenHands();
      }
      if (cardToPlay) {
        cardToPlay.position = startPosition;
        cardToPlay.rotation = startRotation;
      }
    }

    

    // if (clientHasHiddenHandInLocation(cardToPlayHandLocation)) {
    //   var startPosition, startRotation;
    //   if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.top) {
    //     var hiddenHandDirection = getDirectionFromLocation(cardDisplayLocations.top);
    //     var randomIndex = 0 + Math.floor(Math.random() * (hiddenCardsTop.length));
    //     var hiddenCard = hiddenCardsTop.splice(randomIndex, 1)[0];
    //     if (hiddenCard) {
    //       startPosition = hiddenCard.position;
    //       startRotation = hiddenCard.rotation;
    //     }
    //     removeHiddenCards(cardDisplayLocations.top);
    //     //This is necessary to have the last card disappear immediately
    //     if (handLengths[hiddenHandDirection] > 0) drawHiddenHand(handLengths[hiddenHandDirection], cardDisplayLocations.top);
    //     else {
    //       hiddenCard.position.x = -200;
    //       hiddenCard.remove();
    //     }
    //   }
    //   else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.left) {
    //     var hiddenHandDirection = getDirectionFromLocation(cardDisplayLocations.left);
    //     var randomIndex = 0 + Math.floor(Math.random() * (hiddenCardsLeft.length));
    //     var hiddenCard = hiddenCardsLeft.splice(randomIndex, 1)[0];
    //     if (hiddenCard) {
    //       startPosition = hiddenCard.position;
    //       startRotation = hiddenCard.rotation;
    //     }
    //     removeHiddenCards(cardDisplayLocations.left);
    //     //This is necessary to have the last card disappear immediately
    //     if (handLengths[hiddenHandDirection] > 0) drawHiddenHand(handLengths[hiddenHandDirection], cardDisplayLocations.left);
    //     else {
    //       hiddenCard.position.x = -200;
    //       hiddenCard.remove();
    //     }
    //   }
    //   else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.right) {
    //     var hiddenHandDirection = getDirectionFromLocation(cardDisplayLocations.right);
    //     var randomIndex = 0 + Math.floor(Math.random() * (hiddenCardsRight.length));
    //     var hiddenCard = hiddenCardsRight.splice(randomIndex, 1)[0];
    //     if (hiddenCard) {
    //       startPosition = hiddenCard.position;
    //       startRotation = hiddenCard.rotation;
    //     }
    //     removeHiddenCards(cardDisplayLocations.right);
    //     //This is necessary to have the last card disappear immediately
    //     if (handLengths[hiddenHandDirection] > 0) drawHiddenHand(handLengths[hiddenHandDirection], cardDisplayLocations.right);
    //     else {
    //       hiddenCard.position.x = -200;
    //       hiddenCard.remove();
    //     }
    //   }
    //   if (cardToPlay) {
    //     cardToPlay.position = startPosition;
    //     cardToPlay.rotation = startRotation;
    //   }
    // }
    //#endregion
    //#region Setting up Variable Rotation Speed Initial Vector
    vector = cardToPlayDestination - cardToPlay.position;
    if (vector) {
      if (vector.length < 300) {
        animationStartSpeedLowerIsFaster = cardPlayAnimationSpeeds.slow.animationStartSpeedLowerIsFaster;
        animationStartRotationSpeed = cardPlayAnimationSpeeds.slow.animationStartRotationSpeed;
      }
      else {
        animationStartSpeedLowerIsFaster = cardPlayAnimationSpeeds.medium.animationStartSpeedLowerIsFaster;
        animationStartRotationSpeed = cardPlayAnimationSpeeds.medium.animationStartRotationSpeed;
      }
    }
    //#endregion
    //#region Ensuring cardToPlay Rotation and Size
    if (cardToPlay) {
      var desiredSize 
      var currentSize;
      if (isHighAspectRatio) desiredSize *= highAspectRatioScaleFactor;
      if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.left) {
        cardToPlay.rotation = 90;
        currentSize = cardToPlay.bounds.height;
        desiredSize = (isMobile) ? smallCardWidth : cardWidth;
        if (isExposedTop && !isMobile) desiredSize *= declarerUIHandScaleFactor;
      } 
      else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.right) { 
        cardToPlay.rotation = -90;
        currentSize = cardToPlay.bounds.height;
        desiredSize = (isMobile) ? smallCardWidth : cardWidth;
        if (isExposedTop && !isMobile) desiredSize *= declarerUIHandScaleFactor;
      }
      else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.top) {
        cardToPlay.rotation = 180;
        currentSize = cardToPlay.bounds.height;
        desiredSize = (isMobile) ? smallCardHeight : cardHeight;
      }
      else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.bottom) {
        cardToPlay.rotation = 0;
        currentSize = cardToPlay.bounds.height;
        desiredSize = (isMobile) ? smallCardHeight : cardHeight;
      }
      cardToPlay.scale(desiredSize / currentSize);
      project.activeLayer.addChild(cardToPlay);
    }
    //#endregion
  }
  //#endregion
  //#region Actually animating the card
  if(cardToPlay) {
    cardToPlay.position += vector / animationStartSpeedLowerIsFaster;
    cardToPlay.rotate(animationStartRotationSpeed);
    
    if (animationStartSpeedLowerIsFaster < animationDeclerationThreshold) {
      animationStartSpeedLowerIsFaster /= animationDeceleration;
    }

    animationStartRotationSpeed *= animationDeceleration;
    vector = cardToPlayDestination - cardToPlay.position;

    if (vector && vector.length < 300 && !hasSentAnimationCompletion) {
      hasSentAnimationCompletion = true;
      // globals.cardPlayAnimationCompletion(queryString.room);
    }

    // if (vector && vector.length < 15) {
    if (vector && vector.length < .0625) {
      resetCardPlayAnimation();
      displayPlayAreaCards();
    }
  }
  //#endregion
  //#region if cardToPlay is undefined or null
  else {
    skipCardPlayAnimation();
  }
  //#endregion
}
function skipCardPlayAnimation() {
  var playAreaToPlayAt;
  if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.top) {
    playAreaToPlayAt = topPlayArea;
    topPlayAreaCard = cardToPlayAsNumber;
  }
  else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.bottom) {
    playAreaToPlayAt = bottomPlayArea;
    bottomPlayAreaCard = cardToPlayAsNumber;
  }
  else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.left) {
    playAreaToPlayAt = leftPlayArea;
    leftPlayAreaCard = cardToPlayAsNumber;
  }
  else if (cardToPlayHandLocation.toLowerCase() === cardDisplayLocations.right) {
    playAreaToPlayAt = rightPlayArea;
    rightPlayAreaCard = cardToPlayAsNumber;
  }
  deck[cardToPlayAsNumber].scale(playAreaToPlayAt.bounds.height / deck[cardToPlayAsNumber].bounds.height);
  deck[cardToPlayAsNumber].position = playAreaToPlayAt.position;
  resetCardPlayAnimation();
  displayPlayAreaCards();
  // globals.cardPlayAnimationCompletion(queryString.room);
}
function skipRoundEndAnimation() { 
  var waitDuration = roundEndAnimationWaitDuration + skipRoundEndAnimationWaitDuration;
  if (preferences.shouldAnimateCardPlay) waitDuration = skipRoundEndAnimationWaitDuration;
  else if (!preferences.shouldAnimateCardPlay && !preferences.shouldAnimateRoundEnd) waitDuration = skipRoundEndAnimationWaitDuration;

  setTimeout(function () {
    moveCardsForRoundEnd()
  }, waitDuration);
}
function moveCardsForRoundEnd() {
   if (topPlayAreaCard !== undefined && topPlayAreaCard !== null) deck[topPlayAreaCard].position  = new Point (-2000, -2000);
    if (bottomPlayAreaCard !== undefined && bottomPlayAreaCard !== null) deck[bottomPlayAreaCard].position  = new Point (-2000, -2000);
    if (leftPlayAreaCard !== undefined && leftPlayAreaCard !== null) deck[leftPlayAreaCard].position  = new Point (-2000, -2000);
    if (rightPlayAreaCard !== undefined && rightPlayAreaCard !== null) deck[rightPlayAreaCard].position  = new Point (-2000, -2000);
    resetRoundEndAnimation();
}
function initializePlayCardAnimation(cardAsNumber, location) {
  //#region Details on Animation Values
  //difference of 18 per rotation: //76.5  //58.5  //40.55  //22.661  //4.51 to left side from hand  when animationDeceleration = .95 (independent of animationStartSpeedLowerIsFaster)
  //difference of 14.405 per rotation: //75.62 //61.215 //46.81   to left side from hand  when animationDeceleration = animationDecelerationStart (independent of animationStartSpeedLowerIsFaster)
  //difference of 14.405 per rotation: //43.21 //   to bottom area from hand  when animationDeceleration = animationDecelerationStart (independent of animationStartSpeedLowerIsFaster)
  //#endregion
  // animationStartSpeedLowerIsFaster = animationStartSpeedLowerIsFasterStart;
  // animationStartRotationSpeed = animationStartRotationSpeedFast;
  // animationDeceleration = animationDecelerationStart;
  cardToPlayHandLocation = location;
  cardToPlayAsNumber = cardAsNumber;
  // if(preferences.sound.isEnabled) playCardSound.play();
  //#region Setting cardToPlayDestination
  switch (location.toLowerCase()) {
    case cardDisplayLocations.top:
      if(topPlayArea) cardToPlayDestination = topPlayArea.position;
      break;
    case cardDisplayLocations.bottom:
      if (bottomPlayArea) cardToPlayDestination = bottomPlayArea.position;
      break;
    case cardDisplayLocations.left:
      if (leftPlayArea) cardToPlayDestination = leftPlayArea.position;
      break;
    case cardDisplayLocations.right:
      if (rightPlayArea) cardToPlayDestination = rightPlayArea.position;
      break;
  }
  cardPlayAnimation = true;
  if (preferences.sound.isEnabled === true && preferences.shouldAnimateCardPlay) {
    sounds['cardPlayDuring'].stop();
    sounds['cardPlayDuring'].play();
  }
  //#endregion
}
function setCardsToAnimate() {
  cardsToAnimate = [];
  switch (thinkingLocation) {
    case cardDisplayLocations.top:
      if (isExposedBottom) {
        populateCardsToAnimateFromHandArray(hand);
      }
      else if (isExposedTop) {
        populateCardsToAnimateFromHandArray(exposedHand);
      }
      else {
        cardsToAnimate = hiddenCardsTop;
      }
      break;
    case cardDisplayLocations.left:
      if (isExposedLeft) {
        populateCardsToAnimateFromHandArray(exposedHand);
      }
      else {
        cardsToAnimate = hiddenCardsLeft;
      }
      break;
    case cardDisplayLocations.right:
      if (isExposedRight) {
        populateCardsToAnimateFromHandArray(exposedHand);
      }
      else {
        cardsToAnimate = hiddenCardsRight;
      }
      break;
    case cardDisplayLocations.bottomLeft:
        cardsToAnimate = hiddenCardsLeft;
        break;
    case cardDisplayLocations.bottomRight:
        cardsToAnimate = hiddenCardsRight;
        break;
    case cardDisplayLocations.bottom:
      if (isExposedBottom) {
        populateCardsToAnimateFromHandArray(exposedHand);
      }
      else if (preferences.shouldAnimateThinkingForSelf === true) {
        populateCardsToAnimateFromHandArray(hand);
      }
      break;
  }
}
function populateCardsToAnimateFromHandArray(handArray) {
  if (handArray === undefined || handArray === null) return handArray;
  var flatHand = handArray.flatten(2);
  for (var i = 0; i < flatHand.length; i++) {
    var cardAsNumber = flatHand[i];
    if (!cardsToRemoveFromThinkingAnimation.includes(cardAsNumber)) cardsToAnimate.push(deck[cardAsNumber]);
  }
  // console.log('debug - cardsToAnimate =', cardsToAnimate);
  // console.log('debug - cardsToRemoveFromThinkingAnimation =', cardsToRemoveFromThinkingAnimation);
}
function getRotationPoint(card){
  if (!thinkingLocation || card === undefined || card === null) return null;
  if (exposedHandLocation.toLowerCase() === thinkingLocation.toLowerCase()) {
    if (!card) return null;
    return card.bounds.center;
  }

  //return the point at which the card scales depending on location
  if (thinkingLocation.toLowerCase() === cardDisplayLocations.top) {
    return card.bounds.topLeft;
  }
  else if (thinkingLocation.toLowerCase() === cardDisplayLocations.left || thinkingLocation.toLowerCase() === cardDisplayLocations.bottomLeft) {
    return card.bounds.bottomLeft;
  }
  else if (thinkingLocation.toLowerCase() === cardDisplayLocations.right || thinkingLocation.toLowerCase() === cardDisplayLocations.bottomRight) {
      return card.bounds.topRight;
  }
}
function resetCardPlayAnimation() {
  // if (preferences.sound.isEnabled) yourTurnSound.play();
  cardPlayAnimation = false;
  vector = null;
  cardToPlay = null;
  cardToPlayHandLocation = null;
  cardToPlayAsNumber = null;
  checkIfRoundEnd();
  // console.log('debug - onResize 1');
  if (!isTurnToPlay && !clickedOnItem) onResize(false);
  else needToResizeOnPlay = true;
}
function resetRoundEndAnimation() {
  if  (isExposedBottom) cardsToRemoveFromThinkingAnimation = [];
  waitForRoundEnd = false;
  roundEndAnimation = false;
  startSpeedRoundEnd = startSpeedRoundEndStart;
  accelerationRoundEnd = accelerationRoundEndStart;
  roundEndAnimationComplete = true;
  topPlayAreaCard = null, bottomPlayAreaCard = null, leftPlayAreaCard = null, rightPlayAreaCard = null;
  topVector = null, bottomVector = null, leftVector = null, rightVector = null;
  hasRequestedRoundStartPlayer = false;
  // console.log('debug - onResize 2 in resetRoundEndVariables');
  // onResize(false);
  setThinkingLocation();
}
function resetThinkingCard() {
  if (cardsToAnimate.length > 0 && randomCardAsNumber !== null && randomCardAsNumber !== undefined && cardsToAnimate[randomCardAsNumber]) {
    var card = cardsToAnimate[randomCardAsNumber];
    var cardToCheck = getCardAsNumberFromName(card.name);
    var desiredHeight;
    if (isMobile) {
      if (isInHand(cardToCheck, hand)) desiredHeight = smallCardHeight;
      else desiredHeight = smallCardHeight * exposedHandShrinkAmountMobile;
    }
    else {
      if (isInHand(cardToCheck, hand)) desiredHeight = cardHeight;
      else desiredHeight = exposedHandCardHeight;
    }
    card.scale(desiredHeight / card.bounds.height, card.bounds.center);
    randomCardAsNumber = null;
  }
}
function checkIfRoundEnd(){
  displayPlayAreaCards();
  if (playedCards && playedCards.length % 4 === 0 && playedCards.length > 0 && topPlayAreaCard !== undefined && bottomPlayAreaCard !== undefined && leftPlayAreaCard !== undefined && rightPlayAreaCard !== undefined && topPlayAreaCard !== null && bottomPlayAreaCard !== null && leftPlayAreaCard !== null && rightPlayAreaCard !== null) {
    if (!roundWinner) {
      globals.getRoundWinner();
    }
    lastRoundStartPlayer = roundStartPlayer;
    roundEndAnimation = true;
  }
}
function clientHasHiddenHandInLocation(location) {
  //returns true of false whether the client has a hidden hand displayed in the given location
  if (isExposedTop || isExposedBottom) {
    if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.right) return true;
  }
  else if (isExposedLeft) {
    if (location.toLowerCase() === cardDisplayLocations.top || location.toLowerCase() === cardDisplayLocations.right) return true;
  }
  else if (isExposedRight) {
    if (location.toLowerCase() === cardDisplayLocations.left || location.toLowerCase() === cardDisplayLocations.top) return true;
  }
  else {
    throw 'incorrect location for exposedhand';
  }
  return false;
}
function getRotationsAround (startSpot, rotations) {
  if (typeof startSpot !== 'string') return null;
  if (rotations < 0) rotations = rotations % 4 + 4;
  if (rotations > 4 ) rotations = rotations % 4;
  var spotRotationOrder = ['north', 'east', 'south', 'west','north', 'east', 'south', 'west']
  if (startSpot.toLowerCase() === 'north') return spotRotationOrder[rotations]
  else if (startSpot.toLowerCase() === 'east') return spotRotationOrder[1 + rotations]
  else if (startSpot.toLowerCase() === 'south') return spotRotationOrder[2 + rotations]
  else if (startSpot.toLowerCase() === 'west') return spotRotationOrder[3 + rotations]
  else return null;
}
function setThinkingLocation() {
  if (handLengths === undefined || handLengths === null) return null;
  // console.log('setThinkingLocation--------------------------------');
  // console.log('thinking - roundWinner =', roundWinner);
  // console.log('thinking - getLocationFromName(roundWinner) =', getLocationFromName(roundWinner));
  // console.log('thinking - getLocationFromDirection(getRotationsAround(declarersSpot, 1)) =', getLocationFromDirection(getRotationsAround(declarersSpot, 1)));
  // console.log('thinking - isTurnToPlay =', isTurnToPlay);
  // console.log('thinking - declarerCanPlayFromExposed =', declarerCanPlayFromExposed);
  // console.log('thinking - cardsToRemoveFromThinkingAnimation =', cardsToRemoveFromThinkingAnimation);

  //#region If all the same lengths stop
  if (handLengths.north === handLengths.east && handLengths.east === handLengths.south && handLengths.south === handLengths.west ) {
    cardsToRemoveFromThinkingAnimation = [];
    var locationToSet = roundWinner ? getLocationFromName(roundWinner) : getLocationFromDirection(getRotationsAround(declarersSpot, 1));
    thinkingLocation = locationToSet;
    // console.log('1 setting thinking location to: ' + locationToSet);
    return null;
  }
  //#endregion
  //#region Finding the minimum
  var min = 13;
  var minCount = 0
  for (var key in handLengths) {
    if (handLengths.hasOwnProperty(key)) {
      var handLength = handLengths[key];
      if (handLength < min) {
        min = handLength;
        minCount++;
      }
      if (minCount >= 2) break;
    }
  }
  //#endregion
  //#region Getting the indexes for the max values
  var directions = ['north','east','south','west'];
  var maxIndexes = []
  var handLengthsArray = [handLengths.north, handLengths.east, handLengths.south, handLengths.west];
  
  for (var i = 0; i < handLengthsArray.length; i++) {
    var handLength = handLengthsArray[i];
    if (handLength != min) {
      maxIndexes.push(i);
    }
  }
  //#endregion
  //#region Getting whether contiguous
  var isContiguous = true;
  var gapIndex = 0;
  for (var i = 0; i < maxIndexes.length - 1; i++) {
    var maxIndex = maxIndexes[i];
    if (maxIndex + 1 !== maxIndexes[i+1]) {
      isContiguous = false;
      gapIndex = i+1;
      break;
    }
  }
  //#endregion
  //use the first index if [i]s are contiguous (no gap between) otherwise use the one after the gap
  var locationToSet;
  if (isContiguous) locationToSet = getLocationFromDirection(directions[maxIndexes[0]]);
  else locationToSet = getLocationFromDirection(directions[maxIndexes[gapIndex]]);
  thinkingLocation = locationToSet;

  // console.log('2 setting thinking location to: ' + locationToSet);
}
function getLocationFromDirection(direction) {
  var locations = [cardDisplayLocations.bottom, cardDisplayLocations.left, cardDisplayLocations.top, cardDisplayLocations.right];
  var directions = ['north','east','south','west'];
  var spotIndex = directions.findIndex(function (direction) {return direction === spot});
  var desiredDirectionIndex = directions.findIndex(function (dir) {return dir === direction});
  if (spotIndex > desiredDirectionIndex) {
    return locations[Math.abs(spotIndex - (desiredDirectionIndex + 4))];
  }
  else {
    return locations[Math.abs(desiredDirectionIndex - spotIndex)];
  }
}
//#endregion
//#region Sound Stuff
function loadSounds(){
  if (!preferences.sound.isEnabled) return;

  //#region Loading Preference Sounds
  for (var key in preferences.sound) {
    if (Object.hasOwnProperty.call(preferences.sound, key)) {
      var preferedSound = preferences.sound[key];
      if (preferedSound === true) continue;

      if (preferedSound !== '') {
        var nextVolume = soundVolumes[preferedSound] ? (soundVolumes[preferedSound] * preferences.sound.defaultVolume) : preferences.sound.defaultVolume;
        sounds[key] = new Howl(
        {
          src: ['/sounds/'+preferedSound+'.mp3'],
          volume: nextVolume,
        });
      }

      if (key === 'roundEndAnimation') {
        sounds[key].on('end', checkWhoWonAndPlayTheirSound);
      }
    }
  }
  //#endregion
  //#region Loading RoundWinSounds
  for (var username in roundWinSounds) {
    if (Object.hasOwnProperty.call(roundWinSounds, username)) {
      var roundWinSound = roundWinSounds[username];
      sounds['roundWinSounds'][username] = new Howl(
      {
        src: ['/sounds/'+roundWinSound+'.mp3'],
        volume: soundVolumes[roundWinSound] ? soundVolumes[roundWinSound] * preferences.sound.defaultVolume: preferences.sound.defaultVolume,
      });
    }
  }
  //#endregion
}
function checkWhoWonAndPlayTheirSound() {
  if (sounds && sounds['roundWinSounds'] && roundWinSounds[roundWinner])
    sounds.roundWinSounds[roundWinner].play();
  else {
    sounds['roundWon'].play();
  }
}
//#endregion
//#region Helpers 
function getMinMaxOfSuit(cardAsNumber) {
  var suitMinValue, suitMaxValue;
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
}

function getLinearPercentOfMaxMatchWithinRange(currentTrackedValue, minTrackedValue, maxTrackedValue, startOutputValue, endOutputValue) {
  //returns a value between a given input range that correlates to the value of variable as it changes within a different range.  If the tracked variable goes about the maxCutoff then it assumes the max value possible.  If it goes anywhere below the min value.  Any where inbetween is linearly correlated to the trackedValue.

  if (currentTrackedValue >= maxTrackedValue) return endOutputValue;
  if (currentTrackedValue <= minTrackedValue) return startOutputValue;

  var trackedValueRange = Math.abs(maxTrackedValue - minTrackedValue);
  var outputValueRange = Math.abs(endOutputValue - startOutputValue) ;
  var amountAboveMin = currentTrackedValue - minTrackedValue;
  var percentOfRange = amountAboveMin / trackedValueRange;

  if (startOutputValue <= endOutputValue) return startOutputValue + (percentOfRange * outputValueRange);
  else {
    return startOutputValue - (percentOfRange * outputValueRange);
  }
}
//#region Change Playable Cards Stuff 
function changeCardName(handArray, arePlayable, isExposedHand) {
  if (handArray === undefined || handArray === null) return handArray;
  var leadCard = getLeadCard();
  var suitMinMax = getMinMaxOfSuit(leadCard);
  var flatHand = handArray.flatten(2);
  for (var i = 0; i < flatHand.length; i++) {
    var card = flatHand[i];
    if (arePlayable || isExposedBottom || isExposedHand) {
      var mustFollowSuit = flatHand.some(function (card) {return card >= suitMinMax.min && card <= suitMinMax.max});
      if (!declarerCanPlayFromExposed && isExposedHand) {
        deck[card].name = null;
        if (mustFollowSuit && (card < suitMinMax.min || card > suitMinMax.max)) {
            if (!cardsToRemoveFromThinkingAnimation.includes(card)) cardsToRemoveFromThinkingAnimation.push(card);
        }
        continue;
      }
      if (mustFollowSuit) {
        if (card >= suitMinMax.min && card <= suitMinMax.max) {
          if (declarerCanPlayFromExposed && isExposedHand) {
            deck[card].name = cardValuesOrder[card];
          }
          else if (!declarerCanPlayFromExposed && isExposedHand) {
            deck[card].name = null;
          }
          else {
            deck[card].name = cardValuesOrder[card];
          }
        }
        else {
          deck[card].name = null;
          if (!cardsToRemoveFromThinkingAnimation.includes(card)) {
            cardsToRemoveFromThinkingAnimation.push(card);
          }
        }
      }
      else {
        deck[card].name = cardValuesOrder[card];
      }
    }
    else {
      deck[card].name = null;
    } 
  }
}
function changePlayableCards() {
  // if (isAppleDevice || usernamesWhoCannotPlayOnTurn.includes(queryString.username)) return;
  if (isAppleDevice) return;
  if (shouldChangePlayableCards === false) return null;

  //#region Changing Playable Cards and Setting cardsToRemoveFromThinkingAnimation
  cardsToRemoveFromThinkingAnimation = [];
  if (isExposedBottom || !isTurnToPlay) {
    changeCardName(hand, null);
    changeCardName(exposedHand, null, true);
  }
  else if (declarerCanPlayFromExposed) {
    changeCardName(hand, null);
    changeCardName(exposedHand, true, true);
  }
  else {
    changeCardName(hand, true);
    changeCardName(exposedHand, null, true);
  }
  shouldChangePlayableCards = false;
  //#endregion

  //#region Setting Up Animating Card Thinking
  var animatedCardAsNumber, isAnimatingHand, isAnimatingExposedHand;
  if (cardsToAnimate[0] && cardsToAnimate[0].image && cardsToAnimate[0].image.src && !cardsToAnimate[0].image.src.match(/cardback/i)) {
    animatedCardAsNumber = getCardAsNumberFromName(cardsToAnimate[0].name);
    isAnimatingHand = isInHand(animatedCardAsNumber, hand);
    isAnimatingExposedHand = isInHand(animatedCardAsNumber, exposedHand);
  }
  if (!isAnimatingExposedHand && !isAnimatingHand) return;
  cardsToAnimate = [];
  populateCardsToAnimateFromHandArray(isAnimatingHand ? hand : exposedHand);
  //#endregion
}
//#endregion
//#region Displaying Stuff
function getCardAsNumberFromName(name) {
  // take a string name of a card ('ace of clubs' and return a number 0-51)
  if (!name) return null;
  return cardValuesOrder.findIndex(function (value) {
    return value.toLowerCase() === name.toLowerCase();
  });
}
function resizeCards(handArray, desiredCardHeightSize, actualCardHeightSize) {
  if (handArray === undefined || handArray === null) return;
  var flatHand = handArray.flatten(2);
  desiredCardHeightSize = (desiredCardHeightSize == undefined) ? cardHeight : desiredCardHeightSize;
  for (var i = 0; i < flatHand.flatten(2).length; i++) {
    var cardAsNumber = flatHand.flatten(2)[i];
    var card = deck[cardAsNumber];
    if (Math.round(card.rotation) === -90 || Math.round(card.rotation) === 90) {
      var cardWidthLocal = deck[cardAsNumber].bounds.width;
      actualCardHeightSize = (actualCardHeightSize == undefined) ? cardWidthLocal : actualCardHeightSize;
      if (cardWidthLocal !== 0 && actualCardHeightSize !== cardWidthLocal) actualCardHeightSize = cardWidthLocal;
      card.scale(desiredCardHeightSize / actualCardHeightSize);
    }
    else {
      var cardHeightLocal = deck[cardAsNumber].bounds.height;
      actualCardHeightSize = (actualCardHeightSize == undefined) ? cardHeightLocal : actualCardHeightSize;
      if (cardHeightLocal !== 0 && actualCardHeightSize !== cardHeightLocal) actualCardHeightSize = cardHeightLocal;
      card.scale(desiredCardHeightSize / actualCardHeightSize)
    }
  }
}
function reverseHandLayerOrder(handArray) {
  if (handArray === undefined || handArray === null) return null;
  var flatHand = handArray.flatten(2);
  for (var i = flatHand.length - 1; i >= 0 ; i--) {
    var cardAsNumber = flatHand[i];
    project.activeLayer.addChild(deck[cardAsNumber]);
  }
}
function rotateCards(handArray, desiredRotation) {
  if (handArray === undefined || handArray === null || desiredRotation === undefined || desiredRotation === null) return null;
  var flatHand = handArray.flatten(2);
  for (var i = 0; i < flatHand.length; i++) {
    var cardAsNumber = flatHand[i];
    deck[cardAsNumber].rotation = desiredRotation;
  }
}
function redisplayHandArray (card, isFromHand, isFromExposedHand) {
  movePath = false;
  cardAsNumber = card;
  if (typeof card !== 'number') {
    cardAsNumber = getCardAsNumberFromName(card);
  }
  if (isFromHand === undefined) isFromHand = isInHand(cardAsNumber, hand);
  if (isFromExposedHand === undefined) isFromExposedHand = isInHand(cardAsNumber, exposedHand);
  if (isFromHand) {
    hand = reArrangeSuitsInHand(hand);
  }
  if (isFromExposedHand) {
    exposedHand = reArrangeSuitsInHand(exposedHand);  
  }
  // if (isExposedBottom) debugger;
  if (isMobile) {
    if (isFromHand) {      
      if (!isExposedBottom) {
        resizeCards(hand, smallCardHeight / exposedHandShrinkAmountMobile);
        displayHandMobile(hand, cardDisplayLocations.bottom);
      }
      else {
        displayHandMobile(exposedHand, cardDisplayLocations.bottom);
        resizeCards(exposedHand, smallCardHeight);
      }
    }
    else if (isFromExposedHand) { 
      if (isExposedTop) {
        resizeCards(exposedHand, smallCardHeight);
        var params = getParametersToDrawExposedHandMobile();
        displayExposedHandMobile(params.startPoint, params.endPoint, params.desiredHeight, params.desiredSpacing, params.x);
      }
      else if (isExposedBottom) {
        displayHandMobile(exposedHand, cardDisplayLocations.bottom);
        resizeCards(exposedHand, smallCardHeight);
      }
    }
  }
  else {
    if (isFromExposedHand) {
      displayExposedHand();
    }
    else if (isFromHand) {
      displayHandAsLine();
    }
  }
}
function display() {
  if (isMobile) {
    if (isExposedRight) exposedHandSideXOffset = marginAmount;
    else if (isExposedLeft) exposedHandSideXOffset = -marginAmount;
    smallCardWidth = cardWidth * exposedHandShrinkAmountMobile;
    smallCardHeight = cardHeight * exposedHandShrinkAmountMobile;
    widthFactorTopBottomMobile = canvasWidth / 13;
    widthFactorLeftRightMobile =  (smallCardHeight * 2) / 18;
    nonHandCardHideFactor = 4;   //lower is less
    amountOfBottomHandShownOffset = cardHeight / 4.5;   //lower is less
    amountOfBottomHandShown = cardHeight / 2 - amountOfBottomHandShownOffset;
    var smallerHandHeight = smallCardHeight;
    amountOfTopHandShown = smallerHandHeight / 2 - smallerHandHeight / nonHandCardHideFactor;   //lower is less
    
    heightTakenUpByTopHand = isExposedTop || isExposedBottom? smallerHandHeight : amountOfTopHandShown;
    heightTakenUpByBottomHand = exposedHandLocation.toLowerCase() !== cardDisplayLocations.bottom ? amountOfBottomHandShown : amountOfTopHandShown;

    greenSpaceAvailable = canvasHeight - heightTakenUpByTopHand - heightTakenUpByBottomHand;
    greenSpaceCenter =  heightTakenUpByTopHand + greenSpaceAvailable / 2;

    displayCardPlayedAreas();
    drawBorders();
    displayHandsMobile();
    // changeInfoColors();
  }
  else {
    setDeclarerUIHandScaleFactor();
    displayCardPlayedAreas();
    displayCards();
    displayHiddenHands();
  }
  printAllTexts();
  displayPlayAreaCards();
  checkHandAndExposedHandLengths();
  setScoreLabels();
  loadComplete = true;
}
// function changeInfoColors() {
//   debugger;
//   const textColor = playAreaAsPaperObj.fillColor;
//   const fillColor = playAreaAsPaperObj.fillColor;

//   dealInformation.fillColor = fillColor;
//   dealInformation.fillColor = fillColor;
//   gameInformation.fillColor = fillColor;
//   gameInformation.fillColor = fillColor;
// }
function setDeclarerUIHandScaleFactor() {
  var maxTrackedValue = 1600;
  var minOutputValue = 1.5;
  var maxOutputValue = 2;
  if (canvasWidth <= 715){ 
    maxTrackedValue = 715;
    minOutputValue = 1.1;
    maxOutputValue = 1.5;
  }
  declarerUIHandScaleFactor = getLinearPercentOfMaxMatchWithinRange(canvasWidth, mobileMaxWidth, maxTrackedValue, minOutputValue, maxOutputValue);
}
function checkHandAndExposedHandLengths() {
  if (exposedHandLocation !== cardDisplayLocations.bottom) {
    if (hand.flatten(2).length !== handLengths[spot]) globals.getHand();
  }
  else {
    if (hand.flatten(2).length !== handLengths[getDirectionFromLocation(cardDisplayLocations.top)]) globals.getHand();
  }
  var exposedHandDirection = getDirectionFromLocation(exposedHandLocation);
  if (exposedHand && exposedHand.flatten(2).length !== handLengths[exposedHandDirection]) globals.getExposedHand();
}
function displayPlayAreaCards() { 
  if (!shouldDisplayPlayAreaCards) return;
  setPlayAreaCards();
  if (isFirstTimeDisplayingPlayAreaCards || isAppleDevice) {
    var positionPlayAreaCards = setInterval(function() {
      var shouldWait = false;
      for (var i = 0; i < playedCards.length; i++) {
        var card = deck[playedCards[i]];
        if (!card) break;
        if (card.bounds.height === 0) {
          shouldWait = true;
          break;
        }
      }
      if (!shouldWait) {
        clearInterval(positionPlayAreaCards);
        isFirstTimeDisplayingPlayAreaCards = false;
        positionAndRotatePlayAreaCards();
      }
    }, checkCardLoadInterval);
  }
  else {
    positionAndRotatePlayAreaCards();
  }
}
function positionAndRotatePlayAreaCards() {
  // hand = reArrangeSuitsInHand(hand);
  exposedHand = reArrangeSuitsInHand(exposedHand); 
  var nthRound = Math.floor((playedCards.length - 1) / 4);
  var currentRound = playedCards.slice(nthRound * 4);
  for (var i = 0; i < currentRound.length; i++) {
    var isFromHand = removeCardFromHandArray(currentRound[i], hand);
    var isFromExposedHand = removeCardFromHandArray(currentRound[i], exposedHand);
    var card = deck[currentRound[i]];
    if (!card) continue;
    var roundedCardRotation = card && card.rotation ? Math.round(card.rotation) : 0;
    if (topPlayAreaCard === currentRound[i]) {
      if (roundedCardRotation !== 0 && roundedCardRotation !== 180) {
        card.scale(rightPlayArea.bounds.height / card.bounds.width);
      }
      else {
        card.scale(topPlayArea.bounds.height / card.bounds.height);
      }
      card.rotation = 180;
      card.position = topPlayArea.position;
    } 
    if (bottomPlayAreaCard === currentRound[i]) {
      if (roundedCardRotation !== 0 && roundedCardRotation !== 180) {
        card.scale(rightPlayArea.bounds.height / card.bounds.width);
      }
      else {
        card.scale(bottomPlayArea.bounds.height / card.bounds.height);
      }
      card.rotation = 0;
      card.position = bottomPlayArea.position;
    }
    //necessary to check initial rotation for right
    if (rightPlayAreaCard === currentRound[i]) {
      if (roundedCardRotation !== 0 && roundedCardRotation !== 180) {
        card.scale(rightPlayArea.bounds.height / card.bounds.height);
      }
      else {
        card.scale(rightPlayArea.bounds.height / card.bounds.width);
      }
      card.rotation = -90;
      card.position = rightPlayArea.position;
    }
    if (leftPlayAreaCard === currentRound[i]) {
      //necessary to check initial rotation for left
      if (roundedCardRotation !== 0 && roundedCardRotation !== 180) {
        card.scale(rightPlayArea.bounds.height / card.bounds.height);
      }
      else {
        card.scale(leftPlayArea.bounds.height / card.bounds.width);
      }
      card.rotation = 90;
      card.position = leftPlayArea.position;
    }
    project.activeLayer.addChild(card);
    card.name = null;
    // redisplayHandArray(currentRound[i], isFromHand, isFromExposedHand);
  }
}
function setPlayAreaCards(){
  if (!shouldDisplayPlayAreaCards) return;
  //this necessary to prevent the last four cards from being placed in playareas if the round end animation has already completed
  if (!playedCards) return;
  if (playedCards.length % 4 === 0 && playedCards.length > 0 && roundEndAnimationComplete) {
    // console.log('RETURNING WITHOUT DOING ANYTHING IN SET PLAYAREA CARDS');
    return;
  }
  setLocationNameVariables();
  var nthRound = Math.floor((playedCards.length - 1) / 4);
  var currentRound = playedCards.slice(nthRound * 4);

  //#region Positioning Played Cards in Play Areas
  if (playedCards.length % 4 === 0 && (roundStartPlayer === undefined || roundStartPlayer === null)) {
    if (playedCards.length <= 4) roundStartPlayer = getNameFromLocation(getLocationFromDirection(getRotationsAround(declarersSpot, 1)));
    else {
      if (hasRequestedRoundStartPlayer === false) globals.getRoundStartPlayer();
      hasRequestedRoundStartPlayer = true;
      roundStartPlayer = getNameFromLocation(getLocationFromDirection(getRotationsAround(queryString.spot, 1)));
    }
  }
  if (playedCards && playedCards.length > 0 && currentRound.length > 0 && roundStartPlayer) {
    if (topName === roundStartPlayer) {
      topPlayAreaCard = currentRound[0];
      if (currentRound.length >= 2) {
        rightPlayAreaCard = currentRound[1];
      }
      if (currentRound.length >= 3) {
        bottomPlayAreaCard = currentRound[2];
      }
      if (currentRound.length >= 4) {
        leftPlayAreaCard = currentRound[3];
      }
    }
    else if (rightName === roundStartPlayer) {
      rightPlayAreaCard = currentRound[0];
      if (currentRound.length >= 2) {
        bottomPlayAreaCard = currentRound[1];
      }
      if (currentRound.length >= 3) {
        leftPlayAreaCard = currentRound[2];
      }
      if (currentRound.length >= 4) {
        topPlayAreaCard = currentRound[3];
      }
    }
    else if (bottomName === roundStartPlayer) {
      bottomPlayAreaCard = currentRound[0];
      if (currentRound.length >= 2) {
        leftPlayAreaCard = currentRound[1];
      }
      if (currentRound.length >= 3) {
        topPlayAreaCard = currentRound[2];
      }
      if (currentRound.length >= 4) {
        rightPlayAreaCard = currentRound[3];
      }
    }
    else if (leftName === roundStartPlayer) {
      leftPlayAreaCard = currentRound[0];
      if (currentRound.length >= 2) {
        topPlayAreaCard = currentRound[1];
      }
      if (currentRound.length >= 3) {
        rightPlayAreaCard = currentRound[2];
      }
      if (currentRound.length >= 4) {
        bottomPlayAreaCard = currentRound[3];
      }
    }
  }
  //#endregion
}
function removeCardFromHandArray(cardAsNumber, handArray){
  if (handArray === undefined || handArray === null) return handArray;
  var shouldContinue = true;
  for (var i = 0; i < handArray.length; i++) {
    var suit = handArray[i];
    for (var j = 0; j < suit.length; j++) {
      var cardAsNumberFromhand = suit[j];
      if (cardAsNumberFromhand === cardAsNumber) {
        if (isInHand(cardAsNumber, hand)) hand[i].splice(j, 1);
        else if (isInHand(cardAsNumber, exposedHand)) exposedHand[i].splice(j, 1);
        shouldContinue = false;
        return true;
        break;
      }
    }
    if (!shouldContinue) break;
  }
  return false;
}
function getDirectionFromLocation(location) {
  var rotations = {
    bottom: 0,
    left: 1,
    top: 2,
    right: 3,
  }
  var directions = ['north','east','south','west'];
  var numberOfRotations = rotations[location];
  var directionIndex = directions.findIndex(function (direction) { return direction === spot});
  return directions[(numberOfRotations + directionIndex) % 4]
}
function resetAfterPlay(cardAsNumber){
  //#region Remove Card from Respective Hand and Redisplay that hand
  var isFromExposedHand = isInHand(cardAsNumber, exposedHand);
  var isFromHand = isInHand(cardAsNumber, hand);
  if (isFromHand) removeCardFromHandArray(cardAsNumber, hand);
  else if (isFromExposedHand) removeCardFromHandArray(cardAsNumber, exposedHand);
  redisplayHandArray(cardAsNumber);
  //#endregion
}
function reArrangeSuitsInHand(handArray) {
  if(handArray === undefined || handArray === null) return handArray;
  
  handArray = handArray.filter(function (suit) {
    return suit.length > 0;
  })
  
  if (handArray.length < 3) {
    return handArray;
  }

  var orderOfSuits = getOrderOfSuitsForHandArray(handArray);
  var desiredOrderOfSuits;
  var isFromExposedHand = exposedHand && JSON.stringify(handArray) === JSON.stringify(exposedHand.filter(function (suit) {return suit.length > 0}));
  var isFromHand = JSON.stringify(handArray) === JSON.stringify(hand.filter(function (suit) {return suit.length > 0}));

  if ((isFromExposedHand && preferences.trumpOnLeftExposedHand === true) || (isFromHand && preferences.trumpOnLeftHand === true)) {
    desiredOrderOfSuits = getDesiredOrderForTrumpOnLeft();
  }
  else {
    desiredOrderOfSuits = getDesiredOrderForGeneric();
  }

  if (JSON.stringify(orderOfSuits) === JSON.stringify(desiredOrderOfSuits)) return handArray;
  
  var reArranged = reArrangeHandArray(orderOfSuits, desiredOrderOfSuits, handArray.filter(function (suit) {return suit.length > 0}))
  return ensureThreeSuitColorAlternation(reArranged, isFromHand, isFromExposedHand).filter(function (item) {
    return item !== undefined && item !== null && item.length > 0;
  });;
}
function moveTrumpToLeftOfExposedHand(suitSortPreference) {
  //moves the trump suit to the left and alternates the remaining suits
  var orderOfSuits = getOrderOfSuitsForHandArray(exposedHand);
  //get the desired order based on suit sort preference and contract:
  var desiredOrderOfSuits;
  if (!trumpSuit) {
    desiredOrderOfSuits = (suitSortPreference === sortPreferences.descending) ? [suits.spades, suits.hearts, suits.clubs, suits.diamonds] : [suits.clubs, suits.diamonds, suits.spades, suits.hearts] 
  }
  else {
    desiredOrderOfSuits = getDesiredOrderForTrumpOnLeft();
  }
  
  var reArranged = reArrangeHandArray(orderOfSuits, desiredOrderOfSuits, exposedHand ? exposedHand.filter(function (suit) {return suit.length > 0}) : null);
  reArranged = ensureThreeSuitColorAlternation(reArranged);

  // console.log('exposedHand in reorder =', exposedHand);
  // console.log('hand predicted: someValue; actual =', hand);
  // console.log('trumpSuit predicted: someValue; actual =', trumpSuit);
  // console.log('orderOfSuits predicted: someValue; actual =', orderOfSuits);
  // console.log('desiredOrderOfSuits predicted: someValue; actual =', desiredOrderOfSuits);
  // console.log('reArranged predicted: someValue; actual =', reArranged);

  exposedHand = reArranged;
  // console.log('exposedhand final =', exposedHand);
}
function ensureThreeSuitColorAlternation(handArray, isFromHand, isFromExposedHand, trumpOnLeftHandInput) {
  //need to check handTemp suit order and change if there are two of the same color in a row and three or more suits
  if (handArray === undefined || handArray === null || preferences === undefined || preferences === null) return handArray;
  if (trumpOnLeftHandInput !== undefined) preferences.trumpOnLeftHand = trumpOnLeftHandInput;

  if (handArray.length === 3){
    var orderOfSuits = getOrderOfSuitsForHandArray(handArray);
    var desiredOrderOfSuits;
    if (preferences.trumpOnLeftExposedHand === true && isFromExposedHand || preferences.trumpOnLeftHand === true && isFromHand){
      //#region Clubs
      if (orderOfSuits[0] === suits.clubs) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.spades, suits.diamonds])) desiredOrderOfSuits = [suits.clubs, suits.diamonds, suits.spades];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.spades, suits.hearts])) desiredOrderOfSuits = [suits.clubs, suits.hearts, suits.spades];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.hearts, suits.diamonds])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.diamonds, suits.hearts] : [suits.clubs, suits.hearts, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.diamonds, suits.hearts])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.diamonds, suits.hearts] : [suits.clubs, suits.hearts, suits.diamonds];
      }
      //#endregion
      //#region Diamonds
      else if (orderOfSuits[0] === suits.diamonds) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.hearts, suits.clubs])) desiredOrderOfSuits = [suits.diamonds, suits.clubs, suits.hearts];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.hearts, suits.spades])) desiredOrderOfSuits = [suits.diamonds, suits.spades, suits.hearts];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.clubs, suits.spades])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.clubs, suits.spades] : [suits.diamonds, suits.spades, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.spades, suits.clubs])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.clubs, suits.spades] : [suits.diamonds, suits.spades, suits.clubs];
      }
      //#endregion
      //#region Hearts
      else if (orderOfSuits[0] === suits.hearts) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.diamonds, suits.clubs])) desiredOrderOfSuits = [suits.hearts, suits.clubs, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.diamonds, suits.spades])) desiredOrderOfSuits = [suits.hearts, suits.spades, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.clubs, suits.spades])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.hearts, suits.clubs, suits.spades] : [suits.hearts, suits.spades, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.spades, suits.clubs])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.hearts, suits.clubs, suits.spades] : [suits.hearts, suits.spades, suits.clubs];
      }
      //#endregion
      //#region Spades
      else if (orderOfSuits[0] === suits.spades) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.clubs, suits.diamonds])) desiredOrderOfSuits = [suits.spades, suits.diamonds, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.clubs, suits.hearts])) desiredOrderOfSuits = [suits.spades, suits.hearts, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.diamonds, suits.hearts])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.spades, suits.diamonds, suits.hearts] : [suits.spades, suits.hearts, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.hearts, suits.diamonds])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.spades, suits.diamonds, suits.hearts] : [suits.spades, suits.hearts, suits.diamonds];
      }
      //#endregion
    }
    else {
      //#region Clubs
      if (orderOfSuits[0] === suits.clubs) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.spades, suits.diamonds])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.diamonds, suits.spades] : [suits.spades, suits.diamonds, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.spades, suits.hearts])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.hearts, suits.spades] : [suits.spades, suits.hearts, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.hearts, suits.diamonds])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.clubs, suits.hearts] : [suits.hearts, suits.clubs, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.clubs, suits.diamonds, suits.hearts])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.clubs, suits.hearts] : [suits.hearts, suits.clubs, suits.diamonds];
      }
      //#endregion
      //#region Diamonds
      else if (orderOfSuits[0] === suits.diamonds) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.hearts, suits.clubs])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.clubs, suits.hearts] : [suits.hearts, suits.clubs, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.hearts, suits.spades])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.spades, suits.hearts] : [suits.spades, suits.hearts, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.spades, suits.clubs])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.diamonds, suits.spades] : [suits.spades, suits.diamonds, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.diamonds, suits.clubs, suits.spades])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.diamonds, suits.spades] : [suits.spades, suits.diamonds, suits.clubs];
      }
      //#endregion
      //#region Hearts
      else if (orderOfSuits[0] === suits.hearts) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.diamonds, suits.clubs])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.clubs, suits.hearts] : [suits.hearts, suits.clubs, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.diamonds, suits.spades])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.spades, suits.hearts] : [suits.hearts, suits.spades, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.spades, suits.clubs])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.hearts, suits.spades] : [suits.spades, suits.hearts, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.hearts, suits.clubs, suits.spades])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.hearts, suits.spades] : [suits.spades, suits.hearts, suits.clubs];
      }
      //#endregion
      //#region Spades
      else if (orderOfSuits[0] === suits.spades) {
        if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.clubs, suits.diamonds])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.diamonds, suits.spades] : [suits.spades, suits.diamonds, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.clubs, suits.hearts])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.clubs, suits.hearts, suits.spades] : [suits.spades, suits.hearts, suits.clubs];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.diamonds, suits.hearts])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.spades, suits.hearts] : [suits.hearts, suits.spades, suits.diamonds];
        else if (JSON.stringify(orderOfSuits) === JSON.stringify([suits.spades, suits.hearts, suits.diamonds])) desiredOrderOfSuits = (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) ? [suits.diamonds, suits.spades, suits.hearts] : [suits.hearts, suits.spades, suits.diamonds];
      }
      //#endregion
    }

    if (desiredOrderOfSuits){
      return reArrangeHandArray(orderOfSuits, desiredOrderOfSuits, handArray.filter(function (suit) {return suit.length > 0;}));
    }
  }
  return handArray;
}
function reArrangeHandArray(orderOfSuits, desiredOrderOfSuits, handArray) {
  //rearrange the suits to match desired order
  if (handArray === undefined || handArray === null) return handArray;
  var reArranged = [];
  for (var i = 0; i < desiredOrderOfSuits.length; i++) {
    var desired = desiredOrderOfSuits[i];
    for (var j = 0; j < orderOfSuits.length; j++) {
      var actual = orderOfSuits[j];
      if (actual === desired) {
        reArranged[reArranged.length] = handArray[j];
        break;
      }
    }
  }
  return reArranged;
}
function getOrderOfSuitsForHandArray(handArray){
  if (handArray === undefined || handArray === null) return handArray;
  var orderOfSuits = [];
  for (var i = 0; i < handArray.length; i++) {
    var suit = handArray[i];
    orderOfSuits.push(getSuitFromNumber(suit[0]));
  }
  return orderOfSuits.filter(function (item) {
    return item !== undefined && item !== null;
  });
}
function getTrumpSuit() {
  if (!contract) return;
  if (contract.match(/club/i)) return suits.clubs;
  else if (contract.match(/diamond/i)) return suits.diamonds;
  else if (contract.match(/heart/i)) return suits.hearts;
  else if (contract.match(/spade/i)) return suits.spades;
  else if (contract.match(/trump/i)) return suits.noTrump;
  return null;
}
function getSuitFromNumber(cardAsNumber) {
  var lengthOfSuit = 13;
  var suitsArray = [suits.clubs, suits.diamonds, suits.hearts, suits.spades];
  var index = Math.floor(cardAsNumber / lengthOfSuit);
  return suitsArray[index];
}
function getDesiredOrderForGeneric(suitSortPreferenceInput) {
  if (!preferences) return standardDescendingCardOrder;
  if (suitSortPreferenceInput !== undefined) preferences.suitSortPreference = suitSortPreferenceInput;
  return  (preferences.suitSortPreference.toLowerCase() === sortPreferences.descending) ? standardDescendingCardOrder : standardAscendingCardOrder;
}
function getDesiredOrderForTrumpOnLeft(suitSortPreferenceInput) {
  if (!preferences) return [suits.spades, suits.hearts, suits.clubs, suits.diamonds];
  if (suitSortPreferenceInput !== undefined) preferences.suitSortPreference = suitSortPreferenceInput;
  var desiredOrderOfSuits = [];
  if (trumpSuit === undefined) trumpSuit = getTrumpSuit();
  if (preferences.suitSortPreference.toLowerCase() === sortPreferences.descending){
    if (trumpSuit === suits.spades) desiredOrderOfSuits = [suits.spades, suits.hearts, suits.clubs, suits.diamonds];
    else if (trumpSuit === suits.hearts) desiredOrderOfSuits = [suits.hearts, suits.spades, suits.diamonds, suits.clubs];
    else if (trumpSuit === suits.clubs) desiredOrderOfSuits = [suits.clubs, suits.hearts, suits.spades, suits.diamonds];
    else if (trumpSuit === suits.diamonds) desiredOrderOfSuits = [suits.diamonds, suits.spades, suits.hearts, suits.clubs];
    else desiredOrderOfSuits = standardDescendingCardOrder;
  }
  else if (preferences.suitSortPreference.toLowerCase() === sortPreferences.ascending) {
    if (trumpSuit === suits.spades) desiredOrderOfSuits = [suits.spades, suits.diamonds, suits.clubs, suits.hearts];
    else if (trumpSuit === suits.hearts) desiredOrderOfSuits = [suits.hearts, suits.clubs, suits.diamonds, suits.spades];
    else if (trumpSuit === suits.clubs) desiredOrderOfSuits = [suits.clubs, suits.diamonds, suits.spades, suits.hearts];
    else if (trumpSuit === suits.diamonds) desiredOrderOfSuits = [suits.diamonds, suits.clubs, suits.hearts, suits.spades];
    else desiredOrderOfSuits = standardAscendingCardOrder;
  }
  return desiredOrderOfSuits;
}
function getHasTrump(cardsArray) {
  if (!cardsArray) return false;
  for (var i = 0; i < cardsArray.length; i++) {
    var card = cardsArray[i];
    var suitOfCard = getSuitFromNumber(card);
    if (!trumpSuit) trumpSuit = getTrumpSuit();
    if (trumpSuit && suitOfCard && suitOfCard.toLowerCase() === trumpSuit.toLowerCase()) {
      return true;
    }
  }
  return false;
}
function getCardIsTrump(card) {
  if (!card) return false;
  var cardSuit = getSuitFromNumber(card);
  if (cardSuit.toLowerCase() === trumpSuit.toLowerCase()) return true;
  return false;
}
//#endregion
//#region Label and Name Text Stuff
function convertNumStringToInt(numberAsString){
  var splitStr = numberAsString.split(' ');
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
}
function setTeamLabelsFromSeating() {
  northName = seating.north.trim();
  southName = seating.south.trim();
  eastName = seating.east.trim();
  westName = seating.west.trim();
  setPlayerLabels();

  if (northName.length > maxChars && canvasWidth < maxWidth) {
    northName = northName.slice(0,maxChars - 3) + "...";
  }  
  if (southName.length > maxChars && canvasWidth < maxWidth) {
    southName = southName.slice(0,maxChars - 3) + "...";
  }  
  if (eastName.length > maxChars && canvasWidth < maxWidth) {
    eastName = eastName.slice(0,maxChars - 3) + "...";
  }  
  if (westName.length > maxChars && canvasWidth < maxWidth) {
    westName = westName.slice(0,maxChars - 3) + "...";
  }  
}
function setPlayerLabels(){
  setLocationNameVariables();
  northName = seating.north.trim();
  southName = seating.south.trim();
  eastName = seating.east.trim();
  westName = seating.west.trim();
  switch (spot.toLowerCase()) {
    case 'north':
      texts.topPlayer.content = southName + ' (South)';
      texts.bottomPlayer.content = northName + ' (North)';
      texts.leftPlayer.content = eastName + ' (East)';
      texts.rightPlayer.content = westName + ' (West)';
      break;
    case 'south':
      texts.topPlayer.content = northName + ' (North)';
      texts.bottomPlayer.content = southName + ' (South)';
      texts.leftPlayer.content = westName + ' (West)';
      texts.rightPlayer.content = eastName + ' (East)';
      break;
    case 'east':
      texts.topPlayer.content = westName + ' (West)';
      texts.bottomPlayer.content = eastName + ' (East)';
      texts.leftPlayer.content = southName + ' (South)';
      texts.rightPlayer.content = northName + ' (North)';
      break;
    case 'west':
      texts.topPlayer.content = eastName + ' (East)';
      texts.bottomPlayer.content = westName + ' (West)';
      texts.leftPlayer.content = northName + ' (North)';
      texts.rightPlayer.content = southName + ' (South)';
      break;
  }

  //#region Position PlayerLabels
  if (isMobile) {
    if (texts.topPlayer.position) {
      texts.topPlayer.position.x = topPlayArea.position.x + exposedHandXOffset;
      texts.topPlayer.position.y = topPlayArea.bounds.top - marginAmountMobileInside;
    }
    if (texts.bottomPlayer.position) { 
      texts.bottomPlayer.position.x = bottomPlayArea.position.x + exposedHandXOffset;
      texts.bottomPlayer.position.y = bottomPlayArea.bounds.bottom + marginAmountMobileInside;
    }
    if (texts.leftPlayer.position) { 
      texts.leftPlayer.position.x = leftPlayArea.bounds.left - marginAmountMobileInside + exposedHandXOffset;
      texts.leftPlayer.position.y = leftPlayArea.position.y;
    }
    if (texts.rightPlayer.position) { 
      texts.rightPlayer.position.x = rightPlayArea.bounds.right + marginAmountMobileInside + exposedHandXOffset;
      texts.rightPlayer.position.y = rightPlayArea.position.y;
    }
  }
  else {
    var playAreaCardHeight = playAreaShrinkFactor * cardHeight;
    var topBottomX = topPlayArea.position.x;
    var leftRightY = bottomPlayArea.position.y - playAreaCardHeight / 2;
    texts.topPlayer.position = new Point([topBottomX, topPlayArea.position.y - playAreaCardHeight / 2 - marginAmount / 2]);
    texts.bottomPlayer.position = new Point([topBottomX, bottomPlayArea.position.y + playAreaCardHeight / 2 + marginAmount / 2]);
    texts.leftPlayer.position = new Point([leftPlayArea.position.x - playAreaCardHeight / 2 - marginAmount / 2, leftRightY]);
    texts.rightPlayer.position = new Point([rightPlayArea.position.x + playAreaCardHeight / 2 + marginAmount / 2, leftRightY]);
  }

  var colorToUse =  colorThemeValues && colorThemeValues['color'] ? colorThemeValues['color'] : playerLabelColor;
  texts.topPlayer.fillColor = colorToUse;
  texts.bottomPlayer.fillColor = colorToUse;
  texts.leftPlayer.fillColor = colorToUse;
  texts.rightPlayer.fillColor = colorToUse;

  //#endregion
  project.activeLayer.insertChild(0, texts.topPlayer);
  project.activeLayer.insertChild(0, texts.bottomPlayer);
  project.activeLayer.insertChild(0, texts.leftPlayer);
  project.activeLayer.insertChild(0, texts.rightPlayer);
}
function setLocationNameVariables() {
  topName = texts.topPlayer.content.replace(/\(.+?\)/i, '').trim();
  bottomName = texts.bottomPlayer.content.replace(/\(.+?\)/i, '').trim();
  leftName = texts.leftPlayer.content.replace(/\(.+?\)/i, '').trim();
  rightName = texts.rightPlayer.content.replace(/\(.+?\)/i, '').trim();
}
function getNameFromLocation(location){
  if (location.toLowerCase() === cardDisplayLocations.top) return texts.topPlayer.content.replace(/\(.+?\)/i, '').trim();
  else if (location.toLowerCase() === cardDisplayLocations.bottom) return texts.bottomPlayer.content.replace(/\(.+?\)/i, '').trim();
  else if (location.toLowerCase() === cardDisplayLocations.left) return texts.leftPlayer.content.replace(/\(.+?\)/i, '').trim();
  else if (location.toLowerCase() === cardDisplayLocations.right) return texts.rightPlayer.content.replace(/\(.+?\)/i, '').trim();
}
function getLocationFromName(username) {
  if (!username || !texts.topPlayer || !texts.bottomPlayer || !texts.leftPlayer || !texts.rightPlayer) return null;
  if (username === texts.topPlayer.content.replace(/\(.+?\)/i, '').trim()) return cardDisplayLocations.top;
  else if (username === texts.bottomPlayer.content.replace(/\(.+?\)/i, '').trim()) return cardDisplayLocations.bottom;
  else if (username === texts.leftPlayer.content.replace(/\(.+?\)/i, '').trim()) return cardDisplayLocations.left;
  else if (username === texts.rightPlayer.content.replace(/\(.+?\)/i, '').trim()) return cardDisplayLocations.right;
  else throw('incorrect location for getlocationfromname');
}
function setVulnerableLabeL() {
  // console.log('setVulnerableLabeL-------------------------');
  if (!texts.isVulnerable.content) return;
  //#region Get teamToGet
  var teamToGet;
  if (declarersSpot.toLowerCase() === locations.north || declarersSpot.toLowerCase() === locations.south) {
    teamToGet = scoring.northSouth;
  }
  else if (declarersSpot.toLowerCase() === locations.east || declarersSpot.toLowerCase() === locations.west) {
    teamToGet = scoring.eastWest;
  }
  //#endregion
  texts.isVulnerable.content = teamToGet.isVulnerable ? 'Yes' : 'No';
  return teamToGet.isVulnerable ? 'Yes' : 'No';
}
function changeTrickLabels() {
  var number = parseInt(texts.contract.content);
  var offense = false;
  if (exposedHandSpot.toLowerCase() === locations.north || exposedHandSpot.toLowerCase() === locations.south) {
    if (spot.toLowerCase() === locations.north || spot.toLowerCase() === locations.south) {
      offense = true;
    }
  }
  else if (exposedHandSpot.toLowerCase() === locations.east || exposedHandSpot.toLowerCase() === locations.west) {
    if (spot.toLowerCase() === locations.east || spot.toLowerCase() === locations.west) {
      offense = true;
    }
  }

  if (offense) { 
    texts.tricksNeededLabel.content = 'Tricks:';
    texts.tricksNeededTotal.content = 6 + number + ' Needed';
  }
  else {
    texts.tricksNeededTotal.content = 13 - (6 + number) + 1;
  }

  var tricksLeft = getTricksLeft();
  texts.trickNumber.content = tricksLeft;
}
function getTricksLeft() {
  return getMinMaxValues(handLengths).max;
}
function setLastTrick() {
  if (!playedCards) return null;
  var nthRound = Math.floor(playedCards.length / 4);
  if (nthRound >= 1) {
    var lastTrick = playedCards.slice((nthRound - 1) * 4, (nthRound - 1) * 4 + 4);
    var hasGottenLastRoundStartPlayer = false;
    for (var i = 0; i < lastTrick.length; i++) {
      //#region Getting the Number/Letter of the Tricks
      //the the value 0-12 of the card and convert it to a one char string "e.g. 2,10,J,Q,K,A"
      var cardValueAsShortenedString = globals.convertIntCardValueToCharacter(lastTrick[i] % 13);
      var textName;
      if (i === 0) textName = "lastTrickOne";
      if (i === 1) textName = "lastTrickTwo";
      if (i === 2) textName = "lastTrickThree";
      if (i === 3) textName = "lastTrickFour";
      texts[textName].content = cardValueAsShortenedString;
      //#endregion
      //#region Setting up the Trick Images
      var cardName = cardValuesOrder[lastTrick[i]];
      if (!cardName) return;
      var tempRaster;
      if (cardName.match(/club/i)) {
        tempRaster = new Raster('club');
        tempRaster.scale(0.83);
      }
      else if (cardName.match(/diamond/i)) {
        tempRaster = new Raster('diamond');
        tempRaster.scale(.87);
      }
      else if (cardName.match(/heart/i)) {
        tempRaster = new Raster('heart');
        tempRaster.scale(0.83);
      }
      else if (cardName.match(/spade/i)) {
        tempRaster = new Raster('spade');
        tempRaster.scale(0.83);
      }
      tempRaster.scale(suitScaleFactor * DEFAULT_FONT_SIZE);
      tempRaster.smoothing = true;
      if (i === 0) lastTrickOneImg = tempRaster;
      if (i === 1) lastTrickTwoImg = tempRaster;
      if (i === 2) lastTrickThreeImg = tempRaster;
      if (i === 3) lastTrickFourImg = tempRaster;
      //#endregion
      //#region Setting Last Trick Leader 
      if (!lastRoundStartPlayer && !hasGottenLastRoundStartPlayer) {
        globals.getLastRoundStartPlayer();
        hasGottenLastRoundStartPlayer = true;
      }
      if (i === 0 && lastRoundStartPlayer) {
        setLastTrickLetter(false);
      }
      //#endregion
    }
  }
  else {
    texts.lastTrickOne.content = "";
    texts.lastTrickTwo.content = "";
    texts.lastTrickThree.content = "";
    texts.lastTrickFour.content = "";
  }
}
function setLastTrickLetter(shouldLayoutLabels) {
  var location = getLocationFromName(lastRoundStartPlayer);
  var direction = getDirectionFromLocation(location);
  var singleCapitalizedLetter = direction ? direction.substr(0,1).toUpperCase() : '';
  texts.lastRoundStartPlayer.content = '(' + singleCapitalizedLetter + ')';
  if (shouldLayoutLabels) layoutDealLabels();
}
function setScoreLabels() {
  calculateAboveTheLineScores();
  calculateBelowTheLineScores();
  if(isMobile) layoutGameLabels();
}
function calculateAboveTheLineScores() {
  if (texts.aboveLineLabelWe && texts.aboveLineLabelThey) {
    if (spot.toLowerCase() === 'north' || spot.toLowerCase() === 'south') {
      texts.aboveLineLabelWe.content = scoring.northSouth.aboveTheLine;
      texts.aboveLineLabelThey.content = scoring.eastWest.aboveTheLine;
    }
    else if (spot.toLowerCase() === 'east' || spot.toLowerCase() === 'west') {
      texts.aboveLineLabelWe.content = scoring.eastWest.aboveTheLine;
      texts.aboveLineLabelThey.content = scoring.northSouth.aboveTheLine;
    }
  }
}
function calculateBelowTheLineScores() {
  if (!scoring || !scoring.gameRoundEndingScores || !scoring.gameRoundEndingScores.northSouth || !scoring.gameRoundEndingScores.eastWest) {
    return null;
  } 

  //#region Getting we and theyObjects
  var weBelowTheLineScores = [], theyBelowTheLineScores = [], weGameRoundEndValues = [], theyGameRoundEndValues = [];
  if (spot.toLowerCase() === 'north' || spot.toLowerCase() === 'south') {
    weBelowTheLineScores = scoring.belowTheLines.northSouth;
    theyBelowTheLineScores = scoring.belowTheLines.eastWest;
    weGameRoundEndValues = scoring.gameRoundEndingScores.northSouth;
    theyGameRoundEndValues = scoring.gameRoundEndingScores.eastWest;
  }
  else if (spot.toLowerCase() === 'east' || spot.toLowerCase() === 'west') {
    weBelowTheLineScores = scoring.belowTheLines.eastWest;
    theyBelowTheLineScores = scoring.belowTheLines.northSouth;
    weGameRoundEndValues = scoring.gameRoundEndingScores.eastWest;
    theyGameRoundEndValues = scoring.gameRoundEndingScores.northSouth;
  }
  //#endregion

  //#region Assigning values to xGameValueWe/They
  var firstGameValueWe = "";
  var firstGameValueThey = "";
  var secondGameValueWe = "";
  var secondGameValueThey = "";
  var thirdGameValueWe = "";
  var thirdGameValueThey = "";
  var lastWeValue = String(weBelowTheLineScores[weBelowTheLineScores.length - 1]);
  var lastTheyValue = String(theyBelowTheLineScores[theyBelowTheLineScores.length - 1]);
  if (weGameRoundEndValues.length === 0) {
    firstGameValueWe = lastWeValue;
    firstGameValueThey = lastTheyValue;
  }
  if (weGameRoundEndValues.length === 1) {
    firstGameValueWe = String(weGameRoundEndValues[0]);
    firstGameValueThey = String(theyGameRoundEndValues[0]);
    secondGameValueWe = lastWeValue;
    secondGameValueThey = lastTheyValue;
  }
  if (weGameRoundEndValues.length === 2) {
    firstGameValueWe = String(weGameRoundEndValues[0]);
    firstGameValueThey = String(theyGameRoundEndValues[0]);
    secondGameValueWe = String(weGameRoundEndValues[1]);
    secondGameValueThey = String(theyGameRoundEndValues[1]);
    thirdGameValueWe = lastWeValue;
    thirdGameValueThey = lastTheyValue;
  }
  if (weGameRoundEndValues.length >= 3) {
    throw ('this should never pop up');
  }
  //#endregion
  

  texts.firstGameLabelWe.content = firstGameValueWe;
  texts.firstGameLabelThey.content = firstGameValueThey;
  texts.secondGameLabelWe.content = secondGameValueWe;
  texts.secondGameLabelThey.content = secondGameValueThey;
  texts.thirdGameLabelWe.content = thirdGameValueWe;
  texts.thirdGameLabelThey.content = thirdGameValueThey;
}
//#endregion
//#region Misc
function capitalize(str, joinWith) {
  var split = str.split(' ');
  var capitalized = [];
  for (var i = 0; i < split.length; i++) {
    var word = split[i];
    if (word.trim() !== 'of') {
      capitalized.push(word[0].toUpperCase() + word.substring(1));
    }
    else {
      capitalized.push(word);
    }
  }
  return capitalized.join(joinWith);
}
function isInHand(cardAsNumber, handArray) {
  if (handArray === undefined || handArray === null || cardAsNumber === undefined || cardAsNumber === null) return;
  var flatHandArray = handArray.flatten(2);
  return flatHandArray.includes(cardAsNumber);
}
function pointsAreColocated(coordinateObj1, coordinateObj2, precision) {
  //return true if x and y values of each point are within precision pixels of one another
  if (coordinateObj1.x < 0 || coordinateObj1.y < 0 || coordinateObj2.x < 0 || coordinateObj2.y < 0 || coordinateObj1.x > canvasWidth || coordinateObj1.y > canvasHeight || coordinateObj2.x > canvasWidth || coordinateObj2.y > canvasHeight) return false;

  precision = (precision == undefined) ? 25 : precision;
  if (coordinateObj1._x && coordinateObj2._y) {
    if (Math.abs(coordinateObj1._x - coordinateObj2._x) > precision) return false;
    if (Math.abs(coordinateObj1._y - coordinateObj2.y) > precision) return false;
  }
  else if (coordinateObj1.x && coordinateObj2.y) {
    if (Math.abs(coordinateObj1.x - coordinateObj2.x) > precision) return false;
    if (Math.abs(coordinateObj1.y - coordinateObj2.y) > precision) return false;
  }
  else {
    throw "Points don't contain x and y coordinates.";
  }

  return true;
}
function getExpectedHandHeight(cardWidth, cardCount, spacing) {
  return cardWidth + (cardCount - 1) * spacing;
}
function isValidPlay(hitResult) {
  //determines if the position of the hitresult on mouse up is a play or not
    // if (isMobile) {
    //#region these two are needed if you want to play cards differently for mobile
    // if (hitResult.item.bounds.bottomLeft.y < canvasHeight - heightTakenUpByBottomHand && isFromHand && !declarerCanPlayFromExposed) {
    //   //TODO: case of playing from hand
    //   return true;
    // }
    // else if (hitResult.item.bounds.topLeft.y > heightTakenUpByTopHand && isFromExposedHand && exposedHandLocation.toUpperCase() === cardDisplayLocations.top && declarerCanPlayFromExposed) {
    //   //TODO: case of playing from exposedHand if it is top
    //   return true;
    // }
    //#endregion
    if (hitResult && leftPlayArea.bounds.bottomLeft.x < hitResult.item.bounds.center.x && rightPlayArea.bounds.bottomRight.x > hitResult.item.bounds.center.x && bottomPlayArea.bounds.bottomRight.y > hitResult.item.bounds.center.y && topPlayArea.bounds.topLeft.y < hitResult.item.bounds.center.y) {
      var roundedPlayX = Math.round(bottomPlayArea.bounds.center.x * 100 / 100);
      var roundedPlayY = Math.round(bottomPlayArea.bounds.center.y * 100 / 100);
      var roundedEventX = Math.round(hitResult.item.bounds.center.x * 100 / 100);
      var roundedEventY = Math.round(hitResult.item.bounds.center.y * 100 / 100);
      if (roundedPlayX !== roundedEventX || roundedPlayY !== roundedEventY) {
        if (isExposedTop && isFromExposedHand) return true;   //from exposedhand
        else if (isFromHand) return true;  //from hand
      }
    // }
  }
  else { 
    if (hitResult && leftPlayArea.bounds.bottomLeft.x < hitResult.item.bounds.bottomLeft.x && rightPlayArea.bounds.bottomRight.x > hitResult.item.bounds.bottomRight.x && bottomPlayArea.bounds.bottomRight.y > hitResult.item.bounds.bottomLeft.y && topPlayArea.bounds.topLeft.y < hitResult.item.bounds.topLeft.y) {
      var roundedPlayX = Math.round(bottomPlayArea.bounds.center.x * 100 / 100);
      var roundedPlayY = Math.round(bottomPlayArea.bounds.center.y * 100 / 100);
      var roundedEventX = Math.round(hitResult.item.bounds.center.x * 100 / 100);
      var roundedEventY = Math.round(hitResult.item.bounds.center.y * 100 / 100);
      if (roundedPlayX !== roundedEventX || roundedPlayY !== roundedEventY) {
        if (isExposedTop && isFromExposedHand) return true;   //from exposedhand
        else if (isFromHand) return true;  //from hand
      }
    }
  }
  return false;
}

function removePlayedCardsFromHands() {
  for (var i = 0; i < playedCards.length; i++) {
    var playedCard = playedCards[i];
    removeCardFromHandArray(playedCard, hand);
    removeCardFromHandArray(playedCard, exposedHand);
  }
}
function startIsAllowedToPlay(canPlayFromExposed, playedCardsFromServer) {
  disableCardThinkingAnimation = false;
  if (playedCardsFromServer) playedCards = playedCardsFromServer;
  cardsToRemoveFromThinkingAnimation = [];
  shouldChangePlayableCards = true;
  setPlayVariables(canPlayFromExposed);
}
//#endregion
//#endregion
//#region Socket Listeners
globals.draw = function (handFromServer, exposedHandFromServer, exposedHandLocationFromServer, exposedHandSpotFromServer, contractFromServer, canvasWidthFromServer, canvasHeightFromServer, spotFromServer, seatingFromServer, declarersSpotFromServer, playedCardsFromServer, handLengthsFromServer, usersTurnToPlayFromServer, roundStartPlayerFromServer, roundWinnersFromServer, preferencesFromServer, trickCountsFromServer, scoringFromServer, cardPlayTimerDurationValueFromServer, doubleMultiplierFromServer, lastRoundStartPlayerFromServer, isAppleDeviceFromServer, roundWinSoundsFromServer, colorThemesSourcesFromServer, colorThemeValuesFromServer) {
  if (handFromServer === undefined || handFromServer === null);
  view.viewSize.width = canvasWidthFromServer;
  view.viewSize.height = canvasHeightFromServer;
  preferences = preferencesFromServer;
  roundWinSounds = roundWinSoundsFromServer;
  colorThemeSources = colorThemesSourcesFromServer;
  colorThemeValues = colorThemeValuesFromServer;
  if (!currentTheme) currentTheme = preferences.colorTheme;
  setVariables();
  //#region Setting Everything from Server
  exposedHandLocation = exposedHandLocationFromServer;
  isExposedTop = exposedHandLocation.toLowerCase() === cardDisplayLocations.top;
  isExposedBottom = exposedHandLocation.toLowerCase() === cardDisplayLocations.bottom;
  isExposedLeft = exposedHandLocation.toLowerCase() === cardDisplayLocations.left;
  isExposedRight = exposedHandLocation.toLowerCase() === cardDisplayLocations.right;
  playedCards = playedCardsFromServer;
  firstPlayer = playedCards && playedCards.length === 0;
  contract = contractFromServer;
  roundStartPlayer = roundStartPlayerFromServer;
  cardPlayTimerDurationValue = cardPlayTimerDurationValueFromServer;
  doubleMultiplier = doubleMultiplierFromServer;
  lastRoundStartPlayer = lastRoundStartPlayerFromServer;
  handLengths = handLengthsFromServer;
  seating = seatingFromServer;
  spot = spotFromServer;
  declarersSpot = declarersSpotFromServer;
  exposedHandSpot = exposedHandSpotFromServer;
  isAppleDevice = isAppleDeviceFromServer;
  canvasHeight = view.size.height;
  canvasWidth = view.size.width;
  cardWidthPercentOfCavasWidth = canvasWidth > mobileMaxWidth ? fullSizeCardWidthPercentOfCavasWidth : mobileCardWidthPercentOfCavasWidth;
  cardHeightMaxPercent = canvasWidth > mobileMaxWidth ? fullSizecardHeightMaxPercent : mobilecardHeightMaxPercent;
  cardWidth = cardWidthPercentOfCavasWidth * canvasWidth;
  cardHeight = cardWidth * 1.5; 
  
  hand = handFromServer;
  exposedHand = exposedHandFromServer;
  roundWinners = roundWinnersFromServer;
  scoring = scoringFromServer;
  if (roundWinners) roundWinner = roundWinners[roundWinners.length - 1];
  else roundWinner = null;
  
  //#region Setting isTurnToPlay
  if (usersTurnToPlayFromServer === 1) isTurnToPlay = true;
  if (usersTurnToPlayFromServer === 2) {
    isTurnToPlay = true;
    declarerCanPlayFromExposed = true;
  }
  if(playedCards && playedCards.length > 0) {
    removePlayedCardsFromHands();
  }
  //#endregion
  trumpSuit = getTrumpSuit();
  if (preferences.trumpOnLeftExposedHand === true) moveTrumpToLeftOfExposedHand();
  //#endregion
  initializeVariables();

  //THIS IF CLAUSE NEEDS TO STAY BETWEEN THE ABOVE AND BELOW FUNCTIONS
  if (isMaxHeight) {
    cardHeight = cardHeightMaxPercent * canvasHeight;
    cardWidth = cardHeight / 1.5;
    shouldUseHeight = true;
  }

  loadSounds();
  generateDeckFromImages();
  changePlayableCards();
  hand = reArrangeSuitsInHand(hand);
  exposedHand = reArrangeSuitsInHand(exposedHand);  
  display();
  onResize(false);
  if (trickCountsFromServer && isMobile) setTrickCounts(trickCountsFromServer.northSouthTrickCount, trickCountsFromServer.eastWestTrickCount);
}
globals.invalidCardPlayed = function (cardAsNumber, playedCardsFromServer) {
  playedCards = playedCardsFromServer;
  if (deck[cardAsNumber]) deck[cardAsNumber].position = -1000,-1000;
  if (playedCards.includes(cardAsNumber)) {
    removeCardFromHandArray(cardAsNumber, hand);
    removeCardFromHandArray(cardAsNumber, exposedHand);
    hand = reArrangeSuitsInHand(hand);
    exposedHand = reArrangeSuitsInHand(exposedHand);
    display();
  }
  else {
    redisplayHandArray(cardAsNumber);
    displayPlayAreaCards();
  }
  shouldChangePlayableCards = true;
  changePlayableCards();
}
globals.validCardPlayed = function (cardAsNumber, playedCardsFromServer, handLengthsFromServer, roundStartPlayerFromServer) {
  if (needToResizeOnPlay) {
    onResize(false);
    needToResizeOnPlay = false;
  }
  if (typeof cardAsNumber !== 'number') return null;
  cardsToAnimate = [];
  cardsToRemoveFromThinkingAnimation = [];
  if (preferences && preferences.sound && preferences.sound.isEnabled) {
    sounds.userPlaysCard.play();
  }
  isLastPersonToPlay = true;
  if (texts && texts.instructionsTwo && texts.instructionsTwo.content !== '') resetInstructions();
  
  //this tells displayPlayAreaCards to only redraw after the first card in the round has been played
  roundEndAnimationComplete = false;
  handLengths = handLengthsFromServer;
  playedCards = playedCardsFromServer;
  roundStartPlayer = roundStartPlayerFromServer;
  
  //assign played card to a play area depending on exposed hand location
  if (declarerCanPlayFromExposed) topPlayAreaCard = cardAsNumber;
  else bottomPlayAreaCard = cardAsNumber;
  isTurnToPlay = false;
  declarerCanPlayFromExposed = false;
  deck[cardAsNumber].name = null;
  clickedOnItem = null;
  changePlayableCards();
  displayPlayAreaCards();   //TODO: this used to be the last line in this function
  redisplayHandArray(hand.flatten(2)[0], true, false);
  if (playedCards && playedCards.length % 4 === 0 && playedCards.length > 0){
      checkIfRoundEnd();
  }
}
globals.isAllowedToPlay = function (playedCardsFromServer) {
  if (preferences.sound.isEnabled === true) sounds['isYourTurnHand'].play();
  startIsAllowedToPlay(false, playedCardsFromServer);
}
globals.isAllowedToPlayFromExposedHand = function (playedCardsFromServer) {
  if (preferences.sound.isEnabled === true) sounds['isYourTurnExposed'].play();
  startIsAllowedToPlay(true, playedCardsFromServer);
}
globals.sendRoundWinnerAndTrickCounts = function (roundWinnerFromServer, northSouthTrickCount, eastWestTrickCount) {
  roundWinner = roundWinnerFromServer;
  if (roundWinners === undefined || roundWinners === null) roundWinners = [];
  roundWinners.push(roundWinnerFromServer);
  if (isMobile) setTrickCounts(northSouthTrickCount, eastWestTrickCount);
}
globals.updateDealLabels = function(tricks, tricksNeeded, contract, declarer) {
  if (tricks) texts.tricksNeeded.content = tricks.trim();
  if (tricksNeeded) texts.tricksNeeded.content = tricksNeeded.trim();
  if (contract) texts.contract.content = contract.trim();
  if (declarer) texts.declarer.content = declarer.trim();
}
globals.updateClients = function(cardAsNumber, location, playedCardsFromServer, handLengthsFromServer) {
  updateClientsAfterPlay(cardAsNumber, location, playedCardsFromServer, handLengthsFromServer)
}
function updateClientsAfterPlay (cardAsNumber, location, playedCardsFromServer, handLengthsFromServer) {
  if (playedCards.length >= 52) return;
  if (roundEndAnimation) {
    moveCardsForRoundEnd();
    // setTimeout(function () {
    //   console.log('waiting to update------------------------------------------------');
    //   return updateClientsAfterPlay (cardAsNumber, location, playedCardsFromServer, handLengthsFromServer)
    // }, 25);
  }
  // if (cardPlayAnimation) skipCardPlayAnimation();

  if (!hand || !exposedHand ) {
    globals.getHand();
    globals.getExposedHand();
  }
  // if (preferences.sound.isEnabled === true) sounds['cardPlayStart'].play();
  if  (isExposedBottom) cardsToRemoveFromThinkingAnimation = [];
  isLastPersonToPlay = false;
  displayPlayAreaCards();

  //this tells displayPlayAreaCards to only redraw after the first card in the round has been played
  resetCardPlayAnimation();
  waitForRoundEnd = true;
  needToSleepBeforeRoundEnd = true;
  roundEndAnimationComplete = false;
  hasEnteredRoundEndSleep = false;
  handLengths = handLengthsFromServer;
  playedCards = playedCardsFromServer;
  if (playedCards && playedCards.length % 4 === 1) roundStartPlayer = getNameFromLocation(location);
  
  // //#region This is necessary to have the hidden cards redraw immediately after cardPlay animation without and glitches
  var handLengthToDraw = handLengths[getDirectionFromLocation(location)];
  if (handLengthToDraw === 0) handLengthToDraw = 1;
  if (clientHasHiddenHandInLocation(location)) displayHiddenHands(); 
  // //#endregion
  initializePlayCardAnimation(cardAsNumber, location);
  resetAfterPlay(cardAsNumber); 
}
globals.startPlayTimer = function (startTime, playerName) {
  clearInterval(autoBidTimer);
  startAutoPlayTimer(startTime, getLocationFromName(playerName));
}
globals.resetTimer = function() {
  timeLeft = 1000;
  clearInterval(autoBidTimer);
}
globals.reArrangeHandArray = function (handArray, suitSortOrderPreference, trumpOnLeftPreference, contractInput) {
  var desiredOrderOfSuits = [];
  if (contractInput) contract = contractInput;
  if (trumpOnLeftPreference === true) desiredOrderOfSuits = getDesiredOrderForTrumpOnLeft(suitSortOrderPreference);
  else desiredOrderOfSuits = getDesiredOrderForGeneric(suitSortOrderPreference);
  
  var reArranged = reArrangeHandArray(getOrderOfSuitsForHandArray(handArray), desiredOrderOfSuits, handArray.filter(function (suit) {return suit.length > 0}));
  return ensureThreeSuitColorAlternation(reArranged, true, false, trumpOnLeftPreference);
}
globals.getSuitFromNumber = function (cardAsNumber) {
  return getSuitFromNumber(cardAsNumber);
}
globals.getTricksLeft = function () {
  return getTricksLeft();
}
globals.getUsersTurnToPlay = function () {
  return declarerCanPlayFromExposed === true ? 2 : isTurnToPlay === true ? 1 : 0;
}
globals.getIsExposedLeft = function() {
  return isExposedLeft;
}
globals.getLinearPercentOfMaxMatchWithinRange = function (currentTrackedValue, minTrackedValue, maxTrackedValue, startOutputValue, endOutputValue) {
  return getLinearPercentOfMaxMatchWithinRange(currentTrackedValue, minTrackedValue, maxTrackedValue, startOutputValue, endOutputValue);
}
globals.getPlayedCardsFromClient = function () {
  return playedCards;
}
globals.getMinMaxOfSuit = function (cardAsNumber) {
  return getMinMaxOfSuit(cardAsNumber);
}
globals.isDeclarer = function () {
  return isExposedTop;
}
globals.sendNewHandAfterClaimSome = function (handFromServer, exposedHandFromServer, handLengthsFromServer, playedCardsFromServer, roundWinnersFromServer){
  var desiredOrderOfSuits = getDesiredOrderForTrumpOnLeft();
  var orderOfSuitsInHand = getOrderOfSuitsForHandArray(handFromServer);
  var orderOfSuitsInExposedHand = getOrderOfSuitsForHandArray(exposedHandFromServer);

  var reArrangedHand = reArrangeHandArray(orderOfSuitsInHand, desiredOrderOfSuits, handFromServer.filter(function (suit) {return suit.length > 0}))
  hand = ensureThreeSuitColorAlternation(reArrangedHand, true, false).filter(function (item) {
    return item !== undefined && item !== null && item.length > 0;
  });;

  var reArrangedExposedHand = reArrangeHandArray(orderOfSuitsInExposedHand, desiredOrderOfSuits, exposedHandFromServer.filter(function (suit) {return suit.length > 0}))
  exposedHand = ensureThreeSuitColorAlternation(reArrangedExposedHand, false, true).filter(function (item) {
    return item !== undefined && item !== null && item.length > 0;
  });;

  handLengths = handLengthsFromServer;
  playedCards = playedCardsFromServer;
  roundWinners = roundWinnersFromServer;
  roundWinner = roundWinners[roundWinners.length - 1];
  onResize(false);
  setThinkingLocation();
}
globals.sendUpdateAfterUndo = function (playedCardsFromServer, roundWinnersFromServer, northSouthTrickCountFromServer, eastWestTrickCountFromServer, handLengthsFromServer) {
  cardsToAnimate = [], cardsToRemoveFromThinkingAnimation = [];
  resetRoundEndAnimation();
  resetCardPlayAnimation();
  waitForRoundEnd = true, needToSleepBeforeRoundEnd = true, hasEnteredRoundEndSleep = false;
  playedCards = playedCardsFromServer;
  roundWinners = roundWinnersFromServer;
  handLengths = handLengthsFromServer;
  if (isMobile) setTrickCounts(northSouthTrickCountFromServer, eastWestTrickCountFromServer);
  isTurnToPlay = false;
  declarerCanPlayFromExposed = false;
  if (playedCards.length === 0) exposedHand = null;
  if (playedCards.length % 4 === 0) shouldDisplayPlayAreaCards = false;
  onResize(false);
  shouldDisplayPlayAreaCards = true;
  setThinkingLocation();
  setTimeout(function() {
    redisplayHandArray(hand.flatten(2)[0], true, false);
    // if (isExposedBottom) redisplayHandArray(exposedHand.flatten(2)[0], false, true);
    displayPlayAreaCards();
  }, 350);
}
globals.getSounds = function () {
  if (!preferences || !preferences.sound || !preferences.sound.isEnabled) return null;
  if (sounds) return sounds;
  else {
    loadSounds()
    return sounds;
  }
}
globals.getVulnerableStatus = function () {
  return setVulnerableLabeL();
}
globals.getRoundStartPlayerFromClient = function () {
  return roundStartPlayer;
}
globals.getRoundWinners = function () {
  return roundWinners;
}
globals.getNameFromLocation = function (location) {
  return getNameFromLocation(location);
}
globals.getLocationFromDirection = function (direction) {
  return getLocationFromDirection(direction);
}
globals.sendDeclarersHandToDummy = function (declarersHand) {
  hand = declarersHand;
  if (hand === undefined || hand === null) return null;
  redisplayHandArray(hand.flatten(2)[0], true, false);
  // if (isExposedBottom) redisplayHandArray(exposedHand.flatten(2)[0], false, true);
}
globals.changeSoundVolumes = function (volume) {
  if (volume === undefined || volume === null) return;
  for (var i = 0; i < Howler._howls.length; i++) {
    var howl = Howler._howls[i];
    howl._volume = volume;
  }
}
globals.setCanvasColors = function (labelColor, instructionsColor, backgroundColor, playAreaColor) {
  if (isMobile) return;
  if (!texts) {
    setTimeout(function () {
      setCanvasColors(labelColor, instructionsColor, backgroundColor, playAreaColor);
    }, waitToLoadNewTheme);
  }
  else setCanvasColors(labelColor, instructionsColor, backgroundColor, playAreaColor);
}
globals.getExposedHandLocation = function () {
  return exposedHandLocation;
}
globals.getTrumpSuit = function () {
  return getTrumpSuit();
}

//#endregion





