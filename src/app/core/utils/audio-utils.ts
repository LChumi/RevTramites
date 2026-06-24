export function playAlert(tono: string) {
  const audio = new Audio(`/sounds/${tono}.mp3`);
  audio.play().catch(error => {
    console.error('Error al reproducir el audio:', error);
  });
}
