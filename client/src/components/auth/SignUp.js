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
import { gql } from "apollo-boost";
import { Mutation } from "react-apollo";

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
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 0, 2)
  }
}));

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

const SIGNUP = gql`
  mutation signup($input: NewUserInput!) {
    signup(input: $input) {
      username
      _id
    }
  }
`;

function SignUp(props) {
  const classes = useStyles();

  return (
    <Mutation mutation={SIGNUP}>
      {(signup, { error, loading, data }) => (
        <Fragment>
          <Formik
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              console.log(values);
              const input = {
                username: values.username,
                password: values.password,
                confirmPassword: values.confirmPassword
              };
              try {
                await signup({ variables: { input } });
                actions.setSubmitting(false);
                const { history } = props;
                history.push('/dashboard');
              } catch(err) {
                actions.setSubmitting(false);
                actions.setStatus({ msg: 'This username is already taken, please choose a different one.' })
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
                    Sign up
                  </Typography>
                  <form onSubmit={props.handleSubmit} className={classes.form}>
                    <Grid container spacing={2}>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          id="username"
                          label="Username"
                          name="username"
                          autoComplete="username"
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
                        {props.status && props.status.msg && <div>{props.status.msg}</div>}
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
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
                            props.touched.password &&
                            Boolean(props.errors.password)
                          }
                        />
                      </Grid>
                      <Grid item xs={12}>
                        <TextField
                          variant="outlined"
                          required
                          fullWidth
                          name="confirmPassword"
                          label="Confirm Password"
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
                        <Link href="#" variant="body2">
                          Already have an account? Sign in
                        </Link>
                      </Grid>
                    </Grid>
                  </form>
                </div>
              </Container>
            )}
          </Formik>
        </Fragment>
      )}
    </Mutation>
  );
}

export default SignUp;
