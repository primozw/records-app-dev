import React from 'react';
import { useStore, useSelector } from 'react-redux';


import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import ImageOutlinedIcon from '@material-ui/icons/ImageOutlined';
//import ColorizeOutlinedIcon from '@material-ui/icons/ColorizeOutlined';
import PaletteOutlinedIcon from '@material-ui/icons/PaletteOutlined';
import { selectColors, selectStep } from '../app/reducers/modelReducer';

import Image from './Image';
import Patch from './Patch';

const InputDataSection = () => {
  const store = useStore();
  const data = store.getState().data;
  console.log(data)

  const currentColors = useSelector(selectColors);

  const dispColors = () => {
    if ( !currentColors ) {
      return data.currentData.hex.map((color, ind) => <Patch key={color} hexValue={color} lch={data.currentData.lch[ind]} />)
    } else {
      return Object.keys(currentColors).map((color, ind) => <Patch key={color} hexValue={currentColors[color].hex} lch={currentColors[color].lch} />)
    }
  }


  return (
    <aside className="input-data">
      {/* <Typography variant="h4">Input data</Typography>
      <Typography variant="body1">Input parameters of presented model are the image and colors extracted from the image. </Typography> */}
      {/* <Typography className="input-data--title" variant="h6"><ImageOutlinedIcon/>Image</Typography> */}
      <Image src={require(`./../data/images/${data.currentImage}`)} />

      <Typography className="input-data--title" variant="h6"><PaletteOutlinedIcon/>Colors</Typography>
      <div className="input-data__palette">
        {dispColors()}
      </div>
      {/* <Typography variant="body1"><sup>*</sup>Colors are extracted from the image using <Link href="https://doi.org/10.1002/col.22485" target="_blank" color="textSecondary">a machine learning model.</Link></Typography> */}
    </aside>
  )

 
}
  

export default InputDataSection;