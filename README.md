# DONGSHIN Birthday OS

Mobile-first React app built with Vite. Designed as a personal interactive birthday gift.

Quick start

1. Install dependencies

```bash
npm install
```

2. Run dev server

```bash
npm run dev
```

Where to edit content

- Photos / assets: [src/assets](src/assets)
- Memories list: [src/data/memories.js](src/data/memories.js)
- Quiz questions: [src/data/quiz.js](src/data/quiz.js)
- Random memory items: [src/data/randomMemories.js](src/data/randomMemories.js)
- Coupons: [src/data/coupons.js](src/data/coupons.js)
- Letter: [src/data/letter.js](src/data/letter.js)

Notes

- Designed as a single-page mobile-first experience. Replace placeholder images in `src/assets` with real photos. Keep image aspect ratio consistent for best UI.

Deployment

GitHub Pages (automatic):

1. Push this repository to GitHub (create a repo and push the code).
2. On push to `main` or `master`, the included GitHub Actions workflow (`.github/workflows/deploy.yml`) will run, build the site and publish the `dist/` output to the `gh-pages` branch.

Vercel (recommended for simplest workflow):

1. Import the project in Vercel.
2. Set the build command to `npm run build` and the output directory to `dist`. The provided `vercel.json` helps Vercel detect these settings.

Manual (local):

1. Build locally: `npm run build`.
2. Serve `dist/` with any static server or push `dist/` to a hosting provider.

Live site (GitHub Pages)

If you've pushed this project to GitHub and the provided Actions workflow ran successfully, your site will be available at:

https://<your-username>.github.io/<repo-name>/

Replace the URL above with your actual repository values or edit this README to insert the final link. Example markdown link to paste here after deployment:

[Live Demo](https://your-username.github.io/repo-name/)

