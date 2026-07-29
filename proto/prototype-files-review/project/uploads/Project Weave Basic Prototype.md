#ProjectWeave
# Project Weave — Basic Prototype Spec

Purpose of this document: describe, screen by screen, what a first basic prototype should show, so it can be handed to Claude Code as a build spec. This is deliberately minimal, just enough screens to test the core idea (save things, arrange them on a canvas in order, export a plan), not the full feature set from the main plan.

## Screen 1 — Home / List view

Top: search bar to add a new item (movie, music, book, video, playlist).

Below: a simple list of saved items, each row shows a thumbnail, title, a small colored tag for media type, and a status tag (want / in progress / done).

Filter row above the list: buttons or chips to filter by media type, all types shown by default.

A toggle in the top corner to switch between List view and Canvas view.

Tapping an item opens a small detail view, showing full title, image, and options to edit status, delete, or open on canvas.

## Screen 2 — Save flow

Triggered from the search bar on the Home screen.

User types a title, results appear below as they type (pulled from TMDB, Spotify, Google Books/Open Library, YouTube, depending on which type is selected).

A row of type filters above the results (Movie, Music, Book, Video, Playlist) so search narrows to one source at a time.

Tapping a result adds it to the saved list immediately and returns to Home.

## Screen 3 — Canvas view

A blank, pannable, zoomable canvas.

Saved items appear as cards floating on the canvas (only once dragged there from a side panel or list, not automatically all at once, so the canvas stays a deliberate plan rather than a dumping ground).

A collapsible side panel or drawer lists saved items not yet placed on canvas, so the user can drag them onto the board.

User draws a line between two cards to connect them, connections can have a small label (like a time, "7 PM," or a short note, "watch before dinner").

Lines carry a visible direction (arrow) to show order, first this, then this.

Basic zoom and pan controls, plus a "fit to screen" button.

## Screen 4 — Export

Accessible from the Canvas view, a single button, "Export Plan."

Two options: Export as PDF/Image, or Copy Shareable Link (if the read only link feature is built; if not yet available, PDF/Image only for this prototype).

A simple preview of what the exported plan looks like before confirming, cards in their placed order, connections with labels, nothing else, no app chrome.

## What this prototype leaves out on purpose

No auth screen needed yet if testing locally, a single hardcoded user is fine for a first pass.

No reminders, no push notifications, no smart suggestions (soundtrack matching), these come after the core save-arrange-export loop works.

No settings screen.

No onboarding flow, just drop the user straight into Home with a couple of sample items pre-loaded so the canvas isn't empty on first open.

## Why this scope

This is the smallest version that tests the actual idea: can someone save a few things, arrange them on canvas in a clear order, and export something they'd actually show a friend. Everything else in the full plan (reminders, auto suggestions, multi-user editing) depends on this loop working and feeling good first.
