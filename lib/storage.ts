// Simple in-memory storage for hackathon
// In production, use a database

interface MeetingSession {
  id: string
  employeeName: string
  employeeInfo: string
  videoUrl: string
  status: 'pending' | 'ready' | 'failed'
  createdAt: Date
}

class Storage {
  private sessions: Map<string, MeetingSession> = new Map()

  createSession(data: Omit<MeetingSession, 'createdAt'>): MeetingSession {
    const session: MeetingSession = {
      ...data,
      createdAt: new Date(),
    }
    this.sessions.set(data.id, session)
    console.log(`📝 Storage: Created session ${data.id}. Total sessions: ${this.sessions.size}`)
    return session
  }

  getSession(id: string): MeetingSession | undefined {
    const session = this.sessions.get(id)
    console.log(`🔎 Storage: Get session ${id}. Found: ${!!session}. Total sessions: ${this.sessions.size}`)
    return session
  }

  updateSession(id: string, data: Partial<MeetingSession>): MeetingSession | undefined {
    const session = this.sessions.get(id)
    if (!session) return undefined
    
    const updated = { ...session, ...data }
    this.sessions.set(id, updated)
    return updated
  }

  getAllSessions(): MeetingSession[] {
    return Array.from(this.sessions.values())
  }
}

// Use global to persist across hot reloads in development
declare global {
  var __storage: Storage | undefined
}

// Singleton instance that survives hot reloads
export const storage = global.__storage ?? new Storage()

if (process.env.NODE_ENV !== 'production') {
  global.__storage = storage
}

export type { MeetingSession }
