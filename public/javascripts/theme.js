document.addEventListener('DOMContentLoaded', () => {

  const themeMap = {
    dark: "light",
    light: "solar",
    solar: "dark"
  };

  let tmp;
  
  const theme = localStorage.getItem('whats-next-theme')
    || (tmp = Object.keys(themeMap)[0],
        localStorage.setItem('whats-next-theme', tmp),
        tmp);
  console.log(theme);
  document.querySelector(`#${theme}-icon`).classList.remove('hidden');

  const bodyClass = document.body.classList;
  bodyClass.add(theme);
  
  function toggleTheme() {
    const current = localStorage.getItem('whats-next-theme');
    const next = themeMap[current];

  
    bodyClass.replace(current, next);
    localStorage.setItem('whats-next-theme', next);
    document.querySelector(`#${current}-icon`).classList.add('hidden');
    document.querySelector(`#${next}-icon`).classList.remove('hidden');
  }
  
  document.querySelector('.sidebar__themify').onclick = toggleTheme;
});