# Project - Sustainable Spaces

The goal of this app is as follows:

- to allow users, renters and homeowners a way to effortless buy (both renters and homeowners), rent (renters), sell (homeowners) homes. The app offers renters a way to earn free rent in exchange for helping the effort to crowdfund the purchase of homes via a lottery.
- to provide rent stabilization through crowdfunding. we hope to be able to reduce the cost of owning a house, thus having less expenses that would require a higher rent to achieve some sort of cash flow.
- to provide homeowners with the tools to efficiently check a renters background, collect payment, schedule cleanings and other services like handyman work.

### The Lottery Mechanic

After achieving a set amount ($50,000), users who have contributed towards the crowdfund (minimum of $100) will have a chance to obtain free rent (4) months worth (minimum) up to 12 months (maximum). Each minimum contribution of $100 will be 1 drawing up to 40 entries ($4000 value). For every 4 entries (rounded down) contributed after attaining 8, if selected for free rent, you will recieve an additional month of free rent. Free rent is split up over a year, for example:

- if you recieve the minimum 4 months free rent, you will recieve free rent every 3rd month up to a year.
- if you contributed $1600, and are selected for free rent, you have 6 months of free rent and will receive free rent every 2nd month.
- if you contributed $2400, you have 8 months, you would recieve free rent after 1 month followed by 2 months of free rent
- and so forth...

You'll be notified of a move-in date if you reside in the state/city the home was purchased in or recieve a stipend of $1000 - $1200/month.

### Rent Caps

In the event we acqiure homes through crowdfunding, we will make rent equal to PITI (principal, interest, taxes, insurance) _ ~1.28 (capex, management, vacancy, other fees_ AKA Essential Fees) + 15%. For example:
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
- PITI _ Capex, Management, Vacancy: 1000 _ 1.28 = 1280
  - Capex: 10% = 128
  - Management: 5% = 64
  - Vacancy: 5% = 64
  - Other Fee: 1280 - 1000 - 128 - 64 - 64 = 28
- Flat Rate: 15% = 1280 \* 0.15 = 192

This totals: 1472/month in rent.

### Rent increases

Rent will obviously go up yearly due to inflation (min 5%), but we will cap rent increases to the CPI or (5%) whichever is higher. So if the CPI for last year is 3% then 5% is what's used due to it being the minimum, then the rent will go up the same amount based on the PITI amount. For Example:

- PITI: 1050 (5% increase)
- PITI _ Capex, Management, Vacancy: 1050 _ 1.28 = 1344
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
2/19: Rewrite ReadMe to include project details / MVP details / app mechanics ✅, create Property form/page
2/20: Property (Edit owned), Properties (view Owned)
