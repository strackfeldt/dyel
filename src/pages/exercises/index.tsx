import type { NextPage } from "next";
import Link from "next/link";
import { trpc } from "../../utils/trpc";

let Home: NextPage = () => {
  let { data } = trpc.useQuery(["exercises"]);

  return (
    <div className="p-4">
      <div>
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              Exercises
            </h2>
          </div>
          <div className="flex mt-4 md:mt-0 md:ml-4">
            <Link href="exercises/add">
              <a className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Add
              </a>
            </Link>
          </div>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
        {data?.map((exercise) => (
          <Link href={`/exercises/${exercise.id}`} key={exercise.id}>
            <a className="relative flex items-center px-6 py-5 space-x-3 bg-white border border-gray-300 rounded-lg shadow-sm hover:border-gray-400 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
              {exercise.name}
            </a>
          </Link>
        ))}
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </div>
    </div>
  );
};

export default Home;
