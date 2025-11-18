export const services = [
  {
    id: "svc1",
    slug: "ac-service",
    title: "AC Service",
    description: "Routine cleaning & maintenance (filters, coil clean, blower check).",
    basePrice: 800,
    variants: [
      { name: "Split", priceModifier: 0 },
      { name: "Window", priceModifier: -100 },
    ],
  },
  {
    id: "svc2",
    slug: "ac-repair",
    title: "AC Repair",
    description: "Fault diagnosis & repair (electrical/mechanical).",
    basePrice: 1200,
    variants: [
      { name: "Split", priceModifier: 0 },
      { name: "Window", priceModifier: -150 },
    ],
  },
  {
    id: "svc3",
    slug: "gas-refill",
    title: "Gas Refill",
    description: "AC refrigerant top-up (est. quantity based).",
    basePrice: 2500,
    variants: [{ name: "Split", priceModifier: 0 }],
  },
  {
    id: "svc4",
    slug: "Ac-installation",
    title: "Ac installation",
    description: "AC refrigerant top-up (est. quantity based).",
    basePrice: 2200,
    variants: [{ name: "Split", priceModifier: 0 },
      { name: "Window", priceModifier: -300 }
    ],
  },
];

export const technicians = [
  { id: "t1", name: "Ravi Kumar", phone: "9876500011", rating: 4.6 },
  { id: "t2", name: "Suman Singh", phone: "9876500022", rating: 4.8 },
  { id: "t3", name: "Amit Verma", phone: "9876500033", rating: 4.4 },
  { id: "t4", name: "Aman sharma", phone: "9876500044", rating: 4.3 },
];
