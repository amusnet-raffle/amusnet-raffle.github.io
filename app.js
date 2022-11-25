import { init as initSpinner, spin, spinning, stopSpin, winner } from "./spinner.js";
import { prizesList } from "./setup.js";
import { hints, hydrate } from "./utils.js";

const insertNumberModal = document.getElementById('insert-number-modal');
const spinner = document.getElementById('spinner');
const totalPrizes = prizesList.length;
const pickedPrizes = new Array(totalPrizes);

document.addEventListener('keypress', closeCover);
document.getElementById('participantsForm').addEventListener('submit', init);
document.getElementById('next').addEventListener('click', confirmWinner);
document.getElementById('again').addEventListener('click', respin);

let participantsList = [];
let currentPrizeIndex = 0;
let spinnerOn = false;

// Hydrate UL
prizesList.map(hydrate);

function closeCover() {
    document.getElementById('cover').classList.add('hidden');
    document.getElementById('logo').classList.remove('hidden');
    document.getElementById('insert-number-modal').classList.remove('hidden');
    document.removeEventListener('keypress', closeCover);
    hints.nothing();
}

function init(e) {
    e.preventDefault();
    let participants = document.getElementById('participants').value;

    if (isNaN(participants) || !participants || participants <= 0) {
        return alert('Please enter a valid number.');
    }

    if (participants <= totalPrizes) {
        return alert('Please enter more people than prizes.');
    }

    participants = Number(participants);

    if (participants % 1 !== 0) {
        return alert('Please enter a whole number.');
    }

    // Fill participants list
    participantsList = new Array(participants).fill(0).map((_, i) => i + 1);

    insertNumberModal.classList.add('hidden');
    document.getElementById('prizeList').classList.remove('hidden');

    document.addEventListener('keydown', keyPress);
    hints.show();
    setTimeout(popPrize, 1);
}

function keyPress(e) {
    // Space key - Spin or Stop
    if (e.keyCode == '32' && spinnerOn == false) {
        if (currentPrizeIndex < pickedPrizes.length && pickedPrizes[currentPrizeIndex] == undefined) {
            // First spin
            toggleSpinner();
            spin(participantsList);
        }
    } else if (e.keyCode == '32' && spinnerOn == true && spinning == true) {
        // Stop 
        stopSpin();
    }

    // Enter key - Confirm winner
    if (e.keyCode == '13') {
        confirmWinner();
    }
}

function respin() {
    if (spinnerOn == true && spinning == false) {
        // Remove old winner and Respin
        participantsList = participantsList.filter(e => e !== winner);
        initSpinner();
        spin(participantsList);
    }
}

function confirmWinner() {
    if (spinnerOn == true && spinning == false) {
        // Insert winner
        document.querySelector("li:not(.disabled) div.winner").textContent = winner.toString().padStart(3, 0);
        participantsList = participantsList.filter(e => e !== winner);

        // Hide spinner
        toggleSpinner();
        hints.enter();

        // Bring next prize
        if (document.querySelectorAll('ul#prizeList li')[currentPrizeIndex]) {
            popPrize();
        }

        pickedPrizes[currentPrizeIndex] = 'true';

        // If last prize - highlight all
        if (currentPrizeIndex == totalPrizes - 1) {
            [...document.querySelectorAll("li.disabled")].forEach(e => e.classList.remove('disabled'));
            hints.hide();
        } else {
            currentPrizeIndex++;
            initSpinner();
        }
    }
}

function popPrize() {
    document.querySelector("li:not(.disabled)")?.classList.add('disabled');
    document.querySelector('.outside')?.classList.remove('outside', 'disabled');
}

function toggleSpinner() {
    if (spinner.classList.contains('hidden')) {
        spinner.classList.remove('hidden');
        spinnerOn = true;
    } else {
        spinner.classList.add('hidden');
        spinnerOn = false;
    }
}