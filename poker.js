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
        players.push({ id: i, money: 100, hand: [], isAI: (i !== 0), isFolded: false });
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
        raise(player, Math.floor(Math.random() * (player.money / 2)) + 1); // AI raises a random amount
    } else if (handStrength > 4) {
        call(player);
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

// Player action functions
function bet(player, amount) {
    if (amount <= player.money) {
        player.money -= amount;
        updatePot(amount);
        nextTurn();
    }
}

function raise(player, amount) {
    bet(player, amount);
}

function call(player) {
    // Implement logic for calling the bet
    nextTurn();
}

function fold(player) {
    player.isFolded = true;
    nextTurn();
}

// Next player's turn
function nextTurn() {
    currentPlayer = (currentPlayer + 1) % numPlayers;

    // Move dealer position
    if (currentPlayer === dealerPosition) {
        dealerPosition = (dealerPosition + 1) % numPlayers;
        assignBlinds();
    }

    // Check if the current player is AI or not
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
