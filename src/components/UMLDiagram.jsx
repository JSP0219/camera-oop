import { useState } from 'react';
import ClassDetailModal from './ClassDetailModal';

/**
 * UML Diagram Component - Displays the class hierarchy visually
 */
export default function UMLDiagram() {
  const [selectedClass, setSelectedClass] = useState(null);

  const classDetails = {
    CameraADT: {
      type: '«abstract»',
      name: 'CameraADT',
      headerColor: 'bg-red-500',
      description: 'Abstract base class that defines the contract for all camera implementations.',
      properties: [
        { access: '+', name: 'brand', type: 'String (getter)' },
        { access: '+', name: 'model', type: 'String (getter)' },
        { access: '+', name: 'iso', type: 'Integer (getter)' },
        { access: '+', name: 'shutterSpeed', type: 'Float (getter)' },
        { access: '+', name: 'aperture', type: 'Float (getter)' },
        { access: '+', name: 'focalLength', type: 'Float (getter)' },
        { access: '+', name: 'battery', type: 'Integer (getter)' },
      ],
      methods: [
        { access: '+', name: 'status()', params: '', return: 'Object', description: 'Get current camera status' },
        { access: '+', name: 'shoot()', params: '', return: 'Object', description: 'Take a photo' },
        { access: '+', name: 'charge(amount)', params: 'number', return: 'Object', description: 'Charge the battery' },
      ],
      notes: 'All methods are abstract and must be implemented by subclasses.'
    },
    Camera: {
      type: '«class»',
      name: 'Camera',
      headerColor: 'bg-blue-500',
      description: 'Base class implementing the CameraADT interface with common camera functionality.',
      properties: [
        { access: '-', name: '_brand', type: 'String' },
        { access: '-', name: '_model', type: 'String' },
        { access: '-', name: '_iso', type: 'Integer' },
        { access: '-', name: '_shutterSpeed', type: 'Float' },
        { access: '-', name: '_aperture', type: 'Float' },
        { access: '-', name: '_focalLength', type: 'Float' },
        { access: '-', name: '_battery', type: 'Integer' },
        { access: '-', name: '_shutterCount', type: 'Integer' },
      ],
      methods: [
        { access: '+', name: 'status()', params: '', return: 'Object', description: 'Concrete implementation returning camera status' },
        { access: '+', name: 'shoot()', params: '', return: 'Object', description: 'Base shooting logic with battery check' },
        { access: '+', name: 'charge(amount)', params: 'number', return: 'Object', description: 'Recharge battery (0-100%)' },
        { access: '-', name: '_formatShutterSpeed()', params: '', return: 'String', description: 'Helper to format shutter speed display' },
        { access: '-', name: '_setFocalLength(value)', params: 'number', return: 'void', description: 'Validate and set focal length' },
      ],
      notes: 'Implements all abstract methods from CameraADT and adds shared functionality.'
    },
    DigitalCamera: {
      type: '«class»',
      name: 'DigitalCamera',
      headerColor: 'bg-green-500',
      description: 'Digital camera with burst mode and digital zoom capabilities.',
      properties: [
        { access: '-', name: '_resolution', type: 'Float (MP)' },
        { access: '-', name: '_zoomRatio', type: 'Integer' },
        { access: '-', name: '_burstMode', type: 'Boolean' },
      ],
      methods: [
        { access: '+', name: 'toggleBurstMode()', params: '', return: 'String', description: 'Toggle burst mode ON/OFF' },
        { access: '+', name: 'zoom(level)', params: 'number', return: 'Object', description: 'Apply digital zoom (1x to zoomRatio)' },
        { access: '+', name: 'shoot()', params: '', return: 'Object', description: 'Override: burst shooting or single shot' },
        { access: '+', name: 'status()', params: '', return: 'Object', description: 'Override: includes resolution, zoom, burst mode' },
      ],
      notes: 'Extends Camera with digital photography features. Burst mode uses 5x battery.'
    },
    FilmCamera: {
      type: '«class»',
      name: 'FilmCamera',
      headerColor: 'bg-purple-500',
      description: 'Traditional film camera with film roll management.',
      properties: [
        { access: '-', name: '_filmFormat', type: 'String' },
        { access: '-', name: '_filmCapacity', type: 'Integer' },
        { access: '-', name: '_filmRemaining', type: 'Integer' },
      ],
      methods: [
        { access: '+', name: 'reloadFilm(capacity)', params: 'number', return: 'Object', description: 'Load new film roll' },
        { access: '+', name: 'shoot()', params: '', return: 'Object', description: 'Override: no battery needed, decrements film' },
        { access: '+', name: 'charge()', params: '', return: 'Object', description: 'Override: throws error (film cameras don\'t need charging)' },
        { access: '+', name: 'status()', params: '', return: 'Object', description: 'Override: includes film info' },
      ],
      notes: 'Film cameras don\'t use battery. Film remaining tracks shots left on film roll.'
    },
    InstantCamera: {
      type: '«class»',
      name: 'InstantCamera',
      headerColor: 'bg-pink-500',
      description: 'Instant camera with automatic photo printing.',
      properties: [
        { access: '-', name: '_filmPack', type: 'Integer' },
        { access: '-', name: '_filmRemaining', type: 'Integer' },
        { access: '-', name: '_developing', type: 'Boolean' },
      ],
      methods: [
        { access: '+', name: 'reloadFilmPack(capacity)', params: 'number', return: 'Object', description: 'Load new instant film pack' },
        { access: '+', name: 'shoot()', params: '', return: 'Object', description: 'Override: requires battery, prints photo, sets developing flag' },
        { access: '+', name: 'status()', params: '', return: 'Object', description: 'Override: includes film pack and developing status' },
      ],
      notes: 'Instant cameras require 2% battery per shot. Photos automatically print and develop.'
    },
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800 dark:text-white">
        Camera OOP Class Hierarchy
      </h2>

      <div className="flex flex-col items-center gap-6">
        {/* CameraADT - Abstract Class */}
        <button
          onClick={() => setSelectedClass('CameraADT')}
          className="border-2 border-red-500 bg-red-50 dark:bg-red-900/20 rounded p-5 w-80 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div className="font-bold text-red-700 dark:text-red-400 mb-2 underline italic">«abstract»</div>
          <div className="font-bold text-lg mb-3 text-red-700 dark:text-red-400">CameraADT</div>
          <div className="text-xs border-t border-red-500 pt-3 mb-2 text-gray-700 dark:text-gray-300 text-left">
            <div className="font-semibold text-red-600 dark:text-red-400 mb-2">Getters (Abstract):</div>
            <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
              <div>+ brand, model, iso, shutterSpeed</div>
              <div>+ aperture, focalLength, battery</div>
            </div>
          </div>
          <div className="text-xs border-t border-red-500 pt-3 text-gray-700 dark:text-gray-300 text-left">
            <div className="font-semibold text-red-600 dark:text-red-400 mb-2">Abstract Methods:</div>
            <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
              <div>+ status(), shoot(), charge()</div>
            </div>
          </div>
          <div className="text-xs mt-2 text-blue-500 dark:text-blue-400 font-semibold">👆 Click for details</div>
        </button>

        {/* Arrow down with relationship label */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl text-gray-400">▼</div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            implements
          </div>
        </div>

        {/* Camera Base Class */}
        <button
          onClick={() => setSelectedClass('Camera')}
          className="border-2 border-blue-500 bg-blue-50 dark:bg-blue-900/20 rounded p-5 w-80 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
        >
          <div className="font-bold text-blue-700 dark:text-blue-400 mb-2 underline">«class»</div>
          <div className="font-bold text-lg mb-3 text-blue-700 dark:text-blue-400">Camera</div>
          <div className="text-xs border-t border-blue-500 pt-3 mb-2 text-gray-700 dark:text-gray-300 text-left">
            <div className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Properties (Private):</div>
            <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
              <div>_brand, _model, _iso, _shutterSpeed</div>
              <div>_aperture, _focalLength, _battery, _shutterCount</div>
            </div>
          </div>
          <div className="text-xs border-t border-blue-500 pt-3 text-gray-700 dark:text-gray-300 text-left">
            <div className="font-semibold text-blue-600 dark:text-blue-400 mb-2">Methods:</div>
            <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
              <div>+ status(), shoot(), charge() ✓</div>
              <div>- _formatShutterSpeed(), _setFocalLength()</div>
            </div>
          </div>
          <div className="text-xs mt-2 text-blue-500 dark:text-blue-400 font-semibold">👆 Click for details</div>
        </button>

        {/* Arrow down with relationship label */}
        <div className="flex flex-col items-center gap-1">
          <div className="text-2xl text-gray-400">▼</div>
          <div className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
            extends
          </div>
        </div>

        {/* Three subclasses in a row */}
        <div className="flex gap-6 justify-center flex-wrap max-w-6xl">
          {/* DigitalCamera */}
          <button
            onClick={() => setSelectedClass('DigitalCamera')}
            className="border-2 border-green-500 bg-green-50 dark:bg-green-900/20 rounded p-4 w-72 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="font-bold text-green-700 dark:text-green-400 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3 text-green-700 dark:text-green-400">DigitalCamera</div>
            <div className="text-xs border-t border-green-500 pt-3 mb-2 text-gray-700 dark:text-gray-300 text-left">
              <div className="font-semibold text-green-600 dark:text-green-400 mb-2">Properties:</div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
                <div>_resolution, _zoomRatio, _burstMode</div>
              </div>
            </div>
            <div className="text-xs border-t border-green-500 pt-3 text-gray-700 dark:text-gray-300 text-left">
              <div className="font-semibold text-green-600 dark:text-green-400 mb-2">Methods:</div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
                <div>+ toggleBurstMode(), zoom()</div>
                <div>+ shoot(), status() ✓</div>
              </div>
            </div>
            <div className="text-xs mt-2 text-green-500 dark:text-green-400 font-semibold">👆 Click for details</div>
          </button>

          {/* FilmCamera */}
          <button
            onClick={() => setSelectedClass('FilmCamera')}
            className="border-2 border-purple-500 bg-purple-50 dark:bg-purple-900/20 rounded p-4 w-72 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="font-bold text-purple-700 dark:text-purple-400 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3 text-purple-700 dark:text-purple-400">FilmCamera</div>
            <div className="text-xs border-t border-purple-500 pt-3 mb-2 text-gray-700 dark:text-gray-300 text-left">
              <div className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Properties:</div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
                <div>_filmFormat, _filmCapacity, _filmRemaining</div>
              </div>
            </div>
            <div className="text-xs border-t border-purple-500 pt-3 text-gray-700 dark:text-gray-300 text-left">
              <div className="font-semibold text-purple-600 dark:text-purple-400 mb-2">Methods:</div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
                <div>+ reloadFilm(), shoot(), charge() ✓</div>
                <div>+ status() ✓</div>
              </div>
            </div>
            <div className="text-xs mt-2 text-purple-500 dark:text-purple-400 font-semibold">👆 Click for details</div>
          </button>

          {/* InstantCamera */}
          <button
            onClick={() => setSelectedClass('InstantCamera')}
            className="border-2 border-pink-500 bg-pink-50 dark:bg-pink-900/20 rounded p-4 w-72 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-200 cursor-pointer"
          >
            <div className="font-bold text-pink-700 dark:text-pink-400 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3 text-pink-700 dark:text-pink-400">InstantCamera</div>
            <div className="text-xs border-t border-pink-500 pt-3 mb-2 text-gray-700 dark:text-gray-300 text-left">
              <div className="font-semibold text-pink-600 dark:text-pink-400 mb-2">Properties:</div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
                <div>_filmPack, _filmRemaining, _developing</div>
              </div>
            </div>
            <div className="text-xs border-t border-pink-500 pt-3 text-gray-700 dark:text-gray-300 text-left">
              <div className="font-semibold text-pink-600 dark:text-pink-400 mb-2">Methods:</div>
              <div className="space-y-1 text-gray-600 dark:text-gray-400 ml-2">
                <div>+ reloadFilmPack(), shoot() ✓</div>
                <div>+ status() ✓</div>
              </div>
            </div>
            <div className="text-xs mt-2 text-pink-500 dark:text-pink-400 font-semibold">👆 Click for details</div>
          </button>
        </div>
      </div>

      {/* Legend and Notes */}
      <div className="mt-8 p-4 bg-gray-100 dark:bg-gray-700 rounded text-sm text-gray-700 dark:text-gray-300">
        <p className="font-semibold mb-3 text-center text-gray-800 dark:text-white">Legend & Notes:</p>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div><span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>Abstract Class</div>
          <div><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>Base Class</div>
          <div><span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>Digital Camera</div>
          <div><span className="inline-block w-3 h-3 bg-purple-500 rounded mr-2"></span>Film Camera</div>
          <div><span className="inline-block w-3 h-3 bg-pink-500 rounded mr-2"></span>Instant Camera</div>
        </div>
        <div className="text-xs text-gray-600 dark:text-gray-400 border-t border-gray-300 dark:border-gray-600 pt-3">
          <p className="mb-2"><span className="font-semibold">✓</span> = Method overridden from parent/abstract class</p>
          <p className="mb-2"><strong>+ (public)</strong> getter or public method • <strong>- (private)</strong> private property or method</p>
          <p><strong>💡 Tip:</strong> Click any class to see detailed properties and methods!</p>
        </div>
      </div>

      {/* Modal */}
      <ClassDetailModal
        classInfo={selectedClass ? classDetails[selectedClass] : null}
        isOpen={!!selectedClass}
        onClose={() => setSelectedClass(null)}
      />
    </div>
  );
}
