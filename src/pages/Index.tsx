import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import BeldiCollection from '@/components/home/BeldiCollection';
import HeritageSection from '@/components/home/HeritageSection';
import SurMesureSection from '@/components/home/SurMesureSection';
import ModernCollection from '@/components/home/ModernCollection';
import TestimonialSection from '@/components/home/TestimonialSection';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <BeldiCollection />
      <HeritageSection />
      <SurMesureSection />
      <ModernCollection />
      <TestimonialSection />
    </Layout>
  );
};

export default Index;
