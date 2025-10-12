"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChatKit, useChatKit } from "@openai/chatkit-react";
import {
  STARTER_PROMPTS,
  PLACEHOLDER_INPUT,
  GREETING,
  CREATE_SESSION_ENDPOINT,
  WORKFLOW_ID,
  getThemeConfig,
} from "@/lib/config";
import { ErrorOverlay } from "./ErrorOverlay";
import type { ColorScheme } from "@/hooks/useColorScheme";

export type FactAction = {
  type: "save";
  factId: string;
  factText: string;
};

type ChatKitPanelProps = {
  theme: ColorScheme;
  onWidgetAction: (action: FactAction) => Promise<void>;
  onResponseEnd: () => void;
  onThemeRequest: (scheme: ColorScheme) => void;
};

type ErrorState = {
  script: string | null;
  session: string | null;
  integration: string | null;
  retryable: boolean;
};

const isBrowser = typeof window !== "undefined";
const isDev = process.env.NODE_ENV !== "production";

const createInitialErrors = (): ErrorState => ({
  script: null,
  session: null,
  integration: null,
  retryable: false,
});

export function ChatKitPanel({
  theme,
  onWidgetAction,
  onResponseEnd,
  onThemeRequest,
}: ChatKitPanelProps) {
  const processedFacts = useRef(new Set<string>());
  const [errors, setErrors] = useState<ErrorState>(() => createInitialErrors());
  const [isInitializingSession, setIsInitializingSession] = useState(true);
  const isMountedRef = useRef(true);
  const [scriptStatus, setScriptStatus] = useState<
    "pending" | "ready" | "error"
  >(() =>
    isBrowser && window.customElements?.get("openai-chatkit")
      ? "ready"
      : "pending"
  );
  const [widgetInstanceKey, setWidgetInstanceKey] = useState(0);

  // Debouncing and caching for getClientSecret
  const sessionCache = useRef<{ secret: string; timestamp: number } | null>(null);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isRefreshingRef = useRef(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const setErrorState = useCallback((updates: Partial<ErrorState>) => {
    setErrors((current) => ({ ...current, ...updates }));
  }, []);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
      // Cleanup debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    let timeoutId: number | undefined;

    const handleLoaded = () => {
      if (!isMountedRef.current) {
        return;
      }
      setScriptStatus("ready");
      setErrorState({ script: null });
    };

    const handleError = (event: Event) => {
      console.error("Failed to load chatkit.js for some reason", event);
      if (!isMountedRef.current) {
        return;
      }
      setScriptStatus("error");
      const detail = (event as CustomEvent<unknown>)?.detail ?? "unknown error";
      setErrorState({ script: `Error: ${detail}`, retryable: false });
      setIsInitializingSession(false);
    };

    window.addEventListener("chatkit-script-loaded", handleLoaded);
    window.addEventListener(
      "chatkit-script-error",
      handleError as EventListener
    );

    if (window.customElements?.get("openai-chatkit")) {
      handleLoaded();
    } else if (scriptStatus === "pending") {
      timeoutId = window.setTimeout(() => {
        if (!window.customElements?.get("openai-chatkit")) {
          handleError(
            new CustomEvent("chatkit-script-error", {
              detail:
                "ChatKit web component is unavailable. Verify that the script URL is reachable.",
            })
          );
        }
      }, 5000);
    }

    return () => {
      window.removeEventListener("chatkit-script-loaded", handleLoaded);
      window.removeEventListener(
        "chatkit-script-error",
        handleError as EventListener
      );
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [scriptStatus, setErrorState]);

  const isWorkflowConfigured = Boolean(
    WORKFLOW_ID && !WORKFLOW_ID.startsWith("wf_replace")
  );

  useEffect(() => {
    if (!isWorkflowConfigured && isMountedRef.current) {
      setErrorState({
        session: "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file.",
        retryable: false,
      });
      setIsInitializingSession(false);
    }
  }, [isWorkflowConfigured, setErrorState]);

  const handleResetChat = useCallback(() => {
    processedFacts.current.clear();
    if (isBrowser) {
      setScriptStatus(
        window.customElements?.get("openai-chatkit") ? "ready" : "pending"
      );
    }
    setIsInitializingSession(true);
    setErrors(createInitialErrors());
    setWidgetInstanceKey((prev) => prev + 1);
  }, []);

  const handleSessionExpired = useCallback(() => {
    console.warn("Session expired, attempting to refresh...");
    setErrorState({ 
      session: "Session expired. Refreshing...", 
      retryable: true 
    });
    // Trigger session refresh after a short delay
    setTimeout(() => {
      handleResetChat();
    }, 1000);
  }, [handleResetChat, setErrorState]);

  const getClientSecret = useCallback(
    async (currentSecret: string | null) => {
      // Check cache first (valid for 5 minutes)
      const now = Date.now();
      if (sessionCache.current && 
          (now - sessionCache.current.timestamp) < 300000 && 
          currentSecret === sessionCache.current.secret) {
        if (isDev) {
          console.debug("[ChatKitPanel] Using cached session secret");
        }
        return sessionCache.current.secret;
      }

      // Prevent concurrent refresh calls
      if (isRefreshingRef.current) {
        if (isDev) {
          console.debug("[ChatKitPanel] Session refresh already in progress, waiting...");
        }
        // Wait for current refresh to complete
        return new Promise<string>((resolve, reject) => {
          const checkInterval = setInterval(() => {
            if (!isRefreshingRef.current) {
              clearInterval(checkInterval);
              if (sessionCache.current) {
                resolve(sessionCache.current.secret);
              } else {
                reject(new Error("Session refresh failed"));
              }
            }
          }, 100);
          
          // Timeout after 10 seconds
          setTimeout(() => {
            clearInterval(checkInterval);
            reject(new Error("Session refresh timeout"));
          }, 10000);
        });
      }

      // Clear any existing debounce timeout
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }

      // Debounce rapid calls (wait 500ms)
      return new Promise<string>((resolve, reject) => {
        debounceTimeoutRef.current = setTimeout(async () => {
          try {
            isRefreshingRef.current = true;
            setIsRefreshing(true);
            
            // Reduced logging for better performance
            if (isDev && !currentSecret) {
              console.debug("[ChatKitPanel] Creating new session");
            }

            if (!isWorkflowConfigured) {
              const detail = "Set NEXT_PUBLIC_CHATKIT_WORKFLOW_ID in your .env.local file.";
              if (isMountedRef.current) {
                setErrorState({ session: detail, retryable: false });
                setIsInitializingSession(false);
              }
              throw new Error(detail);
            }

            if (isMountedRef.current) {
              if (!currentSecret) {
                setIsInitializingSession(true);
              }
              setErrorState({ session: null, integration: null, retryable: false });
            }

            const response = await fetch(CREATE_SESSION_ENDPOINT, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                workflow: { id: WORKFLOW_ID },
                chatkit_configuration: {
                  // Enable file uploads
                  file_upload: {
                    enabled: true,
                  },
                },
              }),
            });

            const raw = await response.text();
            let data: Record<string, unknown> = {};
            if (raw) {
              try {
                data = JSON.parse(raw) as Record<string, unknown>;
              } catch (parseError) {
                console.error("Failed to parse create-session response", parseError);
              }
            }

            if (!response.ok) {
              const detail = extractErrorDetail(data, response.statusText);
              console.error("Create session request failed", {
                status: response.status,
                body: data,
              });
              
              const isSessionExpired = response.status === 401 || 
                (typeof data.error === 'string' && data.error.toLowerCase().includes('expired'));
              
              if (isMountedRef.current) {
                if (isSessionExpired) {
                  handleSessionExpired();
                } else {
                  setErrorState({ 
                    session: detail, 
                    retryable: response.status >= 500 || response.status === 429 
                  });
                  setIsInitializingSession(false);
                }
              }
              throw new Error(detail);
            }

            const clientSecret = data?.client_secret as string | undefined;
            if (!clientSecret) {
              throw new Error("Missing client secret in response");
            }

            // Cache the successful result
            sessionCache.current = { secret: clientSecret, timestamp: now };

            if (isMountedRef.current) {
              setErrorState({ session: null, integration: null });
              setIsInitializingSession(false);
            }

            resolve(clientSecret);
          } catch (error) {
            console.error("Failed to create ChatKit session", error);
            const detail = error instanceof Error ? error.message : "Unable to start ChatKit session.";
            if (isMountedRef.current) {
              setErrorState({ session: detail, retryable: false });
              setIsInitializingSession(false);
            }
            reject(error instanceof Error ? error : new Error(detail));
          } finally {
            isRefreshingRef.current = false;
            setIsRefreshing(false);
          }
        }, 500); // 500ms debounce
      });
    },
    [isWorkflowConfigured, setErrorState, handleSessionExpired]
  );

  const chatkit = useChatKit({
    api: { getClientSecret },
    theme: {
      colorScheme: theme,
      ...getThemeConfig(theme),
    },
    startScreen: {
      greeting: GREETING,
      prompts: STARTER_PROMPTS,
    },
    composer: {
      placeholder: PLACEHOLDER_INPUT,
      attachments: {
        // Enable attachments
        enabled: true,
      },
    },
    threadItemActions: {
      feedback: false,
    },
    onClientTool: async (invocation: {
      name: string;
      params: Record<string, unknown>;
    }) => {
      if (invocation.name === "switch_theme") {
        const requested = invocation.params.theme;
        if (requested === "light" || requested === "dark") {
          if (isDev) {
            console.debug("[ChatKitPanel] switch_theme", requested);
          }
          onThemeRequest(requested);
          return { success: true };
        }
        return { success: false };
      }

      if (invocation.name === "record_fact") {
        const id = String(invocation.params.fact_id ?? "");
        const text = String(invocation.params.fact_text ?? "");
        if (!id || processedFacts.current.has(id)) {
          return { success: true };
        }
        processedFacts.current.add(id);
        void onWidgetAction({
          type: "save",
          factId: id,
          factText: text.replace(/\s+/g, " ").trim(),
        });
        return { success: true };
      }

      return { success: false };
    },
    onResponseEnd: () => {
      onResponseEnd();
    },
    onResponseStart: () => {
      setErrorState({ integration: null, retryable: false });
    },
    onThreadChange: () => {
      processedFacts.current.clear();
    },
    onError: ({ error }: { error: unknown }) => {
      // Note that Chatkit UI handles errors for your users.
      // Thus, your app code doesn't need to display errors on UI.
      console.error("ChatKit error", error);
    },
  });

  const activeError = errors.session ?? errors.integration;
  const blockingError = errors.script ?? activeError;

  // Reduced logging for better performance
  if (isDev && blockingError) {
    console.debug("[ChatKitPanel] error state", { blockingError });
  }

  return (
    <div className="relative pb-8 flex h-[90vh] w-full rounded-2xl flex-col overflow-hidden bg-white shadow-sm transition-colors dark:bg-slate-900">
      <ChatKit
        key={widgetInstanceKey}
        control={chatkit.control}
        className={
          blockingError || isInitializingSession
            ? "pointer-events-none opacity-0"
            : "block h-full w-full"
        }
      />
      {/* Show loading indicator during session refresh */}
      {isRefreshing && !blockingError && (
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2 rounded-lg bg-blue-100 px-3 py-2 text-sm text-blue-700 dark:bg-blue-900 dark:text-blue-200">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-blue-600 border-t-transparent"></div>
          Refreshing session...
        </div>
      )}
      <ErrorOverlay
        error={blockingError}
        fallbackMessage={
          blockingError || !isInitializingSession
            ? null
            : "Loading assistant session..."
        }
        onRetry={blockingError && errors.retryable ? handleResetChat : null}
        retryLabel="Restart chat"
      />
    </div>
  );
}

function extractErrorDetail(
  payload: Record<string, unknown> | undefined,
  fallback: string
): string {
  if (!payload) {
    return fallback;
  }

  const error = payload.error;
  if (typeof error === "string") {
    return error;
  }

  if (
    error &&
    typeof error === "object" &&
    "message" in error &&
    typeof (error as { message?: unknown }).message === "string"
  ) {
    return (error as { message: string }).message;
  }

  const details = payload.details;
  if (typeof details === "string") {
    return details;
  }

  if (details && typeof details === "object" && "error" in details) {
    const nestedError = (details as { error?: unknown }).error;
    if (typeof nestedError === "string") {
      return nestedError;
    }
    if (
      nestedError &&
      typeof nestedError === "object" &&
      "message" in nestedError &&
      typeof (nestedError as { message?: unknown }).message === "string"
    ) {
      return (nestedError as { message: string }).message;
    }
  }

  if (typeof payload.message === "string") {
    return payload.message;
  }

  return fallback;
}
