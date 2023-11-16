import React from 'react';
import { useLocation } from "@reach/router"
import { useSelector, useStore } from 'react-redux';
import { selectColors } from './../app/reducers/modelReducer';

import Container from '@material-ui/core/Container';
import Grid from '@material-ui/core/Grid';

import DemoTextWithIcons from './demo/DemoTextWithIcons'

export default function DemoSection() {

  return (
    <section className="demo">
      <DemoTextWithIcons />
    </section>
  );
}

