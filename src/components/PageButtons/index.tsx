import { useEffect, useRef } from "react";

type Page = {
    name: string;
    path: string;
};

type Props = {
    pages: Page[];
    navigate: (path: string) => void;
};

const PageButtons = ({ pages, navigate }: Props) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = scrollRef.current;
        if (!container) return;

        // İlk başta ortadan başlat (sayfa çoğaltıldığından dolayı)
        container.scrollLeft = container.scrollWidth / 3;

        let frame: number;

        const autoScroll = () => {
            if (!container) return;

            container.scrollLeft += 1;

            // Scroll ortasının sonuna geldiğinde, tekrar ortanın başına dön
            const maxScroll = (container.scrollWidth * 2) / 3;
            if (container.scrollLeft >= maxScroll) {
                container.scrollLeft = container.scrollWidth / 3;
            }

            frame = requestAnimationFrame(autoScroll);
        };

        frame = requestAnimationFrame(autoScroll);

        return () => cancelAnimationFrame(frame);
    }, []);

    return (
        <div className="w-full flex justify-center  mb-1">
            <div className="relative max-w-[400px] w-full">
                <div
                    ref={scrollRef}
                    className="overflow-x-auto no-scrollbar scroll-smooth"
                >
                    <div className="flex gap-3 px-4 w-max transition-all duration-500 ease-in-out">
                        {/* 🔁 Butonları 3 kez döndür → kesintisiz döngü */}
                        {[...pages, ...pages, ...pages].map((page, index) => (
                            <button
                                key={`${page.name}-${index}`}
                                onClick={() => navigate(page.path)}
                                className="text-[11px] border border-[#2B4560] px-3 py-1.5 rounded-md font-medium hover:bg-[#2B4560] hover:text-white transition-all duration-300 shadow-sm text-[#2B4560] whitespace-nowrap"
                                style={{
                                    animation: `fadeIn 0.3s ease-in-out ${index * 0.1}s forwards`,
                                    opacity: 0,
                                }}
                            >
                                {page.name}
                            </button>
                        ))}
                    </div>
                </div>

                <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
              transform: translateX(-10px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }
        `}</style>
            </div>
        </div>
    );
};

export default PageButtons;
