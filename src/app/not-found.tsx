import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowUpLeft, ShieldCloseIcon } from "lucide-react";
import Link from "next/link";
import { Arrow } from "radix-ui/internal";

export default function NotFound() {
  const timestamp = new Date().toISOString().replace("T", " ").slice(0, 19) + " UTC";

  return (
    <main className="min-h-screen flex items-center justify-center bg-white px-6 py-16 font-sans">
      <div className="w-full max-w-[520px] bg-white border border-gray-200 rounded-xl overflow-hidden">

        {/* Document header */}
        <div className="bg-gray-50 border-b border-gray-200 px-5 py-3 flex items-center justify-between gap-3">
                <Link href={'/'}>
            <Button variant={'ghost'}>
                <ArrowLeft />
                Go back
            </Button>
                </Link>
          <span className="font-mono text-[10px] font-medium tracking-widest text-gray-400 uppercase">
            Data Access Response · Ref #ERR-404
          </span>
          <span className="font-mono text-[10px] font-medium tracking-wide px-3 py-1 rounded-full bg-red-50 text-red-600 border border-red-200">
            NOT FOUND
          </span>
        </div>

        {/* Body */}
        <div className="px-8 pt-8 pb-6">

          {/* 404 display */}
          <p className="font-mono text-[72px] font-medium leading-none tracking-tight text-gray-900">
            4<span className="text-gray-300 text-[40px] mx-0.5 font-normal">/</span>04
          </p>

          <h1 className="text-[15px] font-medium text-gray-900 mt-4 mb-1.5 leading-snug">
            This page has exercised its right to erasure.
          </h1>

          <p className="text-[13px] text-gray-500 leading-relaxed mb-7 max-w-[360px]">
            The resource you requested was not found — it may have been deleted,
            moved, or it never existed. Your navigation history has been noted
            but not retained.
          </p>

          <hr className="border-t border-gray-100 mb-6" />

          {/* Privacy-style data rows */}
          <div className="flex flex-col gap-2.5 mb-7">
            <Row label="requested_resource">
              <span className="text-red-500 font-bold rounded select-none font-mono text-xs leading-[1.6] px-0.5">
                unknown
              </span>
            </Row>
            <Row label="retention_period">
              0 days — immediately purged
            </Row>
            <Row label="data_subject_rights">
              No data collected from this visit
            </Row>
            <Row label="dpo_contact">
              <span className="text-blue-600">privacy@trackt.app</span>
            </Row>
          </div>
        </div>

        {/* Document footer */}
        <div className="border-t border-gray-100 bg-gray-50 px-5 py-2.5 flex items-center justify-between gap-3">
          <span className="flex items-center gap-1.5 font-mono text-[10px] text-gray-400 tracking-wide">
            <ShieldCloseIcon />
            GDPR-COMPLIANT 404
          </span>
          <span className="font-mono text-[10px] text-gray-400">{timestamp}</span>
        </div>

      </div>
    </main>
  );
}

function Row({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2.5 text-[12px]">
      <span className="font-mono text-[10px] text-gray-400 min-w-[130px] flex-shrink-0 pt-px">
        {label}
      </span>
      <span className="text-gray-500 leading-relaxed">{children}</span>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}
