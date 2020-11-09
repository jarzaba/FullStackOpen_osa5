import React from 'react';
import PropTypes from 'prop-types';
import { Box, Button, Typography, TextField } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
});

const LoginForm = ({
  username,
  handleLogin,
  password,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  const classes = useStyles();

  return (
    <Box mt={2}>
      <Typography variant='h6'>Log in to application</Typography>
      <form onSubmit={handleLogin}>
        <TextField
          type='text'
          label='username'
          id='username'
          value={username}
          name='Username'
          onChange={handleUsernameChange}
          fullWidth
        />
        <TextField
          type='password'
          label='password'
          id='password'
          value={password}
          name='Password'
          onChange={handlePasswordChange}
          fullWidth
        />
        <Button
          className={classes.button}
          variant='contained'
          color='primary'
          type='submit'
          id='login-button'
          fullWidth
        >
          login
        </Button>
      </form>
    </Box>
  );
};
LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
  handleUsernameChange: PropTypes.func.isRequired,
  handlePasswordChange: PropTypes.func.isRequired,
  username: PropTypes.string.isRequired,
  password: PropTypes.string.isRequired,
};
export default LoginForm;
