# Project - Sustainable Spaces

The goal of this app is as follows:

- to allow users, renters and homeowners a way to effortless buy (both renters and homeowners), rent (renters), sell (homeowners) homes. The app offers renters a way to earn free rent in exchange for helping the effort to crowdfund the purchase of homes via a lottery.
- to provide rent stabilization through crowdfunding. we hope to be able to reduce the cost of owning a house, thus having less expenses that would require a higher rent to achieve some sort of cash flow.
- to provide homeowners with the tools to efficiently check a renters background, collect payment, schedule cleanings and other services like handyman work.

### The "Free Housing Sweepstakes" Mechanic -- Deemed illegal in Florida under Gambling laws -- unless under a charitable organization according to the [law](http://www.leg.state.fl.us/Statutes/index.cfm?App_mode=Display_Statute&URL=0800-0899/0849/Sections/0849.0935.html)

Until we can get around the legality of `Gambling` in the state of Florida. This feature will be unavailable and under construction.

After achieving a set amount ($75,000), users who have contributed towards the crowdfund (minimum of $100) will have a chance to obtain free rent (4) months worth (minimum) up to 12 months (maximum). Each minimum contribution of $100 will be 1 drawing up to 40 entries ($4000 value). For every 4 entries (rounded down) contributed after attaining 8, if selected for free rent, you will recieve an additional month of free rent. Free rent is split up over a year, for example:

- if you recieve the minimum 4 months free rent, you will recieve free rent every 3rd month up to a year.
- if you contributed $1600, and are selected for free rent, you have 6 months of free rent and will receive free rent every 2nd month.
- if you contributed $2400, you have 8 months, you would recieve free rent after 1 month followed by 2 months of free rent
- and so forth...

You'll be notified of a move-in date if you reside in the state/city the home was purchased in or recieve a stipend of $1000 - $1200/month.

### Rent Caps

In the event we acqiure homes through crowdfunding, we will make rent equal to PITI (principal, interest, taxes, insurance) \* ~1.28 (capex, management, vacancy, other fees\* AKA Essential Fees) + 15%. For example:
PITI | Essential Fees | Flat Rate | Total
|----|----|----|----|
Base | 1.28% | 15% | varies
1000 | 280 | 192 | 1472

| PITI | Essential Fees     | Capex | Management | Vacancy | Other Fees | Total  |
| ---- | ------------------ | ----- | ---------- | ------- | ---------- | ------ |
| Base | Base \* 1.28       | 10%   | 5%         | 5%      | varies     | varies |
| 1000 | Fees based on 1280 | 128   | 64         | 64      | 28         | 1472   |

Cost Breakdown:

- PITI: $1,000
- PITI + Capex, Management, Vacancy: $1,000 \* 1.28 = $1,280
  - Capex: 10% = $128
  - Management: 5% = $64
  - Vacancy: 5% = $64
  - Other Fee: $1,280 - $1,000 - $128 - $64 - $64 = $24
- Flat Rate: 15% = $1,280 \* 0.15 = $192

Total Monthly Rent: $1,472

### Rent Increases:

Rent will increase yearly due to inflation (minimum 5%), capped to the CPI or 5%, whichever is higher. For example:

- PITI: $1,050 (5% increase)
- PITI + Capex, Management, Vacancy: $1,050 \* 1.28 = $1,344
  - Capex: 10% = $134
  - Management: 5% = $67
  - Vacancy: 5% = $67
  - Other Fee: $1,344 - $1,050 - $134 - $67 - $67 = $26
- Flat Rate: 15% = $1,344 \* 0.15 = $201.6

Total Monthly Rent After Increase: $1,545.6

## MVP

The initial MVP will have the following features:

- Authentication (login/register) ✅
  - Known issues:
    - need error for connection issue with database ✅
- Property management
- Pages:
  - Home ✅
  - Donation/Crowdfund
  - Sign up ✅
  - Login ✅
  - Properties (view all) ✅
  - Properties (view owned)
  - Property (view single) ✅
  - Property (edit owned)
  - Property (add/create) ✅
  - Inbox (view rent requests)

## File Routing

/ - Root ✅
/about - About ✅
/tos - Terms of Service ✅
/privacy - Privacy ✅
/property/ - Root Property (show all properties, requires auth) ✅
/property/add - Add Form for adding properties (requires auth) ✅
/property/$id         - View single Property (requires auth) ❌
/property/$id/edit - Edit single property (requires auth + owner) ❌
/property/$id/delete  - Removes property / mark as inactive (requires auth + owner) ❌
/user/                - nothing ✅
/user/$id - The user by $id (requires auth) ❌
/user/$id/edit - Edit user information (requires auth, and authed should be that user) ❌
/user/$id/property - View all properties belonging to user ❌

## Roadmap (future features)

- Book a handy man / cleaning
- Accept payment
- Manage "Escrow" for property tax / Insurance
- Withdrawal to bank

## Schedule:

### 3/22:

**TODOs::**

- Fetch images to include in the properties page.
- Add an edit route for specific properties owned by the user.
- Create a view for user-owned properties.
- Create a new Navbar (Home | Properties | Inbox | Profile) similar to TikTok.

**Changelog:**

**Issues:**

### 3/21:

**Changelog:**

- Fix redirect in property creation action to refer to the correct object that holds property data.
- Implement image upload for new properties.
- Refactor Place API into its own component.
- Hook a cloud storage provider to save images and save link to database.
- Refactor form into its own component.
- Fetch images to include in property card.

**Known Issues:**

- Zillow will periodically ask for human confirmation to verify they're not a bot, causing the property fetch mechanism to fail.

**Things to Do:**

- Fetch images to include in the properties page.
- Add an edit route for specific properties owned by the user.
- Create a view for user-owned properties.
- Create a new Navbar (Home | Properties | Inbox | Profile) similar to TikTok.

### 3/14:

**What we've done today:**

- Fix the `/property` route to now show a more eloquent version of a card without a background. Will need multiple properties to check.
- Fix the `/property/{id}` route to match database types and display appropriate information.
- Update error handling for properties existing in the database. Redirects/Navigates to the page of the existing property.
- Remove local file management. Functions still exist but are basically deprecated.

### 3/13:

**Accomplishments today:**

- Beaten Zillow's anti-fetching mechanisms. Created a fallback for when fetching gives a forbidden response via puppeteer.
- Create fallback on Zillow scraping.
- Add Zod for validating data.
- Add property into the database.
- Fix an issue regarding sessions.

**Next steps:**

- Validate/Verify true ownership of the property (maybe later).
- View/Manage property (/user/{id}/property).
- Fix View Properties page (/property).
- Delete local copy of data.
- UI updates / navigation bar at the bottom / quick menus.

### 3/12:

**Accomplished Today:**

- Rework error messages/class.
- Install NextUI.
- Create a fallback on fetching Zillow data when the first method doesn't work.
- Filter Zillow data.
- Add Spinner for data fetching property information from Zillow.

### 2/28:

**Continue the Add Form**

**Goals:**

- Display modal on generic error message.
- Display errors on missing information from Zillow scrape on inputs.
- Loading screen for fetching.
- Maybe add data to database?

**Actual:**

- Did not work on this today, worked on real estate wholesaling.

**Today:**

- Goals: See Above (2/28).

### 2/27:

**Continue on Add Form**

**Goals:**

- Work on puppeteer to extract data like the other method of fetching.
- Obtain HOA/Insurance/Tax information, add appropriate input fields.
- Add property into the database, remove local file data.

**Actual:**

- Got puppeteer to extract data like insurance information.
- Major refactor of the getZillowData route.

### 2/26:

- Did not code really, took an extra day to do wholesaling real estate.

### 2/22 - 2/25:

- Uber/Lyfting so no code progression.

### 2/21:

**Continue Add property form**

- **Goals:**

  - Use puppeteer to scrape property data.

- **Actual:**
  - Utilize the original form of querying Zillow via the IP address given by remix. Save address information locally into files for easier retrieval. Next steps are to save the data into the database. We've refactored our Property Model to reflect the information given from Zillow. The add form needs a few more pieces of information to be complete and then be added to the database.

### 2/20:

**continue creating Property Form/page**

- Refactor the code into separate helper functions to declutter the event from the Autocomplete component.
- Added the form and various input elements as well as pulling Zillow property data and placing them in the respective input/textarea elements.
  - **Issues:**
    - Zillow has rate limited me or blocked my IP.
  - **Fixes:**
    - Requested access to Zillow public data API.

### 2/19:

**Rewrite ReadMe to include project details / MVP details / app mechanics** ✅, **create Property form/page** (WIP)

- Add Places API search input for address autocomplete.
- Create a way to scrape Zillow data.
  - **Implementation details:**
    - Utilize the Fetch API to request a modified address string from the Places API in a way Zillow recognizes. Receive the HTML string and search for a specific pattern to parse it to JSON.
  - **Issues:**
    - CORS when sending a request from the client.
  - **Fixes:**
