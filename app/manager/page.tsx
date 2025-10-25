'use client'

import { useState } from 'react'

export default function ManagerDashboard() {
  const [employeeName, setEmployeeName] = useState('')
  const [employeeInfo, setEmployeeInfo] = useState('')
  const [isGenerating, setIsGenerating] = useState(false)
  const [meetingLink, setMeetingLink] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setIsGenerating(true)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          employeeName,
          employeeInfo,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to generate meeting')
      }

      setMeetingLink(data.meetingLink)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate meeting')
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = () => {
    if (meetingLink) {
      navigator.clipboard.writeText(meetingLink)
      alert('Link copied to clipboard!')
    }
  }

  const handleReset = () => {
    setEmployeeName('')
    setEmployeeInfo('')
    setMeetingLink(null)
    setError(null)
  }

  return (
    <div 
      className="min-h-screen py-12 px-4 bg-cover bg-center bg-no-repeat relative"
      style={{
        backgroundImage: 'url(/images/dumb-ways-to-die.jpg)',
      }}
    >
      {/* Overlay for better readability */}
      <div className="absolute inset-0 bg-black bg-opacity-40"></div>
      
      <div className="max-w-2xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-bold text-white mb-4 drop-shadow-lg">
            🎵 Dumb Dump Songs
          </h1>
          <p className="text-xl text-gray-100 drop-shadow-md">
            Generate personalized termination songs
          </p>
        </div>

        {/* Form */}
        {!meetingLink ? (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <form onSubmit={handleGenerate} className="space-y-6">
              <div>
                <label htmlFor="employeeName" className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Name
                </label>
                <input
                  type="text"
                  id="employeeName"
                  value={employeeName}
                  onChange={(e) => setEmployeeName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition text-gray-900"
                />
              </div>

              <div>
                <label htmlFor="employeeInfo" className="block text-sm font-semibold text-gray-700 mb-2">
                  Employee Information
                </label>
                <textarea
                  id="employeeInfo"
                  value={employeeInfo}
                  onChange={(e) => setEmployeeInfo(e.target.value)}
                  placeholder="Sales rep, 3 years at company, missed quota for 2 consecutive quarters..."
                  required
                  rows={6}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none text-gray-900"
                />
                <p className="mt-2 text-sm text-gray-500">
                  Include job role, tenure, performance details, and any other context
                </p>
              </div>

              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isGenerating}
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-bold py-4 px-6 rounded-lg transition duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isGenerating ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Composing your personalized song... 🎵
                  </span>
                ) : (
                  '🎤 Generate Termination Song'
                )}
              </button>
            </form>
          </div>
        ) : (
          /* Success State */
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Song Generated Successfully!
              </h2>
              <p className="text-gray-600">
                Share this link with {employeeName}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm text-gray-600 mb-2">Meeting Link:</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={meetingLink}
                  readOnly
                  className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded text-sm text-gray-900"
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded transition"
                >
                  Copy
                </button>
              </div>
            </div>

            <button
              onClick={handleReset}
              className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-6 rounded-lg transition"
            >
              Generate Another Song
            </button>
          </div>
        )}

        {/* Info Box */}
        <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <h3 className="font-semibold text-blue-900 mb-2">ℹ️ How it works</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>1. Enter employee information</li>
            <li>2. AI generates a personalized termination song</li>
            <li>3. Share the meeting link with the employee</li>
            <li>4. Their reaction is recorded when they join</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
