import { format } from "date-fns";
import { useEffect, useRef } from "react";
import { IAIUserAgent } from "../../context/the_trenches/TheTrenchesContext";

interface ExtendedIAIUserAgent extends IAIUserAgent {
  agent_nft_id: string;
}

interface TrenchAgentsListProps {
  createdAgents: ExtendedIAIUserAgent[];
}

const TrenchAgentsList = ({ createdAgents }: TrenchAgentsListProps) => {


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
        <h3 className="text-2xl font-bold">Agents in the Trenches: {createdAgents.length}</h3>
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
          {createdAgents.map((agent) => (
            <div
              key={agent._id}
              onClick={() => window.open(`https://testnet.explorer.perawallet.app/asset/${agent.agent_nft_id}/`, '_blank')}
              className="flex-shrink-0 w-64 bg-gray-100 border-2 border-t-4 border-black shadow-md text-center dark:bg-gray-900 hover:scale-105 transition-all cursor-pointer"
            >
              <img
                src={`https://gateway.pinata.cloud/ipfs/${agent.image_ipfs_hash}`}
                alt={agent.agent_name}
                className="object-cover rounded-md mx-auto mb-2"
              />
              <div className="flex flex-col gap-2 p-2">
                <h4 className="text-lg font-semibold">{agent.agent_name}</h4>
                <p className="text-sm text-gray-500">Created: {format(new Date(agent.created_at), "dd/MM/yyyy")}</p>
              </div>
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


export default TrenchAgentsList;