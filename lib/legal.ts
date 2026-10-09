/**
 * The policy pages: privacy, terms, SMS and cookies.
 *
 * Each is a title and a body. The body is plain text with four marks, so the
 * client can edit it in a textarea without touching HTML and nothing they type
 * can break the page:
 *
 *   ## Heading          a section heading
 *   - item              a bullet
 *   **text**            bold
 *   [text](/path)       a link
 *
 * A blank line starts a new paragraph; a single line break inside a paragraph
 * is kept, which is what an address block needs.
 *
 * The text below is the default, as published on noblesoft.com. Nothing is
 * seeded into the database: a policy nobody has edited renders this, and
 * "Reset" in the admin simply deletes the stored copy. No `server-only` here,
 * because the admin editor parses the same text in the browser for its preview.
 */

export type LegalDoc = { slug: string; title: string; body: string };

export type LegalBlock =
  | { type: "h2"; text: string }
  | { type: "p"; text: string }
  | { type: "ul"; items: string[] };

export type LegalInline = { text: string; bold?: boolean; href?: string };

export const LEGAL_DEFAULTS: LegalDoc[] = [
  {
    slug: "privacy",
    title: "Privacy Policy",
    body: `At Noblesoft Technologies Inc., we are committed to protecting your privacy and safeguarding your personal information. This Privacy Policy explains how we collect, use, disclose, and protect personal data obtained through our websites, services, communications, staffing activities, and marketing campaigns.

## 1. Who We Are

Noblesoft Technologies Inc., headquartered at 2601 Network Blvd, Ste 450, Frisco, TX 75034, is a staffing and technology services company that provides workforce solutions and IT consulting. Our services include recruitment, employment services, mass communications, and client support. Our contact number is (972) 845 8400.

## 2. Personal Information We Collect

We collect information directly from you, through automated means, and from third parties to provide our staffing and technology services. Types of personal information include:

- Contact information: name, phone, mailing address, email address
- Employment information: resume, work history, skills, certifications
- Demographics: location, age range, professional background
- Usage data: IP address, browser type, cookies, analytics, website navigation
- Communications: emails, SMS messages, calls, surveys, social media interactions

## 3. Legal Bases for Processing (GDPR and Similar Laws)

For residents of the EEA, UK, or other regions with similar privacy protections, we rely on the following legal bases:

- **Consent:** When you explicitly opt-in to communications or marketing.
- **Contractual Necessity:** When processing is necessary to provide staffing services or fulfill an employment-related contract.
- **Legitimate Interest:** For business operations, communications, website analytics, and fraud prevention.
- **Legal Obligation:** When required by applicable laws, regulations, or governmental requests.

## 4. How We Use Personal Information

We use your information for purposes including:

- Recruitment and staffing services, employment matching, and onboarding
- Communication via email, phone, SMS, and postal mail
- Marketing and promotional campaigns (only with your consent)
- Operational, compliance, and security purposes
- Analytics, business intelligence, and performance improvement
- Fraud detection and legal compliance

## 5. Communication Practices

We may contact you via:

- **Email:** Direct recruitment, newsletters, or campaigns. Opt-out links are always provided.
- **Phone Calls:** For staffing, verification, or marketing purposes. You may request to stop calls.
- **SMS / Text Messaging:** For recruitment updates, promotions, or service notifications. Frequency may vary. Message/data rates may apply. Reply STOP to opt out, HELP for assistance.

## 6. Cookies and Similar Technologies

We use cookies and similar technologies to improve website functionality, analytics, personalization, and security:

- **Essential Cookies:** Required for basic functionality and security.
- **Analytics Cookies:** Help us understand site usage and improve services.
- **Functionality Cookies:** Store preferences and enhance user experience.
- **Security Cookies:** Protect against fraud or threats.

You may disable cookies via your browser settings, though some features may not function correctly.

## 7. Sharing Personal Data

We do not sell personal data. We may share information:

- With service providers and partners who support recruitment, communications, or analytics
- For compliance with legal obligations, law enforcement, or protection of rights and property
- In connection with mergers, acquisitions, or business transfers

## 8. Retention of Personal Data

We retain personal data only as long as necessary for the purposes outlined above or as required by law. Retention periods vary based on data type and legal requirements.

## 9. Your Rights

Depending on your location, you may have the right to:

- Access, correct, or delete personal data
- Restrict or object to processing
- Withdraw consent for marketing communications
- Receive a copy of your data in a portable format
- Lodge a complaint with a supervisory authority

## 10. California Consumer Privacy Act (CCPA/CPRA)

California residents have additional rights, including:

- The right to know what personal data is collected, used, shared, or sold
- The right to request deletion of personal information
- The right to opt out of the sale or sharing of personal information (Noblesoft does not sell personal data)
- The right to non-discrimination for exercising privacy rights

## 11. SMS / Text Messaging Terms

No mobile information will be shared or sold for marketing. SMS terms include:

- Message frequency may vary
- Message/data rates may apply
- Reply STOP to opt out; reply HELP for assistance
- Messages are only for opt-in purposes (job alerts, updates, notifications)

## 12. Data Security

We implement administrative, technical, and physical safeguards, including:

- Encrypted storage of data
- Access control and authentication
- Network security measures and monitoring
- Employee training on data privacy

## 13. International Transfers

Data may be transferred to and processed in countries outside your jurisdiction. We apply contractual safeguards (SCCs) and internal policies to protect your data.

## 14. Third-Party Links

Our website may link to third-party services. We are not responsible for their privacy practices; please review their policies.

## 15. Automated Decision-Making

We do not make automated decisions affecting legal rights or producing significant effects without consent.

## 16. Policy Updates

We may update this policy periodically. “Last Updated” date will reflect changes.

## 17. Contact Information

If you have questions, requests, or concerns, contact our Data Protection Officer:

- Mail: Noblesoft Technologies Inc., 2601 Network Blvd, Ste 450, Frisco TX 75034
- Phone: (972) 845 8400`,
  },
  {
    slug: "terms",
    title: "Terms & Conditions",
    body: `Welcome to Noblesoft Technologies Inc. These Terms & Conditions ("Terms") govern your use of our services, communications, and interactions with our staffing and recruitment activities. By engaging with us, you agree to these Terms.

## 1. Use of Services

You may use our staffing, consulting, or software services only for lawful purposes. You agree not to use our services to harass, spam, or violate any applicable laws or regulations.

## 2. Communication & Consent

By providing your contact information, you consent to receiving communications from Noblesoft Technologies, including:

- Emails regarding staffing opportunities, company updates, or relevant offers.
- Phone calls for recruitment, interviews, and follow-ups.
- SMS messages or texts as part of our opt-in campaigns.

You may opt out of communications at any time by following the unsubscribe instructions in emails, replying **STOP** to SMS messages, or contacting us directly.

## 3. Information Accuracy

You agree to provide accurate and complete information when submitting your resume, profile, or any personal details. Noblesoft is not responsible for any consequences arising from incorrect, outdated, or misleading information.

## 4. Data Protection

We handle your personal information in accordance with our [Privacy Policy](/privacy) and [Cookies Policy](/cookies). We will not sell your information to third parties for marketing purposes. Your data will only be used for legitimate staffing, recruitment, and operational purposes.

## 5. Communication Disclaimer

Noblesoft may send you promotional or informational communications. Message and data rates may apply depending on your service provider. While we strive for accuracy, Noblesoft is not liable for delays, undelivered messages, or technical errors.

## 6. Intellectual Property

All content, logos, designs, software, and materials provided by Noblesoft are our intellectual property. You may not copy, distribute, or use them for commercial purposes without prior written consent.

## 7. Third-Party Links

Our communications or website may contain links to third-party websites. We are not responsible for the content or privacy practices of these third parties. You are encouraged to review their terms and policies.

## 8. Limitation of Liability

To the fullest extent permitted by law, Noblesoft Technologies Inc. and its affiliates are not liable for any indirect, incidental, or consequential damages arising from your use of our services or communications, including loss of data, loss of business, or personal injury.

## 9. Indemnification

You agree to indemnify, defend, and hold harmless Noblesoft, its officers, directors, employees, and agents from any claims, damages, liabilities, or expenses arising from your use of our services or violation of these Terms.

## 10. Governing Law

These Terms are governed by and construed under the laws of the State of Texas, United States, without regard to conflict of laws principles. Any disputes will be resolved in the courts located in Texas.

## 11. Modifications

Noblesoft reserves the right to update or modify these Terms at any time. Changes will be posted on this page, and the "Last Updated" date will reflect the latest update. Continued use of our services constitutes acceptance of the updated Terms.

## 12. Contact

If you have any questions or concerns regarding these Terms or your interactions with Noblesoft, please contact us at:

Noblesoft Technologies Inc.
2601 Network Blvd, Ste 450
Frisco, TX 75034
Tel: (972) 845 8400`,
  },
  {
    slug: "sms",
    title: "SMS / Text Messaging Policy",
    body: `Noblesoft Technologies Inc. (“Noblesoft,” “we,” “us,” or “our”) is committed to protecting your privacy while communicating via SMS. This policy explains how we use your mobile number, your rights, and how you can manage your SMS preferences.

## 1. Scope

This policy applies to all SMS communications sent by Noblesoft for recruitment, staffing notifications, marketing, promotional messages, or operational updates.

## 2. Consent and Opt-In

We only send SMS messages to individuals who have explicitly provided consent to receive communications. By opting in, you agree to receive SMS messages from Noblesoft.

- Consent may be provided via website forms, employment applications, text message, or verbal authorization.
- Consent can be withdrawn at any time (see **Opt-Out** section).

## 3. Types of SMS Messages

- **Recruitment Messages:** Job alerts, interview scheduling, employment notifications.
- **Promotional Messages:** Marketing campaigns or special offers (only if you opted in).
- **Operational Updates:** Service announcements, appointment reminders, or account notifications.

## 4. Message Frequency

Frequency of messages may vary based on your engagement and the services you are subscribed to. We will send messages only as necessary and in accordance with your preferences.

## 5. Opt-Out / STOP

You can opt out of SMS communications at any time by replying **STOP** to any message. After opting out, you will not receive further SMS messages unless you re-subscribe.

## 6. Assistance / HELP

If you need help or have questions about SMS messages, reply **HELP** or contact us directly at (972) 845-8400 or via [email](/contact#form).

## 7. Message and Data Rates

Message and data rates may apply based on your mobile carrier. You are responsible for any charges incurred for receiving SMS messages from Noblesoft.

## 8. Data Collection and Usage

We collect your mobile number and related information to:

- Deliver messages you have opted into
- Verify identity and provide recruitment updates
- Analyze and improve our messaging campaigns
- Ensure compliance with legal obligations

## 9. Sharing of Mobile Information

We do not sell, trade, or share your mobile number with third parties for marketing purposes. We may share your information only with trusted service providers for the purpose of sending messages or ensuring operational performance.

## 10. Security

We implement technical, administrative, and physical safeguards to protect your mobile information from unauthorized access, disclosure, alteration, or destruction.

## 11. Retention of Mobile Information

Your mobile number and related information will be retained only as long as necessary to provide services, comply with legal obligations, or enforce our agreements.

## 12. Legal Compliance

All SMS communications comply with applicable laws, including but not limited to:

- Telephone Consumer Protection Act (TCPA)
- CAN-SPAM Act
- California Consumer Privacy Act (CCPA/CPRA)
- General Data Protection Regulation (GDPR) for European recipients

## 13. Automated Messaging

We may use automated systems to send SMS messages, but these systems do not make automated decisions that affect legal rights or produce significant effects without consent.

## 14. International Messages

If you are outside the United States, message delivery may be subject to international charges and laws. We will take reasonable steps to comply with applicable international regulations.

## 15. Changes to This Policy

We may update this SMS Policy periodically. Any changes will be reflected in the “Last Updated” date. Continued use of SMS services after updates constitutes acceptance of the revised policy.

## 16. Contact Us

If you have questions, requests, or complaints regarding SMS communications, you may contact our Data Protection Officer:

- Mail: Noblesoft Technologies Inc., 2601 Network Blvd, Ste 450, Frisco, TX 75034
- Phone: (972) 845-8400
- Email: [Contact Form](/contact#form)`,
  },
  {
    slug: "cookies",
    title: "Cookies Policy",
    body: `We use cookies and similar technologies to improve website functionality, analytics, personalization, and security:

- **Essential Cookies:** Required for basic functionality and security.
- **Analytics Cookies:** Help us understand site usage and improve services.
- **Functionality Cookies:** Store preferences and enhance user experience.
- **Security Cookies:** Protect against fraud or threats.

You may disable cookies via your browser settings, though some features may not function correctly.

For how we handle personal data more broadly, see our [Privacy Policy](/privacy).`,
  }
];

export const LEGAL_SLUGS = LEGAL_DEFAULTS.map((d) => d.slug);

export function legalDefault(slug: string): LegalDoc | undefined {
  return LEGAL_DEFAULTS.find((d) => d.slug === slug);
}

/** content-table keys a policy is stored under */
export const legalKeys = (slug: string) => ({ title: `legal.${slug}.title`, body: `legal.${slug}.body` });

export function parseLegal(body: string): LegalBlock[] {
  const blocks: LegalBlock[] = [];
  let para: string[] = [];
  let list: string[] = [];
  const flush = () => {
    if (para.length) blocks.push({ type: "p", text: para.join("\n") });
    if (list.length) blocks.push({ type: "ul", items: list });
    para = [];
    list = [];
  };
  for (const raw of body.replace(/\r\n?/g, "\n").split("\n")) {
    const line = raw.trim();
    if (!line) flush();
    else if (line.startsWith("## ")) { flush(); blocks.push({ type: "h2", text: line.slice(3).trim() }); }
    else if (/^[-*•]\s+/.test(line)) { if (para.length) flush(); list.push(line.replace(/^[-*•]\s+/, "")); }
    else { if (list.length) flush(); para.push(line); }
  }
  flush();
  return blocks;
}

/** Splits a line into plain, bold and link runs. Anything unmatched stays as typed. */
export function parseInline(text: string): LegalInline[] {
  const out: LegalInline[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\(([^)\s]+)\)/g;
  let last = 0;
  for (let m = re.exec(text); m; m = re.exec(text)) {
    if (m.index > last) out.push({ text: text.slice(last, m.index) });
    if (m[1] !== undefined) out.push({ text: m[1], bold: true });
    else out.push({ text: m[2], href: safeHref(m[3]) });
    last = m.index + m[0].length;
  }
  if (last < text.length) out.push({ text: text.slice(last) });
  return out;
}

/* Only site paths, web addresses, mail and phone links. A `javascript:` address
   typed into the editor becomes inert rather than a script on a public page. */
function safeHref(href: string): string | undefined {
  return /^(\/|#|https?:\/\/|mailto:|tel:)/i.test(href) ? href : undefined;
}
