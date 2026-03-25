/**
 * Build the actual URL for a social link from type and value.
 * Used for Public View and Admin preview so clicks open the right platform.
 */
export function buildSocialHrefOrNull(
  type: string,
  value: string,
): string | null {
  const t = type.toLowerCase().trim();
  const v = value.trim();
  if (!v) return null; // General rule: empty -> null

  const asHandle = (raw: string) => raw.replace(/^@/, "").trim();

  switch (t) {
    // Handle-based platforms
    case "instagram": {
      const handle = asHandle(v);
      if (!handle) return null;
      // instagram  -> https://www.instagram.com/{handle}
      return `https://www.instagram.com/${encodeURIComponent(handle)}`;
    }
    case "snapchat": {
      const handle = asHandle(v);
      if (!handle) return null;
      // snapchat   -> https://www.snapchat.com/add/{handle}
      return `https://www.snapchat.com/add/${encodeURIComponent(handle)}`;
    }
    case "soundcloud": {
      const handle = asHandle(v);
      if (!handle) return null;
      // soundcloud -> https://soundcloud.com/{handle}
      return `https://soundcloud.com/${encodeURIComponent(handle)}`;
    }
    case "arena":
    case "are.na": {
      const handle = asHandle(v);
      if (!handle) return null;
      // arena      -> https://www.are.na/{handle}
      return `https://www.are.na/${encodeURIComponent(handle)}`;
    }
    case "onlyfans": {
      const handle = asHandle(v);
      if (!handle) return null;
      // onlyfans   -> https://onlyfans.com/{handle}
      return `https://onlyfans.com/${encodeURIComponent(handle)}`;
    }

    // Website
    case "website": {
      // website -> use raw website url, no domain concatenation
      // - if value already starts with http(s), keep it
      // - otherwise prepend https://
      if (/^https?:\/\//i.test(v)) return v;
      const cleaned = v.replace(/^\/*/, "");
      if (!cleaned) return null;
      return `https://${cleaned}`;
    }

    // Phone numbers
    case "phone":
    case "phonenumber":
    case "phone-number":
    case "phonebumber": {
      // phoneNumber -> tel:<normalized_number>, no domain concatenation
      const digitsOnly = v.replace(/\D/g, "");
      if (!digitsOnly) return null;
      const hasPlus = v.trim().startsWith("+");
      const normalized = hasPlus ? `+${digitsOnly}` : digitsOnly;
      return `tel:${normalized}`;
    }

    // WhatsApp (must be based on international phone number)
    case "whatsapp": {
      // whatsapp -> https://wa.me/<international_phone_digits_only>
      const digitsOnly = v.replace(/\D/g, "");
      if (!digitsOnly) return null;
      return `https://wa.me/${digitsOnly}`;
    }

    default:
      // General rule: if we don't have a reliable public profile URL pattern, return null
      return null;
  }
}

export function getSocialHref(type: string, value: string): string {
  return buildSocialHrefOrNull(type, value) ?? "#";
}
