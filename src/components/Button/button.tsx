import React from 'react';
import { Link, LinkProps } from 'react-router-dom';
import styled from 'styled-components';
import Tips from 'styles/tips';

interface ButtonProps extends React.PropsWithChildren {
  onClick?: () => void;
  className?: string;
}

interface BtnLibkProps extends LinkProps {
  Tips?: string;
}

const LinkWrapper = styled.span`
  ${Tips}
`;

const InternalButton: React.FC<ButtonProps> = ({ onClick, children }) => {
  return <Button onClick={onClick}>{children}</Button>;
};

const LinkBtn: React.FC<BtnLibkProps> = ({ to, children, target = '_self', Tips }) => {
  if (Tips)
    return (
      <LinkWrapper data-tip={Tips}>
        <Link to={to} target={target}>
          {children}
        </Link>
      </LinkWrapper>
    );
  else
    return (
      <Link to={to} target={target}>
        {children}
      </Link>
    );
};

interface CompoundedComponent extends React.FC<ButtonProps> {
  Link: typeof LinkBtn;
}

const Button = InternalButton as CompoundedComponent;

Button.Link = LinkBtn;

export default Button;
