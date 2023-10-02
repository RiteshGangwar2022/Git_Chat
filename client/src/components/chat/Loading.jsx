import React from 'react'
import Skeleton from '@mui/material/Skeleton';
import Typography from '@mui/material/Typography';

const Loading = () => {
  return (
    <div>
      <Typography variant="h1"> <Skeleton /></Typography>
      <Typography variant="h1"> <Skeleton /></Typography>
      <Typography variant="h1"> <Skeleton /></Typography>
      <Typography variant="h1"> <Skeleton /></Typography>
      <Typography variant="h1"> <Skeleton /></Typography>
     
    </div>
  )
}

export default Loading
