import * as React from 'react';
import Paper from '@mui/material/Paper';
import {Breadcrumbs, Grid, Stack} from '@mui/material';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';

export default function CustomizedBreadcrumbs({breadcrumbs}){
  console.log(breadcrumbs)
  return (
        <Paper sx={{width: '100%', overflow: 'hidden'}}>
          <Stack spacing={2}>
            <Breadcrumbs separator="›" aria-label="breadcrumb">
              {breadcrumbs}
            </Breadcrumbs>
          </Stack>
        </Paper>
  );
}
