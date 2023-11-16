import {differenceCiede2000} from 'd3-color-difference';
import {jch, jab, lab} from './color'


/**
 * 
 * @param {float} x value
 * @param {float} xmin min value of the set
 * @param {float} xmax max value of the set
 */
export const minMaxNorm = (x, xmin, xmax) => {
  if ((xmax - xmin) === 0) {
    return 0
  } else {
    return (x - xmin) / (xmax - xmin)
  }
}

export const deg2rad = deg => deg / (180/Math.PI);

export const rad2deg = rad => rad * (180/Math.PI);

export const mod = (a, n) => a - Math.floor(a/n) * n;

/**
 * 
 * @param {number} C Chroma value - r distance
 * @param {NUMBER} h hue in degrees
 * return a and b (x, y)
 */
export const polar2cartesian = (C, h) => [C * Math.cos(deg2rad(h)), C * Math.sin(deg2rad(h))];

/**
 * 
 * @param {number} a x value
 * @param {number} b y value
 * return C(r) and hue in degrees
 */
export const cartesian2polar = (a, b) => [
  Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2)),
  (b >= 0) ? rad2deg(Math.atan2(b, a)) : rad2deg(Math.atan2(b, a)) + 360
];


export const isLight = l =>  Math.round(l / 100) >= 1;


export const getLightnessName = (space) => {
  // Get lightness component name based on color space: J or l
  let l;
  switch (space) {
    case 'JAB':
    case 'JCH':
      l = 'J'
      break;
    case 'LAB':
      l = 'l'
      break;
    default:
      throw `${space} color space is not supported. Define a valid color space.`
  }
  return l
}

export const getCartesianColor = (color, space) => {
  switch (space) {
    case 'JAB':
    case 'LAB':
      return [color.a, color.b]
      break
    case 'JCH':
      return polar2cartesian(color.C, color.h)
      break;
    default:
      throw `${space} color space is not supported. Define a valid color space.`
  }
}


export const rgb2ucs = (color, space) => {
  let _c;
  switch (space) {
    case 'JAB':
      _c = jab(color);
      break
    case 'JCH':
      _c = jch(color);
      break;
    case 'LAB':
      _c = lab(color)
      break;
    default:
      throw `${space} color space is not supported. Define a valid color space.`
  }
  return _c
}


  
/**
 * Compute color difference.
 * Supporting three different color spaces
 * @param {object} c1 D3 color object
 * @param {object} c2 D3 color object
 * @param {string} space LAB | JAB | JCH
 */
export const colorDifference = (c1, c2, space) => {
  let diff = false, _c1, _c2;

  // JCH | JAB | LAB
  switch (space) {
    case 'LAB':
      diff = differenceCiede2000(lab(c1), lab(c2))
      break;
    case 'JAB':
      _c1 = jab(c1);
      _c2 = jab(c2);
      diff = Math.sqrt( Math.pow(_c1.J - _c2.J, 2) + Math.pow(_c1.a - _c2.a, 2) + Math.pow(_c1.b - _c2.b, 2) );
      break;
    case 'JCH':
      _c1 = jch(c1);
      _c2 = jch(c2);
      
      // Compute cartesian 
      const [a1, b1] = polar2cartesian(_c1.C, _c1.h);
      const [a2, b2] = polar2cartesian(_c2.C, _c2.h);
      diff = Math.sqrt( Math.pow(a1 - a2, 2) + Math.pow(b1 - b2, 2) + Math.pow(_c1.J - _c2.J, 2) );
      // console.log('color1: ',_c1.J, a1, b1)
      // console.log('color2: ',_c2.J, a2, b2)
      // console.log(diff)
      break;
    default:
      throw `Define color space is not supported: ${space}. Define a valid color space.`;
      break;
  }
  return diff
}



/**
 * Compute difference in lightness.
 * Supporting three different color spaces
 * @param {object} c1 D3 color object
 * @param {object} c2 D3 color object
 * @param {string} space LAB | JAB | JCH
 */
export const lightnessDifference = (c1, c2, space) => {
  let _l1, _l2;
  // JCH | JAB | LAB
  switch (space) {
    case 'LAB':
      _l1 = lab(c1).l;
      _l2 = lab(c2).l;
      break;
    case 'JAB':
      _l1 = jab(c1).J;
      _l2 = jab(c2).J;
      break;
    case 'JCH':
      _l1 = jch(c1).J;
      _l2 = jch(c2).J;
      break;
    default:
      throw `Define color space is not supported: ${space}. Define a valid color space.`;
      break;
  }
  return Math.abs(_l1 - _l2)
}


/**
 * Compute absolute hue difference between h1 and h2. 
 * Input and output values are both in degrees
 * @param {number} h1 Hue between 0 and 360 deg
 * @param {number} h2 Hue between 0 and 360 deg
 */
export const hueDifference = (h1, h2) => {
  let dh = h2 - h1;
  return Math.abs( mod(dh + 180, 360) - 180 )
}