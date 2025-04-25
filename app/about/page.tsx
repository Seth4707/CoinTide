import Image from 'next/image';
import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl font-bold mb-6">About Coin Tide</h1>
        <div className="max-w-6xl mx-auto space-y-6">
          <p className="text-xl text-muted-foreground text-center font-bold">
            Welcome to Coin Tide — Ride the Waves of Crypto Price Fluctuations
          </p>
          <p className="text-lg text-muted-foreground text-justify">
            Coin Tide is a sleek, data-driven, and fully responsive frontend-only web application 
            built to simplify the process of tracking, analyzing, and managing cryptocurrency data 
            in real-time. It empowers users with reliable insights, beautiful chart visualizations, 
            and intuitive features — all designed with usability and performance in mind.
          </p>
          <p className="text-lg text-muted-foreground text-justify">
            This project was conceptualized and developed by Adeleye Oluwadamilare Seth as the final 
            project for completion of the Front-End Web Development program at Softlyft Digital Centre. 
            Built with modern web technologies including React, Next.js, and TailwindCSS, Coin Tide 
            represents the culmination of extensive learning and practical application of frontend 
            development principles.
          </p>
          <p className="text-lg text-muted-foreground text-justify">
            Our platform offers comprehensive cryptocurrency tracking capabilities, real-time price 
            updates, detailed market analytics, and an intuitive interface for monitoring your favorite 
            digital assets. Whether you're a seasoned crypto investor or just getting started, 
            Coin Tide provides the tools and insights you need to navigate the dynamic world of 
            cryptocurrency.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div className="space-y-6">
          <h2 className="text-3xl font-semibold">Our Mission</h2>
          <p className="text-muted-foreground text-justify">
            We strive to democratize access to cryptocurrency market data, providing traders and investors with accurate, real-time information and powerful analytics tools to make informed decisions.
          </p>
          <ul className="space-y-4">
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Real-time market data and analytics
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Comprehensive cryptocurrency insights
            </li>
            <li className="flex items-start">
              <svg className="h-6 w-6 text-primary mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              User-friendly trading tools
            </li>
          </ul>
        </div>
        <div className="relative h-[400px] rounded-lg overflow-hidden shadow-xl">
          <Image
            src="/Images/crypto 1.png"  // Updated to match your file name
            alt="Crypto Trading Dashboard"
            fill={true}
            sizes="(max-width: 768px) 100vw, 50vw"
            style={{ objectFit: 'cover' }}
            priority={true}
            className="hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <div className="p-6 rounded-lg border bg-card">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Real-Time Updates</h3>
          <p className="text-muted-foreground">
            Get instant updates on cryptocurrency prices, market trends, and trading volumes.
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Advanced Analytics</h3>
          <p className="text-muted-foreground">
            Access powerful analytical tools and charts for technical analysis.
          </p>
        </div>
        <div className="p-6 rounded-lg border bg-card">
          <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <svg className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure Platform</h3>
          <p className="text-muted-foreground">
            Enterprise-grade security to protect your data and transactions.
          </p>
        </div>
      </div>

      {/* Founder Section */}
      <div className="mb-16">
        <h2 className="text-3xl font-semibold mb-12 text-center">Meet the Founder</h2>
        <div className="flex flex-col md:flex-row items-center max-w-7xl mx-auto justify-center">
          <div className="w-64 h-64 relative rounded-full overflow-hidden shadow-xl mb-8 md:mb-0 md:mr-[70px] mx-auto md:mx-0">
            <Image
              src="/Images/Seth.jpg"
              alt="Adeleye Oluwadamilare Seth"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="text-center md:text-left md:max-w-2xl">
            <h3 className="text-2xl font-semibold">Adeleye Oluwadamilare Seth</h3>
            <p className="text-lg text-primary font-medium">Front End Developer</p>
            <p className="text-muted-foreground">
              As the founder and developer of Coin Tide, I am passionate about creating intuitive and powerful tools 
              for cryptocurrency enthusiasts. This project represents the culmination of my journey at 
              Softlyft Digital Centre's Front-End Web Development program, where I combined my technical skills 
              in React, Next.js, and TailwindCSS with my vision for accessible crypto market data.
              My goal is to provide users with a seamless experience in tracking and analyzing cryptocurrency markets,
              making complex data easily digestible for both beginners and experienced traders alike.
            </p>
          </div>
        </div>
      </div>

      {/* Contact CTA */}
      <div className="text-center bg-card p-12 rounded-lg">
        <h2 className="text-3xl font-semibold mb-4">Get in Touch</h2>
        <p className="text-muted-foreground mb-6">
          Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
        </p>
        <Link href="/contact">
          <button className="bg-primary text-primary-foreground px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors">
            Contact Us
          </button>
        </Link>
      </div>
    </div>
  );
}




