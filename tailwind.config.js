/** @type {import('tailwindcss').Config} */
import defaultTheme from 'tailwindcss/defaultTheme'
import typography from '@tailwindcss/typography';

export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            // backdropFilter: {
            //     'none': 'none',
            //     'blur': 'blur(px)',
            // },
            colors: {
                'blue-grey': 'rgb(85,121,235)',
                'equal-50': 'rgb(252,252,252)',
                'equal-100': 'rgb(246,246,246)',
                'equal-200': 'rgb(233,233,233)',
                'equal-500': 'rgb(132,132,132)',
                'equal-600': 'rgb(100,100,100)',
                'equal-800': 'rgb(46,46,46)',
                'equal-900': 'rgb(27,27,27)',
                'equal-950': 'rgb(17,17,17)',
            },
            maxWidth: {
                '1/4': '25%',
                '1/3': '33%',
                '1/5': '20%',
                '2/5': '40%',
                '1/2': '50%',
                '3/4': '75%',
                'screen-105': '105vw',
            },
            width: {
                'screen-105': '105vw',
            },
            maxHeight: {
                'screen-105': '105vh',
            },
            height: {
                'screen-105': '105vh',
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
            }
        },

    },
    variants: {
        extend: {
            backdropFilter: ['responsive'], // or other variants you need
        },
    },
    plugins: [
        typography,
    ],

}

