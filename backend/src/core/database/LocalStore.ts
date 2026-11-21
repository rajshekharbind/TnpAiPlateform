import fs from 'fs';
import path from 'path';

/**
 * Local file-backed JSON database store.
 * Persists application state (jobs, applications, announcements, notes, members, analyses)
 * directly to data/db.json so that records persist across server restarts.
 */
export class LocalStore {
  private static data: Record<string, any[]> = {};
  private static initialized = false;

  private static getFilePath(): string {
    // Look for backend/data/db.json first
    const backendDataPath = path.resolve(__dirname, '../../../data/db.json');
    if (fs.existsSync(backendDataPath)) {
      return backendDataPath;
    }
    const cwdDataPath = path.resolve(process.cwd(), 'backend', 'data', 'db.json');
    if (fs.existsSync(path.dirname(cwdDataPath))) {
      return cwdDataPath;
    }
    return backendDataPath;
  }

  private static ensureInit(): void {
    if (this.initialized) return;

    try {
      const filePath = this.getFilePath();
      const dir = path.dirname(filePath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      if (fs.existsSync(filePath)) {
        const raw = fs.readFileSync(filePath, 'utf-8');
        this.data = JSON.parse(raw);
      } else {
        this.data = {};
        this.persist();
      }
    } catch (e) {
      console.warn('LocalStore: Could not read db.json, using in-memory store:', e);
      this.data = {};
    }

    this.initialized = true;
  }

  private static persist(): void {
    try {
      const filePath = this.getFilePath();
      const dir = path.dirname(filePath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(filePath, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (e) {
      console.warn('LocalStore: Could not persist to db.json:', e);
    }
  }

  static get<T = any>(collection: string, defaultVal: T[] = []): T[] {
    this.ensureInit();
    if (!this.data[collection]) {
      this.data[collection] = JSON.parse(JSON.stringify(defaultVal));
      this.persist();
    }
    return this.data[collection] as T[];
  }

  static set<T = any>(collection: string, items: T[]): void {
    this.ensureInit();
    this.data[collection] = items;
    this.persist();
  }

  static insert<T = any>(collection: string, item: T): T {
    this.ensureInit();
    if (!this.data[collection]) {
      this.data[collection] = [];
    }
    this.data[collection].unshift(item);
    this.persist();
    return item;
  }

  static update<T = any>(
    collection: string,
    idKey: string,
    idVal: any,
    updates: Partial<T>
  ): T | null {
    this.ensureInit();
    const items = this.data[collection] || [];
    const index = items.findIndex((it) => String(it[idKey]) === String(idVal));
    if (index === -1) return null;

    items[index] = { ...items[index], ...updates };
    this.persist();
    return items[index];
  }

  static delete(collection: string, idKey: string, idVal: any): boolean {
    this.ensureInit();
    const items = this.data[collection] || [];
    const index = items.findIndex((it) => String(it[idKey]) === String(idVal));
    if (index === -1) return false;

    items.splice(index, 1);
    this.persist();
    return true;
  }
}
