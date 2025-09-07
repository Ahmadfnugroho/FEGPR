import React from 'react';

interface SkipLinkProps {
  targetId: string;
  children: React.ReactNode;
}

const SkipLink: React.FC<SkipLinkProps> = ({ targetId, children }) => {
  return (
    <a
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-50 focus:px-4 focus:py-2 focus:bg-navy-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg"
      style={{
        position: 'absolute',
        left: '-10000px',
        top: 'auto',
        width: '1px',
        height: '1px',
        overflow: 'hidden'
      }}
      onFocus={(e) => {
        const target = e.target as HTMLAnchorElement;
        target.style.position = 'absolute';
        target.style.left = '1rem';
        target.style.top = '1rem';
        target.style.width = 'auto';
        target.style.height = 'auto';
        target.style.overflow = 'visible';
      }}
      onBlur={(e) => {
        const target = e.target as HTMLAnchorElement;
        target.style.position = 'absolute';
        target.style.left = '-10000px';
        target.style.top = 'auto';
        target.style.width = '1px';
        target.style.height = '1px';
        target.style.overflow = 'hidden';
      }}
    >
      {children}
    </a>
  );
};

export default SkipLink;
