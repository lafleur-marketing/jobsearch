import { WORKFLOW_ID } from "@/lib/config";

export const runtime = "edge";

interface CreateSessionRequestBody {
  workflow?: { id?: string | null } | null;
  scope?: { user_id?: string | null } | null;
  workflowId?: string | null;
  chatkit_configuration?: {
    file_upload?: {
      enabled?: boolean;
    };
  };
}

const DEFAULT_CHATKIT_BASE = "https://api.openai.com";
const SESSION_COOKIE_NAME = "chatkit_session_id";
const SESSION_COOKIE_MAX_AGE = 60 * 60 * 24 * 30; // 30 days

export async function POST(request: Request): Promise<Response> {
  if (request.method !== "POST") {
    return methodNotAllowedResponse();
  }
  let sessionCookie: string | null = null;
  try {
    const openaiApiKey = process.env.OPENAI_API_KEY;
    if (!openaiApiKey) {
      return new Response(
        JSON.stringify({
          error: "Missing OPENAI_API_KEY environment variable",
        }),
        {
          status: 500,
          headers: { 
            "Content-Type": "application/json",
            "Cache-Control": "no-cache",
            "Pragma": "no-cache"
          },
        }
      );
    }

    const parsedBody = await safeParseJson<CreateSessionRequestBody>(request);
    const { userId, sessionCookie: resolvedSessionCookie } =
      await resolveUserId(request);
    sessionCookie = resolvedSessionCookie;
    const resolvedWorkflowId =
      parsedBody?.workflow?.id ?? parsedBody?.workflowId ?? WORKFLOW_ID;

    if (process.env.NODE_ENV !== "production") {
      console.info("[create-session] handling request", {
        resolvedWorkflowId,
        body: JSON.stringify(parsedBody),
      });
    }

    if (!resolvedWorkflowId) {
      return buildJsonResponse(
        { error: "Missing workflow id" },
        400,
        { "Content-Type": "application/json" },
        sessionCookie
      );
    }

    const apiBase = process.env.CHATKIT_API_BASE ?? DEFAULT_CHATKIT_BASE;
    const url = `${apiBase}/v1/chatkit/sessions`;
    
    // Retry logic for failed requests
    const maxRetries = 3;
    let retryCount = 0;
    let upstreamResponse: Response | undefined;
    
    while (retryCount <= maxRetries) {
      try {
        // Add timeout handling (Edge Runtime compatible)
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout (Vercel hobby limit)
        
        upstreamResponse = await fetch(url, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${openaiApiKey}`,
            "OpenAI-Beta": "chatkit_beta=v1",
            "Accept": "application/json",
            "Cache-Control": "no-cache",
          },
          body: JSON.stringify({
            workflow: { id: resolvedWorkflowId },
            user: userId,
            chatkit_configuration: {
              file_upload: {
                enabled:
                  parsedBody?.chatkit_configuration?.file_upload?.enabled ?? true,
              },
            },
          }),
        });
        
        clearTimeout(timeoutId);
        
        // If successful, break out of retry loop
        if (upstreamResponse.ok) {
          break;
        }
        
        // If it's a retryable error and we haven't exceeded max retries
        if (retryCount < maxRetries && 
            (upstreamResponse.status >= 500 || upstreamResponse.status === 429)) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 2000; // Exponential backoff: 4s, 8s, 16s
          
          if (process.env.NODE_ENV !== "production") {
            console.info(`[create-session] Retry ${retryCount}/${maxRetries} after ${delay}ms`, {
              status: upstreamResponse.status,
              statusText: upstreamResponse.statusText,
            });
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If not retryable or max retries exceeded, break
        break;
        
      } catch (error) {
        // If it's a timeout or network error and we haven't exceeded max retries
        if (retryCount < maxRetries && 
            (error instanceof Error && 
             (error.name === 'AbortError' || error.message.includes('fetch')))) {
          retryCount++;
          const delay = Math.pow(2, retryCount) * 2000; // Exponential backoff: 4s, 8s, 16s
          
          if (process.env.NODE_ENV !== "production") {
            console.info(`[create-session] Retry ${retryCount}/${maxRetries} after network error`, {
              error: error.message,
              delay: delay,
            });
          }
          
          await new Promise(resolve => setTimeout(resolve, delay));
          continue;
        }
        
        // If not retryable or max retries exceeded, re-throw
        throw error;
      }
    }
    
    // Ensure we have a response
    if (!upstreamResponse) {
      throw new Error("Failed to get response after all retries");
    }

    if (process.env.NODE_ENV !== "production") {
      console.info("[create-session] upstream response", {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
      });
    }

    const upstreamJson = (await upstreamResponse.json().catch(() => ({}))) as
      | Record<string, unknown>
      | undefined;

    if (!upstreamResponse.ok) {
      const upstreamError = extractUpstreamError(upstreamJson);
      console.error("OpenAI ChatKit session creation failed", {
        status: upstreamResponse.status,
        statusText: upstreamResponse.statusText,
        body: upstreamJson,
      });
      
      // Handle specific error cases
      let errorMessage = upstreamError ?? `Failed to create session: ${upstreamResponse.statusText}`;
      
      if (upstreamResponse.status === 429) {
        errorMessage = "Rate limit exceeded. Please wait a moment and try again.";
      } else if (upstreamResponse.status === 401) {
        errorMessage = "Authentication failed. Please check your API key.";
      } else if (upstreamResponse.status === 403) {
        errorMessage = "Access forbidden. Please check your API permissions.";
      } else if (upstreamResponse.status === 500) {
        errorMessage = "OpenAI service is temporarily unavailable. Please try again.";
      }
      
      return buildJsonResponse(
        {
          error: errorMessage,
          details: upstreamJson,
          retryable: upstreamResponse.status >= 500 || upstreamResponse.status === 429,
        },
        upstreamResponse.status,
        { "Content-Type": "application/json" },
        sessionCookie
      );
    }

    const clientSecret = upstreamJson?.client_secret ?? null;
    const expiresAfter = upstreamJson?.expires_after ?? null;
    const responsePayload = {
      client_secret: clientSecret,
      expires_after: expiresAfter,
    };

    return buildJsonResponse(
      responsePayload,
      200,
      { "Content-Type": "application/json" },
      sessionCookie
    );
  } catch (error) {
    console.error("Create session error", error);
    
    // Vercel-specific error handling
    if (error instanceof Error) {
      if (error.message.includes('timeout') || error.message.includes('aborted')) {
        return buildJsonResponse(
          { error: "Request timeout - Vercel function limit reached" },
          408,
          { "Content-Type": "application/json" },
          sessionCookie
        );
      }
      
      if (error.message.includes('memory') || error.message.includes('out of memory')) {
        return buildJsonResponse(
          { error: "Function memory limit exceeded" },
          507,
          { "Content-Type": "application/json" },
          sessionCookie
        );
      }
      
      if (error.message.includes('cold start') || error.message.includes('function')) {
        return buildJsonResponse(
          { error: "Function initialization error - please retry" },
          503,
          { "Content-Type": "application/json" },
          sessionCookie
        );
      }
    }
    
    let errorMessage = "Unexpected error";
    let retryable = false;
    
    if (error instanceof Error) {
      if (error.name === 'AbortError') {
        errorMessage = "Request timed out. Please try again.";
        retryable = true;
      } else if (error.message.includes('fetch')) {
        errorMessage = "Network error. Please check your connection and try again.";
        retryable = true;
      }
    }
    
    return buildJsonResponse(
      { 
        error: errorMessage,
        retryable: retryable,
        details: error instanceof Error ? error.message : String(error)
      },
      500,
      { "Content-Type": "application/json" },
      sessionCookie
    );
  }
}

export async function GET(): Promise<Response> {
  return methodNotAllowedResponse();
}

function methodNotAllowedResponse(): Response {
  return new Response(JSON.stringify({ error: "Method Not Allowed" }), {
    status: 405,
    headers: { 
      "Content-Type": "application/json",
      "Cache-Control": "no-cache",
      "Pragma": "no-cache"
    },
  });
}

async function resolveUserId(request: Request): Promise<{
  userId: string;
  sessionCookie: string | null;
}> {
  const existing = getCookieValue(
    request.headers.get("cookie"),
    SESSION_COOKIE_NAME
  );
  if (existing) {
    return { userId: existing, sessionCookie: null };
  }

  const generated =
    typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : Math.random().toString(36).slice(2);

  return {
    userId: generated,
    sessionCookie: serializeSessionCookie(generated),
  };
}

function getCookieValue(
  cookieHeader: string | null,
  name: string
): string | null {
  if (!cookieHeader) {
    return null;
  }

  const cookies = cookieHeader.split(";");
  for (const cookie of cookies) {
    const [rawName, ...rest] = cookie.split("=");
    if (!rawName || rest.length === 0) {
      continue;
    }
    if (rawName.trim() === name) {
      return rest.join("=").trim();
    }
  }
  return null;
}

function serializeSessionCookie(value: string): string {
  const attributes = [
    `${SESSION_COOKIE_NAME}=${encodeURIComponent(value)}`,
    "Path=/",
    `Max-Age=${SESSION_COOKIE_MAX_AGE}`,
    "HttpOnly",
    "SameSite=Lax",
  ];

  if (process.env.NODE_ENV === "production") {
    attributes.push("Secure");
  }
  return attributes.join("; ");
}

function buildJsonResponse(
  payload: unknown,
  status: number,
  headers: Record<string, string>,
  sessionCookie: string | null
): Response {
  const responseHeaders = new Headers(headers);
  
  // Add proper modern cache-control headers
  responseHeaders.set("Cache-Control", "no-cache");
  responseHeaders.set("Pragma", "no-cache");

  if (sessionCookie) {
    responseHeaders.append("Set-Cookie", sessionCookie);
  }

  return new Response(JSON.stringify(payload), {
    status,
    headers: responseHeaders,
  });
}

async function safeParseJson<T>(req: Request): Promise<T | null> {
  try {
    const text = await req.text();
    if (!text) {
      return null;
    }
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

function extractUpstreamError(
  payload: Record<string, unknown> | undefined
): string | null {
  if (!payload) {
    return null;
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
  return null;
}
