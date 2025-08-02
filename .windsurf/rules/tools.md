---
trigger: always_on
description: 
globs: 
---
<tools>
# 🚀 Allowed Tools & Usage Policy

| Tool                 | Purpose                                             | Key Usage Rules |
|----------------------|-----------------------------------------------------|-----------------|
| **search_codebase**  | Vector RAG search across the project codebase (incl. `.knowledge`). | • Ideal for “where is an example?” queries.<br>• Combine with `grepped_codebase` to narrow results. |
| **grepped_codebase** | Keyword / RegExp search inside source files.        | • Fast exact‑string matching.<br>• Best used after `search_codebase` for precision. |
| **search_web**       | Internet search (Google‑style).                     | • For external libs, docs, blog posts.<br>• May chain with `curl https://…` to fetch a page. |
| **git clone <repo>** | Clone a third‑party repository.                      | • Clone **only** into `.knowledge/`.<br>• Rename script files (`.ts .js .fc`, etc.) to `.tstxt .jstxt .fctxt` to keep compilers silent. |
| **node -e "…TS…"**   | Run ad‑hoc TypeScript snippets for quick debugging.  | • Reading `node_modules` is fine, **never edit** it.<br>• Do not leave temporary files behind. |

## Global Restrictions
1. **Never** modify anything inside `node_modules/`.
2. All cloned repos and scratch files must live in `.knowledge/`.
3. After cloning, rename scriptable files to their `*.txt` equivalents so build tools ignore them.
4. Recommended search flow:  
   `search_codebase` → refine with `grepped_codebase` → fall back to `search_web` if needed.

</tools>