// @ts-nocheck
'use client';
// Ported nearly verbatim from the original site's PagePrivacy + PageTerms (window.* stripped),
// including their shared local helpers LegalShell and LegalSection.
import React from 'react';
import { WPP_T, WPP_FONTS, WPP_GUTTER } from '@/lib/wpp/tokens';

function LegalShell({
  title,
  updated,
  children
}) {
  const T = WPP_T,
    F = WPP_FONTS;
  const G = WPP_GUTTER;
  return /*#__PURE__*/React.createElement("main", {
    style: {
      fontFamily: F.sans,
      color: T.ink
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `clamp(72px, 10vw, 120px) ${G} clamp(48px, 7vw, 80px)`,
      borderBottom: `1px solid ${T.hair}`
    }
  }, /*#__PURE__*/React.createElement("h1", {
    style: {
      fontSize: 'clamp(36px, 6vw, 72px)',
      letterSpacing: -1.8,
      lineHeight: 1,
      margin: 0,
      fontWeight: 500
    }
  }, title, /*#__PURE__*/React.createElement("span", {
    style: {
      color: T.blue
    }
  }, ".")), updated && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      fontFamily: F.mono,
      fontSize: 11,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: T.mute
    }
  }, "Last updated · ", updated)), /*#__PURE__*/React.createElement("div", {
    style: {
      padding: `clamp(48px, 7vw, 80px) ${G} clamp(72px, 10vw, 120px)`,
      maxWidth: 820
    }
  }, children));
}
function LegalSection({
  heading,
  children
}) {
  const T = WPP_T;
  return /*#__PURE__*/React.createElement("section", {
    style: {
      marginBottom: 44
    }
  }, /*#__PURE__*/React.createElement("h2", {
    style: {
      fontSize: 'clamp(20px, 2.6vw, 26px)',
      letterSpacing: -0.5,
      fontWeight: 600,
      margin: '0 0 16px',
      color: T.ink
    }
  }, heading), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 16,
      lineHeight: 1.7,
      color: T.inkSoft
    }
  }, children));
}
export function Privacy() {
  const T = WPP_T;
  const blue = {
    color: T.blue,
    fontWeight: 600
  };
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Privacy policy",
    updated: "July 2026"
  }, /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Who we are"
  }, "White Peak Partners S.L. (trading as \"White Peak Partners\", \"we\", \"us\") is a strategic and financial advisory boutique. For the purposes of the EU GDPR, the data controller is White Peak Partners S.L., Alfambra 11–13, 3-2a, 08032 Barcelona, Spain (Tax ID B06995112), registered in the Barcelona Companies Registry. For any question about this policy or your personal data, contact us at", ' ', /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@whitepeakpartners.com",
    style: blue
  }, "hello@whitepeakpartners.com"), "."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "What we collect"
  }, "We collect only what you choose to give us. When you use our contact form we process your name, company, email address, role and the message you send. If you subscribe to our newsletter we process your email address. When you visit the site, standard technical data (such as IP address and browser type) may be processed by our hosting provider for security and delivery. We may also collect application data if you contact us about a role, and information from public professional sources."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "How we use it and our lawful basis"
  }, "We use your details to respond to your enquiry, to carry out or discuss a potential engagement, and — where you have opted in — to send you occasional updates. Our lawful bases under the EU GDPR are your", ' ', /*#__PURE__*/React.createElement("strong", null, "consent"), " (marketing updates), the taking of ", /*#__PURE__*/React.createElement("strong", null, "steps at your request before entering a contract"), " (enquiries), our ", /*#__PURE__*/React.createElement("strong", null, "legitimate interests"), " in operating and securing the site, and ", /*#__PURE__*/React.createElement("strong", null, "compliance with legal obligations"), " where applicable."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Sharing and retention"
  }, "We do not sell your personal data. We share it only where needed: at your request, to service a transaction you have asked for (which may include sharing within the White Peak Partners group), with service providers who assist us (for example email and form-handling providers) under appropriate agreements, with our professional advisers, and with authorities where the law requires. We keep your data only as long as necessary to respond, to maintain a record of the relationship, to allow for possible claims, and to meet legal or regulatory requirements."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "International transfers"
  }, "Where data is transferred outside the EEA — for example when a service provider or its equipment is based abroad — we put appropriate safeguards in place, usually the European Commission's Standard Contractual Clauses."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Your rights"
  }, "You have the right to access, correct, delete or port your data, to object to or restrict its processing, and to withdraw consent at any time. To exercise any of these, email", ' ', /*#__PURE__*/React.createElement("a", {
    href: "mailto:hello@whitepeakpartners.com",
    style: blue
  }, "hello@whitepeakpartners.com"), ". You may also lodge a complaint with the competent Data Protection Authority — in Spain, the Agencia Española de Protección de Datos (AEPD), or the supervisory authority in your country of residence or work."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Changes"
  }, "We may update this policy from time to time. The \"last updated\" date above reflects the current version."));
}
export function Terms() {
  const T = WPP_T;
  const blue = {
    color: T.blue,
    fontWeight: 600
  };
  return /*#__PURE__*/React.createElement(LegalShell, {
    title: "Terms of use & legal notice",
    updated: "July 2026"
  }, /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Legal notice (aviso legal)"
  }, "In accordance with Spanish Law 34/2002 on Information Society Services and Electronic Commerce (LSSI-CE), this website is operated by White Peak Partners S.L. (\"White Peak Partners\"), with registered office at Alfambra 11–13, 3-2a, 08032 Barcelona, Spain, Tax ID B06995112, registered in the Barcelona Companies Registry.", /*#__PURE__*/React.createElement("br", null), /*#__PURE__*/React.createElement("br", null), "Contact: ", /*#__PURE__*/React.createElement("a", {
    href: "mailto:info@whitepeakpartners.com",
    style: blue
  }, "info@whitepeakpartners.com"), "."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Use of the site"
  }, "This website and its content are provided for general information about our services. Using the site, you confirm you are at least 18 and agree not to misuse it, attempt to disrupt it, or use it for any unlawful purpose. We may update or amend these terms and the site's content at any time."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "No advice or offer"
  }, "Nothing on this website constitutes financial, legal, tax or investment advice, nor an offer or solicitation to enter into any transaction. Any engagement is governed solely by a separate signed agreement."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Intellectual property"
  }, "The text, design, logos and other materials on this site are owned by White Peak Partners or its providers under licence, and are protected by Spanish and international intellectual-property law. They may not be reproduced, distributed or otherwise exploited without our written consent. Other product, service and company names, and client names and logos, remain the property of their respective owners and are shown with permission."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Third-party links"
  }, "The site may link to external websites we do not control. We are not responsible for their content or privacy practices, and a link does not imply our endorsement. Anyone wishing to link to this site must obtain our written consent."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Limitation of liability"
  }, "The site is provided \"as is\". While we work to keep it accurate and available, we do not guarantee uninterrupted or error-free access. To the extent permitted by law, we exclude liability for any loss arising from use of, or reliance on, the site or its content."), /*#__PURE__*/React.createElement(LegalSection, {
    heading: "Governing law and jurisdiction"
  }, "These terms are governed by Spanish law. Any dispute arising from the use of this website shall be submitted to the Courts of Barcelona, Spain, without prejudice to any mandatory consumer or data-protection rights you may have under the law of your country of residence."));
}
