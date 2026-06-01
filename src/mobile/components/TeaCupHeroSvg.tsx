import React from 'react';

const TeaCupHeroSvg: React.FC<{ className?: string }> = ({ className }) => (
  <svg className={className} viewBox="0 0 188 130" fill="none" aria-hidden>
    <path
      d="M44 58c0-7 5-13 12-14l89-8c8-.8 15 5.6 15 13.7v42.8c0 8.6-7 15.5-15.6 15.5H60.1C51.2 108 44 100.8 44 92V58Z"
      fill="#ff980f"
    />
    <path
      d="M160 58h18c8 0 14 6.2 14 14v18c0 7.8-6.2 14-14 14h-18"
      stroke="#ff980f"
      strokeWidth="13"
      strokeLinejoin="round"
    />
    <rect x="70" y="49" width="54" height="35" rx="6" fill="#fffaf0" />
    <rect x="122" y="76" width="36" height="30" rx="6" fill="#fffaf0" />
    <rect x="164" y="71" width="24" height="34" rx="5" fill="#fffaf0" />
    <path d="M72 107h77v11H72v-11Z" fill="#ff980f" />
    <path d="M85 118h48" stroke="#ff980f" strokeWidth="11" strokeLinecap="round" />
    <path
      d="M131 23c15-22-13-18 2-38M159 25c15-22-13-18 2-38"
      stroke="#ff980f"
      strokeWidth="13"
      strokeLinecap="round"
    />
  </svg>
);

export default TeaCupHeroSvg;
