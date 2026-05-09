import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="w-full mt-auto bg-[#f6f3f2] dark:bg-[#1c1b1b] grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 border-t border-[#dcc1ba]/15 font-['Manrope']">
      <div className="space-y-6">
        <div className="text-lg font-bold text-[#1c1b1b] dark:text-[#fcf9f8]">APAPPAREL</div>
        <p className="text-[#56423d] dark:text-[#dcc1ba] max-w-xs text-sm leading-relaxed">
          Elevating the digital commerce experience through editorial curation and artisanal focus.
        </p>
        <div className="flex space-x-4">
          <span className="material-symbols-outlined text-[#994127]">public</span>
          <span className="material-symbols-outlined text-[#994127]">nest_eco_leaf</span>
          <span className="material-symbols-outlined text-[#994127]">share</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf9f8]">Support</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors">About Us</Link></li>
            <li><Link to="/shipping" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors">Shipping</Link></li>
            <li><Link to="/returns" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors">Returns</Link></li>
            <li><Link to="/orders" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors">Order Status</Link></li>
          </ul>
        </div>
        <div className="space-y-4">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf9f8]">Legal</h4>
          <ul className="space-y-2 text-sm">
            <li><Link to="/terms" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors">Terms of Service</Link></li>
            <li><Link to="/privacy" className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors">Privacy Policy</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
