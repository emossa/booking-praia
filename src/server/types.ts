// INIT - LISTINGS

// INIT - RoomType
type BathroomDetailsType = {
  type: string;
  amenities: string[];
};

type BedroomDetailsType = {
  type: string;
  beds: {
    king_bed: string;
    queen_bed: string;
    sofa_bed: string;
    bunk_bed: string;
    toddler_bed: string;
    crib: string;
    floor_mattress: string;
  };
  amenities: {
    en_suite_bathroom: string;
  };
};

export type AmenityTranslationsType = {
  en?: string;
  es?: string;
  de?: string;
  he?: string;
  it?: string;
  fr?: string;
  pt?: string;
  ru?: string;
  nl?: string;
  ro?: string;
};

type AmenitiesType = {
  cod_amenity: string;
  name_amenity: string;
  name_amenity_translations: AmenityTranslationsType[];
};

type RoomImage = string;

export type RoomType = {
  id_property: number;
  id_room_type: number;
  name_room_type: string;
  address: string;
  city: string;
  post_code: string;
  cod_country: string;
  area: string;
  qt_guests: number;
  min_occupancy: number;
  max_occupancy: number;
  date_creation: string;
  size_sqm?: number;
  floor?: number;
  n_bedrooms: number;
  hide_be: boolean;
  number_of_bedrooms: number;
  number_of_bathrooms: number;
  non_smoking: boolean;
  amenities: AmenitiesType[];
  images: RoomImage[];
  bedroom_details: BedroomDetailsType[];
  bathroom_details: BathroomDetailsType[];
  be_name?: {
    df: string;
    it: string;
    en: string;
    de: string;
    es: string;
    fr: string;
  };
  be_description?: {
    df: string;
    it: string;
    en: string;
    de: string;
    es: string;
    fr: string;
  };
};

export type GetRoomTypes = {
  data: RoomType[];
  total_count: number;
  count: number;
  limit: number;
  offset: number;
  ruid: string;
};

export type PricesNAvailabilityType = {
  date_from: string;
  date_to: string;
  id_room_type: number;
  id_rate: number;
  price: number;
  closed: boolean;
  minimum_stay?: number;
  minimum_stay_arrival?: number;
  maximum_stay?: number;
  maximum_stay_arrival?: number;
  closed_arrival: boolean;
  closed_departure: boolean;
  total: number;
  booked: number;
  blocked: number;
  free: number;
};

export type GetPricesNAvailability = {
  data: PricesNAvailabilityType[];
  count: number;
  ruid: string;
};

export type Property = {
  id_ota_property: number;
  name_property: string;
  address: string;
  city: string;
  area: string;
  post_code: string;
  country: string;
  latitude: number;
  longitude: number;
  id_room_type: number;
  name_room_type: string;
};

export type GetListings = {
  data: Property[];
  total_count: number;
  count: number;
  limit: number;
  offset: number;
  ruid: string;
};

// END - RoomType

// END - LISTINGS
