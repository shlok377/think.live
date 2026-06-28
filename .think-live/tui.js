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
    } else if (key.name === 'a') {
      toggleAutonomousMode();
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
    name: 'Product & Quality',
    icon: '🔍',
    agents: [
      { id: 'director', code: 'D.1', name: 'Director' },
      { id: 'quality_tester', code: 'D.2', name: 'Quality Tester' }
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

function formatTokens(n) {
  if (n >= 1000000) {
    return (n / 1000000).toFixed(1) + 'M';
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(1) + 'k';
  }
  return n.toString();
}

function drawCircleBar(percent) {
  const total = 16;
  const filled = Math.min(total, Math.max(0, Math.round((percent / 100) * total)));
  const empty = total - filled;
  return `${GREEN}${'◉ '.repeat(filled)}${RESET}${DIM}${'□ '.repeat(empty)}${RESET}`;
}

const HANDOVER_FILE_PATH = path.join(WORKSPACE_DIR, '.think-live', 'handover-context.json');

// Safe read state
let lastHandoverStr = '';
let activeHandover = null;

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
        autonomous: false
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

    if (stateChanged) {
      renderTUI();
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
  const leftHeader = '  think.live AGENCY MONITOR';
  const rightHeader = '● LIVE RUNNING';
  const modeLabel = activeState.autonomous ? 'AUTONOMOUS ⚡' : 'MANUAL 👤';
  const modeColor = activeState.autonomous ? GREEN : YELLOW;
  const centerHeader = `[${modeLabel}]`;
  const leftLen = leftHeader.length;
  const centerLen = activeState.autonomous ? 15 : 11;
  const rightLen = rightHeader.length;
  const totalUsed = leftLen + centerLen + rightLen;
  const totalSpaces = 76 - totalUsed;
  const halfSpaces = Math.floor(totalSpaces / 2);
  const leftPadding = ' '.repeat(halfSpaces);
  const rightPadding = ' '.repeat(totalSpaces - halfSpaces);
  console.log(BOLD + BLUE + '│' + RESET + BOLD + leftHeader + leftPadding + modeColor + centerHeader + RESET + BOLD + rightPadding + GREEN + rightHeader + ' ' + RESET + BOLD + BLUE + ' │' + RESET);
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

  rightLines.push('');
  rightLines.push(BOLD + MAGENTA + '┌─ CONTEXT & TOKEN USAGE ───────────────────┐' + RESET);
  if (activeState.context_usage) {
    const usage = activeState.context_usage;
    const pct = ((usage.used_tokens / usage.total_tokens) * 100).toFixed(1);
    rightLines.push(`  ${BOLD}Model:${RESET} ${CYAN}${usage.model || 'Unknown'}${RESET}`);
    rightLines.push(`  ${BOLD}Usage:${RESET} ${formatTokens(usage.used_tokens)} / ${formatTokens(usage.total_tokens)} (${pct}%)`);
    rightLines.push(`  ` + drawCircleBar(parseFloat(pct)));
    rightLines.push(`  ${DIM}Token usage by category:${RESET}`);
    
    const cats = usage.categories || {};
    const total = usage.total_tokens;
    
    const addCatLine = (label, val, icon) => {
      const catPct = ((val / total) * 100).toFixed(1);
      rightLines.push(`    ${icon} ${label}: ${formatTokens(val)} (${catPct}%)`);
    };
    
    if (cats.user_messages !== undefined) addCatLine('User messages', cats.user_messages, `${GREEN}●${RESET}`);
    if (cats.agent_responses !== undefined) addCatLine('Agent responses', cats.agent_responses, `${GREEN}●${RESET}`);
    if (cats.tool_calls !== undefined) addCatLine('Tool calls', cats.tool_calls, `${GREEN}●${RESET}`);
    if (cats.system_prompt !== undefined) addCatLine('System prompt', cats.system_prompt, `${BLUE}⛁${RESET}`);
    if (cats.system_tools !== undefined) addCatLine('System tools', cats.system_tools, `${BLUE}⛁${RESET}`);
    if (cats.skills !== undefined) addCatLine('Skills', cats.skills, `${BLUE}⛁${RESET}`);
    if (cats.subagents !== undefined) addCatLine('Subagents', cats.subagents, `${BLUE}⛁${RESET}`);
    
    const free = usage.total_tokens - usage.used_tokens;
    const freePct = ((free / total) * 100).toFixed(1);
    rightLines.push(`    ○ Free space: ${formatTokens(free)} (${freePct}%)`);
  } else {
    rightLines.push(`  ${DIM}No active context usage metrics reported.${RESET}`);
    rightLines.push('  ');
    rightLines.push('  ');
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

  // Handover Context Box
  console.log(BOLD + MAGENTA + '┌─ LAST HANDOVER CONTEXT ──────────────────────────────────────────────────────┐' + RESET);
  if (activeHandover) {
    const fromDetail = findAgentDetails(activeHandover.last_agent);
    const toDetail = findAgentDetails(activeHandover.next_agent);
    const fromName = fromDetail ? `${fromDetail.name} (${fromDetail.code})` : (activeHandover.last_agent || 'Unknown');
    const toName = toDetail ? `${toDetail.name} (${toDetail.code})` : (activeHandover.next_agent || 'Unknown');
    console.log(`  ${BOLD}Route:${RESET} ${YELLOW}${fromName}${RESET} ➔ ${GREEN}${toName}${RESET}`);
    
    if (activeHandover.what_was_tried && activeHandover.what_was_tried.length > 0) {
      console.log(`  ${BOLD}What was tried:${RESET}`);
      activeHandover.what_was_tried.slice(0, 3).forEach(item => {
        console.log(`    • ${item.substring(0, 70)}`);
      });
    }
    if (activeHandover.failures_or_warnings && activeHandover.failures_or_warnings.length > 0) {
      console.log(`  ${BOLD}${RED}Warnings/Failures:${RESET}`);
      activeHandover.failures_or_warnings.slice(0, 2).forEach(item => {
        console.log(`    • ${RED}${item.substring(0, 70)}${RESET}`);
      });
    }
  } else {
    console.log(`  ${DIM}No active handover context. Waiting for next transition...${RESET}`);
  }
  console.log(BOLD + MAGENTA + '└──────────────────────────────────────────────────────────────────────────────┘' + RESET);

  // Footer / Keyboard Help
  console.log(BOLD + BLUE + '┌' + '─'.repeat(width - 2) + '┐' + RESET);
  console.log(BOLD + BLUE + '│' + RESET + DIM + '  Press [a] to toggle Autonomous Mode | [q] to exit.' + ' '.repeat(24) + RESET + BOLD + BLUE + '│' + RESET);
  console.log(BOLD + BLUE + '└' + '─'.repeat(width - 2) + '┘' + RESET);
}

// Initial draw
renderTUI();

// Check for updates every 500ms
setInterval(checkState, 500);
