// Project Text Configuration
// Edit this file to update all text content for project modals

export interface ProjectText {
  id: number;
  title: string;
  subtitle: string;
  year: number;
  tags: string[];
  description: string;
  client: string;
  fullDescription: string;
  challenges: string;
  solutions: string;
  technologies: string[];
  results: string;
  testimonial?: {
    text: string;
    author: string;
    role: string;
  };
  gallery: string[];
  stickerColor: string;
  stickerImage: string;
  links?: {
    live?: string;
    github?: string;
    behance?: string;
    dribbble?: string;
  };
  // New fields for body text with process images
  bodyText?: string; // Rich text content with embedded images
  processImages?: string[]; // Array of process image URLs
}

// Update this array with your project information
export const PROJECT_TEXTS: ProjectText[] = [
  {
    id: 1,
    title: "Tomi",
    subtitle: "A Gentle Response to Stressful Moments",
    year: 2025,
    tags: ["Woodworking", "Woodturning", "Collaboration with a craftsman", "3D mold printing", "3D printing", "Silicone casting", "Sewing"],
    description: "A sculptural, totem-like emotional companion that helps ease moments of stress and anxiety through simple touch interactions shared between a parent and a child.",
    client: "Shortlisted - Isola Design Awards 2025",
    fullDescription: "TOMI is my graduation project - a sculptural, totem-like object designed as first aid for stress and anxiety. It mediates calming interaction between parent and child through simple touch gestures such as tapping, pressing, and stroking.",
    challenges: "The main challenges were to design a product suitable for both adults and children, balancing playfulness with maturity and a homely presence, while ensuring the object invites touch and communicates its use intuitively. Another challenge was to relieve stress for both parent and child without shifting responsibility onto the child.",
    solutions: "The final design consists of three large wooden beads, each dedicated to a different calming action. Their tactile qualities- natural wood, soft textiles, and rounded forms, invite use intuitively. The modular system creates a sense of wholeness, while allowing the parent and child to use each element separately or together.",
    technologies: ["Woodworking", "Woodturning", "Collaboration with a craftsman", "3D mold printing", "3D printing", "Silicone casting", "Sewing"],
    results: "Shortlisted - Isola Design Awards 2025",
    testimonial: undefined,
    gallery: [
      "assets/images/tomi-gif.gif",
      "assets/images/tomi.jpg",
      "assets/images/tomi4.jpg",
      "assets/images/tomi5.jpg"
    ],
    stickerColor: "#E91E63", // Hot Pink
    stickerImage: "assets/images/sticker1.png",
    bodyText: `
      <h2>About</h2>
      <p>TOMI is my graduation project—a sculptural, totem-like object designed as first aid for stress and anxiety. It mediates calming interaction between parent and child through simple touch gestures such as tapping, pressing, and stroking.</p>
      
      <h3>Challenges</h3>
      <p>The main challenges were designing a product suitable for both adults and children, balancing playfulness with maturity while maintaining a homely presence, and ensuring the object invites touch and communicates its use intuitively. Another challenge was relieving stress for both parent and child without shifting responsibility onto the child.</p>
      <div class="process-image-slider">
        <img src="assets/images/tomi6.jpg" alt="Tomi design process - challenges" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design consists of three large wooden beads, each dedicated to a different calming action. Their tactile qualities—natural wood, soft textiles, and rounded forms—invite intuitive use. The modular system creates a sense of wholeness, while allowing the parent and child to use each element separately or together.</p>
      
      <h3>Techniques</h3>
      <p>The fabrication process combined traditional craftsmanship with advanced manufacturing methods. The wooden elements were shaped on a lathe in collaboration with a professional carpenter, while wool felt was sewn and integrated to create soft, tactile surfaces. Custom molds were designed and 3D printed, then used to cast medical-grade silicone parts, resulting in precise and durable components.</p>
    `,
    processImages: [
      "assets/images/tomi6.jpg"
    ]
  },
  {
    id: 2,
    title: "The Red Chair",
    subtitle: "A Bold Industrial Reinterpretation",
    year: 2025,
    tags: ["Tube bending", "Welding", "Metal forming", "Metal finishing", "Spray painting"],
    description: "A reinterpretation of the iconic Wishbone Chair, designed through industrial manufacturing techniques. By replacing wood with metal tube bending and sheet-metal forming, the chair explores a new material language while maintaining the elegance and lightness of the original.",
    client: "",
    fullDescription: "The Red Chair is a reinterpretation of the iconic Wishbone Chair, designed through industrial manufacturing techniques. By replacing wood with metal tube bending and sheet-metal forming, the chair explores a new material language while maintaining the elegance and lightness of the original.",
    challenges: "The challenge was to translate a classic wooden design into metal, ensuring both comfort and structural strength. Another challenge was to create a design that feels contemporary and bold without losing the recognizable identity of the original chair.",
    solutions: "The final design combines bent tubes and sheet metal, structurally reinforced with welded joints. The striking red spray-painted finish emphasizes its modern character, transforming a timeless classic into a bold, industrial statement piece that remains functional and durable.",
    technologies: ["Tube bending", "Welding", "Metal forming", "Metal finishing", "Spray painting"],
    results: "",
    testimonial: undefined,
    gallery: [
      "assets/images/chair-display.jpg",
      "assets/images/chair1.jpg",
      "assets/images/chair2.jpg",
      "assets/images/chair3.jpg"
    ],
    stickerColor: "#DC2626", // Red
    stickerImage: "assets/images/sticker2.png",
    bodyText: `
      <h2>About</h2>
      <p>The Red Chair is a reinterpretation of the iconic Wishbone Chair, designed through industrial manufacturing techniques. By replacing wood with metal tube bending and sheet-metal forming, the chair explores a new material language while maintaining the elegance and lightness of the original.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to translate a classic wooden design into metal, ensuring both comfort and structural strength. Another challenge was to create a design that feels contemporary and bold without losing the recognizable identity of the original chair.</p>
      <div class="process-image-slider">
        <img src="assets/images/chair4.JPG" alt="Red Chair design process - challenges 1" class="process-image-inline" />
        <img src="assets/images/chair5.jpg" alt="Red Chair design process - challenges 2" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design combines bent tubes and sheet metal, structurally reinforced with welded joints. The striking red spray-painted finish emphasizes its modern character, transforming a timeless classic into a bold, industrial statement piece that remains functional and durable.</p>
      
      <h3>Techniques</h3>
      <p>Metal tube bending, sheet-metal forming, welding reinforcement, industrial chair-design methods (standard dimensions and angles), spray painting, and metal finishing.</p>
    `,
    processImages: [
      "assets/images/chair4.JPG",
      "assets/images/chair5.jpg"
    ]
  },
  {
    id: 3,
    title: "3D Filters",
    subtitle: "Typography Design",
    year: 2024,
    tags: ["Typography", "Experimental", "Lettering"],
    description: "Experimental typography project exploring the relationship between letters and visual communication.",
    client: "Personal Project",
    fullDescription: "An experimental typography project that explores the boundaries of letterform design and visual communication. This project challenges conventional notions of readability while maintaining the essential communicative function of typography.",
    challenges: "Balancing artistic expression with functional typography was the primary challenge. We needed to create letterforms that were visually striking yet still recognizable and usable in various contexts.",
    solutions: "We developed a modular letterform system where each letter could be deconstructed and reconstructed in multiple ways. The design uses geometric principles and optical illusions to create letters that shift and transform based on context and viewer perspective.",
    technologies: ["Adobe Illustrator", "Glyphs", "Variable Fonts", "CSS"],
    results: "The project was featured in Typography Daily and received recognition from the Type Directors Club. It has been used in several editorial and branding projects.",
    testimonial: {
      text: "This project pushes the boundaries of what typography can be. It's both artistic and functional, which is incredibly rare.",
      author: "Emma Rodriguez",
      role: "Typography Director, Design Studio"
    },
    gallery: [
      "assets/images/3dfilters.png",
    ],
    stickerColor: "#FFD23F", // Sunny Yellow
    stickerImage: "assets/images/sticker3.png",
    links: {
      behance: "https://behance.net/alphabet-project",
      dribbble: "https://dribbble.com/shots/alphabet-project"
    }
  },
  {
    id: 4,
    title: "PITA",
    subtitle: "Outdoor Balance Training Product",
    year: 2023,
    tags: ["Balance training", "Outdoor product", "TPU 3D printing", "Textile sewing", "Embroidery", "Laser cutting", "Spray painting", "CMF", "Prototyping"],
    description: "PITA is an outdoor balance-training product designed to transform fabric tension into a dynamic sport activity. It invites users to practice balance in a playful yet physically challenging way, suitable both for beginners and advanced users.",
    client: "Winner – FIT Sport Design Awards 2025",
    fullDescription: "PITA is an outdoor balance-training product designed to transform fabric tension into a dynamic sport activity. It invites users to practice balance in a playful yet physically challenging way, suitable both for beginners and advanced users.",
    challenges: "The challenge was to create a product that provides a safe and engaging balance experience while being portable, durable, and suitable for outdoor use. Another challenge was to find the right material and surface texture that could mimic the unbalanced sensation of physiotherapy cushions while working at a larger, environmental scale.",
    solutions: "The final design combines durable tarpaulin fabric with custom nylon straps for strength and portability. The training surface integrates TPU-printed textures for grip and embroidered details to guide foot placement. A carefully developed CMF strategy contrasting colors, tactile textiles, and smooth plastic finishes creates both visual impact and a stimulating sensory experience, making balance training engaging and effective.",
    technologies: ["Balance training", "Outdoor product", "TPU 3D printing", "Textile sewing", "Embroidery", "Laser cutting", "Spray painting", "CMF", "Prototyping"],
    results: "Winner – FIT Sport Design Awards 2025",
    testimonial: undefined,
    gallery: [
      "assets/images/pita.JPG",
      "assets/images/pita3.jpg",
      "assets/images/pita4.jpg",
      "assets/images/pita5.jpg"
    ],
    stickerColor: "#FF6B35", // Orange
    stickerImage: "assets/images/sticker4.png",
    bodyText: `
      <h2>About</h2>
      <p>PITA is an outdoor balance-training product designed to transform fabric tension into a dynamic sport activity. It invites users to practice balance in a playful yet physically challenging way, suitable both for beginners and advanced users.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to create a product that provides a safe and engaging balance experience while being portable, durable, and suitable for outdoor use. Another challenge was to find the right material and surface texture that could mimic the unbalanced sensation of physiotherapy cushions while working at a larger, environmental scale.</p>
      <div class="process-image-slider">
        <img src="assets/images/pita7.JPG" alt="PITA design process - challenges" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design combines durable tarpaulin fabric with custom nylon straps for strength and portability. The training surface integrates TPU-printed textures for grip and embroidered details to guide foot placement. A carefully developed CMF strategy contrasting colors, tactile textiles, and smooth plastic finishes creates both visual impact and a stimulating sensory experience, making balance training engaging and effective.</p>
      <div class="process-image-slider">
        <img src="assets/images/pita2.jpg" alt="PITA design process - solutions 1" class="process-image-inline" />
        <img src="assets/images/pita6.jpg" alt="PITA design process - solutions 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project combined digital fabrication with textile craftsmanship. TPU 3D printing was used to create flexible grip textures, while laser cutting provided precision in shaping fabrics and straps. Sewing reinforced the straps, and embroidery added a distinctive logo detail. In addition, standard 3D printing with spray painting was applied for structural parts and visual accents.</p>
    `,
    processImages: [
      "assets/images/pita7.JPG",
      "assets/images/pita2.jpg",
      "assets/images/pita6.jpg"
    ]
  },
  {
    id: 5,
    title: "Project Itamar",
    subtitle: "Product Design & Photography",
    year: 2024,
    tags: ["Product Design", "Photography", "Furniture"],
    description: "Product design and photography for a collection of modern, minimalist furniture pieces.",
    client: "Furniture Studio",
    fullDescription: "A collaborative project with a furniture studio to design and photograph a collection of modern, minimalist furniture pieces. The focus was on creating timeless designs that emphasize function, comfort, and aesthetic appeal.",
    challenges: "The furniture needed to appeal to both residential and commercial markets while maintaining a cohesive design language. We also needed to create compelling photography that would work for both online retail and print catalogs.",
    solutions: "We developed a design system based on clean lines, natural materials, and modular construction. The photography uses natural lighting and minimalist staging to highlight the furniture's form and function without distraction.",
    technologies: ["Adobe Photoshop", "Adobe Lightroom", "Sketch", "3D Modeling"],
    results: "The furniture collection was featured in Design Milk and received orders from major retailers. The photography helped increase online sales by 30%.",
    testimonial: {
      text: "The design and photography perfectly showcase our furniture's quality and craftsmanship. It's exactly the aesthetic we were looking for.",
      author: "David Kim",
      role: "Creative Director, Furniture Studio"
    },
    gallery: [
      "assets/images/itamar.jpg",
    ],
    stickerColor: "#6A4C93", // Deep Purple
    stickerImage: "assets/images/sticker5.png",
    links: {
      live: "https://furniturestudio.com/collection",
      behance: "https://behance.net/furniture-project"
    }
  },
  {
    id: 6,
    title: "Lamp Design",
    subtitle: "Art Direction & Design",
    year: 2024,
    tags: ["Art Direction", "Paper Art", "Exhibition"],
    description: "Art direction and design for a collection of paper art pieces exploring texture, form, and negative space.",
    client: "Art Gallery",
    fullDescription: "An art direction project for a gallery exhibition featuring innovative paper art pieces. The project involved creating a cohesive visual identity for the exhibition while highlighting the unique qualities of each individual piece.",
    challenges: "The exhibition needed to work in a physical gallery space while also having a strong digital presence. We had to balance the delicate nature of paper art with bold, memorable design elements.",
    solutions: "We developed a design system that uses paper textures and subtle shadows to echo the physical artworks. The typography and layout create a sense of airiness and lightness that complements the paper medium.",
    technologies: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign", "Figma"],
    results: "The exhibition attracted 3,000+ visitors and received coverage in several art publications. The digital catalog helped reach an additional 15,000 people online.",
    testimonial: {
      text: "The art direction perfectly complemented our paper artworks. It created a cohesive experience that elevated the entire exhibition.",
      author: "Maria Santos",
      role: "Gallery Director"
    },
    gallery: [
      "assets/images/lamp.jpg",
    ],
    stickerColor: "#8E24AA", // Rich Purple
    stickerImage: "assets/images/sticker6.png",
    links: {
      behance: "https://behance.net/paper-art-project"
    }
  },
  {
    id: 7,
    title: "Rocky Stool",
    subtitle: "A Rocking Stool for Focus and Relaxation",
    year: 2023,
    tags: ["Rocking stool", "Balance", "Metal bending", "Wood integration", "Welding", "Prototyping"],
    description: "Rocky is a rocking stool designed to support concentration and relaxation. It allows users to choose between a stable sitting position and a gentle rocking motion.",
    client: "",
    fullDescription: "Rocky is a rocking stool designed to support concentration and relaxation. It allows users to choose between a stable sitting position and a gentle rocking motion. The idea originated after observing someone close to me coping with restlessness through repetitive swaying, which inspired me to design a product that channels this natural movement into calm and focus.",
    challenges: "The challenge was to design a stool that combines comfort, safety, and movement. It had to provide the user with stability for sitting while also enabling rocking that encourages relaxation, without compromising balance.",
    solutions: "The stool was developed with angled legs and a rounded base that create a controlled rocking effect, while still offering the option of stable sitting. This dual functionality allows users to transition smoothly between focus and relaxation, blending practicality with playfulness.",
    technologies: ["Rocking stool", "Balance", "Metal bending", "Wood integration", "Welding", "Prototyping"],
    results: "",
    gallery: [
      "assets/images/stool.jpg",
    ],
    stickerColor: "#8B4513", // Saddle Brown
    stickerImage: "assets/images/sticker1.png",
    bodyText: `
      <h2>About</h2>
      <p>Rocky is a rocking stool designed to support concentration and relaxation. It allows users to choose between a stable sitting position and a gentle rocking motion. The idea originated after observing someone close to me coping with restlessness through repetitive swaying, which inspired me to design a product that channels this natural movement into calm and focus.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to design a stool that combines comfort, safety, and movement. It had to provide the user with stability for sitting while also enabling rocking that encourages relaxation, without compromising balance.</p>
      
      <h3>Solutions</h3>
      <p>The stool was developed with angled legs and a rounded base that create a controlled rocking effect, while still offering the option of stable sitting. This dual functionality allows users to transition smoothly between focus and relaxation, blending practicality with playfulness.</p>
      
      <h3>Techniques</h3>
      <p>Material exploration through small-scale models, metal tube bending, wood integration, welded connections, and prototyping to refine angles and balance.</p>
    `,
    processImages: []
  },
  {
    id: 8,
    title: "Solidwork",
    subtitle: "Software Design",
    year: 2024,
    tags: ["UI/UX", "Software Design", "Industrial"],
    description: "User interface design for CAD software application.",
    client: "Tech Company",
    fullDescription: "Redesigned the user interface for better usability and workflow efficiency.",
    challenges: "Complex software with many features and tools.",
    solutions: "Streamlined interface with intuitive navigation and clear visual hierarchy.",
    technologies: ["Figma", "Adobe XD", "User Research"],
    results: "Improved user satisfaction and reduced learning curve by 40%.",
    gallery: [
      "assets/images/solidwork.jpg",
    ],
    stickerColor: "#2E86AB", // Blue
    stickerImage: "assets/images/sticker2.png"
  },
  {
    id: 9,
    title: "Mico",
    subtitle: "Brand Design",
    year: 2024,
    tags: ["Branding", "Logo Design", "Identity"],
    description: "Complete brand identity for a micro-brewery.",
    client: "Mico Brewery",
    fullDescription: "Created a comprehensive brand identity including logo, packaging, and marketing materials.",
    challenges: "Standing out in a competitive craft beer market.",
    solutions: "Developed a unique visual identity that reflected the brewery's artisanal approach.",
    technologies: ["Adobe Illustrator", "Adobe Photoshop", "Adobe InDesign"],
    results: "Increased brand recognition and market share.",
    gallery: [
      "assets/images/mico.jpg",
    ],
    stickerColor: "#A23B72", // Purple
    stickerImage: "assets/images/sticker3.png"
  },
  {
    id: 10,
    title: "A Bowl and A Pile",
    subtitle: "Product Design",
    year: 2024,
    tags: ["Product Design", "Ceramics", "Art"],
    description: "Ceramic bowl design exploring form and function.",
    client: "Ceramic Studio",
    fullDescription: "A conceptual ceramic design that challenges traditional bowl aesthetics.",
    challenges: "Creating functional art that serves both aesthetic and practical purposes.",
    solutions: "Balanced organic forms with practical considerations.",
    technologies: ["Clay Modeling", "Ceramic Firing", "3D Scanning"],
    results: "Featured in design exhibitions and ceramic art shows.",
    gallery: [
      "assets/images/bowl.jpg",
    ],
    stickerColor: "#F18F01", // Yellow
    stickerImage: "assets/images/sticker4.png"
  },
  {
    id: 11,
    title: "EVA",
    subtitle: "Furniture Design",
    year: 2024,
    tags: ["Furniture", "Sustainable Design", "Materials"],
    description: "Sustainable furniture design using recycled materials.",
    client: "Eco Furniture Co.",
    fullDescription: "A chair design that combines sustainability with modern aesthetics.",
    challenges: "Working with recycled materials while maintaining design quality.",
    solutions: "Innovative material processing and construction techniques.",
    technologies: ["Material Research", "Prototyping", "Life Cycle Analysis"],
    results: "Award-winning design recognized for sustainability.",
    gallery: [
      "assets/images/eva.jpg",
    ],
    stickerColor: "#4CAF50", // Green
    stickerImage: "assets/images/sticker5.png"
  },
  {
    id: 12,
    title: "K-SENSE",
    subtitle: "Platform Design",
    year: 2024,
    tags: ["UI/UX", "Digital Platform", "Sensory Design"],
    description: "Digital platform design focusing on sensory experiences.",
    client: "K-SENSE",
    fullDescription: "A comprehensive digital platform that enhances sensory experiences through technology.",
    challenges: "Translating sensory experiences into digital interfaces.",
    solutions: "Used advanced interaction design and multimedia elements.",
    technologies: ["Figma", "After Effects", "Web Development"],
    results: "Increased user engagement and platform adoption.",
    gallery: [
      "assets/images/ksense.jpg",
    ],
    stickerColor: "#7FB069", // Light Green
    stickerImage: "assets/images/sticker6.png"
  },
  {
    id: 13,
    title: "Ember",
    subtitle: "Lighting Design",
    year: 2024,
    tags: ["Lighting", "Product Design", "Materials"],
    description: "Innovative lighting design inspired by natural fire.",
    client: "Lighting Studio",
    fullDescription: "A table lamp that mimics the movement and warmth of embers.",
    challenges: "Creating realistic fire effects with safe materials.",
    solutions: "Used LED technology and specialized diffusers.",
    technologies: ["3D Modeling", "LED Programming", "Material Testing"],
    results: "Patent-pending design with commercial interest.",
    gallery: [
      "assets/images/ember.jpg",
    ],
    stickerColor: "#FF5722", // Deep Orange
    stickerImage: "assets/images/sticker1.png"
  },
  {
    id: 14,
    title: "Dancing Pot",
    subtitle: "Ceramic Design",
    year: 2024,
    tags: ["Ceramics", "Art", "Functional Design"],
    description: "Ceramic pot design with dynamic, flowing forms.",
    client: "Ceramic Artist",
    fullDescription: "A series of ceramic pots that appear to be in motion.",
    challenges: "Creating stable forms that suggest movement.",
    solutions: "Careful balance of weight distribution and visual flow.",
    technologies: ["Clay Sculpting", "Glazing Techniques", "Firing Processes"],
    results: "Exhibited in ceramic art galleries and design shows.",
    gallery: [
      "assets/images/dancingpot.jpg",
    ],
    stickerColor: "#9C27B0", // Purple
    stickerImage: "assets/images/sticker2.png"
  },
  {
    id: 15,
    title: "Tambourine",
    subtitle: "Music Brand",
    year: 2024,
    tags: ["Branding", "Music", "Photography"],
    description: "Brand identity and photography for music production.",
    client: "Tambourine Music",
    fullDescription: "Complete brand identity for a world music production company.",
    challenges: "Capturing the energy and rhythm of music visually.",
    solutions: "Dynamic photography and rhythmic typography.",
    technologies: ["Photography", "Adobe Photoshop", "Brand Guidelines"],
    results: "Enhanced brand recognition in the music industry.",
    gallery: [
      "assets/images/tambourine.JPG",
    ],
    stickerColor: "#4A90E2", // Medium Blue
    stickerImage: "assets/images/sticker3.png"
  },
  {
    id: 16,
    title: "Coffee Machine",
    subtitle: "Product Design",
    year: 2024,
    tags: ["Product Design", "Coffee", "Industrial Design"],
    description: "Coffee machine design inspired by Israeli artist Yaakov Kaufman.",
    client: "Coffee Company",
    fullDescription: "A specialty coffee machine that combines functionality with artistic inspiration.",
    challenges: "Integrating artistic elements with technical requirements.",
    solutions: "Collaborated with artists and engineers for optimal design.",
    technologies: ["CAD Modeling", "Prototyping", "Material Selection"],
    results: "Award-winning design featured in design publications.",
    gallery: [
      "assets/images/coffeemachine.jpg",
    ],
    stickerColor: "#E91E63", // Hot Pink
    stickerImage: "assets/images/sticker4.png"
  },
  {
    id: 17,
    title: "About Me",
    subtitle: "Designer Profile",
    year: 2024,
    tags: ["Personal Brand", "Portfolio", "About"],
    description: "Personal brand and portfolio showcasing design work and philosophy.",
    client: "Personal Project",
    fullDescription: "A comprehensive portfolio that tells the story of my design journey and philosophy.",
    challenges: "Presenting personal work in a professional yet authentic way.",
    solutions: "Created a narrative-driven portfolio with strong visual storytelling.",
    technologies: ["Web Design", "Content Strategy", "Visual Identity"],
    results: "Increased professional opportunities and client inquiries.",
    gallery: [
      "assets/images/Shiri.jpg",
    ],
    stickerColor: "#607D8B", // Blue Grey
    stickerImage: "assets/images/sticker5.png"
  }
];

// Contact Information
export const CONTACT_INFO = {
  email: "shirilanger@gmail.com",
  linkedin: "https://www.linkedin.com/in/shiri-langer/",
  cvPath: "/Shiri-Langer-CV-2025.pdf",
  cvFileName: "Shiri-Langer-CV-2025.pdf"
};

// General Text Content
export const GENERAL_TEXTS = {
  modal: {
    closeButton: "Close",
    viewProject: "View Project",
    viewAllWork: "View All Work",
    nextProject: "Next Project",
    prevProject: "Previous Project"
  },
  contact: {
    title: "Get In Touch",
    intro: "I'd love to hear about your project and discuss how we can work together to bring your vision to life.",
    form: {
      name: "Name *",
      email: "Email *",
      subject: "Subject *",
      message: "Message *",
      send: "Send Message",
      cancel: "Cancel",
      namePlaceholder: "Your name",
      emailPlaceholder: "your.email@example.com",
      subjectPlaceholder: "What's this about?",
      messagePlaceholder: "Tell me about your project...",
      successMessage: "Your email client should open with a pre-filled message. If it doesn't open, please email shirilanger@gmail.com directly."
    }
  },
  portfolio: {
    loading: "Loading projects...",
    error: "Unable to load projects. Please try again later.",
    noProjects: "No projects found."
  }
};

// Helper function to get project text by ID
export const getProjectText = (id: number): ProjectText | undefined => {
  return PROJECT_TEXTS.find(project => project.id === id);
};

// Helper function to get all project IDs
export const getAllProjectIds = (): number[] => {
  return PROJECT_TEXTS.map(project => project.id);
};
