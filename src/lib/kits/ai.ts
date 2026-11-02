import { runFreeAiRouter } from "@/lib/ai/free-router";
import type { Session } from "@/lib/auth";
import { z } from "zod";
import { diagramSchema, storyboardSchema, emailContentSchema, type generateSchema } from "./contracts";

export class AiUnavailableError extends Error {}
export function parseAiJson(text: string): unknown {
  const cleaned = text.trim().replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  const start = cleaned.search(/[{[]/);
  const end = Math.max(cleaned.lastIndexOf("}"), cleaned.lastIndexOf("]"));
  if (start < 0 || end <= start) throw new AiUnavailableError("The AI provider did not return a valid document. Try again or use a template.");
  try { return JSON.parse(cleaned.slice(start, end + 1)); } catch { throw new AiUnavailableError("The AI provider returned an invalid document. Please retry."); }
}
export async function generateKit(input: z.infer<typeof generateSchema>, session: Session) {
  const instructions = {
    diagram: `Create a clear process diagram from the brief. Return ONLY JSON: {"nodes":[{"id":"unique-string","label":"short step","x":80,"y":80,"color":"blue|orange|green|slate"}],"edges":[{"from":"node-id","to":"other-id","label":"optional"}]}. Use 4–10 nodes, arrange left-to-right in rows of 3 with x increments of 250 and y increments of 160. All edges must reference existing nodes. Do not invent business facts.`,
    storyboard: `Create a practical video storyboard. Return ONLY JSON: {"scenes":[{"id":"unique-string","title":"scene title","description":"visual direction","dialogue":"suggested voiceover","durationSeconds":8,"shot":"Wide shot|Medium shot|Close-up|Screen recording"}]}. Use 3–8 scenes, each 1–120 seconds. Do not invent testimonials or business results.`,
    humanizer: `Edit the user's text to sound ${input.tone}, clear and natural. Preserve the meaning, names, numbers, qualifications and claims. Do not add facts, evade detection, or imitate a named person. Return only the edited text, not commentary.`,
    email: `Draft a concise permission-based marketing email. Return ONLY JSON with subject, preheader, bodyText (plain text with paragraph breaks), ctaLabel, ctaUrl (empty unless supplied in brief; HTTPS only), accent ("blue" or "orange"). Never invent discounts, results or offers. Leave room for the system-added unsubscribe footer.`,
  };
  const result = await runFreeAiRouter({ systemPrompt: instructions[input.kind], messages: [{ role: "user", content: input.prompt }], temperature: 0.4, maxTokens: 2400, tier: "flagship", cacheScope: { userId: session.userId, role: session.role, agentId: `kit-${input.kind}` }, bypassCache: true });
  if (result.providerUsed === "local-grounded") throw new AiUnavailableError("No generative AI provider is available. Configure a provider in AI Agents, or use the manual editor / templates. No AI output was fabricated.");
  const content = input.kind === "humanizer" ? result.content.trim() : JSON.stringify((input.kind === "diagram" ? diagramSchema : input.kind === "storyboard" ? storyboardSchema : emailContentSchema).parse(parseAiJson(result.content)));
  if (!content) throw new AiUnavailableError("The provider returned empty content. Please retry.");
  return { content, provider: result.providerName, model: result.modelUsed, kind: input.kind };
}
