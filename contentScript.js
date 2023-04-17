function applyEmphasisRules(word, shortWordsLength, mediumWordsLength, longWordsLength) {
    const length = word.length;
  
    if (length <= 4) {
      return `<span class="typoglycemia-bold">${word.slice(0, shortWordsLength)}</span>${word.slice(
        shortWordsLength
      )}`;
    } else if (length <= 6) {
      return `<span class="typoglycemia-bold">${word.slice(0, mediumWordsLength)}</span>${word.slice(
        mediumWordsLength
      )}`;
    } else {
      return `<span class="typoglycemia-bold">${word.slice(0, longWordsLength)}</span>${word.slice(
        longWordsLength
      )}`;
    }
  }
  
  function typoglycemiaTransform(text, shortWordsLength, mediumWordsLength, longWordsLength) {
    return text.replace(/\b[a-zA-Z]+\b/g, (word) =>
      applyEmphasisRules(word, shortWordsLength, mediumWordsLength, longWordsLength)
    );
  }
  
  function processNode(node, shortWordsLength, mediumWordsLength, longWordsLength) {
    if (node.nodeType === Node.TEXT_NODE) {
      const span = document.createElement('span');
      span.innerHTML = typoglycemiaTransform(
        node.textContent,
        shortWordsLength,
        mediumWordsLength,
        longWordsLength
      );
      node.replaceWith(span);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach((childNode) =>
        processNode(childNode, shortWordsLength, mediumWordsLength, longWordsLength)
      );
    }
  }
  
  function isGoogleSearchPage() {
    const url = window.location.href;
    const googleSearchPattern = /^https:\/\/(www\.)?google\..+\/search/;
    return googleSearchPattern.test(url);
  }
  
  chrome.storage.sync.get(
    ['enabled', 'shortWordsLength', 'mediumWordsLength', 'longWordsLength'],
    ({ enabled, shortWordsLength, mediumWordsLength, longWordsLength }) => {
      if (enabled && !isGoogleSearchPage()) {
        processNode(
          document.body,
          shortWordsLength || 1,
          mediumWordsLength || 2,
          longWordsLength || 3
        );
      }
    }
  );
  