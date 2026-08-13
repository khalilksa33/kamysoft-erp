export const themes = {
  default: {
    name: 'Default ERP',
    vars: {
      '--primary-color': '#4f46e5',
      '--secondary-color': '#10b981',
      '--bg-color': '#f3f4f6',
      '--text-color': '#111827'
    }
  },
  salla: {
    name: 'SaaS Store',
    vars: {
      '--primary-color': '#00bba6',
      '--secondary-color': '#212b36',
      '--bg-color': '#f9fafb',
      '--text-color': '#1a1a1a'
    }
  }
};

export const applyTheme = (themeName, customConfig = {}) => {
  const theme = themes[themeName] || themes.default;
  const root = document.documentElement;
  
  // Apply base theme vars
  Object.entries(theme.vars).forEach(([key, value]) => {
    root.style.setProperty(key, value);
  });

  // Apply custom config overrides
  if (customConfig.colors) {
    Object.entries(customConfig.colors).forEach(([key, value]) => {
      root.style.setProperty(`--${key}`, value);
    });
  }
};
