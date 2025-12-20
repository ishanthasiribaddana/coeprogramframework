import { ArrowLeft, BookOpen, Users, Clock, Briefcase, GraduationCap, Plus, Trash2, FileText, CheckCircle, XCircle } from 'lucide-react'

const CENTERS = [
  { icon: '🤖', name: 'AI Center', finalized: true },
  { icon: '⚡', name: 'STEAM Hub', finalized: true },
  { icon: '📚', name: 'Language Center', finalized: false },
  { icon: '🎭', name: 'Auditorium', finalized: false },
  { icon: '🔬', name: 'Science Center', finalized: false },
  { icon: '💼', name: 'Entrepreneurship Center', finalized: false },
  { icon: '🎬', name: 'Media Center', finalized: false },
  { icon: '📐', name: 'Mathematics Center', finalized: false },
  { icon: '🎨', name: 'Fine Arts Center', finalized: false },
  { icon: '🎵', name: 'Performing Arts Center', finalized: false },
]

const ASSOCIATIONS = [
  'Information and Communication Technology Unit',
  "Inventors' Association",
  'Entrepreneurship Association',
  'Engineering Technology Association',
  'Robotics Association',
  'Green Energy Association',
  'Research and Exploration Society',
]

function Guide({ onBack }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-maroon-50 via-gold-50 to-maroon-100">
      {/* Header */}
      <header className="bg-maroon-900 border-b border-maroon-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <button
                onClick={onBack}
                className="flex items-center gap-2 px-4 py-2 text-gold-400 hover:text-gold-300 hover:bg-maroon-800 rounded-lg transition-all duration-200"
              >
                <ArrowLeft size={20} />
                <span className="hidden sm:inline">Back to App</span>
              </button>
            </div>
            <div className="flex items-center gap-3">
              <BookOpen size={24} className="text-gold-500" />
              <h1 className="text-xl font-bold text-gold-500">Center Leader Guide</h1>
            </div>
            <div className="w-32"></div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Introduction */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h2 className="text-2xl font-bold text-maroon-900 mb-4">Quick Start Guide for Adding Programs</h2>
          <p className="text-gray-600 mb-4">
            This guide will help center leaders understand how to add and manage program cards in the COE Program Framework application.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
            <p className="text-blue-800 text-sm">
              <strong>Application URL:</strong>{' '}
              <a href="https://ishanthasiribaddana.github.io/coeprogramframework/" className="underline hover:text-blue-600">
                https://ishanthasiribaddana.github.io/coeprogramframework/
              </a>
            </p>
          </div>
        </div>

        {/* Step 1: Select Center */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-violet-500 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold">1</div>
            <h3 className="text-xl font-bold text-gray-800">Select Your Center</h3>
          </div>
          <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
            <li>Open the application in your web browser</li>
            <li>Find your center icon in the <strong>center selection panel</strong> at the top</li>
            <li>Click on your center button</li>
            <li>Your center will be highlighted and the program sections will appear below</li>
          </ol>
          
          <h4 className="font-semibold text-gray-700 mb-3">Available Centers:</h4>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {CENTERS.map((center) => (
              <div
                key={center.name}
                className={`flex items-center gap-2 p-3 rounded-xl border ${
                  center.finalized
                    ? 'bg-gray-100 border-gray-300 text-gray-500'
                    : 'bg-white border-gray-200 text-gray-700'
                }`}
              >
                <span className="text-2xl">{center.icon}</span>
                <div>
                  <span className="text-sm font-medium">{center.name}</span>
                  {center.finalized && (
                    <span className="block text-xs text-orange-600">View Only</span>
                  )}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> AI Center and STEAM Hub programs are finalized and cannot be edited.
            </p>
          </div>
        </div>

        {/* Step 2: Program Sections */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center text-white font-bold">2</div>
            <h3 className="text-xl font-bold text-gray-800">Understanding Program Sections</h3>
          </div>
          <p className="text-gray-600 mb-6">Each center has <strong>three program sections</strong>:</p>
          
          <div className="space-y-4">
            <div className="border border-violet-200 rounded-xl p-4 bg-violet-50">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap size={20} className="text-violet-600" />
                <h4 className="font-semibold text-violet-800">1. Advanced Programs</h4>
              </div>
              <p className="text-violet-700 text-sm">Employment-ready skills not currently offered in the curriculum. Core programs specific to your center.</p>
            </div>
            
            <div className="border border-orange-200 rounded-xl p-4 bg-orange-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-orange-600">⚡</span>
                <h4 className="font-semibold text-orange-800">2. STEAM Programs</h4>
              </div>
              <p className="text-orange-700 text-sm">Cross-center integration with STEAM Hub. Collaborative projects combining multiple disciplines.</p>
            </div>
            
            <div className="border border-emerald-200 rounded-xl p-4 bg-emerald-50">
              <div className="flex items-center gap-2 mb-2">
                <span className="text-emerald-600">↔️</span>
                <h4 className="font-semibold text-emerald-800">3. Cross Center Programs</h4>
              </div>
              <p className="text-emerald-700 text-sm">Programs requested from or shared with other centers. Requires selecting the partnering center.</p>
            </div>
          </div>
        </div>

        {/* Step 3: Adding Programs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center text-white font-bold">3</div>
            <h3 className="text-xl font-bold text-gray-800">Adding a New Program</h3>
          </div>
          
          <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-6">
            <li>Click the <strong>"Add Program"</strong> button in the desired section</li>
            <li>A new program card will appear</li>
            <li>Fill in the following fields:</li>
          </ol>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gradient-to-r from-maroon-800 to-maroon-900 text-white">
                  <th className="p-3 text-left rounded-tl-lg">Field</th>
                  <th className="p-3 text-left">Description</th>
                  <th className="p-3 text-left rounded-tr-lg">Example</th>
                </tr>
              </thead>
              <tbody>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <BookOpen size={16} className="text-blue-500" />
                    Project/Module Name
                  </td>
                  <td className="p-3 text-gray-600">Name of the program</td>
                  <td className="p-3 text-gray-500 italic">"Creative Writing Workshop"</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <Clock size={16} className="text-green-500" />
                    Duration (Hours)
                  </td>
                  <td className="p-3 text-gray-600">Estimated hours per term</td>
                  <td className="p-3 text-gray-500 italic">"20-30"</td>
                </tr>
                <tr className="border-b border-gray-100">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <Briefcase size={16} className="text-orange-500" />
                    External Partnerships
                  </td>
                  <td className="p-3 text-gray-600">Industry partners involved</td>
                  <td className="p-3 text-gray-500 italic">"ABC Company, XYZ Foundation"</td>
                </tr>
                <tr className="border-b border-gray-100 bg-gray-50">
                  <td className="p-3 font-medium flex items-center gap-2">
                    <GraduationCap size={16} className="text-indigo-500" />
                    Career Guidance
                  </td>
                  <td className="p-3 text-gray-600">Companies for career guidance</td>
                  <td className="p-3 text-gray-500 italic">"Tech Corp, StartUp Inc"</td>
                </tr>
                <tr>
                  <td className="p-3 font-medium flex items-center gap-2">
                    <Users size={16} className="text-pink-500" />
                    Student Associations
                  </td>
                  <td className="p-3 text-gray-600">Click to select relevant associations</td>
                  <td className="p-3 text-gray-500 italic">Multiple selection allowed</td>
                </tr>
              </tbody>
            </table>
          </div>
          
          <div className="mt-4 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-purple-800 text-sm">
              <strong>For Cross Center Programs Only:</strong> Select the <strong>Cross Center</strong> dropdown to choose the partnering center.
            </p>
          </div>
        </div>

        {/* Step 4: Student Associations */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold">4</div>
            <h3 className="text-xl font-bold text-gray-800">Selecting Student Associations</h3>
          </div>
          
          <p className="text-gray-600 mb-4">Click on the association buttons to toggle selection:</p>
          
          <div className="flex gap-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-gradient-to-r from-pink-500 to-rose-500 text-white">Selected</span>
              <span className="text-gray-600">= Pink/Rose colored</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Not Selected</span>
              <span className="text-gray-600">= Gray colored</span>
            </div>
          </div>
          
          <h4 className="font-semibold text-gray-700 mb-3">Available Associations:</h4>
          <div className="flex flex-wrap gap-2">
            {ASSOCIATIONS.map((assoc) => (
              <span
                key={assoc}
                className="px-3 py-1.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600"
              >
                {assoc}
              </span>
            ))}
          </div>
        </div>

        {/* Step 5: Removing Programs */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-rose-600 rounded-xl flex items-center justify-center text-white font-bold">5</div>
            <h3 className="text-xl font-bold text-gray-800">Removing a Program</h3>
          </div>
          
          <ol className="list-decimal list-inside space-y-2 text-gray-600 mb-4">
            <li>Hover over the program card you want to remove</li>
            <li>Click the <strong>trash icon</strong> <Trash2 size={16} className="inline text-red-500" /> that appears in the top-right corner</li>
            <li>The program will be removed</li>
          </ol>
          
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <p className="text-amber-800 text-sm">
              <strong>Note:</strong> You cannot remove finalized programs (AI Center & STEAM Hub)
            </p>
          </div>
        </div>

        {/* Step 6: Reports */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white font-bold">6</div>
            <h3 className="text-xl font-bold text-gray-800">Generating Reports</h3>
          </div>
          
          <ol className="list-decimal list-inside space-y-2 text-gray-600">
            <li>After adding all your programs, click <strong>"Generate Report"</strong> button</li>
            <li>Review the formatted report</li>
            <li>Click <strong>"Download Report"</strong> to print or save as PDF</li>
          </ol>
        </div>

        {/* Step 7: Save, Finalize & Edit */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center text-white font-bold">7</div>
            <h3 className="text-xl font-bold text-gray-800">Save, Finalize & Edit Functions</h3>
          </div>
          
          <div className="space-y-6">
            {/* Save */}
            <div className="border border-blue-200 rounded-xl p-4 bg-blue-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">💾</span>
                <h4 className="font-semibold text-blue-800">Save All Programs</h4>
              </div>
              <ul className="space-y-2 text-blue-700 text-sm">
                <li>• Click <strong>"Save All Programs"</strong> button to save your work to the database</li>
                <li>• All program cards with module names will be saved</li>
                <li>• Empty program cards (without module names) will not be saved</li>
                <li>• A success message will appear when saved successfully</li>
              </ul>
            </div>
            
            {/* Finalize */}
            <div className="border border-green-200 rounded-xl p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✅</span>
                <h4 className="font-semibold text-green-800">Finalize Programs</h4>
              </div>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>• First, click <strong>"Unlock"</strong> button to enable finalization</li>
                <li>• Enter the <strong>PIN code</strong> when prompted</li>
                <li>• Click <strong>"Finalize Programs"</strong> to lock all programs</li>
                <li>• Finalized programs are marked as <strong>"approved"</strong> and cannot be edited</li>
                <li>• Program cards will show a green checkmark when finalized</li>
              </ul>
            </div>
            
            {/* Edit */}
            <div className="border border-amber-200 rounded-xl p-4 bg-amber-50">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-2xl">✏️</span>
                <h4 className="font-semibold text-amber-800">Enable Editing (After Finalization)</h4>
              </div>
              <ul className="space-y-2 text-amber-700 text-sm">
                <li>• If programs are finalized and you need to make changes:</li>
                <li>• Click <strong>"Unlock"</strong> button</li>
                <li>• Enter the <strong>PIN code</strong> when prompted</li>
                <li>• Click <strong>"Enable Editing"</strong> to unlock programs for editing</li>
                <li>• Programs will return to <strong>"draft"</strong> status</li>
                <li>• Make your changes and save again</li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 bg-purple-50 border border-purple-200 rounded-xl p-4">
            <p className="text-purple-800 text-sm">
              <strong>Important:</strong> The PIN code is required to finalize or enable editing. Contact your administrator if you don't have the PIN.
            </p>
          </div>
        </div>

        {/* Tips */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8 mb-8">
          <h3 className="text-xl font-bold text-gray-800 mb-6">Tips for Center Leaders</h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div className="border border-green-200 rounded-xl p-4 bg-green-50">
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle size={20} className="text-green-600" />
                <h4 className="font-semibold text-green-800">Do:</h4>
              </div>
              <ul className="space-y-2 text-green-700 text-sm">
                <li>✅ Fill in all fields for complete documentation</li>
                <li>✅ Use consistent naming conventions</li>
                <li>✅ Select all relevant student associations</li>
                <li>✅ Review programs before generating reports</li>
              </ul>
            </div>
            
            <div className="border border-red-200 rounded-xl p-4 bg-red-50">
              <div className="flex items-center gap-2 mb-3">
                <XCircle size={20} className="text-red-600" />
                <h4 className="font-semibold text-red-800">Don't:</h4>
              </div>
              <ul className="space-y-2 text-red-700 text-sm">
                <li>❌ Leave module names empty</li>
                <li>❌ Forget to specify duration estimates</li>
                <li>❌ Skip partnership information if available</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-gray-500 text-sm py-8">
          <p>COE Program Framework - Ananda College Center of Excellence</p>
        </div>
      </div>
    </div>
  )
}

export default Guide
