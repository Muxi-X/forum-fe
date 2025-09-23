import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useProfile from 'store/useProfile';
import moment from 'utils/moment';

const QuickNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userProfile: { role, id },
  } = useProfile();

  const isMuxi = role?.includes('Muxi');

  useEffect(() => {
    if (!isMuxi) {
      navigate('/', { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const title = params.get('title') || '';
    const draftId = 'draft_' + moment(new Date().getTime()).format('YYYYMMDDHHmmssSSS');
    navigate(`/editor/${draftId}`, { state: { title, fromQuickNew: true } });
  }, [location, isMuxi, navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      正在跳转到新建文档编辑页...
    </div>
  );
};

export default QuickNew;
