export const useHaptic = () => {
  const triggerHaptic = (type: 'light' | 'medium' | 'success' | 'warning' | 'error') => {
    if (typeof window === 'undefined' || !window.navigator || !window.navigator.vibrate) {
      return;
    }

    switch (type) {
      case 'light':
        window.navigator.vibrate(15);
        break;
      case 'medium':
        window.navigator.vibrate(30);
        break;
      case 'success':
        window.navigator.vibrate([10, 30, 10]);
        break;
      case 'warning':
        window.navigator.vibrate([30, 50, 30]);
        break;
      case 'error':
        window.navigator.vibrate([50, 100, 50, 100]);
        break;
    }
  };

  return { triggerHaptic };
};
