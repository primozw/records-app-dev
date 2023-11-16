import React, {useEffect, useState} from 'react';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import {defaultParams} from './../../app/reducers/modelReducer';

import {
  selectRecord,
  selectTab
} from './../../app/reducers/appReducer';
import {
  selectColors,
  selectMode,
  setMode,
  selectDarkMode,
  dispatchDarkMode,
  colorModes,
  selectHarmony,
  setHarmony,
  selectAccessibilityLevel,
  setAccessibility,
} from './../../app/reducers/modelReducer';


import { makeStyles } from '@material-ui/core/styles';
import { Typography } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import PaletteIcon from '@material-ui/icons/Palette';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Button from '@material-ui/core/Button';
import Chip from '@material-ui/core/Chip';
import DoneIcon from '@material-ui/icons/Done';
import Switch from '@material-ui/core/Switch';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import AddIcon from '@material-ui/icons/Add';
import Slider from '@material-ui/core/Slider';

const useStyles = makeStyles(theme => ({
  'chip': {
    marginRight: '0.25rem',
    marginBottom: '0.25rem',
    marginTop: '0.25rem',
    '&.MuiChip-deletable': {
      //borderColor: props => props.colors ? props.colors.accent.primary : 'inherit'
    }
  },
  'dialog': {
    '& .MuiBackdrop-root': {
      backgroundColor: 'rgba(0, 0, 0, 0.2)'
    }
  },
  'modeMenu': {
    marginBottom: '1rem',
    marginTop: '1rem'
  },
  'darkModeForm': {
    marginRight: 'auto',
    marginLeft: 0
  },
  'dialogContent': {
    paddingTop:0,
    
  },
  'modalMenuContainer': {
    display: 'flex',
    alignItems: 'center'
  },
  // 'addBtn': {
  //   '& .MuiIconButton-label': {
  //     border: 'solid 1px #000',
  //     padding: '0.1em',
  //     borderRadius: '50%'
  //   }
  // }
  'accessibilityMenu': {
    marginTop: '1rem'
  },
  'slider': {
    maxWidth: 160,
    '& .MuiSlider-markLabel': {
      transform: 'translateX(0)'
    }
  }
}));


const CustomChip = ({active, name, onClick, className}) => {

  const chipProps = {
    className: className,
    variant: active ? 'default' : 'outlined',
    color: "primary", 
    label: name,
    key: name,
    onClick: onClick
  }

  if (active) {
    chipProps.deleteIcon =  <DoneIcon />
    chipProps.onDelete = () => false
  }

  return (
    <Chip {...chipProps}/>
  )
}


const ModeMenu = () => {
  const selectedMode = useSelector(selectMode);
  const darkMode = useSelector(selectDarkMode);
  const dispatch = useDispatch();
  const colors = useSelector(selectColors);
  const classes = useStyles({colors: colors});

  const handleClick = (mode) => {
    dispatch(setMode({
      mode: mode,
      darkMode: darkMode,
    }))
  }

  
  return (
    <div className={classes.modeMenu}>
      <Typography gutterBottom variant="body1">Color Selection:</Typography>
      <div className={classes.modalMenuContainer}>
        {colorModes.map(mode => <CustomChip active={selectedMode === mode.name } name={mode.name} onClick={() => handleClick(mode.name)} className={classes.chip} key={mode.name}/>)}
        {/* <Button
          // variant="contained"
          // color="primary"
          size="small"
          className={classes.button}
          endIcon={<AddIcon />}
        >
          Add
        </Button> */}
        {/* <IconButton variant="outlined" aria-label="delete" className={classes.addBtn}>
            <AddIcon fontSize="small" />
        </IconButton> */}
      </div>
    </div>
  )
}

const HarmonyMenu = () => {
  const selectedHarmony = useSelector(selectHarmony);
  const dispatch = useDispatch();
  const colors = useSelector(selectColors);
  const classes = useStyles({colors: colors});

  const harmonyModels = [
    {
      name: 'None',
      value: false
    },
    {
      name: 'Monochromatic',
      value: 'mono'
    },
    {
      name: 'Analogous',
      value: 'analogous'
    }
  ]

  
  return (
    <div className={classes.harmonyMenu}>
      <Typography gutterBottom variant="body1">Color Harmony:</Typography>
      {harmonyModels.map(model => <CustomChip active={selectedHarmony === model.value } name={model.name} onClick={() => dispatch(setHarmony(model.value))} className={classes.chip} key={model.name}/>)}
    </div>
  )
}

const AccessibilityMenu = ({level, setLevel}) => {
  const classes = useStyles();
  const dispatch = useDispatch()
  const marks = [
    {
      value: 1,
      label: 'OFF',
    },
    {
      value: 2,
      label: 'AA',
    },
    {
      value: 3,
      label: 'AAA',
    },

  ];
  return (
    <div className={classes.accessibilityMenu}>
      <Typography gutterBottom variant="body1">Contrast Enhancement:</Typography>
      <Slider 
        className={classes.slider}
        aria-labelledby="accessibility-level"
        valueLabelDisplay="off"
        step={1}
        marks={marks}
        min={1}
        max={3}
        value={level}
        onChange={(event, value) => {
          setLevel(value)
          dispatch(setAccessibility(value))
        }}
        />
    </div>
  )
}


export default function Modal() {
  const dispatch = useDispatch();
  const classes = useStyles();
  const colorMode = useSelector(selectMode);

  const [open, setOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(useSelector(selectDarkMode))
  const [level, setLevel] = useState(useSelector(selectAccessibilityLevel))

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSwitch = () => {
    dispatch(dispatchDarkMode(!darkMode))
    dispatch(setMode({
      mode: colorMode,
      darkMode: !darkMode,
    }))
    setDarkMode(!darkMode)

  }
  const handleReset = () => {
    dispatch(dispatchDarkMode(defaultParams.darkMode))
    dispatch(setMode({
      mode: defaultParams.mode,
      darkMode: defaultParams.darkMode,
    }))
    dispatch(setHarmony(defaultParams.harmony))
    dispatch(setAccessibility(defaultParams.accessibility))
    setLevel(defaultParams.accessibility);
    setDarkMode(defaultParams.darkMode)
  }

  return (
    <div>
      <IconButton aria-label="delete" onClick={handleClickOpen}>
        <PaletteIcon fontSize="small" />
      </IconButton>

      <Dialog
        open={open}
        onClose={handleClose}
        className={classes.dialog}
        maxWidth="xs"
        fullWidth={true}
      >
        <DialogTitle>Color Settings</DialogTitle>
        <DialogContent className={classes.dialogContent}>
            <FormGroup>
              <FormControlLabel
                control={<Switch checked={darkMode} onChange={handleSwitch} />}
                label="Dark Mode"
                labelPlacement="start"
                className={classes.darkModeForm}
              />
            </FormGroup>
            <ModeMenu />
            <HarmonyMenu />
            <AccessibilityMenu level={level} setLevel={setLevel} />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleReset} color="primary">
            Reset
          </Button>
          <Button onClick={handleClose} color="primary" style={{
            fontWeight: 600,
            borderRadius: '5px',
            border: '1px solid #212121'
          }}  variant="outlined" >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

