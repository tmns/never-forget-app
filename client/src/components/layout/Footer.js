import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";

import CustomTheme from "../layout/CustomTheme";

const useStyles = makeStyles(theme => ({
  footer: {
    borderTop: `1px solid ${theme.palette.divider}`,
    paddingTop: theme.spacing(5),
    backgroundColor: CustomTheme.palette.primary.main,
    color: CustomTheme.palette.primary.contrastText
  },
  heart: {
    color: "#e25555"
  },
  link: {
    textDecoration: "none !important",
    color: CustomTheme.palette.primary.contrastText,
    "&:hover": {
      color: CustomTheme.palette.secondary.main
    }
  }
}));

export default function StickyFooter() {
  const classes = useStyles();

  return (
    <div>
      <CssBaseline />
      <footer className={classes.footer}>
        <Container maxWidth="sm" align="center">
          <Typography variant="body2">
            {"crafted with "}
            <span className={classes.heart}>❤</span>
            {" by "}
            <Link className={classes.link} href="https://github.com/tmns">
              @tmns
            </Link>
          </Typography>
        </Container>
      </footer>
    </div>
  );
}
