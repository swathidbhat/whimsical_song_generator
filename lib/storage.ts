// Simple in-memory storage for hackathon
// In production, use a database

type SessionStatus =
  | 'pending'
  | 'generating_lyrics'
  | 'generating_music'
  | 'converting_voice'
  | 'generating_video'
  | 'ready'
  | 'failed'

interface MeetingSession {
  id: string
  employeeName: string
  employeeInfo: string

  // Processing status
  status: SessionStatus

  // Stage outputs
  lyrics?: string
  musicUrl?: string      // Stage 2 output
  singingUrl?: string    // Stage 3 output
  videoUrl?: string      // Stage 4 output (final)

  // Error tracking
  error?: string
  failedStage?: string

  // Timestamps
  createdAt: Date
  updatedAt?: Date
  completedAt?: Date
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

    const updated = { ...session, ...data, updatedAt: new Date() }
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

export type { MeetingSession, SessionStatus }
