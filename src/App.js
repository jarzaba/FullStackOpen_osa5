import React, { useState, useEffect, useRef } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  useRouteMatch,
  Redirect,
  useHistory,
} from 'react-router-dom';
import Blog from './components/Blog';
import Message from './components/Message';
import blogService from './services/blogs';
import loginService from './services/login';
import LoginForm from './components/LoginForm';
import AddBlogForm from './components/AddBlogForm';
import Togglable from './components/Togglable';
import ButtonAppBar from './components/ButtonAppBar';
import { Box, Fab } from '@material-ui/core/';
import AddIcon from '@material-ui/icons/Add';
import { makeStyles } from '@material-ui/core/styles';
import BlogDetails from './components/BlogDetails';

const useStyles = makeStyles((theme) => ({
  fab: {
    position: 'fixed',
    top: theme.spacing(6),
    right: theme.spacing(2),
  },
  navbar: {
    position: 'fixed',
    top: theme.spacing(0),
  },
}));

const App = () => {
  const [blogs, setBlogs] = useState([]);
  const [infoMessage, setInfoMessage] = useState(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null);
  //const [selectedBlog, setSelectedBlog] = useState(null);

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
      setTimeout(() => {
        setInfoMessage(null);
      }, 5000);
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
  let history = useHistory();
  const handleLogout = () => {
    window.localStorage.clear();
    setUser(null);
    history.push('/');
  };

  const blogForm = () => (
    <Togglable
      viewButtonLabel='Add blog'
      hideButtonLabel='cancel'
      ref={addBlogFormRef}
    >
      <AddBlogForm createBlog={addBlog} />
    </Togglable>
  );

  const classes = useStyles();

  const match = useRouteMatch('/blogs/:id');

  console.log('blogs', blogs);
  console.log('selected blog', window.localStorage.getItem('blog'));

  const blog = match ? blogs.find((blog) => blog.id === match.params.id) : null;

  blog != null && window.localStorage.setItem('blog', JSON.stringify(blog));

  console.log('selected blog', window.localStorage.getItem('blog'));

  return (
    <Box maxWidth={480} mt={0} mx='auto'>
      <ButtonAppBar handleLogout={handleLogout} user={user ? user : null} />
      <Message msg={infoMessage} />
      <Switch>
        <Route path='/blogs/:id'>
          <BlogDetails />
        </Route>
        <Route path='/blogs'>
          {user === null ? (
            <LoginForm
              username={username}
              password={password}
              handleUsernameChange={({ target }) => setUsername(target.value)}
              handlePasswordChange={({ target }) => setPassword(target.value)}
              handleLogin={handleLogin}
            />
          ) : (
            <div>
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
            </div>
          )}
        </Route>
        <Route path='/'>
          <Redirect to='/blogs' />
        </Route>
      </Switch>

      {/* {user === null ? (
          <LoginForm
            username={username}
            password={password}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            handleLogin={handleLogin}
          />
        ) : (
          <div>
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
          </div>
        )} */}
      <Fab color='primary' aria-label='add' className={classes.fab}>
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default App;
