## Supabase Setup and Schema

### Structure

The structure of the database is meant to make it super easy and secure to get Draw up and running.
[![DB Schema](https://bzortqhjphsocjbvbxdq.supabase.co/storage/v1/object/public/public-assets/draw/Draw-Readme-DB-Schema.png)]()

### Instructions

To get started, first create a Supabase Account and a new project.

Go to the SQL Editor and run the following SQL Queries:

Create the table

```
CREATE TABLE draw (
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    page_elements JSONB,
    page_id UUID PRIMARY KEY,
    page_state JSONB,
    user_id UUID REFERENCES auth.users(id),
    name TEXT,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
```

Enable RLS (read more about RLS [here](https://supabase.com/docs/guides/database/postgres/row-level-security))

```
alter table "draw" enable row level security;
```

Add the RLS Policy

```
create policy "Enable actions for users based on user_id"
on "public"."draw"
as PERMISSIVE
for INSERT
to authenticated
with check ((select auth.uid()) = user_id);
```
