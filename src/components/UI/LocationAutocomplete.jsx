import { useEffect, useRef, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { flatLocations } from "../../data/egyptLocations";
import { MapPin, X, ChevronDown, Search } from "lucide-react";

/**
 * Smart Egypt Location Autocomplete
 * - Dropdown rendered via React Portal → never clipped by parent overflow/z-index
 * - Fuzzy/partial search across city + governorate
 * - Keyboard navigation (↑ ↓ Enter Esc)
 * - Grouped results by governorate
 * - Shows governorate badge on selected location
 */
function LocationAutocomplete({ value, onChange, label = "Location", placeholder = "Search city or area…" }) {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const [results, setResults] = useState([]);
  const [dropdownStyle, setDropdownStyle] = useState({});

  const inputRef = useRef(null);
  const listRef = useRef(null);
  const containerRef = useRef(null);

  // ── Filter & rank results ──────────────────────────────────────────────────
  const search = useCallback((q) => {
    const term = q.trim().toLowerCase();
    if (!term) {
      setResults(flatLocations.slice(0, 20));
      return;
    }
    const scored = flatLocations
      .map((loc) => {
        const cityLow  = loc.city.toLowerCase();
        const govLow   = loc.governorate.toLowerCase();
        const labelLow = loc.label.toLowerCase();
        let score = 0;
        if (cityLow.startsWith(term))            score += 100;
        else if (cityLow.includes(term))          score += 60;
        if (govLow.startsWith(term))              score += 40;
        else if (govLow.includes(term))           score += 20;
        if (labelLow.includes(term) && score === 0) score += 10;
        return { ...loc, score };
      })
      .filter(l => l.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 40);
    setResults(scored);
  }, []);

  // ── Compute dropdown position from the input's bounding rect ──────────────
  const computeDropdownStyle = useCallback(() => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const spaceBelow = window.innerHeight - rect.bottom;
    const spaceAbove = rect.top;
    const dropHeight = 260;

    // Open above if not enough space below and more space above
    const openAbove = spaceBelow < dropHeight + 12 && spaceAbove > spaceBelow;

    setDropdownStyle({
      position: "fixed",
      left: rect.left + window.scrollX,
      width: rect.width,
      ...(openAbove
        ? { bottom: window.innerHeight - rect.top + 6 }
        : { top: rect.bottom + window.scrollY + 6 }),
      zIndex: 99999,
    });
  }, []);

  // ── Sync query with external value ────────────────────────────────────────
  useEffect(() => {
    if (value && !isOpen) {
      const found = flatLocations.find(l => l.label === value || l.city === value);
      setQuery(found ? found.label : value);
    }
    if (!value) setQuery("");
  }, [value]);

  // ── Open dropdown ─────────────────────────────────────────────────────────
  const openDropdown = () => {
    computeDropdownStyle();
    search(query);
    setHighlighted(0);
    setIsOpen(true);
  };

  // Recompute position on scroll/resize while open
  useEffect(() => {
    if (!isOpen) return;
    const update = () => computeDropdownStyle();
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [isOpen, computeDropdownStyle]);

  // ── Handle input change ───────────────────────────────────────────────────
  const handleInput = (e) => {
    const q = e.target.value;
    setQuery(q);
    onChange(null);
    search(q);
    setHighlighted(0);
    setIsOpen(true);
  };

  // ── Select a result ───────────────────────────────────────────────────────
  const select = (loc) => {
    setQuery(loc.label);
    onChange(loc.label);
    setIsOpen(false);
    inputRef.current?.blur();
  };

  // ── Clear selection ───────────────────────────────────────────────────────
  const clear = (e) => {
    e.stopPropagation();
    setQuery("");
    onChange(null);
    setIsOpen(false);
    inputRef.current?.focus();
  };

  // ── Keyboard navigation ───────────────────────────────────────────────────
  const handleKeyDown = (e) => {
    if (!isOpen) {
      if (e.key === "ArrowDown" || e.key === "Enter") openDropdown();
      return;
    }
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlighted(h => Math.min(h + 1, results.length - 1));
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlighted(h => Math.max(h - 1, 0));
        break;
      case "Enter":
        e.preventDefault();
        if (results[highlighted]) select(results[highlighted]);
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  };

  // Scroll highlighted item into view
  useEffect(() => {
    if (!listRef.current) return;
    const item = listRef.current.querySelector(`[data-idx="${highlighted}"]`);
    item?.scrollIntoView({ block: "nearest" });
  }, [highlighted]);

  // ── Close on outside click ────────────────────────────────────────────────
  useEffect(() => {
    const handler = (e) => {
      if (
        !containerRef.current?.contains(e.target) &&
        !listRef.current?.contains(e.target)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // ── Group results by governorate ──────────────────────────────────────────
  const grouped = results.reduce((acc, loc) => {
    if (!acc[loc.governorate]) acc[loc.governorate] = [];
    acc[loc.governorate].push(loc);
    return acc;
  }, {});

  const govOrder = [];
  results.forEach(loc => {
    if (!govOrder.includes(loc.governorate)) govOrder.push(loc.governorate);
  });

  const selectedLoc = value
    ? flatLocations.find(l => l.label === value || l.city === value)
    : null;

  // ── Dropdown JSX (rendered via portal) ───────────────────────────────────
  const dropdown = isOpen && createPortal(
    <div
      ref={listRef}
      style={{
        ...dropdownStyle,
        background: "#ffffff",
        border: "1.5px solid #E5E7EB",
        borderRadius: "12px",
        boxShadow: "0 12px 40px rgba(0,0,0,0.15)",
        maxHeight: "260px",
        overflowY: "auto",
      }}
    >
      {results.length === 0 ? (
        <div style={{ padding: "16px", textAlign: "center", color: "#9CA3AF", fontSize: "13px" }}>
          No locations found for "{query}"
        </div>
      ) : (
        (() => {
          let globalIdx = 0;
          return govOrder.map((gov) => (
            <div key={gov}>
              {/* Governorate header */}
              <div
                style={{
                  padding: "6px 12px 4px",
                  fontSize: "10px",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  textTransform: "uppercase",
                  color: "#008D87",
                  background: "#F0FAF9",
                  borderTop: "1px solid #E5E7EB",
                  display: "flex",
                  alignItems: "center",
                  gap: "5px",
                  position: "sticky",
                  top: 0,
                }}
              >
                <MapPin size={9} /> {gov}
              </div>

              {/* Cities */}
              {grouped[gov].map((loc) => {
                const idx = globalIdx++;
                const isHighlighted = idx === highlighted;
                return (
                  <div
                    key={loc.label}
                    data-idx={idx}
                    onMouseEnter={() => setHighlighted(idx)}
                    onMouseDown={(e) => { e.preventDefault(); select(loc); }}
                    style={{
                      padding: "8px 14px 8px 22px",
                      cursor: "pointer",
                      fontSize: "13px",
                      color: "#374151",
                      background: isHighlighted ? "#F0FAF9" : "transparent",
                      fontWeight: loc.label === value ? 600 : 400,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      transition: "background 0.1s",
                    }}
                  >
                    <span>{loc.city}</span>
                    {loc.label === value && (
                      <span style={{ color: "#008D87", fontSize: "11px" }}>✓</span>
                    )}
                  </div>
                );
              })}
            </div>
          ));
        })()
      )}
    </div>,
    document.body
  );

  return (
    <div ref={containerRef} className="relative w-full max-w-96" style={{ fontFamily: "inherit" }}>
      {/* Label */}
      <label
        className="flex items-center gap-1.5 text-sm font-medium mb-1.5"
        style={{ color: "#374151" }}
      >
        <MapPin size={13} style={{ color: "#008D87" }} />
        {label}
      </label>

      {/* Input wrapper */}
      <div
        className="relative flex items-center"
        onClick={() => { inputRef.current?.focus(); openDropdown(); }}
        style={{
          background: isOpen ? "#ffffff" : "#F7FBFF",
          border: `1.5px solid ${isOpen ? "#008D87" : "#D4D7E3"}`,
          borderRadius: "10px",
          transition: "border-color 0.2s, box-shadow 0.2s",
          boxShadow: isOpen ? "0 0 0 3px rgba(0,141,135,0.12)" : "none",
          cursor: "text",
        }}
      >
        <Search
          size={15}
          style={{
            position: "absolute",
            left: "12px",
            color: isOpen ? "#008D87" : "#9CA3AF",
            flexShrink: 0,
            transition: "color 0.2s",
          }}
        />

        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInput}
          onFocus={openDropdown}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          autoComplete="off"
          style={{
            width: "100%",
            padding: "9px 36px 9px 34px",
            background: "transparent",
            border: "none",
            outline: "none",
            fontSize: "14px",
            color: "#111827",
          }}
        />

        {query ? (
          <button
            type="button"
            onClick={clear}
            style={{
              position: "absolute",
              right: "10px",
              color: "#9CA3AF",
              display: "flex",
              alignItems: "center",
              cursor: "pointer",
              background: "none",
              border: "none",
              padding: 0,
            }}
            title="Clear"
          >
            <X size={14} />
          </button>
        ) : (
          <ChevronDown
            size={14}
            style={{
              position: "absolute",
              right: "10px",
              color: "#9CA3AF",
              transform: isOpen ? "rotate(180deg)" : "rotate(0deg)",
              transition: "transform 0.2s",
              pointerEvents: "none",
            }}
          />
        )}
      </div>

      {/* Governorate badge shown when something is selected */}
      {selectedLoc && !isOpen && (
        <div style={{ marginTop: "6px", display: "flex", alignItems: "center", gap: "6px" }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              padding: "2px 8px",
              borderRadius: "20px",
              background: "#E6F4F3",
              color: "#008D87",
              fontSize: "11px",
              fontWeight: 600,
            }}
          >
            <MapPin size={9} /> {selectedLoc.governorate}
          </span>
        </div>
      )}

      {/* Portal dropdown */}
      {dropdown}
    </div>
  );
}

export default LocationAutocomplete;
