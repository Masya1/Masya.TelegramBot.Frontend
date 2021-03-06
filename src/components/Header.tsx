import {
  AppBar,
  IconButton,
  Toolbar,
  useMediaQuery,
  useTheme,
} from '@material-ui/core';
import React from 'react';
import { Menu } from '@material-ui/icons';

export interface HeaderProps {
  onMenuClick: (event: React.MouseEvent) => void;
}

export const Header: React.FC<HeaderProps> = (props) => {
  const theme = useTheme();
  const breakpoint = theme.breakpoints.down('sm');
  const isDownMd = useMediaQuery(breakpoint);
  const { onMenuClick, children } = props;

  return (
    <AppBar color="primary" position="sticky">
      <Toolbar style={{ display: 'flex', justifyContent: 'space-between' }}>
        {isDownMd ? (
          <IconButton onClick={onMenuClick}>
            <Menu />
          </IconButton>
        ) : (
          <div />
        )}
        {children}
      </Toolbar>
    </AppBar>
  );
};
