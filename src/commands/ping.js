import { SlashCommandBuilder } from 'discord.js';
import { createInfoEmbed } from '../utils/embeds.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Check bot latency and API response time'),
  
  async execute(interaction) {
    const embed = createInfoEmbed('Bot Latency', 'Calculating...');
    
    const sentMessage = await interaction.reply({
      embeds: [embed],
      fetchReply: true,
    });

    const latency = sentMessage.createdTimestamp - interaction.createdTimestamp;
    const apiLatency = Math.round(interaction.client.ws.ping);

    embed
      .setTitle('✅ Pong!')
      .setDescription('')
      .addFields(
        { name: 'Response Time', value: `${latency}ms`, inline: true },
        { name: 'API Latency', value: `${apiLatency}ms`, inline: true }
      );

    await interaction.editReply({ embeds: [embed] });
  },
};
