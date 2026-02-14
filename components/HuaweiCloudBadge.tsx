export default function HuaweiCloudBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 28,
  };

  const dimension = sizes[size];

  return (
    <span className="inline-block" title="华为云">
      <svg
        width={dimension}
        height={dimension}
        viewBox="0 0 48 48"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="华为云"
      >
        <defs>
          <radialGradient id={`grad-${size}`} cx="50%" cy="30%">
            <stop offset="0%" style={{ stopColor: '#FF6B6B', stopOpacity: 1 }} />
            <stop offset="70%" style={{ stopColor: '#E60012', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#A50010', stopOpacity: 1 }} />
          </radialGradient>
        </defs>

        {/* Huawei 8-petal flower - each petal is a curved shape */}
        <g transform="translate(24, 24)">
          {/* Petal 1 - Top */}
          <ellipse transform="rotate(-90)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Petal 2 - Top-Right */}
          <ellipse transform="rotate(-45)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Petal 3 - Right */}
          <ellipse transform="rotate(0)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Petal 4 - Bottom-Right */}
          <ellipse transform="rotate(45)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Petal 5 - Bottom */}
          <ellipse transform="rotate(90)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Petal 6 - Bottom-Left */}
          <ellipse transform="rotate(135)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Petal 7 - Left */}
          <ellipse transform="rotate(180)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Petal 8 - Top-Left */}
          <ellipse transform="rotate(225)" rx="11" ry="5" cx="-15" cy="0" fill={`url(#grad-${size})`} />

          {/* Center circle */}
          <circle r="3" fill="white" opacity="0.3" />
        </g>
      </svg>
    </span>
  );
}
