const GEOCODE_BASE = "https://geocoding-api.open-meteo.com/v1/search";
const FORECAST_BASE = "https://api.open-meteo.com/v1/forecast";

async function fetchJson(url) {
  const res = await fetch(url);

  if (!res.ok) {
    const err = new Error(`API request failed with HTTP ${res.status}`);
    err.status = res.status;
    throw err;
  }

  return res.json();
}

export async function geocodeCity(name) {
  const q = encodeURIComponent(name.trim());
  const url = `${GEOCODE_BASE}?name=${q}&count=5&language=en&format=json`;
  const data = await fetchJson(url);

  const results = Array.isArray(data?.results) ? data.results : [];
  if (results.length === 0) return null;

  const r = results[0];
  return {
    name: r.name,
    country: r.country,
    admin1: r.admin1,
    latitude: r.latitude,
    longitude: r.longitude,
    timezone: r.timezone,
  };
}

export async function getHourlyForecast(latitude, longitude) {
  const params = new URLSearchParams({
    latitude: String(latitude),
    longitude: String(longitude),
    hourly: "temperature_2m,precipitation,wind_speed_10m",
    forecast_days: "2",
    timezone: "auto",
  });

  const url = `${FORECAST_BASE}?${params.toString()}`;
  const data = await fetchJson(url);

  const time = data?.hourly?.time ?? [];
  const temperature = data?.hourly?.temperature_2m ?? [];
  const precipitation = data?.hourly?.precipitation ?? [];
  const wind = data?.hourly?.wind_speed_10m ?? [];

  const rows = time.map((t, i) => ({
    time: t,
    temperature_2m: temperature[i],
    precipitation: precipitation[i],
    wind_speed_10m: wind[i],
  }));

  return { timezone: data?.timezone ?? "auto", rows };
}
