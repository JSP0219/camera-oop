import Camera from "../oop/Camera";
import DigitalCamera from "../oop/DigitalCamera";
import FilmCamera from "../oop/FilmCamera";
import InstantCamera from "../oop/InstantCamera";

export const cameras = [
  new DigitalCamera(
    "Canon",
    "EOS R5",
    400,
    1 / 125,
    2.8,
    50,
    100,
    61.0,
    10
  ),
  new FilmCamera(
    "Nikon",
    "FM2n",
    100,
    1 / 125,
    2.0,
    50,
    "35mm",
    36
  ),
  new InstantCamera(
    "Fujifilm",
    "Instax Mini 11",
    800,
    1 / 60,
    12.7,
    60,
    100,
    10
  ),
];