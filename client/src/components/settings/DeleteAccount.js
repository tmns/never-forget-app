import React, { Fragment } from "react";
import { Link, Redirect } from "react-router-dom";
import { connect } from "react-redux";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import Grid from "@material-ui/core/Grid";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import DeleteIcon from "@material-ui/icons/DeleteForever";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import { Formik } from "formik";
import * as Yup from "yup";

import CustomTheme from "../layout/CustomTheme";
import { deleteAccount } from "../../apollo/user";
import { signOutAfterDeletion } from "../../actions/session";

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: CustomTheme.palette.primary.main
    }
  },
  paper: {
    marginTop: theme.spacing(5),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    color: CustomTheme.palette.primary.contrastText
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: CustomTheme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  textfield: {
    color: CustomTheme.palette.secondary.main,
    "&:-webkit-autofill": {
      "-webkit-box-shadow": `inset 0 0 0px 9999px ${
        CustomTheme.palette.primary.main
      }`,
      "-webkit-text-fill-color": CustomTheme.palette.secondary.main
    }
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    backgroundColor: CustomTheme.palette.secondary.main
  },
  link: {
    textDecoration: "none !important",
    color: CustomTheme.palette.secondary.main,
    "&:hover": {
      color: CustomTheme.palette.secondary.dark
    }
  },
  arrow: {
    marginTop: theme.spacing(5),
    color: CustomTheme.palette.secondary.main
  },
  warning: {
    color: CustomTheme.palette.secondary.main
  }
}));

const CssTextField = withStyles({
  root: {
    "& label.Mui-focused": {
      color: CustomTheme.palette.secondary.dark
    },
    "& .MuiInput-underline:after": {
      borderBottomColor: CustomTheme.palette.secondary.dark
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: CustomTheme.palette.secondary.main
      },
      "&:hover fieldset": {
        borderColor: CustomTheme.palette.secondary.dark
      },
      "&.Mui-focused fieldset": {
        borderColor: CustomTheme.palette.secondary.dark
      }
    }
  }
})(TextField);

const initialState = {
  currentPassword: ""
};

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current Password is required!")
});

function DeleteAccount({ signOutAfterDeletion, history }) {
  const classes = useStyles();

  return (
    <Fragment>
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          try {
            var variables = {
              input: {
                password: values.currentPassword
              }
            }
            await deleteAccount(variables);
            actions.setSubmitting(false);
            signOutAfterDeletion();
          } catch (err) {
            console.log(err);
            actions.setSubmitting(false);
            actions.setStatus({ msg: "Invalid password."});
          }
        }}
      >
        {props => (
          <ThemeProvider theme={CustomTheme}>
            <Container className={classes.arrow}>
              <Link className={classes.link} to="/settings">
                <ArrowBackOutlinedIcon />
              </Link>
            </Container>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <DeleteIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Delete Account
                </Typography>
                <form onSubmit={props.handleSubmit} className={classes.form}>
                  <CssTextField
                    InputProps={{
                      classes: {
                        input: classes.textfield
                      }
                    }}
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    name="currentPassword"
                    label="Current Password"
                    InputLabelProps={{
                      style: {
                        color: CustomTheme.palette.secondary.main
                      }
                    }}
                    type="password"
                    id="currentPassword"
                    autoComplete="current-password"
                    onChange={props.handleChange}
                    value={props.values.currentPassword}
                    helperText={
                      props.touched.currentPassword
                        ? props.errors.currentPassword
                        : ""
                    }
                    error={
                      props.touched.currentPassword &&
                      Boolean(props.errors.currentPassword)
                    }
                  />
                  {props.status && props.status.msg && (
                    <div>{props.status.msg}</div>
                  )}
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="secondary"
                    className={classes.submit}
                  >
                    Delete Account
                  </Button>
                  <Typography component="h5" align="center">
                    Be careful! All your decks and cards will be permanently deleted!
                  </Typography>
                </form>
              </div>
            </Container>
          </ThemeProvider>
        )}
      </Formik>
    </Fragment>
  );
}

const mapDispatchToProps = dispatch => ({
  signOutAfterDeletion: () => dispatch(signOutAfterDeletion())
})

export default connect(null, mapDispatchToProps)(DeleteAccount);
