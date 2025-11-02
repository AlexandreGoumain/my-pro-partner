import { Footer } from "@/components/landing/footer";
import { Navigation } from "@/components/landing/navigation";

export default function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <>
            <Navigation />
            <main className="min-h-screen">{children}</main>
            <Footer />
        </>
    );
}
