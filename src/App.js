import React, { useState, useEffect, useRef } from 'react';
import Blog from './components/Blog';
import Message from './components/Message';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlogForm';
import Togglable from './components/Togglable';
import { Typography, Button, Box } from '@material-ui/core/';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  button: {
    marginTop: 10,
    marginBottom: 10,
  },
  appheading: {
    color: 'white',
    backgroundColor: '#3f51b5',
    padding: '10px',
  },
});

const LogoutButton = ({ handleLogout }) => {
  const classes = useStyles();
  return (
    <Button
      className={classes.button}
      color='primary'
      variant='contained'
      onClick={handleLogout}
    >
      Logout
    </Button>
  );
};

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [infoMessage, setInfoMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);

  const addBlogFormRef = useRef();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
  }, []);

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUser(user);
      blogService.setToken(user.token);
    }
  }, []);

  const addBlog = async (newObject) => {
    try {
      addBlogFormRef.current.toggleVisibility();
      await blogService.create(newObject);
      await blogService.getAll().then((blogs) => setBlogs(blogs));
      setInfoMessage({
        content: `added a new blog: '${newObject.title}' by ${newObject.author}`,
        type: 'info',
      });
      setTimeout(() => {
        setInfoMessage(null);
      }, 5000);
    } catch (exception) {
      setInfoMessage({
        content: 'Something went wrong, blog was not added',
        type: 'error',
      });
      setTimeout(() => {
        setInfoMessage(null);
      }, 5000);
    }
  };

  const updateBlog = async (id, newObject) => {
    try {
      await blogService.update(id, newObject);
      await blogService.getAll().then((blogs) => setBlogs(blogs));
    } catch (exception) {
      setInfoMessage({
        content: 'Something went wrong, blog was not UPDATED',
        type: 'error',
      });
      setTimeout(() => {
        setInfoMessage(null);
      }, 5000);
    }
  };

  const deleteBlog = async (id) => {
    try {
      await blogService.remove(id);
      await blogService.getAll().then((blogs) => setBlogs(blogs));
      setInfoMessage({
        content: 'removed blog',
        type: 'info',
      });
    } catch (exception) {
      setInfoMessage({
        content: 'wrong credentials',
        type: 'error',
      });
      setTimeout(() => {
        setInfoMessage(null);
      }, 5000);
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    console.log('logging in with ', username, password);

    try {
      const user = await loginService.login({
        username,
        password,
      });
      window.localStorage.setItem('loggedBlogUser', JSON.stringify(user));
      blogService.setToken(user.token);
      setUser(user);
      setUsername('');
      setPassword('');
    } catch (exception) {
      setInfoMessage({
        content: 'wrong credentials',
        type: 'error',
      });
      setTimeout(() => {
        setInfoMessage(null);
      }, 5000);
    }
  };

  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
  };
  const classes = useStyles();

  if (user === null) {
    return (
      <Box maxWidth={300} m={2} mx='auto'>
        <Typography variant='h4' className={classes.appheading}>
          <strong>Simple Blog List</strong>
        </Typography>
        <Message msg={infoMessage} />
        <LoginForm
          username={username}
          password={password}
          handleUsernameChange={({ target }) => setUsername(target.value)}
          handlePasswordChange={({ target }) => setPassword(target.value)}
          handleLogin={handleLogin}
        />
      </Box>
    );
  }

  const blogForm = () => (
    <Togglable
      viewButtonLabel='Add blog'
      hideButtonLabel='cancel'
      ref={addBlogFormRef}
    >
      <AddBlogForm createBlog={addBlog} />
    </Togglable>
  );

  return (
    <Box maxWidth={300} m={2} mx='auto'>
      <Typography variant='h4' className={classes.appheading}>
        <strong>Simple Blog List</strong>
      </Typography>

      <Typography variant='body1'>Logged in as {user.name}</Typography>
      <LogoutButton handleLogout={handleLogout} />

      {blogs
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            deleteBlog={deleteBlog}
            updateBlog={updateBlog}
          />
        ))}

      <Message msg={infoMessage} />
      {blogForm()}
      {/* <Togglable buttonLabel='add'>
        <AddBlogForm createBlog={addBlog} />
      </Togglable> */}
    </Box>
  );
};

export default App;
