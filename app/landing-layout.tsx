import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/landing/navigation";

export interface LandingLayoutProps {
    children: React.ReactNode;
}

export default function LandingLayout({ children }: LandingLayoutProps) {
    return (
        <>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
