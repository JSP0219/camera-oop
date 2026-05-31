import { useState } from 'react';
import DigitalCamera from '../oop/DigitalCamera';
import FilmCamera from '../oop/FilmCamera';
import InstantCamera from '../oop/InstantCamera';

export default function LiveDemoPanel() {
  const [cameraType, setCameraType] = useState('digital');
  const [instance, setInstance] = useState(null);
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState('');
  const [isoValue, setIsoValue] = useState(100);
  const [shutterValue, setShutterValue] = useState(0.008); // 1/125
  const [apertureValue, setApertureValue] = useState(2.8);
  const [filmCapacity, setFilmCapacity] = useState(36);
  const [burstMode, setBurstMode] = useState(false);

  const createInstance = () => {
    let newInstance;
    try {
      if (cameraType === 'digital') {
        newInstance = new DigitalCamera(
          'Canon',
          'EOS 5D Mark IV',
          isoValue,
          shutterValue,
          apertureValue,
          50,
          100,
          20.0,
          10
        );
      } else if (cameraType === 'film') {
        newInstance = new FilmCamera(
          'Nikon',
          'FM2n',
          isoValue,
          shutterValue,
          apertureValue,
          50,
          '35mm',
          filmCapacity
        );
      } else if (cameraType === 'instant') {
        newInstance = new InstantCamera(
          'Fujifilm',
          'Instax Mini 11',
          isoValue,
          shutterValue,
          apertureValue,
          50,
          100,
          10
        );
      }
      setInstance(newInstance);
      updateStatus(newInstance);
      setMessage('📷 Camera instance created successfully!');
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const updateStatus = (camera) => {
    if (camera) {
      setStatus(camera.status());
    }
  };

  const handleShoot = () => {
    if (!instance) {
      setMessage('⚠️ Please create a camera instance first');
      return;
    }
    try {
      const result = instance.shoot();
      updateStatus(instance);
      setMessage(result.message || (result.success ? '✅ Shot successful!' : '❌ ' + result.message));
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleCharge = () => {
    if (!instance) {
      setMessage('⚠️ Please create a camera instance first');
      return;
    }
    try {
      const result = instance.charge(20);
      updateStatus(instance);
      setMessage(result.message);
    } catch (err) {
      setMessage(`⚠️ Note: ${err.message}`);
    }
  };

  const handleReload = () => {
    if (!instance) {
      setMessage('⚠️ Please create a camera instance first');
      return;
    }
    try {
      let result;
      if (cameraType === 'film') {
        result = instance.reloadFilm(filmCapacity);
      } else if (cameraType === 'instant') {
        result = instance.reloadFilmPack(10);
      } else {
        setMessage('⚠️ Digital cameras don\'t need reloading');
        return;
      }
      updateStatus(instance);
      setMessage(result.message);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleToggleBurst = () => {
    if (!instance || cameraType !== 'digital') {
      setMessage('⚠️ Only DigitalCamera supports burst mode');
      return;
    }
    try {
      const result = instance.toggleBurstMode();
      setBurstMode(instance.burstMode);
      updateStatus(instance);
      setMessage(result);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleZoom = () => {
    if (!instance || cameraType !== 'digital') {
      setMessage('⚠️ Only DigitalCamera supports zoom');
      return;
    }
    try {
      const result = instance.zoom(5);
      setMessage(result.message);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleIsoChange = (e) => {
    const value = parseInt(e.target.value);
    setIsoValue(value);
    if (instance) {
      instance.iso = value;
      updateStatus(instance);
    }
  };

  const handleShutterChange = (e) => {
    const value = parseFloat(e.target.value);
    setShutterValue(value);
    if (instance) {
      instance.shutterSpeed = value;
      updateStatus(instance);
    }
  };

  const handleApertureChange = (e) => {
    const value = parseFloat(e.target.value);
    setApertureValue(value);
    if (instance) {
      instance.aperture = value;
      updateStatus(instance);
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        📸 Live Camera Demo Panel
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Left: Controls */}
        <div className="space-y-6">
          {/* Camera Type Selection */}
          <div>
            <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-white">
              1️⃣ Select Camera Type
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {['digital', 'film', 'instant'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCameraType(type)}
                  className={`py-2 px-3 rounded font-semibold transition-all ${
                    cameraType === type
                      ? type === 'digital'
                        ? 'bg-green-500 text-white'
                        : type === 'film'
                        ? 'bg-purple-500 text-white'
                        : 'bg-pink-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {type === 'digital' ? '🔴 Digital' : type === 'film' ? '⚫ Film' : '📷 Instant'}
                </button>
              ))}
            </div>
          </div>

          {/* Create Instance */}
          <div>
            <button
              onClick={createInstance}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all"
            >
              ✨ Create New Instance
            </button>
          </div>

          {/* Settings */}
          {instance && (
            <div className="space-y-4 border-t-2 border-gray-300 dark:border-gray-600 pt-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                2️⃣ Camera Settings
              </h3>

              {/* ISO */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  ISO: {isoValue}
                </label>
                <input
                  type="range"
                  min="25"
                  max="204800"
                  value={isoValue}
                  onChange={handleIsoChange}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Range: 25 - 204800
                </div>
              </div>

              {/* Shutter Speed */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Shutter Speed: {shutterValue >= 1 ? `${shutterValue.toFixed(2)}s` : `1/${Math.round(1 / shutterValue)}`}
                </label>
                <input
                  type="range"
                  min="0.0001"
                  max="30"
                  step="0.001"
                  value={shutterValue}
                  onChange={handleShutterChange}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Range: 1/1000s - 30s
                </div>
              </div>

              {/* Aperture */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Aperture: f/{apertureValue}
                </label>
                <input
                  type="range"
                  min="0.95"
                  max="64"
                  step="0.1"
                  value={apertureValue}
                  onChange={handleApertureChange}
                  className="w-full"
                />
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Range: f/0.95 - f/64
                </div>
              </div>
            </div>
          )}

          {/* Actions */}
          {instance && (
            <div className="space-y-3 border-t-2 border-gray-300 dark:border-gray-600 pt-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">
                3️⃣ Camera Actions
              </h3>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShoot}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-3 rounded transition-all"
                >
                  📸 Shoot
                </button>

                {cameraType === 'digital' ? (
                  <>
                    <button
                      onClick={handleCharge}
                      className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded transition-all"
                    >
                      🔌 Charge
                    </button>
                    <button
                      onClick={handleToggleBurst}
                      className={`${
                        burstMode
                          ? 'bg-red-600 hover:bg-red-700'
                          : 'bg-red-500 hover:bg-red-600'
                      } text-white font-bold py-2 px-3 rounded transition-all`}
                    >
                      {burstMode ? '🔴 Burst ON' : '⚫ Burst OFF'}
                    </button>
                    <button
                      onClick={handleZoom}
                      className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-3 rounded transition-all"
                    >
                      🔍 Zoom 5x
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleReload}
                      className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 rounded transition-all col-span-2"
                    >
                      {cameraType === 'film' ? '📜 Reload Film' : '📷 Reload Film Pack'}
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right: Status Display */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">
            📊 Real-time Status
          </h3>

          {/* Message */}
          {message && (
            <div
              className={`p-4 rounded-lg font-semibold ${
                message.startsWith('❌')
                  ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                  : message.startsWith('⚠️')
                  ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
                  : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
              }`}
            >
              {message}
            </div>
          )}

          {/* Status Display */}
          {status ? (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-3 max-h-96 overflow-y-auto">
              {/* Camera Info */}
              <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">Model:</span>
                    <span>{status.model}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">Brand:</span>
                    <span>{status.brand}</span>
                  </div>
                  <div className="flex justify-between mb-1">
                    <span className="font-bold">Class:</span>
                    <span>{status.className}</span>
                  </div>
                </div>
              </div>

              {/* Exposure Settings */}
              <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  📷 Exposure
                </div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between">
                    <span>ISO:</span>
                    <span className="font-bold">{status.iso}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shutter:</span>
                    <span className="font-bold">{status.shutterSpeed}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Aperture:</span>
                    <span className="font-bold">f/{status.aperture}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Focal Length:</span>
                    <span className="font-bold">{status.focalLength}mm</span>
                  </div>
                </div>
              </div>

              {/* Battery / Film Status */}
              {status.battery !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    🔋 Battery
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                      <div
                        className={`h-full transition-all ${
                          status.battery > 50
                            ? 'bg-green-500'
                            : status.battery > 20
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                        }`}
                        style={{ width: `${status.battery}%` }}
                      />
                    </div>
                    <span className="font-bold text-sm">{status.battery}%</span>
                  </div>
                </div>
              )}

              {/* Film Status */}
              {status.filmRemaining !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    📜 Film
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                    {status.filmFormat && (
                      <div className="flex justify-between">
                        <span>Format:</span>
                        <span className="font-bold">{status.filmFormat}</span>
                      </div>
                    )}
                    {status.filmPack !== undefined && (
                      <div className="flex justify-between">
                        <span>Pack Size:</span>
                        <span className="font-bold">{status.filmPack}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-bold">
                        {status.filmRemaining}/{status.filmCapacity || status.filmPack}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                        <div
                          className="h-full bg-purple-500 transition-all"
                          style={{
                            width: `${
                              ((status.filmCapacity || status.filmPack) - status.filmRemaining) /
                              (status.filmCapacity || status.filmPack) *
                              100
                            }%`
                          }}
                        />
                      </div>
                      <span className="font-bold text-sm">
                        {Math.round(
                          ((status.filmCapacity || status.filmPack) - status.filmRemaining) /
                            (status.filmCapacity || status.filmPack) *
                            100
                        )}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Features */}
              {status.resolution !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                    🔧 Digital Features
                  </div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex justify-between">
                      <span>Resolution:</span>
                      <span className="font-bold">{status.resolution} MP</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Max Zoom:</span>
                      <span className="font-bold">{status.zoomRatio}x</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Burst Mode:</span>
                      <span className={`font-bold ${status.burstMode ? 'text-red-600' : 'text-gray-500'}`}>
                        {status.burstMode ? '🔴 ON' : '⚫ OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shutter Count */}
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  📊 Shutter Stats
                </div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between">
                    <span>Total Shots:</span>
                    <span className="font-bold text-lg">{status.shutterCount}</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-6 text-center text-gray-600 dark:text-gray-400">
              <p className="text-lg mb-2">📸 No camera instance yet</p>
              <p className="text-sm">Create a camera instance to see live status updates!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
