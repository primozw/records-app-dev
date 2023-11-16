import React from 'react';
import { makeStyles, withStyles } from '@material-ui/core/styles';




const useStyles = makeStyles((theme) => ({
  
}));



export default function Ratings({record, colors}) {
  let classes = useStyles({colors: colors});

  return (
    (record && colors) && (
      <React.Fragment key={'ratings'}>
       <p>Ratings</p>
      </React.Fragment>
    )
    
  );
}