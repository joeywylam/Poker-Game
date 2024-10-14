// Poker game logic

let deck = [];
let players = [];
let communityCards = [];
let currentPlayer = 0;
let pot = 0;
const suits = ['♠', '♥', '♦', '♣'];
const ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Create and shuffle the deck
function createDeck() {
    deck = [];
    for (let suit of suits) {
        for (let rank of ranks) {
            deck.push({ rank, suit });
        }
    }
}

function shuffleDeck() {
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [deck[i], deck[j]] = [deck[j], deck[i]];
    }
}

// Initialize the game
function initializeGame(numPlayers = 2) {
    players = [];
    communityCards = [];
    createDeck();
    shuffleDeck();

    for (let i = 0; i < numPlayers; i++) {
        players.push({ hand: [], bet: 0 });
    }

    pot = 0;
    currentPlayer = 0;
    updateGameUI();
}

// Deal hole cards to players
function dealHoleCards() {
    for (let player of players) {
        player.hand.push(deck.pop(), deck.pop());
    }
    document.getElementById('show-flop').disabled = false;
    updateGameUI();
}

// Deal community cards in phases
function dealFlop() {
    communityCards.push(deck.pop(), deck.pop(), deck.pop());
    document.getElementById('show-flop').disabled = true;
    document.getElementById('show-turn').disabled = false;
    updateGameUI();
}

function dealTurn() {
    communityCards.push(deck.pop());
    document.getElementById('show-turn').disabled = true;
    document.getElementById('show-river').disabled = false;
    updateGameUI();
}

function dealRiver() {
    communityCards.push(deck.pop());
    document.getElementById('show-river').disabled = true;
    document.getElementById('bet').disabled = false;
    updateGameUI();
}

// Update the game UI to reflect current state
function updateGameUI() {
    const playersContainer = document.getElementById('players-container');
    playersContainer.innerHTML = '';
    players.forEach((player, index) => {
        const playerDiv = document.createElement('div');
        playerDiv.innerHTML = `<h2>Player ${index + 1}</h2>`;
        player.hand.forEach(card => {
            playerDiv.innerHTML += `<div class="card">${card.rank}${card.suit}</div>`;
        });
        playersContainer.appendChild(playerDiv);
    });

    const communityCardsContainer = document.getElementById('community-cards');
    communityCardsContainer.innerHTML = '';
    communityCards.forEach(card => {
        communityCardsContainer.innerHTML += `<div class="card">${card.rank}${card.suit}</div>`;
    });

    document.getElementById('winner').innerHTML = '';  // Clear winner
}

// Evaluate winner (basic comparison, more logic needed for real poker hands)
function evaluateWinner() {
    // Placeholder logic for winner evaluation
    const winner = Math.floor(Math.random() * players.length) + 1;
    document.getElementById('winner').innerHTML = `Player ${winner} wins!`;
}

// Betting system (simple)
function bet() {
    const betAmount = 10;
    players[currentPlayer].bet += betAmount;
    pot += betAmount;
    nextPlayer();
}

function fold() {
    players.splice(currentPlayer, 1);  // Remove the folding player
    nextPlayer();
}

function nextPlayer() {
    currentPlayer = (currentPlayer + 1) % players.length;
    if (currentPlayer === 0) {
        evaluateWinner();
        document.getElementById('bet').disabled = true;
        document.getElementById('fold').disabled = true;
    }
}

// Hook up buttons to game logic
document.getElementById('deal-cards').addEventListener('click', dealHoleCards);
document.getElementById('show-flop').addEventListener('click', dealFlop);
document.getElementById('show-turn').addEventListener('click', dealTurn);
document.getElementById('show-river').addEventListener('click', dealRiver);
document.getElementById('reset-game').addEventListener('click', () => initializeGame(2));
document.getElementById('bet').addEventListener('click', bet);
document.getElementById('fold').addEventListener('click', fold);

// Initialize game
initializeGame(2);  // Start with 2 players by default
