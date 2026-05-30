import Camera from "./Camera";

/**
 * DigitalCamera - Digital camera with burst mode and digital zoom
 */
export default class DigitalCamera extends Camera {
  _resolution;
  _zoomRatio;

  _burstMode = false;

  constructor(
    brand,
    model,
    iso,
    shutterSpeed,
    aperture,
    focalLength,
    battery = 100,
    resolution = 20.0,
    zoomRatio = 10
  ) {
    super(
      brand,
      model,
      iso,
      shutterSpeed,
      aperture,
      focalLength,
      battery
    );

    this._resolution = resolution > 0 ? resolution : 20.0;
    this._zoomRatio = zoomRatio >= 1 ? zoomRatio : 10;
  }

  get resolution() {
    return this._resolution;
  }

  get zoomRatio() {
    return this._zoomRatio;
  }

  get burstMode() {
    return this._burstMode;
  }

  toggleBurstMode() {
    this._burstMode = !this._burstMode;
    const state = this._burstMode ? 'ON' : 'OFF';
    const message = `[${this._model}] 연사 모드 ${state}`;
    console.log(message);
    return message;
  }

  shoot() {
    if (this._battery <= 0) {
      const message = `[${this._model}] 배터리 부족! 촬영 불가.`;
      console.log(message);
      return {
        success: false,
        message
      };
    }

    if (this._burstMode) {
      const shots = 5;
      if (this._battery < shots) {
        const message = `[${this._model}] 배터리 부족! 연사 촬영은 최소 ${shots}% 배터리가 필요합니다.`;
        console.log(message);
        return {
          success: false,
          message
        };
      }
      this._battery -= shots;
      this._shutterCount += shots;
      const message = `[${this._model}] 연사 촬영 x${shots}! (셔터: ${this._shutterCount}회, 배터리: ${this._battery}%)`;
      console.log(message);
      return {
        success: true,
        message
      };
    }

    this._battery -= 1;
    this._shutterCount += 1;
    const message = `[${this._model}] 디지털 촬영! ISO ${this._iso}, f/${this._aperture} (셔터: ${this._shutterCount}회, 배터리: ${this._battery}%)`;
    console.log(message);
    return {
      success: true,
      message
    };
  }

  zoom(level) {
    if (level < 1 || level > this._zoomRatio) {
      const message = `[에러] 줌 배율 범위 초과 (1x ~ ${this._zoomRatio}x)`;
      console.error(message);
      return {
        success: false,
        message
      };
    }
    const message = `[${this._model}] 디지털 줌 ${level}x 적용`;
    console.log(message);
    return {
      success: true,
      message
    };
  }

  status() {
    const baseStatus = super.status();
    return {
      ...baseStatus,
      resolution: this._resolution,
      zoomRatio: this._zoomRatio,
      burstMode: this._burstMode
    };
  }
}