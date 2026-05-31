/**
 * UML Diagram Component - Displays the class hierarchy visually
 */
export default function UMLDiagram() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Camera OOP Class Hierarchy
      </h2>

      <div className="flex flex-col items-center gap-6">
        {/* CameraADT - Abstract Class */}
        <div className="border-2 border-red-500 bg-red-50 rounded p-5 w-80 text-center">
          <div className="font-bold text-red-700 mb-2 underline italic">«abstract»</div>
          <div className="font-bold text-lg mb-3 text-red-700">CameraADT</div>
          <div className="text-xs border-t border-red-500 pt-3 mb-2 text-gray-700 text-left">
            <div className="font-semibold text-red-600 mb-2">Getters (Abstract):</div>
            <div className="space-y-1 text-gray-600 ml-2">
              <div>+ brand: String</div>
              <div>+ model: String</div>
              <div>+ iso: Integer</div>
              <div>+ shutterSpeed: Float</div>
              <div>+ aperture: Float</div>
              <div>+ focalLength: Float</div>
              <div>+ battery: Integer</div>
            </div>
          </div>
          <div className="text-xs border-t border-red-500 pt-3 text-gray-700 text-left">
            <div className="font-semibold text-red-600 mb-2">Methods (Abstract):</div>
            <div className="space-y-1 text-gray-600 ml-2">
              <div>+ status(): Object</div>
              <div>+ shoot(): Object</div>
              <div>+ charge(amount): Object</div>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="text-2xl text-gray-400">▼</div>

        {/* Camera Base Class */}
        <div className="border-2 border-blue-500 bg-blue-50 rounded p-5 w-80 text-center">
          <div className="font-bold text-blue-700 mb-2 underline">«class»</div>
          <div className="font-bold text-lg mb-3 text-blue-700">Camera</div>
          <div className="text-xs border-t border-blue-500 pt-3 mb-2 text-gray-700 text-left">
            <div className="font-semibold text-blue-600 mb-2">Properties (Private):</div>
            <div className="space-y-1 text-gray-600 ml-2">
              <div>- _brand: String</div>
              <div>- _model: String</div>
              <div>- _iso: Integer</div>
              <div>- _shutterSpeed: Float</div>
              <div>- _aperture: Float</div>
              <div>- _focalLength: Float</div>
              <div>- _battery: Integer</div>
              <div>- _shutterCount: Integer</div>
            </div>
          </div>
          <div className="text-xs border-t border-blue-500 pt-3 text-gray-700 text-left">
            <div className="font-semibold text-blue-600 mb-2">Methods:</div>
            <div className="space-y-1 text-gray-600 ml-2">
              <div>+ status(): Object ✓</div>
              <div>+ shoot(): Object ✓</div>
              <div>+ charge(amount): Object ✓</div>
              <div>- _formatShutterSpeed(): String</div>
              <div>- _setFocalLength(value): void</div>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="text-2xl text-gray-400">▼</div>

        {/* Three subclasses in a row */}
        <div className="flex gap-6 justify-center flex-wrap max-w-6xl">
          {/* DigitalCamera */}
          <div className="border-2 border-green-500 bg-green-50 rounded p-4 w-72 text-center">
            <div className="font-bold text-green-700 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3 text-green-700">DigitalCamera</div>
            <div className="text-xs border-t border-green-500 pt-3 mb-2 text-gray-700 text-left">
              <div className="font-semibold text-green-600 mb-2">Properties:</div>
              <div className="space-y-1 text-gray-600 ml-2">
                <div>- _resolution: Float</div>
                <div>- _zoomRatio: Integer</div>
                <div>- _burstMode: Boolean</div>
              </div>
            </div>
            <div className="text-xs border-t border-green-500 pt-3 text-gray-700 text-left">
              <div className="font-semibold text-green-600 mb-2">Methods:</div>
              <div className="space-y-1 text-gray-600 ml-2">
                <div>+ toggleBurstMode(): String</div>
                <div>+ zoom(level): Object</div>
                <div>+ shoot(): Object ✓</div>
                <div>+ status(): Object ✓</div>
              </div>
            </div>
          </div>

          {/* FilmCamera */}
          <div className="border-2 border-purple-500 bg-purple-50 rounded p-4 w-72 text-center">
            <div className="font-bold text-purple-700 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3 text-purple-700">FilmCamera</div>
            <div className="text-xs border-t border-purple-500 pt-3 mb-2 text-gray-700 text-left">
              <div className="font-semibold text-purple-600 mb-2">Properties:</div>
              <div className="space-y-1 text-gray-600 ml-2">
                <div>- _filmFormat: String</div>
                <div>- _filmCapacity: Integer</div>
                <div>- _filmRemaining: Integer</div>
              </div>
            </div>
            <div className="text-xs border-t border-purple-500 pt-3 text-gray-700 text-left">
              <div className="font-semibold text-purple-600 mb-2">Methods:</div>
              <div className="space-y-1 text-gray-600 ml-2">
                <div>+ reloadFilm(capacity): Object</div>
                <div>+ shoot(): Object ✓</div>
                <div>+ charge(amount): Object ✓</div>
                <div>+ status(): Object ✓</div>
              </div>
            </div>
          </div>

          {/* InstantCamera */}
          <div className="border-2 border-pink-500 bg-pink-50 rounded p-4 w-72 text-center">
            <div className="font-bold text-pink-700 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3 text-pink-700">InstantCamera</div>
            <div className="text-xs border-t border-pink-500 pt-3 mb-2 text-gray-700 text-left">
              <div className="font-semibold text-pink-600 mb-2">Properties:</div>
              <div className="space-y-1 text-gray-600 ml-2">
                <div>- _filmPack: Integer</div>
                <div>- _filmRemaining: Integer</div>
                <div>- _developing: Boolean</div>
              </div>
            </div>
            <div className="text-xs border-t border-pink-500 pt-3 text-gray-700 text-left">
              <div className="font-semibold text-pink-600 mb-2">Methods:</div>
              <div className="space-y-1 text-gray-600 ml-2">
                <div>+ reloadFilmPack(capacity): Object</div>
                <div>+ shoot(): Object ✓</div>
                <div>+ status(): Object ✓</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Legend and Notes */}
      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-700">
        <p className="font-semibold mb-3 text-center">Legend & Notes:</p>
        <div className="grid grid-cols-2 gap-4 mb-3">
          <div><span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>Abstract Class</div>
          <div><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>Base Class</div>
          <div><span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>Digital Camera</div>
          <div><span className="inline-block w-3 h-3 bg-purple-500 rounded mr-2"></span>Film Camera</div>
          <div><span className="inline-block w-3 h-3 bg-pink-500 rounded mr-2"></span>Instant Camera</div>
        </div>
        <div className="text-xs text-gray-600 border-t pt-3">
          <p className="mb-2"><span className="font-semibold">✓</span> = Method overridden from abstract class</p>
          <p><strong>Access Modifiers:</strong> + (public getter), - (private property)</p>
        </div>
      </div>
    </div>
  );
}