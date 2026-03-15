import { useState } from "react";
import BottomNav from "../components/BottomNav";
import CosmicBackground from "../components/CosmicBackground";
import HomeScreen from "../screens/HomeScreen";
import StatsScreen from "../screens/StatsScreen";
import LeagueScreen from "../screens/LeagueScreen";
import FeedScreen from "../screens/FeedScreen";
import ProfileScreen from "../screens/ProfileScreen";
import RankChangeModal from "../components/RankChangeModal";
import Login from "./Login";
import { AnimatePresence, motion } from "framer-motion";
import { RankProvider } from "@/contexts/RankContext";
import { useAuth } from "@/contexts/AuthContext";

const Index = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
        />
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

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
