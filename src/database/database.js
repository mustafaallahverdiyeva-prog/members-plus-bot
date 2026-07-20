import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dbPath = path.join(__dirname, '../../data/database.json');

// Ensure data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

// Initialize database with default structure
const defaultDatabase = {
  users: {},
  orders: {},
  giftCodes: {},
  transactions: [],
  metadata: {
    createdAt: new Date().toISOString(),
    lastUpdated: new Date().toISOString(),
  },
};

/**
 * Load database from JSON file
 * @returns {Object} Database object
 */
function loadDatabase() {
  try {
    if (fs.existsSync(dbPath)) {
      const data = fs.readFileSync(dbPath, 'utf8');
      return JSON.parse(data);
    }
    // Create new database if doesn't exist
    saveDatabase(defaultDatabase);
    return defaultDatabase;
  } catch (error) {
    console.error('❌ Error loading database:', error);
    return defaultDatabase;
  }
}

/**
 * Save database to JSON file
 * @param {Object} data - Database object to save
 */
function saveDatabase(data) {
  try {
    data.metadata.lastUpdated = new Date().toISOString();
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('❌ Error saving database:', error);
    throw error;
  }
}

/**
 * Get user data or create if not exists
 * @param {string} userId - Discord user ID
 * @returns {Object} User object
 */
function getUser(userId) {
  const db = loadDatabase();
  if (!db.users[userId]) {
    db.users[userId] = {
      userId,
      balance: 0,
      totalEarned: 0,
      joinedServers: [],
      lastUpdated: new Date().toISOString(),
      transactions: [],
    };
    saveDatabase(db);
  }
  return db.users[userId];
}

/**
 * Update user balance
 * @param {string} userId - Discord user ID
 * @param {number} amount - Amount to add (can be negative)
 * @param {string} reason - Reason for balance change
 * @returns {Object} Updated user object
 */
function updateUserBalance(userId, amount, reason = 'manual') {
  const db = loadDatabase();
  const user = getUser(userId);
  
  user.balance += amount;
  user.lastUpdated = new Date().toISOString();
  
  // Add transaction record
  const transaction = {
    transactionId: `${userId}-${Date.now()}`,
    userId,
    amount,
    newBalance: user.balance,
    reason,
    timestamp: new Date().toISOString(),
  };
  
  user.transactions.push(transaction);
  if (user.transactions.length > 100) {
    user.transactions = user.transactions.slice(-100); // Keep last 100
  }
  
  db.transactions.push(transaction);
  db.users[userId] = user;
  
  saveDatabase(db);
  return user;
}

/**
 * Create gift code
 * @param {number} amount - Coin amount for gift code
 * @param {number} expiresInDays - Days until expiration
 * @returns {Object} Created gift code
 */
function createGiftCode(amount, expiresInDays = 30) {
  const db = loadDatabase();
  
  const code = `GIFT-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const giftCode = {
    code,
    amount,
    usedBy: [],
    createdAt: new Date().toISOString(),
    expiresAt: new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000).toISOString(),
  };
  
  db.giftCodes[code] = giftCode;
  saveDatabase(db);
  
  return giftCode;
}

/**
 * Redeem gift code
 * @param {string} code - Gift code to redeem
 * @param {string} userId - User ID redeeming the code
 * @returns {Object} Result object
 */
function redeemGiftCode(code, userId) {
  const db = loadDatabase();
  
  if (!db.giftCodes[code]) {
    return { success: false, message: 'Gift code not found' };
  }
  
  const giftCode = db.giftCodes[code];
  const now = new Date();
  
  // Check expiration
  if (new Date(giftCode.expiresAt) < now) {
    return { success: false, message: 'Gift code has expired' };
  }
  
  // Check if already used by this user
  if (giftCode.usedBy.includes(userId)) {
    return { success: false, message: 'You already used this gift code' };
  }
  
  // Apply reward
  giftCode.usedBy.push(userId);
  updateUserBalance(userId, giftCode.amount, `giftcode:${code}`);
  
  db.giftCodes[code] = giftCode;
  saveDatabase(db);
  
  return { success: true, amount: giftCode.amount };
}

/**
 * Create order
 * @param {string} userId - User ID creating order
 * @param {string} serverName - Target server name
 * @param {number} targetMembers - Target member count
 * @param {string} inviteLink - Server invite link
 * @returns {Object} Created order
 */
function createOrder(userId, serverName, targetMembers, inviteLink) {
  const db = loadDatabase();
  
  const orderId = `ORDER-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
  const order = {
    orderId,
    userId,
    serverName,
    targetMembers,
    currentMembers: 0,
    inviteLink,
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  
  db.orders[orderId] = order;
  saveDatabase(db);
  
  return order;
}

/**
 * Get user orders
 * @param {string} userId - User ID
 * @returns {Array} User's orders
 */
function getUserOrders(userId) {
  const db = loadDatabase();
  return Object.values(db.orders).filter(order => order.userId === userId);
}

/**
 * Update order progress
 * @param {string} orderId - Order ID
 * @param {number} currentMembers - Current member count
 * @returns {Object} Updated order
 */
function updateOrderProgress(orderId, currentMembers) {
  const db = loadDatabase();
  
  if (!db.orders[orderId]) {
    throw new Error('Order not found');
  }
  
  const order = db.orders[orderId];
  order.currentMembers = currentMembers;
  order.updatedAt = new Date().toISOString();
  
  // Check if completed
  if (order.currentMembers >= order.targetMembers) {
    order.status = 'completed';
  }
  
  db.orders[orderId] = order;
  saveDatabase(db);
  
  return order;
}

/**
 * Get all active orders
 * @returns {Array} Active orders
 */
function getActiveOrders() {
  const db = loadDatabase();
  return Object.values(db.orders).filter(order => order.status === 'active');
}

export {
  loadDatabase,
  saveDatabase,
  getUser,
  updateUserBalance,
  createGiftCode,
  redeemGiftCode,
  createOrder,
  getUserOrders,
  updateOrderProgress,
  getActiveOrders,
};
