import React from 'react';

export default function ClassDetailModal({ classInfo, isOpen, onClose }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl max-w-2xl w-full max-h-96 overflow-y-auto">
        {/* Header */}
        <div className={`${classInfo.headerColor} p-6 flex justify-between items-center text-white`}>
          <div>
            <div className="text-sm italic mb-2">{classInfo.type}</div>
            <h2 className="text-3xl font-bold">{classInfo.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="text-2xl hover:opacity-70 transition w-8 h-8 flex items-center justify-center"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 text-gray-800 dark:text-gray-200">
          {classInfo.description && (
            <div className="mb-6">
              <p className="text-gray-600 dark:text-gray-400">{classInfo.description}</p>
            </div>
          )}

          {/* Properties */}
          {classInfo.properties && classInfo.properties.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-100">
                📦 Properties
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 space-y-2">
                {classInfo.properties.map((prop, idx) => (
                  <div key={idx} className="font-mono text-sm">
                    <span className="text-blue-600 dark:text-blue-400">{prop.access}</span>
                    <span className="text-gray-700 dark:text-gray-300 ml-2">{prop.name}:</span>
                    <span className="text-purple-600 dark:text-purple-400 ml-2">{prop.type}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Methods */}
          {classInfo.methods && classInfo.methods.length > 0 && (
            <div className="mb-6">
              <h3 className="font-bold text-lg mb-3 text-gray-800 dark:text-gray-100">
                ⚙️ Methods
              </h3>
              <div className="bg-gray-100 dark:bg-gray-700 rounded p-4 space-y-3">
                {classInfo.methods.map((method, idx) => (
                  <div key={idx} className="border-l-4 border-blue-500 pl-3">
                    <div className="font-mono text-sm">
                      <span className="text-green-600 dark:text-green-400">{method.access}</span>
                      <span className="text-gray-700 dark:text-gray-300 ml-2">{method.name}</span>
                      <span className="text-gray-600 dark:text-gray-400">({method.params})</span>
                      <span className="text-purple-600 dark:text-purple-400 ml-2">: {method.return}</span>
                    </div>
                    {method.description && (
                      <div className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                        {method.description}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {classInfo.notes && (
            <div className="bg-yellow-50 dark:bg-yellow-900/20 border-l-4 border-yellow-500 p-4">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">{classInfo.notes}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
