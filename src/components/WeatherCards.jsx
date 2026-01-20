import "../styles/components/weathercards.css";

function formatHour(iso) {
  return iso.replace("T", " ");
}

export default function WeatherCards({ rows }) {
  return (
    <div className="cardsGrid">
      {rows.map((r) => (
        <div className="card" key={r.time}>
          <div className="cardTitle">{formatHour(r.time)}</div>
          <div className="cardRow">
            <span className="label">Temperature</span>
            <span className="value">{r.temperature_2m}°C</span>
          </div>
          <div className="cardRow">
            <span className="label">Precipitation</span>
            <span className="value">{r.precipitation} mm</span>
          </div>
          <div className="cardRow">
            <span className="label">Wind</span>
            <span className="value">{r.wind_speed_10m} km/h</span>
          </div>
        </div>
      ))}
    </div>
  );
}
