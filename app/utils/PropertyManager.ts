type Address = {
  street: string;
  city: string;
  state: string;
  country: string;
};

export abstract class PropertyManager {
  static address: Address | undefined;

  static updatePlace(place: string | undefined): void {
    if (!place) return;
    // TODO: check for valid address information

    const [street, city, state, country] = place.split(', ');
    this.address = {
      street,
      city,
      state,
      country,
    };
  }
}
