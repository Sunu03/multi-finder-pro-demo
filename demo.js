// Global variable to keep track of current position for each search term
let currentPosition = {};

function highlightWord(word, color) {
  const wordRegex = new RegExp('\\b(' + word + ')\\b', 'gi');
  const testContent = document.getElementById('test-content');

  let totalCount = 0;

  function highlightTextNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const matches = node.textContent.match(wordRegex);
      if (matches) {
        totalCount += matches.length;
      }

      const replacementNode = document.createElement('span');
      replacementNode.innerHTML = node.textContent.replace(
        wordRegex,
        `<span class="multiwordfinder-highlight" style="background-color: ${color}; color: ${getContrastColor(color)};" data-word="${word}">$1</span>`
      );

      let index = 0;
      replacementNode.querySelectorAll('span').forEach(highlight => {
        highlight.dataset.index = index;
        highlight.dataset.wordId = `word-${word}-${index}`;
        index++;
      });

      if (replacementNode.childElementCount > 0) {
        node.parentNode.replaceChild(replacementNode, node);
      }
    } else if (
      node.nodeType === Node.ELEMENT_NODE &&
      node.nodeName !== 'SCRIPT' &&
      node.nodeName !== 'STYLE'
    ) {
      Array.from(node.childNodes).forEach(highlightTextNode);
    }
  }

  highlightTextNode(testContent);

  return totalCount;
}

function performPartialSearch() {
    const searchInput = document.getElementById('mainSearch');
    const searchWords = searchInput.value.split(',').map(word => word.trim());
  
    clearHighlights();
    currentPosition = {};
  
    const classicColors = [
      '#FFFF77',
      '#7777FF',
      '#77FF92',
      '#C977FF',
      '#77FFE4',
      '#77C9FF',
      '#FF7792',
      '#FFAE77'
    ];
  
    let colorIndex = 0;
  
    const wordsToHighlight = searchWords.map(word => {
      const color = colorIndex < classicColors.length ? classicColors[colorIndex] : getRandomColor();
      colorIndex++;
      return { word, color };
    });
  
    const results = [];
    for (const { word, color } of wordsToHighlight) {
      if (word) {
        const count = highlightWordPartial(word, color);
        results.push({
          word,
          color,
          count
        });
      }
    }
  
    displayResults(results);
    saveState();
  
    results.forEach(result => {
      currentPosition[result.word] = 0;
    });
  }
  
  function highlightWordPartial(word, color) {
    const wordRegex = new RegExp(word, 'gi');
    const testContent = document.getElementById('test-content');
  
    let totalCount = 0;
  
    function highlightTextNode(node) {
      if (node.nodeType === Node.TEXT_NODE) {
        const matches = node.textContent.match(wordRegex);
        if (matches) {
          totalCount += matches.length;
        }
  
        const replacementNode = document.createElement('span');
        replacementNode.innerHTML = node.textContent.replace(
          wordRegex,
          `<span class="multiwordfinder-highlight" style="background-color: ${color}; color: ${getContrastColor(color)};" data-word="${word}">$&</span>`
        );
  
        let index = 0;
        replacementNode.querySelectorAll('span').forEach(highlight => {
          highlight.dataset.index = index;
          highlight.dataset.wordId = `word-${word}-${index}`;
          index++;
        });
  
        if (replacementNode.childElementCount > 0) {
          node.parentNode.replaceChild(replacementNode, node);
        }
      } else if (
        node.nodeType === Node.ELEMENT_NODE &&
        node.nodeName !== 'SCRIPT' &&
        node.nodeName !== 'STYLE'
      ) {
        Array.from(node.childNodes).forEach(highlightTextNode);
      }
    }
  
    highlightTextNode(testContent);
  
    return totalCount;
  }

function clearHighlights() {
  const highlightedElements = document.querySelectorAll('span.multiwordfinder-highlight');
  highlightedElements.forEach(element => {
    const parent = element.parentNode;
    if (parent) {
      const textNode = document.createTextNode(element.textContent);
      parent.replaceChild(textNode, element);
      parent.normalize();
    }
  });
  console.log(`Cleared ${highlightedElements.length} highlights.`);
}

function performMainSearch() {
  const searchInput = document.getElementById('mainSearch');
  const searchWords = searchInput.value.split(',').map(word => word.trim());

  clearHighlights();
  currentPosition = {};

  const classicColors = [
    '#FFFF77',
    '#7777FF',
    '#77FF92',
    '#C977FF',
    '#77FFE4',
    '#77C9FF',
    '#FF7792',
    '#FFAE77'
  ];

  let colorIndex = 0;

  const wordsToHighlight = searchWords.map(word => {
    const color = colorIndex < classicColors.length ? classicColors[colorIndex] : getRandomColor();
    colorIndex++;
    return { word, color };
  });

  const results = [];
  for (const { word, color } of wordsToHighlight) {
    if (word) {
      const count = highlightWord(word, color);
      results.push({
        word,
        color,
        count
      });
    }
  }

  displayResults(results);
  saveState();

  results.forEach(result => {
    currentPosition[result.word] = 0;
  });
}

function displayResults(results) {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = '';

  for (const result of results) {
    const card = document.createElement('div');
    card.className = 'card mb-2 flex justify-between items-center rounded shadow p-1';
    card.style.backgroundColor = result.color;
    card.style.border = '1px solid #8492c3';
    card.dataset.word = result.word;

    const isLightBackground = isColorCloserToWhite(result.color);
    const textColor = isLightBackground ? 'black' : 'white';

    const textContainer = document.createElement('div');
    textContainer.className = 'flex-grow font-bold';
    textContainer.style.color = textColor;

    const wordText = document.createElement('span');
    wordText.textContent = `${result.word} `;
    textContainer.appendChild(wordText);
    card.appendChild(textContainer);

    const resultText = document.createElement('span');
    resultText.textContent = `${result.count || 0} counts `;
    resultText.style.textAlign = 'end';
    resultText.style.display = 'flex';
    textContainer.appendChild(resultText);
    card.appendChild(textContainer);

    const positionCounter = document.createElement('span');
    positionCounter.className = 'position-counter font-bold mr-2';
    positionCounter.style.color = textColor;
    positionCounter.textContent = currentPosition.hasOwnProperty(result.word) ? `${currentPosition[result.word] + 1}/${result.count}` : `0/${result.count}`;
    card.appendChild(positionCounter);

    const buttonContainer = document.createElement('div');
    buttonContainer.className = 'button-container flex items-center rounded shadow';

    const upArrow = document.createElement('button');
    upArrow.innerHTML = '&uarr;';
    upArrow.className = 'arrow font-bold p-2 bg-gray-100 hover:bg-gray-400 rounded';
    upArrow.style.color = '#121113';
    upArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateToWord(result.word, -1);
    });
    buttonContainer.appendChild(upArrow);

    const downArrow = document.createElement('button');
    downArrow.innerHTML = '&darr;';
    downArrow.className = 'arrow font-bold bg-gray-300 p-2 hover:bg-gray-500 rounded';
    downArrow.style.color = '#121113';
    downArrow.addEventListener('click', (e) => {
      e.stopPropagation();
      navigateToWord(result.word, 1);
    });
    buttonContainer.appendChild(downArrow);

    card.appendChild(buttonContainer);

    card.addEventListener('click', () => {
      navigateToWord(result.word);
    });

    resultsContainer.appendChild(card);
  }
}

function navigateToWord(word, direction = 0) {
  const highlights = document.querySelectorAll(`span.multiwordfinder-highlight[data-word="${word}"]`);
  if (highlights.length === 0) return;

  highlights.forEach(highlight => {
    highlight.classList.remove('selected-word');
  });

  currentPosition[word] = (currentPosition[word] + highlights.length + direction) % highlights.length;

  const targetElement = highlights[currentPosition[word]];
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  targetElement.classList.add('selected-word');
  targetElement.classList.add('current-word');

  updatePositionCounter(word, currentPosition[word], highlights.length);
}

function updatePositionCounter(word, currentPosition, totalCount) {
  const card = document.querySelector(`.card[data-word="${word}"]`);
  const positionCounter = card.querySelector('.position-counter');
  positionCounter.textContent = `${currentPosition + 1}/${totalCount}`;
}

function getRandomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function isColorCloserToWhite(color) {
  const rgb = parseInt(color.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 128;
}

function getContrastColor(color) {
  const rgb = parseInt(color.substring(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  const luminance = 0.2126 * r + 0.7152 * g + 0.0722 * b;
  return luminance > 128 ? '#000000' : '#ffffff';
}

function saveState() {
  const searchInput = document.getElementById('mainSearch').value;
  const searchResults = document.getElementById('resultsContainer').innerHTML;
  const state = {
    searchInput,
    searchResults,
    currentPosition,
  };
  localStorage.setItem('demoState', JSON.stringify(state));
}

function restoreState() {
  const stateString = localStorage.getItem('demoState');
  if (stateString) {
    const state = JSON.parse(stateString);
    document.getElementById('mainSearch').value = state.searchInput;
    document.getElementById('resultsContainer').innerHTML = state.searchResults;
    currentPosition = state.currentPosition;

    // Restore the highlight colors and styles
    const highlightedElements = document.querySelectorAll('span.multiwordfinder-highlight');
    highlightedElements.forEach(element => {
      const word = element.dataset.word;
      const color = element.style.backgroundColor;
      element.style.color = getContrastColor(color);
    });
  }
}

function toggleFolderList() {
    const mainContent = document.getElementById('mainContent');
    const folderList = document.getElementById('folderList');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
  
    if (folderList.classList.contains('hidden')) {
      mainContent.classList.add('hidden');
      folderList.classList.remove('hidden');
      hamburgerMenu.classList.add('rotate-90');
    } else {
      mainContent.classList.remove('hidden');
      folderList.classList.add('hidden');
      hamburgerMenu.classList.remove('rotate-90');
    }
  }

document.addEventListener('DOMContentLoaded', function() {
  const searchInput = document.getElementById('mainSearch');
  const searchButton = document.getElementById('mainSearchBtn');
  const clearAllButton = document.getElementById('clearAllBtn');
  const partialSearchButton = document.getElementById('partialSearchBtn');
  const hamburgerMenu = document.getElementById('hamburgerMenu');

  restoreState();


  searchButton.addEventListener('click', performMainSearch);
  clearAllButton.addEventListener('click', () => {
    clearHighlights();
    document.getElementById('mainSearch').value = '';
    document.getElementById('resultsContainer').innerHTML = '';
    currentPosition = {};
    saveState();
  });
  partialSearchButton.addEventListener('click', performPartialSearch);
  hamburgerMenu.addEventListener('click', toggleFolderList);

  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      performMainSearch();
    }
  });
});