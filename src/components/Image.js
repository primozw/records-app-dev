import React from 'react';
import { LazyLoadImage } from 'react-lazy-load-image-component';
 
const Image = ({ src }) => (
  <div className="page__image">
    <LazyLoadImage
      src={src}
    />
  </div>
);
 
export default Image;