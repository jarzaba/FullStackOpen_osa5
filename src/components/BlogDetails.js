import React from 'react';
import { Box, Typography } from '@material-ui/core/';

const BlogDetails = () => {
  const blog = JSON.parse(window.localStorage.getItem('blog'));
  console.log(
    'selected blog in blog details',
    JSON.parse(window.localStorage.getItem('blog'))
  );

  return (
    <Box m={4}>
      <Typography variant='overline'>{blog.author}</Typography>
      <Typography variant='h4'>{blog.title}</Typography>
      <Typography variant='body1'>{blog.url}</Typography>
      <Typography variant='body1'>Likes: {blog.likes}</Typography>
    </Box>
  );
};

export default BlogDetails;
