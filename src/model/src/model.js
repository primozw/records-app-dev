/* eslint-disable no-throw-literal */
import {Permutation} from 'js-combinatorics';
import {jch, jab, lab} from './color';
import colorContrast from 'color-contrast'

import { 
  minMaxNorm
}  from './utilities'


/**
 * Return delta – color difference or color contrast – between colors
 * @param {object} color d3 color object
 * @param {object} bg d3 color object
 * @param {string} method w3c | delta
 * @returns number
 */
function getDelta(color, bg, method){
  switch (method) {
    case 'w3c':
      return colorContrast(color.formatHex(), bg.formatHex());
    case 'delta':
      return color.getDifference(bg);
    default:
      throw `${method} not supported. Define a valid method: contrast or difference.`
  }
}

/**
 * Color mapping on chroma path
 * @param {object} c d3 color object
 * @returns d3 color object
 */
function chromaClamping(c) {
  // if the color is displayable, return it directly
  if (c.displayable()) return c;
  
  // try with chroma=0
  var clamped = jch(c.J, 0, c.h);
  
  // if not even chroma=0 is displayable
  // fall back to RGB clamping
  if (!clamped.displayable()) return clamped;
  
  // By this time we know chroma=0 is displayable and our current chroma is not.
  // Find the displayable chroma through the bisection method.
  var start = 0, end = c.C, delta = 0.01;
  
  while (end - start > delta) {
    clamped.C = start + (end - start) * 0.5;
    if (clamped.displayable()) start = clamped.C;
    else end = clamped.C;
    // console.log('Clamping:', clamped)
  };
  return clamped;
}
  

/**
 * 
 * @param {object} color d3 modified color
 * @param {object} defaultWhite d3 modified color
 * @param {object} defaultDark d3 modified color
 * @param {object} settings settings from the app
 * @returns object of monochromatic basic colors
 */
function getMonochromaticColors(color, defaultWhite, defaultDark, settings){
    const maxL = defaultWhite.getLightness();
    const minL = defaultDark.getLightness();
    const step = (maxL - minL) / 4;
    const lightnessValues = [minL, minL+step, minL+(step*2), minL+(step*3), maxL];
    let mainColor, accentColor, elementColor;
    
    // console.log('Main color for monochromatic theme:', color.formatHex(), color)
    
    const colors = lightnessValues.map(l => {
      const c = jch(l, color.getChroma(), color.getHue());
      // console.log('Init value:', c, 'Displayable:', c.displayable())
      return chromaClamping(c.copy())
    })

    // console.log('Monochromatic colors: ', colors, colors.map(e => e.formatHex()))

    // set element color to middle color
    elementColor = colors[2];

    //set main color to most similar one
    const cand = [colors[1], colors[2], colors[3] ]
    const deltas = cand.map(e => e.getDifference(color));
    const indMain = deltas.indexOf(Math.min(...deltas)) + 1;
    mainColor = colors.slice( indMain, indMain + 1)[0];

    if (settings.darkMode) mainColor = colors[1]

    if (!settings.darkMode) accentColor = colors[1]
    else accentColor = colors[3];

  return {
    mainColor, elementColor, accentColor
  }
}


/**
 * Get color score based on its properties  
 * @param {object} color 
 * @param {object} weights 
 */
function mainColorScore(color, weights){
  return (
    (color.relCoverage * weights.coverage) + 
    (color.relChroma * weights.chroma) + 
    (color.relContrast * color.relChroma * weights.strength) +
    (color.relContrast * weights.contrast) +
    (color.relAnalogy * weights.analogy)

  );
}

/**
 * Get color score if its suitable for accent color 
 * @param {object} color color object with properties
 * @param {number} delta color difference with main color
 * @param {object} weights 
 */
function accentColorScore(color, delta, weights){
  return (
    (color.relCoverage * weights.coverage) + 
    (delta * weights.difference) +
    (color.relChroma * weights.chroma) + 
    (color.relContrast * color.relChroma * weights.strength) +
    (color.relContrast * weights.contrast)
  );
}

/**
 * Return indexes of colors that are most suitable for main and accent color
 * @param {array} colors colors collection
 * @param {object} settings settings for the model
 */
function selectMainAndAccentColors( colors, settings ) {

  // Select the best main and accent colors based on the scoring functions
  // Generate permutation for indexes: [0,1], [0,2], [0,3] ...
  const permObj = new Permutation('0123', 2);
  const perm = [...permObj]

  // Compute color difference between first and second color
  const deltas = perm.map(p => colors[ Number(p[0])].getDifference(colors[Number(p[1])]));
  const relDeltas = deltas.map( delta => minMaxNorm(delta,  Math.min(...deltas), Math.max(...deltas)));

  // Compute scores – first color is assumed to be main and second accent color
  let mainScores = [], accentScores = []

  perm.forEach((p, i) => {
    const ind1 = Number(p[0]);
    const ind2 = Number(p[1]);

    mainScores.push( mainColorScore(
      colors[ind1], 
      settings.weights.main,
    ));
    accentScores.push( accentColorScore(
      colors[ind2], 
      relDeltas[i],
      settings.weights.accent,
    ));
  });

  // Normalize scores
  const minMainScore = Math.min(...mainScores);
  const maxMainScore = Math.max(...mainScores);
  const normMainScores = mainScores.map((s) => minMaxNorm(s, minMainScore, maxMainScore));

  const minAccentScore = Math.min(...accentScores);
  const maxAccentScore = Math.max(...accentScores);
  const normAccentScores = accentScores.map((s) => minMaxNorm(s, minAccentScore, maxAccentScore));

  // Compute total score
  let totalScores = normMainScores.map((mainScore, ind) => mainScore + normAccentScores[ind])
  // Get best permutation based on computed score
  const bestPerm = totalScores.findIndex((s) => s === Math.max(...totalScores));
  // console.log(colors)
  // console.log(perm)
  // console.log(normMainScores)
  // console.log(normAccentScores)
  //console.log(perm[bestPerm])
  return perm[bestPerm]
  
}

/**
 * Return D3 color object
 * @param {string} hex RGB hex values of color
 * @param {string} space color space: LAB | JCH | JAB
 * @returns OBJECT D3
 */
function getColor(hex, space){
  switch (space) {
    case 'LAB':
      return lab(hex);
      break;
    case 'JCH':
      return jch(hex);
      break;
    case 'JAB':
      return jab(hex);
      break;
    default:
      throw `${space} color space is not supported. Define a valid color space.`
  }
}

/**
 * Return an array of d3 colors with additional coverage property
 * @param {object} data init data exported from matlab
 * @param {object} settings settings from GUI
 * @returns array od D3 colors
 */
function getColors(data, settings){
  let cr;
  // Set color errors metric 
  switch (settings.colorErrorMethod) {
    case 'judd':
      cr = data.juddColorErrors;
      break;
    case 'gbvs':
      cr = data.gbvsColorErrors;
      break;
    default:
      cr = data.colorErrors
      break;
  }

  return data.hex.map((hex, ind) =>  {
    let c = getColor(hex, settings.space)
    c.coverage = Math.pow(1 - cr[ind], Math.E);
    return c;
  })
}

/**
 * Return array of D3 colors with additional relative properties
 * @param {array} colors Array of D3 colors
 * @param {object} settings Settings for the model
 * @returns array of D3 colors with additional relative values
 */
function addRelativeProperties(colors, settings){

  // Get absolute values
  let _l = colors.map(color => color.getLightness());
  let _c = colors.map(color => color.getChroma());
  let _s = colors.map(color => color.getStrength());
  let _con = colors.map(color => color.getContrast(settings.darkMode ? 0 : 100));
  let _analogy = colors.map(color => color.getAnalogy(settings.darkMode ? 0 : 100));

  let _cov = colors.map(color => color.coverage);

  return colors.map((color, i) => {
    return Object.assign(color, {
      relLightness: minMaxNorm(_l[i], Math.min(..._l), Math.max(..._l)),
      relChroma: minMaxNorm(_c[i], Math.min(..._c), Math.max(..._c)),
      relStrength: minMaxNorm(_s[i], Math.min(..._s), Math.max(..._s)),
      relCoverage: minMaxNorm( _cov[i], Math.min(..._cov), Math.max(..._cov)),
      relContrast: minMaxNorm(_con[i], Math.min(..._con), Math.max(..._con)),
      relAnalogy: minMaxNorm(_analogy[i], Math.min(..._analogy), Math.max(..._analogy)),
    })
  })
}


/**
 * Determine main, accent, dark and light colors
 * @param {object} data object containing properties of most prominent colors extracted from the image 
 * @param {object} settings 
 */
function selectColors(data, settings){

  // Construct color D3 objects in defined color space for further computation
  let colors = addRelativeProperties(getColors(data, settings), settings);
  // console.log(colors)

  // Select main and accent color
  const [mainInd, accentInd] = selectMainAndAccentColors(colors, settings);

  // Select dark and light color
  const candidates = colors.filter((color, ind ) => ind !== parseInt(mainInd) && ind !== parseInt(accentInd))
  const candidatesL = candidates.map(c => c.getLightness())
  const lightColor = candidates[ candidatesL.indexOf( Math.max( ...candidatesL ) )]
  const darkColor = candidates[ candidatesL.indexOf( Math.min( ...candidatesL ) )] 

  return {
    main: colors[mainInd],
    accent: colors[accentInd],
    dark: darkColor,
    light: lightColor
  }
}


/**
 * Return the color with greatest contrast
 * @param {object} param0 
 * @returns color d3 object
 */
function getBestCombination( { color, candidates, method, context, contextLightnessCorrection }) {
  
  const c = color.copy()
  let l = color.getLightness();
  l += ( context === 'dark' ) ? contextLightnessCorrection : -contextLightnessCorrection;
  c.setLightness(l);

  const contrastValues = candidates.map(candidate => getDelta(c, candidate, method));
  // console.log(contrastValues)
  // console.log(contrastValues.indexOf( Math.max(...contrastValues)))
  return candidates[contrastValues.indexOf( Math.max(...contrastValues) )];
}


/**
 * Get lighter or darker version of the color
 * @param {object} param0 
 * @returns d3 color object 
 */
function getSecondaryColor({
  color, 
  delta, 
  bg
}){
  
  const l = color.getLightness();
  const bgl = bg.getLightness();
  let sc = color.copy();

  // First try to make color lighter or darker
  let sl = (l <= 55) ? l - delta : l + delta;

  if (sl < 0 || sl > 100){
    // console.log('other direction ...')
    sl = (l <= 55) ? l + delta : l - delta;
  }
  sc.setLightness(sl);
  sc = chromaClamping(sc);

  // console.log('Lightness of basic color: ', l)
  // console.log('Lightness of variant color: ', sl)

  return sc
}

/**
 * 
 * @param {object} param0 settings
 * @returns return modified colors
 */
function increaseContrast({c1, c2, settings, step = 1}){
  
  // Get color with min/max lightness
  const colors = [c1, c2]
  let gamut = [true, true]
  const ls = colors.map(c => c.getLightness())

  // Get index of most contrasted color and last contrasted color
  let indMost = settings.darkMode ? ls.indexOf( Math.max( ...ls ) ) :  ls.indexOf( Math.min( ...ls ) );
  let indLast = Number(!indMost);

  // Check initial difference between colors
  let delta = c1.getDifference(c2)
  // console.log('Inital difference:', delta)

  // Discriminate colors until color difference is above the target value
  while (delta <= settings.deltas.elementWithAccent) {

    // Adjust most contrasted until is inside sRGB space
    if (gamut[indMost]) {
      let lMost = colors[indMost].getLightness();
      
      // Adjust lightness bg
      lMost += settings.darkMode ? step : -step;
      
      if (lMost < 0 || lMost > 100){
        gamut[indMost] = false
      } else {
        colors[indMost].setLightness(lMost)
        colors[indMost] = chromaClamping(colors[indMost])
      }
    }
    /**
    * If most contrasted color is outside sRGB color gamut and other color is inside sRGB color gamut 
    * change the lightness component of the color
    */
    if ( !gamut[indMost] && gamut[indLast]  ) {
      let lLast = colors[indLast].getLightness();
      // console.log(`Changing color to improve contrast. Lightness: ${lLast}`);
      
      // Adjust lightness color 
      lLast += settings.darkMode ? -step : +step;

      if (lLast < 0 || lLast > 100){
        gamut[lLast] = false
      } else {
        colors[indLast].setLightness(lLast)
        colors[indLast] = chromaClamping(colors[indLast])
      }
    }

    delta = colors[0].getDifference(colors[1])
    // console.log('Resulted difference:', delta)
  }

  return [
    colors[0],
    colors[1]
  ]

}


/**
 * Return enhance colors with better contrast with a background
 * @param {object} param0 settings
 * @returns d3 color object
 */
function increaseBackgroundContrast({color, bg, settings, target, method, step = 1}){

  let delta = getDelta(color, bg, method);
  let bgGamut = true;

  // Discriminate colors until color difference is above the target value
  let i = 1;
  while (delta <= target) {
    // Show number of iterations/steps to improve contrast
    // console.log(`Step ${i++}`)

    // Adjust bg until is inside sRGB space
    if (bgGamut) {
      let l2 = bg.getLightness();
      // console.log(`Changing background to improve contrast. Lightness: ${l2}`);
      // console.info(bg)
      
      // Adjust lightness bg
      l2 += l2 >= color.getLightness() ? step : -step;
      
      if (l2 < 0 || l2 > 100){
        bgGamut = false
      }else {
        bg.setLightness(l2)
        bg = chromaClamping(bg)
      }
    } else {
      // If background color has riched the limit change the color
      let l1 = color.getLightness();
      // console.log(`Changing color to improve contrast. Lightness: ${l1}`);
      // console.info(color)
      // Adjust lightness color 
      l1 += l1 > bg.getLightness() ? step : -step;
      color.setLightness(l1)
      color = chromaClamping(color) 
    }
    delta = getDelta(color, bg, method);
    // console.log('Resulted contrast:', delta)
    // if (i > 5) break
  }
  return [color, bg]


}


export { 
  selectColors as default, 
  getColor,
  getDelta,
  getMonochromaticColors,
  increaseContrast,
  increaseBackgroundContrast,
  getBestCombination,
  getSecondaryColor,
  chromaClamping
}