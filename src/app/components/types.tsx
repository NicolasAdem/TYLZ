// types.ts

export interface Feature {
    icon: React.ReactNode;
    title: string;
    description: string;
    demo: string;
  }
  
  export interface PricingPlan {
    name: string;
    price: string;
    features: string[];
    highlighted: boolean;
  }
  
  export interface Testimonial {
    name: string;
    role: string;
    image: string;
    content: string;
    rating: number;
  }
  
  export interface TeamMember {
    name: string;
    role: string;
    imageUrl: string;
  }
  
  export interface FooterColumn {
    title: string;
    links: string[];
  }