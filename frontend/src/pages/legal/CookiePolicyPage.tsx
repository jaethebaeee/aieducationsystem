import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import SEOHead from '../../components/seo/SEOHead';

const translations = {
  en: {
    title: 'Cookie Policy',
    lastUpdated: 'Last Updated: January 2025',
    effectiveDate: 'Effective Date: January 1, 2025',
    
    // Introduction
    introduction: {
      title: '1. What Are Cookies?',
      content: `Cookies are small text files that are stored on your device when you visit our website. They help us provide you with a better experience by remembering your preferences, analyzing how you use our site, and personalizing content.`
    },

    // How We Use Cookies
    cookieUsage: {
      title: '2. How We Use Cookies',
      content: `We use cookies for several purposes:
      • Essential cookies: Required for basic website functionality
      • Performance cookies: Help us understand how visitors use our site
      • Functional cookies: Remember your preferences and settings
      • Marketing cookies: Provide personalized content and advertisements`,
      purpose: 'Our primary goal is to enhance your experience and provide relevant, personalized services for your college admissions journey.'
    },

    // Types of Cookies
    cookieTypes: {
      title: '3. Types of Cookies We Use',
      essential: {
        subtitle: 'Essential Cookies',
        description: 'These cookies are necessary for the website to function properly. They cannot be disabled.',
        examples: [
          'Authentication and security cookies',
          'Session management cookies',
          'Load balancing cookies',
          'User interface customization cookies'
        ]
      },
      performance: {
        subtitle: 'Performance Cookies',
        description: 'These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously.',
        examples: [
          'Google Analytics cookies',
          'Error tracking cookies',
          'Page load time monitoring',
          'User behavior analytics'
        ]
      },
      functional: {
        subtitle: 'Functional Cookies',
        description: 'These cookies enable enhanced functionality and personalization, such as remembering your language preference.',
        examples: [
          'Language preference cookies',
          'Theme and layout preferences',
          'Form auto-fill cookies',
          'User interface customization'
        ]
      },
      marketing: {
        subtitle: 'Marketing Cookies',
        description: 'These cookies are used to track visitors across websites to display relevant and engaging advertisements.',
        examples: [
          'Social media integration cookies',
          'Advertising network cookies',
          'Retargeting cookies',
          'Conversion tracking cookies'
        ]
      }
    },

    // Third-Party Cookies
    thirdParty: {
      title: '4. Third-Party Cookies',
      content: `We may use third-party services that place cookies on your device:
      • Google Analytics for website analytics
      • Payment processors for secure transactions
      • Social media platforms for sharing features
      • Advertising networks for relevant content
      • Customer support tools for assistance`,
      note: 'These third parties have their own privacy policies and cookie practices.'
    },

    // Cookie Management
    cookieManagement: {
      title: '5. Managing Your Cookie Preferences',
      content: `You have several options for managing cookies:
      • Browser settings: Most browsers allow you to control cookies
      • Cookie consent tool: Use our cookie preference center
      • Third-party opt-outs: Visit third-party websites to opt out
      • Do Not Track: Enable this browser feature`,
      browserSettings: 'You can usually find cookie settings in your browser\'s privacy or security settings.'
    },

    // Specific Cookies
    specificCookies: {
      title: '6. Specific Cookies We Use',
      content: `Here are the specific cookies we use on our website:`,
      table: [
        {
          name: 'session_id',
          purpose: 'Maintains your login session',
          duration: 'Session',
          type: 'Essential'
        },
        {
          name: 'language_pref',
          purpose: 'Remembers your language preference',
          duration: '1 year',
          type: 'Functional'
        },
        {
          name: 'theme_pref',
          purpose: 'Remembers your theme preference',
          duration: '1 year',
          type: 'Functional'
        },
        {
          name: '_ga',
          purpose: 'Google Analytics tracking',
          duration: '2 years',
          type: 'Performance'
        },
        {
          name: '_gid',
          purpose: 'Google Analytics session tracking',
          duration: '24 hours',
          type: 'Performance'
        },
        {
          name: 'marketing_consent',
          purpose: 'Remembers your marketing preferences',
          duration: '1 year',
          type: 'Marketing'
        }
      ]
    },

    // Updates
    updates: {
      title: '7. Updates to This Cookie Policy',
      content: `We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the updated policy on our website.`,
      notification: 'Please check this page periodically for updates.'
    },

    // Contact
    contact: {
      title: '8. Contact Us',
      content: `If you have questions about our use of cookies, please contact us:
      • Email: privacy@admitai.korea
      • Address: [Business Address]
      • Phone: [Business Phone]`,
      support: 'For technical support with cookie settings, please use our support channels.'
    }
  },
  ko: {
    title: '쿠키 정책',
    lastUpdated: '최종 업데이트: 2025년 1월',
    effectiveDate: '시행일: 2025년 1월 1일',
    
    introduction: {
      title: '1. 쿠키란 무엇인가요?',
      content: `쿠키는 웹사이트를 방문할 때 귀하의 기기에 저장되는 작은 텍스트 파일입니다. 귀하의 선호도를 기억하고, 사이트 이용 방식을 분석하며, 콘텐츠를 개인화하여 더 나은 경험을 제공하는 데 도움을 줍니다.`
    },

    cookieUsage: {
      title: '2. 쿠키 사용 방법',
      content: `당사는 여러 목적으로 쿠키를 사용합니다:
      • 필수 쿠키: 기본 웹사이트 기능에 필요
      • 성능 쿠키: 방문자가 사이트를 어떻게 사용하는지 이해하는 데 도움
      • 기능 쿠키: 귀하의 선호도 및 설정을 기억
      • 마케팅 쿠키: 개인화된 콘텐츠 및 광고 제공`,
      purpose: '당사의 주요 목표는 귀하의 경험을 향상시키고 대학 입학 과정에 관련된 맞춤형 서비스를 제공하는 것입니다.'
    },

    cookieTypes: {
      title: '3. 당사가 사용하는 쿠키 유형',
      essential: {
        subtitle: '필수 쿠키',
        description: '이러한 쿠키는 웹사이트가 제대로 작동하는 데 필요합니다. 비활성화할 수 없습니다.',
        examples: [
          '인증 및 보안 쿠키',
          '세션 관리 쿠키',
          '로드 밸런싱 쿠키',
          '사용자 인터페이스 맞춤화 쿠키'
        ]
      },
      performance: {
        subtitle: '성능 쿠키',
        description: '이러한 쿠키는 방문자가 웹사이트와 어떻게 상호작용하는지 익명으로 정보를 수집하고 보고하여 이해하는 데 도움을 줍니다.',
        examples: [
          'Google Analytics 쿠키',
          '오류 추적 쿠키',
          '페이지 로드 시간 모니터링',
          '사용자 행동 분석'
        ]
      },
      functional: {
        subtitle: '기능 쿠키',
        description: '이러한 쿠키는 언어 선호도 기억과 같은 향상된 기능 및 개인화를 가능하게 합니다.',
        examples: [
          '언어 선호도 쿠키',
          '테마 및 레이아웃 선호도',
          '양식 자동 채우기 쿠키',
          '사용자 인터페이스 맞춤화'
        ]
      },
      marketing: {
        subtitle: '마케팅 쿠키',
        description: '이러한 쿠키는 관련성 있고 매력적인 광고를 표시하기 위해 웹사이트 간 방문자를 추적하는 데 사용됩니다.',
        examples: [
          '소셜 미디어 통합 쿠키',
          '광고 네트워크 쿠키',
          '재타겟팅 쿠키',
          '전환 추적 쿠키'
        ]
      }
    },

    thirdParty: {
      title: '4. 제3자 쿠키',
      content: `당사는 귀하의 기기에 쿠키를 배치하는 제3자 서비스를 사용할 수 있습니다:
      • 웹사이트 분석을 위한 Google Analytics
      • 안전한 거래를 위한 결제 처리업체
      • 공유 기능을 위한 소셜 미디어 플랫폼
      • 관련 콘텐츠를 위한 광고 네트워크
      • 지원을 위한 고객 지원 도구`,
      note: '이러한 제3자는 자체 개인정보처리방침과 쿠키 관행을 가지고 있습니다.'
    },

    cookieManagement: {
      title: '5. 쿠키 선호도 관리',
      content: `쿠키를 관리하는 몇 가지 옵션이 있습니다:
      • 브라우저 설정: 대부분의 브라우저에서 쿠키를 제어할 수 있습니다
      • 쿠키 동의 도구: 당사의 쿠키 선호도 센터를 사용하세요
      • 제3자 옵트아웃: 제3자 웹사이트를 방문하여 옵트아웃하세요
      • 추적 금지: 이 브라우저 기능을 활성화하세요`,
      browserSettings: '쿠키 설정은 보통 브라우저의 개인정보 또는 보안 설정에서 찾을 수 있습니다.'
    },

    specificCookies: {
      title: '6. 당사가 사용하는 특정 쿠키',
      content: `다음은 당사 웹사이트에서 사용하는 특정 쿠키입니다:`,
      table: [
        {
          name: 'session_id',
          purpose: '로그인 세션 유지',
          duration: '세션',
          type: '필수'
        },
        {
          name: 'language_pref',
          purpose: '언어 선호도 기억',
          duration: '1년',
          type: '기능'
        },
        {
          name: 'theme_pref',
          purpose: '테마 선호도 기억',
          duration: '1년',
          type: '기능'
        },
        {
          name: '_ga',
          purpose: 'Google Analytics 추적',
          duration: '2년',
          type: '성능'
        },
        {
          name: '_gid',
          purpose: 'Google Analytics 세션 추적',
          duration: '24시간',
          type: '성능'
        },
        {
          name: 'marketing_consent',
          purpose: '마케팅 선호도 기억',
          duration: '1년',
          type: '마케팅'
        }
      ]
    },

    updates: {
      title: '7. 쿠키 정책 업데이트',
      content: `당사는 관행의 변경이나 기타 운영적, 법적 또는 규제적 이유로 때때로 본 쿠키 정책을 업데이트할 수 있습니다. 당사는 웹사이트에 업데이트된 정책을 게시하여 중요한 변경사항을 알려드릴 것입니다.`,
      notification: '업데이트를 위해 이 페이지를 주기적으로 확인해 주세요.'
    },

    contact: {
      title: '8. 연락처',
      content: `쿠키 사용에 대한 질문이 있으시면 다음으로 연락해 주세요:
      • 이메일: privacy@admitai.korea
      • 주소: [사업장 주소]
      • 전화: [사업장 전화번호]`,
      support: '쿠키 설정에 대한 기술 지원을 위해서는 당사의 지원 채널을 사용해 주세요.'
    }
  }
};

type Lang = keyof typeof translations;

const CookiePolicyPage: React.FC = () => {
  const { language } = useLanguage();
  const t = translations[(language as Lang)] || translations.en;
  const [showCookiePreferences, setShowCookiePreferences] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <SEOHead
        title={`${t.title} | AdmitAI Korea`}
        description={language === 'ko' ? 'AdmitAI Korea 쿠키 정책' : 'AdmitAI Korea Cookie Policy'}
        canonical="https://admitai.kr/cookies"
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

            {/* Cookie Usage */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.cookieUsage.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.cookieUsage.content}</p>
                <p className="text-sm text-gray-600 italic">{t.cookieUsage.purpose}</p>
              </div>
            </section>

            {/* Cookie Types */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.cookieTypes.title}</h2>
              
              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.cookieTypes.essential.subtitle}</h3>
                <p className="text-gray-700 mb-3">{t.cookieTypes.essential.description}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {t.cookieTypes.essential.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.cookieTypes.performance.subtitle}</h3>
                <p className="text-gray-700 mb-3">{t.cookieTypes.performance.description}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {t.cookieTypes.performance.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.cookieTypes.functional.subtitle}</h3>
                <p className="text-gray-700 mb-3">{t.cookieTypes.functional.description}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {t.cookieTypes.functional.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-900 mb-3">{t.cookieTypes.marketing.subtitle}</h3>
                <p className="text-gray-700 mb-3">{t.cookieTypes.marketing.description}</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  {t.cookieTypes.marketing.examples.map((example, index) => (
                    <li key={index}>{example}</li>
                  ))}
                </ul>
              </div>
            </section>

            {/* Third-Party Cookies */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.thirdParty.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.thirdParty.content}</p>
                <p className="text-sm text-gray-600 italic">{t.thirdParty.note}</p>
              </div>
            </section>

            {/* Cookie Management */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.cookieManagement.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.cookieManagement.content}</p>
                <p className="text-sm text-gray-600 italic">{t.cookieManagement.browserSettings}</p>
              </div>
            </section>

            {/* Specific Cookies Table */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.specificCookies.title}</h2>
              <p className="text-gray-700 mb-4">{t.specificCookies.content}</p>
              
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'ko' ? '쿠키 이름' : 'Cookie Name'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'ko' ? '목적' : 'Purpose'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'ko' ? '지속 기간' : 'Duration'}
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {language === 'ko' ? '유형' : 'Type'}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {t.specificCookies.table.map((cookie, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900 font-mono">{cookie.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{cookie.purpose}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{cookie.duration}</td>
                        <td className="px-4 py-3 text-sm">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            cookie.type === 'Essential' || cookie.type === '필수'
                              ? 'bg-red-100 text-red-800'
                              : cookie.type === 'Performance' || cookie.type === '성능'
                              ? 'bg-blue-100 text-blue-800'
                              : cookie.type === 'Functional' || cookie.type === '기능'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {cookie.type}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Updates */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.updates.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.updates.content}</p>
                <p className="text-sm text-gray-600 italic">{t.updates.notification}</p>
              </div>
            </section>

            {/* Contact */}
            <section className="mb-8">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">{t.contact.title}</h2>
              <div className="text-gray-700 leading-relaxed">
                <p className="mb-4">{t.contact.content}</p>
                <p className="text-sm text-gray-600 italic">{t.contact.support}</p>
              </div>
            </section>
          </div>
        </div>

        {/* Cookie Preferences Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => setShowCookiePreferences(!showCookiePreferences)}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
          >
            {language === 'ko' ? '쿠키 설정 관리' : 'Manage Cookie Preferences'}
          </button>
        </div>

        {/* Cookie Preferences Modal */}
        {showCookiePreferences && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-md w-full p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                {language === 'ko' ? '쿠키 설정' : 'Cookie Preferences'}
              </h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {language === 'ko' ? '필수 쿠키' : 'Essential Cookies'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'ko' ? '웹사이트 기능에 필요' : 'Required for website functionality'}
                    </p>
                  </div>
                  <div className="bg-gray-200 rounded-full w-12 h-6 flex items-center justify-start px-1">
                    <div className="bg-white rounded-full w-4 h-4"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {language === 'ko' ? '성능 쿠키' : 'Performance Cookies'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'ko' ? '사이트 사용 분석' : 'Analyze site usage'}
                    </p>
                  </div>
                  <div className="bg-blue-600 rounded-full w-12 h-6 flex items-center justify-end px-1">
                    <div className="bg-white rounded-full w-4 h-4"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {language === 'ko' ? '기능 쿠키' : 'Functional Cookies'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'ko' ? '선호도 기억' : 'Remember preferences'}
                    </p>
                  </div>
                  <div className="bg-blue-600 rounded-full w-12 h-6 flex items-center justify-end px-1">
                    <div className="bg-white rounded-full w-4 h-4"></div>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {language === 'ko' ? '마케팅 쿠키' : 'Marketing Cookies'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {language === 'ko' ? '개인화된 광고' : 'Personalized advertising'}
                    </p>
                  </div>
                  <div className="bg-gray-200 rounded-full w-12 h-6 flex items-center justify-start px-1">
                    <div className="bg-white rounded-full w-4 h-4"></div>
                  </div>
                </div>
              </div>
              <div className="mt-6 flex space-x-3">
                <button
                  onClick={() => setShowCookiePreferences(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
                >
                  {language === 'ko' ? '취소' : 'Cancel'}
                </button>
                <button
                  onClick={() => setShowCookiePreferences(false)}
                  className="flex-1 px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
                >
                  {language === 'ko' ? '저장' : 'Save'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-500">
            {language === 'ko' 
              ? '쿠키 설정을 변경하면 웹사이트 경험에 영향을 줄 수 있습니다.'
              : 'Changing cookie settings may affect your website experience.'
            }
          </p>
        </div>
      </div>
    </div>
  );
};

export default CookiePolicyPage; 