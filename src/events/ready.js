export default {
  name: 'ready',
  once: true,
  async execute(client) {
    console.log(`\n✅ Bot is ready! Logged in as ${client.user.tag}`);
    console.log(`📊 Serving ${client.guilds.cache.size} guild(s)`);
    console.log(`👥 Connected to ${client.users.cache.size} user(s)`);
    
    // Set bot status
    client.user.setActivity('members grow 📈', { type: 'WATCHING' });
    
    console.log('\n🚀 Members+ Bot is online and ready!\n');
  },
};
