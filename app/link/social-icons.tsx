const SOCIAL_IMAGES: Record<string, string> = {
  instagram: "/instagram.png",
  whatsapp: "/whatsapp.png",
  snapchat: "/snapchat.png",
  phone: "/phone.png",
  website: "/website.png",
  onlyfans: "/onlyfans.png",
  soundcloud: "/soundcloud.png",
  arena: "/arena.png",
  "are.na": "/arena.png",
  default: "/button_round.png",
};

export function getSocialImage(type: string): string {
  const key = type.toLowerCase();
  return SOCIAL_IMAGES[key] ?? SOCIAL_IMAGES.default;
}
