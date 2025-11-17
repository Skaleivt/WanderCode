import Image from 'next/image';

import type { TravellerInfo } from '@/lib/store/travellerStore';
import css from './TravellerInfo.module.css';

type TravellerInfoProps = {
  traveller: TravellerInfo;
};

export default function TravellerInfo({ traveller }: TravellerInfoProps) {
  return (
    <section className={css.containerTravellerInfo}>
      <Image
        src={traveller.avatarUrl}
        alt={`Photo ${traveller.name}`}
        width={199}
        height={199}
        className={css.avatar}
      />
      <div className={css.text}>
        <h3 className={css.name}>{traveller.name}</h3>
        <p className={css.description}>{traveller.description}</p>
      </div>
    </section>
  );
}
