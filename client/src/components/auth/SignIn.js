import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from "react-redux";

import { signIn } from "../../actions/session";
import CustomTheme from "../layout/CustomTheme";

const mapDispatchToProps = dispatch => ({
  signIn: variables => dispatch(signIn(variables))
});

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
  password: ""
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required!"),
  password: Yup.string().required("Password is required!")
});

function SignIn({ history, signIn }) {
  const classes = useStyles();

  return (
    <Fragment>
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          const variables = {
            input: {
              username: values.username,
              password: values.password
            }
          };
          try {
            await signIn(variables);
            actions.setSubmitting(false);
            history.push("/dashboard");
          } catch (err) {
            console.log(err);
            actions.setSubmitting(false);
            actions.setStatus({ msg: "Invalid username or password." });
          }
        }}
      >
        {props => (
          <ThemeProvider theme={CustomTheme}>
            <Container className={classes.arrow}>
              <Link className={classes.link} to="/">
                <ArrowBackOutlinedIcon />
              </Link>
            </Container>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Sign in
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
                      props.touched.username && Boolean(props.errors.username)
                    }
                  />
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
                      props.touched.password && Boolean(props.errors.password)
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
                    Sign In
                  </Button>
                  <Grid container justify="flex-end">
                    <Grid item>
                      <Link
                        className={classes.link}
                        to="/signup"
                        variant="body2"
                      >
                        Don't have an account? Sign Up!
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
)(SignIn);
