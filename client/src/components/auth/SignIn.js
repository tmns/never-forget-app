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

const SIGNIN = gql`
  mutation signin($input: LoginUserInput!) {
    login(input: $input) {
      username
      _id
    }
  }
`;

function SignIn(props) {
  const classes = useStyles();

  return (
    <Mutation mutation={SIGNIN}>
      {(signin, { error, loading, data }) => (
        <Fragment>
          <Formik
            initialValues={initialState}
            validationSchema={validationSchema}
            onSubmit={async (values, actions) => {
              console.log(values);
              const input = {
                username: values.username,
                password: values.password
              };
              try {
                await signin({ variables: { input } });
                actions.setSubmitting(false);
                const { history } = props;
                history.push("/dashboard");
              } catch (err) {
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
                    <Grid container>
                      <Grid item>
                        <Link href="#" variant="body2">
                          {"Don't have an account? Sign Up"}
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

export default SignIn;
