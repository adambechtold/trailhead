export async function getCurrentPosition(): Promise<any> {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(resolve, reject, {
      enableHighAccuracy: true,
      maximumAge: 100,
    });
  });
}
