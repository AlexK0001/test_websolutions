import bcrypt from "bcryptjs";

export interface InMemoryUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  plan: "free" | "premium";
  createdAt: Date;
  emailsGeneratedToday: number;
  lastEmailDate: Date | null;
}

interface GlobalStore {
  users: Map<string, InMemoryUser>;
  idCounter: number;
}

declare global {
  // eslint-disable-next-line no-var
  var __inMemoryStore: GlobalStore | undefined;
}

function getStore(): GlobalStore {
  if (!global.__inMemoryStore) {
    global.__inMemoryStore = {
      users: new Map(),
      idCounter: 1,
    };
  }
  return global.__inMemoryStore;
}

class InMemoryStore {
  debugUsers() {
    return Array.from(getStore().users.values()).map((u) => ({
      id: u._id,
      email: u.email,
      hashPrefix: u.password.slice(0, 20),
    }));
  }

  async findUserByEmail(email: string): Promise<InMemoryUser | null> {
    for (const user of getStore().users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findUserById(id: string): Promise<InMemoryUser | null> {
    return getStore().users.get(id) || null;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<InMemoryUser> {
    const store = getStore();
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const id = String(store.idCounter++);
    const user: InMemoryUser = {
      _id: id,
      name: data.name,
      email: data.email,
      password: hashedPassword,
      plan: "free",
      createdAt: new Date(),
      emailsGeneratedToday: 0,
      lastEmailDate: null,
    };
    store.users.set(id, user);
    return user;
  }

  async updateUser(
    id: string,
    data: Partial<InMemoryUser>
  ): Promise<InMemoryUser | null> {
    const store = getStore();
    const user = store.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...data };
    store.users.set(id, updated);
    return updated;
  }

  async incrementEmailCount(id: string): Promise<void> {
    const store = getStore();
    const user = store.users.get(id);
    if (!user) return;
    const today = new Date();
    const lastDate = user.lastEmailDate ? new Date(user.lastEmailDate) : null;
    const isNewDay =
      !lastDate || lastDate.toDateString() !== today.toDateString();
    store.users.set(id, {
      ...user,
      emailsGeneratedToday: isNewDay ? 1 : user.emailsGeneratedToday + 1,
      lastEmailDate: today,
    });
  }
}

export const inMemoryStore = new InMemoryStore();