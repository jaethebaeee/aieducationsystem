import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/seo/SEOHead';

const translations = {
  en: {
    title: 'Privacy Policy',
    lastUpdated: 'Last Updated: January 2025',
    effectiveDate: 'Effective Date: January 1, 2025',
    
    // Introduction
    introduction: {
      title: '1. Introduction',
      content: `AdmitAI Korea ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our AI-powered college admissions platform. By using our services, you consent to the data practices described in this policy.`
    },

    // Information We Collect
    informationCollection: {
      title: '2. Information We Collect',
      personalInfo: {
        subtitle: 'Personal Information',
        content: `We collect information you provide directly to us:
        • Name, email address, and contact information
        • Academic background and educational history
        • Essay content and application materials
        • University preferences and goals
        • Payment and billing information
        • Profile information and preferences`
      },
      usageData: {
        subtitle: 'Usage Data',
        content: `We automatically collect certain information when you use our services:
        • Log data (IP address, browser type, access times)
        • Device information and identifiers
        • Usage patterns and interactions
        • Performance data and error reports
        • Cookies and similar technologies`
      },
      thirdParty: {
        subtitle: 'Third-Party Information',
        content: `We may receive information from:
        • Educational institutions and partners
        • Payment processors and service providers
        • Social media platforms (if you connect accounts)
        • Analytics and marketing partners`
      }
    },

    // How We Use Information
    informationUse: {
      title: '3. How We Use Your Information',
      content: `We use your information to:
      • Provide and improve our services
      • Personalize your experience and recommendations
      • Process payments and manage subscriptions
      • Communicate with you about our services
      • Analyze usage patterns and optimize performance
      • Ensure security and prevent fraud
      • Comply with legal obligations
      • Conduct research and development`,
      aiTraining: 'We may use anonymized data to train and improve our AI models, ensuring no personal information is identifiable.'
    },

    // Information Sharing
    informationSharing: {
      title: '4. Information Sharing and Disclosure',
      content: `We do not sell, trade, or rent your personal information. We may share your information in the following circumstances:
      • With your explicit consent
      • With service providers who assist in our operations
      • To comply with legal requirements or court orders
      • To protect our rights, property, or safety
      • In connection with a business transfer or merger
      • With educational partners (with your permission)`,
      anonymized: 'We may share anonymized, aggregated data for research and statistical purposes.'
    },

    // Data Security
    dataSecurity: {
      title: '5. Data Security',
      content: `We implement appropriate technical and organizational measures to protect your information:
      • Encryption of data in transit and at rest
      • Regular security assessments and updates
      • Access controls and authentication measures
      • Secure data centers and infrastructure
      • Employee training on data protection
      • Incident response and breach notification procedures`,
      noGuarantee: 'While we strive to protect your information, no method of transmission over the internet is 100% secure.'
    },

    // Data Retention
    dataRetention: {
      title: '6. Data Retention',
      content: `We retain your information for as long as necessary to:
      • Provide our services to you
      • Comply with legal obligations
      • Resolve disputes and enforce agreements
      • Maintain business records`,
      retentionPeriods: `Specific retention periods:
      • Account data: Until account deletion or 7 years after last activity
      • Essay content: Until account deletion or 3 years after last access
      • Payment information: As required by financial regulations
      • Usage logs: 2 years for security and analytics purposes`
    },

    // Your Rights
    yourRights: {
      title: '7. Your Rights and Choices',
      content: `Depending on your location, you may have the following rights:
      • Access and receive a copy of your personal information
      • Correct inaccurate or incomplete information
      • Delete your personal information
      • Restrict or object to processing
      • Data portability
      • Withdraw consent
      • Lodge a complaint with supervisory authorities`,
      exerciseRights: 'To exercise these rights, contact us at privacy@admitai.korea. We will respond within 30 days.'
    },

    // Cookies and Tracking
    cookies: {
      title: '8. Cookies and Tracking Technologies',
      content: `We use cookies and similar technologies to:
      • Remember your preferences and settings
      • Analyze website traffic and usage patterns
      • Provide personalized content and recommendations
      • Ensure security and prevent fraud
      • Improve our services and user experience`,
      cookieTypes: `Types of cookies we use:
      • Essential cookies (required for functionality)
      • Performance cookies (analytics and optimization)
      • Functional cookies (preferences and personalization)
      • Marketing cookies (advertising and targeting)`,
      cookieControl: 'You can control cookie settings through your browser preferences or our cookie consent tool.'
    },

    // International Transfers
    internationalTransfers: {
      title: '9. International Data Transfers',
      content: `Your information may be transferred to and processed in countries other than your own. We ensure appropriate safeguards are in place:
      • Standard contractual clauses
      • Adequacy decisions
      • Binding corporate rules
      • Other approved transfer mechanisms`,
      locations: 'Our primary data processing locations include South Korea, the United States, and the European Union.'
    },

    // Children's Privacy
    childrenPrivacy: {
      title: '10. Children\'s Privacy',
      content: `Our services are not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately.`,
      parentalConsent: 'For users between 13 and 18, we require parental or guardian consent for data processing.'
    },

    // Third-Party Services
    thirdPartyServices: {
      title: '11. Third-Party Services and Links',
      content: `Our services may contain links to third-party websites or integrate with third-party services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies before providing any information.`,
      integrations: 'We integrate with services such as payment processors, analytics providers, and educational platforms.'
    },

    // Changes to Policy
    policyChanges: {
      title: '12. Changes to This Privacy Policy',
      content: `We may update this Privacy Policy from time to time. We will notify you of material changes by:
      • Posting the updated policy on our website
      • Sending email notifications
      • Displaying in-app notifications
      • Updating the "Last Updated" date`,
      continuedUse: 'Your continued use of our services after changes become effective constitutes acceptance of the updated policy.'
    },

    // Contact Information
    contact: {
      title: '13. Contact Us',
      content: `If you have questions about this Privacy Policy or our data practices, please contact us:
      • Email: privacy@admitai.korea
      • Address: [Business Address]
      • Phone: [Business Phone]
      • Data Protection Officer: dpo@admitai.korea`,
      complaints: 'You also have the right to lodge a complaint with your local data protection authority.'
    }
  },
  ko: {
    title: '개인정보처리방침',
    lastUpdated: '최종 업데이트: 2025년 1월',
    effectiveDate: '시행일: 2025년 1월 1일',
    
    introduction: {
      title: '1. 소개',
      content: `AdmitAI Korea("우리," "당사," 또는 "저희")는 귀하의 개인정보 보호를 위해 최선을 다하고 있습니다. 본 개인정보처리방침은 AI 기반 대학 입학 플랫폼을 이용할 때 당사가 정보를 수집, 사용, 공개 및 보호하는 방법을 설명합니다. 당사의 서비스를 이용함으로써 귀하는 본 방침에 설명된 데이터 처리에 동의하게 됩니다.`
    },

    informationCollection: {
      title: '2. 수집하는 정보',
      personalInfo: {
        subtitle: '개인정보',
        content: `당사는 귀하가 직접 제공하는 정보를 수집합니다:
        • 이름, 이메일 주소 및 연락처 정보
        • 학업 배경 및 교육 이력
        • 에세이 내용 및 지원 자료
        • 대학 선호도 및 목표
        • 결제 및 청구 정보
        • 프로필 정보 및 선호도`
      },
      usageData: {
        subtitle: '이용 데이터',
        content: `당사는 서비스 이용 시 특정 정보를 자동으로 수집합니다:
        • 로그 데이터 (IP 주소, 브라우저 유형, 접속 시간)
        • 기기 정보 및 식별자
        • 이용 패턴 및 상호작용
        • 성능 데이터 및 오류 보고서
        • 쿠키 및 유사 기술`
      },
      thirdParty: {
        subtitle: '제3자 정보',
        content: `당사는 다음으로부터 정보를 받을 수 있습니다:
        • 교육 기관 및 파트너
        • 결제 처리업체 및 서비스 제공업체
        • 소셜 미디어 플랫폼 (계정 연결 시)
        • 분석 및 마케팅 파트너`
      }
    },

    informationUse: {
      title: '3. 정보 사용 방법',
      content: `당사는 귀하의 정보를 다음 목적으로 사용합니다:
      • 서비스 제공 및 개선
      • 개인화된 경험 및 권장사항 제공
      • 결제 처리 및 구독 관리
      • 서비스에 대한 커뮤니케이션
      • 이용 패턴 분석 및 성능 최적화
      • 보안 보장 및 사기 방지
      • 법적 의무 준수
      • 연구 및 개발 수행`,
      aiTraining: '당사는 익명화된 데이터를 사용하여 AI 모델을 훈련하고 개선할 수 있으며, 개인정보가 식별되지 않도록 보장합니다.'
    },

    informationSharing: {
      title: '4. 정보 공유 및 공개',
      content: `당사는 귀하의 개인정보를 판매, 거래 또는 임대하지 않습니다. 당사는 다음 상황에서 정보를 공유할 수 있습니다:
      • 귀하의 명시적 동의 시
      • 운영을 지원하는 서비스 제공업체와
      • 법적 요구사항 또는 법원 명령 준수를 위해
      • 당사의 권리, 재산 또는 안전을 보호하기 위해
      • 사업 이전 또는 합병과 관련하여
      • 교육 파트너와 (귀하의 허가 시)`,
      anonymized: '당사는 연구 및 통계 목적으로 익명화된 집계 데이터를 공유할 수 있습니다.'
    },

    dataSecurity: {
      title: '5. 데이터 보안',
      content: `당사는 귀하의 정보를 보호하기 위해 적절한 기술적 및 조직적 조치를 구현합니다:
      • 전송 중 및 저장 중 데이터 암호화
      • 정기적인 보안 평가 및 업데이트
      • 접근 제어 및 인증 조치
      • 보안 데이터 센터 및 인프라
      • 데이터 보호에 대한 직원 교육
      • 사고 대응 및 침해 통지 절차`,
      noGuarantee: '당사는 귀하의 정보를 보호하기 위해 노력하지만, 인터넷을 통한 전송 방법은 100% 안전하지 않습니다.'
    },

    dataRetention: {
      title: '6. 데이터 보관',
      content: `당사는 다음 목적으로 필요한 기간 동안 귀하의 정보를 보관합니다:
      • 귀하에게 서비스 제공
      • 법적 의무 준수
      • 분쟁 해결 및 계약 이행
      • 사업 기록 유지`,
      retentionPeriods: `특정 보관 기간:
      • 계정 데이터: 계정 삭제 또는 마지막 활동 후 7년까지
      • 에세이 내용: 계정 삭제 또는 마지막 접근 후 3년까지
      • 결제 정보: 금융 규정에 따라 요구되는 기간
      • 이용 로그: 보안 및 분석 목적으로 2년`
    },

    yourRights: {
      title: '7. 귀하의 권리 및 선택',
      content: `귀하의 위치에 따라 다음 권리를 가질 수 있습니다:
      • 개인정보에 접근하고 사본을 받을 권리
      • 부정확하거나 불완전한 정보를 수정할 권리
      • 개인정보를 삭제할 권리
      • 처리 제한 또는 이의 제기 권리
      • 데이터 이식성
      • 동의 철회 권리
      • 감독 기관에 불만을 제기할 권리`,
      exerciseRights: '이러한 권리를 행사하려면 privacy@admitai.korea로 연락해 주세요. 당사는 30일 내에 응답할 것입니다.'
    },

    cookies: {
      title: '8. 쿠키 및 추적 기술',
      content: `당사는 쿠키 및 유사 기술을 사용하여:
      • 귀하의 선호도 및 설정을 기억
      • 웹사이트 트래픽 및 이용 패턴 분석
      • 개인화된 콘텐츠 및 권장사항 제공
      • 보안 보장 및 사기 방지
      • 서비스 및 사용자 경험 개선`,
      cookieTypes: `당사가 사용하는 쿠키 유형:
      • 필수 쿠키 (기능에 필요)
      • 성능 쿠키 (분석 및 최적화)
      • 기능 쿠키 (선호도 및 개인화)
      • 마케팅 쿠키 (광고 및 타겟팅)`,
      cookieControl: '브라우저 설정이나 당사의 쿠키 동의 도구를 통해 쿠키 설정을 제어할 수 있습니다.'
    },

    internationalTransfers: {
      title: '9. 국제 데이터 이전',
      content: `귀하의 정보는 귀하의 국가 외의 국가로 이전되고 처리될 수 있습니다. 당사는 적절한 보호 조치가 마련되어 있음을 보장합니다:
      • 표준 계약 조항
      • 적정성 결정
      • 구속력 있는 기업 규칙
      • 기타 승인된 이전 메커니즘`,
      locations: '당사의 주요 데이터 처리 위치는 대한민국, 미국 및 유럽연합을 포함합니다.'
    },

    childrenPrivacy: {
      title: '10. 아동 개인정보',
      content: `당사의 서비스는 13세 미만 아동을 대상으로 하지 않습니다. 당사는 13세 미만 아동으로부터 고의로 개인정보를 수집하지 않습니다. 부모 또는 보호자로서 귀하의 자녀가 당사에 개인정보를 제공했다고 믿으시면 즉시 연락해 주세요.`,
      parentalConsent: '13세에서 18세 사이의 사용자의 경우, 데이터 처리에 대한 부모 또는 보호자의 동의가 필요합니다.'
    },

    thirdPartyServices: {
      title: '11. 제3자 서비스 및 링크',
      content: `당사의 서비스에는 제3자 웹사이트에 대한 링크가 포함되거나 제3자 서비스와 통합될 수 있습니다. 당사는 이러한 제3자의 개인정보 처리 관행에 대해 책임지지 않습니다. 정보를 제공하기 전에 해당 개인정보처리방침을 검토하시기 바랍니다.`,
      integrations: '당사는 결제 처리업체, 분석 제공업체 및 교육 플랫폼과 같은 서비스와 통합됩니다.'
    },

    policyChanges: {
      title: '12. 개인정보처리방침 변경',
      content: `당사는 때때로 본 개인정보처리방침을 업데이트할 수 있습니다. 당사는 중요한 변경사항을 다음 방법으로 알려드릴 것입니다:
      • 웹사이트에 업데이트된 방침 게시
      • 이메일 알림 발송
      • 앱 내 알림 표시
      • "최종 업데이트" 날짜 업데이트`,
      continuedUse: '변경사항이 효력이 발생한 후 서비스 계속 사용은 업데이트된 방침 수락을 구성합니다.'
    },

    contact: {
      title: '13. 연락처',
      content: `본 개인정보처리방침이나 당사의 데이터 처리 관행에 대한 질문이 있으시면 다음으로 연락해 주세요:
      • 이메일: privacy@admitai.korea
      • 주소: [사업장 주소]
      • 전화: [사업장 전화번호]
      • 개인정보보호책임자: dpo@admitai.korea`,
      complaints: '귀하는 또한 지역 개인정보보호 기관에 불만을 제기할 권리가 있습니다.'
    }
  }
};

type Lang = keyof typeof translations;

const PrivacyPolicyPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[(language as Lang)] || translations.en;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead
        title={`${t.title} | AdmitAI Korea`}
        description={language === 'ko' ? 'AdmitAI Korea 개인정보처리방침' : 'AdmitAI Korea Privacy Policy'}
        canonical="https://admitai.kr/privacy"
        language={language as Lang}
      />
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8 mb-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{t.title}</h1>
            <div className="flex flex-col sm:flex-row justify-center items-center space-y-2 sm:space-y-0 sm:space-x-8 text-sm text-gray-600">
              <span>{t.lastUpdated}</span>
              <span className="hidden sm:inline">•</span>
              <span>{t.effectiveDate}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="prose prose-lg max-w-none">
            {/* Introduction */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.introduction.title}</h2>
              <p className="text-gray-700 leading-relaxed">{t.introduction.content}</p>
            </section>

            {/* Information Collection */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.informationCollection.title}</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.informationCollection.personalInfo.subtitle}</h3>
                <p className="text-gray-700 leading-relaxed">{t.informationCollection.personalInfo.content}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.informationCollection.usageData.subtitle}</h3>
                <p className="text-gray-700 leading-relaxed">{t.informationCollection.usageData.content}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.informationCollection.thirdParty.subtitle}</h3>
                <p className="text-gray-700 leading-relaxed">{t.informationCollection.thirdParty.content}</p>
              </div>
            </section>

            {/* Information Use */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.informationUse.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.informationUse.content}</p>
                <p className="text-sm text-gray-600 italic">{t.informationUse.aiTraining}</p>
              </div>
            </section>

            {/* Information Sharing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.informationSharing.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.informationSharing.content}</p>
                <p className="text-sm text-gray-600 italic">{t.informationSharing.anonymized}</p>
              </div>
            </section>

            {/* Data Security */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.dataSecurity.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.dataSecurity.content}</p>
                <p className="text-sm text-gray-600 italic">{t.dataSecurity.noGuarantee}</p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.dataRetention.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.dataRetention.content}</p>
                <p className="text-sm text-gray-600 italic">{t.dataRetention.retentionPeriods}</p>
              </div>
            </section>

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.yourRights.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.yourRights.content}</p>
                <p className="text-sm text-gray-600 italic">{t.yourRights.exerciseRights}</p>
              </div>
            </section>

            {/* Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.cookies.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.cookies.content}</p>
                <p className="mb-4 text-sm text-gray-600 italic">{t.cookies.cookieTypes}</p>
                <p className="text-sm text-gray-600 italic">{t.cookies.cookieControl}</p>
              </div>
            </section>

            {/* International Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.internationalTransfers.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.internationalTransfers.content}</p>
                <p className="text-sm text-gray-600 italic">{t.internationalTransfers.locations}</p>
              </div>
            </section>

            {/* Children's Privacy */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.childrenPrivacy.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.childrenPrivacy.content}</p>
                <p className="text-sm text-gray-600 italic">{t.childrenPrivacy.parentalConsent}</p>
              </div>
            </section>

            {/* Third-Party Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.thirdPartyServices.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.thirdPartyServices.content}</p>
                <p className="text-sm text-gray-600 italic">{t.thirdPartyServices.integrations}</p>
              </div>
            </section>

            {/* Policy Changes */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.policyChanges.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.policyChanges.content}</p>
                <p className="text-sm text-gray-600 italic">{t.policyChanges.continuedUse}</p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.contact.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.contact.content}</p>
                <p className="text-sm text-gray-600 italic">{t.contact.complaints}</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {language === 'ko' 
              ? '본 개인정보처리방침은 GDPR, 한국 개인정보보호법 및 기타 관련 법률을 준수합니다.'
              : 'This Privacy Policy complies with GDPR, Korean privacy laws, and other applicable regulations.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyPage; 