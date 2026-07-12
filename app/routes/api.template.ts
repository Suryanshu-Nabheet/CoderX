import { json } from '@remix-run/node';
import { loadBundledTemplate } from '~/lib/.server/local-templates';
import { withSecurity } from '~/lib/security';

async function templateLoader({ request }: { request: Request }) {
  const url = new URL(request.url);
  const templateId = url.searchParams.get('templateId');

  if (!templateId) {
    return json({ error: 'Template ID is required' }, { status: 400 });
  }

  try {
    const files = await loadBundledTemplate(templateId);
    const filteredFiles = files.filter((file) => !file.path.startsWith('.git'));

    return json(filteredFiles);
  } catch (error) {
    console.error('Error loading bundled template:', error);

    return json(
      {
        error: 'Failed to load template files',
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 },
    );
  }
}

export const loader = withSecurity(templateLoader, {
  rateLimit: true,
  allowedMethods: ['GET'],
});
