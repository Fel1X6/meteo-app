import "../styles/components/searchbar.css";

export default function SearchBar({ value, onChange, onSubmit, disabled }) {
  return (
    <form
      className="searchForm"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <input
        className="searchInput"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter a city (e.g., Riga)"
        disabled={disabled}
      />
      <button className="btn btnPrimary" type="submit" disabled={disabled}>
        Search
      </button>
    </form>
  );
}
