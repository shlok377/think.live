---
name: Technical Precision
colors:
  surface: '#f7f9fb'
  surface-dim: '#d8dadc'
  surface-bright: '#f7f9fb'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f2f4f6'
  surface-container: '#eceef0'
  surface-container-high: '#e6e8ea'
  surface-container-highest: '#e0e3e5'
  on-surface: '#191c1e'
  on-surface-variant: '#45464d'
  inverse-surface: '#2d3133'
  inverse-on-surface: '#eff1f3'
  outline: '#76777d'
  outline-variant: '#c6c6cd'
  surface-tint: '#565e74'
  primary: '#000000'
  on-primary: '#ffffff'
  primary-container: '#131b2e'
  on-primary-container: '#7c839b'
  inverse-primary: '#bec6e0'
  secondary: '#0051d5'
  on-secondary: '#ffffff'
  secondary-container: '#316bf3'
  on-secondary-container: '#fefcff'
  tertiary: '#000000'
  on-tertiary: '#ffffff'
  tertiary-container: '#0b1c30'
  on-tertiary-container: '#75859d'
  error: '#ba1a1a'
  on-error: '#ffffff'
  error-container: '#ffdad6'
  on-error-container: '#93000a'
  primary-fixed: '#dae2fd'
  primary-fixed-dim: '#bec6e0'
  on-primary-fixed: '#131b2e'
  on-primary-fixed-variant: '#3f465c'
  secondary-fixed: '#dbe1ff'
  secondary-fixed-dim: '#b4c5ff'
  on-secondary-fixed: '#00174b'
  on-secondary-fixed-variant: '#003ea8'
  tertiary-fixed: '#d3e4fe'
  tertiary-fixed-dim: '#b7c8e1'
  on-tertiary-fixed: '#0b1c30'
  on-tertiary-fixed-variant: '#38485d'
  background: '#f7f9fb'
  on-background: '#191c1e'
  surface-variant: '#e0e3e5'
typography:
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: '700'
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: '600'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  terminal-sm:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px
  label-caps:
    fontFamily: Inter
    fontSize: 12px
    fontWeight: '600'
    lineHeight: 16px
    letterSpacing: 0.05em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  grid-margin: 24px
  grid-gutter: 16px
  bento-padding: 24px
  stack-gap: 12px
---

## Brand & Style
The design system is engineered for high-stakes technical environments, specifically tailored for installation wizards and setup flows. The brand personality is authoritative, transparent, and efficient, aiming to reduce user anxiety during complex configuration tasks. 

The aesthetic blends **Modern Corporate** reliability with **Developer-Centric** utility. It utilizes a **Bento Grid** layout to modularize information, ensuring that system requirements, progress logs, and configuration inputs are logically separated but visually cohesive. The emotional response should be one of "controlled progress"—where the user feels the interface is as robust as the software they are installing.

## Colors
This design system utilizes a professional Slate and Blue palette. 
- **Primary (#0F172A):** A deep slate used for high-contrast text and primary navigation elements to ensure maximum legibility.
- **Secondary (#2563EB):** A vibrant blue used for interactive states, progress indicators, and primary "Next" actions.
- **Tertiary (#64748B):** A muted slate for secondary information, borders, and disabled states.
- **Neutral (#F8FAFC):** The foundational surface color, providing a clean canvas for high-contrast bento containers.

Surface tiers are defined by Material Design 3's tonal elevation, where higher-priority configuration panels sit on slightly brighter or more shadowed surfaces to distinguish them from the background.

## Typography
The typography strategy prioritizes scan-readability and technical clarity. 
- **Inter** is the primary typeface, chosen for its neutral, highly legible glyphs that remain crisp on high-resolution displays. 
- **Geist** is introduced specifically for terminal outputs, code snippets, and configuration paths, providing a monospaced "developer-centric" feel to log areas within the installation wizard.
- **Scale:** On mobile devices, `headline-lg` should scale down to 24px to maintain the Bento grid's integrity. All monospaced terminal text remains at 14px for technical accuracy.

## Elevation & Depth
In alignment with M3 principles, depth is communicated through **Tonal Layers** and **Subtle Shadows**.

- **Bento Containers:** These use a white or near-white background with a 1px solid border (#E2E8F0) and a very soft, diffused shadow (0px 4px 12px rgba(15, 23, 42, 0.05)).
- **Active State:** When a configuration card is focused or active, its border color transitions to the secondary blue (#2563EB) to signal user focus without excessive elevation.
- **Terminal Area:** Inset depth is used for log areas, utilizing a slight inner shadow to simulate a recessed "command line" screen.

## Shapes
The shape language is **Soft (0.25rem)** to maintain a professional, architectural feel. 
- **Buttons and Inputs:** Use a standard 4px radius (`rounded`).
- **Bento Containers:** Use a slightly larger 8px radius (`rounded-lg`) to create a clear visual distinction between the outer frame and the inner interactive elements.
- **Progress Bars:** Use fully rounded ends (pill-shaped) to provide a soft contrast to the otherwise geometric and structured layout.

## Components
- **Buttons:** 
  - *Primary:* Filled M3 style with Slate (#0F172A) background and white text. 
  - *Secondary:* Outlined with a 1px Slate border for "Back" or "Cancel" actions.
- **Bento Cards:** The core structural unit. Must include a header area for an icon and a `label-caps` title.
- **Terminal Log:** A dark-themed container (Slate-900) using `terminal-sm` typography. Syntax highlighting should use Success (#059669) for "Done" states and Error (#DC2626) for "Failed" logs.
- **Inputs:** Clean, outlined text fields with high-contrast labels. Focus states must use the Secondary Blue (#2563EB) with a 2px stroke.
- **Progress Stepper:** A vertical or horizontal track using the Primary Slate for completed steps and Secondary Blue for the current active step.
- **Checkboxes/Radios:** Standard M3 geometry, utilizing the Secondary Blue for the "Selected" state.