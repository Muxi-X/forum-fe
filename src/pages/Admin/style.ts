import styled from 'styled-components';
import media from 'styles/media';

export const Wrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
`;

export const Info = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

export const Action = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
`;
export const Detail = styled.div`
  margin-left: 2rem;
  font-size: 1.5rem;
  user-select: none;
`;
export const Filed = styled.div`
  margin: 0.5rem 0;
  max-width: 450px;
  ${media.tablet`max-width: 300px`}
  ${media.phone`max-width: 150px`}
`;
