import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Find jobs in West Michigan",
    prompt: "Help me find job opportunities in West Michigan",
    icon: "circle-question",
  },
  {
    label: "Review my resume",
    prompt: "Review my resume and suggest improvements for job applications",
    icon: "circle-question",
  },
  {
    label: "Practice interview questions",
    prompt: "Help me practice common interview questions",
    icon: "circle-question",
  },
  {
    label: "Job search strategy",
    prompt: "Give me advice on my job search strategy",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Ask about jobs, resumes, interviews, or career advice...";

export const GREETING = "Hi Dren! I'm here to help you find your next great job in West Michigan. What would you like to work on today?";

export const getThemeConfig = (theme: ColorScheme): ThemeOption => ({
  color: {
    grayscale: {
      hue: 220,
      tint: 6,
      shade: theme === "dark" ? -1 : -4,
    },
    accent: {
      primary: theme === "dark" ? "#3b82f6" : "#1e40af",
      level: 1,
    },
  },
  radius: "round",
  // Add other theme options here
  // chatkit.studio/playground to explore config options
});
