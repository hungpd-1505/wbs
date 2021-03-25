import React from 'react';
import './styles';

export const APILoading = (props) => (
  <span
    className={`loading-wheel ${props.className}`}
    style={{
      width: props.width || 16,
      height: props.height || 16,
    }}
  >
  </span>
);

const LoadingIndicator = () => (
  <div
    style={{
      margin: '2em auto',
      width: '32px',
      height: '32px',
      position: 'relative',
    }}
  >
    <APILoading width={20} height={20} />
  </div>
);

export default LoadingIndicator;
