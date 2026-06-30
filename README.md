# KaarYab Afghanistan

KaarYab Afghanistan is a modern opportunity finder platform that helps Afghan youth discover jobs, internships, scholarships, remote work, online courses, training programs, and volunteer opportunities in one place.

## Project Description

This final project solves a common problem in Afghanistan: opportunity information is scattered across social media groups, websites, and posts, which makes it hard to search and compare. KaarYab centralizes the listings in a clean, responsive Next.js app with search, filters, saved items, dynamic details, a dashboard, and CRUD functionality.

## Problem It Solves

- Opportunity information is scattered and difficult to track
- Users need one simple platform to browse useful listings
- Students and job seekers need a clean way to save and revisit opportunities
- Organizations need a simple submission flow for sharing new opportunities

## Features

- Home page with featured opportunities and category sections
- Opportunities page with search and multiple filters
- Dynamic opportunity details page at `/opportunities/[id]`
- Add opportunity form with validation
- Edit and delete opportunity actions
- Saved opportunities page backed by `localStorage`
- Dashboard with stats and simple charts
- About page and contact form
- Dark mode and responsive design
- Loading, error, and not-found states
- Demo data clearly labeled for presentation safety

## Technologies Used

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- React Hook Form
- Zod
- LocalStorage

## Folder Structure

```text
app/
components/
context/
data/
lib/
```

## How to Run Locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

## Scripts

- `npm run dev` - start development server
- `npm run build` - create production build
- `npm run start` - run production server
- `npm run lint` - run ESLint

## Screenshots

Add screenshots here before final submission:

- Home page
- Opportunities page
- Opportunity details page
- Add opportunity form
- Dashboard
- Saved opportunities

## Live Demo Link

Replace this with your deployed Vercel URL.

## GitHub Link

Replace this with your GitHub repository URL.

## Future Improvements

- Multi-language support for English, Dari, and Pashto
- Authentication for admin and organization accounts
- Real backend API or database
- Email notifications for new opportunities
- More advanced charts and analytics
- Opportunity approval workflow

## Final Presentation Notes

When presenting, explain:

1. The problem the project solves
2. The target users
3. The main features and CRUD flow
4. How search, filters, save, and dashboard work
5. Which technologies were used
6. What you learned and what you would improve next

## Demo Data Note

This project uses sample data. The website is safe to demo because no real user accounts or private information are required.
