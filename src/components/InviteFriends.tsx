import { motion } from "framer-motion";
import { UserPlus, MessageCircle, Instagram, Copy, Check } from "lucide-react";
import { useState } from "react";
import { useRank } from "@/contexts/RankContext";

const INVITE_MESSAGE = "🌙 Estou usando o Dormio para melhorar meu sono! Vem competir comigo na Sleep League. Baixe agora: https://dormio.app/invite";

const InviteFriends = () => {
  const { rank } = useRank();
  const [copied, setCopied] = useState(false);

  const shareWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(INVITE_MESSAGE)}`, "_blank");
  };

  const shareInstagram = () => {
    // Instagram doesn't have a direct share URL for DMs, open profile/story
    navigator.clipboard.writeText(INVITE_MESSAGE);
    window.open("https://instagram.com", "_blank");
  };

  const copyLink = () => {
    navigator.clipboard.writeText("https://dormio.app/invite");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="card-dormio p-4 mb-6"
    >
      <div className="flex items-center gap-2 mb-3">
        <UserPlus size={16} style={{ color: rank.colors.gradientFrom }} />
        <h3 className="text-sm font-display text-foreground">Convidar Amigos</h3>
      </div>
      <p className="text-xs text-muted-foreground font-body mb-4">
        Traga seus amigos para competir na Sleep League!
      </p>

      <div className="flex gap-2">
        <button
          onClick={shareWhatsApp}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[hsl(142_70%_40%)] text-white text-xs font-ui active:scale-95 transition-transform"
        >
          <MessageCircle size={16} />
          WhatsApp
        </button>
        <button
          onClick={shareInstagram}
          className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-white text-xs font-ui active:scale-95 transition-transform"
          style={{
            background: "linear-gradient(135deg, hsl(300 70% 50%), hsl(30 90% 55%))",
          }}
        >
          <Instagram size={16} />
          Instagram
        </button>
        <button
          onClick={copyLink}
          className="w-12 flex items-center justify-center rounded-xl bg-surface-elevated text-muted-foreground active:scale-95 transition-transform"
        >
          {copied ? <Check size={16} className="text-accent" /> : <Copy size={16} />}
        </button>
      </div>
    </motion.div>
  );
};

export default InviteFriends;
