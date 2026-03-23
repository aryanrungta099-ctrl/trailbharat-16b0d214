const StartTrekkingCard = () => (
  <svg width="400" height="220" viewBox="0 0 400 220" xmlns="http://www.w3.org/2000/svg" style={{ borderRadius: 20 }}>
    {/* Background */}
    <rect width="400" height="220" rx="20" fill="#1a2e1e" />
    {/* Top band for depth */}
    <rect width="400" height="60" rx="20" fill="#243828" />
    <rect y="20" width="400" height="40" fill="#243828" />

    {/* Mist ellipse behind mountains */}
    <ellipse cx="200" cy="130" rx="180" ry="50" fill="#1e3d22" opacity="0.5" />

    {/* Pale back mountain with snow cap */}
    <polygon points="280,60 340,150 220,150" fill="#2a4f30" />
    <polygon points="275,62 280,60 285,62 282,68 278,68" fill="#e8f0ea" opacity="0.6" />

    {/* Front-left hill */}
    <polygon points="60,150 130,95 200,150" fill="#224029" />
    {/* Front-right hill */}
    <polygon points="260,150 330,100 400,150" fill="#224029" />

    {/* Main central peak - back layer */}
    <polygon points="200,45 280,150 120,150" fill="#2e5c36" />
    {/* Main central peak - front layer */}
    <polygon points="200,55 260,150 140,150" fill="#3a7248" />

    {/* Snow cap on main peak */}
    <polygon points="195,55 200,45 205,55 202,62 198,62" fill="white" />
    {/* Snow streak lines */}
    <line x1="200" y1="50" x2="196" y2="72" stroke="white" strokeWidth="0.7" opacity="0.5" />
    <line x1="200" y1="50" x2="204" y2="75" stroke="white" strokeWidth="0.6" opacity="0.4" />
    <line x1="200" y1="50" x2="200" y2="78" stroke="white" strokeWidth="0.5" opacity="0.35" />
    {/* Horizontal snow ledge */}
    <line x1="178" y1="80" x2="222" y2="80" stroke="white" strokeWidth="0.6" opacity="0.3" />

    {/* Ground base */}
    <rect y="150" width="400" height="70" rx="0" fill="#162418" />
    <rect y="160" width="400" height="60" rx="0" ry="0" fill="#111e13" />
    {/* Round bottom corners */}
    <rect y="200" width="400" height="20" rx="20" fill="#111e13" />

    {/* Tree silhouettes - left side */}
    <polygon points="40,150 45,135 50,150" fill="#0f1f11" />
    <polygon points="55,150 60,132 65,150" fill="#0f1f11" />
    <polygon points="25,150 30,138 35,150" fill="#0f1f11" />
    <polygon points="70,150 76,130 82,150" fill="#0f1f11" />

    {/* Tree silhouettes - right side */}
    <polygon points="320,150 325,134 330,150" fill="#0f1f11" />
    <polygon points="340,150 346,130 352,150" fill="#0f1f11" />
    <polygon points="360,150 365,136 370,150" fill="#0f1f11" />
    <polygon points="305,150 310,137 315,150" fill="#0f1f11" />

    {/* Brand label */}
    <text x="200" y="182" textAnchor="middle" fill="#7ec99a" fontSize="11"
      fontFamily="sans-serif" letterSpacing="4" style={{ textTransform: 'uppercase' } as React.CSSProperties}>
      HIMALAYAN TRAILS
    </text>

    {/* Main text */}
    <text x="200" y="207" textAnchor="middle" fill="white" fontSize="30"
      fontFamily="Georgia, serif" fontWeight="bold" letterSpacing="1.5">
      Start Trekking
    </text>
  </svg>
);

export default StartTrekkingCard;
