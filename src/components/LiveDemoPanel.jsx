import { useState, useRef } from 'react';
import DigitalCamera from '../oop/DigitalCamera';
import FilmCamera from '../oop/FilmCamera';
import InstantCamera from '../oop/InstantCamera';

import shutterFastSrc  from '../assets/shutter_fast.wav';
import shutterMidSrc   from '../assets/shutter_mid.wav';
import shutterOpenSrc  from '../assets/shutter_open.wav';
import shutterCloseSrc from '../assets/shutter_close.wav';

// ── 조리개 일러스트레이션 ────────────────────────────────────────
function ApertureIllustration({ aperture, isOpen, shutterSpeed }) {
  // 조리개 값 → 구멍 반지름 (f/1 = 최대, f/64 = 최소)
  const maxR = 54;
  const minR = 6;
  const normalized = Math.log(aperture) / Math.log(64); // 0(f/1)~1(f/64)
  const holeR = Math.round(maxR - normalized * (maxR - minR));

  // 셔터 열림 여부에 따라 실제 표시 반지름 결정
  const displayR = isOpen ? holeR : 0;

  // 조리개 블레이드 수 (8장)
  const blades = 8;
  const cx = 70;
  const cy = 70;
  const outerR = 62;

  // 블레이드: 닫혔을 때 구멍을 막는 부채꼴
  const bladeAngle = (2 * Math.PI) / blades;
  const bladePaths = Array.from({ length: blades }, (_, i) => {
    const angle = (i / blades) * 2 * Math.PI;
    // 블레이드가 중심을 얼마나 가리는지: 구멍 크기에 반비례
    const coverage = 1 - displayR / maxR;
    const innerRad = displayR + coverage * 8;
    const sweep = bladeAngle * 0.72;

    const x1 = cx + Math.cos(angle) * outerR;
    const y1 = cy + Math.sin(angle) * outerR;
    const x2 = cx + Math.cos(angle + sweep) * outerR;
    const y2 = cy + Math.sin(angle + sweep) * outerR;
    const ix1 = cx + Math.cos(angle + bladeAngle * 0.1) * innerRad;
    const iy1 = cy + Math.sin(angle + bladeAngle * 0.1) * innerRad;
    const ix2 = cx + Math.cos(angle + sweep - bladeAngle * 0.1) * innerRad;
    const iy2 = cy + Math.sin(angle + sweep - bladeAngle * 0.1) * innerRad;

    return `M ${x1} ${y1} A ${outerR} ${outerR} 0 0 1 ${x2} ${y2} L ${ix2} ${iy2} A ${innerRad} ${innerRad} 0 0 0 ${ix1} ${iy1} Z`;
  });

  // 셔터 스피드 레이블
  const speedLabel = shutterSpeed >= 1
    ? `${shutterSpeed.toFixed(1)}s`
    : `1/${Math.round(1 / shutterSpeed)}`;

  // 노출 표시 컬러
  const exposureColor = isOpen
    ? (shutterSpeed < 1/100 ? '#60a5fa' : shutterSpeed < 1/4 ? '#34d399' : '#f59e0b')
    : '#374151';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="140" height="140" viewBox="0 0 140 140">
        {/* 바깥 링 */}
        <circle cx={cx} cy={cy} r={66} fill="#1f2937" stroke="#4b5563" strokeWidth="2"/>
        {/* 렌즈 바디 */}
        <circle cx={cx} cy={cy} r={62} fill="#111827"/>
        {/* 렌즈 반사 링 */}
        <circle cx={cx} cy={cy} r={62} fill="none" stroke="#374151" strokeWidth="1"/>
        <circle cx={cx} cy={cy} r={56} fill="none" stroke="#1f2937" strokeWidth="2"/>

        {/* 블레이드 */}
        {bladePaths.map((d, i) => (
          <path
            key={i}
            d={d}
            fill="#1a1a2e"
            stroke="#374151"
            strokeWidth="0.5"
            style={{ transition: 'all 0.08s ease-out' }}
          />
        ))}

        {/* 구멍 */}
        <circle
          cx={cx} cy={cy} r={displayR}
          fill={isOpen ? 'black' : '#0f0f0f'}
          style={{ transition: `r ${Math.min(shutterSpeed, 0.15)}s ease-out` }}
        />

        {/* 열렸을 때 내부 글로우 */}
        {isOpen && displayR > 4 && (
          <>
            <circle cx={cx} cy={cy} r={displayR * 0.85} fill="none"
              stroke={exposureColor} strokeWidth="1" opacity="0.3"/>
            <circle cx={cx} cy={cy} r={displayR * 0.5} fill={exposureColor} opacity="0.05"/>
          </>
        )}

        {/* 렌즈 반사 하이라이트 */}
        <ellipse cx={cx - 18} cy={cy - 18} rx="10" ry="6"
          fill="white" opacity="0.04" transform={`rotate(-35 ${cx} ${cy})`}/>
      </svg>

      {/* 상태 레이블 */}
      <div className="text-center">
        <div className={`text-xs font-mono font-bold ${isOpen ? 'text-yellow-400' : 'text-gray-500'}`}>
          {isOpen ? '● OPEN' : '○ CLOSED'}
        </div>
        <div className="text-xs text-gray-400 mt-0.5">
          f/{aperture} · {speedLabel}
        </div>
      </div>
    </div>
  );
}

export default function LiveDemoPanel() {
  const [cameraType, setCameraType]     = useState('digital');
  const [instance, setInstance]         = useState(null);
  const [status, setStatus]             = useState(null);
  const [message, setMessage]           = useState('');
  const [isoValue, setIsoValue]         = useState(100);
  const [shutterValue, setShutterValue] = useState(0.008);
  const [apertureValue, setApertureValue] = useState(2.8);
  const [filmCapacity, setFilmCapacity] = useState(36);
  const [burstMode, setBurstMode]       = useState(false);
  const [brandValue, setBrandValue]     = useState('');
  const [modelValue, setModelValue]     = useState('');

  // 셔터 애니메이션 / 촬영 잠금 상태
  const [shutterOpen, setShutterOpen]   = useState(false);
  const [isShooting, setIsShooting]     = useState(false);

  // ── Audio Engine ──────────────────────────────────────────────
  const audioCtxRef = useRef(null);
  const bufCacheRef = useRef({});

  const getCtx = () => {
    if (!audioCtxRef.current) {
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
    }
    return audioCtxRef.current;
  };

  const loadBuf = async (src) => {
    if (bufCacheRef.current[src]) return bufCacheRef.current[src];
    const ctx = getCtx();
    const res = await fetch(src);
    const ab  = await res.arrayBuffer();
    const buf = await ctx.decodeAudioData(ab);
    bufCacheRef.current[src] = buf;
    return buf;
  };

  const playBuf = (ctx, buf, when = 0) => {
    const src = ctx.createBufferSource();
    src.buffer = buf;
    src.connect(ctx.destination);
    src.start(when);
    return src;
  };

  const playShutter = async (shutterSpeed = 0.008) => {
    try {
      const ctx = getCtx();
      if (ctx.state === 'suspended') await ctx.resume();
      if (shutterSpeed < 1 / 100) {
        const buf = await loadBuf(shutterFastSrc);
        playBuf(ctx, buf, ctx.currentTime);
      } else if (shutterSpeed < 1 / 4) {
        const buf = await loadBuf(shutterMidSrc);
        playBuf(ctx, buf, ctx.currentTime);
      } else {
        const [openBuf, closeBuf] = await Promise.all([
          loadBuf(shutterOpenSrc),
          loadBuf(shutterCloseSrc),
        ]);
        const now = ctx.currentTime;
        playBuf(ctx, openBuf, now);
        playBuf(ctx, closeBuf, now + shutterSpeed);
      }
    } catch (e) {
      console.warn('playShutter error:', e);
    }
  };

  const playTick = () => {
    try {
      const ctx = getCtx();
      const resume = ctx.state === 'suspended' ? ctx.resume() : Promise.resolve();
      resume.then(() => {
        const now    = ctx.currentTime;
        const bufLen = Math.floor(ctx.sampleRate * 0.018);
        const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data   = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++) {
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 4);
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass';
        bp.frequency.value = 4500;
        bp.Q.value = 1.2;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
        noise.connect(bp);
        bp.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
        noise.stop(now + 0.018);
      });
    } catch (e) { /* 무시 */ }
  };
  // ─────────────────────────────────────────────────────────────

  const createInstance = () => {
    const defaults = {
      digital: { brand: 'Canon',    model: 'EOS 5D Mark IV' },
      film:    { brand: 'Nikon',    model: 'FM2n'            },
      instant: { brand: 'Fujifilm', model: 'Instax Mini 11'  },
    };
    const brand = brandValue.trim() || defaults[cameraType].brand;
    const model = modelValue.trim() || defaults[cameraType].model;
    let newInstance;
    try {
      if (cameraType === 'digital') {
        newInstance = new DigitalCamera(brand, model, isoValue, shutterValue, apertureValue, 50, 100, 20.0, 10);
      } else if (cameraType === 'film') {
        newInstance = new FilmCamera(brand, model, isoValue, shutterValue, apertureValue, 50, '35mm', filmCapacity);
      } else if (cameraType === 'instant') {
        newInstance = new InstantCamera(brand, model, isoValue, shutterValue, apertureValue, 50, 100, 10);
      }
      setInstance(newInstance);
      updateStatus(newInstance);
      setMessage('📷 Camera instance created successfully!');
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const updateStatus = (camera) => {
    if (camera) setStatus(camera.status());
  };

  // 셔터 애니메이션: 열림 → shutterSpeed 대기 → 닫힘
  const animateShutter = (shutterSpeed) => {
    const displayMs = Math.min(shutterSpeed * 1000, 3000); // 최대 3초 표시
    setShutterOpen(true);
    setTimeout(() => setShutterOpen(false), displayMs);
  };

  const handleShoot = async () => {
    if (!instance || isShooting) return;
    try {
      const result = instance.shoot();
      updateStatus(instance);
      if (result.success) {
        const speed = instance.shutterSpeed ?? shutterValue;
        const lockMs = Math.min(speed * 1000, 3000) + 150; // 애니메이션 + 여유
        setIsShooting(true);
        animateShutter(speed);
        playShutter(speed);
        setTimeout(() => setIsShooting(false), lockMs);
      }
      setMessage(result.message || (result.success ? '✅ Shot successful!' : '❌ ' + result.message));
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleCharge = () => {
    if (!instance) { setMessage('⚠️ Please create a camera instance first'); return; }
    try {
      const result = instance.charge(20);
      updateStatus(instance);
      setMessage(result.message);
    } catch (err) {
      setMessage(`⚠️ Note: ${err.message}`);
    }
  };

  const handleReload = () => {
    if (!instance) { setMessage('⚠️ Please create a camera instance first'); return; }
    try {
      let result;
      if (cameraType === 'film') {
        result = instance.reloadFilm(filmCapacity);
      } else if (cameraType === 'instant') {
        result = instance.reloadFilmPack(10);
      } else {
        setMessage("⚠️ Digital cameras don't need reloading"); return;
      }
      updateStatus(instance);
      setMessage(result.message);
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const handleToggleBurst = () => {
    if (!instance || cameraType !== 'digital') {
      setMessage('⚠️ Only DigitalCamera supports burst mode'); return;
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
      setMessage('⚠️ Only DigitalCamera supports zoom'); return;
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
    setIsoValue(value); playTick();
    if (instance) { instance.iso = value; updateStatus(instance); }
  };

  const handleShutterChange = (e) => {
    const value = parseFloat(e.target.value);
    setShutterValue(value); playTick();
    if (instance) { instance.shutterSpeed = value; updateStatus(instance); }
  };

  const handleApertureChange = (e) => {
    const value = parseFloat(e.target.value);
    setApertureValue(value); playTick();
    if (instance) { instance.aperture = value; updateStatus(instance); }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-white">
        📸 Live Camera Demo Panel
      </h2>

      <div className="grid md:grid-cols-2 gap-8">
        {/* ── Left: Controls ── */}
        <div className="space-y-6">

          {/* 1. Camera Type */}
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
                      ? type === 'digital' ? 'bg-green-500 text-white'
                        : type === 'film'  ? 'bg-purple-500 text-white'
                        : 'bg-pink-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  {type === 'digital' ? '🔴 Digital' : type === 'film' ? '⚫ Film' : '📷 Instant'}
                </button>
              ))}
            </div>
          </div>

          {/* Brand / Model 입력 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Brand
              </label>
              <input
                type="text"
                value={brandValue}
                onChange={(e) => setBrandValue(e.target.value)}
                placeholder={cameraType === 'digital' ? 'Canon' : cameraType === 'film' ? 'Nikon' : 'Fujifilm'}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">
                Model
              </label>
              <input
                type="text"
                value={modelValue}
                onChange={(e) => setModelValue(e.target.value)}
                placeholder={cameraType === 'digital' ? 'EOS 5D Mark IV' : cameraType === 'film' ? 'FM2n' : 'Instax Mini 11'}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
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

          {/* 2. Settings */}
          {instance && (
            <div className="space-y-4 border-t-2 border-gray-300 dark:border-gray-600 pt-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">2️⃣ Camera Settings</h3>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">ISO: {isoValue}</label>
                <input type="range" min="25" max="204800" value={isoValue} onChange={handleIsoChange} className="w-full"/>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Range: 25 - 204800</div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Shutter Speed: {shutterValue >= 1 ? `${shutterValue.toFixed(2)}s` : `1/${Math.round(1 / shutterValue)}`}
                </label>
                <input type="range" min="0.0001" max="30" step="0.001" value={shutterValue} onChange={handleShutterChange} className="w-full"/>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Range: 1/10000s - 30s</div>
              </div>

              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">Aperture: f/{apertureValue}</label>
                <input type="range" min="0.95" max="64" step="0.1" value={apertureValue} onChange={handleApertureChange} className="w-full"/>
                <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">Range: f/0.95 - f/64</div>
              </div>
            </div>
          )}

          {/* 3. Actions */}
          {instance && (
            <div className="space-y-3 border-t-2 border-gray-300 dark:border-gray-600 pt-6">
              <h3 className="font-bold text-lg text-gray-800 dark:text-white">3️⃣ Camera Actions</h3>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={handleShoot}
                  disabled={isShooting}
                  className={`font-bold py-2 px-3 rounded transition-all text-white ${
                    isShooting
                      ? 'bg-gray-400 cursor-not-allowed opacity-60'
                      : 'bg-yellow-500 hover:bg-yellow-600'
                  }`}
                >
                  {isShooting ? '⏳ Shooting...' : '📸 Shoot'}
                </button>

                {cameraType === 'digital' ? (
                  <>
                    <button onClick={handleCharge} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded transition-all">🔌 Charge</button>
                    <button onClick={handleToggleBurst} className={`${burstMode ? 'bg-red-600 hover:bg-red-700' : 'bg-red-500 hover:bg-red-600'} text-white font-bold py-2 px-3 rounded transition-all`}>
                      {burstMode ? '🔴 Burst ON' : '⚫ Burst OFF'}
                    </button>
                    <button onClick={handleZoom} className="bg-cyan-500 hover:bg-cyan-600 text-white font-bold py-2 px-3 rounded transition-all">🔍 Zoom 5x</button>
                  </>
                ) : cameraType === 'instant' ? (
                  <>
                    <button onClick={handleCharge} className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-3 rounded transition-all">🔌 Charge</button>
                    <button onClick={handleReload} className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-3 rounded transition-all">📷 Reload Film Pack</button>
                  </>
                ) : (
                  <button onClick={handleReload} className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-3 rounded transition-all col-span-2">📜 Reload Film</button>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Right: Status + Aperture Viz ── */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">📊 Real-time Status</h3>

          {/* 조리개 일러스트레이션 */}
          <div className="flex justify-center bg-gray-900 rounded-xl py-4">
            <ApertureIllustration
              aperture={apertureValue}
              isOpen={shutterOpen}
              shutterSpeed={shutterValue}
            />
          </div>

          {/* Message */}
          {message && (
            <div className={`p-4 rounded-lg font-semibold ${
              message.startsWith('❌') ? 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
              : message.startsWith('⚠️') ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200'
              : 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
            }`}>
              {message}
            </div>
          )}

          {/* Status Display */}
          {status ? (
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg p-4 space-y-3 max-h-80 overflow-y-auto">
              {/* Camera Info */}
              <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between"><span className="font-bold">Brand:</span><span>{status.brand}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Model:</span><span>{status.model}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Class:</span><span>{status.className}</span></div>
                </div>
              </div>

              {/* Exposure */}
              <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📷 Exposure</div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between"><span>ISO:</span><span className="font-bold">{status.iso}</span></div>
                  <div className="flex justify-between"><span>Shutter:</span><span className="font-bold">{status.shutterSpeed}</span></div>
                  <div className="flex justify-between"><span>Aperture:</span><span className="font-bold">f/{status.aperture}</span></div>
                  <div className="flex justify-between"><span>Focal Length:</span><span className="font-bold">{status.focalLength}mm</span></div>
                </div>
              </div>

              {/* Battery */}
              {status.battery !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔋 Battery</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                      <div className={`h-full transition-all ${status.battery > 50 ? 'bg-green-500' : status.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${status.battery}%` }}/>
                    </div>
                    <span className="font-bold text-sm">{status.battery}%</span>
                  </div>
                </div>
              )}

              {/* Film */}
              {status.filmRemaining !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📜 Film</div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                    {status.filmFormat && <div className="flex justify-between"><span>Format:</span><span className="font-bold">{status.filmFormat}</span></div>}
                    {status.filmPack !== undefined && <div className="flex justify-between"><span>Pack Size:</span><span className="font-bold">{status.filmPack}</span></div>}
                    <div className="flex justify-between">
                      <span>Remaining:</span>
                      <span className="font-bold">{status.filmRemaining}/{status.filmCapacity || status.filmPack}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                        <div className="h-full bg-purple-500 transition-all" style={{ width: `${((status.filmCapacity || status.filmPack) - status.filmRemaining) / (status.filmCapacity || status.filmPack) * 100}%` }}/>
                      </div>
                      <span className="font-bold text-sm">{Math.round(((status.filmCapacity || status.filmPack) - status.filmRemaining) / (status.filmCapacity || status.filmPack) * 100)}%</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Digital Features */}
              {status.resolution !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔧 Digital Features</div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex justify-between"><span>Resolution:</span><span className="font-bold">{status.resolution} MP</span></div>
                    <div className="flex justify-between"><span>Max Zoom:</span><span className="font-bold">{status.zoomRatio}x</span></div>
                    <div className="flex justify-between">
                      <span>Burst Mode:</span>
                      <span className={`font-bold ${status.burstMode ? 'text-red-600' : 'text-gray-500'}`}>{status.burstMode ? '🔴 ON' : '⚫ OFF'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Shutter Count */}
              <div>
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📊 Shutter Stats</div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300">
                  <div className="flex justify-between"><span>Total Shots:</span><span className="font-bold text-lg">{status.shutterCount}</span></div>
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
