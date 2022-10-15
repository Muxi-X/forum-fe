import styled from 'styled-components';

export const UserWrapper = styled.div``;

export const Info = styled.div`
  display: flex;
  width: 1;
  align-items: center;
  flex: 2;
`;

export const NameAndSign = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
  font-size: 1.5em;

  .user-signature {
    color: gray;
    font-size: 0.8em;
  }
`;

export const Links = styled.div`
  width: 50%;
  display: flex;
  justify-content: space-between;
  margin-top: 3em;
`;

export const Tools = styled.div`
  flex: 2;
  display: flex;
  justify-content: space-around;
`;
