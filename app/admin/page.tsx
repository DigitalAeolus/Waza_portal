'use client'

import React, { Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { 
  Download, 
  Users, 
  Building, 
  Search,
  Filter,
  BarChart3,
  TrendingUp,
  Eye,
  Trash2
} from 'lucide-react'
import { SimpleThemeToggle } from '@/components/theme-toggle'

interface WaitlistSubmission {
  id: string
  fullName: string
  email: string
  company: string
  jobTitle: string
  industry: string
  companySizeRange: string
  designExperience: string
  interestedFeatures: string[]
  whyTryWaza?: string
  newsletter: boolean
  earlyAccess: boolean
  submittedAt: string
}

function AdminDashboardContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isAuthenticated, setIsAuthenticated] = React.useState(false)
  const [isAuthLoading, setIsAuthLoading] = React.useState(true)
  const [submissions, setSubmissions] = React.useState<WaitlistSubmission[]>([])
  const [filteredSubmissions, setFilteredSubmissions] = React.useState<WaitlistSubmission[]>([])
  const [searchTerm, setSearchTerm] = React.useState('')
  const [industryFilter, setIndustryFilter] = React.useState('all')
  const [experienceFilter, setExperienceFilter] = React.useState('all')
  const [selectedSubmission, setSelectedSubmission] = React.useState<WaitlistSubmission | null>(null)
  const [isLoading, setIsLoading] = React.useState(true)

  // Check authentication on mount
  React.useEffect(() => {
    const token = searchParams.get('token')
    
    if (!token) {
      setIsAuthenticated(false)
      setIsAuthLoading(false)
      return
    }

    // Store token in sessionStorage for subsequent requests
    sessionStorage.setItem('adminToken', token)
    setIsAuthenticated(true)
    setIsAuthLoading(false)
  }, [searchParams])

  React.useEffect(() => {
    if (!isAuthenticated) return

    // Load submissions from API
    const loadSubmissions = async () => {
      try {
        const token = sessionStorage.getItem('adminToken')
        if (!token) {
          setIsAuthenticated(false)
          return
        }

        const response = await fetch(`/api/admin/submissions?token=${token}`)
        
        if (!response.ok) {
          if (response.status === 401) {
            setIsAuthenticated(false)
            sessionStorage.removeItem('adminToken')
            return
          }
          throw new Error(`HTTP error! status: ${response.status}`)
        }

        const data = await response.json()
        
        if (data.fallback) {
          // Fallback to localStorage if database is not available
          const stored = localStorage.getItem('waitlistSubmissions')
          if (stored) {
            const localData = JSON.parse(stored)
            setSubmissions(localData)
            setFilteredSubmissions(localData)
          }
        } else {
          setSubmissions(data.submissions)
          setFilteredSubmissions(data.submissions)
        }
      } catch (error) {
        console.error('Error loading submissions:', error)
        // Fallback to localStorage
        const stored = localStorage.getItem('waitlistSubmissions')
        if (stored) {
          const localData = JSON.parse(stored)
          setSubmissions(localData)
          setFilteredSubmissions(localData)
        }
      } finally {
        setIsLoading(false)
      }
    }

    loadSubmissions()
  }, [isAuthenticated])

  React.useEffect(() => {
    // 过滤数据
    const filtered = submissions.filter(sub => {
      const matchesSearch = 
        sub.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sub.company.toLowerCase().includes(searchTerm.toLowerCase())
      
      const matchesIndustry = industryFilter === 'all' || sub.industry === industryFilter
      const matchesExperience = experienceFilter === 'all' || sub.designExperience === experienceFilter
      
      return matchesSearch && matchesIndustry && matchesExperience
    })

    setFilteredSubmissions(filtered)
  }, [submissions, searchTerm, industryFilter, experienceFilter])

  const handleExportCSV = () => {
    if (filteredSubmissions.length === 0) return

    const headers = [
      'Name', 'Email', 'Company', 'Job Title', 'Industry', 'Company Size', 
      'Experience', 'Interested Features', 'Why Try Waza', 'Newsletter', 
      'Early Access', 'Submitted At'
    ]
    
    const csvData = filteredSubmissions.map(sub => [
      sub.fullName,
      sub.email,
      sub.company,
      sub.jobTitle,
      sub.industry,
      sub.companySizeRange,
      sub.designExperience,
      sub.interestedFeatures.join('; '),
      sub.whyTryWaza || '',
      sub.newsletter ? 'Yes' : 'No',
      sub.earlyAccess ? 'Yes' : 'No',
      new Date(sub.submittedAt).toLocaleDateString()
    ])

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `waza-waitlist-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
  }

  const handleDeleteSubmission = async (id: string) => {
    if (confirm('Are you sure you want to delete this submission?')) {
      try {
        const token = sessionStorage.getItem('adminToken')
        if (!token) {
          alert('Authentication required')
          return
        }
        
        const response = await fetch(`/api/admin/submissions?token=${token}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id }),
        })
        
        if (response.ok) {
          // Remove from local state
          const updated = submissions.filter(sub => sub.id !== id)
          setSubmissions(updated)
          
          // Show success message
          console.log('Submission deleted successfully')
        } else {
          const errorData = await response.json()
          console.error('Failed to delete submission:', errorData.error)
          alert(`Failed to delete submission: ${errorData.error}`)
          return
        }
      } catch (error) {
        console.error('Delete error:', error)
        alert('Failed to delete submission. Please try again.')
        return
      }
    }
  }

  const getStats = () => {
    const total = submissions.length
    const industries = new Set(submissions.map(s => s.industry)).size
    const companies = new Set(submissions.map(s => s.company)).size
    const recentSubmissions = submissions.filter(s => {
      const submittedDate = new Date(s.submittedAt)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return submittedDate >= weekAgo
    }).length

    return { total, industries, companies, recentSubmissions }
  }

  const stats = getStats()

  // Show authentication loading
  if (isAuthLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Verifying access...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Show 404 for unauthorized access
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">404</h1>
                <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">Page not found</p>
                <button
                  onClick={() => router.push('/')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Go Home
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 dark:text-gray-300">Loading dashboard...</p>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8 flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Waza Waitlist Dashboard</h1>
              <p className="text-gray-600 dark:text-gray-300">Manage and view waitlist submissions</p>
            </div>
            <div className="flex items-center space-x-4">
              <SimpleThemeToggle />
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-full">
                    <Users className="w-8 h-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Total Submissions</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-green-50 dark:bg-green-900/20 rounded-full">
                    <Building className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.companies}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Companies</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-full">
                    <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.industries}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Industries</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow duration-300">
              <CardContent className="p-6">
                <div className="flex items-center">
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-full">
                    <TrendingUp className="w-8 h-8 text-orange-600 dark:text-orange-400" />
                  </div>
                  <div className="ml-4">
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.recentSubmissions}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">This Week</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters and Search */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Filters & Search
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="search">Search</Label>
                  <div className="relative mt-1">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400 dark:text-gray-500" />
                    <Input
                      id="search"
                      placeholder="Search name, email, company..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="industry">Industry</Label>
                  <Select value={industryFilter} onValueChange={setIndustryFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All industries" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Industries</SelectItem>
                      <SelectItem value="consumer-electronics">Consumer Electronics</SelectItem>
                      <SelectItem value="automotive">Automotive</SelectItem>
                      <SelectItem value="industrial">Industrial</SelectItem>
                      <SelectItem value="aerospace">Aerospace</SelectItem>
                      <SelectItem value="medical">Medical Devices</SelectItem>
                      <SelectItem value="telecommunications">Telecommunications</SelectItem>
                      <SelectItem value="energy">Energy & Power</SelectItem>
                      <SelectItem value="defense">Defense & Military</SelectItem>
                      <SelectItem value="iot">IoT & Smart Devices</SelectItem>
                      <SelectItem value="education">Education & Research</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="experience">Experience</Label>
                  <Select value={experienceFilter} onValueChange={setExperienceFilter}>
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="All experience levels" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Experience Levels</SelectItem>
                      <SelectItem value="0-1">0-1 years</SelectItem>
                      <SelectItem value="2-3">2-3 years</SelectItem>
                      <SelectItem value="4-6">4-6 years</SelectItem>
                      <SelectItem value="7-10">7-10 years</SelectItem>
                      <SelectItem value="10+">10+ years</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-end">
                  <Button onClick={handleExportCSV} variant="outline" className="w-full">
                    <Download className="w-4 h-4 mr-2" />
                    Export CSV
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Submissions Table */}
          <Card>
            <CardHeader>
              <CardTitle>Waitlist Submissions ({filteredSubmissions.length})</CardTitle>
            </CardHeader>
            <CardContent>
              {filteredSubmissions.length === 0 ? (
                <div className="text-center py-8">
                  <Users className="w-12 h-12 text-gray-400 dark:text-gray-500 mx-auto mb-4" />
                  <p className="text-gray-500 dark:text-gray-400">No submissions found</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Name</th>
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Email</th>
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Company</th>
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Job Title</th>
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Industry</th>
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Experience</th>
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Submitted</th>
                        <th className="text-left p-3 text-gray-900 dark:text-white font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubmissions.map((submission) => (
                        <tr key={submission.id} className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800">
                          <td className="p-3 font-medium text-gray-900 dark:text-white">{submission.fullName}</td>
                          <td className="p-3">
                            <a href={`mailto:${submission.email}`} className="text-blue-600 hover:underline">
                              {submission.email}
                            </a>
                          </td>
                          <td className="p-3 text-gray-900 dark:text-gray-300">{submission.company}</td>
                          <td className="p-3">
                            <Badge variant="secondary">{submission.jobTitle}</Badge>
                          </td>
                          <td className="p-3 text-gray-900 dark:text-gray-300">{submission.industry}</td>
                          <td className="p-3 text-gray-900 dark:text-gray-300">{submission.designExperience}</td>
                          <td className="p-3 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(submission.submittedAt).toLocaleDateString()}
                          </td>
                          <td className="p-3">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setSelectedSubmission(submission)}
                                className="hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => handleDeleteSubmission(submission.id)}
                                className="hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Modal */}
      {selectedSubmission && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>Submission Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="font-semibold">Full Name</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.fullName}</p>
                </div>
                <div>
                  <Label className="font-semibold">Email</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.email}</p>
                </div>
                <div>
                  <Label className="font-semibold">Company</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.company}</p>
                </div>
                <div>
                  <Label className="font-semibold">Job Title</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.jobTitle}</p>
                </div>
                <div>
                  <Label className="font-semibold">Industry</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.industry}</p>
                </div>
                <div>
                  <Label className="font-semibold">Company Size</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.companySizeRange}</p>
                </div>
                <div>
                  <Label className="font-semibold">Experience</Label>
                  <p className="text-gray-700 dark:text-gray-300">{selectedSubmission.designExperience}</p>
                </div>
                <div>
                  <Label className="font-semibold">Submitted</Label>
                  <p className="text-gray-700 dark:text-gray-300">
                    {new Date(selectedSubmission.submittedAt).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div>
                <Label className="font-semibold">Interested Features</Label>
                <div className="flex flex-wrap gap-2 mt-1">
                  {selectedSubmission.interestedFeatures.map((feature, index) => (
                    <Badge key={index} variant="secondary">{feature}</Badge>
                  ))}
                </div>
              </div>

              {selectedSubmission.whyTryWaza && (
                <div>
                  <Label className="font-semibold">Why Try Waza</Label>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{selectedSubmission.whyTryWaza}</p>
                </div>
              )}

              <div className="flex space-x-4">
                <div className="flex items-center">
                  <Label className="font-semibold mr-2">Newsletter:</Label>
                  <Badge variant={selectedSubmission.newsletter ? "default" : "secondary"}>
                    {selectedSubmission.newsletter ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className="flex items-center">
                  <Label className="font-semibold mr-2">Early Access:</Label>
                  <Badge variant={selectedSubmission.earlyAccess ? "default" : "secondary"}>
                    {selectedSubmission.earlyAccess ? 'Yes' : 'No'}
                  </Badge>
                </div>
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setSelectedSubmission(null)}>
                  Close
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

    </div>
  )
}

export default function AdminDashboard() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-center h-64">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    }>
      <AdminDashboardContent />
    </Suspense>
  )
}