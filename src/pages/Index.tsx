import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import HeritageSection from '@/components/home/HeritageSection';
import SurMesureSection from '@/components/home/SurMesureSection';
import ValuePropsSection from '@/components/home/ValuePropsSection';
import CustomOrderCTA from '@/components/home/CustomOrderCTA';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <ValuePropsSection />
      <CategoriesSection />
      <HeritageSection />
      <SurMesureSection />
      <CustomOrderCTA />
    </Layout>
  );
};

export default Index;
