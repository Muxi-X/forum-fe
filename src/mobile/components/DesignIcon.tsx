import React from 'react';
import styled from 'styled-components';

type IconName =
  | 'home'
  | 'teaReview'
  | 'user'
  | 'post'
  | 'star'
  | 'feedback'
  | 'power'
  | 'like'
  | 'comment'
  | 'bookmark'
  | 'search'
  | 'image'
  | 'close'
  | 'warning'
  | 'chevronDown'
  | 'chevronUp'
  | 'chevronRight'
  | 'more';

const Svg = styled.svg`
  display: block;
  overflow: visible;
`;

const strokeProps = {
  fill: 'none',
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
};

const DesignIcon: React.FC<{
  name: IconName;
  active?: boolean;
  size?: number;
  color?: string;
}> = ({ name, active, size = 24, color }) => {
  const ink = color || (active ? '#3d3d3d' : '#7f838a');
  const orange = '#fe9800';

  if (name === 'home') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path {...strokeProps} d="M3.5 10.6 12 4l8.5 6.6" stroke={ink} strokeWidth="1.35" />
        <path
          {...strokeProps}
          d="M5.8 10.2v8.7h4.1v-5.3h4.2v5.3h4.1v-8.7"
          stroke={ink}
          strokeWidth="1.35"
        />
      </Svg>
    );
  }

  if (name === 'teaReview') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          {...strokeProps}
          d="M6.2 3.2h9.9l2.4 2.5v15.1H6.2z"
          stroke={ink}
          strokeWidth="1.35"
        />
        <path {...strokeProps} d="M15.9 3.5v2.7h2.6" stroke={ink} strokeWidth="1.2" />
        <path {...strokeProps} d="M8.8 9.1h6.5M8.8 12.2h6.5M8.8 15.3h5" stroke={ink} strokeWidth="1.2" />
      </Svg>
    );
  }

  if (name === 'user') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path {...strokeProps} d="M12 12.1a4.1 4.1 0 1 0 0-8.2 4.1 4.1 0 0 0 0 8.2Z" stroke={ink} strokeWidth="1.35" />
        <path {...strokeProps} d="M4.7 21c.7-4.1 3.3-6.4 7.3-6.4s6.6 2.3 7.3 6.4" stroke={ink} strokeWidth="1.35" />
      </Svg>
    );
  }

  if (name === 'post') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect {...strokeProps} x="5.2" y="3.4" width="13.6" height="17.2" rx="1.5" stroke={ink} strokeWidth="1.35" />
        <path {...strokeProps} d="M8.2 8h7.8M8.2 11h6.2M8.2 14h5" stroke={ink} strokeWidth="1.2" />
        <path d="M8.1 5.4h7.7v2.2H8.1z" fill="#ffc641" />
      </Svg>
    );
  }

  if (name === 'star') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          {...strokeProps}
          d="m12 3.9 2.4 4.9 5.4.8-3.9 3.8.9 5.4-4.8-2.5-4.8 2.5.9-5.4-3.9-3.8 5.4-.8z"
          stroke={ink}
          strokeWidth="1.35"
        />
        <circle cx="9" cy="13.8" r="2.1" fill="#ffc641" />
      </Svg>
    );
  }

  if (name === 'feedback') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect {...strokeProps} x="5.1" y="5.4" width="12.2" height="13.6" rx="1.6" stroke={ink} strokeWidth="1.35" />
        <path {...strokeProps} d="m13.6 4.5 1.7-1.7 2.1 2.1-1.7 1.7-2.8.7z" stroke={orange} strokeWidth="1.35" />
      </Svg>
    );
  }

  if (name === 'power') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path {...strokeProps} d="M12 4.2v7.1" stroke={orange} strokeWidth="1.5" />
        <path {...strokeProps} d="M8 6.8a7.2 7.2 0 1 0 8 0" stroke={ink} strokeWidth="1.35" />
      </Svg>
    );
  }

  if (name === 'like') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          {...strokeProps}
          d="M7.4 10.2v9.1H4.2v-9.1zM7.7 18.9h8.7c1.2 0 2.1-.7 2.4-1.8l1.1-5.1c.2-.9-.5-1.8-1.5-1.8h-5.1l.7-3.4c.2-.9-.4-1.8-1.3-1.8h-.3l-4.7 5.3"
          stroke={ink}
          strokeWidth="1.45"
        />
      </Svg>
    );
  }

  if (name === 'comment') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          {...strokeProps}
          d="M5 6.5h14v8.7H9.1l-4.1 3.1z"
          stroke={ink}
          strokeWidth="1.45"
        />
        <path {...strokeProps} d="M8.3 9.7h7.5M8.3 12.4h4.9" stroke={ink} strokeWidth="1.2" />
      </Svg>
    );
  }

  if (name === 'bookmark') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          {...strokeProps}
          d="M7.1 4.3h9.8v15.4L12 16.5l-4.9 3.2z"
          stroke={ink}
          strokeWidth="1.45"
        />
      </Svg>
    );
  }

  if (name === 'search') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <circle {...strokeProps} cx="10.8" cy="10.8" r="5.8" stroke={ink} strokeWidth="1.45" />
        <path {...strokeProps} d="m15.2 15.2 4.1 4.1" stroke={ink} strokeWidth="1.45" />
      </Svg>
    );
  }

  if (name === 'image') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <rect {...strokeProps} x="4.4" y="5.2" width="15.2" height="13.6" rx="1.6" stroke={ink} strokeWidth="1.4" />
        <path {...strokeProps} d="m6.8 16.1 3.6-3.8 2.7 2.5 2-2.2 2.6 3.5" stroke={orange} strokeWidth="1.35" />
        <circle cx="15.7" cy="8.9" r="1.3" fill={orange} />
      </Svg>
    );
  }

  if (name === 'close') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <circle cx="12" cy="12" r="9" fill="#f05d5e" />
        <path {...strokeProps} d="m8.7 8.7 6.6 6.6M15.3 8.7l-6.6 6.6" stroke="#fff" strokeWidth="1.8" />
      </Svg>
    );
  }

  if (name === 'warning') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path {...strokeProps} d="M12 4.3 21 19H3z" stroke={ink} strokeWidth="1.35" />
        <path {...strokeProps} d="M12 9v4.6" stroke={orange} strokeWidth="1.5" />
        <circle cx="12" cy="16.2" r="1" fill={orange} />
      </Svg>
    );
  }

  if (name === 'chevronRight') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path d="M9 6.2 15.4 12 9 17.8" fill="none" stroke="#c6c6c6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </Svg>
    );
  }

  if (name === 'chevronUp' || name === 'chevronDown') {
    return (
      <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
        <path
          d={name === 'chevronUp' ? 'M6 15.2 12 8.8l6 6.4' : 'M6 8.8 12 15.2l6-6.4'}
          fill="#c6c6c6"
        />
      </Svg>
    );
  }

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" aria-hidden>
      <circle cx="6" cy="12" r="1.5" fill={orange} />
      <circle cx="12" cy="12" r="1.5" fill={orange} />
      <circle cx="18" cy="12" r="1.5" fill={orange} />
    </Svg>
  );
};

export default DesignIcon;
