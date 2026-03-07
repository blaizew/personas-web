import { tool } from 'ai';
import { z } from 'zod';
import { getModule, getModuleList } from './personas';

export function createModuleTool(personaSlug: string) {
  const modules = getModuleList(personaSlug);

  return tool({
    description: `Load a situational knowledge module to deepen your response. Available modules: ${modules.join(', ')}`,
    parameters: z.object({
      moduleFile: z.string().describe('Module filename from the routing table'),
    }),
    execute: async ({ moduleFile }) => {
      try {
        return getModule(personaSlug, moduleFile);
      } catch {
        return `Module not found: ${moduleFile}. Available: ${modules.join(', ')}`;
      }
    },
  });
}
