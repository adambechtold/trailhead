
export const averageArray = (numbers) => {
  const sum = numbers.reduce((acc, curr) => acc + curr, 0);
  return sum / numbers.length;
};
