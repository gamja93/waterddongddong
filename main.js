
const generateBtn = document.getElementById('generate-btn');
const numberElements = document.querySelectorAll('.number');
const historyList = document.getElementById('history-list');
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

const storedTheme = localStorage.getItem('theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
const initialTheme = storedTheme || (prefersDark ? 'dark' : 'light');

setTheme(initialTheme);

themeToggle.addEventListener('click', () => {
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
});

generateBtn.addEventListener('click', () => {
    // 1~45 사이의 중복 없는 숫자 6개 생성
    const numbers = new Set();
    while (numbers.size < 6) {
        const randomNumber = Math.floor(Math.random() * 45) + 1;
        numbers.add(randomNumber);
    }

    const sortedNumbers = Array.from(numbers).sort((a, b) => a - b);

    // 생성된 숫자를 화면에 표시
    numberElements.forEach((element, index) => {
        element.textContent = sortedNumbers[index];
        colorizeNumber(element, sortedNumbers[index]);
    });

    // 기록에 추가
    addHistory(sortedNumbers);
});

function colorizeNumber(element, number) {
    let color;
    if (number <= 10) {
        color = '#fbc400'; // 노란색
    } else if (number <= 20) {
        color = '#69c8f2'; // 파란색
    } else if (number <= 30) {
        color = '#ff7272'; // 빨간색
    } else if (number <= 40) {
        color = '#aaa'; // 회색
    } else {
        color = '#b0d840'; // 녹색
    }
    element.style.backgroundColor = color;
    element.style.color = 'white';
}

function addHistory(numbers) {
    const listItem = document.createElement('li');
    listItem.textContent = numbers.join(', ');
    historyList.prepend(listItem); // 최신 항목을 맨 위에 추가
}

function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem('theme', theme);
    const isDark = theme === 'dark';
    themeToggle.textContent = isDark ? 'Light mode' : 'Dark mode';
    themeToggle.setAttribute('aria-pressed', String(isDark));
}
