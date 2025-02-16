let searchHistory = [];

async function lookupWord() {
    const wordInput = document.getElementById('wordInput');
    const word = wordInput.value.trim().toLowerCase();
    const resultContainer = document.getElementById('resultContainer');
    const wordInfo = document.getElementById('wordInfo');
    const definitions = document.getElementById('definitions');
    const examples = document.getElementById('examples');
    const synonyms = document.getElementById('synonyms');

    if (!word) {
        showError('Please enter a word to look up');
        return;
    }

    try {
        // Show loading state
        resultContainer.style.display = 'block';
        wordInfo.innerHTML = '<p class="loading">Looking up word...</p>';
        definitions.innerHTML = '';
        examples.innerHTML = '';
        synonyms.innerHTML = '';

        const response = await fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`);
        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.message || 'Word not found');
        }

        const wordData = data[0];

        // Display word info
        let phoneticText = wordData.phonetic || (wordData.phonetics[0] ? wordData.phonetics[0].text : '');
        wordInfo.innerHTML = `
            <h2 class="word-title">${wordData.word}</h2>
            ${phoneticText ? `<p class="phonetic">${phoneticText}</p>` : ''}
        `;

        // Display definitions and examples
        let definitionsHTML = '';
        let examplesHTML = '';
        let allSynonyms = new Set();

        wordData.meanings.forEach(meaning => {
            definitionsHTML += `<h3 class="part-of-speech">${meaning.partOfSpeech}</h3>`;
            
            meaning.definitions.forEach(def => {
                definitionsHTML += `<p class="definition">${def.definition}</p>`;
                
                if (def.example) {
                    examplesHTML += `<p class="example">"${def.example}"</p>`;
                }
            });

            // Collect synonyms
            if (meaning.synonyms) {
                meaning.synonyms.forEach(syn => allSynonyms.add(syn));
            }
        });

        definitions.innerHTML = definitionsHTML;
        examples.innerHTML = examplesHTML ? '<h3>Examples:</h3>' + examplesHTML : '';

        // Display synonyms
        if (allSynonyms.size > 0) {
            synonyms.innerHTML = '<h3>Synonyms:</h3><div class="synonyms">' + 
                Array.from(allSynonyms)
                    .map(syn => `<span class="synonym-tag">${syn}</span>`)
                    .join('') + 
                '</div>';
        }

        // Add to search history
        addToHistory(word);

    } catch (error) {
        showError(error.message === 'Word not found' ? 
            'Word not found. Please check your spelling and try again.' : 
            'An error occurred. Please try again later.');
    }
}

function showError(message) {
    const resultContainer = document.getElementById('resultContainer');
    const wordInfo = document.getElementById('wordInfo');
    
    resultContainer.style.display = 'block';
    wordInfo.innerHTML = `<p class="error-message">${message}</p>`;
    
    document.getElementById('definitions').innerHTML = '';
    document.getElementById('examples').innerHTML = '';
    document.getElementById('synonyms').innerHTML = '';
}

function addToHistory(word) {
    if (!searchHistory.includes(word)) {
        searchHistory.unshift(word);
        if (searchHistory.length > 5) {
            searchHistory.pop();
        }
        updateHistoryDisplay();
        localStorage.setItem('dictionaryHistory', JSON.stringify(searchHistory));
    }
}

function updateHistoryDisplay() {
    const historyContainer = document.getElementById('searchHistory');
    historyContainer.innerHTML = searchHistory
        .map(word => `<span class="history-item" onclick="searchHistoryWord('${word}')">${word}</span>`)
        .join('');
}

function searchHistoryWord(word) {
    document.getElementById('wordInput').value = word;
    lookupWord();
}

// Load search history from localStorage
document.addEventListener('DOMContentLoaded', () => {
    const savedHistory = localStorage.getItem('dictionaryHistory');
    if (savedHistory) {
        searchHistory = JSON.parse(savedHistory);
        updateHistoryDisplay();
    }
});