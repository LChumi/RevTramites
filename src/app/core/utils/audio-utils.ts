export function playAlert() {
  const audio = new Audio('/sounds/alert.mp3');
  audio.play().catch(error => {
    console.error('Error al reproducir el audio:', error);
  });
}
