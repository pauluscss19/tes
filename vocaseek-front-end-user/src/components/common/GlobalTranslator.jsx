import { useEffect } from "react";
import { getSavedLanguage } from "../../utils/languagePreference";
import { normalizeTranslatableText, translatePhrase } from "../../i18n/phrases";

const textNodeOriginalMap = new WeakMap();
const attributeOriginalMap = new WeakMap();

function shouldSkipNode(parentElement) {
  if (!parentElement) return true;
  const tagName = parentElement.tagName;
  return ["SCRIPT", "STYLE", "NOSCRIPT", "CODE", "PRE"].includes(tagName);
}

function preserveSpacing(originalText, translatedText) {
  const leading = originalText.match(/^\s*/)?.[0] || "";
  const trailing = originalText.match(/\s*$/)?.[0] || "";
  return `${leading}${translatedText}${trailing}`;
}

function resolveTextSource(currentText) {
  const storedText = textNodeOriginalMap.get(currentText.node);
  const visibleText = currentText.value;
  if (!storedText) return visibleText;
  const normalizedVisible = normalizeTranslatableText(visibleText);
  const knownTranslations = [
    storedText,
    translatePhrase(storedText, "id"),
    translatePhrase(storedText, "en"),
  ]
    .filter(Boolean)
    .map((text) => normalizeTranslatableText(text));
  return knownTranslations.includes(normalizedVisible) ? storedText : visibleText;
}

function translateTextNodes(root, locale) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      if (!node.textContent?.trim()) return NodeFilter.FILTER_REJECT;
      if (shouldSkipNode(node.parentElement)) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });
  let currentNode = walker.nextNode();
  while (currentNode) {
    const currentText = currentNode.textContent ?? "";
    const originalText = resolveTextSource({ node: currentNode, value: currentText });
    const translatedText = translatePhrase(originalText, locale);
    if (translatedText) {
      textNodeOriginalMap.set(currentNode, originalText);
      currentNode.textContent = preserveSpacing(originalText, translatedText);
    } else {
      textNodeOriginalMap.delete(currentNode);
      currentNode.textContent = currentText;
    }
    currentNode = walker.nextNode();
  }
}

function translateAttributes(root, locale) {
  const elements = [root, ...root.querySelectorAll("*")];
  const attributeNames = ["placeholder", "title", "aria-label", "value"];
  elements.forEach((element) => {
    attributeNames.forEach((attributeName) => {
      const attributeValue = element.getAttribute(attributeName);
      if (!attributeValue) return;
      if (attributeName === "value" && !["BUTTON", "INPUT"].includes(element.tagName)) return;
      const originalAttributes = attributeOriginalMap.get(element) || {};
      if (!originalAttributes[attributeName]) {
        originalAttributes[attributeName] = attributeValue;
        attributeOriginalMap.set(element, originalAttributes);
      }
      const translatedText = translatePhrase(originalAttributes[attributeName], locale);
      element.setAttribute(attributeName, translatedText || originalAttributes[attributeName]);
    });
  });
}

function applyGlobalTranslations(locale) {
  const root = document.getElementById("root");
  if (!root) return;
  translateTextNodes(root, locale);
  translateAttributes(root, locale);
}

export default function GlobalTranslator() {
  useEffect(() => {
    let animationFrameId = 0;
    let isTranslating = false; // ✅ flag anti infinite loop

    const translate = () => {
      const locale = normalizeTranslatableText(getSavedLanguage()) || "id";
      isTranslating = true;
      applyGlobalTranslations(locale === "en" ? "en" : "id");
      isTranslating = false;
    };

    const scheduleTranslate = () => {
      cancelAnimationFrame(animationFrameId);
      animationFrameId = window.requestAnimationFrame(translate);
    };

    const observer = new MutationObserver(() => {
      if (isTranslating) return; // ✅ skip kalau kita yang ubah DOM
      scheduleTranslate();
    });

    const root = document.getElementById("root");
    if (root) {
      observer.observe(root, {
        childList: true,
        subtree: true,
        characterData: true,
      });
    }

    scheduleTranslate();
    window.addEventListener("language-changed", scheduleTranslate);
    window.addEventListener("auth-changed", scheduleTranslate);

    return () => {
      cancelAnimationFrame(animationFrameId);
      observer.disconnect();
      window.removeEventListener("language-changed", scheduleTranslate);
      window.removeEventListener("auth-changed", scheduleTranslate);
    };
  }, []);

  return null;
}