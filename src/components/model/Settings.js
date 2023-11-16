import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import {
  setSettings,
  selectSetting,
  resetSettings
} from '../../app/reducers/settingsReducer';

import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Input from '@material-ui/core/Input';
import Slider from '@material-ui/core/Slider';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

const InputField = ({modelStep, prop, label, id, min = 0, max=1, step=0.1}) => {
  const dispatch = useDispatch();
  const currentValue = useSelector(selectSetting(prop, modelStep));
  const [error, showError] = useState(false)
  
  const handleChange = (prop) => {
    
    return (event) => {
      const value = parseFloat(event.target.value);
      if ((value >= min) && (value <= max)) {          
        dispatch(setSettings({
          step: modelStep,
          prop: prop,
          value: value 
        }));
        showError(false);
      } else {
        showError(true);
      }
      
    }
  }
  return (
    <TextField
      inputProps={{
        min: min,
        max: max,
        step:step
      }}
      size="small"
      label={label}
      type="number"
      InputLabelProps={{
        shrink: true,
      }}
      variant="standard"
      value={currentValue}
      onChange={handleChange(prop)}
      helperText={error ? `Value has to be between ${min} and ${max}.` : false }
      error={error}
      className="settings__field"
    />
  )
}


const DiscreteSlider = ({modelStep, prop, min = 1, max = 100, step = 100}) => {

  const dispatch = useDispatch();

  const value = useSelector(selectSetting(prop, modelStep));

  const handleChange = (event, newValue) => {
    // console.log(newValue)
    dispatch(setSettings({
      step: modelStep,
      prop: prop,
      value: newValue 
    }));  
  }

  const marks = [
    {
      value: min,
      label: `${min}`
    },
    {
      value: max,
      label: `${max}`
    }
  ]

  return (
    <React.Fragment>
      <Slider
        value={value}
        onChange={handleChange}
        aria-labelledby="input-slider"
        valueLabelDisplay="auto"
        step={step}
        marks={marks}
        max={max}
        min={min}
      />
    </React.Fragment>
    
  )
}





function Step1Settings() {
  const dispatch = useDispatch();

  return (
    <div className="settings">
      <div className="settings__row">
        <Typography variant="subtitle1" gutterBottom>Light Shade Factors</Typography>
        <div className="settings__fields">
          <InputField modelStep={1} prop="lightShadeLightness" label="Lightness" />
          <InputField modelStep={1} prop="lightShadeChroma" label="Chroma"/>
        </div>
      </div>
      <div className="settings__row">
        <Typography variant="subtitle1" gutterBottom>Main Color Factors</Typography>
        <div className="settings__fields">
          <InputField modelStep={1} prop="mainColorCov" label="Color Coverage" />
          <InputField modelStep={1} prop="mainColorChroma" label="Chroma"/>
        </div>
      </div>
      <div className="settings__row">
        <Typography variant="subtitle1" gutterBottom>Accent Color Factors</Typography>
        <div className="settings__fields">
          <InputField modelStep={1} prop="accentColorChroma" label="Chroma" />
          <InputField modelStep={1} prop="accentColorDist" label="Color Difference"/>
        </div>
      </div>
      <div className="settings__row">
        <Typography variant="subtitle1" gutterBottom>Dark Shade</Typography>
        <div className="settings__fields">
          <InputField modelStep={1} prop="darkShadeLightness" label="Neg. Lightness" />
          <InputField modelStep={1} prop="darkShadeChroma" label="Neg. Chroma"/>
        </div>
      </div>
      <div className="settings__row">
      
      <Button
          variant="outlined"
          color="inherit"
          size="medium"
          className="settings__reset-btn"
          onClick={()=> dispatch(resetSettings(1))}
        >
          Reset Settings
        </Button>
      </div>
    </div>
  )
}

function Step2Settings() {
  const dispatch = useDispatch();

  const lightNeutralizeLevel = useSelector(selectSetting('lightNeutralizeLevel', 2));
  const darkNeutralizeLevel = useSelector(selectSetting('darkNeutralizeLevel', 2));


  const handleSelect = (prop) => (event) => {
    const level = event.target.value;
    dispatch(setSettings({
      step: 2,
      prop: prop,
      value: level 
    }));  
  }

  return (
    <div className="settings">
      <div className="settings__row">
        <Typography id="input-slider" gutterBottom>Contrast Level</Typography>
        <DiscreteSlider modelStep={2} prop="contrastLevel" min={1} max={20} step={1} label="Contrast"/>
      </div>
      <div className="settings__row">
        <Typography variant="subtitle1" gutterBottom>Lightness Thresholds</Typography>
        <div className="settings__fields">
          <InputField modelStep={2} prop="darkThreshold" label="Dark Shade" min={0} max={100} step={1}/>
          <InputField modelStep={2} prop="lightThreshold" label="Light Shade" min={0} max={100} step={1}/>
        </div>
      </div>
      <div className="settings__row">
        <div className="settings__fields">
          <FormControl className="settings__field">
            <InputLabel htmlFor="age-native-simple">Neutralize Light Color</InputLabel>
            <Select
              native
              value={lightNeutralizeLevel}
              onChange={handleSelect('lightNeutralizeLevel')}
            >
              <option value="none">None</option>
              <option value={'low'}>Low</option>
              <option value={'medium'}>Medium</option>
              <option value={'high'}>High</option>
            </Select>
          </FormControl>
          <FormControl className="settings__field">
            <InputLabel htmlFor="age-native-simple">Neutralize Dark Color</InputLabel>
            <Select
              native
              value={darkNeutralizeLevel}
              onChange={handleSelect('darkNeutralizeLevel')}
            >
              <option value="none">None</option>
              <option value={'low'}>Low</option>
              <option value={'medium'}>Medium</option>
              <option value={'high'}>High</option>
            </Select>
          </FormControl>
        </div>
      </div>



      <div className="settings__row">
      <Button
          variant="outlined"
          color="inherit"
          size="medium"
          className="settings__reset-btn"
          onClick={()=> dispatch(resetSettings(2))}
        >
          Reset Settings
        </Button>
      </div>
    </div>
      
  )
}


export { Step1Settings, Step2Settings }
