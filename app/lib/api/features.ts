export interface Feature {
  id: string;
  name: string;
  description: string;
  viewed: boolean;
  releaseDate: string;
}

/** Release highlights shown in Settings. Add entries when shipping notable features. */
const RELEASE_FEATURES: Feature[] = [];

export const getFeatureFlags = async (): Promise<Feature[]> => RELEASE_FEATURES;

export const markFeatureViewed = async (_featureId: string): Promise<void> => {
  // Persisted client-side via useFeatures (localStorage).
};
