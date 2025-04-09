export interface TeamMember {
  name: string;
  photo: { url: string; alt: string };
  role: string;
  socials: {
    instagram?: string;
    telegram?: string;
    tiktok?: string;
  };
}
