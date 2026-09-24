# Feature intent

Each `src/features/<name>/` holds a `CLAUDE.md` with that feature's intent. It
loads automatically when files in that folder are read, so it only costs tokens
while working on that feature.

- New feature: write it before any code, from the user's own words. Ask only
  about gaps that would change what gets built; never invent intent.
- Later changes: if a request conflicts with the intent, say so before coding.
  When intent changes, update the file in the same PR.
- Max ~20 lines. Only what code and tests can't show. No file lists, function
  names, or implementation steps — those go stale.

Template:

    # <Feature> — intent
    Why: <user problem, 1–2 lines>
    Scope: <what it does>
    Non-goals: <what it deliberately won't do>
    Decisions: <YYYY-MM-DD — choice — reason>; replace superseded ones
    Done when: <observable checks; each becomes a test>
