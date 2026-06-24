export function playAlert(tono: string) {
  try {
    const audio = new Audio(`/sounds/${tono}.mp3`);
    audio.play().then(r => {});
  } catch (error) {
    console.error('Error al reproducir el audio:', error);
  }
}
