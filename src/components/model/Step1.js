import React, {useState, useLayoutEffect} from 'react';
import { useLocation } from "@reach/router"

import { useDispatch, useSelector, useStore } from 'react-redux';

import { selectSettings } from './../../app/reducers/settingsReducer';
import { setSideMenu} from './../../app/reducers/appReducer';
import { setColors} from '../../app/reducers/modelReducer';


import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import SettingsOutlinedIcon from '@material-ui/icons/SettingsOutlined';

import {getColorsByUsage} from '../../model';

import Patch from '.././Patch';
import SideMenu from './../SideMenu';



const PatchWithDescription = ({title, desc, hex, lch, children }) => {
  
  return (
    <div className="step1__palette">
     <Patch hexValue={hex} lch={lch} />
      <div>
        <Typography variant="h6">{title}</Typography>
        <Typography variant="body2" gutterBottom>{children}</Typography>
      </div>
    </div>
  )
  
}  

export default function Step1() {

  const settings = useSelector(selectSettings);
  const store = useStore();
  const dispatch = useDispatch();

  const data = store.getState().data;
  
  const {lightShade, mainColor, accentColor, darkShade} = getColorsByUsage(data.currentData, settings[1]);
  
  // useLayoutEffect(() => {
  //   dispatch(setColors({
  //     step: 1,
  //     colors: {
  //       lightShade: lightShade,
  //       mainColor: mainColor,
  //       accentColor: accentColor,
  //       darkShade: darkShade,
  //     }
  //   })) 
  // })
  dispatch(setColors({
    step: 1,
    colors: {
      lightShade: lightShade,
      mainColor: mainColor,
      accentColor: accentColor,
      darkShade: darkShade,
    }
  })) 

  

  
  
  
  //console.log(colorInd)

  const handleSettings = () => {
    dispatch(setSideMenu({
      open:true,
      content: 'step1Settings'
    }))
  }

  return (
    <div className="step1 step">
      {
      <React.Fragment>
        <Button
          variant="text"
          color="primary"
          size="medium"
          className="step__settings-btn"
          startIcon={<SettingsOutlinedIcon />}
          onClick={handleSettings}
        >
          Settings
        </Button>
        <div className="step1__palettes">
          <PatchWithDescription hex={lightShade.hex} lch={lightShade.lch} title={'Light shades'}>background (dark-on-light design), text color (light-on-dark design)</PatchWithDescription>
          <PatchWithDescription hex={mainColor.hex} lch={mainColor.lch} title={'Main Color'}>the most prominent color on the image</PatchWithDescription>
          <PatchWithDescription hex={accentColor.hex} lch={accentColor.lch} title={'Accent color'}>to bring attention to design elements by contrasting with the main color</PatchWithDescription>
          <PatchWithDescription hex={darkShade.hex} lch={darkShade.lch} title={'Dark shades'}>background (light-on-dark design), text color (dark-on-light design)</PatchWithDescription>
        </div>
        <SideMenu/>
      </React.Fragment>
      }
    </div>
  );
}
