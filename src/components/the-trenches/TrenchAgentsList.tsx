import { useEffect, useRef } from "react";

export default function TrenchAgentsList() {
  const agents = [
    { id: 1, name: "Shadow Walker", createdAt: "2024-01-15", image: "/images/pixel_anon74.png" },
    { id: 2, name: "Cipher Nomad", createdAt: "2023-12-22", image: "/images/pixel_anon74.png" },
    { id: 3, name: "Neon Ronin", createdAt: "2024-02-03", image: "/images/pixel_anon74.png" },
    { id: 4, name: "Obsidian Ghost", createdAt: "2023-11-29", image: "/images/pixel_anon74.png" },
    { id: 5, name: "Quantum Phantom", createdAt: "2024-01-02", image: "/images/pixel_anon74.png" },
    { id: 6, name: "Silent Hash", createdAt: "2023-10-18", image: "/images/pixel_anon74.png" },
    { id: 7, name: "Vortex Seeker", createdAt: "2024-03-08", image: "/images/pixel_anon74.png" },
    { id: 8, name: "Iron Oracle", createdAt: "2023-09-27", image: "/images/pixel_anon74.png" },
    { id: 9, name: "Echo Drifter", createdAt: "2024-02-15", image: "/images/pixel_anon74.png" },
    { id: 10, name: "Binary Revenant", createdAt: "2024-04-01", image: "/images/pixel_anon74.png" },
    { id: 1, name: "Shadow Walker", createdAt: "2024-01-15", image: "/images/pixel_anon74.png" },
    { id: 2, name: "Cipher Nomad", createdAt: "2023-12-22", image: "/images/pixel_anon74.png" },
    { id: 3, name: "Neon Ronin", createdAt: "2024-02-03", image: "/images/pixel_anon74.png" },
    { id: 4, name: "Obsidian Ghost", createdAt: "2023-11-29", image: "/images/pixel_anon74.png" },
    { id: 5, name: "Quantum Phantom", createdAt: "2024-01-02", image: "/images/pixel_anon74.png" },
    { id: 6, name: "Silent Hash", createdAt: "2023-10-18", image: "/images/pixel_anon74.png" },
    { id: 7, name: "Vortex Seeker", createdAt: "2024-03-08", image: "/images/pixel_anon74.png" },
    { id: 8, name: "Iron Oracle", createdAt: "2023-09-27", image: "/images/pixel_anon74.png" },
    { id: 9, name: "Echo Drifter", createdAt: "2024-02-15", image: "/images/pixel_anon74.png" },
    { id: 10, name: "Binary Revenant", createdAt: "2024-04-01", image: "/images/pixel_anon74.png" }
  ];

  const scrollRef = useRef<HTMLDivElement>(null);
  const speed = 2; // Adjust scroll speed

  useEffect(() => {
    const scrollContainer = scrollRef.current;
    if (!scrollContainer) return;

    let animationFrameId: number;

    const autoScroll = () => {
      if (scrollContainer.scrollLeft < scrollContainer.scrollWidth - scrollContainer.clientWidth) {
        scrollContainer.scrollLeft += speed;
        animationFrameId = requestAnimationFrame(autoScroll);
      }
    };

    animationFrameId = requestAnimationFrame(autoScroll);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  // Manual scrolling functions
  const scrollLeft = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="relative w-full py-2">
      <div className="w-full flex justify-between">
        <h3 className="text-2xl font-bold">Agents in the Trenches: 354</h3>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden mt-4">
        {/* Left Scroll Button */}
        <button
          onClick={scrollLeft}
          className="absolute left-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        >
          ◀
        </button>

        {/* Scrollable Content */}
        <div
          ref={scrollRef}
          className="flex gap-4 overflow-x-hidden px-4 scroll-smooth"
          style={{ whiteSpace: "nowrap" }}
        >
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="flex-shrink-0 w-64 bg-gray-100 border-2 border-t-4 border-black shadow-md text-center"
            >
              <img
                src={agent.image}
                alt={agent.name}
                className="object-cover rounded-md mx-auto mb-2"
              />
              <h4 className="text-lg font-semibold">{agent.name}</h4>
              <p className="text-sm text-gray-500">Created: {agent.createdAt}</p>
            </div>
          ))}
        </div>

        {/* Right Scroll Button */}
        <button
          onClick={scrollRight}
          className="absolute right-0 top-1/2 transform -translate-y-1/2 z-10 bg-gray-800 text-white p-2 rounded-full shadow-lg"
        >
          ▶
        </button>
      </div>
    </div>
  );
}
