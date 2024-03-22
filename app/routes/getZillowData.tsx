import { json, ActionFunction, ActionFunctionArgs } from "@remix-run/node";
import {
  PropertyAlreadyExistsError,
  PropertyNotFoundError,
  ZillowCaptchaError,
  ZillowResponseError,
} from "~/utils/errors";
import { writeFile, readFile, access, mkdir } from "fs/promises";
import { dirname, join } from "path";
import {
  AdditionalMutationData,
  ZillowPropertyData,
  getZillowDataFromHtml,
  modifyAddress,
} from "~/utils/helper";

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import AdblockerPlugin from "puppeteer-extra-plugin-adblocker";
import { LaunchOptions, Page } from "puppeteer";
import { PropertyData, PropertyService } from "~/models/property";

// based on 2 letter state, get tax rate
type State = "FL"; // | "GA" | "AL" | "MS" | "LA" | "TX" | "SC" | "NC" | "TN";
const taxes: Record<State, number> = {
  FL: 0.0072,
};

puppeteer.use(StealthPlugin());
puppeteer.use(AdblockerPlugin({ blockTrackers: true }));

export const action: ActionFunction = async ({
  request,
}: ActionFunctionArgs) => {
  const { url, address } = await request.json();
  try {
    const propertyData = await getPropertyData(url, address);
    return json({
      propertyData,
    });
  } catch (e) {
    if (e instanceof PropertyAlreadyExistsError) {
      return json({
        propertyData: null,
        propertyId: e.propertyId,
        error: e.name,
      });
    }

    return json({
      error: (e as Error).name,
    });
  }
};

async function getPropertyDataFromZillow(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new ZillowResponseError({ response });
  }
  const htmlString = await response.text();
  return htmlString;
}

export async function getLocalPropertyData(
  modifiedAddress: string
): Promise<ZillowPropertyData | null> {
  try {
    const data = await readFile(
      join("app", "localPropertyData", `${modifiedAddress}.json`),
      "utf8"
    );
    return JSON.parse(data);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") {
      return null;
    }
    throw err;
  }
}

export async function getPropertyData(
  url: string,
  address: string
): Promise<PropertyData | ZillowPropertyData | undefined | null> {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [streetAddress, city, stateZip, ..._] = address.split(", ");
  const [state, zipcode] = stateZip.split(" ");

  const searchData = {
    streetAddress,
    city,
    state,
    zipcode,
  };

  let propertyData: PropertyData | ZillowPropertyData | undefined | null;

  propertyData = await PropertyService.getPropertyByAddress(searchData);
  if (propertyData)
    throw new PropertyAlreadyExistsError({ propertyId: propertyData.id });
  propertyData = await fetchPropertyDataFromZillow(url);
  addTaxData(propertyData);

  return propertyData;
}

function addTaxData(
  propertyData: ZillowPropertyData & Partial<AdditionalMutationData>
): void {
  if (propertyData.tax) return;

  // get state tax rate
  // get purchase price
  // calculate tax
  // add tax to propertyData

  const {
    address: { state },
    price,
  } = propertyData;

  const taxRate = taxes[state as State];
  if (!taxRate || !price) return; // we don't have tax data for this state yet or a purchase price

  const tax = Number(price) * taxRate;
  propertyData.tax = tax; // yearly tax rate
}

async function fetchPropertyDataFromZillow(
  url: string
): Promise<ZillowPropertyData> {
  let html: string;
  let propertyData:
    | ZillowPropertyData
    | Partial<ZillowPropertyData>
    | undefined = {};
  try {
    html = await getPropertyDataFromZillow(url);
    const pattern = `</script></div></div><div id="__NEXT_SCRIPTS_DEV__"></div><script id="__NEXT_DATA__" type="application/json">`;

    propertyData = getZillowDataFromHtml(html, pattern);

    if (!propertyData) {
      propertyData = await fetchPropertyDataWithPuppeteer(url); // first fallback
    }
  } catch (err) {
    if (err instanceof ZillowResponseError) {
      // Manually scrape the data we need from Zillow
      propertyData = await scrapePropertyDataFromZillow(url); // second fallback (really works)
    }

    if (err instanceof ZillowCaptchaError) throw err;
  } finally {
    // Perform operations that need to be executed regardless of whether an error occurred or not
    if (propertyData) {
      propertyData.timestamp = new Date().toISOString();
    }
  }

  if (propertyData) {
    return propertyData as ZillowPropertyData;
  } else {
    // Handle the case when propertyData is still undefined or null
    throw new PropertyNotFoundError();
  }
}

async function scrapePropertyDataFromZillow(
  url: string,
  config?: LaunchOptions
): Promise<ZillowPropertyData> {
  const browser = await puppeteer.launch(config || {});
  const page = await browser.newPage();
  await page.goto(url);
  const propertyData = await extractPropertyDataFromPage(page);
  if (propertyData) {
    propertyData.zillowLink = url;
  }
  return propertyData as ZillowPropertyData;
  // finally {
  //   await browser.close();
  // }
}

async function extractPropertyDataFromPage(
  page: Page
): Promise<ZillowPropertyData | undefined> {
  const newPattern = `</div><script id="__NEXT_DATA__" type="application/json">`;
  const newHTML = await page.content();

  const newPropertyData = getZillowDataFromHtml(newHTML, newPattern);
  return newPropertyData;
}

async function fetchPropertyDataWithPuppeteer(
  url: string,
  config?: LaunchOptions
): Promise<ZillowPropertyData> {
  const browser = await puppeteer.launch(config || {});
  const page = await browser.newPage();

  try {
    await page.goto(url);

    // check and see if there's an iframe with the title="Human verification challenge"
    // get a p that has the text "Press & Hold"
    // if it exists, we need to solve the captcha
    const captcha = await page.$(
      "iframe[title='Human verification challenge']"
    );
    if (captcha) {
      // Wait for the iframe to load
      await page.waitForSelector(
        'iframe[title="Human verification challenge"]'
      );

      // Switch to the iframe context
      const frames = page.frames();
      const captchaFrame = frames.find(
        async (frame) =>
          (await frame.title()) === "Human verification challenge"
      );

      // Ensure the frame was found
      if (captchaFrame) {
        // Wait for the text and button to be visible inside the iframe
        const buttonSelector = 'p:contains("Press & Hold")'; // Adjust if necessary
        await captchaFrame.waitForSelector(buttonSelector);

        // Get the position of the button
        const rect = await captchaFrame.evaluate((selector) => {
          const element = document.querySelector(selector);
          if (!element) {
            // throw new Error(`Element not found: ${selector}`);
            throw new Error("Captcha detected");
          }
          const { top, left, width, height } = element.getBoundingClientRect();
          return { x: left + width / 2, y: top + height / 2 };
        }, buttonSelector);

        // Move to the button position and press & hold
        await page.mouse.move(rect.x, rect.y, { steps: 10 }); // Move in steps for smoother action
        await page.mouse.down();

        // Hold for the required duration, e.g., 3000 milliseconds = 3 seconds
        setTimeout(async () => {
          // Release the mouse to complete the press and hold action
          await page.mouse.up();
        }, 7000); // Adjust time as necessary based on CAPTCHA requirements
      }
    }
    const anchor = await page.waitForSelector(
      `a[data-test-id="bdp-property-card"][class="unit-card-link"][href^="/homedetails/"]`
    );

    if (!anchor) {
      throw new PropertyNotFoundError();
    }

    const newUrl =
      `https://www.zillow.com` +
      (await page.evaluate((el) => el.getAttribute("href"), anchor));

    await Promise.all([page.goto(newUrl), page.waitForNavigation()]);

    const newPropertyData = await extractPropertyDataFromPage(page);
    if (!newPropertyData) {
      throw new PropertyNotFoundError();
    }

    newPropertyData.zillowLink = newUrl;
    newPropertyData.timestamp = new Date().toISOString();

    return newPropertyData;
  } finally {
    await browser.close();
  }
}

async function saveLocalPropertyData(
  modifiedAddress: string,
  propertyData: ZillowPropertyData
): Promise<void> {
  const filePath = join("app", "localPropertyData", `${modifiedAddress}.json`);
  const directory = dirname(filePath);
  try {
    await access(directory); // Check if directory exists
  } catch (err) {
    // Directory doesn't exist, create it
    await mkdir(directory, { recursive: true });
  }
  await writeFile(filePath, JSON.stringify(propertyData));
}

export async function typeAddress(page: Page, url: string, address: string) {
  page.setDefaultTimeout(10000);
  await page.goto(url);
  const inputSelector =
    "input[placeholder='Enter an address, neighborhood, city, or ZIP code']";
  await page.waitForSelector(inputSelector);

  // Select the input field
  const inputField = await page.$(inputSelector);

  if (!inputField) {
    throw new Error("Input field not found");
  }

  // Type into the input field
  await inputField.type(address);
  const button = await page.$(".StyledIconButton-c11n-8-86-1__sc-1pb8vz8-0");
  if (!button) {
    throw new Error("Button not found");
  }
  await button.click();
}

export async function getInsuranceData(
  page: Page,
  propertyData: ZillowPropertyData
) {
  const button = await page.waitForSelector(
    `button[id="label-home-insurance"]`
  );
  if (!button) {
    throw new Error("Button not found");
  }

  await Promise.all([
    await button.click(),
    await page.waitForSelector(`input[id="home-insurance"]`), // this won't show up until we click on the button
  ]);

  // wait for the input to show up
  const insuranceData = await page.evaluate(() => {
    // #home-insurance is an input element
    const insuranceData: HTMLInputElement | null = document.querySelector(
      "input[id='home-insurance']"
    );
    if (!insuranceData) return "0";
    return insuranceData.value;
  });

  propertyData.annualHomeownersInsurance = Number(insuranceData);
}

export async function getInsuranceDataFromPuppeteer(
  url: string,
  address: string,
  propertyData: ZillowPropertyData
) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  if (!propertyData.zillowLink || !url) {
    // the url should work
    await typeAddress(page, `https://www.zillow.com`, address);
  } else {
    await page.goto(propertyData.zillowLink || url);
  }

  await getInsuranceData(page, propertyData);
  // save propertyData
  const modifiedAddress = modifyAddress(address);
  await saveLocalPropertyData(modifiedAddress, propertyData);
  await browser.close();
}

export async function checkFreshnessOfLocalData(localData: ZillowPropertyData) {
  const currentTime = new Date().getTime();
  if (!localData.timestamp) throw new Error("No timestamp found");

  const localDataTime = new Date(localData.timestamp).getTime();
  const timeDifference = currentTime - localDataTime;
  const hoursDifference = timeDifference / (1000 * 60 * 60);

  return localData && hoursDifference < 720;
}
