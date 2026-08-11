import { LegalPageLayout, LegalP, LegalList, type LegalSection } from "@/components/legal-page-layout";

/* ------------------------------------------------------------------------
   Placeholder legal copy — this is UI scaffolding, not legal advice. Have
   an actual lawyer review and replace this text before shipping to real
   users. Update the contact email at the bottom before launch.
------------------------------------------------------------------------- */

const SECTIONS: LegalSection[] = [
  {
    id: "acceptance-of-terms",
    heading: "1. Acceptance of Terms",
    content: (
      <LegalP>
        By creating an account or otherwise using Trackly, you agree to be bound by these Terms and Conditions.
        If you don&apos;t agree to these terms, please don&apos;t use the service.
      </LegalP>
    ),
  },
  {
    id: "description-of-service",
    heading: "2. Description of Service",
    content: (
      <LegalP>
        Trackly is a job application tracker that helps you organize applications and surfaces publicly
        available information about a company&apos;s privacy practices (such as data retention and contact
        details) based on their published privacy policy. Trackly does not provide legal advice, and the
        information it surfaces is not a substitute for reading a company&apos;s policy yourself.
      </LegalP>
    ),
  },
  {
    id: "eligibility-and-account-registration",
    heading: "3. Eligibility & Account Registration",
    content: (
      <>
        <LegalP>You must be at least 16 years old to create a Trackly account.</LegalP>
        <LegalList
          items={[
            "You're responsible for keeping your login credentials secure.",
            "You're responsible for all activity that happens under your account.",
            "You agree to provide accurate information when creating your account.",
          ]}
        />
      </>
    ),
  },
  {
    id: "acceptable-use",
    heading: "4. Acceptable Use",
    content: (
      <>
        <LegalP>When using Trackly, you agree not to:</LegalP>
        <LegalList
          items={[
            "Use the service to scrape or harvest data for purposes unrelated to your own job search.",
            "Attempt to disrupt, overload, or gain unauthorized access to Trackly's systems.",
            "Use Trackly to violate any applicable law or a third party's terms of service.",
            "Reverse engineer or resell access to the service without permission.",
          ]}
        />
      </>
    ),
  },
  {
    id: "user-content",
    heading: "5. User Content",
    content: (
      <LegalP>
        You retain ownership of any notes, job details, and other content you add to Trackly. You grant us a
        limited license to store and process that content solely to provide the service to you.
      </LegalP>
    ),
  },
  {
    id: "intellectual-property",
    heading: "6. Intellectual Property",
    content: (
      <LegalP>
        Trackly&apos;s name, logo, design, and underlying software are owned by us and protected by
        intellectual property law. Nothing in these terms grants you rights to our branding or codebase
        beyond what&apos;s needed to use the service as intended.
      </LegalP>
    ),
  },
  {
    id: "privacy-scanning-feature",
    heading: "7. The Privacy Scanning Feature",
    content: (
      <LegalP>
        Trackly&apos;s privacy-scanning feature reads publicly accessible pages (respecting each site&apos;s
        robots.txt) to extract information like retention periods and contact emails. This is an automated,
        best-effort process — results can be incomplete, outdated, or occasionally wrong, and should be
        verified against the original source before you rely on them.
      </LegalP>
    ),
  },
  {
    id: "third-party-links-and-services",
    heading: "8. Third-Party Links & Services",
    content: (
      <LegalP>
        Trackly may link to or reference third-party websites, including company career pages and privacy
        policies. We don&apos;t control those sites and aren&apos;t responsible for their content or practices.
      </LegalP>
    ),
  },
  {
    id: "disclaimers",
    heading: "9. Disclaimers",
    content: (
      <LegalP>
        Trackly is provided &quot;as is&quot; without warranties of any kind, express or implied. We don&apos;t
        guarantee the service will be uninterrupted, error-free, or that scan results will be fully accurate.
      </LegalP>
    ),
  },
  {
    id: "limitation-of-liability",
    heading: "10. Limitation of Liability",
    content: (
      <LegalP>
        To the fullest extent permitted by law, Trackly and its creators won&apos;t be liable for indirect,
        incidental, or consequential damages arising from your use of the service, including decisions made
        based on scan results.
      </LegalP>
    ),
  },
  {
    id: "termination",
    heading: "11. Termination",
    content: (
      <LegalP>
        You can stop using Trackly and delete your account at any time. We may suspend or terminate accounts
        that violate these terms, with notice where reasonably possible.
      </LegalP>
    ),
  },
  {
    id: "changes-to-these-terms",
    heading: "12. Changes to These Terms",
    content: (
      <LegalP>
        We may update these terms from time to time. If we make material changes, we&apos;ll let you know
        before they take effect. Continuing to use Trackly after changes go live means you accept the updated
        terms.
      </LegalP>
    ),
  },
  {
    id: "governing-law",
    heading: "13. Governing Law",
    content: (
      <LegalP>
        These terms are governed by the laws of the jurisdiction in which Trackly operates, without regard to
        conflict-of-law principles.
      </LegalP>
    ),
  },
  {
    id: "contact-us",
    heading: "14. Contact Us",
    content: (
      <LegalP>
        Questions about these terms? Reach out at{" "}
        <a href="mailto:legal@trackly.app" className="text-gray-900 underline underline-offset-2 hover:text-red-600">
          legal@trackly.app
        </a>
        .
      </LegalP>
    ),
  },
];

export default function TermsPage() {
  return (
    <LegalPageLayout
      eyebrow="Legal"
      title="Terms and Conditions"
      lastUpdated="August 11, 2026"
      sections={SECTIONS}
    />
  );
}