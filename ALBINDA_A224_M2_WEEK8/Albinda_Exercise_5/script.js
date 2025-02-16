const quoteElement = document.getElementById('quote');
const authorElement = document.getElementById('author');
const newQuoteBtn = document.getElementById('newQuoteBtn');
const copyBtn = document.getElementById('copyBtn');
const shareBtn = document.getElementById('shareBtn');

function fetchQuote() {
  fetch('https://dummyjson.com/quotes')
    .then(response => response.json())
    .then(data => {
      if (data.quotes && data.quotes.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.quotes.length);
        const randomQuote = data.quotes[randomIndex];
        quoteElement.textContent = `"${randomQuote.quote}"`;
        authorElement.textContent = `- ${randomQuote.author}`;
      } else {
        throw new Error('No quotes available');
      }
    })
    .catch(error => {
      quoteElement.textContent = 'Failed to load quote. Please try again.';
      authorElement.textContent = '';
    });
}

newQuoteBtn.addEventListener('click', fetchQuote);
copyBtn.addEventListener('click', () => {
  navigator.clipboard.writeText(`${quoteElement.textContent} ${authorElement.textContent}`)
    .then(() => alert('Quote copied to clipboard!'))
    .catch(err => alert('Failed to copy quote.'));
});
shareBtn.addEventListener('click', () => {
  const quoteText = `${quoteElement.textContent} ${authorElement.textContent}`;
  const subject = 'Check out this random quote!';
  const body = encodeURIComponent(quoteText);
  const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
  window.location.href = mailtoLink;
});

fetchQuote();