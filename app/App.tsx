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
    <main className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
      <div className="mx-auto w-full max-w-6xl px-4 py-4 sm:py-8">
        <SignedIn>
          <div className="mb-4 sm:mb-6 text-center">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Your AI Marketing Career Assistant
            </h2>
            <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
              Get personalized help finding marketing & communications leadership opportunities in West Michigan
            </p>
          </div>
          
          {/* Two-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
            {/* Left Column - ChatKit Explanation */}
            <div className="space-y-6">
              {/* ChatKit Explanation */}
              <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
                  Powered by OpenAI&apos;s ChatKit
                </h3>
                <p className="text-sm text-blue-800 dark:text-blue-200 mb-4">
                  This chat interface uses OpenAI&apos;s advanced ChatKit technology with a specialized workflow designed for marketing professionals. Your queries are processed through three specialized AI agents:
                </p>
                <div className="space-y-3">
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-green-700 dark:text-green-400 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Agent 1: The Job Seeker
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Understands your marketing career goals, skills, and preferences to find relevant leadership opportunities.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-blue-700 dark:text-blue-400 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Agent 2: The Hiring Agent Stalker
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Researches marketing companies, analyzes job postings, and identifies hiring patterns for marketing roles in West Michigan.</p>
                  </div>
                  <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-gray-200 dark:border-slate-700">
                    <h4 className="font-semibold text-purple-700 dark:text-purple-400 mb-2 flex items-center gap-2">
                      <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                      Agent 3: The Resume Coach
                    </h4>
                    <p className="text-xs text-gray-600 dark:text-gray-300">Provides personalized marketing resume feedback, interview prep for leadership roles, and application strategy advice.</p>
                  </div>
                </div>
                <p className="text-xs text-blue-700 dark:text-blue-300 mt-4 p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                  <strong>How it works:</strong> ChatKit orchestrates these agents to provide comprehensive, personalized marketing career assistance tailored specifically for the West Michigan market.
                </p>
              </div>

              {/* Quick Tips */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Quick Tips</h3>
                </div>
                <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-300">
                  <li>• Ask about marketing companies in West Michigan</li>
                  <li>• Upload your marketing resume for personalized feedback</li>
                  <li>• Practice marketing leadership interview questions</li>
                  <li>• Get marketing salary insights for West Michigan</li>
                </ul>
              </div>
            </div>

            {/* Right Column - Chat Interface */}
            <div className="space-y-6">
              <ChatKitPanel
                theme={scheme}
                onWidgetAction={handleWidgetAction}
                onResponseEnd={handleResponseEnd}
                onThemeRequest={setScheme}
              />
              
              {/* Get Started Section */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-600 dark:text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Get Started</h3>
                </div>
                <div className="space-y-3 text-sm text-gray-600 dark:text-gray-300">
                  <p className="font-medium text-gray-900 dark:text-white">Try these prompts:</p>
                  <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="text-xs italic">&quot;Help me find marketing director roles in Grand Rapids&quot;</p>
                  </div>
                  <div className="bg-gray-50 dark:bg-slate-700 p-3 rounded-lg">
                    <p className="text-xs italic">&quot;Review my integrated marketing resume for leadership roles&quot;</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* West Michigan Focus - Full Width Below */}
          <div className="mt-8">
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-slate-700">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">West Michigan Marketing Focus</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Grand Rapids</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Marketing & Brand agencies</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Kalamazoo</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Corporate marketing roles</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Holland/Zeeland</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Brand & Communications</p>
                </div>
                <div className="text-center p-4 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Networking</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">Marketing networking events</p>
                </div>
              </div>
            </div>
          </div>
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
