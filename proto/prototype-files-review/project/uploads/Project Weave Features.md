#ProjectWeave
# Project Weave — Features

Working name: Weave (placeholder). A media mind map app for planning how you spend your time, alone or with friends. Save movies, music, books, YouTube videos and playlists, then arrange them in order on a visual canvas so you know exactly what's happening and when, before you even show up.

The problem this solves: meeting friends and burning half the time just figuring out what to do. The point is to have already figured it out, whether that's a birthday planned hour by hour or a movie marathon with soundtracks between films.

## v1 features

### Save anything

Search and save movies (via TMDB), music and playlists (via Spotify), books (via Google Books or Open Library), and YouTube videos or playlists. Each saved item keeps its title, image, source link, a status (want to / in progress / done), and an optional rating.

### List view

A plain list of everything saved, filterable by type and by status. The simple, no-frills way to browse what you've collected, for anyone who never touches the canvas.

### Canvas view

The core of the app. Drag saved items onto a visual board and connect them with lines. Connections carry direction and order, so a chain reads as "this, then this, then this," not just a loose link between two things. Each connection or card can carry a short note or a time label ("7 PM," "after dinner"), which is what makes hour by hour planning possible, a whole evening laid out visually before it happens.

Each media type gets its own accent color, so a movie card, a music card and a book card are distinguishable at a glance without reading labels.

### Manual reminders

Pick a date and time on any item or group of items, get a local and push notification when it matters.

### Automatic movie premiere reminders

For movies saved before their release date, a scheduled check against TMDB fires a "buy tickets" notification a few days before release.

### Smart suggestion: movie to soundtrack

When a movie is marked done, the app checks for a known soundtrack or official playlist and offers to add it to the canvas, pre-linked to the movie. Accept or dismiss, either way it's logged, since this number decides whether more automatic suggestions get built later.

### Export and share

Since live multi user editing isn't in v1, a finished canvas can be exported as a PDF, an image, or (if feasible without added cost) a read only shareable link, a public page rendering the plan with no login and no editing. This is how a plan actually gets shared with friends, closer to sharing a read only doc link than inviting someone into a live shared workspace.

### Cross platform from one codebase

Built with Expo, so the same app runs on web, iPhone, iPad and Mac, no separate rebuild per platform.

## Deliberately out of v1

Live multi user canvas editing (inviting others to co-edit the same board in real time). Solo-created, then exported and shared read only, is the v1 approach instead.

YouTube-based automatic suggestions, website/article saving, automatic book-to-adaptation suggestions, and music release alerts beyond the movie premiere check.

Travel and place categories (hotels, museums, restaurants, sightseeing). These are really a second product, a travel planner, with a different data shape (dates, price, location) than a media watchlist, and would dilute the core idea if bundled in from day one.

Local event discovery (concerts, museum exhibits, restaurant events). No single reliable API covers this well across categories or cities, coverage would be strong only in major markets, and it would turn the app into a listings/discovery product competing with Eventbrite and city guides, which isn't the core idea.

## Possible future direction: shared canvases

The natural next step once solo canvas usage is proven: invite others to build a shared plan together in real time, planning a movie night or a trip collaboratively. This is the social layer, and it comes with real requirements of its own, invitations and edit permissions, real time sync so two people editing don't overwrite each other, and separate notification handling from the personal reminder system.

This is a stronger fit for the product than local event data, since it extends the existing canvas and connection feature rather than adding a new content type. But it has the same cold start problem any social feature has, it only gets good once enough people use it, so the plan is to revisit this only after v1 proves people actually use the canvas solo first. If solo canvas usage is low, a shared version won't fix that on its own.
