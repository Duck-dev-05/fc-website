'use client';

import { useEffect } from 'react';

export default function GoogleTranslate() {
  useEffect(() => {
    // Only add the script if it hasn't been added yet
    if (!(window as any).googleTranslateElementInit) {
      (window as any).googleTranslateElementInit = function () {
        new (window as any).google.translate.TranslateElement(
          {
            pageLanguage: 'en',
            includedLanguages: 'en,vi',
            layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
            autoDisplay: false,
          },
          'google_translate_element'
        );
      };
      const script = document.createElement('script');
      script.src = '//translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      document.body.appendChild(script);
    } else if ((window as any).google && (window as any).google.translate) {
      (window as any).googleTranslateElementInit();
    }
  }, []);

  return (
    <div
      id="google_translate_element"
      style={{ position: 'fixed', top: 10, right: 10, zIndex: 9999 }}
    ></div>
  );
} 