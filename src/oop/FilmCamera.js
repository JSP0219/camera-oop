import Camera from "./Camera";

/**
 * FilmCamera - Film camera with film management
 */
export default class FilmCamera extends Camera {
  _filmFormat;
  _filmCapacity;
  _filmRemaining;
  //1

  constructor(
    brand,
    model,
    iso,
    shutterSpeed,
    aperture,
    focalLength,
    filmFormat = "35mm",
    filmCapacity = 36
  ) {
    super(
      brand,
      model,
      iso,
      shutterSpeed,
      aperture,
      focalLength,
      100
    );

    this._filmFormat = filmFormat;
    this._filmCapacity = filmCapacity > 0 ? filmCapacity : 36;
    this._filmRemaining = this._filmCapacity;
  }

  get filmRemaining() {
    return this._filmRemaining;
  }

  get filmFormat() {
    return this._filmFormat;
  }

  get filmCapacity() {
    return this._filmCapacity;
  }

  reloadFilm(capacity = 36) {
    if (capacity <= 0) {
      const message = `[에러] 필름 용량은 1 이상이어야 합니다: ${capacity}`;
      console.error(message);
      return {
        success: false,
        message
      };
    }
    this._filmCapacity = capacity;
    this._filmRemaining = capacity;
    const message = `[${this._model}] 필름 교체 완료 (${capacity}컷 남음)`;
    console.log(message);
    return {
      success: true,
      message
    };
  }

  shoot() {
    if (this._filmRemaining <= 0) {
      const message = `[${this._model}] 필름이 소진되었습니다! 필름을 교체하세요.`;
      console.log(message);
      return {
        success: false,
        message
      };
    }
    this._filmRemaining -= 1;
    this._shutterCount += 1;
    const message = `[${this._model}] 필름 촬영! 남은 필름: ${this._filmRemaining}/${this._filmCapacity}컷 (총 셔터: ${this._shutterCount}회)`;
    console.log(message);
    return {
      success: true,
      message
    };
  }

  charge(amount = 0) {
    const message = `[${this._model}] 필름 카메라는 배터리 충전이 필요 없습니다. reloadFilm()을 사용하세요.`;
    console.log(message);
    return {
      success: false,
      message
    };
  }

  status() {
    const baseStatus = super.status();
    return {
      ...baseStatus,
      filmFormat: this._filmFormat,
      filmRemaining: this._filmRemaining,
      filmCapacity: this._filmCapacity
    };
  }
}