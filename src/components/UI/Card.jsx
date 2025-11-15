export function Card({
  children,
  className = '',
  onClick,
  hoverable = false,
  selected = false,
  ...props
}) {
  const baseStyles = 'bg-white rounded-2xl shadow-md border border-gray-200';
  const hoverStyles = hoverable ? 'cursor-pointer hover:shadow-xl hover:scale-105 transition-all duration-200' : '';
  const selectedStyles = selected ? 'ring-2 ring-indigo-500 border-indigo-500' : '';

  return (
    <div
      className={`${baseStyles} ${hoverStyles} ${selectedStyles} ${className}`}
      onClick={onClick}
      {...props}
    >
      {children}
    </div>
  );
}
