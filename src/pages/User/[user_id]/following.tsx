import React from 'react';
import { Navigate, useParams } from 'react-router-dom';
import { useDeviceType } from 'hooks/useDeviceType';
import MobileFollowList from 'mobile/pages/FollowList';

const Following: React.FC = () => {
  const { user_id } = useParams();
  const isPhone = useDeviceType() === 'phone';
  return isPhone ? <MobileFollowList /> : <Navigate to={`/user/${user_id}`} replace />;
};

export default Following;
