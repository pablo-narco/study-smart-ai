AI Study Planner

A web application for students that helps plan studies using AI.

## Description

AI Study Planner allows you to:
- Add subjects with deadlines and priorities
- Generate personalized study plans using AI
- Get recommendations on what to study today

## Technologies

- **Frontend:** React, TypeScript, Tailwind CSS
- **Backend:** Supabase (Database + Edge Functions)
- **AI:** Lovable AI Gateway (Gemini 2.5 Flash)
- **UI:** shadcn/ui components

## How to Use

1. Add subjects through the form (name, deadline, priority)
2. Click "Generate Plan"
3. Receive a personalized study plan from AI

## Project Structure

```
src/
├── components/
│   ├── HeroSection.tsx      # Main banner
│   ├── SubjectForm.tsx      # Subject addition form
│   ├── SubjectList.tsx      # Subjects list
│   └── StudyPlan.tsx        # Plan display
├── pages/
│   └── Index.tsx            # Main page
└── integrations/
    └── supabase/            # Supabase client and types

supabase/
└── functions/
    └── generate-study-plan/ # Edge function for plan generation
```

## Database

**Table `subjects`:**
- `id` - UUID
- `name` - subject name
- `deadline` - deadline date
- `priority` - priority (low/medium/high)
- `created_at` - creation date

## Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Set up environment variables
4. Run the development server: `npm run dev`

## Environment Variables

Create a `.env` file with:
```
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
LOVABLE_AI_KEY=your_lovable_ai_key
```

