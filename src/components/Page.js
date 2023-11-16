import React, {useEffect} from 'react';
import { useLocation } from "@reach/router"
import { useDispatch } from 'react-redux';
import { setData } from './../app/reducers/appReducer';
import { makeStyles } from '@material-ui/core/styles';

import Header from './page/Header';
import Content from './page/Content'

const useStyles = makeStyles((theme) => ({
  page: {
   minHeight: '100vh',
   display: 'flex',
   flexDirection: 'column',
   '&>section': {
     flexGrow: 0
   },
   '&>section:nth-child(2)': {
      flexGrow: 3,
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        flexGrow: 1
      }
    },
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      flexDirection: 'row'
    }
  }
}));

export default function Page({location}) {
  const classes = useStyles();
  const dispatch = useDispatch();

  useEffect(() => {
    // Set data based on the current page slug
    dispatch(setData({
      location: location.pathname.substr(1)
    }))
  }, [location])

  

  return (
    <main className={classes.page}>
      <Header location={location} />
      <Content />
    </main>
  );
}

