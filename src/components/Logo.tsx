import Image from "next/image";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export default function Logo({ size = "md", className }: LogoProps) {
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

  return (
    <div className={`flex items-center ${className || ""}`}>
      <Image
        src="/logo.png"
        alt="Chartizy"
        width={sizeConfig.width}
        height={sizeConfig.height}
        className="object-contain"
        priority
      />
    </div>
  );
}
