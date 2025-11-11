import styled from 'styled-components';
import media from 'styles/media';

export const UserWrapper = styled.div``;

export const Info = styled.div`
  display: flex;
  width: 1;
  align-items: center;
  flex: 2;

  ${media.phone`
    flex-direction: row;
    align-items: flex-start;
    gap: 12px;
  `}
`;

export const NameAndSign = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 1em;
  font-size: 1.5em;

  ${media.phone`
      margin-left: 0em;
      margin-top: 0.25em;
  `}

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

  ${media.phone`
      flex-direction: column;
      height: auto;
      justify-content: flex-start;
      align-items: flex-start;
      margin-left: 8px;

      & > button {
        margin-top: 8px;
        width: 100%;
      }

      max-width: 36%;
  `}
`;
