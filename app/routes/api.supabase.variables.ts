import { json, type ActionFunctionArgs } from '@remix-run/node';
import { withSecurity } from '~/lib/security';

async function supabaseVariablesAction({ request }: ActionFunctionArgs) {
  try {
    const body = (await request.json()) as { projectId?: string };
    const projectId = body.projectId;
    const authHeader = request.headers.get('Authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

    if (!projectId || !token) {
      return json({ error: 'Project ID and token are required' }, { status: 400 });
    }

    const response = await fetch(`https://api.supabase.com/v1/projects/${projectId}/api-keys`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      return json({ error: `Failed to fetch API keys: ${response.statusText}` }, { status: response.status });
    }

    const apiKeys = await response.json();

    return json({ apiKeys });
  } catch (error) {
    console.error('Error fetching project API keys:', error);
    return json({ error: error instanceof Error ? error.message : 'Unknown error occurred' }, { status: 500 });
  }
}

export const action = withSecurity(supabaseVariablesAction, {
  rateLimit: true,
  allowedMethods: ['POST'],
});
