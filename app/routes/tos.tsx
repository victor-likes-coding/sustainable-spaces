// import type { MetaFunction } from "@remix-run/node";
// import { Link } from "@remix-run/react";

export default function Privacy() {
  return (
    <div className="w-full h-without-nav-auto bg-primary text-white">
      <main className="px-2 h-full flex flex-col gap-4 pb-8">
        <div className="max-w-3xl mx-auto p-4">
          <h1 className="text-2xl font-semibold mb-4">Terms and Conditions</h1>

          <p>
            <strong>Last Updated:</strong> 1/13/2024
          </p>

          <p className="my-4">
            Please read these Terms and Conditions (&quot;Terms,&quot;
            &quot;Agreement&quot;) carefully before using [Your
            Website/App/Service] (&quot;the Service&quot;) operated by [Your
            Company Name] (&quot;us,&quot; &quot;we,&quot; or &quot;our&quot;).
          </p>

          <p>
            By accessing or using the Service, you agree to be bound by these
            Terms. If you disagree with any part of these Terms, do not use the
            Service.
          </p>

          <h2 className="text-xl font-semibold mt-4">Accounts</h2>

          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <strong>Account Creation:</strong> You are responsible for
              maintaining the confidentiality of your account and password. You
              agree to provide accurate and complete information when creating
              an account.
            </li>
            <li className="mb-2">
              <strong>Account Termination:</strong> We reserve the right to
              terminate or suspend your account without prior notice for any
              reason, including violation of these Terms.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-4">Use of the Service</h2>

          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <strong>Content:</strong> You may not use the Service to
              distribute, publish, or transmit any material that is unlawful,
              defamatory, harassing, harmful, obscene, or otherwise
              objectionable.
            </li>
            <li className="mb-2">
              <strong>Intellectual Property:</strong> All content, trademarks,
              and intellectual property rights on the Service are owned by us or
              our licensors.
            </li>
            <li className="mb-2">
              <strong>Third-Party Links:</strong> The Service may contain links
              to third-party websites or services that are not owned or
              controlled by us. We have no control over, and assume no
              responsibility for, the content, privacy policies, or practices of
              any third-party websites or services. You further acknowledge and
              agree that we shall not be responsible or liable, directly or
              indirectly, for any damage or loss caused or alleged to be caused
              by or in connection with the use of or reliance on any such
              content, goods, or services available on or through any such
              websites or services.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-4">Termination</h2>

          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <strong>Termination:</strong> We may terminate or suspend access
              to the Service immediately, without prior notice or liability, for
              any reason whatsoever, including, without limitation, if you
              breach these Terms.
            </li>
            <li className="mb-2">
              <strong>Changes:</strong> We reserve the right to modify or
              terminate the Service or these Terms at any time, without notice.
              You agree that we shall not be liable to you or any third party
              for any modification, suspension, or termination of the Service or
              these Terms.
            </li>
          </ol>

          <h2 className="text-xl font-semibold mt-4">Governing Law</h2>

          <ol className="list-decimal ml-6">
            <li className="mb-2">
              <strong>Jurisdiction:</strong> These Terms shall be governed and
              construed in accordance with the laws of [Your Jurisdiction],
              without regard to its conflict of law provisions.
            </li>
            <li className="mb-2">
              <strong>Dispute Resolution:</strong> Any dispute arising under
              these Terms shall be resolved by arbitration in accordance with
              the rules of the American Arbitration Association.
            </li>
          </ol>

          <h2 className="text-md font-bold mt-4 mb-2">
            Changes to Terms and Conditions
          </h2>

          <p className="text-sm">
            <strong>Updates:</strong> We reserve the right to revise these Terms
            and Conditions at any time. By continuing to access or use the
            Service after those revisions become effective, you agree to be
            bound by the updated terms.
          </p>

          <h2 className="text-xl font-semibold mt-4">Contact Us</h2>

          <p>
            <strong>Contact:</strong> If you have any questions about these
            Terms and Conditions, please contact us at some-email@email.com.
          </p>
        </div>
      </main>
    </div>
  );
}
