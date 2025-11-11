// components/layout/Container/Container.tsx
import React, { ReactNode } from 'react';
import styles from './Container.module.css';

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export const Container: React.FC<ContainerProps> = ({
  children,
  className = '',
}) => {
  const containerClasses = `${styles.container} ${className}`;

  return <div className={containerClasses.trim()}>{children}</div>;
};

export default Container;
