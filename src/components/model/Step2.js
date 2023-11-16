import React, {useState, useLayoutEffect} from 'react';
import { useLocation } from "@reach/router"

import { useDispatch, useSelector, useStore } from 'react-redux';

import { selectSettings, selectSetting } from './../../app/reducers/settingsReducer';
import { setSideMenu} from './../../app/reducers/appReducer';
import { setColors} from '../../app/reducers/modelReducer';


import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

import {
  adjustColorsForContrast,
  getColorsByUsage,
  adjustLightnessByThreshold,
  neutralizeColor
} from '../../model';

import {Step2Settings} from './Settings';

import {color, lch} from "d3-color";



export default function Step2() {

  const settings = useSelector(selectSettings);
  const store = useStore();
  const dispatch = useDispatch();

  const data = store.getState().data;
  
  // Get optimal usage of colors (step1)
  let {lightShade, mainColor, accentColor, darkShade} = getColorsByUsage(data.currentData, settings[1]);

  const contrastLevel = useSelector(selectSetting('contrastLevel', 2));
  const lightThreshold = useSelector(selectSetting('lightThreshold', 2));
  const darkThreshold = useSelector(selectSetting('darkThreshold', 2));
  const lightNeutralizeLevel = useSelector(selectSetting('lightNeutralizeLevel', 2));
  const darkNeutralizeLevel = useSelector(selectSetting('darkNeutralizeLevel', 2));


  [lightShade, darkShade] = adjustColorsForContrast(lightShade.hex, darkShade.hex, {targetContrastLevel: contrastLevel});
  [lightShade, darkShade] = adjustLightnessByThreshold(lightShade, darkShade, lightThreshold, darkThreshold)
  lightShade = neutralizeColor(lightShade, lightNeutralizeLevel);
  darkShade = neutralizeColor(darkShade, darkNeutralizeLevel);

  useLayoutEffect(() => {
    dispatch(setColors({
      step: 2,
      colors: {
        lightShade: lightShade,
        mainColor: mainColor,
        accentColor: accentColor,
        darkShade: darkShade,
      }
    })) 
  })

  

  return (
    <div className="step2 step">
      {
      <React.Fragment>
        <Step2Settings />
      </React.Fragment>
      }
    </div>
  );
}
