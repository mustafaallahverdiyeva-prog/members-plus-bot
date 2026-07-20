export default {
  name: 'interactionCreate',
  async execute(interaction, client) {
    // Handle slash commands
    if (interaction.isChatInputCommand()) {
      const command = client.commands.get(interaction.commandName);

      if (!command) {
        console.warn(`No command matching ${interaction.commandName} was found.`);
        return;
      }

      try {
        console.log(`⚡ Executing command: ${interaction.commandName} by ${interaction.user.tag}`);
        await command.execute(interaction);
      } catch (error) {
        console.error(`❌ Error executing command ${interaction.commandName}:`, error);
        
        const errorMessage = {
          content: '❌ An error occurred while executing this command.',
          ephemeral: true,
        };

        if (interaction.replied || interaction.deferred) {
          await interaction.followUp(errorMessage);
        } else {
          await interaction.reply(errorMessage);
        }
      }
    }
  },
};
