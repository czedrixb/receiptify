
# Receiptify

This project is a simplified clone of Receiptify that displays your top 5 tracks as a receipt. It is limited to specific users I’ve added to the user management of my Spotify dashboard, as the app is in development mode 😔. Built with Nuxt — a single codebase where Nitro server routes handle the Spotify OAuth flow and proxy the API calls, so the access token stays in an httpOnly cookie and never reaches the browser.

## Setup

```bash
npm install
cp .env.example .env   # fill in your Spotify credentials
npm run dev
```

Then open http://127.0.0.1:3000.

### Environment variables

| Variable | Description |
| --- | --- |
| `NUXT_SPOTIFY_CLIENT_ID` | Client ID from the [Spotify dashboard](https://developer.spotify.com/dashboard) |
| `NUXT_SPOTIFY_CLIENT_SECRET` | Client secret from the same app |

### Spotify redirect URIs

Register both of these in your Spotify app settings:

- `http://127.0.0.1:3000/api/callback` — local development (Spotify no longer accepts `http://localhost`)
- `https://<your-app>.vercel.app/api/callback` — production

## How it works

| Route | Purpose |
| --- | --- |
| `GET /api/login` | Redirects to Spotify's authorize page |
| `GET /api/callback` | Exchanges the code for a token, stores it in an httpOnly cookie, redirects to `/receipt` |
| `GET /api/receipt` | Returns the current user and their top 5 tracks |

## Authors

- [@czedrixb](https://www.github.com/czedrixb)
