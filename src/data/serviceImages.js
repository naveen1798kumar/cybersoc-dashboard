// Websites & Software Services
import StaticWebsite from "../assets/our-services/services-list/websites-and-softwares/static-website.jpg";
import DynamicWebsite from "../assets/our-services/services-list/websites-and-softwares/dynamic-website.jpg";
import EcommerceWebsite from "../assets/our-services/services-list/websites-and-softwares/ecommerce-website.jpg";
import WebApplication from "../assets/our-services/services-list/websites-and-softwares/web-application.jpg";

// Digital Marketing Services
import ContentWriting from "../assets/our-services/services-list/digital-marketing/content-writing.jpg";
import GoogleAdsPpc from "../assets/our-services/services-list/digital-marketing/google-ads-and-ppc.jpg";
import SeoInCoimbatore from "../assets/our-services/services-list/digital-marketing/seo-in-coimbatore.jpg";
import SocialMediaMarketing from "../assets/our-services/services-list/digital-marketing/social-media-marketing.jpg";

// Networking Services
import ServerManagement from "../assets/our-services/services-list/networking/server-management.jpg";
import CloudNetworking from "../assets/our-services/services-list/networking/cloud-networking.jpg";
import FirewallSecurity from "../assets/our-services/services-list/networking/firewall-security.jpg";

// Automation Services
import HomeAutomation from "../assets/our-services/services-list/automation/home-automation.jpg";
import GateAutomation from "../assets/our-services/services-list/automation/gate-automation.jpg";
import CrmErp from "../assets/our-services/services-list/automation/crm-erp.jpg";
import IndustrialAutomation from "../assets/our-services/services-list/automation/industrial-automation.jpg";

// Importing all images for the services offered by the company
import HomeAutomationSection from "../assets/services-images/home-automtion-1.jpg";
import HomeAutomationFAQ from "../assets/services-images/home-automtion-2.jpg";
import GateAutomationSection from "../assets/services-images/gate-automation-3.jpg";
import GateAutomationFAQ from "../assets/services-images/gate-automation-2.jpg";


// Export all images as an object
const serviceImages = {
  websites: {
    static: StaticWebsite,
    dynamic: DynamicWebsite,
    ecommerce: EcommerceWebsite,
    webApp: WebApplication,
  },
  digitalMarketing: {
    contentWriting: ContentWriting,
    googleAdsPpc: GoogleAdsPpc,
    seo: SeoInCoimbatore,
    socialMedia: SocialMediaMarketing,
  },
  networking: {
    serverManagement: ServerManagement,
    cloudNetworking: CloudNetworking,
    firewallSecurity: FirewallSecurity,
  },
  automation: {
    homeAutomation: HomeAutomation,
    gateAutomation: GateAutomation,
    crmErp: CrmErp,
    IndustrialAutomation: IndustrialAutomation,

    HomeAutomationSection: HomeAutomationSection,
    HomeAutomationFAQ: HomeAutomationFAQ,
    GateAutomationSection: GateAutomationSection,
    GateAutomationFAQ: GateAutomationFAQ,
    IndustrialAutomationSection: IndustrialAutomation,
  },
};

export default serviceImages;
