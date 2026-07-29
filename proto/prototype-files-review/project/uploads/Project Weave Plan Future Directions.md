#ProjectWeave 
# ProjectWeave

Ideas discussed but deliberately kept out of v1. Revisit after the core movies, music, books product is live and you have real usage data, especially on whether people actually use the canvas.

## Travel and place categories

Original idea included hotels, sightseeing, museums and restaurants alongside the media side. These were split off because they are really a second product, a travel planner, not a media watchlist. The data shape is different (dates, price, location vs title, rating, release date) and mixing both into one schema from day one would make the app fit neither well.

If revisited, treat this as its own surface inside the app, maybe a second canvas type ("trip" instead of "media"), rather than forcing it into the same item model as movies and books. Google Maps saved lists and TripIt already half solve this space, so the differentiator would again need to be the connection layer, linking a saved museum to a nearby saved restaurant and a hotel, visually, on a map based canvas.

## Local event data (grasping events from local event holders)

Considered and set aside. Problems:
- No single reliable API covers concerts, museum exhibits and restaurant events globally
- Would need to stitch together Ticketmaster, Eventbrite and others per category, with real gaps for museums and restaurants
- Coverage would be strong in major cities and thin almost everywhere else, making the feature feel broken for most users
- Turns the app into a listings/discovery product, competing with Eventbrite and city guides, which is not the core idea

Not worth pursuing as currently framed. Would need a fundamentally different data strategy to work well.

## Shared events and group canvases (option one)

User-created events where you invite others and build a shared mind map together of what will happen, for example planning a movie night or a trip with friends, collaboratively adding items and connections to one canvas.

This is the social layer, entered through a different door. Same cold start problem as any social feature: needs enough users with overlapping interest before shared canvases are worth using at all. Also needs:
- Invitations and permissions (who can view vs edit a shared canvas)
- Real time or near real time sync so two people editing don't overwrite each other
- Notification handling separate from the personal reminder system already planned

Better fit for the product than local event data, since it extends the existing canvas and connection feature rather than adding a new content pipeline. Natural extension: book to soundtrack to shared hangout plan.

Suggested revisit point: after v1 launch, once there is real data on whether people use the canvas the way intended. If canvas usage is low in solo mode, a shared/social version is unlikely to fix that, the personal version needs to work first.

## Other deferred items (carried over from main plan)

- YouTube video saving
- Website/article saving
- Automatic book-to-adaptation suggestions (movie already covers soundtrack)
- Music release alerts beyond the movie premiere reminder
