"use client";

import Image from "next/image";
import {useCallback, useState} from "react";

import Container from "@/components/shared/container/Container";
import HotelsTitle from "@/components/tour/hotels/HotelsTitle";
import MainButton from "@/components/shared/buttons/MainButton";

import HotelContent from "@/components/tour/hotels/HotelContent";
import HotelModal from "./HotelModal";
import HotelModalContent from "@/components/tour/hotels/HotelModalContent";
import Backdrop from "@/components/shared/backdrop/Backdrop";
import AnimatedSwitch from "@/components/tour/hotels/AnimatedSwitch";
import { AnimatePresence } from "framer-motion";

import {useCurrency} from "@/context/CurrencyContext";

//@ts-expect-error
export default function Hotels({title, stars, price, fullDescription, shortDescription, gallery}) {
    const {convert, selected: currency} = useCurrency();
    const [isPopUpShown, setIsPopUpShown] = useState(false);
    const togglePopUp = useCallback(()=> setIsPopUpShown(prevState => !prevState), []);
    const [activeIndex, setActiveIndex] = useState(0);

    return (
        <section className="mb-[125px] xl:mb-[180px]">
            <Container>
                <HotelsTitle/>
                <HotelModal isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown}>
                    <HotelModalContent title={title}
                                       stars={stars}
                                       description={fullDescription}
                                       gallery={gallery} />
                </HotelModal>
                <Backdrop
                    isVisible={isPopUpShown}
                    onClick={togglePopUp}
                />
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="flex flex-col justify-between">
                        <div>
                            <h2 className="text-2xl font-bold mb-4">
                                {title} {stars}★
                            </h2>

                            <HotelContent value={shortDescription} />
                            <MainButton onClick={togglePopUp} className="xl:w-[325px] h-12 text-14med">
                                Дізнатися більше
                            </MainButton>
                        </div>
                    </div>

                    <div className="relative overflow-hidden aspect-[645/307] rounded-3xl">
                        {/*<Image fill alt={title} className="w-full object-cover" src={gallery[0]} />*/}
                        <AnimatePresence mode="wait">
                            <AnimatedSwitch
                                key={gallery[activeIndex]}
                                className="absolute inset-0"
                            >
                                <Image
                                    fill
                                    alt={title}
                                    src={gallery[activeIndex]}
                                    className="object-cover"
                                    sizes="(max-width: 1024px) 100vw, 645px"
                                    priority
                                />
                            </AnimatedSwitch>
                        </AnimatePresence>
                        <div
                            className="text-white z-10 absolute top-[-232px] lg:top-[-100px] right-[-150px] lg:right-[-30px] w-[257px] aspect-[1.15/1] bg-main rounded-full"
                        >
                           <p className="absolute lg:right-[40px] bottom-[50px] text-[22px] font-medium"> від {convert(price)} {currency === "EUR" ? "€" : "₴"}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden max-h-32">
                    {/*{gallery.slice(1, 5).map((url, i) => <Image key={i} width={265} height={161} alt={title}  className="rounded-2xl object-cover w-full h-32" src={url} />)}*/}
                    {gallery.slice(0, 4).map((url, i) => {
                        const isActive = i === activeIndex;

                        return (
                            <button
                                key={url}
                                type="button"
                                onClick={() => setActiveIndex(i)}
                                className={`relative w-full h-32 rounded-2xl overflow-hidden transition
          ${isActive ? "ring-2 ring-main scale-[0.97]" : "hover:scale-[0.98]"}
        `}
                            >
                                <Image
                                    src={url}
                                    alt={title}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 50vw, 265px"
                                />
                            </button>
                        );
                    })}
                </div>
            </Container>
        </section>
    )
}
