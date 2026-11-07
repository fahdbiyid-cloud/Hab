import confetti from 'canvas-confetti';

export function fireHabitConfetti() {
  try {
    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.8 },
      colors: ['#F59E0B', '#10B981', '#3B82F6', '#EC4899', '#8B5CF6'],
      ticks: 150,
      disableForReducedMotion: true,
    });
  } catch (e) {
    // Graceful fallback if confetti fails
    console.debug('Confetti skipped', e);
  }
}

export function fireDayCompletedConfetti() {
  try {
    const end = Date.now() + 1000;
    const colors = ['#F59E0B', '#10B981', '#6366F1'];

    (function frame() {
      confetti({
        particleCount: 4,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: colors,
      });
      confetti({
        particleCount: 4,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: colors,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();
  } catch (e) {
    console.debug('Confetti skipped', e);
  }
}
