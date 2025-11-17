// import { notFound } from 'next/navigation';
// import Container from '@/components/Container/Container';
// import css from './ProfilePage.module.css';

// import { fetchAllStoriesServer, getMeServer } from '@/lib/api/serverApi';
// import { getTravellerById } from '@/lib/api/travellersApi';

// import {
//   dehydrate,
//   HydrationBoundary,
//   QueryClient,
// } from '@tanstack/react-query';

// export default async function ProfilePage() {
//   // 1. Отримуємо користувача
//   const user = await getMeServer();
//   if (!user || !user._id) notFound();

//   const userId = user._id;

//   // 2. Отримуємо профіль мандрівника
//   const traveller = await getTravellerById(userId);
//   if (!traveller) notFound();

//   // 3. Prefetch "Мої історії" (типово при відкритті)
//   const queryClient = new QueryClient();

//   await queryClient.prefetchQuery({
//     queryKey: ['my-stories', userId],
//     queryFn: () =>
//       fetchAllStoriesServer({
//         filter: userId,
//         type: 'created',
//       }),
//   });

//   return (
//     <Container>
//       <div className={css.profile}>
//         <HydrationBoundary state={dehydrate(queryClient)}>
//           <ProfilePageClient traveller={traveller} userId={userId} />
//         </HydrationBoundary>
//       </div>
//     </Container>
//   );
// }
