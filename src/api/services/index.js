// api/services/index.js
// Simple serverless endpoint for Vercel that returns mock services.
// Keeps your frontend unchanged (it calls /api/services).

export default function handler(req, res) {
  const services = [
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
      slug: "ac-installation",
      title: "AC Installation",
      description: "AC installation and setup.",
      basePrice: 2200,
      variants: [
        { name: "Split", priceModifier: 0 },
        { name: "Window", priceModifier: -300 },
      ],
    },
  ];

  // Cache briefly at CDN edge
  res.setHeader("Cache-Control", "s-maxage=60, stale-while-revalidate=300");
  res.status(200).json(services);
}
