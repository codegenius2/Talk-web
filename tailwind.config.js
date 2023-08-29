/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            backdropFilter: {
                'none': 'none',
                'blur': 'blur(px)',
            },
            colors: {
                'blue-grey': 'rgb(85,121,235)',
                'equal-50': 'rgb(252,252,252)',
                'equal-100': 'rgb(246,246,246)',
                'equal-200': 'rgb(233,233,233)',
                'equal-500': 'rgb(132,132,132)',
                'equal-600': 'rgb(100,100,100)',
                'equal-800': 'rgb(46,46,46)',
                'equal-900': 'rgb(27,27,27)',
            },
            maxWidth: {
                '1/4': '25%',
                '1/5': '20%',
                '2/5': '40%',
                '1/2': '50%',
                '3/4': '75%',
            }
        },

    },
    variants: {
        extend: {
            backdropFilter: ['responsive'], // or other variants you need
        },
    },
    plugins: [
        require('@tailwindcss/typography'),
    ],
}

