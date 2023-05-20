// Create Gradient
function hexToRgb(hex) {
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return [r, g, b];
}

function rgbToHex(rgb) {
  const r = rgb[0].toString(16).padStart(2, '0');
  const g = rgb[1].toString(16).padStart(2, '0');
  const b = rgb[2].toString(16).padStart(2, '0');
  return `${r}${g}${b}`;
}

export const calculateGradient = ({ 
  startColor, 
  endColor, 
  steps 
}) => {
  const startRgb = hexToRgb(startColor);
  const endRgb = hexToRgb(endColor);
  const stepSize = [
    (endRgb[0] - startRgb[0]) / steps,
    (endRgb[1] - startRgb[1]) / steps,
    (endRgb[2] - startRgb[2]) / steps,
  ];
  const gradient = [];
  for (let i = 0; i <= steps; i++) {
    const r = Math.round(startRgb[0] + stepSize[0] * i);
    const g = Math.round(startRgb[1] + stepSize[1] * i);
    const b = Math.round(startRgb[2] + stepSize[2] * i);
    gradient.push(rgbToHex([r, g, b]));
  }
  console.log('gradient', gradient);
  return gradient;
}
