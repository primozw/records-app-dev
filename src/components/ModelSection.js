import React from 'react';
import { useDispatch, useSelector, useStore } from 'react-redux';

import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { setStep, selectStep } from './../app/reducers/modelReducer'

import Step1 from './model/Step1';
import Step2 from './model/Step2';

function getSteps() {
  return [
    'Determine the optimal usage of colors',
    'Check the background and foreground colors', 
    'Create an ad'];
}

function getStepContent(step) {
  switch (step) {
    case 0:
      return <Step1 />
    case 1:
      return <Step2 />
    case 2:
      return `Try out different ad text to see what brings in the most customers,
              and learn how to enhance your ads using features like ad extensions.
              If you run into any problems with your ads, find out how to tell if
              they're running and how to resolve approval issues.`;
    default:
      return 'Unknown step';
  }
}


const ModelSection = () => {

  // const [activeStep, setActiveStep] = React.useState(0);
  const activeStep = useSelector(selectStep)
  const steps = getSteps();
  const dispatch = useDispatch()

  // const handleNext = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep + 1);
  // };

  // const handleBack = () => {
  //   setActiveStep((prevActiveStep) => prevActiveStep - 1);
  // };

  // const handleReset = () => {
  //   setActiveStep(0);
  // };

  const setActiveStep = (step) => {
    dispatch(setStep(step))
  }

  const handleNext = () => {
    setActiveStep(activeStep + 1);
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  const handleReset = () => {
    setActiveStep(0);
  };

  return (
    <div>
      <Typography variant="h4" gutterBottom>Model</Typography>
      <Stepper activeStep={activeStep} orientation="vertical">
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
            <StepContent>
              {getStepContent(index)}
              <div>
                <div>
                  <Button
                    disabled={activeStep === 0}
                    onClick={handleBack}
                  >
                    Back
                  </Button>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={handleNext}
                  >
                    {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
                  </Button>
                </div>
              </div>
            </StepContent>
          </Step>
        ))}
      </Stepper>
      {activeStep === steps.length && (
        <Paper square elevation={0}>
          <Typography>All steps completed - you&apos;re finished</Typography>
          <Button onClick={handleReset}>
            Reset
          </Button>
        </Paper>
      )}
    </div>
  );

  // return (
  //   <section className="model">
  //     <Typography variant="h4" gutterBottom>Model</Typography>
  //   </section>
  // )

 
}
  

export default ModelSection;