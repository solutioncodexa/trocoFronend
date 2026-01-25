import Layout from '@/components/layout/Layout';
import HeroSection from '@/components/home/HeroSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import CustomOrderCTA from '@/components/home/CustomOrderCTA';
import PromotionBanner from '@/components/home/PromotionBanner';

const Index = () => {
  return (
    <Layout>
      <HeroSection />
      <PromotionBanner />
      <CategoriesSection />
      <FeaturedProducts />
      <CustomOrderCTA />
    </Layout>
  );
};

export default Index;
