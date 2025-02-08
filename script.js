const letterSets = {
  1: { set: ['Ｅ', 'Ｉ'], colors: ['#55ccff', '#ffccff'] },
  2: { set: ['Ｓ', 'Ｎ'], colors: ['#55ccff', '#ffccff'] },
  3: { set: ['Ｔ', 'Ｆ'], colors: ['#55ccff', '#ffccff'] },
  4: { set: ['Ｊ', 'Ｐ'], colors: ['#55ccff', '#ffccff'] }
};

const containers = [
  document.getElementById('roulette1'),
  document.getElementById('roulette2'),
  document.getElementById('roulette3'),
  document.getElementById('roulette4')
];

let spinning = false;
let hasSpun = false;

// Create a roulette column for each container with a fixed number (300) of letters.
function createRoulette(container, letterSet) {
  const roulette = document.createElement('div');
  roulette.classList.add('roulette');
  const numLetters = 300;
  for (let i = 0; i < numLetters; i++) {
    const letter = document.createElement('div');
    letter.classList.add('letter');
    const span = document.createElement('span');
    span.classList.add('letter-content');
    span.textContent = letterSet.set[i % 2];
    span.style.color = letterSet.colors[i % 2];
    letter.appendChild(span);
    roulette.appendChild(letter);
  }
  container.appendChild(roulette);
  return roulette;
}

// Start the roulette spin on click.
function startRoulette() {
  if (spinning || hasSpun) return;
  spinning = true;
  hasSpun = true;

  // Get the base letter height from the first letter.
  const letterElem = containers[0].querySelector('.letter');
  const letterHeight = letterElem ? letterElem.offsetHeight : 50;
  const marginBottom = parseFloat(getComputedStyle(letterElem).marginBottom) || 20;
  // Effective vertical step (each letter plus its gap):
  const step = letterHeight + marginBottom;

  containers.forEach((container, index) => {
    const letterSet = letterSets[index + 1];
    const roulette = container.querySelector('.roulette');

    // Remove any previously enlarged letters.
    document.querySelectorAll('.letter').forEach(letter => {
      letter.classList.remove('enlarged');
    });

    // First rotation phase: move **4 letter steps** instead of 2.
    const upDistance = step * 1/2;
    roulette.style.transition = 'transform 1s cubic-bezier(0.2, 0.8, 0.4, 1)';
    roulette.style.transform = `translateY(-${container.clientHeight / 2 - letterHeight / 2 - upDistance}px)`;

    // Main spin: add a random extra distance.
    let distance = 6000 + Math.random() * 500;
    const m = Math.round((distance - upDistance) / step);
    const spinDistance = upDistance + m * step;

    const rotationDuration = 10 + index * 0.5; // slight stagger between columns

    setTimeout(() => {
      roulette.style.transition = `transform ${rotationDuration}s cubic-bezier(0.1, 1, 0.8, 1)`;
      roulette.style.transform = `translateY(${container.clientHeight / 2 - letterHeight / 2 - upDistance + spinDistance}px)`;
    }, 500);

    setTimeout(() => {
      enlargeCenterLetter(container);
    }, (rotationDuration * 1000) + 500);
  });
}

// Find and enlarge the letter closest to the vertical center.
function enlargeCenterLetter(container) {
  const containerRect = container.getBoundingClientRect();
  const containerCenterY = containerRect.top + containerRect.height / 2;
  let closestLetter = null;
  let minDistance = Infinity;

  container.querySelectorAll('.letter').forEach(letter => {
    const rect = letter.getBoundingClientRect();
    const letterCenterY = rect.top + rect.height / 2;
    const diff = Math.abs(letterCenterY - containerCenterY);
    if (diff < minDistance) {
      minDistance = diff;
      closestLetter = letter;
    }
  });

  if (closestLetter) {
    closestLetter.classList.add('enlarged');
  }
}

// Create the roulette columns.
containers.forEach((container, index) => {
  createRoulette(container, letterSets[index + 1]);
});

document.addEventListener('click', startRoulette);
