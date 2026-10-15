// import { teamMembers } from "./mockedData";
import { Container } from "@/shared/ui";
import TeamInfo from "./TeamInfo";
import TeamListDesk from "./TeamListDesk";
import TeamSwiperMob from "./TeamSwiperMob";

import { sanityClient as client, sanityFetchOptions, SANITY_CACHE_TAGS } from "@/shared/api/server";
import type { RawTeamMember } from "./types";
import { allTeamQuery } from "@/lib/sanity/queries";

export default async function Team() {
  const team = await client.fetch<RawTeamMember[] | null>(
    allTeamQuery,
    {},
    sanityFetchOptions(300, [SANITY_CACHE_TAGS.team]),
  );
  const teamMembers = team?.map(({ name, role, photo, instagram, telegram, tiktok }) => ({
    name,
    role,
    photo: { url: photo.asset.url, alt: name },
    socials: {
      instagram,
      telegram,
      tiktok,
    },
  }));

  if (!teamMembers || !teamMembers.length) {
    return null;
  }

  return (
    <section className=" mb-[148px] xl:mb-[180px]">
      <TeamInfo />
      <Container>
        <TeamListDesk teamMembers={teamMembers} />
      </Container>
      <TeamSwiperMob teamMembers={teamMembers} />
    </section>
  );
}
