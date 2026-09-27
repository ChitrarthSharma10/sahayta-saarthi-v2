import React, { useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight } from 'lucide-react';
import { cn } from "../../lib/utils";

function Input({ className, type, ...props }) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input flex h-9 w-full min-w-0 rounded-md border bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        "focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]",
        "aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
        className
      )}
      {...props}
    />
  );
}

export function SignInCard2({ children, className }) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Subtle tilt range (reduced from ±10° to ±4°)
  const rawRotateX = useTransform(mouseY, [-400, 400], [4, -4]);
  const rawRotateY = useTransform(mouseX, [-400, 400], [-4, 4]);

  // Spring physics for smooth non-glitchy movement
  const rotateX = useSpring(rawRotateX, { stiffness: 200, damping: 25 });
  const rotateY = useSpring(rawRotateY, { stiffness: 200, damping: 25 });

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left - rect.width / 2);
    mouseY.set(e.clientY - rect.top - rect.height / 2);
  };

  const handleMouseLeave = () => {
    mouseX.set(0);
    mouseY.set(0);
  };

  return (
    <div className="w-full relative z-10" style={{ perspective: 1200 }}>
      <motion.div
        className={cn("relative group rounded-[28px] overflow-hidden", className)}
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        whileHover={{ scale: 1.005 }}
        transition={{ duration: 0.3 }}
      >
        {/* Card glow effect */}
        <motion.div
          className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-70 transition-opacity duration-700 pointer-events-none"
          animate={{
            boxShadow: [
              "0 0 10px 2px rgba(255,255,255,0.03)",
              "0 0 15px 5px rgba(255,255,255,0.05)",
              "0 0 10px 2px rgba(255,255,255,0.03)"
            ],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            repeatType: "mirror"
          }}
        />

        {/* Traveling light beam border effect */}
        <div className="absolute inset-0 rounded-[28px] overflow-hidden pointer-events-none">
          <motion.div
            className="absolute top-0 left-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
            initial={{ filter: "blur(2px)" }}
            animate={{
              left: ["-50%", "100%"],
              opacity: [0.3, 0.7, 0.3],
              filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
            }}
            transition={{
              left: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1 },
              opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror" },
              filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror" }
            }}
          />
          <motion.div
            className="absolute top-0 right-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
            initial={{ filter: "blur(2px)" }}
            animate={{
              top: ["-50%", "100%"],
              opacity: [0.3, 0.7, 0.3],
              filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
            }}
            transition={{
              top: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 0.6 },
              opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 0.6 },
              filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 0.6 }
            }}
          />
          <motion.div
            className="absolute bottom-0 right-0 h-[3px] w-[50%] bg-gradient-to-r from-transparent via-white to-transparent opacity-70"
            initial={{ filter: "blur(2px)" }}
            animate={{
              right: ["-50%", "100%"],
              opacity: [0.3, 0.7, 0.3],
              filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
            }}
            transition={{
              right: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.2 },
              opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.2 },
              filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.2 }
            }}
          />
          <motion.div
            className="absolute bottom-0 left-0 h-[50%] w-[3px] bg-gradient-to-b from-transparent via-white to-transparent opacity-70"
            initial={{ filter: "blur(2px)" }}
            animate={{
              bottom: ["-50%", "100%"],
              opacity: [0.3, 0.7, 0.3],
              filter: ["blur(1px)", "blur(2.5px)", "blur(1px)"]
            }}
            transition={{
              bottom: { duration: 2.5, ease: "easeInOut", repeat: Infinity, repeatDelay: 1, delay: 1.8 },
              opacity: { duration: 1.2, repeat: Infinity, repeatType: "mirror", delay: 1.8 },
              filter: { duration: 1.5, repeat: Infinity, repeatType: "mirror", delay: 1.8 }
            }}
          />
        </div>

        {/* Card inner content */}
        {children}
      </motion.div>
    </div>
  );
}
