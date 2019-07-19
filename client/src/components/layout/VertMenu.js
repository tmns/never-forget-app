import React from "react";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import IconButton from "@material-ui/core/IconButton";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { makeStyles } from "@material-ui/core/styles";

import CustomTheme from "../layout/CustomTheme";
import { signOut } from "../../actions/session";

const useStyles = makeStyles(theme => ({
  iconButton: {
    color: CustomTheme.palette.secondary.main
  }
}));

function VertMenu({ signOut, loggedIn }) {
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
        {!loggedIn && (
          <MenuItem component={Link} to="/signin">
            Sign In
          </MenuItem>
        )}
        {!loggedIn && (
          <MenuItem component={Link} to="/signup">
            Sign Up
          </MenuItem>
        )}
        {loggedIn && (
          <MenuItem component={Link} to="/settings">
            Settings
          </MenuItem>
        )}
        {loggedIn && <MenuItem onClick={signOut}>Logout</MenuItem>}
      </Menu>
    </div>
  );
}

const mapDispatchToProps = dispatch => ({
  signOut: () => dispatch(signOut())
});

export default connect(
  null,
  mapDispatchToProps
)(VertMenu);
