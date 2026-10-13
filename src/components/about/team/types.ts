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

export type RawTeamMember = Pick<TeamMember, "name" | "role"> &
  TeamMember["socials"] & { photo: { asset: { url: string } } };
