import { useState, useEffect, useRef } from 'react';

export function useLazyImage(src) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (!src || hasError) return;

    // Create Intersection Observer for lazy loading
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isLoaded) {
            setIsLoaded(true);
            if (observerRef.current) {
              observerRef.current.disconnect();
            }
          }
        });
      },
      { rootMargin: '50px' }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [src, isLoaded, hasError]);

  const handleError = () => {
    setHasError(true);
  };

  return {
    imgRef,
    isLoaded,
    hasError,
    handleError,
  };
}

