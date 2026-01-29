export const assignRoles = (players) => {
  // players = array of GuildMember objects

  if (players.length < 3) {
    throw new Error("Not enough players to start the game");
  }

  // Shuffle players
  const shuffled = [...players].sort(() => Math.random() - 0.5);

  const roles = new Map();

  roles.set(shuffled[0].id, "Mafia");
  roles.set(shuffled[1].id, "Doctor");

  for (let i = 2; i < shuffled.length; i++) {
    roles.set(shuffled[i].id, "Civilian");
  }

  return roles;
};