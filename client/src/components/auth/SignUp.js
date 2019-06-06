import React, { Fragment } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";

import { signUp, signIn } from "../../actions/session";
import CustomTheme from "../layout/CustomTheme";

const mapDispatchToProps = dispatch => ({
  signUp: variables => dispatch(signUp(variables)),
  signIn: variables => dispatch(signIn(variables))
});

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: CustomTheme.palette.primary.main
    }
  },
  paper: {
    marginTop: theme.spacing(8),
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
    marginTop: theme.spacing(3)
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
  username: "",
  password: "",
  confirmPassword: ""
};

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(2, "Your username must be between 2 and 16 characters.")
    .max(16, "Your username must be between 2 and 16 characters.")
    .required("Username is required!"),
  password: Yup.string()
    .min(8, "Your password must be at least 8 characters.")
    .max(64, "Your password can't be larger than 64 characters.")
    .required("Password is required!"),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords are not the same!")
    .required("Password confirmation is required!")
});

function SignUp({ history, signUp, signIn }) {
  const classes = useStyles();

  return (
    <Fragment>
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          console.log(values);
          const variables = {
            input: {
              username: values.username,
              password: values.password,
              confirmPassword: values.confirmPassword
            }
          };
          try {
            await signUp(variables);
            actions.setSubmitting(false);
            await signIn({
              input: { username: values.username, password: values.password }
            });
            history.push("/dashboard");
          } catch (err) {
            console.log(err);
            actions.setSubmitting(false);
            actions.setStatus({
              msg:
                "This username is already taken, please choose a different one."
            });
          }
        }}
      >
        {props => (
          <ThemeProvider theme={CustomTheme}>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign up
                </Typography>
                <form onSubmit={props.handleSubmit} className={classes.form}>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <CssTextField
                        InputProps={{
                          classes: {
                            input: classes.textfield
                          }
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        InputLabelProps={{
                          style: {
                            color: CustomTheme.palette.secondary.main
                          }
                        }}
                        name="username"
                        autoComplete="username"
                        autoFocus
                        onChange={props.handleChange}
                        value={props.values.username}
                        helperText={
                          props.touched.username ? props.errors.username : ""
                        }
                        error={
                          props.touched.username &&
                          Boolean(props.errors.username)
                        }
                      />
                      {props.status && props.status.msg && (
                        <div>{props.status.msg}</div>
                      )}
                    </Grid>
                    <Grid item xs={12}>
                      <CssTextField
                        InputProps={{
                          classes: {
                            input: classes.textfield
                          }
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        name="password"
                        label="Password"
                        InputLabelProps={{
                          style: {
                            color: CustomTheme.palette.secondary.main
                          }
                        }}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        onChange={props.handleChange}
                        value={props.values.password}
                        helperText={
                          props.touched.password ? props.errors.password : ""
                        }
                        error={
                          props.touched.password &&
                          Boolean(props.errors.password)
                        }
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <CssTextField
                        InputProps={{
                          classes: {
                            input: classes.textfield
                          }
                        }}
                        variant="outlined"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm Password"
                        InputLabelProps={{
                          style: {
                            color: CustomTheme.palette.secondary.main
                          }
                        }}
                        type="password"
                        id="confirmPassword"
                        autoComplete="current-password"
                        onChange={props.handleChange}
                        value={props.values.confirmPassword}
                        helperText={
                          props.touched.confirmPassword
                            ? props.errors.confirmPassword
                            : ""
                        }
                        error={
                          props.touched.confirmPassword &&
                          Boolean(props.errors.confirmPassword)
                        }
                      />
                    </Grid>
                  </Grid>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    color="primary"
                    className={classes.submit}
                    disabled={!props.dirty || props.isSubmitting}
                  >
                    Sign Up
                  </Button>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Link className={classes.link} href="/signin" variant="body2">
                        Already have an account? Sign in!
                      </Link>
                    </Grid>
                  </Grid>
                </form>
              </div>
            </Container>
          </ThemeProvider>
        )}
      </Formik>
    </Fragment>
  );
}

export default connect(
  null,
  mapDispatchToProps
)(SignUp);
