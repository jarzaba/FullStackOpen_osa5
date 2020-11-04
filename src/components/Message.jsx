import React from 'react';
import Alert from '@material-ui/lab/Alert';
import '../styles/blog-list.css';

const Message = ({ msg }) => {
  if (msg === null) {
    return null;
  }

  return <Alert severity={msg.type}>{msg.content}</Alert>;
};

export default Message;
