import Image from 'next/image';

interface HeroImageProps {
  src: string;
  alt: string;
  aiHint?: string;
}

export function HeroImage({ src, alt, aiHint }: HeroImageProps) {
  return (
    <>
      <Image
        src={src}
        alt={alt}
        data-ai-hint={aiHint}
        fill
        priority
        sizes="100vw"
        className="z-0 object-cover"
      />
      <div className="absolute inset-0 bg-black/50" />
      <div className="absolute inset-0 bg-hero-pattern opacity-10" />
    </>
  );
}
