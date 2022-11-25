import { setup } from "./setup.js";
import { hints } from "./utils.js";

const items = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
const reels = document.querySelectorAll('.reel');
const spinSound = document.getElementById('spinSound');
const stopReelSound = document.getElementById('stopReelSound');
export let spinning = false;
let stopping = false;
export let winner = 0;

export function init(firstInit = true) {
    const winDigit = winner.toString().padStart(3, 0);

    for (let i = 0; i < reels.length; i++) {
        const reel = reels[i];

        if (firstInit) {
            reel.dataset.spinned = '0';
        } else if (reel.dataset.spinned === '1') {
            return;
        }

        const boxes = reel.querySelector('.boxes');
        const boxesClone = boxes.cloneNode(false);
        boxesClone.style.transform = `translateY(-${(items.length + 1) * reel.clientHeight}px)`;
        const pool = ['∗'];

        if (!firstInit) {

            pool.unshift(...shuffle(items, winDigit[i]));

            boxesClone.addEventListener(
                'animationstart',
                function () {
                    reel.dataset.spinned = '1';
                    this.querySelectorAll('.box').forEach((box) => {
                        box.style.filter = 'blur(1px)';
                    });
                },
                { once: true }
            );

            boxesClone.addEventListener(
                'animationcancel',
                function (e) {
                    e.target.style.transform = '';
                    this.querySelectorAll('.box').forEach((box, index) => {
                        box.style.filter = 'blur(0)';
                        box.style.color = 'red';
                        if (index > 0) this.removeChild(box);
                    });

                    if (i == 2) {
                        document.getElementById('reels').classList.add('glow');
                    }
                },
                { once: true }
            );

            boxesClone.addEventListener(
                'animationiteration',
                function (e) {
                    e.target.style.animation = `slide ${setup.animationSpeed}ms linear 0ms infinite`;
                    // e.target.lastChild.textContent = winDigit[i];
                },
                { once: true }
            );
        }

        for (let i = 0; i < pool.length; i++) {
            const box = document.createElement('div');
            box.classList.add('box');
            box.style.width = reel.clientWidth + 'px';
            box.style.height = reel.clientHeight + 'px';
            box.textContent = pool[i];
            boxesClone.appendChild(box);
        }
        boxesClone.style.animation = `slide ${setup.initialAnimationSpeed}ms ease-in ${i * setup.startDelay}ms infinite`;
        reel.replaceChild(boxesClone, boxes);
        // Replace '?' symbol
        setTimeout(() => { boxesClone.lastChild.textContent = winDigit[i]; }, (i * setup.startDelay) + setup.initialAnimationSpeed - 10);
    }
}

export function spin(participantsList) {
    if (spinning == false) {
        // Generate winner
        const winnerIndex = Math.floor(Math.random() * participantsList.length);
        winner = participantsList[winnerIndex];
        document.getElementById('reels').classList.remove('glow');
        init(false);
        spinning = true;
        audioPlayer.spin();
        hints.spin();
    }
}

export function stopSpin() {
    if (stopping == false) {
        stopping = true;

        document.querySelectorAll('.boxes').forEach((box, i, arr) => {
            setTimeout(() => {
                box.style.animation = '';
                audioPlayer.stopReel();

                if (i == 0) {
                    hints.nothing();
                }

                if (i == arr.length - 1) {
                    spinning = false;
                    stopping = false;
                    hints.stop();
                }
            }, i * setup.stopDelay);
        });
    }
}

function shuffle([...arr], winDigit) {
    let m = arr.length;
    while (m) {
        const i = Math.floor(Math.random() * m--);
        [arr[m], arr[i]] = [arr[i], arr[m]];
    }
    // First digit is the winning
    arr.unshift(winDigit);

    return arr;
}

const audioPlayer = {
    reel: 1,
    spin: () => (new Audio('./assets/spinSound.wav')).play(),
    stopReel: function () {
        (new Audio(`./assets/stopReelSound.wav`)).play();

        if (this.reel == 3) {
            (new Audio('./assets/bigWinStart.wav')).play();
            this.reel = 1;
        } else {
            this.reel++;
        }
    }
};