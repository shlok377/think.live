const fs = require('fs');
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
    }
  });
}

// Ensure clean exit (show cursor, clear screen, restore stdout)
function cleanupAndExit() {
  process.stdout.write('\x1B[?25h'); // Show cursor
  process.stdout.write('\x1B[0m');    // Reset colors
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
  modified_files: []
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
      { id: 'ui_designer', code: 'A.1', name: 'UI Designer' },
      { id: 'pr_safety', code: 'A.2', name: 'PR & Safety' },
      { id: 'ui_tester', code: 'A.3', name: 'UI Tester' }
    ]
  },
  {
    name: 'Programming',
    icon: '💻',
    agents: [
      { id: 'coder', code: 'B.1', name: 'Coder' },
      { id: 'git_guy', code: 'B.2', name: 'Git Guy' }
    ]
  },
  {
    name: 'Quality Assurance',
    icon: '🔍',
    agents: [
      { id: 'auditor', code: 'D', name: 'Auditor' }
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

// Safe read state
function checkState() {
  try {
    if (fs.existsSync(STATE_FILE_PATH)) {
      const data = fs.readFileSync(STATE_FILE_PATH, 'utf8');
      if (data !== lastJsonStr) {
        lastJsonStr = data;
        activeState = JSON.parse(data);
        renderTUI();
      }
    } else {
      // Default empty state if file not created yet
      const defaultState = JSON.stringify({
        active_agent: null,
        last_agent: null,
        active_doc: 'None',
        modified_files: []
      });
      if (defaultState !== lastJsonStr) {
        lastJsonStr = defaultState;
        activeState = JSON.parse(defaultState);
        renderTUI();
      }
    }
  } catch (err) {
    // Ignore read/parse errors during write transition
  }
}

// ANSI Escape Codes for formatting
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const DIM = '\x1b[2m';
const GREEN = '\x1b[32m';
const YELLOW = '\x1b[33m';
const BLUE = '\x1b[34m';
const MAGENTA = '\x1b[35m';
const CYAN = '\x1b[36m';
const RED = '\x1b[31m';
const GRAY = '\x1b[90m';
const BG_DARK_GRAY = '\x1b[100m';

// Format strings to fit column widths
function padEnd(str, length) {
  const cleanStr = str.replace(/\x1b\[[0-9;]*m/g, ''); // Remove ANSI codes for correct length calc
  const diff = length - cleanStr.length;
  return str + (diff > 0 ? ' '.repeat(diff) : '');
}

// Draw the screen
function renderTUI() {
  // Clear the screen and move cursor to top-left
  process.stdout.write('\x1B[2J\x1B[H');

  const width = 80;
  
  // Header Panel
  console.log(BOLD + BLUE + '┌' + '─'.repeat(width - 2) + '┐' + RESET);
  console.log(BOLD + BLUE + '│' + RESET + BOLD + '  think.live AGENCY MONITOR' + ' '.repeat(width - 45) + GREEN + '● LIVE RUNNING ' + RESET + BOLD + BLUE + ' │' + RESET);
  console.log(BOLD + BLUE + '└' + '─'.repeat(width - 2) + '┘' + RESET);

  // Left Column (Departments) vs Right Column (Status details)
  // Left col: 34 chars, Right col: 42 chars
  const separator = BOLD + BLUE + ' │ ' + RESET;

  const lines = [];

  // 1. Compile Department lists
  const deptLines = [];
  DEPARTMENTS.forEach(dept => {
    deptLines.push(BOLD + CYAN + `[${dept.name}]` + RESET);
    dept.agents.forEach(agent => {
      const isActive = activeState.active_agent === agent.id;
      const isLast = activeState.last_agent === agent.id;

      let prefix = '  ';
      let nameStr = `${agent.code} ${agent.name}`;
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

  // 2. Compile Right side panels
  const rightLines = [];
  rightLines.push(BOLD + MAGENTA + '┌─ CURRENT RUN STATE ───────────────────────┐' + RESET);
  
  const activeDetail = findAgentDetails(activeState.active_agent);
  const lastDetail = findAgentDetails(activeState.last_agent);

  rightLines.push(BOLD + '  Currently Active: ' + RESET + (activeDetail ? `${GREEN}${BOLD}${activeDetail.name} (${activeDetail.code}) ⚡${RESET}` : `${DIM}Standby / Idle${RESET}`));
  rightLines.push(BOLD + '  Last Used Agent:  ' + RESET + (lastDetail ? `${YELLOW}${lastDetail.name} (${lastDetail.code})${RESET}` : `${DIM}None${RESET}`));
  rightLines.push(BOLD + '  Active Spec Doc:  ' + RESET + `${BLUE}${activeState.active_doc || 'None'}${RESET}`);
  rightLines.push(BOLD + MAGENTA + '└───────────────────────────────────────────┘' + RESET);
  rightLines.push('');

  rightLines.push(BOLD + MAGENTA + '┌─ RECENT CHANGED FILES ────────────────────┐' + RESET);
  if (activeState.modified_files && activeState.modified_files.length > 0) {
    activeState.modified_files.slice(-5).forEach(file => {
      rightLines.push(`  ${GREEN}✚${RESET} ${file}`);
    });
    // Pad to 5 lines
    for (let i = activeState.modified_files.length; i < 5; i++) {
      rightLines.push('  ');
    }
  } else {
    rightLines.push(`  ${DIM}No files modified in last prompt.${RESET}`);
    rightLines.push('  ');
    rightLines.push('  ');
    rightLines.push('  ');
    rightLines.push('  ');
  }
  rightLines.push(BOLD + MAGENTA + '└───────────────────────────────────────────┘' + RESET);

  // Merge columns
  const maxLines = Math.max(deptLines.length, rightLines.length);
  for (let i = 0; i < maxLines; i++) {
    const leftPart = padEnd(deptLines[i] || '', 34);
    const rightPart = rightLines[i] || '';
    console.log(leftPart + separator + rightPart);
  }

  // Footer / Keyboard Help
  console.log(BOLD + BLUE + '┌' + '─'.repeat(width - 2) + '┐' + RESET);
  console.log(BOLD + BLUE + '│' + RESET + DIM + '  Press [q] to exit live TUI monitor.' + ' '.repeat(width - 41) + RESET + BOLD + BLUE + '│' + RESET);
  console.log(BOLD + BLUE + '└' + '─'.repeat(width - 2) + '┘' + RESET);
}

// Initial draw
renderTUI();

// Check for updates every 500ms
setInterval(checkState, 500);
