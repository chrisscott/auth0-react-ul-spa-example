import React, { useState } from 'react';
import Avatar from '@material-ui/core/Avatar';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import Alert from '@material-ui/lab/Alert'
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import { Formik, Form, Field } from 'formik';
import { Button, LinearProgress } from '@material-ui/core';
import { TextField } from 'formik-material-ui';
import auth0 from 'auth0-js';

const { config } = window;

const params = Object.assign({
  overrides: {
    __tenant: config.auth0Tenant,
    __token_issuer: config.authorizationServer.issuer
  },
  domain: config.auth0Domain,
  clientID: config.clientID,
  redirectUri: config.callbackURL,
  responseType: 'code'
}, config.internalOptions);

const webAuth = new auth0.WebAuth(params);

const databaseConnection = 'Username-Password-Authentication';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

export default function App() {
  const classes = useStyles();
  const [errorMessage, setErrorMessage] = useState();
  const [formAction, setFormAction] = useState('signin');

  const signIn = ({username, password}, { setSubmitting }) => {
    webAuth.login({
      realm: databaseConnection,
      username,
      password
    }, function(err) {
      if (err) {
        console.log(err.description);
        setErrorMessage(err.description);
      }
      setSubmitting(false);
    });
  }

  const signUp = ({username, password}, { setSubmitting }) => {
    webAuth.redirect.signupAndLogin({
        connection: databaseConnection,
        email: username,
        password
      }, function(err) {
        if (err) {
          console.log(err.description);
          setErrorMessage(err.description);
        }
        setSubmitting(false);
      });
  }

  let submitHandler;
  if (formAction === 'signup') {
    submitHandler = signUp;
  } else {
    submitHandler = signIn;
  }

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign {formAction === 'signin' && <>In</>}{formAction === 'signup' && <>Up</>}
        </Typography>
        {errorMessage && <Alert severity="error">{errorMessage}</Alert> }
        <Formik
          initialValues={{
            username: '',
            password: '',
          }}
          validate={values => {
            const errors = {};
            if (!values.password) {
              errors.password = 'Required';
            }
            if (!values.username) {
              errors.username = 'Required';
            } else if (
              !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(values.username)
            ) {
              errors.username = 'Invalid email address';
            }
            return errors;
          }}
          onSubmit={submitHandler}
        >
          {({ submitForm, isSubmitting }) => (
            <Form className={classes.form}>
              <Field
                component={TextField}
                name="username"
                type="email"
                label="Email"
                autoFocus
                autoComplete="email"
                required
                fullWidth
              />
              <br />
              <Field
                component={TextField}
                type="password"
                label="Password"
                name="password"
                fullWidth
                required
              />
              {isSubmitting && <LinearProgress />}
              <br />
              <Button
                type="submit"
                variant="contained"
                color="primary"
                disabled={isSubmitting}
                onClick={submitForm}
                fullWidth
                className={classes.submit}
              >
                Sign {formAction === 'signin' && <>In</>}{formAction === 'signup' && <>Up</>}
              </Button>
            </Form>
          )}
        </Formik>
        <Button
          color="link"
          onClick={() => formAction === 'signin' ? setFormAction('signup') : setFormAction('signin')}
        >
          Sign {formAction === 'signin' && <>Up</>}{formAction === 'signup' && <>In</>}
        </Button>
      </div>
    </Container>
  );
}
