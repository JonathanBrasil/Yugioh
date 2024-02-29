//objeto ---->
const state = {
    score: {
        playerScore: 0,
        computerScore: 0,
        scoreBox: document.getElementById("score-points"),

    },
    cardSprites: {
        avatar: document.getElementById("card-image"),
        name: document.getElementById("card-name"),
        type: document.getElementById("card-type"),

    },
    fieldCards: {
        player: document.getElementById("player-field-card"),
        computer: document.getElementById("computer-field-card"),

    },
    actions: {
        button: document.getElementById("next-duel"),
    },

};

const pathImages = "./src/assets/icons/";

const playersSides = {
    player1: "player-cards",
    computer: "computer-cards",
};

const cardData = [

    {
        id: 0,
        name: "Blue Eyes White Dragon",
        type: "Paper",
        img: `${pathImages}dragon.png`,
        winOf: [1],
        loseOf: [2],
    },

    {
        id: 1,
        name: "Dark Magician",
        type: "Rock",
        img: `${pathImages}magician.png`,
        winOf: [2],
        loseOf: [0],
    },

    {
        id: 2,
        name: "Exodia",
        type: "Scisor",
        img: `${pathImages}exodia.png`,
        winOf: [0],
        loseOf: [1],
    },

]

async function resetDuel(){
    state.cardSprites.avatar.src = "";
    state.actions.button.style.display = "none";

    state.fieldCards.player.style.display = "none";
    state.fieldCards.computer.style.display = "none";

    init();
}

async function getRandomCardId() {
    const randomIndex = Math.floor(Math.random() * cardData.length);
    return cardData[randomIndex].id;
}

async function createCardImage(IdCard, fieldSide) {
    const cardImage = document.createElement("img"); //criei img
    cardImage.setAttribute("height", "100px"); //passei tamanho
    cardImage.setAttribute("data-id", IdCard); //passei ID
    cardImage.classList.add("card"); //atribui uma classe

    if (fieldSide === playersSides.player1) {
        cardImage.addEventListener("click", () => {
            setCardsField(cardImage.getAttribute("data-id"));
        });
        cardImage.setAttribute("src", cardData[IdCard].img); //passei src player

        cardImage.addEventListener("mouseover", () => {
            drawSelectCard(IdCard);
        });
    }

    else {
        cardImage.setAttribute("src", "./src/assets/icons/card-back.png"); //passei src computer

        /*cardImage.addEventListener("mouseover", () => {
            state.cardSprites.avatar.src = ("./src/assets/icons/card-back.png");
        });   */

    }

    return cardImage;
}

async function setCardsField(cardId) {

    await removeAllCardsImages();

    let computerCardId = await getRandomCardId();

    state.fieldCards.player.style.display = "block";
    state.fieldCards.computer.style.display = "block";

    state.fieldCards.player.src = cardData[cardId].img;
    state.fieldCards.computer.src = cardData[computerCardId].img;

    let duelResults = await checkDuelResults(cardId, computerCardId);

    await updateScore();
    await drawButton(duelResults)

}

async function updateScore() {
    state.score.scoreBox.innerText = `Vitorias: ${state.score.playerScore} Derrotas: ${state.score.computerScore}`
}

async function drawButton(text) {
    state.actions.button.innerText = text;
    state.actions.button.style.display = "block";
}

async function checkDuelResults(playerCardId, computerCardId) {
    let duelResults = "Empate" //estado neutro. 
    let playerCard = cardData[playerCardId]

    if (playerCard.winOf.includes(computerCardId)) {
        duelResults = "Ganhou";
        state.score.playerScore++;
    }

    else if (playerCard.loseOf.includes(computerCardId)) {
        duelResults = "Perdeu";
        state.score.computerScore++;
    }

    return duelResults;


}

async function removeAllCardsImages() {
    let cards = document.querySelector(".card-box.framed#computer-cards")
    let imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());

    cards = document.querySelector(".card-box.framed#player-cards")
    imgElements = cards.querySelectorAll("img")
    imgElements.forEach((img) => img.remove());
}

async function drawSelectCard(index) {

    state.cardSprites.avatar.src = cardData[index].img;
    state.cardSprites.name.innerText = cardData[index].name;
    state.cardSprites.type.innerText = "Attribute: " + cardData[index].type;

}

async function drawCards(cardNumbers, fieldSide) {
    for (let i = 0; i < cardNumbers; i++) {
        const randomIdCard = await getRandomCardId();
        const cardImage = await createCardImage(randomIdCard, fieldSide);

        document.getElementById(fieldSide).appendChild(cardImage);
    }
}

function init() {
    drawCards(5, playersSides.player1)
    drawCards(5, playersSides.computer)

}

init();