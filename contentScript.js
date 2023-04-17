function applyEmphasisRules(word) {
    const length = word.length;
  
    if (length <= 4) {
      return `<span class="typoglycemia-bold">${word.charAt(0)}</span>${word.slice(1)}`;
    } else if (length <= 6) {
      return `<span class="typoglycemia-bold">${word.slice(0, 2)}</span>${word.slice(2)}`;
    } else {
      return `<span class="typoglycemia-bold">${word.slice(0, 3)}</span>${word.slice(3)}`;
    }
  }
  
  function typoglycemiaTransform(text) {
    return text.replace(/\b[a-zA-Z]+\b/g, applyEmphasisRules);
  }
  
  function processNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const span = document.createElement('span');
      span.innerHTML = typoglycemiaTransform(node.textContent);
      node.replaceWith(span);
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      Array.from(node.childNodes).forEach(processNode);
    }
  }
  
  chrome.storage.sync.get('enabled', ({ enabled }) => {
    if (enabled) {
      processNode(document.body);
    }
  });
  