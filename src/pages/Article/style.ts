import styled from 'styled-components';
import { Card } from 'antd';
import media from 'styles/media';

export const Wrapper = styled.div`
  position: relative;
  width: 100%;
`;

export const ArticleBody = styled.article`
  width: 100%;
  padding: 0 2em;

  ${media.tablet`
    padding: 0 1.2em;
  `}

  ${media.phone`
    padding: 0 1em;
  `}
`;

export const Back = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-around;
  font-size: 2em;

  div {
    cursor: pointer;
  }
`;

export const CreatorInfo = styled.div`
  width: fit-content;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .info {
    margin-left: 1em;
  }

  ${media.phone`
    flex-direction: row;
    align-items: center;
    .info {
      margin-left: 0.5em;
    }
  `}
`;

export const Name = styled.div`
  font-size: 1.2em;
  font-weight: 500;

  ${media.phone`
    font-size: 1em;
  `}
`;

export const Time = styled.div`
  font-size: 0.6rem;
  font-weight: 500;
  color: #8a919f;
  letter-spacing: 1px;
`;

export const ArticleInfo = styled.div`
  margin: 3em 0;
  width: fit-content;

  ${media.tablet`
    margin: 2em 0;
  `}

  ${media.phone`
    margin: 1.5em 0;
  `}
`;

export const Navigation = styled(Card)`
  height: 300px;
  width: 350px;
  overflow: scroll;
  position: sticky;
  top: 0vh;

  ${media.tablet`
    display: none;
  `}
  ${media.phone`
    display: none;
  `}
`;

export const ArticleCard = styled(Card)`
  width: 100%;
  padding-left: 2em;
  padding-right: 2em;
  margin-bottom: 1em;

  a {
    cursor: pointer;
  }

  h1 {
    font-size: 2.4em;
    ${media.tablet`font-size: 2em;`}
    ${media.phone`font-size: 1.6em;`}
  }

  .ant-image {
    position: absolute;
    visibility: hidden;
  }

  ${media.phone`
    padding-left: 1em;
    padding-right: 1em;
  `}
`;
