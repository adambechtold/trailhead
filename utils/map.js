import { calculateGradient, getGradientStart, getGradientEnd } from '@/utils/color';
import { averageArray } from '@/utils/math';

export const getLineOfPins = ({
  startPosition,
  endPosition,
  numberOfPins,
}) => {
  const startColor = getGradientStart();
  const endColor = getGradientEnd();
  const gradient = calculateGradient({
    startColor,
    endColor,
    steps: numberOfPins,
  });

  if (numberOfPins < 2) {
    throw new Error('numberOfPins must be greater than 1');
  }

  const line = [];
  const latDiff = (endPosition.latitude - startPosition.latitude) / (numberOfPins - 1);
  const longDiff = (endPosition.longitude - startPosition.longitude) / (numberOfPins - 1);
  for (let i = 0; i < numberOfPins; i++) {
    line.push({
      index: i,
      latitude: startPosition.latitude + (latDiff * i),
      longitude: startPosition.longitude + (longDiff * i),
      color: gradient[i]
    });
  }

  return line;
};

const exampleInitialPins = [{
  index: 1,
  latitude: 41.33673,
  longitude: -72.68157,
  left: 445.977,
  top: 918.485,
}, {
  index: 2,
  latitude: 41.3398,
  longitude: -72.68334,
  left: 421.052,
  top: 842.589,
}];

export const exampleOverlays = [
  {
    url: '../images/trailmap-timberlands-precise-1.jpeg',
    bounds: [[41.3545, -72.6965], [41.3289, -72.6666]],
  },
  {
    url: '../images/trailmap-timberlands-precise-2.jpeg',      
    bounds: [[41.35422, -72.6926], [41.328, -72.66833]],
  }
];

exampleOverlays.forEach((overlay) => {
  overlay.center = [
    averageArray(overlay.bounds.map(coord => coord[0])),
    averageArray(overlay.bounds.map(coord => coord[1])),
  ];
});

export const getExamplePins = () => getLineOfPins({
  startPosition: exampleInitialPins[0],
  endPosition: exampleInitialPins[1],
  numberOfPins: 8
});
