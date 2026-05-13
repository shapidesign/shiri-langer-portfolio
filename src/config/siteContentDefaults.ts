/** Structured About modal content (Supabase `about_data` + bundled default). */

export interface AboutExpertiseItem {
  title: string;
  body: string;
}

export interface AboutHighlight {
  projectId: number;
  title: string;
  year: string;
  description: string;
  imageUrl: string;
  award?: string;
}

export type AboutSectionVariant = 'text' | 'expertise' | 'tools' | 'highlights';

export interface AboutSection {
  id: string;
  title: string;
  variant: AboutSectionVariant;
  /** Plain text when variant === 'text' */
  body?: string;
  expertiseItems?: AboutExpertiseItem[];
  toolTags?: string[];
  highlights?: AboutHighlight[];
}

export interface AboutContent {
  heroImage: string;
  heroImageAlt: string;
  heroTitle: string;
  heroSubtitle: string;
  intro: string;
  sections: AboutSection[];
  ctaTitle: string;
  ctaBody: string;
}

export interface ContactSiteContent {
  email: string;
  linkedin: string;
}

export const DEFAULT_CONTACT_DATA: ContactSiteContent = {
  email: 'shirilanger@gmail.com',
  linkedin: 'https://www.linkedin.com/in/shiri-langer/',
};

export const DEFAULT_CV_PUBLIC_URL = '/Shiri-Langer-CV-2026.pdf';
export const DEFAULT_CV_FILE_NAME = 'Shiri-Langer-CV-2026.pdf';

/** Mirrors former hardcoded AboutModal.tsx content. */
export const DEFAULT_ABOUT_DATA: AboutContent = {
  heroImage: '/assets/images/Shiri.jpg',
  heroImageAlt: 'Shiri Langer',
  heroTitle: 'Shiri Langer',
  heroSubtitle: 'Industrial Designer',
  intro:
    'An industrial designer based in Milan, focusing on creating meaningful products that improve everyday life.\nMy work is driven by empathy, curiosity, and a commitment to combining creative thinking with hands-on making.',
  sections: [
    {
      id: 'philosophy',
      title: 'Design Philosophy',
      variant: 'text',
      body:
        'I believe that thoughtful design has the power to address both emotional and physical challenges that words alone cannot resolve.\nFor me, well-designed products are those that place people at the center, creating solutions that not only function effectively but also foster comfort, empathy, and emotional connection.',
    },
    {
      id: 'expertise',
      title: 'Areas of Expertise',
      variant: 'expertise',
      expertiseItems: [
        {
          title: 'Product Development & Manufacturing',
          body: 'End-to-end product development from concept to production, specializing in injection molding, CNC machining, extrusion, and innovative manufacturing technologies',
        },
        {
          title: 'Medical & Inclusive Design',
          body: 'Human-centered design for healthcare and accessibility, with experience at Sheba Medical Center and consulting for JDC-Israel',
        },
        {
          title: 'Advanced Prototyping & Fabrication',
          body: 'Expert in 3D modeling (SolidWorks, Rhino, Onshape), 3D printing, CNC machining, woodworking, and traditional model making',
        },
        {
          title: 'Design Studio Leadership',
          body: 'Building and leading in-house design teams within manufacturing environments, driving innovation and creative excellence',
        },
        {
          title: 'Visual Design & AI Integration',
          body: 'Proficient in Adobe Creative Suite and AI-powered design platforms (Vizcom, Krea, Runway, Midjourney) for visualization and rapid ideation',
        },
        {
          title: 'Collaborative Design Thinking',
          body: 'Leading multidisciplinary teams through human-centered design processes, fostering creativity and excellence in both process and outcome',
        },
      ],
    },
    {
      id: 'highlights',
      title: 'Notable Projects',
      variant: 'highlights',
      highlights: [
        {
          projectId: 1,
          title: 'TOMI',
          year: '2025',
          description: 'Graduation project, a sculptural object for parent–child interaction in stressful moments.',
          imageUrl: '/assets/images/tomi/tomimaindisplay.webp',
          award: 'Shortlisted, Isola Design Awards 2025',
        },
        {
          projectId: 3,
          title: '3D FILTER',
          year: '2025',
          description: 'Conceptual wearables translating digital beauty filters into physical form.',
          imageUrl: '/assets/images/3dfilters/Filterdisplaymain.webp',
        },
        {
          projectId: 4,
          title: 'PITA',
          year: '2023',
          description: 'Outdoor balance-training product for playful physical activity.',
          imageUrl: '/assets/images/pita/pitadisplay.webp',
          award: 'Winner, FIT Sport Design Awards 2025',
        },
      ],
    },
    {
      id: 'tools',
      title: 'Tools & Technologies',
      variant: 'tools',
      toolTags: [
        'Adobe Illustrator',
        'Adobe Photoshop',
        'Adobe InDesign',
        'Adobe Lightroom',
        'Adobe XD',
        'Adobe After Effects',
        'Figma',
        'Sketch',
        'Principle',
        'SolidWorks',
        '3D Modeling',
        'CAD Modeling',
        '3D Printing',
        'CNC Machining',
        'Photography',
        'Typography',
        'User Research',
        'Prototyping',
        'Material Research',
        'Web Development',
        'React',
        'CSS',
        'Variable Fonts',
        'Glyphs',
      ],
    },
  ],
  ctaTitle: "Let's Work Together",
  ctaBody:
    "I'm passionate about creating meaningful products that address real human needs through thoughtful design. Whether you're developing a new product from concept to production, need inclusive design solutions for healthcare, or want to explore innovative manufacturing approaches I'd love to collaborate on your project. Let's combine creative thinking with hands-on making to create solutions that foster comfort, empathy, and emotional connection.",
};

/** Shallow-merge saved JSON over defaults so missing keys still work. */
export function mergeAboutData(raw: unknown | null | undefined): AboutContent {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_ABOUT_DATA, sections: DEFAULT_ABOUT_DATA.sections.map((s) => ({ ...s })) };
  const o = raw as Partial<AboutContent>;
  return {
    ...DEFAULT_ABOUT_DATA,
    ...o,
    sections: Array.isArray(o.sections) && o.sections.length > 0 ? (o.sections as AboutSection[]) : DEFAULT_ABOUT_DATA.sections,
  };
}

export function mergeContactData(raw: unknown | null | undefined): ContactSiteContent {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_CONTACT_DATA };
  const c = raw as Partial<ContactSiteContent>;
  return {
    email: typeof c.email === 'string' ? c.email : DEFAULT_CONTACT_DATA.email,
    linkedin: typeof c.linkedin === 'string' ? c.linkedin : DEFAULT_CONTACT_DATA.linkedin,
  };
}
