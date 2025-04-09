"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import TeamCard from "./TeamCard";
import Loader from "@/components/shared/loader/Loader";
import { TeamMember } from "@/types/team";

interface TeamSwiperMobProps {
  teamMembers: TeamMember[];
}

export default function TeamSwiperMob({ teamMembers }: TeamSwiperMobProps) {
  return (
    <div className="md:hidden">
      <Suspense fallback={<Loader />}>
        <div className="md:hidden mt-[148px]">
          <Swiper
            slidesPerView={"auto"}
            centeredSlides={true}
            spaceBetween={25}
            navigation={true}
            loop={true}
            speed={1000}
            modules={[Navigation]}
            className="team"
          >
            {teamMembers.map((teamMember, idx) => (
              <SwiperSlide key={idx}>
                <TeamCard teamMember={teamMember} />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </Suspense>
    </div>
  );
}
