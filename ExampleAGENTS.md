# Repository Guidelines

## Project Structure & Module Organization
- `Dr.Atluz.Service/`: ASP.NET Core backend (controllers, services, middleware, hubs).
- `Dr.Atluz.Service.Entity/`: shared EF Core entities and data model types.
- `Dr.Atluz.Service.Test/`: xUnit v3 test project for service-layer behavior.
- `Dr.Atluz.UI/`: ASP.NET Core host for the Angular SPA.
- `Dr.Atluz.UI/ClientApp/`: Angular source (`src/`) and npm scripts.
- `Dr.Atluz.UI.Test/`: UI test project.
- `Dr.Atluz.Utility/`: utility projects and solution files.
- `Database/Upgrade/`: SQL upgrade scripts. Keep DB changes here with ordered filenames.
- `Publish/`: publish artifacts; treat as generated output, not hand-edited source.
- `Database/Unility/`: DB scaffolding utility; treat as utility for scaffolding DB changes to entity.

## Build, Test, and Development Commands
- `dotnet restore Dr.Atluz.sln`: restore all .NET dependencies.
- `dotnet build Dr.Atluz.sln -c Debug`: build all projects.
- `dotnet test Dr.Atluz.Service.Test/Dr.Atluz.Service.Test.csproj -c Debug`: run backend tests.
- `dotnet run --project Dr.Atluz.Service/Dr.Atluz.Service.csproj`: run service locally.
- `dotnet run --project Dr.Atluz.UI/Dr.Atluz.UI.csproj`: run UI host locally.
- `cd Dr.Atluz.UI/ClientApp && npm ci`: install SPA dependencies (Node `22.17.x`).
- `cd Dr.Atluz.UI/ClientApp && npm start`: run Angular dev server.
- `cd Dr.Atluz.UI.Test && npm ci`: install Playwright E2E dependencies.
- `cd Dr.Atluz.UI.Test && npm run typecheck`: type-check Playwright E2E tests.
- `cd Dr.Atluz.UI.Test && npm run e2e`: run Playwright E2E tests.
- `cd Dr.Atluz.UI/ClientApp && npm run build -- --configuration production`: Angular production build; do not run unless explicitly requested.

## Coding Style & Naming Conventions
- C#: 4-space indentation, `PascalCase` for types/methods/properties, `camelCase` for locals/fields.
- TypeScript: spaces for indentation, single quotes, semicolons, and <= 140-character lines.
- Keep files and class names aligned (for example, `HolidayServiceTest.cs` -> `HolidayServiceTest`).
- Style checks use `StyleCop.Analyzers` and `Solution Items/stylecop.ruleset`; resolve analyzer warnings before PR.

## Coding Instruction
- Never use view models in service. Ask before using one if there is no alternate.
- New class must be created in separate file.
- While implementing, make sure processing and memory usage are efficient.
- If a custom property is required in an entity model, ask before adding it. Do not add it directly.

## Testing Guidelines
- Frameworks: xUnit v3 + Moq + EF Core InMemory.
- Add/update tests in `Dr.Atluz.Service.Test/` for every service bug fix or behavior change.
- UI E2E tests live in `Dr.Atluz.UI.Test/` and use Playwright; legacy Protractor tests are not used.
- Follow existing naming pattern: `<DomainOrService>NameTest.cs` with focused `[Fact]` tests.
- No explicit coverage gate is configured; maintain or increase coverage in touched areas.
- Do not ask permission to run `dotnet test`.

## Branch, Commit & Pull Request Guidelines
- Never make code, documentation, or configuration changes directly on a `master` branch, including root `master` or release masters such as `v0.65/master`. Create or switch to a non-master task branch first.
- Always ask for task ID/ref. before creating a branch. If the user provides `temp`, create the branch without a task ID.
- Derive the release branch folder from `Directory.Build.props` `<Version>`. Use only major and minor version numbers: `0.65.0` or `0.65.1` -> `v0.65/`.
- Branch names should follow `<release-folder>/#<ticket>_<TaskTitleInPascalCase>` (example: `v0.65/#1333_TitleOfTheTask`).
- When asked to create or suggest a branch for an Azure DevOps work item, fetch the work item title when access is available and use it for the branch title.
- Follow commit pattern used in history: `#<ticket>: <type> - <short description>` (example: `#1265: Fix - Voucher Tax rounding validation mismatch with UI.`).
- Keep commits scoped to one change set (feature/fix/refactor).
- PRs should include: purpose summary, linked ticket, test evidence (`dotnet test`, `npm run e2e` where relevant), and UI screenshots for visible frontend changes.
- Call out database/script impacts explicitly when `Database/` files are changed.
- Always ask for permission before commit.
- For Azure DevOps CLI, use `az` when available. If it is not on PATH, try `C:\Program Files\Microsoft SDKs\Azure\CLI2\wbin\az.cmd`. Install/use the `azure-devops` extension for `az boards` and `az repos`.
- When creating Azure DevOps PRs, use the current release target branch, such as `v0.65/master`, unless instructed otherwise.
- Use the commit comments as the PR description; for multiple commits, list each commit comment on its own line.
- Link the work item from the ticket number in the commit/branch (for example, `#1317` links work item `1317`).
- Complete PRs with squash merge, delete source branch enabled, and transition linked work items enabled.
- Use the squash merge commit message format: PR title, blank line, PR description, blank line, `Related work items: #<ticket>`.
- Always run all unit test before commit.

## Other Notes
- The project uses Database first approach, so entities are generated using the `EFSingularise.exe` utility. Do not edit generated entity files manually unless explicitly requested; instead update the database/schema and regenerate entities.
- For any Database update, add the script to `Database/Upgrade/01_Upgrade.sql` in relevant section.
- Comply with StyleCop.Analyzers styling rules.
- Do not run Angular builds unless explicitly requested. Backend `dotnet build` and backend tests are allowed.

## SQL Script Execution Guidelines
- DB can be connected using connection string provided in `Dr.Atluz.Service/appsettings.Development.json`.
- Always ask for permission before updating DB directly.
- Can execute SELECT query when asked for.
