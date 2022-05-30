import { ChartSquareBarIcon } from "@heroicons/react/solid";
import { withTRPC } from "@trpc/next";
import { SessionProvider } from "next-auth/react";
import type { AppProps } from "next/app";
import Link from "next/link";
import superjson from "superjson";
import type { AppRouter } from "../backend";
import LoginButton from "../components/login-btn";
import "../globals.css";

let navigation = [
  { name: "Home", href: "/" },
  { name: "Exercises", href: "/exercises" },
];

function MyApp({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <header className="bg-gray-600">
        <nav
          className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8"
          aria-label="Top"
        >
          <div className="flex items-center justify-between w-full py-6 border-b border-gray-500 lg:border-none">
            <div className="flex items-center">
              <Link href="/">
                <a>
                  <span className="sr-only">Workflow</span>
                  <ChartSquareBarIcon className="w-10 h-10 text-white" />
                </a>
              </Link>
              <div className="hidden ml-10 space-x-8 lg:block">
                {navigation.map((link) => (
                  <Link key={link.name} href={link.href}>
                    <a className="text-base font-medium text-white hover:text-indigo-50">
                      {link.name}
                    </a>
                  </Link>
                ))}
              </div>
            </div>
            <div className="ml-10 space-x-4">
              <LoginButton className="inline-block px-4 py-2 text-base font-medium text-white bg-gray-500 border border-transparent rounded-md hover:bg-opacity-75" />
            </div>
          </div>
          <div className="flex flex-wrap justify-center py-4 space-x-6 lg:hidden">
            {navigation.map((link) => (
              <Link key={link.name} href={link.href}>
                <a className="text-base font-medium text-white hover:text-indigo-50">
                  {link.name}
                </a>
              </Link>
            ))}
          </div>
        </nav>
      </header>
      <main className="mx-auto max-w-7xl">
        <Component {...pageProps} />
      </main>
    </SessionProvider>
  );
}

function getBaseUrl() {
  if (typeof window !== "undefined") {
    return "";
  }
  // reference for vercel.com
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // assume localhost
  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export default withTRPC<AppRouter>({
  config() {
    return {
      transformer: superjson,
      url: `${getBaseUrl()}/api/trpc`,
    };
  },
  ssr: true,
  responseMeta({ clientErrors, ctx }) {
    if (clientErrors.length) {
      return {
        status: clientErrors[0].data?.httpStatus ?? 500,
      };
    }
    let ONE_DAY_IN_SECONDS = 60 * 60 * 24;
    return {
      "Cache-Control": `s-maxage=1, stale-while-revalidate=${ONE_DAY_IN_SECONDS}`,
    };
  },
})(MyApp);
