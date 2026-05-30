import { useState } from "react";
import BatteryBar from "./BatteryBar";

export default function CameraCard({
  camera,
  onUpdate,
  onLog,
}) {
  const [expanded, setExpanded] = useState(false);
  const status = camera.status();

  const handleShoot = () => {
    const result = camera.shoot();
    onLog(result.message);
    onUpdate();
  };

  const handleCharge = () => {
    const result = camera.charge();
    onLog(result.message);
    onUpdate();
  };

  const handleToggleBurst = () => {
    if (camera.toggleBurstMode) {
      const msg = camera.toggleBurstMode();
      onLog(msg);
      onUpdate();
    }
  };

  const handleZoom = (level) => {
    if (camera.zoom) {
      const result = camera.zoom(level);
      onLog(result.message);
      onUpdate();
    }
  };

  const handleReloadFilm = () => {
    let result;
    if (camera.reloadFilm) {
      result = camera.reloadFilm();
      onLog(result.message);
      onUpdate();
    }
  };

  const handleReloadFilmPack = () => {
    let result;
    if (camera.reloadFilmPack) {
      result = camera.reloadFilmPack();
      onLog(result.message);
      onUpdate();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h2 className="text-xl font-bold text-gray-800">
            {camera.brand} {camera.model}
          </h2>
          <p className="text-sm text-gray-600">{status.className}</p>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="text-gray-500 hover:text-gray-700 text-2xl"
        >
          {expanded ? '▼' : '▶'}
        </button>
      </div>

      <div className="space-y-3 mb-4">
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="bg-blue-50 p-2 rounded">
            <span className="text-gray-600">ISO:</span>
            <span className="font-semibold ml-1">{camera.iso}</span>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <span className="text-gray-600">Aperture:</span>
            <span className="font-semibold ml-1">f/{camera.aperture}</span>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <span className="text-gray-600">Shutter:</span>
            <span className="font-semibold ml-1">{status.shutterSpeed}</span>
          </div>
          <div className="bg-blue-50 p-2 rounded">
            <span className="text-gray-600">Focal:</span>
            <span className="font-semibold ml-1">{camera.focalLength}mm</span>
          </div>
        </div>

        {camera.filmFormat ? (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Film:</span>
              <span className="font-semibold">{camera.filmRemaining}/{camera.filmCapacity}</span>
            </div>
            <div className="flex gap-1">
              {[...Array(camera.filmCapacity)].map((_, i) => {
                const filled = i < camera.filmRemaining;
                return (
                  <div key={i} className={`w-3 h-5 rounded-sm ${filled ? 'bg-purple-600' : 'bg-gray-200'}`} />
                );
              })}
            </div>
          </div>
        ) : camera.battery !== undefined && (
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-600">Battery:</span>
              <span className="font-semibold">{camera.battery}%</span>
            </div>
            <BatteryBar value={camera.battery} />
          </div>
        )}

        <div className="text-sm text-gray-700">
          <span className="text-gray-600">Shutter Count:</span>
          <span className="font-semibold ml-1">{camera.shutterCount}</span>
        </div>
      </div>

      {expanded && (
        <div className="border-t pt-4 space-y-3">
          {/* Digital Camera specific */}
          {camera.resolution !== undefined && (
            <div className="bg-green-50 p-3 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Resolution:</span> {camera.resolution} MP
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Zoom:</span> {camera.zoomRatio}x
              </p>
              <div className="mt-2 flex gap-2">
                <button
                  onClick={handleToggleBurst}
                  className={`px-3 py-1 rounded text-sm font-medium ${
                    camera.burstMode
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-300 text-gray-700'
                  }`}
                >
                  Burst: {camera.burstMode ? 'ON' : 'OFF'}
                </button>
                <select
                  onChange={(e) => handleZoom(parseInt(e.target.value))}
                  className="px-2 py-1 rounded text-sm border border-gray-300"
                >
                  <option>Zoom...</option>
                  {[...Array(camera.zoomRatio)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}x
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {/* Film Camera specific */}
          {camera.filmRemaining !== undefined && camera.filmFormat && (
            <div className="bg-purple-50 p-3 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Format:</span> {camera.filmFormat}
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Film:</span> {camera.filmRemaining}/{camera.filmCapacity} shots
              </p>
              <button
                onClick={handleReloadFilm}
                className="mt-2 px-3 py-1 bg-purple-500 text-white rounded text-sm font-medium hover:bg-purple-600"
              >
                Reload Film
              </button>
            </div>
          )}

          {/* Instant Camera specific */}
          {camera.filmRemaining !== undefined && !camera.filmFormat && (
            <div className="bg-pink-50 p-3 rounded">
              <p className="text-sm text-gray-700">
                <span className="font-semibold">Film Pack:</span> {camera.filmRemaining}/{camera.filmPack} sheets
              </p>
              <p className="text-sm text-gray-700 mt-1">
                <span className="font-semibold">Status:</span>{' '}
                <span className={camera.developing ? 'text-orange-600 font-semibold' : 'text-green-600'}>
                  {camera.developing ? 'Developing...' : 'Ready'}
                </span>
              </p>
              <button
                onClick={handleReloadFilmPack}
                className="mt-2 px-3 py-1 bg-pink-500 text-white rounded text-sm font-medium hover:bg-pink-600"
              >
                Reload Film Pack
              </button>
            </div>
          )}
        </div>
      )}

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleShoot}
          className="flex-1 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 rounded transition-colors"
        >
          📸 Shoot
        </button>
        {camera.battery !== undefined && !camera.filmFormat && (
          <button
            onClick={handleCharge}
            className="flex-1 bg-green-500 hover:bg-green-600 text-white font-medium py-2 rounded transition-colors"
          >
            🔋 Charge
          </button>
        )}
      </div>
    </div>
  );
}