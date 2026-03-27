/** Preset social link types supported by the system */
export const SOCIAL_TYPES = [
  "instagram",
  "soundcloud",
  "whatsapp",
  "snapchat",
  "arena",
  "website",
  "phone",
  "onlyfans",
] as const;

export type SocialType = (typeof SOCIAL_TYPES)[number];

export type SocialLink = {
  type: string;
  value: string;
};

export type SkinId = "windowsxp" | "bw-test" | "brat" | "eva" | "duck";

export type SkinProps = {
  links: SocialLink[];
  id: string;
  onRequestEdit?: () => void;
};

/** KV record stored at card:<id> */
export type CardRecord = {
  status: "inactive" | "active";
  key: string;
  handle?: string;
};

/** KV record stored at user:<handle> */
export type UserRecord = {
  id: string;
  spaceName: string;
  socialLinks: SocialLink[];
  theme: SkinId;
};

export const ACTION_ERROR_CODES = [
  "INVALID_INPUT",
  "UNAUTHORIZED",
  "NOT_FOUND",
  "ALREADY_EXISTS",
  "KV_TIMEOUT",
  "KV_RATE_LIMIT",
  "INTERNAL_ERROR",
] as const;

export type ActionErrorCode = (typeof ACTION_ERROR_CODES)[number];

export type ActionResult<T = void> =
  | { success: true; data?: T }
  | { success: false; error: string; code: ActionErrorCode };

export function isPresetType(t: string): t is SocialType {
  return SOCIAL_TYPES.includes(t as SocialType);
}
