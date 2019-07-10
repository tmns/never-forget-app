import React, { Fragment } from "react";
import { Link } from "react-router-dom";
import Avatar from "@material-ui/core/Avatar";
import Button from "@material-ui/core/Button";
import CssBaseline from "@material-ui/core/CssBaseline";
import TextField from "@material-ui/core/TextField";
import SettingsIcon from "@material-ui/icons/Settings";
import ArrowBackOutlinedIcon from "@material-ui/icons/ArrowBackOutlined";
import Typography from "@material-ui/core/Typography";
import { makeStyles, withStyles } from "@material-ui/core/styles";
import { ThemeProvider } from "@material-ui/styles";
import Container from "@material-ui/core/Container";
import { Formik } from "formik";
import * as Yup from "yup";

import CustomTheme from "../layout/CustomTheme";
import { updateUsername, updatePassword } from "../../apollo/user";

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
  newUsername: "",
  newPassword: "",
  confirmNewPassword: "",
  currentPassword: ""
};

const validationSchema = Yup.object().shape({
  currentPassword: Yup.string().required("Current Password is required!")
});

function Settings({ history }) {
  const classes = useStyles();

  return (
    <Fragment>
      <Formik
        initialValues={initialState}
        validationSchema={validationSchema}
        onSubmit={async (values, actions) => {
          console.log(values);
          if (values.newUsername && values.newPassword) {
            let usernameVars = {
              input: {
                username: values.newUsername,
                password: values.currentPassword
              }
            };
            let passwordVars = {
              input: {
                password: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmNewPassword
              }
            };
            try {
              await updateUsername(usernameVars);
              await updatePassword(passwordVars);
              actions.setSubmitting(false);
              console.log("success");
            } catch (e) {
              console.log(e);
            }
          } else if (values.newUsername) {
            let variables = {
              input: {
                username: values.newUsername,
                password: values.currentPassword
              }
            };
            try {
              await updateUsername(variables);
              actions.setSubmitting(false);
              console.log("success");
            } catch (e) {
              console.log(e);
            }
          } else if (values.newPassword) {
            let variables = {
              input: {
                password: values.currentPassword,
                newPassword: values.newPassword,
                confirmPassword: values.confirmNewPassword
              }
            };
            try {
              await updatePassword(variables);
              actions.setSubmitting(false);
              console.log("success");
            } catch (e) {
              console.log(e);
              actions.setStatus({ msg: "Invalid details." });
            }
          }
          actions.setSubmitting(false);
        }}
      >
        {props => (
          <ThemeProvider theme={CustomTheme}>
            <Container className={classes.arrow}>
              <Link className={classes.link} to="/dashboard">
                <ArrowBackOutlinedIcon />
              </Link>
            </Container>
            <Container component="main" maxWidth="xs">
              <CssBaseline />
              <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                  <SettingsIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                  Settings
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
                    fullWidth
                    id="newUsername"
                    label="New Username"
                    InputLabelProps={{
                      style: {
                        color: CustomTheme.palette.secondary.main
                      }
                    }}
                    name="newUsername"
                    autoComplete="username"
                    autoFocus
                    onChange={props.handleChange}
                    value={props.values.newUsername}
                    helperText={
                      props.touched.newUsername ? props.errors.newUsername : ""
                    }
                    error={
                      props.touched.newUsername &&
                      Boolean(props.errors.newUsername)
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
                    fullWidth
                    name="newPassword"
                    label="New Password"
                    InputLabelProps={{
                      style: {
                        color: CustomTheme.palette.secondary.main
                      }
                    }}
                    type="password"
                    id="newPassword"
                    autoComplete="new-password"
                    onChange={props.handleChange}
                    value={props.values.newPassword}
                    helperText={
                      props.touched.newPassword ? props.errors.newPassword : ""
                    }
                    error={
                      props.touched.newPassword &&
                      Boolean(props.errors.newPassword)
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
                    fullWidth
                    name="confirmNewPassword"
                    label="Confirm New Password"
                    InputLabelProps={{
                      style: {
                        color: CustomTheme.palette.secondary.main
                      }
                    }}
                    type="password"
                    id="confirmNewPassword"
                    autoComplete="confirm-new-password"
                    onChange={props.handleChange}
                    value={props.values.confirmNewPassword}
                    helperText={
                      props.touched.confirmNewPassword
                        ? props.errors.confirmNewPassword
                        : ""
                    }
                    error={
                      props.touched.confirmNewPassword &&
                      Boolean(props.errors.confirmNewPassword)
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
                    Submit
                  </Button>
                </form>
              </div>
            </Container>
          </ThemeProvider>
        )}
      </Formik>
    </Fragment>
  );
}

export default Settings;
