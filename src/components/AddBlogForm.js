import React, { useState } from 'react';
import { Typography, Button, Box, TextField } from '@material-ui/core/';

const AddBlogForm = ({ createBlog }) => {
  const [newTitle, setNewTitle] = useState('');
  const [newAuthor, setNewAuthor] = useState('');
  const [newUrl, setNewUrl] = useState('');

  const handleTitleChange = (event) => {
    setNewTitle(event.target.value);
  };
  const handleAuthorChange = (event) => {
    setNewAuthor(event.target.value);
  };
  const handleUrlChange = (event) => {
    setNewUrl(event.target.value);
  };

  const createNewBlog = (event) => {
    event.preventDefault();
    createBlog({
      title: newTitle,
      author: newAuthor,
      url: newUrl,
    });
    setNewAuthor('');
    setNewTitle('');
    setNewUrl('');
  };
  return (
    <Box maxWidth={300} m={2} mx='auto'>
      <Typography variant='h5'>Add new blog</Typography>
      <form onSubmit={createNewBlog}>
        <TextField
          required
          id='title'
          label='Title'
          value={newTitle}
          onChange={handleTitleChange}
          fullWidth
        />{' '}
        <TextField
          id='author'
          label='Author'
          value={newAuthor}
          onChange={handleAuthorChange}
          fullWidth
        />
        <TextField
          id='url'
          label='url'
          value={newUrl}
          onChange={handleUrlChange}
          fullWidth
        />
        <Button variant='contained' type='submit'>
          save
        </Button>
      </form>
    </Box>
  );
};
export default AddBlogForm;
