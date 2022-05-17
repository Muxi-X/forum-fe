import React from 'react';
import { useOutlet } from 'react-router';

const Info: React.FC = () => {
  return (
    <>
      Info
      <div>{useOutlet()}</div>
    </>
  );
};

export default Info;
