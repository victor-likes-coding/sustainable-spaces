export function findClosingBracket(text: string) {
  let inQuotes = false;
  let bracketCount = 0;
  let closingIndex = -1;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "{" && !inQuotes) {
      bracketCount++;
    } else if (char === "}" && !inQuotes) {
      bracketCount--;
      if (bracketCount === 0) {
        closingIndex = i;
        break;
      }
    }
  }

  return closingIndex;
}
