import { DpgClientCache } from "./errors";
import { findClosingBracket } from "./findClosingBrackets";

export function getObjectData(html: string, startingIndex: number) {
  const narrowedData = html.substring(startingIndex); // this starts our object
  const closingIndex = findClosingBracket(narrowedData);
  const stringifiedObjectData = narrowedData.substring(0, closingIndex + 1);
  try {
    const objectData = JSON.parse(stringifiedObjectData);
    if (!objectData?.props?.pageProps?.componentProps?.gdpClientCache)
      // this is a just in case there's no gdpClientCache
      throw new DpgClientCache();
    return objectData;
  } catch (err) {
    return;
  }
}
