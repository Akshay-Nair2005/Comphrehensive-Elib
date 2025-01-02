import React from 'react';
import { Loader } from "@react-three/drei";
import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import { Experience } from "../components/Book/Experience";
import { UI } from "../components/Book/UI";
import FeaturedBook from '../components/Book/FeaturedBook';
import AboutUs from '../components/About/AboutUs';
import ContactUs from '../components/Contact/ContactUs';
import Footerr from '../components/Footerr';
import HostedBooks from '../components/Book/HostedBooks';

const HomePage = () => {
    return (
        <>
            <UI />
            <Loader 
                containerStyles={{ 
                    position: 'fixed', 
                    top: 0, 
                    left: 0, 
                    width: '100vw', 
                    height: '100vh', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    // backgroundColor: '#121212' 
                }} 

            />
            <Canvas shadows camera={{ position: [-0.5, 1, 4], fov: 45 }}>
                <group position-y={0}>
                    <Suspense fallback={null}>
                        <Experience />
                    </Suspense>
                </group>
            </Canvas>
            <FeaturedBook isHome={true} />
            <HostedBooks isHome={true}/>
            <ContactUs />
            <Footerr />
        </>
    );
};

export default HomePage;
