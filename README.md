# KaarYab Afghanistan

KaarYab Afghanistan is a modern job and opportunity platform built for Afghan users. It helps people discover jobs, internships, scholarships, remote work, training programs, online courses, volunteer roles, and organization profiles in one clean application.

It supports PWA installation and uses Supabase as its database and backend service for authentication, storage, and app data sync. The project is built with Next.js App Router, React, TypeScript, Tailwind CSS, and reusable UI components.

## What The Platform Does

KaarYab is designed as a real job-seeking platform for Afghanistan, not just a demo landing page. Users can:

- Browse opportunities by category, location, type, and keyword
- Open detailed opportunity pages
- Save opportunities for later
- Explore organizations and their profiles
- Follow organizations
- Create and update a personal profile
- Upload a profile photo
- Upload and manage a resume
- Upload certifications and awards attachments
- Sign up and log in with Supabase Auth
- Use the app as a PWA on supported devices

## Main Pages

- `/` - home page with featured opportunities and platform highlights
- `/opportunities` - searchable opportunity browser with filters
- `/opportunities/[id]` - opportunity details page
- `/opportunities/[id]/edit` - edit opportunity page
- `/add-opportunity` - create a new opportunity
- `/saved` - saved opportunities
- `/dashboard` - dashboard with charts and summaries
- `/organizations` - organizations, countries, and institutions directory
- `/organizations/[slug]` - organization details page
- `/profile` - user profile, resume, experience, education, skills, languages, certifications, and awards
- `/resume-builder` - resume builder and file manager
- `/login` - login page
- `/signup` - sign up page
- `/contact` - contact form
- `/about` - about page
- `/settings` - app settings

## Core Features

### Opportunity Management

- Create opportunities
- Edit opportunities
- Delete opportunities
- View opportunity details
- Search and filter listings
- Save and revisit opportunities

### Organization Directory

- Browse organizations
- Open organization detail pages
- Follow organizations
- View opportunities by organization

### Profile System

- Edit personal information
- Upload a profile avatar
- Add country, nationality, gender, and date of birth through reusable controls
- Add experience entries
- Add education entries
- Add certifications with attachments
- Add awards with attachments
- Manage skills and languages as removable chips
- Store profile data in Supabase-backed state

### Resume Builder

- Upload resume files
- View uploaded resumes
- Download resume files
- Delete resume files
- Keep resume data tied to the logged-in user

### Authentication

- Real sign up and login with Supabase Auth
- Session-aware user state
- Logged-in users get access to profile-backed features

### PWA Support

- Web app manifest
- App icons and favicon support
- Service worker registration
- Installable experience on supported browsers and devices

## Tech Stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form
- Zod
- Supabase Auth
- Supabase Storage
- PWA manifest and service worker

## Project Architecture

### App Layer

The app router lives in `src/app`. Each page has its own route and component composition.

### Reusable Components

Common reusable building blocks live in `src/components/common`, `src/components/ui`, and feature folders such as `src/components/profile`, `src/components/opportunities`, and `src/components/dashboard`.

### State and Data

- `src/context/app-context.tsx` handles application state, auth session state, theme state, and user data
- `src/lib/app-state.ts` defines the main app state and default profile data
- `src/lib/schemas.ts` contains Zod validation schemas
- `src/data/opportunities.ts` provides demo opportunities
- `src/data/profile-options.ts` provides reusable dropdown data for countries, nationalities, and genders

### Storage Helpers

- `src/lib/avatar-storage.ts` handles avatar uploads and access URLs
- `src/lib/resume-storage.ts` handles resume uploads, downloads, and deletions
- `src/lib/profile-attachment-storage.ts` handles certification and award attachments

## UI System

The UI is designed to be compact, clean, and reusable.

- `ds-input` for shared form fields
- `ds-button-primary` and `ds-button-secondary` for buttons
- `panel`, `ds-card`, and `accent-panel` for cards and sections
- `SearchableSelect` for reusable searchable dropdowns
- `DatePickerField` for reusable date selection

## Supabase Integration

The project uses Supabase for:

- Authentication
- User session handling
- Profile persistence
- Resume uploads
- Avatar uploads
- Certification and award attachments

### Environment Variables

Create a `.env.local` file with the following values:

```bash
NEXT_PUBLIC_SUPABASE_URL=your-supabase-project-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET=avatars
NEXT_PUBLIC_SUPABASE_AVATAR_BUCKET_PUBLIC=false
NEXT_PUBLIC_SUPABASE_RESUME_BUCKET=resumes
NEXT_PUBLIC_SUPABASE_RESUME_BUCKET_PUBLIC=false
NEXT_PUBLIC_SUPABASE_PROFILE_ATTACHMENT_BUCKET=profile-attachments
NEXT_PUBLIC_SUPABASE_PROFILE_ATTACHMENT_BUCKET_PUBLIC=false
```

## Suggested Supabase Setup

### Auth

- Enable email/password authentication
- Configure email confirmation if desired

### Storage Buckets

Create these buckets in Supabase Storage:

- `avatars`
- `resumes`
- `profile-attachments`

You can keep them private and use signed URLs, or mark them public if that better fits your workflow.

### Recommended Storage Policies

For authenticated users, keep uploads scoped to each user folder when possible.

- Users can upload their own avatars
- Users can upload their own resumes
- Users can upload attachments for certifications and awards
- Users can read and delete only their own files

### App State Table

The project can sync state to a Supabase table named `app_state` when remote sync is enabled.

Recommended columns:

- `user_id`
- `email`
- `state`
- `updated_at`

If you use a different structure, update the Supabase client logic accordingly.

## Local Development

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

### Build For Production

```bash
npm run build
```

### Start Production Server

```bash
npm run start
```

### Lint

```bash
npm run lint
```

## Folder Structure

```text
src/
  app/
  components/
  config/
  context/
  data/
  lib/
public/
```

## Notes On Design

- The global background uses a soft light surface so white cards stay visible
- Cards and sections are reusable and consistent
- Fonts are controlled globally through the app layout
- Form controls are intentionally compact for a cleaner dashboard-like experience

## PWA Notes

This app includes PWA support, but local testing is limited until the site is deployed on HTTPS.

After deployment, you can:

- Install the app from supported browsers
- Test the service worker
- Verify manifest icons and app name

## Testing Checklist

- Open the home page
- Search and filter opportunities
- Open an opportunity detail page
- Log in and sign up with Supabase
- Update the profile
- Upload a profile image
- Upload a resume
- Add certifications and awards
- Open organization detail pages
- Test the app on mobile layout
- Build the project with `npm run build`

## Deployment

Recommended deployment target:

- Vercel

Make sure to add the same Supabase environment variables in the deployment dashboard.

## Future Improvements

- Server-side persistence for all user content
- More advanced resume builder templates
- Profile completion analytics
- Better organization follow notifications
- Multi-language support for English, Dari, and Pashto
- Search indexing for opportunities and organizations
- Role-based admin tools

## Demo Data

The app still includes demo opportunities and sample content for presentation and local development. Real authentication and storage are connected, but not every collection is tied to a full backend model yet.

## License

Private project for internal use and portfolio presentation.
