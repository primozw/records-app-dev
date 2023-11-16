import React, {useEffect, useState} from 'react';
import { useLocation } from "@reach/router"
import { useSelector, useStore } from 'react-redux';
import { selectColors, selectStep } from './../../app/reducers/modelReducer';
import { selectDarkMode } from './../../app/reducers/appReducer';
import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import AudiotrackIcon from '@material-ui/icons/Audiotrack';
import GraphicEqIcon from '@material-ui/icons/GraphicEq';
import BluetoothAudioIcon from '@material-ui/icons/BluetoothAudio';
import { makeStyles } from '@material-ui/core/styles';
import { getBestCombination } from './../../model/'



export default function DemoTextWithIcons() {

  // const store = useStore();
  // const colors = store.getState().colors.current;
  //const [colors, setColors] = useState(useSelector(selectColors('current')))
  
  const step = useSelector(selectStep)
  const colors = useSelector(selectColors);
  const darkMode = useSelector(selectDarkMode);

  //console.log(colors)

  const bgColor = colors ? (darkMode ? colors.darkShade : colors.lightShade) : '';
  const textColor = colors ? (darkMode ? colors.lightShade : colors.darkShade) : '';

  const iconBgColor = colors ? colors.mainColor : '';
  const iconTextColor = colors ? ( getBestCombination(iconBgColor, [textColor, bgColor])) : '';

  // console.log(iconTextColor)

  const useStyles = makeStyles({
    root: {
      backgroundColor: bgColor.hex,
      color: textColor.hex,
      textAlign: 'center',
      padding: '5rem 0',
      margin:'5rem 0',
    },
    iconCircle: {
      backgroundColor: iconBgColor.hex,
      display: 'flex',
      width: '3rem',
      height: '3rem',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '50%',
      margin: '1rem auto'
    },
    icon: {
      fill: iconTextColor.hex,
    }
  });

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Container maxWidth={'lg'}>
        <Grid container spacing={5} >
          <Grid item xs={12} md={4}>
            <div className={classes.iconCircle}>
              <AudiotrackIcon className={classes.icon} fontSize="large"/>
            </div>

            <Typography variant="body1">Sed posuere consectetur est at lobor tis. Maecenas sed diam eget risus varius blandit sit amet non magna. Aenean lacinia bibendum nulla sed consectetur. Vestibulum id ligula porta felis euismod semper. Nullam id dolor id nibh ultricies vehicula ut id elit.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.iconCircle}>
              <GraphicEqIcon className={classes.icon} fontSize="large"/>
            </div>
            <Typography variant="body1">Nulla vitae elit libero, a pharetra augue. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Nulla vitae elit libero, a pharetra augue. Cras justo odio, dapibus ac facilisis in, egestas eget quam. Donec sed odio dui. Donec id elit non mi porta gravida at eget metus. Etiam porta sem malesuada magna mollis euismod.</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <div className={classes.iconCircle}>
              <BluetoothAudioIcon className={classes.icon} fontSize="large"/>
            </div>
            <Typography variant="body1">Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Vestibulum id ligula porta felis euismod semper. Donec ullamcorper nulla non metus auctor fringilla. Etiam porta sem malesuada magna mollis euismod. Donec sed odio dui. Donec sed odio dui. Integer posuere erat a ante venenatis dapibus posuere velit aliquet.</Typography>
          </Grid>
        </Grid>
      </Container>
    </div>
  );
}

