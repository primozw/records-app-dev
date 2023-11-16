import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Chip from '@material-ui/core/Chip';

const useStyles = makeStyles((theme) => ({
  tags: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    display: 'flex',
    flexWrap: 'wrap'
  },
  tag: {
    marginRight: '0.5rem',
    marginBottom: '0.5rem',
    '& .MuiChip-root': {
      backgroundColor: props => props.colors.accent.primary,
      color: props => props.colors.accent.text,
    }
  }
}));

export default function Categories({list, colors, className}) {
  let classes = useStyles({colors: colors});
  return (
    (list && colors) && (
      <div className={className}>
        <ul className={classes.tags}>
          {list.map(tag => <li className={classes.tag} key={tag}><Chip clickable label={tag} /></li>)}
        </ul>
      </div>
        
    )
    
  );
}