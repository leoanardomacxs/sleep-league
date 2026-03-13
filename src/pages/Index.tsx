import { useState } from "react";
import BottomNav from "../components/BottomNav";
import CosmicBackground from "../components/CosmicBackground";
import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import LeagueScreen from "../screens/LeagueScreen";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RankChangeModal from "../components/RankChangeModal";
import { AnimatePresence, motion } from "framer-motion";
import { RankProvider } from "@/contexts/RankContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");

  const renderScreen = () => {
    switch (activeTab) {
      case "home": return <HomeScreen />;
      case "stats": return <StatsScreen />;
      case "league": return <LeagueScreen />;
      case "feed": return <FeedScreen />;
      case "profile": return <ProfileScreen />;
      default: return <HomeScreen />;
    }
  };

  return (
    <RankProvider>
      <div className="min-h-screen bg-background overflow-x-hidden">
        <CosmicBackground />
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {renderScreen()}
          </motion.div>
        </AnimatePresence>
        <BottomNav active={activeTab} onNavigate={setActiveTab} />
        <RankChangeModal />
      </div>
    </RankProvider>
  );
};

export default Index;
