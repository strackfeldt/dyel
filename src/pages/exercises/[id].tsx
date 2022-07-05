import { CalendarIcon, XIcon } from "@heroicons/react/outline";
import * as d3 from "d3";
import {
  eachMonthOfInterval,
  endOfMonth,
  format,
  isSameMonth,
  startOfMonth,
} from "date-fns";
import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useState } from "react";
import { useSpinDelay } from "spin-delay";
import { LogModal } from "../../components/log-modal";
import { trpc } from "../../utils/trpc";

type Data = { date: Date; estOneRepMax: number };

let FancyGraph: React.FC<{
  data: Array<Data>;
  width: number;
  height: number;
}> = ({ data, width, height }) => {
  if (data.length === 0) {
    throw new Error("No data");
  }

  let margin = { top: 30, right: 20, bottom: 30, left: 30 };

  let startDate = startOfMonth(data.at(-1)!.date);
  let endDate = endOfMonth(data.at(0)!.date);

  let months = eachMonthOfInterval({ start: startDate, end: endDate });

  let xScale = d3
    .scaleTime()
    .domain([startDate, endDate])
    .range([margin.left, width - margin.right]);
  let yScale = d3
    .scaleLinear()
    .domain(d3.extent(data.map((d) => d.estOneRepMax)) as any)
    .range([height - margin.bottom, margin.top]);
  let line = d3
    .line<any>()
    .x((d) => xScale(d.date))
    .y((d) => yScale(d.estOneRepMax));

  let p = line(data)!;

  return (
    <>
      <svg viewBox={`0 0 ${width} ${height}`}>
        {months.map((month, i) => (
          <g
            key={month.getDate()}
            transform={`translate(${xScale(month)},0)`}
            className="text-gray-400"
          >
            {i % 2 === 1 && (
              <rect
                y={margin.top - 10}
                width={xScale(endOfMonth(month)) - xScale(month)}
                height={height - margin.bottom - margin.top}
                fill="currentColor"
                className="text-gray-100"
              />
            )}
            <text
              x={(xScale(endOfMonth(month)) - xScale(month)) / 2}
              y={height - 15}
              textAnchor="middle"
              className="md:text-[10px] text-xs"
              fill="currentColor"
              alignmentBaseline="middle"
            >
              {format(month, "MMM")}
            </text>
          </g>
        ))}
        {yScale.ticks(5).map((d) => (
          <g
            key={d}
            transform={`translate(0, ${yScale(d)})`}
            className="text-gray-400"
          >
            <line
              x1={margin.left}
              x2={width - margin.right}
              stroke="currentColor"
              strokeWidth={1}
              strokeDasharray="1,6"
            />
            <text
              x={5}
              className="md:text-[10px] text-xs"
              fill="currentColor"
              alignmentBaseline="middle"
            >
              {d}
            </text>
          </g>
        ))}

        <path d={p} fill="none" stroke="currentColor" strokeWidth="2" />
        {data.map((d) => (
          <circle
            key={d.date.getTime()}
            cx={xScale(d.date)}
            cy={yScale(d.estOneRepMax)}
            r={3}
            fill="currentColor"
            stroke={
              months.findIndex((m) => isSameMonth(m, d.date)) % 2 === 1
                ? "#f5f5f4"
                : "white"
            }
            strokeWidth="1.5"
          />
        ))}
      </svg>
    </>
  );
};

let Exercise: NextPage = (props: any) => {
  let [open, setOpen] = useState(false);

  let { query } = useRouter();
  let id = Number(query.id as string);

  let { data: exercise, ...exerciseByIdQuery } = trpc.useQuery(
    ["exercise-by-id", { id: id }],
    {
      enabled: !!id,
    }
  );

  let isLoading = useSpinDelay(exerciseByIdQuery.isLoading);

  let logsByDate = exercise?.logs.reduce((acc, log) => {
    let date = new Date(log.date).toISOString();
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(log);
    return acc;
  }, {} as any);

  let data: Array<Data> | undefined = exercise
    ? Object.entries(logsByDate).map(([date, logs]: any) => {
        function calcOrm({ weight, reps }: { weight: number; reps: number }) {
          return weight * (1 + reps * 0.0333);
        }
        let orms = logs.map(calcOrm);
        let estOneRepMax = Math.max(...orms);

        return { date: new Date(date), estOneRepMax };
      })
    : undefined;

  return (
    <div>
      <LogModal open={open} setOpen={setOpen} exerciseId={exercise?.id || 0} />

      <div className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1 min-w-0">
            <h2 className="text-2xl font-bold leading-7 text-gray-900 sm:text-3xl sm:truncate">
              {exercise?.name}
            </h2>
          </div>
          <div className="flex mt-4 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 ml-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
              onClick={() => setOpen(true)}
            >
              Log
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="flex justify-center p-24">
            <span className="animate-pulse text-lg font-medium text-gray-500">
              Loading...
            </span>
          </div>
        )}

        {data && data.length > 3 && (
          <div className="mt-12 overflow-hidden text-blue-500 bg-white rounded-lg shadow">
            <FancyGraph data={data} width={600} height={300} />
          </div>
        )}

        {logsByDate && Object.keys(logsByDate).length === 0 && (
          <button
            type="button"
            className="relative block w-full p-12 mt-12 text-center border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-300"
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="w-12 h-12 mx-auto text-gray-400" />
            <span className="block mt-2 text-sm font-medium text-gray-600">
              No logs yet.
            </span>
          </button>
        )}
        <div className="grid grid-cols-1 gap-4 mt-8 sm:grid-cols-2">
          {logsByDate &&
            Object.keys(logsByDate).map((date) => (
              <div
                key={date}
                className="overflow-hidden bg-white rounded-lg shadow"
              >
                <div className="px-4 py-5 bg-white border-b border-gray-200 sm:px-6">
                  <h3 className="font-medium leading-6 text-gray-900">
                    {date.split("T")[0]}
                  </h3>
                </div>
                <div className="px-4 py-5 sm:px-6">
                  <ul>
                    {logsByDate[date].map((log: any, i: number) => (
                      <li key={log.id} className="flex items-center gap-2 my-2">
                        <div className="w-20 mr-2 font-medium">
                          Set #{i + 1}:
                        </div>
                        <div className="w-24 text-center bg-gray-200 rounded-md">
                          {log.reps}
                        </div>

                        <XIcon className="w-3 h-3" />
                        <div className="w-24 text-center bg-gray-200 rounded-md">
                          {log.weight}
                        </div>
                        <span>kg</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default Exercise;
