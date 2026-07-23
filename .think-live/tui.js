const fs = require('fs');
const path = require('path');
const readline = require('readline');
const { exec } = require('child_process');
const http = require('http');

// File paths for synchronization
const WORKSPACE_DIR = path.resolve(__dirname, '..');
const STATE_FILE_PATH = path.join(WORKSPACE_DIR, '.think-live', 'state.json');

// Enable raw mode to capture keyboard shortcuts
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
    } else if (key.name === 's') {
      toggleLocalServer();
    }
  });
}

// Ensure clean exit (show cursor, clear screen, restore stdout)
function cleanupAndExit() {
  process.stdout.write('\x1B[?25h');
  process.stdout.write('\x1B[0m');
  if (localServer) {
    try { localServer.close(); } catch (e) {}
  }
  console.clear();
  process.exit(0);
}

// Hide cursor during TUI execution
process.stdout.write('\x1B[?25l');

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

// Hook tracking variables
let isRunningHooks = false;
let hookError = '';

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
      { id: 'security_auditor', code: 'D.3', name: 'Security Auditor' },
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
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(currentState, null, 2), 'utf8');
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
    fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(currentState, null, 2), 'utf8');
    activeState = currentState;
    renderTUI();
  } catch (err) {
    // Ignore write errors
  }
}

// Zero-dependency HTTP static server
let localServer = null;
let localServerPort = 3000;

function startLocalServer() {
  if (localServer) return;
  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url);
    let filePath = path.join(WORKSPACE_DIR, reqPath === '/' ? '' : reqPath);
    if (!filePath.startsWith(WORKSPACE_DIR)) {
      res.statusCode = 403;
      res.end('Forbidden');
      return;
    }
    if (fs.existsSync(filePath)) {
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        const indexHtml = path.join(filePath, 'index.html');
        if (fs.existsSync(indexHtml)) {
          res.writeHead(200, { 'Content-Type': 'text/html' });
          fs.createReadStream(indexHtml).pipe(res);
        } else {
          const files = fs.readdirSync(filePath);
          const projects = [];
          files.forEach(f => {
            if (f.startsWith('.') || f === 'node_modules' || f === 'temp') return;
            const sub = path.join(filePath, f);
            if (fs.statSync(sub).isDirectory()) {
              if (fs.existsSync(path.join(sub, 'index.html'))) {
                projects.push(f);
              }
            }
          });
          res.writeHead(200, { 'Content-Type': 'text/html' });
          res.end(`
            <!DOCTYPE html>
            <html>
            <head>
              <title>think.live Portal</title>
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
              <link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600&display=swap" rel="stylesheet">
              <style>
                body { font-family: 'Outfit', sans-serif; background-color: #0f172a; color: #e2e8f0; margin: 0; padding: 40px 20px; display: flex; flex-direction: column; align-items: center; }
                .container { max-width: 600px; width: 100%; background: rgba(30, 41, 59, 0.7); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 24px; padding: 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.3); backdrop-filter: blur(10px); }
                h1 { margin-top: 0; color: #38bdf8; font-weight: 600; text-align: center; }
                p { color: #94a3b8; text-align: center; }
                .list { display: flex; flex-direction: column; gap: 15px; margin-top: 25px; }
                .item { background: rgba(255, 255, 255, 0.05); padding: 18px 24px; border-radius: 16px; text-decoration: none; color: #f1f5f9; font-weight: 600; display: flex; justify-content: space-between; align-items: center; transition: all 0.2s ease; border: 1px solid transparent; }
                .item:hover { background: rgba(56, 189, 248, 0.15); border-color: #38bdf8; transform: translateY(-2px); }
                .arrow { color: #38bdf8; font-size: 18px; }
                .badge { background: #0284c7; font-size: 11px; padding: 3px 8px; border-radius: 8px; color: white; }
              </style>
            </head>
            <body>
              <div class="container">
                <h1>think.live Workspace Portal</h1>
                <p>Select a project subfolder built by the agency below to run it:</p>
                <div class="list">
                  \${projects.map(p => \`
                    <a href="/\${p}/" class="item">
                      <span>📂 \${p}</span>
                      <div style="display: flex; align-items: center; gap: 10px;">
                        <span class="badge">Active Project</span>
                        <span class="arrow">➔</span>
                      </div>
                    </a>
                  \`).join('') || '<div style="text-align:center;color:#64748b;">No projects with index.html found. Start a sprint to generate one!</div>'}
                </div>
              </div>
            </body>
            </html>
          `);
        }
      } else if (stat.isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        let contentType = 'text/plain';
        if (ext === '.html') contentType = 'text/html';
        else if (ext === '.css') contentType = 'text/css';
        else if (ext === '.js') contentType = 'text/javascript';
        else if (ext === '.json') contentType = 'application/json';
        else if (ext === '.png') contentType = 'image/png';
        else if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
        else if (ext === '.svg') contentType = 'image/svg+xml';
        res.writeHead(200, { 'Content-Type': contentType });
        fs.createReadStream(filePath).pipe(res);
      }
    } else {
      res.statusCode = 404;
      res.end('Not Found');
    }
  });
  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      localServerPort++;
      server.listen(localServerPort);
    }
  });
  server.listen(localServerPort, () => {
    localServer = server;
    renderTUI();
  });
}

function toggleLocalServer() {
  if (localServer) {
    localServer.close(() => {
      localServer = null;
      renderTUI();
    });
  } else {
    startLocalServer();
  }
}

function drawCircleBar(percent) {
  const total = 16;
  const filled = Math.min(total, Math.max(0, Math.round((percent / 100) * total)));
  const empty = total - filled;
  return GREEN + '◉ '.repeat(filled) + RESET + DIM + '□ '.repeat(empty) + RESET;
}

const HANDOVER_FILE_PATH = path.join(WORKSPACE_DIR, '.think-live', 'handover-context.json');
const TASK_TRACKER_PATH = path.join(WORKSPACE_DIR, '.think-live', 'task-tracker.md');

// Safe read state
let lastHandoverStr = '';
let activeHandover = null;
let trackerStats = { exists: false, completed: 0, total: 0 };

function checkState() {
  if (isRunningHooks) return;

  try {
    let stateChanged = false;
    if (fs.existsSync(STATE_FILE_PATH)) {
      const data = fs.readFileSync(STATE_FILE_PATH, 'utf8');
      if (data !== lastJsonStr) {
        const nextState = JSON.parse(data);
        const prevAgent = activeState.active_agent;
        const nextAgent = nextState.active_agent;
        
        hookError = '';

        if (prevAgent && nextAgent && prevAgent !== nextAgent) {
          isRunningHooks = true;
          renderTUI();
          
          const hooksScript = path.join(WORKSPACE_DIR, '.think-live', 'hooks-runtime.js');
          exec(`node "${hooksScript}" "${prevAgent}" "${nextAgent}"`, (err, stdout, stderr) => {
            isRunningHooks = false;
            if (err) {
              const revertedState = {
                ...nextState,
                active_agent: prevAgent,
                last_agent: nextState.last_agent,
                error_feedback: (stdout + '\n' + stderr).trim()
              };
              fs.writeFileSync(STATE_FILE_PATH, JSON.stringify(revertedState, null, 2), 'utf8');
              
              const errorFile = path.join(WORKSPACE_DIR, 'approved_docs', 'transition-failure.md');
              fs.writeFileSync(errorFile, `# 🔄 Transition Failure

Transition from **${prevAgent}** to **${nextAgent}** was BLOCKED by automated verification hooks.

### Output Log:
\`\`\`
${stdout}
${stderr}
\`\`\`

Please address the issues before attempting the transition again.`, 'utf8');
              
              hookError = `Blocked transition from ${prevAgent} to ${nextAgent}!`;
              renderTUI();
            } else {
              lastJsonStr = data;
              activeState = nextState;
              renderTUI();
            }
          });
          return;
        }

        lastJsonStr = data;
        activeState = nextState;
        stateChanged = true;
      }
    } else {
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

    let newTrackerStats = { exists: false, completed: 0, total: 0 };
    if (fs.existsSync(TASK_TRACKER_PATH)) {
      const trackerData = fs.readFileSync(TASK_TRACKER_PATH, 'utf8');
      const lines = trackerData.split('\n');
      for (const line of lines) {
        if (line.match(/^\s*-\s*\[[xX]\]/)) {
          newTrackerStats.completed++;
          newTrackerStats.total++;
        } else if (line.match(/^\s*-\s*\[\s\]/) || line.match(/^\s*-\s*\[\/\]/)) {
          newTrackerStats.total++;
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
  } catch (err) {}
}

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const RED = '\x1b[31m';

function padEnd(str, length) {
  const cleanStr = str.replace(/\x1b\[[0-9;]*m/g, '');
  const diff = length - cleanStr.length;
  return str + (diff > 0 ? ' '.repeat(diff) : '');
}

function renderTUI() {
  process.stdout.write('\x1B[2J\x1B[H');

  const width = 80;
  
  console.log(BOLD + BLUE + '┌' + '─'.repeat(width - 2) + '┐' + RESET);
  const leftHeader = '  think.live AGENCY MONITOR';
  const rightHeader = '● LIVE RUNNING';
  const modeLabel = activeState.autonomous ? 'AUTONOMOUS ⚡' : 'MANUAL 👤';
  const gitLabel = activeState.git_enabled ? 'GIT: ON' : 'GIT: OFF';
  const modeColor = activeState.autonomous ? GREEN : YELLOW;
  const gitColor = activeState.git_enabled ? GREEN : RED;
  const leftLen = leftHeader.length;
  const modeLen = activeState.autonomous ? 15 : 11;
  const gitLen = activeState.git_enabled ? 10 : 11;
  const centerLen = modeLen + gitLen;
  const rightLen = rightHeader.length;
  const totalUsed = leftLen + centerLen + rightLen;
  const totalSpaces = 76 - totalUsed;
  const halfSpaces = Math.floor(totalSpaces / 2);
  const leftPadding = ' '.repeat(halfSpaces);
  const rightPadding = ' '.repeat(totalSpaces - halfSpaces);
  console.log(BOLD + BLUE + '│' + RESET + BOLD + leftHeader + leftPadding + modeColor + '[' + modeLabel + '] ' + gitColor + '[' + gitLabel + ']' + RESET + BOLD + rightPadding + GREEN + rightHeader + ' ' + RESET + BOLD + BLUE + ' │' + RESET);
  console.log(BOLD + BLUE + '└' + '─'.repeat(width - 2) + '┘' + RESET);

  const separator = BOLD + BLUE + ' │ ' + RESET;
  const deptLines = [];
  DEPARTMENTS.forEach(dept => {
    deptLines.push(BOLD + MAGENTA + '[' + dept.name + ']' + RESET);
    dept.agents.forEach(agent => {
      const isActive = activeState.active_agent === agent.id;
      const isLast = activeState.last_agent === agent.id;

      let prefix = '  ';
      let nameStr = agent.code + ' ' + agent.name;
      let suffix = '';

      if (isActive) {
        prefix = GREEN + '▶ ' + RESET;
        nameStr = BOLD + GREEN + nameStr + RESET;
        suffix = BOLD + GREEN + ' (ACTIVE) 🤖' + RESET;
      } else if (isLast) {
        prefix = YELLOW + '↩ ' + RESET;
        nameStr = YELLOW + nameStr + RESET;
        suffix = YELLOW + ' (LAST)' + RESET;
      } else {
        nameStr = DIM + nameStr + RESET;
      }
      deptLines.push(prefix + nameStr + suffix);
    });
    deptLines.push('');
  });

  const rightLines = [];
  rightLines.push(BOLD + BLUE + '┌─ CURRENT RUN STATE ───────────────────────┐' + RESET);
  const activeDetail = findAgentDetails(activeState.active_agent);
  const lastDetail = findAgentDetails(activeState.last_agent);

  if (isRunningHooks) {
    rightLines.push(BOLD + YELLOW + '  ▶ Status: RUNNING VERIFICATION HOOKS...   ' + RESET);
  } else if (hookError) {
    rightLines.push(BOLD + RED + '  ▶ Status: VERIFICATION BLOCKED            ' + RESET);
  } else {
    rightLines.push(BOLD + '  Currently Active: ' + RESET + (activeDetail ? GREEN + BOLD + activeDetail.name + ' (' + activeDetail.code + ') ⚡' + RESET : DIM + 'Standby / Idle' + RESET));
  }
  rightLines.push(BOLD + '  Last Used Agent:  ' + RESET + (lastDetail ? YELLOW + lastDetail.name + ' (' + lastDetail.code + ')' + RESET : DIM + 'None' + RESET));
  rightLines.push(BOLD + '  Active Spec Doc:  ' + RESET + BLUE + (activeState.active_doc || 'None') + RESET);
  rightLines.push(BOLD + '  Local App Server: ' + RESET + (localServer ? GREEN + BOLD + `http://localhost:${localServerPort}/` + RESET : DIM + 'Offline [Press s]' + RESET));
  rightLines.push(BOLD + BLUE + '└───────────────────────────────────────────┘' + RESET);
  rightLines.push('');

  rightLines.push(BOLD + BLUE + '┌─ RECENT CHANGED FILES ────────────────────┐' + RESET);
  if (activeState.modified_files && activeState.modified_files.length > 0) {
    activeState.modified_files.slice(-5).forEach(file => rightLines.push('  ' + GREEN + '✚' + RESET + ' ' + file));
    for (let i = activeState.modified_files.length; i < 5; i++) rightLines.push('  ');
  } else {
    rightLines.push('  ' + DIM + 'No files modified in last prompt.' + RESET);
    for (let i = 0; i < 4; i++) rightLines.push('  ');
  }
  rightLines.push(BOLD + BLUE + '└───────────────────────────────────────────┘' + RESET);
  rightLines.push('');

  rightLines.push(BOLD + BLUE + '┌─ TASK PROGRESS ───────────────────────────┐' + RESET);
  if (trackerStats.exists && trackerStats.total > 0) {
    const pct = ((trackerStats.completed / trackerStats.total) * 100).toFixed(0);
    rightLines.push(`  \${BOLD}Tasks Done:\${RESET} \${GREEN}\${trackerStats.completed}\${RESET} / \${trackerStats.total} (\${pct}%)`);
    rightLines.push(`  ` + drawCircleBar(parseFloat(pct)));
  } else {
    rightLines.push(`  \${DIM}No tasks found.\${RESET}`);
    rightLines.push('  ');
  }
  rightLines.push(BOLD + BLUE + '└───────────────────────────────────────────┘' + RESET);

  const maxLines = Math.max(deptLines.length, rightLines.length);
  for (let i = 0; i < maxLines; i++) console.log(padEnd(deptLines[i] || '', 34) + separator + (rightLines[i] || ''));

  console.log(BOLD + BLUE + '┌─ LAST HANDOVER CONTEXT ──────────────────────────────────────────────────────┐' + RESET);
  if (isRunningHooks) {
    console.log('  ' + BOLD + YELLOW + 'HOOKS RUNNING: Validating workspace changes...' + RESET);
  } else if (hookError) {
    console.log('  ' + BOLD + RED + 'VERIFICATION FAILED!' + RESET);
    console.log('  ' + RED + 'Error report written to: approved_docs/transition-failure.md' + RESET);
  } else if (activeHandover) {
    const fromDetail = findAgentDetails(activeHandover.last_agent);
    const toDetail = findAgentDetails(activeHandover.next_agent);
    const fromName = fromDetail ? fromDetail.name + ' (' + fromDetail.code + ')' : (activeHandover.last_agent || 'Unknown');
    const toName = toDetail ? toDetail.name + ' (' + toDetail.code + ')' : (activeHandover.next_agent || 'Unknown');
    console.log('  ' + BOLD + 'Route:' + RESET + ' ' + YELLOW + fromName + RESET + ' ➔ ' + GREEN + toName + RESET);
    
    if (activeHandover.what_was_tried) {
      console.log('  ' + BOLD + 'What was tried:' + RESET);
      const items = Array.isArray(activeHandover.what_was_tried)
        ? activeHandover.what_was_tried
        : [activeHandover.what_was_tried];
      items.slice(0, 3).forEach(item => {
        console.log('    • ' + String(item).substring(0, 70));
      });
    }
    if (activeHandover.failures_or_warnings) {
      console.log('  ' + BOLD + RED + 'Warnings/Failures:' + RESET);
      const items = Array.isArray(activeHandover.failures_or_warnings)
        ? activeHandover.failures_or_warnings
        : [activeHandover.failures_or_warnings];
      items.slice(0, 2).forEach(item => {
        console.log('    • ' + RED + String(item).substring(0, 70) + RESET);
      });
    }
  } else {
    console.log('  ' + DIM + 'No active handover context. Waiting for next transition...' + RESET);
  }
  console.log(BOLD + BLUE + '└──────────────────────────────────────────────────────────────────────────────┘' + RESET);

  console.log(BOLD + BLUE + '│' + RESET + DIM + '  Press [a] Autonomous | [s] Serve App | [q] to Exit' + ' '.repeat(27) + RESET + BOLD + BLUE + '│' + RESET);
  console.log(BOLD + BLUE + '└' + '─'.repeat(width - 2) + '┘' + RESET);
}

renderTUI();
setInterval(checkState, 500);
