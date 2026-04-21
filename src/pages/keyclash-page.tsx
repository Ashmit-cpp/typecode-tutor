import { useNavigate } from "react-router-dom";
import { KeyClashLandingSectionsGrid } from "@/components/landing/keyclash-landing";

interface KeyClashPageProps {
  onEnterQueue: () => void;
}

export default function KeyClashPage({ onEnterQueue }: KeyClashPageProps) {
  const navigate = useNavigate();

  return (
    <div className="relative flex min-h-0 w-full min-w-0 flex-1 flex-col overflow-x-hidden pb-[max(0.75rem,env(safe-area-inset-bottom,0px))]">
      <div className="relative z-[1] min-h-0 w-full">
        <KeyClashLandingSectionsGrid
          onFindMatch={onEnterQueue}
          onPracticeSolo={() => navigate("/practice")}
          onStartDueling={onEnterQueue}
        />
      </div>
    </div>
  );
}
