import React from 'react';

const HomePage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center animate-fade-in">
      <h1 className="text-3xl font-bold text-gray-800 mb-4">
        Welcome to the <span className="text-blue-600">Home Page</span>
      </h1>
      <p className="text-gray-600 max-w-md">
        This is the home page of the app
      </p>
    </div>
  );
};

export default HomePage;
