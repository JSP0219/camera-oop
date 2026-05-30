/**
 * UML Diagram Component - Displays the class hierarchy visually
 */
export default function UMLDiagram() {
  return (
    <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
      <h2 className="text-2xl font-bold mb-8 text-center text-gray-800">
        Camera OOP Class Hierarchy
      </h2>

      <div className="flex flex-col items-center gap-8">
        {/* CameraADT */}
        <div className="border-2 border-red-500 bg-red-50 rounded p-4 w-64 text-center">
          <div className="font-bold text-red-700 mb-2 underline">«interface»</div>
          <div className="font-bold text-lg mb-3">CameraADT</div>
          <div className="text-xs border-t border-red-500 pt-2 mb-2 text-gray-700 text-left">
            <div className="font-semibold mb-1">Properties:</div>
            <div className="space-y-1 text-gray-600">
              <div>+ brand: String</div>
              <div>+ model: String</div>
              <div>+ iso: Integer</div>
              <div>+ shutterSpeed: Float</div>
              <div>+ aperture: Float</div>
              <div>+ focalLength: Float</div>
              <div>+ battery: Integer</div>
            </div>
          </div>
          <div className="text-xs border-t border-red-500 pt-2 text-gray-700 text-left">
            <div className="font-semibold mb-1">Methods:</div>
            <div className="space-y-1 text-gray-600">
              <div>+ status(): void</div>
              <div>+ shoot(): void</div>
              <div>+ charge(amount): void</div>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="text-3xl text-gray-500">▼</div>

        {/* Camera Base Class */}
        <div className="border-2 border-blue-500 bg-blue-50 rounded p-4 w-64 text-center">
          <div className="font-bold text-blue-700 mb-2 underline">«class»</div>
          <div className="font-bold text-lg mb-3">Camera</div>
          <div className="text-xs border-t border-blue-500 pt-2 mb-2 text-gray-700 text-left">
            <div className="font-semibold mb-1">Properties:</div>
            <div className="space-y-1 text-gray-600">
              <div>- _shutterCount: Integer</div>
              <div>(inherited from CameraADT)</div>
            </div>
          </div>
          <div className="text-xs border-t border-blue-500 pt-2 text-gray-700 text-left">
            <div className="font-semibold mb-1">Methods:</div>
            <div className="space-y-1 text-gray-600">
              <div>+ _formatShutterSpeed(): String</div>
              <div>+ _setFocalLength(value): void</div>
            </div>
          </div>
        </div>

        {/* Arrow down */}
        <div className="text-3xl text-gray-500">▼</div>

        {/* Three subclasses in a row */}
        <div className="flex gap-8 justify-center flex-wrap">
          {/* DigitalCamera */}
          <div className="border-2 border-green-500 bg-green-50 rounded p-4 w-56 text-center">
            <div className="font-bold text-green-700 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3">DigitalCamera</div>
            <div className="text-xs border-t border-green-500 pt-2 mb-2 text-gray-700 text-left">
              <div className="font-semibold mb-1">Properties:</div>
              <div className="space-y-1 text-gray-600">
                <div>- resolution: Float</div>
                <div>- zoomRatio: Integer</div>
                <div>- _burstMode: Boolean</div>
              </div>
            </div>
            <div className="text-xs border-t border-green-500 pt-2 text-gray-700 text-left">
              <div className="font-semibold mb-1">Methods:</div>
              <div className="space-y-1 text-gray-600">
                <div>+ toggleBurstMode(): void</div>
                <div>+ zoom(level): void</div>
              </div>
            </div>
          </div>

          {/* FilmCamera */}
          <div className="border-2 border-purple-500 bg-purple-50 rounded p-4 w-56 text-center">
            <div className="font-bold text-purple-700 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3">FilmCamera</div>
            <div className="text-xs border-t border-purple-500 pt-2 mb-2 text-gray-700 text-left">
              <div className="font-semibold mb-1">Properties:</div>
              <div className="space-y-1 text-gray-600">
                <div>- filmFormat: String</div>
                <div>- filmCapacity: Integer</div>
                <div>- filmRemaining: Integer</div>
              </div>
            </div>
            <div className="text-xs border-t border-purple-500 pt-2 text-gray-700 text-left">
              <div className="font-semibold mb-1">Methods:</div>
              <div className="space-y-1 text-gray-600">
                <div>+ reloadFilm(capacity): void</div>
              </div>
            </div>
          </div>

          {/* InstantCamera */}
          <div className="border-2 border-pink-500 bg-pink-50 rounded p-4 w-56 text-center">
            <div className="font-bold text-pink-700 mb-2 underline">«class»</div>
            <div className="font-bold text-lg mb-3">InstantCamera</div>
            <div className="text-xs border-t border-pink-500 pt-2 mb-2 text-gray-700 text-left">
              <div className="font-semibold mb-1">Properties:</div>
              <div className="space-y-1 text-gray-600">
                <div>- filmPack: Integer</div>
                <div>- filmRemaining: Integer</div>
                <div>- _developing: Boolean</div>
              </div>
            </div>
            <div className="text-xs border-t border-pink-500 pt-2 text-gray-700 text-left">
              <div className="font-semibold mb-1">Methods:</div>
              <div className="space-y-1 text-gray-600">
                <div>+ reloadFilmPack(capacity): void</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 p-4 bg-gray-100 rounded text-sm text-gray-700 text-center">
        <p className="font-semibold mb-2">Legend:</p>
        <div className="flex justify-center gap-8 flex-wrap">
          <div><span className="inline-block w-3 h-3 bg-red-500 rounded mr-2"></span>Abstract Interface</div>
          <div><span className="inline-block w-3 h-3 bg-blue-500 rounded mr-2"></span>Base Class</div>
          <div><span className="inline-block w-3 h-3 bg-green-500 rounded mr-2"></span>Digital Camera</div>
          <div><span className="inline-block w-3 h-3 bg-purple-500 rounded mr-2"></span>Film Camera</div>
          <div><span className="inline-block w-3 h-3 bg-pink-500 rounded mr-2"></span>Instant Camera</div>
        </div>
      </div>
    </div>
  );
}