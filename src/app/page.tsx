import Navbar from "@/components/Navbar";
import ScrollVideo from "@/components/ScrollVideo";

export default function Home() {
  return (
    <main className="bg-[#0D2B1D] text-[#FDFBF7]">
      <Navbar />
      {/* The cinematic scroll hero is now the only thing on the page */}
      <ScrollVideo />
    </main>
  );
}