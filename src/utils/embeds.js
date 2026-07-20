import { EmbedBuilder } from 'discord.js';

/**
 * Create success embed
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @returns {EmbedBuilder} Discord embed
 */
export function createSuccessEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#00FF00')
    .setTitle(`✅ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Create error embed
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @returns {EmbedBuilder} Discord embed
 */
export function createErrorEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#FF0000')
    .setTitle(`❌ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Create info embed
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @returns {EmbedBuilder} Discord embed
 */
export function createInfoEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#0099FF')
    .setTitle(`ℹ️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Create warning embed
 * @param {string} title - Embed title
 * @param {string} description - Embed description
 * @returns {EmbedBuilder} Discord embed
 */
export function createWarningEmbed(title, description) {
  return new EmbedBuilder()
    .setColor('#FFFF00')
    .setTitle(`⚠️ ${title}`)
    .setDescription(description)
    .setTimestamp();
}

/**
 * Add fields to embed
 * @param {EmbedBuilder} embed - Embed to modify
 * @param {Array} fields - Array of {name, value, inline} objects
 * @returns {EmbedBuilder} Modified embed
 */
export function addFields(embed, fields) {
  fields.forEach(field => {
    embed.addFields({
      name: field.name || '​',
      value: field.value || '​',
      inline: field.inline !== undefined ? field.inline : false,
    });
  });
  return embed;
}

/**
 * Create balance embed
 * @param {Object} user - User object from database
 * @param {string} userId - Discord user ID
 * @returns {EmbedBuilder} Balance embed
 */
export function createBalanceEmbed(user, userId) {
  const embed = new EmbedBuilder()
    .setColor('#FFD700')
    .setTitle('💰 Balance Information')
    .setDescription(`User: <@${userId}>`)
    .addFields(
      { name: 'Current Balance', value: `💵 ${user.balance.toLocaleString()}`, inline: true },
      { name: 'Total Earned', value: `📈 ${user.totalEarned.toLocaleString()}`, inline: true },
      { name: '​', value: '​', inline: false }
    );

  if (user.transactions && user.transactions.length > 0) {
    const recentTransactions = user.transactions.slice(-5);
    const transactionList = recentTransactions
      .map(t => `• ${t.amount > 0 ? '+' : ''}${t.amount} (${t.reason})`)
      .join('\n');
    
    embed.addFields({
      name: 'Recent Transactions (Last 5)',
      value: transactionList || 'No transactions',
      inline: false,
    });
  }

  return embed.setTimestamp();
}

export default {
  createSuccessEmbed,
  createErrorEmbed,
  createInfoEmbed,
  createWarningEmbed,
  addFields,
  createBalanceEmbed,
};
