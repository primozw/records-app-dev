import React from 'react';

import Tooltip from '@material-ui/core/Tooltip';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import FileCopyOutlinedIcon from '@material-ui/icons/FileCopyOutlined';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';


import copy from 'copy-to-clipboard';

const Color = React.forwardRef(function Color(props, ref) {
  //  Spread the props to the underlying DOM element.
  // console.log(props)
  return (
    <div {...props} ref={ref} className="patch" style={{
      backgroundColor: props.hexvalue
    }}>
  </div>
  )
});

const Patch = ({ hexValue, lch  }) => {
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const [openSneckbar, setOpenSneckbar] = React.useState(false);

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSneckbar(false);
  };

  const CopyIcon = ({copyContent}) =>{
    return (
      <Button
        variant="text"
        color="inherit"
        size="small"
        startIcon={<FileCopyOutlinedIcon />}
        className="tooltip__btn"
        onClick={() => {
          copy(copyContent);
          setOpenSneckbar(true);
        }}
      >
        Copy
      </Button>

    )
  }

  return (
    <React.Fragment>
      <ClickAwayListener onClickAway={handleTooltipClose}>
        <Tooltip 
          title={
            <div className="tooltip">
              <div className="tooltip__values">
                <Typography variant="body2" color="inherit"><strong>Hex:</strong> {hexValue}</Typography>
                <CopyIcon copyContent={hexValue}/>
              </div>
              <div className="tooltip__values">
                <Typography variant="body2" color="inherit"><strong>Lch:</strong> {lch.map((value, ind)=>Math.floor(value)).join(', ')}</Typography>
                <CopyIcon copyContent={lch.map((value, ind)=>Math.floor(value)).join(', ')}/>
              </div>
            </div>
          }
          placement="bottom"
          PopperProps={{
            disablePortal: true,
          }}
          onClose={handleTooltipClose}
          open={openTooltip}
          disableFocusListener
          disableHoverListener
          disableTouchListener
          interactive
        >
          <Color hexvalue={hexValue} onClick={handleTooltipOpen}/>
        </Tooltip>
      </ClickAwayListener>
      <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={openSneckbar}
          autoHideDuration={2000}
          onClose={handleClose}
          message="Color values have been copied to the clipboard."
      />
    </React.Fragment>
    
   
  )
}
export default Patch;