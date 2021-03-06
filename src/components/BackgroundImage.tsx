import { makeStyles } from '@material-ui/core';
import React from 'react';

const useStyles = makeStyles({
  root: {
    display: 'block',
    position: 'absolute',
    width: '100%',
    height: '100%',
    zIndex: -100,
  },
});

export interface BackgroundImageProps {
  src?: string;
  alt?: string;
}

export const BackgroundImage: React.FC<BackgroundImageProps> = (props) => {
  const classes = useStyles();

  return <img {...props} className={classes.root} />;
};
