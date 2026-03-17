/**
 * Build the actual URL for a social link from type and value.
 * Used for Public View and Admin preview so clicks open the right platform.
 */
export function getSocialHref(type: string, value: string): string {
  const t = type.toLowerCase().trim();
  const v = value.trim();
  if (!v) return "#";

  switch (t) {
    case "instagram": {
      const user = v.replace(/^@/, "");
      return `https://instagram.com/${encodeURIComponent(user)}`;
    }
    case "whatsapp": {
      const digits = v.replace(/\D/g, "");
      return `https://wa.me/${digits}`;
    }
    case "snapchat": {
      const user = v.replace(/^@/, "");
      return `https://snapchat.com/add/${encodeURIComponent(user)}`;
    }
    case "phone": {
      const digits = v.replace(/\D/g, "");
      return `tel:${digits}`;
    }
    case "website": {
      if (/^https?:\/\//i.test(v)) return v;
      return `https://${v.replace(/^\/*/, "")}`;
    }
    default:
      if (/^https?:\/\//i.test(v)) return v;
      return `https://${v.replace(/^\/*/, "")}`;
  }
}
