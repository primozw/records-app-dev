import React from 'react';

import { useDispatch, useSelector } from 'react-redux';
import {
  changePage,
} from './../app/reducers/appReducer';
import {
  selectImageNames
} from './../app/reducers/dataReducer';

import Button from '@material-ui/core/Button';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';


export default function SelectImageMenu(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const imgNames = useSelector(selectImageNames);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (imgName) => {
    dispatch(changePage(`${imgName}`));
    setAnchorEl(null);
  };

  return (
    <div>
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Select Image
      </Button>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
      {imgNames.map(imgName =>  <MenuItem key={imgName} onClick={() => handleClose(imgName)}>{imgName}</MenuItem>)}
      </Menu>
    </div>
  );
}