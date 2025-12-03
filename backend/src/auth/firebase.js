import admin from "firebase-admin";
import serviceAccount from "./cs409-final-project-recipe-ai-firebase-adminsdk-fbsvc-a5105e1fc5.json" with { type: "json" };

admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });

export default admin;
