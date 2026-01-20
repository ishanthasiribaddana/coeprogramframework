import { useState, useRef, useEffect } from 'react'
import { 
  Plus, Trash2, FileText, Download, X, Building2, 
  GraduationCap, Zap, ArrowRightLeft, Clock, Users, 
  Briefcase, BookOpen, ChevronDown, Sparkles, Save, Loader2, CheckCircle, AlertCircle, HelpCircle, Lock, Unlock, Edit3
} from 'lucide-react'
import './index.css'
import { programsApi, centersApi, healthCheck } from './api'
import Guide from './Guide'
const coeLogo = import.meta.env.BASE_URL + 'coe-logo.png'

const CENTERS = [
  { id: 'ai', name: 'AI Center', icon: '🤖', color: 'from-violet-500 to-purple-600' },
  { id: 'steam', name: 'STEAM Hub', icon: '⚡', color: 'from-orange-500 to-red-600' },
  { id: 'language', name: 'Language Center', icon: '📚', color: 'from-blue-500 to-cyan-600' },
  { id: 'auditorium', name: 'Auditorium', icon: '🎭', color: 'from-pink-500 to-rose-600' },
  { id: 'science', name: 'Science Center', icon: '🔬', color: 'from-green-500 to-emerald-600' },
  { id: 'entrepreneurship', name: 'Entrepreneurship Center', icon: '💼', color: 'from-amber-500 to-yellow-600' },
  { id: 'media', name: 'Media Center', icon: '🎬', color: 'from-indigo-500 to-blue-600' },
  { id: 'mathematics', name: 'Mathematics Center', icon: '📐', color: 'from-teal-500 to-cyan-600' },
  { id: 'finearts', name: 'Fine Arts Center', icon: '🎨', color: 'from-fuchsia-500 to-pink-600' },
  { id: 'performingarts', name: 'Performing Arts Center', icon: '🎵', color: 'from-rose-500 to-red-600' }
]

const STUDENT_ASSOCIATIONS = [
  'Information and Communication Technology Unit',
  "Inventors' Association",
  'Entrepreneurship Association',
  'Engineering Technology Association',
  'Robotics Association',
  'Green Energy Association',
  'Research and Exploration Society'
]

const emptyProgram = () => ({
  id: Date.now() + Math.random(),
  module: '',
  crossCenter: '',
  duration: '',
  partnerships: '',
  careerGuidance: '',
  associations: []
})

// Pre-populated data for AI Center (from Excel framework)
const AI_CENTER_DATA = {
  advancedPrograms: [
    {
      id: 1,
      module: 'AI & Machine Learning Fundamentals',
      crossCenter: '',
      duration: '30-40',
      partnerships: 'MagicBit, Engineers Guild',
      careerGuidance: 'Codegen, Senzmate',
      associations: ['Information and Communication Technology Unit', "Inventors' Association", 'Robotics Association'],
      finalized: true
    },
    {
      id: 2,
      module: 'Robotics & Automation',
      crossCenter: '',
      duration: '25-35',
      partnerships: 'RoboticGen, MagicBit',
      careerGuidance: 'IOTex, TechFonist',
      associations: ['Robotics Association', 'Engineering Technology Association', "Inventors' Association"],
      finalized: true
    },
    {
      id: 3,
      module: 'IoT & Smart Systems',
      crossCenter: '',
      duration: '20-30',
      partnerships: 'Revox, All Digital Specialty',
      careerGuidance: 'ELZIAN AGRO, RagenTec Systems',
      associations: ['Information and Communication Technology Unit', 'Green Energy Association', 'Engineering Technology Association'],
      finalized: true
    },
    {
      id: 4,
      module: 'Data Science & Analytics',
      crossCenter: '',
      duration: '25-30',
      partnerships: 'NCinga, MicroImage',
      careerGuidance: 'Calcey, Surge',
      associations: ['Information and Communication Technology Unit', 'Research and Exploration Society'],
      finalized: true
    },
    {
      id: 5,
      module: 'Cybersecurity Essentials',
      crossCenter: '',
      duration: '15-20',
      partnerships: 'Zone24',
      careerGuidance: 'Zone24',
      associations: ['Information and Communication Technology Unit'],
      finalized: true
    }
  ],
  steamPrograms: [
    {
      id: 6,
      module: 'AI-Powered Creative Projects',
      crossCenter: '',
      duration: '20-25',
      partnerships: 'MagicBit',
      careerGuidance: 'Codegen',
      associations: ["Inventors' Association", 'Entrepreneurship Association'],
      finalized: true
    },
    {
      id: 7,
      module: 'Smart Agriculture Solutions',
      crossCenter: '',
      duration: '15-20',
      partnerships: 'ELZIAN AGRO',
      careerGuidance: 'ELZIAN AGRO',
      associations: ['Green Energy Association', 'Research and Exploration Society'],
      finalized: true
    },
    {
      id: 8,
      module: 'Renewable Energy & AI Integration',
      crossCenter: '',
      duration: '20-25',
      partnerships: 'Engineers Guild',
      careerGuidance: 'TechFonist',
      associations: ['Green Energy Association', 'Engineering Technology Association'],
      finalized: true
    }
  ],
  crossCenterPrograms: [
    {
      id: 9,
      module: 'Public Speaking for Tech Presentations',
      crossCenter: 'Auditorium',
      duration: '10-15',
      partnerships: '',
      careerGuidance: '',
      associations: ['Information and Communication Technology Unit'],
      finalized: true
    },
    {
      id: 10,
      module: 'Technical Writing & Documentation',
      crossCenter: 'Language Center',
      duration: '10-12',
      partnerships: '',
      careerGuidance: '',
      associations: ['Information and Communication Technology Unit', 'Research and Exploration Society'],
      finalized: true
    },
    {
      id: 11,
      module: 'Business Model Development for Tech Startups',
      crossCenter: 'Entrepreneurship Center',
      duration: '15-20',
      partnerships: '',
      careerGuidance: '',
      associations: ['Entrepreneurship Association', "Inventors' Association"],
      finalized: true
    }
  ],
  notes: 'AI Center programs focus on building employment-ready skills in emerging technologies. All programs include hands-on projects and industry mentorship. Duration estimates are per term and may vary based on student progress.'
}

// Pre-populated data for STEAM Hub (from Excel framework)
const STEAM_HUB_DATA = {
  advancedPrograms: [
    {
      id: 101,
      module: 'Integrated STEAM Project Design',
      crossCenter: '',
      duration: '30-40',
      partnerships: 'MagicBit, Engineers Guild',
      careerGuidance: 'Codegen',
      associations: ["Inventors' Association", 'Engineering Technology Association', 'Research and Exploration Society'],
      finalized: true
    },
    {
      id: 102,
      module: 'Advanced Prototyping & Fabrication',
      crossCenter: '',
      duration: '25-30',
      partnerships: 'RoboticGen',
      careerGuidance: 'TechFonist',
      associations: ['Engineering Technology Association', "Inventors' Association"],
      finalized: true
    },
    {
      id: 103,
      module: 'Scientific Research Methodology',
      crossCenter: '',
      duration: '20-25',
      partnerships: '',
      careerGuidance: '',
      associations: ['Research and Exploration Society'],
      finalized: true
    }
  ],
  steamPrograms: [
    {
      id: 104,
      module: 'Cross-Disciplinary Innovation Challenge',
      crossCenter: '',
      duration: '35-45',
      partnerships: 'MagicBit, ELZIAN AGRO',
      careerGuidance: 'Senzmate, Calcey',
      associations: ["Inventors' Association", 'Entrepreneurship Association', 'Green Energy Association'],
      finalized: true
    },
    {
      id: 105,
      module: 'Sustainable Technology Solutions',
      crossCenter: '',
      duration: '25-30',
      partnerships: 'Engineers Guild',
      careerGuidance: 'ELZIAN AGRO',
      associations: ['Green Energy Association', 'Research and Exploration Society'],
      finalized: true
    },
    {
      id: 106,
      module: 'Art-Tech Fusion Projects',
      crossCenter: '',
      duration: '20-25',
      partnerships: '',
      careerGuidance: '',
      associations: ["Inventors' Association", 'Entrepreneurship Association'],
      finalized: true
    }
  ],
  crossCenterPrograms: [
    {
      id: 107,
      module: 'AI & Machine Learning Integration',
      crossCenter: 'AI Center',
      duration: '20-25',
      partnerships: 'MagicBit',
      careerGuidance: 'Codegen',
      associations: ['Information and Communication Technology Unit', 'Robotics Association'],
      finalized: true
    },
    {
      id: 108,
      module: 'Scientific Visualization & Media',
      crossCenter: 'Media Center',
      duration: '15-20',
      partnerships: '',
      careerGuidance: '',
      associations: ['Research and Exploration Society'],
      finalized: true
    },
    {
      id: 109,
      module: 'Mathematical Modeling for Projects',
      crossCenter: 'Mathematics Center',
      duration: '15-20',
      partnerships: '',
      careerGuidance: '',
      associations: ['Engineering Technology Association', 'Research and Exploration Society'],
      finalized: true
    }
  ],
  notes: 'STEAM Hub serves as the integration point for all centers. Projects here combine multiple disciplines and emphasize real-world problem solving. Industry partnerships provide mentorship and potential career pathways.'
}

// ProgramCard component - moved outside App to prevent re-creation on every render
const ProgramCard = ({ program, onUpdate, onRemove, showCrossCenter, index, onBlur, isAutoSaving, centerPrefix, colorTheme = 'blue' }) => {
  // Color theme configurations - card headers match section icon gradients
  const themes = {
    orange: {
      border: 'hover:border-orange-300',
      header: 'from-orange-500 to-red-600',
      headerText: 'text-white',
      headerBorder: 'border-orange-600',
      badge: 'bg-white/20 text-white',
      focusRing: 'focus:ring-orange-500',
      accent: 'text-orange-500',
      iconPrimary: 'text-orange-500',
      iconSecondary: 'text-red-500',
      inputBg: 'bg-orange-50/50',
      assocActive: 'from-orange-500 to-red-500',
      assocInactive: 'bg-orange-50 text-orange-700 hover:bg-orange-100'
    },
    violet: {
      border: 'hover:border-violet-300',
      header: 'from-violet-500 to-purple-600',
      headerText: 'text-white',
      headerBorder: 'border-violet-600',
      badge: 'bg-white/20 text-white',
      focusRing: 'focus:ring-violet-500',
      accent: 'text-violet-500',
      iconPrimary: 'text-violet-500',
      iconSecondary: 'text-purple-500',
      inputBg: 'bg-violet-50/50',
      assocActive: 'from-violet-500 to-purple-500',
      assocInactive: 'bg-violet-50 text-violet-700 hover:bg-violet-100'
    },
    emerald: {
      border: 'hover:border-emerald-300',
      header: 'from-emerald-500 to-teal-600',
      headerText: 'text-white',
      headerBorder: 'border-emerald-600',
      badge: 'bg-white/20 text-white',
      focusRing: 'focus:ring-emerald-500',
      accent: 'text-emerald-500',
      iconPrimary: 'text-emerald-500',
      iconSecondary: 'text-teal-500',
      inputBg: 'bg-emerald-50/50',
      assocActive: 'from-emerald-500 to-teal-500',
      assocInactive: 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100'
    },
    blue: {
      border: 'hover:border-blue-300',
      header: 'from-blue-500 to-indigo-600',
      headerText: 'text-white',
      headerBorder: 'border-blue-600',
      badge: 'bg-white/20 text-white',
      focusRing: 'focus:ring-blue-500',
      accent: 'text-blue-500',
      iconPrimary: 'text-blue-500',
      iconSecondary: 'text-indigo-500',
      inputBg: 'bg-gray-50',
      assocActive: 'from-blue-500 to-indigo-500',
      assocInactive: 'bg-gray-100 text-gray-600 hover:bg-gray-200'
    }
  }
  const theme = themes[colorTheme] || themes.blue
  const isFinalized = program.finalized === true
  
  return (
  <div 
    className={`group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl ${theme.border} transition-all duration-300 overflow-hidden relative`}
    onBlur={(e) => {
      // Check if focus is leaving this card entirely (not just moving between inputs within the card)
      if (!e.currentTarget.contains(e.relatedTarget)) {
        onBlur && onBlur(program.id)
      }
    }}
  >
    {/* Auto-save indicator */}
    {isAutoSaving && (
      <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full z-10">
        <Loader2 size={12} className="animate-spin" />
        Saving...
      </div>
    )}
    <div className={`bg-gradient-to-r ${theme.header} px-5 py-3 border-b ${theme.headerBorder} flex justify-between items-center`}>
      <div className="flex items-center gap-2">
        <span className={`text-sm font-semibold ${theme.headerText}`}>{centerPrefix ? `${centerPrefix} Program #${index + 1}` : `Program #${index + 1}`}</span>
        {isFinalized && (
          <span className={`px-2 py-0.5 text-xs font-medium ${theme.badge} rounded-full`}>Finalized</span>
        )}
      </div>
      {!isFinalized && (
        <button
          onClick={() => onRemove(program.id)}
          className="opacity-0 group-hover:opacity-100 p-2 text-white/70 hover:text-white hover:bg-white/20 rounded-lg transition-all duration-200"
        >
          <Trash2 size={16} />
        </button>
      )}
    </div>
    <div className="p-5 space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <BookOpen size={14} className={theme.iconPrimary} />
          Project / Module Name
        </label>
        <input
          type="text"
          value={program.module}
          onChange={(e) => onUpdate(program.id, 'module', e.target.value)}
          disabled={isFinalized}
          className={`w-full px-4 py-3 border-0 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-400 ${isFinalized ? 'bg-gray-100 cursor-not-allowed' : `${theme.inputBg} focus:ring-2 ${theme.focusRing} focus:bg-white`}`}
          placeholder="Enter module or project name..."
        />
      </div>

      {showCrossCenter && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <ArrowRightLeft size={14} className={theme.iconSecondary} />
            Cross Center
          </label>
          <div className="relative">
            <select
              value={program.crossCenter}
              onChange={(e) => onUpdate(program.id, 'crossCenter', e.target.value)}
              disabled={isFinalized}
              className={`w-full px-4 py-3 border-0 rounded-xl transition-all duration-200 text-gray-800 appearance-none ${isFinalized ? 'bg-gray-100 cursor-not-allowed' : `${theme.inputBg} focus:ring-2 ${theme.focusRing} focus:bg-white cursor-pointer`}`}
            >
              <option value="">Select requesting center...</option>
              {CENTERS.map(center => (
                <option key={center.id} value={center.name}>{center.icon} {center.name}</option>
              ))}
            </select>
            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Clock size={14} className={theme.iconPrimary} />
            Duration (Hours)
          </label>
          <input
            type="text"
            value={program.duration}
            onChange={(e) => onUpdate(program.id, 'duration', e.target.value)}
            disabled={isFinalized}
            className={`w-full px-4 py-3 border-0 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-400 ${isFinalized ? 'bg-gray-100 cursor-not-allowed' : `${theme.inputBg} focus:ring-2 ${theme.focusRing} focus:bg-white`}`}
            placeholder="e.g., 20-30"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Briefcase size={14} className={theme.iconSecondary} />
            External Partnerships
          </label>
          <input
            type="text"
            value={program.partnerships}
            onChange={(e) => onUpdate(program.id, 'partnerships', e.target.value)}
            disabled={isFinalized}
            className={`w-full px-4 py-3 border-0 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-400 ${isFinalized ? 'bg-gray-100 cursor-not-allowed' : `${theme.inputBg} focus:ring-2 ${theme.focusRing} focus:bg-white`}`}
            placeholder="Partner organizations..."
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <GraduationCap size={14} className={theme.iconPrimary} />
          Career Guidance / Placement
        </label>
        <input
          type="text"
          value={program.careerGuidance}
          onChange={(e) => onUpdate(program.id, 'careerGuidance', e.target.value)}
          disabled={isFinalized}
          className={`w-full px-4 py-3 border-0 rounded-xl transition-all duration-200 text-gray-800 placeholder-gray-400 ${isFinalized ? 'bg-gray-100 cursor-not-allowed' : `${theme.inputBg} focus:ring-2 ${theme.focusRing} focus:bg-white`}`}
          placeholder="Industry placement partners..."
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Users size={14} className={theme.iconSecondary} />
          Student Associations
        </label>
        <div className="flex flex-wrap gap-2">
          {STUDENT_ASSOCIATIONS.map(assoc => (
            <button
              key={assoc}
              type="button"
              onClick={() => {
                if (isFinalized) return
                const newAssocs = program.associations.includes(assoc)
                  ? program.associations.filter(a => a !== assoc)
                  : [...program.associations, assoc]
                onUpdate(program.id, 'associations', newAssocs)
              }}
              disabled={isFinalized}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                program.associations.includes(assoc)
                  ? `bg-gradient-to-r ${theme.assocActive} text-white shadow-md`
                  : theme.assocInactive
              } ${isFinalized ? 'cursor-not-allowed opacity-75' : ''}`}
            >
              {assoc.length > 25 ? assoc.substring(0, 25) + '...' : assoc}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
  )
}

// ProgramSection component - moved outside App
const ProgramSection = ({ programs, onAdd, onUpdate, onRemove, onCardBlur, autoSavingId, title, description, icon: Icon, color, colorTheme = 'blue', showCrossCenter = false, centerPrefix, isFinalized = false }) => (
  <div className="mb-8">
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
      <div className="flex items-center gap-3">
        <div className={`p-3 rounded-xl bg-gradient-to-br ${color} shadow-lg`}>
          <Icon size={24} className="text-white" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-gray-800">{title}</h3>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
      </div>
      {!isFinalized && (
        <button
          onClick={onAdd}
          className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-maroon-800 to-maroon-900 text-gold-500 rounded-xl font-medium hover:from-maroon-700 hover:to-maroon-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-gold-500"
        >
          <Plus size={18} />
          Add Program
        </button>
      )}
    </div>
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      {programs.map((program, idx) => (
        <ProgramCard 
          key={program.id} 
          program={program} 
          onUpdate={onUpdate}
          onRemove={onRemove}
          onBlur={onCardBlur}
          isAutoSaving={autoSavingId === program.id}
          showCrossCenter={showCrossCenter}
          index={idx}
          centerPrefix={centerPrefix}
          colorTheme={colorTheme}
        />
      ))}
    </div>
  </div>
)

// ReportSection component - moved outside App
const ReportSection = ({ title, programs, showCrossCenter = false }) => {
  const validPrograms = programs.filter(p => p.module.trim())
  if (validPrograms.length === 0) return null

  return (
    <div className="section mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-4 pb-2 border-b-2 border-blue-200">{title}</h3>
      <table className="w-full">
        <thead>
          <tr className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
            <th className="p-3 text-left text-sm font-semibold rounded-tl-lg">Module</th>
            {showCrossCenter && <th className="p-3 text-left text-sm font-semibold">Cross Center</th>}
            <th className="p-3 text-left text-sm font-semibold">Duration</th>
            <th className="p-3 text-left text-sm font-semibold">Partnerships</th>
            <th className="p-3 text-left text-sm font-semibold">Career Guidance</th>
            <th className="p-3 text-left text-sm font-semibold rounded-tr-lg">Associations</th>
          </tr>
        </thead>
        <tbody>
          {validPrograms.map((program, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
              <td className="p-3 font-medium text-gray-800">{program.module}</td>
              {showCrossCenter && <td className="p-3 text-gray-600">{program.crossCenter}</td>}
              <td className="p-3 text-gray-600">{program.duration}</td>
              <td className="p-3 text-gray-600">{program.partnerships}</td>
              <td className="p-3 text-gray-600">{program.careerGuidance}</td>
              <td className="p-3 text-gray-600 text-sm">{program.associations.join(', ')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function App() {
  const [centerName, setCenterName] = useState('')
  const [centerId, setCenterId] = useState(null)
  const [advancedPrograms, setAdvancedPrograms] = useState([emptyProgram()])
  const [steamPrograms, setSteamPrograms] = useState([emptyProgram()])
  const [crossCenterPrograms, setCrossCenterPrograms] = useState([emptyProgram()])
  const [notes, setNotes] = useState('')
  const [showReport, setShowReport] = useState(false)
  const [showGuide, setShowGuide] = useState(false)
  const reportRef = useRef(null)
  
  // Database connection and save states
  const [dbConnected, setDbConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'success', 'error', null
  const [loading, setLoading] = useState(false)
  const [autoSavingId, setAutoSavingId] = useState(null) // Track which program is auto-saving
  const [finalizeUnlocked, setFinalizeUnlocked] = useState(false)
  const [editUnlocked, setEditUnlocked] = useState(false)
  const [showPinModal, setShowPinModal] = useState(false)
  const [pinModalMode, setPinModalMode] = useState('finalize') // 'finalize' or 'edit'
  const [pinInput, setPinInput] = useState('')
  const [pinError, setPinError] = useState(false)

  const selectedCenter = CENTERS.find(c => c.name === centerName)
  const FINALIZE_PIN = '0218'

  // Check database connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await healthCheck()
        setDbConnected(true)
      } catch (error) {
        console.log('Database not connected - using localStorage mode')
        setDbConnected(false)
      }
    }
    checkConnection()
  }, [])

  // localStorage helpers for offline mode
  const saveToLocalStorage = (centerIdNum, data) => {
    const key = `coe_programs_center_${centerIdNum}`
    localStorage.setItem(key, JSON.stringify(data))
  }

  const loadFromLocalStorage = (centerIdNum) => {
    const key = `coe_programs_center_${centerIdNum}`
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  }

  // Load saved data from database or localStorage when center is selected
  const loadCenterData = async (centerIdNum) => {
    if (!dbConnected) {
      // Try localStorage fallback
      const localData = loadFromLocalStorage(centerIdNum)
      if (localData) {
        console.log('loadCenterData: Loading from localStorage', localData)
        setAdvancedPrograms(localData.advanced?.length > 0 ? localData.advanced : [emptyProgram()])
        setSteamPrograms(localData.steam?.length > 0 ? localData.steam : [emptyProgram()])
        setCrossCenterPrograms(localData.crossCenter?.length > 0 ? localData.crossCenter : [emptyProgram()])
        return true
      }
      console.log('loadCenterData: No localStorage data')
      return false
    }
    
    setLoading(true)
    try {
      console.log('loadCenterData: Loading center', centerIdNum)
      const response = await programsApi.getByCenter(centerIdNum)
      console.log('loadCenterData: Response', JSON.stringify(response))
      if (response && response.success && response.data) {
        const { advanced, steam, crossCenter } = response.data
        console.log('loadCenterData: Advanced programs count:', advanced?.length || 0)
        
        // Map database programs to local format
        const mappedAdvanced = advanced ? advanced.map(p => ({
          id: p.program_id,
          module: p.module_name || '',
          crossCenter: p.crossCenterRequest?.center_name || '',
          duration: p.duration_min_hours ? `${p.duration_min_hours}-${p.duration_max_hours}` : '',
          partnerships: p.partners?.map(pt => pt.partner_name).join(', ') || '',
          careerGuidance: p.placements?.map(pl => pl.partner_name).join(', ') || '',
          associations: p.associations?.map(a => a.association_name) || [],
          finalized: p.status === 'approved'
        })) : []
        
        const mappedSteam = steam ? steam.map(p => ({
          id: p.program_id,
          module: p.module_name || '',
          crossCenter: '',
          duration: p.duration_min_hours ? `${p.duration_min_hours}-${p.duration_max_hours}` : '',
          partnerships: p.partners?.map(pt => pt.partner_name).join(', ') || '',
          careerGuidance: p.placements?.map(pl => pl.partner_name).join(', ') || '',
          associations: p.associations?.map(a => a.association_name) || [],
          finalized: p.status === 'approved'
        })) : []
        
        const mappedCrossCenter = crossCenter ? crossCenter.map(p => ({
          id: p.program_id,
          module: p.module_name || '',
          crossCenter: p.crossCenterRequest?.center_name || '',
          duration: p.duration_min_hours ? `${p.duration_min_hours}-${p.duration_max_hours}` : '',
          partnerships: p.partners?.map(pt => pt.partner_name).join(', ') || '',
          careerGuidance: p.placements?.map(pl => pl.partner_name).join(', ') || '',
          associations: p.associations?.map(a => a.association_name) || [],
          finalized: p.status === 'approved'
        })) : []
        
        // Set programs - only add empty program if no data exists at all
        setAdvancedPrograms(mappedAdvanced.length > 0 ? mappedAdvanced : [emptyProgram()])
        setSteamPrograms(mappedSteam.length > 0 ? mappedSteam : [emptyProgram()])
        setCrossCenterPrograms(mappedCrossCenter.length > 0 ? mappedCrossCenter : [emptyProgram()])
        
        setLoading(false)
        return true
      }
    } catch (error) {
      console.error('Error loading center data:', error)
      // On error, still try to show empty programs
      setAdvancedPrograms([emptyProgram()])
      setSteamPrograms([emptyProgram()])
      setCrossCenterPrograms([emptyProgram()])
    }
    setLoading(false)
    return false
  }

  // Handle center selection - load from DB or use sample data
  const handleCenterSelect = async (name) => {
    setCenterName(name)
    const center = CENTERS.find(c => c.name === name)
    const centerIndex = CENTERS.findIndex(c => c.name === name) + 1
    setCenterId(centerIndex)
    
    
    // For other centers, try to load from database first
    // Always try to load - loadCenterData handles the dbConnected check internally
    const loaded = await loadCenterData(centerIndex)
    if (loaded) {
      setNotes('')
      return
    }
    
    // Fall back to empty programs only if load failed
    console.log('handleCenterSelect: Falling back to empty programs')
    setAdvancedPrograms([emptyProgram()])
    setSteamPrograms([emptyProgram()])
    setCrossCenterPrograms([emptyProgram()])
    setNotes('')
  }

  // Save all programs to database
  const saveAllData = async () => {
    if (!centerId) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }
    
    
    // If database is not connected, show error but don't block the UI
    if (!dbConnected) {
      // Save to localStorage when database is not connected
      saveToLocalStorage(centerId, {
        advanced: advancedPrograms.filter(p => p.module && p.module.trim()),
        steam: steamPrograms.filter(p => p.module && p.module.trim()),
        crossCenter: crossCenterPrograms.filter(p => p.module && p.module.trim())
      })
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
      console.log('Database not connected - saved to localStorage')
      return
    }

    setSaving(true)
    setSaveStatus(null)

    try {
      // Get program type IDs (1=Advanced, 2=STEAM, 3=Cross Center)
      const programTypeIds = { advanced: 1, steam: 2, crossCenter: 3 }
      
      // Helper to check if ID is a database ID (small integer) vs local timestamp ID
      const isDbId = (id) => typeof id === 'number' && id > 0 && id < 100000

      // Collect all programs with DB IDs and local IDs
      const allPrograms = [
        ...advancedPrograms.map(p => ({ ...p, programType: 'advanced', programTypeId: 1 })),
        ...steamPrograms.map(p => ({ ...p, programType: 'steam', programTypeId: 2 })),
        ...crossCenterPrograms.map(p => ({ ...p, programType: 'crossCenter', programTypeId: 3 }))
      ]
      
      const dbPrograms = allPrograms.filter(p => isDbId(p.id))
      const localPrograms = allPrograms.filter(p => !isDbId(p.id) && p.module && p.module.trim().length > 0)
      
      // Update existing database programs
      for (const program of dbPrograms) {
        if (program.module && program.module.trim().length > 0) {
          const [minHours, maxHours] = (program.duration || '0-0').split('-').map(Number)
          const crossCenterIdx = program.programType === 'crossCenter' 
            ? CENTERS.findIndex(c => c.name === program.crossCenter) + 1 
            : null
          const programData = {
            center_id: centerId,
            program_type_id: program.programTypeId,
            module_name: program.module,
            duration_min_hours: minHours || null,
            duration_max_hours: maxHours || null,
            description: `Partnerships: ${program.partnerships || ''}, Career Guidance: ${program.careerGuidance || ''}`,
            cross_center_id: crossCenterIdx > 0 ? crossCenterIdx : null,
            status: program.finalized ? 'approved' : 'draft',
          }
          await programsApi.update(program.id, programData)
        }
      }
      
      // Create new programs - check each local program to see if it's truly new
      // A program is new if its module name doesn't match any existing DB program
      for (const program of localPrograms) {
        // Check if this module name already exists in DB programs
        const existsInDb = dbPrograms.some(dbProg => 
          dbProg.module.trim().toLowerCase() === program.module.trim().toLowerCase() &&
          dbProg.programTypeId === program.programTypeId
        )
        
        if (!existsInDb) {
          const [minHours, maxHours] = (program.duration || '0-0').split('-').map(Number)
          const crossCenterIdx = program.programType === 'crossCenter' 
            ? CENTERS.findIndex(c => c.name === program.crossCenter) + 1 
            : null
          const programData = {
            center_id: centerId,
            program_type_id: program.programTypeId,
            module_name: program.module,
            duration_min_hours: minHours || null,
            duration_max_hours: maxHours || null,
            description: `Partnerships: ${program.partnerships || ''}, Career Guidance: ${program.careerGuidance || ''}`,
            cross_center_id: crossCenterIdx > 0 ? crossCenterIdx : null,
            status: program.finalized ? 'approved' : 'draft',
          }
          await programsApi.create(programData)
        }
      }
      
      // Reload data from database to ensure we have correct IDs
      await loadCenterData(centerId)
      
      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Error saving data:', error)
      
      // If database save fails, save to localStorage as fallback
      if (!dbConnected) {
        saveToLocalStorage(centerId, {
          advanced: advancedPrograms.filter(p => p.module && p.module.trim()),
          steam: steamPrograms.filter(p => p.module && p.module.trim()),
          crossCenter: crossCenterPrograms.filter(p => p.module && p.module.trim())
        })
        setSaveStatus('success')
        setTimeout(() => setSaveStatus(null), 3000)
        return
      }
      
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const addProgram = (setter) => {
    setter(prev => [...prev, emptyProgram()])
  }

  const removeProgram = async (setter, id, programType) => {
    // Remove from UI immediately
    setter(prev => prev.length > 1 ? prev.filter(p => p.id !== id) : prev)
    
    // If connected to database and it's a valid database ID (small integer, not timestamp-based), delete from DB
    // Database IDs are typically small integers (< 100000), while local IDs are timestamps (> 1700000000000)
    const isDbId = typeof id === 'number' && id > 0 && id < 100000
    if (dbConnected && isDbId) {
      try {
        await programsApi.delete(id)
        console.log(`Program ${id} deleted from database`)
      } catch (error) {
        console.error('Error deleting program from database:', error)
      }
    }
  }

  const updateProgram = (setter, id, field, value) => {
    setter(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  // Auto-save a single program when leaving its card
  // DISABLED - this was causing duplicate records. Use saveAllData instead.
  const autoSaveProgram = async (programId, programType) => {
    // Do nothing - auto-save is disabled to prevent duplicates
    return
  }

  const generateReport = () => {
    setShowReport(true)
  }

  const downloadReport = () => {
    const printContent = reportRef.current.innerHTML
    const printWindow = window.open('', '_blank')
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>COE Program Report - ${centerName}</title>
        <style>
          * { margin: 0; padding: 0; box-sizing: border-box; }
          body { font-family: 'Segoe UI', system-ui, sans-serif; padding: 40px; max-width: 1200px; margin: 0 auto; color: #1f2937; }
          .header { text-align: center; margin-bottom: 40px; padding-bottom: 20px; border-bottom: 3px solid #3b82f6; }
          .header h1 { font-size: 28px; color: #1e3a8a; margin-bottom: 8px; }
          .header h2 { font-size: 22px; color: #3b82f6; font-weight: 500; }
          .header .date { color: #6b7280; font-size: 14px; margin-top: 12px; }
          .section { margin-bottom: 32px; }
          .section h3 { font-size: 18px; color: #1e3a8a; margin-bottom: 16px; padding: 10px 16px; background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%); border-radius: 8px; border-left: 4px solid #3b82f6; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; box-shadow: 0 1px 3px rgba(0,0,0,0.1); border-radius: 8px; overflow: hidden; }
          th { background: linear-gradient(135deg, #1e40af 0%, #3b82f6 100%); color: white; padding: 12px 16px; text-align: left; font-weight: 600; font-size: 13px; text-transform: uppercase; letter-spacing: 0.5px; }
          td { padding: 12px 16px; border-bottom: 1px solid #e5e7eb; font-size: 14px; }
          tr:nth-child(even) { background-color: #f9fafb; }
          tr:hover { background-color: #eff6ff; }
          .notes { background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); padding: 20px; border-radius: 12px; margin-top: 32px; border-left: 4px solid #f59e0b; }
          .notes h3 { color: #92400e; margin-bottom: 12px; font-size: 16px; }
          .notes p { color: #78350f; line-height: 1.6; }
          .footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #e5e7eb; text-align: center; color: #6b7280; font-size: 12px; }
          @media print { body { padding: 20px; } .header { border-bottom-width: 2px; } }
        </style>
      </head>
      <body>
        ${printContent}
        <div class="footer">
          <p>STEAM Education Development Framework (SEDF) - Ananda College Center of Excellence</p>
          <p>This report was automatically generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  // Handle PIN verification for finalize or edit
  const handlePinSubmit = () => {
    if (pinInput === FINALIZE_PIN) {
      if (pinModalMode === 'finalize') {
        setFinalizeUnlocked(true)
      } else if (pinModalMode === 'edit') {
        setEditUnlocked(true)
      }
      setShowPinModal(false)
      setPinInput('')
      setPinError(false)
    } else {
      setPinError(true)
      setPinInput('')
    }
  }

  // Finalize all current programs (mark them as finalized)
  const finalizePrograms = async () => {
    if (!finalizeUnlocked || !centerName) return
    
    // Mark all programs as finalized in local state
    const finalizedAdvanced = advancedPrograms.map(p => ({ ...p, finalized: true }))
    const finalizedSteam = steamPrograms.map(p => ({ ...p, finalized: true }))
    const finalizedCrossCenter = crossCenterPrograms.map(p => ({ ...p, finalized: true }))
    
    setAdvancedPrograms(finalizedAdvanced)
    setSteamPrograms(finalizedSteam)
    setCrossCenterPrograms(finalizedCrossCenter)
    
    // Save finalized state to database directly
    const programTypeIds = { advanced: 1, steam: 2, crossCenter: 3 }
    const isDbId = (id) => typeof id === 'number' && id > 0 && id < 100000
    
    try {
      // Update all programs with finalized status
      for (const program of finalizedAdvanced) {
        if (program.module.trim() && isDbId(program.id)) {
          await programsApi.update(program.id, { status: 'approved' })
        }
      }
      for (const program of finalizedSteam) {
        if (program.module.trim() && isDbId(program.id)) {
          await programsApi.update(program.id, { status: 'approved' })
        }
      }
      for (const program of finalizedCrossCenter) {
        if (program.module.trim() && isDbId(program.id)) {
          await programsApi.update(program.id, { status: 'approved' })
        }
      }
    } catch (error) {
      console.error('Error saving finalized status:', error)
    }
    
    // Lock finalize button again after use
    setFinalizeUnlocked(false)
  }

  // Enable editing of finalized programs (remove finalized flag)
  const enableEditMode = async () => {
    if (!editUnlocked || !centerName) return
    
    const isDbId = (id) => typeof id === 'number' && id > 0 && id < 100000
    
    // Remove finalized flag from all programs (keep IDs intact)
    const editableAdvanced = advancedPrograms.map(p => ({ ...p, finalized: false }))
    const editableSteam = steamPrograms.map(p => ({ ...p, finalized: false }))
    const editableCrossCenter = crossCenterPrograms.map(p => ({ ...p, finalized: false }))
    
    setAdvancedPrograms(editableAdvanced)
    setSteamPrograms(editableSteam)
    setCrossCenterPrograms(editableCrossCenter)
    
    // Update status to draft in database
    try {
      for (const program of editableAdvanced) {
        if (program.module.trim() && isDbId(program.id)) {
          await programsApi.update(program.id, { status: 'draft' })
        }
      }
      for (const program of editableSteam) {
        if (program.module.trim() && isDbId(program.id)) {
          await programsApi.update(program.id, { status: 'draft' })
        }
      }
      for (const program of editableCrossCenter) {
        if (program.module.trim() && isDbId(program.id)) {
          await programsApi.update(program.id, { status: 'draft' })
        }
      }
    } catch (error) {
      console.error('Error updating edit status:', error)
    }
    
    // Lock edit button again after use
    setEditUnlocked(false)
    
    // Automatically unlock finalize button so user can re-finalize after editing
    setFinalizeUnlocked(true)
  }

  // Open PIN modal for specific mode
  const openPinModal = (mode) => {
    setPinModalMode(mode)
    setShowPinModal(true)
  }

  // Show Guide page if showGuide is true
  if (showGuide) {
    return <Guide onBack={() => setShowGuide(false)} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 via-gold-50 to-maroon-100">
      {/* Header */}
      <header className="bg-maroon-900 border-b border-maroon-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button 
              onClick={() => setShowGuide(true)}
              className="flex items-center gap-3 hover:opacity-80 transition-opacity"
            >
              <img src={coeLogo} alt="COE Logo" className="h-10 w-10 rounded-lg shadow-lg" />
              <div className="text-left">
                <h1 className="text-xl font-bold text-gold-500">
                  STEAM Education Development Framework (SEDF)
                </h1>
                <p className="text-xs text-maroon-200 hidden sm:block">Center of Excellence - Ananda College</p>
              </div>
            </button>
            <div className="flex items-center gap-3">
              {/* Database Status Indicator */}
              <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium ${
                dbConnected 
                  ? 'bg-green-900/50 text-green-400 border border-green-700' 
                  : 'bg-red-900/50 text-red-400 border border-red-700'
              }`}>
                <span className={`w-2 h-2 rounded-full ${dbConnected ? 'bg-green-400' : 'bg-red-400'} animate-pulse`}></span>
                <span className="hidden sm:inline">{dbConnected ? 'DB Connected' : 'Offline Mode'}</span>
              </div>

              {/* Save Button */}
              <button
                onClick={saveAllData}
                disabled={!centerName || saving || !dbConnected}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed ${
                  saveStatus === 'success' 
                    ? 'bg-green-600 text-white' 
                    : saveStatus === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-maroon-700 text-gold-400 hover:bg-maroon-600 border border-gold-500'
                }`}
              >
                {saving ? (
                  <Loader2 size={18} className="animate-spin" />
                ) : saveStatus === 'success' ? (
                  <CheckCircle size={18} />
                ) : saveStatus === 'error' ? (
                  <AlertCircle size={18} />
                ) : (
                  <Save size={18} />
                )}
                <span className="hidden sm:inline">
                  {saving ? 'Saving...' : saveStatus === 'success' ? 'Saved!' : saveStatus === 'error' ? 'Error' : 'Save'}
                </span>
              </button>

              {/* Generate Report Button */}
              <button
                onClick={generateReport}
                disabled={!centerName}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 rounded-xl font-medium hover:from-gold-400 hover:to-gold-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FileText size={18} />
                <span className="hidden sm:inline">Generate Report</span>
              </button>

              {/* Guide Button */}
              <button
                onClick={() => setShowGuide(true)}
                className="flex items-center gap-2 px-4 py-2.5 bg-maroon-700 text-gold-400 hover:bg-maroon-600 border border-gold-500 rounded-xl font-medium transition-all duration-200 shadow-md hover:shadow-lg"
              >
                <HelpCircle size={18} />
                <span className="hidden sm:inline">Guide</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Center Selection */}
        <div className="mb-8">
          <div className="bg-white rounded-3xl shadow-xl border border-maroon-100 overflow-hidden">
            <div className="bg-gradient-to-r from-maroon-900 via-maroon-800 to-maroon-900 px-6 py-5">
              <div className="flex items-center gap-3">
                <Building2 size={24} className="text-gold-500" />
                <div>
                  <h2 className="text-xl font-bold text-white">Select Your Center</h2>
                  <p className="text-gold-300 text-sm">Choose the center you are managing</p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                {CENTERS.map(center => (
                  <button
                    key={center.id}
                    onClick={() => handleCenterSelect(center.name)}
                    className={`p-4 rounded-2xl border-2 transition-all duration-300 text-center group ${
                      centerName === center.name
                        ? `border-transparent bg-gradient-to-br ${center.color} text-white shadow-lg scale-105`
                        : 'border-gray-100 bg-white hover:border-blue-200 hover:shadow-md hover:-translate-y-1'
                    }`}
                  >
                    <span className="text-3xl block mb-2">{center.icon}</span>
                    <span className={`text-xs font-medium ${centerName === center.name ? 'text-white' : 'text-gray-700'}`}>
                      {center.name.replace(' Center', '').replace(' Hub', '')}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <BookOpen size={24} className="text-blue-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-800 mb-2">
                <button 
                  onClick={() => setShowGuide(true)} 
                  className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                >
                  Quick Guide →
                </button>
              </h3>
              <div className="grid sm:grid-cols-2 gap-3 text-sm text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-violet-500"></span>
                  <strong>Advanced:</strong> Employment-ready skill programs
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-orange-500"></span>
                  <strong>STEAM:</strong> Cross-center integration programs
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                  <strong>Cross Center:</strong> Programs from other centers
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  <strong>Duration:</strong> Record in hours (e.g., 20-30)
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Program Sections */}
        <div className="space-y-8">
          <ProgramSection 
            programs={steamPrograms} 
            onAdd={() => addProgram(setSteamPrograms)}
            onUpdate={(id, field, value) => updateProgram(setSteamPrograms, id, field, value)}
            onRemove={(id) => removeProgram(setSteamPrograms, id, 'steam')}
            onCardBlur={(id) => autoSaveProgram(id, 'steam')}
            autoSavingId={autoSavingId}
            title="STEAM Programs" 
            description="Programs that integrate across centers to make COE a STEAM education center. Complement projects at STEAM Hub. Mandatory: Science (S), AI (E), Fine Arts (A), Mathematics (M)."
            icon={Zap}
            color="from-orange-500 to-red-600"
            colorTheme="orange"
            centerPrefix={selectedCenter?.name?.replace(/ (Center|Hub)$/i, '')}
            isFinalized={false}
          />

          <ProgramSection 
            programs={advancedPrograms} 
            onAdd={() => addProgram(setAdvancedPrograms)}
            onUpdate={(id, field, value) => updateProgram(setAdvancedPrograms, id, field, value)}
            onRemove={(id) => removeProgram(setAdvancedPrograms, id, 'advanced')}
            onCardBlur={(id) => autoSaveProgram(id, 'advanced')}
            autoSavingId={autoSavingId}
            title="Advanced Programs" 
            description="Programs that build employment-ready skills in demand in the industry. Not currently conducted by the school. Mandatory for all Centers."
            icon={GraduationCap}
            color="from-violet-500 to-purple-600"
            colorTheme="violet"
            centerPrefix={selectedCenter?.name?.replace(/ (Center|Hub)$/i, '')}
            isFinalized={false}
          />

          <ProgramSection 
            programs={crossCenterPrograms} 
            onAdd={() => addProgram(setCrossCenterPrograms)}
            onUpdate={(id, field, value) => updateProgram(setCrossCenterPrograms, id, field, value)}
            onRemove={(id) => removeProgram(setCrossCenterPrograms, id, 'crossCenter')}
            onCardBlur={(id) => autoSaveProgram(id, 'crossCenter')}
            autoSavingId={autoSavingId}
            title="Cross Center Programs" 
            description="Programs requested from other centers to eliminate duplication across COE. Center consultants incorporate these within their specific scope."
            icon={ArrowRightLeft}
            color="from-emerald-500 to-teal-600"
            colorTheme="emerald"
            showCrossCenter={true}
            centerPrefix={selectedCenter?.name?.replace(/ (Center|Hub)$/i, '')}
            isFinalized={false}
          />
        </div>

        {/* Notes Section */}
        <div className="mt-8 bg-white rounded-3xl shadow-xl border border-gray-100 overflow-hidden">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 px-6 py-4">
            <div className="flex items-center gap-3">
              <BookOpen size={20} className="text-white/80" />
              <h3 className="text-lg font-bold text-white">Additional Notes</h3>
            </div>
          </div>
          <div className="p-6">
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={4}
              className="w-full px-5 py-4 bg-gray-50 border-0 rounded-2xl focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400 resize-none"
              placeholder="Enter any additional notes, time estimates, partnership discussions, or other relevant information..."
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
          {/* Save All Button */}
          <button
            onClick={saveAllData}
            disabled={!centerName || saving}
            className={`group flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none ${
              saveStatus === 'success' 
                ? 'bg-green-600 text-white border-2 border-green-400' 
                : saveStatus === 'error'
                ? 'bg-red-600 text-white border-2 border-red-400'
                : 'bg-gradient-to-r from-green-700 via-green-800 to-green-700 text-white border-2 border-green-500 hover:from-green-600 hover:via-green-700 hover:to-green-600'
            }`}
          >
            {saving ? (
              <Loader2 size={24} className="animate-spin" />
            ) : saveStatus === 'success' ? (
              <CheckCircle size={24} />
            ) : saveStatus === 'error' ? (
              <AlertCircle size={24} />
            ) : (
              <Save size={24} className="group-hover:scale-110 transition-transform duration-300" />
            )}
            {saving ? 'Saving to Database...' : saveStatus === 'success' ? 'Saved Successfully!' : saveStatus === 'error' ? 'Save Failed - Check DB' : 'Save All Programs'}
          </button>

          {/* Generate Report Button */}
          <button
            onClick={generateReport}
            disabled={!centerName}
            className="group flex items-center justify-center gap-3 px-10 py-4 bg-gradient-to-r from-maroon-800 via-maroon-900 to-maroon-800 text-gold-500 rounded-2xl text-lg font-bold hover:from-maroon-700 hover:via-maroon-800 hover:to-maroon-700 transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 border-gold-500"
          >
            <FileText size={24} className="group-hover:rotate-12 transition-transform duration-300" />
            Generate Report
            <Sparkles size={20} className="group-hover:rotate-12 transition-transform duration-300" />
          </button>

          {/* Finalize Button */}
          <button
            onClick={finalizeUnlocked ? finalizePrograms : () => openPinModal('finalize')}
            disabled={!centerName}
            className={`group flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 ${
              finalizeUnlocked
                ? 'bg-gradient-to-r from-purple-600 via-purple-700 to-purple-600 text-white border-purple-400 hover:from-purple-500 hover:via-purple-600 hover:to-purple-500'
                : 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 text-gray-300 border-gray-500 hover:from-gray-500 hover:via-gray-600 hover:to-gray-500'
            }`}
          >
            {finalizeUnlocked ? (
              <Unlock size={24} className="group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <Lock size={24} className="group-hover:scale-110 transition-transform duration-300" />
            )}
            {finalizeUnlocked ? 'Finalize Programs' : 'Finalize (Locked)'}
          </button>

          {/* Edit Button */}
          <button
            onClick={editUnlocked ? enableEditMode : () => openPinModal('edit')}
            disabled={!centerName}
            className={`group flex items-center justify-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-300 shadow-xl hover:shadow-2xl transform hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none border-2 ${
              editUnlocked
                ? 'bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-white border-amber-400 hover:from-amber-400 hover:via-amber-500 hover:to-amber-400'
                : 'bg-gradient-to-r from-gray-600 via-gray-700 to-gray-600 text-gray-300 border-gray-500 hover:from-gray-500 hover:via-gray-600 hover:to-gray-500'
            }`}
          >
            {editUnlocked ? (
              <Edit3 size={24} className="group-hover:scale-110 transition-transform duration-300" />
            ) : (
              <Lock size={24} className="group-hover:scale-110 transition-transform duration-300" />
            )}
            {editUnlocked ? 'Enable Editing' : 'Edit (Locked)'}
          </button>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-maroon-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src={coeLogo} alt="COE Logo" className="h-8 w-8 rounded" />
            <span className="font-bold text-lg text-gold-500">STEAM Education Development Framework (SEDF)</span>
          </div>
          <p className="text-maroon-200 text-sm">Ananda College Center of Excellence</p>
          <p className="text-gold-400 text-xs mt-2">VENI VIDI VICI - Building Future-Ready Students</p>
          <p className="text-maroon-300 text-xs mt-1">A Project of Old Anandians Professional Forum (OAPF)</p>
          <p className="text-maroon-400 text-xs mt-2">© 2025 OAPF. All Rights Reserved</p>
        </div>
      </footer>

      {showReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-maroon-900 backdrop-blur-md border-b border-maroon-800 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src={coeLogo} alt="COE Logo" className="h-8 w-8 rounded" />
                <h2 className="text-xl font-bold text-gold-500">Generated Report</h2>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={downloadReport}
                  className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-gold-500 to-gold-600 text-maroon-900 rounded-xl font-medium hover:from-gold-400 hover:to-gold-500 transition-all duration-200 shadow-md"
                >
                  <Download size={18} />
                  Download PDF
                </button>
                <button
                  onClick={() => setShowReport(false)}
                  className="p-2.5 text-gold-300 hover:text-gold-500 hover:bg-maroon-800 rounded-xl transition-all duration-200"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div ref={reportRef} className="p-8 overflow-auto max-h-[calc(90vh-80px)]">
              <div className="header text-center mb-10">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">
                  COE Program/Project Identification Report
                </h1>
                <h2 className="text-xl text-blue-600 font-medium">
                  {selectedCenter?.icon} {centerName || 'Center Name Not Specified'}
                </h2>
                <p className="text-gray-500 mt-3 text-sm">
                  Generated on {new Date().toLocaleDateString('en-US', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </div>

              <ReportSection title="Advanced Programs" programs={advancedPrograms} />
              <ReportSection title="STEAM Programs" programs={steamPrograms} />
              <ReportSection title="Cross Center Programs" programs={crossCenterPrograms} showCrossCenter />

              {notes && (
                <div className="notes bg-gradient-to-r from-amber-50 to-yellow-50 p-6 rounded-2xl border border-amber-200">
                  <h3 className="text-lg font-semibold text-amber-800 mb-3 flex items-center gap-2">
                    <BookOpen size={18} /> Additional Notes
                  </h3>
                  <p className="text-amber-900 whitespace-pre-wrap leading-relaxed">{notes}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PIN Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl overflow-hidden">
            <div className={`px-6 py-4 flex justify-between items-center ${
              pinModalMode === 'finalize' 
                ? 'bg-gradient-to-r from-purple-700 to-purple-900' 
                : 'bg-gradient-to-r from-amber-600 to-amber-800'
            }`}>
              <div className="flex items-center gap-3">
                <Lock size={24} className="text-white/80" />
                <h2 className="text-xl font-bold text-white">
                  {pinModalMode === 'finalize' ? 'Unlock Finalize' : 'Unlock Edit Mode'}
                </h2>
              </div>
              <button
                onClick={() => {
                  setShowPinModal(false)
                  setPinInput('')
                  setPinError(false)
                }}
                className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Enter the 4-digit PIN to unlock the {pinModalMode === 'finalize' ? 'finalize' : 'edit'} function.
              </p>
              <input
                type="password"
                maxLength={4}
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value.replace(/\D/g, ''))
                  setPinError(false)
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') handlePinSubmit()
                }}
                placeholder="Enter PIN"
                className={`w-full px-4 py-3 text-center text-2xl tracking-widest border-2 rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  pinError 
                    ? 'border-red-500 focus:ring-red-500 bg-red-50' 
                    : 'border-gray-300 focus:ring-purple-500 focus:border-purple-500'
                }`}
                autoFocus
              />
              {pinError && (
                <p className="text-red-500 text-sm mt-2 text-center">
                  Incorrect PIN. Please try again.
                </p>
              )}
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowPinModal(false)
                    setPinInput('')
                    setPinError(false)
                  }}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-700 rounded-xl font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handlePinSubmit}
                  disabled={pinInput.length !== 4}
                  className={`flex-1 px-4 py-3 text-white rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                    pinModalMode === 'finalize'
                      ? 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600'
                      : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500'
                  }`}
                >
                  Unlock
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default App
