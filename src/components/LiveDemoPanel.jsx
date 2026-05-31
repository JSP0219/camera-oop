import { useState, useRef } from 'react';
import DigitalCamera from '../oop/DigitalCamera';
import FilmCamera from '../oop/FilmCamera';
import InstantCamera from '../oop/InstantCamera';

import shutterFastSrc  from '../assets/shutter_fast.wav';
import shutterMidSrc   from '../assets/shutter_mid.wav';
import shutterOpenSrc  from '../assets/shutter_open.wav';
import shutterCloseSrc from '../assets/shutter_close.wav';

// 일반적으로 많이 쓰는 셔터스피드 스냅 값
const SHUTTER_STOPS = [
  1/8000, 1/4000, 1/2000, 1/1000, 1/500, 1/250,
  1/125,  1/60,   1/30,   1/15,   1/8,   1/4,
  1/2,    1,      2,      4,      8,     15,    30
];

function snapToShutterStop(value) {
  return SHUTTER_STOPS.reduce((prev, curr) =>
    Math.abs(curr - value) < Math.abs(prev - value) ? curr : prev
  );
}

function shutterLabel(v) {
  if (v >= 1) return `${v % 1 === 0 ? v : v.toFixed(1)}s`;
  return `1/${Math.round(1 / v)}`;
}

// ── 카메라 일러스트레이션 (전체 카메라 + 렌즈 + 셔터) ────────────
function CameraIllustration({ aperture, isOpen, shutterSpeed, cameraType }) {
  const maxR = 38;
  const minR = 4;
  const normalized = Math.log(aperture) / Math.log(64);
  const holeR = Math.round(maxR - normalized * (maxR - minR));
  const displayR = isOpen ? holeR : 0;

  const blades = 8;
  const cx = 160;
  const cy = 115;
  const outerR = 44;
  const bladeAngle = (2 * Math.PI) / blades;

  const bladePaths = Array.from({ length: blades }, (_, i) => {
    const angle = (i / blades) * 2 * Math.PI;
    const coverage = 1 - displayR / maxR;
    const innerRad = displayR + coverage * 6;
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

  const speedLabel = shutterLabel(shutterSpeed);
  const exposureColor = isOpen
    ? (shutterSpeed < 1/100 ? '#60a5fa' : shutterSpeed < 1/4 ? '#34d399' : '#f59e0b')
    : '#374151';

  // 카메라 타입별 색상
  const bodyColor = cameraType === 'digital' ? '#1e293b'
    : cameraType === 'film' ? '#1a1a2e' : '#2d1b33';
  const accentColor = cameraType === 'digital' ? '#3b82f6'
    : cameraType === 'film' ? '#8b5cf6' : '#ec4899';

  return (
    <div className="flex flex-col items-center gap-2">
      <svg width="320" height="220" viewBox="0 0 320 220">
        {/* ── 카메라 바디 ── */}
        {/* 메인 바디 */}
        <rect x="30" y="55" width="260" height="150" rx="12" ry="12"
          fill={bodyColor} stroke="#374151" strokeWidth="2"/>
        {/* 상단 펜타프리즘 / 뷰파인더 하우징 */}
        <path d="M 90 55 L 90 28 L 105 18 L 215 18 L 230 28 L 230 55 Z"
          fill={bodyColor} stroke="#374151" strokeWidth="2"/>
        {/* 바디 상단 하이라이트 */}
        <rect x="32" y="57" width="256" height="4" rx="3" fill="#ffffff" opacity="0.06"/>

        {/* ── 뷰파인더 접안렌즈 ── */}
        <rect x="140" y="22" width="40" height="25" rx="4"
          fill="#0f172a" stroke="#4b5563" strokeWidth="1"/>
        <rect x="143" y="25" width="34" height="19" rx="3"
          fill="#0a0a1a" stroke="#1e3a5f" strokeWidth="1"/>
        <rect x="145" y="26" width="10" height="5" rx="1"
          fill="#1e3a5f" opacity="0.6"/>

        {/* ── 핫슈 (디지털/필름) ── */}
        {cameraType !== 'instant' && (
          <>
            <rect x="130" y="17" width="60" height="5" rx="1"
              fill="#374151" stroke="#4b5563" strokeWidth="0.5"/>
            <rect x="138" y="13" width="44" height="5" rx="1"
              fill="#2d3748" stroke="#4b5563" strokeWidth="0.5"/>
            {/* 핫슈 레일 */}
            <line x1="130" y1="19" x2="190" y2="19" stroke="#6b7280" strokeWidth="0.5"/>
            <line x1="130" y1="21" x2="190" y2="21" stroke="#6b7280" strokeWidth="0.5"/>
          </>
        )}

        {/* ── 모드 다이얼 (우상단) ── */}
        <circle cx="248" cy="42" r="14" fill="#111827" stroke="#4b5563" strokeWidth="1.5"/>
        <circle cx="248" cy="42" r="11" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
        {['A','S','M','P'].map((label, i) => {
          const a = (i / 4) * Math.PI * 2 - Math.PI / 4;
          return (
            <text key={label} x={248 + Math.cos(a) * 7} y={42 + Math.sin(a) * 7 + 3}
              fill="#9ca3af" fontSize="4" textAnchor="middle" fontFamily="monospace">{label}</text>
          );
        })}
        <circle cx="248" cy="42" r="2" fill={accentColor}/>

        {/* ── 셔터 버튼 ── */}
        <circle cx="80" cy="40" r="9" fill="#1f2937" stroke="#4b5563" strokeWidth="1.5"/>
        <circle cx="80" cy="40" r="6"
          fill={isOpen ? accentColor : '#374151'}
          style={{ transition: 'fill 0.1s' }}/>
        <circle cx="80" cy="40" r="3" fill={isOpen ? '#fff' : '#1f2937'} opacity="0.7"/>

        {/* ── 전원 버튼 ── */}
        <circle cx="112" cy="34" r="5" fill="#1f2937" stroke="#374151" strokeWidth="1"/>
        <circle cx="112" cy="34" r="3" fill="#374151"/>

        {/* ── LCD 화면 / 인스턴트는 뷰파인더 창 ── */}
        {cameraType === 'instant' ? (
          <>
            {/* 인스턴트: 앞면 뷰파인더 */}
            <rect x="250" y="65" width="28" height="20" rx="3"
              fill="#0a0a1a" stroke="#4b5563" strokeWidth="1"/>
            <rect x="252" y="67" width="24" height="16" rx="2"
              fill="#0d1117" stroke="#1e3a5f" strokeWidth="0.5"/>
          </>
        ) : (
          <>
            {/* 뒷면 LCD */}
            <rect x="175" y="68" width="95" height="70" rx="4"
              fill="#0a0a1a" stroke="#4b5563" strokeWidth="1.5"/>
            <rect x="178" y="71" width="89" height="64" rx="3"
              fill={isOpen ? '#0d2035' : '#0a0f1a'}
              style={{ transition: 'fill 0.2s' }}/>
            {isOpen && (
              <>
                <rect x="180" y="73" width="85" height="60" rx="2"
                  fill={exposureColor} opacity="0.08"/>
                <text x="222" y="105" fill="#60a5fa" fontSize="8"
                  textAnchor="middle" fontFamily="monospace" fontWeight="bold">
                  {speedLabel}
                </text>
                <text x="222" y="117" fill="#34d399" fontSize="6"
                  textAnchor="middle" fontFamily="monospace">
                  f/{aperture}
                </text>
              </>
            )}
          </>
        )}

        {/* ── 그립 (오른쪽) ── */}
        <rect x="265" y="60" width="25" height="120" rx="8" ry="8"
          fill={bodyColor === '#1e293b' ? '#172033' : bodyColor} stroke="#374151" strokeWidth="1.5"/>
        {/* 그립 텍스처 */}
        {[0,1,2,3,4].map(i => (
          <rect key={i} x="268" y={80 + i * 18} width="16" height="6" rx="3"
            fill="#000" opacity="0.2"/>
        ))}

        {/* ── 렌즈 마운트 링 ── */}
        <circle cx={cx} cy={cy} r="54"
          fill="#111827" stroke="#4b5563" strokeWidth="3"/>
        {/* 마운트 잠금 표시 */}
        <circle cx={cx} cy={cy} r="54" fill="none"
          stroke="#6b7280" strokeWidth="0.5" strokeDasharray="4 8"/>

        {/* ── 렌즈 배럴 (바깥 → 안) ── */}
        <circle cx={cx} cy={cy} r="50" fill="#1a1f2e" stroke="#374151" strokeWidth="1.5"/>
        {/* 줌 링 */}
        <circle cx={cx} cy={cy} r="50" fill="none" stroke="#2d3748" strokeWidth="4"/>
        {/* 줌 링 눈금 */}
        {Array.from({length: 24}, (_, i) => {
          const a = (i / 24) * Math.PI * 2;
          const r1 = 47, r2 = 50;
          return (
            <line key={i}
              x1={cx + Math.cos(a) * r1} y1={cy + Math.sin(a) * r1}
              x2={cx + Math.cos(a) * r2} y2={cy + Math.sin(a) * r2}
              stroke="#4b5563" strokeWidth="0.8"/>
          );
        })}
        {/* 포커스 링 */}
        <circle cx={cx} cy={cy} r="44" fill="none" stroke="#1f2937" strokeWidth="4"/>
        {/* 렌즈 앞면 */}
        <circle cx={cx} cy={cy} r="42" fill="#111827" stroke="#374151" strokeWidth="1"/>

        {/* ── 조리개 블레이드 ── */}
        {bladePaths.map((d, i) => (
          <path key={i} d={d}
            fill="#0f1120" stroke="#374151" strokeWidth="0.5"
            style={{ transition: 'all 0.08s ease-out' }}/>
        ))}

        {/* ── 구멍 ── */}
        <circle cx={cx} cy={cy} r={displayR}
          fill={isOpen ? 'black' : '#0c0c14'}
          style={{ transition: `r ${Math.min(shutterSpeed, 0.15)}s ease-out` }}/>

        {/* 열렸을 때 내부 글로우 */}
        {isOpen && displayR > 3 && (
          <>
            <circle cx={cx} cy={cy} r={displayR * 0.85} fill="none"
              stroke={exposureColor} strokeWidth="1" opacity="0.35"/>
            <circle cx={cx} cy={cy} r={displayR * 0.5}
              fill={exposureColor} opacity="0.07"/>
          </>
        )}

        {/* 렌즈 반사 하이라이트 */}
        <ellipse cx={cx - 14} cy={cy - 14} rx="8" ry="5"
          fill="white" opacity="0.05"
          transform={`rotate(-35 ${cx} ${cy})`}/>
        <ellipse cx={cx + 20} cy={cy - 22} rx="4" ry="2"
          fill="white" opacity="0.07"
          transform={`rotate(10 ${cx} ${cy})`}/>

        {/* ── 렌즈 브랜드 텍스트 ── */}
        <text x={cx} y={cy - 50} fill="#4b5563" fontSize="5"
          textAnchor="middle" fontFamily="monospace" letterSpacing="1">
          {cameraType === 'digital' ? 'EF 24-70mm f/2.8L'
            : cameraType === 'film' ? 'NIKKOR 50mm f/1.4'
            : 'FUJINON 60mm'}
        </text>

        {/* ── 인스턴트: 필름 배출구 ── */}
        {cameraType === 'instant' && (
          <>
            <rect x="55" y="185" width="110" height="8" rx="2"
              fill="#0f172a" stroke="#4b5563" strokeWidth="1"/>
            <rect x="60" y="187" width="100" height="4" rx="1"
              fill="#1e293b"/>
          </>
        )}

        {/* ── 스트랩 러그 ── */}
        <rect x="28" y="72" width="6" height="18" rx="3"
          fill="#374151" stroke="#4b5563" strokeWidth="1"/>
        <rect x="28" y="130" width="6" height="18" rx="3"
          fill="#374151" stroke="#4b5563" strokeWidth="1"/>
        <rect x="286" y="72" width="6" height="18" rx="3"
          fill="#374151" stroke="#4b5563" strokeWidth="1"/>

        {/* ── 상태 인디케이터 LED ── */}
        <circle cx="265" cy="64" r="3"
          fill={isOpen ? '#22c55e' : '#374151'}
          style={{ transition: 'fill 0.1s' }}/>
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
  const [shutterValue, setShutterValue] = useState(1/125);
  const [apertureValue, setApertureValue] = useState(2.8);
  const [filmCapacity, setFilmCapacity] = useState(36);
  const [burstMode, setBurstMode]       = useState(false);
  const [brandValue, setBrandValue]     = useState('');
  const [modelValue, setModelValue]     = useState('');

  const [shutterOpen, setShutterOpen]   = useState(false);
  const [isShooting, setIsShooting]     = useState(false);

  // 슬라이더 인덱스 (SHUTTER_STOPS 배열)
  const [shutterIndex, setShutterIndex] = useState(
    SHUTTER_STOPS.indexOf(snapToShutterStop(1/125))
  );

  const audioCtxRef = useRef(null);
  const bufCacheRef = useRef({});

  const getCtx = () => {
    if (!audioCtxRef.current)
      audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
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

  const playShutter = async (shutterSpeed = 1/125) => {
    try {
      const ctx = getCtx();
      if (ctx.state === 'suspended') await ctx.resume();
      if (shutterSpeed < 1/100) {
        const buf = await loadBuf(shutterFastSrc);
        playBuf(ctx, buf, ctx.currentTime);
      } else if (shutterSpeed < 1/4) {
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
        const now = ctx.currentTime;
        const bufLen = Math.floor(ctx.sampleRate * 0.018);
        const buffer = ctx.createBuffer(1, bufLen, ctx.sampleRate);
        const data   = buffer.getChannelData(0);
        for (let i = 0; i < bufLen; i++)
          data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufLen, 4);
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const bp = ctx.createBiquadFilter();
        bp.type = 'bandpass'; bp.frequency.value = 4500; bp.Q.value = 1.2;
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.018);
        noise.connect(bp); bp.connect(gain); gain.connect(ctx.destination);
        noise.start(now); noise.stop(now + 0.018);
      });
    } catch (e) { /* 무시 */ }
  };

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
      if (cameraType === 'digital')
        newInstance = new DigitalCamera(brand, model, isoValue, shutterValue, apertureValue, 50, 100, 20.0, 10);
      else if (cameraType === 'film')
        newInstance = new FilmCamera(brand, model, isoValue, shutterValue, apertureValue, 50, '35mm', filmCapacity);
      else if (cameraType === 'instant')
        newInstance = new InstantCamera(brand, model, isoValue, shutterValue, apertureValue, 50, 100, 10);
      setInstance(newInstance);
      updateStatus(newInstance);
      setMessage('📷 Camera instance created successfully!');
    } catch (err) {
      setMessage(`❌ Error: ${err.message}`);
    }
  };

  const updateStatus = (camera) => { if (camera) setStatus(camera.status()); };

  // ── 셔터 애니메이션: 최대 3초 캡 제거 → 실제 셔터 시간만큼 대기 ──
  const animateShutter = (shutterSpeed) => {
    setShutterOpen(true);
    setTimeout(() => setShutterOpen(false), shutterSpeed * 1000);
  };

  const handleShoot = async () => {
    if (!instance || isShooting) return;
    try {
      const result = instance.shoot();
      updateStatus(instance);
      if (result.success) {
        const speed = instance.shutterSpeed ?? shutterValue;
        const lockMs = speed * 1000 + 150; // 실제 셔터 시간 + 여유 150ms
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
      if (cameraType === 'film') result = instance.reloadFilm(filmCapacity);
      else if (cameraType === 'instant') result = instance.reloadFilmPack(10);
      else { setMessage("⚠️ Digital cameras don't need reloading"); return; }
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

  // ── 셔터스피드: 슬라이더 인덱스 → 스냅값 적용 ──
  const handleShutterChange = (e) => {
    const idx = parseInt(e.target.value);
    setShutterIndex(idx);
    const value = SHUTTER_STOPS[idx];
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
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Brand</label>
              <input type="text" value={brandValue} onChange={(e) => setBrandValue(e.target.value)}
                placeholder={cameraType === 'digital' ? 'Canon' : cameraType === 'film' ? 'Nikon' : 'Fujifilm'}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 dark:text-gray-200 mb-1">Model</label>
              <input type="text" value={modelValue} onChange={(e) => setModelValue(e.target.value)}
                placeholder={cameraType === 'digital' ? 'EOS 5D Mark IV' : cameraType === 'film' ? 'FM2n' : 'Instax Mini 11'}
                className="w-full px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-100 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            </div>
          </div>

          {/* Create Instance */}
          <div>
            <button onClick={createInstance}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition-all">
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

              {/* 셔터스피드: 스냅 슬라이더 */}
              <div>
                <label className="block font-semibold text-gray-700 dark:text-gray-200 mb-2">
                  Shutter Speed: <span className="text-blue-500 dark:text-blue-400">{shutterLabel(shutterValue)}</span>
                </label>
                <input type="range"
                  min="0" max={SHUTTER_STOPS.length - 1} step="1"
                  value={shutterIndex} onChange={handleShutterChange}
                  className="w-full"/>
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

        {/* ── Right: Status + Camera Viz ── */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg text-gray-800 dark:text-white">📊 Real-time Status</h3>

          {/* 카메라 일러스트레이션 */}
          <div className="flex justify-center bg-gray-900 rounded-xl py-4">
            <CameraIllustration
              aperture={apertureValue}
              isOpen={shutterOpen}
              shutterSpeed={shutterValue}
              cameraType={cameraType}
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
              <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between"><span className="font-bold">Brand:</span><span>{status.brand}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Model:</span><span>{status.model}</span></div>
                  <div className="flex justify-between"><span className="font-bold">Class:</span><span>{status.className}</span></div>
                </div>
              </div>

              <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">📷 Exposure</div>
                <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                  <div className="flex justify-between"><span>ISO:</span><span className="font-bold">{status.iso}</span></div>
                  <div className="flex justify-between"><span>Shutter:</span><span className="font-bold">{status.shutterSpeed}</span></div>
                  <div className="flex justify-between"><span>Aperture:</span><span className="font-bold">f/{status.aperture}</span></div>
                  <div className="flex justify-between"><span>Focal Length:</span><span className="font-bold">{status.focalLength}mm</span></div>
                </div>
              </div>

              {status.battery !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔋 Battery</div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 bg-gray-300 dark:bg-gray-600 rounded-full h-4 overflow-hidden">
                      <div className={`h-full transition-all ${status.battery > 50 ? 'bg-green-500' : status.battery > 20 ? 'bg-yellow-500' : 'bg-red-500'}`}
                        style={{ width: `${status.battery}%` }}/>
                    </div>
                    <span className="font-bold text-sm">{status.battery}%</span>
                  </div>
                </div>
              )}

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
                        <div className="h-full bg-purple-500 transition-all"
                          style={{ width: `${((status.filmCapacity || status.filmPack) - status.filmRemaining) / (status.filmCapacity || status.filmPack) * 100}%` }}/>
                      </div>
                      <span className="font-bold text-sm">
                        {Math.round(((status.filmCapacity || status.filmPack) - status.filmRemaining) / (status.filmCapacity || status.filmPack) * 100)}%
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {status.resolution !== undefined && (
                <div className="border-b border-gray-300 dark:border-gray-600 pb-3">
                  <div className="font-semibold text-gray-800 dark:text-gray-200 mb-2">🔧 Digital Features</div>
                  <div className="text-sm font-mono text-gray-600 dark:text-gray-300 space-y-1">
                    <div className="flex justify-between"><span>Resolution:</span><span className="font-bold">{status.resolution} MP</span></div>
                    <div className="flex justify-between"><span>Max Zoom:</span><span className="font-bold">{status.zoomRatio}x</span></div>
                    <div className="flex justify-between">
                      <span>Burst Mode:</span>
                      <span className={`font-bold ${status.burstMode ? 'text-red-600' : 'text-gray-500'}`}>
                        {status.burstMode ? '🔴 ON' : '⚫ OFF'}
                      </span>
                    </div>
                  </div>
                </div>
              )}

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
