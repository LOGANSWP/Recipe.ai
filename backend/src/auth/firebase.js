import admin from "firebase-admin";
import fs from "fs";

// Path to the service account key file
// 1. Render Secret File path (Production)
const renderSecretPath = "/etc/secrets/cs409-final-project-recipe-ai-firebase-adminsdk-fbsvc-a5105e1fc5.json";
// 2. Local file path (Development)
const localFilePath = "./cs409-final-project-recipe-ai-firebase-adminsdk-fbsvc-a5105e1fc5.json";

let serviceAccount;

try {
  if (fs.existsSync(renderSecretPath)) {
    console.log("Using Firebase credentials from Render Secret File.");
    // Read and parse the file manually
    const fileContent = fs.readFileSync(renderSecretPath, "utf8");
    serviceAccount = JSON.parse(fileContent);
  } else {
    // Fallback for local development
    // Note: This relies on the import assertion which is experimental in some Node versions,
    // but works with the current setup. Using fs.readFileSync is safer across environments.
    console.log("Using Firebase credentials from local file.");
    // We use a dynamic import here to avoid build errors if the file doesn't exist in production (though the if check handles logic)
    // However, since we are inside a try block, we can try to read it.
    // Ideally, for consistency, we use fs here too if possible, but the import works locally.
    
    // Let's stick to the import for local since it handles the relative path resolution nicely in ES modules
    // but wrapped in a way that doesn't break if missing.
    // Actually, fs.readFileSync with a relative path in ES modules depends on CWD.
    // Let's use the import method you had, but wrapped.
    const imported = await import("./cs409-final-project-recipe-ai-firebase-adminsdk-fbsvc-a5105e1fc5.json", { with: { type: "json" } });
    serviceAccount = imported.default;
  }
} catch (error) {
  console.error("Failed to load Firebase credentials:", error);
}

if (serviceAccount) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
} else {
  console.error("Firebase Admin NOT initialized. Missing credentials.");
}

export default admin;