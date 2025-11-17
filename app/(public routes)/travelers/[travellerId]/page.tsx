import { Metadata } from 'next';

import { getTravellerById } from '@/lib/api/travellersApi';
import TravellerInfo  from '@/components/TravellerInfo/TravellerInfo';

type Props = {
  params: Promise<{ travellerId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { travellerId } = await params;
  const traveller = await getTravellerById(travellerId);
  return {
    title: `Профіль Мандрівника: ${traveller.name}`,
    description: `Історії подорожей, фото та пригоди з усього світу.`,
    openGraph: {
      title: `Профіль Мандрівника: ${traveller.name}`,
      description: '',
      url: `${process.env.NEXT_PUBLIC_BASE_URL}/travelers/${travellerId}`,
      siteName: 'Подорожники',
      images: [
        {
          url: traveller.avatarUrl,
          width: 1200,
          height: 630,
          alt: `Профіль мандрівника ${traveller.name}`,
        },
      ],
    },
  };
}

const TravellerInfoPage = async ({ params }: Props) => {
  const { travellerId } = await params;
  const traveller = await getTravellerById(travellerId);

  return (
    <>
      <TravellerInfo traveller={traveller} />
    </>
  );
};

export default TravellerInfoPage;
