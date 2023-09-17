import * as React from 'react';

if (import.meta.env.DEV && import.meta.env.VITE_ENABLE_WHY_DID_YOU_RENDER === 'true') {
  const { default: wdyr } = await import('@welldone-software/why-did-you-render');

  wdyr(React, {
    include: [/.*/],
    exclude: [/^BrowserRouter/, /^Link/, /^Route/],
    trackHooks: true,
    trackAllPureComponents: true,
  });
}