// Confetti.tsx
import React, { useEffect, useRef } from "react";

const Confetti: React.FC = () => {
    let W = window.innerWidth;
    let H = window.innerHeight;
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationRef = useRef<number | null>(null);

    const maxConfettis = 50;
    const particles: ConfettiParticle[] = [];

    const possibleColors: string[] = [
        "DodgerBlue",
        "OliveDrab",
        "Gold",
        "Pink",
        "SlateBlue",
        "LightBlue",
        "Gold",
        "Violet",
        "PaleGreen",
        "SteelBlue",
        "SandyBrown",
        "Chocolate",
        "Crimson",
    ];

    const randomFromTo = (from: number, to: number): number =>
        Math.floor(Math.random() * (to - from + 1) + from);

    class ConfettiParticle {
        x: number;
        y: number;
        r: number;
        d: number;
        color: string;
        tilt: number;
        tiltAngleIncremental: number;
        tiltAngle: number;

        constructor() {
            this.x = Math.random() * W;
            this.y = Math.random() * H - H;
            this.r = randomFromTo(11, 33);
            this.d = Math.random() * maxConfettis + 11;
            this.color =
                possibleColors[Math.floor(Math.random() * possibleColors.length)];
            this.tilt = Math.floor(Math.random() * 33) - 11;
            this.tiltAngleIncremental = Math.random() * 0.07 + 0.05;
            this.tiltAngle = 0;
        }

        draw(context: CanvasRenderingContext2D) {
            context.beginPath();
            context.lineWidth = this.r / 2;
            context.strokeStyle = this.color;
            context.moveTo(this.x + this.tilt + this.r / 3, this.y);
            context.lineTo(this.x + this.tilt, this.y + this.tilt + this.r / 5);
            context.stroke();
        }
    }

    const Draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const context = canvas.getContext("2d");
        if (!context) return;

        context.clearRect(0, 0, W, H);

        for (let i = 0; i < maxConfettis; i++) {
            particles[i].draw(context);
        }

        for (let i = 0; i < maxConfettis; i++) {
            const particle = particles[i];
            particle.tiltAngle += particle.tiltAngleIncremental;
            particle.y += (Math.cos(particle.d) + 3 + particle.r / 2) / 2;
            particle.tilt = Math.sin(particle.tiltAngle - i / 3) * 15;

            if (particle.y > H || particle.x > W + 30 || particle.x < -30) {
                particle.x = Math.random() * W;
                particle.y = -30;
                particle.tilt = Math.floor(Math.random() * 10) - 20;
            }
        }

        animationRef.current = requestAnimationFrame(Draw);
    };

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        canvas.width = W;
        canvas.height = H;

        for (let i = 0; i < maxConfettis; i++) {
            particles.push(new ConfettiParticle());
        }

        Draw();

        const handleResize = () => {
            W = window.innerWidth;
            H = window.innerHeight;
            canvas.width = W;
            canvas.height = H;
        };

        window.addEventListener("resize", handleResize);

        return () => {
            if (animationRef.current) cancelAnimationFrame(animationRef.current);
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{ position: "absolute", top: 0, left: 0, zIndex: 1, pointerEvents: "none" }}
        />
    );
};

export default Confetti;
