import React from 'react';
import { Carousel } from 'antd';
import styled from 'styled-components';
// import banner1 from 'assets/image/banner1.jpg';
// import banner2 from 'assets/image/banner2.jpg';
// import banner3 from 'assets/image/banner3.jpg';
// import banner4 from 'assets/image/banner4.jpg';

const BannerWrapper = styled.div`
  height: 40vh;
  img {
    width: 100%;
    height: 100%;
  }
`;
// const Arrow = ({ type, style, className, onClick }) => (
//   <Icon type={type} style={style} className={className} onClick={onClick} />
// );

const Banner: React.FC = () => (
  <>
    <Carousel effect="fade" autoplay dots>
      {/* <div>
        <img src={banner1} alt="banner" />
      </div>
      <div>
        <img src={banner2} alt="banner" />
      </div>
      <div>
        <img src={banner3} alt="banner" />
      </div>
      <div>
        <img src={banner4} alt="banner" />
      </div> */}
    </Carousel>
  </>
);

export default Banner;
