import "../styles/notfound.css";
import { useEffect, useRef } from "react";
import { gsap, Back } from 'gsap';

export default function NotFound() {
    const copyContainerRef = useRef(null);
    const handleRef = useRef(null);
    const copyWidthRef = useRef(0);
    const handleTLRef = useRef(gsap.timeline());
    const splitTextTimelineRef = useRef(gsap.timeline({ paused: true })); // Start paused

    useEffect(() => {
        console.log('Start...');
        const $copyContainer = copyContainerRef.current;

        // Calculate the width of the text container
        const textElement = $copyContainer.querySelector('p');
        copyWidthRef.current = textElement.offsetWidth;

        // Set initial position of the handle to start (left of the text)
        gsap.set(handleRef.current, { x: -20 }); // Adjust starting position as needed

        // Create the animation timeline for the characters
        const tl = gsap.timeline();

        tl.add(() => {
            animateCharacters();
        }, 0.2).add(() => {
            animateHandle(); // Move handle after text has appeared
        }, ">"); // Add at the same time as the previous animation

        // Move handle to the end at the start
        handleTLRef.current.to(
            handleRef.current,
            {
                x: copyWidthRef.current, // Move to the end of the text
                ease: "power1.inOut", // Use a smoother easing function
                duration: 1 // Duration for handle movement at start
            }
        );

        // Save the reference to the Timeline for cleanup
        splitTextTimelineRef.current = tl;

        // Clean up on unmount
        return () => {
            tl.kill();
            splitTextTimelineRef.current.kill();
            handleTLRef.current.kill();
        };
    }, []);

    const animateCharacters = () => {
        console.log('Animating characters...');
        const characters = copyContainerRef.current.querySelectorAll('.char');
        const staggerTime = 0.02; // Faster stagger time

        // Animate each character
        gsap.from(characters, {
            autoAlpha: 0,
            duration: 1.4, // Shorter duration for character animation
            ease: Back.easeInOut.config(1.7),
            stagger: staggerTime,
        });
    };

    const animateHandle = () => {
        console.log('Animating handle...');
        handleTLRef.current.restart(true);
        handleTLRef.current.to(
            handleRef.current,
            {
                x: copyWidthRef.current, // Move to the end of the text
                ease: "power1.inOut", // Smoother easing function
                duration: 1 // Adjust duration for handle movement (adjust as needed)
            }
        );
    };

    const handleReplay = () => {
        console.log('Replaying animation...');
        // Restart animations only if they're not currently running
        if (!splitTextTimelineRef.current.isActive()) {
            splitTextTimelineRef.current.restart(true);
            handleTLRef.current.restart(true);
        }
    };

    return (
        <div className="not-found-page">
            <div className="container">
                <div className="copy-container center-xy" ref={copyContainerRef}>
                    <p>{Array.from("404, page not found.").map((char, index) => (
                        <span key={index} className="char">{char}</span>
                    ))}</p>
                    <span className="handle" ref={handleRef}></span>
                </div>
                <svg
                    version="1.1"
                    id="cb-replay"
                    xmlns="http://www.w3.org/2000/svg"
                    xmlnsXlink="http://www.w3.org/1999/xlink"
                    x="0px"
                    y="0px"
                    viewBox="0 0 279.9 297.3"
                    style={{ enableBackground: 'new 0 0 279.9 297.3' }}
                    xmlSpace="preserve"
                    onClick={handleReplay} // Add click handler to the SVG
                >
                    <g>
                        <path d="M269.4,162.6c-2.7,66.5-55.6,120.1-121.8,123.9c-77,4.4-141.3-60-136.8-136.9C14.7,81.7,71,27.8,140,27.8
                        c1.8,0,3.5,0,5.3,0.1c0.3,0,0.5,0.2,0.5,0.5v15c0,1.5,1.6,2.4,2.9,1.7l35.9-20.7c1.3-0.7,1.3-2.6,0-3.3L148.6,0.3
                        c-1.3-0.7-2.9,0.2-2.9,1.7v15c0,0.3-0.2,0.5-0.5,0.5c-1.7-0.1-3.5-0.1-5.2-0.1C63.3,17.3,1,78.9,0,155.4
                        C-1,233.8,63.4,298.3,141.9,297.3c74.6-1,135.1-60.2,138-134.3c0.1-3-2.3-5.4-5.3-5.4l0,0C271.8,157.6,269.5,159.8,269.4,162.6z"/>
                    </g>
                </svg>
            </div>
        </div>
    );
            }
