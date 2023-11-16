import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import RecordsList from './elements/RecordsList';

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';

import Logo from './elements/Logo';

import {
  selectFilter,
  setFilter,
  setTab
} from './../app/reducers/appReducer';

const useStyles = makeStyles(theme => ({
  header: {
    padding: '5vw',
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      height: '100vh',
      width: '25%',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '2.5vw',
      position: 'fixed',
      top: 0,
      left: 0,
    },
    [theme.breakpoints.up("xl")]: {
      width: '20%',
    },
  },
  nav: {
    marginTop: '3vw',
    
    '& ul': {
      margin: 0,
      listStyle: 'none',
      padding: 0,
    },
    '& li': {
      margin: 0,
      padding: 0,
    },
    '& a': {
      display: 'block',
      fontSize: '1.9rem',
      lineHeight: '2.2rem',
      fontWeight: '300',
      transition: 'font-weight .2s ease-in-out, font-size .4s ease-out, opacity .3s ease-out',
      '&:hover, &.active': {
        fontWeight: '600'
      },
      // [theme.breakpoints.down("xs")]: {
      //   fontSize: prop => ( prop.smallNav) ? '0' : '1.9rem',
      //   lineHeight: prop => ( prop.smallNav) ? '0' : '2.5rem',
      //   opacity: prop => ( prop.smallNav) ? 0 : 1,
      // },
    }
  }
}));



const MenuItem = ({tag, children}) => {
  const filter = useSelector(selectFilter);
  const dispatch = useDispatch();

  return (
    <li>
      <a className={((filter === tag) && 'active').toString()} 
          onClick={(e) => {
            e.preventDefault();
            dispatch(setFilter(tag))
          }} 
          href="">
          {children}
      </a>
    </li>
  )
}


const Menu = () => {
  const styles = {};
  const theme = useTheme();
  const [pos, setPos] = useState(0);

  styles.smallNav = (pos >= 30) ? true : false;
  const classes = useStyles(styles);
  
  // Event Handlers
  const handleScroll = (e) => {
    setPos( window.scrollY )
  }
  const handleLinks = (e) => {
    e.preventDefault();
  }



  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
  
    // returned function will be called on component unmount 
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  

  return (
    <nav className={classes.nav}>
      <ul>
        <MenuItem tag="all">Your Library</MenuItem>
        <MenuItem tag="newest">Newest</MenuItem>
        <MenuItem tag="recent">Recent</MenuItem>
        <MenuItem tag="top">Top Rated</MenuItem>
      </ul>
    </nav>
  )
}


const Home = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();

  // Set default tab to 0
  useEffect(() => dispatch(setTab(0)));
  
  return (
    <section className={classes.home}>
      <header className={classes.header}>
        <Logo className={classes.logo} location={props.location} />
        <Menu />
      </header>
      <RecordsList />
    </section>
  ) 
};
 
export default Home;