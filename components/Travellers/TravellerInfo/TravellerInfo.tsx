// components/Travellers/TravellerInfo/TravellerInfo.tsx

import React from 'react';
import Image from 'next/image';
import { Traveller } from '@/types/traveller';
import styles from './TravellerInfo.module.css';

interface TravellerInfoProps {
  traveller: Traveller;
}

const TravellerInfo: React.FC<TravellerInfoProps> = ({ traveller }) => {
  return (
    <div className={styles.infoWrapper}>
      <div className={styles.avatarSection}>
        {traveller.avatarUrl && (
          <Image
            src={traveller.avatarUrl || '/file.svg'}
            alt={traveller.name}
            width={199}
            height={199}
            className={styles.avatar}
            priority={true}
          />
        )}
      </div>
      <div className={styles.textInfo}>
        <h1 className={styles.title}>{traveller.name}</h1>

        {traveller.description && (
          <p className={styles.description}>{traveller.description}</p>
        )}
      </div>
    </div>
  );
};

export default TravellerInfo;
