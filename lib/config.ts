import { ColorScheme, StartScreenPrompt, ThemeOption } from "@openai/chatkit";

export const WORKFLOW_ID =
  process.env.NEXT_PUBLIC_CHATKIT_WORKFLOW_ID?.trim() ?? "";

export const CREATE_SESSION_ENDPOINT = "/api/create-session";

export const STARTER_PROMPTS: StartScreenPrompt[] = [
  {
    label: "Find marketing jobs in West Michigan",
    prompt: "Help me find marketing and communications leadership opportunities in West Michigan",
    icon: "circle-question",
  },
  {
    label: "Review my marketing resume",
    prompt: "Review my integrated marketing and communications resume and suggest improvements",
    icon: "circle-question",
  },
  {
    label: "Practice marketing interview questions",
    prompt: "Help me practice interview questions for marketing leadership roles",
    icon: "circle-question",
  },
  {
    label: "Marketing career strategy",
    prompt: "Give me advice on advancing my marketing career in West Michigan",
    icon: "circle-question",
  },
];

export const PLACEHOLDER_INPUT = "Ask about marketing jobs, resume feedback, interview prep, or career strategy...";

export const GREETING = "Hi Dren! I'm here to help you find your next great marketing leadership role in West Michigan. What would you like to work on today?";

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
