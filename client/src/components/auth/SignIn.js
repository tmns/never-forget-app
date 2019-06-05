import React, { Fragment } from "react";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import Link from "@material-ui/core/Link";
import Grid from "@material-ui/core/Grid";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import { Formik } from "formik";
import * as Yup from "yup";
import { connect } from 'react-redux';

import { signIn } from "../../actions/session";

const mapDispatchToProps = dispatch => ({
  signIn: variables => dispatch(signIn(variables))
})

const useStyles = makeStyles(theme => ({
  "@global": {
    body: {
      backgroundColor: theme.palette.common.white
    }
  },
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center"
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(1)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

const initialState = {
  username: "",
  password: ""
};

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required!"),
  password: Yup.string().required("Password is required!")
});

function SignIn({ history, signIn}) {
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  id="username"
                  label="Username"
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
                <TextField
                  variant="outlined"
                  margin="normal"
                  required
                  fullWidth
                  name="password"
                  label="Password"
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
                  color="primary"
                  className={classes.submit}
                >
                  Sign In
                </Button>
                <Grid container justify="flex-end">
                  <Grid item>
                    <Link href="/signup" variant="body2">
                      Don't have an account? Sign Up!
                    </Link>
                  </Grid>
                </Grid>
              </form>
            </div>
          </Container>
        )}
      </Formik>
    </Fragment>
  );
}

export default connect(null, mapDispatchToProps)(SignIn);
