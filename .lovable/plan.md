## Add Website field to Technical Information

Add a new "Website" input to the Technical Information block on the Submit page so projects can include their main URL alongside docs and contract address.

### Changes

**1. `src/pages/Submit.tsx`**
- Add `website: ""` to the form state and to the form reset on success.
- Add a new field in the Technical Information section (placed first, above Onchain Contract Address):
  - Label: "Website"
  - Placeholder: `https://yourproject.io`
  - Bound to `form.website` via `update("website", ...)`
- Pass `website: form.website || null` into the `project_submissions` insert payload.

**2. Database — `project_submissions` table**
- Add nullable `website` column (`text`) via migration so the new field can be stored. Existing rows remain valid (nullable, no default needed).

**3. Optional surfacing (not included unless requested)**
- Displaying the website on the project detail/listing pages is out of scope for this change. If you want it shown publicly on project cards or detail pages too, say the word and I'll wire that up next.

### Notes
- Field is optional (not added to `isValid` validation), matching how Documentation is treated.
- No admin panel changes needed; admins continue to delete entries as before.
