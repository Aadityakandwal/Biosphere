export type Service = {
  id: string;
  name: string;
  price: number;
  category: string;
  description: string;
  includes: string[];
};

export type ServiceCategory = {
  id: string;
  name: string;
  intro: string;
  image: string;
  services: Service[];
};

export const serviceCategories: ServiceCategory[] = [
  {
    id: 'garden-setup',
    name: 'Garden Setup',
    intro: 'Thoughtful foundations for every kind of growing space, from a single balcony to a full terrace.',
    image: 'https://images.pexels.com/photos/19324257/pexels-photo-19324257.jpeg?auto=compress&cs=tinysrgb&w=1600',
    services: [
      { id: 'indoor-plant-setup', name: 'Indoor Plant Setup', price: 799, category: 'garden-setup', description: 'A curated selection and placement of indoor plants suited to your light and space.', includes: ['On-site consultation', 'Plant selection guidance', 'Potting and placement', 'Care overview'] },
      { id: 'outdoor-plant-setup', name: 'Outdoor Plant Setup', price: 1499, category: 'garden-setup', description: 'Establish an outdoor growing area with the right plants for your climate and soil.', includes: ['Site assessment', 'Plant selection', 'Planting and layout', 'Initial care plan'] },
      { id: 'balcony-garden-setup', name: 'Balcony Garden Setup', price: 1299, category: 'garden-setup', description: 'Transform a balcony into a productive, beautiful compact garden.', includes: ['Space planning', 'Container selection', 'Plant installation', 'Care guidance'] },
      { id: 'terrace-garden-setup', name: 'Terrace Garden Setup', price: 2999, category: 'garden-setup', description: 'A complete terrace garden with planting beds, containers and structural planning.', includes: ['Structural assessment', 'Layout design', 'Soil and drainage setup', 'Plant installation'] },
      { id: 'kitchen-garden-setup', name: 'Kitchen Garden Setup', price: 999, category: 'garden-setup', description: 'Start growing herbs and vegetables at home for everyday use.', includes: ['Edible plant selection', 'Bed or container setup', 'Soil preparation', 'Harvesting guidance'] },
    ],
  },
  {
    id: 'basic-maintenance',
    name: 'Basic Maintenance',
    intro: 'The everyday attention that keeps a garden looking its best between seasonal changes.',
    image: 'https://images.pexels.com/photos/11624605/pexels-photo-11624605.jpeg?auto=compress&cs=tinysrgb&w=1600',
    services: [
      { id: 'basic-maintenance', name: 'Basic Maintenance', price: 499, category: 'basic-maintenance', description: 'A general maintenance visit covering the essentials your garden needs.', includes: ['Visual inspection', 'Light pruning', 'Watering assessment', 'Tidying'] },
      { id: 'watering', name: 'Watering', price: 199, category: 'basic-maintenance', description: 'Proper watering of your plants adjusted to their individual needs.', includes: ['Targeted watering', 'Moisture check', 'Plant-specific adjustment'] },
      { id: 'pruning', name: 'Pruning', price: 249, category: 'basic-maintenance', description: 'Careful pruning to shape plants and encourage healthy growth.', includes: ['Selective pruning', 'Deadwood removal', 'Shaping'] },
      { id: 'repotting', name: 'Repotting', price: 349, category: 'basic-maintenance', description: 'Repotting plants that have outgrown their containers.', includes: ['Root assessment', 'Fresh soil and pot', 'Stability check'] },
    ],
  },
  {
    id: 'garden-care',
    name: 'Garden Care',
    intro: 'Targeted treatments that address nutrition, pests and plant health with a careful hand.',
    image: 'https://images.pexels.com/photos/33995853/pexels-photo-33995853.jpeg?auto=compress&cs=tinysrgb&w=1600',
    services: [
      { id: 'garden-care', name: 'Garden Care', price: 799, category: 'garden-care', description: 'A comprehensive care visit covering nutrition, health and condition.', includes: ['Health assessment', 'Fertilizer application', 'Pest inspection', 'Care notes'] },
      { id: 'fertilizer', name: 'Fertilizer', price: 349, category: 'garden-care', description: 'Applied organic fertilizer to nourish your plants and soil.', includes: ['Soil assessment', 'Organic fertilizer application', 'Application guidance'] },
      { id: 'pest-control', name: 'Pest Control', price: 499, category: 'garden-care', description: 'Safe, targeted pest management for affected plants.', includes: ['Pest identification', 'Targeted treatment', 'Prevention guidance'] },
      { id: 'plant-health-check', name: 'Plant Health Check', price: 299, category: 'garden-care', description: 'A focused check on individual plants showing signs of stress.', includes: ['Visual inspection', 'Condition assessment', 'Care recommendations'] },
      { id: 'weed-removal-care', name: 'Weed Removal', price: 249, category: 'garden-care', description: 'Removal of weeds competing with your garden plants.', includes: ['Weed removal', 'Root extraction', 'Bed restoration'] },
    ],
  },
  {
    id: 'lawn-garden-care',
    name: 'Lawn & Garden Care',
    intro: 'Keeping lawns, hedges and edges in clean, considered shape throughout the season.',
    image: 'https://images.pexels.com/photos/37554739/pexels-photo-37554739.jpeg?auto=compress&cs=tinysrgb&w=1600',
    services: [
      { id: 'lawn-garden-care', name: 'Lawn & Garden Care', price: 899, category: 'lawn-garden-care', description: 'Combined lawn and garden maintenance for the whole outdoor space.', includes: ['Lawn care', 'Hedge trimming', 'Edge definition', 'General tidying'] },
      { id: 'mowing', name: 'Mowing', price: 399, category: 'lawn-garden-care', description: 'Professional mowing to keep your lawn even and healthy.', includes: ['Lawn mowing', 'Edge trimming', 'Clipping cleanup'] },
      { id: 'hedge-trimming', name: 'Hedge Trimming', price: 449, category: 'lawn-garden-care', description: 'Precise trimming to shape and maintain hedges.', includes: ['Hedge shaping', 'Trimming', 'Cleanup'] },
      { id: 'weed-removal-lawn', name: 'Weed Removal', price: 249, category: 'lawn-garden-care', description: 'Weed removal from lawn and garden bed areas.', includes: ['Weed removal', 'Lawn spot treatment', 'Bed cleanup'] },
    ],
  },
  {
    id: 'consultation-inspection',
    name: 'Consultation & Inspection',
    intro: 'Expert eyes on your garden — from a free first assessment to detailed soil guidance.',
    image: 'https://images.pexels.com/photos/36812120/pexels-photo-36812120.jpeg?auto=compress&cs=tinysrgb&w=1600',
    services: [
      { id: 'free-garden-check', name: 'Free Garden Check', price: 0, category: 'consultation-inspection', description: 'A 45-minute on-site assessment to understand your garden and what it needs next.', includes: ['On-site walkthrough', 'Plant condition overview', 'Space assessment', 'Recommendations summary'] },
      { id: 'video-consultation', name: 'Video Consultation', price: 299, category: 'consultation-inspection', description: 'A remote video consultation for guidance without an on-site visit.', includes: ['Video call', 'Photo review', 'Verbal recommendations', 'Follow-up notes'] },
      { id: 'garden-inspection', name: 'Garden Inspection', price: 599, category: 'consultation-inspection', description: 'A detailed on-site inspection with a full written report.', includes: ['Thorough inspection', 'Written report', 'Plant-by-plant notes', 'Prioritised recommendations'] },
      { id: 'soil-testing-guidance', name: 'Soil Testing Guidance', price: 449, category: 'consultation-inspection', description: 'Guidance on testing your soil and interpreting the results.', includes: ['Sampling guidance', 'Test interpretation', 'Amendment recommendations'] },
    ],
  },
];

export const allServices: Service[] = serviceCategories.flatMap((c) => c.services);

export function getServiceById(id: string): Service | undefined {
  return allServices.find((s) => s.id === id);
}

export function getServiceCategoryById(id: string): ServiceCategory | undefined {
  return serviceCategories.find((c) => c.id === id);
}
