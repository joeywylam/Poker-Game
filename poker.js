let players = [];
let communityCards = [];
let pot = 0;
let currentPlayer = 0;
let numPlayers = 6;  // Maximum players
const smallBlindAmount = 1;
const bigBlindAmount = 2;
let dealerPosition = 0;  // Start with Player 1 as the dealer

// Initialize players
function initPlayers() {
    for (let i = 0; i < numPlayers; i++) {
        players.push({ id: i, money: 100, hand: [], isAI: (i !== 0) });
    }
    assignBlinds();
}

// Assign blinds
function assignBlinds() {
    let smallBlind = (dealerPosition + 1) % numPlayers;
    let bigBlind = (dealerPosition + 2) % numPlayers;
    players[smallBlind].money -= smallBlindAmount;
    players[bigBlind].money -= bigBlindAmount;
    updatePot(smallBlindAmount + bigBlindAmount);
}

// Update the pot display
function updatePot(amount) {
    pot += amount;
    document.getElementById('pot').innerText = pot;
}

// Deal cards to players
function dealCards() {
    for (let player of players) {
        player.hand = [getRandomCard(), getRandomCard()];  // Each player gets 2 cards
    }
    communityCards = [];
}

// Get a random card (for simplicity, not implementing a full deck)
function getRandomCard() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const card = values[Math.floor(Math.random() * values.length)] + suits[Math.floor(Math.random() * suits.length)];
    return card;
}

// Show community cards
function showCommunityCards() {
    document.getElementById('community').innerText = communityCards.join(' ');
}

// Evaluate hand strength (simplified for demo purposes)
function evaluateHand(playerHand, communityCards) {
    return Math.floor(Math.random() * 10) + 1;  // Random strength for demo
}

// AI decision-making logic
function aiDecision(player) {
    let handStrength = evaluateHand(player.hand, communityCards);
    let randomFactor = Math.random();

    if (handStrength > 7) {
        if (randomFactor > 0.5) {
            raise(player);
        } else {
            call(player);
        }
    } else if (handStrength > 4) {
        if (randomFactor > 0.3) {
            call(player);
        } else {
            fold(player);
        }
    } else {
        fold(player);
    }
}

// Automate AI turns
function automateAITurns() {
    for (let i = 0; i < numPlayers; i++) {
        if (i !== currentPlayer && !players[i].isFolded) {
            aiDecision(players[i]);
        }
    }
}

// Next player's turn
function nextTurn() {
    currentPlayer = (currentPlayer + 1) % numPlayers;
    if (players[currentPlayer].isAI) {
        automateAITurns();
    } else {
        enablePlayerActions();
    }
}

// Enable actions for the current player
function enablePlayerActions() {
    // Logic to enable buttons based on the current player's turn
}

// Start the game
function startGame() {
    initPlayers();
    dealCards();
    showCommunityCards();
    enablePlayerActions();
}

// Initialize the game
startGame();
