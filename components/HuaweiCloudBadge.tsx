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
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-label="华为云"
      >
        {/* Huawei flower logo - simplified 8-petal design */}
        <circle cx="12" cy="12" r="11" fill="#C8102E" />
        <path
          d="M12 4L13.5 8.5L17 6.5L15 10L19 10.5L15.5 12.5L18 16L14 14.5L13 19L11 14.5L7 16L9.5 12.5L5 10.5L9 10L7 6.5L10.5 8.5L12 4Z"
          fill="white"
          opacity="0.95"
        />
      </svg>
    </span>
  );
}
