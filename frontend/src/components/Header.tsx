import React from 'react';

export default function Header() {
  return (
    <header className="sticky top-0 z-50 bg-white w-full border-b border-gray-200">
      <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 xl:px-20 h-20 flex flex-row items-center justify-between gap-3 md:gap-0">
        
        {/* Logo */}
        <div className="flex-1 hidden md:flex items-center">
          <a href="/" className="flex items-center gap-2 cursor-pointer text-airbnb-brand">
            <svg width="32" height="32" viewBox="0 0 1024 1024" className="fill-current">
              <path d="M512.2 46.9c-108.6 0-198.8 88.3-198.8 195.9 0 52 20.3 100.8 57.2 137.1 27.5 27.1 76.6 66.8 126.3 103.5 13.9 10.3 22 26.6 22 43.6v199h148V330.6c31.1-13 54.4-43.5 54.4-79.6 0-47.5-38.5-86.1-86-86.1-47.5 0-86 38.6-86 86.1 0 35.1 22.3 64.9 52.4 78.4V480c-43.5-32.3-88.7-68.5-112.5-92.1-29.3-28.9-45.5-67.6-45.5-108.2 0-85.3 71.3-154.9 157.5-154.9 86.2 0 157.5 69.6 157.5 154.9 0 40.5-16.1 79.1-45.3 107.9-23.7 23.5-68.6 59.5-111.8 91.6V726h148v-201c0-16.5 7.6-32.3 21-42.3 49.3-36.5 98-76 125.3-102.9 36.7-36.1 56.9-84.7 56.9-136.6 0-107.8-90.1-196.3-198.8-196.3zM858.9 203.2c-55.9-55.2-130.3-85.6-209.4-85.6C570.4 117.6 496 148 440.1 203.2 384.2 258.4 353.4 331.9 353.4 410c0 79 31.8 153.2 89.6 210L512 688.1 581 620c57.8-56.8 89.6-131 89.6-210 0-78.1-30.8-151.6-86.7-206.8zM512 878.1c-132.8 0-257.6-51.1-351.5-144-93.9-92.9-145.7-216.5-145.7-347.8C14.8 254.9 66.6 131.3 160.5 38.4 254.4-54.5 379.2-105.6 512-105.6s257.6 51.1 351.5 144c93.9 92.9 145.7 216.5 145.7 347.8 0 131.3-51.8 254.9-145.7 347.8-93.9 92.9-218.7 144.1-351.5 144.1z"/>
            </svg>
            <span className="hidden lg:block font-bold text-xl tracking-tighter">airbnb</span>
          </a>
        </div>

        {/* Search Bar Pill */}
        <div className="flex-[2] md:flex-[0_1_auto] py-2 md:py-0">
          <div className="w-full md:w-auto border-[1px] md:border-gray-200 md:w-[350px] lg:w-[400px] py-[10px] md:py-2 px-4 md:px-2 rounded-full shadow-sm hover:shadow-md transition cursor-pointer bg-white">
            <div className="flex flex-row items-center justify-between w-full h-full">
              <div className="text-sm font-semibold px-4 hidden md:block border-r border-gray-200">
                Anywhere
              </div>
              <div className="text-sm font-semibold px-4 hidden md:block border-r border-gray-200">
                Any week
              </div>
              <div className="text-sm font-normal text-gray-500 px-4 hidden md:block flex-grow whitespace-nowrap overflow-hidden text-ellipsis">
                Add guests
              </div>
              
              {/* Mobile Search text */}
              <div className="flex md:hidden flex-col">
                <div className="text-sm font-semibold">Where to?</div>
                <div className="flex flex-row text-xs text-gray-500 gap-1">
                  <span>Anywhere</span>
                  <span>•</span>
                  <span>Any week</span>
                  <span>•</span>
                  <span>Add guests</span>
                </div>
              </div>

              {/* Search Icon */}
              <div className="p-2 bg-airbnb-brand rounded-full text-white ml-2 md:ml-0 min-w-8 min-h-8 flex items-center justify-center">
                <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '12px', width: '12px', stroke: 'currentColor', strokeWidth: 4, overflow: 'visible' }}>
                  <g fill="none">
                    <path d="m13 24c6.0751322 0 11-4.9248678 11-11 0-6.07513225-4.9248678-11-11-11-6.07513225 0-11 4.92486775-11 11 0 6.0751322 4.92486775 11 11 11zm8-3 9 9"></path>
                  </g>
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* User Menu */}
        <div className="flex-1 hidden md:flex items-center justify-end gap-2">
          <div className="hidden lg:block text-sm font-semibold py-3 px-4 rounded-full hover:bg-neutral-100 transition cursor-pointer">
            Airbnb your home
          </div>
          <div className="p-3 bg-transparent rounded-full hover:bg-neutral-100 transition cursor-pointer">
            <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '16px', width: '16px', fill: 'currentcolor' }}>
              <path d="m8.002.25a7.77 7.77 0 0 1 7.748 7.776 7.75 7.75 0 0 1 -7.521 7.72l-.246.004a7.75 7.75 0 0 1 -7.73-7.513l-.003-.245a7.75 7.75 0 0 1 7.752-7.742zm1.949 8.5h-3.903c.155 2.897 1.176 5.343 1.886 5.493l.068.007c.68-.002 1.72-2.365 1.932-5.23zm4.255 0h-2.752c-.091 1.96-.53 3.783-1.188 5.076a6.257 6.257 0 0 0 3.905-4.829zm-9.661 0h-2.75a6.257 6.257 0 0 0 3.934 5.075c-.66-1.29-.11-3.116-1.184-5.075zm1.21-6.578-.12.05a6.257 6.257 0 0 0 -3.834 5.028h2.752c.092-1.83.484-3.541 1.063-4.81zm2.246-.422c-.7 0-1.782 2.514-1.94 5.5h3.904c-.156-2.903-1.182-5.348-1.89-5.494l-.074-.006zm2.28.432.023.05c.643 1.288 1.069 3.084 1.157 5.018h2.748a6.275 6.275 0 0 0 -3.929-5.068z"></path>
            </svg>
          </div>
          <div className="p-4 md:py-2 md:px-3 border-[1px] border-neutral-200 flex flex-row items-center gap-3 rounded-full cursor-pointer hover:shadow-md transition">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '16px', width: '16px', stroke: 'currentcolor', strokeWidth: 3, overflow: 'visible' }}>
              <g fill="none" fillRule="nonzero"><path d="m2 16h28"></path><path d="m2 24h28"></path><path d="m2 8h28"></path></g>
            </svg>
            <div className="hidden md:block">
              <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '30px', width: '30px', fill: 'gray' }}>
                <path d="m16 .7c-8.437 0-15.3 6.863-15.3 15.3s6.863 15.3 15.3 15.3 15.3-6.863 15.3-15.3-6.863-15.3-15.3-15.3zm0 28c-4.021 0-7.605-1.884-9.933-4.81a12.425 12.425 0 0 1 6.451-4.4 6.507 6.507 0 0 1 -3.018-5.49c0-3.584 2.916-6.5 6.5-6.5s6.5 2.916 6.5 6.5a6.513 6.513 0 0 1 -3.019 5.491 12.42 12.42 0 0 1 6.452 4.4c-2.328 2.925-5.912 4.809-9.933 4.809z"></path>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
