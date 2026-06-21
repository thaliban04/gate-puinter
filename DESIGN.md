---
name: FinGate
description: Smart Security Presentation
colors:
  primary: "#3b82f6"
  background: "#080808"
  surface: "#121212"
  text-high: "#f0f0f0"
  text-med: "#888888"
  text-low: "#555555"
  border: "rgba(255, 255, 255, 0.07)"
typography:
  display:
    fontFamily: "'DM Sans', sans-serif"
    fontWeight: 700
  body:
    fontFamily: "'Outfit', sans-serif"
    fontWeight: 400
rounded:
  sm: "8px"
  md: "12px"
  lg: "18px"
spacing:
  sm: "8px"
  md: "16px"
  lg: "24px"
components:
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "#ffffff"
    rounded: "{rounded.sm}"
    padding: "11px 22px"
  button-outline:
    backgroundColor: "transparent"
    textColor: "{colors.text-med}"
    rounded: "{rounded.sm}"
---

# Design System: FinGate

## 1. Overview

**Creative North Star: "The Clean Engineering Document"**

The FinGate design system is built to present complex biometric security concepts with absolute clarity. Drawing heavy inspiration from Apple's technical web presentations, the interface relies on deep dark mode contrasts, structured whitespace, and precise typography to guide the reader through system architectures and evaluation data. It is unapologetically technical, prioritizing substance over decoration.

This system explicitly rejects playful aesthetics, heavy parallax animations, and cluttered layouts. The environment is a clean sandbox where the data and the diagrams are the only heroes.

**Key Characteristics:**
- **High-contrast technicality:** Deep blacks (`#080808`) against crisp whites (`#f0f0f0`).
- **Structured whitespace:** Generous padding around components to isolate concepts.
- **Typographic hierarchy:** Distinct separation between structural headers ('DM Sans') and readable data ('Inter').

## 2. Colors

The palette is a highly restrained dark mode, relying almost entirely on neutral surfaces with a single, sharp blue accent to indicate action or highlight key data points.

### Primary
- **Technical Blue** (`#3b82f6`): Used sparingly for primary actions, active states, and critical data highlights (like stat numbers). Its rarity ensures it draws immediate attention.

### Neutral
- **Deep Void** (`#080808`): The main background. Provides a canvas with infinite depth.
- **Surface Level 1** (`#121212`): The default card background. Barely elevated from the void.
- **High-Contrast Ink** (`#f0f0f0`): Primary body text. Optimized for maximum legibility.
- **Muted Data** (`#888888`): Secondary text, used for labels, subtitles, and less critical table data.
- **Hairline Border** (`rgba(255, 255, 255, 0.07)`): Extremely subtle dividers that structure the page without adding visual noise.

**The Focus Rule.** The primary blue accent is strictly reserved for interactive elements, active steps in workflows, and crucial statistics. Never use it as a decorative background or large fill.

## 3. Typography

**Display Font:** 'DM Sans' (with sans-serif fallback)
**Body Font:** 'Outfit' (with sans-serif fallback)

**Character:** 'DM Sans' provides geometric, confident structure for section headers and numbers, while 'Outfit' offers the ultimate pragmatic readability for dense technical paragraphs and tables.

### Hierarchy
- **Display** (700, DM Sans): Used for massive statistic numbers (`2rem`).
- **Headline** (700, DM Sans): Used for section and sub-section titles (`h1`, `h2`, `h3`).
- **Title** (700, Outfit): Used for card titles and component headers (`0.85rem` - `0.88rem`).
- **Body** (400, Outfit): Used for all explanatory text and general UI labels.
- **Label** (600/700, Outfit, Uppercase, tracked): Used for sub-labels and table headers (`th`).

**The Data Clarity Rule.** Text must never overflow or overlap. Always prioritize the readability of technical specs and tables over decorative sizing.

## 4. Elevation

The system is definitively flat. Depth is created through subtle tonal shifts (`#080808` to `#121212`) and hairline borders, not shadows.

**The Flat-By-Default Rule.** Surfaces are flat at rest. Shadows appear only as a response to state (e.g., a subtle glow on the primary button hover) and never as structural scaffolding.

### Shadow Vocabulary
- **Primary Glow** (`box-shadow: 0 8px 24px rgba(59,130,246,0.25)`): Hover state feedback for the primary button.

## 5. Components

### Buttons
- **Shape:** Softly structured (8px radius).
- **Primary:** Solid Technical Blue (`#3b82f6`) with white text.
- **Hover / Focus:** Elevates slightly (`translateY(-1px)`) and gains a blue glow (`0 8px 24px rgba(59,130,246,0.25)`).
- **Secondary / Outline:** Transparent background with muted text and a medium border (`rgba(255,255,255,0.12)`). Reverts to solid border on hover.

### Cards / Containers
- **Corner Style:** 12px radius.
- **Background:** Surface Level 1 (`#121212`).
- **Shadow Strategy:** Flat. Relies on the Hairline Border (`rgba(255,255,255,0.07)`).
- **Internal Padding:** 20px to 24px, depending on the card type.

### Problem Statements
- **Style:** Uses the standard card base but adds a distinctive 3px solid blue left border to anchor the quote.

### Workflow Steps
- **Style:** Numbered circular badges (48px) connected by a horizontal hairline track.
- **Active State:** Badge fills with primary blue and gains a subtle blue halo (`box-shadow: 0 0 0 6px rgba(59,130,246,0.15)`).

### Tables (RAB & Competitor)
- **Style:** Clean, flat tables with uppercase, tracked-out headers (`th`).
- **Row Dividers:** Hairline bottom borders.
- **Highlighting:** Important rows (like totals) use a slightly tinted background (`rgba(59,130,246,0.15)`).

## 6. Do's and Don'ts

### Do:
- **Do** use structured whitespace to separate different technical modules (SWOT, Data, Roadmap).
- **Do** rely on the hairline border (`rgba(255,255,255,0.07)`) to define card edges instead of relying on background contrast alone.
- **Do** ensure text contrast stays high; use `#f0f0f0` for core reading material.

### Don't:
- **Don't** use playful, colorful, or highly decorative visual styles.
- **Don't** use heavy parallax animations or slow, distracting transitions. Keep motion minimal and functional.
- **Don't** use dense, overlapping layouts. Give the data room to breathe.
- **Don't** use glassmorphism or heavy drop shadows as a default card style.
