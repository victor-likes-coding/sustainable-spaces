export function separateAndCapitalize(str: string) {
  // Split the string at every capital letter
  const words = str.split(/(?=[A-Z])/);

  // Capitalize the first letter of each word and join them with a space
  const capitalizedWords = words.map(
    (word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
  );

  // Join all the words back together
  return capitalizedWords.join(" ");
}
