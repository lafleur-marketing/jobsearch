"use client";

import { useCallback } from "react";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { ChatKitPanel, type FactAction } from "@/components/ChatKitPanel";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function App() {
  const { scheme, setScheme } = useColorScheme();

  const handleWidgetAction = useCallback(async (action: FactAction) => {
    if (process.env.NODE_ENV !== "production") {
      console.info("[ChatKitPanel] widget action", action);
    }
  }, []);

  const handleResponseEnd = useCallback(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[ChatKitPanel] response end");
    }
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-end bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto w-full max-w-5xl">
        <SignedIn>
          <ChatKitPanel
            theme={scheme}
            onWidgetAction={handleWidgetAction}
            onResponseEnd={handleResponseEnd}
            onThemeRequest={setScheme}
          />
        </SignedIn>
        <SignedOut>
          <div className="flex min-h-[80vh] flex-col items-center justify-center text-center">
            <div className="mx-auto max-w-2xl rounded-xl bg-white p-8 shadow-lg dark:bg-slate-800">
              <div className="mb-6 flex justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white">
                  <svg className="h-8 w-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                  </svg>
                </div>
              </div>
              <h2 className="mb-4 text-3xl font-bold text-gray-900 dark:text-white">
                Welcome to Dren&apos;s Job Search Assistant
              </h2>
              <p className="mb-6 text-lg text-gray-600 dark:text-gray-300">
                Your AI-powered career companion for finding opportunities in West Michigan
              </p>
              <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-5 w-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2-2v2m8 0V6a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V8a2 2 0 012-2V6" />
                    </svg>
                    <h3 className="font-semibold text-blue-900 dark:text-blue-100">Find Jobs</h3>
                  </div>
                  <p className="text-sm text-blue-700 dark:text-blue-200">Discover opportunities in West Michigan</p>
                </div>
                <div className="rounded-lg bg-green-50 p-4 dark:bg-green-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-5 w-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <h3 className="font-semibold text-green-900 dark:text-green-100">Resume Help</h3>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-200">Get feedback and improvements</p>
                </div>
                <div className="rounded-lg bg-purple-50 p-4 dark:bg-purple-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-5 w-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <h3 className="font-semibold text-purple-900 dark:text-purple-100">Interview Prep</h3>
                  </div>
                  <p className="text-sm text-purple-700 dark:text-purple-200">Practice with common questions</p>
                </div>
                <div className="rounded-lg bg-orange-50 p-4 dark:bg-orange-900/20">
                  <div className="mb-2 flex items-center gap-2">
                    <svg className="h-5 w-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <h3 className="font-semibold text-orange-900 dark:text-orange-100">Strategy</h3>
                  </div>
                  <p className="text-sm text-orange-700 dark:text-orange-200">Optimize your job search approach</p>
                </div>
              </div>
              <div className="rounded-lg bg-gray-50 p-4 dark:bg-gray-700">
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  <strong>Ready to get started?</strong> Sign in above to access your personalized AI job search assistant.
                </p>
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
