/** Preset social link types supported by the system */
export const SOCIAL_TYPES = [
  "instagram",
  "whatsapp",
  "snapchat",
  "phone",
  "website",
] as const;

export type SocialType = (typeof SOCIAL_TYPES)[number];

export type SocialLink = {
  type: string;
  value: string;
};

export function isPresetType(t: string): t is SocialType {
  return SOCIAL_TYPES.includes(t as SocialType);
}
