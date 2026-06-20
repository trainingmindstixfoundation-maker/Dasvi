export interface MultiLangString {
  en: string;
  mr: string;
  hi: string;
}

export interface ClassItem {
  id: string;
  name: MultiLangString;
  description: MultiLangString;
  image: string;
}

export interface MediumItem {
  id: string;
  name: MultiLangString;
  image: string;
}

export interface SubjectItem {
  id: string;
  classId: string;
  mediumId: string;
  name: MultiLangString;
  image: string;
}

export interface VideoItem {
  id: string;
  subjectId: string;
  title: MultiLangString;
  description: MultiLangString;
  thumbnail: string;
  videoUrl: string;
  duration: string;
  views: number;
  createdAt: string;
}

export const mockClasses: ClassItem[] = [
  {
    id: 'c10',
    name: { en: 'Class 10', mr: 'इयत्ता १० वी', hi: 'कक्षा १०' },
    description: {
      en: 'Board Exam Preparation',
      mr: 'बोर्ड परीक्षा तयारी',
      hi: 'बोर्ड परीक्षा की तैयारी'
    },
    image: 'https://images.unsplash.com/photo-1427504494785-3a9ca7044f45?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'c12',
    name: { en: 'Class 12', mr: 'इयत्ता १२ वी', hi: 'कक्षा १२' },
    description: {
      en: 'HSC Board & Entrance',
      mr: 'एचएससी बोर्ड आणि प्रवेश',
      hi: 'एचएससी बोर्ड और प्रवेश'
    },
    image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&q=80&w=800'
  }
];

export const mockMediums: MediumItem[] = [
  {
    id: 'm-en',
    name: { en: 'English Medium', mr: 'इंग्रजी माध्यम', hi: 'अंग्रेजी माध्यम' },
    image: 'https://images.unsplash.com/photo-1546410531-bea5aadcb6ce?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-mr',
    name: { en: 'Marathi Medium', mr: 'मराठी माध्यम', hi: 'मराठी माध्यम' },
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'm-hi',
    name: { en: 'Hindi Medium', mr: 'हिंदी माध्यम', hi: 'हिंदी माध्यम' },
    image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&q=80&w=800'
  }
];

export const mockSubjects: SubjectItem[] = [
  {
    id: 's-math-10',
    classId: 'c10',
    mediumId: 'm-en',
    name: { en: 'Mathematics', mr: 'गणित', hi: 'गणित' },
    image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's-sci-10',
    classId: 'c10',
    mediumId: 'm-en',
    name: { en: 'Science', mr: 'विज्ञान', hi: 'विज्ञान' },
    image: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 's-hist-10',
    classId: 'c10',
    mediumId: 'm-mr',
    name: { en: 'History', mr: 'इतिहास', hi: 'इतिहास' },
    image: 'https://images.unsplash.com/photo-1461360370896-922624d12aa1?auto=format&fit=crop&q=80&w=800'
  }
];

export const mockVideos: VideoItem[] = [
  {
    id: 'v1',
    subjectId: 's-math-10',
    title: {
      en: 'Algebra Basics',
      mr: 'बीजगणित मूलतत्त्वे',
      hi: 'बीजगणित मूल बातें'
    },
    description: {
      en: 'Introduction to linear equations and variables.',
      mr: 'रेषीय समीकरणे आणि चलांची ओळख.',
      hi: 'रैखिक समीकरणों और चरों का परिचय।'
    },
    thumbnail: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '12:45',
    views: 1250,
    createdAt: '2023-10-01'
  },
  {
    id: 'v2',
    subjectId: 's-math-10',
    title: {
      en: 'Quadratic Equations',
      mr: 'वर्गसमीकरणे',
      hi: 'द्विघात समीकरण'
    },
    description: {
      en: 'Solving quadratic equations using formulas.',
      mr: 'सूत्रांचा वापर करून वर्गसमीकरणे सोडवणे.',
      hi: 'सूत्रों का उपयोग करके द्विघात समीकरण हल करना।'
    },
    thumbnail: 'https://images.unsplash.com/photo-1596495578065-6e0763fa1178?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '18:20',
    views: 840,
    createdAt: '2023-10-05'
  },
  {
    id: 'v3',
    subjectId: 's-sci-10',
    title: {
      en: 'Chemical Reactions',
      mr: 'रासायनिक अभिक्रिया',
      hi: 'रासायनिक प्रतिक्रियाएं'
    },
    description: {
      en: 'Understanding different types of chemical reactions.',
      mr: 'विविध प्रकारच्या रासायनिक अभिक्रिया समजून घेणे.',
      hi: 'विभिन्न प्रकार की रासायनिक प्रतिक्रियाओं को समझना।'
    },
    thumbnail: 'https://images.unsplash.com/photo-1603126857599-f6e157824fce?auto=format&fit=crop&q=80&w=800',
    videoUrl: 'https://www.w3schools.com/html/mov_bbb.mp4',
    duration: '15:10',
    views: 2100,
    createdAt: '2023-10-10'
  }
];
