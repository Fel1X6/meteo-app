import "../styles/components/viewtoggle.css";

export default function ViewToggle({ view, onChange, disabled }) {
  return (
    <div className="toggle">
      <button
        className={`btn btnGhost ${view === "cards" ? "btnActive" : ""}`}
        type="button"
        onClick={() => onChange("cards")}
        disabled={disabled}
        aria-pressed={view === "cards"}
      >
        Cards
      </button>
      <button
        className={`btn btnGhost ${view === "table" ? "btnActive" : ""}`}
        type="button"
        onClick={() => onChange("table")}
        disabled={disabled}
        aria-pressed={view === "table"}
      >
        Table
      </button>
    </div>
  );
}
