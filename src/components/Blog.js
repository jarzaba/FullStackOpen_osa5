import React, { useState } from 'react';

const Blog = ({ blog, deleteBlog, updateBlog }) => {
  const [likes, setLikes] = useState(false);
  const [showBlogInfo, setShowBlogInfo] = useState(false);

  const blogStyle = {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5,
  };

  const logged = JSON.parse(window.localStorage.getItem('loggedBlogUser'));

  const likeBlog = (blog) => {
    const newObject = {
      user: blog.user.id,
      likes: blog.likes,
      author: blog.author,
      title: blog.title,
      url: blog.url,
    };
    likes
      ? (newObject.likes = blog.likes - 1)
      : (newObject.likes = blog.likes + 1);

    setLikes(!likes);

    return updateBlog(blog.id, newObject);
  };

  const delBlog = (id, title) => {
    if (window.confirm(`Do you really want to delete blog '${title}'`)) {
      deleteBlog(id);
    }
  };
  return (
    <div style={blogStyle}>
      <div>
        <span>{blog.title}</span>
        <span>{blog.author}</span>
        <button className='view' onClick={() => setShowBlogInfo(!showBlogInfo)}>
          {!showBlogInfo ? 'view' : 'hide'}
        </button>
      </div>

      {showBlogInfo && (
        <div>
          <br />
          <span>{blog.url}</span>
          <br />
          <span>likes: {blog.likes}</span>
          <button className='like' onClick={() => likeBlog(blog)}>
            {likes ? 'Dislike' : 'Like'}
          </button>
          <br />
          {blog.user.name === undefined ? '' : `added by: ${blog.user.name}`}
          {blog.user.username === logged.username && (
            <button
              className='del'
              onClick={() => delBlog(blog.id, blog.title)}
            >
              Delete
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default Blog;
