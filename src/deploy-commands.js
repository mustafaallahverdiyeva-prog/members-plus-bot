import { REST, Routes } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate environment variables
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  console.error('❌ Missing required environment variables!');
  console.error('Please set DISCORD_TOKEN and CLIENT_ID in your .env file');
  process.exit(1);
}

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;

const commands = [];
const commandsPath = join(__dirname, 'commands');

if (!fs.existsSync(commandsPath)) {
  console.log('⚠️ No commands directory found. Creating...');
  fs.mkdirSync(commandsPath, { recursive: true });
}

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

console.log(`📦 Reading ${commandFiles.length} command files...`);

for (const file of commandFiles) {
  try {
    const command = await import(`./commands/${file}`);
    if (command.default.data) {
      commands.push(command.default.data.toJSON());
      console.log(`✅ Added command: ${command.default.data.name}`);
    }
  } catch (error) {
    console.error(`❌ Error loading command ${file}:`, error);
  }
}

const rest = new REST().setToken(token);

(async () => {
  try {
    console.log(`\n🚀 Deploying ${commands.length} commands...`);

    if (guildId) {
      // Deploy to specific guild (faster for testing)
      await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
        body: commands,
      });
      console.log(
        `✅ Successfully deployed commands to guild: ${guildId}`
      );
    } else {
      // Deploy globally (takes up to 1 hour)
      await rest.put(Routes.applicationCommands(clientId), {
        body: commands,
      });
      console.log('✅ Successfully deployed commands globally');
    }
  } catch (error) {
    console.error('❌ Error deploying commands:', error);
    process.exit(1);
  }
})();
