import React from 'react';

const categories = [
  { label: 'Icons', icon: 'M5.5 28.5V8.986l10-4.544 10 4.544V28.5m-15-5.5h10', path: 'M2 13.5l13.5-6.136L29 13.5' },
  { label: 'Beachfront', icon: 'M15.5 1.5v18m-4.5-9h9m-13.5 13.5h18', path: 'M7.5 24h16m-16-4.5h16' },
  { label: 'Cabins', icon: 'M2 24h27M4.5 24L15.5 3l11 21', path: 'M15.5 3v21M9 14h13' },
  { label: 'OMG!', icon: 'M15.5 29c7.456 0 13.5-6.044 13.5-13.5S22.956 2 15.5 2 2 8.044 2 15.5 8.044 29 15.5 29z', path: 'M15.5 8v9M15.5 22v1' },
  { label: 'Amazing pools', icon: 'M2 12h27v11a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V12z', path: 'M8 12V8a4 4 0 0 1 8 0v4m7 0V9a2 2 0 0 0-4 0v3' },
  { label: 'Design', icon: 'M15.5 29L2 15.5 15.5 2 29 15.5 15.5 29z', path: 'M15.5 9l-6.5 6.5 6.5 6.5 6.5-6.5L15.5 9z' },
  { label: 'Farms', icon: 'M15.5 18.5a7 7 0 1 0 0-14 7 7 0 0 0 0 14zm0 0v10', path: 'M9 12l6.5-6.5L22 12M5 28.5h21' },
  { label: 'Lakefront', icon: 'M2 24h27M4 14l11.5-9 11.5 9v10H4z', path: 'M10 14v10m11-10v10M15.5 14v10' },
  { label: 'Tiny homes', icon: 'M2 26h27M7 26V11l8.5-7 8.5 7v15', path: 'M15.5 4v22' },
  { label: 'National parks', icon: 'M2 26h27M4.5 26L15.5 5l11 21', path: 'M10 17l5.5-9 5.5 9' },
  { label: 'Trending', icon: 'M15.5 28a12.5 12.5 0 1 0 0-25 12.5 12.5 0 0 0 0 25z', path: 'M10 18l4-7 4 4 4-5' },
];

export default function Categories() {
  return (
    <div className="max-w-[2520px] mx-auto px-4 sm:px-6 md:px-10 xl:px-20 pt-4 flex flex-row items-center justify-between overflow-x-auto no-scrollbar">
      {categories.map((item) => (
        <div 
          key={item.label} 
          className={`
            flex flex-col items-center justify-center gap-2 p-3 border-b-2 hover:text-neutral-800 transition cursor-pointer min-w-max
            ${item.label === 'Icons' ? 'border-neutral-800 text-neutral-800' : 'border-transparent text-neutral-500 hover:border-neutral-300'}
          `}
        >
          <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', fill: 'none', height: '24px', width: '24px', stroke: 'currentColor', strokeWidth: 2, overflow: 'visible' }}>
            <g fill="none">
              <path d={item.icon}></path>
              <path d={item.path}></path>
            </g>
          </svg>
          <div className="text-xs font-medium">{item.label}</div>
        </div>
      ))}
      <div className="ml-4 flex items-center justify-center p-3 border border-gray-300 rounded-xl cursor-pointer hover:shadow-sm hidden md:flex gap-2 min-w-max">
        <svg viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="presentation" focusable="false" style={{ display: 'block', height: '14px', width: '14px', fill: 'currentColor' }}>
          <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.17A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
        </svg>
        <span className="text-xs font-semibold">Filters</span>
      </div>
    </div>
  );
}
