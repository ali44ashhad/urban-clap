export function formatPrice(n) {
  return "₹" + Number(n).toLocaleString("en-IN");
}

export function genId(prefix = "ID") {
  return prefix + "-" + Math.random().toString(36).slice(2, 9).toUpperCase();
}

export function todayISO() {
  return new Date().toISOString().slice(0, 10);
}
