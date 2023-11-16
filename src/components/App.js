import React, {useState} from 'react';
import { Router, Location } from "@reach/router"
import { useSelector } from 'react-redux';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';


// Styles
import './../styles/App.scss';

// Material-UI
import { createTheme, ThemeProvider } from "@material-ui/core/styles";
import {grey} from "@material-ui/core/colors";
import CssBaseline from '@material-ui/core/CssBaseline';


// Components
import Page from './Page';
import Home from './Home';

// Selectors
import { getRecordsData } from "./../app/reducers/appReducer";
import { selectDarkMode } from "./../app/reducers/modelReducer";


// import o9n from "o9n";
// o9n.orientation
//   .lock("portrait")
//   .then(() => ( console.log('it works')))
//   .catch(() => ( console.log('doesnt work'))) ;

export default function App() {

  // Get slugs for pages
  const paths = getRecordsData().map((record) => record.slug);
  // Get dark mode
  const darkState = useSelector(selectDarkMode);


  const paletteType = darkState ? "dark" : "light";

  const mainPrimaryColor = darkState ? grey[50] : grey[900];
  const mainSecondaryColor = darkState ? grey[400] : grey[400];


  const theme = createTheme({
    spacing: factor => `${1 * factor}rem`, // use theme.spacing(1) = 1rem
    
    typography: {
      fontSize: 16,
      fontFamily: [
        '"Source Sans Pro"',
        'sans-serif',
      ].join(','),
      'h1': {
        fontSize: '1.8rem',
        fontWeight: '900',
      },
      'h2': {
        fontSize: '1.35rem',
        fontWeight: '300'
      },
      'body1': {
        fontSize: '1rem'
      }
    },
    shape: {
      borderRadius: 0
    },

    palette: {
      type: paletteType,
      primary: {
        main: mainPrimaryColor
      },
      secondary: {
        main: mainSecondaryColor
      },
      // background: {
      //   default: '#303030',
      // },
    },

    breakpoints: {
      values: {
        xs: 530,
        sm: 760,
        md: 960,
        lg: 1280,
        xl: 1920,
      },
    },

  });

  console.log(theme);

  return (   
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <div>
        <Location>
          {({ location }) => (
            <div>
              <TransitionGroup>
                <CSSTransition
                  key={location.key}
                  classNames="page"
                  timeout={500}
                >
                  <Router location={location}>
                    <Home path="/" location={location} />
                    {paths.map(path => <Page location={location} key={path} path={path}  />)}
                  </Router>
                </CSSTransition>
              </TransitionGroup>
            </div>
          )}
        </Location>
      </div>
      
    </ThemeProvider>    
  );
}
