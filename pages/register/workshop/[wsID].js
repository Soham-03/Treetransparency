import React, { useEffect, useState } from 'react';
import { useUserContext } from "../../../services/userContext";
import { useRouter } from "next/router";
import styled from "styled-components";
import tw from "twin.macro";
import Head from 'next/head';
import LoadingAnimation from "../../../components/misc/Loading.js";
import loadingstyles from "../../../pages/index.module.css";
import { PrimaryButton as PrimaryButtonBase } from "../../../components/misc/Buttons.js";
import { SectionHeading, Subheading as SubheadingBase } from "../../../components/misc/Headings.js";
// import { workshopList } from "../../../services/workshops.js";

import bgStyles from "../../../styles/bgStyles.module.css";
import { EventRegistrationForm } from '../../../components/events/eventRegForm';

const HeadingInfoContainer = tw.div`text-center max-w-lg xl:max-w-none mx-auto xl:mx-0`;

const Container = tw.div`relative bg-transparent`;

const SingleColumn = tw.div`max-w-screen-xl mx-auto py-5 sm:py-20 lg:py-24`;

const TwoColumn = tw.div`flex flex-col px-3 sm:px-0 md:flex-row justify-center max-w-screen-xl mx-auto`;
const Column = tw.div`w-full max-w-md mx-auto md:max-w-none md:mx-0`;
const ImageColumn = tw(Column)`md:pl-16 md:w-9/12 flex-shrink-0 h-80 md:h-auto relative`;
const TextColumn = styled(Column)(props => [
    tw`md:w-7/12 mt-16 md:mt-0 md:pl-10`,
    props.textOnLeft ? tw`md:mr-12 lg:mr-16 md:order-first` : tw`md:ml-12 lg:ml-16 md:order-last`
]);

const Image = styled.div(props => [
    `background-image: url("${props.imageSrc}");`,
    tw`rounded bg-contain bg-no-repeat bg-center h-full`
]);
const TextContent = tw.div`lg:py-8 text-center md:text-left`;

const Heading = tw(
    SectionHeading
)`-mt-2 sm:mt-4 font-black text-left text-3xl sm:text-4xl lg:text-5xl text-center md:text-left leading-tight`;


const Description = tw.p`mt-4 text-justify md:text-left text-sm md:text-base lg:text-lg font-medium leading-relaxed text-secondary-100`;

const LogoImg = tw.div`w-8 mr-2`;
const CardMeta = styled.div`
  ${tw`flex flex-row flex-wrap sm:justify-start justify-center sm:items-center font-semibold tracking-wide text-white uppercase text-sm`}
`;

const CardMetaFeature = styled.div`
  ${tw`flex items-center mt-4 mr-4 last:mr-0`}
  svg {
    ${tw`w-5 h-5 mr-1`}
  }
`;



const RegisterButton = tw(PrimaryButtonBase)`md:w-1/2 mt-6 mx-5`;

export default function WorkshopRegistration({
    imageInsideDiv = true
}) {

    const router = useRouter();
    const { wsID } = router.query;

    const [wsDetails, setwsDetails] = useState();
    const [eventregistered, setEventregistered] = useState(false);

    useEffect(async () => {

        if (router.isReady) {
            setwsDetails(workshopList.find(x => x.id === wsID));
        }
    }, [router]);

    return (
        <>
            <Head>
                <title>Workshops | Technovanza VJTI 2021-22</title>
                <link rel="icon" href="/favicon.ico" />

                {/* Meta tags */}
                <meta charset="UTF-8" />
                <meta name="description" content="Explore a plethora of Workshops focused on variety of domains in technology. Technovanza VJTI - The technical fest for extravaganza of fun and astonishing events, Guest Lectures, amazing prizes, and much more." />
                <meta name="keywords" content="Technovanza, Techno, Technovanza VJTI, VJTI, Veermata Jijabai Technological Institute, 
        Guest Lecture Series, GLS, Technology, Technosavy, extravaganze, fun events" />
                <meta name="author" content="Abhay Ubhale" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />

                {/* OG Tags */}
                <meta property="og:title" content="Workshops | Technovanza VJTI 2021-22" />
                <meta property="og:description" content="Explore a plethora of Workshops focused on variety of domains in technology. Technovanza VJTI - The technical fest for extravaganza of fun and astonishing events, Guest Lectures, amazing prizes, and much more." />
                <meta property="og:image" content={wsDetails ? wsDetails.imageSrc : "https://technovanza.org/logo.png"} />
                <meta property="og:video" content="https://technovanza.org/technovanza.webm" />
                <meta property="og:type" content="website" />
                <meta property="og:url" content="https://technovanza.org" />
                <meta property="og:determiner" content="the" />
                <meta property="og:locale" content="en_IN" />

                {/* Twitter SEO Tags */}
                <meta property="twitter:title" content="Workshops | Technovanza VJTI 2021-22" />
                <meta property="twitter:description" content="Explore a plethora of Workshops focused on variety of domains in technology. Technovanza VJTI - the technical fest for extravaganza of fun and astonishing events, Guest Lectures, amazing prizes, and much more." />
                <meta property="twitter:image" content={wsDetails ? wsDetails.imageSrc : "https://technovanza.org/logo.png"} />
                <meta property="twitter:card" content="summary" />
                <meta property="twitter:url" content="https://technovanza.org" />
            </Head>

            <div className={bgStyles.parent}>
                <div className={bgStyles.stars}></div>
                <Container>
                    <SingleColumn>
                        {
                            wsDetails ?
                                <>
                                    <TwoColumn css={!imageInsideDiv && tw`md:items-center`}>
                                        <ImageColumn>
                                            <Image imageSrc={wsDetails.imageSrc} width="100px" />
                                        </ImageColumn>
                                        <TextColumn textOnLeft={true}>
                                            <TextContent>
                                                <Heading>{wsDetails.name}</Heading>
                                                <Description>{wsDetails.description}</Description>
                                                <CardMeta>
                                                    <CardMetaFeature>
                                                        <LogoImg>
                                                            <img src="https://img.icons8.com/nolan/64/time.png" />
                                                        </LogoImg>
                                                        {wsDetails.date}
                                                    </CardMetaFeature>
                                                    <CardMetaFeature>
                                                        <LogoImg>
                                                            <img src="https://img.icons8.com/external-icongeek26-outline-gradient-icongeek26/64/000000/external-location-user-interface-icongeek26-outline-gradient-icongeek26.png" />
                                                        </LogoImg>
                                                        {wsDetails.venue}
                                                    </CardMetaFeature>
                                                </CardMeta>
                                            </TextContent>
                                        </TextColumn>
                                    </TwoColumn>
                                    <i><p className="text-xl text-white text-center p-5">  {wsDetails.notice ? "Note: " + wsDetails.notice : null}</p></i>
                                    <HeadingInfoContainer>
                                        <a target="_blank" rel="noopener noreferrer" href={wsDetails.registerLink}>
                                            <RegisterButton>
                                                Register Here
                                            </RegisterButton>
                                        </a>
                                    </HeadingInfoContainer>
                                </>
                                :
                                null
                        }
                    </SingleColumn>
                </Container>
            </div>
        </>
    );
}
