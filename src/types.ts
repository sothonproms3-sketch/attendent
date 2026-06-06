export interface TeacherRecord {
  id: string;
  no: number;
  name: string;
  gender: 'ប្រុស' | 'ស្រី';
  remarks: string;
  
  // Morning shift (AM)
  statusAM: 'វត្តមាន' | 'អវត្តមាន' | 'ច្បាប់' | 'យឺត';
  timeInAM: string;
  signatureInAM: string | null;
  locationInAM: string | null;     // Saved coordinates or description
  timeOutAM: string;
  signatureOutAM: string | null;
  locationOutAM: string | null;    // Saved coordinates or description

  // Afternoon shift (PM)
  statusPM: 'វត្តមាន' | 'អវត្តមាន' | 'ច្បាប់' | 'យឺត';
  timeInPM: string;
  signatureInPM: string | null;
  locationInPM: string | null;     // Saved coordinates or description
  timeOutPM: string;
  signatureOutPM: string | null;
  locationOutPM: string | null;    // Saved coordinates or description

  // Fallbacks for backwards compatibility
  status: 'វត្តមាន' | 'អវត្តមាន' | 'ច្បាប់' | 'យឺត';
  timeIn: string;
  signatureIn: string | null;
  timeOut: string;
  signatureOut: string | null;
}

export interface DocumentConfig {
  mottoLine1: string; // ព្រះរាជាណាចក្រកម្ពុជា
  mottoLine2: string; // ជាតិ សាសនា ព្រះមហាក្សត្រ
  schoolName: string; // e.g., វិទ្យាល័យ...
  title: string;       // បញ្ជីស្រង់វត្តមានលោកគ្រូអ្នកគ្រូ
  subTitle: string;    // e.g., ប្រចាំថ្ងៃ ទី...
  
  // Lunar date settings
  lunarDayOfWeek: string;  // ថ្ងៃ សៅរ៍
  lunarDayNum: string;     // ១៥ កើត
  lunarMonth: string;      // ខែ មិគសិរ
  lunarZodiac: string;     // ឆ្នាំ មមី
  lunarEra: string;        // អដ្ឋស័ក
  lunarBE: string;         // ព.ស. ២៥៧០
  
  // Custom manual date strings (if they want full control)
  customLunarDate: string; 
  customSolarDate: string; // ថ្ងៃទី... ខែ... ឆ្នាំ...
  
  // Signatures / Footers
  makerTitle: string;      // អ្នកធ្វើតារាង
  makerName: string;       // ឈ្មោះអ្នកធ្វើតារាង
  approverTitle: string;   // បានឃើញ និងឯកភាព
  approverSubTitle: string;// នាយក/នាយិកា
  approverName: string;    // ឈ្មោះនាយក/នាយិកា
  
  useCustomDateText: boolean;
}
