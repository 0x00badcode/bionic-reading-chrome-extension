function applyEmphasisRules(word, shortWordsLength, mediumWordsLength, longWordsLength) {
    const length = word.length;

    if (length <= 4) {
        return `<span class="typoglycemia-bold">${word.charAt(0)}</span>${word.slice(1)}`;
    } else if (length <= 6) {
        return `<span class="typoglycemia-bold">${word.slice(0, 2)}</span>${word.slice(2)}`;
    } else {
        return `<span class="typoglycemia-bold">${word.slice(0, 3)}</span>${word.slice(3)}`;
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
        span.innerHTML = typoglycemiaTransform(node.textContent, shortWordsLength, mediumWordsLength, longWordsLength);
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
    {
        shortWordsLength: 1,
        mediumWordsLength: 2,
        longWordsLength: 3,
        extensionEnabled: true,
    },
    function (data) {
        if (data.extensionEnabled && !isGoogleSearchPage()) {
            processNode(document.body, data.shortWordsLength, data.mediumWordsLength, data.longWordsLength);
        }
    }
);

chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
    if (message.action === 'toggleExtension') {
        if (message.value === true) {
            processNode(document.body);
        } else {
            document.querySelectorAll('span.typoglycemia-bold').forEach((el) => {
                el.outerHTML = el.innerHTML;
            });
        }
    }
});

