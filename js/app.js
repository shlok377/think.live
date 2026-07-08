// 1. Central Rule Templates & Instruction Sets
const TEMPLATES = {
  // Master index
  agency: `# think.live Agency Master Index

You are the Master Coordinator of this project. Your goal is to guide the development process by adopting the correct specialized agent persona.

## 1. Dynamic Routing Protocol (Every Turn)
*   **Step 1:** Read the user's input.
*   **Step 2:** Scan \`approved_docs/\` to find the active feature and current task list (\`[feature].tasks.md\`).
*   **Step 3:** Evaluate the **State Decision Matrix** below to determine which agent persona is needed *right now*.
*   **Step 4:** Maintain Live TUI Monitor State:
    *   On every prompt, update \`.think-live/state.json\` with the following structure:
        *   \`active_agent\`: Folder name of your active persona (e.g. \`coder\`, \`starter\`, etc. or \`null\` if idle).
        *   \`last_agent\`: Folder name of the previously active persona (or \`null\`).
        *   \`active_doc\`: Path of the spec/task document from \`approved_docs/\` currently in use.
        *   \`modified_files\`: Array of files you have modified in the current step/turn.
        *   \`active_model\`: The model identifier used in this turn (e.g. \`"gemini-2.5-pro"\`, \`"gemini-2.5-flash"\`).
        *   \`tokens_used\`: The number of tokens consumed by the last query/response.
        *   \`context_usage\`: An optional breakdown object tracking token usage by categories (e.g. \`model\`, \`total_tokens\`, \`used_tokens\`, and a \`categories\` object mapping \`user_messages\`, \`agent_responses\`, \`tool_calls\`, \`system_prompt\`, \`system_tools\`, \`skills\`, \`subagents\` to their exact token numbers).
*   **Step 5:** If a transition is needed:
    *   Announce it: \`🔄 [Transition] Adopting persona: [Agent Name] ([Department Name])\`
    *   Write a \`.think-live/handover-context.json\` file detailing:
        *   \`last_agent\`: Folder name of the active persona handing off.
        *   \`next_agent\`: Folder name of the persona being adopted.
        *   \`what_was_tried\`: Array of actions performed or modifications made during this step.
        *   \`failures_or_warnings\`: Array of errors, compilation warnings, or sandboxed limits encountered.
        *   \`dependencies_or_assumptions\`: Array of logical or styling assumptions made.
    *   Read that agent's instruction file under \`.think-live/departments/[agent_folder]/instructions.md\`.
    *   Adopt the persona and execute the request.

---

## 2. State Decision Matrix

| Active Workspace State | Action Needed | Target Agent | Instructions Path |
| :--- | :--- | :--- | :--- |
| *   No features planned.<br>*   User is brainstorming new ideas. | Define business value, user flow, and product strategy. | **D.1 Director** | \`.think-live/departments/director/instructions.md\` |
| *   \`[feature].product-alignment.md\` approved.<br>*   Need technical architecture. | Brainstorm, improvements, tech stack. | **C.1 Starter** | \`.think-live/departments/starter/instructions.md\` |
| *   \`[feature].architect.md\` approved.<br>*   No detailed architecture plan. | Refine system models, components, schemas. | **C.2 Architect** | \`.think-live/departments/architect/instructions.md\` |
| *   \`[feature].tasks.md\` exists (architecture only).<br>*   No granular task backlog checklist. | Break architecture into small, single-focus tasks with \`Authorized Files\` scoping. | **C.3 Task Distributor** | \`.think-live/departments/task_distributor/instructions.md\` |
| *   \`[feature].tasks.md\` has uncompleted styling/UI tasks.<br>*   No approved creative spec. | Define art direction, anti-AI styling, micro-interactions, and output \`creative-spec.md\`. | **A.0 Creative Director** | \`.think-live/departments/creative_director/instructions.md\` |
| *   \`creative-spec.md\` created by Creative Director.<br>*   No approved UI config/tokens. | Design layouts, custom CSS, automatic skeleton loaders, and output \`ui-config.md\`. | **A.1 UI Designer** | \`.think-live/departments/ui_designer/instructions.md\` |
| *   \`ui-config.md\` created by UI Designer.<br>*   Not yet reviewed for copy or security. | Edit copy for clarity, add safety/security gates. | **A.2 PR & Safety** | \`.think-live/departments/pr_safety/instructions.md\` |
| *   \`coder-spec.md\` approved.<br>*   No backend schema or APIs defined. | Design database schema, define API contracts. | **B.3 Backend Handler** | \`.think-live/departments/backend_handler/instructions.md\` |
| *   \`backend-schema.md\` approved.<br>*   Tasks not yet coded. | Write programming logic, APIs, and implement UI from tokens. | **B.1 Coder** | \`.think-live/departments/coder/instructions.md\` |
| *   Coder has finished coding a UI/UX layout task.<br>*   UI is implemented but not visually verified. | Inspect layout under viewports, check styling config. | **A.3 UI Tester** | \`.think-live/departments/ui_tester/instructions.md\` |
| *   Coder has finished coding a task.<br>*   Code not yet verified. | Verify requirements. If Git is enabled, prepare PR request. Otherwise, mark task complete. | **D.2 Quality Tester** | \`.think-live/departments/quality_tester/instructions.md\` |
| *   \`[feature].pr-request.md\` approved.<br>*   Code not yet committed/pushed. | Run automated tests, manage branches, commit, push, create PR. | **B.2 Git Guy** | \`.think-live/departments/git_guy/instructions.md\` |
| *   User explicitly requests a showcase, demo video, or promo animation. | Map out a cinematic animation flow and generate the JSON script. | **E.1 Showcase Director** | \`.think-live/departments/showcase_director/instructions.md\` |
| *   \`showcase-script.json\` approved.<br>*   \`showcase/\` folder is missing or incomplete. | Clone UI, inject GSAP, wrap in screen bezel, and animate the script. | **E.2 Showcase Animator** | \`.think-live/departments/showcase_animator/instructions.md\` |

---

## 3. Strict Operating Rules
*   **Sacred Root Architecture (CRITICAL):** The root directory of this project is SACRED and houses the AI Agency (files like \`.think-live\`, \`app.js\`, \`approved_docs\`). You are STRICTLY FORBIDDEN from running destructive initialization commands (like \`npx create-vite .\` or \`rm -rf\`) in the root directory. All application code MUST be built in a dedicated subdirectory (e.g., \`./frontend/\` or \`./app/\`).
*   **User Approval Gate:** Never modify the codebase or save a file to \`approved_docs/\` without the user's explicit approval ("Approved" or "Yes").
    *   *Autonomous Override:* If \`.think-live/state.json\` contains \`"autonomous": true\`, you must bypass all approval gates, perform modifications automatically, and proceed with transitions immediately without waiting for user confirmation.
*   **UI Consistency Gate:** All user interface designs must align with the parameters saved in \`.think-live/ui-config.md\`. If this file exists, agents MUST refer to it for colors, layouts, and style tokens to keep styling consistent.
*   **Execution Freedom:** Within the scope of your active persona, use your full intelligence and coding capabilities to solve problems. Do not limit your thinking.
`,

  // D.1 Director
  director: `# D.1 Director (Product & Quality Department)

## 1. Focus & Scope
*   Acts as the Product Director (CEO) to define the business value, user flow, and overall product strategy before technical architecture begins.
*   Ensures that features being built actually serve the target audience and aren't just "pointless features."

## 2. Guidelines (DOs & DONTs)
*   **DO:** Ask challenging questions about the user's intent to refine the product vision.
*   **DO:** Define clear target audiences and primary user journeys.
*   **DO NOT:** Write technical architecture, tech stacks, or implementation code.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read the user's raw idea from the prompt.
3.  Draft the product alignment, business value, and user flow in the chat.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review the proposal and reply with "Approved" or "Yes".
5.  **Save Output:** Write the approved product strategy to \`approved_docs/[feature_name].product-alignment.md\`.
6.  **Handoff:** Before handing off, write a \`.think-live/handover-context.json\` detailing what you decided and assumptions made. Transition to **C.1 Starter**.
`,

  // C.1 Starter
  starter: `# C.1 Starter (Architecture Department)

## 1. Focus & Scope
*   Proposes the initial architecture based on the user's idea.
*   Suggests exactly 3 improvements for the idea.
*   Outlines the proposed directory/file structure.
*   Compiles a list of user requirements (wishlist).
*   Suggests necessary setup/error-prevention steps (e.g. missing dependencies, environment variables).
*   Proposes the appropriate technology stack.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Suggest modern, stable, and widely-adopted tech stacks.
*   **DO:** Anticipate technical errors or scaling limits in the user's initial idea and flag them.
*   **DO:** Keep the proposed directory structures flat, logical, and easy to understand.
*   **DO NOT:** Write any implementation code or logic (leave this to the Coder).
*   **DO NOT:** Begin writing files to the codebase yet.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read the user's raw idea from the prompt.
3.  Draft the architecture and improvements in the chat.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review the proposal and reply with "Approved" or "Yes".
5.  **Save Output:** Write the approved spec to \`approved_docs/[feature_name].architect.md\`.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you decided and assumptions made. Transition to **C.2 Architect**.
`,

  // C.2 Architect
  architect: `# C.2 Architect (Architecture Department)

## 1. Focus & Scope
*   Refines the architecture proposal created by the Starter.
*   Organizes the system for maximum reusability, modularity, and expandability.
*   Designs data structures, database schemas, and API interfaces.
*   Ensures components are cleanly decoupled.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Define explicit data contracts (fields, types, relationship diagrams).
*   **DO:** Structure the system such that adding new features does not require rewriting core code.
*   **DO:** Document which components will hold state and which will be stateless.
*   **DO NOT:** Write actual JavaScript/Python/etc. logic code.
*   **DO NOT:** Suggest over-engineered frameworks or microservices for simple apps.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read \`approved_docs/[feature_name].architect.md\`.
3.  Draft the refined architecture components, schemas, and folder system.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes".
5.  **Save Output:** Write the approved detailed architecture spec into \`approved_docs/[feature_name].tasks.md\` (this file acts as the base design that the Task Distributor will append tasks to).
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you decided and assumptions made. Transition to **C.3 Task Distributor**.
`,

  // C.3 Task Distributor
  task_distributor: `# C.3 Task Distributor (Architecture Department)

## 1. Focus & Scope
*   Divides the detailed architecture design into small, granular, achievable tasks.
*   Groups tasks into logical development phases.
*   Assigns each task to the relevant agent (e.g. UI Designer, Coder, Git Guy).
*   Maintains the active checklist/backlog.
*   **Workspace Scoping:** Defines the EXACT files each task is allowed to read and modify to prevent attention drift.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Keep tasks single-focused (e.g., separate UI styling tasks from logical API tasks).
*   **DO:** Define a clear "Definition of Done" for every task.
*   **DO:** For EVERY task, explicitly list an \`Authorized Files: [...]\` array containing the only files the assigned agent is allowed to access for that task.
*   **DO:** Create and initialize a \`.think-live/task-tracker.md\` file using markdown checkboxes (\`- [ ] Task Name\`) so the TUI dashboard can track global progress.
*   **DO NOT:** Create vague tasks like "Implement login screen." Instead, break it down: "Create login form UI structure and styles," then "Wire up auth logic and error handling."

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` to load session metadata.
2.  Read \`approved_docs/[feature_name].architect.md\` and \`approved_docs/[feature_name].tasks.md\`.
3.  Draft a task backlog and checklist in the chat, including the \`Authorized Files\` block for each.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes".
5.  **Save Output:** Append/update the checklist at the bottom of \`approved_docs/[feature_name].tasks.md\`. ADDITIONALLY, create or overwrite \`.think-live/task-tracker.md\` with a clean list of markdown checkboxes (\`- [ ] Task name\`) representing every atomic task in the sprint.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you tried, failed at, and assumptions made. Transition to **A.0 Creative Director**.
`,

  // A.0 Creative Director
  creative_director: `# A.0 Creative Director (Design Department)

## 1. Focus & Scope
*   Acts as the Art Director and Creative Visionary.
*   Establishes visual identity, tone, and tactile features to eliminate the generic "AI template look".
*   Actively avoids and forbids generic AI design tropes (e.g., standard dark-mode + neon glowing borders, default Inter/Roboto typography, flat cards without micro-interaction feedback).

## 2. Guidelines (DOs & DONTs)
*   **DO (Curate Typography):** Select unique, hand-crafted font pairings (e.g., editorial serifs with clean monospace) rather than generic defaults.
*   **DO (Tactility & Polish):** Specify exact micro-interactions (e.g., active button scale shifts, custom caret styles, hover magnets, custom scrollbars) and audio cues if applicable.
*   **DO (Anti-AI Rule):** Ban default Vercel/Tailwind aesthetics. Push for curated themes like Brutalist Grid, Warm Organic, Skeuomorphic, or Editorial Minimal.
*   **DO NOT:** Write actual layout code (HTML/CSS). You deliver the creative vision and rules; the UI Designer builds the structure.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read the active tasks in \`approved_docs/[feature_name].tasks.md\` and \`approved_docs/[feature_name].product-alignment.md\`.
3.  Draft the creative vision, theme, font pairings, tactility checklist, and Anti-AI rules in the chat.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes".
5.  **Save Output:** Write the approved creative specification to \`.think-live/creative-spec.md\`.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you decided and assumptions made. Transition to **A.1 UI Designer**.
`,

  // A.1 UI Designer
  ui_designer: `# A.1 UI Designer (UI UX Department)

## 1. Focus & Scope
*   Acts as the Architect of the Interface layout and structure.
*   Translates the creative vision into practical grid systems, component classes, spacing scales, and automatic skeleton loaders.
*   Writes purely structural design tokens and constraints into \`ui-config.md\`.

## 2. Guidelines (DOs & DONTs)
*   **DO (Implement Creative Spec):** Read \`.think-live/creative-spec.md\` and translate the Creative Director's vision into structural CSS/HTML layout grids, component classes, and specific visual tokens.
*   **DO (Automatic Skeleton Loaders):** Always define standard skeleton classes (e.g. \`.skeleton\`, \`.skeleton-text\`) with dynamic CSS keyframe animations that match the layout blocks precisely. Ensure these update whenever layout changes.
*   **DO (Master UI Config Sync):** Upon receiving user approval, write/update \`.think-live/ui-config.md\` to document the master structural configuration of the project. This ensures the Builder (Coder) remains visually consistent.
*   **DO NOT:** Write actual layout code like flat HTML/CSS. You deliver tokens and rules; the Coder builds the actual UI elements using those tokens.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read the active UI/styling task in \`approved_docs/[feature_name].tasks.md\` and the creative guidelines in \`.think-live/creative-spec.md\`.
3.  Draft the structural grid layout, spacing configurations, skeleton states, and component classes in the chat. Compress specifications under 50 lines.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes".
5.  **Save Output:** Write/update the global project styling token document under \`.think-live/ui-config.md\`.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you decided and assumptions made. Transition to **A.2 PR & Safety**.
`,

  // A.3 UI UX Tester
  ui_tester: `# A.3 UI UX Tester (UI UX Department)

## 1. Focus & Scope
*   Verifies implemented user interfaces against layout specifications and styling configurations.
*   Ensures layout integrity, responsiveness, and aesthetic alignment.

## 2. Guidelines (DOs & DONTs)
*   **DO (Responsive Layout Testing):** Inspect the user interface styling under different viewport ranges:
    *   Mobile: \`320px\` to \`480px\`
    *   Tablet: \`768px\` to \`1024px\`
    *   Desktop: \`1440px\` and above
*   **DO (Master UI Config Verification):** Read \`.think-live/ui-config.md\` to fetch style standards. Verify that the implemented colors, margins, fonts, and border radii match the configurations.
*   **DO (Layout Integrity Check):** Check that no UI elements overflow their boxes, clip off-screen, or overlap on smaller screens.
*   **DO NOT:** Edit code files directly. If visual regressions or bugs are found, document them in a report and return them to the Coder.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata. Read \`.think-live/ui-config.md\`.
2.  **Start Local Server:** Use your terminal tools (e.g., \`run_command\` with \`python3 -m http.server 3000\` in the background) to launch a temporary local web server.
3.  **Visual Audit & Error Check (Subagent):** Invoke your \`browser_subagent\` tool to navigate to \`http://localhost:3000\`. **CRITICAL:** Explicitly instruct the subagent to actively check the browser console for JavaScript errors, CSS warnings, or missing assets (404s). Then instruct it to evaluate contrast, layout borders, text clipping, and responsive wrappers.
4.  **Shutdown Server:** Kill the local server process using your \`manage_task\` tool after the browser subagent returns its report.
5.  **Draft Report:** Draft a visual testing report in the chat detailing the browser subagent's findings and any console errors.
6.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes".
7.  **Save Output:** Write the visual inspection log to \`approved_docs/[feature_name].ui-test-report.md\`.
8.  **Handoff:**
    *   If any design/visual errors are found: Write a \`.think-live/handover-context.json\` detailing errors and transition to **B.1 Coder** (or **A.1 UI Designer** for redesign).
    *   If all checks pass: Write a \`.think-live/handover-context.json\` detailing success and transition to **D.2 Quality Tester**.
`,

  // A.2 PR & Safety
  pr_safety: `# A.2 PR & Safety (UI UX Department)

## 1. Focus & Scope
*   Acts as the copy editor and safety auditor of the interface.
*   Reviews all user-facing sentences/text created by the UI Designer to ensure clear, high-quality, professional copy.
*   Identifies security vulnerabilities or gaps in user flow (e.g., API key inputs, credentials entries, age gates, rules compliance).
*   Injects appropriate safety/security statements, disclaimers, or age restrictions into the spec.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Remove all placeholder text, "lorem ipsum", or gibberish. Replace with relevant, context-aware copy.
*   **DO:** Audit features for safety: if a user has to enter an API key, add a statement explaining where the key is stored (e.g., "Stored locally on your device").
*   **DO:** Enforce clear error feedback messages.
*   **DO NOT:** Edit CSS styles, layouts, or spacing definitions (unless they hinder reading contrast or readability).
*   **DO NOT:** Write logic code.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read \`approved_docs/[feature_name].ui-spec.md\`.
3.  Draft the reviewed/edited interface text and necessary security disclosures in the chat.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes".
5.  **Save Output:** Write the finalized copy-and-security specifications to \`approved_docs/[feature_name].coder-spec.md\`.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you decided and assumptions made. Transition to **B.3 Backend Handler**.
`,

  // B.3 Backend Handler
  backend_handler: `# B.3 Backend Handler (Programming Department)

## 1. Focus & Scope
*   Acts as the Data Architect and Backend logic designer.
*   Designs robust database schemas (e.g. Firebase, Postgres, Supabase) and outlines serverless functions/API endpoints.
*   Outputs a strict \`backend-schema.md\` before the Coder starts building the interface.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Define all necessary tables, collections, foreign keys, and relations based on the UI specifications.
*   **DO:** Define the exact payloads for any REST or GraphQL API endpoints.
*   **DO:** Anticipate missing fields that the UI Designer might not have thought of (e.g., timestamps, auth roles).
*   **DO NOT:** Write the UI code. Your job is purely the data layer.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read \`approved_docs/[feature_name].coder-spec.md\` and the tasks document.
3.  Draft the proposed database schemas and API endpoints in the chat.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to Step 5 immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes" in the chat.
5.  **Save Output:** Write the finalized backend schema and API definitions to \`.think-live/backend-schema.md\`.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you decided. Transition to **B.1 Coder**.
`,

  // B.1 Coder
  coder: `# B.1 Coder (Programming Department)

## 1. Focus & Scope
*   Acts as the Builder of the Interface and backend logic.
*   Fully authorized to write cohesive HTML, CSS, JS, and backend logic simultaneously, strictly constrained by the UI Designer's visual tokens and the Backend Handler's database schemas.

## 2. Guidelines (DOs & DONTs)
*   **DO NOT (Sacred Root Architecture):** NEVER run framework initialization commands (like \`npx create-vite .\` or \`create-react-app\`) in the root directory. The root directory is sacred and houses the AI Agency. All application code MUST be initialized and built in a dedicated subdirectory (e.g., \`./frontend/\` or \`./app/\`).
*   **DO (Zero-Placeholder Mandate):** Never use "TODO" comments for UI or logic elements. All interactive elements must be production-ready and fully implemented.
*   **DO (Complete State Representation):** Handle Loading, Empty, and Error states natively in all components/modules you build.
*   **DO:** Verify \`.think-live/ui-config.md\` before coding. Consume the established color tokens, CSS variables, or styling variables. Do not hardcode arbitrary styles.
*   **DO:** Verify \`.think-live/backend-schema.md\` before writing database or API queries. Adhere strictly to the defined schema.
*   **DO:** Adhere strictly to the \`Authorized Files\` list specified in the task for this turn. Do not touch files outside this scope.
*   **DO:** When you finish a task, read \`.think-live/task-tracker.md\` and explicitly mark your specific task as complete by changing \`[ ]\` to \`[x]\`.
*   **DO:** Handle all inputs and operations defensively.
*   **DO NOT:** Commit untested code.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` (if it exists) to load session metadata.
2.  Read the active coding task in \`approved_docs/[feature_name].tasks.md\`, read \`.think-live/ui-config.md\`, and read \`.think-live/backend-schema.md\`.
3.  Implement the code changes directly in the workspace.
4.  Test the code. Present the implemented files, code changes, and test results in the chat.
5.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, ask the user to run the app, verify it works, and reply with "Approved" or "Yes".
6.  **Save Output:** Write a brief summary of the implemented code and test verifications to \`approved_docs/[feature_name].auditor.md\`. ALSO modify \`.think-live/task-tracker.md\` to check off the task you just completed (change \`[ ]\` to \`[x]\`).
7.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what you built, what tests passed, and assumptions made. Transition to the next relevant agent (e.g. **A.3 UI Tester** or **D.2 Quality Tester**).
`,

  // D.2 Quality Tester
  quality_tester: `# D.2 Quality Tester (Product & Quality Department)

## 1. Focus & Scope
*   Acts as the final inspector before code is merged or committed.
*   Reviews codebase changes against the original task checklist in \`[feature_name].tasks.md\`.
*   Acts as the final reviewer before code is merged.
*   Triggers after the Coder finishes a task.
*   Verifies that the implemented code meets the exact requirements of the active task.

## 2. Guidelines (DOs & DONTs)
*   **DO (Strict Verification):** Read the active task in \`.think-live/task-tracker.md\` and review the modified files.
*   **DO NOT:** Edit the code yourself. If there are bugs, route back to the Coder.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` to load session metadata.
2.  Verify the code modifications against \`approved_docs/[feature_name].auditor.md\`.
3.  Draft a \`pr-request.md\` detailing the changes and confirming functionality.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review the PR request and reply with "Approved" or "Yes".
5.  **Save Output:** Write the approved PR to \`approved_docs/[feature_name].pr-request.md\`.
6.  **Handoff:** Read \`.think-live/state.json\`. Write a \`.think-live/handover-context.json\` detailing what you reviewed. If \`git_enabled\` is \`true\`, transition to **B.2 Git Guy**. If \`false\`, transition to Standby/Idle (task is complete).`,

  auditor: `# D.3 Security Auditor (Product & Quality Department)

## 1. Focus & Scope
*   Acts as the primary Security Analyst for the agency.
*   Triggers after UI testing to perform rigorous OWASP and STRIDE security audits on the codebase.
*   Outputs a security report detailing Exploit Scenarios if vulnerabilities are found.

## 2. Guidelines (DOs & DONTs)
*   **DO (Exploit Scenarios):** If you find vulnerabilities (e.g. XSS, SQLi, insecure auth), explicitly document "Exploit Scenarios" describing how an attacker could leverage them.
*   **DO NOT:** Edit code files directly. Your job is purely auditing and reporting.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` to load session metadata.
2.  Review the latest modified source code for security flaws.
3.  Draft a \`security-report.md\` in the chat.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review the report and reply with "Approved" or "Yes".
5.  **Save Output:** Write the approved report to \`approved_docs/[feature_name].security-report.md\`.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing the security status. Transition to **D.2 Quality Tester**.`,

  // B.2 Git Guy
  git_guy: `# B.2 Git Guy (Programming Department)

## 1. Focus & Scope
*   Acts as the Release Engineer.
*   Enforces test execution, branch hygiene, and conventional commits.
*   Updates \`.think-live/CHANGELOG.md\`.
*   Manages branches, stage files, commits changes, and pushes remote pull requests.
`,

  memory_archivist: `# D.4 Memory Archivist (Product & Quality Department)

## 1. Focus & Scope
*   Acts as the Long-Term Memory Manager for the agency.
*   Runs at the end of a sprint (after the PR is generated).
*   Distills the architectural decisions, design tokens, and user preferences from the sprint into \`.think-live/memory-graph.json\`.

## 2. Guidelines (DOs & DONTs)
*   **DO (Graph Updates):** Read the existing \`.think-live/memory-graph.json\`. Add new \`entities\` and \`relationships\` to it based on the recent sprint.
*   **DO (Strict JSON):** Ensure the updated graph is 100% valid JSON with no trailing commas.
*   **DO (Focus on Reusability):** Only store high-level reusable knowledge (e.g., "User prefers Tailwind", "Database uses Supabase", "Auth uses JWT"). Do not store code snippets or granular task lists.
*   **DO NOT:** Edit code files.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` to load session metadata.
2.  Read the sprint's core documents: \`approved_docs/[feature_name].ui-config.md\`, \`approved_docs/[feature_name].backend-schema.md\`, and \`.think-live/memory-graph.json\`.
3.  Draft the JSON patch in the chat.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review and reply with "Approved" or "Yes".
5.  **Save Output:** Write the updated JSON to \`.think-live/memory-graph.json\`. Then, write an empty file to \`approved_docs/[feature_name].memory-updated.md\` to flag completion.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing what was committed to memory. Transition to **B.2 Git Guy** for final commit.`,


  // Redirect rules
  ideRule: `CRITICAL: You are the autonomous runner of the think.live state machine. You are NOT a standard conversational assistant.

For EVERY single user message, you MUST:
1. Scan .think-live/state.json and approved_docs/ to evaluate the current state.
2. Cross-reference with the State Decision Matrix in .think-live/agency.md to determine the target agent.
3. Announce your transition in the format: 🔄 [Transition] Adopting persona: [Agent Name] ([Department Name])
4. Update .think-live/state.json to reflect the active agent, last agent, active doc, and modified files.
5. Locate and execute that agent's instructions at .think-live/departments/[agent_id]/instructions.md.

Never break character or ask "What should I do next?" without first adopting the correct persona and updating the state JSON.
`,

  // Tasks auto-run
  vscodeTasks: `{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Launch think.live TUI Monitor",
      "type": "shell",
      "command": "node .think-live/tui.js",
      "problemMatcher": [],
      "group": {
        "kind": "test",
        "isDefault": true
      },
      "presentation": {
        "echo": true,
        "reveal": "always",
        "focus": true,
        "panel": "dedicated",
        "showReuseMessage": false,
        "clear": true
      }
    }
  ]
}`,

  // Shell script wrapper for Unix/macOS
  startMonitoringScript: `#!/bin/bash
node .think-live/tui.js
`,

  // Batch file wrapper for Windows
  startMonitoringBat: `@echo off
node .think-live\\tui.js
`,

  showcase_director: `# E.1 Showcase Director (Showcase & Promotion Department)

## 1. Focus & Scope
*   Acts as the Storyboarder for promotional videos and showcases.
*   Triggers only when the user explicitly requests a showcase, demo, promo, or animation sequence for their project.
*   Analyzes the existing UI structure and plans a JSON interaction script mapping out the "story" of the demo (cursor movements, typing, clicking, scrolling).

## 2. Guidelines (DOs & DONTs)
*   **DO (Script the Flow):** Read the target HTML files to understand the IDs and classes of interactive elements. Create a logical flow that demonstrates the core value of the page. Include actions like right-clicks, typing, scrolling, pinching, and resizing.
*   **DO (Valid JSON):** Write the interaction script as a strict JSON array. Example actions: \`{"action": "move", "target": "#login-btn", "duration": 800}\`, \`{"action": "type", "target": "#email", "text": "demo@think.live"}\`, \`{"action": "click", "target": "#login-btn"}\`, \`{"action": "pinch", "scale": 1.5}\`.
*   **DO NOT:** Write any code or modify the original project files. Do not create the animation yourself.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` to load session metadata.
2.  Review the source code of the feature the user wants to showcase (e.g., \`frontend/index.html\`).
3.  Draft a \`showcase-script.json\` array mapping out the timeline of interactions.
4.  **Gate:** Read \`.think-live/state.json\`. If \`"autonomous": true\`, self-approve your work and proceed to the next step immediately. If \`"autonomous": false\`, wait for the user to review the script and reply with "Approved" or "Yes".
5.  **Save Output:** Write the approved script to \`approved_docs/showcase-script.json\`.
6.  **Handoff:** Write a \`.think-live/handover-context.json\` detailing the script flow. Transition to **E.2 Showcase Animator**.`,

  showcase_animator: `# E.2 Showcase Animator (Showcase & Promotion Department)

## 1. Focus & Scope
*   Acts as the Virtual Cameraman for promotional videos.
*   Triggers when \`approved_docs/showcase-script.json\` exists.
*   Injects a hidden demo mode into the existing project using a URL query parameter, builds a cinematic self-playing animation, and records it using a headless browser subagent.

## 2. Guidelines (DOs & DONTs)
*   **DO NOT (No UI Changes):** Strictly DO NOT clone files to a showcase folder, DO NOT wrap the UI in bezels, and DO NOT add entry animations to DOM elements. The original UI must remain 100% structurally intact.
*   **DO (URL Demo Mode):** Inject a script into the main project (e.g., \`index.html\`) that checks the URL. The automated demo and GSAP libraries MUST ONLY load and execute if \`?demo=true\` is present in the URL.
*   **DO (Expressive Virtual Cursor):** Inject a mock cursor element. Parse \`showcase-script.json\` and animate it. The cursor animations should be fun, fluid, bouncy, and highly expressive. It must clearly visually indicate different actions (e.g., left click, right click, scroll, pinch, pan, resize, type) using distinct, intuitive micro-animations.
*   **DO (Cinematic Camera & Smooth Panning):** The camera (viewport) MUST smoothly follow the cursor. DO NOT snap the camera instantly! When the cursor moves, simultaneously animate the camera's \`transformOrigin\` or \`x/y\` translations using a long duration (e.g., \`duration: 1.5, ease: "power3.out"\`). Make occasional **DRAMATIC** zooms (use \`scale: 1.5\` to \`2.0\`) so the user feels the depth.
*   **DO (Mock Backends):** If in demo mode, replace active fetch calls with hardcoded mock responses so the animation runs perfectly static.

## 3. Workflow & Approval Checkpoint
1.  **Memory Handoff Protocol:** Read \`.think-live/handover-context.json\` to load session metadata.
2.  Read \`approved_docs/showcase-script.json\`.
3.  Inject the demo mode script logic directly into the project's root files (e.g., \`index.html\`).
4.  **Gate:** No explicit approval gate for local rendering.
5.  **Record Video & Error Check:** Use the \`browser_subagent\` tool to open \`file://[absolute_path]/index.html?demo=true\`. Instruct the subagent to wait and watch the animation play out. **CRITICAL:** Explicitly instruct the subagent to read the browser console for any JavaScript or GSAP errors! If it reports errors back to you, you MUST fix the code and run it again.
6.  **Handoff:** Present the generated WebP artifact video to the user. Transition to idle.`,

  // Node script wrapper (runs on all platforms without chmod+x)
  startMonitoringJs: `#!/usr/bin/env node
require('./.think-live/tui.js');
`,

  // TUI Monitor source code template
  tui: `const fs = require('fs');
const path = require('path');
const readline = require('readline');

// File paths for synchronization
const WORKSPACE_DIR = path.resolve(__dirname, '..');
const STATE_FILE_PATH = path.join(WORKSPACE_DIR, '.think-live', 'state.json');

// Enable raw mode to capture 'q' or Ctrl+C to exit cleanly
if (process.stdin.isTTY) {
  readline.emitKeypressEvents(process.stdin);
  process.stdin.setRawMode(true);
  process.stdin.on('keypress', (str, key) => {
    if (key.name === 'q' || (key.ctrl && key.name === 'c')) {
      cleanupAndExit();
    } else if (key.name === 'a') {
      toggleAutonomousMode();
    } else if (key.name === 'g') {
      toggleGitMode();
    }
  });
}

// Ensure clean exit (show cursor, clear screen, restore stdout)
function cleanupAndExit() {
  process.stdout.write('\\x1B[?25h'); // Show cursor
  process.stdout.write('\\x1B[0m');    // Reset colors
  console.clear();
  process.exit(0);
}

// Hide cursor during TUI execution
process.stdout.write('\\x1B[?25l');

// Global state variables
let lastJsonStr = '';
let activeState = {
  active_agent: null,
  last_agent: null,
  active_doc: 'None',
  modified_files: [],
  autonomous: false,
  git_enabled: false
};

// Department Structure Config
const DEPARTMENTS = [
  {
    name: 'Architecture',
    icon: '🏗️',
    agents: [
      { id: 'starter', code: 'C.1', name: 'Starter' },
      { id: 'architect', code: 'C.2', name: 'Architect' },
      { id: 'task_distributor', code: 'C.3', name: 'Distributor' }
    ]
  },
  {
    name: 'UI UX Design',
    icon: '🎨',
    agents: [
      { id: 'creative_director', code: 'A.0', name: 'Creative Dir' },
      { id: 'ui_designer', code: 'A.1', name: 'UI Designer' },
      { id: 'pr_safety', code: 'A.2', name: 'PR & Safety' },
      { id: 'ui_tester', code: 'A.3', name: 'UI Tester' }
    ]
  },
  {
    name: 'Programming',
    icon: '💻',
    agents: [
      { id: 'backend_handler', code: 'B.3', name: 'Backend' },
      { id: 'coder', code: 'B.1', name: 'Coder' },
      { id: 'git_guy', code: 'B.2', name: 'Git Guy' }
    ]
  },
  {
    name: 'Product & Quality',
    icon: '🔍',
    agents: [
      { id: 'director', code: 'D.1', name: 'Director' },
      { id: 'quality_tester', code: 'D.2', name: 'Quality Tester' },
      { id: 'memory_archivist', code: 'D.4', name: 'Archivist' }
    ]
  },
  {
    name: 'Showcase & Promo',
    icon: '🎬',
    agents: [
      { id: 'showcase_director', code: 'E.1', name: 'Showcase Dir' },
      { id: 'showcase_animator', code: 'E.2', name: 'Animator' }
    ]
  }
];

// Helper for agent matching by ID
function findAgentDetails(id) {
  for (const dept of DEPARTMENTS) {
    const found = dept.agents.find(a => a.id === id);
    if (found) return { ...found, deptName: dept.name };
  }
  return null;
}

function toggleAutonomousMode() {
  try {
    const currentState = { ...activeState };
    currentState.autonomous = !currentState.autonomous;
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(currentState, null, 2), \'utf8\');
    activeState = currentState;
    renderTUI();
  } catch (err) {
    // Ignore write errors
  }
}

function toggleGitMode() {
  try {
    const currentState = { ...activeState };
    currentState.git_enabled = !currentState.git_enabled;
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(currentState, null, 2), \'utf8\');
    activeState = currentState;
    renderTUI();
  } catch (err) {
    // Ignore write errors
  }
}

function formatTokens(n) {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + \'M\';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + \'k\';
  }
  return n.toString();
}

function drawCircleBar(percent) {
  const total = 16;
  const filled = Math.min(total, Math.max(0, Math.round((percent / 100) * total)));
  const empty = total - filled;
  return GREEN + \'◉ \'.repeat(filled) + RESET + DIM + \'□ \'.repeat(empty) + RESET;
}

const HANDOVER_FILE_PATH = path.join(WORKSPACE_DIR, '.think-live', 'handover-context.json');
const TASK_TRACKER_PATH = path.join(WORKSPACE_DIR, '.think-live', 'task-tracker.md');

// Safe read state
let lastHandoverStr = '';
let activeHandover = null;
let trackerStats = { exists: false, completed: 0, total: 0 };

function checkState() {
  try {
    let stateChanged = false;
    if (fs.existsSync(STATE_FILE_PATH)) {
      const data = fs.readFileSync(STATE_FILE_PATH, 'utf8');
      if (data !== lastJsonStr) {
        lastJsonStr = data;
        activeState = JSON.parse(data);
        stateChanged = true;
      }
    } else {
      // Default empty state if file not created yet
      const defaultState = JSON.stringify({
        active_agent: null,
        last_agent: null,
        active_doc: 'None',
        modified_files: [],
        autonomous: false,
        git_enabled: false
      });
      if (defaultState !== lastJsonStr) {
        lastJsonStr = defaultState;
        activeState = JSON.parse(defaultState);
        stateChanged = true;
      }
    }

    if (fs.existsSync(HANDOVER_FILE_PATH)) {
      const data = fs.readFileSync(HANDOVER_FILE_PATH, 'utf8');
      if (data !== lastHandoverStr) {
        lastHandoverStr = data;
        activeHandover = JSON.parse(data);
        stateChanged = true;
      }
    } else if (lastHandoverStr !== '') {
      lastHandoverStr = '';
      activeHandover = null;
      stateChanged = true;
    }

    let newTrackerStats = { exists: false, completed: 0, total: 0, current_task: '' };
    if (fs.existsSync(TASK_TRACKER_PATH)) {
      const trackerData = fs.readFileSync(TASK_TRACKER_PATH, 'utf8');
      const lines = trackerData.split('\\n');
      for (const line of lines) {
        if (line.match(/^\\s*-\\s*\\[[xX]\\]/)) {
          newTrackerStats.completed++;
          newTrackerStats.total++;
        } else if (line.match(/^\\s*-\\s*\\[\\/\\]/)) {
          newTrackerStats.total++;
          if (!newTrackerStats.current_task) newTrackerStats.current_task = line.replace(/^\\s*-\\s*\\[\\/\\]\\s*/, '').substring(0, 36);
        } else if (line.match(/^\\s*-\\s*\\[\\s\\]/)) {
          newTrackerStats.total++;
          if (!newTrackerStats.current_task) newTrackerStats.current_task = line.replace(/^\\s*-\\s*\\[\\s\\]\\s*/, '').substring(0, 36);
        }
      }
      newTrackerStats.exists = true;
    }
    if (JSON.stringify(newTrackerStats) !== JSON.stringify(trackerStats)) {
      trackerStats = newTrackerStats;
      stateChanged = true;
    }

    if (stateChanged) {
      renderTUI();
    }
  } catch (err) {
    // Ignore read/parse errors during write transition
  }
}

// ANSI Escape Codes for formatting
const RESET = '\\x1b[0m';
const BOLD = '\\x1b[1m';
const DIM = '\\x1b[2m';
const GREEN = '\\x1b[32m';
const YELLOW = '\\x1b[33m';
const BLUE = '\\x1b[34m';
const MAGENTA = '\\x1b[35m';
const CYAN = '\\x1b[36m';
const RED = '\\x1b[31m';
const GRAY = '\\x1b[90m';
const BG_DARK_GRAY = '\\x1b[100m';

// Format strings to fit column widths
function padEnd(str, length) {
  const cleanStr = str.replace(/\\x1b\\[[0-9;]*m/g, ''); // Remove ANSI codes for correct length calc
  const diff = length - cleanStr.length;
  return str + (diff > 0 ? ' '.repeat(diff) : '');
}

// Draw the screen
function renderTUI() {
  // Clear the screen and move cursor to top-left
  process.stdout.write('\\x1B[2J\\x1B[H');

  const width = 80;
  
  // Header Panel
  console.log(BOLD + BLUE + '┌' + '─'.repeat(width - 2) + '┐' + RESET);
  const leftHeader = '  think.live AGENCY MONITOR';
  const rightHeader = '● LIVE RUNNING';
  const modeLabel = activeState.autonomous ? 'AUTONOMOUS ⚡' : 'MANUAL 👤';
  const gitLabel = activeState.git_enabled ? 'GIT: ON' : 'GIT: OFF';
  const modeColor = activeState.autonomous ? GREEN : YELLOW;
  const gitColor = activeState.git_enabled ? GREEN : RED;
  const centerHeader = \'[\' + modeLabel + \'] [\' + gitLabel + \']\';
  const leftLen = leftHeader.length;
  // centerLen matches uncolored string length: "[AUTONOMOUS ⚡] [GIT: OFF]"
  const modeLen = activeState.autonomous ? 15 : 11;
  const gitLen = activeState.git_enabled ? 10 : 11;
  const centerLen = modeLen + gitLen;
  const rightLen = rightHeader.length;
  const totalUsed = leftLen + centerLen + rightLen;
  const totalSpaces = 76 - totalUsed;
  const halfSpaces = Math.floor(totalSpaces / 2);
  const leftPadding = ' '.repeat(halfSpaces);
  const rightPadding = ' '.repeat(totalSpaces - halfSpaces);
  console.log(BOLD + BLUE + '│' + RESET + BOLD + leftHeader + leftPadding + modeColor + \'[\' + modeLabel + \'] \' + gitColor + \'[\' + gitLabel + \']\' + RESET + BOLD + rightPadding + GREEN + rightHeader + ' ' + RESET + BOLD + BLUE + ' │' + RESET);
  console.log(BOLD + BLUE + '└' + '─'.repeat(width - 2) + '┘' + RESET);

  // Left Column (Departments) vs Right Column (Status details)
  // Left col: 34 chars, Right col: 42 chars
  const separator = BOLD + BLUE + ' │ ' + RESET;

  const lines = [];

  // 1. Compile Department lists
  const deptLines = [];
  DEPARTMENTS.forEach(dept => {
    deptLines.push(BOLD + CYAN + \'[\' + dept.name + \']\' + RESET);
    dept.agents.forEach(agent => {
      const isActive = activeState.active_agent === agent.id;
      const isLast = activeState.last_agent === agent.id;

      let prefix = \'  \';
      let nameStr = agent.code + \' \' + agent.name;
      let suffix = \'\';

      if (isActive) {
        prefix = GREEN + \'▶ \' + RESET;
        nameStr = BOLD + GREEN + nameStr + RESET;
        suffix = BOLD + GREEN + \' (ACTIVE) 🤖\' + RESET;
      } else if (isLast) {
        prefix = YELLOW + \'↩ \' + RESET;
        nameStr = YELLOW + nameStr + RESET;
        suffix = YELLOW + \' (LAST)\' + RESET;
      } else {
        nameStr = DIM + nameStr + RESET;
      }

      deptLines.push(prefix + nameStr + suffix);
    });
    deptLines.push(\'\');
  });

  // 2. Compile Right side panels
  const rightLines = [];
  rightLines.push(BOLD + MAGENTA + \'┌─ CURRENT RUN STATE ───────────────────────┐\' + RESET);
  
  const activeDetail = findAgentDetails(activeState.active_agent);
  const lastDetail = findAgentDetails(activeState.last_agent);

  rightLines.push(BOLD + \'  Currently Active: \' + RESET + (activeDetail ? GREEN + BOLD + activeDetail.name + \' (\' + activeDetail.code + \') ⚡\' + RESET : DIM + \'Standby / Idle\' + RESET));
  rightLines.push(BOLD + \'  Last Used Agent:  \' + RESET + (lastDetail ? YELLOW + lastDetail.name + \' (\' + lastDetail.code + \')\' + RESET : DIM + \'None\' + RESET));
  rightLines.push(BOLD + \'  Active Spec Doc:  \' + RESET + BLUE + (activeState.active_doc || \'None\') + RESET);
  rightLines.push(BOLD + MAGENTA + \'└───────────────────────────────────────────┘\' + RESET);
  rightLines.push(\'\');

  rightLines.push(BOLD + MAGENTA + \'┌─ RECENT CHANGED FILES ────────────────────┐\' + RESET);
  if (activeState.modified_files && activeState.modified_files.length > 0) {
    activeState.modified_files.slice(-5).forEach(file => {
      rightLines.push(\'  \' + GREEN + \'✚\' + RESET + \' \' + file);
    });
    // Pad to 5 lines
    for (let i = activeState.modified_files.length; i < 5; i++) {
      rightLines.push(\'  \');
    }
  } else {
    rightLines.push(\'  \' + DIM + \'No files modified in last prompt.\' + RESET);
    rightLines.push(\'  \');
    rightLines.push(\'  \');
    rightLines.push(\'  \');
    rightLines.push(\'  \');
  }
  rightLines.push(BOLD + MAGENTA + \'└───────────────────────────────────────────┘\' + RESET);
  rightLines.push(\'\');

  rightLines.push(BOLD + MAGENTA + \'┌─ TASK PROGRESS ───────────────────────────┐\' + RESET);
  if (trackerStats.exists && trackerStats.total > 0) {
    const pct = ((trackerStats.completed / trackerStats.total) * 100).toFixed(0);
    rightLines.push(\`  \${BOLD}Tasks Done:\${RESET} \${GREEN}\${trackerStats.completed}\${RESET} / \${trackerStats.total} (\${pct}%)\`);
    rightLines.push(\`  \` + drawCircleBar(parseFloat(pct)));
    rightLines.push(\'  \');
    rightLines.push(\`  \${BOLD}Current:\${RESET} \${YELLOW}\${trackerStats.current_task || \'None\'}\${RESET}\`);
  } else if (trackerStats.exists) {
    rightLines.push(\`  \${DIM}Task tracker exists but no tasks found.\${RESET}\`);
    rightLines.push(\'  \');
  } else {
    rightLines.push(\`  \${DIM}No task-tracker.md found yet.\${RESET}\`);
    rightLines.push(\'  \');
  }
  rightLines.push(BOLD + MAGENTA + \'└───────────────────────────────────────────┘\' + RESET);

  // Merge columns
  const maxLines = Math.max(deptLines.length, rightLines.length);
  for (let i = 0; i < maxLines; i++) {
    const leftPart = padEnd(deptLines[i] || \'\', 34);
    const rightPart = rightLines[i] || \'\';
    console.log(leftPart + separator + rightPart);
  }

  // Handover Context Box
  console.log(BOLD + MAGENTA + \'┌─ LAST HANDOVER CONTEXT ──────────────────────────────────────────────────────┐\' + RESET);
  if (activeHandover) {
    const fromDetail = findAgentDetails(activeHandover.last_agent);
    const toDetail = findAgentDetails(activeHandover.next_agent);
    const fromName = fromDetail ? fromDetail.name + \' (\' + fromDetail.code + \')\' : (activeHandover.last_agent || \'Unknown\');
    const toName = toDetail ? toDetail.name + \' (\' + toDetail.code + \')\' : (activeHandover.next_agent || \'Unknown\');
    console.log(\'  \' + BOLD + \'Route:\' + RESET + \' \' + YELLOW + fromName + RESET + \' ➔ \' + GREEN + toName + RESET);
    
    if (activeHandover.what_was_tried && activeHandover.what_was_tried.length > 0) {
      console.log(\'  \' + BOLD + \'What was tried:\' + RESET);
      activeHandover.what_was_tried.slice(0, 3).forEach(item => {
        console.log(\'    • \' + item.substring(0, 70));
      });
    }
    if (activeHandover.failures_or_warnings && activeHandover.failures_or_warnings.length > 0) {
      console.log(\'  \' + BOLD + RED + \'Warnings/Failures:\' + RESET);
      activeHandover.failures_or_warnings.slice(0, 2).forEach(item => {
        console.log(\'    • \' + RED + item.substring(0, 70) + RESET);
      });
    }
  } else {
    console.log(\'  \' + DIM + \'No active handover context. Waiting for next transition...\' + RESET);
  }
  console.log(BOLD + MAGENTA + \'└──────────────────────────────────────────────────────────────────────────────┘\' + RESET);

  // Footer / Keyboard Help
  console.log(BOLD + BLUE + \'┌\' + \'─\'.repeat(width - 2) + \'┐\' + RESET);
  console.log(BOLD + BLUE + \'│\' + RESET + DIM + \'  Press [a] to toggle Autonomous Mode | [q] to exit.\' + \' \'.repeat(24) + RESET + BOLD + BLUE + \'│\' + RESET);
  console.log(BOLD + BLUE + \'└\' + \'─\'.repeat(width - 2) + \'┘\' + RESET);
}

// Initial draw
renderTUI();

// Check for updates every 500ms
setInterval(checkState, 500);
`
};

// 2. Global Handles
let targetDirectoryHandle = null;
let particleTimer = null;

// DOM Elements
const btnBrowse = document.getElementById('btn-browse');
const btnDeploy = document.getElementById('btn-deploy');
const txtDirPath = document.getElementById('txt-dir-path');
const terminalOutput = document.getElementById('terminal-output');

const chkCursor = document.getElementById('chk-cursor');
const chkVSCode = document.getElementById('chk-vscode');
const chkAntigravity = document.getElementById('chk-antigravity');
const chkWindsurf = document.getElementById('chk-windsurf');
const chkRoo = document.getElementById('chk-roo');

const presetFull = document.getElementById('preset-full');
const presetCoding = document.getElementById('preset-coding');
const presetArchitect = document.getElementById('preset-architect');

const deptItems = document.querySelectorAll('.dept-item');
const installedList = document.getElementById('installed-list');
const remainingList = document.getElementById('remaining-list');
const progressPercentage = document.getElementById('progress-percentage');
const progressCard = document.querySelector('.progress-fill');
const progressBarFill = document.getElementById('progress-bar-fill');

const mainFolder = document.getElementById('main-folder');
const folderAnimLabel = document.getElementById('folder-anim-label');

const successModal = document.getElementById('success-modal');
const btnCloseModal = document.getElementById('btn-close-modal');
const btnModalOk = document.getElementById('btn-modal-ok');

// Modal Helper Functions
function showSuccessModal() {
  if (successModal) {
    successModal.classList.remove('opacity-0', 'pointer-events-none');
    successModal.classList.add('opacity-100', 'open');
  }
}

function hideSuccessModal() {
  if (successModal) {
    successModal.classList.add('opacity-0', 'pointer-events-none');
    successModal.classList.remove('opacity-100', 'open');
  }
}

if (btnCloseModal) btnCloseModal.addEventListener('click', hideSuccessModal);
if (btnModalOk) btnModalOk.addEventListener('click', hideSuccessModal);

// 3. Logger helper
function logToTerminal(message, type = 'on-primary') {
  const line = document.createElement('div');
  line.className = `text-${type} mb-1 opacity-0 transition-opacity duration-300`;
  line.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;

  // Insert before cursor element
  terminalOutput.appendChild(line);
  terminalOutput.scrollTop = terminalOutput.scrollHeight;

  // Animate opacity fade-in
  setTimeout(() => line.classList.remove('opacity-0'), 15);
}

// 4. Connect Department Selectors and Checkboxes
deptItems.forEach(item => {
  const chk = item.querySelector('input[type="checkbox"]');

  // Click event triggers checkbox selection
  item.addEventListener('click', (e) => {
    if (e.target !== chk) {
      chk.checked = !chk.checked;
      chk.dispatchEvent(new Event('change'));
    }
  });

  chk.addEventListener('change', () => {
    if (chk.checked) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
    // Remove selected state from preset triggers
    clearPresetSelection();
  });
});

// 5. Preset selectors
function clearPresetSelection() {
  presetFull.classList.remove('active');
  presetCoding.classList.remove('active');
  presetArchitect.classList.remove('active');
}

presetFull.addEventListener('click', () => {
  clearPresetSelection();
  presetFull.classList.add('active');
  setDepartmentsState({
    director: true, creative_director: true, ui_designer: true, pr_safety: true, ui_tester: true,
    starter: true, architect: true, task_distributor: true, backend_handler: true,
    coder: true, git_guy: true, quality_tester: true, auditor: true, memory_archivist: true,
    showcase_director: true, showcase_animator: true
  });
});

presetCoding.addEventListener('click', () => {
  clearPresetSelection();
  presetCoding.classList.add('active');
  setDepartmentsState({
    director: false, creative_director: true, ui_designer: true, pr_safety: false, ui_tester: true,
    starter: false, architect: false, task_distributor: false, backend_handler: true,
    coder: true, git_guy: true, quality_tester: true, auditor: false, memory_archivist: true,
    showcase_director: false, showcase_animator: false
  });
});

presetArchitect.addEventListener('click', () => {
  clearPresetSelection();
  presetArchitect.classList.add('active');
  setDepartmentsState({
    director: true, creative_director: false, ui_designer: false, pr_safety: true, ui_tester: false,
    starter: true, architect: true, task_distributor: true, backend_handler: true,
    coder: false, git_guy: false, quality_tester: false, auditor: false, memory_archivist: true,
    showcase_director: false, showcase_animator: false
  });
});

function setDepartmentsState(states) {
  deptItems.forEach(item => {
    const deptId = item.getAttribute('data-dept');
    const chk = item.querySelector('input[type="checkbox"]');
    chk.checked = states[deptId] || false;
    if (chk.checked) {
      item.classList.add('active');
    } else {
      item.classList.remove('active');
    }
  });
}

// 6. Deploy button state validator
function updateDeployButtonState() {
  const folderSelected = (targetDirectoryHandle !== null);
  const ideChecked = chkCursor.checked || chkVSCode.checked || chkAntigravity.checked || chkWindsurf.checked || chkRoo.checked;
  btnDeploy.disabled = !(folderSelected && ideChecked);
}

// Add change listeners to update deploy button state when IDE selections change
[chkCursor, chkVSCode, chkAntigravity, chkWindsurf, chkRoo].forEach(chk => {
  if (chk) {
    chk.addEventListener('change', updateDeployButtonState);
  }
});

// Directory Picking Handler
btnBrowse.addEventListener('click', async () => {
  try {
    targetDirectoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite'
    });

    txtDirPath.value = targetDirectoryHandle.name;
    updateDeployButtonState();

    logToTerminal(`Target directory set to "${targetDirectoryHandle.name}".`, 'secondary-fixed-dim');
    logToTerminal('Ready for deployment. Press "Install Now" to configure agency.', 'on-primary');

    folderAnimLabel.textContent = 'READY';
  } catch (err) {
    logToTerminal(`Directory pick aborted: ${err.message}`, 'error');
    targetDirectoryHandle = null;
    updateDeployButtonState();
    txtDirPath.value = 'No folder selected';
    folderAnimLabel.textContent = 'STANDBY';
  }
});

// 7. Visual Emitter Particle Spawner
const EMOJIS = ['📄', '📁', '📝', '⚙', '📜'];

function spawnFileParticle() {
  if (!mainFolder) return;

  const particle = document.createElement('div');
  particle.className = 'file-particle';
  particle.textContent = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];

  // Random horizontal offset around folder center
  const startX = (Math.random() * 40) - 20;
  particle.style.left = `calc(50% + ${startX}px)`;
  particle.style.top = `-10px`;
  particle.style.fontSize = `${Math.random() * 6 + 14}px`;

  // Random translation offset for fluid wiggle path
  const targetX = (Math.random() * 60) - 30;
  particle.style.setProperty('--target-x', `${targetX}px`);

  mainFolder.appendChild(particle);

  // Clean elements
  particle.addEventListener('animationend', () => {
    particle.remove();
  });
}

function startVisualEmitter() {
  folderAnimLabel.textContent = 'WRITING';
  folderAnimLabel.classList.add('text-secondary', 'animate-pulse');
  if (mainFolder) mainFolder.classList.add('folder-active-bounce');
  particleTimer = setInterval(spawnFileParticle, 200);
}

function stopVisualEmitter(success = true) {
  clearInterval(particleTimer);
  if (mainFolder) mainFolder.classList.remove('folder-active-bounce');
  folderAnimLabel.classList.remove('text-secondary', 'animate-pulse');
  folderAnimLabel.textContent = success ? 'COMPLETED' : 'ERROR';
  if (success) {
    folderAnimLabel.classList.add('text-emerald-500');
  } else {
    folderAnimLabel.classList.add('text-red-500');
  }
}

// 8. Filesystem directory writing handlers
async function getOrCreateDir(parentHandle, dirName) {
  return await parentHandle.getDirectoryHandle(dirName, { create: true });
}

async function writeTextFile(dirHandle, fileName, content) {
  const fileHandle = await dirHandle.getFileHandle(fileName, { create: true });
  const writable = await fileHandle.createWritable();
  await writable.write(content);
  await writable.close();
}

// 9. Installer deploy tasks
btnDeploy.addEventListener('click', async () => {
  if (!targetDirectoryHandle) return;

  btnDeploy.disabled = true;
  btnBrowse.disabled = true;

  // Compile installation tasks checklist
  const tasks = [];

  tasks.push({
    id: 'docs_dir', name: 'Create approved_docs/ folder', type: 'dir', run: async () => {
      return await getOrCreateDir(targetDirectoryHandle, 'approved_docs');
    }
  });
  tasks.push({
    id: 'agency_dir', name: 'Create .think-live/ folder', type: 'dir', run: async () => {
      return await getOrCreateDir(targetDirectoryHandle, '.think-live');
    }
  });
  tasks.push({
    id: 'agency_rules', name: 'Write .think-live/agency.md', type: 'file', parent: 'agency_dir', run: async (handles) => {
      return await writeTextFile(handles.agency_dir, 'agency.md', TEMPLATES.agency);
    }
  });
  tasks.push({
    id: 'tui_script', name: 'Write .think-live/tui.js', type: 'file', parent: 'agency_dir', run: async (handles) => {
      return await writeTextFile(handles.agency_dir, 'tui.js', TEMPLATES.tui);
    }
  });
  tasks.push({
    id: 'state_json', name: 'Write .think-live/state.json', type: 'file', parent: 'agency_dir', run: async (handles) => {
      const initialState = {
        active_agent: null,
        last_agent: null,
        active_doc: 'None',
        modified_files: [],
        autonomous: false
      };
      return await writeTextFile(handles.agency_dir, 'state.json', JSON.stringify(initialState, null, 2));
    }
  });
  tasks.push({
    id: 'memory_json', name: 'Write .think-live/memory-graph.json', type: 'file', parent: 'agency_dir', run: async (handles) => {
      const initialMemory = {
        entities: [],
        relationships: []
      };
      return await writeTextFile(handles.agency_dir, 'memory-graph.json', JSON.stringify(initialMemory, null, 2));
    }
  });
  tasks.push({
    id: 'start_script_unix', name: 'Write start-monitoring (Unix/macOS)', type: 'file', run: async () => {
      return await writeTextFile(targetDirectoryHandle, 'start-monitoring', TEMPLATES.startMonitoringScript);
    }
  });
  tasks.push({
    id: 'start_script_win', name: 'Write start-monitoring.bat (Windows)', type: 'file', run: async () => {
      return await writeTextFile(targetDirectoryHandle, 'start-monitoring.bat', TEMPLATES.startMonitoringBat);
    }
  });
  tasks.push({
    id: 'start_script_js', name: 'Write start-monitoring.js (Cross-platform node wrapper)', type: 'file', run: async () => {
      return await writeTextFile(targetDirectoryHandle, 'start-monitoring.js', TEMPLATES.startMonitoringJs);
    }
  });

  // Departments folders and specs
  const selectedDepts = [];
  deptItems.forEach(item => {
    const chk = item.querySelector('input[type="checkbox"]');
    if (chk.checked) {
      selectedDepts.push({
        id: item.getAttribute('data-dept'),
        name: item.querySelector('h4').textContent
      });
    }
  });

  if (selectedDepts.length > 0) {
    tasks.push({
      id: 'depts_dir', name: 'Create .think-live/departments/ folder', type: 'dir', parent: 'agency_dir', run: async (handles) => {
        return await getOrCreateDir(handles.agency_dir, 'departments');
      }
    });

    selectedDepts.forEach(dept => {
      tasks.push({
        id: `dept_${dept.id}_dir`, name: `Create folder: departments/${dept.id}/`, type: 'dir', parent: 'depts_dir', run: async (handles) => {
          return await getOrCreateDir(handles.depts_dir, dept.id);
        }
      });
      tasks.push({
        id: `dept_${dept.id}_rules`, name: `Write instructions for [${dept.name}]`, type: 'file', parent: `dept_${dept.id}_dir`, run: async (handles) => {
          return await writeTextFile(handles[`dept_${dept.id}_dir`], 'instructions.md', TEMPLATES[dept.id]);
        }
      });
    });
  }

  // Combine redirection message and full agency rules
  const rulesContent = TEMPLATES.ideRule + '\n\n' + TEMPLATES.agency;

  // IDE integration files
  if (chkCursor.checked) {
    tasks.push({
      id: 'rules_cursor', name: 'Write .cursorrules', type: 'file', run: async () => {
        return await writeTextFile(targetDirectoryHandle, '.cursorrules', rulesContent);
      }
    });
  }
  if (chkRoo.checked) {
    tasks.push({
      id: 'rules_claudecode', name: 'Write .clauderules', type: 'file', run: async () => {
        return await writeTextFile(targetDirectoryHandle, '.clauderules', rulesContent);
      }
    });
    tasks.push({
      id: 'rules_roo', name: 'Write .claudedevrules', type: 'file', run: async () => {
        return await writeTextFile(targetDirectoryHandle, '.claudedevrules', rulesContent);
      }
    });
  }
  if (chkWindsurf.checked) {
    tasks.push({
      id: 'rules_windsurf', name: 'Write .windsurfrules', type: 'file', run: async () => {
        return await writeTextFile(targetDirectoryHandle, '.windsurfrules', rulesContent);
      }
    });
  }

  const needsVSCodeSetup = chkVSCode.checked || chkAntigravity.checked;
  if (needsVSCodeSetup) {
    tasks.push({
      id: 'vscode_dir', name: 'Create .vscode/ folder', type: 'dir', run: async () => {
        return await getOrCreateDir(targetDirectoryHandle, '.vscode');
      }
    });
    tasks.push({
      id: 'vscode_tasks', name: 'Write .vscode/tasks.json', type: 'file', parent: 'vscode_dir', run: async (handles) => {
        return await writeTextFile(handles.vscode_dir, 'tasks.json', TEMPLATES.vscodeTasks);
      }
    });
  }

  // Populate Lists UI before execution
  installedList.innerHTML = '';
  remainingList.innerHTML = '';
  progressPercentage.textContent = '0%';
  if (progressBarFill) {
    progressBarFill.style.width = '0%';
  }

  tasks.forEach(t => {
    const li = document.createElement('li');
    li.className = 'flex items-center gap-1.5';
    li.id = `task-item-${t.id}`;
    li.innerHTML = `<span class="material-symbols-outlined text-[14px]">radio_button_unchecked</span> ${t.name}`;
    remainingList.appendChild(li);
  });

  logToTerminal('Starting think.live deployment sequence...', 'secondary-fixed-dim');
  startVisualEmitter();

  const handleMap = {};
  let completedCount = 0;
  const totalCount = tasks.length;

  try {
    for (const t of tasks) {
      logToTerminal(`Deploying: ${t.name}...`, 'on-primary');

      // Execute the task
      let resultHandle = null;
      if (t.parent) {
        resultHandle = await t.run(handleMap);
      } else {
        resultHandle = await t.run();
      }

      if (resultHandle) {
        handleMap[t.id] = resultHandle;
      }

      // Update Lists UI
      const taskEl = document.getElementById(`task-item-${t.id}`);
      if (taskEl) {
        taskEl.remove();
      }

      const doneEl = document.createElement('li');
      doneEl.className = 'flex items-center gap-1.5 text-secondary font-semibold';
      doneEl.innerHTML = `<span class="material-symbols-outlined text-[14px]">check_circle</span> ${t.name}`;
      installedList.appendChild(doneEl);
      installedList.scrollTop = installedList.scrollHeight;

      completedCount++;
      const percentVal = Math.round((completedCount / totalCount) * 100);
      progressPercentage.textContent = `${percentVal}%`;
      if (progressBarFill) {
        progressBarFill.style.width = `${percentVal}%`;
      }

      // Artificial delay (50-100ms) for smoother UI transitions
      await new Promise(r => setTimeout(r, 70));
    }

    logToTerminal('SUCCESS: All templates written to local directory!', 'secondary-fixed-dim');
    logToTerminal('Created easy launcher script. To start the monitor in one command on any OS, run:', 'secondary-fixed-dim');
    logToTerminal('    node start-monitoring', 'on-primary');
    logToTerminal('Alternative options: run "./start-monitoring" (Unix after running "chmod +x start-monitoring") or "./start-monitoring.bat" (Windows).', 'secondary-fixed-dim');
    logToTerminal('Deployment suite completed. think.live agency is now active.', 'on-primary');
    stopVisualEmitter(true);
    showSuccessModal();
  } catch (err) {
    logToTerminal(`CRITICAL INSTALL ERROR: ${err.message}`, 'error');
    logToTerminal('Installation aborted. Review folders write configurations.', 'error');
    stopVisualEmitter(false);
  } finally {
    btnBrowse.disabled = false;
    updateDeployButtonState();
  }
});
