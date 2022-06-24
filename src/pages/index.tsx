import type { NextPage } from "next";
let Home: NextPage = () => {
  return (
    <div>
      <div className="px-4 py-16 mx-auto max-w-7xl sm:py-24 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="mt-1 text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Do you even lift?
          </h1>
          <p className="max-w-xl mx-auto mt-5 text-xl text-gray-500">
            DYEL is a simple tool to help you track your progress in your daily
            exercise routine.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Home;
