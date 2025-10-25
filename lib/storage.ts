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
    return session
  }

  getSession(id: string): MeetingSession | undefined {
    return this.sessions.get(id)
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

// Singleton instance
export const storage = new Storage()
export type { MeetingSession }
