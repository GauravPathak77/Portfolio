import dotenv from "dotenv";
import path from "path";
import fs from "fs";
import { v2 as cloudinary } from "cloudinary";
import { getDbProvider, getRepo } from "../lib/repo";

dotenv.config({ path: path.join(process.cwd(), ".env.local") });

const cloudinaryConfigured = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
);

if (cloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  });
}

const sourceDir = path.join(process.cwd(), "images");
const publicDir = path.join(process.cwd(), "public", "images");
// Same folder as the admin dashboard's unsigned upload preset, so all assets live together.
const CLOUDINARY_FOLDER = "images";

type Crop = { width: number; height: number };

// Uploads to Cloudinary when configured; otherwise serves the file from /public/images.
// With a crop, returns a face-centred square delivery URL (the original stays untouched).
async function resolveImage(filename: string, crop?: Crop): Promise<string> {
  if (!filename) return "";
  const sourcePath = path.join(sourceDir, filename);
  const publicPath = path.join(publicDir, filename);
  const localPath = fs.existsSync(sourcePath) ? sourcePath : publicPath;
  if (!fs.existsSync(localPath)) {
    console.warn(`Image not found: ${filename}`);
    return "";
  }

  if (cloudinaryConfigured) {
    const result = await cloudinary.uploader.upload(localPath, {
      folder: CLOUDINARY_FOLDER,
      public_id: path.parse(filename).name,
      overwrite: true,
    });
    if (!crop) return result.secure_url;
    return cloudinary.url(result.public_id, {
      secure: true,
      version: result.version,
      crop: "fill",
      gravity: "face",
      width: crop.width,
      height: crop.height,
      quality: "auto",
    });
  }

  if (localPath !== publicPath) {
    fs.mkdirSync(publicDir, { recursive: true });
    fs.copyFileSync(localPath, publicPath);
  }
  return `/images/${filename}`;
}

const profileSeed = {
  name: "Gaurav Pathak",
  headline: "Software Developer who also builds the AI layer.",
  tagline: "Software Developer (Next.js/Node.js) | AI, RAG, Voice AI & Computer Vision",
  summary:
    "I build web and mobile products with Next.js, Node.js, React / React Native, FastAPI and PostgreSQL — and integrate LLMs, RAG, voice AI and computer vision when the product needs it.",
  highlights: [
    "End-to-end products — Next.js, Node.js, FastAPI",
    "Web and mobile apps — React & React Native",
    "Client work for Indian, Canadian and US-based clients",
    "LLM, RAG and Voice AI integrations",
    "Computer vision — YOLO, OpenCV and camera pipelines",
    "Real-world systems with edge devices, GPS and data pipelines",
  ],
  bio: [
    "I'm a Software Developer who builds complete products — web, mobile and backend — and the AI layer when a product needs it. I work across Next.js, React, React Native, Node.js, FastAPI, PostgreSQL and MongoDB, with hands-on experience integrating LLMs, RAG, voice AI, computer vision and real-world edge-device data pipelines.",
    "I've worked with Indian, Canadian and US-based clients on products involving mobile and web applications, cloud and data pipelines, computer vision, GPS tracking, PostgreSQL, RAG and AI-powered features.",
  ].join("\n\n"),
  skills: [
    {
      category: "Frontend & Mobile",
      items: ["JavaScript", "TypeScript", "React", "Next.js", "React Native"],
    },
    {
      category: "Backend & Data",
      items: ["Node.js", "Express.js", "Python", "FastAPI", "PostgreSQL", "MongoDB", "REST APIs"],
    },
    {
      category: "AI & Computer Vision",
      items: ["LLM integrations", "RAG", "Voice AI", "Computer Vision", "YOLO", "OpenCV"],
    },
    {
      category: "Cloud & Deployment",
      items: ["Docker", "AWS", "Cloud deployment"],
    },
  ],
  resumeUrl: "https://drive.google.com/file/d/1Ml7Siy0WMDOwj_rsouwFuZ4iusM9hAif/view?usp=sharing",
  email: "gauravpathak182@gmail.com",
  socialLinks: {
    github: "https://github.com/GauravPathak77",
    linkedin: "https://www.linkedin.com/in/gauravpathak77/",
  },
};

const projectSeeds = [
  // Main projects — content supplied by Gaurav; nothing added beyond what he documented.
  {
    title: "J&M — Student Transportation & Safety Platform",
    projectType: "Client Project",
    icon: "bus",
    tagline:
      "Built a real-world student transportation platform connecting bus edge devices, camera-based boarding events, GPS tracking, backend data services, an administrator dashboard, and a React Native parent application.",
    description:
      "Worked on a student transportation platform that connects bus-side edge devices and cameras with a cloud-backed application. Student boarding events are captured and used to automatically update attendance, while GPS data enables bus route tracking. The platform includes student and driver management, a React administrator dashboard, a React Native application for parents, and an in-app communication feature for raising concerns.",
    role: "Worked across the React admin dashboard, the React Native parent app, and backend/API and database integration.",
    highlights: [
      "Camera on the bus detects when a student boards; attendance is marked automatically and the boarding record is updated in the database.",
      "GPS tracking of bus routes.",
      "React administrator dashboard for student and driver management.",
      "React Native app for parents, with in-app chat to raise concerns and communicate.",
      "End-to-end system spanning edge devices, camera events, GPS, backend/database, web and mobile.",
    ],
    architecture: [
      "Bus edge device",
      "Camera boarding events",
      "GPS",
      "Backend API & database",
      "React admin dashboard",
      "React Native parent app",
    ],
    techStack: ["React", "React Native", "Backend APIs", "Database integration", "GPS tracking", "Edge devices"],
    liveUrl: "",
    githubUrl: "",
    imageFile: "",
    featured: true,
  },
  {
    title: "HorseApp — AI / Analytics Platform",
    projectType: "Client Project",
    icon: "horse",
    tagline:
      "A camera-to-dashboard pipeline for a Canadian client: Raspberry Pi camera streams are analysed in the cloud, stored in PostgreSQL, and surfaced through a Next.js analytics dashboard with a RAG chatbot.",
    description: "",
    role: "",
    highlights: [
      "Raspberry Pi camera streams video and metadata into a cloud pipeline on DigitalOcean.",
      "Horse image analysis on the incoming data, with results stored in PostgreSQL.",
      "Vector database powering retrieval-augmented generation (RAG).",
      "Next.js analytics dashboard with a RAG chatbot for querying the data.",
    ],
    architecture: [
      "Raspberry Pi camera",
      "Streaming + metadata",
      "DigitalOcean",
      "Image analysis",
      "PostgreSQL",
      "Vector DB / RAG",
      "Next.js dashboard + chatbot",
    ],
    techStack: ["Raspberry Pi", "DigitalOcean", "PostgreSQL", "Vector database", "RAG", "Next.js"],
    liveUrl: "",
    githubUrl: "",
    imageFile: "horseapp.webp",
    featured: true,
  },
  {
    title: "VehInsight — Real-Time Vehicle Analytics",
    projectType: "Personal Project",
    icon: "car",
    tagline:
      "Real-time vehicle analytics: video streams run through YOLO detection and tracking, cropped vehicles are analysed for OCR and attributes, and results feed a Next.js monitoring UI.",
    description: "",
    role: "Solo developer — designed and built the full pipeline.",
    highlights: [
      "Captures frames from RTSP/video streams with OpenCV.",
      "YOLO detection and tracking for cars, motorcycles, buses and trucks.",
      "Crop processing queue feeding image analysis, OCR and vehicle-attribute extraction.",
      "Results stored in PostgreSQL, with FastAPI orchestrating the pipeline and a Next.js monitoring UI.",
    ],
    architecture: [
      "RTSP / video streams",
      "OpenCV capture",
      "YOLO detect + track",
      "Crop queue",
      "OCR / attributes",
      "PostgreSQL",
      "FastAPI",
      "Next.js UI",
    ],
    techStack: ["Python", "OpenCV", "YOLO", "Google Vision", "FastAPI", "PostgreSQL", "Next.js"],
    liveUrl: "",
    githubUrl: "https://github.com/GauravPathak77/VehInsight",
    imageFile: "vehinsight.webp",
    featured: true,
  },
  {
    title: "EngCoach — Voice AI English Coach",
    projectType: "AI Product",
    icon: "mic",
    tagline:
      "A voice-first AI English communication coach that listens, gives targeted feedback, and adapts practice over time.",
    description: "",
    role: "",
    highlights: [
      "Deepgram speech recognition, Claude for LLM feedback with an Ollama fallback, and text-to-speech with a browser speech fallback.",
      "A policy engine decides what to correct and when, using a closed correction taxonomy.",
      "Vocabulary mining, spaced repetition and adaptive practice.",
      "Privacy-focused audio handling, with data in PostgreSQL / PGlite.",
      "383 tests plus architecture dependency checks.",
    ],
    architecture: [
      "Voice input",
      "Deepgram STT",
      "Policy engine",
      "Claude / Ollama",
      "Feedback + TTS",
      "Spaced repetition",
    ],
    techStack: ["Next.js", "TypeScript", "Deepgram", "Claude", "Ollama", "PostgreSQL / PGlite"],
    liveUrl: "",
    githubUrl: "",
    imageFile: "engcoach.png",
    featured: true,
  },
  {
    title: "Sahii.in — E-commerce Platform",
    projectType: "Live Product",
    icon: "cart",
    tagline: "A live e-commerce platform for mobile spare and repair parts.",
    description: "",
    role: "Full-stack work on product/catalog functionality, APIs, database, the responsive app and deployment.",
    highlights: [
      "Full-stack product and catalog functionality.",
      "API development and database integration.",
      "Responsive web application.",
      "Deployment of the live site.",
    ],
    architecture: ["Product catalog", "APIs", "Database", "Responsive app", "Live deployment"],
    techStack: ["Full-stack", "E-commerce", "APIs", "Database", "Deployment"],
    liveUrl: "https://sahii.in",
    githubUrl: "",
    imageFile: "",
    featured: true,
  },

  // Earlier projects — original content from the 2023 portfolio.
  {
    title: "iBallot",
    projectType: "Personal Project",
    icon: "code",
    tagline: "",
    description:
      "An online voting application with Node.js app uses Passport.js for auth, sessions/cookies for login, Sqlite3 for data storage, EJS for UI, and SMTP for email notifications. A secure and efficient way for users to cast their votes.",
    role: "",
    highlights: [],
    architecture: [],
    techStack: ["Node.js", "Passport.js", "SQLite3", "EJS", "SMTP"],
    liveUrl: "https://iballot.onrender.com",
    githubUrl: "https://github.com/GauravPathak77/iBallot.github.io",
    imageFile: "iBallot.png",
    featured: false,
  },
  {
    title: "DoseWise",
    projectType: "Personal Project",
    icon: "code",
    tagline: "",
    description:
      "A web app for medication management that facilitates booking medicines, setting dose reminders, and optimising stock effortlessly.",
    role: "",
    highlights: [],
    architecture: [],
    techStack: ["Node.js", "Express.js"],
    liveUrl: "https://dosewise.onrender.com",
    githubUrl: "https://github.com/DoseWise/Dosewise",
    imageFile: "dosewise.png",
    featured: false,
  },
  {
    title: "WeatherTrack",
    projectType: "Personal Project",
    icon: "code",
    tagline: "",
    description:
      "A Flask app that uses HTML, CSS, Python and an API to provide real-time weather information for a specific city, displaying current and forecasted weather.",
    role: "",
    highlights: [],
    architecture: [],
    techStack: ["Python", "Flask", "HTML", "CSS"],
    liveUrl: "",
    githubUrl: "https://github.com/GauravPathak77/WeatherTrack",
    imageFile: "weathertrack.png",
    featured: false,
  },
  {
    title: "TaskLister",
    projectType: "Personal Project",
    icon: "code",
    tagline: "",
    description:
      "A ToDo List app using React Native and Firebase to create, view, manage tasks, and store data. A full-featured and powerful way to organize and track tasks.",
    role: "",
    highlights: [],
    architecture: [],
    techStack: ["React Native", "Firebase"],
    liveUrl: "",
    githubUrl: "https://github.com/GauravPathak77/TaskLister",
    imageFile: "",
    featured: false,
  },
];

const drive = (id: string) => `https://drive.google.com/file/d/${id}/view`;

// Page 1 of each certificate PDF, rendered to JPG. Links prefer the issuer's own verification URL.
const certificateSeeds = [
  {
    title: "Full Stack Developer Internship (16 months)",
    issuer: "Redcone · Toronto, Canada",
    issueDate: "Jan 2024 – May 2025",
    imageFile: "certificates/cert-redcone-internship.jpg",
    credentialUrl: drive("1FHS2F76qc-ZWxmOFj8JmEjqCLFoqwETe"),
  },
  {
    title: "Research Publication: Plant Species Detection Using Deep Learning",
    issuer: "IJIRT (ISSN 2349-6002)",
    issueDate: "May 2025",
    imageFile: "certificates/cert-ijirt-publication.jpg",
    credentialUrl: "https://ijirt.org/article?manuscript=178450",
  },
  {
    title: "Complete A.I. & Machine Learning, Data Science Bootcamp",
    issuer: "Udemy",
    issueDate: "Aug 2026",
    imageFile: "certificates/cert-udemy-ai-ml.jpg",
    credentialUrl: "https://ude.my/UC-cc3980a0-6b93-434c-896d-cdd11e8416ab",
  },
  {
    title: "Java Full Stack — Digital Skills Readiness Program",
    issuer: "Wipro TalentNext",
    issueDate: "Oct 2024",
    imageFile: "certificates/cert-wipro-java-full-stack.jpg",
    credentialUrl: drive("12Rj3IkKeYVe7OzIY7CIqGbSWQXpXicsB"),
  },
  {
    title: "The Complete 2024 Web Development Bootcamp",
    issuer: "Udemy",
    issueDate: "Oct 2024",
    imageFile: "certificates/cert-udemy-web-dev.jpg",
    credentialUrl: "https://ude.my/UC-89d4cac5-7883-4dbc-af74-772536f112c7",
  },
  {
    title: "Data Structure and Algorithms Using Java — Elite",
    issuer: "NPTEL · IIT Kharagpur",
    issueDate: "Jul – Oct 2023",
    imageFile: "certificates/cert-nptel-dsa-java.jpg",
    credentialUrl: drive("1yqXUJg95rvXX9IdUC5JKD1Pn3j3UQTdI"),
  },
  {
    title: "Alpha — DSA with Java",
    issuer: "Apna College",
    issueDate: "",
    imageFile: "certificates/cert-apna-college-alpha.jpg",
    credentialUrl: drive("1wnpIEPJYoQTL3dbrUdbLOcU6fqNmONJh"),
  },
  {
    title: "Hack Unicorn Hackathon",
    issuer: "Hack Unicorn Club · GTBIT, Delhi",
    issueDate: "Jun 2023",
    imageFile: "certificates/cert-hack-unicorn.jpg",
    credentialUrl: "https://verification.givemycertificate.com/v/ab02ebbf-a9b4-467a-8cd3-cbd0f4634e95",
  },
  {
    title: "Learn Python (Pro)",
    issuer: "CodeChef",
    issueDate: "May 2023",
    imageFile: "certificates/cert-codechef-python.jpg",
    credentialUrl: drive("1TjO1aixzVC2GGJ7mr1v4yNmNe6cyCwdE"),
  },
  {
    title: "Galactic Problem-Solver",
    issuer: "NASA International Space Apps Challenge",
    issueDate: "Oct 2022",
    imageFile: "certificates/cert-nasa-space-apps.jpg",
    credentialUrl: drive("1LZXum1j8hIolvCdHUerNiRq_BGdwIJza"),
  },
  {
    title: "Full Stack Web Development Internship",
    issuer: "UpSkillz",
    issueDate: "May – Jul 2022",
    imageFile: "certificates/cert-upskillz-internship.jpg",
    credentialUrl: drive("171UCmVdyA7swheHkjAj_QH86qIyMr8Ss"),
  },
  {
    title: "Cyber Hygiene Practices — Stay Safe Online Campaign",
    issuer: "MeitY, Govt. of India · C-DAC",
    issueDate: "Jan 2023",
    imageFile: "certificates/cert-stay-safe-online.jpg",
    credentialUrl: drive("1PAHTYoUHtLOFLvloLyd9dzK9HxxmaDty"),
  },
  {
    title: "TECH-A-THON 3.0 — Participation",
    issuer: "iNeuron · Gautam Buddha University",
    issueDate: "",
    imageFile: "certificates/cert-ineuron-techathon.jpg",
    credentialUrl: drive("175zb8e-KC_w8wwdEF_CmpiEt7Ph0gn65"),
  },
];

// Newest first. Dates come from certificates, public GitHub repo creation dates and the
// original 2023 portfolio; nothing here is estimated.
const timelineSeeds = [
  {
    title: "EngCoach — Voice AI English Coach",
    shortDescription:
      "Built a voice-first AI English communication coach with Next.js and TypeScript, combining speech recognition, LLM feedback and adaptive practice.",
    fullDescription:
      "Deepgram handles speech recognition, Claude provides LLM feedback with an Ollama fallback, and text-to-speech has a browser speech fallback. A policy engine decides what to correct and when, with vocabulary mining and spaced repetition driving practice — backed by 383 tests and architecture dependency checks.",
    date: "Sep 2026",
  },
  {
    title: "Complete A.I. & Machine Learning Bootcamp",
    shortDescription:
      "Completed Udemy's 44-hour A.I., Machine Learning and Data Science bootcamp by Andrei Neagoie and Daniel Bourke.",
    fullDescription: "",
    date: "Aug 2026",
  },
  {
    title: "J&M — Student Transportation & Safety Platform",
    shortDescription:
      "Worked on a real-world client platform connecting bus edge devices, camera-based boarding events, GPS tracking, backend data services, a React admin dashboard and a React Native parent app.",
    fullDescription:
      "When a camera on the bus detects a student boarding, attendance is marked automatically and updated in the database, while GPS tracks the bus route. The platform covers student and driver management, with in-app chat so parents can raise concerns.",
    date: "Mar – May 2026",
  },
  {
    title: "Sahii.in — E-commerce Platform",
    shortDescription:
      "Worked on sahii.in, a live e-commerce platform for mobile spare and repair parts — product/catalog functionality, APIs, database, the responsive app and deployment.",
    fullDescription: "",
    date: "Dec 2025 – Feb 2026",
  },
  {
    title: "HorseApp — AI / Analytics Platform for a Canadian Client",
    shortDescription:
      "Worked on a camera-to-dashboard platform: Raspberry Pi camera streams analysed in the cloud, stored in PostgreSQL, and surfaced in a Next.js analytics dashboard with a RAG chatbot.",
    fullDescription:
      "The pipeline runs from a Raspberry Pi camera through streaming and metadata to DigitalOcean, horse image analysis, PostgreSQL and a vector database powering retrieval-augmented generation.",
    date: "Oct 2025",
  },
  {
    title: "Research Paper Published — Plant Species Detection Using Deep Learning",
    shortDescription:
      "Published a research paper on plant species detection using deep learning in IJIRT (ISSN 2349-6002), Volume 11 Issue 12.",
    fullDescription: "",
    date: "May 2025",
  },
  {
    title: "VehInsight — Real-Time Vehicle Analytics",
    shortDescription:
      "Started building a real-time vehicle analytics platform: YOLO detection and tracking on RTSP/video streams, with OCR and attribute analysis on cropped vehicles.",
    fullDescription:
      "OpenCV captures frames, YOLO detects and tracks cars, motorcycles, buses and trucks, and a crop processing queue feeds image analysis and OCR. Results land in PostgreSQL, FastAPI orchestrates the pipeline, and a Next.js UI monitors it live.",
    date: "Jul 2024",
  },
  {
    title: "Java Full Stack Certification — Wipro TalentNext",
    shortDescription:
      "Completed Wipro TalentNext's Java Full Stack course under the Digital Skills Readiness Program.",
    fullDescription:
      "Later that year I also completed The Complete 2024 Web Development Bootcamp on Udemy (61.5 hours, Oct 2024).",
    date: "May – Sep 2024",
  },
  {
    title: "Full Stack Developer Intern — Redcone, Toronto",
    shortDescription:
      "Completed a 16-month internship as a Full Stack Developer at Redcone, Toronto, Canada.",
    fullDescription: "",
    date: "Jan 2024 – May 2025",
  },
  {
    title: "NPTEL Elite — DSA Using Java (IIT Kharagpur)",
    shortDescription:
      "Earned an Elite certificate in NPTEL's 12-week Data Structure and Algorithms Using Java course from IIT Kharagpur, scoring 79%.",
    fullDescription: "",
    date: "Jul – Oct 2023",
  },
  {
    title: "Hack Unicorn Hackathon",
    shortDescription:
      "Took part in the Hack Unicorn Hackathon organised by Hack Unicorn Club at Guru Tegh Bahadur Institute of Technology, Delhi.",
    fullDescription: "",
    date: "Jun 2023",
  },
  {
    title: "App Development",
    shortDescription:
      "I began exploring mobile app development with React Native and created cross-platform applications.",
    fullDescription:
      "During this process, I also explored various native device functionalities and integrated Firebase database into my apps.",
    date: "Apr 2023",
  },
  {
    title: "React",
    shortDescription:
      "I started exploring React.js, a popular JavaScript library for building user interfaces. This journey has been an exciting experience.",
    fullDescription:
      "I learned to create interactive and dynamic web applications using React's component-based architecture. I look forward to mastering React.js and using it to build engaging and efficient web projects.",
    date: "Jan 2023",
  },
  {
    title: "Database Management",
    shortDescription:
      "I learned about SQL database and how to design, query, and manage relational databases using SQLite.",
    fullDescription:
      "Then, I explored NoSQL database, specifically MongoDB, where I gained experience in working with flexible schemas and implementing CRUD operations.",
    date: "Nov 2022",
  },
  {
    title: "NASA International Space Apps Challenge",
    shortDescription:
      "Recognised as a Galactic Problem-Solver for participating in NASA's International Space Apps Challenge.",
    fullDescription: "",
    date: "Oct 2022",
  },
  {
    title: "Back-end Development",
    shortDescription:
      "I learned server-side programming using Node.js and Express.js, where I built RESTful APIs and understood how to handle routing, middleware, and server deployment.",
    fullDescription:
      "Additionally, I integrated EJS (Embedded JavaScript templates) into my Express.js projects to create dynamic content on the server-side.",
    date: "Sep 2022",
  },
  {
    title: "DSA With Java",
    shortDescription:
      "I began my Java journey by learning its fundamentals, including the concepts of Object-Oriented Programming.",
    fullDescription:
      "After that, I started Data Structures and Algorithms (DSA), covered various topics like Sorting, Searching, Arrays, Backtracking, Stack, LinkedList, Queue, HashMap, Trees, Tries, Graphs, Dynamic programming and other topics of DSA. To practice and improve, I started solving coding challenges on platforms like LeetCode.",
    date: "Sep 2022",
  },
  {
    title: "Full Stack Web Development Intern — UpSkillz",
    shortDescription:
      "Completed a 2-month internship in full stack web development with UpSkillz — my first professional development experience.",
    fullDescription: "",
    date: "May – Jul 2022",
  },
  {
    title: "Front-end Development",
    shortDescription:
      "I started front-end web development with HTML and CSS to create static websites with responsive and visually appealing designs.",
    fullDescription:
      "Then, I dived into JavaScript, where I learned to make web pages interactive, handle events, and use asynchronous programming for smoother user experiences. Through this, I gained a good understanding of client-side scripting.",
    date: "May 2022",
  },
  {
    title: "C Programming",
    shortDescription:
      "During my first year of college, I studied the C programming language, and it was a good experience. Learning C gave me a strong foundation.",
    fullDescription:
      "Now I'm excited to explore more and take on new challenges in this exciting journey.",
    date: "Nov 2021",
  },
  {
    title: "C++ Journey: Unleashing Programming",
    shortDescription:
      "After HSSC (High School), I began my programming journey with C++. I quickly fell in love with its versatility and powerful capabilities.",
    fullDescription:
      'As I progressed my journey, I learned fundamental topics of C++ including file handling, as well as the basics of stack, linked list, and queue data structures. To apply my knowledge, I took a project named "AgentRecordPro," where I used C++ to manage agent records using binary file handling. This project showcased my skills in file I/O, data serialization, and efficient data storage. Check out my GitHub repository for the AgentRecordPro project and more!',
    date: "Apr 2019",
  },
];

async function main() {
  const provider = getDbProvider();
  const repo = await getRepo();
  console.log(`Database: ${provider === "mongodb" ? "MongoDB Atlas" : "SQLite (data/portfolio.db)"}`);
  console.log(
    cloudinaryConfigured
      ? "Images: uploading to Cloudinary"
      : "Images: Cloudinary not configured — serving from /public/images"
  );

  await repo.saveProfile({
    ...profileSeed,
    heroImage: await resolveImage("profile-suit.webp", { width: 800, height: 800 }),
    aboutImage: await resolveImage("about-closeup.webp", { width: 400, height: 400 }),
  });
  console.log("Profile seeded");

  for (const [order, { imageFile, title, ...project }] of projectSeeds.entries()) {
    await repo.upsertByField("projects", "title", title, {
      ...project,
      image: await resolveImage(imageFile),
      order,
    });
  }
  console.log(`Projects seeded (${projectSeeds.length})`);

  for (const [order, { imageFile, title, ...cert }] of certificateSeeds.entries()) {
    await repo.upsertByField("certificates", "title", title, {
      ...cert,
      image: await resolveImage(imageFile),
      order,
    });
  }
  console.log(`Certificates seeded (${certificateSeeds.length})`);

  for (const [order, { title, ...item }] of timelineSeeds.entries()) {
    await repo.upsertByField("timeline", "title", title, { ...item, order });
  }
  console.log(`Timeline seeded (${timelineSeeds.length})`);

  console.log("\nSeed complete. Add client reviews from /admin.");
  if (provider === "mongodb") {
    const mongoose = (await import("mongoose")).default;
    await mongoose.disconnect();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
