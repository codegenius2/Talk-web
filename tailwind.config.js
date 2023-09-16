/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography';

export default {
    mode: 'jit', // https://v2.tailwindcss.com/docs/just-in-time-mode
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'spin-slow': 'spin 5s linear infinite',
            },
            colors: {
                'blue-grey': 'rgb(85,121,235)',
                'slider-blue': '#61d0f0',
                'slider-red': 'rgb(184, 42, 21)',
                'slider-pink': '#f56e83'
                // 'slider-blue':'#61d0f0',
                // 'slider-red':'rgb(184, 42, 21)',
                // 'slider-pink':'#f56e83'
            },
            maxWidth: {
                '11': '2.75rem',
                '60': '20rem',
                '80': '20rem',
                '86': '22rem',
                '1/4': '25%',
                '1/5': '20%',
                '1/2': '50%',
                '2/5': '40%',
                '3/4': '75%',
                'screen-105': '105vw',
            },
            minWidth: {
                '11': '2.75rem',
                '60': '20rem',
                '80': '20rem',
                '86': '22rem',
                '1/2': '50%',
                '1/4': '25%',
                '1/5': '20%',
                '2/5': '40%',
                '3/4': '75%',
                'screen-105': '105vw',
            },
            width: {
                'screen-105': '105vw',
                '26': '6.5rem',
            },
            maxHeight: {
                'screen-105': '105vh',
            },
            height: {
                'screen-105': '105vh',
            },
            minHeight: {
                '12': '3rem',
                '24': '6rem',
            },
            transitionDuration: {
                '1500': '1500ms',
                '2500': '2500ms',
                '2000': '2000ms',
                '3000': '3000ms',
                '4000': '4000ms',
                '5000': '5000ms',
            },
            fontFamily: {
                'borel': ['borel', ...defaultTheme.fontFamily.sans],
            },
            backgroundImage: {
                // we have no copyright. limited to personal use. do not put them on a website that is public accessible
                // see https://www.behance.net/gallery/84818869/Fuzzies-vol-1
                'balloon': "url('/src/assets/bg/no-copyright/959e3384818869.5d6bfdf2b5e1b.png')",
                'walk-in-green': "url('/src/assets/bg/no-copyright/84974784818869.5d6bfdf4e8260.png')",

                // wikiart.org public domain arts, completely free to use
                'simultaneous-counter-composition-1930': "url('/src/assets/bg/wikiart-public-domain/simultaneous-counter-composition-1930.jpg')",
                'noise': "url('/src/assets/bg/noise.svg')",
                'noise-lg': "url('/src/assets/bg/noise-lg.svg')",
            }
        },

    },
    plugins: [
        typography
    ],

}

