import { HomeType, PurchaseMethod } from "./property.new";

export interface DpgClientCache {
  [key: string]: PropertyDetails;
}

export interface RequiredZillowProperties {
  zpid: number;
  city: string;
  state: string;
  bedrooms: number;
  bathrooms: number;
  price: number;
  yearBuilt: number;
  streetAddress: string;
  zipcode: string;
  monthlyHoaFee: number | null;
  parcelId: string;
  description: string;
  latitude: number;
  longitude: number;
  propertyTaxRate: number;
  livingAreaUnits: string;
  lotSize: number;
  lotAreaValue: number;
  lotAreaUnits: string;
  annualHomeownersInsurance: number;
  livingArea: number;
  homeType: HomeType;
}

export interface RequiredZillowPropertyWithOtherData
  extends RequiredZillowProperties {
  garage?: number;
  zillowLink?: string;
  timestamp?: string | Date;
  tax?: number;
}

/* eslint-disable @typescript-eslint/no-explicit-any */
interface ZillowProperty extends RequiredZillowProperties {
  listingDataSource: string;
  homeStatus: string;
  address: any; // Replace with a more specific type if possible
  isListingClaimedByCurrentSignedInUser: boolean;
  isCurrentSignedInAgentResponsible: boolean;
  isCurrentSignedInUserVerifiedOwner: boolean;
  propertyUpdatePageLink: string | null;
  moveHomeMapLocationLink: string | null;
  propertyEventLogLink: string | null;
  editPropertyHistorylink: string | null;
  collections: any; // Replace with a more specific type if possible
  listing_sub_type: any; // Replace with a more specific type if possible
  providerListingID: string | null;
  isRentalListingOffMarket: boolean;
  hdpUrl: string;
  nearbyCities: string[]; // Assuming array of strings; adjust if different
  nearbyNeighborhoods: string[]; // Assuming array of strings; adjust if different
  country: string;
  nearbyZipcodes: string[]; // Assuming array of strings; adjust if different
  cityId: number;
  citySearchUrl: any; // Replace with a more specific type if possible
  zipcodeSearchUrl: any; // Replace with a more specific type if possible
  apartmentsForRentInZipcodeSearchUrl: any; // Replace with a more specific type if possible
  housesForRentInZipcodeSearchUrl: any; // Replace with a more specific type if possible
  abbreviatedAddress: string;
  county: string;
  neighborhoodRegion: string | null;
  building: any | null; // Replace with a more specific type if possible
  isUndisclosedAddress: boolean;
  boroughId: string | null;
  neighborhoodSearchUrl: string | null;
  stateSearchUrl: any; // Replace with a more specific type if possible
  countySearchUrl: any; // Replace with a more specific type if possible
  boroughSearchUrl: string | null;
  communityUrl: string | null;
  isShowcaseListing: boolean;
  isPremierBuilder: boolean;
  adTargets: any; // Replace with a more specific type if possible
  currency: string;
  resoFacts: any; // Replace with a more specific type if possible
  attributionInfo: any; // Replace with a more specific type if possible
  listPriceLow: number | null;
  livingAreaValue: number;

  zestimate: number;
  newConstructionType: string | null;
  zestimateLowPercent: string;
  zestimateHighPercent: string;
  rentZestimate: number;
  restimateLowPercent: string;
  restimateHighPercent: string;
  schools: any[]; // Replace with a more specific type if possible
  homeValues: any | null; // Replace with a more specific type if possible
  parentRegion: any; // Replace with a more specific type if possible
  nearbyHomes: any[]; // Replace with a more specific type if possible
  countyFIPS: string;
  taxHistory: any[]; // Replace with a more specific type if possible
  priceHistory: any[]; // Replace with a more specific type if possible
  whatILove: string | null;
  contingentListingType: string | null;
  timeOnZillow: string;
  pageViewCount: number;
  favoriteCount: number;
  daysOnZillow: number;
  openHouseSchedule: any[]; // Replace with a more specific type if possible
  desktopWebHdpImageLink: string;
  brokerageName: string;
  timeZone: string;
  listingMetadata: any; // Replace with a more specific type if possible
  pals: any[]; // Replace with a more specific type if possible
  listedBy: any[]; // Replace with a more specific type if possible
  homeInsights: any[]; // Replace with a more specific type if possible
  sellingSoon: any[]; // Replace with a more specific type if possible
  listingProvider: any | null; // Replace with a more specific type if possible
  isIncomeRestricted: boolean | null;
  brokerId: string | null;
  ssid: number;
  mortgageZHLRates: any; // Replace with a more specific type if possible
  hiResImageLink: string;
  hdpTypeDimension: string;
  mlsid: string;
  ouid: string;
  propertyTypeDimension: string;
  mediumImageLink: string;
  isZillowOwned: boolean;
  enhancedBrokerImageUrl: string;
  listingAccountUserId: string;
  tourEligibility: any; // Replace with a more specific type if possible
  contactFormRenderData: any; // Replace with a more specific type if possible
  responsivePhotos: any[]; // Replace with a more specific type if possible
  submitFlow: any[]; // Replace with a more specific type if possible
  buildingId: string | null;
  virtualTourUrl: string;
  hasApprovedThirdPartyVirtualTourUrl: boolean;
  photoCount: number;
  postingProductType: string;
  marketingName: string | null;
  ZoDsFsUpsellTop: any; // Replace with a more specific type if possible
  onsiteMessage: any; // Replace with a more specific type if possible
  stateId: number;
  zipPlusFour: string | null;
  numberOfUnitsTotal: number | null;
  foreclosureDefaultFilingDate: string | null;
  foreclosureAuctionFilingDate: string | null;
  foreclosureLoanDate: string | null;
  foreclosureLoanOriginator: string | null;
  foreclosureLoanAmount: number | null;
  foreclosurePriorSaleDate: string | null;
  foreclosurePriorSaleAmount: number | null;
  foreclosureBalanceReportingDate: string | null;
  foreclosureDefaultDescription: string | null;
  foreclosurePastDueBalance: number | null;
  foreclosureUnpaidBalance: number | null;
  foreclosureAuctionTime: string | null;
  foreclosureAuctionDescription: string | null;
  foreclosureAuctionCity: string | null;
  foreclosureAuctionLocation: string | null;
  foreclosureDate: string | null;
  foreclosureAmount: number | null;
  foreclosingBank: string | null;
  foreclosureJudicialType: string;
  datePostedString: string;
  foreclosureTypes: any; // Replace with a more specific type if possible
  foreclosureMoreInfo: string | null;
  hasBadGeocode: boolean;
  streetViewMetadataUrlMediaWallLatLong: string;
  streetViewMetadataUrlMediaWallAddress: string;
  streetViewTileImageUrlMediumLatLong: string;
  streetViewTileImageUrlMediumAddress: string;
  streetViewServiceUrl: string;
  staticMap: any; // Replace with a more specific type if possible
  postingUrl: string | null;
  richMedia: any | null; // Replace with a more specific type if possible
  hasPublicVideo: boolean;
  primaryPublicVideo: any | null; // Replace with a more specific type if possible
  richMediaVideos: any | null; // Replace with a more specific type if possible
  originalPhotos: any[]; // Replace with a more specific type if possible
  listingSubType: any; // Replace with a more specific type if possible
  tourViewCount: number;
  postingContact: any; // Replace with a more specific type if possible
  vrModel: any; // Replace with a more specific type if possible
  thirdPartyVirtualTour: any; // Replace with a more specific type if possible
  listingAccount: any | null; // Replace with a more specific type if possible
  topNavJson: any; // Replace with a more specific type if possible
  listingFeedID: string | null;
  livingAreaUnitsShort: string;
  priceChange: number;
  priceChangeDate: number;
  priceChangeDateString: string;
  formattedChip: any; // Replace with a more specific type if possible
  hideZestimate: boolean;
  comingSoonOnMarketDate: string | null;
  isPreforeclosureAuction: boolean;
  mortgageRates: any; // Replace with a more specific type if possible
  lastSoldPrice: number;
  isHousingConnector: boolean;
  responsivePhotosOriginalRatio: any[]; // Replace with a more specific type if possible
  thumb: any[]; // Replace with a more specific type if possible
  neighborhoodMapThumb: any[]; // Replace with a more specific type if possible
  isRecentStatusChange: boolean;
  isNonOwnerOccupied: boolean;
  isFeatured: boolean;
  rentalApplicationsAcceptedType: string;
  listingTypeDimension: string;
  featuredListingTypeDimension: string;
  brokerIdDimension: string;
  keystoneHomeStatus: string;
  pageUrlFragment: string;
  isRentalsLeadCapMet: boolean;
  isPaidMultiFamilyBrokerId: boolean;
  selfTour: any; // Replace with a more specific type if possible
  countyId: number;
}

interface Viewer {
  // Properties of the viewer object
}

interface ABTests {
  // Properties of the ABTests object
  [key: string]: string | null;
}

export interface PropertyDetails {
  property: ZillowProperty;
  viewer: Viewer | null;
  abTests: ABTests;
}
