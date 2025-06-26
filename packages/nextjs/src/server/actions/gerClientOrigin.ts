'use server';

import {headers} from 'next/headers';

const gerClientOrigin = async () => {
  const headersList = headers();
  const host = await headersList.get('host');
  const protocol = await headersList.get('x-forwarded-proto') ?? 'http';
  return `${protocol}://${host}`;
};

export default gerClientOrigin;
