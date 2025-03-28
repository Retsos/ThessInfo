import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import WaterCard from './waterinfo';


const ExpandMore = styled((props, waterData) => {

  const { expand, ...other } = props;


  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  marginLeft: 'auto',
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

export default function MyCard({
  title,
  id,
  imageUrl,
  expanded,
  onExpand,
  details,
  waterData,
}) {
  const toggleDetails = () => setShowDetails(prev => !prev);
  return (
    <Card sx={{ width: 400, margin: '1rem', height: '100%' }}>
      <CardHeader
        title={title}
        titleTypographyProps={{ fontSize: '1rem', fontWeight: 'bold' }}
      />
      <CardMedia component="img" height="240" image={imageUrl} alt={title} />
      <CardContent>


      </CardContent>
      <CardActions disableSpacing>
        <Typography
          variant="body2"
          sx={{ fontSize: '1rem', fontWeight: 'bold', color: 'black' }}
        >
          Λεπτομέρειες
        </Typography>

        <ExpandMore
          expand={expanded}
          onClick={(e) => {
            e.stopPropagation();
            onExpand();
          }}
          aria-expanded={expanded}
          aria-label="show more"
        >
          <ExpandMoreIcon />
        </ExpandMore>
      </CardActions>

      <Collapse in={expanded} timeout="auto" unmountOnExit>
        <CardContent>
          <Typography sx={{ marginBottom: 2 }}>{details}</Typography>
        </CardContent>
        {id === 1 && <WaterCard waterData={waterData} />}
      </Collapse>
    </Card>
  );
}
