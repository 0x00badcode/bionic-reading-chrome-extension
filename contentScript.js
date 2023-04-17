document.addEventListener('DOMContentLoaded', function () {
    function applyEmphasisRules(word, shortWordsLength, mediumWordsLength, longWordsLength) {
        const length = word.length;
        const nonNumericPattern = /^[a-zA-Z]+$/;

        if (length <= 4 && nonNumericPattern.test(word)) {
            return `<b>${word.slice(0, shortWordsLength)}</b>${word.slice(shortWordsLength)}`;
        } else if (length <= 6 && nonNumericPattern.test(word)) {
            return `<b>${word.slice(0, mediumWordsLength)}</b>${word.slice(mediumWordsLength)}`;
        } else if (length > 6 && nonNumericPattern.test(word)) {
            return `<b>${word.slice(0, longWordsLength)}</b>${word.slice(longWordsLength)}`;
        } else {
            return word;
        }
    }

    function processNode(node, shortWordsLength, mediumWordsLength, longWordsLength) {
        if (node.nodeType === Node.TEXT_NODE) {
            const words = node.textContent.split(/\b/);
            for (let i = 0; i < words.length; i++) {
                const word = words[i];
                if (/^[a-zA-Z]+$/.test(word)) {
                    words[i] = applyEmphasisRules(word, shortWordsLength, mediumWordsLength, longWordsLength);
                }
            }
            node.textContent = words.join('');
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

    // Listen for messages from the popup
    chrome.runtime.onConnect.addListener(function (port) {
        if (port.name === 'typoglycemia') {
            port.onMessage.addListener(function (message) {
                if (message.type === 'toggle') {
                    if (message.enabled) {
                        processNode(document.body, shortWordsLength, mediumWordsLength, longWordsLength);
                    } else {
                        Array.from(document.querySelectorAll('.typoglycemia-bold')).forEach(function (element) {
                            const textNode = document.createTextNode(element.textContent);
                            element.parentNode.replaceChild(textNode, element);
                        });
                    }
                }
            });
        }
    });

});