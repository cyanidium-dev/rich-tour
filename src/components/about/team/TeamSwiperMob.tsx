"use client";
import "swiper/css";
import "swiper/css/navigation";
import { Suspense } from "react";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { TeamMember } from "@/types/team";
import { fadeInAnimation } from "@/components/shared/animation/animationVariants";
import AnimatedWrapper from "@/components/shared/animation/AnimatedWrapper";
import TeamCard from "./TeamCard";
import Loader from "@/components/shared/loader/Loader";

interface TeamSwiperMobProps {
  teamMembers: TeamMember[];
}

export default function TeamSwiperMob({ teamMembers }: TeamSwiperMobProps) {
  return (
    <AnimatedWrapper
      animation={fadeInAnimation({ y: 30, delay: 0.4 })}
      className="md:hidden"
    >
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
    </AnimatedWrapper>
  );
}
