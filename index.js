// Card variables
let suits = ['Hearts', 'Clubs', 'Diamonds', 'Spades'];
// Inimi/cupa, ghinda/trefla, romb/caro, pica/inima neagra
let values = ['Ace', 'King', 'Queen', 'Jack',
    'Ten', 'Nine', 'Eight', 'Seven', 'Six',
    'Five', 'Four', 'Three', 'Two'];

// DOM variables
let textArea = document.getElementById('text-area'),
    textMsg = document.getElementById('text-message'),
    newGameButton = document.getElementById('new-game-button'),
    hitButton = document.getElementById('hit-button'),
    stayButton = document.getElementById('stay-button');

// Game variables
let gameStarted = false,
    gameOver = false,
    playerWon = false,
    tie = false, // added for extra conditions
    dealerCards = [],
    playerCards = [],
    dealerScore = 0,
    playerScore = 0,
    deck = [];

textMsg.style.display = 'none';
hitButton.style.display = 'none';
stayButton.style.display = 'none';
showStatus();


newGameButton.addEventListener('click', function(){
  gameStarted = true;
  gameOver = false;
  playerWon = false;
  tie = false;

  deck = createDeck();
  shuffleDeck(deck);
  dealerCards = [ getNextCard(), getNextCard() ];
  playerCards = [ getNextCard(), getNextCard() ];

  textMsg.style.display = 'none';
  newGameButton.style.display = 'none';
  hitButton.style.display = 'inline';
  stayButton.style.display = 'inline';
  checkForEndOfGame(); // added for extra conditions
  showStatus();
});

hitButton.addEventListener('click', function(){
  playerCards.push(getNextCard());
  checkForEndOfGame();
  showStatus();
});

stayButton.addEventListener('click', function(){
  gameOver = true;
  checkForEndOfGame();
  showStatus();
});

function createDeck() {
  let deck = [];
  for (let suitIdx = 0; suitIdx < suits.length; suitIdx++) {
    for (let valueIdx = 0; valueIdx < values.length; valueIdx++) {
        let card = {
          suit: suits[suitIdx],
          value: values[valueIdx]
        };
        deck.push( card );
    }
  }
  return deck;
}

function shuffleDeck(deck){
  for (let i = 0; i < deck.length; i++) {
    let swapIdx = Math.trunc(Math.random() * deck.length);
    let tmp = deck[i];
    deck[swapIdx] = deck [i];
    deck [i] = tmp;
  }
}


function getCardString(card) {
  return card.value + ' of ' + card.suit;
}

function getNextCard(){
  return deck.shift();
}

function getCardNumericValue(card) {
  switch(card.value){
    case 'Ace':
      return 1;
    case 'Two':
      return 2;
    case 'Three':
      return 3;
    case 'Four':
      return 4;
    case 'Five':
      return 5;
    case 'Six':
      return 6;
    case 'Seven':
      return 7;
    case 'Eight':
      return 8;
    case 'Nine':
      return 9;
    default:
      return 10;
  }
}


function getScore(cardArray) {
  let score = 0;
  let hasAce = false;
  for (let i = 0; i < cardArray.length; i++) {
    let card = cardArray[i];
    score += getCardNumericValue(card);
    if (card.value === 'Ace') {
      hasAce = true;
    }
  }
  if (hasAce && score + 10 <= 21) {
    return score + 10;
  }
  // added for Ace to be 1 in case score >21
  else if (hasAce && score + 10 >= 21) {
    return score + 1;
  }
  return score;
}



function updateScores(){
  dealerScore = getScore(dealerCards);
  playerScore = getScore(playerCards);

  if (playerScore == 21) { // conditie adaugata
    gameOver = true;
    playerWone = true;
  }
}

function checkForEndOfGame(){
  updateScores();
  if (gameOver) {
    // let dealer take cards
    while(dealerScore < playerScore
    && playerScore <= 21
    && dealerScore <= 21) {
      dealerCards.push(getNextCard());
      updateScores();
    }
  }

  if (playerScore > 21 ) {
    playerWon = false;
    tie = false;
    gameOver = true;
  }
  else if (dealerScore > 21) {
    playerWon = true;
    //tie = false;
    gaveOver = true;
  }
  else if (gameOver) {
    if (playerScore > dealerScore) {
      playerWon = true;
      tie = false;
    }
    else if (playerScore == dealerScore) {
    tie = true;
    gameOver=true;
    }
    else {
      playerWon = false;
      tie = false;
    }
  }
}

function showStatus(){
  if (!gameStarted) {
    textArea.innerText = 'Welcome to Blackjack';
	  textMsg.innerText = '';
    return;
  }

  let dealerCardString = '';
  for (let i = 0; i < dealerCards.length; i++) {
    dealerCardString += ' - ' + getCardString(dealerCards[i]) + '\n';
  }

  let playerCardString = '';
  for (let i = 0; i < playerCards.length; i++) {
    playerCardString += ' - ' + getCardString(playerCards[i]) + '\n';
  }

  updateScores();

  textArea.innerText =
    'Dealer has:\n' +
    dealerCardString +
    'Score: '+ dealerScore + '\n\n' +

    'Player has:\n' +
    playerCardString +
    'Score: '+ playerScore + '\n\n';

  if (gameOver) {
    if (playerWon) {
      textMsg.style.display = 'block';
      textMsg.innerText = "YOU WIN!";
    }
    else if (tie) {
      textMsg.style.display = 'block';
      textMsg.innerText = "TIE!";
    }
    else {
      textMsg.style.display = 'block';
      textMsg.innerText = "DEALER WINS";
    }
    newGameButton.style.display = 'inline';
    hitButton.style.display = 'none';
    stayButton.style.display = 'none';
  }
}
