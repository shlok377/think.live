# think.live
**The open-source AI Agency System.**

Welcome to the think.live project. This repository is configured to use a specialized sub-agent department system (TUI) to organize and simplify software development. It enforces a strict Agile loop with specialized personas (Director, Designer, Coder, Quality Tester, etc.) to ensure high-quality software generation.

> [!IMPORTANT]
> **AI ASSISTANT SYSTEM RULES**
> If you are an AI assistant coding in this repository, you **MUST** immediately read and adopt the rules defined in [.think-live/agency.md](file://.think-live/agency.md) before taking any action or answering the user.

---

## Getting Started: Two Ways to Build

There are two primary ways to use the `think.live` agency system for your projects.

### Option A: The Web Installer (Recommended for new local folders)
If you want to inject the AI Agency into a completely empty project folder on your machine, you don't need to clone this repo!
1. Start the web installer locally by running: `python3 -m http.server 8000` (or host it).
2. Open `http://localhost:8000` in a modern Chromium-based browser (Chrome, Edge, Brave).
3. Click **"Select Project Directory"** and choose your empty local folder.
4. Click **"Install Agency to Folder"**. The installer will write the `.think-live` engine directly to your machine.
5. In your new folder, simply run `node start-monitoring.js` to boot up the Terminal UI!

### Option B: Clone & Clean (Quickstart for development)
If you prefer to clone this repository directly and use it as your starting boilerplate:

**1. Clone the Repo**
```bash
git clone https://github.com/thinklive/think.live.git my-new-project
cd my-new-project
```

**2. Boot the Terminal UI Monitor**
The agency files are already in the repository. You can immediately boot the TUI to visualize the active agent states:
```bash
node start-monitoring.js
```
*(Leave this running in a separate terminal tab while you pair-program with your AI!)*

**3. Clear the Installer Clutter (Important!)**
Because this repository also acts as the source code for the Web Installer, it contains HTML/JS/CSS that you don't need for your actual project. To clean your workspace and start building your own app (e.g. in a `./frontend` folder), you should delete the installer files.

Run this command in your terminal to clear the clutter:
```bash
rm -rf index.html js/ css/ temp/ approved_docs/* .think-live/state.json .think-live/handover-context.json .think-live/task-tracker.md ExampleAGENTS.md
```

You now have a perfectly clean AI Agency workspace ready for your code!

---

## Architecture Rules
1. **Sacred Root:** Do not run destructive init commands (`npx create-vite .`) in the root directory. Place all application code in subdirectories.
2. **State Machine:** The `.think-live/state.json` file controls which AI agent is currently active. The TUI monitor visually tracks this file.
