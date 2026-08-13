# Changelog

All notable changes to this project will be documented in this file.

## v2.1
- Added persistent favorites via `localStorage` with quick toggle actions
- Added recently viewed movies tracking and carousel on the home page
- Added persistent theme switching (`Light`, `Dark`, `System`) supporting `prefers-color-scheme`
- Added movie sharing with native `navigator.share` and clipboard fallback with toast feedback
- Added streaming watch providers on the Movie Details page (`WhereToWatchSection` & `ProviderCard`)

## v2.0
- Migrated build tooling from Create React App to Vite for lightning-fast bundling
- Converted entire codebase to TypeScript with strict type safety
- Redesigned UI with Tailwind CSS and modern dark aesthetic
- Added comprehensive Movie Details page with cast, crew, trailers, recommendations, and metadata
- Added fully responsive mobile and desktop layout with accessible navigation
- Configured automated GitHub Actions deployment to GitHub Pages

## v1.0
- Initial Create React App setup with basic OMDb movie search
