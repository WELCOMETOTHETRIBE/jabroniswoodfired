# Jabroni's Wood Fired

**Old World Fire. New World Smoke.**

Premium live-fire catering, wood-fired oven manufacturing, and immersive performance dining — hand-built in Southern California.

---

## Stack

- **Frontend:** React + Vite + TailwindCSS
- **Backend:** Node.js + Express
- **Email:** Nodemailer (SMTP)
- **Deploy:** Railway (full-stack) or Railway static + GitHub Pages

---

## Local Development

### Prerequisites
- Node.js 18+
- npm 9+

### Setup

**1. Clone and install**
```bash
git clone <your-repo>
cd jabronis

# Install root deps (concurrently)
npm install

# Install server deps
cd server && npm install && cd ..

# Install client deps
cd client && npm install && cd ..
```

**2. Configure environment**
```bash
cp .env.example .env
```

Edit `.env` with your SMTP credentials:
```
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your@email.com
SMTP_PASS=your-app-password
CONTACT_EMAIL=inquiries@jabronisoodfired.com
PORT=3001
```

**3. Run dev servers**
```bash
npm run dev
```

This starts:
- Express API on `http://localhost:3001`
- Vite dev server on `http://localhost:5173`

The Vite dev server proxies `/api/*` requests to Express automatically.

---

## Build for Production

```bash
npm run build
```

This builds the React app into `client/dist/`. In production mode, Express serves the static files from `client/dist/` alongside the API.

---

## Deploy to Railway

### Option A: Single Service (recommended)

Railway will detect `railway.json` and use nixpacks to build.

1. Connect your GitHub repo to Railway
2. Set environment variables in Railway dashboard:
   ```
   SMTP_HOST=
   SMTP_PORT=587
   SMTP_USER=
   SMTP_PASS=
   CONTACT_EMAIL=
   NODE_ENV=production
   PORT=3001
   ```
3. Set the build command: `cd client && npm install && npm run build && cd ../server && npm install`
4. Set the start command: `NODE_ENV=production node server/index.js`

Railway will serve both the API and static frontend from one service.

### Option B: Separate Services

**Frontend service:**
- Root directory: `client/`
- Build command: `npm install && npm run build`
- Publish directory: `dist/`
- Set `VITE_API_URL` env var to your backend Railway URL

**Backend service:**
- Root directory: `server/`
- Build command: `npm install`
- Start command: `node index.js`
- Set all SMTP env vars

If using separate services, update the `vite.config.js` proxy and the frontend `fetch('/api/inquiry')` call to use the backend URL.

### Option C: GitHub Pages (frontend only)

For frontend-only deploy (requires separate backend URL):

1. Update `vite.config.js` with your repo name as base path if needed
2. Build: `cd client && npm run build`
3. Deploy `client/dist/` to GitHub Pages
4. Update the `fetch('/api/inquiry')` call in `Booking.jsx` to use your Railway backend URL

---

## Project Structure

```
jabronis/
├── client/                 # Vite + React frontend
│   ├── src/
│   │   ├── App.jsx         # Root component, routing
│   │   ├── main.jsx        # React entry point
│   │   ├── index.css       # CSS variables, design system, base styles
│   │   └── components/
│   │       ├── JabroniSVG.jsx    # All mascot SVG illustrations
│   │       ├── Nav.jsx           # Fixed navigation
│   │       ├── Hero.jsx          # Full-viewport hero
│   │       ├── PhaseBanner.jsx   # Phase 1/2 status strip
│   │       ├── Experience.jsx    # Performance dining flagship section
│   │       ├── Packages.jsx      # Tabbed pricing packages
│   │       ├── Oven.jsx          # Oven commission section
│   │       ├── Booking.jsx       # Inquiry form + success state
│   │       └── Footer.jsx        # Footer
│   └── public/
│       └── images/         # Drop oven-hero.jpg, oven-tile.jpg, oven-fire.jpg here
├── server/
│   ├── index.js            # Express app entry point
│   └── routes/
│       └── inquiry.js      # POST /api/inquiry — email handler
├── .env.example            # Environment variable template
├── railway.json            # Railway deploy config
└── README.md
```

---

## Adding Real Photos

Drop image files into `client/public/images/`:
- `oven-hero.jpg` — hero shot of an oven (16:9 aspect, full column width)
- `oven-tile.jpg` — detail shot (square crop)
- `oven-fire.jpg` — active fire in the hearth (square crop)

The `<img>` tags in `Oven.jsx` will automatically use them. The placeholder overlays sit behind the images and appear only when images fail to load.

---

## API Reference

### `POST /api/inquiry`

Submit a booking or commission inquiry. Sends an email via Nodemailer to `CONTACT_EMAIL`.

**Request body:**
```json
{
  "firstName": "string (required)",
  "lastName": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "type": "string (required) — inquiry type",
  "guests": "string (optional)",
  "dateLocation": "string (optional)",
  "message": "string (optional)"
}
```

**Response:**
```json
{ "success": true }
// or
{ "error": "Error message" }
```

### `GET /api/health`

Health check endpoint.

```json
{ "status": "ok", "timestamp": "ISO timestamp" }
```

---

## Brand Notes

The Jabroni mascot SVGs are in `JabroniSVG.jsx`. All five variants are hand-coded SVGs:
- `JabroniMascot` — full color, full figure
- `JabroniSilhouette` — for hero watermark
- `JabroniTipHat` — booking confirmation state
- `JabroniShrug` — 404 page
- `JabroniIcon` — section dividers (28px compact)

Design tokens are defined as CSS variables in `index.css` and mirrored in `tailwind.config.js`.
