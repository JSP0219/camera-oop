import Camera from "./Camera";

/**
 * InstantCamera - Instant camera with automatic printing
 */
export default class InstantCamera extends Camera {
  _filmPack;
  _filmRemaining;

  _developing = false;

  constructor(
    brand,
    model,
    iso,
    shutterSpeed,
    aperture,
    focalLength,
    battery = 100,
    filmPack = 10
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

    this._filmPack = filmPack > 0 ? filmPack : 10;
    this._filmRemaining = this._filmPack;
  }

  get filmRemaining() {
    return this._filmRemaining;
  }

  get filmPack() {
    return this._filmPack;
  }

  get developing() {
    return this._developing;
  }

  reloadFilmPack(capacity = 10) {
    if (capacity <= 0) {
      const message = `[에러] 필름팩 용량은 1 이상이어야 합니다: ${capacity}`;
      console.error(message);
      return {
        success: false,
        message
      };
    }
    this._filmPack = capacity;
    this._filmRemaining = capacity;
    const message = `[${this._model}] 필름팩 교체 완료! (${capacity}매 장전)`;
    console.log(message);
    return {
      success: true,
      message
    };
  }

  shoot() {
    const requiredBattery = 2;

    if (this._battery < requiredBattery) {
      const message = `[${this._model}] 배터리 부족! 즉석 촬영에는 최소 ${requiredBattery}%가 필요합니다.`;
      console.log(message);
      return {
        success: false,
        message
      };
    }
    if (this._filmRemaining <= 0) {
      const message = `[${this._model}] 필름이 없습니다! reloadFilmPack()으로 교체하세요.`;
      console.log(message);
      return {
        success: false,
        message
      };
    }
    if (this._developing) {
      const message = `[${this._model}] 현재 인화 중입니다. 잠시 후 다시 시도하세요.`;
      console.log(message);
      return {
        success: false,
        message
      };
    }

    this._battery -= requiredBattery;
    this._filmRemaining -= 1;
    this._shutterCount += 1;
    this._developing = true;

    const messages = [
      `[${this._model}] 즉석카메라 촬영!`,
      `  즉석 인화 중... (남은 필름: ${this._filmRemaining}/${this._filmPack}매)`,
      `  인화 완료! 사진을 꺼내 흔들지 마세요`,
      `  (셔터: ${this._shutterCount}회, 배터리: ${this._battery}%)`
    ];

    messages.forEach(msg => console.log(msg));

    this._developing = false;

    return {
      success: true,
      message: messages.join('\n')
    };
  }

  status() {
    const baseStatus = super.status();
    return {
      ...baseStatus,
      filmRemaining: this._filmRemaining,
      filmPack: this._filmPack,
      developing: this._developing
    };
  }
}