import * as React from 'react';
import Paper from '@mui/material/Paper';
import {Breadcrumbs, Grid, Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepLabel from '@mui/material/StepLabel';

export default function CustomizedStepper({steps}){
  return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
    <Stepper activeStep={steps.length} alternativeLabel>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
        </Paper>
  );
}
