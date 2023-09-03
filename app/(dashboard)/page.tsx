import CollectionCard from '@/components/CollectionCard';
import CreateCollectionBtn from '@/components/CreateCollectionBtn';
import SadFace from '@/components/icons/SadFace';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { prisma } from '@/lib/prisma';
import { wait } from '@/lib/wait';
import { currentUser } from '@clerk/nextjs';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <>
      <Suspense fallback={<WelcomeMessageFallback />}>
        <WelcomeMessage />
      </Suspense>
      <Suspense fallback={<div>Loading collections...</div>}>
        <CollectionList />
      </Suspense>
    </>
  );
}

const WelcomeMessage = async () => {
  const user = await currentUser();

  // await wait(3000);

  if (!user) {
    return <div>Error!</div>;
  }

  return (
    <div className='flex w-full mb-12'>
      <h1 className='text-4xl font-bold'>
        Welcome, <br />
        {user.firstName} {user.lastName}
      </h1>
    </div>
  );
};

const WelcomeMessageFallback = () => {
  return (
    <div className='flex w-full mb-12'>
      <h1 className='text-4xl font-bold'>
        <Skeleton className='w-[150px] h-[36px]' />
        <Skeleton className='w-[150px] h-[36px]' />
      </h1>
    </div>
  );
};

const CollectionList = async () => {
  const user = await currentUser();
  const collections = await prisma.collection.findMany({
    where: {
      userId: user?.id,
    },
    include: {
      tasks: true,
    },
  });

  if (collections.length === 0) {
    return (
      <div className='flex flex-col gap-5'>
        <Alert>
          <SadFace />
          <AlertTitle>There are no collections yet.</AlertTitle>
          <AlertDescription>
            Create a collection to get started.
          </AlertDescription>
        </Alert>
        <CreateCollectionBtn />
      </div>
    );
  }

  return (
    <>
      <CreateCollectionBtn />
      <div className='flex flex-col gap-4 mt-6'>
        {collections.map((collection) => (
          <CollectionCard key={collection.id} collection={collection} />
        ))}
      </div>
    </>
  );
};
