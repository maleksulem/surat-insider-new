import { getFirebaseDb } from "./firebase";
import { FieldValue } from "firebase-admin/firestore";
import { getDb, saveDb } from "./cmsDb";

export async function getFirestoreExperiences() {
  try {
    const db = getFirebaseDb();
    const snapshot = await db.collection("experiences").get();
    if (snapshot.empty) {
      throw new Error("No experiences found in Firestore");
    }
    console.log("[CMS Live Firestore] Loaded experiences successfully.");
    return snapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.log("[CMS Local Replica] Serving experiences from local database.");
    const local = getDb();
    const experiences = [
      ...(local.destinations || []).map((d: any) => ({ ...d, inquiryType: "Destination" })),
      ...(local.shoppingGuides || []).map((s: any) => ({ ...s, inquiryType: "Shopping" })),
      ...(local.hotels || []).map((h: any) => ({ ...h, inquiryType: "Hotel" })),
      ...(local.tours || []).map((t: any) => ({ ...t, inquiryType: "Tour" })),
      ...(local.foodSpots || []).map((f: any) => ({ ...f, inquiryType: "Food Spot" })),
      ...(local.events || []).map((e: any) => ({ ...e, inquiryType: "Event" })),
      ...(local.blogs || []).map((b: any) => ({ ...b, inquiryType: "Blog" }))
    ];
    return experiences;
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
    console.log("[CMS Live Firestore] Experience updated successfully.");
  } catch (error) {
    console.log("[CMS Local Replica] Updating experience in local database.");
    const local = getDb();
    
    // Find where the experience exists and update it
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
    }
  }
}

export async function getFirestoreConfig(docId: string) {
  try {
    const db = getFirebaseDb();
    const doc = await db.collection("config").doc(docId).get();
    if (!doc.exists) {
      throw new Error(`Config doc ${docId} does not exist in Firestore`);
    }
    console.log(`[CMS Live Firestore] Loaded config ${docId} successfully.`);
    return doc.data();
  } catch (error) {
    console.log(`[CMS Local Replica] Serving config ${docId} from local database.`);
    const local = getDb();
    return (local as any)[docId] || {};
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
