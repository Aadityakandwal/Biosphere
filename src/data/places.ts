export type Place = {
  id: string;
  name: string;
  category: string;
  address: string;
  lat: number;
  lng: number;
};

export const curatedPlaces: Place[] = [
  {
    id: 'curated-1',
    name: 'Lalbagh Botanical Garden',
    category: 'Botanical Gardens',
    address: 'Mavalli, Bengaluru, Karnataka 560004',
    lat: 12.9507,
    lng: 77.5848,
  },
  {
    id: 'curated-2',
    name: 'Lodhi Garden',
    category: 'Parks',
    address: 'Lodhi Rd, New Delhi, Delhi 110003',
    lat: 28.5933,
    lng: 77.2197,
  },
  {
    id: 'curated-3',
    name: 'Hanging Gardens',
    category: 'Parks',
    address: 'Malabar Hill, Mumbai, Maharashtra 400006',
    lat: 18.9567,
    lng: 72.8052,
  },
  {
    id: 'curated-4',
    name: 'The Green Yard Plant Nursery',
    category: 'Nurseries',
    address: 'Indiranagar 100ft Road, Bengaluru, Karnataka 560038',
    lat: 12.9719,
    lng: 77.6412,
  },
  {
    id: 'curated-5',
    name: 'Sunder Nursery Heritage Park',
    category: 'Botanical Gardens',
    address: 'Bharat Scouts and Guides Marg, Nizamuddin, New Delhi 110013',
    lat: 28.5912,
    lng: 77.2458,
  },
  {
    id: 'curated-6',
    name: 'My Garden Store & Pots Studio',
    category: 'Garden Stores',
    address: 'Bandra West, Mumbai, Maharashtra 400050',
    lat: 19.0596,
    lng: 72.8295,
  },
  {
    id: 'curated-7',
    name: 'Urban Greenery Boutique',
    category: 'Plant Shops',
    address: 'Koramangala 4th Block, Bengaluru, Karnataka 560034',
    lat: 12.9352,
    lng: 77.6245,
  },
];
