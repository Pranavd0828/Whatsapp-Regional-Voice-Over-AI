import ChatWindow from "@/components/ChatWindow";

export default function Home() {
  return (
    <div className="w-full h-full flex items-center justify-center pt-5 pb-5">
      {/* Green Background Header Stripe Effect */}
      <div className="fixed top-0 left-0 w-full h-32 bg-[#00a884] -z-10"></div>

      <ChatWindow />
    </div>
  );
}
