import "../styles/components/weathertable.css";

function formatHour(iso) {
  return iso.replace("T", " ");
}

export default function WeatherTable({ rows }) {
  return (
    <div className="tableWrap">
      <table className="table">
        <thead>
          <tr>
            <th>Time</th>
            <th>Temp (°C)</th>
            <th>Precip (mm)</th>
            <th>Wind (km/h)</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.time}>
              <td>{formatHour(r.time)}</td>
              <td>{r.temperature_2m}</td>
              <td>{r.precipitation}</td>
              <td>{r.wind_speed_10m}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
