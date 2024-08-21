import { PropertyManager } from './PropertyManager';

describe('Property Manager', () => {
  it('updatePlace should update the internal property information', () => {
    const place = '6803 118th Avenue North, Largo, FL, USA';
    const expected = {
      street: '6803 118th Avenue North',
      city: 'Largo',
      state: 'FL',
      country: 'USA',
    };
    PropertyManager.updatePlace(place);

    expect(PropertyManager.address).toStrictEqual(expected);
  });

  it('updatePlace should have a zillowUrl property with a valid zillowUrl', () => {
    const place = '6803 118th Avenue North, Largo, FL, USA';
    const expected =
      'https://www.zillow.com/homes/6803-118th-Avenue-North,-Largo,-FL,-USA_rb/';
    PropertyManager.updatePlace(place);
    expect(PropertyManager.zillowUrl).toEqual(expected);
  });

  it('provideRequestBody should return an object containing an address and zillowUrl property', () => {
    const place = '6803 118th Avenue North, Largo, FL, USA';
    PropertyManager.updatePlace(place);

    const expected = {
      address: {
        street: '6803 118th Avenue North',
        city: 'Largo',
        state: 'FL',
        country: 'USA',
      },
      zillowUrl:
        'https://www.zillow.com/homes/6803-118th-Avenue-North,-Largo,-FL,-USA_rb/',
    };

    const result = PropertyManager.provideRequestBody();
    expect(result).toStrictEqual(expected);
  });
});
