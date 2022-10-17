import React from 'react';
import { Card, Button, message } from 'antd';
import styled from 'styled-components';
import Avatar from 'components/Avatar/avatar';
import media from 'styles/media';
import * as style from './style';
import useDocTitle from 'hooks/useDocTitle';
import useRequest from 'hooks/useRequest';
import Loading from 'components/Loading';
import { Link } from 'react-router-dom';
import Back from 'pages/User/component/back';
import moment from 'moment';

const WrapperCard = styled(Card)`
  padding: 0 30px;
  .ant-card-body {
    height: 100%;
    ${media.desktop`padding: 24px 15px`}
    ${media.tablet`padding: 24px 10px`}
  }
  ${media.tablet`padding: 0`}
`;

const Time = styled.div`
  font-size: 0.8rem;
  color: #8a919f;
`;

type Result = 'invalid' | 'valid';

const ReportItem: React.FC<{ report: defs.report_Report }> = ({ report }) => {
  const {
    user_avatar,
    user_name,
    user_id,
    post_title,
    post_id,
    be_reported_user_id,
    be_reported_user_name,
    cause,
    create_time,
    id,
  } = report;
  const { run } = useRequest(API.report.putReport.request, {
    manual: true,
    onSuccess: () => {
      message.success('处理成功!');
    },
  });
  const handleReport = (result: Result, id: number) => {
    run({}, { result, id });
  };
  return (
    <style.Wrapper>
      <style.Info>
        <Avatar src={user_avatar} size="mid" />
        <style.Detail>
          <style.Filed>
            举报人: <Link to={`/user/${user_id}`}>{user_name}</Link>
          </style.Filed>
          <style.Filed>
            举报帖子: <Link to={`/article/${post_id}`}>{`《${post_title}》`}</Link>
          </style.Filed>
          <style.Filed>
            被举报人:
            <Link to={`/user/${be_reported_user_id}`}>{be_reported_user_name}</Link>
          </style.Filed>
          <style.Filed>举报原因:{cause}</style.Filed>
        </style.Detail>
      </style.Info>
      <style.Action>
        <Time>{moment(create_time).format('YYYY-MM-DD  HH:mm:SS')}</Time>
        <Button
          type="primary"
          onClick={() => {
            handleReport('valid', id as number);
          }}
        >
          删除违规帖
        </Button>
        <Button
          onClick={() => {
            handleReport('invalid', id as number);
          }}
          type="ghost"
        >
          无违规
        </Button>
      </style.Action>
    </style.Wrapper>
  );
};

const Admin: React.FC = () => {
  useDocTitle(`明察秋毫 - 论坛`);
  const { data: res, loading } = useRequest(API.report.getReportList.request);

  return (
    <>
      {loading ? (
        <Loading />
      ) : res?.data.reports?.length === 0 ? (
        <Card>暂时没有举报信息</Card>
      ) : (
        <>
          <Back />
          {res?.data.reports?.map((report) => (
            <>
              <WrapperCard key={report.id}>
                <ReportItem report={report} />
              </WrapperCard>
            </>
          ))}
        </>
      )}
    </>
  );
};

export default Admin;
