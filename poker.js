// Poker game logic

let deck = [];
let players = [];
let communityCards = [];
let currentPlayer = 0;
let pot = 0;
let smallBlind = 0;
let bigBlind = 0;
let numPlayers = 2;
let minBet = 10;
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

// Initialize the game with a selected number of players and minimum bet
function initializeGame() {
    players = [];
    communityCards = [];
    pot = 0;

    createDeck();
    shuffleDeck();

    numPlayers = parseInt(document.getElementById('num-players').value);
    minBet = parseInt(document.getElementById('min-bet').value);

    for (let i = 0; i < numPlayers; i++) {
        players.push({
            hand: [deck.pop(), deck.pop()],
            chips: 100, // Each player starts with $100
            hasFolded: false
        });
    }

    // Assign blinds
    smallBlind = 0;
    bigBlind = 1;

    // Deduct small and big blinds
    players[smallBlind].chips -= minBet / 2;
    players[bigBlind].chips -= minBet;
    pot += minBet + minBet / 2;

    currentPlayer = (bigBlind + 1) % numPlayers; // Start after big blind
    updateGameUI();
    enablePlayerActions(); // Enable the action buttons when the game starts
}

// Deal community cards in stages
function dealFlop() {
    communityCards.push(deck.pop(), deck.pop(), deck.pop());
    updateGameUI();
}

function dealTurn() {
    communityCards.push(deck.pop());
    updateGameUI();
}

function dealRiver() {
    communityCards.push(deck.pop());
    updateGameUI();
}

// Update game UI to reflect the current state of the game
function updateGameUI() {
    const communityCardsContainer = document.getElementById('community-cards');
    communityCardsContainer.innerHTML = 'Community Cards: ';
    communityCards.forEach(card => {
        communityCardsContainer.innerHTML += `<div class="card">${card.rank}${card.suit}</div>`;
    });

    const playerHandsContainer = document.getElementById('player-hands');
    playerHandsContainer.innerHTML = `Player ${currentPlayer + 1}'s Hand: `;
    players[currentPlayer].hand.forEach(card => {
        playerHandsContainer.innerHTML += `<div class="card">${card.rank}${card.suit}</div>`;
    });

    const playerStatusContainer = document.getElementById('player-status');
    playerStatusContainer.innerHTML = 'Player Money:<br>';
    players.forEach((player, index) => {
        playerStatusContainer.innerHTML += `Player ${index + 1}: $${player.chips}<br>`;
    });

    document.getElementById('pot').innerText = `Total Pot: $${pot}`;
}

// Enable or disable player action buttons
function enablePlayerActions() {
    document.getElementById('bet').disabled = false;
    document.getElementById('raise').disabled = false;
    document.getElementById('call').disabled = false;
    document.getElementById('fold').disabled = false;
}

function disablePlayerActions() {
    document.getElementById('bet').disabled = true;
    document.getElementById('raise').disabled = true;
    document.getElementById('call').disabled = true;
    document.getElementById('fold').disabled = true;
}

// Basic betting actions (bet, call, raise, fold)
function bet() {
    const betAmount = minBet;  // Minimum bet amount
    players[currentPlayer].chips -= betAmount;
    pot += betAmount;
    nextPlayer();
}

function raise() {
    const raiseAmount = minBet * 2;  // Raise by double the minimum bet
    players[currentPlayer].chips -= raiseAmount;
    pot += raiseAmount;
    nextPlayer();
}

function call() {
    const callAmount = minBet;  // Call the minimum bet
    players[currentPlayer].chips -= callAmount;
    pot += callAmount;
    nextPlayer();
}

function fold() {
    players[currentPlayer].hasFolded = true;
    nextPlayer();
}

function nextPlayer() {
    disablePlayerActions(); // Disable buttons while switching players

    do {
        currentPlayer = (currentPlayer + 1) % numPlayers;
    } while (players[currentPlayer].hasFolded);

    if (players.filter(p => !p.hasFolded).length === 1) {
        // If only one player hasn't folded, declare them the winner
        declareWinner();
    } else {
        updateGameUI();
        enablePlayerActions(); // Enable buttons for the next player
    }
}

function declareWinner() {
    const winner = players.findIndex(p => !p.hasFolded) + 1;
    document.getElementById('community-cards').innerHTML = `Player ${winner} wins the pot of $${pot}!`;
    disablePlayerActions(); // Disable further actions once a winner is declared
}

// Hook up button actions
document.getElementById('start-game').addEventListener('click', () => {
    initializeGame();
    document.getElementById('player-selection').style.display = 'none';
    document.getElementById('game-container').style.display = 'block';
});

document.getElementById('bet').addEventListener('click', bet);
document.getElementById('raise').addEventListener('click', raise);
document.getElementById('call').addEventListener('click', call);
document.getElementById('fold').addEventListener('click', fold);
