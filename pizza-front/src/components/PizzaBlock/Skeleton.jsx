import React from 'react';
import ContentLoader from 'react-content-loader';

const Skeleton = () => (
  <ContentLoader
    className="pizza-block"
    speed={2}
    width={280}
    height={460}
    viewBox="0 0 280 500"
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb">
    <circle cx="130" cy="124" r="125" />
    <rect x="-4" y="270" rx="10" ry="10" width="280" height="20" />
    <rect x="2" y="310" rx="10" ry="10" width="280" height="88" />
    <rect x="-4" y="419" rx="10" ry="10" width="95" height="30" />
    <rect x="127" y="413" rx="25" ry="25" width="152" height="45" />
  </ContentLoader>
);

export default Skeleton;
