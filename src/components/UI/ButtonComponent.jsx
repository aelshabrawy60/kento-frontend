function ButtonComponent({ label, onClick, loading = false, className = "", type = "Solid" }) {
  return (
    <div
      onClick={!loading ? onClick : undefined}
      className={`${className} py-2 px-4 box-border rounded-md w-full max-w-96 flex justify-center items-center gap-2 transition-opacity duration-200 select-none ${loading ? "opacity-70 cursor-not-allowed" : "cursor-pointer "
        } ${type === "Solid" ? "bg-primary text-white" : " border-2 border-primary text-primary"}`}
    >
      {loading && (
        <svg
          className="animate-spin h-4 w-4 text-white shrink-0"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
      )}
      <div className="transition-all duration-200">
        {loading ? "Loading..." : label}
      </div>
    </div>
  );
}

export default ButtonComponent;