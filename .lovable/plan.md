## Plan: Auth + Admin Panel

### 1. Database Setup
- Create `user_roles` table (admin/user roles)
- Create `profiles` table linked to auth.users
- Set up RLS policies

### 2. Auth Pages
- `/auth` page with login/register tabs
- Guest access: all pages remain publicly viewable without login
- Only admin features and submission require auth

### 3. Admin Panel (`/admin`)
- Protected route (admin role only)
- Manage projects: add/edit/delete/toggle status
- Create `projects` table in DB to replace static data
- View submitted projects from the submission portal

### 4. Update Existing Features
- Registry reads from DB instead of static data
- Submission portal saves to DB
- Header shows login/logout + admin link for admins

### Key Decisions
- Guest users can browse the full registry without logging in
- Only admins can manage content via the admin panel
- Registration creates a regular user; admin role assigned manually
