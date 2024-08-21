const modifyAddress = (address: string) => {
  return address.split(' ').join('-');
};

export const createZillowUrl = (address: string | undefined | null) => {
  // https://www.zillow.com/homes/6803-119th-Pl-Largo,-FL-33773_rb/
  // turn 6803 119th Place North, Largo, FL, USA into 6803-119th-Place-North-Largo,-FL-USA
  if (!address) return;
  const modifiedAddress = modifyAddress(address);
  const url = `https://www.zillow.com/homes/${modifiedAddress}_rb/`;
  return url;
};
