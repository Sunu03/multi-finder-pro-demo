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
    const searchInput = document.getElementById('partialSearchBtn');
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
          `<span class="multiwordfinder-highlight rounded"  style="background-color: ${color}; color: ${getContrastColor(color)};" data-word="${word}">$&</span>`
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

  const selectedWordsInput = document.getElementById('selectedWords');
  const selectedWords = JSON.parse(selectedWordsInput.value);

  const allWords = [...searchWords, ...selectedWords.map(selectedWord => selectedWord.word)];

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

  const wordsToHighlight = allWords.map(word => {
    const selectedWord = selectedWords.find(selectedWord => selectedWord.word === word);
    const color = selectedWord ? selectedWord.color : (colorIndex < classicColors.length ? classicColors[colorIndex] : getRandomColor());
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

function performPartialSearch() {
  const searchInput = document.getElementById('mainSearch');
  const searchWords = searchInput.value.split(',').map(word => word.trim());

  const selectedWordsInput = document.getElementById('selectedWords');
  const selectedWords = JSON.parse(selectedWordsInput.value);

  const allWords = [...searchWords, ...selectedWords.map(selectedWord => selectedWord.word)];

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

  const wordsToHighlight = allWords.map(word => {
    const selectedWord = selectedWords.find(selectedWord => selectedWord.word === word);
    const color = selectedWord ? selectedWord.color : (colorIndex < classicColors.length ? classicColors[colorIndex] : getRandomColor());
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


function displayResults(results) {
  const resultsContainer = document.getElementById('resultsContainer');
  resultsContainer.innerHTML = '';

  for (const result of results) {
    const card = document.createElement('div');
    card.className = 'card mb-2 flex justify-between items-center rounded shadow p-1';
    card.style.height = '50px';
    card.style.backgroundColor = result.color;
    card.style.border = '1px solid #8492c3';
    card.dataset.word = result.word;

    const isLightBackground = isColorCloserToWhite(result.color);
    const textColor = isLightBackground ? 'black' : 'white';

    const textContainer = document.createElement('div');
    textContainer.className = 'flex-grow font-normal pl-1 ';
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
    positionCounter.className = 'position-counter font-normal mr-2';
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

  // Remove the 'selected-word' and 'current-word' classes from all highlights
  highlights.forEach(highlight => {
    highlight.classList.remove('selected-word');
    highlight.classList.remove('current-word');
  });

  currentPosition[word] = (currentPosition[word] + highlights.length + direction) % highlights.length;

  const targetElement = highlights[currentPosition[word]];
  targetElement.scrollIntoView({ behavior: 'smooth', block: 'center' });

  // Add the 'selected-word' and 'current-word' classes to the target element
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

  function saveWord() {
    const wordInput = document.getElementById('wordInput');
    const folderInput = document.getElementById('folderInput');
    const colorInput = document.getElementById('colorInput');
    const colorHexInput = document.getElementById('colorHexInput');
  
    const word = wordInput.value;
    const folder = folderInput.value;
    const color = colorInput.value !== '#000000' ? colorInput.value : (colorHexInput.value || getRandomColor());
  
    if (word && folder) {
      const savedWords = JSON.parse(localStorage.getItem('savedWords') || '{}');
  
      // Check if the word already exists in any folder
      const isDuplicate = Object.values(savedWords).some(words =>
        words.some(wordObj => wordObj.word === word)
      );
  
      if (isDuplicate) {
        alert('This word already exists in the saved words.');
        return;
      }
  
      if (!savedWords[folder]) {
        savedWords[folder] = [];
      }
  
      savedWords[folder].push({ word, color });
  
      localStorage.setItem('savedWords', JSON.stringify(savedWords));
  
      wordInput.value = '';
      folderInput.value = '';
      colorInput.value = '#000000';
      colorHexInput.value = '';
  
      displaySavedWords();
    }
  }

  function displaySavedWords() {
    const wordsContainer = document.getElementById('wordsContainer');
    wordsContainer.innerHTML = '';
  
    let savedWords = JSON.parse(localStorage.getItem('savedWords') || '{}');
  
    // Initialize default saved words if localStorage is empty
    if (Object.keys(savedWords).length === 0) {
      savedWords = {
        "Text": [
          { word: "Network", color: "#FFFF77" },
          { word: "TCP", color: "#7777FF" },
          { word: "ACK", color: "#77FF92" }
        ],
        "System Logs": [
          { word: "Deauthenticating", color: "#C977FF" },
          { word: "dropped", color: "#77FFE4" },
          { word: "WPA", color: "#77C9FF" }
        ],
        "Kernal Logs": [
          { word: "errors", color: "#FF7792" },
          { word: "tainted", color: "#FFAE77" }
        ]
      };
  
      localStorage.setItem('savedWords', JSON.stringify(savedWords));
    }
  
    for (const folder in savedWords) {
      const folderDiv = document.createElement('div');
      folderDiv.classList.add('folder', 'mb-4', 'rounded-lg');
      folderDiv.style.backgroundColor = '#282839';
      folderDiv.style.padding = '10px';
  
      const folderTitle = document.createElement('h4');
      folderTitle.classList.add('text-lg', 'font-bold', 'mb-2');
      folderTitle.textContent = folder;
      folderDiv.appendChild(folderTitle);
  
      const wordList = document.createElement('ul');
      wordList.classList.add('space-y-2');
  
      savedWords[folder].forEach(wordObj => {
        const wordListItem = createWordListItem(wordObj, folder);
        wordList.appendChild(wordListItem);
      });
  
      folderDiv.appendChild(wordList);
      wordsContainer.appendChild(folderDiv);
    }
  }

  function createWordListItem(wordObj, folder) {
    const wordListItem = document.createElement('li');
    wordListItem.classList.add('flex', 'items-center', 'justify-between', 'p-2', 'rounded', 'shadow');
    wordListItem.style.backgroundColor = wordObj.color;
  
    const checkboxContainer = document.createElement('div');
    checkboxContainer.classList.add('checkbox-container', 'flex', 'items-center');
  
    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('mr-2');
    checkbox.dataset.word = wordObj.word;
    checkbox.dataset.color = wordObj.color;
    checkbox.addEventListener('change', () => {
      toggleSelectedWord(wordListItem, wordObj.word, wordObj.color);
    });
    checkboxContainer.appendChild(checkbox);
  
    const wordSpan = document.createElement('span');
    wordSpan.textContent = wordObj.word;
    wordSpan.style.color = 'white';
    wordSpan.style.fontSize = '13px';
    wordSpan.style.fontWeight = 'bold';
    wordSpan.style.textShadow = '#000 0px 0px 10px';
    checkboxContainer.appendChild(wordSpan);
  
    wordListItem.appendChild(checkboxContainer);
  
    const buttonContainer = document.createElement('div');
    buttonContainer.classList.add('flex', 'space-x-2');
  
    const editButton = document.createElement('button');
    editButton.textContent = 'Edit';
    editButton.classList.add('bg-gray-800', 'hover:bg-gray-900', 'text-white', 'px-2', 'py-1', 'rounded');
    editButton.addEventListener('click', () => {
      openEditWordPopup(folder, wordObj);
    });
    buttonContainer.appendChild(editButton);
  
    const removeButton = document.createElement('button');
    removeButton.textContent = 'x';
    removeButton.classList.add('text-red-400', 'font-bold', 'hover:text-red-600', 'px-2', 'py-1', 'rounded');
    removeButton.addEventListener('click', () => {
      removeWord(folder, wordObj.word);
    });
    buttonContainer.appendChild(removeButton);
  
    wordListItem.appendChild(buttonContainer);
    
    removeButton.addEventListener('click', () => {
      removeWord(folder, wordObj.word);
    });
  
    return wordListItem;
  }

  function openEditWordPopup(folder, wordObj) {
    const editWordPopup = document.getElementById('editWordPopup');
    const editWordInput = document.getElementById('editWordInput');
    const editColorInput = document.getElementById('editColorInput');
    const editFolderInput = document.getElementById('editFolderInput');
    const editTagsInput = document.getElementById('editTagsInput');
    const editNoteInput = document.getElementById('editNoteInput');
    const saveEditButton = document.getElementById('saveEditButton');
    const cancelEditButton = document.getElementById('cancelEditButton');
    editWordPopup.style.position ='absolute';
  
    editWordInput.value = wordObj.word;
    editColorInput.value = wordObj.color;
    editFolderInput.value = folder;
    editTagsInput.value = wordObj.tags || '';
    editNoteInput.value = wordObj.note || '';
  
    saveEditButton.addEventListener('click', () => {
      const newColor = editColorInput.value;
      const newFolder = editFolderInput.value;
      const newTags = editTagsInput.value.split(',').map(tag => tag.trim());
      const newNote = editNoteInput.value;
  
      const savedWords = JSON.parse(localStorage.getItem('savedWords') || '{}');
  
      // Remove the word from the current folder
      savedWords[folder] = savedWords[folder].filter(word => word.word !== wordObj.word);
  
      // Check if the current folder is empty and delete it
      if (savedWords[folder].length === 0) {
        delete savedWords[folder];
      }
  
      // Add the updated word to the new folder
      if (!savedWords[newFolder]) {
        savedWords[newFolder] = [];
      }
      savedWords[newFolder].push({
        word: wordObj.word,
        color: newColor,
        tags: newTags,
        note: newNote
      });
  
      localStorage.setItem('savedWords', JSON.stringify(savedWords));
  
      displaySavedWords();
      editWordPopup.classList.add('hidden');
    });
  
    cancelEditButton.addEventListener('click', () => {
      editWordPopup.classList.add('hidden');
    });
  
    editWordPopup.classList.remove('hidden');
  }
  
  function searchSavedWords(event) {
    const searchTerm = event.target.value.toLowerCase();
    const wordsContainer = document.getElementById('wordsContainer');
    const folderDivs = wordsContainer.querySelectorAll('.folder');
  
    folderDivs.forEach(folderDiv => {
      const wordItems = folderDiv.querySelectorAll('li');
      let folderHasMatch = false;
  
      wordItems.forEach(wordItem => {
        const wordSpan = wordItem.querySelector('span');
        const word = wordSpan.textContent.toLowerCase();
        if (word.startsWith(searchTerm)) {
          wordItem.style.display = 'flex';
          folderHasMatch = true;
        } else {
          wordItem.style.display = 'none';
        }
      });
  
      if (folderHasMatch) {
        folderDiv.style.display = 'block';
      } else {
        folderDiv.style.display = 'none';
      }
    });
  }

  function removeWord(folder, wordToRemove) {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '{}');
  
    if (savedWords[folder]) {
      savedWords[folder] = savedWords[folder].filter(wordObj => wordObj.word !== wordToRemove);
  
      if (savedWords[folder].length === 0) {
        delete savedWords[folder];
      }
  
      localStorage.setItem('savedWords', JSON.stringify(savedWords));
      displaySavedWords();
    }
  }

  function toggleSelectedWord(wordListItem, word, color) {
    const selectedWordsInput = document.getElementById('selectedWords');
    const selectedWords = JSON.parse(selectedWordsInput.value);
    const wordIndex = selectedWords.findIndex(selectedWord => selectedWord.word === word && selectedWord.color === color);
  
    if (wordIndex === -1) {
      selectedWords.push({ word, color });
      wordListItem.classList.add('selected');
    } else {
      selectedWords.splice(wordIndex, 1);
      wordListItem.classList.remove('selected');
    }
  
    selectedWordsInput.value = JSON.stringify(selectedWords);
  }

  function saveWordToQuickSave(word, color, plusButton) {
    const savedWords = JSON.parse(localStorage.getItem('savedWords') || '{}');
  
    if (!savedWords['Quick save']) {
      savedWords['Quick save'] = [];
    }
  
    const existingWord = savedWords['Quick save'].find(wordObj => wordObj.word === word);
  
    if (!existingWord) {
      savedWords['Quick save'].push({ word, color });
  
      localStorage.setItem('savedWords', JSON.stringify(savedWords));
  
      displaySavedWords();
      showNotification(`"${word}" added to Quick save`);
      plusButton.remove();
    }
  }

  function handleSelectAllClick() {
    const wordsContainer = document.getElementById('wordsContainer');
    const visibleWordItems = wordsContainer.querySelectorAll('.folder:not([style*="display: none"]) li:not([style*="display: none"])');
    const selectedWordsInput = document.getElementById('selectedWords');
    const selectedWords = JSON.parse(selectedWordsInput.value);
  
    visibleWordItems.forEach(wordItem => {
      const checkbox = wordItem.querySelector('input[type="checkbox"]');
      checkbox.checked = true;
      const word = checkbox.dataset.word;
      const color = checkbox.dataset.color;
      if (!selectedWords.some(selectedWord => selectedWord.word === word && selectedWord.color === color)) {
        selectedWords.push({ word, color });
      }
    });
  
    selectedWordsInput.value = JSON.stringify(selectedWords);
  }
  
  function handleClearSelectedClick() {
    const selectedWordsInput = document.getElementById('selectedWords');
    selectedWordsInput.value = '[]';
  
    const wordsContainer = document.getElementById('wordsContainer');
    const wordCheckboxes = wordsContainer.querySelectorAll('input[type="checkbox"]');
    wordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  }

  function performFolderSearch() {
    const selectedWordsInput = document.getElementById('selectedWords');
    const selectedWords = JSON.parse(selectedWordsInput.value);
  
    clearHighlights();
    currentPosition = {};
  
    const wordsToHighlight = selectedWords;
  
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
  
  function folderClearAll() {
    const selectedWordsInput = document.getElementById('selectedWords');
    selectedWordsInput.value = '[]';
  
    const wordsContainer = document.getElementById('wordsContainer');
    const wordCheckboxes = wordsContainer.querySelectorAll('input[type="checkbox"]');
    wordCheckboxes.forEach(checkbox => {
      checkbox.checked = false;
    });
  
    clearHighlights();
    document.getElementById('resultsContainer').innerHTML = '';
    currentPosition = {};
    saveState();
  }

  function toggleExtensionContainer() {
    const extensionContainer = document.getElementById('extension-container');
    extensionContainer.classList.toggle('hidden');
  }

  document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('mainSearch');
    const searchButton = document.getElementById('mainSearchBtn');
    const clearAllButton = document.getElementById('clearAllBtn');
    const partialSearchButton = document.getElementById('partialSearchBtn');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const folderSearchButton = document.getElementById('folderSearchBtn');
    const folderClearAllButton = document.getElementById('folderClearAllBtn');
  
    displaySavedWords();
    restoreState();

  searchButton.addEventListener('click', performMainSearch);
  clearAllButton.addEventListener('click', () => {
    clearHighlights();
    document.getElementById('mainSearch').value = '';
    document.getElementById('resultsContainer').innerHTML = '';
    currentPosition = {};
    saveState();
  });
  folderSearchButton.addEventListener('click', performFolderSearch);
  folderClearAllButton.addEventListener('click', folderClearAll);
  partialSearchButton.addEventListener('click', performPartialSearch);
  hamburgerMenu.addEventListener('click', toggleFolderList);

  searchInput.addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
      performMainSearch();
    }
  });
  document.getElementById('wordSearchInput').addEventListener('input', searchSavedWords);
  document.getElementById('addWordButton').addEventListener('click', saveWord);
  document.getElementById('addWordSection').addEventListener('click', () => {
  document.getElementById('addWordContent').classList.toggle('hidden');
  document.getElementById('addWordToggle').classList.toggle('collapsed');
  displaySavedWords();
});
document.getElementById('wordSearchInput').addEventListener('input', searchSavedWords);
document.getElementById('selectAllButton').addEventListener('click', handleSelectAllClick);
document.getElementById('clearSelectedButton').addEventListener('click', handleClearSelectedClick);

document.getElementById('displayExtension').addEventListener('click',toggleExtensionContainer);


});

// Get the copy button and the text to be copied
const copyBtn = document.querySelector('.copy-btn');
const textToCopy = copyBtn.previousElementSibling.textContent;

// Add a click event listener to the copy button
copyBtn.addEventListener('click', () => {
  // Create a temporary textarea element to copy the text
  const tempTextArea = document.createElement('textarea');
  tempTextArea.value = textToCopy;
  document.body.appendChild(tempTextArea);
  tempTextArea.select();

  try {
    // Copy the text to the clipboard
    document.execCommand('copy');
    console.log('Text copied to clipboard');
  } catch (err) {
    console.error('Failed to copy text:', err);
  }

  // Remove the temporary textarea element
  document.body.removeChild(tempTextArea);
});
