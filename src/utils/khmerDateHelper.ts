// Lists for Cambodian Lunar calendar selections

export const KHMER_DAYS = [
  'អាទិត្យ',
  'ចន្ទ',
  'អង្គារ',
  'ពុធ',
  'ព្រហស្បតិ៍',
  'សុក្រ',
  'សៅរ៍'
];

export const KHMER_LUNAR_DAYS = [
  '១ កើត', '២ កើត', '៣ កើត', '៤ កើត', '៥ កើត', '៦ កើត', '៧ កើត', '៨ កើត', '៩ កើត', '១០ កើត', '១១ កើត', '១២ កើត', '១៣ កើត', '១៤ កើត', '១៥ កើត',
  '១ រនោច', '២ រនោច', '៣ រនោច', '៤ រនោច', '៥ រនោច', '៦ រនោច', '៧ រនោច', '៨ រនោច', '៩ រនោច', '១០ រនោច', '១១ រនោច', '១២ រនោច', '១៣ រនោច', '១៤ រនោច', '១៥ រនោច'
];

export const KHMER_LUNAR_MONTHS = [
  'មិគសិរ', 'បុស្ស', 'មាឃ', 'ផល្គុន', 'ចេត្រ', 'ពិសាខ', 'ជេស្ឋ', 'អាសាឍ', 'ស្រាពណ៍', 'ភទ្របទ', 'អស្សុជ', 'កក្ដិក'
];

export const KHMER_ZODIAC_YEARS = [
  'ជូត', 'ឆ្លូវ', 'ខាល', 'ថោះ', 'រោង', 'ម្សាញ់', 'មមី', 'មមែ', 'វក', 'រកា', 'ច', 'កុរ'
];

export const KHMER_ERAS = [
  'ឯកស័ក', 'ទោស័ក', 'ត្រីស័ក', 'ចត្វាស័ក', 'បញ្ចស័ក', 'ឆស័ក', 'សប្តស័ក', 'អដ្ឋស័ក', 'នព្វស័ក', 'សំរឹទ្ធិស័ក'
];

export const KHMER_MONTHS_SOLAR = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា', 'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

export function getKhmerSolarDate(date: Date): string {
  const day = date.getDate();
  const monthIndex = date.getMonth();
  const year = date.getFullYear() + 544; // Buddhist Era is +544 years in solar/lunar calendar typically, or Gregorian year
  const rawYear = date.getFullYear();
  
  const khmerDayName = KHMER_DAYS[date.getDay()];
  const khmerMonthName = KHMER_MONTHS_SOLAR[monthIndex];
  
  // Example: ថ្ងៃសៅរ៍ ទី០៦ ខែមិថុនា ឆ្នាំ២០២៦
  const formatNum = (num: number) => {
    const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
    return num.toString().split('').map(digit => khmerDigits[parseInt(digit, 10)] || digit).join('');
  };

  return `ថ្ងៃ${khmerDayName} ទី${formatNum(day)} ខែ${khmerMonthName} ឆ្នាំ${formatNum(rawYear)}`;
}

export function convertToKhmerDigits(num: number | string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return num.toString().split('').map(digit => khmerDigits[parseInt(digit, 10)] || digit).join('');
}
