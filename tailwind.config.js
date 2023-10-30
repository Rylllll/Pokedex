/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: {
      screens: {
      sm: '576px',
       md: '768px',
       lg: '992px',
       xl: '1200px',
       
      

   },
   fontFamily: {
     'sans': ['Poppins', 'sans-serif'],
     'del': ['DELIRIUM NCV', 'sans-serif'],
     'script': ['Dancing Script', 'cursive'],
     'bai': ['DM Serif Display', 'serif'],

 },

  width: {
    custom: '600px',
    box:'400px'
  },
  height: {
    custom: '550px',
    bg: '692px'
  },

  margin: {
    custom: '500px'
  }
    },
  },
  plugins: [],
}

