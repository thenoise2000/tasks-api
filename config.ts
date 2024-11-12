import * as assert from "assert";
import * as dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  { key: "PORT", default: "xxxx" },
  { key: "HOST", default: "xxxxxxxx" },
  { key: "HOST_URL", default: "http://localhost:xxxxxx" },
  { key: "API_KEY", default: "xxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { key: "AUTH_DOMAIN", default: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { key: "PROJECT_ID", default: "xxxxxxxxxxxxxxx" },
  { key: "STORAGE_BUCKET", default: "xxxxxxxxxxxxxxxxxxxxxxxx" },
  { key: "MESSAGING_SENDER_ID", default: "xxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { key: "APP_ID", default: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { key: "CLIENT_EMAIL", default: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
  { key: "PRIVATE_KEY", default: "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx" },
];

const config: Record<string, string> = {};

requiredEnvVars.forEach(({ key, default: defaultValue }) => {
  config[key] = process.env[key] || defaultValue;
  assert.ok(config[key], `${key} is required`);
});

const firebaseConfig = {
  apiKey: config.API_KEY,
  authDomain: config.AUTH_DOMAIN,
  projectId: config.PROJECT_ID,
  storageBucket: config.STORAGE_BUCKET,
  messagingSenderId: config.MESSAGING_SENDER_ID,
  appId: config.APP_ID,
  clientEmail: config.CLIENT_EMAIL,
  privateKey: config.PRIVATE_KEY.replace(/\\n/g, "\n"),
};

export default {
  port: config.PORT,
  host: config.HOST,
  hostUrl: config.HOST_URL,
  firebaseConfig,
};