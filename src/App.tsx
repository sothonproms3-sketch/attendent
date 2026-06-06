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
  ChevronDown,
  Camera,
  Share2,
  MoreVertical,
  X,
  LogIn,
  UserPlus,
  Info,
  Lock,
  User,
  ArrowLeft
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
  const [preferredSignatureMethod, setPreferredSignatureMethod] = useState<'draw' | 'camera' | 'upload'>('draw');
  const [activeScanSlot, setActiveScanSlot] = useState<'in_am' | 'out_am' | 'in_pm' | 'out_pm'>('in_am');
  
  // Interactive MoEYS registration/login portal states
  const [mobileScreen, setMobileScreen] = useState<'home' | 'registration' | 'login'>('home');
  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [loginSuccessShow, setLoginSuccessShow] = useState(false);
  const [isRegistered, setIsRegistered] = useState(true); // default true to show exact " ✓ បានចុះឈ្មោះរួចហើយ " badge in screenshot
  
  // Registration Form States
  const [regName, setRegName] = useState('');
  const [regGender, setRegGender] = useState<'ប្រុស' | 'ស្រី'>('ស្រី');
  const [regId, setRegId] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regRemarks, setRegRemarks] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);

  
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

                {/* ឧបករណ៍ស្កេនហត្ថលេខាឌីជីថលបែបកាមេរ៉ារហ័ស (Interactive Holographic Scanner Terminal) */}
                <div className="bg-[#1e293b] text-slate-100 p-4 rounded-2xl border border-slate-700 flex flex-col gap-3 shadow-md no-print">
                  <div className="flex items-center gap-2">
                    <div className="bg-emerald-500/10 p-1.5 rounded-xl text-emerald-400">
                      <Camera className="w-4 h-4 text-emerald-400" />
                    </div>
                    <div>
                      <h4 className="font-moul text-[10px] text-emerald-400 leading-tight">
                        កន្លែងស្កេនហត្ថលេខាដៃ (Paper Scanner)
                      </h4>
                      <p className="text-[9px] text-slate-400 font-sans">បំលែងហត្ថលេខាក្រដាស ទៅជាហត្ថលេខាឌីជីថលស្អាត</p>
                    </div>
                  </div>

                  {/* 1. Selector for simulation target slot */}
                  <div className="flex flex-col gap-1 text-[11px]">
                    <span className="text-slate-300 font-sans font-medium">១. ជ្រើសរើសវេនដែលត្រូវចុះវត្តមាន៖</span>
                    <div className="grid grid-cols-2 gap-1.5 mt-1 font-sans">
                      {[
                        { id: 'in_am', label: '🌅 ចូលព្រឹក' },
                        { id: 'out_am', label: '🚪 ចេញព្រឹក' },
                        { id: 'in_pm', label: '🌇 ចូលរសៀល' },
                        { id: 'out_pm', label: '🚪 ចេញរសៀល' }
                      ].map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => setActiveScanSlot(slot.id as any)}
                          className={`py-1.5 px-2 rounded-lg border text-left transition text-[10px] flex items-center justify-between cursor-pointer ${
                            activeScanSlot === slot.id
                              ? 'bg-emerald-600 border-emerald-400 text-white font-bold shadow-xs'
                              : 'bg-slate-800/60 border-slate-700 text-slate-300 hover:bg-slate-850'
                          }`}
                        >
                          <span>{slot.label}</span>
                          {activeScanSlot === slot.id && <span className="w-1.5 h-1.5 bg-white rounded-full block animate-ping"></span>}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* 2. Visual Holographic Interactive Scanner View */}
                  <div className="relative w-full h-24 bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex flex-col justify-center items-center">
                    {/* Corner viewfinder brackets */}
                    <div className="absolute top-2 left-2 w-2.5 h-2.5 border-t-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute top-2 right-2 w-2.5 h-2.5 border-t-2 border-r-2 border-emerald-400"></div>
                    <div className="absolute bottom-2 left-2 w-2.5 h-2.5 border-b-2 border-l-2 border-emerald-400"></div>
                    <div className="absolute bottom-2 right-2 w-2.5 h-2.5 border-b-2 border-r-2 border-emerald-400"></div>

                    {/* Laser Scanner animation bar moving up and down continuously */}
                    <div className="absolute inset-x-0 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent shadow-[0_0_8px_rgba(16,185,129,0.8)]" style={{
                      transform: 'translateY(-20px)',
                      animation: 'scanLineEffect 2.5s infinite ease-in-out'
                    }}></div>

                    {/* Custom CSS for scanner animation directly injected */}
                    <style dangerouslySetInnerHTML={{__html: `
                      @keyframes scanLineEffect {
                        0%, 100% { transform: translateY(-35px); opacity: 0.8; }
                        50% { transform: translateY(35px); opacity: 0.9; }
                      }
                    `}} />

                    {/* Simulator inner text display */}
                    <div className="flex flex-col items-center justify-center text-center z-10 p-2 leading-tight select-none pointer-events-none">
                      <span className="text-lg animate-pulse">📠</span>
                      <span className="text-[8px] font-mono font-bold text-emerald-400 uppercase tracking-widest mt-1 block">
                        CAMERA FRAME ACTIVE
                      </span>
                      <span className="text-[9px] font-moul text-slate-350 mt-0.5 block">
                        ចុចប៊ូតុងខាងក្រោមដើម្បីស្កេនក្រដាស
                      </span>
                    </div>
                  </div>

                  {/* 3. Action buttons */}
                  <div className="flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        setPreferredSignatureMethod('camera');
                        if (activeScanSlot === 'in_am') {
                          setActiveShift('AM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'in' });
                        } else if (activeScanSlot === 'out_am') {
                          setActiveShift('AM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'out' });
                        } else if (activeScanSlot === 'in_pm') {
                          setActiveShift('PM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'in' });
                        } else if (activeScanSlot === 'out_pm') {
                          setActiveShift('PM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'out' });
                        }
                      }}
                      className="w-full py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-sans text-xs font-bold rounded-xl shadow cursor-pointer transition flex items-center justify-center gap-2 border border-emerald-550"
                    >
                      <Camera className="w-4 h-4 shrink-0" />
                      <span>បើកស្កេនកាមេរ៉ា (Camera Scan)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setPreferredSignatureMethod('upload');
                        if (activeScanSlot === 'in_am') {
                          setActiveShift('AM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'in' });
                        } else if (activeScanSlot === 'out_am') {
                          setActiveShift('AM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'out' });
                        } else if (activeScanSlot === 'in_pm') {
                          setActiveShift('PM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'in' });
                        } else if (activeScanSlot === 'out_pm') {
                          setActiveShift('PM');
                          setActiveSignatureTarget({ teacherId: selectedTeacherId, type: 'out' });
                        }
                      }}
                      className="w-full py-1.5 bg-slate-800 hover:bg-slate-755 text-slate-300 font-sans text-[10px] rounded-xl cursor-pointer transition flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <span>📂 ផ្ទុករូបភាពស្កេន (Upload Slip Photo)</span>
                    </button>
                  </div>
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
                  <div className="grid grid-cols-2 gap-2 mt-1.5 font-sans">
                    <button 
                      onClick={() => setActiveTab('editor')}
                      className="text-left hover:text-[#b45309] hover:underline cursor-pointer"
                    >
                      &bull; បញ្ជីវត្តមានដិតលម្អិត &rarr;
                    </button>
                    <button 
                      onClick={() => setActiveTab('preview')}
                      className="text-left hover:text-[#b45309] hover:underline cursor-pointer"
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

                    {/* MoEYS Browser Custom Header Bar */}
                    <div className="bg-white px-4 py-2.5 flex items-center justify-between border-b border-stone-200 select-none z-20">
                      {/* Left Side: X and ChevronDown browser close simulation */}
                      <div className="flex items-center gap-2.5 text-stone-700">
                        <button 
                          type="button"
                          onClick={() => {
                            setMobileScreen('home');
                            setLoginSuccessShow(false);
                          }}
                          className="p-1 hover:bg-stone-100 rounded-lg transition shrink-0 cursor-pointer"
                          title="Close Browser"
                        >
                          <X className="w-5 h-5 text-stone-850" />
                        </button>
                        <button 
                          type="button"
                          className="p-1 hover:bg-stone-100 rounded-lg transition shrink-0"
                        >
                          <ChevronDown className="w-5 h-5 text-stone-600" />
                        </button>
                      </div>
                      
                      {/* Center Title / URL Info */}
                      <div className="flex-grow text-center px-1.5 min-w-0">
                        <h4 className="font-sans font-extrabold text-[11px] text-stone-900 truncate leading-tight">
                          ខេត្តបាត់ដំបង_GEIP-AF_ការគ្រ...
                        </h4>
                        <span className="text-[8.5px] font-sans font-bold text-emerald-600 leading-none mt-0.5 block flex items-center justify-center gap-1">
                          <span className="w-1 h-1 bg-emerald-500 rounded-full animate-ping inline-block"></span>
                          plp-tms.moeys.gov.kh
                        </span>
                      </div>

                      {/* Right Side: Share and More buttons */}
                      <div className="flex items-center gap-1 text-stone-700">
                        <button 
                          type="button"
                          onClick={() => {
                            alert("តំណភ្ជាប់ត្រូវបានចម្លង៖ https://plp-tms.moeys.gov.kh/courses/battambang-geip-af");
                          }}
                          className="p-1 hover:bg-stone-100 rounded-lg transition shrink-0 cursor-pointer"
                        >
                          <Share2 className="w-4 h-4 text-stone-700" />
                        </button>
                        <button 
                          type="button"
                          className="p-1 hover:bg-stone-100 rounded-lg transition shrink-0"
                        >
                          <MoreVertical className="w-4 h-4 text-stone-700" />
                        </button>
                      </div>
                    </div>

                    {/* Simulator App Content Area (Responsive container layout) */}
                    <div className="p-3 flex-grow flex flex-col gap-3.5 overflow-y-auto max-h-[640px] scrollbar-none bg-[#f1f5f9] [content-visibility:auto] pb-8">
                      
                      {/* SCREEN 1: COURSE LANDING PAGE DETAILS (HOME) */}
                      {mobileScreen === 'home' && (
                        <div className="flex flex-col gap-3.5">
                          {/* Top Logo Card */}
                          <div className="bg-white p-4 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col items-center justify-center gap-2 mt-1">
                            <div className="bg-amber-500/5 p-1 rounded-full border border-amber-400/20">
                              <svg className="w-14 h-14" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <circle cx="50" cy="50" r="45" fill="#f8fafc" stroke="#1d4ed8" strokeWidth="2.5" />
                                <circle cx="50" cy="50" r="39" stroke="#fbbf24" strokeWidth="1.5" strokeDasharray="3 3" />
                                {/* Open book representation */}
                                <path d="M35 60 C42 55, 48 58, 50 62 C52 58, 58 55, 65 60 L65 42 C58 38, 52 40, 50 44 C48 40, 42 38, 35 42 Z" fill="#2563eb" stroke="#1e3a8a" strokeWidth="1" />
                                {/* Flame of knowledge / Crown */}
                                <path d="M50 22 C48 30, 42 35, 46 45 C48 42, 52 42, 54 45 C58 35, 52 30, 50 22 Z" fill="#f59e0b" stroke="#d97706" strokeWidth="0.8" />
                                {/* Central structure */}
                                <line x1="50" y1="44" x2="50" y2="62" stroke="#fbbf24" strokeWidth="1.5" />
                                <circle cx="32" cy="35" r="1.5" fill="#fbbf24" />
                                <circle cx="68" cy="35" r="1.5" fill="#fbbf24" />
                                <circle cx="50" cy="16" r="2" fill="#ef4444" />
                              </svg>
                            </div>
                            <h3 className="font-moul text-[11.5px] text-stone-850 font-bold leading-tight text-center tracking-wide mt-1">
                              ចុះឈ្មោះចូលរួមវគ្គសិក្សា
                            </h3>
                          </div>

                          {/* Dynamic status card matching exact screenshot details */}
                          <div className="bg-white p-4.5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col gap-3 font-sans">
                            {/* Badges row matching original user image precisely */}
                            <div className="flex flex-wrap items-center gap-1.5">
                              {/* 1. ONGOING badge */}
                              <span className="text-[7.5px] tracking-wider font-mono font-bold text-stone-500 bg-stone-100 border border-stone-250 px-2 py-0.5 rounded-md uppercase">
                                ONGOING
                              </span>
                              
                              {/* 2. Completed cross boundary */}
                              <span className="text-[8px] font-bold text-rose-500 bg-rose-50/50 border border-rose-100 px-2 py-0.5 rounded-md">
                                បានបញ្ចប់
                              </span>

                              {/* 3. Registered successfully (Pulse if logged in) */}
                              <span className={`text-[8px] font-bold px-2 py-0.5 rounded-md flex items-center gap-0.5 transition-all ${
                                loginSuccessShow || isRegistered
                                  ? 'bg-blue-100 text-blue-700 border border-blue-300 shadow-2xs animate-pulse font-extrabold'
                                  : 'bg-blue-50 text-blue-600/80 border border-blue-200/50'
                              }`}>
                                <svg className="w-2.5 h-2.5 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                  <polyline points="20 6 9 17 4 12" />
                                </svg>
                                <span>បានចុះឈ្មោះរួចហើយ</span>
                              </span>
                            </div>

                            {/* Main Subject Title */}
                            <h4 className="font-moul text-[11.5px] text-slate-900 leading-relaxed font-bold tracking-tight mt-1">
                              ខេត្តបាត់ដំបង_GEIP-AF_ការគ្របគ្រងសាលារៀន ដើម្បីគាំទ្រការអនុវត្តស្តង់ដាសាលារៀនគំរូ
                            </h4>

                            <div className="border-t border-stone-100/85 my-0.5"></div>

                            {/* Details list item with icons */}
                            <div className="flex flex-col gap-2.5 text-[10px] text-stone-600">
                              {/* Date */}
                              <div className="flex items-start gap-2.5">
                                <span className="text-stone-400 mt-0.5 text-xs">📅</span>
                                <div>
                                  <span className="block font-bold text-stone-400 text-[8.5px] uppercase tracking-wide">កាលបរិច្ឆេទ៖</span>
                                  <span className="font-semibold text-stone-800">18 ឧសភា 2026 - 24 ឧសភា 2026</span>
                                </div>
                              </div>

                              {/* Location */}
                              <div className="flex items-start gap-2.5">
                                <span className="text-stone-400 mt-0.5 text-xs">📍</span>
                                <div>
                                  <span className="block font-bold text-stone-400 text-[8.5px] uppercase tracking-wide">ទីតាំង៖</span>
                                  <span className="font-semibold text-stone-850">Phnom Penh</span>
                                </div>
                              </div>

                              {/* Participants count */}
                              <div className="flex items-start gap-2.5">
                                <span className="text-stone-400 mt-0.5 text-xs">👥</span>
                                <div>
                                  <span className="block font-bold text-stone-400 text-[8.5px] uppercase tracking-wide">អ្នកចូលរួម៖</span>
                                  <span className="font-mono font-bold text-stone-850 text-[10.5px]">
                                    {loginSuccessShow ? '1356' : '1355'} <span className="text-stone-400 text-[9.5px] font-sans">/ 1700 នាក់</span>
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="border-t border-stone-100/85 my-0.5"></div>

                            {/* Blue alert card: Requires Login or Registered Teacher info */}
                            <div className="bg-[#eff6ff] border border-blue-100/80 p-3 rounded-xl flex flex-col gap-2">
                              
                              {/* Info header */}
                              <div className="flex items-center gap-1.5 text-[#2563eb]">
                                <div className="bg-[#2563eb] text-white w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0">
                                  i
                                </div>
                                <span className="font-moul text-[9.5px] font-bold">ត្រូវការចូលប្រើ</span>
                              </div>

                              <p className="text-[9px] text-[#2563eb] leading-relaxed font-semibold pl-5">
                                {loginSuccessShow 
                                  ? `ស្វាគមន៍! លោកគ្រូ/អ្នកគ្រូ «${currentTeacher.name}» វត្តមានរបស់អ្នកត្រូវបានកត់ត្រាក្នុងថ្នាក់ជាតិរួចរាល់។`
                                  : "សូមចូលប្រើ ឬចុះឈ្មោះដើម្បីចូលរួមវគ្គសិក្សានេះ"}
                              </p>

                              {/* Conditional Action Buttons */}
                              <div className="pl-5 mt-1">
                                {!loginSuccessShow ? (
                                  <div className="flex items-center gap-2">
                                    <button
                                      type="button"
                                      onClick={() => setMobileScreen('login')}
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-sans text-[10px] font-bold py-1.5 px-4 rounded-lg flex items-center gap-1 shadow-sm transition hover:scale-102 cursor-pointer border-none"
                                    >
                                      <LogIn className="w-3.5 h-3.5" />
                                      <span>ចូលប្រើ</span>
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setMobileScreen('registration')}
                                      className="bg-white hover:bg-slate-50 text-stone-700 font-sans text-[10px] font-semibold py-1.5 px-3.5 rounded-lg border border-stone-250 flex items-center gap-1 shadow-2xs transition hover:scale-102 cursor-pointer"
                                    >
                                      <UserPlus className="w-3.5 h-3.5 text-stone-500" />
                                      <span>ចុះឈ្មោះ</span>
                                    </button>
                                  </div>
                                ) : (
                                  <div className="flex flex-col gap-2">
                                    {/* Action row with active teacher indicator */}
                                    <div className="flex items-center justify-between bg-white/70 p-2 rounded-lg border border-blue-100/50">
                                      <div className="flex items-center gap-1.5">
                                        <span className="text-[12px]">👩‍🏫</span>
                                        <span className="font-moul text-[9px] text-blue-900 truncate max-w-[120px]">{currentTeacher.name}</span>
                                      </div>
                                      <span className="bg-emerald-100 text-emerald-800 text-[7px] font-sans px-1.5 py-0.5 rounded-sm uppercase font-bold">
                                        Active
                                      </span>
                                    </div>

                                    <div className="flex items-center gap-2">
                                      <button
                                        type="button"
                                        onClick={() => {
                                          alert("សូមចុះហត្ថលេខាបែបឌីជីថលនៅលើផ្ទះហត្ថលេខា (លោត modal លើអេក្រង់ធំ)!");
                                          setActiveSignatureTarget({ teacherId: currentTeacher.id, type: 'in' });
                                        }}
                                        className="bg-emerald-600 hover:bg-emerald-700 text-white font-sans text-[9px] font-bold py-1.5 px-3 rounded-lg flex items-center gap-1 shadow-sm transition cursor-pointer border-none w-full justify-center"
                                      >
                                        <span>✍️ ចុះហត្ថលេខាវត្តមាន</span>
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => {
                                          setLoginSuccessShow(false);
                                          setIsRegistered(false);
                                        }}
                                        className="bg-white text-stone-500 hover:text-stone-800 text-[9px] py-1.5 px-2.5 rounded-lg border border-stone-200 cursor-pointer"
                                      >
                                        🚪 ចាកចេញ
                                      </button>
                                    </div>
                                  </div>
                                )}
                              </div>

                            </div>
                          </div>
                        </div>
                      )}

                      {/* SCREEN 2: MOEYS LOGIN SCREEN */}
                      {mobileScreen === 'login' && (
                        <div className="bg-white p-5 rounded-2xl border border-stone-200.80 shadow-xs flex flex-col gap-4 mx-1 font-sans mt-1 animate-fade-in">
                          {/* Login Screen Header */}
                          <div className="flex flex-col items-center gap-1.5 text-center">
                            <span className="text-2xl">🔐</span>
                            <h4 className="font-moul text-[11px] text-slate-800 leading-tight">ប្រព័ន្ធគ្រប់គ្រងការបណ្តុះបណ្តាល</h4>
                            <p className="text-[9px] text-stone-400">សូមបំពេញគណនីគ្រូ ឬជ្រើសរើសគ្រូម្នាក់ក្នុងបញ្ជីរហ័ស</p>
                          </div>

                          <div className="border-t border-stone-100 my-0.5"></div>

                          {/* Quick Auto-Fill Companion for Testing */}
                          <div className="bg-amber-500/5 border border-amber-200 rounded-xl p-2.5 flex flex-col gap-1.5">
                            <span className="text-[8.5px] font-bold text-[#b45309] font-sans flex items-center gap-1">
                              <span>🔗</span> ជ្រើសរើសលោកគ្រូ/អ្នកគ្រូដែលមានស្រាប់ (Quick Autofill):
                            </span>
                            <select 
                              onChange={(e) => {
                                const matched = teachers.find(t => t.id === e.target.value);
                                if (matched) {
                                  setLoginUsername(matched.name);
                                  setLoginPassword('moeys1234');
                                  setSelectedTeacherId(matched.id);
                                }
                              }}
                              className="w-full bg-white border border-stone-200 rounded-lg p-1 text-[9.5px] font-sans text-stone-700 outline-none"
                            >
                              <option value="">-- ជ្រើសរើសឈ្មោះដើម្បីបំពេញស្វ័យប្រវត្ត --</option>
                              {teachers.map(t => (
                                <option key={t.id} value={t.id}>{t.name} ({t.gender})</option>
                              ))}
                            </select>
                          </div>

                          {/* Form Section */}
                          <div className="flex flex-col gap-3 text-stone-700 pr-0">
                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] font-sans font-bold text-stone-500 uppercase">ឈ្មោះគណនី ឬ អ៊ីមែល (Account/Email)</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"><User className="w-3.5 h-3.5" /></span>
                                <input
                                  type="text"
                                  value={loginUsername}
                                  onChange={(e) => setLoginUsername(e.target.value)}
                                  placeholder="ឈ្មោះពេញ ឬ អ៊ីមែល..."
                                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[10px] font-sans outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] font-sans font-bold text-stone-500 uppercase">លេខសម្ងាត់ (Password)</label>
                              <div className="relative">
                                <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-stone-400"><Lock className="w-3.5 h-3.5" /></span>
                                <input
                                  type="password"
                                  value={loginPassword}
                                  onChange={(e) => setLoginPassword(e.target.value)}
                                  placeholder="••••••••"
                                  className="w-full pl-8 pr-2.5 py-1.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[10px] font-sans outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                />
                              </div>
                            </div>

                            {/* Actions Group */}
                            <div className="flex flex-col gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!loginUsername) {
                                    alert("សូមជ្រើសរើស ឬវាយបញ្ចូលឈ្មោះគណនីជាមុនសិន!");
                                    return;
                                  }
                                  setIsLoggingIn(true);
                                  setTimeout(() => {
                                    setIsLoggingIn(false);
                                    setLoginSuccessShow(true);
                                    setIsRegistered(true);
                                    setMobileScreen('home');
                                    alert(`🔑 បានចូលប្រើប្រាស់គណនីលោកគ្រូ/អ្នកគ្រូ «${loginUsername}» ដោយជោគជ័យ!`);
                                  }, 1000);
                                }}
                                className="w-full py-2 bg-[#2563eb] hover:bg-blue-700 text-white font-sans text-xs font-bold rounded-xl transition shadow cursor-pointer border-none flex items-center justify-center gap-1.5"
                                disabled={isLoggingIn}
                              >
                                {isLoggingIn ? (
                                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <LogIn className="w-3.5 h-3.5" />
                                )}
                                <span>{isLoggingIn ? 'កំពុងផ្ទៀងផ្ទាត់...' : 'ចូលប្រើប្រាស់ជំនួស'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMobileScreen('home')}
                                className="w-full py-1.5 bg-white text-stone-500 hover:text-stone-800 text-[10px] font-sans rounded-xl border border-stone-250 transition cursor-pointer"
                              >
                                ត្រឡប់ក្រោយ (Back)
                              </button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* SCREEN 3: MOEYS COURSE REGISTRATION SCREEN */}
                      {mobileScreen === 'registration' && (
                        <div className="bg-white p-5 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col gap-4.5 mx-1 font-sans mt-1 animate-fade-in">
                          {/* Header */}
                          <div className="flex flex-col items-center gap-1 text-center">
                            <span className="text-2xl">📝</span>
                            <h4 className="font-moul text-[11px] text-slate-800 leading-tight">ចុះឈ្មោះសមាជិកថ្មីគរុកោសល្យ</h4>
                            <p className="text-[8.5px] text-stone-400">សូមបញ្ចូលព័ត៌មានជាក់លាក់ដើម្បីបង្កើតគណនីគ្រូថ្មី</p>
                          </div>

                          <div className="border-t border-stone-100 my-0.5"></div>

                          {/* Inputs */}
                          <div className="flex flex-col gap-3 text-stone-700">
                            {/* Full Name */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] font-sans font-bold text-stone-500 uppercase">គោត្តនាម-នាមខ្លួន (Full Name) <span className="text-red-500">*</span></label>
                              <input
                                type="text"
                                value={regName}
                                onChange={(e) => setRegName(e.target.value)}
                                placeholder="ឧ. ឡេង សុភ័ក្ត្រា"
                                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[10px] font-sans outline-none focus:ring-1 focus:ring-emerald-500"
                              />
                            </div>

                            {/* Gender selection */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] font-sans font-bold text-stone-500 uppercase">ភេទ (Gender)</label>
                              <div className="grid grid-cols-2 gap-2">
                                <button
                                  type="button"
                                  onClick={() => setRegGender('ប្រុស')}
                                  className={`py-1 rounded-lg text-[9.5px] font-bold border transition ${regGender === 'ប្រុស' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-200 text-stone-600'}`}
                                >
                                  👨‍🏫 ប្រុស (Male)
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setRegGender('ស្រី')}
                                  className={`py-1 rounded-lg text-[9.5px] font-bold border transition ${regGender === 'ស្រី' ? 'bg-emerald-600 border-emerald-600 text-white' : 'bg-white border-stone-200 text-stone-600'}`}
                                >
                                  👩‍🏫 ស្រី (Female)
                                </button>
                              </div>
                            </div>

                            {/* Card ID */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] font-sans font-bold text-stone-500 uppercase">លេខអត្តសញ្ញាណប័ណ្ណ / លេខគ្រូ</label>
                              <input
                                type="text"
                                value={regId}
                                onChange={(e) => setRegId(e.target.value)}
                                placeholder="ឧ. ID-88776"
                                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[10px] font-sans outline-none"
                              />
                            </div>

                            {/* Remarks */}
                            <div className="flex flex-col gap-1">
                              <label className="text-[8.5px] font-sans font-bold text-stone-500 uppercase">តួនាទី / កត់សម្គាល់ (Remarks)</label>
                              <input
                                type="text"
                                value={regRemarks}
                                onChange={(e) => setRegRemarks(e.target.value)}
                                placeholder="ឧ. គ្រូម៉ាត់ជំនួស, គ្រូថ្នាក់ទី៦..."
                                className="w-full px-3 py-1.5 rounded-lg border border-stone-200 bg-stone-50/50 text-[10px] font-sans outline-none"
                              />
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col gap-2 mt-2">
                              <button
                                type="button"
                                onClick={() => {
                                  if (!regName.trim()) {
                                    alert("សូមវាយបញ្ចូលឈ្មោះពេញរបស់លោកគ្រូ/អ្នកគ្រូ!");
                                    return;
                                  }
                                  setIsRegistering(true);
                                  setTimeout(() => {
                                    setIsRegistering(false);
                                    
                                    // Dynamically build and prepend teacher to global state
                                    const newTeacherObj: TeacherRecord = {
                                      id: `t-reg-${Date.now()}`,
                                      no: teachers.length + 1,
                                      name: regName.trim(),
                                      gender: regGender,
                                      remarks: regRemarks.trim() || 'ចុះឈ្មោះតាម MoEYS App',
                                      statusAM: 'វត្តមាន',
                                      timeInAM: '07:15 AM',
                                      signatureInAM: null,
                                      locationInAM: '11.5564° N, 104.9282° E (វិទ្យាល័យ ព្រះស៊ីសុវត្ថិ)',
                                      timeOutAM: '11:45 AM',
                                      signatureOutAM: null,
                                      locationOutAM: null,
                                      statusPM: 'វត្តមាន',
                                      timeInPM: '01:15 PM',
                                      signatureInPM: null,
                                      locationInPM: null,
                                      timeOutPM: '05:00 PM',
                                      signatureOutPM: null,
                                      locationOutPM: null,
                                      status: 'វត្តមាន',
                                      timeIn: '07:15 AM',
                                      signatureIn: null,
                                      timeOut: '11:45 AM',
                                      signatureOut: null
                                    };
                                    
                                    setTeachers([newTeacherObj, ...teachers]);
                                    setSelectedTeacherId(newTeacherObj.id);
                                    setLoginUsername(newTeacherObj.name);
                                    setLoginSuccessShow(true);
                                    setIsRegistered(true);
                                    
                                    // Reset registration inputs
                                    setRegName('');
                                    setRegId('');
                                    setRegPhone('');
                                    setRegRemarks('');
                                    
                                    setMobileScreen('home');
                                    alert(`🎉 បានចុះឈ្មោះលោកគ្រូ/អ្នកគ្រូ «${newTeacherObj.name}» ចូលក្នុងបញ្ជីថ្នាក់ជាតិដោយជោគជ័យ!`);
                                  }, 1100);
                                }}
                                className="w-full py-2 bg-[#10b981] hover:bg-emerald-600 text-white font-sans text-xs font-bold rounded-xl transition shadow cursor-pointer border-none flex items-center justify-center gap-1.5"
                                disabled={isRegistering}
                              >
                                {isRegistering ? (
                                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                                ) : (
                                  <Plus className="w-3.5 h-3.5" />
                                )}
                                <span>{isRegistering ? 'កំពុងបញ្ជូនទិន្នន័យ...' : 'ចុះឈ្មោះ និងចងវត្តមាន'}</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setMobileScreen('home')}
                                className="w-full py-1.5 bg-white text-stone-500 hover:text-stone-800 text-[10px] font-sans rounded-xl border border-stone-250 transition cursor-pointer"
                              >
                                បោះបង់ (Cancel)
                              </button>
                            </div>

                          </div>
                        </div>
                      )}

                      {/* Footer block matching screenshot footer copyright block */}
                      <div className="text-center text-[8px] text-[#94a3b8] font-sans py-2.5 mt-auto select-none">
                        © ២០២៥ ក្រសួងអប់រំ យុវជន និងកីឡា
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
            initialMethod={preferredSignatureMethod}
            onSave={handleSaveSignature}
            onClose={() => setActiveSignatureTarget(null)}
          />
        </div>
      )}
    </div>
  );
}
