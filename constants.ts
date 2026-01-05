
import { Language, ClinicalProtocol, HealthTip } from './types';

export const SUPPORTED_LANGUAGES: Language[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ்' },
  { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી' },
  { code: 'kn', name: 'Kannada', nativeName: 'ಕನ್ನಡ' },
  { code: 'ml', name: 'Malayalam', nativeName: 'മലയാളം' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬೀ' },
];

export const CLINICAL_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: '1',
    title: 'Severe Dehydration in Children',
    category: 'Emergency',
    symptoms: ['Lethargy', 'Sunken eyes', 'Poor skin turgor', 'Unable to drink'],
    steps: [
      'Assess airway and breathing.',
      'Start IV fluids immediately (Ringer’s Lactate or Normal Saline).',
      'If IV not available, use Nasogastric tube.',
      'Refer to primary health center immediately.'
    ]
  },
  {
    id: '2',
    title: 'Antenatal Care - First Visit',
    category: 'Maternal Health',
    symptoms: ['Pregnancy confirmation', 'Morning sickness'],
    steps: [
      'Register the pregnancy.',
      'Measure blood pressure and weight.',
      'Prescribe Iron and Folic Acid (IFA) tablets.',
      'Schedule first ultrasound scan (10-14 weeks).'
    ]
  },
  {
    id: '3',
    title: 'Hypertension Screening',
    category: 'Chronic Disease',
    symptoms: ['Headache', 'Dizziness', 'Vision changes'],
    steps: [
      'Check BP twice, 5 minutes apart.',
      'If > 140/90, advice low salt diet and physical activity.',
      'Recheck in 2 weeks.',
      'If persistently high, refer to medical officer.'
    ]
  }
];

export const HEALTH_TIPS: HealthTip[] = [
  {
    id: '1',
    title: 'Monitor your Salt',
    content: 'Reducing salt helps control blood pressure. Avoid pickles and salty snacks.',
    category: 'HYPERTENSION'
  },
  {
    id: '2',
    title: 'Walk Daily',
    content: 'A 30-minute brisk walk helps manage blood sugar levels effectively.',
    category: 'DIABETES'
  },
  {
    id: '3',
    title: 'Stay Hydrated',
    content: 'Drink at least 8 glasses of water daily for better kidney health.',
    category: 'GENERAL'
  }
];
