import { 
  lch as _lch, 
  lab as _lab
} from "d3-color";
import {
  jch as _jch, 
  jab as _jab
} from 'd3-cam02';

import {
  colorDifference,
  cartesian2polar,
  polar2cartesian
} from './utilities'

/**
 * Extend modules in order to get common API
 */

 // JCH color space

 // GET METHODS
_jch.prototype.getLightness = function() {
  return this.J
}
_jch.prototype.getChroma = function() {
  return isNaN(this.C) ? 0 : this.C
}
_jch.prototype.getHue = function() {
  return this.h
}
_jch.prototype.getStrength = function() {
  return isNaN((this.C / 100) * (this.J / 100)) ? 0 : (this.C / 100) * (this.J / 100)
}
_jch.prototype.getContrast = function(contextLightness) {
  return Math.abs(this.J - contextLightness)
}
_jch.prototype.getAnalogy = function(contextLightness) {
  return contextLightness === 100 ? this.J : 100 - this.J
}
_jch.prototype.getDifference = function(c2){
  return colorDifference(this, c2, 'JCH')
}


// SET METHODS
_jch.prototype.setLightness = function(lightness){

  // let _this = this.copy();
  // _this.J = lightness;
  // if (_this.displayable()) {
  //   this.J = lightness
  // }
  // return this

  // If lightness is already as define return the color
  if (this.J === lightness) return this
  this.J = lightness;

  // const _this = this.copy();
  // let insideGamut = true;

  // // If current lightness is lower than wanted try to increase it
  // if (this.J < lightness) {
  //   while (insideGamut && _this.J < lightness ){
  //     _this.J += 1;
  //     if (!_this.displayable()) {
  //       _this.J -= 1;
  //       insideGamut = false
  //     }
  //   }
  // } else {
  //   while (insideGamut && _this.J > lightness ){
  //     _this.J -= 1;
  //     if (!_this.displayable()) {
  //       _this.J += 1;
  //       insideGamut = false
  //     }
  //   }
  // }
  // this.J = _this.J
  return this
}
_jch.prototype.setHue = function(hue){
  let _this = this.copy();
  _this.h = hue;
  return _jch(_this.formatHex())
}
















 // JAB color space
 _jab.prototype.getLightness = function() {
  return this.J
}
_jab.prototype.getChroma = function() {
  const [C, h] = cartesian2polar(this.a, this.b)
  return isNaN(C) ? 0 : C
}
_jab.prototype.getHue = function() {
  const [C, h] = cartesian2polar(this.a, this.b)
  return h
}
_jab.prototype.getStrength = function() {
  return isNaN((this.getChroma() / 100) * (this.J / 100)) ? 0 : (this.getChroma() / 100) * (this.J / 100)
}
_jab.prototype.getContrast = function(contextLightness) {
  return Math.abs(this.J - contextLightness)
}
_jab.prototype.getDifference = function(c2){
  return colorDifference(this, c2, 'JAB')
}


 // LAB color space
 _lab.prototype.getLightness = function() {
  return this.l
}
_lab.prototype.getChroma = function() {
  const [C, h] = cartesian2polar(this.a, this.b)
  return isNaN(C) ? 0 : C
}
_lab.prototype.getHue = function() {
  const [C, h] = cartesian2polar(this.a, this.b)
  return h
}
_lab.prototype.getStrength = function() {
  return isNaN((this.getChroma() / 100) * (this.l / 100)) ? 0 : (this.getChroma() / 100) * (this.l / 100)
}
_lab.prototype.getContrast = function(contextLightness) {
  return Math.abs(this.l - contextLightness)
}
_lab.prototype.getDifference = function(c2){
  return colorDifference(this, c2, 'LAB')
}







export function jch(){
  return _jch.apply(this, arguments);
}
export function jab(){
  return _jab.apply(this, arguments);
}
export function lab(){
  return _lab.apply(this, arguments);
}




// export function Jab(J, a, b, opacity) {
//   this.J = J;
//   this.a = a;
//   this.b = b;
//   this.opacity = opacity;
// }


// var jabPrototype = Jab.prototype = jab.prototype = Object.create(color.prototype);
// jabPrototype.constructor = JCh;

// jabPrototype.brighter = function(k) {
//   return new Jab(this.J + Kn * (k === null ? 1 : k), this.a, this.b,
//       this.opacity);
// };


