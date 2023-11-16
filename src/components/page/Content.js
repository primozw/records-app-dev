import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import PropTypes from 'prop-types';

import {
  selectRecord,
  setTab
} from './../../app/reducers/appReducer';
import {
  selectColors,
  selectDarkMode
} from './../../app/reducers/modelReducer';

import 'react-lazy-load-image-component/src/effects/opacity.css';
import { makeStyles, withStyles, useTheme  } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';

import Buy from './Buy';
import Tracks from './Tracks';
import Details from './Details';
import Ratings from './Ratings';
import Modal from './Modal';
import LibraryBtn from '../elements/LibraryBtn';


function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
     role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && children}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

const StyledTabs = withStyles((theme) => ({
  indicator: {
    display: 'flex',
    justifyContent: 'center',
    backgroundColor: 'transparent',
    '& > span': {
      display: 'block',
      height: '0.65rem',
      width: '0.65rem',
      transform: 'translateY(-40%)',
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        transform: 'translateY(-100%)',
      },
      borderRadius: '50%'
    },
  },
}))((props) => <Tabs {...props} variant="scrollable" scrollButtons="auto" TabIndicatorProps={{ children: <span /> }} />);

const StyledTab = withStyles((theme) => ({
  root: {
    minWidth: 0,
    fontSize: '1rem',
    marginRight: theme.spacing(0.5),
    opacity: 1,
    transition: 'font-weight .2s ease-in-out, font-size .4s ease-out',
    '&:focus, &.Mui-selected': {
      fontWeight: 700,
    },
  },
}))((props) => <Tab disableRipple {...props} />);

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      width: '50%',
      height: '100vh',
      overflowY: 'scroll',
      background: props => props.colors ? `linear-gradient(${props.colors.bg.primary},${props.colors.bg.secondary})` : 'transparent',
    }
  },
  tabs: {
    backgroundColor: props => props.colors ? props.colors.main.secondary : theme.palette.background.paper,
    color: props => props.colors ? props.colors.main.text : theme.palette.background.paper,
    '& .MuiTabs-scrollable': {
      overflowY: 'hidden'
    },
    '& .MuiTabs-indicator span': {
      backgroundColor: props => props.colors ? props.colors.bg.primary : theme.palette.background.paper,
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        backgroundColor: props => props.colors ? props.colors.main.primary : theme.palette.background.paper,
        width: '100%',
        height: '2px',
        borderRadius: 0
      }
    },
    transition: 'background-color 0.5s ease-in-out',
    paddingLeft: 'calc(5vw - 12px)',
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      //backgroundColor: props => props.colors ? props.colors.bg.secondary : theme.palette.background.paper,
      backgroundColor: 'transparent !important',
      color: props => theme.palette.text.primary,
      paddingLeft: 'calc(10vh - 12px)',
      
    },
  },
  panel: {
    backgroundColor: props => props.colors ? props.colors.bg.primary : theme.palette.background.paper,
    padding: '5vw',
    paddingBottom: '10vw',
    flexGrow: 1,
    '&:not([hidden])':{
      display: 'flex',
      flexDirection: 'column',
    },
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      padding: '5vh 10vh',
      backgroundColor: 'transparent !important'
    }
  },
  tracks: {
    justifyContent: 'flex-start'
  },
  buy: {
    justifyContent: 'space-evenly'
  },
  desktopMenu: {
    //backgroundColor: props => props.colors ? props.colors.bg.secondary : theme.palette.background.paper,
    display: 'flex',
    justifyContent: 'flex-end',
    paddingTop: '2.5vh',
    paddingRight: '5vh',
    '& button': {
      fontWeight: 600,
      color: props => theme.palette.text.primary,
    },
  },
  menu: {
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      // position: 'sticky',
      // top: 0
    }
  }
}));



export default function Content(props) {
  const dispatch = useDispatch();
  const record = useSelector( selectRecord );
  const colors = useSelector(selectColors);
  const darkMode = useSelector(selectDarkMode);

  const theme = useTheme();
  const smDown = useMediaQuery(`${theme.breakpoints.down('sm')}`);
  const mdUp = useMediaQuery(`${theme.breakpoints.up('md')} and (orientation: landscape)`);

  let classes = useStyles({
    colors: colors,
    darkMode: darkMode
  });
  
  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch(setTab(newValue))
  };

  console.log(colors)

  return (
    (record && colors) && (
      <section className={classes.root}>
        <div className={classes.menu}>
          {mdUp && <section className={classes.desktopMenu}>
            <LibraryBtn/>
            <Modal/>
          </section>}
          <StyledTabs className={classes.tabs} value={value} onChange={handleChange}>
            <StyledTab aria-label="buy" label="Buy" {...a11yProps(0)} />
            <StyledTab aria-label="tracks" label="Tracks" {...a11yProps(1)} />
            {smDown && <StyledTab aria-label="details" label="Details" {...a11yProps(2)} />}
            {/* <StyledTab aria-label="ratings" label="Ratings" {...a11yProps(3)} /> */}
          </StyledTabs>
        </div>

        <TabPanel className={`${classes.panel} ${classes.buy}`} value={value} index={0}>
         <Buy record={record} colors={colors} />
        </TabPanel>
        <TabPanel className={`${classes.panel} ${classes.tracks}`} value={value} index={1}>
          <Tracks record={record} colors={colors} />
        </TabPanel>
        {smDown && <TabPanel className={classes.panel} value={value} index={2}>
          <Details record={record} colors={colors} />
        </TabPanel>}
        {/* <TabPanel className={classes.panel} value={value} index={smDown ? 3 : 2}>
          <Ratings record={record} colors={colors} />
        </TabPanel> */}
      </section>
    )
    
  );
}