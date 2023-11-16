import { createSlice } from '@reduxjs/toolkit';
import {get,set} from "local-storage";
import {getColors} from './../../model';

export const colorModes = [
  {
    name: 'Authentic',
    settings: {
      light: {
        weights: {
          main: {
            coverage: 1,
            chroma:0.25,
            strength: 0,
            contrast: 0,
            analogy: 0.25
          },
          accent: {
            coverage: 0,
            chroma: 1,
            strength: 1,
            contrast: 0.5,
            difference: 0.25,

          }
        }
      },
      dark: {
        weights: {
          main: {
            coverage: 1,
            chroma:0.25,
            strength: 0,
            contrast: 0,
            analogy: 3
          },
          accent: {
            coverage: 0,
            chroma: 1,
            strength: 0,
            contrast: 0.25,
            difference: 0.25,

          }
        }
      }
    },
  },
  {
    name: 'Colorful',
    settings: {
      light: {
        weights: {
          main: {
            coverage: 0.75,
            chroma:1,
            strength: 0,
            contrast: 0.5,
            analogy: 0
          },
          accent: {
            coverage: 0,
            chroma: 3,
            strength: 0,
            contrast: 1,
            difference: 0.5,
          }
        }
      },
      dark: {
        weights: {
          main: {
            coverage: 0.5,
            chroma:0.75,
            strength: 0,
            contrast: 0,
            analogy: 3
          },
          accent: {
            coverage: 0.5,
            chroma: 1,
            strength: 0,
            contrast: 0,
            difference: 0.25,

          }
        }
      }
    }
  },
]

const accessibilitySettings = {
  '1': {
    contrast: {
      method: 'w3c',
      elementColor: 0,
      accentColor: 0,
    }
  },
  '2': {
    contrast: {
      method: 'w3c',
      elementColor: 3,
      accentColor: 3,
    }
  },
  '3': {
    contrast: {
      method: 'w3c',
      elementColor: 4.5,
      accentColor: 4.5,
    }
  }
}

export const defaultParams = {
  darkMode: false,
  accessibility: 1,
  harmony: false,
  mode: 'Authentic',
}

const defaultDark = (get('darkMode') !== null) ? get('darkMode') : defaultParams.darkMode;
const defaultMode = (get('mode') !== null) ? get('mode') : defaultParams.mode;

// Define default settings
const defaultSettings = {
  mode: defaultMode,
  darkMode: defaultDark,
  space: 'JCH', // JAB | JCH | LAB,
  colorErrorMethod: 'default', // judd | gbvs
  accessibilityLevel: (get('accessibility') !== null) ? get('accessibility') : defaultParams.accessibility,
  weights: colorModes.filter(mode => mode.name === defaultMode)[0].settings[(defaultDark) ? 'dark' : 'light'].weights,
  thresholds: {
    dark: {
      lightness: 15,
      chroma: 10
    },
    light: {
      lightness: 85,
      chroma: 10
    },
    chromaticColor: 10
  },
  default: {
    light: '#fff',
    dark: '#000',
  },
  contrast: {
    method: 'w3c',
    elementColor: 3,
    accentColor: 3,
    mainColor: 3
  },
  bestCombination: {
    method: 'delta',
    contextLightnessCorrection: 10,
  },
  deltas: {
    primaryWithSecondary: 5,
    elementWithAccent: 20,
  },
  multipleAccent: true,
  harmony: {
    model: (get('harmony') !== null) ? get('harmony') : defaultParams.harmony, // false | mono | complementary | neutral | analogous
    lightnessDistance: 5, // 0–1
  }
}

// Check settings in local storage
const localSettings = get('settings');


export const modelSlice = createSlice({
  name: 'model',
  initialState: {...defaultSettings},

  reducers: {
    setMode: (state, action) => {
      const selectedMode = action.payload.mode;
      const modeVersion = action.payload.darkMode ? 'dark' : 'light';
      const modeSettings = colorModes.filter(mode => mode.name === selectedMode)[0];
      console.log(modeSettings)

      if (modeSettings.settings) {
        for (const [setting, value] of Object.entries(modeSettings.settings[modeVersion])) {
          state[setting] = value
        }
        
      }
      set('mode', selectedMode);
      state.mode = selectedMode;
    },
    dispatchDarkMode: (state, action) => {
      state.darkMode = action.payload;
      set('darkMode', action.payload);
    },
    setHarmony: (state, action) => {
      state.harmony.model = action.payload
      set('harmony', action.payload);
    },
    setAccessibility: (state, action)  => {
      state.accessibilityLevel = action.payload
      state.contrast = accessibilitySettings[action.payload].contrast;
      set('accessibility', action.payload);
    }

  }
});

export const { 
  setColors, 
  setStep, 
  setSettings, 
  resetSettings, 
  setMode, 
  dispatchDarkMode, 
  setHarmony, 
  setAccessibility 
} = modelSlice.actions;

// Selectors
export const selectColors = state => {
  const colorsData = state.app.currentRecord;
  const settings = state.model;

  if (colorsData) {
    return getColors(colorsData.colors, settings);
  } else {
    return false
  }

}

export const selectSetting = (prop, step) => {
  return ( state ) => state.model.settings[step][prop]
}

export const selectSettings = state => state.model.settings;

export const selectDarkMode = state => state.model.darkMode;

export const selectMode = state => state.model.mode;

export const selectHarmony = state => state.model.harmony.model;

export const selectAccessibilityLevel = state => state.model.accessibilityLevel;


// Export reducer by default
export default modelSlice.reducer;
