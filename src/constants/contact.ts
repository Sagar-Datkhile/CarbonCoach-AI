/**
 * Centralized Contact & Support Configuration
 */

export interface TeamMemberContact {
  id: string;
  name: string;
  role: string;
  linkedInUrl: string;
  githubUrl: string;
}

export const TEAM_CONTACTS: readonly TeamMemberContact[] = [
  {
    id: "sagar",
    name: "Sagar Datkhile",
    role: "Engineering & Core Architecture",
    linkedInUrl: "https://www.linkedin.com/in/sagardatkhile",
    githubUrl: "https://github.com/Sagar-Datkhile",
  },
  {
    id: "pranav",
    name: "Pranav Patil",
    role: "Full-Stack & System Integration",
    linkedInUrl: "https://www.linkedin.com/in/pranav-patil-759076315/",
    githubUrl: "https://github.com/Pranav9949",
  },
] as const;
