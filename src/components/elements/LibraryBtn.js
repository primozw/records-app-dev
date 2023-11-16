
import React from 'react';
import { Link } from "@reach/router"

import { makeStyles } from '@material-ui/core/styles';
import { useTheme } from '@material-ui/core/styles';
import SvgIcon from '@material-ui/core/SvgIcon';
import Button from '@material-ui/core/Button';

import { useSelector, useDispatch } from 'react-redux';
import { changePage } from "./../../app/reducers/appReducer";

const Icon = (props) => (
  <SvgIcon {...props}>
    <path d="M8.6 3.3h2.8v17H8.6z"/><path transform="rotate(-19.729 18.816 12.115)" d="M17.4 3.5h2.8v17.3h-2.8z" /><path d="M.9 3.3h2.8v17H.9z"/>
  </SvgIcon>
)


function LibraryBtn(props) {
  const theme = useTheme();
  const dispatch = useDispatch()

  const handleClick = (e) => {
    e.preventDefault();
    dispatch(changePage(''));
  }

  return (
    <Button
      color="primary"
      startIcon={<Icon fontSize="small" />}
      size="small"
      {...props}
      onClick={handleClick}
    >
      Library
    </Button>
  );
}

export default LibraryBtn;