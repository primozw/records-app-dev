import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectImageNames,
  selectImageFiles,
} from './../app/reducers/dataReducer';
import {
  changePage,
} from './../app/reducers/appReducer';

import { LazyLoadImage } from 'react-lazy-load-image-component';




export default function ImageList(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const dispatch = useDispatch();
  const imgNames = useSelector( selectImageNames );
  const imgFiles = useSelector( selectImageFiles );

  //console.log(anchorEl);
  // console.log(imgFiles)

  const handleClick = (imgName) => {
    dispatch(changePage(`${imgName}`));
    setAnchorEl(null);
  };

  const ImageLink = ({src, name}) => {
    return (
      <LazyLoadImage src={src} className='image-list__image' onClick={() => handleClick(name)}/>
    )
  }

  return (
    <div className='image-list'>
      {
        imgFiles.map(( imgFile, ind) =>  
          <ImageLink 
            key={imgFile} 
            src={require(`./../data/images/${imgFile}`)}
            name={imgNames[ind]}
          />
        )
      }

      


    </div>
  );
}