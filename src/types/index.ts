   // src/types/index.ts

   // Represents a service offered by the company
   export interface ServiceType {
    id: string; // Unique identifier for the service
    title: string; // Title of the service
    description: string; // Detailed description of the service
    icon: string; // URL or path to the service icon
    features: string[]; // List of features included in the service
    benefits: string[]; // List of benefits for the client
    caseStudies: string[]; // Array of case study IDs related to the service
  }

  // Represents a case study showcasing a project or client success
  export interface CaseStudyType {
    id: string; // Unique identifier for the case study
    title: string; // Title of the case study
    client: string; // Name of the client
    industry: string; // Industry in which the client operates
    challenge: string; // The challenge faced by the client
    solution: string; // The solution provided by the company
    results: string[]; // List of results achieved
    technologies: string[]; // Technologies used in the project
    testimonial?: { // Optional testimonial from the client
      quote: string; // The testimonial quote
      author: string; // Name of the person giving the testimonial
      position: string; // Position of the author
    };
    imageUrl: string; // URL of an image related to the case study
  }

  // Represents a blog post on the company's website
  export interface BlogPostType {
    id: string; // Unique identifier for the blog post
    title: string; // Title of the blog post
    excerpt: string; // Short excerpt or summary of the post
    content: string; // Full content of the blog post
    author: { // Information about the author
      name: string; // Name of the author
      avatar: string; // URL of the author's avatar image
      position: string; // Position of the author
    };
    date: string; // Publication date of the blog post
    readTime: string; // Estimated reading time (e.g., "5 min read")
    categories: string[]; // Categories the blog post belongs to
    tags: string[]; // Tags associated with the blog post
    imageUrl: string; // URL of an image related to the blog post
  }

  // Represents a job posting for recruitment
  export interface JobPostingType {
    id: string; // Unique identifier for the job posting
    title: string; // Job title
    department: string; // Department where the job is located
    location: string; // Job location (e.g., remote, city)
    type: 'Full-time' | 'Part-time' | 'Contract'; // Type of employment
    description: string; // Detailed job description
    requirements: string[]; // List of requirements for the job
    responsibilities: string[]; // List of responsibilities for the job
    benefits: string[]; // List of benefits offered to employees
    postedDate: string; // Date when the job was posted
  }