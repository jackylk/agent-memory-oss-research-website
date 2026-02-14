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
        xmlns="http://www.w3.org/2000/svg"
        aria-label="华为云"
      >
        {/* Huawei Official Logo - Based on standard Huawei flower design */}
        <defs>
          <linearGradient id={`hwGrad1-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF6B6B" />
            <stop offset="100%" stopColor="#B00020" />
          </linearGradient>
          <linearGradient id={`hwGrad2-${size}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#FF3838" />
            <stop offset="100%" stopColor="#A00015" />
          </linearGradient>
        </defs>

        <g transform="translate(24, 24)">
          {/* Top petal */}
          <path d="M 0,-20 C -3,-15 -3,-10 0,-8 C 3,-10 3,-15 0,-20 Z" fill={`url(#hwGrad1-${size})`} />

          {/* Top-right petal */}
          <path d="M 14.14,-14.14 C 10.6,-10.6 8.48,-8.48 5.65,-5.65 C 8.48,-8.48 10.6,-10.6 14.14,-14.14 Z" fill={`url(#hwGrad2-${size})`} />

          {/* Right petal */}
          <path d="M 20,0 C 15,3 10,3 8,0 C 10,-3 15,-3 20,0 Z" fill={`url(#hwGrad1-${size})`} />

          {/* Bottom-right petal */}
          <path d="M 14.14,14.14 C 10.6,10.6 8.48,8.48 5.65,5.65 C 8.48,8.48 10.6,10.6 14.14,14.14 Z" fill={`url(#hwGrad2-${size})`} />

          {/* Bottom petal */}
          <path d="M 0,20 C 3,15 3,10 0,8 C -3,10 -3,15 0,20 Z" fill={`url(#hwGrad1-${size})`} />

          {/* Bottom-left petal */}
          <path d="M -14.14,14.14 C -10.6,10.6 -8.48,8.48 -5.65,5.65 C -8.48,8.48 -10.6,10.6 -14.14,14.14 Z" fill={`url(#hwGrad2-${size})`} />

          {/* Left petal */}
          <path d="M -20,0 C -15,-3 -10,-3 -8,0 C -10,3 -15,3 -20,0 Z" fill={`url(#hwGrad1-${size})`} />

          {/* Top-left petal */}
          <path d="M -14.14,-14.14 C -10.6,-10.6 -8.48,-8.48 -5.65,-5.65 C -8.48,-8.48 -10.6,-10.6 -14.14,-14.14 Z" fill={`url(#hwGrad2-${size})`} />
        </g>
      </svg>
    </span>
  );
}
