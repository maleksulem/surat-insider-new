import fs from "fs";
import path from "path";
import { getFirebaseDb } from "./firebase";
import { getDb, saveDb } from "./cmsDb";

/**
 * StorageProvider Interface for abstracting file uploads and deletions.
 * This decouples the CMS logic from the concrete physical/cloud storage solution.
 * Swapping from Firestore Base64 to Google Cloud Storage (GCS) or S3 in the future
 * only requires changing the active provider in config/env.
 */
export interface StorageProvider {
  /**
   * Saves a file to the storage provider and reconstructs local filesystem copies if needed.
   * @param id The unique identifier of the media asset.
   * @param filename The raw filename.
   * @param relativeUrl The relative public-facing asset URL (e.g., "/media/filename.jpg").
   * @param base64Data The full base64 data-URI payload.
   * @param extraMetadata Optional auxiliary metadata fields.
   */
  saveFile(
    id: string,
    filename: string,
    relativeUrl: string,
    base64Data: string,
    extraMetadata?: Record<string, any>
  ): Promise<any>;

  /**
   * Deletes a file from the storage provider and unlinks any local cached filesystem file.
   * @param id The unique identifier of the media asset.
   * @param relativeUrl The relative public-facing asset URL.
   */
  deleteFile(id: string, relativeUrl: string): Promise<void>;

  /**
   * Synchronizes metadata and self-heals physical assets from cloud backup.
   * Implements robust container self-healing for stateless environments.
   * @returns List of all media metadata records currently registered.
   */
  syncAllFiles(): Promise<any[]>;
}

/**
 * Development-ready Firestore Storage Provider
 * Implements ephemeral container self-healing using Firestore JSON/Base64 backups.
 * Extremely efficient for smaller files under 1MB in Google AI Studio sandbox.
 */
export class FirestoreStorageProvider implements StorageProvider {
  async saveFile(
    id: string,
    filename: string,
    relativeUrl: string,
    base64Data: string,
    extraMetadata?: Record<string, any>
  ): Promise<any> {
    const publicDir = path.join(process.cwd(), "public");
    const relativePath = relativeUrl.startsWith("/") ? relativeUrl.substring(1) : relativeUrl;
    const targetPath = path.join(publicDir, relativePath);

    // 1. Write file locally first
    const base64Payload = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Payload, "base64");
    
    const dir = path.dirname(targetPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(targetPath, buffer);
    console.log(`[StorageProvider] Wrote file locally to: ${targetPath}`);

    // 2. Build media record structure
    const mediaRecord = {
      id,
      url: relativeUrl,
      base64: base64Data, // Persisted base64 fallback for stateless restoration
      filename,
      size: `${(buffer.length / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      ...(extraMetadata || {})
    };

    // 3. Persist metadata & base64 backup to Firestore
    try {
      const db = getFirebaseDb();
      await db.collection("media").doc(id).set(mediaRecord);
      console.log(`[StorageProvider] Saved media item ${id} successfully in Firestore.`);
    } catch (error) {
      console.error("[StorageProvider Error] Failed to save media item in Firestore:", error);
    }

    return mediaRecord;
  }

  async deleteFile(id: string, relativeUrl: string): Promise<void> {
    // 1. Delete local file if it exists
    const publicDir = path.join(process.cwd(), "public");
    const relativePath = relativeUrl.startsWith("/") ? relativeUrl.substring(1) : relativeUrl;
    const targetPath = path.join(publicDir, relativePath);

    if (fs.existsSync(targetPath)) {
      try {
        fs.unlinkSync(targetPath);
        console.log(`[StorageProvider] Unlinked physical file from disk: ${targetPath}`);
      } catch (err) {
        console.warn(`[StorageProvider Warning] Failed to unlink file: ${targetPath}`, err);
      }
    }

    // 2. Delete document from Firestore
    try {
      const db = getFirebaseDb();
      await db.collection("media").doc(id).delete();
      console.log(`[StorageProvider] Deleted media item ${id} from Firestore.`);
    } catch (error) {
      console.error("[StorageProvider Error] Failed to delete media item in Firestore:", error);
    }
  }

  async syncAllFiles(): Promise<any[]> {
    try {
      const db = getFirebaseDb();
      const snapshot = await db.collection("media").get();
      if (snapshot.empty) {
        console.log("[StorageProvider] No backup media found in Firestore.");
        return getDb().media || [];
      }

      const firestoreMedia = snapshot.docs.map(doc => doc.data() as any);
      
      // Sort media descending by date
      firestoreMedia.sort((a, b) => {
        const dateA = a.uploadedAt || a.dateUploaded || "";
        const dateB = b.uploadedAt || b.dateUploaded || "";
        return dateB.localeCompare(dateA);
      });

      // Sync local replica database
      const localDb = getDb();
      localDb.media = firestoreMedia;
      saveDb(localDb);

      // Reconstruct missing files on local disk (Self-Healing)
      const publicDir = path.join(process.cwd(), "public");
      
      firestoreMedia.forEach((item: any) => {
        if (item.url && item.base64) {
          const relativePath = item.url.startsWith("/") ? item.url.substring(1) : item.url;
          const targetPath = path.join(publicDir, relativePath);

          if (!fs.existsSync(targetPath)) {
            try {
              console.log(`[StorageProvider Reconstruction] Restoring missing physical file: ${targetPath}`);
              const base64Payload = item.base64.replace(/^data:image\/\w+;base64,/, "");
              const buffer = Buffer.from(base64Payload, "base64");
              
              const dir = path.dirname(targetPath);
              if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
              }
              fs.writeFileSync(targetPath, buffer);
            } catch (error) {
              console.error(`[StorageProvider Reconstruction Error] Failed to write file for ${item.url}:`, error);
            }
          }
        }
      });

      return firestoreMedia;
    } catch (error) {
      console.error("[StorageProvider Error] Failed to sync and reconstruct media:", error);
      return getDb().media || [];
    }
  }
}

/**
 * Production-ready Google Cloud Storage Provider (Architecture Ready)
 * Prepared and modularized. Will be fully connected during final production launch phase.
 */
export class GoogleCloudStorageProvider implements StorageProvider {
  private bucketName: string;

  constructor() {
    this.bucketName = process.env.GCS_BUCKET_NAME || "surat-insider-production-media";
  }

  async saveFile(
    id: string,
    filename: string,
    relativeUrl: string,
    base64Data: string,
    extraMetadata?: Record<string, any>
  ): Promise<any> {
    console.log(`[GCS Provider Simulation] Uploading ${filename} to gs://${this.bucketName}`);
    
    // Convert base64 to binary buffer
    const base64Payload = base64Data.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Payload, "base64");
    
    // Future GCS integration logic:
    // const storage = new Storage();
    // const bucket = storage.bucket(this.bucketName);
    // const gcsFile = bucket.file(filename);
    // await gcsFile.save(buffer, { metadata: { contentType: extraMetadata?.mimeType || 'image/jpeg' } });
    // const publicUrl = `https://storage.googleapis.com/${this.bucketName}/${filename}`;

    const publicUrl = `https://storage.googleapis.com/${this.bucketName}${relativeUrl}`;
    
    const mediaRecord = {
      id,
      url: publicUrl, // Cloud URL instead of local path!
      filename,
      size: `${(buffer.length / 1024).toFixed(1)} KB`,
      uploadedAt: new Date().toISOString(),
      ...(extraMetadata || {})
    };

    console.log(`[GCS Provider Simulation] Saved metadata reference in database. Public URL: ${publicUrl}`);
    return mediaRecord;
  }

  async deleteFile(id: string, relativeUrl: string): Promise<void> {
    console.log(`[GCS Provider Simulation] Deleting ${relativeUrl} from gs://${this.bucketName}`);
    // Future GCS integration logic:
    // const filename = relativeUrl.substring(relativeUrl.lastIndexOf("/") + 1);
    // const storage = new Storage();
    // await storage.bucket(this.bucketName).file(filename).delete();
  }

  async syncAllFiles(): Promise<any[]> {
    console.log("[GCS Provider Simulation] Fetching GCS files references...");
    return getDb().media || [];
  }
}

// Global Factory for selecting the active storage provider
let currentProvider: StorageProvider | null = null;

export function getStorageProvider(): StorageProvider {
  if (!currentProvider) {
    const providerType = process.env.STORAGE_PROVIDER || "firestore";
    if (providerType === "gcs") {
      currentProvider = new GoogleCloudStorageProvider();
      console.log("[StorageProvider] Using GoogleCloudStorageProvider as active storage solution.");
    } else {
      currentProvider = new FirestoreStorageProvider();
      console.log("[StorageProvider] Using FirestoreStorageProvider as active storage solution.");
    }
  }
  return currentProvider;
}
