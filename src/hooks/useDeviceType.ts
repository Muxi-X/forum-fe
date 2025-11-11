import { useState, useEffect } from 'react';
import { sizes } from 'styles/media';

export type DeviceType = keyof typeof sizes | null;
export function useDeviceType(): DeviceType {
  function getDeviceType(): DeviceType {
    const width = window.innerWidth;
    if (width <= sizes.phone) return 'phone';
    if (width <= sizes.tablet) return 'tablet';
    if (width <= sizes.desktop) return 'desktop';
    if (width > sizes.desktop) return 'bigDesktop';
    return null;
  }

  const [device, setDevice] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const newDevice = getDeviceType();
      setDevice(newDevice);
    };

    handleResize();
    window.addEventListener('resize', handleResize);

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
}
