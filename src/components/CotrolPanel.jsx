export default function ControlPanel({
  reset,
  onClearLog,
}) {
  return (
    <div className="flex gap-3 mb-6">
      <button
        onClick={reset}
        className="bg-red-500 hover:bg-red-600 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow"
      >
        🔄 Reset All
      </button>
      <button
        onClick={onClearLog}
        className="bg-gray-500 hover:bg-gray-600 text-white font-medium px-6 py-2 rounded-lg transition-colors shadow"
      >
        🗑️ Clear Log
      </button>
    </div>
  );
}