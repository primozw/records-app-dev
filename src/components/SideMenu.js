import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  setSideMenu,
  selectMenuOpen,
  selectMenuContent
} from './../app/reducers/appReducer';

import Drawer from '@material-ui/core/Drawer';

import {Step1Settings} from './model/Settings';



export default function SideMenu(props) {
  
  const dispatch = useDispatch();
  const menuState = useSelector(selectMenuOpen);
  const content = useSelector(selectMenuContent);

  const getContent = (content) => {
    switch(content) {
      case 'step1Settings':
        return <Step1Settings />
        break;
      case 'step2Settings':
        return (<p> Test 2</p>)
        break;
      default:
        return false
    }
  }
  
  return (
    <Drawer className="side-menu" anchor={'right'} open={menuState} onClose={ () => dispatch(setSideMenu(false))}>
      {getContent(content)}
    </Drawer>
  );
}
