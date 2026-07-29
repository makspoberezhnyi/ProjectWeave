#ProjectWeave
# Project Weave — Design System

Working name: Weave (placeholder, safe to rename later via find and replace)

## Visual direction

Warm and playful, not cinematic. The obvious choice for a media app is dark mode, high contrast, poster-heavy, moody, basically every streaming app and Letterboxd clone. That's not what makes this app different. The actual differentiator is planning and sequencing a shared block of time with friends, not the media library itself, saving movies is commodity. So the design should feel closer to a nice calendar or trip planning app, approachable and a little fun, not trying to look like a streaming service.

Posters, album covers and thumbnails already bring visual richness on their own. The UI chrome should stay light, warm and out of the way rather than compete with that imagery.

## Core principles

Rounded shapes over sharp edges, everywhere, cards, buttons, tags.

Light background as the default, not dark mode first. Dark mode can come later as a toggle, not the foundation.

Generous spacing, especially on the canvas screen, since a cluttered canvas defeats the purpose of a visual plan.

One accent color per media type, not one moody theme for the whole app. Color is how a user tells a movie card from a music card from a video card at a glance.

## Design tokens

### Colors

Background: warm off white, not stark white. Something like `#FDFBF7`.

Surface (cards, panels): pure white or very close to it, `#FFFFFF`, so cards lift slightly off the warm background.

Text primary: warm dark gray, not pure black, `#2B2620`.

Text secondary: muted warm gray, `#8A8175`.

Movie accent: warm coral/red, `#E8604C`.

Music accent: warm purple, `#8B5FBF`.

Book accent: warm gold/amber, `#D4A24C`.

Video accent: warm teal, `#3FA79B`.

Playlist accent: same family as music, a lighter shade, `#B08FD9`.

Border/divider: soft warm gray, `#EDE7DD`.

Success/positive (e.g. reminder set): soft green, `#6FAE7C`.

### Spacing scale

4, 8, 12, 16, 24, 32, 48, 64 (px). Base unit is 8px. Small gaps use 4 or 8, card padding uses 16 or 24, section spacing uses 32 to 64.

### Typography

One friendly, rounded sans serif family throughout (e.g. something like Nunito, Quicksand, or system rounded font as a placeholder until a final font is picked).

Type scale: 12 (caption), 14 (body small), 16 (body), 20 (subtitle), 24 (title), 32 (large title).

Weight: mostly regular and semibold, avoid heavy/black weights, keeps the tone soft rather than aggressive.

### Shape

Card corner radius: 16px.

Button corner radius: 12px.

Tag/chip corner radius: full pill shape.

Canvas card corner radius: 20px, slightly rounder than list cards, since canvas cards need to feel more like objects placed on a board.

### Shadow / elevation

Keep shadows soft and minimal, a slight lift on cards, nothing heavy or skeuomorphic. Something like a 2px blur, low opacity black, mostly to separate cards from the warm background rather than to look dramatic.

## Components (base set to build first)

Button: primary (filled, warm neutral or accent color), secondary (outline), text-only variant.

Card: used in list view, has image, title, type tag, status indicator.

Canvas Card: used on canvas, same content as Card but larger touch target, drag handle, connection points on edges.

Tag/Chip: small pill showing media type (color coded per the accent colors above) or status (want/in progress/done).

Input: search bar style, rounded, used in the save flow.

Connection Line: the line drawn between two canvas cards, should support an optional label (time or short note) and a directional arrow to show order.

## Notes for implementation

Recommended library: Tamagui, since it gives token support and a shared component system across web and native in one place, rather than just utility classes.

All tokens above should live in actual token files in the repo (colors, spacing, typography as separate files), not hardcoded inline anywhere. Every component should reference tokens by name.

Every media type keeps its accent color consistently across list view, canvas view and any tags or badges, this is the main way a user tells content types apart at a glance without reading labels.
