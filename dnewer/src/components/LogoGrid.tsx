import Image from "next/image";


export function LogoGrid({ logos = [] as { src: string; alt: string }[] }) {
    const list = logos.length ? logos : [
        { src: "https://images.unsplash.com/photo-1520975869010-5cbf3f31f7d7?w=400", alt: "Brand A" },
        { src: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400", alt: "Brand B" },
        { src: "https://images.unsplash.com/photo-1545239351-1141bd82e8a6?w=400", alt: "Brand C" },
        { src: "https://images.unsplash.com/photo-1541101767792-f9b2b1c4f127?w=400", alt: "Brand D" }
    ];


    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center">
            {list.map((logo, i) => (
                <div key={i} className="flex items-center justify-center p-4 border rounded-xl bg-white">
                    <Image src={logo.src} alt={logo.alt} width={160} height={64} className="object-contain" />
                </div>
            ))}
        </div>
    );
}