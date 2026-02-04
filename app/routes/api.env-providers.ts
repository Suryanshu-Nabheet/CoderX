import type { LoaderFunction } from '@remix-run/cloudflare';

export const loader: LoaderFunction = async () => {
  try {
    const availableProviders: string[] = [];

    return Response.json({
      success: true,
      availableProviders,
      message: `Found ${availableProviders.length} providers with API keys configured`,
    });
  } catch (error) {
    console.error('Error loading environment API keys:', error);
    return Response.json(
      {
        success: false,
        availableProviders: [],
        error: 'Failed to load environment API keys',
      },
      { status: 500 },
    );
  }
};
