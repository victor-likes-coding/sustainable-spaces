import { createZillowUrl } from './createZillowUrl';

type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
};

type RequestBody = {
  address: Address;
  zillowUrl: string;
};

export abstract class PropertyManager {
  static address: Address;
  static zillowUrl: string;

  static updatePlace(place: string | undefined): void {
    const url = createZillowUrl(place);
    if (!place || !url) return;
    // TODO: check for valid address information

    const [street, city, state, country] = place.split(', ');
    // TODO: This might be useless
    this.address = {
      street,
      city,
      state,
      country,
    };

    this.zillowUrl = url;
  }

  static provideRequestBody(): RequestBody {
    return {
      address: this.address,
      zillowUrl: this.zillowUrl,
    };
  }
}
