import { TeamMember, TeamSectionData } from "./types";

export const teamMembers: TeamMember[] = [
  {
    id: "sagar-datkhile",
    name: "Sagar Datkhile",
    role: "Full Stack Developer",
    tag: "AI • Backend • Product",
    bio: "Focused on building AI-powered, scalable web applications that help users make smarter and more sustainable decisions.",
    avatar: {
      shape: "Circle",
      size: "96px",
      fallback: "SD",
      src: "/team/sagar.jpg"
    },
    socials: [
      {
        platform: "LinkedIn",
        icon: "Linkedin",
        url: "https://www.linkedin.com/in/sagardatkhile/",
        type: "external",
        ariaLabel: "Connect with Sagar Datkhile on LinkedIn",
      },
      {
        platform: "GitHub",
        icon: "Github",
        url: "https://github.com/Sagar-Datkhile",
        type: "external",
        ariaLabel: "View Sagar Datkhile's GitHub profile",
      },
      {
        platform: "Email",
        icon: "Mail",
        url: "mailto:sagardatkhile.official@gmail.com",
        type: "mailto",
        ariaLabel: "Send an email to Sagar Datkhile",
      },
    ],
  },
  {
    id: "pranav-patil",
    name: "Pranav Patil",
    role: "Full Stack Developer",
    tag: "Frontend • AI • UI/UX",
    bio: "Passionate about clean interfaces, modern web technologies and building impactful sustainability solutions.",
    avatar: {
      shape: "Circle",
      size: "96px",
      fallback: "PP",
      src: "/team/pranav.jpg",
    },
    socials: [
      {
        platform: "LinkedIn",
        icon: "Linkedin",
        url: "https://www.linkedin.com/in/pranav-patil-759076315/",
        type: "external",
        ariaLabel: "Connect with Pranav Patil on LinkedIn",
      },
      {
        platform: "GitHub",
        icon: "Github",
        url: "https://github.com/Pranav9949",
        type: "external",
        ariaLabel: "View Pranav Patil's GitHub profile",
      },
      {
        platform: "Email",
        icon: "Mail",
        url: "mailto:pranavpatil1650@gmail.com",
        type: "mailto",
        ariaLabel: "Send an email to Pranav Patil",
      },
    ],
  },
];

export const teamSectionData: TeamSectionData = {
  id: "contact",
  badge: "Meet the Team",
  title: "Our Developers.",
  subtitle:
    "Carbon Coach AI is built with a focus on sustainability, AI, and practical household energy intelligence. Feel free to connect with us.",
  members: teamMembers,
  collaborationBanner: {
    enabled: true,
    title: "Let's build a greener future together.",
    description:
      "Open to feedback, collaboration, hackathons, research and innovative sustainability projects.",
    primaryButton: {
      label: "Contact Us",
      action: "mailto:sagardatkhile.official@gmail.com?subject=Collaboration%20Inquiry%20-%20Carbon%20Coach%20AI",
      url: "mailto:sagardatkhile.official@gmail.com?subject=Collaboration%20Inquiry%20-%20Carbon%20Coach%20AI",
    },
  },
};
