import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/seo/SEOHead';

const translations = {
  en: {
    title: 'Terms of Service',
    lastUpdated: 'Last Updated: January 2025',
    effectiveDate: 'Effective Date: January 1, 2025',
    
    // Introduction
    introduction: {
      title: '1. Introduction',
      content: `Welcome to AdmitAI Korea ("we," "our," or "us"). These Terms of Service ("Terms") govern your use of our AI-powered college admissions platform designed specifically for Korean students applying to U.S. universities. By accessing or using our services, you agree to be bound by these Terms.`
    },

    // Services
    services: {
      title: '2. Services',
      content: `AdmitAI Korea provides comprehensive college admissions assistance including:
      • AI-powered essay analysis and feedback
      • University Weather System for admissions trends
      • Cultural storytelling coaching
      • Personalized application roadmaps
      • Community features and peer support
      • Parent and mentor dashboards
      • Resource libraries and guides`,
      note: 'We reserve the right to modify, suspend, or discontinue any part of our services at any time.'
    },

    // User Accounts
    accounts: {
      title: '3. User Accounts',
      content: `To access certain features, you must create an account. You agree to:
      • Provide accurate and complete information
      • Maintain the security of your account credentials
      • Notify us immediately of any unauthorized use
      • Accept responsibility for all activities under your account
      • Be at least 13 years old (or have parental consent)`,
      ageNote: 'Users under 18 must have parental or guardian consent to use our services.'
    },

    // Acceptable Use
    acceptableUse: {
      title: '4. Acceptable Use',
      content: `You agree not to:
      • Use our services for any illegal or unauthorized purpose
      • Submit false, misleading, or plagiarized content
      • Attempt to gain unauthorized access to our systems
      • Interfere with or disrupt our services
      • Use our services to harass, abuse, or harm others
      • Violate any applicable laws or regulations`,
      academicIntegrity: 'We promote academic integrity and expect users to submit original work.'
    },

    // Intellectual Property
    intellectualProperty: {
      title: '5. Intellectual Property',
      content: `Our platform, including all content, features, and functionality, is owned by AdmitAI Korea and protected by copyright, trademark, and other intellectual property laws. You retain ownership of content you submit, but grant us a license to use it for service provision and improvement.`,
      userContent: 'You grant us a non-exclusive, worldwide, royalty-free license to use, modify, and display your content for the purpose of providing our services.'
    },

    // Privacy and Data
    privacy: {
      title: '6. Privacy and Data Protection',
      content: `Your privacy is important to us. Our collection and use of personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference. We comply with applicable data protection laws including GDPR and Korean privacy regulations.`,
      dataRetention: 'We retain your data only as long as necessary to provide our services and comply with legal obligations.'
    },

    // Payment Terms
    payment: {
      title: '7. Payment Terms',
      content: `Some features require payment. By purchasing a subscription:
      • You agree to pay all fees in advance
      • Subscriptions automatically renew unless cancelled
      • Refunds are provided according to our refund policy
      • We may change pricing with 30 days notice
      • All fees are non-refundable except as required by law`,
      currency: 'All fees are charged in USD unless otherwise specified.'
    },

    // Disclaimers
    disclaimers: {
      title: '8. Disclaimers',
      content: `Our services are provided "as is" without warranties of any kind. We do not guarantee:
      • Admission to any specific university
      • Specific admission outcomes
      • Uninterrupted service availability
      • Accuracy of all information provided
      • Compatibility with all devices or browsers`,
      aiDisclaimer: 'AI-generated content and recommendations are for guidance only and should not replace professional advice.'
    },

    // Limitation of Liability
    liability: {
      title: '9. Limitation of Liability',
      content: `To the maximum extent permitted by law, AdmitAI Korea shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, or use, arising from your use of our services.`,
      maxLiability: 'Our total liability shall not exceed the amount you paid for our services in the 12 months preceding the claim.'
    },

    // Termination
    termination: {
      title: '10. Termination',
      content: `Either party may terminate these Terms at any time. Upon termination:
      • Your right to use our services ceases immediately
      • We may delete your account and data
      • Outstanding payments remain due
      • Certain provisions survive termination`,
      survival: 'Sections regarding intellectual property, privacy, disclaimers, and limitation of liability survive termination.'
    },

    // Governing Law
    governingLaw: {
      title: '11. Governing Law',
      content: `These Terms are governed by the laws of South Korea. Any disputes shall be resolved in the courts of Seoul, South Korea, unless otherwise required by applicable law.`,
      jurisdiction: 'You agree to submit to the personal jurisdiction of these courts.'
    },

    // Changes to Terms
    changes: {
      title: '12. Changes to Terms',
      content: `We may update these Terms from time to time. We will notify you of material changes via email or through our platform. Your continued use of our services after changes become effective constitutes acceptance of the new Terms.`,
      notification: 'We will provide at least 30 days notice for material changes affecting your rights.'
    },

    // Contact Information
    contact: {
      title: '13. Contact Information',
      content: `If you have questions about these Terms, please contact us:
      • Email: legal@admitai.korea
      • Address: [Business Address]
      • Phone: [Business Phone]`,
      support: 'For technical support, please use our support channels within the platform.'
    }
  },
  ko: {
    title: '이용약관',
    lastUpdated: '최종 업데이트: 2025년 1월',
    effectiveDate: '시행일: 2025년 1월 1일',
    
    introduction: {
      title: '1. 소개',
      content: `AdmitAI Korea("우리," "당사," 또는 "저희")에 오신 것을 환영합니다. 본 이용약관("약관")은 미국 대학 지원을 위한 한국 학생들을 위해 특별히 설계된 AI 기반 대학 입학 플랫폼 사용을 규정합니다. 당사의 서비스를 이용함으로써 귀하는 본 약관에 동의하게 됩니다.`
    },

    services: {
      title: '2. 서비스',
      content: `AdmitAI Korea는 다음과 같은 포괄적인 대학 입학 지원을 제공합니다:
      • AI 기반 에세이 분석 및 피드백
      • 입학 동향을 위한 대학 날씨 시스템
      • 문화적 스토리텔링 코칭
      • 맞춤형 지원 로드맵
      • 커뮤니티 기능 및 동료 지원
      • 학부모 및 멘토 대시보드
      • 리소스 라이브러리 및 가이드`,
      note: '당사는 언제든지 서비스의 일부를 수정, 중단 또는 중단할 권리를 보유합니다.'
    },

    accounts: {
      title: '3. 사용자 계정',
      content: `특정 기능에 접근하려면 계정을 생성해야 합니다. 귀하는 다음에 동의합니다:
      • 정확하고 완전한 정보 제공
      • 계정 자격 증명의 보안 유지
      • 무단 사용 시 즉시 당사에 통지
      • 계정 하의 모든 활동에 대한 책임 수용
      • 최소 13세 이상 (또는 부모 동의 필요)`,
      ageNote: '18세 미만 사용자는 서비스 이용을 위해 부모 또는 보호자의 동의가 필요합니다.'
    },

    acceptableUse: {
      title: '4. 허용되는 사용',
      content: `귀하는 다음을 하지 않기로 동의합니다:
      • 불법적이거나 무단 목적으로 서비스 사용
      • 허위, 오해의 소지가 있거나 표절된 콘텐츠 제출
      • 당사 시스템에 무단 접근 시도
      • 서비스 방해 또는 중단
      • 타인을 괴롭히거나 학대하거나 해치는 목적으로 서비스 사용
      • 관련 법률 또는 규정 위반`,
      academicIntegrity: '당사는 학문적 정직성을 촉진하며 사용자가 원작을 제출할 것을 기대합니다.'
    },

    intellectualProperty: {
      title: '5. 지적재산권',
      content: `당사의 플랫폼, 모든 콘텐츠, 기능 및 기능성은 AdmitAI Korea가 소유하며 저작권, 상표권 및 기타 지적재산권 법률에 의해 보호됩니다. 귀하는 제출한 콘텐츠의 소유권을 유지하지만 서비스 제공 및 개선을 위해 당사에 라이선스를 부여합니다.`,
      userContent: '귀하는 서비스 제공 목적으로 콘텐츠를 사용, 수정 및 표시할 수 있는 비독점적, 전 세계적, 로열티 없는 라이선스를 당사에 부여합니다.'
    },

    privacy: {
      title: '6. 개인정보 및 데이터 보호',
      content: `귀하의 개인정보는 당사에게 중요합니다. 개인정보의 수집 및 사용은 본 약관에 참조로 포함된 개인정보처리방침에 의해 규정됩니다. 당사는 GDPR 및 한국 개인정보보호법을 포함한 관련 데이터 보호 법률을 준수합니다.`,
      dataRetention: '당사는 서비스 제공 및 법적 의무 준수를 위해 필요한 기간 동안만 귀하의 데이터를 보관합니다.'
    },

    payment: {
      title: '7. 결제 조건',
      content: `일부 기능은 결제가 필요합니다. 구독을 구매함으로써:
      • 사전에 모든 수수료를 지불하기로 동의
      • 구독은 취소하지 않는 한 자동 갱신
      • 환불은 당사의 환불 정책에 따라 제공
      • 30일 전 고지 후 가격 변경 가능
      • 모든 수수료는 법에서 요구하는 경우를 제외하고 환불 불가`,
      currency: '모든 수수료는 달리 명시되지 않는 한 USD로 청구됩니다.'
    },

    disclaimers: {
      title: '8. 면책조항',
      content: `당사의 서비스는 "있는 그대로" 제공되며 어떠한 종류의 보증도 없습니다. 당사는 다음을 보장하지 않습니다:
      • 특정 대학 입학
      • 특정 입학 결과
      • 중단 없는 서비스 가용성
      • 제공된 모든 정보의 정확성
      • 모든 기기 또는 브라우저와의 호환성`,
      aiDisclaimer: 'AI 생성 콘텐츠 및 권장사항은 참고용이며 전문가 조언을 대체해서는 안 됩니다.'
    },

    liability: {
      title: '9. 책임의 제한',
      content: `법에서 허용하는 최대 범위까지, AdmitAI Korea는 서비스 사용으로 인한 간접적, 부수적, 특별, 결과적 또는 징벌적 손해, 이익, 데이터 또는 사용 손실을 포함하되 이에 국한되지 않는 손해에 대해 책임지지 않습니다.`,
      maxLiability: '당사의 총 책임은 청구 전 12개월 동안 귀하가 서비스에 지불한 금액을 초과하지 않습니다.'
    },

    termination: {
      title: '10. 해지',
      content: `어느 당사자든 언제든지 본 약관을 해지할 수 있습니다. 해지 시:
      • 서비스 사용 권리가 즉시 중단
      • 계정 및 데이터 삭제 가능
      • 미지급 결제는 여전히 지불 의무
      • 특정 조항은 해지 후에도 존속`,
      survival: '지적재산권, 개인정보, 면책조항 및 책임 제한에 관한 섹션은 해지 후에도 존속합니다.'
    },

    governingLaw: {
      title: '11. 준거법',
      content: `본 약관은 대한민국 법률에 의해 규정됩니다. 모든 분쟁은 관련 법률에서 달리 요구하지 않는 한 대한민국 서울의 법원에서 해결됩니다.`,
      jurisdiction: '귀하는 이 법원들의 개인 관할권에 동의합니다.'
    },

    changes: {
      title: '12. 약관 변경',
      content: `당사는 때때로 본 약관을 업데이트할 수 있습니다. 당사는 이메일이나 플랫폼을 통해 중요한 변경사항을 알려드릴 것입니다. 변경사항이 효력이 발생한 후 서비스 계속 사용은 새로운 약관 수락을 구성합니다.`,
      notification: '당사는 귀하의 권리에 영향을 미치는 중요한 변경사항에 대해 최소 30일 전에 통지합니다.'
    },

    contact: {
      title: '13. 연락처 정보',
      content: `본 약관에 대한 질문이 있으시면 다음으로 연락해 주세요:
      • 이메일: legal@admitai.korea
      • 주소: [사업장 주소]
      • 전화: [사업장 전화번호]`,
      support: '기술 지원을 위해서는 플랫폼 내 지원 채널을 사용해 주세요.'
    }
  }
};

type Lang = keyof typeof translations;

const TermsOfServicePage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[(language as Lang)] || translations.en;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead
        title={`${t.title} | AdmitAI Korea`}
        description={language === 'ko' ? 'AdmitAI Korea 이용약관' : 'AdmitAI Korea Terms of Service'}
        canonical="https://admitai.kr/terms"
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

            {/* Services */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.services.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.services.content}</p>
                <p className="text-sm text-gray-600 italic">{t.services.note}</p>
              </div>
            </section>

            {/* User Accounts */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.accounts.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.accounts.content}</p>
                <p className="text-sm text-gray-600 italic">{t.accounts.ageNote}</p>
              </div>
            </section>

            {/* Acceptable Use */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.acceptableUse.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.acceptableUse.content}</p>
                <p className="text-sm text-gray-600 italic">{t.acceptableUse.academicIntegrity}</p>
              </div>
            </section>

            {/* Intellectual Property */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.intellectualProperty.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.intellectualProperty.content}</p>
                <p className="text-sm text-gray-600 italic">{t.intellectualProperty.userContent}</p>
              </div>
            </section>

            {/* Privacy and Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.privacy.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.privacy.content}</p>
                <p className="text-sm text-gray-600 italic">{t.privacy.dataRetention}</p>
              </div>
            </section>

            {/* Payment Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.payment.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.payment.content}</p>
                <p className="text-sm text-gray-600 italic">{t.payment.currency}</p>
              </div>
            </section>

            {/* Disclaimers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.disclaimers.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.disclaimers.content}</p>
                <p className="text-sm text-gray-600 italic">{t.disclaimers.aiDisclaimer}</p>
              </div>
            </section>

            {/* Limitation of Liability */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.liability.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.liability.content}</p>
                <p className="text-sm text-gray-600 italic">{t.liability.maxLiability}</p>
              </div>
            </section>

            {/* Termination */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.termination.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.termination.content}</p>
                <p className="text-sm text-gray-600 italic">{t.termination.survival}</p>
              </div>
            </section>

            {/* Governing Law */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.governingLaw.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.governingLaw.content}</p>
                <p className="text-sm text-gray-600 italic">{t.governingLaw.jurisdiction}</p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.changes.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.changes.content}</p>
                <p className="text-sm text-gray-600 italic">{t.changes.notification}</p>
              </div>
            </section>

            {/* Contact Information */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.contact.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.contact.content}</p>
                <p className="text-sm text-gray-600 italic">{t.contact.support}</p>
              </div>
            </section>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {language === 'ko' 
              ? '본 약관은 법적 구속력이 있는 문서입니다. 서비스 이용 전 전체 내용을 주의 깊게 읽어주세요.'
              : 'These terms constitute a legally binding document. Please read the entire content carefully before using our services.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default TermsOfServicePage; 