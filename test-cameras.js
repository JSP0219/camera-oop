import Camera from './src/oop/Camera.js';
import DigitalCamera from './src/oop/DigitalCamera.js';
import FilmCamera from './src/oop/FilmCamera.js';
import InstantCamera from './src/oop/InstantCamera.js';

// Test basic camera
const basicCam = new Camera('Test', 'Model1', 400, 1/125, 2.8, 50);
console.log('✓ Basic Camera created');
console.log('  Status:', basicCam.status());

// Test Digital Camera
const digitalCam = new DigitalCamera('Canon', 'EOS R5', 400, 1/125, 2.8, 50, 100, 61, 10);
console.log('\n✓ Digital Camera created');
console.log('  Burst Mode:', digitalCam.burstMode);
digitalCam.toggleBurstMode();
console.log('  After toggle:', digitalCam.burstMode);
digitalCam.shoot();
console.log('  After shoot:', digitalCam.battery, '%');

// Test Film Camera
const filmCam = new FilmCamera('Nikon', 'FM2n', 100, 1/125, 2.0, 50);
console.log('\n✓ Film Camera created');
console.log('  Film remaining:', filmCam.filmRemaining);
filmCam.shoot();
console.log('  After shoot:', filmCam.filmRemaining);

// Test Instant Camera
const instantCam = new InstantCamera('Fujifilm', 'Instax', 800, 1/60, 12.7, 60, 100, 10);
console.log('\n✓ Instant Camera created');
console.log('  Film pack:', instantCam.filmRemaining);
const result = instantCam.shoot();
console.log('  Shoot result:', result.success);
console.log('  Battery after:', instantCam.battery, '%');

console.log('\n✅ All tests passed!');
