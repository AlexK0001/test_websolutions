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

class InMemoryStore {
  private users: Map<string, InMemoryUser> = new Map();
  private idCounter = 1;

  async findUserByEmail(email: string): Promise<InMemoryUser | null> {
    for (const user of this.users.values()) {
      if (user.email === email) return user;
    }
    return null;
  }

  async findUserById(id: string): Promise<InMemoryUser | null> {
    return this.users.get(id) || null;
  }

  async createUser(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<InMemoryUser> {
    const hashedPassword = await bcrypt.hash(data.password, 12);
    const id = String(this.idCounter++);
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
    this.users.set(id, user);
    return user;
  }

  async updateUser(
    id: string,
    data: Partial<InMemoryUser>
  ): Promise<InMemoryUser | null> {
    const user = this.users.get(id);
    if (!user) return null;
    const updated = { ...user, ...data };
    this.users.set(id, updated);
    return updated;
  }

  async incrementEmailCount(id: string): Promise<void> {
    const user = this.users.get(id);
    if (!user) return;
    const today = new Date();
    const lastDate = user.lastEmailDate ? new Date(user.lastEmailDate) : null;
    const isNewDay =
      !lastDate || lastDate.toDateString() !== today.toDateString();

    this.users.set(id, {
      ...user,
      emailsGeneratedToday: isNewDay ? 1 : user.emailsGeneratedToday + 1,
      lastEmailDate: today,
    });
  }
}

export const inMemoryStore = new InMemoryStore();