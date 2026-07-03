import { Project, Experience, Education, SkillGroup } from './types';

export const PERSONAL_INFO = {
  name: "Sandeep Singh",
  title: "Software & Graphics Developer",
  subTitle: "Specializing in Full-Stack Web, AR/3D Graphics & Game Development",
  phone: "+91-6284901073",
  email: "Sandeep.thaparcse@gmail.com",
  location: "Windsor, ON / Punjab, India",
  github: "https://github.com", // generic placeholder or standard links
  linkedin: "https://linkedin.com",
  summary: [
    "4+ years of experience in software development, graphics, and full stack applications.",
    "Strong proficiency in PHP, React.js, HTML, CSS, jQuery, Node.js, MySQL, and JavaScript, with experience in real-time rendering, AR development, and performance optimization.",
    "Exposure to graphics APIs and shader programming concepts (OpenGL, GLSL/HLSL) with a focus on real-time graphics performance. Skilled in API/SDK integration, troubleshooting, and debugging for scalability, stability, and performance.",
    "Experienced in automation, testing, and documentation to ensure software quality and long-term maintainability.",
    "Adept at working in fast-paced, dynamic environments, proven through freelancing and collaborative academic projects."
  ]
};

export const SKILL_GROUPS: SkillGroup[] = [
  {
    category: "Programming Languages",
    items: ["C++", "C#", "Java", "Kotlin", "Python", "JavaScript", ".NET Core", "PHP"]
  },
  {
    category: "Graphics & Game Dev",
    items: ["Unity (C#)", "AR/3D Rendering", "Real-Time Optimization", "Shader Programming (GLSL/HLSL)", "OpenGL", "DirectX"]
  },
  {
    category: "Databases",
    items: ["MySQL", "MS-SQL Server", "SQLite", "Firebase"]
  },
  {
    category: "Frameworks & Tools",
    items: ["React.js", "Django", "FastAPI", "Node.js", "Docker", "Azure DevOps", "GitHub", "JIRA", "jQuery"]
  },
  {
    category: "Protocols & Integration",
    items: ["REST APIs", "WebSocket", "JSON", "Serial", "USB", "Ethernet", "4G"]
  },
  {
    category: "Methodologies",
    items: ["Agile", "Scrum", "Iterative", "RAD", "Waterfall"]
  }
];

export const EDUCATION_LIST: Education[] = [
  {
    id: "edu-1",
    degree: "Master of Applied Computing",
    institution: "University of Windsor",
    location: "Windsor, Ontario, Canada",
    period: "Jan 2022 – May 2023"
  },
  {
    id: "edu-2",
    degree: "Bachelor of Engineering, Computer Engineering",
    institution: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab, India",
    period: "Sep 2017 – Jun 2021"
  }
];

export const EXPERIENCE_LIST: Experience[] = [
  {
    id: "exp-1",
    role: "Full Stack & Software Developer",
    company: "Westview Park Luxury Gardens Pvt. Ltd.",
    location: "Windsor, ON",
    period: "Jan 2023 – Sep 2025",
    achievements: [
      "Delivered a variety of software solutions independently, covering web, data-driven, and integration-focused applications.",
      "Managed end-to-end development, including requirement gathering, scheduling, coding, testing, deployment, and support.",
      "Worked extensively with APIs, SDKs, and connectivity protocols to ensure seamless integration and system interoperability.",
      "Troubleshot and resolved technical challenges, providing clear guidance and documentation for long-term usability.",
      "Strengthened expertise in full stack development, technical problem-solving, and client communication, while building strong self-management and organizational skills."
    ]
  },
  {
    id: "exp-2",
    role: "Software & AI/ML Developer",
    company: "Academic & Co-op Projects",
    location: "Windsor, ON & Punjab, India",
    period: "Jan 2018 – May 2023",
    achievements: [
      "Delivered full stack applications, REST APIs, and data-driven ML systems.",
      "Collaborated with teams to design, build, and deploy production-ready software."
    ]
  }
];

export const PROJECT_LIST: Project[] = [
  {
    id: "proj-1",
    title: "Guardian TD",
    institution: "University of Windsor",
    location: "Windsor, ON",
    period: "Jan – Mar 2024",
    technologies: ["C#", "Unity", "Google AR", "AR Core"],
    description: [
      "Designed an AR game using the Unity engine primarily using C# as object-oriented programming language.",
      "Built enemy spawn algorithm and implemented the animation alongside the game loop manager."
    ]
  },
  {
    id: "proj-2",
    title: "Smart GPS Keychain",
    institution: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab, India",
    period: "Jan – Aug 2020",
    technologies: ["Java", "Arduino", "Android", "Firebase", "jQuery"],
    description: [
      "Developed an Android application that would track a keychain leveraging jQuery to fetch location.",
      "Collaborated with team members in designing, building, and integrating Restful services.",
      "Integrated hardware to optimize the location provided and auto-updating the same to reflect in the Android application, where we also used cloud containerization with Azure.",
      "Followed SCRUM SDLC during the project while supervising the group's workflow of 4 members."
    ]
  },
  {
    id: "proj-3",
    title: "Yelp Review Analysis Recommendation System",
    institution: "University of Windsor",
    location: "Windsor, ON",
    period: "Feb – Mar 2022",
    technologies: ["Python", "Numpy", "Pandas", "PySpark", "Django", "SVM"],
    description: [
      "Designed an analysis system for Yelp reviews of restaurants and transformed, joined, and cleaned dataset with PySpark.",
      "Made use of Machine learning SVM algorithm for sentiment Analysis and used numpy for data manipulation.",
      "Developed a recommendation system based on selected restaurant types in a city and visualized data."
    ]
  },
  {
    id: "proj-4",
    title: "Smart Notification System for Nursing Homes",
    institution: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab, India",
    period: "Dec 2020 – Jun 2021",
    technologies: ["Python", "Numpy", "Pandas", "PySpark", "Async Programming"],
    description: [
      "Created simulation software to appoint jobs to nurses based on three different algorithms.",
      "Used different data structures to process and sort data while also performing callback, promises, and asynchronous await to simulate the job assignment in realtime.",
      "Generated random behaviors for patients inside simulation using Python to predict the trends in terms of response time by a caretaker and analyzed this trend to develop an efficient job allocation system."
    ]
  },
  {
    id: "proj-5",
    title: "Video on Demand Free Application",
    institution: "Thapar Institute of Engineering and Technology",
    location: "Patiala, Punjab, India",
    period: "Feb – Mar 2018",
    technologies: ["Java", "JavaScript", "MySQL", "React", "XHTML", "Azure", "Docker"],
    description: [
      "Streaming standalone application made using the integration of Java Swings and JavaScript.",
      "Provided a high-grade experience of streaming using limited resources and cost.",
      "Tested, built, and deployed using Docker."
    ]
  }
];
