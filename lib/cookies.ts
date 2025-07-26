export interface WaitlistUser {
  fullName: string
  email: string
  joinedAt: string
}

export function setWaitlistCookie(user: WaitlistUser) {
  const cookieValue = JSON.stringify(user)
  const expires = new Date()
  expires.setMonth(expires.getMonth() + 6) 
  
  document.cookie = `waitlist_user=${encodeURIComponent(cookieValue)}; expires=${expires.toUTCString()}; path=/; SameSite=Strict`
}

export function getWaitlistCookie(): WaitlistUser | null {
  if (typeof document === 'undefined') return null
  
  const cookies = document.cookie.split(';')
  const waitlistCookie = cookies.find(cookie => cookie.trim().startsWith('waitlist_user='))
  
  if (!waitlistCookie) return null
  
  try {
    const cookieValue = decodeURIComponent(waitlistCookie.split('=')[1])
    return JSON.parse(cookieValue)
  } catch (error) {
    console.error('Error parsing waitlist cookie:', error)
    return null
  }
}

export function clearWaitlistCookie() {
  document.cookie = 'waitlist_user=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; SameSite=Strict'
}