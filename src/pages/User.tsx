import React from 'react';
import { useOutlet } from 'react-router-dom';

const User: React.FC = () => {
  return (
    <>
      User
      <div>{useOutlet()}</div>
    </>
  );
};

export default User;
