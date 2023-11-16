
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import { useSelector } from 'react-redux';
import { selectColors } from "./../../app/reducers/modelReducer";

const useStyles = makeStyles((theme) => ({
  root: {
    fontWeight: 600,
    boxShadow: 'none',
    backgroundColor: props => props.bgc,
    color: props => props.tc,
    '&:hover, &:active, &:focus': {
      boxShadow: 'none',
      backgroundColor: props => props.bghc,
    }
  }
}));

function Btn(props) {
  const theme = useTheme();
  const colors = useSelector(selectColors);
  
  let bgc, bghc, tc;

  switch (props.type) {
    case 'main':
      bgc = colors.element.primary;
      bghc = colors.element.secondary;
      tc = colors.element.text;
      break;
    case 'accent':
      bgc = colors.accent.primary;
      bghc = colors.accent.secondary;
      tc = colors.accent.text;
      break;
    default:
      bgc = theme.palette.text.primary;
      bghc = theme.palette.text.secondary;
      tc = theme.palette.background.paper;
  }
    
  let classes = useStyles({bgc,bghc,tc});

  return (
    <Button
      className={classes.root}
      variant="contained"
      onClick={(e) => props.onClick && props.onClick(e)}
      size={'large'}
    >
      {props.children}
    </Button>
  );
}

export default Btn;