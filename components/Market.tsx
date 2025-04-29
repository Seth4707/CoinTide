'use client';

import Image from 'next/image';

export default function News() {
  return (
    <div className='w-full'>
      <div className='max-w-[1240px] mx-auto px-4 py-16'>
        <div className='grid lg:grid-cols-3 gap-8'>
          <div>
            <Image
              src='/Images/bullish.png'  // Updated path
              alt='Crypto news'
              width={500}
              height={300}
              className='mx-auto'
            />
          </div>
          {/* News Content */}
          <div className='lg:col-span-2 flex flex-col justify-center'>
            <h2 className='text-2xl font-bold'>Latest Crypto News</h2>
            <p className='py-4'>
              Stay informed with the latest cryptocurrency news, trends, and market analysis.
              Get real-time updates on market movements and industry developments.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
