
import selectColors, { 
  getColor,
  getDelta,
  increaseContrast,
  increaseBackgroundContrast,
  getBestCombination,
  getSecondaryColor,
  getMonochromaticColors,
  chromaClamping
} from './src/model'

/**
 * 
 * @param {object} data Containing properties lch and colorErrors for score computation
 * @param {object} settings object with scoring weights
 */
export const getColors = (data, settings) => {
  // console.log(data)
  let mainColor, elementColor, accentColor;

  const contextLightness = settings.darkMode ? 'dark' : 'light';

  // Get default dark and light colors from settings 
  const defaultWhite = getColor( settings.default.light, settings.space);
  const defaultDark = getColor( settings.default.dark, settings.space);

  // console.log('Default white:', defaultWhite)
  // console.log('Default white HEX:', defaultWhite.formatHex())
  // console.log('hex after mapping:', jch(defaultWhite.formatHex()).formatHex())
  // console.log('jch after mapping:', jch(defaultWhite.formatHex()))


  // Select colors based on usage
  let colors = selectColors(data, settings);
  // console.log(colors)

  // Check if dark and light color are suitable, otherwise use default light and dark color
  let darkColor = (
    ( colors.dark.getLightness() <= settings.thresholds.dark.lightness ) &&
    ( colors.dark.getChroma() <= settings.thresholds.dark.chroma )
  ) ? colors.dark : defaultDark;

  let lightColor = (
    ( colors.light.getLightness() >= settings.thresholds.light.lightness ) &&
    ( colors.light.getChroma() <= settings.thresholds.light.chroma )
  ) ? colors.light : defaultWhite;

  // Set foreground color
  const fg = settings.darkMode ? lightColor : darkColor;
  const bgInit = settings.darkMode ? darkColor : lightColor;
  const bgDefault = settings.darkMode ? defaultDark : defaultWhite;

  
  //Check if colors needs to be harmonic, in that case use hue of the main color as the base
  if (settings.harmony.model){
    console.log('Harmonization ...')

    if (settings.harmony.model === 'mono' || colors.main.getChroma() < settings.thresholds.chromaticColor){
      ({mainColor, elementColor, accentColor} = getMonochromaticColors(colors.main, lightColor, darkColor, settings));
        var bg = bgInit.copy();
    } else {
      console.log('Analogous harmony')
      // First enhance contrast of the main color
      var [enhanceMainColor, bg] = increaseBackgroundContrast({
        color: colors.main.copy(), 
        bg: bgInit, 
        settings: settings,
        target: settings.contrast.elementColor,
        method: settings.contrast.method
      })
      const hues = {
        complementary: 180,
        neutral: 15,
        analogous: 30,
      }
      elementColor = enhanceMainColor.copy();
      mainColor = colors.main.copy();
      accentColor = chromaClamping(elementColor.copy().setHue(elementColor.getHue() + hues[settings.harmony.model]))
    }

    // Harmonized colors
    // console.log(`Main color: C: ${mainColor.getChroma()}, J: ${mainColor.getLightness()}, h: ${mainColor.getHue()}`)
    // console.log(`Element color: C: ${elementColor.getChroma()}, J: ${elementColor.getLightness()}, h: ${elementColor.getHue()}`)
    // console.log(`Accent color: C: ${accentColor.getChroma()}, J: ${accentColor.getLightness()}, h: ${accentColor.getHue()}`)  
  } else {
   
    // Set element color
    elementColor = colors.main.copy();

    // Check if multiple accent colors are allowed and check if any of the colors is more chromatic than main color
    if (settings.multipleAccent) {
      const candidates = [colors.dark, colors.light];
      const chromaCandidates = candidates.map(candidate => candidate.getChroma());
      const maxChromaValue = Math.max(...chromaCandidates);
      const maxChromaColor = candidates[chromaCandidates.indexOf( maxChromaValue )];

      if (
        maxChromaValue > elementColor.getChroma() &&
        getDelta(maxChromaColor, bgInit, settings.contrast.method) >= getDelta(elementColor, bgInit, settings.contrast.method)
      ) {
        elementColor = maxChromaColor.copy()
      }
    }

    // Check the difference between element color and background and adjust biasedly – first try to change bg then main color
    var bgEnhance
    [elementColor, bgEnhance] = increaseBackgroundContrast({
      color: elementColor, 
      bg: bgInit, 
      settings: settings,
      target: settings.contrast.elementColor,
      method: settings.contrast.method
    })

    // Check the difference between accent color and background and adjust biasedly - first try to change bg then accent color
    var bg
    [accentColor, bg] =  increaseBackgroundContrast({
      color: colors.accent,
      bg: bgEnhance, 
      settings: settings,
      target: settings.contrast.accentColor,
      method: settings.contrast.method
    })
    
    mainColor = colors.main.copy()
  }

  // Check the color difference between element and accent color
  if ( elementColor.getDifference(accentColor) < settings.deltas.elementWithAccent ) {
    [elementColor, accentColor] = increaseContrast({
      c1: elementColor,
      c2: accentColor,
      settings: settings
    })
    //console.log(elementColor.getDifference(accentColor))
  }

  /* Set text colors */
  const mainText = getBestCombination({
    color: mainColor,
    candidates: [ fg, bg ],
    method: settings.bestCombination.method,
    context:  contextLightness,
    contextLightnessCorrection: settings.bestCombination.contextLightnessCorrection
  })

  const elementText = getBestCombination({
    color: elementColor,
    candidates: [ fg, bg ],
    method: settings.bestCombination.method,
    context:  contextLightness,
    contextLightnessCorrection: settings.bestCombination.contextLightnessCorrection
  })

  const accentText = getBestCombination({
    color: accentColor,
    candidates: [ fg, bg ],
    method: settings.bestCombination.method,
    context:  contextLightness,
    contextLightnessCorrection: settings.bestCombination.contextLightnessCorrection
  })

  // console.log(
  //   'Main color: ', mainColor,
  //   'Accent color: ', accentColor,
  //   'Element color: ', elementColor,
  //   'Background: ', bg,
  //   'Foreground: ', fg
  // )


  return {
    main: {
      primary: mainColor.formatHex(),
      secondary: getSecondaryColor({
        color: mainColor,
        delta: settings.deltas.primaryWithSecondary,
        bg: bg,
      }).formatHex(),
      text: mainText.formatHex()
    },
    element: {
      primary: elementColor.formatHex(),
      secondary: getSecondaryColor({
        color: elementColor,
        delta: settings.deltas.primaryWithSecondary,
        bg: bg,
      }).formatHex(),
      text: elementText.formatHex()
    },
    accent: {
      primary: accentColor.formatHex(),
      secondary: getSecondaryColor({
        color: accentColor,
        delta: settings.deltas.primaryWithSecondary,
        bg: bg,
      }).formatHex(),
      text: accentText.formatHex()
    },
    bg: {
      primary: bg.formatHex(),
      secondary: getSecondaryColor({
        color: bg,
        delta: settings.deltas.primaryWithSecondary,
        bg: bg,
      }).formatHex(),
      text: fg.formatHex()
    },
    fg: {
      primary: fg.formatHex(),
      secondary: getSecondaryColor({
        color: fg,
        delta: settings.deltas.primaryWithSecondary,
        bg: bg,
      }).formatHex(),
      text: bg.formatHex()
    }

  }
}


