import { Sidebar, type PhaseColorKey } from "./Sidebar";
import { TopBar } from "./TopBar";
import { MobileNav } from "./MobileNav";

interface PageShellProps {
  children: React.ReactNode;
  userName?: string;
  userImage?: string | null;
  currentPhaseColor?: PhaseColorKey;
  dsaToReviewCount?: number;
  reviewDue?: boolean;
  todayNotLogged?: boolean;
}

export function PageShell({
  children,
  userName,
  userImage,
  currentPhaseColor,
  dsaToReviewCount,
  reviewDue,
  todayNotLogged,
}: PageShellProps) {
  return (
    <div className="flex min-h-screen bg-[var(--bg)]">
      <Sidebar
        userName={userName}
        userImage={userImage}
        currentPhaseColor={currentPhaseColor}
        dsaToReviewCount={dsaToReviewCount}
        reviewDue={reviewDue}
        todayNotLogged={todayNotLogged}
      />
      <div className="flex min-h-screen flex-1 flex-col">
        <TopBar />
        <main className="flex-1 px-4 pb-20 pt-6 md:px-8 md:pb-8">
          <div className="mx-auto w-full max-w-[1100px]">{children}</div>
        </main>
        <MobileNav />
      </div>
    </div>
  );
}
