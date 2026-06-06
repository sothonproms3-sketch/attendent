-- =========================================================================
-- SCHEMA FOR TEACHER ATTENDANCE SYSTEM (MoEYS Standard)
-- គ្រោងទិន្នន័យ (Database Schema DDL) សម្រាប់ការរក្សាទុកទិន្នន័យវត្តមាន និងហត្ថលេខាឌីជីថល
-- Supports: PostgreSQL, MySQL, and generic relational database engines.
-- =========================================================================

-- ១. តារាងព័ត៌មានលម្អិតរបស់លោកគ្រូ-អ្នកគ្រូ (Teachers Table)
CREATE TABLE IF NOT EXISTS teachers (
    id VARCHAR(50) PRIMARY KEY, -- លេខសម្គាល់គណនីគ្រូ (e.g. t-1, t-2 etc.)
    no INT NOT NULL, -- លេខរៀងលំដាប់តារាង
    name VARCHAR(150) NOT NULL, -- នាមត្រកូល និងនាមខ្លួនលោកគ្រូ/អ្នកគ្រូ
    gender VARCHAR(10) CHECK (gender IN ('ប្រុស', 'ស្រី')), -- ភេទ
    remarks VARCHAR(255) DEFAULT '', -- តួនាទី ឬ កម្រិតថ្នាក់ដឹកនាំ/មុខវិជ្ជា
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ២. តារាងកត់ត្រាវត្តមានលម្អិត ប្រចាំថ្ងៃ និងតាមវេននីមួយៗ (Attendance Logs Table)
-- តារាងនេះផ្ទុកវត្តមាន ពេលវេលាចុះ និងរូបភាពហត្ថលេខាកម្រិតស្ដង់ដារ (Base64 transparent stamp)
CREATE TABLE IF NOT EXISTS attendance_logs (
    id SERIAL PRIMARY KEY,
    teacher_id VARCHAR(50) NOT NULL REFERENCES teachers(id) ON DELETE CASCADE,
    attendance_date DATE NOT NULL DEFAULT CURRENT_DATE, -- កាលបរិច្ឆេទវត្តមាន

    -- វេនពេលព្រឹក (Morning Shift - AM)
    status_am VARCHAR(20) DEFAULT 'អវត្តមាន' CHECK (status_am IN ('វត្តមាន', 'អវត្តមាន', 'ច្បាប់', 'យឺត')),
    time_in_am TIME NULL, -- ម៉ោងចូលព្រឹក
    signature_in_am TEXT NULL, -- រូបភាពហត្ថលេខា Base64 (Transparent-Stamp)
    location_in_am VARCHAR(150) NULL, -- កូអរដោនេផែនទី ឬការបញ្ជាក់ទីតាំង GPS ពេលចូលព្រឹក

    time_out_am TIME NULL, -- ម៉ោងចេញព្រឹក
    signature_out_am TEXT NULL, -- រូបភាពហត្ថលេខា Base64 (Transparent-Stamp)
    location_out_am VARCHAR(150) NULL, -- កូអរដោនេផែនទី ឬការបញ្ជាក់ទីតាំង GPS ពេលចេញព្រឹក

    -- វេនពេលរសៀល (Afternoon Shift - PM)
    status_pm VARCHAR(20) DEFAULT 'អវត្តមាន' CHECK (status_pm IN ('វត្តមាន', 'អវត្តមាន', 'ច្បាប់', 'យឺត')),
    time_in_pm TIME NULL, -- ម៉ោងចូលរសៀល
    signature_in_pm TEXT NULL, -- រូបភាពហត្ថលេខា Base64 (Transparent-Stamp)
    location_in_pm VARCHAR(150) NULL, -- កូអរដោនេផែនទី ឬការបញ្ជាក់ទីតាំង GPS ពេលចូលរសៀល

    time_out_pm TIME NULL, -- ម៉ោងចេញរសៀល
    signature_out_pm TEXT NULL, -- រូបភាពហត្ថលេខា Base64 (Transparent-Stamp)
    location_out_pm VARCHAR(150) NULL, -- កូអរដោនេផែនទី ឬការបញ្ជាក់ទីតាំង GPS ពេលចេញរសៀល

    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    -- ការពារកុំឱ្យមានការកត់ត្រាវត្តមានស្ទួនក្នុងថ្ងៃតែមួយ ចំពោះគ្រូម្នាក់
    CONSTRAINT unique_teacher_date UNIQUE (teacher_id, attendance_date)
);

-- ៣. តារាងរក្សាទុកទិន្នន័យកំណត់សម្គាល់ឯកសារបោះពុម្ព MoEYS (Document Config Table)
CREATE TABLE IF NOT EXISTS document_configs (
    id SERIAL PRIMARY KEY,
    motto_line1 VARCHAR(150) DEFAULT 'ព្រះរាជាណាចក្រកម្ពុជា',
    motto_line2 VARCHAR(150) DEFAULT 'ជាតិ សាសនា ព្រះមហាក្សត្រ',
    school_name VARCHAR(255) DEFAULT '', -- ឈ្មោះសាលារៀន ឬ វិទ្យាល័យ
    title VARCHAR(255) DEFAULT 'បញ្ជីស្រង់វត្តមានលោកគ្រូអ្នកគ្រូ',
    sub_title VARCHAR(255) DEFAULT '', -- ព័ត៌មានបន្ថែមក្រោមចំណងជើង
    
    -- កាលបរិច្ឆេទបែបចន្ទគតិខ្មែរ (Khmer Lunar Calendar Fields)
    lunar_day_of_week VARCHAR(50) DEFAULT 'ថ្ងៃ សៅរ៍',
    lunar_day_num VARCHAR(50) DEFAULT '១៥ កើត',
    lunar_month VARCHAR(50) DEFAULT 'ខែ មិគសិរ',
    lunar_zodiac VARCHAR(50) DEFAULT 'ឆ្នាំ មមី',
    lunar_era VARCHAR(50) DEFAULT 'អដ្ឋស័ក',
    lunar_be VARCHAR(50) DEFAULT 'ព.ស. ២៥៧០',
    
    custom_lunar_date VARCHAR(255) DEFAULT '',
    custom_solar_date VARCHAR(255) DEFAULT '',
    use_custom_date_text BOOLEAN DEFAULT FALSE,

    -- ហត្ថលេខារបស់អ្នករៀបចំ និងអ្នកយល់ព្រមឯកភាព
    maker_title VARCHAR(150) DEFAULT 'អ្នកធ្វើតារាង',
    maker_name VARCHAR(150) DEFAULT '',
    approver_title VARCHAR(150) DEFAULT 'បានឃើញ និងឯកភាព',
    approver_sub_title VARCHAR(150) DEFAULT 'នាយកវិទ្យាល័យ',
    approver_name VARCHAR(150) DEFAULT '',
    
    is_active BOOLEAN DEFAULT TRUE, -- Config សកម្មបច្ចុប្បន្ន
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexes ជួយបន្ស៊ាំល្បឿនក្នុងការទាញយកទិន្នន័យវត្តមាន (Optimization Queries)
CREATE INDEX IF NOT EXISTS idx_attendance_date ON attendance_logs (attendance_date);
CREATE INDEX IF NOT EXISTS idx_attendance_teacher_id ON attendance_logs (teacher_id);


-- =========================================================================
-- ឧទាហរណ៍នៃការបញ្ចូលទិន្នន័យគំរូដំបូង (Initial Sample Seed Data)
-- =========================================================================

-- បញ្ចូលព័ត៌មានគណនីគ្រូសាកល្បង
INSERT INTO teachers (id, no, name, gender, remarks) VALUES
('t-1', 1, 'ព្រំ សុធន', 'ប្រុស', 'គ្រូបច្ចេកទេស'),
('t-2', 2, 'លឹម សុផល', 'ស្រី', 'គ្រូបង្រៀនគណិតវិទ្យា'),
('t-3', 3, 'ចាន់ សុខា', 'ប្រុស', 'គ្រូបង្រៀនរូបវិទ្យា'),
('t-4', 4, 'កែវ មន្នី', 'ស្រី', 'នាយិកាសាលា')
ON CONFLICT (id) DO NOTHING;

-- បញ្ចូលគំរូកំណត់ហេតុវត្តមាន
INSERT INTO attendance_logs (
    teacher_id, 
    attendance_date, 
    status_am, 
    time_in_am, 
    location_in_am, 
    status_pm, 
    time_in_pm, 
    location_in_pm
) VALUES 
('t-2', CURRENT_DATE, 'វត្តមាន', '07:15:00', '13.0957, 103.2022', 'វត្តមាន', '13:45:00', '13.0957, 103.2022')
ON CONFLICT ON CONSTRAINT unique_teacher_date DO NOTHING;

-- បញ្ចូលគំរូ config ឯកសារបោះពុម្ព
INSERT INTO document_configs (
    motto_line1, motto_line2, school_name, title, sub_title, 
    lunar_day_of_week, lunar_day_num, lunar_month, lunar_zodiac, lunar_be, 
    maker_name, approver_name
) VALUES (
    'ព្រះរាជាណាចក្រកម្ពុជា', 
    'ជាតិ សាសនា ព្រះមហាក្សត្រ', 
    'វិទ្យាល័យ ព្រះមុនីវង្ស', 
    'បញ្ជីស្រង់វត្តមានបុគ្គលិកសិក្សា', 
    'ប្រចាំវគ្គបណ្តុះបណ្តាលសាលារៀនគំរូ', 
    'ថ្ងៃ សៅរ៍', '១៥ កើត', 'ខែ មិគសិរ', 'ឆ្នាំ មមី', 'ព.ស. ២៥៧០',
    'លឹម សុផល', 'កែវ មន្នី'
);
