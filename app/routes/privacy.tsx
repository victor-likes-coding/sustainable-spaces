// import type { MetaFunction } from "@remix-run/node";
// import { Link } from "@remix-run/react";

export default function Privacy() {
  return (
    <div className="w-full h-without-nav-auto bg-primary">
      <main className="px-4 h-full flex flex-col gap-4 pb-8 pt-4">
        <h1 className="text-xl font-bold">Privacy Policy</h1>

        <p>
          <span className="font-bold">Last Updated</span>: 1/13/2024
        </p>

        <p>
          This Privacy Policy describes how [Your Company Name] (&quot;we,&quot;
          &quot;us,&quot; or &quot;our&quot;) collects, uses, and shares
          personal information when you use our [website/mobile app/service]
          (the &quot;Service&quot;). By accessing or using the Service, you
          consent to the practices described in this Privacy Policy.
        </p>

        <h2 className="font-semibold">Information We Collect</h2>

        <h3 className="font-semibold">Information You Provide to Us:</h3>

        <ul className="flex gap-2 flex-col">
          <li>
            <strong>Personal Information:</strong> When you register for an
            account, use our Service, or communicate with us, we may collect
            personal information such as your name, email address, postal
            address, and phone number.
          </li>
          <li>
            <strong>User-Generated Content:</strong> Any content you voluntarily
            provide, such as comments, reviews, or other user-generated content
            on the Service.
          </li>
        </ul>

        <h3 className="font-semibold">Information We Automatically Collect:</h3>

        <ul className="flex gap-2 flex-col">
          <li>
            <strong>Usage Data:</strong> We may collect information about your
            interactions with the Service, including your IP address, browser
            type, operating system, pages viewed, and the date and time of your
            visit.
          </li>
          <li>
            <strong>Cookies and Tracking Technologies:</strong> We use cookies,
            web beacons, and similar tracking technologies to collect
            information about your browsing and usage patterns. You can control
            cookie preferences through your browser settings.
          </li>
        </ul>

        <h2 className="font-semibold">How We Use Your Information</h2>

        <p>
          We may use the information we collect for various purposes, including:
        </p>

        <ul className="list-disc ml-4">
          <li>To provide, maintain, and improve the Service.</li>
          <li>
            To send you updates, newsletters, or marketing communications (you
            can opt-out at any time).
          </li>
          <li>To respond to your inquiries, comments, or requests.</li>
          <li>
            To prevent fraud, protect our legal rights, and ensure the security
            of our Service.
          </li>
          <li>
            To comply with legal obligations and enforce our Terms of Service.
          </li>
        </ul>

        <h2 className="font-semibold">Information Sharing</h2>

        <p>We may share your information in the following ways:</p>

        <ul className="list-disc ml-4">
          <li>
            With service providers who assist us in delivering the Service.
          </li>
          <li>
            With third parties for marketing or advertising purposes (you can
            opt-out).
          </li>
          <li>In response to legal requests or to protect our rights.</li>
          <li>
            In connection with a merger, sale, or acquisition of all or a
            portion of our company.
          </li>
        </ul>

        <h2 className="font-semibold">Your Choices</h2>

        <ul className="flex gap-2 flex-col">
          <li>
            <strong>Opt-Out:</strong> You can opt-out of receiving marketing
            communications from us by following the unsubscribe instructions
            provided in the messages.
          </li>
          <li>
            <strong>Cookies:</strong> You can adjust your browser settings to
            refuse cookies or alert you when cookies are being sent.
          </li>
        </ul>

        <h2 className="font-semibold">Your Rights</h2>

        <p>
          You may have certain rights regarding your personal information,
          including the right to access, correct, or delete your data. Please
          contact us at some-email@email.com for assistance with your rights.
        </p>

        <h2 className="font-semibold">Security</h2>

        <p>
          We implement security measures to protect your personal information.
          However, no method of transmission over the internet or electronic
          storage is entirely secure, and we cannot guarantee absolute security.
        </p>

        <h2 className="font-semibold">Changes to this Privacy Policy</h2>

        <p>
          We may update this Privacy Policy from time to time to reflect changes
          in our practices or for other operational, legal, or regulatory
          reasons. Any updates will be posted on this page with a revised
          &quot;Last Updated&quot; date.
        </p>

        <h2 className="font-semibold">Contact Us</h2>

        <p>
          If you have any questions, concerns, or requests regarding this
          Privacy Policy, please contact us at some-email@email.com.
        </p>
      </main>
    </div>
  );
}
