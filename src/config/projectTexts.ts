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
      "/assets/images/tomi/tomigif.gif",
      "/assets/images/tomi/TomiDisplay1.webp",
      "/assets/images/tomi/tomi01.webp",
      "/assets/images/tomi/tomi2 2.webp"
    ],
    stickerColor: "#E91E63", // Hot Pink
    stickerImage: "/assets/images/sticker1.png",
    bodyText: `
      <h2>About</h2>
      <p>TOMI is my graduation project—a sculptural, totem-like object designed as first aid for stress and anxiety. It mediates calming interaction between parent and child through simple touch gestures such as tapping, pressing, and stroking.</p>
      
      <h3>Challenges</h3>
      <p>The main challenges were designing a product suitable for both adults and children, balancing playfulness with maturity while maintaining a homely presence, and ensuring the object invites touch and communicates its use intuitively. Another challenge was relieving stress for both parent and child without shifting responsibility onto the child.</p>
      <div class="process-image-slider">
        <img src="/assets/images/tomi/tomi05.webp" alt="Tomi design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/tomi/tomi03.webp" alt="Tomi design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/tomi/tomi02.webp" alt="Tomi design process - challenges 3" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design consists of three large wooden beads, each dedicated to a different calming action. Their tactile qualities—natural wood, soft textiles, and rounded forms—invite intuitive use. The modular system creates a sense of wholeness, while allowing the parent and child to use each element separately or together.</p>
      <div class="process-image-slider">
        <img src="/assets/images/tomi/tomi3 2.webp" alt="Tomi design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/tomi/tomi06.webp" alt="Tomi design process - solutions 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The fabrication process combined traditional craftsmanship with advanced manufacturing methods. The wooden elements were shaped on a lathe in collaboration with a professional carpenter, while wool felt was sewn and integrated to create soft, tactile surfaces. Custom molds were designed and 3D printed, then used to cast medical-grade silicone parts, resulting in precise and durable components.</p>
    `,
    processImages: [
      "/assets/images/tomi/tomi05.webp",
      "/assets/images/tomi/tomi03.webp",
      "/assets/images/tomi/tomi02.webp",
      "/assets/images/tomi/tomi3 2.webp",
      "/assets/images/tomi/tomi06.webp"
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
      "/assets/images/chair/chair-display-2.webp",
      "/assets/images/chair/chair1-2.webp",
      "/assets/images/chair/chair2-2.webp",
      "/assets/images/chair/chair3-2.webp"
    ],
    stickerColor: "#DC2626", // Red
    stickerImage: "/assets/images/sticker2.png",
    bodyText: `
      <h2>About</h2>
      <p>The Red Chair is a reinterpretation of the iconic Wishbone Chair, designed through industrial manufacturing techniques. By replacing wood with metal tube bending and sheet-metal forming, the chair explores a new material language while maintaining the elegance and lightness of the original.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to translate a classic wooden design into metal, ensuring both comfort and structural strength. Another challenge was to create a design that feels contemporary and bold without losing the recognizable identity of the original chair.</p>
      <div class="process-image-slider">
        <img src="/assets/images/chair/chair02.webp" alt="Red Chair design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/chair/chair04.webp" alt="Red Chair design process - challenges 2" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design combines bent tubes and sheet metal, structurally reinforced with welded joints. The striking red spray-painted finish emphasizes its modern character, transforming a timeless classic into a bold, industrial statement piece that remains functional and durable.</p>
      <div class="process-image-slider">
        <img src="/assets/images/chair/chair5-2.webp" alt="Red Chair design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/chair/chair05.webp" alt="Red Chair design process - solutions 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>Metal tube bending, sheet-metal forming, welding reinforcement, industrial chair-design methods (standard dimensions and angles), spray painting, and metal finishing.</p>
    `,
    processImages: [
      "/assets/images/chair/chair02.webp",
      "/assets/images/chair/chair04.webp",
      "/assets/images/chair/chair5-2.webp",
      "/assets/images/chair/chair05.webp"
    ]
  },
  {
    id: 3,
    title: "3D Filters",
    subtitle: "3D-Printed Facial Accessories Exploring Beauty Rituals",
    year: 2025,
    tags: ["SLA 3D printing", "3D modeling", "Wearable design", "Critical design", "Beauty culture"],
    description: "A collection of 3D-printed facial accessories that explores the tension between empowerment and insecurity within beauty rituals. Inspired by the quiet gestures of hidden beauty tools—like face-lifting stickers or patches—the project reimagines them not as invisible fixes, but as bold, expressive wearables that sit between ornament and function.",
    client: "",
    fullDescription: "3D FILTERS is a collection of 3D-printed facial accessories that explores the tension between empowerment and insecurity within beauty rituals. Inspired by the quiet gestures of hidden beauty tools—like face-lifting stickers or patches—the project reimagines them not as invisible fixes, but as bold, expressive wearables that sit between ornament and function.",
    challenges: "The challenge was to translate tools meant for concealment into visible artifacts without losing their symbolic meaning. Another challenge was to design objects that feel both provocative and wearable, engaging users in reflection about beauty, identity, and control.",
    solutions: "The project redefines hidden beauty tools by making them visible and expressive. Instead of concealing or correcting, the accessories highlight the traces of self-maintenance and transform them into bold design elements. Through this shift, 3D FILTERS challenges conventional ideals of beauty and opens a space for self-expression and reflection.",
    technologies: ["3D modeling", "SLA 3D printing of lightweight structures", "Model finishing", "Visual storytelling for social media"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/3dfilters/filterdisplay.webp",
      "/assets/images/3dfilters/filterg1.webp",
      "/assets/images/3dfilters/filterg2.webp",
      "/assets/images/3dfilters/filterg3.webp"
    ],
    stickerColor: "#FFD23F", // Sunny Yellow
    stickerImage: "/assets/images/sticker3.png",
    bodyText: `
      <h2>About</h2>
      <p>3D FILTERS is a collection of 3D-printed facial accessories that explores the tension between empowerment and insecurity within beauty rituals. Inspired by the quiet gestures of hidden beauty tools—like face-lifting stickers or patches—the project reimagines them not as invisible fixes, but as bold, expressive wearables that sit between ornament and function.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to translate tools meant for concealment into visible artifacts without losing their symbolic meaning. Another challenge was to design objects that feel both provocative and wearable, engaging users in reflection about beauty, identity, and control.</p>
      <div class="process-image-slider">
        <img src="/assets/images/3dfilters/filterchal1.webp" alt="3D Filters design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/3dfilters/filterchal2.webp" alt="3D Filters design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/3dfilters/filterchal3.webp" alt="3D Filters design process - challenges 3" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The project redefines hidden beauty tools by making them visible and expressive. Instead of concealing or correcting, the accessories highlight the traces of self-maintenance and transform them into bold design elements. Through this shift, 3D FILTERS challenges conventional ideals of beauty and opens a space for self-expression and reflection.</p>
      <div class="process-image-slider">
        <img src="/assets/images/3dfilters/filtersol1.webp" alt="3D Filters design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/3dfilters/filtersol2.webp" alt="3D Filters design process - solutions 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project utilized 3D modeling to create intricate lightweight structures optimized for facial wearability. SLA 3D printing enabled the production of precise, delicate forms with fine details, while careful model finishing ensured comfort and aesthetic quality. Visual storytelling through social media documentation played a crucial role in communicating the project's critical perspective on beauty culture.</p>
    `,
    processImages: [
      "/assets/images/3dfilters/filterchal1.webp",
      "/assets/images/3dfilters/filterchal2.webp",
      "/assets/images/3dfilters/filterchal3.webp",
      "/assets/images/3dfilters/filtersol1.webp",
      "/assets/images/3dfilters/filtersol2.webp"
    ]
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
      "/assets/images/pita/pita-display.webp",
      "/assets/images/pita/pita-final.webp",
      "/assets/images/pita/pitafinal3.webp",
      "/assets/images/pita/pitafinal4.webp",
      "/assets/images/pita/pitfinal2.webp"
    ],
    stickerColor: "#FF6B35", // Orange
    stickerImage: "/assets/images/sticker4.png",
    bodyText: `
      <h2>About</h2>
      <p>PITA is an outdoor balance-training product designed to transform fabric tension into a dynamic sport activity. It invites users to practice balance in a playful yet physically challenging way, suitable both for beginners and advanced users.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to create a product that provides a safe and engaging balance experience while being portable, durable, and suitable for outdoor use. Another challenge was to find the right material and surface texture that could mimic the unbalanced sensation of physiotherapy cushions while working at a larger, environmental scale.</p>
      <div class="process-image-slider">
        <img src="/assets/images/pita/pitasketch1.webp" alt="PITA design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/pita/pitasketch02_2.webp" alt="PITA design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/pita/pitasketch03.webp" alt="PITA design process - challenges 3" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design combines durable tarpaulin fabric with custom nylon straps for strength and portability. The training surface integrates TPU-printed textures for grip and embroidered details to guide foot placement. A carefully developed CMF strategy contrasting colors, tactile textiles, and smooth plastic finishes creates both visual impact and a stimulating sensory experience, making balance training engaging and effective.</p>
      <div class="process-image-slider">
        <img src="/assets/images/pita/pitaprog1.webp" alt="PITA design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/pita/pitaprog2.webp" alt="PITA design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/pita/pitaprog3.webp" alt="PITA design process - solutions 3" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project combined digital fabrication with textile craftsmanship. TPU 3D printing was used to create flexible grip textures, while laser cutting provided precision in shaping fabrics and straps. Sewing reinforced the straps, and embroidery added a distinctive logo detail. In addition, standard 3D printing with spray painting was applied for structural parts and visual accents.</p>
    `,
    processImages: [
      "/assets/images/pita/pitasketch1.webp",
      "/assets/images/pita/pitasketch02_2.webp",
      "/assets/images/pita/pitasketch03.webp",
      "/assets/images/pita/pitaprog1.webp",
      "/assets/images/pita/pitaprog2.webp",
      "/assets/images/pita/pitaprog3.webp"
    ]
  },
  {
    id: 5,
    title: "Project Itamar",
    subtitle: "Adaptive Surf Prosthesis",
    year: 2024,
    tags: ["Adaptive design", "Prosthetics", "Special needs", "Adaptive sports", "3D modeling", "PETG", "TPU", "Team collaboration", "TOM Global (Tikkun Olam Makers) internship"],
    description: "An adaptive surf prosthesis designed for Itamar, an amputee who was seriously injured by an explosion. Although he was already surfing with one hand, his dream was to improve his professional surfing skills, particularly mastering the \"pop-up\" movement—pushing the body up from the board to stand.",
    client: "TOM Global (Tikkun Olam Makers)",
    fullDescription: "The Itamar Project is an adaptive surf prosthesis designed for Itamar, an amputee who was seriously injured by an explosion. Although he was already surfing with one hand, his dream was to improve his professional surfing skills, particularly mastering the \"pop-up\" movement—pushing the body up from the board to stand. As part of my internship at TOM Global (Tikkun Olam Makers), our team developed a customized prosthesis to help him achieve this goal.",
    challenges: "The main challenge was to design a prosthesis strong and ergonomic enough to withstand the forces of surfing, while also being comfortable, lightweight, and waterproof.",
    solutions: "The prosthesis is composed of three parts: a sock made from special surfing fabric, a flexible interface, and a spoon-shaped paddle. These are connected by a locking mechanism and straps. My main role was 3D modeling the prototypes in SolidWorks and preparing files for 3D printing. The spoon was printed in PETG (waterproof and sunproof), while the flexible part was made from TPU for comfort and adaptability.",
    technologies: ["3D modeling in SolidWorks", "3D printing in PETG and TPU", "Material testing", "User testing with athlete and trainer"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/itamar/itadisp.webp",
      "/assets/images/itamar/itagal1.webp",
      "/assets/images/itamar/itagal3.webp",
      "/assets/images/itamar/itagal4.webp"
    ],
    stickerColor: "#6A4C93", // Deep Purple
    stickerImage: "/assets/images/sticker5.png",
    bodyText: `
      <h2>About</h2>
      <p>The Itamar Project is an adaptive surf prosthesis designed for Itamar, an amputee who was seriously injured by an explosion. Although he was already surfing with one hand, his dream was to improve his professional surfing skills, particularly mastering the "pop-up" movement—pushing the body up from the board to stand. As part of my internship at TOM Global (Tikkun Olam Makers), our team developed a customized prosthesis to help him achieve this goal.</p>
      
      <h3>Challenges</h3>
      <p>The main challenge was to design a prosthesis strong and ergonomic enough to withstand the forces of surfing, while also being comfortable, lightweight, and waterproof.</p>
      <div class="process-image-slider">
        <img src="/assets/images/itamar/itachal1.webp" alt="Project Itamar design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/itamar/itasol3.webp" alt="Project Itamar design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/itamar/itasol4.webp" alt="Project Itamar design process - challenges 3" class="process-image-inline" />
        <img src="/assets/images/itamar/itasol5.webp" alt="Project Itamar design process - challenges 4" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The prosthesis is composed of three parts: a sock made from special surfing fabric, a flexible interface, and a spoon-shaped paddle. These are connected by a locking mechanism and straps. My main role was 3D modeling the prototypes in SolidWorks and preparing files for 3D printing. The spoon was printed in PETG (waterproof and sunproof), while the flexible part was made from TPU for comfort and adaptability.</p>
      <div class="process-image-slider">
        <img src="/assets/images/itamar/itaproto2.webp" alt="Project Itamar design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/itamar/itasol1.webp" alt="Project Itamar design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/itamar/itasol2.webp" alt="Project Itamar design process - solutions 3" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project utilized 3D modeling in SolidWorks to design and refine the prosthesis components, followed by 3D printing using PETG for the waterproof spoon element and TPU for the flexible interface. Extensive material testing ensured durability and performance, while user testing with the athlete and trainer validated the design's functionality and comfort in real surfing conditions.</p>
    `,
    processImages: [
      "/assets/images/itamar/itachal1.webp",
      "/assets/images/itamar/itasol3.webp",
      "/assets/images/itamar/itasol4.webp",
      "/assets/images/itamar/itasol5.webp",
      "/assets/images/itamar/itaproto2.webp",
      "/assets/images/itamar/itasol1.webp",
      "/assets/images/itamar/itasol2.webp"
    ]
  },
  {
    id: 6,
    title: "Lamp",
    subtitle: "Industrial-Inspired Flexible Lighting for Large Workspaces",
    year: 2022,
    tags: ["Lamp design", "Industrial mechanics", "Linear motion", "Bearings", "Iron finishing", "3D printing", "LED lighting"],
    description: "This lamp was inspired by the mechanics of industrial cranes and heavy machines that move on central axes. Designed for use on large sketch tables, it provides strong and flexible lighting while allowing smooth movement across the workspace.",
    client: "",
    fullDescription: "This lamp was inspired by the mechanics of industrial cranes and heavy machines that move on central axes. Designed for use on large sketch tables, it provides strong and flexible lighting while allowing smooth movement across the workspace.",
    challenges: "The main challenge was to design a lamp that could move linearly while remaining stable, yet still allow adjustment across multiple axes. The structure needed to balance freedom of movement with reliability and durability.",
    solutions: "The final system is built around a main iron rod tilted into a diamond-like angle, along which two iron wheels move. A third wheel, fixed on a bearing, ensures stability on the square iron profile. To provide additional balance, the system rests on two weighted legs that anchor the lamp firmly. This combination creates a structure that is both mobile and stable, while LED lighting and custom 3D-printed parts complete the design with efficiency and precision.",
    technologies: ["Iron profile finishing", "Integration of wheels and bearings", "Weighted base assembly", "3D printing of custom components", "LED electronics"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/lamp/lampdis.webp",
      "/assets/images/lamp/lampgal1.webp",
      "/assets/images/lamp/lampgal2.webp",
      "/assets/images/lamp/IMG_9965.mp4"
    ],
    stickerColor: "#8E24AA", // Rich Purple
    stickerImage: "/assets/images/sticker6.png",
    bodyText: `
      <h2>About</h2>
      <p>This lamp was inspired by the mechanics of industrial cranes and heavy machines that move on central axes. Designed for use on large sketch tables, it provides strong and flexible lighting while allowing smooth movement across the workspace.</p>
      
      <h3>Challenges</h3>
      <p>The main challenge was to design a lamp that could move linearly while remaining stable, yet still allow adjustment across multiple axes. The structure needed to balance freedom of movement with reliability and durability.</p>
      <div class="process-image-slider">
        <img src="/assets/images/lamp/IMG_3094.webp" alt="Lamp design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/lamp/IMG_9829.webp" alt="Lamp design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/lamp/IMG_9778.webp" alt="Lamp design process - challenges 3" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final system is built around a main iron rod tilted into a diamond-like angle, along which two iron wheels move. A third wheel, fixed on a bearing, ensures stability on the square iron profile. To provide additional balance, the system rests on two weighted legs that anchor the lamp firmly. This combination creates a structure that is both mobile and stable, while LED lighting and custom 3D-printed parts complete the design with efficiency and precision.</p>
      <div class="process-image-slider">
        <img src="/assets/images/lamp/IMG_9798.webp" alt="Lamp design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/lamp/IMG_9867.webp" alt="Lamp design process - solutions 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project involved careful iron profile finishing to achieve the desired surface quality, followed by precise integration of wheels and bearings to enable smooth linear motion. The weighted base assembly was designed to provide stability without compromising mobility. Custom 3D-printed components were developed to integrate LED electronics seamlessly, completing the functional and aesthetic design of the lamp.</p>
    `,
    processImages: [
      "/assets/images/lamp/IMG_3094.webp",
      "/assets/images/lamp/IMG_9829.webp",
      "/assets/images/lamp/IMG_9778.webp",
      "/assets/images/lamp/IMG_9798.webp",
      "/assets/images/lamp/IMG_9867.webp"
    ]
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
      "/assets/images/stool/DisplayStool.webp",
      "/assets/images/stool/Stoolg1.webp",
      "/assets/images/stool/Stoolg2.webp",
      "/assets/images/stool/Stoolg3.webp"
    ],
    stickerColor: "#8B4513", // Saddle Brown
    stickerImage: "/assets/images/sticker1.png",
    bodyText: `
      <h2>About</h2>
      <p>Rocky is a rocking stool designed to support concentration and relaxation. It allows users to choose between a stable sitting position and a gentle rocking motion. The idea originated after observing someone close to me coping with restlessness through repetitive swaying, which inspired me to design a product that channels this natural movement into calm and focus.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to design a stool that combines comfort, safety, and movement. It had to provide the user with stability for sitting while also enabling rocking that encourages relaxation, without compromising balance.</p>
      <div class="process-image-slider">
        <img src="/assets/images/stool/challenges1.webp" alt="Rocky Stool design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/stool/challenges2.webp" alt="Rocky Stool design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/stool/chalenges3.webp" alt="Rocky Stool design process - challenges 3" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The stool was developed with angled legs and a rounded base that create a controlled rocking effect, while still offering the option of stable sitting. This dual functionality allows users to transition smoothly between focus and relaxation, blending practicality with playfulness.</p>
      <div class="process-image-slider">
        <img src="/assets/images/stool/solutions1.webp" alt="Rocky Stool design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/stool/solutions2.webp" alt="Rocky Stool design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/stool/solutions3.webp" alt="Rocky Stool design process - solutions 3" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>Material exploration through small-scale models, metal tube bending, wood integration, welded connections, and prototyping to refine angles and balance.</p>
    `,
    processImages: [
      "/assets/images/stool/challenges1.webp",
      "/assets/images/stool/challenges2.webp",
      "/assets/images/stool/chalenges3.webp",
      "/assets/images/stool/solutions1.webp",
      "/assets/images/stool/solutions2.webp",
      "/assets/images/stool/solutions3.webp"
    ]
  },
  {
    id: 8,
    title: "Solidworks Camera",
    subtitle: "Detailed 3D Model of Nikon D3200 Camera",
    year: 2023,
    tags: ["SolidWorks", "Advanced 3D modeling", "Assemblies", "Surface detailing", "Rendering"],
    description: "A detailed 3D model of the Nikon D3200 camera, designed in SolidWorks to demonstrate precision and advanced control of the software. The project highlights my ability to handle complex geometries, assemblies, and surface detailing while producing realistic renderings.",
    client: "",
    fullDescription: "A detailed 3D model of the Nikon D3200 camera, designed in SolidWorks to demonstrate precision and advanced control of the software. The project highlights my ability to handle complex geometries, assemblies, and surface detailing while producing realistic renderings.",
    challenges: "The main challenge was to replicate a consumer product with high accuracy, requiring attention to proportions, part connections, and surface finishes.",
    solutions: "Through detailed modeling of each component and precise digital assembly, I achieved a realistic and accurate representation of the camera. The final renderings showcase material qualities and demonstrate full control over the SolidWorks environment.",
    technologies: ["SolidWorks advanced 3D modeling", "Assemblies", "Surface detailing", "Material rendering"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/solidworks/Soliddisp.webp",
      "/assets/images/solidworks/Solidgal1.webp",
      "/assets/images/solidworks/solidgal2.webp",
      "/assets/images/solidworks/solidgal3.webp",
      "/assets/images/solidworks/solidgal4.webp"
    ],
    stickerColor: "#2E86AB", // Blue
    stickerImage: "/assets/images/sticker2.png",
    bodyText: `
      <h2>About</h2>
      <p>A detailed 3D model of the Nikon D3200 camera, designed in SolidWorks to demonstrate precision and advanced control of the software. The project highlights my ability to handle complex geometries, assemblies, and surface detailing while producing realistic renderings.</p>
      
      <h3>Challenges</h3>
      <p>The main challenge was to replicate a consumer product with high accuracy, requiring attention to proportions, part connections, and surface finishes.</p>
      
      <h3>Solutions</h3>
      <p>Through detailed modeling of each component and precise digital assembly, I achieved a realistic and accurate representation of the camera. The final renderings showcase material qualities and demonstrate full control over the SolidWorks environment.</p>
      
      <h3>Process</h3>
      <div class="process-image-slider">
        <img src="/assets/images/solidworks/solidproc1.webp" alt="Solidworks Camera design process - process 1" class="process-image-inline" />
        <img src="/assets/images/solidworks/solidproc2.webp" alt="Solidworks Camera design process - process 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project utilized SolidWorks advanced 3D modeling capabilities to create precise geometries and assemblies. Surface detailing techniques ensured accurate representation of the camera's complex forms, while material rendering brought the digital model to life with realistic textures and finishes.</p>
    `,
    processImages: [
      "/assets/images/solidworks/solidproc1.webp",
      "/assets/images/solidworks/solidproc2.webp"
    ]
  },
  {
    id: 9,
    title: "Mico",
    subtitle: "Flexible Adventure Toy for Children",
    year: 2024,
    tags: ["Toy design", "Beech wood", "Elastic bands", "Beads", "Child-safe colors", "Play interaction"],
    description: "MICO is a flexible adventure toy inspired by childhood memories of hanging a rabbit doll everywhere and imagining it as part of a magical world. Designed with flexible arms, MICO can be hung in multiple ways, encouraging children to imagine endless scenarios and adventures.",
    client: "",
    fullDescription: "MICO is a flexible adventure toy inspired by my childhood memories of hanging my rabbit doll everywhere and imagining it as part of a magical world. Designed with flexible arms, MICO can be hung in multiple ways, encouraging children to imagine endless scenarios and adventures.",
    challenges: "The challenge was to design a toy that sparks imagination while remaining safe and intuitive for very young children. Observations in a kindergarten (ages 1–3) revealed the need to focus on grip, tactile exploration, and playful interaction.",
    solutions: "The toy was carefully designed to balance imagination and safety. It is built from beech wood beads and elastic bands for flexibility, with dimensions adapted so the beads cannot be swallowed by children. Durable, child-safe colors ensure long-lasting play. The result is a toy that can be held, hung, and reimagined in multiple ways, becoming both a playful tool and a companion.",
    technologies: ["Concept development", "Prototyping and testing with children", "Woodwork with beech wood", "Integration of elastic bands", "Bead assembly", "Surface finishing with durable child-safe colors"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/mico/micodis.webp",
      "/assets/images/mico/micogal1.webp",
      "/assets/images/mico/micogal2.webp"
    ],
    stickerColor: "#A23B72", // Purple
    stickerImage: "/assets/images/sticker3.png",
    bodyText: `
      <h2>About</h2>
      <p>MICO is a flexible adventure toy inspired by my childhood memories of hanging my rabbit doll everywhere and imagining it as part of a magical world. Designed with flexible arms, MICO can be hung in multiple ways, encouraging children to imagine endless scenarios and adventures.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to design a toy that sparks imagination while remaining safe and intuitive for very young children. Observations in a kindergarten (ages 1–3) revealed the need to focus on grip, tactile exploration, and playful interaction.</p>
      <div class="process-image-slider">
        <img src="/assets/images/mico/micochal2.webp" alt="MICO design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/mico/micochal1.webp" alt="MICO design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/mico/micosol5.webp" alt="MICO design process - challenges 3" class="process-image-inline" />
        <img src="/assets/images/mico/micosol6.webp" alt="MICO design process - challenges 4" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The toy was carefully designed to balance imagination and safety. It is built from beech wood beads and elastic bands for flexibility, with dimensions adapted so the beads cannot be swallowed by children. Durable, child-safe colors ensure long-lasting play. The result is a toy that can be held, hung, and reimagined in multiple ways, becoming both a playful tool and a companion.</p>
      <div class="process-image-slider">
        <img src="/assets/images/mico/micosol1.webp" alt="MICO design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/mico/micosol2.webp" alt="MICO design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/mico/micosol3.webp" alt="MICO design process - solutions 3" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project began with concept development and prototyping, followed by extensive testing with children in a kindergarten setting. Woodwork with beech wood created the core structural elements, while elastic bands provided the flexibility essential to the toy's functionality. Careful bead assembly ensured safety through appropriate sizing, and surface finishing with durable child-safe colors guaranteed both visual appeal and long-lasting quality.</p>
    `,
    processImages: [
      "/assets/images/mico/micochal2.webp",
      "/assets/images/mico/micochal1.webp",
      "/assets/images/mico/micosol5.webp",
      "/assets/images/mico/micosol6.webp",
      "/assets/images/mico/micosol1.webp",
      "/assets/images/mico/micosol2.webp",
      "/assets/images/mico/micosol3.webp"
    ]
  },
  {
    id: 10,
    title: "A Bowl and A Pile",
    subtitle: "Ceramic Serving Bowls Inspired by African Culture",
    year: 2024,
    tags: ["Ceramics", "Slip casting", "Glazing", "3D modeling", "3D printing", "Cultural inspiration"],
    description: "A set of ceramic serving bowls inspired by the way women in African cultures carry baskets on their heads. The project translates this cultural image into a sculptural design, creating bowls intended for serving, display, or as decorative objects in the home.",
    client: "",
    fullDescription: "A Bowl and A Pile is a set of ceramic serving bowls inspired by the way women in African cultures carry baskets on their heads. The project translates this cultural image into a sculptural design, creating bowls intended for serving, display, or as decorative objects in the home.",
    challenges: "The challenge was to transform a visual and cultural reference into a tangible object while maintaining a balance between expressive form and functional use for serving and presentation.",
    solutions: "By studying proportions and stacked compositions, I created bowls that can be displayed individually or arranged together as a sculptural centerpiece. The design preserves the elegance of the inspiration while offering multiple serving and display possibilities.",
    technologies: ["Sketching", "3D modeling in SolidWorks", "3D printing for form development", "Ceramic slip casting", "Glazing"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/bowl/bowldisplay.webp",
      "/assets/images/bowl/bowlgal1.webp",
      "/assets/images/bowl/bowlgal2.webp"
    ],
    stickerColor: "#F18F01", // Yellow
    stickerImage: "/assets/images/sticker4.png",
    bodyText: `
      <h2>About</h2>
      <p>A Bowl and A Pile is a set of ceramic serving bowls inspired by the way women in African cultures carry baskets on their heads. The project translates this cultural image into a sculptural design, creating bowls intended for serving, display, or as decorative objects in the home.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to transform a visual and cultural reference into a tangible object while maintaining a balance between expressive form and functional use for serving and presentation.</p>
      <div class="process-image-slider">
        <img src="/assets/images/bowl/inspi1.webp" alt="A Bowl and A Pile design inspiration - African basket carrying" class="process-image-inline" />
        <img src="/assets/images/bowl/inspi2.webp" alt="A Bowl and A Pile design inspiration - cultural reference" class="process-image-inline" />
        <img src="/assets/images/bowl/bowlsketch1.webp" alt="A Bowl and A Pile design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/bowl/bowlsketch2.webp" alt="A Bowl and A Pile design process - challenges 2" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>By studying proportions and stacked compositions, I created bowls that can be displayed individually or arranged together as a sculptural centerpiece. The design preserves the elegance of the inspiration while offering multiple serving and display possibilities.</p>
      <div class="process-image-slider">
        <img src="/assets/images/bowl/bowlsol1.webp" alt="A Bowl and A Pile design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/bowl/bowlsolid1.webp" alt="A Bowl and A Pile design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/bowl/bowlsolid2.webp" alt="A Bowl and A Pile design process - solutions 3" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project began with sketching to explore form and composition, followed by 3D modeling in SolidWorks to refine proportions. 3D printing was used for form development and prototyping. The final pieces were created using ceramic slip casting, allowing for precise reproduction of the sculptural forms, and finished with glazing to enhance their visual appeal.</p>
    `,
    processImages: [
      "/assets/images/bowl/inspi1.webp",
      "/assets/images/bowl/inspi2.webp",
      "/assets/images/bowl/bowlsketch1.webp",
      "/assets/images/bowl/bowlsketch2.webp",
      "/assets/images/bowl/bowlsol1.webp",
      "/assets/images/bowl/bowlsolid1.webp",
      "/assets/images/bowl/bowlsolid2.webp"
    ]
  },
  {
    id: 11,
    title: "EVE",
    subtitle: "Design for Manufacturing (DFM) with Plastic Injection Molding",
    year: 2023,
    tags: ["DFM", "Plastic injection molding", "SolidWorks", "Heat staking", "Lip & groove", "Prototyping"],
    description: "An experimental project focused on Design for Manufacturing (DFM) using plastic injection molding, developed in the form of a toy robot to practice adapting a design to the requirements and constraints of industrial production.",
    client: "",
    fullDescription: "EVE is an experimental project focused on Design for Manufacturing (DFM) using plastic injection molding. While developed in the form of a toy robot, the main goal was to practice adapting a design to the requirements and constraints of industrial production.",
    challenges: "The challenge was to create a design simple enough for efficient injection molding, while still incorporating functional connections and maintaining an engaging appearance.",
    solutions: "The final design takes the shape of a robot with a one-wheel base and expressive arms, chosen to test balance and assembly solutions. The process emphasized details such as lip-and-groove joints and heat staking pins, which ensure structural strength and manufacturability in plastic injection.",
    technologies: ["SolidWorks 3D modeling", "Design for injection molding", "Heat staking", "Lip-and-groove connections", "Prototyping", "Rendering"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/eve/robotdisplay.webp",
      "/assets/images/eve/robotgal1.webp",
      "/assets/images/eve/robotgal2.webp"
    ],
    stickerColor: "#4CAF50", // Green
    stickerImage: "/assets/images/sticker5.png",
    bodyText: `
      <h2>About</h2>
      <p>EVE is an experimental project focused on Design for Manufacturing (DFM) using plastic injection molding. While developed in the form of a toy robot, the main goal was to practice adapting a design to the requirements and constraints of industrial production.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to create a design simple enough for efficient injection molding, while still incorporating functional connections and maintaining an engaging appearance.</p>
      <div class="process-image-slider">
        <img src="/assets/images/eve/robotchal1.webp" alt="EVE design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/eve/robotchal2.webp" alt="EVE design process - challenges 2" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design takes the shape of a robot with a one-wheel base and expressive arms, chosen to test balance and assembly solutions. The process emphasized details such as lip-and-groove joints and heat staking pins, which ensure structural strength and manufacturability in plastic injection.</p>
      <div class="process-image-slider">
        <img src="/assets/images/eve/robotsol1.webp" alt="EVE design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/eve/robotsol2.webp" alt="EVE design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/eve/robotsol3.webp" alt="EVE design process - solutions 3" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project utilized SolidWorks 3D modeling to create a design optimized for plastic injection molding. Key manufacturing techniques included heat staking for assembly and lip-and-groove connections for structural integrity, followed by prototyping and rendering to visualize the final product.</p>
    `,
    processImages: [
      "/assets/images/eve/robotchal1.webp",
      "/assets/images/eve/robotchal2.webp",
      "/assets/images/eve/robotsol1.webp",
      "/assets/images/eve/robotsol2.webp",
      "/assets/images/eve/robotsol3.webp"
    ]
  },
  {
    id: 12,
    title: "K-SENSE",
    subtitle: "Smart Collar for Working Dogs in Rescue Missions",
    year: 2024,
    tags: ["Smart product", "Wearable design", "Rescue missions", "Vital signs monitoring", "CAD modeling", "Team collaboration"],
    description: "K-SENSE is a smart collar designed to monitor the vital signs of working dogs in military rescue units. Developed for the Oketz unit of the IDF, the product supports both dogs and their handlers during disaster rescue missions such as building collapses, where time and health monitoring are critical.",
    client: "Oketz unit, IDF",
    fullDescription: "K-SENSE is a smart collar designed to monitor the vital signs of working dogs in military rescue units. Developed for the Oketz unit of the IDF, the product supports both dogs and their handlers during disaster rescue missions such as building collapses, where time and health monitoring are critical.",
    challenges: "The challenge was to design a wearable product for dogs that could provide real-time health data without interfering with their movement or performance. Another challenge was integrating multiple technologies—sensors, camera, flashlight, and communication interface—into a compact, durable, and comfortable device.",
    solutions: "The final design is a modular smart collar that connects to a harness and integrates acoustic sensors, a camera, flashlight, and health-monitoring tools. It enables handlers to track the dogs' physical condition in real time and make informed decisions about rotation, rest, and task allocation. The device is rugged, lightweight, and specifically adapted for rescue environments.",
    technologies: ["User research with rescue teams", "Concept development", "Interface design", "CAD modeling", "Prototyping", "Scenario building"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/ksense/kdisplay.webp",
      "/assets/images/ksense/kgal1.webp",
      "/assets/images/ksense/kgal2.webp",
      "/assets/images/ksense/kgal3.webp",
      "/assets/images/ksense/kgal4.webp",
      "/assets/images/ksense/kgal5.webp"
    ],
    stickerColor: "#7FB069", // Light Green
    stickerImage: "/assets/images/sticker6.png",
    bodyText: `
      <h2>About</h2>
      <p>K-SENSE is a smart collar designed to monitor the vital signs of working dogs in military rescue units. Developed for the Oketz unit of the IDF, the product supports both dogs and their handlers during disaster rescue missions such as building collapses, where time and health monitoring are critical.</p>
      
      <h3>Challenges</h3>
      <p>The challenge was to design a wearable product for dogs that could provide real-time health data without interfering with their movement or performance. Another challenge was integrating multiple technologies—sensors, camera, flashlight, and communication interface—into a compact, durable, and comfortable device.</p>
      <div class="process-image-slider">
        <img src="/assets/images/ksense/inspi1.webp" alt="K-SENSE design inspiration - challenges 1" class="process-image-inline" />
        <img src="/assets/images/ksense/inspi2.webp" alt="K-SENSE design inspiration - challenges 2" class="process-image-inline" />
        <img src="/assets/images/ksense/kchal1.webp" alt="K-SENSE design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/ksense/kchal2.webp" alt="K-SENSE design process - challenges 2" class="process-image-inline" />
        <img src="/assets/images/ksense/kchal3.webp" alt="K-SENSE design process - challenges 3" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The final design is a modular smart collar that connects to a harness and integrates acoustic sensors, a camera, flashlight, and health-monitoring tools. It enables handlers to track the dogs' physical condition in real time and make informed decisions about rotation, rest, and task allocation. The device is rugged, lightweight, and specifically adapted for rescue environments.</p>
      <div class="process-image-slider">
        <img src="/assets/images/ksense/ksol1.webp" alt="K-SENSE design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/ksense/ksol2.webp" alt="K-SENSE design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/ksense/ksol3.webp" alt="K-SENSE design process - solutions 3" class="process-image-inline" />
        <img src="/assets/images/ksense/ksol4.webp" alt="K-SENSE design process - solutions 4" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project began with user research conducted directly with rescue teams to understand operational needs and constraints. Concept development focused on creating a modular system that could integrate multiple technologies without compromising mobility. Interface design ensured intuitive operation under high-stress conditions, while CAD modeling and prototyping validated the design's durability and comfort. Scenario building helped anticipate real-world use cases and refine the product's functionality.</p>
    `,
    processImages: [
      "/assets/images/ksense/inspi1.webp",
      "/assets/images/ksense/inspi2.webp",
      "/assets/images/ksense/kchal1.webp",
      "/assets/images/ksense/kchal2.webp",
      "/assets/images/ksense/kchal3.webp",
      "/assets/images/ksense/ksol1.webp",
      "/assets/images/ksense/ksol2.webp",
      "/assets/images/ksense/ksol3.webp",
      "/assets/images/ksense/ksol4.webp"
    ]
  },
  {
    id: 13,
    title: "Ember",
    subtitle: "Wildfire Safety Survival Kit",
    year: 2025,
    tags: ["Wildfire safety", "Survival kit", "Design research", "Filter design", "Protective vest", "3D printing", "Laser cutting", "CMF"],
    description: "Developed during my student exchange at IED Milan, Ember is a design research project addressing the growing threat of wildfires spreading into civilian areas. The project explored not only product development but also market positioning—researching competitors, defining target users, and presenting the concept to potential investors.",
    client: "",
    fullDescription: "Developed during my student exchange at IED Milan, Ember is a design research project addressing the growing threat of wildfires spreading into civilian areas. The project explored not only product development but also market positioning—researching competitors, defining target users, and presenting the concept to potential investors.",
    challenges: "The main challenge was to design two complementary products that speak the same design language: a quick-to-use filter worn around the neck and a protective vest that sprays water mixed with fire-resistant liquid. Both had to meet real safety demands while being compact, consumer-oriented, and convincing for stakeholders.",
    solutions: "Extensive research into fire-resistant filters led to the use of charcoal-based filtration for effectiveness and compactness. The vest was inspired by professional firefighting liquids, which are safe for humans but effective in slowing fire spread. The CMF strategy emphasized visibility, enabling users to be easily located by rescue teams. Together, the two objects create a coherent survival kit that is practical, recognizable, and user-focused.",
    technologies: ["Design research", "User research", "3D modeling", "3D printing", "Laser cutting", "CMF development", "Product visualization"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/ember/emberdis.webp",
      "/assets/images/ember/embergal1.webp",
      "/assets/images/ember/embergal2.webp"
    ],
    stickerColor: "#FF5722", // Deep Orange
    stickerImage: "/assets/images/sticker1.png",
    bodyText: `
      <h2>About</h2>
      <p>Developed during my student exchange at IED Milan, Ember is a design research project addressing the growing threat of wildfires spreading into civilian areas. The project explored not only product development but also market positioning—researching competitors, defining target users, and presenting the concept to potential investors.</p>
      
      <h3>Challenges</h3>
      <p>The main challenge was to design two complementary products that speak the same design language: a quick-to-use filter worn around the neck and a protective vest that sprays water mixed with fire-resistant liquid. Both had to meet real safety demands while being compact, consumer-oriented, and convincing for stakeholders.</p>
      
      <h3>Solutions</h3>
      <p>Extensive research into fire-resistant filters led to the use of charcoal-based filtration for effectiveness and compactness. The vest was inspired by professional firefighting liquids, which are safe for humans but effective in slowing fire spread. The CMF strategy emphasized visibility, enabling users to be easily located by rescue teams. Together, the two objects create a coherent survival kit that is practical, recognizable, and user-focused.</p>
      <div class="process-image-slider">
        <img src="/assets/images/ember/embersol.webp" alt="Ember design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/ember/embersol1.webp" alt="Ember design process - solutions 2" class="process-image-inline" />
        <img src="/assets/images/ember/embersol2.webp" alt="Ember design process - solutions 3" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project began with extensive design research and user research to understand the needs of people facing wildfire threats. 3D modeling enabled the development of both the filter and vest designs, while 3D printing and laser cutting facilitated rapid prototyping. CMF development ensured the visibility and recognizability of the products, and product visualization techniques were used to communicate the concept effectively to stakeholders and potential investors.</p>
    `,
    processImages: [
      "/assets/images/ember/embersol.webp",
      "/assets/images/ember/embersol1.webp",
      "/assets/images/ember/embersol2.webp"
    ]
  },
  {
    id: 14,
    title: "Dancing Pot",
    subtitle: "Interactive Music-Responsive Plant Pot",
    year: 2025,
    tags: ["Interactive design", "Relaxation object", "Music-responsive design", "Arduino", "PCB", "Coding", "3D printing", "Prototyping"],
    description: "Developed during my student exchange at IED Milan, Dancing Pot is an interactive home object that transforms the calming task of watering plants into an even more joyful and relaxing experience. Designed for adults, it responds to music with gentle, rhythmic movement, turning a simple daily ritual into a playful, multi-sensory moment.",
    client: "",
    fullDescription: "Developed during my student exchange at IED Milan, Dancing Pot is an interactive home object that transforms the calming task of watering plants into an even more joyful and relaxing experience. Designed for adults, it responds to music with gentle, rhythmic movement, turning a simple daily ritual into a playful, multi-sensory moment.",
    challenges: "The main challenge was to design a functional prototype that could generate smooth, controlled motion while remaining stable as a pot. Another challenge was integrating electronics seamlessly into a domestic object without compromising its aesthetic or usability.",
    solutions: "The final prototype was built using Arduino and a custom PCB board, programmed to respond and \"dance\" to music played through a dedicated mobile app. The synchronization of water, sound, and movement creates a soothing yet joyful interaction. The pot's body was produced through 3D printing, ensuring precise integration of electronic components in a clean and minimal form.",
    technologies: ["Arduino programming", "PCB integration", "Coding", "Electronics assembly", "3D modeling and 3D printing"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/pot/disco plante 1 (convert.io).webp",
      "/assets/images/pot/potgal1 (convert.io).webp",
      "/assets/images/pot/potgal2.webp"
    ],
    stickerColor: "#9C27B0", // Purple
    stickerImage: "/assets/images/sticker2.png",
    bodyText: `
      <h2>About</h2>
      <p>Developed during my student exchange at IED Milan, Dancing Pot is an interactive home object that transforms the calming task of watering plants into an even more joyful and relaxing experience. Designed for adults, it responds to music with gentle, rhythmic movement, turning a simple daily ritual into a playful, multi-sensory moment.</p>
      
      <h3>Challenges</h3>
      <p>The main challenge was to design a functional prototype that could generate smooth, controlled motion while remaining stable as a pot. Another challenge was integrating electronics seamlessly into a domestic object without compromising its aesthetic or usability.</p>
      
      <h3>Solutions</h3>
      <p>The final prototype was built using Arduino and a custom PCB board, programmed to respond and "dance" to music played through a dedicated mobile app. The synchronization of water, sound, and movement creates a soothing yet joyful interaction. The pot's body was produced through 3D printing, ensuring precise integration of electronic components in a clean and minimal form.</p>
      
      <h3>Techniques</h3>
      <p>The project required Arduino programming to control the motion responses, along with custom PCB integration to manage the electronic components efficiently. Coding enabled the synchronization between music input and physical movement, while careful electronics assembly ensured reliable operation. 3D modeling and 3D printing allowed for precise housing of the electronic components within an aesthetically pleasing form.</p>
    `
  },
  {
    id: 15,
    title: "Tambourine",
    subtitle: "Handcrafted Musical Instrument Using Traditional Lamination",
    year: 2022,
    tags: ["Traditional lamination", "Veneer", "Jig design", "Leather stretching", "Musical instrument design", "Handcraft"],
    description: "This project reinterprets the tambourine through the use of the traditional lamination technique, shaping thin layers of veneer around a custom jig. The goal was to design and produce the instrument entirely by hand, combining age-old methods with thoughtful material selection.",
    client: "",
    fullDescription: "This project reinterprets the tambourine through the use of the traditional lamination technique, shaping thin layers of veneer around a custom jig. The goal was to design and produce the instrument entirely by hand, combining age-old methods with thoughtful material selection.",
    challenges: "The main challenge was to design and construct a jig that would enable precise lamination of veneer layers while ensuring the circular form remained strong and stable. Another challenge was to integrate all functional elements—stretched leather skin, ready-made metal cymbals, and grip holes—into a cohesive design.",
    solutions: "The process began with building a jig from MDF, followed by gluing multiple veneer layers with carpenter's glue and stretching them around the jig until fully dried. Once removed, the laminated structure was sanded, cut, and refined before assembling the stretched leather surface, grip holes, and ready-made cymbals. All stages were completed by hand, resulting in an authentic instrument that merges traditional craftsmanship with careful material selection.",
    technologies: ["Traditional lamination with veneer sheets", "Jig design and construction", "Leather stretching", "Drilling and finishing grip holes", "Assembly of ready-made metal cymbals", "Hand-finishing"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/tambourine/tambdis.webp",
      "/assets/images/tambourine/tambgal1.webp",
      "/assets/images/tambourine/tambgal2.webp",
      "/assets/images/tambourine/tambgal3.webp"
    ],
    stickerColor: "#4A90E2", // Medium Blue
    stickerImage: "/assets/images/sticker3.png",
    bodyText: `
      <h2>About</h2>
      <p>This project reinterprets the tambourine through the use of the traditional lamination technique, shaping thin layers of veneer around a custom jig. The goal was to design and produce the instrument entirely by hand, combining age-old methods with thoughtful material selection.</p>
      
      <h3>Challenges</h3>
      <p>The main challenge was to design and construct a jig that would enable precise lamination of veneer layers while ensuring the circular form remained strong and stable. Another challenge was to integrate all functional elements—stretched leather skin, ready-made metal cymbals, and grip holes—into a cohesive design.</p>
      <div class="process-image-slider">
        <img src="/assets/images/tambourine/tambchal1.webp" alt="Tambourine design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/tambourine/tambchal2.webp" alt="Tambourine design process - challenges 2" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The process began with building a jig from MDF, followed by gluing multiple veneer layers with carpenter's glue and stretching them around the jig until fully dried. Once removed, the laminated structure was sanded, cut, and refined before assembling the stretched leather surface, grip holes, and ready-made cymbals. All stages were completed by hand, resulting in an authentic instrument that merges traditional craftsmanship with careful material selection.</p>
      <div class="process-image-slider">
        <img src="/assets/images/tambourine/tambsol1.webp" alt="Tambourine design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/tambourine/tambsol2.webp" alt="Tambourine design process - solutions 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project employed traditional lamination techniques using veneer sheets, which required careful jig design and construction to achieve the precise circular form. Leather stretching was performed manually to create the resonant surface, while grip holes were drilled and finished by hand. Ready-made metal cymbals were integrated into the design, and all surfaces received hand-finishing to complete the authentic, handcrafted instrument.</p>
    `,
    processImages: [
      "/assets/images/tambourine/tambchal1.webp",
      "/assets/images/tambourine/tambchal2.webp",
      "/assets/images/tambourine/tambsol1.webp",
      "/assets/images/tambourine/tambsol2.webp"
    ]
  },
  {
    id: 16,
    title: "Coffee Machine",
    subtitle: "Conceptual Design Inspired by Yaacov Kaufman",
    year: 2023,
    tags: ["Conceptual design", "Coffee machine", "Yaacov Kaufman inspiration", "3D modeling", "3D printing", "Foam modeling", "Laser cutting", "Graphic design"],
    description: "A conceptual coffee machine inspired by the works of artist and designer Yaacov Kaufman, exploring how artistic language can be expressed in a practical household product.",
    client: "",
    fullDescription: "A conceptual coffee machine inspired by the works of artist and designer Yaacov Kaufman, exploring how artistic language can be expressed in a practical household product.",
    challenges: "The main challenge was to merge the visual identity of contemporary art with the functionality of a domestic appliance, while creating a form that feels both expressive and approachable.",
    solutions: "The design emphasizes the dialogue between wooden surfaces and a bent metal tube, creating depth and three-dimensionality in the overall form. This combination highlights sculptural qualities while keeping the machine recognizable and functional as a coffee product.",
    technologies: ["3D modeling", "3D printing", "Foam sketch models", "Spray painting", "Laser cutting", "Graphic sticker design", "Surface finishing"],
    results: "",
    testimonial: undefined,
    gallery: [
      "/assets/images/coffee/cofdis.webp",
      "/assets/images/coffee/cofgal1.webp",
      "/assets/images/coffee/cofgal2.webp",
      "/assets/images/coffee/cofgal3.webp",
      "/assets/images/coffee/cofgal4.webp"
    ],
    stickerColor: "#E91E63", // Hot Pink
    stickerImage: "/assets/images/sticker4.png",
    bodyText: `
      <h2>About</h2>
      <p>A conceptual coffee machine inspired by the works of artist and designer Yaacov Kaufman, exploring how artistic language can be expressed in a practical household product.</p>
      
      <h3>Challenges</h3>
      <p>The main challenge was to merge the visual identity of contemporary art with the functionality of a domestic appliance, while creating a form that feels both expressive and approachable.</p>
      <div class="process-image-slider">
        <img src="/assets/images/coffee/cofxhal1.webp" alt="Coffee Machine design process - challenges 1" class="process-image-inline" />
        <img src="/assets/images/coffee/coffeechal2.webp" alt="Coffee Machine design process - challenges 2" class="process-image-inline" />
      </div>
      
      <h3>Solutions</h3>
      <p>The design emphasizes the dialogue between wooden surfaces and a bent metal tube, creating depth and three-dimensionality in the overall form. This combination highlights sculptural qualities while keeping the machine recognizable and functional as a coffee product.</p>
      <div class="process-image-slider">
        <img src="/assets/images/coffee/cofsol1.webp" alt="Coffee Machine design process - solutions 1" class="process-image-inline" />
        <img src="/assets/images/coffee/cofsol2.webp" alt="Coffee Machine design process - solutions 2" class="process-image-inline" />
      </div>
      
      <h3>Techniques</h3>
      <p>The project utilized 3D modeling to develop the initial concept, followed by 3D printing and foam sketch models to explore form and proportions. Spray painting and surface finishing techniques were applied to achieve the desired aesthetic, while laser cutting was used for precise component fabrication. Graphic sticker design added final details to complete the visual identity.</p>
    `,
    processImages: [
      "/assets/images/coffee/cofxhal1.webp",
      "/assets/images/coffee/coffeechal2.webp",
      "/assets/images/coffee/cofsol1.webp",
      "/assets/images/coffee/cofsol2.webp"
    ]
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
      "/assets/images/Shiri.jpg",
    ],
    stickerColor: "#607D8B", // Blue Grey
    stickerImage: "/assets/images/sticker5.png"
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
