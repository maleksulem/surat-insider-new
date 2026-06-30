import { initializeApp, getApps, getApp } from "firebase/app";
import { 
  getFirestore, 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy, 
  limit,
  writeBatch,
  serverTimestamp,
  Firestore
} from "firebase/firestore";
import { readFileSync } from "fs";
import { join } from "path";

export const FieldValue = {
  serverTimestamp: () => serverTimestamp()
};

class QueryWrapper {
  protected path: string;
  protected constraints: any[] = [];
  protected db: Firestore;

  constructor(db: Firestore, path: string) {
    this.db = db;
    this.path = path;
  }

  where(field: string, op: any, value: any) {
    this.constraints.push(where(field, op, value));
    return this;
  }

  orderBy(field: string, direction?: "asc" | "desc") {
    this.constraints.push(orderBy(field, direction || "asc"));
    return this;
  }

  limit(num: number) {
    this.constraints.push(limit(num));
    return this;
  }

  async get() {
    const colRef = collection(this.db, this.path);
    const q = this.constraints.length > 0 ? query(colRef, ...this.constraints) : colRef;
    const snap = await getDocs(q);
    
    return {
      empty: snap.empty,
      size: snap.size,
      docs: snap.docs.map(d => ({
        id: d.id,
        data: () => d.data(),
        exists: d.exists(),
        ref: {
          delete: async () => {
            await deleteDoc(d.ref);
          }
        }
      }))
    };
  }
}

class DocWrapper {
  private path: string;
  private docId: string;
  private db: Firestore;
  public rawDocRef: any;

  constructor(db: Firestore, path: string, docId: string) {
    this.db = db;
    this.path = path;
    this.docId = docId;
    this.rawDocRef = doc(db, path, docId);
  }

  async get() {
    const snap = await getDoc(this.rawDocRef);
    return {
      id: snap.id,
      exists: snap.exists(),
      data: () => snap.data(),
      ref: {
        delete: async () => {
          await deleteDoc(this.rawDocRef);
        }
      }
    };
  }

  async set(data: any, options?: { merge?: boolean }) {
    await setDoc(this.rawDocRef, data, { merge: !!options?.merge });
  }

  async update(data: any) {
    await updateDoc(this.rawDocRef, data);
  }

  async delete() {
    await deleteDoc(this.rawDocRef);
  }
}

class CollectionWrapper extends QueryWrapper {
  constructor(db: Firestore, path: string) {
    super(db, path);
  }

  doc(docId: string) {
    return new DocWrapper(this.db, this.path, docId);
  }

  async add(data: any) {
    const colRef = collection(this.db, this.path);
    const docRef = doc(colRef);
    await setDoc(docRef, data);
    return new DocWrapper(this.db, this.path, docRef.id);
  }
}

class BatchWrapper {
  private batch: any;

  constructor(db: Firestore) {
    this.batch = writeBatch(db);
  }

  set(docWrapper: DocWrapper, data: any, options?: { merge?: boolean }) {
    this.batch.set(docWrapper.rawDocRef, data, { merge: !!options?.merge });
    return this;
  }

  update(docWrapper: DocWrapper, data: any) {
    this.batch.update(docWrapper.rawDocRef, data);
    return this;
  }

  delete(docWrapper: DocWrapper) {
    this.batch.delete(docWrapper.rawDocRef);
    return this;
  }

  async commit() {
    await this.batch.commit();
  }
}

class FirestoreWrapper {
  private db: Firestore;

  constructor(db: Firestore) {
    this.db = db;
  }

  collection(path: string) {
    return new CollectionWrapper(this.db, path);
  }

  batch() {
    return new BatchWrapper(this.db);
  }
}

let dbWrapper: FirestoreWrapper;

export function getFirebaseDb() {
  if (!dbWrapper) {
    let projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.GCP_PROJECT;
    let apiKey = "";
    let databaseId: string | undefined;
    
    try {
      const configPath = join(process.cwd(), "firebase-applet-config.json");
      const config = JSON.parse(readFileSync(configPath, "utf-8"));
      projectId = config.projectId;
      apiKey = config.apiKey;
      databaseId = config.firestoreDatabaseId;
    } catch (e) {
      console.warn("Could not read firebase-applet-config.json, falling back to environment variables.");
    }

    const app = getApps().length ? getApp() : initializeApp({
      projectId: projectId,
      apiKey: apiKey,
    });
    
    const db = databaseId ? getFirestore(app, databaseId) : getFirestore(app);
    dbWrapper = new FirestoreWrapper(db);
  }
  return dbWrapper;
}
