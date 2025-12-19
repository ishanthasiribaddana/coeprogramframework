import { useState, useRef, useEffect } from 'react'
import { 
  Plus, Trash2, FileText, Download, X, Building2, 
  GraduationCap, Zap, ArrowRightLeft, Clock, Users, 
  Briefcase, BookOpen, ChevronDown, Sparkles, Save, Loader2, CheckCircle, AlertCircle
} from 'lucide-react'
import './index.css'
import { programsApi, centersApi, healthCheck } from './api'

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
      associations: ['Information and Communication Technology Unit', "Inventors' Association", 'Robotics Association']
    },
    {
      id: 2,
      module: 'Robotics & Automation',
      crossCenter: '',
      duration: '25-35',
      partnerships: 'RoboticGen, MagicBit',
      careerGuidance: 'IOTex, TechFonist',
      associations: ['Robotics Association', 'Engineering Technology Association', "Inventors' Association"]
    },
    {
      id: 3,
      module: 'IoT & Smart Systems',
      crossCenter: '',
      duration: '20-30',
      partnerships: 'Revox, All Digital Specialty',
      careerGuidance: 'ELZIAN AGRO, RagenTec Systems',
      associations: ['Information and Communication Technology Unit', 'Green Energy Association', 'Engineering Technology Association']
    },
    {
      id: 4,
      module: 'Data Science & Analytics',
      crossCenter: '',
      duration: '25-30',
      partnerships: 'NCinga, MicroImage',
      careerGuidance: 'Calcey, Surge',
      associations: ['Information and Communication Technology Unit', 'Research and Exploration Society']
    },
    {
      id: 5,
      module: 'Cybersecurity Essentials',
      crossCenter: '',
      duration: '15-20',
      partnerships: 'Zone24',
      careerGuidance: 'Zone24',
      associations: ['Information and Communication Technology Unit']
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
      associations: ["Inventors' Association", 'Entrepreneurship Association']
    },
    {
      id: 7,
      module: 'Smart Agriculture Solutions',
      crossCenter: '',
      duration: '15-20',
      partnerships: 'ELZIAN AGRO',
      careerGuidance: 'ELZIAN AGRO',
      associations: ['Green Energy Association', 'Research and Exploration Society']
    },
    {
      id: 8,
      module: 'Renewable Energy & AI Integration',
      crossCenter: '',
      duration: '20-25',
      partnerships: 'Engineers Guild',
      careerGuidance: 'TechFonist',
      associations: ['Green Energy Association', 'Engineering Technology Association']
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
      associations: ['Information and Communication Technology Unit']
    },
    {
      id: 10,
      module: 'Technical Writing & Documentation',
      crossCenter: 'Language Center',
      duration: '10-12',
      partnerships: '',
      careerGuidance: '',
      associations: ['Information and Communication Technology Unit', 'Research and Exploration Society']
    },
    {
      id: 11,
      module: 'Business Model Development for Tech Startups',
      crossCenter: 'Entrepreneurship Center',
      duration: '15-20',
      partnerships: '',
      careerGuidance: '',
      associations: ['Entrepreneurship Association', "Inventors' Association"]
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
      associations: ["Inventors' Association", 'Engineering Technology Association', 'Research and Exploration Society']
    },
    {
      id: 102,
      module: 'Advanced Prototyping & Fabrication',
      crossCenter: '',
      duration: '25-30',
      partnerships: 'RoboticGen',
      careerGuidance: 'TechFonist',
      associations: ['Engineering Technology Association', "Inventors' Association"]
    },
    {
      id: 103,
      module: 'Scientific Research Methodology',
      crossCenter: '',
      duration: '20-25',
      partnerships: '',
      careerGuidance: '',
      associations: ['Research and Exploration Society']
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
      associations: ["Inventors' Association", 'Entrepreneurship Association', 'Green Energy Association']
    },
    {
      id: 105,
      module: 'Sustainable Technology Solutions',
      crossCenter: '',
      duration: '25-30',
      partnerships: 'Engineers Guild',
      careerGuidance: 'ELZIAN AGRO',
      associations: ['Green Energy Association', 'Research and Exploration Society']
    },
    {
      id: 106,
      module: 'Art-Tech Fusion Projects',
      crossCenter: '',
      duration: '20-25',
      partnerships: '',
      careerGuidance: '',
      associations: ["Inventors' Association", 'Entrepreneurship Association']
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
      associations: ['Information and Communication Technology Unit', 'Robotics Association']
    },
    {
      id: 108,
      module: 'Scientific Visualization & Media',
      crossCenter: 'Media Center',
      duration: '15-20',
      partnerships: '',
      careerGuidance: '',
      associations: ['Research and Exploration Society']
    },
    {
      id: 109,
      module: 'Mathematical Modeling for Projects',
      crossCenter: 'Mathematics Center',
      duration: '15-20',
      partnerships: '',
      careerGuidance: '',
      associations: ['Engineering Technology Association', 'Research and Exploration Society']
    }
  ],
  notes: 'STEAM Hub serves as the integration point for all centers. Projects here combine multiple disciplines and emphasize real-world problem solving. Industry partnerships provide mentorship and potential career pathways.'
}

// ProgramCard component - moved outside App to prevent re-creation on every render
const ProgramCard = ({ program, onUpdate, onRemove, showCrossCenter, index, onBlur, isAutoSaving, centerPrefix }) => (
  <div 
    className="group bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all duration-300 overflow-hidden relative"
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
    <div className="bg-gradient-to-r from-slate-50 to-gray-50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
      <span className="text-sm font-semibold text-gray-500">{centerPrefix ? `${centerPrefix} Program #${index + 1}` : `Program #${index + 1}`}</span>
      <button
        onClick={() => onRemove(program.id)}
        className="opacity-0 group-hover:opacity-100 p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200"
      >
        <Trash2 size={16} />
      </button>
    </div>
    <div className="p-5 space-y-4">
      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <BookOpen size={14} className="text-blue-500" />
          Project / Module Name
        </label>
        <input
          type="text"
          value={program.module}
          onChange={(e) => onUpdate(program.id, 'module', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
          placeholder="Enter module or project name..."
        />
      </div>

      {showCrossCenter && (
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <ArrowRightLeft size={14} className="text-purple-500" />
            Cross Center
          </label>
          <div className="relative">
            <select
              value={program.crossCenter}
              onChange={(e) => onUpdate(program.id, 'crossCenter', e.target.value)}
              className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white transition-all duration-200 text-gray-800 appearance-none cursor-pointer"
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
            <Clock size={14} className="text-green-500" />
            Duration (Hours)
          </label>
          <input
            type="text"
            value={program.duration}
            onChange={(e) => onUpdate(program.id, 'duration', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-green-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
            placeholder="e.g., 20-30"
          />
        </div>
        <div>
          <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
            <Briefcase size={14} className="text-orange-500" />
            External Partnerships
          </label>
          <input
            type="text"
            value={program.partnerships}
            onChange={(e) => onUpdate(program.id, 'partnerships', e.target.value)}
            className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-orange-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
            placeholder="Partner organizations..."
          />
        </div>
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <GraduationCap size={14} className="text-indigo-500" />
          Career Guidance / Placement
        </label>
        <input
          type="text"
          value={program.careerGuidance}
          onChange={(e) => onUpdate(program.id, 'careerGuidance', e.target.value)}
          className="w-full px-4 py-3 bg-gray-50 border-0 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all duration-200 text-gray-800 placeholder-gray-400"
          placeholder="Industry placement partners..."
        />
      </div>

      <div>
        <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
          <Users size={14} className="text-pink-500" />
          Student Associations
        </label>
        <div className="flex flex-wrap gap-2">
          {STUDENT_ASSOCIATIONS.map(assoc => (
            <button
              key={assoc}
              type="button"
              onClick={() => {
                const newAssocs = program.associations.includes(assoc)
                  ? program.associations.filter(a => a !== assoc)
                  : [...program.associations, assoc]
                onUpdate(program.id, 'associations', newAssocs)
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 ${
                program.associations.includes(assoc)
                  ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white shadow-md'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {assoc.length > 25 ? assoc.substring(0, 25) + '...' : assoc}
            </button>
          ))}
        </div>
      </div>
    </div>
  </div>
)

// ProgramSection component - moved outside App
const ProgramSection = ({ programs, onAdd, onUpdate, onRemove, onCardBlur, autoSavingId, title, description, icon: Icon, color, showCrossCenter = false, centerPrefix }) => (
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
      <button
        onClick={onAdd}
        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-maroon-800 to-maroon-900 text-gold-500 rounded-xl font-medium hover:from-maroon-700 hover:to-maroon-800 transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 border border-gold-500"
      >
        <Plus size={18} />
        Add Program
      </button>
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
  const reportRef = useRef(null)
  
  // Database connection and save states
  const [dbConnected, setDbConnected] = useState(false)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState(null) // 'success', 'error', null
  const [loading, setLoading] = useState(false)
  const [autoSavingId, setAutoSavingId] = useState(null) // Track which program is auto-saving

  const selectedCenter = CENTERS.find(c => c.name === centerName)

  // Check database connection on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        await healthCheck()
        setDbConnected(true)
      } catch (error) {
        console.log('Database not connected - using local mode')
        setDbConnected(false)
      }
    }
    checkConnection()
  }, [])

  // Load saved data from database when center is selected
  const loadCenterData = async (centerIdNum) => {
    if (!dbConnected) return false
    
    setLoading(true)
    try {
      const response = await programsApi.getByCenter(centerIdNum)
      if (response.success && response.data) {
        const { advanced, steam, crossCenter } = response.data
        
        if (advanced && advanced.length > 0) {
          setAdvancedPrograms(advanced.map(p => ({
            id: p.program_id,
            module: p.module_name || '',
            crossCenter: p.crossCenterRequest?.center_name || '',
            duration: p.duration_min_hours ? `${p.duration_min_hours}-${p.duration_max_hours}` : '',
            partnerships: p.partners?.map(pt => pt.partner_name).join(', ') || '',
            careerGuidance: p.placements?.map(pl => pl.partner_name).join(', ') || '',
            associations: p.associations?.map(a => a.association_name) || []
          })))
        }
        
        if (steam && steam.length > 0) {
          setSteamPrograms(steam.map(p => ({
            id: p.program_id,
            module: p.module_name || '',
            crossCenter: '',
            duration: p.duration_min_hours ? `${p.duration_min_hours}-${p.duration_max_hours}` : '',
            partnerships: p.partners?.map(pt => pt.partner_name).join(', ') || '',
            careerGuidance: p.placements?.map(pl => pl.partner_name).join(', ') || '',
            associations: p.associations?.map(a => a.association_name) || []
          })))
        }
        
        if (crossCenter && crossCenter.length > 0) {
          setCrossCenterPrograms(crossCenter.map(p => ({
            id: p.program_id,
            module: p.module_name || '',
            crossCenter: p.crossCenterRequest?.center_name || '',
            duration: p.duration_min_hours ? `${p.duration_min_hours}-${p.duration_max_hours}` : '',
            partnerships: p.partners?.map(pt => pt.partner_name).join(', ') || '',
            careerGuidance: p.placements?.map(pl => pl.partner_name).join(', ') || '',
            associations: p.associations?.map(a => a.association_name) || []
          })))
        }
        
        setLoading(false)
        return true
      }
    } catch (error) {
      console.error('Error loading center data:', error)
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
    
    // Try to load from database first
    if (dbConnected) {
      const loaded = await loadCenterData(centerIndex)
      if (loaded) return
    }
    
    // Fall back to sample data or empty
    if (name === 'AI Center') {
      setAdvancedPrograms(AI_CENTER_DATA.advancedPrograms)
      setSteamPrograms(AI_CENTER_DATA.steamPrograms)
      setCrossCenterPrograms(AI_CENTER_DATA.crossCenterPrograms)
      setNotes(AI_CENTER_DATA.notes)
    } else if (name === 'STEAM Hub') {
      setAdvancedPrograms(STEAM_HUB_DATA.advancedPrograms)
      setSteamPrograms(STEAM_HUB_DATA.steamPrograms)
      setCrossCenterPrograms(STEAM_HUB_DATA.crossCenterPrograms)
      setNotes(STEAM_HUB_DATA.notes)
    } else {
      setAdvancedPrograms([emptyProgram()])
      setSteamPrograms([emptyProgram()])
      setCrossCenterPrograms([emptyProgram()])
      setNotes('')
    }
  }

  // Save all programs to database
  const saveAllData = async () => {
    if (!dbConnected || !centerId) {
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
      return
    }

    setSaving(true)
    setSaveStatus(null)

    try {
      // Get program type IDs (1=Advanced, 2=STEAM, 3=Cross Center)
      const programTypeIds = { advanced: 1, steam: 2, crossCenter: 3 }

      // Save Advanced Programs
      for (const program of advancedPrograms) {
        if (program.module.trim()) {
          const [minHours, maxHours] = (program.duration || '0-0').split('-').map(Number)
          await programsApi.create({
            center_id: centerId,
            program_type_id: programTypeIds.advanced,
            module_name: program.module,
            duration_min_hours: minHours || null,
            duration_max_hours: maxHours || null,
            description: `Partnerships: ${program.partnerships}, Career Guidance: ${program.careerGuidance}`,
          })
        }
      }

      // Save STEAM Programs
      for (const program of steamPrograms) {
        if (program.module.trim()) {
          const [minHours, maxHours] = (program.duration || '0-0').split('-').map(Number)
          await programsApi.create({
            center_id: centerId,
            program_type_id: programTypeIds.steam,
            module_name: program.module,
            duration_min_hours: minHours || null,
            duration_max_hours: maxHours || null,
            description: `Partnerships: ${program.partnerships}, Career Guidance: ${program.careerGuidance}`,
          })
        }
      }

      // Save Cross Center Programs
      for (const program of crossCenterPrograms) {
        if (program.module.trim()) {
          const [minHours, maxHours] = (program.duration || '0-0').split('-').map(Number)
          const crossCenterIdx = CENTERS.findIndex(c => c.name === program.crossCenter) + 1
          await programsApi.create({
            center_id: centerId,
            program_type_id: programTypeIds.crossCenter,
            module_name: program.module,
            duration_min_hours: minHours || null,
            duration_max_hours: maxHours || null,
            description: `Partnerships: ${program.partnerships}, Career Guidance: ${program.careerGuidance}`,
            cross_center_id: crossCenterIdx > 0 ? crossCenterIdx : null,
          })
        }
      }

      setSaveStatus('success')
      setTimeout(() => setSaveStatus(null), 3000)
    } catch (error) {
      console.error('Error saving data:', error)
      setSaveStatus('error')
      setTimeout(() => setSaveStatus(null), 3000)
    } finally {
      setSaving(false)
    }
  }

  const addProgram = (setter) => {
    setter(prev => [...prev, emptyProgram()])
  }

  const removeProgram = (setter, id) => {
    setter(prev => prev.length > 1 ? prev.filter(p => p.id !== id) : prev)
  }

  const updateProgram = (setter, id, field, value) => {
    setter(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p))
  }

  // Auto-save a single program when leaving its card
  const autoSaveProgram = async (programId, programType) => {
    if (!dbConnected || !centerId) return

    // Find the program in the appropriate array
    let program = null
    let programTypeId = 1
    
    if (programType === 'advanced') {
      program = advancedPrograms.find(p => p.id === programId)
      programTypeId = 1
    } else if (programType === 'steam') {
      program = steamPrograms.find(p => p.id === programId)
      programTypeId = 2
    } else if (programType === 'crossCenter') {
      program = crossCenterPrograms.find(p => p.id === programId)
      programTypeId = 3
    }

    if (!program || !program.module.trim()) return

    setAutoSavingId(programId)

    try {
      const [minHours, maxHours] = (program.duration || '0-0').split('-').map(Number)
      const crossCenterIdx = program.crossCenter ? CENTERS.findIndex(c => c.name === program.crossCenter) + 1 : null

      await programsApi.create({
        center_id: centerId,
        program_type_id: programTypeId,
        module_name: program.module,
        duration_min_hours: minHours || null,
        duration_max_hours: maxHours || null,
        description: `Partnerships: ${program.partnerships || ''}, Career Guidance: ${program.careerGuidance || ''}`,
        cross_center_id: crossCenterIdx > 0 ? crossCenterIdx : null,
      })

      // Brief success indication
      setTimeout(() => setAutoSavingId(null), 500)
    } catch (error) {
      console.error('Auto-save error:', error)
      setAutoSavingId(null)
    }
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
          <p>COE Program Framework - Ananda College Center of Excellence</p>
          <p>This report was automatically generated on ${new Date().toLocaleString()}</p>
        </div>
      </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 via-gold-50 to-maroon-100">
      {/* Header */}
      <header className="bg-maroon-900 border-b border-maroon-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <img src="/coe-logo.png" alt="COE Logo" className="h-10 w-10 rounded-lg shadow-lg" />
              <div>
                <h1 className="text-xl font-bold text-gold-500">
                  COE Program Framework
                </h1>
                <p className="text-xs text-maroon-200 hidden sm:block">Center of Excellence - Ananda College</p>
              </div>
            </div>
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
              <h3 className="font-bold text-gray-800 mb-2">Quick Guide</h3>
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
            programs={advancedPrograms} 
            onAdd={() => addProgram(setAdvancedPrograms)}
            onUpdate={(id, field, value) => updateProgram(setAdvancedPrograms, id, field, value)}
            onRemove={(id) => removeProgram(setAdvancedPrograms, id)}
            onCardBlur={(id) => autoSaveProgram(id, 'advanced')}
            autoSavingId={autoSavingId}
            title="Advanced Programs" 
            description="Employment-ready skills not currently offered"
            icon={GraduationCap}
            color="from-violet-500 to-purple-600"
            centerPrefix={selectedCenter?.name?.replace(/ (Center|Hub)$/i, '')}
          />

          <ProgramSection 
            programs={steamPrograms} 
            onAdd={() => addProgram(setSteamPrograms)}
            onUpdate={(id, field, value) => updateProgram(setSteamPrograms, id, field, value)}
            onRemove={(id) => removeProgram(setSteamPrograms, id)}
            onCardBlur={(id) => autoSaveProgram(id, 'steam')}
            autoSavingId={autoSavingId}
            title="STEAM Programs" 
            description="Cross-center integration with STEAM Hub"
            icon={Zap}
            color="from-orange-500 to-red-600"
            centerPrefix={selectedCenter?.name?.replace(/ (Center|Hub)$/i, '')}
          />

          <ProgramSection 
            programs={crossCenterPrograms} 
            onAdd={() => addProgram(setCrossCenterPrograms)}
            onUpdate={(id, field, value) => updateProgram(setCrossCenterPrograms, id, field, value)}
            onRemove={(id) => removeProgram(setCrossCenterPrograms, id)}
            onCardBlur={(id) => autoSaveProgram(id, 'crossCenter')}
            autoSavingId={autoSavingId}
            title="Cross Center Programs" 
            description="Programs requested from other centers"
            icon={ArrowRightLeft}
            color="from-emerald-500 to-teal-600"
            showCrossCenter={true}
            centerPrefix={selectedCenter?.name?.replace(/ (Center|Hub)$/i, '')}
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
            disabled={!centerName || saving || !dbConnected}
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
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-16 bg-maroon-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center gap-3 mb-3">
            <img src="/coe-logo.png" alt="COE Logo" className="h-8 w-8 rounded" />
            <span className="font-bold text-lg text-gold-500">COE Program Framework</span>
          </div>
          <p className="text-maroon-200 text-sm">Ananda College Center of Excellence</p>
          <p className="text-gold-400 text-xs mt-2">VENI VIDI VICI - Building Future-Ready Students</p>
        </div>
      </footer>

      {showReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-5xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="sticky top-0 bg-maroon-900 backdrop-blur-md border-b border-maroon-800 px-6 py-4 flex justify-between items-center">
              <div className="flex items-center gap-3">
                <img src="/coe-logo.png" alt="COE Logo" className="h-8 w-8 rounded" />
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
    </div>
  )
}

export default App
