# Code Analysis Report(1)

## Minheekim – Code Smells & Technical Debt

(1) Code Smells & Technical Debt

## Issue 1: Hardcoded Role Definitions in mafiaRole.js

Problem: All role data (name, faction, description, win condition) is stored as hardcoded objects inside the command file.

Impact: Changing game rules requires modifying source code and redeploying the bot.
This also prevents reuse of role data across other features such as help commands or game logic validation.

Recommendation: Move role definitions into a dedicated configuration or data module such as:

/data/roles.js
Then import it wherever needed.

## Issue 2: Mixed Responsibilities in Command Files

!(Seen in mafiaRole.js and role.js)!

Problem:
Command files handle multiple responsibilities: game logic lookup, formatting output, UI response creation, business rules

Impact: Commands become difficult to test and modify. Any change in game rules risks breaking message formatting.

Recommendation
Split into layers:
service layer (game logic)
presentation layer (Discord reply formatting)

## Issue 3: Global Mutable Game State in gameState.js Usage

!(Observed in role.js)!

const role = playerRoles.get(interaction.user.id);

Problem: Game state is accessed directly from multiple modules without controlled access.

Impact: State corruption may occur when multiple commands modify or read the state simultaneously.
This makes debugging inconsistent game behavior difficult.

Recommendation: Encapsulate game state behind functions or a class:

getPlayerRole(userId)
setPlayerRole(userId, role)

### User Story

As a developer, I want game data and state logic separated from command handlers so that new features can be added without breaking existing gameplay.

# Code Analysis Report(2)

(2) Cyclomatic Complexity Assessment

1. rules.js

execute()
Branching: CC = 1

explanation: 
This function only builds an embed and replies to the interaction. It follows a single linear execution path and contains no decisions or loops. Therefore the risk of logic errors is minimal.

2. roleCommands.js (mycommands)

execute()
Branching: if (!role) → 1 , CC = 2

explanation:
The function checks whether the user has a role and responds accordingly. This is a simple guard condition and does not significantly increase complexity.

3. role.js

execute()

Branching: if (!role) → 1
ROLE_COMMANDS[role] || "Good luck!" → 1 (logical branch)
CC = 3

explanation:
This method includes a validation branch and a fallback behavior. It introduces slightly more complexity but remains easy to understand and maintain.

4. mafiaRoles.js

execute()

Branching: for (const role of Object.values(ROLES)) → 1, CC = 2

explanation:
The loop iterates over predefined roles to populate the embed. Although iterative, the behavior is deterministic and low risk.

5. join.js
execute()

Branching count:

Code	Count
if (joinOpen)	1
if (joinedPlayers.has(userId))	1
while (remaining > 0)	1
if (!joinOpen) break	1
try/catch	1
if (finalSize < 3)	1
else	1

CC = 1 + 7 = 8

generateJoinText()

Branching:
CC = 1

Complexity Interpretation
File:    rules.js    roleCommands.js    role.js    mafiaRoles.js    join.js
                	
Function: execute    execute            execute     execute         execute          
                
CC:       1           2                 3           2               8

Risk:     trivial     very low          low         very low        moderate

explanation:
The majority of the bot’s commands have very low cyclomatic complexity, indicating clear and maintainable logic.However, join.js has significantly higher complexity because it manages game state, countdown timing, player validation, and role assignment in a single method. This increases the likelihood of edge-case bugs such as race conditions, inconsistent state, or timing issues.

Refactoring Recommendation

The join command should be refactored into smaller functions:
player validation
countdown timer
UI update logic
game start logic
Separating these responsibilities would reduce complexity and improve maintainability.