/**
 * Format a percentage number to a string with one decimal place
 */
export const formatPercent = (val) => {
  if (val === null || val === undefined) return '0%'
  return `${parseFloat(val).toFixed(1)}%`
}

/**
 * Get color class based on score value (0-100)
 */
export const getScoreColor = (score) => {
  if (score >= 80) return 'text-green-600'
  if (score >= 60) return 'text-yellow-600'
  return 'text-red-600'
}

/**
 * Get Tailwind bg color for confidence / match score
 */
export const getProgressColor = (score) => {
  if (score >= 75) return 'bg-green-500'
  if (score >= 50) return 'bg-yellow-500'
  return 'bg-red-500'
}

/**
 * Truncate text to maxLength characters
 */
export const truncate = (text, maxLength = 100) => {
  if (!text) return ''
  return text.length > maxLength ? text.substring(0, maxLength) + '...' : text
}

/**
 * Capitalize the first letter of each word
 */
export const titleCase = (str) => {
  if (!str) return ''
  return str.replace(/\w\S*/g, (w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
}

/**
 * Format a date to locale string
 */
export const formatDate = (dateStr) => {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleDateString('en-IN', {
    year: 'numeric', month: 'short', day: 'numeric',
  })
}

/**
 * Calculate profile completion percentage
 * based on filled fields
 */
export const calcProfileCompletion = (profile) => {
  if (!profile) return 0
  const fields = [
    profile.education,
    profile.degree,
    profile.skills?.technical?.length > 0,
    profile.skills?.programmingLanguages?.length > 0,
    profile.preferredDomain,
    profile.cgpa,
    profile.college,
  ]
  const filled = fields.filter(Boolean).length
  return Math.round((filled / fields.length) * 100)
}

/**
 * Group an array of objects by a key
 */
export const groupBy = (arr, key) => {
  return arr.reduce((acc, item) => {
    const group = item[key]
    acc[group] = acc[group] || []
    acc[group].push(item)
    return acc
  }, {})
}

/**
 * Compute skill match % between user skills and required skills
 */
export const computeSkillMatch = (userSkills = [], requiredSkills = []) => {
  if (requiredSkills.length === 0) return 100
  const userSet = new Set(userSkills.map(s => s.toLowerCase()))
  const matched = requiredSkills.filter(s => userSet.has(s.toLowerCase())).length
  return Math.round((matched / requiredSkills.length) * 100)
}
