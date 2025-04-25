'use client';

function Hero() {
  return (
    <section className="relative flex flex-col items-center justify-center min-h-[70vh]">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url("/images/hero.png")', // Replace with your image path
          opacity: '40' // Adjust opacity as needed
        }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-primary/10 via-primary/5 to-background" />
      
      {/* Content */}
      <div className="container relative px-4 mx-auto text-center space-y-8 z-10">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl text-blue-600">
          Welcome to <span className="text-blue-600">Coin Tide</span>
        </h1>
        <p className="mx-auto max-w-[700px] text-muted-foreground text-lg sm:text-xl text-white">
        Coin Tide is a web-based application that helps users monitor live cryptocurrency prices and trends. Whether you're a casual crypto fan or an active investor, cointide offers a sleek and simple way to stay informed. The goal is to combine data, design, and functionality to bring users closer to the ever-changing crypto market.
        </p>
      </div>
    </section>
  );
}

export default Hero;
