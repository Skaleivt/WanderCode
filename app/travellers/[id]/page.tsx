// app/travellers/[id]/page.tsx

import React from 'react';

interface TravellerProfilePageProps {
  params: {
    id: string;
  };
}

const TravellerProfilePage: React.FC<TravellerProfilePageProps> = async ({
  params,
}) => {
  const travellerId = params.id;

  return (
    <div>
      <h1>Профіль Мандрівніка</h1>
      <p>ID мандрівніка: {travellerId}</p>
    </div>
  );
};

export default TravellerProfilePage;
