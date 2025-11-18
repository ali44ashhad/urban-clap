import * as msw from 'msw'
const { rest } = msw
import { services, technicians } from "./seed";

const STORE_KEY = "ac_mock_store_js";

function readStore() {
  return JSON.parse(localStorage.getItem(STORE_KEY) || JSON.stringify({ addresses: [], bookings: [] }));
}
function writeStore(s) {
  localStorage.setItem(STORE_KEY, JSON.stringify(s));
}

function countBooked(date, slot) {
  const store = readStore();
  return store.bookings.filter((b) => b.appointment?.date === date && b.appointment?.slot === slot).length;
}

export const handlers = [
  // list services
  rest.get("/api/services", (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(services));
  }),

  // service detail
  rest.get("/api/services/:id", (req, res, ctx) => {
    const { id } = req.params;
    const s = services.find((x) => x.id === id);
    if (!s) return res(ctx.status(404), ctx.json({ message: "Service not found" }));
    return res(ctx.json(s));
  }),

  // slots for a date (09:00 - 18:00 hourly). capacity 4.
  rest.get("/api/slots", (req, res, ctx) => {
    const date = req.url.searchParams.get("date") || "";
    const slots = [];
    for (let h = 9; h < 18; h++) {
      const slot = `${String(h).padStart(2, "0")}:00 - ${String(h + 1).padStart(2, "0")}:00`;
      const booked = countBooked(date, slot);
      slots.push({ slot, capacity: 4, booked });
    }
    return res(ctx.json({ date, slots }));
  }),

  // simulate payment
  rest.post("/api/payment/simulate", async (req, res, ctx) => {
    const body = await req.json();
    // COD always success
    if (body.method === "cod") {
      return res(ctx.delay(400), ctx.json({ success: true }));
    }
    // 90% success
    const ok = Math.random() < 0.9;
    if (ok) {
      return res(
        ctx.delay(700),
        ctx.json({ success: true, transactionId: "TX-" + Math.random().toString(36).slice(2, 9) })
      );
    }
    return res(ctx.delay(700), ctx.status(400), ctx.json({ success: false, message: "Payment failed" }));
  }),

  // create booking
  rest.post("/api/bookings", async (req, res, ctx) => {
    const payload = await req.json();
    const store = readStore();

    const date = payload.appointment?.date;
    const slot = payload.appointment?.slot;

    if (!date || !slot) {
      return res(ctx.status(400), ctx.json({ message: "Invalid appointment" }));
    }

    // capacity check
    const existing = store.bookings.filter((b) => b.appointment?.date === date && b.appointment?.slot === slot);
    if (existing.length >= 4) {
      return res(ctx.status(400), ctx.json({ message: "Selected slot is fully booked" }));
    }

    // prevent same phone double-booking same slot
    const samePhone = existing.some((b) => b.userPhone === payload.userPhone);
    if (samePhone) {
      return res(ctx.status(400), ctx.json({ message: "Phone already has booking in this slot" }));
    }

    // create booking
    const id = "BK-" + Math.random().toString(36).slice(2, 9).toUpperCase();
    const tech = technicians[Math.floor(Math.random() * technicians.length)];
    const booking = {
      id,
      createdAt: new Date().toISOString(),
      technician: { ...tech, etaMins: 15 + Math.floor(Math.random() * 45) },
      ...payload,
    };

    store.bookings.push(booking);
    writeStore(store);

    return res(ctx.delay(400), ctx.status(201), ctx.json(booking));
  }),

  // list bookings (optionally filter by phone)
  rest.get("/api/bookings", (req, res, ctx) => {
    const phone = req.url.searchParams.get("phone");
    const store = readStore();
    const result = phone ? store.bookings.filter((b) => b.userPhone === phone) : store.bookings;
    return res(ctx.json(result));
  }),

  // create address
  rest.post("/api/addresses", async (req, res, ctx) => {
    const addr = await req.json();
    const store = readStore();
    const newAddr = { ...addr, id: "AD-" + Math.random().toString(36).slice(2, 8) };
    store.addresses.push(newAddr);
    writeStore(store);
    return res(ctx.status(201), ctx.json(newAddr));
  }),
];
