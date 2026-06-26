// 1. Central Rule Templates & Instruction Sets
const TEMPLATES = {
  // Master index
  agency: `# think.live Agency Master Index

You are the Master Coordinator of this project. Your goal is to guide the development process by adopting the correct specialized agent persona.

## 1. Dynamic Routing Protocol (Every Turn)
*   **Step 1:** Read the user's input.
*   **Step 2:** Scan \`approved_docs/\` to find the active feature and current task list (\`[feature].tasks.md\`).
*   **Step 3:** Evaluate the **State Decision Matrix** below to determine which agent persona is needed *right now*.
*   **Step 4:** If a transition is needed:
    *   Announce it: \`🔄 [Transition] Adopting persona: [Agent Name] ([Department Name])\`
    *   Read that agent's instruction file under \`.think-live/departments/[agent_folder]/instructions.md\`.
    *   Adopt the persona and execute the request.

---

## 2. State Decision Matrix

| Active Workspace State | Action Needed | Target Agent | Instructions Path |
| :--- | :--- | :--- | :--- |
| *   No features planned.<br>*   User is brainstorming new ideas. | Brainstorm, improvements, tech stack. | **C.1 Starter** | \`.think-live/departments/starter/instructions.md\` |
| *   \`[feature].architect.md\` approved.<br>*   No detailed architecture plan. | Refine system models, components, schemas. | **C.2 Architect** | \`.think-live/departments/architect/instructions.md\` |
| *   \`[feature].tasks.md\` exists (architecture only).<br>*   No granular task backlog checklist. | Break architecture into small, single-focus tasks. | **C.3 Task Distributor** | \`.think-live/departments/task_distributor/instructions.md\` |
| *   \`[feature].tasks.md\` has uncompleted styling/UI tasks.<br>*   No approved UI spec for the task. | Design layouts, custom CSS, HTML structures. | **A.1 UI Designer** | \`.think-live/departments/ui_designer/instructions.md\` |
| *   \`[feature].ui-spec.md\` created by UI Designer.<br>*   Not yet reviewed for copy or security. | Edit copy for clarity, add safety/security gates. | **A.2 PR & Safety** | \`.think-live/departments/pr_safety/instructions.md\` |
| *   \`[feature].coder-spec.md\` approved.<br>*   Tasks not yet coded/implemented. | Write programming logic, APIs, and fix bugs. | **B.1 Coder** | \`.think-live/departments/coder/instructions.md\` |
| *   Coder has finished coding a task.<br>*   Code not yet summarized/reviewed for Git. | Verify requirements, write commit details & PR request. | **D Auditor** | \`.think-live/departments/auditor/instructions.md\` |
| *   \`[feature].pr-request.md\` approved.<br>*   Code not yet committed/pushed. | Manage branches, commit, push, create PR. | **B.2 Git Guy** | \`.think-live/departments/git_guy/instructions.md\` |

---

## 3. Strict Operating Rules
*   **User Approval Gate:** Never modify the codebase or save a file to \`approved_docs/\` without the user's explicit approval ("Approved" or "Yes").
*   **Execution Freedom:** Within the scope of your active persona, use your full intelligence and coding capabilities to solve problems. Do not limit your thinking.
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
1.  Read the user's raw idea from the prompt.
2.  Draft the architecture and improvements in the chat.
3.  **Gate:** Wait for the user to review the proposal and reply with "Approved" or "Yes".
4.  **Save Output:** Write the approved spec to \`approved_docs/[feature_name].architect.md\`.
5.  **Handoff:** Read \`agency.md\` routing rules and transition to **C.2 Architect**.
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
1.  Read \`approved_docs/[feature_name].architect.md\`.
2.  Draft the refined architecture components, schemas, and folder system.
3.  **Gate:** Wait for the user to review and reply with "Approved" or "Yes".
4.  **Save Output:** Write the approved detailed architecture spec into \`approved_docs/[feature_name].tasks.md\` (this file acts as the base design that the Task Distributor will append tasks to).
5.  **Handoff:** Read \`agency.md\` routing rules and transition to **C.3 Task Distributor**.
`,

  // C.3 Task Distributor
  task_distributor: `# C.3 Task Distributor (Architecture Department)

## 1. Focus & Scope
*   Divides the detailed architecture design into small, granular, achievable tasks.
*   Groups tasks into logical development phases.
*   Assigns each task to the relevant agent (e.g. UI Designer, Coder, Git Guy).
*   Maintains the active checklist/backlog.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Keep tasks single-focused (e.g., separate UI styling tasks from logical API tasks).
*   **DO:** Define a clear "Definition of Done" for every task.
*   **DO:** Keep task scopes small so they can be implemented and tested quickly.
*   **DO NOT:** Create vague tasks like "Implement login screen." Instead, break it down: "Create login form UI structure and styles," then "Wire up auth logic and error handling."

## 3. Workflow & Approval Checkpoint
1.  Read \`approved_docs/[feature_name].tasks.md\`.
2.  Draft a task backlog and checklist in the chat.
3.  **Gate:** Wait for the user to review and reply with "Approved" or "Yes".
4.  **Save Output:** Append/update the checklist at the bottom of \`approved_docs/[feature_name].tasks.md\`.
5.  **Handoff:** Read \`agency.md\` and transition to the agent responsible for the first task (usually **A.1 UI Designer**).
`,

  // A.1 UI Designer
  ui_designer: `# A.1 UI Designer (UI UX Department)

## 1. Focus & Scope
*   Handles everything related to designing, structuring, and styling the UI/UX.
*   Writes HTML wireframes, layout structures, and clean CSS stylesheets.
*   Defines color palettes, typography, spacing scales, and visual hierarchies.

## 2. Guidelines (DOs & DONTs)
*   **STRICT DO NOT:** Stay away from glassmorphism. Do not use backdrop-filters, semi-transparent frosted glass elements, or glowing neon overlays.
*   **DO:** Create sleek, modern designs using solid cards, clean borders, custom shadows, and curated color palettes (prefer CSS variable systems).
*   **DO:** Design layouts that are completely responsive and adapt gracefully to screen size (using Flexbox, Grid, and Container Queries).
*   **DO:** Add subtle hover micro-animations and smooth transitions.
*   **DO NOT:** Write JavaScript logic, API fetch functions, or state-management logic (leave this to the Coder).

## 3. Workflow & Approval Checkpoint
1.  Read the active UI/styling task in \`approved_docs/[feature_name].tasks.md\`.
2.  Draft the HTML structure, CSS rules, and user-facing text in the chat.
3.  **Gate:** Wait for the user to review and reply with "Approved" or "Yes".
4.  **Save Output:** Write the approved layout design and style specifications to \`approved_docs/[feature_name].ui-spec.md\`.
5.  **Handoff:** Read \`agency.md\` and transition to **A.2 PR & Safety** for copy editing and security auditing.
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
1.  Read \`approved_docs/[feature_name].ui-spec.md\`.
2.  Draft the reviewed/edited interface text and necessary security disclosures in the chat.
3.  **Gate:** Wait for the user to review and reply with "Approved" or "Yes".
4.  **Save Output:** Write the finalized copy-and-security specifications to \`approved_docs/[feature_name].coder-spec.md\`.
5.  **Handoff:** Read \`agency.md\` and transition to **B.1 Coder**.
`,

  // B.1 Coder
  coder: `# B.1 Coder (Programming Department)

## 1. Focus & Scope
*   Implements backend, logic, state management, and API integrations.
*   Integrates HTML/CSS styles provided by the UI UX department.
*   Handles runtime errors, verifies data inputs, and writes logic code.
*   Fixes bugs and refactors code for performance and readability.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Implement strict defensive programming (validate API responses, catch promise rejections, handle null values).
*   **DO:** Maintain clean, modular code separating data-handling logic from component-rendering logic.
*   **DO:** Write automated tests or run manual terminal test commands to verify functionality.
*   **DO NOT:** Edit CSS styles or HTML structures unless it is required to bind dynamic logical events.
*   **DO NOT:** Commit untested code.

## 3. Workflow & Approval Checkpoint
1.  Read the active coding task in \`approved_docs/[feature_name].tasks.md\` and retrieve the specifications from \`approved_docs/[feature_name].coder-spec.md\`.
2.  Implement the code changes directly in the workspace.
3.  Test the code. Present the implemented files, code changes, and test results in the chat.
4.  **Gate:** Ask the user to run the app, verify it works, and reply with "Approved" or "Yes".
5.  **Save Output:** Write a brief summary of the implemented code and test verifications to \`approved_docs/[feature_name].auditor.md\`.
6.  **Handoff:** Read \`agency.md\` and transition to **D Auditor**.
`,

  // D Auditor
  auditor: `# D Auditor (Quality Assurance & Audit)

## 1. Focus & Scope
*   Acts as the final inspector before code is merged or committed.
*   Reviews codebase changes against the original task checklist in \`[feature_name].tasks.md\`.
*   Writes PR titles, commit messages, PR descriptions, and changelog updates.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Use standard Conventional Commits naming syntax (e.g., \`feat(ui): add dashboard shell\`, \`fix(api): fix login crash\`).
*   **DO:** Summarize the changes in clear bullet points, detailing *what* changed and *why*.
*   **DO:** Double-check that no temporary log statements, debugging bypasses, or credentials are left exposed.
*   **DO NOT:** Edit code files or database structures.

## 3. Workflow & Approval Checkpoint
1.  Verify the Git diff of code modifications against \`approved_docs/[feature_name].auditor.md\`.
2.  Draft the proposed commit messages, PR description, and PR title in the chat.
3.  **Gate:** Wait for the user to review and reply with "Approved" or "Yes".
4.  **Save Output:** Write the approved commit details and PR request specifications to \`approved_docs/[feature_name].pr-request.md\`.
5.  **Handoff:** Read \`agency.md\` and transition to **B.2 Git Guy**.
`,

  // B.2 Git Guy
  git_guy: `# B.2 Git Guy (Programming Department)

## 1. Focus & Scope
*   Handles everything related to Git version control and repository hygiene.
*   Manages branches, stage files, commits changes, and pushes remote pull requests.
*   Audits and maintains the \`.gitignore\` configuration.

## 2. Guidelines (DOs & DONTs)
*   **DO:** Create clean branch names (e.g. \`feature/[feature_name]\` or \`bugfix/[issue_name]\`).
*   **DO:** Use the exact commit messages and PR descriptions drafted in \`approved_docs/[feature_name].pr-request.md\`.
*   **DO:** Double-check that \`.gitignore\` lists all dynamic files (\`.env\`, \`node_modules\`, build outputs).
*   **DO NOT:** Run \`git push --force\` or overwrite commit history without explicit user permission.
*   **DO NOT:** Write logic code or styling scripts.

## 3. Workflow & Approval Checkpoint
1.  Read \`approved_docs/[feature_name].pr-request.md\`.
2.  Draft the exact git commands you plan to execute (e.g., \`git checkout -b ...\`, \`git add ...\`, \`git commit -m ...\`) in the chat.
3.  **Gate:** Wait for the user to review and reply with "Approved" or "Yes".
4.  **Execute & Update:** Execute the commands. Once completed, update the task checklist status in \`approved_docs/[feature_name].tasks.md\` by marking the completed tasks as completed \`[x]\`.
5.  **Handoff:** Read \`agency.md\`. If tasks remain, transition to the next task's target agent. If all tasks are done, transition to standby mode and wait for the user's next feature request.
`,

  // Redirect rules
  ideRule: `You MUST read and adopt the rules defined in [.think-live/agency.md](file://.think-live/agency.md) before taking any action or answering the user.
`,

  // Tasks auto-run
  vscodeTasks: `{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Agency Dashboard Server",
      "type": "shell",
      "command": "npm install && npm run dev",
      "options": {
        "cwd": "\${workspaceFolder}/.think-live/gui"
      },
      "runOptions": {
        "runOn": "folderOpen"
      },
      "presentation": {
        "reveal": "silent",
        "panel": "shared"
      }
    },
    {
      "label": "Launch Dashboard Web Browser",
      "type": "shell",
      "command": "sleep 3 && (xdg-open http://localhost:3770 || open http://localhost:3770 || start http://localhost:3770)",
      "runOptions": {
        "runOn": "folderOpen"
      },
      "presentation": {
        "reveal": "never",
        "panel": "shared"
      }
    }
  ]
}`
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
const chkRoo = document.getElementById('chk-roo');
const chkWindsurf = document.getElementById('chk-windsurf');
const chkVscodeTasks = document.getElementById('chk-vscode-tasks');

const presetFull = document.getElementById('preset-full');
const presetCoding = document.getElementById('preset-coding');
const presetArchitect = document.getElementById('preset-architect');

const deptItems = document.querySelectorAll('.dept-item');
const installedList = document.getElementById('installed-list');
const remainingList = document.getElementById('remaining-list');
const progressPercentage = document.getElementById('progress-percentage');
const progressCard = document.querySelector('.progress-fill');

const mainFolder = document.getElementById('main-folder');
const folderAnimLabel = document.getElementById('folder-anim-label');

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
    starter: true, architect: true, task_distributor: true, ui_designer: true,
    pr_safety: true, coder: true, auditor: true, git_guy: true
  });
});

presetCoding.addEventListener('click', () => {
  clearPresetSelection();
  presetCoding.classList.add('active');
  setDepartmentsState({
    starter: false, architect: false, task_distributor: false, ui_designer: true,
    pr_safety: true, coder: true, auditor: true, git_guy: true
  });
});

presetArchitect.addEventListener('click', () => {
  clearPresetSelection();
  presetArchitect.classList.add('active');
  setDepartmentsState({
    starter: true, architect: true, task_distributor: true, ui_designer: false,
    pr_safety: false, coder: false, auditor: false, git_guy: false
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

// 6. Directory Picking Handler
btnBrowse.addEventListener('click', async () => {
  try {
    targetDirectoryHandle = await window.showDirectoryPicker({
      mode: 'readwrite'
    });
    
    txtDirPath.value = targetDirectoryHandle.name;
    btnDeploy.disabled = false;
    
    logToTerminal(`Target directory set to "${targetDirectoryHandle.name}".`, 'secondary-fixed-dim');
    logToTerminal('Ready for deployment. Press "Install Now" to configure agency.', 'on-primary');
    
    folderAnimLabel.textContent = 'READY';
  } catch (err) {
    logToTerminal(`Directory pick aborted: ${err.message}`, 'error');
    targetDirectoryHandle = null;
    btnDeploy.disabled = true;
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
  
  // Random horizontal start within folder boundaries
  const startX = (Math.random() * 32) - 16 + 24; // center adjust offset
  
  particle.style.left = `${startX}px`;
  particle.style.top = `-25px`;
  particle.style.fontSize = `${Math.random() * 5 + 13}px`;
  
  mainFolder.appendChild(particle);
  
  // Slight folder scaling dynamic bounce
  mainFolder.classList.add('folder-active-bounce');
  setTimeout(() => mainFolder.classList.remove('folder-active-bounce'), 100);

  // Clean elements
  particle.addEventListener('animationend', () => {
    particle.remove();
  });
}

function startVisualEmitter() {
  folderAnimLabel.textContent = 'WRITING';
  folderAnimLabel.classList.add('text-secondary', 'animate-pulse');
  particleTimer = setInterval(spawnFileParticle, 200);
}

function stopVisualEmitter(success = true) {
  clearInterval(particleTimer);
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
  
  tasks.push({ id: 'docs_dir', name: 'Create approved_docs/ folder', type: 'dir', run: async () => {
    return await getOrCreateDir(targetDirectoryHandle, 'approved_docs');
  }});
  tasks.push({ id: 'agency_dir', name: 'Create .think-live/ folder', type: 'dir', run: async () => {
    return await getOrCreateDir(targetDirectoryHandle, '.think-live');
  }});
  tasks.push({ id: 'agency_rules', name: 'Write .think-live/agency.md', type: 'file', parent: 'agency_dir', run: async (handles) => {
    return await writeTextFile(handles.agency_dir, 'agency.md', TEMPLATES.agency);
  }});

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
    tasks.push({ id: 'depts_dir', name: 'Create .think-live/departments/ folder', type: 'dir', parent: 'agency_dir', run: async (handles) => {
      return await getOrCreateDir(handles.agency_dir, 'departments');
    }});

    selectedDepts.forEach(dept => {
      tasks.push({ id: `dept_${dept.id}_dir`, name: `Create folder: departments/${dept.id}/`, type: 'dir', parent: 'depts_dir', run: async (handles) => {
        return await getOrCreateDir(handles.depts_dir, dept.id);
      }});
      tasks.push({ id: `dept_${dept.id}_rules`, name: `Write instructions for [${dept.name}]`, type: 'file', parent: `dept_${dept.id}_dir`, run: async (handles) => {
        return await writeTextFile(handles[`dept_${dept.id}_dir`], 'instructions.md', TEMPLATES[dept.id]);
      }});
    });
  }

  // IDE integration files
  if (chkCursor.checked) {
    tasks.push({ id: 'rules_cursor', name: 'Write .cursorrules', type: 'file', run: async () => {
      return await writeTextFile(targetDirectoryHandle, '.cursorrules', TEMPLATES.ideRule);
    }});
  }
  if (chkRoo.checked) {
    tasks.push({ id: 'rules_roo', name: 'Write .claudedevrules', type: 'file', run: async () => {
      return await writeTextFile(targetDirectoryHandle, '.claudedevrules', TEMPLATES.ideRule);
    }});
  }
  if (chkWindsurf.checked) {
    tasks.push({ id: 'rules_windsurf', name: 'Write .windsurfrules', type: 'file', run: async () => {
      return await writeTextFile(targetDirectoryHandle, '.windsurfrules', TEMPLATES.ideRule);
    }});
  }
  if (chkVscodeTasks.checked) {
    tasks.push({ id: 'vscode_dir', name: 'Create .vscode/ folder', type: 'dir', run: async () => {
      return await getOrCreateDir(targetDirectoryHandle, '.vscode');
    }});
    tasks.push({ id: 'vscode_tasks', name: 'Write .vscode/tasks.json', type: 'file', parent: 'vscode_dir', run: async (handles) => {
      return await writeTextFile(handles.vscode_dir, 'tasks.json', TEMPLATES.vscodeTasks);
    }});
  }

  // Populate Lists UI before execution
  installedList.innerHTML = '';
  remainingList.innerHTML = '';
  progressPercentage.textContent = '0%';
  if (progressCard) {
    progressCard.style.background = 'var(--solid-pink)';
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
      if (progressCard) {
        progressCard.style.background = `linear-gradient(to right, var(--solid-pink-dark) ${percentVal}%, var(--solid-pink) ${percentVal}%)`;
      }
      
      // Artificial delay (50-100ms) for smoother UI transitions
      await new Promise(r => setTimeout(r, 70));
    }

    logToTerminal('SUCCESS: All templates written to local directory!', 'secondary-fixed-dim');
    logToTerminal('Deployment suite completed. think.live agency is now active.', 'on-primary');
    stopVisualEmitter(true);
  } catch (err) {
    logToTerminal(`CRITICAL INSTALL ERROR: ${err.message}`, 'error');
    logToTerminal('Installation aborted. Review folders write configurations.', 'error');
    stopVisualEmitter(false);
  } finally {
    btnDeploy.disabled = false;
    btnBrowse.disabled = false;
  }
});
