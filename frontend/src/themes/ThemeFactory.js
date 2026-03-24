// Abstract Factory para temas
export class ThemeFactory {
  createHeaderStyle() {
    return {};
  }
  createButtonStyle() {
    return {};
  }
  createCardStyle() {
    return {};
  }
  createBackgroundStyle() {
    return {};
  }
  createTextColor() {
    return '#333';
  }
  createInputStyle() {
    return {};
  }
}

// Tema Claro
export class LightThemeFactory extends ThemeFactory {
  createHeaderStyle() {
    return {
      background: 'rgba(255, 255, 255, 0.95)',
      backdropFilter: 'blur(12px)',
      color: '#1f2937',
      boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
      borderBottom: '1px solid rgba(0,0,0,0.05)'
    };
  }
  
  createButtonStyle() {
    return {
      background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 24px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontWeight: '600',
      fontSize: '14px'
    };
  }
  
  createCardStyle() {
    return {
      background: 'white',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.1)',
      border: '1px solid rgba(0,0,0,0.05)',
      borderRadius: '16px'
    };
  }
  
  createBackgroundStyle() {
    return {
      background: 'linear-gradient(135deg, #f0f9ff 0%, #fdf4ff 100%)',
      minHeight: '100vh'
    };
  }
  
  createTextColor() {
    return '#1f2937';
  }
  
  createInputStyle() {
    return {
      background: 'white',
      border: '1px solid #e5e7eb',
      color: '#1f2937'
    };
  }
}

// Tema Oscuro
export class DarkThemeFactory extends ThemeFactory {
  createHeaderStyle() {
    return {
      background: 'rgba(17, 24, 39, 0.95)',
      backdropFilter: 'blur(12px)',
      color: '#f3f4f6',
      boxShadow: '0 1px 3px rgba(0,0,0,0.3)',
      borderBottom: '1px solid rgba(255,255,255,0.05)'
    };
  }
  
  createButtonStyle() {
    return {
      background: 'linear-gradient(135deg, #0ea5e9 0%, #d946ef 100%)',
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      padding: '10px 24px',
      cursor: 'pointer',
      transition: 'all 0.3s',
      fontWeight: '600',
      fontSize: '14px'
    };
  }
  
  createCardStyle() {
    return {
      background: '#1f2937',
      boxShadow: '0 4px 20px -2px rgba(0, 0, 0, 0.3)',
      border: '1px solid rgba(255,255,255,0.05)',
      borderRadius: '16px',
      color: '#f3f4f6'
    };
  }
  
  createBackgroundStyle() {
    return {
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      minHeight: '100vh'
    };
  }
  
  createTextColor() {
    return '#f3f4f6';
  }
  
  createInputStyle() {
    return {
      background: '#374151',
      border: '1px solid #4b5563',
      color: '#f3f4f6'
    };
  }
}