export function hydrate(prize) {
    const prizeListItem = e('li', 'disabled outside',
        e('div', 'title',
            e('span', 'w-60', 'Prize'),
            e('span', 'w-40', e('span', 'winnerText', 'Winner'))),
        e('div', 'prize',
            e('span', 'w-60', e('p', 'prizeTitle', prize.title), e('p', 'subTitle', prize.subTitle)),
            e('span', 'w-40', e('div', 'winner', '∗∗∗'))));

    document.getElementById('prizeList').appendChild(prizeListItem);
}

function e(tagName, className, ...children) {
    const element = document.createElement(tagName);
    element.className = className;
    children.forEach(e => element.append(e));
    return element;
}

export const hints = {
    hint: document.getElementById('hint'),
    spin: function () {
        this.hint.textContent = 'Press Space to Stop.';
    },
    nothing: function () {
        this.hint.textContent = '';
    },
    stop: function () {
        this.hint.textContent = 'Click "Next" to Confirm or "Again" to Respin.';
    },
    enter: function () {
        this.hint.textContent = 'Press Space to Spin.';
    },
    hide: function () {
        this.hint.classList.add('hidden');
    },
    show: function () {
        this.hint.classList.remove('hidden');
    }
};