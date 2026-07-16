// Shared Tailwind CDN config — load after cdn.tailwindcss.com on every page.
tailwind.config = {
  theme: {
    extend: {
      colors: {
        'classic-blue': '#0000EE',
        'jank-peach': '#f2ead9',
        'jank-oxblood': '#6b3a2e',
        'jank-olive': '#7c8b5e',
        'jank-yellow': '#ffff00'
      },
      fontFamily: {
        'jank-heading': ['"Times New Roman"', 'Times', 'serif'],
        'jank-body': ['"Times New Roman"', 'Times', 'serif']
      }
    }
  }
};
