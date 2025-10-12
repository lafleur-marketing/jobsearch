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
    <main className="flex min-h-screen flex-col items-center justify-end bg-slate-100 dark:bg-slate-950">
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
            <div className="mx-auto max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-slate-800">
              <h2 className="mb-4 text-2xl font-bold text-gray-900 dark:text-white">
                Welcome to AgentKit Demo
              </h2>
              <p className="mb-6 text-gray-600 dark:text-gray-300">
                Please sign in to access the AI assistant and start chatting.
              </p>
              <div className="space-y-3">
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Use the Sign In or Sign Up buttons in the header to get started.
                </p>
              </div>
            </div>
          </div>
        </SignedOut>
      </div>
    </main>
  );
}
