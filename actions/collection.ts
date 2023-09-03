'use server';

import { prisma } from '@/lib/prisma';
import { wait } from '@/lib/wait';
import { CreateCollectionSchemaType } from '@/schema/createCollection';
import { currentUser } from '@clerk/nextjs';

export async function createCollection(form: CreateCollectionSchemaType) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  await wait(2000);

  return await prisma.collection.create({
    data: {
      userId: user.id,
      name: form.name,
      color: form.color,
    },
  });
}

export async function deleteCollection(id: number) {
  const user = await currentUser();

  if (!user) {
    throw new Error('User not found');
  }

  await wait(2000);

  return await prisma.collection.delete({
    where: {
      id: id,
      userId: user.id,
    },
  });
}
