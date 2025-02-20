const playerHand = document.getElementById("manoJugador");
const dealerHand = document.getElementById("manoDealer");
const lblPlayerWins = document.getElementById("lblPuntosJugador");
const lblDealerWins = document.getElementById("lblPuntosDealer");
const btnPedir = document.getElementById("btnPedir");
const btnPlantarse = document.getElementById("btnPlantarse");
const btnReiniciar = document.getElementById("btnReiniciar");
const btnIniciar = document.getElementById("btnIniciar");
const btnNuevaRonda = document.getElementById("btnNuevaRonda");
const lblResultado = document.getElementById("lblResultado");
const pnlResultado = document.getElementById("pnlResultado");
const lblResultadoPartida = document.getElementById("lblResultadoPartida");
const pnlResultadoPartida = document.getElementById("pnlResultadoPartida");
const btnVolverAJugar = document.getElementById("btnVolverAJugar");
const pnlJuego = document.getElementById("pnlJuego");

let deck_id = '';
let playerCards = [];
let dealerCards = [];
let playerScore = 0;
let dealerScore = 0;
let playerAces = 0;
let dealerAces = 0;
let playerAceValue = 11;
let dealerAceValue = 11;

let round_finished = false;

let playerWins = 0;
let dealerWins = 0;

document.addEventListener('DOMContentLoaded', function() {
    console.log('Page has been loaded and DOM is ready');
});

btnIniciar.addEventListener("click", function() {
    fetch('https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=6')
    .then(response => response.json())
    .then(data => {
        deck_id = data.deck_id;
        console.log(deck_id);
        console.log(data.deck_id);
    }).then(() => {
        console.log(deck_id);
        document.getElementById("botonesInicio").style.display = "none";
        document.getElementById("botonesInGame").style.display = "flex";
        btnNuevaRonda.style.display = "block";
        round_finished = true;
    })
    .catch(error => console.error("Error al obtener la baraja", error));
    pnlJuego.style.display = "grid";
});

async function obtenerCarta(num_cards, reciever) {
    try {
        const response = await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/draw/?count=${num_cards}`);
        const data = await response.json();
        if (reciever == "player") {
            for (let i = 0; i < num_cards; i++) {
                playerCards.push(data.cards[i]);
                const imagen = document.createElement("img");
                imagen.src = data.cards[i].image;
                imagen.className = "cartas";
                playerHand.appendChild(imagen);

                if (data.cards[i].value == "KING" || data.cards[i].value == "QUEEN" || data.cards[i].value == "JACK") {
                    playerScore += 10;
                } else if (data.cards[i].value == "ACE") {
                    playerScore += playerAceValue;
                    playerAces++;
                } else {
                    playerScore += parseInt(data.cards[i].value);
                }

                if (playerScore == 21) {
                    console.log("Player score: " + playerScore);
                    lblResultado.textContent = "Ganaste";
                    pnlResultado.style.display = "flex";
                    playerWins++;
                    lblPlayerWins.textContent = "Jugador: " + playerWins;
                    btnNuevaRonda.style.display = "block";
                    round_finished = true;
                    return;
                }
                if (playerScore > 21) {
                    if (playerAces > 0 && playerAceValue == 11) {
                        playerScore -= 10 * playerAces;
                        playerAceValue = 1;
                    } else {
                        lblResultado.textContent = await generarInsulto();
                        pnlResultado.style.display = "flex";
                        dealerWins++;
                        lblDealerWins.textContent = "Dealer: " + dealerWins;
                        btnNuevaRonda.style.display = "block";
                        round_finished = true;
                        return;
                    }
                }
                console.log("Player score: " + playerScore);
            }
            console.log(playerCards);
        } else {
            for (let i = 0; i < num_cards; i++) {
                dealerCards.push(data.cards[i]);
                const icono = document.createElement("a");
                icono.h
                const imagen = document.createElement("img");
                imagen.src = data.cards[i].image;
                imagen.className = "cartas";
                dealerHand.appendChild(imagen);

                if (data.cards[i].value == "KING" || data.cards[i].value == "QUEEN" || data.cards[i].value == "JACK") {
                    dealerScore += 10;
                } else if (data.cards[i].value == "ACE") {
                    dealerScore += dealerAceValue;
                    dealerAces++;
                } else {
                    dealerScore += parseInt(data.cards[i].value);
                }

                if (dealerScore == 21) {
                    console.log("Dealer score: " + dealerScore);
                    lblResultado.textContent = await generarInsulto();
                    pnlResultado.style.display = "flex";
                    dealerWins++;
                    lblDealerWins.textContent = "Dealer: " + dealerWins;
                    btnNuevaRonda.style.display = "block";
                    round_finished = true;
                    return;
                }
                if (dealerScore > 21) {
                    if (dealerAces > 0 && dealerAceValue == 11) {
                        dealerScore -= 10 * dealerAces;
                        dealerAceValue = 1;
                    } else {
                        lblResultado.textContent = "Ganaste";
                        pnlResultado.style.display = "flex";
                        playerWins++;
                        lblPlayerWins.textContent = "Jugador: " + playerWins;
                        btnNuevaRonda.style.display = "block";
                        round_finished = true;
                        return;
                    }
                }
                console.log("Dealer score: " + dealerScore);
            }
            console.log(dealerCards);
        } 
    } catch (error) {
        console.error("Error al obtener carta", error);
    }
}

btnPedir.addEventListener("click", async function() {
    if (!round_finished) {
        await obtenerCarta(1, "player");
    }
});

btnPlantarse.addEventListener("click", async function() {
    if (!round_finished) {
        while(dealerScore < 17) {
            await obtenerCarta(1, "dealer");
            console.log("Dealer score: " + dealerScore);
        }

        if (dealerScore < 21) {
            if (playerScore > dealerScore) {
                lblResultado.textContent = "Ganaste";
                pnlResultado.style.display = "flex";
                playerWins++;
                lblPlayerWins.textContent = "Jugador: " + playerWins;
            } else if (playerScore < dealerScore) {
                lblResultado.textContent = await generarInsulto();
                pnlResultado.style.display = "flex";
                dealerWins++;
                lblDealerWins.textContent = "Dealer: " + dealerWins;
            } else {
                lblResultado.textContent = "Empate";
                pnlResultado.style.display = "flex";
            }

            btnNuevaRonda.style.display = "block";
            round_finished = true;
        }

        if (dealerWins == 10) {
            lblResultadoPartida.textContent = "Ganó el Dealer";
            pnlResultadoPartida.style.display = "flex";
        } else if (playerWins == 10) {
            lblResultadoPartida.textContent = "Ganó el Jugador";
            pnlResultadoPartida.style.display = "flex";
        }
    }
});

btnNuevaRonda.addEventListener("click", function() {
    newRound();
});

async function newRound() {
    await fetch(`https://deckofcardsapi.com/api/deck/${deck_id}/shuffle/`)
    .then(response => response.json())
    .then(data => {
        deck_id = data.deck_id;
        console.log(deck_id);
    }).then(() => {
        playerCards = [];
        dealerCards = [];
        playerHand.innerHTML = "";
        dealerHand.innerHTML = "";
        playerScore.innerHTML = "";
        dealerScore.innerHTML = "";
        playerScore = 0;
        dealerScore = 0;
        playerAces = 0;
        dealerAces = 0;
        playerAceValue = 11;
        dealerAceValue = 11;
        pnlResultado.style.display = "none";
        round_finished = false;
    });

    btnNuevaRonda.style.display = "none";
    round_finished = false;

    await obtenerCarta(2, "player");
    await obtenerCarta(1, "dealer");
}

btnVolverAJugar.addEventListener("click", function() {
    playerWins = 0;
    dealerWins = 0;
    lblPlayerWins.textContent = "Jugador: " + playerWins;
    lblDealerWins.textContent = "Dealer: " + dealerWins;
    pnlResultadoPartida.style.display = "none";
    newRound();
});

btnReiniciar.addEventListener("click", function() {
    playerWins = 0;
    dealerWins = 0;
    lblPlayerWins.textContent = "Jugador: " + playerWins;
    lblDealerWins.textContent = "Dealer: " + dealerWins;
    pnlResultadoPartida.style.display = "none";
    newRound();
});

async function generarInsulto() {
    try {
        const response = await fetch('https://insult.mattbas.org/api/en/insult.json');
        const data = await response.json();
        return data.insult;
    } catch (error) {
        console.error("Error al obtener insulto", error);
        return "Perdiste";
    }
}