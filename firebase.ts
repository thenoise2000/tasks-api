import * as admin from "firebase-admin";
import config from "./config";

const initializeApp = () => {
  const { projectId, clientEmail, privateKey } = config.firebaseConfig;

  admin.initializeApp({
    credential: admin.credential.cert({ projectId, clientEmail, privateKey }),
    databaseURL: `https://${projectId}.firebaseio.com`,
  });
};

initializeApp();
const db = admin.firestore();
export default db;
export { admin };
