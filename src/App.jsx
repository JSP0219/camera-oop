import { useState, useEffect, useRef } from "react";
import { cameras as initialCameras } from "./data/cameras";
import CameraCard from "./components/CameraCard";
import UMLDiagram from "./components/UMLDiagram";
import ControlPanel from "./components/CotrolPanel";
import LiveDemoPanel from "./components/LiveDemoPanel";

export default function App() {
  const [cameras, setCameras] = useState(initialCameras.map(c => Object.create(Object.getPrototypeOf(c), Object.getOwnPropertyDescriptors(c))));
  const [logs, setLogs] = useState([]);
  const [darkMode, setDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true';
    }
    return false;
  });

  const logRef = useRef(null);

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTo({ top: logRef.current.scrollHeight, behavior: 'smooth' });
    }
  }, [logs]);

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
  };

  const handleUpdate = () => {
    setCameras([...cameras]);
  };

  const handleLog = (message) => {
    const timestamp = new Date().toLocaleTimeString('ko-KR');
    setLogs(prev => {
      const next = [...prev, {
        id: Date.now(),
        time: timestamp,
        message
      }];
      return next.slice(-50); // keep last 50, oldest at top
    });
  };

  const reset = () => {
    // Reinitialize cameras
    setCameras(initialCameras.map(c => Object.create(Object.getPrototypeOf(c), Object.getOwnPropertyDescriptors(c))));
    handleLog('All cameras reset to initial state');
  };

  const clearLog = () => {
    setLogs([]);
  };

  return (
    <div className={`min-h-screen ${darkMode ? 'dark' : ''}`}>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-8 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 flex justify-between items-center">
            <div>
              <h1 className="text-4xl font-bold mb-2">📷 Camera OOP Web Application</h1>
              <p className="text-blue-100">Python OOP Camera System - React Implementation</p>
            </div>
            <button
              onClick={toggleDarkMode}
              className="bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-4 rounded-lg transition-all"
              title="Toggle Dark Mode"
            >
              {darkMode ? '☀️ Light' : '🌙 Dark'}
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          {/* Control Panel */}
          <ControlPanel reset={reset} onClearLog={clearLog} />

          {/* UML Diagram */}
          <UMLDiagram />

          {/* Live Demo Panel */}
          <LiveDemoPanel />

          {/* Camera Cards */}
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            {cameras.map((camera, idx) => (
              <CameraCard
                key={idx}
                camera={camera}
                onUpdate={handleUpdate}
                onLog={handleLog}
              />
            ))}
          </div>

          {/* Log Console */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">📋 Activity Log</h2>
              <span className="text-sm text-gray-600 dark:text-gray-400">{logs.length} events</span>
            </div>
            
            <div ref={logRef} className="bg-gray-900 dark:bg-gray-950 text-green-400 font-mono text-sm rounded-lg p-4 h-64 overflow-y-auto border border-gray-700">
              {logs.length === 0 ? (
                <div className="text-gray-500">No activity yet. Try shooting or charging a camera!</div>
              ) : (
                logs.map((log) => (
                  <div key={log.id} className="flex gap-3 mb-1 border-b border-gray-700 pb-1">
                    <span className="text-gray-600">[{log.time}]</span>
                    <span className="text-green-400">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="mt-8 text-center text-gray-600 dark:text-gray-400 text-sm pb-4">
            <p>Object-Oriented Programming Camera System</p>
            <p>Built with React + Tailwind CSS • CameraADT → Camera → DigitalCamera, FilmCamera, InstantCamera</p>
          </div>
        </div>
      </div>
    </div>
  );
}