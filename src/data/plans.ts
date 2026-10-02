export type Plan = {
  id: string;
  name: string;
  price: number | 'custom';
  period: string;
  tagline: string;
  benefits: string[];
  featured?: boolean;
  isCustom?: boolean;
  ctaText?: string;
};

export const plans: Plan[] = [
  {
    id: 'essential-care',
    name: 'Essential Care',
    price: 399,
    period: 'month',
    tagline: 'Regular attention for a garden that stays in good shape.',
    benefits: [
      '1 monthly on-site visit',
      'Seasonal pruning & organic pest check',
      '5% off one-time services',
      '6 AI scans per day',
    ],
  },
  {
    id: 'complete-care',
    name: 'Complete Care',
    price: 799,
    period: 'month',
    tagline: 'A deeper level of care with more visits and richer support.',
    benefits: [
      '2 monthly visits',
      'Repotting guidance',
      'Bio-tonic feeding',
      '10% off services',
      '15 AI scans per day',
      '1 free video consultation per month',
    ],
    featured: true,
  },
  {
    id: 'master-care',
    name: 'Master Care',
    price: 1499,
    period: 'month',
    tagline: 'Full stewardship for lawns, terraces and serious gardens.',
    benefits: [
      '4 monthly visits',
      'Weekly stewardship',
      'Full lawn & terrace management',
      '15% off services',
      'Unlimited AI scans',
      'VIP priority',
    ],
  },
  {
    id: 'custom-care',
    name: 'Custom Care',
    price: 'custom',
    period: 'bespoke',
    tagline: 'Tailored stewardship engineered for large estates, villas, and unique botanical spaces.',
    benefits: [
      'Bespoke visit frequency & schedules',
      'Custom nutrition, soil & plant therapy',
      'Dedicated lead gardener & direct concierge',
      'Full terrace, lawn & landscape care',
      'Priority emergency & storm response',
      'Customized garden health reports',
    ],
    isCustom: true,
    ctaText: 'Request Custom Plan',
  },
];
