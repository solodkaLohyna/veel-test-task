import { Main } from "@/modules/main/pages/page";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

export default function Home() {
  return (
    <div className="h-screen overflow-hidden">
      <h1 className="text-center text-5xl font-bold">To Do</h1>
      <Main />
      <Toaster />
    </div>
  );
}
