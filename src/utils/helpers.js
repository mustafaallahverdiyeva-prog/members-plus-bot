/**
 * Format number with thousand separators
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export function formatNumber(num) {
  return num.toLocaleString();
}

/**
 * Format timestamp to readable date
 * @param {string|number} timestamp - ISO string or timestamp
 * @returns {string} Formatted date
 */
export function formatDate(timestamp) {
  return new Date(timestamp).toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

/**
 * Calculate time remaining between now and a future date
 * @param {string} futureDate - ISO string of future date
 * @returns {Object} Object with days, hours, minutes, seconds
 */
export function getTimeRemaining(futureDate) {
  const now = new Date();
  const future = new Date(futureDate);
  const diff = future - now;

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, expired: true };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / 1000 / 60) % 60),
    seconds: Math.floor((diff / 1000) % 60),
    expired: false,
  };
}

/**
 * Create progress bar
 * @param {number} current - Current value
 * @param {number} total - Total value
 * @param {number} length - Bar length
 * @returns {string} Progress bar string
 */
export function createProgressBar(current, total, length = 20) {
  const percentage = Math.min((current / total) * 100, 100);
  const filled = Math.round((percentage / 100) * length);
  const empty = length - filled;

  const bar = '█'.repeat(filled) + '░'.repeat(empty);
  const percent = percentage.toFixed(1);

  return `${bar} ${percent}%`;
}

/**
 * Truncate string to specified length
 * @param {string} str - String to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated string
 */
export function truncate(str, maxLength = 100) {
  return str.length > maxLength ? str.substring(0, maxLength - 3) + '...' : str;
}

/**
 * Validate Discord user ID format
 * @param {string} userId - User ID to validate
 * @returns {boolean} True if valid
 */
export function isValidUserId(userId) {
  return /^\d{17,19}$/.test(userId);
}

/**
 * Validate invite link format
 * @param {string} invite - Invite link to validate
 * @returns {boolean} True if valid
 */
export function isValidInvite(invite) {
  const patterns = [
    /^https?:\/\/discord\.gg\/[a-zA-Z0-9]+$/,
    /^https?:\/\/discord\.com\/invite\/[a-zA-Z0-9]+$/,
    /^[a-zA-Z0-9]+$/, // Just the code
  ];
  
  return patterns.some(pattern => pattern.test(invite));
}

/**
 * Generate random code
 * @param {number} length - Code length
 * @returns {string} Random code
 */
export function generateCode(length = 8) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Calculate cooldown remaining
 * @param {Object} cooldowns - Cooldowns collection
 * @param {string} commandName - Command name
 * @param {string} userId - User ID
 * @param {number} cooldownTime - Cooldown time in seconds
 * @returns {number} Remaining cooldown in seconds (0 if no cooldown)
 */
export function getCooldownRemaining(cooldowns, commandName, userId, cooldownTime) {
  if (!cooldowns.has(commandName)) {
    cooldowns.set(commandName, new Map());
  }

  const now = Date.now();
  const timestamps = cooldowns.get(commandName);
  const cooldownAmount = cooldownTime * 1000;

  if (timestamps.has(userId)) {
    const expirationTime = timestamps.get(userId) + cooldownAmount;

    if (now < expirationTime) {
      return Math.ceil((expirationTime - now) / 1000);
    }
  }

  timestamps.set(userId, now);
  setTimeout(() => timestamps.delete(userId), cooldownAmount);
  
  return 0;
}
