import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/seo/SEOHead';

const translations = {
  en: {
    title: 'Data Protection & Privacy Rights',
    lastUpdated: 'Last Updated: January 2025',
    effectiveDate: 'Effective Date: January 1, 2025',
    
    // Introduction
    introduction: {
      title: '1. Your Data Protection Rights',
      content: `At AdmitAI Korea, we are committed to protecting your personal data and ensuring you have full control over your information. This page explains your rights under various data protection laws, including GDPR, Korean Personal Information Protection Act (PIPA), and other applicable regulations.`
    },

    // Your Rights
    yourRights: {
      title: '2. Your Rights Under Data Protection Laws',
      rights: [
        {
          name: 'Right to Access',
          description: 'You have the right to request a copy of all personal data we hold about you.',
          process: 'Submit a request through our privacy portal or email privacy@admitai.korea'
        },
        {
          name: 'Right to Rectification',
          description: 'You can request correction of inaccurate or incomplete personal data.',
          process: 'Update your profile directly or contact us for assistance'
        },
        {
          name: 'Right to Erasure',
          description: 'You can request deletion of your personal data in certain circumstances.',
          process: 'Submit a deletion request through your account settings or contact us'
        },
        {
          name: 'Right to Restrict Processing',
          description: 'You can limit how we use your personal data in certain situations.',
          process: 'Contact us to discuss processing restrictions'
        },
        {
          name: 'Right to Data Portability',
          description: 'You can request a copy of your data in a machine-readable format.',
          process: 'Request data export through your account settings'
        },
        {
          name: 'Right to Object',
          description: 'You can object to certain types of processing, such as marketing.',
          process: 'Update your preferences in account settings or contact us'
        },
        {
          name: 'Right to Withdraw Consent',
          description: 'You can withdraw consent for data processing at any time.',
          process: 'Update consent preferences in your account settings'
        },
        {
          name: 'Right to Lodge a Complaint',
          description: 'You can file a complaint with supervisory authorities.',
          process: 'Contact your local data protection authority'
        }
      ]
    },

    // Data Processing
    dataProcessing: {
      title: '3. How We Process Your Data',
      legalBasis: {
        subtitle: 'Legal Basis for Processing',
        content: `We process your personal data based on the following legal grounds:
        • Consent: When you explicitly agree to data processing
        • Contract: To provide our services and fulfill agreements
        • Legitimate Interest: To improve our services and prevent fraud
        • Legal Obligation: To comply with applicable laws and regulations`,
        examples: 'Examples include account creation (consent), service delivery (contract), analytics (legitimate interest), and tax reporting (legal obligation).'
      },
      purposes: {
        subtitle: 'Processing Purposes',
        content: `We process your data for the following purposes:
        • Providing and improving our AI-powered services
        • Personalizing your experience and recommendations
        • Processing payments and managing subscriptions
        • Communicating with you about our services
        • Ensuring security and preventing fraud
        • Complying with legal obligations
        • Conducting research and development`,
        aiTraining: 'We may use anonymized data for AI model training, ensuring no personal information is identifiable.'
      }
    },

    // Data Transfers
    dataTransfers: {
      title: '4. International Data Transfers',
      content: `Your personal data may be transferred to and processed in countries outside your residence. We ensure appropriate safeguards are in place:
      • Standard Contractual Clauses (SCCs) for EU transfers
      • Adequacy decisions where applicable
      • Binding Corporate Rules (BCRs) for internal transfers
      • Other approved transfer mechanisms`,
      locations: 'Our primary data processing locations include South Korea, the United States, and the European Union.',
      safeguards: 'We implement technical and organizational measures to protect your data during international transfers.'
    },

    // Data Retention
    dataRetention: {
      title: '5. Data Retention and Deletion',
      content: `We retain your personal data only for as long as necessary to fulfill the purposes outlined in our Privacy Policy. Specific retention periods include:
      • Account data: 7 years after last activity or until deletion request
      • Essay content: 3 years after last access or until deletion request
      • Payment information: As required by financial regulations
      • Usage logs: 2 years for security and analytics
      • Marketing data: Until consent withdrawal or 2 years after last interaction`,
      deletion: 'You can request immediate deletion of your data through your account settings or by contacting us directly.',
      anonymization: 'After retention periods expire, we may anonymize data for research purposes.'
    },

    // Security Measures
    securityMeasures: {
      title: '6. Security Measures and Data Protection',
      content: `We implement comprehensive security measures to protect your personal data:
      • Encryption of data in transit (TLS/SSL) and at rest (AES-256)
      • Regular security assessments and penetration testing
      • Access controls and multi-factor authentication
      • Secure data centers with physical and environmental controls
      • Employee training on data protection and security
      • Incident response and breach notification procedures
      • Regular backups and disaster recovery planning`,
      monitoring: 'We continuously monitor our systems for security threats and vulnerabilities.',
      compliance: 'Our security measures comply with industry standards and regulatory requirements.'
    },

    // Third-Party Processors
    thirdParty: {
      title: '7. Third-Party Data Processors',
      content: `We work with trusted third-party service providers who process your data on our behalf:
      • Cloud infrastructure providers (AWS, Google Cloud)
      • Payment processors (Stripe, PayPal)
      • Analytics services (Google Analytics, Mixpanel)
      • Customer support tools (Zendesk, Intercom)
      • Email and communication services (SendGrid, Twilio)`,
      agreements: 'All third-party processors are bound by data processing agreements that require them to protect your data.',
      assessment: 'We regularly assess our third-party processors to ensure they meet our security and privacy standards.'
    },

    // Automated Decision Making
    automatedDecisions: {
      title: '8. Automated Decision Making and Profiling',
      content: `Our AI-powered services may involve automated decision making and profiling:
      • Essay analysis and feedback generation
      • University recommendations based on preferences
      • Personalized content and resource suggestions
      • Performance analytics and insights`,
      humanReview: 'You have the right to request human review of automated decisions that significantly affect you.',
      explanation: 'We provide explanations of how automated decisions are made and the criteria used.',
      optOut: 'You can opt out of certain automated processing through your account settings.'
    },

    // Children's Data
    childrenData: {
      title: '9. Protection of Children\'s Data',
      content: `We take special care to protect the personal data of children and young people:
      • We do not knowingly collect data from children under 13
      • Users between 13-18 require parental or guardian consent
      • We implement age verification measures
      • We provide special protections for children's data
      • Parents can exercise rights on behalf of their children`,
      verification: 'We may request proof of age or parental consent when necessary.',
      education: 'We provide educational resources about online privacy for young users and parents.'
    },

    // Breach Notification
    breachNotification: {
      title: '10. Data Breach Notification',
      content: `In the unlikely event of a data breach, we have procedures in place to:
      • Detect and assess the breach within 72 hours
      • Notify affected individuals without undue delay
      • Report to supervisory authorities as required by law
      • Take immediate steps to contain and remediate the breach
      • Provide guidance and support to affected users`,
      timeline: 'We will notify you within 72 hours of becoming aware of a breach that affects your data.',
      support: 'We provide dedicated support for users affected by data breaches.'
    },

    // Exercising Your Rights
    exercisingRights: {
      title: '11. How to Exercise Your Rights',
      content: `You can exercise your data protection rights through multiple channels:
      • Account Settings: Update preferences and request data export
      • Privacy Portal: Submit formal requests for access, rectification, or deletion
      • Email: Contact privacy@admitai.korea for assistance
      • Phone: Call our support line for immediate assistance
      • Postal Mail: Send written requests to our business address`,
      verification: 'We may need to verify your identity before processing certain requests.',
      timeline: 'We will respond to your requests within 30 days, or sooner if required by law.',
      noCost: 'We do not charge fees for exercising your rights, except in exceptional circumstances.'
    },

    // Contact Information
    contact: {
      title: '12. Contact Information',
      content: `For questions about your data protection rights or to exercise them:
      • Data Protection Officer: dpo@admitai.korea
      • Privacy Team: privacy@admitai.korea
      • General Support: support@admitai.korea
      • Business Address: [Business Address]
      • Phone: [Business Phone]`,
      supervisory: 'You can also contact your local data protection authority for assistance.',
      response: 'We aim to respond to all inquiries within 24-48 hours.'
    }
  },
  ko: {
    title: '데이터 보호 및 개인정보 권리',
    lastUpdated: '최종 업데이트: 2025년 1월',
    effectiveDate: '시행일: 2025년 1월 1일',
    
    introduction: {
      title: '1. 귀하의 데이터 보호 권리',
      content: `AdmitAI Korea에서는 귀하의 개인정보를 보호하고 정보에 대한 완전한 통제권을 보장하기 위해 최선을 다하고 있습니다. 본 페이지는 GDPR, 한국 개인정보보호법(PIPA) 및 기타 관련 규정을 포함한 다양한 데이터 보호 법률에 따른 귀하의 권리를 설명합니다.`
    },

    yourRights: {
      title: '2. 데이터 보호 법률에 따른 귀하의 권리',
      rights: [
        {
          name: '접근권',
          description: '당사가 보유한 귀하의 모든 개인정보 사본을 요청할 권리가 있습니다.',
          process: '개인정보 포털을 통해 요청하거나 privacy@admitai.korea로 이메일 발송'
        },
        {
          name: '정정권',
          description: '부정확하거나 불완전한 개인정보의 수정을 요청할 수 있습니다.',
          process: '프로필을 직접 업데이트하거나 지원을 위해 연락'
        },
        {
          name: '삭제권',
          description: '특정 상황에서 개인정보 삭제를 요청할 수 있습니다.',
          process: '계정 설정을 통해 삭제 요청하거나 연락'
        },
        {
          name: '처리 제한권',
          description: '특정 상황에서 개인정보 사용을 제한할 수 있습니다.',
          process: '처리 제한에 대해 논의하기 위해 연락'
        },
        {
          name: '데이터 이식성',
          description: '기계가 읽을 수 있는 형식으로 데이터 사본을 요청할 수 있습니다.',
          process: '계정 설정을 통해 데이터 내보내기 요청'
        },
        {
          name: '이의제기권',
          description: '마케팅과 같은 특정 유형의 처리에 이의를 제기할 수 있습니다.',
          process: '계정 설정에서 선호도 업데이트하거나 연락'
        },
        {
          name: '동의 철회권',
          description: '언제든지 데이터 처리에 대한 동의를 철회할 수 있습니다.',
          process: '계정 설정에서 동의 선호도 업데이트'
        },
        {
          name: '불만 제기권',
          description: '감독 기관에 불만을 제기할 수 있습니다.',
          process: '지역 개인정보보호 기관에 연락'
        }
      ]
    },

    dataProcessing: {
      title: '3. 데이터 처리 방법',
      legalBasis: {
        subtitle: '처리의 법적 근거',
        content: `당사는 다음 법적 근거에 따라 개인정보를 처리합니다:
        • 동의: 데이터 처리에 명시적으로 동의할 때
        • 계약: 서비스 제공 및 계약 이행을 위해
        • 정당한 이익: 서비스 개선 및 사기 방지를 위해
        • 법적 의무: 관련 법률 및 규정 준수를 위해`,
        examples: '예시로는 계정 생성(동의), 서비스 제공(계약), 분석(정당한 이익), 세금 신고(법적 의무)가 있습니다.'
      },
      purposes: {
        subtitle: '처리 목적',
        content: `당사는 다음 목적으로 귀하의 데이터를 처리합니다:
        • AI 기반 서비스 제공 및 개선
        • 개인화된 경험 및 권장사항 제공
        • 결제 처리 및 구독 관리
        • 서비스에 대한 커뮤니케이션
        • 보안 보장 및 사기 방지
        • 법적 의무 준수
        • 연구 및 개발 수행`,
        aiTraining: '당사는 AI 모델 훈련을 위해 익명화된 데이터를 사용할 수 있으며, 개인정보가 식별되지 않도록 보장합니다.'
      }
    },

    dataTransfers: {
      title: '4. 국제 데이터 이전',
      content: `귀하의 개인정보는 거주지 외 국가로 이전되고 처리될 수 있습니다. 당사는 적절한 보호 조치가 마련되어 있음을 보장합니다:
      • EU 이전을 위한 표준 계약 조항(SCC)
      • 해당하는 경우 적정성 결정
      • 내부 이전을 위한 구속력 있는 기업 규칙(BCR)
      • 기타 승인된 이전 메커니즘`,
      locations: '당사의 주요 데이터 처리 위치는 대한민국, 미국 및 유럽연합을 포함합니다.',
      safeguards: '당사는 국제 이전 중 귀하의 데이터를 보호하기 위해 기술적 및 조직적 조치를 구현합니다.'
    },

    dataRetention: {
      title: '5. 데이터 보관 및 삭제',
      content: `당사는 개인정보처리방침에 명시된 목적을 달성하는 데 필요한 기간 동안만 개인정보를 보관합니다. 특정 보관 기간은 다음과 같습니다:
      • 계정 데이터: 마지막 활동 후 7년 또는 삭제 요청까지
      • 에세이 내용: 마지막 접근 후 3년 또는 삭제 요청까지
      • 결제 정보: 금융 규정에 따라 요구되는 기간
      • 이용 로그: 보안 및 분석을 위해 2년
      • 마케팅 데이터: 동의 철회 또는 마지막 상호작용 후 2년까지`,
      deletion: '계정 설정을 통해 또는 직접 연락하여 데이터 즉시 삭제를 요청할 수 있습니다.',
      anonymization: '보관 기간이 만료된 후, 당사는 연구 목적으로 데이터를 익명화할 수 있습니다.'
    },

    securityMeasures: {
      title: '6. 보안 조치 및 데이터 보호',
      content: `당사는 귀하의 개인정보를 보호하기 위해 포괄적인 보안 조치를 구현합니다:
      • 전송 중(TLS/SSL) 및 저장 중(AES-256) 데이터 암호화
      • 정기적인 보안 평가 및 침투 테스트
      • 접근 제어 및 다중 인증
      • 물리적 및 환경적 제어가 있는 보안 데이터 센터
      • 데이터 보호 및 보안에 대한 직원 교육
      • 사고 대응 및 침해 통지 절차
      • 정기적인 백업 및 재해 복구 계획`,
      monitoring: '당사는 보안 위협 및 취약점에 대해 시스템을 지속적으로 모니터링합니다.',
      compliance: '당사의 보안 조치는 업계 표준 및 규제 요구사항을 준수합니다.'
    },

    thirdParty: {
      title: '7. 제3자 데이터 처리업체',
      content: `당사는 귀하의 데이터를 당사를 대신하여 처리하는 신뢰할 수 있는 제3자 서비스 제공업체와 협력합니다:
      • 클라우드 인프라 제공업체 (AWS, Google Cloud)
      • 결제 처리업체 (Stripe, PayPal)
      • 분석 서비스 (Google Analytics, Mixpanel)
      • 고객 지원 도구 (Zendesk, Intercom)
      • 이메일 및 커뮤니케이션 서비스 (SendGrid, Twilio)`,
      agreements: '모든 제3자 처리업체는 귀하의 데이터를 보호해야 한다는 데이터 처리 계약에 구속됩니다.',
      assessment: '당사는 제3자 처리업체가 당사의 보안 및 개인정보 표준을 충족하는지 정기적으로 평가합니다.'
    },

    automatedDecisions: {
      title: '8. 자동화된 의사결정 및 프로파일링',
      content: `당사의 AI 기반 서비스는 자동화된 의사결정 및 프로파일링을 포함할 수 있습니다:
      • 에세이 분석 및 피드백 생성
      • 선호도에 기반한 대학 권장사항
      • 개인화된 콘텐츠 및 리소스 제안
      • 성능 분석 및 인사이트`,
      humanReview: '귀하는 귀하에게 중대한 영향을 미치는 자동화된 결정에 대한 인간 검토를 요청할 권리가 있습니다.',
      explanation: '당사는 자동화된 결정이 어떻게 이루어지는지와 사용된 기준에 대한 설명을 제공합니다.',
      optOut: '계정 설정을 통해 특정 자동화된 처리에서 옵트아웃할 수 있습니다.'
    },

    childrenData: {
      title: '9. 아동 데이터 보호',
      content: `당사는 아동 및 청소년의 개인정보를 보호하기 위해 특별한 주의를 기울입니다:
      • 13세 미만 아동으로부터 고의로 데이터를 수집하지 않습니다
      • 13-18세 사용자는 부모 또는 보호자의 동의가 필요합니다
      • 나이 확인 조치를 구현합니다
      • 아동 데이터에 대한 특별 보호를 제공합니다
      • 부모는 자녀를 대신하여 권리를 행사할 수 있습니다`,
      verification: '필요한 경우 나이 증명이나 부모 동의를 요청할 수 있습니다.',
      education: '당사는 젊은 사용자와 부모를 위한 온라인 개인정보에 대한 교육 자료를 제공합니다.'
    },

    breachNotification: {
      title: '10. 데이터 침해 통지',
      content: `데이터 침해가 발생할 가능성이 낮지만, 당사는 다음을 위한 절차를 마련하고 있습니다:
      • 72시간 내에 침해를 감지하고 평가
      • 지체 없이 영향을 받은 개인에게 통지
      • 법에서 요구하는 대로 감독 기관에 보고
      • 침해를 억제하고 수정하기 위한 즉시 조치
      • 영향을 받은 사용자에게 지침 및 지원 제공`,
      timeline: '귀하의 데이터에 영향을 미치는 침해를 인지한 후 72시간 내에 통지할 것입니다.',
      support: '당사는 데이터 침해로 영향을 받은 사용자를 위한 전용 지원을 제공합니다.'
    },

    exercisingRights: {
      title: '11. 권리 행사 방법',
      content: `다양한 채널을 통해 데이터 보호 권리를 행사할 수 있습니다:
      • 계정 설정: 선호도 업데이트 및 데이터 내보내기 요청
      • 개인정보 포털: 접근, 정정 또는 삭제를 위한 공식 요청 제출
      • 이메일: 지원을 위해 privacy@admitai.korea로 연락
      • 전화: 즉시 지원을 위해 지원 라인에 전화
      • 우편: 사업장 주소로 서면 요청 발송`,
      verification: '특정 요청을 처리하기 전에 신원 확인이 필요할 수 있습니다.',
      timeline: '법에서 요구하는 경우를 제외하고 30일 내에 요청에 응답하거나 더 빠르게 응답할 것입니다.',
      noCost: '예외적인 상황을 제외하고 권리 행사에 대한 수수료를 청구하지 않습니다.'
    },

    contact: {
      title: '12. 연락처 정보',
      content: `데이터 보호 권리에 대한 질문이나 권리 행사를 위해:
      • 개인정보보호책임자: dpo@admitai.korea
      • 개인정보 팀: privacy@admitai.korea
      • 일반 지원: support@admitai.korea
      • 사업장 주소: [사업장 주소]
      • 전화: [사업장 전화번호]`,
      supervisory: '지원을 위해 지역 개인정보보호 기관에도 연락할 수 있습니다.',
      response: '당사는 모든 문의에 24-48시간 내에 응답하는 것을 목표로 합니다.'
    }
  }
};

type Lang = keyof typeof translations;

const DataProtectionPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[(language as Lang)] || translations.en;

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead
        title={`${t.title} | AdmitAI Korea`}
        description={language === 'ko' ? 'AdmitAI Korea 데이터 보호 권리' : 'AdmitAI Korea Data Protection & Privacy Rights'}
        canonical="https://admitai.kr/data-protection"
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

            {/* Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.yourRights.title}</h2>
              <div className="grid gap-4">
                {t.yourRights.rights.map((right, index) => (
                  <div key={index} className="border border-gray-200 rounded-lg p-4">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">{right.name}</h3>
                    <p className="text-gray-700 mb-3">{right.description}</p>
                    <p className="text-sm text-gray-600 italic">{right.process}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Data Processing */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.dataProcessing.title}</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.dataProcessing.legalBasis.subtitle}</h3>
                <p className="text-gray-700 mb-3">{t.dataProcessing.legalBasis.content}</p>
                <p className="text-sm text-gray-600 italic">{t.dataProcessing.legalBasis.examples}</p>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.dataProcessing.purposes.subtitle}</h3>
                <p className="text-gray-700 mb-3">{t.dataProcessing.purposes.content}</p>
                <p className="text-sm text-gray-600 italic">{t.dataProcessing.purposes.aiTraining}</p>
              </div>
            </section>

            {/* Data Transfers */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.dataTransfers.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.dataTransfers.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.dataTransfers.locations}</p>
                <p className="text-sm text-gray-600 italic">{t.dataTransfers.safeguards}</p>
              </div>
            </section>

            {/* Data Retention */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.dataRetention.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.dataRetention.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.dataRetention.deletion}</p>
                <p className="text-sm text-gray-600 italic">{t.dataRetention.anonymization}</p>
              </div>
            </section>

            {/* Security Measures */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.securityMeasures.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.securityMeasures.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.securityMeasures.monitoring}</p>
                <p className="text-sm text-gray-600 italic">{t.securityMeasures.compliance}</p>
              </div>
            </section>

            {/* Third-Party Processors */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.thirdParty.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.thirdParty.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.thirdParty.agreements}</p>
                <p className="text-sm text-gray-600 italic">{t.thirdParty.assessment}</p>
              </div>
            </section>

            {/* Automated Decision Making */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.automatedDecisions.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.automatedDecisions.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.automatedDecisions.humanReview}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.automatedDecisions.explanation}</p>
                <p className="text-sm text-gray-600 italic">{t.automatedDecisions.optOut}</p>
              </div>
            </section>

            {/* Children's Data */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.childrenData.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.childrenData.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.childrenData.verification}</p>
                <p className="text-sm text-gray-600 italic">{t.childrenData.education}</p>
              </div>
            </section>

            {/* Breach Notification */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.breachNotification.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.breachNotification.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.breachNotification.timeline}</p>
                <p className="text-sm text-gray-600 italic">{t.breachNotification.support}</p>
              </div>
            </section>

            {/* Exercising Your Rights */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.exercisingRights.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.exercisingRights.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.exercisingRights.verification}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.exercisingRights.timeline}</p>
                <p className="text-sm text-gray-600 italic">{t.exercisingRights.noCost}</p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.contact.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.contact.content}</p>
                <p className="text-sm text-gray-600 italic mb-2">{t.contact.supervisory}</p>
                <p className="text-sm text-gray-600 italic">{t.contact.response}</p>
              </div>
            </section>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
            {language === 'ko' ? '데이터 요청' : 'Request My Data'}
          </button>
          <button className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors">
            {language === 'ko' ? '계정 삭제' : 'Delete My Account'}
          </button>
          <button className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors">
            {language === 'ko' ? '개인정보보호책임자 연락' : 'Contact DPO'}
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {language === 'ko' 
              ? '본 페이지는 GDPR, 한국 개인정보보호법 및 기타 관련 규정을 준수합니다.'
              : 'This page complies with GDPR, Korean privacy laws, and other applicable regulations.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default DataProtectionPage; 