import React from 'react';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Moment from 'react-moment';
import ReactHtmlParser from 'react-html-parser';
import Chip from '@material-ui/core/Chip';
import Categories from './Categories';
import { Typography } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
  card: {
    // background: props => `linear-gradient(${props.colors.accent.primary},${props.colors.accent.secondary})`,
    // color: props => props.colors.accent.text,
    // padding: theme.spacing(1),
    [theme.breakpoints.down('sm')]: {
      background: props => `linear-gradient(${props.colors.accent.primary},${props.colors.accent.secondary})`,
      color: props => props.colors.accent.text,
      padding: theme.spacing(1),
    },
    borderRadius: '8px',
    '& ul': {
      listStyle: 'none',
      padding: 0,
      margin: 0,
      //display: 'flex',
      flexWrap: 'wrap'
    },
    '& li': {
      //display: 'flex',
      marginBottom: '0'
    },
    '& p': {
      display: 'inline-block'
    },
    '& h2, & p': {
      margin: 0,
    },
    '& h3': {
      margin: 0,
      marginRight: '0.5rem',
      fontWeight: 300,
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      display: 'inline-block'
    }
  }
}));


const Card = ({classes, record}) => (
  <article className={classes.card}>
    <Typography variant="h2">Record Details</Typography>
    <ul>
      <li>
        <h3>Release Date</h3>
        <p>
          <Moment format="MMMM Do YYYY">{record.releaseDate}</Moment>
        </p>
      </li>
      <li>
        <h3>Label</h3>
        <p>{record.label}</p>
      </li>
      <li>
        <h3>Number of discs</h3>
        <p>{record.disks}</p>
      </li>
      <li>
        <h3>Format</h3>
        <p>{record.format}</p>
      </li>
    </ul>
  </article>
)


export default function Details({record, colors}) {
  let classes = useStyles({colors: colors});
  const theme = useTheme();
  const mdUp = useMediaQuery(`${theme.breakpoints.up('md')} and (orientation: portrait)`);

  return (
    (record && colors) && (
      <React.Fragment key={'details'}>
       <Card classes={classes} record={record}/>
       <section>{ReactHtmlParser(record.desc)}</section>
       {mdUp && 
        <section>
          <h2>Categories</h2>
          <Categories colors={colors} list={record.tags} />
        </section>
       }
      </React.Fragment>
    )
    
  );
}