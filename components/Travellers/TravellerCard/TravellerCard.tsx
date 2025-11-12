// components/Travellers/TravellerCard/TravellerCard.tsx
import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Assuming Traveller type is defined in your API file
import { Traveller } from '@/lib/api/travellersApi';
import styles from './TravellerCard.module.css';

interface TravellerCardProps {
  traveller: Traveller;
}

const TravellerCard: React.FC<TravellerCardProps> = ({ traveller }) => {
  const { id, name, avatarUrl, description } = traveller;
  const profileLink = `/travellers/${id}`;

  return (
    <li className={styles.card}>
      <div className={styles.imageWrapper}>
        {/* Requirement: Image should be realized as content */}
        {avatarUrl ? (
          <Image
            src={avatarUrl}
            alt={`Avatar of ${name}`}
            width={150}
            height={150}
            className={styles.avatar}
            priority={true}
          />
        ) : (
          <div className={styles.placeholder}>[Avatar Placeholder]</div>
        )}
      </div>

      <h3 className={styles.name}>{name}</h3>
      <p className={styles.description}>
        {description
          ? description.substring(0, 100) +
            (description.length > 100 ? '...' : '')
          : 'This traveller has not yet added a description.'}
      </p>

      {/* Requirement: "Переглянути профіль" button is a route with hover effect */}
      <Link href={profileLink} className={styles.button}>
        Переглянути профіль
      </Link>
    </li>
  );
};

export default TravellerCard;
