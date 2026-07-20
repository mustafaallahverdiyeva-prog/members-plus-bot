import { Client, Collection, GatewayIntentBits } from 'discord.js';
import { config } from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Load environment variables
config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Validate environment variables
if (!process.env.DISCORD_TOKEN || !process.env.CLIENT_ID) {
  console.error('❌ Missing required environment variables!');
  console.error('Please set DISCORD_TOKEN and CLIENT_ID in your .env file');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// Collections for commands and events
client.commands = new Collection();
client.events = new Collection();

// Load commands
const commandsPath = join(__dirname, 'commands');
if (!fs.existsSync(commandsPath)) {
  fs.mkdirSync(commandsPath, { recursive: true });
}

const commandFiles = fs
  .readdirSync(commandsPath)
  .filter(file => file.endsWith('.js'));

console.log(`📦 Loading ${commandFiles.length} commands...`);

for (const file of commandFiles) {
  try {
    const command = await import(`./commands/${file}`);
    if (command.default.data && command.default.execute) {
      client.commands.set(command.default.data.name, command.default);
      console.log(`✅ Loaded command: ${command.default.data.name}`);
    }
  } catch (error) {
    console.error(`❌ Error loading command ${file}:`, error);
  }
}

// Load events
const eventsPath = join(__dirname, 'events');
if (!fs.existsSync(eventsPath)) {
  fs.mkdirSync(eventsPath, { recursive: true });
}

const eventFiles = fs
  .readdirSync(eventsPath)
  .filter(file => file.endsWith('.js'));

console.log(`📦 Loading ${eventFiles.length} events...`);

for (const file of eventFiles) {
  try {
    const event = await import(`./events/${file}`);
    if (event.default.name && event.default.execute) {
      if (event.default.once) {
        client.once(event.default.name, (...args) => 
          event.default.execute(...args, client)
        );
      } else {
        client.on(event.default.name, (...args) => 
          event.default.execute(...args, client)
        );
      }
      console.log(`✅ Loaded event: ${event.default.name}`);
    }
  } catch (error) {
    console.error(`❌ Error loading event ${file}:`, error);
  }
}

// Login to Discord
client.login(process.env.DISCORD_TOKEN);

// Global error handlers
process.on('unhandledRejection', error => {
  console.error('❌ Unhandled Promise Rejection:', error);
});

process.on('uncaughtException', error => {
  console.error('❌ Uncaught Exception:', error);
});

export default client;
