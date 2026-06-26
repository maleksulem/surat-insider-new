import { initializeApp, getApps } from "firebase-admin/app";
import { getFirestore, Firestore } from "firebase-admin/firestore";
import { readFileSync } from "fs";
import { join } from "path";

let db: Firestore;

export function getFirebaseDb() {
  if (!db) {
    // Check if firebase-applet-config.json exists to get the project ID
    let projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
    let databaseId: string | undefined;
    
    try {
      const configPath = join(process.cwd(), "firebase-applet-config.json");
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      projectId = config.projectId;
      databaseId = config.firestoreDatabaseId;
    } catch (e) {
      console.warn("Could not read firebase-applet-config.json, falling back to environment variables.");
    }

    if (!getApps().length) {
      initializeApp({
        projectId: projectId,
      });
    }
    db = getFirestore(databaseId);
  }
  return db;
}
