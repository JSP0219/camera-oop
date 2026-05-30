import CameraADT from "./CameraADT";

/**
 * Camera - Base class implementing common camera properties and behaviors
 */
export default class Camera extends CameraADT {
  _brand;
  _model;
  _iso;
  _shutterSpeed;
  _aperture;
  _focalLength;
  _battery;

  _shutterCount = 0;

  constructor(
    brand,
    model,
    iso,
    shutterSpeed,
    aperture,
    focalLength,
    battery = 100
  ) {
    super();

    this._brand = brand;
    this._model = model;

    this._iso = 100;
    this._shutterSpeed = 1 / 125;
    this._aperture = 2.8;
    this._focalLength = 50.0;
    this._battery = 100;

    this.iso = iso;
    this.shutterSpeed = shutterSpeed;
    this.aperture = aperture;
    this._setFocalLength(focalLength);
    this.battery = battery;
  }

  get brand() {
    return this._brand;
  }

  get model() {
    return this._model;
  }

  get iso() {
    return this._iso;
  }

  set iso(value) {
    if (value >= 25 && value <= 204800) {
      this._iso = value;
    } else {
      console.error(`[에러] 유효하지 않은 ISO 값입니다: ${value} (범위: 25 ~ 204800)`);
    }
  }

  get shutterSpeed() {
    return this._shutterSpeed;
  }

  set shutterSpeed(value) {
    if (value > 0) {
      this._shutterSpeed = value;
    } else {
      console.error(`[에러] 셔터 속도는 0보다 커야 합니다: ${value}`);
    }
  }

  get aperture() {
    return this._aperture;
  }

  set aperture(value) {
    if (value >= 0.95 && value <= 64.0) {
      this._aperture = value;
    } else {
      console.error(`[에러] 조리개 값이 유효 범위를 벗어났습니다: f/${value}`);
    }
  }

  get focalLength() {
    return this._focalLength;
  }

  get battery() {
    return this._battery;
  }

  set battery(value) {
    if (value < 0) {
      this._battery = 0;
      console.log(`[${this._model}] 배터리가 방전되었습니다!`);
    } else if (value > 100) {
      this._battery = 100;
      console.log(`[${this._model}] 배터리가 이미 100%입니다.`);
    } else {
      this._battery = value;
    }
  }

  get shutterCount() {
    return this._shutterCount;
  }

  _setFocalLength(value) {
    if (value > 0) {
      this._focalLength = value;
    } else {
      console.error(`[에러] 초점 거리는 0보다 커야 합니다: ${value}`);
    }
  }

  _formatShutterSpeed() {
    if (this._shutterSpeed >= 1) {
      if (Number.isInteger(this._shutterSpeed)) {
        return `${this._shutterSpeed}s`;
      }
      return `${this._shutterSpeed.toFixed(1)}s`;
    }
    const denominator = Math.round(1 / this._shutterSpeed);
    return `1/${denominator}s`;
  }

  status() {
    return {
      className: this.constructor.name,
      brand: this._brand,
      model: this._model,
      iso: this._iso,
      shutterSpeed: this._formatShutterSpeed(),
      aperture: this._aperture,
      focalLength: this._focalLength,
      battery: this._battery,
      shutterCount: this._shutterCount
    };
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
    this._battery = Math.max(0, this._battery - 1);
    this._shutterCount += 1;
    const message = `[${this._model}] 기본 촬영! (셔터: ${this._shutterCount}회, 배터리: ${this._battery}%)`;
    console.log(message);
    return {
      success: true,
      message
    };
  }

  charge(amount = 20) {
    if (amount <= 0) {
      const message = `[에러] 충전량은 1 이상이어야 합니다: ${amount}`;
      console.error(message);
      return {
        success: false,
        message
      };
    }
    const before = this._battery;
    // Clamp to 100 to prevent overflow
    const newBattery = Math.min(100, before + amount);
    this._battery = newBattery;
    const message = `[${this._model}] 충전 완료 → 배터리: ${before}% → ${this._battery}%`;
    console.log(message);
    return {
      success: true,
      message,
      newBattery: this._battery
    };
  }
}