import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/magazine-style.css';

const CaseStudiesPage: React.FC = () => {
  // Updated case studies data with corrected image paths
  const caseStudies = [
    // Main case studies
    {
      id: 'luxe-properties',
      title: 'Luxe Properties',
      subtitle: 'Luxury Real Estate Digital Transformation',
      description: 'How we revolutionized the luxury real estate experience through digital innovation and personalized customer journeys.',
      image: '/images/case-studies/luxe-properties-background.jpg',
      industry: 'Real Estate',
      results: [
        '75% increase in qualified leads',
        '42% reduction in sales cycle',
        '3.2x ROI on digital marketing spend'
      ],
      featured: true,
      slug: 'luxe-properties',
      testimonial: "The digital transformation has completely changed how we engage with luxury homebuyers, resulting in significantly higher conversion rates."
    },
    {
      id: 'techforward',
      title: 'TechForward',
      subtitle: 'Customer Lifetime Value Enhancement',
      description: 'How we helped a SaaS provider increase customer lifetime value and reduce churn through targeted engagement strategies.',
      image: '/images/case-studies/techforward-background.jpg',
      industry: 'Technology',
      results: [
        '3.2x increase in customer lifetime value',
        '64% reduction in churn rate',
        '42% improvement in customer satisfaction'
      ],
      featured: true,
      slug: 'techforward-customer-lifetime-value',
      testimonial: "Our customer retention metrics have been completely transformed. We're now able to predict and prevent churn before it happens."
    },
    {
      id: 'retailnxt',
      title: 'RetailNXT',
      subtitle: 'Customer Retention Improvement',
      description: 'How we helped a retailer transform their customer experience to significantly improve retention and repeat purchases.',
      image: '/images/case-studies/retailnxt.jpg',
      industry: 'Retail',
      results: [
        '63% increase in customer retention',
        '40% increase in repeat purchases',
        '37% increase in customer lifetime value'
      ],
      highlighted: true,
      slug: 'retailnxt-customer-retention',
      testimonial: "The retention strategy CloudSeek implemented has dramatically changed our business model, shifting focus from acquisition to building lasting customer relationships."
    },
    {
      id: 'strategic-consulting-group',
      title: 'Strategic Consulting Group',
      subtitle: 'From Siloed Data to 360° Client View',
      description: 'How we unified fragmented data across departments to create a complete view of client relationships.',
      image: '/images/case-studies/strategic-consulting.jpg',
      industry: 'Professional Services',
      results: [
        '50% reduction in operational costs',
        '32% increase in consultant utilization',
        '68% faster access to client information'
      ],
      highlighted: true,
      slug: 'strategic-consulting-group',
      testimonial: "For the first time, our consultants have a complete picture of each client relationship, enabling them to deliver more targeted and effective solutions."
    },
    {
      id: 'fashion-forward',
      title: 'Fashion Forward',
      subtitle: 'Digital Commerce Transformation',
      description: 'How we helped a traditional fashion retailer build an omnichannel experience that blends physical and digital shopping.',
      image: '/images/case-studies/fashion-forward.jpg',
      industry: 'Fashion',
      results: [
        '215% increase in e-commerce revenue',
        '47% of in-store purchases influenced by digital touchpoints',
        '28% increase in average transaction value'
      ],
      slug: 'fashion-forward',
      isRecent: true,
      testimonial: "Our digital transformation has allowed us to meet customers wherever they are, creating a seamless experience between our online and offline channels."
    },
    {
      id: 'luxehome-furnishings',
      title: 'LuxeHome Furnishings',
      subtitle: 'Customer Experience Reimagined',
      description: 'How we created an innovative AR-powered shopping experience that resulted in higher conversion and reduced returns.',
      image: '/images/case-studies/luxe-properties-background.jpg',
      industry: 'Home Goods',
      results: [
        '78% increase in online conversion rates',
        '43% reduction in returns',
        '3.5x increase in mobile engagement'
      ],
      slug: 'luxehome-furnishings',
      isRecent: true,
      testimonial: "The AR implementation transformed how customers shop for furniture, giving them confidence in their purchases and significantly reducing returns."
    },
    {
      id: 'global-financial-corp',
      title: 'Global Financial Corp',
      subtitle: 'Leading Multinational Financial Services Company',
      description: 'How we unified customer data and streamlined operations across 30+ countries for a global financial leader.',
      image: '/images/case-studies/luxe-properties-background.jpg',
      industry: 'Financial Services',
      results: [
        '30% increase in customer satisfaction',
        '25% reduction in operational costs',
        '42% improvement in cross-border efficiency'
      ],
      slug: 'global-financial-corp'
    },
    {
      id: 'tech-vision',
      title: 'Tech Vision',
      subtitle: 'AI-Driven Product Innovation',
      description: 'How we helped an enterprise tech company implement AI to accelerate product development and identify market opportunities.',
      image: '/images/case-studies/techforward-background.jpg',
      industry: 'Enterprise Technology',
      results: [
        '41% faster time-to-market for new products',
        '62% improvement in feature adoption',
        '28% increase in customer-requested features identified'
      ],
      slug: 'tech-vision'
    },
    
    // Related/secondary case studies
    {
      id: 'coastal-developments',
      title: 'Coastal Developments',
      subtitle: 'Sales Transformation & Digital Strategy',
      description: 'How we transformed the sales process for a coastal property developer through digital tools and predictive analytics.',
      image: '/images/case-studies/coastal-developments.jpg',
      industry: 'Real Estate',
      results: [
        '84% increase in qualified leads',
        '39% reduction in sales cycle',
        '52% improvement in lead conversion'
      ],
      slug: 'coastal-developments'
    },
    {
      id: 'metro-property',
      title: 'Metro Property Management',
      subtitle: 'Tenant Experience Platform',
      description: 'How we developed a comprehensive tenant experience platform that increased satisfaction and retention for a major property manager.',
      image: '/images/case-studies/metro-property.jpg',
      industry: 'Property Management',
      results: [
        '65% increase in tenant satisfaction',
        '32% reduction in service request resolution time',
        '28% decrease in tenant turnover'
      ],
      slug: 'metro-property-management'
    },
    {
      id: 'healthtech-innovations',
      title: 'HealthTech Innovations',
      subtitle: 'Revolutionary Healthcare Technology Provider',
      description: 'How we streamlined patient data management and enhanced compliance across 200+ hospitals nationwide.',
      image: '/images/case-studies/precision-manufacturing.jpg',
      industry: 'Healthcare',
      results: [
        '40% improvement in patient data retrieval',
        '35% reduction in administrative overhead',
        '28% increase in patient satisfaction'
      ],
      slug: 'healthtech-innovations',
      isRecent: true,
      testimonial: "The data management solution implemented by CloudSeek has transformed how our hospital network operates, giving us unprecedented compliance capabilities while improving efficiency."
    }
  ];

  // Map the data to the magazine-style format
  const magazineStyleCaseStudies = caseStudies.map(study => ({
    id: study.id,
    title: study.title,
    company: study.subtitle,
    excerpt: study.description,
    imageUrl: study.image,
    category: study.industry,
    link: `/case-studies/${study.slug}`,
    results: study.results,
    featured: study.featured || false,
    highlighted: study.highlighted || false,
    isRecent: study.isRecent || false,
    testimonial: study.testimonial || ''
  }));

  // Function to get featured case studies
  const featuredCaseStudies = magazineStyleCaseStudies.filter(study => study.featured);
  
  // Get highlighted case studies
  const highlightedCaseStudies = magazineStyleCaseStudies.filter(study => study.highlighted);
  
  // Get recent case studies
  const recentCaseStudies = magazineStyleCaseStudies.filter(study => study.isRecent);
  
  // Rest of the case studies (excluding featured, highlighted, and recent)
  const regularCaseStudies = magazineStyleCaseStudies.filter(
    study => !study.featured && !study.highlighted && !study.isRecent
  );

  // Group case studies by industry
  const studiesByIndustry = magazineStyleCaseStudies.reduce((acc, study) => {
    if (!acc[study.category]) {
      acc[study.category] = [];
    }
    acc[study.category].push(study);
    return acc;
  }, {} as Record<string, typeof magazineStyleCaseStudies>);

  // Get industries with at least 1 case study
  const popularIndustries = Object.keys(studiesByIndustry)
    .filter(industry => studiesByIndustry[industry].length >= 1)
    .slice(0, 4); // Take top 4 industries

  // Add Tech Vision to the Technology industry
  if (studiesByIndustry['Technology']) {
    studiesByIndustry['Technology'].push({
      id: 'tech-vision',
      title: 'IT Services Automation',
      company: 'Tech Vision',
      imageUrl: '/images/case-studies/techforward-background.jpg',
      category: 'Technology',
      results: ['68% reduction in manual processes', '42% increase in service delivery speed'],
      link: '/case-studies/tech-vision',
      excerpt: 'How we automated core business processes for an IT services company to improve efficiency and scalability.',
      featured: false,
      highlighted: false,
      isRecent: false,
      testimonial: ''
    });
  }

  // Make sure 'Technology' is included in the popularIndustries array if it isn't already
  if (!popularIndustries.includes('Technology')) {
    popularIndustries.push('Technology');
  }

  return (
    <div className="cloudseek-container">
      <div className="cs-page-header">
        <h1>Case Studies</h1>
        <p className="cs-page-subtitle">Discover how we help businesses transform and thrive in the digital landscape</p>
      </div>

      {/* Featured section - large format case studies */}
      <section className="cs-featured-section">
        {featuredCaseStudies.map((study, index) => (
          <div key={study.id} className={`cs-featured-card ${index === 0 ? 'cs-main-feature' : 'cs-secondary-feature'}`}>
            <div className="cs-card-image">
              <img src={study.imageUrl} alt={study.title} />
              <div className="cs-company-badge">{study.company}</div>
            </div>
            <div className="cs-card-content">
              <span className="cs-category-tag">{study.category}</span>
              <h2>{study.title}</h2>
              <p>{study.excerpt}</p>
              
              {/* Results section for feature items */}
              <div className="cs-results-list">
                {study.results.map((result, idx) => (
                  <div key={idx} className="cs-result-item">
                    <span className="cs-checkmark">✓</span> {result}
                  </div>
                ))}
              </div>
              
              {study.testimonial && (
                <div className="cs-testimonial">
                  <span className="cs-quote">"</span>
                  {study.testimonial}
                  <span className="cs-quote">"</span>
                </div>
              )}
              
              <Link to={study.link} className="cs-btn cs-btn-link">Read Case Study</Link>
            </div>
          </div>
        ))}
      </section>
      
      {/* Highlighted Case Studies - Full Width */}
      <section className="cs-highlight-section">
        <h2 className="cs-section-title">Highlighted Success Stories</h2>
        {highlightedCaseStudies.map((study, index) => (
          <div key={study.id} className={`cs-highlight-card ${index % 2 === 0 ? 'cs-align-left' : 'cs-align-right'}`}>
            <div className="cs-highlight-image">
              <img src={study.imageUrl} alt={study.title} />
            </div>
            <div className="cs-highlight-content">
              <span className="cs-category-tag">{study.category}</span>
              <h3>{study.title}</h3>
              <h4>{study.company}</h4>
              <p>{study.excerpt}</p>
              
              <div className="cs-highlight-results">
                {study.results.map((result, idx) => (
                  <div key={idx} className="cs-result-item">
                    <span className="cs-checkmark">✓</span> {result}
                  </div>
                ))}
              </div>
              
              {study.testimonial && (
                <div className="cs-testimonial">
                  <span className="cs-quote">"</span>
                  {study.testimonial}
                  <span className="cs-quote">"</span>
                </div>
              )}
              
              <Link to={study.link} className="cs-btn cs-btn-primary">Read Full Case Study</Link>
            </div>
          </div>
        ))}
      </section>
      
      {/* Popular Industries Section */}
      <section className="cs-industries-section">
        <h2 className="cs-section-title">Solutions Across Industries</h2>
        <div className="cs-industries-grid">
          {popularIndustries.map(industry => (
            <div key={industry} className="cs-industry-card">
              <h3 className="cs-industry-title">{industry}</h3>
              <div className="cs-industry-studies">
                {studiesByIndustry[industry].slice(0, 2).map(study => (
                  <div key={study.id} className="cs-industry-item">
                    <img src={study.imageUrl} alt={study.title} className="cs-industry-image" />
                    <div className="cs-industry-content">
                      <h4>{study.title}</h4>
                      <p>{study.results[0]}</p>
                      <Link to={study.link} className="cs-btn cs-btn-sm">View Project</Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>
      
      {/* Recent Projects Section (if any) */}
      {recentCaseStudies.length > 0 && (
        <section className="cs-recent-section">
          <h2 className="cs-section-title">Recent Projects</h2>
          <div className="cs-recent-grid">
            {recentCaseStudies.map(study => (
              <div key={study.id} className="cs-recent-card">
                <div className="cs-card-image">
                  <img src={study.imageUrl} alt={study.title} />
                  <div className="cs-image-category">{study.category}</div>
                </div>
                <div className="cs-card-content">
                  <h3>{study.title}</h3>
                  <p>{study.excerpt}</p>
                  <div className="cs-key-result">{study.results[0]}</div>
                  <Link to={study.link} className="cs-btn cs-btn-link">Read Case Study</Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
      
      {/* Regular case studies if any */}
      {regularCaseStudies.length > 0 && (
        <>
          <div className="cs-divider">
            <span className="cs-divider-line"></span>
            <h3>More Success Stories</h3>
            <span className="cs-divider-line"></span>
          </div>

          <section className="cs-grid-section">
            {regularCaseStudies.map((study, index) => (
              <div 
                key={study.id} 
                className={`cs-grid-card ${index % 3 === 0 ? 'cs-grid-large' : ''}`}
              >
                <div className="cs-card-image">
                  <img src={study.imageUrl} alt={study.title} />
                  <div className="cs-company-badge">{study.company}</div>
                </div>
                <div className="cs-card-content">
                  <span className="cs-category-tag">{study.category}</span>
                  <h3>{study.title}</h3>
                  <p>{study.excerpt}</p>
                  
                  <div className="cs-grid-results">
                    <div className="cs-key-result">{study.results[0]}</div>
                  </div>
                  
                  <Link to={study.link} className="cs-btn cs-btn-link">Read Case Study</Link>
                </div>
              </div>
            ))}
          </section>
        </>
      )}
      
      {/* Our Process Section */}
      <section className="cs-process-section">
        <h2 className="cs-section-title">Our Approach to Client Success</h2>
        <div className="cs-process-steps">
          <div className="cs-process-step">
            <div className="cs-step-number">1</div>
            <h3>Discovery</h3>
            <p>We deeply analyze your business challenges, goals, and existing systems to identify opportunities for transformation.</p>
          </div>
          <div className="cs-process-step">
            <div className="cs-step-number">2</div>
            <h3>Strategy</h3>
            <p>We develop a tailored strategy that addresses your specific needs, with clear KPIs and measurable outcomes.</p>
          </div>
          <div className="cs-process-step">
            <div className="cs-step-number">3</div>
            <h3>Implementation</h3>
            <p>Our expert team executes the strategy with precision, ensuring minimal disruption to your operations.</p>
          </div>
          <div className="cs-process-step">
            <div className="cs-step-number">4</div>
            <h3>Optimization</h3>
            <p>We continuously monitor, measure, and refine the solution to ensure optimal performance and ROI.</p>
          </div>
        </div>
      </section>

      {/* Bottom CTA section */}
      <section className="cs-cta-section">
        <h2>Ready to create your own success story?</h2>
        <p>Let's discuss how we can help transform your business</p>
        <Link to="/contact" className="cs-btn cs-btn-primary">Get in Touch</Link>
      </section>
    </div>
  );
};

export default CaseStudiesPage; 