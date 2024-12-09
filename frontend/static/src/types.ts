import { TRAIL_TYPES } from "./constants";

export type Trail = {
  id: string;
  name: string;
  trail_type: keyof typeof TRAIL_TYPES;
  length: string;
  elevation_gain: number;
  difficulty: number;
  description: string;
  muddy: boolean;
  rocky: boolean;
  steep: boolean;
  shaded: boolean;
  river_crossing: boolean;
  kid_friendly: boolean;
  paved: boolean;
  wheelchair_accessible: boolean;
  park: Park;
  pet_stance: "df" | "npa";
  parking: "lpark" | "apark";
  cell_strength: "ncell" | "wcell" | "scell";
  bathrooms: "nbath" | "cbath" | "dbath";
};

export type Park = {
  id: string;
  trails: Trail[];
  latitude: string;
  longitude: string;
  name: string;
  address: string;
  hours: string;
  activities: Maybe<string>;
  fee: string;
  parkcode: string;
  park_code: Maybe<string>;
};

export type Image = {
  id: string;
  image: string;
};

export type Trip = Trail &
  Park & {
    id: string;
    date: string;
    time: string;
    notes: string;
    trail: {
      id: string;
    };
    trailname: string;
    weather: Weather;
    parkname: string;
    address: string;
    elevation_gain: string;
  };

type Day = {
  dt: string;
  description: string;
  wind_speed: number;
  wind_deg: number;
  temp: {
    day: number;
  };
  weather: {
    description: string;
  }[];
};

export type Weather = {
  daily: Day[];
};
