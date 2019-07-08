import React from 'react';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from "@material-ui/core/styles";

import CustomTheme from "../layout/CustomTheme";

const useStyles = makeStyles(theme => ({
  iconButton: {
    color: CustomTheme.palette.secondary.main
  }
}));

function VertMenu({ loggedIn }) {
  const classes = useStyles();

  const [anchorEl, setAnchorEl] = React.useState(null);

  function handleClick(event) {
    setAnchorEl(event.currentTarget);
  }

  function handleClose() {
    setAnchorEl(null);
  }

  return (
    <div>
      <IconButton
        aria-label="Menu"
        aria-controls="menu"
        aria-haspopup="true"
        onClick={handleClick}
        className={classes.iconButton}
      >
        <MoreVertIcon />
      </IconButton>
      <Menu
        id="menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        {!loggedIn && <MenuItem onClick={handleClose}>Sign In</MenuItem>}
        {!loggedIn && <MenuItem onClick={handleClose}>Sign Up</MenuItem>}
        {loggedIn && <MenuItem onClick={handleClose}>Settings</MenuItem>}
        {loggedIn && <MenuItem onClick={handleClose}>Logout</MenuItem>}
      </Menu>
    </div>
  );
}

export default VertMenu;