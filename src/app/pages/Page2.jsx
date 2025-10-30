import React from 'react';

const Page2 = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        This is <span className="text-green-600">Page 2</span>
      </h1>
      <p className="text-gray-600 max-w-md">
        This is the second page of the app
      </p>
    </div>
  );
};

export default Page2;
