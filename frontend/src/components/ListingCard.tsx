import React from 'react';

interface ListingCardProps {
  imageSrc: string;
  location: string;
  distance: string;
  dateRange: string;
  price: string;
  rating: number;
  guestFavorite?: boolean;
}

export default function ListingCard({
  imageSrc,
  location,
  distance,
  dateRange,
  price,
  rating,
  guestFavorite = false,
}: ListingCardProps) {
  return (
    <div className="col-span-1 cursor-pointer group">
      <div className="flex flex-col gap-2 w-full">
        {/* Image Container */}
        <div className="aspect-square w-full relative overflow-hidden rounded-xl">
          <img 
            src={imageSrc} 
            alt="Listing" 
            className="object-cover h-full w-full group-hover:scale-105 transition"
          />
          {/* Guest Favorite Badge */}
          {guestFavorite && (
            <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded-full shadow-md font-semibold text-sm">
              Guest favorite
            </div>
          )}
          {/* Heart Icon */}
          <div className="absolute top-3 right-3">
            <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'rgba(0, 0, 0, 0.5)', height: '24px', width: '24px', stroke: 'var(--color-airbnb-border)', strokeWidth: 2, overflow: 'visible' }}>
              <path d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"></path>
            </svg>
          </div>
        </div>

        {/* Info */}
        <div className="flex flex-row justify-between items-start mt-1">
          <div className="font-semibold text-[15px]">{location}</div>
          <div className="flex flex-row items-center gap-1 font-light text-[15px]">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '12px', width: '12px', fill: 'currentcolor' }}>
              <path fillRule="evenodd" d="m15.1 1.58-4.13 8.88-9.86 1.27a1 1 0 0 0-.54 1.74l7.3 6.57-1.97 9.85a1 1 0 0 0 1.48 1.06l8.62-5 8.63 5a1 1 0 0 0 1.48-1.06l-1.97-9.85 7.3-6.57a1 1 0 0 0-.55-1.73l-9.86-1.28-4.12-8.88a1 1 0 0 0-1.82 0z"></path>
            </svg>
            <span>{rating}</span>
          </div>
        </div>
        <div className="font-light text-neutral-500 -mt-1">{distance}</div>
        <div className="font-light text-neutral-500 -mt-1">{dateRange}</div>
        <div className="flex flex-row items-center gap-1 mt-1">
          <div className="font-semibold">₹{price}</div>
          <div className="font-light">night</div>
        </div>
      </div>
    </div>
  );
}
