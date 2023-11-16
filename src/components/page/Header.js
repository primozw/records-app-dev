import React from 'react';

import { useSelector } from 'react-redux';

import {
  selectRecord,
  selectTab
} from './../../app/reducers/appReducer';
import {
  selectColors,
} from './../../app/reducers/modelReducer';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import LibraryBtn from './../elements/LibraryBtn';
import { Typography } from '@material-ui/core';

import Modal from './Modal';

import Logo from './../elements/Logo';
import Categories from './Categories';

const imgVinyl = require('./../../img/vinyl.png').default;

const useStyles = makeStyles(theme => ({
  root: {
    padding: '5vw',
    // paddingTop: '10vw',
    paddingBottom: 0,
    display: 'flex',
    flexDirection: 'column',
    background: props => props.colors ? `linear-gradient(${props.colors.main.primary},${props.colors.main.secondary})` : 'transparent',
    // backgroundColor: props => props.colors ? props.colors.main.secondary : 'transparent',
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      //width: '50%',
      padding: '2.5vh 5vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between'
    },
    transition: 'background-color 0.5s ease-in-out'
  },
  image: {
    transition: 'all 0.25s cubic-bezier(0, 0.55, 0.45, 1)',
    marginTop: '3vw',
    width: props => props.tab === 0 ? '80%' : '70%',
    maxWidth: '400px',
    paddingRight: props => props.tab === 0 ? '2.5rem' : '5rem',
    '& .lazyImage': {
      width: '100%',
      paddingBottom: '100%',
      height: 'auto',
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
      display: 'block',
      position: 'relative',
      '& img, &>span':{
        position: 'absolute',
        top:0,
        left:0,
        right: 0,
        bottom: 0,
      },
    },
    '& img':{
      opacity: 0,
      transition: 'opacity 0.5s ease-out, box-shadow 0.5s ease-out'
    },
    '& .lazyImage::before':{
      position: 'absolute',
      top:0,
      left:0,
      right: 0,
      bottom: 0,
      content: '""',
      backgroundImage: `url(${imgVinyl})`,
      backgroundSize: 'cover',
      transition: props => props.tab === 0 ? 'transform 0.5s ease-out 1s, opacity 1s ease-out 1s' : 'transform 0.5s ease-out 0s, opacity 1s ease-out 0s',
      opacity: 0,
    },

    '& .lazy-load-image-loaded img': {
      opacity: '1 !important',
      boxShadow:  '0 24px 16px -16px rgba(0,0,0,0.5)',
    },
    '& .lazy-load-image-loaded::before':{
      transform: props => props.tab === 0 ? 'translateX(2.5rem) rotate(180deg)' : 'translateX(3.5rem)',
      opacity: 1
    },
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]:  {
      minWidth: props => props.tab === 0 ? '65vh' : '60vh',
      //minWidth: '65vh',
      margin: 0
    }
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    '& button': {
      textTransform: 'capitalize',
      fontWeight: '600',
      color: props => props.colors ? props.colors.main.text : "inherit",
    }
  },
  'title': {
    marginTop: '3vw',
    color: props => props.colors ? props.colors.main.text : "inherit",
    lineHeight: 0.9,
    [theme.breakpoints.up("md")]: {
      fontSize: '2rem',
      marginTop: 0
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: '3rem'
    }
  },
  'author': {
    color: props => props.colors ? props.colors.main.text : "inherit",
    marginTop: '0.25em',
    marginBottom: '3vw',
    [theme.breakpoints.up("md")]: {
      fontSize: '1.8rem',
      lineHeight: 1,
      marginBottom: 0
    },
    [theme.breakpoints.up("lg")]: {
      fontSize: '2.5rem'
    }
  },
  'categories': {
    marginTop: '1rem',
    [theme.breakpoints.up("lg")]: {
      fontSize: '2rem'
    }
  }
}));

const Image = ({img, className}) => {
  const recordImage = require(`./../../data/images/${img}`).default;
  const handleClick = (slug) => {
    //dispatch(changePage(`${slug}`));
  };

  return (
    <div onClick={() => handleClick()} className={className}>
        <LazyLoadImage
          width={'100%'}
          src={recordImage}
          effect={'lazyImage'}
        />
    </div>
  )
}

export default function Header(props) {
  const record = useSelector( selectRecord );
  const colors = useSelector(selectColors);
  const tab = useSelector(selectTab);
  console.log(colors)

  const theme = useTheme();
  const desktop = useMediaQuery(`${theme.breakpoints.up('md')} and (orientation: landscape)`);

  let classes = useStyles({colors: colors, tab: tab});

  return (
    (record && colors) && (
      <section className={classes.root}>
        <div className={classes.header}>
          <Logo className={classes.logo} location={props.location} />
          {!desktop && <LibraryBtn className={classes.libraryBtn}/>}
          {!desktop && <Modal />}
        </div>
        <Image img={record.image} className={classes.image}/>
        <div>
          <Typography className={classes.title} variant="h1">{record.title}</Typography>
          <Typography className={classes.author} variant="h2">{record.author}</Typography>
          {desktop && <Categories className={classes.categories} colors={colors} list={record.tags} />}

        </div>
      </section>
    )
    
  );
}

