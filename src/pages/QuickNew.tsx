import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useProfile from 'store/useProfile';
import useRequest from 'hooks/useRequest';
import moment from 'utils/moment';

const QuickNew: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const {
    userProfile: { role, id },
  } = useProfile();
  const [isLoading, setIsLoading] = useState(true);

  const isMuxi = role?.includes('Muxi');
  useEffect(() => {
    const checkUserProfile = () => {
      // 检查一下token防止有人没登录过茶馆 直接从招新系统跳过来
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login', { replace: true });
        return;
      }
      if (role === undefined) {
        return;
      }
      setIsLoading(false);
    };

    checkUserProfile();
  }, [role, navigate]);

  const { run: searchPosts } = useRequest(API.post.getPostListByDomain.request, {
    manual: true,
    onSuccess: (res) => {
      const params = new URLSearchParams(location.search);
      const title = params.get('title') || '';

      // 这个用来匹配标题 判断是否已经存在
      const existingPost = res.data.posts?.find((post: any) => post.title === title);

      if (existingPost) {
        // 如果找到已存在的文档，判断是否可编辑
        if (existingPost.creator_id === id) {
          // 如果是当前用户创建的，跳转到编辑页面
          navigate(`/editor/${existingPost.id}`, { state: { isUpdate: true } });
        } else {
          // 如果不是当前用户创建的，跳转到查看页面
          navigate(`/article/${existingPost.id}`);
        }
      } else {
        // 如果没有找到，创建新文档
        const draftId = 'article' + new Date().getTime();
        navigate(`/editor/${draftId}`, { state: { title, fromQuickNew: true } });
      }
    },
    onError: () => {
      const params = new URLSearchParams(location.search);
      const title = params.get('title') || '';
      const draftId = 'article' + new Date().getTime();
      navigate(`/editor/${draftId}`, { state: { title, fromQuickNew: true } });
    },
  });

  useEffect(() => {
    // 等待用户信息加载完成
    if (isLoading) {
      return;
    }

    if (!isMuxi) {
      navigate('/', { replace: true });
      return;
    }

    const params = new URLSearchParams(location.search);
    const title = params.get('title') || '';

    if (title) {
      // 搜索是否已存在相同标题的文档
      searchPosts({
        domain: 'muxi',
        search_content: title,
        limit: 20,
        page: 0,
      });
    } else {
      // 没有标题时直接创建新文档
      const draftId = 'article' + new Date().getTime();
      navigate(`/editor/${draftId}`, { state: { title: '', fromQuickNew: true } });
    }
  }, [location, isMuxi, navigate, isLoading, searchPosts]);

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', marginTop: '100px' }}>正在加载用户信息...</div>
    );
  }

  return (
    <div style={{ textAlign: 'center', marginTop: '100px' }}>
      正在检查是否已存在相同标题的文档...
    </div>
  );
};

export default QuickNew;
