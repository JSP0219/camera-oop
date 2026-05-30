/**
 * CameraADT - Abstract base class for all cameras
 * Defines the contract all camera implementations must follow
 */
export default class CameraADT {
  constructor() {
    if (new.target === CameraADT) {
      throw new TypeError('CameraADT is an abstract class');
    }
  }

  get brand() {
    throw new Error('brand getter must be implemented');
  }

  get model() {
    throw new Error('model getter must be implemented');
  }

  get iso() {
    throw new Error('iso getter must be implemented');
  }

  get shutterSpeed() {
    throw new Error('shutterSpeed getter must be implemented');
  }

  get aperture() {
    throw new Error('aperture getter must be implemented');
  }

  get focalLength() {
    throw new Error('focalLength getter must be implemented');
  }

  get battery() {
    throw new Error('battery getter must be implemented');
  }

  status() {
    throw new Error('status method must be implemented');
  }

  shoot() {
    throw new Error('shoot method must be implemented');
  }

  charge(amount = 20) {
    throw new Error('charge method must be implemented');
  }
}