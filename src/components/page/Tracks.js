import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import {
  TransitionGroup,
  CSSTransition
} from 'react-transition-group';

import Timer from '@material-ui/icons/Timer';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';


const useStyles = makeStyles((theme) => ({
  nav: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginBottom: '1rem',
    '& p': {
      margin:0
    },
    '& .MuiTabs-indicator': {
      backgroundColor: props => props.colors.accent.primary
    },
    '& .Mui-selected': {
      color: props => props.colors.accent.text,
    }
  },
  header: {
   display: 'flex',
   paddingBottom: '0.25rem',
   borderBottom: `solid 2px ${theme.palette.text.primary}`,
   marginBottom: '1rem',
   '& p': {
     fontWeight: 600,
     textTransform: 'uppercase'
   }
  },
  headerNumber: {
    width: '2rem',
    margin: '0 1rem 0 0',
  },
  headerTitle: {
    flexGrow: 1,
    margin: 0,
  },
  track:{
    display: 'flex',
    alignItems: 'center',
    marginBottom: '1rem',
    '& p': {
      margin: 0
    }
  },
  number: {
    width: '2rem',
    margin: '0 1rem 0 0 !important',
    '& span': {
      // backgroundColor: props => props.colors.accent.primary,
      // color: props => props.colors.accent.text,
      display: 'block',
      width: '1.5rem',
      height: '1.5rem',
      textAlign: 'center',
      lineHeight: '1.5rem',
      borderRadius: '50%',
      fontWeight: 600,
      fontSize: '0.9rem',
    }
  },
  title: {
    fontWeight: 600,
    flexGrow: 1,
    fontSize: '1.1rem',
    '& span': {
      display: 'block'
    }
  },
  subtitle: {
    fontWeight: 300,
    fontSize: '0.9em',
    lineHeight: 1
  }
}));

function a11yProps(index) {
  return {
    id: `scrollable-prevent-tab-${index}`,
    'aria-controls': `scrollable-prevent-tabpanel-${index}`,
  };
}

const NavigationGroup = withStyles((theme) => ({
  indicator: {
    top:0,
    height: '100%',
    width: '1.85rem',
    height: '1.85rem',
    borderRadius: '50%',
  },
  root: {
    minHeight:' 1.85rem'
  }
}))((props) => <Tabs {...props} />);


const NavigationItem = withStyles((theme) => ({
  root: {
    zIndex: 10,
    minWidth: '1.85rem',
    minHeight: '1.85rem',
    textAlign: 'center',
    lineHeight: '1.85rem',
    borderRadius: '50%',
    fontWeight: 600,
    fontSize: '1rem',
    marginLeft: '0.5rem',
    padding: 0,
    opacity: 1,
    transition: 'font-weight .2s ease-in-out',
    '&:focus, &.Mui-selected': {
      fontWeight: 700,
    },
  },
}))((props) => <Tab disableRipple {...props} />);


const Navigation = ({tracks, handleTrack, className, active}) => {
  return (Object.keys(tracks).length > 1 && (
    <div className={className}>
      <p>Sides:</p>
      <NavigationGroup value={active} onChange={handleTrack}>
        {Object.keys(tracks).map((side, i) => (
          <NavigationItem value={side} key={i} className={(side === active) ? 'active' : ''} aria-label="Regular Price" label={side} {...a11yProps(0)} />
        ))}
      </NavigationGroup>
    </div>
    )
  )
}

const Panel = ({tracks, classes}) => {
  return (
    <article key={'panel'}>
      <header className={classes.header}>
        <p className={classes.headerNumber}>#</p>
        <p className={classes.headerTitle}>Title</p>
        <Timer className={classes.headerDuration} fontSize="small"/>
      </header>
      <TransitionGroup className={classes.content}>
        {tracks.map((track, i) => (
          <CSSTransition timeout={200} key={track.title} className={classes.track} classNames={'track'}>
            <div>
              <p className={classes.number}><span>{i + 1}</span></p>
              <p className={classes.title}>
                <span>{track.title}</span>
                <span className={classes.subtitle}>{track.subtitle}</span>
              </p>
              <p className={classes.duration}>{track.duration}</p>
            </div>
          </CSSTransition>
        ))}
      </TransitionGroup>
    </article>
    
  )
}



export default function Tracks({record, colors}) {
  const [track, setTrack] = React.useState('A');
  let classes = useStyles({colors: colors});

  const handleChange = (e, newTrack) => {
    setTrack(newTrack);
  };

  const selectTracks = (track) => record.tracks[track]
  


  return (
    (record && colors) && (
      <section className={classes.tracks}>
        <Navigation className={classes.nav} tracks={record.tracks} handleTrack={handleChange} active={track}/>
        <Panel classes={classes} tracks={selectTracks(track)} />
      </section>
    )
    
  );
}