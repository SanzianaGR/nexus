export function Loading({ text = 'Loading...', fullScreen = false }) {
  const container = fullScreen
    ? 'fixed inset-0 flex items-center justify-center bg-gray-50 z-50'
    : 'flex items-center justify-center p-8';

  return (
    <div className={container}>
      <div className="text-center">
        <div className="flex space-x-2 justify-center mb-4">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-4 h-4 bg-indigo-600 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
        <p className="text-gray-600 font-medium">{text}</p>
      </div>
    </div>
  );
}

export function Spinner({ size = 'md', className = '' }) {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div
      className={`${sizes[size]} border-4 border-gray-200 border-t-indigo-600 rounded-full animate-spin ${className}`}
    />
  );
}
