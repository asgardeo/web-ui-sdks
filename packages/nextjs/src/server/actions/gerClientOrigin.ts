'use server';

import {headers} from 'next/headers';

const gerClientOrigin = async () => {
  const headersList = await headers();
  const host = headersList.get('host');
  const protocol = headersList.get('x-forwarded-proto') ?? 'http';
  return `${protocol}://${host}`;
};

export default gerClientOrigin;
