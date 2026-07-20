# Members+ Bot 🚀

Discord Members+ Bot - Economy & Server Growth Engine

## 📋 Yol Haritası

### ✅ Phase 1: Foundation & Database Architecture
- System setup, command registration, and database schemas

### 📌 Phase 2: Core Economy & Holding Engine
- /bal, /pay, /giftcode, and /check logic

### 📌 Phase 3: Campaign & Server Growth Engine
- /find, /buy, and /order workflows

### 📌 Phase 4: Engagement, Rewards & System Metrics
- /vote, /botinfo, /stats, and /invite modules

### 📌 Phase 5: Security, Anti-Exploit & Production Readiness
- Rate limits, early-leave penalties, and atomic DB checks

## 🛠️ Kurulum

```bash
# 1. Bağımlılıkları yükle
npm install

# 2. .env dosyası oluştur
cp .env.example .env

# 3. .env'de bilgilerini doldur
# - DISCORD_TOKEN
# - CLIENT_ID
# - GUILD_ID (test sunucusu)

# 4. Komutları deploy et
npm run deploy

# 5. Botu başlat
npm start
```

## 📁 Proje Yapısı

```
members-plus-bot/
├── src/
│   ├── index.js              # Ana bot dosyası
│   ├── deploy-commands.js    # Komut deployment
│   ├── commands/             # Slash komutları
│   ├── events/               # Discord events
│   ├── database/             # Database işlemleri
│   └── utils/                # Yardımcı fonksiyonlar
├── data/
│   └── database.json         # JSON veritabanı
├── .env.example              # Environment template
└── package.json
```

## 📊 Veritabanı Şemaları

### Users
```json
{
  "userId": "string",
  "balance": 0,
  "totalEarned": 0,
  "lastUpdated": "timestamp",
  "transactions": []
}
```

### Orders
```json
{
  "orderId": "string",
  "userId": "string",
  "serverName": "string",
  "targetMembers": 0,
  "currentMembers": 0,
  "inviteLink": "string",
  "status": "active|completed|cancelled",
  "createdAt": "timestamp"
}
```

### GiftCodes
```json
{
  "code": "string",
  "amount": 0,
  "usedBy": [],
  "createdAt": "timestamp",
  "expiresAt": "timestamp"
}
```

### Transactions
```json
{
  "transactionId": "string",
  "from": "string",
  "to": "string",
  "amount": 0,
  "type": "transfer|reward|penalty",
  "timestamp": "timestamp"
}
```

## 🔗 Links

- [Discord.js Documentation](https://discord.js.org/)
- [Discord Developer Portal](https://discord.com/developers)

## 📝 Lisans

MIT

---

**Phase 1 Started**: Foundation & Database Architecture
