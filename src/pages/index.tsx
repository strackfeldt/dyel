import type { NextPage } from "next";
let Home: NextPage = () => {
  return (
    <div>
      <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            The best way to track your workouts
          </h1>
          <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
            DYEL is a simple tool to track your workouts. New features will be
            added regularly.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
