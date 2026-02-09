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

import {useCurrency} from "@/context/CurrencyContext";

//@ts-expect-error
export default function Hotels({title, stars, price, shortDescription, gallery}) {
    const {convert, selected: currency} = useCurrency();
    const [isPopUpShown, setIsPopUpShown] = useState(false);
    const togglePopUp = useCallback(()=> setIsPopUpShown(prevState => !prevState), []);

    return (
        <section className="mb-[125px] xl:mb-[180px]">
            <Container>
                <HotelsTitle/>
                <HotelModal isPopUpShown={isPopUpShown} setIsPopUpShown={setIsPopUpShown}>
                    <HotelModalContent />
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

                    <div className="relative overflow-hidden rounded-3xl">
                        <Image width={645} height={307} alt={title} className="h-full w-full object-cover" src={gallery[0]} />
                        <div
                            className="text-white z-10 absolute top-[-232px] lg:top-[-100px] right-[-150px] lg:right-[-30px] w-[257px] aspect-[1.15/1] bg-main rounded-full"
                        >
                           <p className="absolute lg:right-[40px] bottom-[50px] text-[22px] font-medium"> від {convert(price)} {currency === "EUR" ? "€" : "₴"}</p>
                        </div>
                    </div>
                </div>

                <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 overflow-hidden max-h-32">
                    {/*@ts-expect-error */}
                    {gallery.slice(1, 5).map((url, i) => <Image key={i} width={265} height={161} alt={title}  className="rounded-2xl object-cover w-full h-32" src={url} />)}
                </div>
            </Container>
        </section>
    )
}
