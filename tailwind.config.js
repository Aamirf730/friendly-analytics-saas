/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                'accent-primary': '#5865F2',
                'accent-secondary': '#EB459E',
            },
        },
    },
    plugins: [],
}
