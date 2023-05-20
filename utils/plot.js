export const getLineOfPins = ({
  startPosition,
  endPosition,
  numberOfPins,
}) => {

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
    });
  }

  return line;
};