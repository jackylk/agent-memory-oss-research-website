export default function HuaweiCloudBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4 text-[8px]',
    md: 'w-5 h-5 text-[10px]',
    lg: 'w-7 h-7 text-xs',
  };

  return (
    <span
      className={`inline-flex items-center justify-center ${sizeClasses[size]} rounded font-bold bg-gradient-to-br from-red-600 to-red-700 text-white shadow-sm`}
      title="华为云"
    >
      华
    </span>
  );
}
