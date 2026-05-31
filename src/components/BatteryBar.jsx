export default function BatteryBar({ value }) {
  const getColor = () => {
    if (value >= 70) return 'bg-green-500';
    if (value >= 40) return 'bg-yellow-500';
    if (value >= 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-6 overflow-hidden shadow-sm">
      <div
        className={`${getColor()} h-6 rounded-full text-xs font-bold text-white text-center flex items-center justify-center transition-all duration-300`}
        style={{ width: `${value}%` }}
      >
        {value > 10 && `${value}%`}
      </div>
    </div>
  );
}