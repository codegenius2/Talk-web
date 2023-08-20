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

