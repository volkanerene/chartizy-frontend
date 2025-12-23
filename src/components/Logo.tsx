import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  variant?: "default" | "black" | "white";
}

export default function Logo({ size = "md", className, variant = "default" }: LogoProps) {
  const sizes = {
    sm: {
      width: 120,
      height: 40,
    },
    md: {
      width: 160,
      height: 53,
    },
    lg: {
      width: 240,
      height: 80,
    },
  };

  const sizeConfig = sizes[size];
  
  // Determine which logo to use based on variant
  // default = logo.png (for landing page)
  // black = logoblack.png (for login, dashboard)
  const logoSrc = variant === "default" ? "/logo.png" : "/logoblack.png";

  return (
    <div className={`flex items-center ${className || ""}`}>
      <Image
        src={logoSrc}
        alt="Chartizy"
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="object-contain"
        priority
      />
    </div>
  );
}





