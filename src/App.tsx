/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  FileSpreadsheet, 
  FileText, 
  Printer, 
  Calendar, 
  UserCheck, 
  UserX, 
  Clock, 
  Upload, 
  Compass, 
  Settings, 
  CheckCircle,
  Eye,
  PenTool,
  RotateCcw,
  Edit3,
  Signature,
  FileDown,
  Folder,
  CheckSquare,
  Award,
  ChevronDown
} from 'lucide-react';
import { TeacherRecord, DocumentConfig } from './types';
import SignaturePad from './components/SignaturePad';
import { 
  KHMER_DAYS, 
  KHMER_LUNAR_DAYS, 
  KHMER_LUNAR_MONTHS, 
  KHMER_ZODIAC_YEARS, 
  KHMER_ERAS, 
  getKhmerSolarDate, 
  convertToKhmerDigits 
} from './utils/khmerDateHelper';
import { 
  exportToMsWord, 
  exportToExcel, 
  getFullLunarString 
} from './utils/documentExporters';

// Simple initial mock dataset to provide beautiful immediate demo content
const INITIAL_TEACHERS: TeacherRecord[] = [
  {
    id: 't-1',
    no: 1,
    name: 'ចាន់ ភារិទ្ធ',
    gender: 'ប្រុស',
    remarks: 'បង្រៀនម៉ោងទី១-២',
    // AM Shift
    statusAM: 'វត្តមាន',
    timeInAM: '07:00 AM',
    signatureInAM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,20 Q30,5 50,25 T90,15" stroke="blue" stroke-width="2" fill="none"/></svg>',
    locationInAM: '11.5564° N, 104.9282° E (វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ)',
    timeOutAM: '11:30 AM',
    signatureOutAM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M15,25 Q35,5 50,30 T85,10" stroke="blue" stroke-width="2" fill="none"/></svg>',
    locationOutAM: '11.5564° N, 104.9282° E (វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ)',
    // PM Shift
    statusPM: 'វត្តមាន',
    timeInPM: '01:00 PM',
    signatureInPM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,20 Q30,5 50,25 T90,15" stroke="blue" stroke-width="2" fill="none"/></svg>',
    locationInPM: '11.5564° N, 104.9282° E',
    timeOutPM: '05:00 PM',
    signatureOutPM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M15,25 Q35,5 50,30 T85,10" stroke="blue" stroke-width="2" fill="none"/></svg>',
    locationOutPM: '11.5564° N, 104.9282° E',
    // Fallbacks
    status: 'វត្តមាន',
    timeIn: '07:00 AM',
    signatureIn: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,20 Q30,5 50,25 T90,15" stroke="blue" stroke-width="2" fill="none"/></svg>',
    timeOut: '11:30 AM',
    signatureOut: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M15,25 Q35,5 50,30 T85,10" stroke="blue" stroke-width="2" fill="none"/></svg>'
  },
  {
    id: 't-2',
    no: 2,
    name: 'ស៊ន សុជាតា',
    gender: 'ស្រី',
    remarks: 'ប្រធានក្រុមបច្ចេកទេស',
    // AM Shift
    statusAM: 'វត្តមាន',
    timeInAM: '07:15 AM',
    signatureInAM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 C30,5 40,35 90,20" stroke="blue" stroke-width="1.8" fill="none"/></svg>',
    locationInAM: '11.5564° N, 104.9282° E',
    timeOutAM: '11:45 AM',
    signatureOutAM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 C40,-5 50,40 90,15" stroke="blue" stroke-width="1.8" fill="none"/></svg>',
    locationOutAM: '11.5564° N, 104.9282° E',
    // PM Shift
    statusPM: 'វត្តមាន',
    timeInPM: '01:15 PM',
    signatureInPM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 C30,5 40,35 90,20" stroke="blue" stroke-width="1.8" fill="none"/></svg>',
    locationInPM: '11.5564° N, 104.9282° E',
    timeOutPM: '05:00 PM',
    signatureOutPM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 C40,-5 50,40 90,15" stroke="blue" stroke-width="1.8" fill="none"/></svg>',
    locationOutPM: '11.5564° N, 104.9282° E',
    // Fallbacks
    status: 'វត្តមាន',
    timeIn: '07:15 AM',
    signatureIn: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 C30,5 40,35 90,20" stroke="blue" stroke-width="1.8" fill="none"/></svg>',
    timeOut: '11:45 AM',
    signatureOut: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M10,25 C40,-5 50,40 90,15" stroke="blue" stroke-width="1.8" fill="none"/></svg>'
  },
  {
    id: 't-3',
    no: 3,
    name: 'កែវ មុនីរ័ត្ន',
    gender: 'ប្រុស',
    remarks: '',
    // AM Shift
    statusAM: 'វត្តមាន',
    timeInAM: '07:05 AM',
    signatureInAM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M12,18 Q40,30 50,15 T88,25" stroke="black" stroke-width="2" fill="none"/></svg>',
    locationInAM: '11.5564° N, 104.9282° E',
    timeOutAM: '11:30 AM',
    signatureOutAM: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M15,15 Q35,35 60,10 T90,20" stroke="black" stroke-width="2" fill="none"/></svg>',
    locationOutAM: '11.5564° N, 104.9282° E',
    // PM Shift
    statusPM: 'អវត្តមាន',
    timeInPM: '-',
    signatureInPM: null,
    locationInPM: null,
    timeOutPM: '-',
    signatureOutPM: null,
    locationOutPM: null,
    // Fallbacks
    status: 'វត្តមាន',
    timeIn: '07:05 AM',
    signatureIn: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M12,18 Q40,30 50,15 T88,25" stroke="black" stroke-width="2" fill="none"/></svg>',
    timeOut: '11:30 AM',
    signatureOut: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="40"><path d="M15,15 Q35,35 60,10 T90,20" stroke="black" stroke-width="2" fill="none"/></svg>'
  },
  {
    id: 't-4',
    no: 4,
    name: 'លី ស្រីនីន',
    gender: 'ស្រី',
    remarks: 'ច្បាប់ឈឺផ្ទាល់ខ្លួន',
    // AM Shift
    statusAM: 'ច្បាប់',
    timeInAM: '-',
    signatureInAM: null,
    locationInAM: null,
    timeOutAM: '-',
    signatureOutAM: null,
    locationOutAM: null,
    // PM Shift
    statusPM: 'ច្បាប់',
    timeInPM: '-',
    signatureInPM: null,
    locationInPM: null,
    timeOutPM: '-',
    signatureOutPM: null,
    locationOutPM: null,
    // Fallbacks
    status: 'ច្បាប់',
    timeIn: '-',
    signatureIn: null,
    timeOut: '-',
    signatureOut: null
  },
  {
    id: 't-5',
    no: 5,
    name: 'ហេង គឹមស៊ន',
    gender: 'ប្រុស',
    remarks: 'យឺតដោយសារធ្លាយកង់',
    // AM Shift
    statusAM: 'យឺត',
    timeInAM: '08:15 AM',
    signatureInAM: null,
    locationInAM: null,
    timeOutAM: '11:30 AM',
    signatureOutAM: null,
    locationOutAM: null,
    // PM Shift
    statusPM: 'វត្តមាន',
    timeInPM: '01:00 PM',
    signatureInPM: null,
    locationInPM: '11.5564° N, 104.9282° E',
    timeOutPM: '05:00 PM',
    signatureOutPM: null,
    locationOutPM: '11.5564° N, 104.9282° E',
    // Fallbacks
    status: 'យឺត',
    timeIn: '08:15 AM',
    signatureIn: null,
    timeOut: '11:30 AM',
    signatureOut: null
  }
];

const DEFAULT_CONFIG: DocumentConfig = {
  mottoLine1: 'ព្រះរាជាណាចក្រកម្ពុជា',
  mottoLine2: 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
  schoolName: 'វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ',
  title: 'បញ្ជីស្រង់វត្តមានលោកគ្រូអ្នកគ្រូ',
  subTitle: 'ប្រចាំវេនព្រឹក និងល្ងាច បង្រៀនប្រចាំថ្ងៃ',
  
  lunarDayOfWeek: 'សៅរ៍',
  lunarDayNum: '១៥ កើត',
  lunarMonth: 'មិគសិរ',
  lunarZodiac: 'មមី',
  lunarEra: 'អដ្ឋស័ក',
  lunarBE: '២៥៧០',
  
  customLunarDate: 'ថ្ងៃសៅរ៍ ១៥កើត ខែមិគសិរ ឆ្នាំមមី អដ្ឋស័ក ព.ស. ២៥៧០',
  customSolarDate: getKhmerSolarDate(new Date()),
  
  makerTitle: 'អ្នកធ្វើតារាង',
  makerName: 'គ្រូប្រចាំការ',
  approverTitle: 'បានឃើញ និងឯកភាព',
  approverSubTitle: 'នាយកវិទ្យាល័យ',
  approverName: 'លោកគ្រូ មាស សុភ័ក្ត្រ',
  
  useCustomDateText: false
};

export default function App() {
  const [teachers, setTeachers] = useState<TeacherRecord[]>(INITIAL_TEACHERS);
  const [config, setConfig] = useState<DocumentConfig>(DEFAULT_CONFIG);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'editor' | 'config' | 'preview'>('dashboard');
  const [activeShift, setActiveShift] = useState<'AM' | 'PM'>('AM'); // ព្រឹក=AM, រសៀល=PM
  const [selectedTeacherId, setSelectedTeacherId] = useState<string>('t-2'); // Selected teacher simulated account
  
  // Modals / Overlays triggers
  const [activeSignatureTarget, setActiveSignatureTarget] = useState<{
    teacherId: string;
    type: 'in' | 'out';
  } | null>(null);
  
  const [newTeacherForm, setNewTeacherForm] = useState({
    name: '',
    gender: 'ប្រុស' as 'ប្រុស' | 'ស្រី',
    timeIn: '07:00 AM',
    timeOut: '11:30 AM',
    remarks: '',
    status: 'វត្តមាន' as 'វត្តមាន' | 'អវត្តមាន' | 'ច្បាប់' | 'យឺត'
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingTeacherId, setEditingTeacherId] = useState<string | null>(null);
  const [isCapturingGPS, setIsCapturingGPS] = useState(false);

  // Stats Counters based on active shift!
  const totalCount = teachers.length;
  const femaleCount = teachers.filter(t => t.gender === 'ស្រី').length;
  const maleCount = totalCount - femaleCount;
  
  const presentCount = teachers.filter(t => (activeShift === 'AM' ? t.statusAM : t.statusPM) === 'វត្តមាន').length;
  const absentCount = teachers.filter(t => (activeShift === 'AM' ? t.statusAM : t.statusPM) === 'អវត្តមាន').length;
  const leaveCount = teachers.filter(t => (activeShift === 'AM' ? t.statusAM : t.statusPM) === 'ច្បាប់').length;
  const lateCount = teachers.filter(t => (activeShift === 'AM' ? t.statusAM : t.statusPM) === 'យឺត').length;

  // Real GPS Geolocation fetch helper
  const getCurrentGPSLocation = (): Promise<string | null> => {
    if (!navigator.geolocation) return Promise.resolve(null);
    return new Promise((resolve) => {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          resolve(`${latitude.toFixed(4)}° N, ${longitude.toFixed(4)}° E`);
        },
        () => {
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    });
  };

  // Manual or instant GPS refresh helper for any cell
  const handleRefreshLocation = async (id: string, type: 'in' | 'out') => {
    setIsCapturingGPS(true);
    const coords = await getCurrentGPSLocation();
    const finalCoords = coords ? `📍 ${coords}` : "📍 11.5564° N, 104.9282° E"; // default beauty placeholder if blocked
    
    setTeachers(prev => prev.map(t => {
      if (t.id === id) {
        if (activeShift === 'AM') {
          return {
            ...t,
            locationInAM: type === 'in' ? finalCoords : t.locationInAM,
            locationOutAM: type === 'out' ? finalCoords : t.locationOutAM
          };
        } else {
          return {
            ...t,
            locationInPM: type === 'in' ? finalCoords : t.locationInPM,
            locationOutPM: type === 'out' ? finalCoords : t.locationOutPM
          };
        }
      }
      return t;
    }));
    setIsCapturingGPS(false);
  };

  // Handler to add a teacher
  const handleAddTeacherSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTeacherForm.name.trim()) return;

    const newTeacher: TeacherRecord = {
      id: `teacher-${Date.now()}`,
      no: teachers.length + 1,
      name: newTeacherForm.name.trim(),
      gender: newTeacherForm.gender,
      remarks: newTeacherForm.remarks,
      
      // Morning Shift (AM)
      statusAM: newTeacherForm.status,
      timeInAM: newTeacherForm.status === 'អវត្តមាន' || newTeacherForm.status === 'ច្បាប់' ? '-' : newTeacherForm.timeIn,
      signatureInAM: null,
      locationInAM: null,
      timeOutAM: newTeacherForm.status === 'អវត្តមាន' || newTeacherForm.status === 'ច្បាប់' ? '-' : newTeacherForm.timeOut,
      signatureOutAM: null,
      locationOutAM: null,

      // Afternoon Shift (PM)
      statusPM: newTeacherForm.status,
      timeInPM: newTeacherForm.status === 'អវត្តមាន' || newTeacherForm.status === 'ច្បាប់' ? '-' : '01:00 PM',
      signatureInPM: null,
      locationInPM: null,
      timeOutPM: newTeacherForm.status === 'អវត្តមាន' || newTeacherForm.status === 'ច្បាប់' ? '-' : '05:00 PM',
      signatureOutPM: null,
      locationOutPM: null,

      // Fallbacks
      status: newTeacherForm.status,
      timeIn: newTeacherForm.status === 'អវត្តមាន' || newTeacherForm.status === 'ច្បាប់' ? '-' : newTeacherForm.timeIn,
      timeOut: newTeacherForm.status === 'អវត្តមាន' || newTeacherForm.status === 'ច្បាប់' ? '-' : newTeacherForm.timeOut,
      signatureIn: null,
      signatureOut: null
    };

    setTeachers([...teachers, newTeacher]);
    setNewTeacherForm({
      name: '',
      gender: 'ប្រុស',
      timeIn: '07:00 AM',
      timeOut: '11:30 AM',
      remarks: '',
      status: 'វត្តមាន'
    });
    setIsAddingNew(false);
  };

  // Handler to edit inline status
  const handleStatusChange = (id: string, newStatus: 'វត្តមាន' | 'អវត្តមាន' | 'ច្បាប់' | 'យឺត') => {
    setTeachers(prev => prev.map(teacher => {
      if (teacher.id === id) {
        if (activeShift === 'AM') {
          let update: Partial<TeacherRecord> = { statusAM: newStatus };
          if (newStatus === 'អវត្តមាន' || newStatus === 'ច្បាប់') {
            update.timeInAM = '-';
            update.timeOutAM = '-';
            update.signatureInAM = null;
            update.signatureOutAM = null;
            update.locationInAM = null;
            update.locationOutAM = null;
          } else {
            update.timeInAM = '07:00 AM';
            update.timeOutAM = '11:30 AM';
          }
          // keeping fallback sync for visual safety
          return { 
            ...teacher, 
            ...update, 
            status: newStatus,
            timeIn: update.timeInAM || teacher.timeIn,
            timeOut: update.timeOutAM || teacher.timeOut,
            signatureIn: update.signatureInAM === null ? null : teacher.signatureIn,
            signatureOut: update.signatureOutAM === null ? null : teacher.signatureOut
          };
        } else {
          let update: Partial<TeacherRecord> = { statusPM: newStatus };
          if (newStatus === 'អវត្តមាន' || newStatus === 'ច្បាប់') {
            update.timeInPM = '-';
            update.timeOutPM = '-';
            update.signatureInPM = null;
            update.signatureOutPM = null;
            update.locationInPM = null;
            update.locationOutPM = null;
          } else {
            update.timeInPM = '01:00 PM';
            update.timeOutPM = '05:00 PM';
          }
          return { 
            ...teacher, 
            ...update,
            status: newStatus,
            timeIn: update.timeInPM || teacher.timeIn,
            timeOut: update.timeOutPM || teacher.timeOut,
            signatureIn: update.signatureInPM === null ? null : teacher.signatureIn,
            signatureOut: update.signatureOutPM === null ? null : teacher.signatureOut
          };
        }
      }
      return teacher;
    }));
  };

  const handleUpdateField = (id: string, field: keyof TeacherRecord, value: any) => {
    setTeachers(prev => prev.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const deleteTeacher = (id: string) => {
    const remaining = teachers.filter(t => t.id !== id);
    // Recalculate Serial numbers
    const updated = remaining.map((t, index) => ({ ...t, no: index + 1 }));
    setTeachers(updated);
  };

  const resetAllData = () => {
    if (confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យឡើងវិញមែនទេ? ទិន្នន័យចាស់ទាំងអស់នឹងត្រូវបាត់បង់។')) {
      setTeachers(INITIAL_TEACHERS);
      setConfig(DEFAULT_CONFIG);
    }
  };

  const handleSaveSignature = async (dataUrl: string) => {
    if (activeSignatureTarget) {
      const { teacherId, type } = activeSignatureTarget;
      
      // Auto capture GPS coords
      setIsCapturingGPS(true);
      const gps = await getCurrentGPSLocation();
      const locationText = gps ? `📍 ${gps}` : "📍 11.5564° N, 104.9282° E";
      setIsCapturingGPS(false);

      setTeachers(prev => prev.map(t => {
        if (t.id === teacherId) {
          if (activeShift === 'AM') {
            return {
              ...t,
              // AM signature
              signatureInAM: type === 'in' ? dataUrl : t.signatureInAM,
              locationInAM: type === 'in' ? locationText : t.locationInAM,
              signatureOutAM: type === 'out' ? dataUrl : t.signatureOutAM,
              locationOutAM: type === 'out' ? locationText : t.locationOutAM,
              // Fallback
              signatureIn: type === 'in' ? dataUrl : t.signatureIn,
              signatureOut: type === 'out' ? dataUrl : t.signatureOut
            };
          } else {
            return {
              ...t,
              // PM signature
              signatureInPM: type === 'in' ? dataUrl : t.signatureInPM,
              locationInPM: type === 'in' ? locationText : t.locationInPM,
              signatureOutPM: type === 'out' ? dataUrl : t.signatureOutPM,
              locationOutPM: type === 'out' ? locationText : t.locationOutPM,
              // Fallback
              signatureIn: type === 'in' ? dataUrl : t.signatureIn,
              signatureOut: type === 'out' ? dataUrl : t.signatureOut
            };
          }
        }
        return t;
      }));
      setActiveSignatureTarget(null);
    }
  };

  // Filtered teachers list based on Search query
  const filteredTeachers = teachers.filter(t => 
    t.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    t.remarks.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#f5f2ec] text-stone-800 flex flex-col antialiased">
      {/* Dynamic Navigation Header - Hidden on physical printing */}
      <header className="no-print bg-[#292524] text-stone-100 shadow-md border-b-4 border-[#b45309] relative z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            <div className="bg-[#b45309] text-stone-100 p-2.5 rounded-xl shadow-md border border-[#d97706]">
              <Compass className="w-7 h-7 animate-pulse text-amber-100" />
            </div>
            <div>
              <h1 className="font-moul tracking-wide text-[17px] text-amber-100">
                ព្រះរាជាណាចក្រកម្ពុជា
              </h1>
              <p className="font-sans font-medium text-xs text-stone-300 mt-1">
                ប្រព័ន្ធគ្រប់គ្រង និងស្រង់វត្តមានលោកគ្រូអ្នកគ្រូឌីជីថល (Education Suite)
              </p>
            </div>
          </div>

          {/* Quick Actions Panel */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => exportToExcel(teachers, config)}
              className="flex items-center gap-2 font-sans text-xs font-semibold px-4 py-2.5 bg-emerald-700 hover:bg-emerald-800 border border-emerald-600 text-white rounded-xl shadow transition duration-200 cursor-pointer"
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>នាំចេញ Excel</span>
            </button>

            <button
              onClick={() => exportToMsWord(teachers, config)}
              className="flex items-center gap-2 font-sans text-xs font-semibold px-4 py-2.5 bg-stone-700 hover:bg-[#44403c] border border-[#57534e] text-white rounded-xl shadow transition duration-200 cursor-pointer"
            >
              <FileDown className="w-4 h-4" />
              <span>នាំចេញ Ms Word</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('preview');
                setTimeout(() => window.print(), 250);
              }}
              className="flex items-center gap-2 font-sans text-xs font-semibold px-4 py-2.5 bg-[#b45309] hover:bg-[#9a3412] border border-[#d97706] text-white rounded-xl shadow transition duration-200 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>បោះពុម្ព ឬ PDF</span>
            </button>

            <button
              onClick={resetAllData}
              title="ជម្រះ និងកំណត់ឡើងវិញ"
              className="p-2.5 text-stone-300 hover:bg-stone-800 hover:text-white rounded-xl border border-stone-700 transition"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="border-t border-stone-800 bg-stone-950/40">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex gap-1.5 py-2 overflow-x-auto scrollbar-none">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`flex items-center gap-2 font-sans font-medium text-xs px-4 py-2 rounded-lg transition shrink-0 ${activeTab === 'dashboard' ? 'bg-[#b45309] text-white font-semibold shadow' : 'text-stone-300 hover:bg-[#57534e]/40 hover:text-white'}`}
              >
                <Compass className="w-4 h-4 text-[#c5a059]" />
                <span>📱 ទំព័រដើមគ្រូ (Teacher Home)</span>
              </button>

              <button
                onClick={() => setActiveTab('editor')}
                className={`flex items-center gap-2 font-sans font-medium text-xs px-4 py-2 rounded-lg transition shrink-0 ${activeTab === 'editor' ? 'bg-[#b45309] text-white font-semibold shadow' : 'text-stone-300 hover:bg-[#57534e]/40 hover:text-white'}`}
              >
                <UserCheck className="w-4 h-4 text-[#c5a059]" />
                <span>📋 បញ្ជីវត្តមានលម្អិត ({teachers.length})</span>
              </button>

              <button
                onClick={() => setActiveTab('config')}
                className={`flex items-center gap-2 font-sans font-medium text-xs px-4 py-2 rounded-lg transition shrink-0 ${activeTab === 'config' ? 'bg-[#b45309] text-white font-semibold shadow' : 'text-stone-300 hover:bg-[#57534e]/40 hover:text-white'}`}
              >
                <Settings className="w-4 h-4 text-[#c5a059]" />
                <span>⚙️ កំណត់សម្គាល់ឯកសារ</span>
              </button>

              <button
                onClick={() => setActiveTab('preview')}
                className={`flex items-center gap-2 font-sans font-medium text-xs px-4 py-2 rounded-lg transition shrink-0 ${activeTab === 'preview' ? 'bg-[#b45309] text-white font-semibold shadow' : 'text-stone-300 hover:bg-[#57534e]/40 hover:text-white'}`}
              >
                <Eye className="w-4 h-4 text-[#c5a059]" />
                <span>📄 ទិដ្ឋភាពមុនបោះពុម្ព (A4 Print)</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main workspace box - Hidden on printing except for the preview print sheet itself */}
      <main className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-grow flex flex-col gap-6 no-print">

        {/* TAB 0: INTERACTIVE TEACHER MOBILE DASHBOARD SIMULATOR */}
        {activeTab === 'dashboard' && (() => {
          // Find currently simulated logged-in teacher and calculate stats
          const currentTeacher = teachers.find(t => t.id === selectedTeacherId) || teachers[0];
          
          return (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
              
              {/* Left Column: Interactive Settings to test simulator */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-5 border border-stone-200 shadow-sm flex flex-col gap-5">
                <div>
                  <h3 className="font-moul text-xs text-[#b45309] flex items-center gap-1.5 mb-1.5">
                    ⚙️ កាប៊ីនសាកល្បងវត្តមាន (Simulator Controller)
                  </h3>
                  <p className="text-[11px] font-sans text-stone-500">
                    សូមប្រើប្រាស់ប្រអប់ខាងក្រោមដើម្បីជ្រើសរើសឈ្មោះគ្រូ និងក្លែងធ្វើជាគណនីគ្រូដែលកំពុងឡុកអ៊ីនបប្រើប្រាស់ស្មាតហ្វូនផ្ទាល់ខ្លួន។
                  </p>
                </div>

                {/* Teacher select switcher */}
                <div className="bg-[#fcfaf4] p-4 rounded-2xl border border-stone-150">
                  <label className="text-xs font-serif font-bold text-stone-700 block mb-2">
                    គណនីគ្រូបច្ចុប្បន្ន (Current Active Teacher Account):
                  </label>
                  <select
                    value={selectedTeacherId}
                    onChange={(e) => setSelectedTeacherId(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl text-xs font-sans bg-white border border-stone-250 text-stone-800 focus:outline-none focus:ring-2 focus:ring-[#b45309] font-medium cursor-pointer"
                  >
                    {teachers.map(t => (
                      <option key={t.id} value={t.id}>
                        {t.name} ({t.gender}) - {t.remarks || 'គ្រូបង្រៀន'}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Description helper card */}
                <div className="border border-amber-100 rounded-2xl p-4 bg-amber-50/50 flex flex-col gap-2.5 text-xs text-stone-700 leading-relaxed font-sans">
                  <span className="font-bold text-[#b45309] flex items-center gap-1.5">
                    💡 ណែនាំអំពីរបៀបដំណើរការហត្ថលេខា:
                  </span>
                  <p>
                    ១. ចុចលើប៊ូតុងចុះវត្តមាន <strong>«ចូលព្រឹក»</strong> ឬ <strong>«ចេញរសៀល»</strong> ណាមួយនៅលើទូរស័ព្ទដៃខាងស្តាំ។
                  </p>
                  <p>
                    ២. ផ្ទាំងហត្ថលេខានឹងបង្ហាញឡើង។ អ្នកអាច <strong>គូសផ្ទាល់ដៃ</strong> ឬបន្តិចបន្តួច ឬរក្សាទុក <strong>ស្កេនរូបភាព/កាមេរ៉ា</strong> ដែលប្រព័ន្ធចម្រាញ់យកតែទឹកប៊ិចស្អាត។
                  </p>
                  <p>
                    ៣. ព័ត៌មានវត្តមាន ទីតាំង GPS និងហត្ថលេខានឹងត្រូវបញ្ចូលទៅក្នុងតារាងបោះពុម្ពជាផ្លូវការភ្លាមៗ!
                  </p>
                </div>

                {/* Shortcuts directly to other screens */}
                <div className="flex flex-col gap-1 text-[11px] border-t pt-4 text-stone-400">
                  <span className="font-sans font-semibold">ទិន្នន័យរួមទូទាំងសាលា៖</span>
                  <div className="grid grid-cols-2 gap-2 mt-1.5">
                    <button 
                      onClick={() => setActiveTab('editor')}
                      className="text-left font-sans hover:text-[#b45309] hover:underline"
                    >
                      &bull; បញ្ជីវត្តមានដិតលម្អិត &rarr;
                    </button>
                    <button 
                      onClick={() => setActiveTab('preview')}
                      className="text-left font-sans hover:text-[#b45309] hover:underline"
                    >
                      &bull; ទំព័រមុនបោះពុម្ព A4 &rarr;
                    </button>
                  </div>
                </div>
              </div>

              {/* Right Column: Simulated Mobile Phone Frame (as per user screenshot) */}
              <div className="lg:col-span-8 flex justify-center">
                <div className="w-full max-w-[420px] bg-stone-900 rounded-[48px] p-3 shadow-2xl border-[10px] border-stone-850 relative overflow-hidden ring-4 ring-offset-4 ring-stone-950/20">
                  
                  {/* Camera hole / Notch display */}
                  <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-center">
                    <div className="w-3.5 h-3.5 rounded-full bg-stone-800"></div>
                  </div>

                  {/* Android Simulator Screen Canvas */}
                  <div className="bg-[#fbfcff] rounded-[38px] overflow-hidden min-h-[720px] flex flex-col relative text-stone-800 select-none pb-12 shadow-inner">
                    
                    {/* Simulator Top Notification bar */}
                    <div className="bg-white/80 backdrop-blur px-6 pt-3.5 pb-1 flex items-center justify-between text-[11px] font-sans font-bold text-stone-700 tracking-tight z-20">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-sans text-stone-400">Smart / Cellcard</span>
                        <span>7:48 PM</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-[9px] text-[#4f46e5] font-extrabold bg-[#e0e7ff] px-1 rounded scale-90">VoLTE 4G</span>
                        <div className="flex items-center gap-0.5">
                          <span className="w-1.5 h-2 bg-stone-700 block rounded-full"></span>
                          <span className="w-1.5 h-2.5 bg-stone-700 block rounded-full"></span>
                          <span className="w-1.5 h-3 bg-stone-700 block rounded-full"></span>
                          <span className="w-1.5 h-3 bg-stone-300 block rounded-full"></span>
                        </div>
                        <div className="w-5 h-2.5 border border-stone-500 rounded-sm relative p-0.5 ml-0.5 flex">
                          <div className="h-full w-[80%] bg-stone-700 rounded-2xs"></div>
                          <div className="absolute right-[-2.5px] top-[2.5px] w-0.5 h-1 bg-stone-500 rounded-full"></div>
                        </div>
                      </div>
                    </div>

                    {/* Simulator App Content Area (Responsive container layout) */}
                    <div className="p-4 flex-grow flex flex-col gap-4 overflow-y-auto max-h-[640px] scrollbar-none [content-visibility:auto]">
                      
                      {/* Subtitle / Header Page name matching screenshot: ទំព័រដើម */}
                      <div className="text-center pb-1">
                        <span className="font-moul text-[10px] text-stone-550 border-b border-dashed border-stone-200 pb-1 px-4">
                          ទំព័រដើម
                        </span>
                      </div>

                      {/* Header Section: Welcome User */}
                      <div className="flex items-center gap-3 bg-white p-3.5 rounded-2xl border border-stone-100 shadow-sm mt-1">
                        <div className="w-11 h-11 rounded-full bg-[#cbd5e1] border-2 border-white shadow-sm flex items-center justify-center text-stone-500">
                          <span className="text-sm font-sans font-bold">
                            {currentTeacher.gender === 'ស្រី' ? '👩‍🏫' : '👨‍🏫'}
                          </span>
                        </div>
                        <div className="flex-grow">
                          <span className="text-[9.5px] font-sans text-stone-400 block tracking-tight leading-none mb-1">លោកគ្រូ/អ្នកគ្រូ</span>
                          <h4 className="font-moul text-[12px] text-slate-800 leading-none">
                            {currentTeacher.name}
                          </h4>
                        </div>
                      </div>

                      {/* Blue banner matching physical screenshot exactly */}
                      <div className="bg-gradient-to-r from-sky-600 to-sky-500 text-white p-4 rounded-2xl relative shadow-md overflow-hidden animate-fade-in group">
                        {/* Decorative watermark */}
                        <div className="absolute top-[-10px] right-[-10px] w-24 h-24 bg-sky-400 opacity-20 rounded-full"></div>
                        
                        <div className="flex gap-3 relative z-10">
                          <div className="bg-white/10 w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
                            <span className="text-lg">📢</span>
                          </div>
                          <div className="flex-grow flex flex-col gap-1.5">
                            <h5 className="font-sans font-extrabold text-[12px] leading-snug">
                              ភ្ជាប់ជាមួយ Telegram Bot ផ្លូវការ
                            </h5>
                            <p className="text-[10px] text-sky-50 leading-relaxed font-sans font-medium">
                              ដើម្បីទទួលបាននូវសេចក្តីជូនដំណឹងវត្តមាន ការកាត់កងម៉ោង ថែមម៉ោង និងវិញ្ញាបនបត្រទាន់ហេតុការណ៍...
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between mt-3 bg-white/10 p-2 rounded-xl border border-white/10 relative z-10">
                          <span className="text-[9.5px] font-sans font-bold text-sky-100">
                            Bot: @MoEYSAttendanceBot
                          </span>
                          <button
                            type="button"
                            onClick={() => alert(" Bot Telegram ត្រូវបានតភ្ជាប់ដោយជោគជ័យ!")}
                            className="bg-white text-sky-700 hover:bg-sky-50 transition text-[9px] font-sans font-bold py-1 px-2 rounded-lg cursor-pointer flex items-center gap-1 shrink-0"
                          >
                            <span>🚀 ភ្ជាប់ bot</span>
                          </button>
                        </div>
                      </div>

                      <div className="text-center font-sans font-bold text-[9.5px] text-[#2563eb] hover:text-[#1d4ed8] cursor-pointer flex items-center justify-center gap-1">
                        <span>មើលមុខងារទាំងអស់ដែលគ្រូនឹងទទួលបាន</span>
                        <ChevronDown className="w-3 h-3 text-[#2563eb]" />
                      </div>

                      {/* Counters widgets matching screenshot (1, 1, 0 counters) */}
                      <div className="grid grid-cols-3 gap-2.5 my-1">
                        {/* Session counter */}
                        <div className="bg-sky-50/50 p-3 rounded-2xl border border-sky-100 text-center flex flex-col items-center shadow-2xs">
                          <div className="w-8 h-8 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 mb-1">
                            <Folder className="w-4 h-4" />
                          </div>
                          <span className="font-sans font-bold text-lg text-sky-750">{convertToKhmerDigits(1)}</span>
                          <span className="text-[9px] text-sky-550 font-sans leading-none mt-0.5">វគ្គសរុប</span>
                        </div>

                        {/* Processing counter */}
                        <div className="bg-emerald-50/50 p-3 rounded-2xl border border-emerald-100 text-center flex flex-col items-center shadow-2xs">
                          <div className="w-8 h-8 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mb-1">
                            <CheckSquare className="w-4 h-4" />
                          </div>
                          <span className="font-sans font-bold text-lg text-emerald-750">{convertToKhmerDigits(1)}</span>
                          <span className="text-[9px] text-emerald-550 font-sans leading-none mt-0.5">កំពុងដំណើរការ</span>
                        </div>

                        {/* Certificates counter */}
                        <div className="bg-[#fffbeb] p-3 rounded-2xl border border-amber-100 text-center flex flex-col items-center shadow-2xs">
                          <div className="w-8 h-8 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600 mb-1">
                            <Award className="w-4 h-4" />
                          </div>
                          <span className="font-sans font-bold text-lg text-amber-750">{convertToKhmerDigits(0)}</span>
                          <span className="text-[9px] text-amber-550 font-sans leading-none mt-0.5">វិញ្ញាបនបត្រ</span>
                        </div>
                      </div>

                      {/* Todays schedule heading */}
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <h4 className="font-moul text-[11px] text-stone-800">វគ្គមានថ្ងៃនេះ</h4>
                          <span className="text-[9px] text-stone-400 font-sans cursor-pointer">🕒 ស្រស់ៗ</span>
                        </div>
                        <p className="text-[10px] text-[#4f46e5] font-sans font-bold italic leading-snug border-l-2 border-[#4f46e5] pl-2 bg-indigo-50/35 py-1.5 rounded-r-xl">
                          ខេត្តបាត់ដំបង_GEIP-AF_ការគ្រប់គ្រងសាលារៀន ដើម្បីគាំទ្រការអនុវត្តន៍ស្តង់ដារសាលារៀនគំរូ
                        </p>
                      </div>

                      {/* 4 CHECK-IN BUTTON CARDS Row - Exact screenshot replica */}
                      <div className="grid grid-cols-4 gap-1.5 my-1">
                        
                        {/* 1. AM Check-In */}
                        <div 
                          onClick={() => {
                            setActiveShift('AM');
                            setActiveSignatureTarget({ teacherId: currentTeacher.id, type: 'in' });
                          }}
                          className={`rounded-[18px] p-2 border text-center flex flex-col items-center justify-between cursor-pointer transition min-h-[110px] ${
                            currentTeacher.signatureInAM 
                              ? 'bg-emerald-50/50 border-emerald-400 text-emerald-800 shadow-sm' 
                              : 'bg-white hover:bg-stone-50 border-emerald-200/80 text-[#10b981] shadow-2xs'
                          }`}
                        >
                          {/* Circle login icon in green */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0 ${currentTeacher.signatureInAM ? 'bg-emerald-100 text-emerald-700' : 'bg-green-50 text-green-600'}`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                              <polyline points="10 17 15 12 10 7" />
                              <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                          </div>
                          
                          <div className="w-full">
                            <span className={`text-[10px] font-moul block leading-tight ${currentTeacher.signatureInAM ? 'text-emerald-800' : 'text-green-600'}`}>ចូលព្រឹក</span>
                            {currentTeacher.signatureInAM ? (
                              <div className="flex flex-col items-center mt-1">
                                <span className="text-[7.5px] font-mono font-bold text-emerald-600 leading-none">{currentTeacher.timeInAM}</span>
                                <div className="w-11 h-6 bg-white border border-emerald-100 rounded mt-0.5 p-0.5 flex items-center justify-center">
                                  <img src={currentTeacher.signatureInAM} alt="signature" className="max-h-full max-w-full object-contain filter contrast-125" referrerPolicy="no-referrer" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[8px] text-stone-400 font-sans leading-none mt-1 block">ចុះចតដើម្បីចូល</span>
                            )}
                          </div>
                        </div>

                        {/* 2. AM Check-Out */}
                        <div 
                          onClick={() => {
                            setActiveShift('AM');
                            setActiveSignatureTarget({ teacherId: currentTeacher.id, type: 'out' });
                          }}
                          className={`rounded-[18px] p-2 border text-center flex flex-col items-center justify-between cursor-pointer transition min-h-[110px] ${
                            currentTeacher.signatureOutAM 
                              ? 'bg-blue-50/50 border-blue-400 text-blue-850 shadow-sm' 
                              : 'bg-white hover:bg-stone-50 border-blue-200/80 text-blue-550 shadow-2xs'
                          }`}
                        >
                          {/* Circle logout icon in blue */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0 ${currentTeacher.signatureOutAM ? 'bg-blue-100 text-blue-700' : 'bg-blue-50 text-blue-500'}`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                          </div>
                          
                          <div className="w-full">
                            <span className={`text-[10px] font-moul block leading-tight ${currentTeacher.signatureOutAM ? 'text-blue-850' : 'text-blue-550'}`}>ចេញព្រឹក</span>
                            {currentTeacher.signatureOutAM ? (
                              <div className="flex flex-col items-center mt-1">
                                <span className="text-[7.5px] font-mono font-bold text-blue-600 leading-none">{currentTeacher.timeOutAM}</span>
                                <div className="w-11 h-6 bg-white border border-blue-100 rounded mt-0.5 p-0.5 flex items-center justify-center">
                                  <img src={currentTeacher.signatureOutAM} alt="signature" className="max-h-full max-w-full object-contain filter contrast-125" referrerPolicy="no-referrer" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[8px] text-stone-400 font-sans leading-none mt-1 block">ចុះចតដើម្បីចេញ</span>
                            )}
                          </div>
                        </div>

                        {/* 3. PM Check-In */}
                        <div 
                          onClick={() => {
                            setActiveShift('PM');
                            setActiveSignatureTarget({ teacherId: currentTeacher.id, type: 'in' });
                          }}
                          className={`rounded-[18px] p-2 border text-center flex flex-col items-center justify-between cursor-pointer transition min-h-[110px] ${
                            currentTeacher.signatureInPM 
                              ? 'bg-amber-50/50 border-amber-400 text-amber-850 shadow-sm' 
                              : 'bg-white hover:bg-stone-50 border-amber-250 text-amber-600 shadow-2xs'
                          }`}
                        >
                          {/* Circle login icon in yellow */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0 ${currentTeacher.signatureInPM ? 'bg-amber-100 text-amber-700' : 'bg-amber-50 text-amber-500'}`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                              <polyline points="10 17 15 12 10 7" />
                              <line x1="15" y1="12" x2="3" y2="12" />
                            </svg>
                          </div>
                          
                          <div className="w-full">
                            <span className={`text-[10px] font-moul block leading-tight ${currentTeacher.signatureInPM ? 'text-amber-850' : 'text-amber-550'}`}>ចូលរសៀល</span>
                            {currentTeacher.signatureInPM ? (
                              <div className="flex flex-col items-center mt-1">
                                <span className="text-[7.5px] font-mono font-bold text-amber-600 leading-none">{currentTeacher.timeInPM}</span>
                                <div className="w-11 h-6 bg-white border border-amber-100 rounded mt-0.5 p-0.5 flex items-center justify-center">
                                  <img src={currentTeacher.signatureInPM} alt="signature" className="max-h-full max-w-full object-contain filter contrast-125" referrerPolicy="no-referrer" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[8px] text-stone-400 font-sans leading-none mt-1 block">ចុះចតដើម្បីចូល</span>
                            )}
                          </div>
                        </div>

                        {/* 4. PM Check-Out */}
                        <div 
                          onClick={() => {
                            setActiveShift('PM');
                            setActiveSignatureTarget({ teacherId: currentTeacher.id, type: 'out' });
                          }}
                          className={`rounded-[18px] p-2 border text-center flex flex-col items-center justify-between cursor-pointer transition min-h-[110px] ${
                            currentTeacher.signatureOutPM 
                              ? 'bg-rose-50/50 border-rose-450 text-rose-850 shadow-sm' 
                              : 'bg-white hover:bg-stone-50 border-rose-200 text-rose-500/90 shadow-2xs'
                          }`}
                        >
                          {/* Circle logout icon in red */}
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center mb-1 shrink-0 ${currentTeacher.signatureOutPM ? 'bg-rose-100 text-rose-700' : 'bg-rose-50/70 text-rose-500'}`}>
                            <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                              <polyline points="16 17 21 12 16 7" />
                              <line x1="21" y1="12" x2="9" y2="12" />
                            </svg>
                          </div>
                          
                          <div className="w-full">
                            <span className={`text-[10px] font-moul block leading-tight ${currentTeacher.signatureOutPM ? 'text-rose-850' : 'text-rose-500/90'}`}>ចេញរសៀល</span>
                            {currentTeacher.signatureOutPM ? (
                              <div className="flex flex-col items-center mt-1">
                                <span className="text-[7.5px] font-mono font-bold text-rose-600 leading-none">{currentTeacher.timeOutPM}</span>
                                <div className="w-11 h-6 bg-white border border-rose-100 rounded mt-0.5 p-0.5 flex items-center justify-center">
                                  <img src={currentTeacher.signatureOutPM} alt="signature" className="max-h-full max-w-full object-contain filter contrast-125" referrerPolicy="no-referrer" />
                                </div>
                              </div>
                            ) : (
                              <span className="text-[8px] text-stone-400 font-sans leading-none mt-1 block">ចុះចតដើម្បីចេញ</span>
                            )}
                          </div>
                        </div>

                      </div>

                      {/* My Course Detail with Circular state gauge */}
                      <div className="bg-white rounded-3xl p-4 border border-stone-100 shadow-sm flex flex-col gap-3.5">
                        <div className="flex justify-between items-center pb-2 border-b border-stone-100">
                          <span className="font-moul text-[10.5px] text-stone-800">វគ្គសិក្សារបស់ខ្ញុំ</span>
                          <span className="text-[9.5px] text-[#2563eb] cursor-pointer hover:underline">មើលទាំងអស់ &rsaquo;</span>
                        </div>

                        <div className="flex items-center justify-between gap-4">
                          {/* Course title details */}
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-lg shadow-sm shrink-0">
                              🏫
                            </div>
                            <div>
                              <h5 className="font-sans font-extrabold text-[11px] text-stone-800 max-w-[200px] leading-tight">
                                ខេត្តបាត់ដំបង_GEIP-AF_ការគ្រប់គ្រងសាលារៀន
                              </h5>
                              <p className="text-[9px] font-sans text-stone-450 mt-1">ដើម្បីគាំទ្រការអនុវត្តន៍ស្តង់ដារសាលារៀនគំរូ</p>
                              <p className="text-[8.5px] font-mono text-[#b45309] font-semibold mt-1 bg-amber-50 rounded px-1.5 py-0.5 w-max">
                                📅 18 ឧសភា - 24 ឧសភា 2026
                              </p>
                            </div>
                          </div>

                          {/* Beautiful SVG circular gauge */}
                          <div className="relative w-14 h-14 flex items-center justify-center shrink-0">
                            {/* SVG track */}
                            <svg className="w-full h-full rotate-[-95deg]">
                              <circle cx="28" cy="28" r="22" stroke="#e2e8f0" strokeWidth="4" fill="transparent" />
                              <circle cx="28" cy="28" r="22" stroke="#4f46e5" strokeWidth="4" strokeDasharray="138" strokeDashoffset="55" fill="transparent" strokeLinecap="round" />
                            </svg>
                            <span className="absolute text-[11px] font-sans font-bold text-indigo-750">
                              {convertToKhmerDigits(40)}%
                            </span>
                          </div>
                        </div>
                      </div>

                       {/* Explore Categories (Bento Grid) mimicking user screenshot exactly */}
                      <div className="flex flex-col gap-2.5">
                        <div className="flex justify-between items-center">
                          <span className="font-moul text-[10.5px] text-stone-800">ស្វែងរកវគ្គបណ្តុះបណ្តាល</span>
                          <span className="text-[9.5px] text-[#2563eb] cursor-pointer hover:underline font-sans font-semibold">ទាំងអស់ &rsaquo;</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2.5">
                          {/* 1. Mathematics (Green block) */}
                          <div className="bg-[#10b981] hover:bg-[#059669] p-3 rounded-2xl text-white shadow-xs flex flex-col justify-between aspect-video relative overflow-hidden cursor-pointer transition">
                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-[10px] font-sans font-bold">123</div>
                            <div className="relative z-10 mt-2">
                              <h6 className="font-moul text-[9.5px] leading-tight mb-0.5">គណិតវិទ្យា</h6>
                              <p className="text-[8px] opacity-90 font-sans">{convertToKhmerDigits(14)} វគ្គសិក្សា</p>
                            </div>
                            <div className="absolute right-[-10px] bottom-[-10px] w-12 h-12 bg-white/10 rounded-full"></div>
                          </div>

                          {/* 2. Pedagogical Counseling (Brown-Orange block) */}
                          <div className="bg-[#c2410c] hover:bg-[#a23207] p-3 rounded-2xl text-white shadow-xs flex flex-col justify-between aspect-video relative overflow-hidden cursor-pointer transition">
                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs">🧑‍🏫</div>
                            <div className="relative z-10 mt-2">
                              <h6 className="font-moul text-[9.5px] leading-tight mb-0.5">ប្រឹក្សាគរុកោសល្យ</h6>
                              <p className="text-[8px] opacity-90 font-sans">{convertToKhmerDigits(9)} វគ្គសិក្សា</p>
                            </div>
                            <div className="absolute right-[-10px] bottom-[-10px] w-12 h-12 bg-white/10 rounded-full"></div>
                          </div>

                          {/* 3. Others (Slate block - ផ្សេងៗ) */}
                          <div className="bg-slate-600 hover:bg-slate-700 p-3 rounded-2xl text-white shadow-xs flex flex-col justify-between aspect-video relative overflow-hidden cursor-pointer transition">
                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs">📝</div>
                            <div className="relative z-10 mt-2">
                              <h6 className="font-moul text-[9.5px] leading-tight mb-0.5">ផ្សេង ៗ</h6>
                              <p className="text-[8px] opacity-90 font-sans">{convertToKhmerDigits(13)} វគ្គសិក្សា</p>
                            </div>
                            <div className="absolute right-[-10px] bottom-[-10px] w-12 h-12 bg-white/10 rounded-full"></div>
                          </div>

                          {/* 4. Model School standard (Orange block) */}
                          <div className="bg-[#ea580c] hover:bg-[#d94e06] p-3 rounded-2xl text-white shadow-xs flex flex-col justify-between aspect-video relative overflow-hidden cursor-pointer transition">
                            <div className="w-6 h-6 rounded-lg bg-white/20 flex items-center justify-center text-xs">🏫</div>
                            <div className="relative z-10 mt-2">
                              <h6 className="font-moul text-[9.5px] leading-tight mb-0.5">ស្តង់ដាសាលាគំរូ</h6>
                              <p className="text-[8px] opacity-90 font-sans">{convertToKhmerDigits(8)} វគ្គសិក្សា</p>
                            </div>
                            <div className="absolute right-[-10px] bottom-[-10px] w-12 h-12 bg-white/10 rounded-full"></div>
                          </div>

                          {/* 5. Reading (Cobalt Blue block) */}
                          <div className="bg-blue-600 hover:bg-blue-700 col-span-2 p-3.5 rounded-2xl text-white shadow-xs flex items-center justify-between relative overflow-hidden cursor-pointer transition">
                            <div className="flex items-center gap-3 relative z-10">
                              <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center text-xs">📖</div>
                              <div>
                                <h6 className="font-moul text-[9.5px] leading-none mb-0.5">អំណាន</h6>
                                <p className="text-[8px] opacity-90 font-sans">{convertToKhmerDigits(2)} វគ្គសិក្សា</p>
                              </div>
                            </div>
                            <div className="absolute right-[-15px] bottom-[-15px] w-16 h-16 bg-white/10 rounded-full"></div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Simulator Bottom Navigation persistent Tab Bar */}
                    <div className="absolute bottom-0 inset-x-0 h-14 bg-white border-t border-stone-200/50 px-4 flex items-center justify-between text-[8px] font-sans font-bold text-stone-400 z-20">
                      <div className="flex flex-col items-center gap-1 text-blue-600 cursor-pointer">
                        <span className="text-lg leading-none">🏠</span>
                        <span className="scale-95">ទំព័រដើម</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 hover:text-stone-850 cursor-pointer">
                        <span className="text-lg leading-none">📚</span>
                        <span className="scale-95 text-stone-500">វគ្គសិក្សា</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 hover:text-stone-850 cursor-pointer">
                        <span className="text-lg leading-none">🏆</span>
                        <span className="scale-95 text-stone-500">វឌ្ឍនភាព</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 hover:text-stone-850 cursor-pointer">
                        <span className="text-lg leading-none">🔍</span>
                        <span className="scale-95 text-stone-500">ស្វែងរក</span>
                      </div>
                      <div className="flex flex-col items-center gap-1 hover:text-stone-850 cursor-pointer">
                        <span className="text-lg leading-none">👤</span>
                        <span className="scale-95 text-stone-500">គណនី</span>
                      </div>
                    </div>

                    {/* Physical device Android soft buttons */}
                    <div className="absolute bottom-1 inset-x-0 h-4 flex items-center justify-around px-16 pointer-events-none z-20 opacity-40">
                      <div className="w-2.5 h-2.5 border border-stone-800 rotate-45 rounded-sm"></div>
                      <div className="w-3.5 h-3.5 border-2 border-stone-800 rounded-full"></div>
                      <div className="w-3 h-3 border border-stone-800 rounded-sm"></div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          );
        })()}

        {/* TAB 1: ATTENDANCE DATABASE EDITOR */}
        {activeTab === 'editor' && (
          <div className="flex flex-col gap-6">
            
            {/* Quick Analytics Counters Banner */}
            <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
              <div className="bg-[#fffdfa] p-4 rounded-2xl shadow-sm border border-stone-200/80 hover:border-stone-400 transition duration-150 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-sans text-stone-500 font-medium uppercase tracking-wide">គ្រូបង្រៀនសរុប</p>
                  <p className="font-sans font-bold text-2xl text-stone-800 mt-1">{convertToKhmerDigits(totalCount)} <span className="text-xs text-stone-400 font-normal">នាក់</span></p>
                </div>
                <div className="bg-stone-100 text-stone-700 p-2.5 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#fffdfa] p-4 rounded-2xl shadow-sm border border-stone-200/80 hover:border-stone-400 transition duration-150 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-sans text-stone-500 font-medium uppercase tracking-wide">គ្រូស្រី</p>
                  <p className="font-sans font-bold text-2xl text-rose-700 mt-1">{convertToKhmerDigits(femaleCount)} <span className="text-xs text-stone-400 font-normal">នាក់</span></p>
                </div>
                <div className="bg-rose-50 text-rose-700 p-2.5 rounded-xl">
                  <CheckCircle className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#fffdfa] p-4 rounded-2xl shadow-sm border border-stone-200/80 hover:border-stone-400 transition duration-150 flex items-center justify-between">
                <div>
                  <p className="text-[11px] font-sans text-stone-500 font-medium uppercase tracking-wide">វត្តមានថ្ងៃនេះ</p>
                  <p className="font-sans font-bold text-2xl text-emerald-700 mt-1">{convertToKhmerDigits(presentCount)} <span className="text-xs text-stone-400 font-normal">នាក់</span></p>
                </div>
                <div className="bg-emerald-50 text-emerald-700 p-2.5 rounded-xl">
                  <UserCheck className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#fffdfa] p-4 rounded-2xl shadow-sm border border-stone-200/80 hover:border-stone-400 transition duration-150 flex items-center justify-between col-span-1">
                <div>
                  <p className="text-[11px] font-sans text-stone-500 font-medium uppercase tracking-wide">ច្បាប់ / យឺត</p>
                  <p className="font-sans font-bold text-2xl text-amber-700 mt-1">
                    {convertToKhmerDigits(leaveCount)} <span className="text-xs text-stone-400 font-normal">ច្បាប់</span> / {convertToKhmerDigits(lateCount)} <span className="text-xs text-stone-400 font-normal">យឺត</span>
                  </p>
                </div>
                <div className="bg-amber-50 text-[#b45309] p-2.5 rounded-xl">
                  <Clock className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-[#fffdfa] p-4 rounded-2xl shadow-sm border border-stone-200/80 hover:border-stone-400 transition duration-150 flex items-center justify-between col-span-2 lg:col-span-1">
                <div>
                  <p className="text-[11px] font-sans text-stone-500 font-medium uppercase tracking-wide">អវត្តមានថ្ងៃនេះ</p>
                  <p className="font-sans font-bold text-2xl text-red-700 mt-1">{convertToKhmerDigits(absentCount)} <span className="text-xs text-stone-400 font-normal">នាក់</span></p>
                </div>
                <div className="bg-red-50 text-red-700 p-2.5 rounded-xl">
                  <UserX className="w-5 h-5" />
                </div>
              </div>
            </div>

            {/* List and Controls section */}
            <div className="bg-[#fffdfa] rounded-2xl border border-stone-200 shadow-sm overflow-hidden flex flex-col">
              
              {/* Filter controls panel */}
              <div className="p-4 sm:p-5 border-b border-stone-200 bg-[#fcfaf3] flex flex-col lg:flex-row items-center justify-between gap-4">
                
                {/* Search string */}
                <div className="relative w-full lg:w-80">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="ស្វែងរកឈ្មោះគ្រូ ឬការកត់សម្គាល់..."
                    className="w-full pl-9 pr-4 py-2 rounded-xl text-xs font-sans bg-white border border-stone-200 text-stone-700 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-[#b45309] focus:border-[#b45309] transition"
                  />
                  <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none text-stone-400">
                    <Eye className="w-4 h-4 text-stone-450" />
                  </div>
                </div>

                {/* AM/PM Shift Session Toggle Slider */}
                <div className="bg-stone-200/50 p-1 rounded-2xl flex items-center gap-1">
                  <button
                    type="button"
                    onClick={() => setActiveShift('AM')}
                    className={`px-5 py-2 rounded-xl text-xs font-sans font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                      activeShift === 'AM' 
                        ? 'bg-[#b45309] text-white shadow-md' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/30'
                    }`}
                  >
                    <span className="text-base">🌅</span>
                    <span>វេនព្រឹក (Morning AM)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveShift('PM')}
                    className={`px-5 py-2 rounded-xl text-xs font-sans font-bold transition-all duration-150 flex items-center gap-2 cursor-pointer ${
                      activeShift === 'PM' 
                        ? 'bg-[#b45309] text-white shadow-md' 
                        : 'text-stone-600 hover:text-stone-900 hover:bg-stone-300/30'
                    }`}
                  >
                    <span className="text-base">🌇</span>
                    <span>វេនរសៀល (Afternoon PM)</span>
                  </button>
                </div>

                <div className="flex items-center gap-2.5 w-full lg:w-auto justify-end">
                  <button
                    onClick={() => setIsAddingNew(!isAddingNew)}
                    className="flex items-center justify-center gap-2 w-full lg:w-auto font-sans font-semibold text-xs text-white bg-[#b45309] hover:bg-[#9a3412] border border-[#d97706] px-5 py-2.5 rounded-xl shadow-md transition duration-200 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>បន្ថែមគ្រូបង្រៀន</span>
                  </button>
                </div>
              </div>

              {/* Collapsible Form for adding a new teacher */}
              {isAddingNew && (
                <form 
                  onSubmit={handleAddTeacherSubmit}
                  className="p-5 border-b border-stone-200 bg-[#faf8f3] grid grid-cols-1 md:grid-cols-3 gap-4"
                >
                  <div className="flex flex-col gap-1.5 col-span-1 md:col-span-2">
                    <label className="text-xs font-sans font-medium text-stone-650">ឈ្មោះលោកគ្រូ/អ្នកគ្រូ <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      required
                      value={newTeacherForm.name}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, name: e.target.value })}
                      placeholder="ឧ. ស៊ន សុជាតា"
                      className="w-full px-4 py-2 rounded-xl text-xs font-sans bg-white border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-medium text-stone-600">ភេទ <span className="text-red-500">*</span></label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setNewTeacherForm({ ...newTeacherForm, gender: 'ប្រុស' })}
                        className={`py-2 rounded-xl text-xs font-sans font-semibold border transition ${newTeacherForm.gender === 'ប្រុស' ? 'bg-[#b45309] border-[#b45309] text-white' : 'bg-white border-stone-200 text-stone-600'}`}
                      >
                        ប្រុស (Male)
                      </button>
                      <button
                        type="button"
                        onClick={() => setNewTeacherForm({ ...newTeacherForm, gender: 'ស្រី' })}
                        className={`py-2 rounded-xl text-xs font-sans font-semibold border transition ${newTeacherForm.gender === 'ស្រី' ? 'bg-[#8c2d19] border-[#8c2d19] text-white' : 'bg-white border-stone-200 text-stone-600'}`}
                      >
                        ស្រី (Female)
                      </button>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-medium text-stone-600">ស្ថានភាពវត្តមាន <span className="text-red-500">*</span></label>
                    <select
                      value={newTeacherForm.status}
                      onChange={(e: any) => setNewTeacherForm({ ...newTeacherForm, status: e.target.value })}
                      className="w-full px-4 py-2 rounded-xl text-xs font-sans bg-white border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]"
                    >
                      <option value="វត្តមាន">វត្តមាន (Present)</option>
                      <option value="ច្បាប់">ច្បាប់ (Leave/Permission)</option>
                      <option value="យឺត">យឺត (Late)</option>
                      <option value="អវត្តមាន">អវត្តមាន (Absent)</option>
                    </select>
                  </div>

                  {newTeacherForm.status !== 'អវត្តមាន' && newTeacherForm.status !== 'ច្បាប់' && (
                    <>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-medium text-stone-600">ម៉ោងចូល</label>
                        <input
                          type="text"
                          value={newTeacherForm.timeIn}
                          onChange={(e) => setNewTeacherForm({ ...newTeacherForm, timeIn: e.target.value })}
                          placeholder="e.g., 07:00 AM"
                          className="w-full px-4 py-2 rounded-xl text-xs font-sans bg-white border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]"
                        />
                      </div>
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-sans font-medium text-stone-600">ម៉ោងចេញ</label>
                        <input
                          type="text"
                          value={newTeacherForm.timeOut}
                          onChange={(e) => setNewTeacherForm({ ...newTeacherForm, timeOut: e.target.value })}
                          placeholder="e.g., 11:30 AM"
                          className="w-full px-4 py-2 rounded-xl text-xs font-sans bg-white border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]"
                        />
                      </div>
                    </>
                  )}

                  <div className="flex flex-col gap-1.5 col-span-1 md:col-span-3">
                    <label className="text-xs font-sans font-medium text-stone-600">កត់សម្គាល់ផ្សេងៗ (ផ្សេងៗ)</label>
                    <input
                      type="text"
                      value={newTeacherForm.remarks}
                      onChange={(e) => setNewTeacherForm({ ...newTeacherForm, remarks: e.target.value })}
                      placeholder="ឧ. បង្រៀនថ្នាក់ជំនួស, ជាប់ប្រជុំ..."
                      className="w-full px-4 py-2 rounded-xl text-xs font-sans bg-white border border-stone-200 text-stone-700 focus:outline-none focus:ring-2 focus:ring-[#b45309]"
                    />
                  </div>

                  <div className="col-span-1 md:col-span-3 flex justify-end gap-2 mt-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingNew(false)}
                      className="px-4 py-2 rounded-xl text-xs font-sans font-medium bg-stone-150 hover:bg-stone-200 text-stone-600 border border-transparent transition"
                    >
                      បោះបង់
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-sans font-semibold text-white bg-[#b45309] hover:bg-[#9a3412] transition"
                    >
                      រក្សាសមាជិកថ្មី
                    </button>
                  </div>
                </form>
              )}

              {/* Main Interactive Table Grid */}
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#fcfaf3] border-b border-stone-200 text-stone-700">
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 w-12 text-center">ល.រ</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600">គោត្តនាម-នាមខ្លួន</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 w-20 text-center">ភេទ</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 w-36 text-center">ស្ថានភាព ({activeShift})</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 w-32 text-center">ម៉ោងចូល</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 text-center">ហត្ថលេខាចូល & Location</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 w-32 text-center">ម៉ោងចេញ</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 text-center">ហត្ថលេខាចេញ & Location</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600">ផ្សេងៗ</th>
                      <th className="p-4 text-xs font-serif font-bold text-stone-600 w-16 text-center">សកម្មភាព</th>
                    </tr>
                  </thead>
                  
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {filteredTeachers.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="p-8 text-center text-slate-400 font-sans text-xs">
                          មិនមានទិន្នន័យលោកគ្រូអ្នកគ្រូស្របតាមការស្វែងរកឡើយ។
                        </td>
                      </tr>
                    ) : (
                      filteredTeachers.map((teacher) => {
                        const isEditing = editingTeacherId === teacher.id;
                        
                        // Active shift specific values cached locally
                        const currentStatus = activeShift === 'AM' ? (teacher.statusAM || 'វត្តមាន') : (teacher.statusPM || 'វត្តមាន');
                        const currentTimeIn = activeShift === 'AM' ? (teacher.timeInAM || '07:00 AM') : (teacher.timeInPM || '01:00 PM');
                        const currentTimeOut = activeShift === 'AM' ? (teacher.timeOutAM || '11:30 AM') : (teacher.timeOutPM || '05:00 PM');
                        const currentSignatureIn = activeShift === 'AM' ? teacher.signatureInAM : teacher.signatureInPM;
                        const currentSignatureOut = activeShift === 'AM' ? teacher.signatureOutAM : teacher.signatureOutPM;
                        const currentLocationIn = activeShift === 'AM' ? teacher.locationInAM : teacher.locationInPM;
                        const currentLocationOut = activeShift === 'AM' ? teacher.locationOutAM : teacher.locationOutPM;

                        return (
                          <tr key={teacher.id} className="hover:bg-slate-50/50 transition duration-150">
                            
                            {/* Serial Number */}
                            <td className="p-3.5 text-xs font-sans text-center text-stone-500">
                              {convertToKhmerDigits(teacher.no)}
                            </td>

                            {/* Name Input/Cell */}
                            <td className="p-3.5 text-xs font-sans font-semibold text-slate-800">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={teacher.name}
                                  onChange={(e) => handleUpdateField(teacher.id, 'name', e.target.value)}
                                  className="w-full px-2 py-1.5 border border-amber-200 rounded font-sans focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                                />
                              ) : (
                                <span className="hover:text-[#b45309] transition duration-150">{teacher.name}</span>
                              )}
                            </td>

                            {/* Gender Switch */}
                            <td className="p-3.5 text-xs font-sans text-center">
                              {isEditing ? (
                                <select
                                  value={teacher.gender}
                                  onChange={(e) => handleUpdateField(teacher.id, 'gender', e.target.value)}
                                  className="px-2 py-1 bg-white border border-stone-200 rounded text-xs text-stone-700 focus:ring-1 focus:ring-[#b45309]"
                                >
                                  <option value="ប្រុស">ប្រុស</option>
                                  <option value="ស្រី">ស្រី</option>
                                </select>
                              ) : (
                                <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold ${teacher.gender === 'ស្រី' ? 'bg-pink-50 text-pink-600' : 'bg-blue-50 text-blue-600'}`}>
                                  {teacher.gender}
                                </span>
                              )}
                            </td>

                            {/* Status controls */}
                            <td className="p-3.5 text-xs font-sans text-center">
                              <select
                                value={currentStatus}
                                onChange={(e) => handleStatusChange(teacher.id, e.target.value as any)}
                                className={`px-2 py-1.5 border rounded-lg text-xs font-semibold focus:outline-none cursor-pointer transition ${
                                  currentStatus === 'វត្តមាន' ? 'bg-green-50 border-green-200 text-green-700' :
                                  currentStatus === 'ច្បាប់' ? 'bg-amber-50 border-amber-200 text-amber-700' :
                                  currentStatus === 'យឺត' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                                  'bg-red-50 border-red-200 text-red-700'
                                }`}
                              >
                                <option value="វត្តមាន">វត្តមាន</option>
                                <option value="ច្បាប់">ច្បាប់</option>
                                <option value="យឺត">យឺត</option>
                                <option value="អវត្តមាន">អវត្តមាន</option>
                              </select>
                            </td>

                            {/* Time In */}
                            <td className="p-3.5 text-xs font-mono text-center text-slate-600">
                              {(currentStatus === 'អវត្តមាន' || currentStatus === 'ច្បាប់') ? (
                                <span className="text-slate-300">-</span>
                              ) : isEditing ? (
                                <input
                                  type="text"
                                  value={currentTimeIn}
                                  onChange={(e) => handleUpdateField(teacher.id, activeShift === 'AM' ? 'timeInAM' : 'timeInPM', e.target.value)}
                                  className="w-24 px-1 py-1 border border-stone-200 rounded text-center text-xs font-mono"
                                />
                              ) : (
                                <span>{currentTimeIn}</span>
                              )}
                            </td>

                            {/* Time In Signature Slot */}
                            <td className="p-3.5 text-xs text-center border-r border-[#eae7de]/40">
                              {(currentStatus === 'អវត្តមាន' || currentStatus === 'ច្បាប់') ? (
                                <span className="text-slate-300 font-sans">-</span>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-1.5">
                                  {currentSignatureIn ? (
                                    <div className="relative group/sig border border-slate-100 bg-[#faf8f4] rounded-lg p-1.5 w-28 h-12 flex items-center justify-center">
                                      <img 
                                        src={currentSignatureIn} 
                                        alt="ហត្ថលេខាចូល" 
                                        referrerPolicy="no-referrer"
                                        className="max-w-full max-h-full object-contain filter hover:brightness-95 contrast-125"
                                      />
                                      <button
                                        onClick={() => handleUpdateField(teacher.id, activeShift === 'AM' ? 'signatureInAM' : 'signatureInPM', null)}
                                        className="absolute -top-1.5 -right-1.5 bg-red-150 text-red-600 p-0.5 rounded-full hover:bg-red-200 transition shadow cursor-pointer"
                                        title="លុបហត្ថលេខា"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setActiveSignatureTarget({ teacherId: teacher.id, type: 'in' })}
                                      className="flex items-center gap-1 text-[#b45309] bg-[#fdfaf2] hover:bg-[#f5ebd5] py-1.5 px-3 rounded-lg border border-[#f3dfbf] transition font-sans cursor-pointer font-bold text-[10px]"
                                    >
                                      <PenTool className="w-3 h-3 text-[#b45309]" />
                                      <span>ចុះហត្ថលេខា</span>
                                    </button>
                                  )}
                                  
                                  {/* Geolocation Button + Display for IN */}
                                  <div className="flex flex-col items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleRefreshLocation(teacher.id, 'in')}
                                      className="flex items-center gap-1 text-[9px] font-sans font-semibold text-stone-500 hover:text-emerald-700 bg-stone-50 hover:bg-emerald-50 px-1.5 py-0.5 rounded border border-stone-200 hover:border-emerald-250 cursor-pointer transition min-w-[90px] justify-center"
                                      title="ចុះទីតាំង GPS របស់ឧបករណ៍"
                                    >
                                      <Compass className="w-3 h-3 text-stone-400 group-hover:text-emerald-500" />
                                      <span>{currentLocationIn ? 'បច្ចុប្បន្នភាព GPS' : 'ចុះទីតាំង GPS'}</span>
                                    </button>
                                    {currentLocationIn && (
                                      <span className="text-[9px] font-mono text-stone-700 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded block max-w-[130px] truncate" title={currentLocationIn}>
                                        {currentLocationIn}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Time Out */}
                            <td className="p-3.5 text-xs font-mono text-center text-slate-600">
                              {(currentStatus === 'អវត្តមាន' || currentStatus === 'ច្បាប់') ? (
                                <span className="text-slate-300">-</span>
                              ) : isEditing ? (
                                <input
                                  type="text"
                                  value={currentTimeOut}
                                  onChange={(e) => handleUpdateField(teacher.id, activeShift === 'AM' ? 'timeOutAM' : 'timeOutPM', e.target.value)}
                                  className="w-24 px-1 py-1 border border-stone-200 rounded text-center text-xs font-mono"
                                />
                              ) : (
                                <span>{currentTimeOut}</span>
                              )}
                            </td>

                            {/* Time Out Signature Slot */}
                            <td className="p-3.5 text-xs text-center border-l border-[#eae7de]/40">
                              {(currentStatus === 'អវត្តមាន' || currentStatus === 'ច្បាប់') ? (
                                <span className="text-slate-300 font-sans">-</span>
                              ) : (
                                <div className="flex flex-col items-center justify-center gap-1.5">
                                  {currentSignatureOut ? (
                                    <div className="relative group/sig border border-slate-100 bg-[#faf8f4] rounded-lg p-1.5 w-28 h-12 flex items-center justify-center">
                                      <img 
                                        src={currentSignatureOut} 
                                        alt="ហត្ថលេខាចេញ" 
                                        referrerPolicy="no-referrer"
                                        className="max-w-full max-h-full object-contain filter hover:brightness-95 contrast-125"
                                      />
                                      <button
                                        onClick={() => handleUpdateField(teacher.id, activeShift === 'AM' ? 'signatureOutAM' : 'signatureOutPM', null)}
                                        className="absolute -top-1.5 -right-1.5 bg-red-150 text-red-600 p-0.5 rounded-full hover:bg-red-200 transition shadow cursor-pointer"
                                        title="លុបហត្ថលេខា"
                                      >
                                        <Trash2 className="w-3.5 h-3.5" />
                                      </button>
                                    </div>
                                  ) : (
                                    <button
                                      onClick={() => setActiveSignatureTarget({ teacherId: teacher.id, type: 'out' })}
                                      className="flex items-center gap-1 text-[#b45309] bg-[#fdfaf2] hover:bg-[#f5ebd5] py-1.5 px-3 rounded-lg border border-[#f3dfbf] transition font-sans cursor-pointer font-bold text-[10px]"
                                    >
                                      <PenTool className="w-3 h-3 text-[#b45309]" />
                                      <span>ចុះហត្ថលេខា</span>
                                    </button>
                                  )}

                                  {/* Geolocation Button + Display for OUT */}
                                  <div className="flex flex-col items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleRefreshLocation(teacher.id, 'out')}
                                      className="flex items-center gap-1 text-[9px] font-sans font-semibold text-stone-500 hover:text-emerald-700 bg-stone-50 hover:bg-emerald-50 px-1.5 py-0.5 rounded border border-stone-200 hover:border-emerald-250 cursor-pointer transition min-w-[90px] justify-center"
                                      title="ចុះទីតាំង GPS របស់ឧបករណ៍"
                                    >
                                      <Compass className="w-3 h-3 text-stone-400 group-hover:text-emerald-500" />
                                      <span>{currentLocationOut ? 'បច្ចុប្បន្នភាព GPS' : 'ចុះទីតាំង GPS'}</span>
                                    </button>
                                    {currentLocationOut && (
                                      <span className="text-[9px] font-mono text-stone-700 bg-emerald-50 border border-emerald-100 px-1 py-0.5 rounded block max-w-[130px] truncate" title={currentLocationOut}>
                                        {currentLocationOut}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              )}
                            </td>

                            {/* Remarks Input/Cell */}
                            <td className="p-3.5 text-xs font-sans text-stone-600">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={teacher.remarks}
                                  onChange={(e) => handleUpdateField(teacher.id, 'remarks', e.target.value)}
                                  className="w-full px-2 py-1 border border-stone-200 rounded font-sans focus:outline-none focus:ring-1 focus:ring-indigo-500 text-xs"
                                />
                              ) : (
                                <span className="text-slate-500 italic">{teacher.remarks || '...'}</span>
                              )}
                            </td>

                            {/* Action Buttons Box */}
                            <td className="p-3.5 text-xs text-center">
                              <div className="flex items-center justify-center gap-1.5">
                                <button
                                  onClick={() => setEditingTeacherId(isEditing ? null : teacher.id)}
                                  className={`p-1.5 rounded-lg border transition cursor-pointer ${isEditing ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'}`}
                                  title={isEditing ? 'រក្សាទុក' : 'កែសម្រួល'}
                                >
                                  {isEditing ? <CheckCircle className="w-3.5 h-3.5" /> : <Edit3 className="w-3.5 h-3.5" />}
                                </button>
                                <button
                                  onClick={() => deleteTeacher(teacher.id)}
                                  className="p-1.5 rounded-lg border bg-rose-50 border-rose-100 text-rose-500 hover:bg-rose-100 hover:text-rose-600 transition cursor-pointer"
                                  title="លុបលោកគ្រូ/អ្នកគ្រូ"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>

                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>

              {/* Bottom Quick Assist Tips */}
              <div className="bg-[#fcfaf3] border-t border-stone-200 p-4 flex flex-col md:flex-row items-center justify-between gap-3 text-xs text-stone-500 font-sans">
                <p>💡 ចុចលើប៊ូតុង <strong>កែសម្រួល</strong> ដើម្បីផ្លាស់ប្តូរឈ្មោះ ម៉ោងបម្រើការ ឬ យោបល់ផ្សេងៗបានយ៉ាងរហ័ស។</p>
                <div className="flex items-center gap-4 text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                    <span>វត្តមាន: {presentCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
                    <span>Late/Leave: {lateCount + leaveCount}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
                    <span>អវត្តមាន: {absentCount}</span>
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

        {/* TAB 2: DOCUMENT FOOTERS / HEADER CONFIGURATION PANEL */}
        {activeTab === 'config' && (
          <div className="bg-[#fffdfa] rounded-2xl border border-stone-200 shadow-sm p-6 flex flex-col gap-6">
            <div className="border-b border-stone-200 pb-4">
              <h2 className="font-sans font-bold text-lg text-stone-800">
                ការកំណត់ក្បាលទំព័រ និងចុងទំព័រឯកសារ
              </h2>
              <p className="font-sans text-xs text-stone-500 mt-1">
                ការកំណត់ទាំងអស់នេះនឹងត្រូវឆ្លុះបញ្ចាំងភ្លាមៗនៅលើទំព័រមុនបោះពុម្ព និងការនាំចេញទាំងអស់ (PDF, MS Word, Excel)។
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              {/* Group 1: Page Header and Motto */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#b45309] font-sans tracking-wide block uppercase">
                  ១. ក្បាលទំព័រ និងបាវចនាជាតិ (Page Header)
                </span>

                <div className="grid grid-cols-1 gap-4 bg-[#fcfaf3] p-4 rounded-xl border border-stone-200">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-medium text-stone-600">បាវចនាជាតិ (ជួរទី១)</label>
                    <input
                      type="text"
                      value={config.mottoLine1}
                      onChange={(e) => setConfig({ ...config, mottoLine1: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-medium text-stone-600">បាវចនាជាតិ (ជួរទី២)</label>
                    <input
                      type="text"
                      value={config.mottoLine2}
                      onChange={(e) => setConfig({ ...config, mottoLine2: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-medium text-stone-600">ឈ្មោះគ្រឹះស្ថានសិក្សាសាលារៀន</label>
                    <input
                      type="text"
                      value={config.schoolName}
                      onChange={(e) => setConfig({ ...config, schoolName: e.target.value })}
                      placeholder="ឧ. វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ"
                      className="w-full px-4 py-2 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 font-semibold focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-medium text-stone-600">ចំណងជើងតារាង</label>
                    <input
                      type="text"
                      value={config.title}
                      onChange={(e) => setConfig({ ...config, title: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-sans font-medium text-stone-600">ចំណងជើងរង</label>
                    <input
                      type="text"
                      value={config.subTitle}
                      onChange={(e) => setConfig({ ...config, subTitle: e.target.value })}
                      className="w-full px-4 py-2 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                    />
                  </div>
                </div>
              </div>

              {/* Group 2: Signatures and Footers */}
              <div className="space-y-4">
                <span className="text-xs font-semibold text-[#b45309] font-sans tracking-wide block uppercase">
                  ២. អ្នកទទួលខុសត្រូវ និងហត្ថលេខា (Footer Signatures)
                </span>

                <div className="grid grid-cols-1 gap-4 bg-[#fcfaf3] p-4 rounded-xl border border-stone-200">
                  
                  {/* Creator on right */}
                  <div className="border-b border-stone-200/60 pb-3">
                    <span className="text-xs font-sans block text-[#8c2d19] font-semibold mb-2">តួនាទីខាងស្តាំ (អ្នករៀបចំតារាង)</span>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-[#78716c]">តួនាទី</label>
                        <input
                          type="text"
                          value={config.makerTitle}
                          onChange={(e) => setConfig({ ...config, makerTitle: e.target.value })}
                          className="px-3 py-1.5 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-[#78716c]">ឈ្មោះពេញ</label>
                        <input
                          type="text"
                          value={config.makerName}
                          onChange={(e) => setConfig({ ...config, makerName: e.target.value })}
                          className="px-3 py-1.5 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Approver on Left */}
                  <div>
                    <span className="text-xs font-sans block text-[#8c2d19] font-semibold mb-2">តួនាទីខាងឆ្វេង (បានឃើញ និងឯកភាព / នាយក)</span>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-[#78716c]">ការបញ្ជាក់</label>
                        <input
                          type="text"
                          value={config.approverTitle}
                          onChange={(e) => setConfig({ ...config, approverTitle: e.target.value })}
                          className="px-3 py-1.5 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-[#78716c]">តួនាទី</label>
                        <input
                          type="text"
                          value={config.approverSubTitle}
                          onChange={(e) => setConfig({ ...config, approverSubTitle: e.target.value })}
                          className="px-3 py-1.5 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        />
                      </div>
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-[#78716c]">ឈ្មោះពេញនាយករង/នាយក</label>
                        <input
                          type="text"
                          value={config.approverName}
                          onChange={(e) => setConfig({ ...config, approverName: e.target.value })}
                          className="px-3 py-1.5 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Calendars: Traditional Khmer Lunar Calendar Settings */}
            <div className="border-t border-stone-200 pt-6">
              <span className="text-xs font-semibold text-[#b45309] font-sans tracking-wide block uppercase mb-4">
                ៣. កាលបរិច្ឆេទចន្ទគតិ និងសុរិយគតិ (Cambodian Calendars)
              </span>

              <div className="bg-[#fcfaf3] border border-stone-200 p-5 rounded-2xl flex flex-col gap-5">
                
                {/* Method Toggler */}
                <div className="flex items-center gap-2.5">
                  <input
                    type="checkbox"
                    id="checkbox-custom-dates"
                    checked={config.useCustomDateText}
                    onChange={(e) => setConfig({ ...config, useCustomDateText: e.target.checked })}
                    className="w-4 h-4 text-[#b45309] rounded border-stone-300 focus:ring-[#b45309]"
                  />
                  <label htmlFor="checkbox-custom-dates" className="text-xs font-sans font-semibold text-stone-700 cursor-pointer select-none">
                    សរសេរកាលបរិច្ឆេទដោយសេរី ឬកែសម្រួលដោយដៃផ្ទាល់ (Manual Custom Text)
                  </label>
                </div>

                {config.useCustomDateText ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-sans font-medium text-stone-650">កាលបរិច្ឆេទ ចន្ទគតិ (ខ្មែរ)</label>
                      <input
                        type="text"
                        value={config.customLunarDate}
                        onChange={(e) => setConfig({ ...config, customLunarDate: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                      />
                    </div>
                    
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-sans font-medium text-stone-650">កាលបរិច្ឆេទ សុរិយគតិ (អន្តរជាតិ)</label>
                      <input
                        type="text"
                        value={config.customSolarDate}
                        onChange={(e) => setConfig({ ...config, customSolarDate: e.target.value })}
                        className="w-full px-4 py-2 border border-stone-200 bg-white rounded-xl text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    <div className="grid grid-cols-2 sm:grid-cols-6 gap-3">
                      
                      {/* Day of week */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-stone-500">ថ្ងៃចន្ទគតិ</label>
                        <select
                          value={config.lunarDayOfWeek}
                          onChange={(e) => setConfig({ ...config, lunarDayOfWeek: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        >
                          {KHMER_DAYS.map(day => <option key={day} value={day}>ថ្ងៃ{day}</option>)}
                        </select>
                      </div>

                      {/* Lunar day waxing/waning */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-stone-500">កើត/រនោច</label>
                        <select
                          value={config.lunarDayNum}
                          onChange={(e) => setConfig({ ...config, lunarDayNum: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        >
                          {KHMER_LUNAR_DAYS.map(day => <option key={day} value={day}>{day}</option>)}
                        </select>
                      </div>

                      {/* Lunar Month */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-stone-500">ខែចន្ទគតិ</label>
                        <select
                          value={config.lunarMonth}
                          onChange={(e) => setConfig({ ...config, lunarMonth: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        >
                          {KHMER_LUNAR_MONTHS.map(m => <option key={m} value={m}>ខែ{m}</option>)}
                        </select>
                      </div>

                      {/* Zodiac Animal */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-stone-500">ឆ្នាំសត្វ</label>
                        <select
                          value={config.lunarZodiac}
                          onChange={(e) => setConfig({ ...config, lunarZodiac: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        >
                          {KHMER_ZODIAC_YEARS.map(z => <option key={z} value={z}>ឆ្នាំ{z}</option>)}
                        </select>
                      </div>

                      {/* Era */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-stone-500">ស័ក</label>
                        <select
                          value={config.lunarEra}
                          onChange={(e) => setConfig({ ...config, lunarEra: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-sans text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        >
                          {KHMER_ERAS.map(era => <option key={era} value={era}>{era}</option>)}
                        </select>
                      </div>

                      {/* Buddhist Era Year */}
                      <div className="flex flex-col gap-1">
                        <label className="text-[10px] font-sans text-stone-500">ពุทธសករាជ (ព.ស.)</label>
                        <input
                          type="text"
                          value={config.lunarBE}
                          onChange={(e) => setConfig({ ...config, lunarBE: e.target.value })}
                          className="px-2.5 py-1.5 rounded-lg border border-stone-200 bg-white text-xs font-mono text-stone-700 focus:outline-none focus:ring-1 focus:ring-[#b45309]"
                        />
                      </div>

                    </div>

                    <div className="bg-white p-3.5 rounded-xl border border-stone-150 text-xs text-stone-600 font-sans">
                      <span className="font-semibold block text-[#8c2d19] mb-1">កាលបរិច្ឆេទចងក្រងរួច៖</span>
                      {getFullLunarString(config)} &bull; {config.customSolarDate}
                    </div>
                  </div>
                )}
                
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-4">
              <button
                type="button"
                onClick={() => setActiveTab('editor')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-stone-700 bg-stone-150 hover:bg-stone-200 transition font-sans cursor-pointer"
              >
                ត្រឡប់ទៅការស្រង់វត្តមានវិញ
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('preview')}
                className="px-5 py-2.5 rounded-xl text-xs font-semibold text-white bg-[#b45309] hover:bg-[#9a3412] transition font-sans cursor-pointer shadow"
              >
                ពិនិត្យទិដ្ឋភាពពេញលេញ (A4 Preview)
              </button>
            </div>
          </div>
        )}

        {/* TAB 3: THE INTERACTIVE PRINT/A4 DESKTOP PREVIEW */}
        {activeTab === 'preview' && (
          <div className="bg-[#faf8f3] rounded-3xl p-4 sm:p-8 flex flex-col items-center gap-6 border border-stone-200 shadow-inner">
            <div className="w-full max-w-4xl bg-white border-[12px] border-double border-stone-300 rounded-lg overflow-hidden shadow-2xl p-1 sm:p-3 relative">
              
              {/* Floating control assist tip */}
              <div className="absolute top-4 right-4 bg-[#b45309]/90 text-white backdrop-blur px-3 py-1.5 rounded-lg text-[10px] font-sans shadow font-medium flex items-center gap-1.5 animate-bounce z-10">
                <Printer className="w-3.5 h-3.5" />
                <span>ចុច "បោះពុម្ព ឬ PDF" នៅលើបង្អួចធំដើម្បីរក្សាទុក</span>
              </div>

              {/* Replica of the physical paper */}
              <div className="print-document-sheet bg-white px-8 sm:px-12 py-10 flex flex-col text-stone-900 select-text">
                
                {/* Motto */}
                <div className="text-center mb-6">
                  <p className="font-moul text-base font-bold leading-relaxed">{config.mottoLine1}</p>
                  <p className="font-moul text-xs font-medium leading-relaxed mt-0.5">{config.mottoLine2}</p>
                  <p className="text-[10px] tracking-widest text-[#b45309] mt-1">🔹-🔹-🔹-🔹</p>
                </div>

                {/* Left School block */}
                <div className="text-left font-battambang text-xs font-bold leading-relaxed text-stone-700 mb-2">
                  <span>{config.schoolName || '...........................................'}</span>
                </div>

                {/* Main Title Banner */}
                <div className="text-center my-4">
                  <h1 className="font-moul text-lg font-bold text-stone-900 leading-relaxed mb-1">{config.title}</h1>
                  <p className="font-battambang text-xs text-stone-500">{config.subTitle}</p>
                </div>

                {/* Primary Table layout */}
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse my-6 text-[9.5px]">
                    <thead>
                      <tr className="bg-stone-50 text-[9px]">
                        <th rowSpan={2} className="border border-stone-950 p-1.5 font-moul w-10 text-center">ល.រ</th>
                        <th rowSpan={2} className="border border-stone-950 p-1.5 font-moul text-center min-w-[120px]">គោត្តនាម-នាមខ្លួន</th>
                        <th rowSpan={2} className="border border-stone-950 p-1.5 font-moul w-12 text-center">ភេទ</th>
                        
                        {/* Morning Shift Header */}
                        <th colSpan={4} className="border border-stone-950 p-1 font-moul text-center bg-stone-100/50">វេនព្រឹក (Morning Session)</th>
                        
                        {/* Afternoon Shift Header */}
                        <th colSpan={4} className="border border-stone-950 p-1 font-moul text-center bg-stone-100/50">វេនរសៀល (Afternoon Session)</th>
                        
                        <th rowSpan={2} className="border border-stone-950 p-1.5 font-moul text-center w-28">ផ្សេងៗ</th>
                      </tr>
                      <tr className="bg-stone-50 text-[8px]">
                        {/* Morning details */}
                        <th className="border border-stone-950 p-1 text-center font-moul">ចូល</th>
                        <th className="border border-stone-950 p-1 text-center font-moul w-24">ហត្ថលេខា/GPS</th>
                        <th className="border border-stone-950 p-1 text-center font-moul">ចេញ</th>
                        <th className="border border-stone-950 p-1 text-center font-moul w-24">ហត្ថលេខា/GPS</th>
                        
                        {/* Afternoon details */}
                        <th className="border border-stone-950 p-1 text-center font-moul">ចូល</th>
                        <th className="border border-stone-950 p-1 text-center font-moul w-24">ហត្ថលេខា/GPS</th>
                        <th className="border border-stone-950 p-1 text-center font-moul">ចេញ</th>
                        <th className="border border-stone-950 p-1 text-center font-moul w-24">ហត្ថលេខា/GPS</th>
                      </tr>
                    </thead>
                    <tbody>
                      {teachers.map((teacher, idx) => {
                        const isAbsentAM = teacher.statusAM === 'អវត្តមាន' || teacher.statusAM === 'ច្បាប់';
                        const isAbsentPM = teacher.statusPM === 'អវត្តមាន' || teacher.statusPM === 'ច្បាប់';

                        return (
                          <tr key={teacher.id} className="h-14">
                            {/* Serial Number */}
                            <td className="border border-stone-950 text-center font-battambang p-1">
                              {convertToKhmerDigits(idx + 1)}
                            </td>
                            
                            {/* Full Name */}
                            <td className="border border-stone-950 font-battambang px-1.5 py-1 text-stone-900 font-bold text-center leading-tight">
                              {teacher.name}
                            </td>
                            
                            {/* Gender */}
                            <td className="border border-stone-950 text-center font-battambang p-1">
                              {teacher.gender}
                            </td>

                            {/* --- MORNING SHIFT --- */}
                            {/* Time In */}
                            <td className="border border-stone-950 text-center font-mono p-1 text-stone-600">
                              {isAbsentAM ? (
                                <span className="font-sans text-[8px] text-red-650">{teacher.statusAM || 'អវត្តមាន'}</span>
                              ) : (
                                teacher.timeInAM || '07:00 AM'
                              )}
                            </td>
                            
                            {/* Signature In */}
                            <td className="border border-stone-950 text-center p-1 w-24 relative bg-stone-50/10">
                              {!isAbsentAM && (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  {teacher.signatureInAM ? (
                                    <img 
                                      src={teacher.signatureInAM} 
                                      alt="Sig In" 
                                      referrerPolicy="no-referrer"
                                      className="max-h-6 max-w-full mx-auto object-contain filter contrast-125"
                                    />
                                  ) : (
                                    <span className="text-stone-300 text-[7px] italic">[?]</span>
                                  )}
                                  {teacher.locationInAM && (
                                    <span className="text-[6.5px] font-mono text-emerald-800 scale-90 whitespace-nowrap overflow-hidden block text-center max-w-[80px]" title={teacher.locationInAM}>
                                      {teacher.locationInAM.replace('📍 ', '')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Time Out */}
                            <td className="border border-stone-950 text-center font-mono p-1 text-stone-600">
                              {isAbsentAM ? (
                                <span className="font-sans text-[8px] text-red-650">-</span>
                              ) : (
                                teacher.timeOutAM || '11:30 AM'
                              )}
                            </td>
                            
                            {/* Signature Out */}
                            <td className="border border-stone-950 text-center p-1 w-24 bg-stone-50/10">
                              {!isAbsentAM && (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  {teacher.signatureOutAM ? (
                                    <img 
                                      src={teacher.signatureOutAM} 
                                      alt="Sig Out" 
                                      referrerPolicy="no-referrer"
                                      className="max-h-6 max-w-full mx-auto object-contain filter contrast-125"
                                    />
                                  ) : (
                                    <span className="text-stone-300 text-[7px] italic">[?]</span>
                                  )}
                                  {teacher.locationOutAM && (
                                    <span className="text-[6.5px] font-mono text-emerald-800 scale-90 whitespace-nowrap overflow-hidden block text-center max-w-[80px]" title={teacher.locationOutAM}>
                                      {teacher.locationOutAM.replace('📍 ', '')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* --- AFTERNOON SHIFT --- */}
                            {/* Time In */}
                            <td className="border border-stone-950 text-center font-mono p-1 text-stone-600">
                              {isAbsentPM ? (
                                <span className="font-sans text-[8px] text-red-650">{teacher.statusPM || 'អវត្តមាន'}</span>
                              ) : (
                                teacher.timeInPM || '01:00 PM'
                              )}
                            </td>
                            
                            {/* Signature In */}
                            <td className="border border-stone-950 text-center p-1 w-24 bg-stone-50/10">
                              {!isAbsentPM && (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  {teacher.signatureInPM ? (
                                    <img 
                                      src={teacher.signatureInPM} 
                                      alt="Sig In" 
                                      referrerPolicy="no-referrer"
                                      className="max-h-6 max-w-full mx-auto object-contain filter contrast-125"
                                    />
                                  ) : (
                                    <span className="text-stone-300 text-[7px] italic">[?]</span>
                                  )}
                                  {teacher.locationInPM && (
                                    <span className="text-[6.5px] font-mono text-emerald-800 scale-90 whitespace-nowrap overflow-hidden block text-center max-w-[80px]" title={teacher.locationInPM}>
                                      {teacher.locationInPM.replace('📍 ', '')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Time Out */}
                            <td className="border border-stone-950 text-center font-mono p-1 text-stone-600">
                              {isAbsentPM ? (
                                <span className="font-sans text-[8px] text-red-650">-</span>
                              ) : (
                                teacher.timeOutPM || '05:00 PM'
                              )}
                            </td>
                            
                            {/* Signature Out */}
                            <td className="border border-stone-950 text-center p-1 w-24 bg-stone-50/10">
                              {!isAbsentPM && (
                                <div className="flex flex-col items-center justify-center gap-0.5">
                                  {teacher.signatureOutPM ? (
                                    <img 
                                      src={teacher.signatureOutPM} 
                                      alt="Sig Out" 
                                      referrerPolicy="no-referrer"
                                      className="max-h-6 max-w-full mx-auto object-contain filter contrast-125"
                                    />
                                  ) : (
                                    <span className="text-stone-300 text-[7px] italic">[?]</span>
                                  )}
                                  {teacher.locationOutPM && (
                                    <span className="text-[6.5px] font-mono text-emerald-800 scale-90 whitespace-nowrap overflow-hidden block text-center max-w-[80px]" title={teacher.locationOutPM}>
                                      {teacher.locationOutPM.replace('📍 ', '')}
                                    </span>
                                  )}
                                </div>
                              )}
                            </td>

                            {/* Remarks */}
                            <td className="border border-stone-950 font-battambang text-[9px] px-1.5 py-1 text-stone-700 italic leading-snug">
                              {teacher.remarks || ''}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Footer and Signatures */}
                <div className="grid grid-cols-2 gap-8 mt-8 text-xs font-battambang">
                  {/* Left Column Approvers */}
                  <div className="text-center flex flex-col items-center">
                    <p className="font-bold text-stone-900 underline">{config.approverTitle}</p>
                    <p className="font-semibold text-stone-700 mt-1">{config.approverSubTitle}</p>
                    
                    {/* Placeholder for real handwritten signature/stamp */}
                    <div className="h-20 my-2 flex items-center justify-center">
                      <span className="text-[10px] text-stone-300 italic">(ហត្ថលេខា និងត្រា)</span>
                    </div>

                    <p className="font-bold text-stone-900 text-sm">{config.approverName || '...........................................'}</p>
                  </div>

                  {/* Right Column Dates & Table Maker */}
                  <div className="text-center flex flex-col items-center">
                    <p className="text-xs text-stone-500 italic">
                      {getFullLunarString(config)}
                    </p>
                    <p className="text-xs text-stone-500 italic mt-0.5">
                      {config.customSolarDate}
                    </p>
                    
                    <p className="font-bold text-stone-900 underline mt-4">{config.makerTitle}</p>
                    
                    <div className="h-16 my-2 flex items-center justify-center">
                      <span className="text-[10px] text-stone-300 italic">(ហត្ថលេខា)</span>
                    </div>

                    <p className="font-bold text-stone-900 text-sm mt-2">{config.makerName || '...........................................'}</p>
                  </div>
                </div>

              </div>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => setActiveTab('editor')}
                className="px-5 py-2.5 bg-stone-150 text-stone-700 rounded-xl hover:bg-stone-200 border border-stone-300/40 transition text-xs font-semibold font-sans cursor-pointer h-10 flex items-center justify-center"
              >
                ត្រឡប់ទៅកែសម្រួលដដែល
              </button>
              <button
                onClick={() => window.print()}
                className="px-6 py-2.5 bg-[#b45309] text-white font-semibold rounded-xl hover:bg-[#9a3412] transition text-xs font-sans shadow border border-[#d97706] cursor-pointer flex items-center gap-2 h-10"
              >
                <Printer className="w-4 h-4" />
                <span>បោះពុម្ពទំព័រនេះ (Print ឬទាញយក PDF)</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* FOOTER NOTIFY BANNER - Hidden on physical printing */}
      <footer className="no-print bg-[#292524] text-stone-400 py-6 text-center text-xs font-sans border-t border-[#b45309] flex flex-col items-center justify-center gap-1.5 mt-auto">
        <p className="text-stone-300 font-semibold">បញ្ជីវត្តមានលោកគ្រូអ្នកគ្រូអគ្គនាយកដ្ឋានអប់រំកម្ពុជា &copy; {new Date().getFullYear()}</p>
        <p className="text-[11px] text-stone-500 font-serif">ប្រព័ន្ធនេះត្រូវបានរចនាឡើងយ៉ាងពិសេសសម្រាប់ការបោះពុម្ពទម្រង់តារាងស្ដង់ដារ A4 និងវេទិកាហត្ថលេខាឌីជីថលបែបកែសម្រួលដិតពណ៌មាស</p>
      </footer>

      {/* GLOBAL MODAL: DIGITAL SIGNATURE PAD DRAWER OVERLAY */}
      {activeSignatureTarget && (
        <div className="fixed inset-0 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all animate-fade-in no-print">
          <SignaturePad
            initialSignature={(() => {
              const currentTeacher = teachers.find(t => t.id === activeSignatureTarget.teacherId);
              if (!currentTeacher) return undefined;
              if (activeShift === 'AM') {
                return activeSignatureTarget.type === 'in' ? currentTeacher.signatureInAM : currentTeacher.signatureOutAM;
              } else {
                return activeSignatureTarget.type === 'in' ? currentTeacher.signatureInPM : currentTeacher.signatureOutPM;
              }
            })() || undefined}
            onSave={handleSaveSignature}
            onClose={() => setActiveSignatureTarget(null)}
          />
        </div>
      )}
    </div>
  );
}
