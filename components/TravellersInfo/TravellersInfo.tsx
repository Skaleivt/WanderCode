import Image from 'next/image';
import css from './TravellersInfo.module.css';

export type ProfileProps = {
  avatarUrl?: string;
  name?: string;
  description?: string;
};

interface Props {
  traveller: ProfileProps;
}

export function TravellersInfo({ traveller }: Props) {
  return (
    <>
      <div className={css.userProfile}>
        <Image
          src={traveller.avatarUrl || '/file.svg'}
          alt={traveller.name || 'avatar'}
          width={200}
          height={200}
          className={css.img}
        />
        <div>
          <h3 className={css.title}>{traveller.name}</h3>
          {traveller.description && (
            <p className={css.text}>{traveller.description}</p>
          )}
        </div>
      </div>
    </>
  );
}
