export type Product = {
  id: string;
  name: string;
  price: number;
  category: 'Tonics & Boosters' | 'Plants' | 'Tools' | 'Planters';
  description: string;
  info: string;
  image: string;
};

export const products: Product[] = [
  {
    id: 'neerva-1l',
    name: 'Neerva 1L Microbial Tonic',
    price: 249,
    category: 'Tonics & Boosters',
    description: 'A microbial tonic that supports root health and improves nutrient uptake in your plants.',
    info: 'Suitable for indoor and outdoor plants. Dilute as directed and apply to soil every two weeks.',
    image: '/neerva.png',
  },
  {
    id: 'biobloom-flower-booster',
    name: 'Vardhak Flower Booster',
    price: 349,
    category: 'Tonics & Boosters',
    description: 'An organic flower booster that encourages abundant, healthy blooms across flowering plants.',
    info: 'Apply during the flowering cycle. Safe for use with edible and ornamental flowering plants.',
    image: '/2d520c80-8a74-44a2-bad1-090d9d7ad5ce.png',
  },
  {
    id: 'biorooter-root-starter',
    name: 'BioRooter Root Starter',
    price: 199,
    category: 'Tonics & Boosters',
    description: 'A root-starter formulation that helps new plants establish stronger root systems.',
    info: 'Use during transplanting or when establishing cuttings. Apply directly to the root zone.',
    image: 'https://images.pexels.com/photos/33995853/pexels-photo-33995853.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'monstera-deliciosa',
    name: 'Monstera Deliciosa',
    price: 649,
    category: 'Plants',
    description: 'A mature Monstera Deliciosa with characteristic split leaves, potted and ready to place.',
    info: 'Prefers bright, indirect light. Water when the top layer of soil feels dry. Comes in a standard nursery pot.',
    image: 'https://images.pexels.com/photos/17619301/pexels-photo-17619301.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'snake-plant',
    name: 'Snake Plant',
    price: 349,
    category: 'Plants',
    description: 'A hardy, low-maintenance Snake Plant well suited to indoor conditions.',
    info: 'Tolerates low to bright indirect light. Allow soil to dry between waterings. Comes in a standard nursery pot.',
    image: 'https://images.pexels.com/photos/10467813/pexels-photo-10467813.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'bypass-pruner',
    name: 'Bypass Pruner',
    price: 499,
    category: 'Tools',
    description: 'A precision bypass pruner for clean cuts on stems and small branches.',
    info: 'Sharp steel blade with a comfortable grip. Wipe clean after use and store dry.',
    image: 'https://images.pexels.com/photos/38936344/pexels-photo-38936344.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'steel-hand-trowel',
    name: 'Steel Hand Trowel',
    price: 249,
    category: 'Tools',
    description: 'A durable hand trowel for potting, transplanting and general garden work.',
    info: 'Stainless steel head with a wooden handle. Suitable for container and bed gardening.',
    image: 'https://images.pexels.com/photos/9507239/pexels-photo-9507239.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'terracotta-pot',
    name: 'Hand-thrown Terracotta Pot',
    price: 179,
    category: 'Planters',
    description: 'A breathable hand-thrown terracotta pot with natural drainage.',
    info: 'Approximately 6 inches in diameter. Unglazed terracotta allows roots to breathe. Drainage hole included.',
    image: 'https://images.pexels.com/photos/9412408/pexels-photo-9412408.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
  {
    id: 'matte-ceramic-planter',
    name: 'Matte Ceramic Planter',
    price: 549,
    category: 'Planters',
    description: 'A modern matte-finish ceramic planter that complements contemporary interiors.',
    info: 'Approximately 8 inches in diameter. Interior is glazed and waterproof. Does not include a drainage hole.',
    image: 'https://images.pexels.com/photos/18449690/pexels-photo-18449690.jpeg?auto=compress&cs=tinysrgb&w=1000',
  },
];

export const productCategories = ['All', 'Tonics & Boosters', 'Plants', 'Tools', 'Planters'] as const;

export function getProductById(id: string): Product | undefined {
  return products.find((p) => p.id === id);
}
