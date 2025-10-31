import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t border-black/[0.08] bg-white">
            <div className="max-w-[1120px] mx-auto px-6 sm:px-8 py-10">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-6">
                    <Link
                        href="/"
                        className="text-[13px] font-medium text-black tracking-[-0.01em]"
                    >
                        MyProPartner
                    </Link>

                    <div className="flex flex-wrap gap-7 items-center justify-center">
                        <Link
                            href="#features"
                            className="text-[12px] font-medium text-black/60 hover:text-black transition-colors duration-200"
                        >
                            Fonctionnalités
                        </Link>
                        <Link
                            href="#pricing"
                            className="text-[12px] font-medium text-black/60 hover:text-black transition-colors duration-200"
                        >
                            Tarifs
                        </Link>
                        <Link
                            href="/privacy"
                            className="text-[12px] font-medium text-black/60 hover:text-black transition-colors duration-200"
                        >
                            Confidentialité
                        </Link>
                        <Link
                            href="/terms"
                            className="text-[12px] font-medium text-black/60 hover:text-black transition-colors duration-200"
                        >
                            Conditions
                        </Link>
                    </div>

                    <p className="text-[12px] text-black/40 font-medium">
                        © {new Date().getFullYear()} MyProPartner
                    </p>
                </div>
            </div>
        </footer>
    );
}
