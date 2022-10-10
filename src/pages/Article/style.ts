import styled from 'styled-components';

export const Wrapper = styled.div``;

export const ArticleBody = styled.article`
  width: 100%;
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
`;

export const Name = styled.div`
  font-size: 1.2em;
  font-weight: 500;
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
`;