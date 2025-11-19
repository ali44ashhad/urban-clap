export default function handler(req, res) {
  const services = [
    { id: "svc1", slug: "ac-service", title: "AC Service", description: "Routine cleaning & maintenance", basePrice: 800, variants:[{name:"Split",priceModifier:0},{name:"Window",priceModifier:-100}] },
    { id: "svc2", slug: "ac-repair", title: "AC Repair", description: "Fault diagnosis & repair", basePrice: 1200, variants:[{name:"Split",priceModifier:0},{name:"Window",priceModifier:-150}] },
    { id: "svc3", slug: "gas-refill", title: "Gas Refill", description: "Refrigerant top-up", basePrice: 2500, variants:[{name:"Split",priceModifier:0}] },
    { id: "svc4", slug: "ac-installation", title: "AC Installation", description: "AC installation and setup", basePrice: 2200, variants:[{name:"Split",priceModifier:0},{name:"Window",priceModifier:-300}] }
  ];
  res.setHeader("Cache-Control","s-maxage=60, stale-while-revalidate=300");
  res.status(200).json(services);
}
