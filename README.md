# Project - Sustainable Spaces

The goal of this app is as follows:

- to allow users, renters and homeowners a way to effortless buy (both renters and homeowners), rent (renters), sell (homeowners) homes. The app offers renters a way to earn free rent in exchange for helping the effort to crowdfund the purchase of homes via a lottery.
- to provide rent stabilization through crowdfunding. we hope to be able to reduce the cost of owning a house, thus having less expenses that would require a higher rent to achieve some sort of cash flow.
- to provide homeowners with the tools to efficiently check a renters background, collect payment, schedule cleanings and other services like handyman work.

### The Lottery Mechanic

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

In a less table format:

- PITI: 1000
- PITI \+ Capex, Management, Vacancy: 1000 \_ 1.28 = 1280
  - Capex: 10% = 128
  - Management: 5% = 64
  - Vacancy: 5% = 64
  - Other Fee: 1280 - 1000 - 128 - 64 - 64 = 28
- Flat Rate: 15% = 1280 \* 0.15 = 192

This totals: 1472/month in rent.

### Rent increases

Rent will obviously go up yearly due to inflation (min 5%), but we will cap rent increases to the CPI or (5%) whichever is higher. So if the CPI for last year is 3% then 5% is what's used due to it being the minimum, then the rent will go up the same amount based on the PITI amount. For Example:

- PITI: 1050 (5% increase)
- PITI \+ Capex, Management, Vacancy: 1050 \* 1.28 = 1344
  - Capex: 10% = 134
  - Management: 5% = 67
  - Vacancy: 5% = 67
  - Other Fee: 1344 - 1050 - 134 - 67 - 67 = 26
- Flat Rate: 15% = 1318.4 \* 0.15 = 201.6

This totals: 1,545.6/month in rent.

## MVP

The initial MVP will have the following features:

- Authentication (login/register) ✅
  - Known issues:
    - need error for connection issue with database
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
  - Property (add/create)
  - Inbox (view rent requests)

## Roadmap (future features)

- Book a handy man / cleaning
- Accept payment
- Manage "Escrow" for property tax / Insurance
- Withdrawal to bank

Schedule:

2/19: Rewrite ReadMe to include project details / MVP details / app mechanics ✅, create Property form/page (WIP)

- Add Places API search input for address autocomplete
- Create a way to scrape zillow data
  - Implementation details:
    - utilize the Fetch API to request a modified address string from the Places API in a way zillow recognizes. Receive the HTML string and search for a specific pattern to parse to JSON.
  - Issues:
    - CORS when sending a request from the client
  - Fixes:
    - Make a fetch call to another route that performs a server-side action.

2/20: continue creating Property Form/page

- Refactor the code into separate helper functions to declutter event from Autocomplete component.
- Added the form and various input elements as well as pulling zillow property data and placing them in the respective input/textarea elements.
  - Issues:
    - Zillow has rate limited me or blocked my IP
  - Fixes:
    - Requested access to zillow public data api

2/21: Continue Add property form

- Goals:
  - Use puppeteer to scrape property data
- Actual:
  - Utilize the original form of querying zillow via the ip address given by remix. Save address information locally into files for easier retrieval. Next steps are to save the data into the database. We've refactored our Property Model to reflect the information given from zillow. The add form needs a few more pieces of information to be complete and to then be added to database.

2/22 - 2/25: Uber/Lyfting so no code progression.

2/26: Did not code really, took an extra day to do wholesaling real estate

2/27: Continue on Add Form

Goals:

- Work on puppeteer to extract data like the other method of fetching
- Obtain HOA/Insurance/Tax information, add appropriate input fields
- Add property into database, remove local file data

Actual:

- Got puppeteer to extra data like insurance information
- Major refactor of the getZillowData route

2/28: Continue the Add Form

Goals:

- Display modal on generic error message
- Display errors on missing information from zillow scrape on inputs
- Loading screen for fetching
- Maybe add data to database?

Actual:

- I did not work on this today, worked on real estate whole saling.

Today: Maybe work on Add Form

Goals:

- See Above (2/28)

3/12:

Resuming from 2/28.
Accomplished Today:

- Rework error messages / class
- Install NextUI
- Create a fallback on fetching zillow data when the first method doesn't work
- Filter zillow data
- Add Spinner for data fetching property information from zillow

3/13:

We have beaten Zillow's anti-fetching mechanisms. Created a fallback for when fetching gives a forbidden response via puppeteer.

Accomplishments today:

- Create fallback on zillow scraping.
