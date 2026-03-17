PRD: Industrial Dynamic NFC Link System
1. Project Overview
A high-frequency, dynamic landing page system for 100 physical NFC chips. Each chip maps to a unique URL path (/link/00001 to /link/00100). The system allows for "Physical-to-Digital" ownership activation via a 3-digit PIN and dynamic social link management.

2. Tech Stack
Framework: Next.js 15 (App Router)

Database: Vercel KV (Redis)

Styling: Tailwind CSS

Icons: Lucide React

Deployment: Vercel

3. Core Logic & User Flow
A. Route Protection
The system only accepts paths in the range /link/00001 through /link/00100.

Any other ID or malformed path must trigger a notFound().

B. State Machine
State: Unactivated (First Visit)

Trigger: kv.get(id) returns null or no PIN.

View: Industrial "Initialize" screen.

Action: User sets a 3-digit PIN to claim the link.

State: Public View (Visitor)

Trigger: PIN exists, but user is not authenticated.

View: Display active social icons (IG, WhatsApp, etc.).

Action: Icons function as direct triggers/redirects.

State: Administrative (Owner)

Trigger: PIN verification successful.

View: CRUD interface for social links.

Action: Add/Edit/Delete links (constrained to preset types).

4. Design Requirements (Aesthetic: Industrial & Smooth)
Theme: Dark mode by default (Pure Black #000000).

Visual Grammar: High-contrast, reflective elements, smooth transitions.

Components: Large, touch-friendly buttons (min-height 60px), "toy-like" industrial finishes on interactive elements.

Typography: Monospace for IDs (e.g., 00001), Sans-serif for UI labels.

Input: 3-digit PIN input must trigger numeric keypad on mobile (inputMode="numeric").

5. Data Schema (Vercel KV)
Key: link:{id}
Value:

JSON
{
  "pin": "string",
  "links": [
    { "type": "instagram", "value": "username" },
    { "type": "whatsapp", "value": "phonenumber" }
  ]
}