import { getFirebaseDb, FieldValue } from "./firebase";
import { getDb, saveDb } from "./cmsDb";
import fs from "fs";
import path from "path";

export async function getLoginAttempt(email: string) {
  try {
    const db = getFirebaseDb();
    const doc = await db.collection("loginAttempts").doc(email.toLowerCase().trim()).get();
    return doc.exists ? (doc.data() as any) : null;
  } catch (error) {
    console.error("Error getting login attempt", error);
    return null;
  }
}

export async function updateLoginAttempt(email: string, data: any) {
  try {
    const db = getFirebaseDb();
    await db.collection("loginAttempts").doc(email.toLowerCase().trim()).set(data, { merge: true });
  } catch (error) {
    console.error("Error updating login attempt", error);
  }
}

export async function getAdminUser(email: string) {
  const trimmedEmail = email.toLowerCase().trim();
  try {
    const db = getFirebaseDb();
    const snapshot = await db.collection("admins").where("email", "==", trimmedEmail).get();
    if (snapshot.empty) {
      if (trimmedEmail === "itxghost111@gmail.com" || trimmedEmail === "admin@suratinsider.com") {
        console.log(`[CMS Firestore] Auto-seeding super admin: ${trimmedEmail}`);
        const adminDoc = {
          email: trimmedEmail,
          role: "Super Admin",
          name: trimmedEmail === "itxghost111@gmail.com" ? "ItxGhost" : "Surat Insider Admin",
          createdAt: new Date().toISOString()
        };
        await db.collection("admins").doc(trimmedEmail.replace(/[^a-zA-Z0-9]/g, "_")).set(adminDoc);
        return adminDoc;
      }
      return null;
    }
    return snapshot.docs[0].data() as any;
  } catch (error) {
    console.error("Error getting admin user", error);
    if (trimmedEmail === "itxghost111@gmail.com" || trimmedEmail === "admin@suratinsider.com") {
      return {
        email: trimmedEmail,
        role: "Super Admin",
        name: "Local Admin"
      };
    }
    return null;
  }
}

export async function getFirestoreExperiences() {
  const local = getDb();
  const baselineExperiences = [
    ...(local.destinations || []).map((d: any) => ({ ...d, inquiryType: "Destination" })),
    ...(local.shoppingGuides || []).map((s: any) => ({ ...s, inquiryType: "Shopping" })),
    ...(local.hotels || []).map((h: any) => ({ ...h, inquiryType: "Hotel" })),
    ...(local.tours || []).map((t: any) => ({ ...t, inquiryType: "Tour" })),
    ...(local.foodSpots || []).map((f: any) => ({ ...f, inquiryType: "Food Spot" })),
    ...(local.events || []).map((e: any) => ({ ...e, inquiryType: "Event" })),
    ...(local.blogs || []).map((b: any) => ({ ...b, inquiryType: "Blog" }))
  ];

  try {
    const db = getFirebaseDb();
    const snapshot = await db.collection("experiences").get();
    if (snapshot.empty) {
      console.log("[CMS Live Firestore] No custom experiences found in Firestore. Serving baseline.");
      return baselineExperiences;
    }

    console.log(`[CMS Live Firestore] Loaded ${snapshot.size} experiences from Firestore.`);
    const firestoreItems = snapshot.docs.map(doc => doc.data());
    
    // Map of baseline items for quick access and overlaying
    const mergedMap = new Map<string, any>();
    for (const item of baselineExperiences) {
      mergedMap.set(item.id, item);
    }
    
    // Overlay Firestore edits on top of the baseline, or add new items
    for (const item of firestoreItems) {
      const existing = mergedMap.get(item.id) || {};
      mergedMap.set(item.id, { ...existing, ...item });
    }
    
    return Array.from(mergedMap.values());
  } catch (error) {
    console.warn("[CMS Live Firestore Error] Failed to get experiences, falling back to local database:", error);
    return baselineExperiences;
  }
}

export async function getFirestoreInquiries() {
  try {
    const db = getFirebaseDb();
    const snapshot = await db.collection("inquiries").orderBy("timestamp", "desc").get();
    console.log("[CMS Live Firestore] Loaded inquiries successfully.");
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.log("[CMS Local Replica] Serving inquiries from local database.");
    const local = getDb();
    return local.inquiries || [];
  }
}

export async function addFirestoreInquiry(inquiry: any) {
  try {
    const db = getFirebaseDb();
    await db.collection("inquiries").doc(inquiry.id).set({
      ...inquiry,
      timestamp: FieldValue.serverTimestamp()
    });
    console.log("[CMS Live Firestore] Inquiry saved successfully.");
  } catch (error) {
    console.log("[CMS Local Replica] Saving inquiry to local database.");
    const local = getDb();
    const inquiries = local.inquiries || [];
    // Prevent duplicate entries
    if (!inquiries.some((i: any) => i.id === inquiry.id)) {
      inquiries.unshift({
        ...inquiry,
        timestamp: new Date().toISOString()
      });
      saveDb({ ...local, inquiries });
    }
  }
}

export async function updateFirestoreExperience(id: string, data: any) {
  try {
    const db = getFirebaseDb();
    await db.collection("experiences").doc(id).set(data, { merge: true });
    console.log("[CMS Live Firestore] Experience updated successfully in Firestore.");
  } catch (error) {
    console.error("[CMS Live Firestore Error] Failed to update experience in Firestore:", error);
  }
  
  // Always write to the local database to keep local replica as a warm fallback
  try {
    const local = getDb();
    let updated = false;
    const collections = [
      "destinations",
      "shoppingGuides",
      "hotels",
      "tours",
      "foodSpots",
      "events",
      "blogs"
    ];

    for (const col of collections) {
      const arr = (local as any)[col] || [];
      const idx = arr.findIndex((item: any) => item.id === id);
      if (idx !== -1) {
        arr[idx] = { ...arr[idx], ...data };
        (local as any)[col] = arr;
        updated = true;
        break;
      }
    }

    if (updated) {
      saveDb(local);
      console.log("[CMS Local Replica] Experience updated successfully locally.");
    }
  } catch (localErr) {
    console.error("[CMS Local Replica Error] Failed to update experience locally:", localErr);
  }
}

export async function getFirestoreConfig(docId: string) {
  const local = getDb();
  const baselineConfig = (local as any)[docId] || {};

  try {
    const db = getFirebaseDb();
    const doc = await db.collection("config").doc(docId).get();
    if (!doc.exists) {
      console.log(`[CMS Live Firestore] Config ${docId} does not exist. Serving local baseline.`);
      return baselineConfig;
    }
    console.log(`[CMS Live Firestore] Loaded config ${docId} successfully.`);
    return { ...baselineConfig, ...(doc.data() as any) };
  } catch (error) {
    console.warn(`[CMS Live Firestore Error] Config ${docId} load failed, serving local baseline:`, error);
    return baselineConfig;
  }
}

export async function addFirestoreAuditLog(log: any) {
  try {
    const db = getFirebaseDb();
    await db.collection("auditLogs").doc(log.id).set(log);
    console.log("[CMS Live Firestore] Audit log saved successfully.");
  } catch (error) {
    console.log("[CMS Local Replica] Saving audit log to local database.");
    const local = getDb();
    const auditLogs = local.auditLogs || [];
    if (!auditLogs.some((l: any) => l.id === log.id)) {
      auditLogs.unshift(log);
      saveDb({ ...local, auditLogs });
    }
  }
}

export async function getFirestoreAuditLogs() {
  try {
    const db = getFirebaseDb();
    const snapshot = await db.collection("auditLogs").orderBy("timestamp", "desc").get();
    console.log("[CMS Live Firestore] Loaded audit logs successfully.");
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.log("[CMS Local Replica] Serving audit logs from local database.");
    const local = getDb();
    return local.auditLogs || [];
  }
}

export async function getFirestorePartners() {
  try {
    const db = getFirebaseDb();
    const snapshot = await db.collection("partners").get();
    console.log("[CMS Live Firestore] Loaded partners successfully.");
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.log("[CMS Local Replica] Serving partners from local database.");
    const local = getDb();
    return local.partners || [];
  }
}

export async function updateFirestorePartner(id: string, status: any) {
  try {
    const db = getFirebaseDb();
    await db.collection("partners").doc(id).update({ status });
    console.log("[CMS Live Firestore] Partner updated successfully.");
  } catch (error) {
    console.log("[CMS Local Replica] Updating partner in local database.");
    const local = getDb();
    const partners = local.partners || [];
    const idx = partners.findIndex((p: any) => p.id === id);
    if (idx !== -1) {
      partners[idx] = { ...partners[idx], status };
      saveDb({ ...local, partners });
    }
  }
}

export async function saveFirestoreMediaItem(id: string, data: any) {
  try {
    const db = getFirebaseDb();
    await db.collection("media").doc(id).set(data);
    console.log(`[CMS Live Firestore] Media item ${id} saved successfully in Firestore.`);
  } catch (error) {
    console.error("[CMS Live Firestore Error] Failed to save media item in Firestore:", error);
  }
}

export async function deleteFirestoreMediaItem(id: string) {
  try {
    const db = getFirebaseDb();
    await db.collection("media").doc(id).delete();
    console.log(`[CMS Live Firestore] Media item ${id} deleted from Firestore.`);
  } catch (error) {
    console.error("[CMS Live Firestore Error] Failed to delete media item in Firestore:", error);
  }
}

export async function syncAndReconstructMedia() {
  try {
    const db = getFirebaseDb();
    const snapshot = await db.collection("media").get();
    if (snapshot.empty) {
      console.log("[CMS Live Firestore] No media found in Firestore.");
      return getDb().media || [];
    }

    const firestoreMedia = snapshot.docs.map(doc => doc.data() as any);
    
    // Stably sort media descending by dateUploaded or ID to keep latest on top
    firestoreMedia.sort((a, b) => {
      const dateA = a.dateUploaded || "";
      const dateB = b.dateUploaded || "";
      return dateB.localeCompare(dateA);
    });

    const localDb = getDb();
    
    // Sync local DB cache
    localDb.media = firestoreMedia;
    saveDb(localDb);

    const publicDir = path.join(process.cwd(), "public");
    const assetsDir = path.join(publicDir, "assets");
    const uploadsDir = path.join(assetsDir, "uploads");

    if (!fs.existsSync(publicDir)) {
      try { fs.mkdirSync(publicDir); } catch (e) {}
    }
    if (!fs.existsSync(assetsDir)) {
      try { fs.mkdirSync(assetsDir); } catch (e) {}
    }
    if (!fs.existsSync(uploadsDir)) {
      try { fs.mkdirSync(uploadsDir); } catch (e) {}
    }

    firestoreMedia.forEach((item: any) => {
      if (item.url && item.base64) {
        const relativePath = item.url.startsWith("/") ? item.url.substring(1) : item.url;
        const targetPath = path.join(publicDir, relativePath);

        if (!fs.existsSync(targetPath)) {
          try {
            console.log(`[CMS Reconstruct] Reconstructing missing physical file: ${targetPath}`);
            const base64Payload = item.base64.replace(/^data:image\/\w+;base64,/, "");
            const buffer = Buffer.from(base64Payload, "base64");
            
            const dir = path.dirname(targetPath);
            if (!fs.existsSync(dir)) {
              fs.mkdirSync(dir, { recursive: true });
            }
            
            fs.writeFileSync(targetPath, buffer);
          } catch (error) {
            console.error(`[CMS Reconstruct Error] Failed to write reconstructed file for ${item.url}:`, error);
          }
        }
      }
    });

    return firestoreMedia;
  } catch (error) {
    console.error("[CMS Live Firestore Error] Failed to sync and reconstruct media:", error);
    return getDb().media || [];
  }
}
