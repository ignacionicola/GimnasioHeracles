import "../styles/BrandHeader.css";

const ICONS = {
  shield: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M12 2l8 3v6c0 5.25-3.438 10.012-8 11-4.562-.988-8-5.75-8-11V5l8-3z"
        fill="currentColor"
      />
      <path
        d="M12 11.5l3.5-3.5.5.5-4 4-2-2 .5-.5 1.5 1.5z"
        fill="#fff"
      />
    </svg>
  ),
  dumbbell: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M2 9h2v6H2a1 1 0 01-1-1V10a1 1 0 011-1zm18 0h2a1 1 0 011 1v4a1 1 0 01-1 1h-2V9zm-3-3h2v12h-2zM5 6h2v12H5zm4 5h6v2H9z"
        fill="currentColor"
      />
    </svg>
  ),
  gift: (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path
        d="M20 7h-3.585a2.5 2.5 0 10-3.53-3.53L12 4.856l-0.885-1.385a2.5 2.5 0 10-3.53 3.53H4a1 1 0 00-1 1v3h18V8a1 1 0 00-1-1zm-6.5-3a1.5 1.5 0 11.002 3H13V4.5a1.5 1.5 0 01.5-1.5zm-5 0A1.5 1.5 0 1110 4.5V7h-0.5a1.5 1.5 0 01-1.5-1.5zM3 12v8a2 2 0 002 2h4v-10H3zm8 0v10h2V12h-2zm4 0v10h4a2 2 0 002-2v-8h-6z"
        fill="currentColor"
      />
    </svg>
  ),
};

function BrandHeader({ subtitle, variant = "shield" }) {
  return (
    <div className="brand-header">
      <div className={`brand-icon brand-icon--${variant}`}>
        {ICONS[variant] || ICONS.shield}
      </div>
      <div className="brand-meta">
        <p>HERACLES</p>
        {subtitle && <span>{subtitle}</span>}
      </div>
    </div>
  );
}

export default BrandHeader;

