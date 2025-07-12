import {cn} from "@/lib/utils";
import Link from "next/link";
import {siteConfig} from "@/config/site";
import Image from "next/image";
import {ScrambleText} from "@/components/scramble-text";

export default function Home() {
    return (
        <main
            className="flex min-h-screen w-full grow flex-col items-center justify-start gap-6 p-8 font-mono *:w-full *:max-w-2xl md:py-20">
            <header className={"flex items-center space-x-3"}>
                <Image priority src={"/images/me.png"} alt={"pfp"} width={25} height={25}
                       className={cn("rounded-full")}/>
                <ScrambleText className={cn("text-left font-bold text-xl")} text={"glpecile"}/>
            </header>
            <section className={cn("space-y-3 text-left")}>
                <p>
                    Frontend Engineer.
                </p>
                <ul className={"list-disc space-y-1 pl-6"}>
                    {Object.entries(siteConfig.links).map(([key, value]) => (
                        <li key={key}>
                            <Link className={"capitalize underline hover:font-bold"} href={value}
                                  target={"_blank"} rel={"noopener noreferrer"}
                            >
                                {key}
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>
        </main>
    );
}
