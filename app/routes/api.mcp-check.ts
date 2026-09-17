import { createScopedLogger } from '~/utils/logger';
import { MCPService } from '~/lib/services/mcpService';
import { withSecurity } from '~/lib/security';

const logger = createScopedLogger('api.mcp-check');

async function checkMcpServers() {
  try {
    const mcpService = MCPService.getInstance();
    const serverTools = await mcpService.checkServersAvailabilities();

    return Response.json(serverTools);
  } catch (error) {
    logger.error('Error checking MCP servers:', error);
    return Response.json({ error: 'Failed to check MCP servers' }, { status: 500 });
  }
}

export const loader = withSecurity(checkMcpServers, {
  rateLimit: true,
  allowedMethods: ['GET'],
});
