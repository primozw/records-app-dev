import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  CSSTransition,
  TransitionGroup,
} from 'react-transition-group';

import {
  changePage,
  selectRecords
} from './../../app/reducers/appReducer';

import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';

import { makeStyles } from '@material-ui/core/styles';
import CropOriginalSharpIcon from '@material-ui/icons/CropOriginalSharp';

const imgVinyl = require('./../../img/vinyl.png').default;

const useStyles = makeStyles(theme => ({
  root: {
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
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        position: 'absolute',
        top:0,
        left:0,
        right: 0,
        bottom: 0,
        content: '""',
        backgroundImage: `url(${imgVinyl})`,
        backgroundSize: 'cover',
        transition: 'transform 0.5s ease-out, opacity 1s ease-out 1s',
        opacity: 0,
        transform: 'translateX(0) rotate(0)'
      }
    },

    '& li:hover .lazyImage::before':{
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        transform: 'translateX(2rem) rotate(90deg)',
      }
    },
    '& li:hover img':{
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        boxShadow:  '0 24px 16px -16px rgba(0,0,0,0.5)',
      }
    },
    '& .lazy-load-image-loaded img, & .lazy-load-image-loaded::before':{
      opacity: '1 !important'
    },
    '& .lazy-load-image-loaded img':{
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        boxShadow:  '0 16px 16px -16px rgba(0,0,0,0.5)',
      }
    },

    marginBottom: '5vw',
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      width: '75%',
      margin: '0 0 0 25%',
      padding: '2.5vw'
    },
    [theme.breakpoints.up("xl")]: {
      width: '80%',
      margin: '0 0 0 20%',
    }
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,

    '&>div':{
      display: 'flex',
      flexWrap: 'wrap',
      // [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      //   justifyContent: 'space-between',
      // }
    },
    
    '& li': {
      width: '50%',
      cursor: 'pointer',
      marginBottom: '1rem',
      [theme.breakpoints.up("xs")]: {
      },
      [theme.breakpoints.up("sm")]: {
        width: '33.333%',
      },
      [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
        paddingRight: '2.5rem'
      },
      [theme.breakpoints.up('lg')]: {
        width: '25%',
      }
    },
  },
  img: {
    width: '100%',
    height: 'auto',
    display: 'block',
  },
  text: {
    margin: '0.5rem 5vw 0',
    [`${theme.breakpoints.up('md')} and (orientation: landscape)`]: {
      margin: '0.5rem 0 0'
    }
  },
  title: {
    fontWeight: 600,
    margin: 0,
    lineHeight: 1,
    fontSize: '1rem',
    [theme.breakpoints.up("sm")]: {
      fontSize: '1.3rem'
    },
  },
  author: {
    margin:0,
    fontSize: '0.9rem',
    fontWeight: 300,
    lineHeight: '1',
    [theme.breakpoints.up("sm")]: {
      fontSize: '1.1rem'
    }
  },
  placeholder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right:0,
    bottom:0,
    backgroundColor: theme.palette.background.paper,
  },
  placeholderIcon: {
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',
    '& path': {
      fill: theme.palette.background.default
    }
  }
}));



const ImagePlaceholder = () => {
  const classes = useStyles();
  return (
    <div className={classes.placeholder}>
      <CropOriginalSharpIcon fontSize={'large'} className={classes.placeholderIcon}/>
    </div>
  )
}
  
const Record = ({recordData}) => {
  const dispatch = useDispatch();
  const classes = useStyles();
  const img = require(`./../../data/images/${recordData.image}`).default;

  const handleClick = (slug) => {
    dispatch(changePage(`${slug}`));
  };

  return (
    <li onClick={() => handleClick(recordData.slug)}>
      <article>
        <LazyLoadImage
          width={'100%'}
          // height={300}
          className={classes.img}
          src={img}
          name={recordData.title}
          placeholder={<ImagePlaceholder/>}
          effect={'lazyImage'}
        />
        <div className={classes.text}>
          <h2 className={classes.title}>{recordData.title}</h2>
          <p className={classes.author}>{recordData.author}</p>
        </div>
      </article>
    </li>
  )
}


export default function RecordsList(props) {
  const records = useSelector( selectRecords );

  const classes = useStyles();

  return (
    <div className={classes.root}>
      <ul className={classes.list}>
        <TransitionGroup exit={false}>
        {
          records.map(( record, ind) => {
            const uniq = record.slug + ind;
            return (
              <CSSTransition
                key={uniq}
                timeout={500}
                classNames="records-list-item"
              >
                <Record recordData={record} key={uniq} />
              </CSSTransition>
            )
          })
        }
        </TransitionGroup>
      </ul>
      

      


    </div>
  );
}