import { useMemo, useState } from "react";
import { geocodeCity, getHourlyForecast } from "./api/openMeteo";
import SearchBar from "./components/SearchBar";
import ViewToggle from "./components/ViewToggle";
import WeatherCards from "./components/WeatherCards";
import WeatherTable from "./components/WeatherTable";
import "./styles/App.css";

export default function App() {
  const [query, setQuery] = useState("");
  const [view, setView] = useState("cards");
  const [status, setStatus] = useState("idle"); 
  const [errorMessage, setErrorMessage] = useState("");
  const [place, setPlace] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [dayIndex, setDayIndex] = useState(0);

  const days = useMemo(() => {
  const rows = forecast?.rows ?? [];
  const map = new Map();

  for (const r of rows) {
    const dateKey = String(r.time).slice(0, 10);
    if (!map.has(dateKey)) map.set(dateKey, []);
    map.get(dateKey).push(r);
  }

  return Array.from(map.entries()).map(([date, rows]) => ({ date, rows }));
  }, [forecast]);

  const activeDay = days[dayIndex] ?? null;
  const rowsForView = activeDay?.rows ?? [];


  async function handleSearch() {
    const trimmed = query.trim();

    if (!trimmed) {
      setStatus("error");
      setErrorMessage("Please enter a city name.");
      setPlace(null);
      setForecast(null);
      return;
    }

    setStatus("loading");
    setErrorMessage("");
    setPlace(null);
    setForecast(null);

    try {
      const geo = await geocodeCity(trimmed);
      if (!geo) {
        setStatus("error");
        setErrorMessage("City not found. Please try another query.");
        return;
      }

      const fc = await getHourlyForecast(geo.latitude, geo.longitude);
      setPlace(geo);
      setForecast(fc);
      setDayIndex(0);
      setStatus("success");
    } catch (err) {
      let msg = "Failed to load data.";

      if (err?.status) {
        msg = `API error (HTTP ${err.status}). Please try again later.`;
      } else if (err instanceof TypeError) {
        msg =
          "Network/CORS error: the request was blocked or the network is unavailable.";
      } else if (err?.message) {
        msg = err.message;
      }

      setStatus("error");
      setErrorMessage(msg);
      console.error(err);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <header className="header">
          <h1 className="title">Weather App</h1>
          <p className="subtitle">
            Displays the weather in a selected city using a public API and the ability to
            switch between card and table views.
          </p>
        </header>

        <section className="panel">
          <div className="panelRow">
            <SearchBar
              value={query}
              onChange={setQuery}
              onSubmit={handleSearch}
              disabled={status === "loading"}
            />
            <ViewToggle
              view={view}
              onChange={setView}
              disabled={status === "loading" || status !== "success"}
            />
          </div>
        </section>

        {status === "loading" && (
          <div className="status statusLoading">Loading...</div>
        )}

        {status === "error" && (
          <div className="status statusError">{errorMessage}</div>
        )}

        {status === "success" && place && (
          <section className="results">
            <div className="placeLine">
              <span className="placeName">
                {place.name}
                {place.admin1 ? `, ${place.admin1}` : ""} — {place.country}
              </span>
            </div>

            <div className="metaLine">
              Coordinates: {place.latitude}, {place.longitude} | Timezone:{" "}
              {forecast?.timezone}
            </div>

            {days.length > 0 && (
            <div className="dayPager">
              {days.map((d, idx) => (
                <button
                  key={d.date}
                  type="button"
                  className={`pagerBtn ${idx === dayIndex ? "pagerBtnActive" : ""}`}
                  onClick={() => setDayIndex(idx)}
                >
                  {idx === 0 ? `Day 1 (${d.date})` : `Day ${idx + 1} (${d.date})`}
                </button>
              ))}
            </div>
          )}

          {rowsForView.length === 0 ? (
            <div className="status">No hourly data available.</div>
          ) : view === "cards" ? (
            <WeatherCards rows={rowsForView} />
          ) : (
            <WeatherTable rows={rowsForView} />
          )}
          </section>
        )}

        {status === "idle" && (
          <div className="hint">
            Type a city (e.g., Daugavpils) and press Search.
          </div>
        )}
      </div>
    </div>
  );
}
