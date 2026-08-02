/** Ahana locations, as listed on the approved V2 site. */

export type Location = {
  name: string;
  address: string;
  mapUrl?: string;
};

export const LOCATIONS: readonly Location[] = [
  {
    name: "Gandhi Nagar",
    address: "No. 11, Subburaman Street, Gandhi Nagar, Madurai 625020",
    mapUrl: "https://maps.google.com/?q=Ahana+Hospitals+Gandhi+Nagar+Madurai",
  },
] as const;
