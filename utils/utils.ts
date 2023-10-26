function getViewportDimensions() {
  const { innerWidth: width, innerHeight: height } = window;
  return { width, height };
}

export { getViewportDimensions };
