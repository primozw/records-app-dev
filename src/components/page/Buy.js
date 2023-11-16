import React from 'react';
import { makeStyles, withStyles, useTheme } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Btn from './../elements/Btn';
import Details from './Details';
import useMediaQuery from '@material-ui/core/useMediaQuery';


function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

const Prices = withStyles((theme) => ({
  indicator: {
    top:0,
    height: '100%',
    backgroundColor: 'orange'
  },
}))((props) => <Tabs {...props} />);


const Price = withStyles((theme) => ({
  root: {
    padding: 0,
    opacity: 1,
    transition: 'font-weight .2s ease-in-out, font-size .4s ease-out',
    '&:focus, &.Mui-selected': {
      fontWeight: 700,
    },
  },
}))((props) => <Tab disableRipple {...props} />);


const PriceContent = ({className, value, type}) => (
  <div className={className}>
    <b>{value} EUR</b>
    <i>{type}</i>
  </div>
);

const Shipping = ({classes}) => {
  const [value, setValue] = React.useState('ship');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <FormControl className={classes.shipping} component="fieldset">
      <RadioGroup aria-label="shipping" name="shipping" value={value} onChange={handleChange}>
        <FormControlLabel className={classes.controlLabel} value="ship" control={<Radio size='small' className={classes.radioBtn}/>} label="Ship This Item" />
        <FormControlLabel className={classes.controlLabel} value="pick" control={<Radio size='small' className={classes.radioBtn}/>} label="Buy Online, Pick up in Store" />
      </RadioGroup>
    </FormControl>
  );
}




const useStyles = makeStyles((theme) => ({
  // root: {
  //   height: '100%',
  //   display: 'flex',
  //   flexDirection: 'column',
  //   justifyContent: 'space-between'
  // },
  prices: {
    // backgroundColor: props => props.colors ? props.colors.main.secondary : theme.palette.background.paper,
    // color: props => props.colors ? props.colors.main.text : theme.palette.background.paper,
    '& .MuiTabs-indicator': {
      backgroundColor: props => props.colors.element.primary
    },
    '& .Mui-selected': {
      color: props => props.colors.element.text,
    }
    
  },
  price:{
    padding: '0.5em',
    position: 'relative',
    zIndex: 5,
    fontSize: '1.8rem',
    transition: 'all 0.25s ease-out',

    '& b':{
      fontSize: '1em',
      fontWeight: '900',
      display: 'block',
      lineHeight: 1,
    },
    '& i':{
      fontSize: '0.5em',
      fontWeight: '700',
      display: 'block',
      fontStyle: 'normal',
      lineHeight: 1,
    },
  },
  shipping: {
    margin: '1rem 0'
  },
  radioBtn: {
    padding: '0.3rem',
    color: props => props.colors.element.primary,
    '&.Mui-checked': {
      color: props => props.colors.element.primary
    }
  },
  controlLabel: {
    marginLeft: '-0.3rem'
  },
  buttons: {
    display: 'flex',
    '& button': {
      flexGrow: 1
    },
    '& button:nth-child(1)': {
      marginRight: '1rem'
    }
  },
  desktopDetails: {
    marginBottom: '5vh'
  }
}));



export default function Buy({record, colors}) {
  const [value, setValue] = React.useState(0);
  let classes = useStyles({colors: colors});

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const theme = useTheme();
  const mdUp = useMediaQuery(`${theme.breakpoints.up('md')}`);


  console.log(record)
  
  return (
    (record && colors) && (
      <React.Fragment key={'buy'}>
        {mdUp && <section className={classes.desktopDetails}><Details record={record} colors={colors} /></section>}

        <Prices className={classes.prices} value={value} onChange={handleChange}>
          <Price aria-label="Regular Price" label={
            <PriceContent className={classes.price} value={record.prices.regular} type={'Regular Price'} />
          } {...a11yProps(0)} />
          <Price aria-label="Premium Price" label={
            <PriceContent className={classes.price} value={record.prices.premium} type={'Premium Price'} />
          } {...a11yProps(1)} />
        </Prices>
        {/* <section>{ReactHtmlParser(record.desc)}</section> */}
        <Shipping classes={classes}/>
        <div className={classes.buttons}>
          <Btn type={'main'}>LISTEN ONLINE</Btn>
          <Btn type={'accent'}>ADD TO CART</Btn>
        </div>

      </React.Fragment>
    )
    
  );
}