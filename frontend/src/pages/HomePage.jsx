const HomePage = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">

      {/* TopAppBar */}
      <header className="fixed top-0 w-full z-50 bg-[#fcf9f8]/80 dark:bg-[#1c1b1b]/80 backdrop-blur-md">
        <nav className="flex justify-between items-center px-8 py-4 max-w-full mx-auto">
          <div className="text-2xl font-bold tracking-tighter text-[#1c1b1b] dark:text-[#fcf9f8]">ATELIER</div>
          <div className="hidden md:flex items-center space-x-10">
            <a className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-tight" href="#">Clothes</a>
            <a className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors font-['Manrope'] tracking-tight" href="#">Shoes</a>
            <a className="text-[#994127] font-semibold border-b-2 border-[#994127] pb-1 font-['Manrope'] tracking-tight" href="#">New Arrivals</a>
          </div>
          <div className="flex items-center space-x-6">
            <button className="hover:opacity-80 transition-opacity duration-300">
              <span className="material-symbols-outlined text-[#1c1b1b] dark:text-[#fcf9f8]">person</span>
            </button>
            <button className="hover:opacity-80 transition-opacity duration-300 relative">
              <span className="material-symbols-outlined text-[#1c1b1b] dark:text-[#fcf9f8]">shopping_bag</span>
              <span className="absolute -top-1 -right-1 bg-primary text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">2</span>
            </button>
          </div>
        </nav>
      </header>

      <main className="pt-16">

        {/* Hero Section */}
        <section className="relative h-[921px] flex items-center overflow-hidden">
          <div className="absolute inset-0 z-0">
            <img
              alt="Hero"
              className="w-full h-full object-cover"
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuA1086iCCHYK6R8KqQUYeUzP_IHOoNE2GrTsG7e_fzKaUn2gFyof6oKVNhtVpJ2F-X__dOoD3hJRpI-F8ssPNKyuYnrQ0g8WIMyrgnwvkwnS0E-dpGsp7q_Fv2UrXqjKLX_VlifRFUIWK6E6LLg4ooH4XkuFW1K7t5ERN-1_lLtnWr623CyOItJ6Vahl_PD95US2b9STVDfj2ckBwbkklg0c92nyxAc-n0-7wQQJTSLe3Vz_g5tG4YQhDS0SJbb4AXlQW4k3jbmipw"
            />
            <div className="absolute inset-0 bg-on-background/5"></div>
          </div>
          <div className="container mx-auto px-8 relative z-10">
            <div className="max-w-2xl">
              <h1 className="text-6xl md:text-8xl font-extrabold tracking-tighter text-on-surface leading-tight mb-6">
                ESTHÉTIQUE <br /> MODERNE
              </h1>
              <p className="text-xl text-on-surface-variant font-light mb-10 max-w-lg leading-relaxed">
                Curated selections from the world&apos;s most innovative designers, focused on form, function, and the beauty of simplicity.
              </p>
              <a
                className="inline-flex items-center px-10 py-5 primary-gradient text-on-primary rounded-lg font-semibold tracking-wide hover:opacity-90 transition-all scale-95 active:transition-transform"
                href="#new-arrivals"
              >
                Shop New Arrivals
                <span className="material-symbols-outlined ml-2">arrow_forward</span>
              </a>
            </div>
          </div>
        </section>

        {/* Shop by Category (Asymmetric Bento Grid) */}
        <section className="py-32 bg-surface-container-low">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-16">
              <div>
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">Categories</span>
                <h2 className="text-4xl font-bold tracking-tight text-on-surface">Curated Collections</h2>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[700px]">
              {/* Women */}
              <div className="md:col-span-7 relative group overflow-hidden rounded-xl">
                <img
                  alt="Women"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  src="https://lh3.googleusercontent.com/aida-public/AB6AXuDBGoThdeq5pi5q9oVFHhINhDBckoPt-1T9aBAyrmYWuIdFjN7YGSmbl6Q98fysxh3KT62RI009wlzvbp4oMFrb6dd1Qw41X7cL4eAm3sW5j7oyMwmMfgsTjYB9PIOrYniqZVnqDzde0ES59p7L21sQ2j2h6sl8c8C5YLa2VwSuMrIZGSlkWy_iTaRdZpmRM9Dnm-QvyyVEhD54kLzvDFlglTJ3E8hA7PRLjtemWZq7JWh3vr6eiGu-Jf4bnpwvYhr27KvVVNnvS6I"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                <div className="absolute bottom-10 left-10 text-white">
                  <h3 className="text-3xl font-bold mb-2">Women</h3>
                  <p className="text-sm tracking-widest uppercase opacity-80 mb-6">The New Silhouette</p>
                  <button className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-3 rounded-lg text-sm font-semibold hover:bg-white hover:text-black transition-all">Explore Collection</button>
                </div>
              </div>
              {/* Men & Accessories Column */}
              <div className="md:col-span-5 grid grid-rows-2 gap-8">
                <div className="relative group overflow-hidden rounded-xl">
                  <img
                    alt="Men"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCnKH05W8QRT89-p3YByGOmnLUpj-wZBwRApHtyzmgMWBwDjxSvlmSwGtEQwQXm2OZfdId6Wdqq8PPXauHYEYZ4aPFSb2VhpOSCC3ebD8YW1RHNijfs7kG82Don25WJipoWqn_9UwWNWQXmv_AfVo57Es1lV57NDRVpPpGDvxTNMMVc-KyvB5JZuYmuoPHyN6r_WOLF-Jq5mTy5lTatkTTQLTRY6Qw7oNpVHu0fCdg3D5du_PA56V-uwLOvTR6MNirO-6nSYiFLLZA"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold">Men</h3>
                    <p className="text-xs tracking-widest uppercase opacity-80">Tailored Precision</p>
                  </div>
                </div>
                <div className="relative group overflow-hidden rounded-xl">
                  <img
                    alt="Accessories"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDvBkemhJP9JRmMrRBm2st914ytM_DlLjcH1w-e9hdiJAxDoTGnsTxB2ohrLwa2F6sFs3aSA_k9x7YQlnZgP3Owg8nFsBML7z276Oyq4Ucqh1a7PWB9s29GmrLtefQaGT5NAmgQa0F-RddBnZTtN7TQ6hRGjxM3rHpO_xMl-BoDT5Ge0xEbEUbQZVOmdjly-h1W9FsdDBAAmE6Ukdyz43Cemqc72k8GuIKcRspPIaYfOSr8xtz3mk_otkFv75x_8v5-uTF2ekdygY8"
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors"></div>
                  <div className="absolute bottom-8 left-8 text-white">
                    <h3 className="text-2xl font-bold">Accessories</h3>
                    <p className="text-xs tracking-widest uppercase opacity-80">The Finishing Touch</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Featured Products (No Divider Grid) */}
        <section className="py-32 bg-surface" id="new-arrivals">
          <div className="container mx-auto px-8">
            <div className="text-center mb-24">
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-4 block">New Arrivals</span>
              <h2 className="text-5xl font-bold tracking-tighter text-on-surface">The Seasonal Edit</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-x-8 gap-y-20">
              {/* Product 1 */}
              <div className="group">
                <div className="aspect-[3/4] bg-surface-container-highest overflow-hidden mb-6 rounded-lg relative">
                  <img
                    alt="Silk Shirt"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuDnV6wob3RAE4eWK5R51dcf-5Mx_0KLLIqlL4aZ6_VsJYg6Lj5Ytq-kIhGwzjMNd1D6b_gLNmjSo_4TxNhTEfh9eB3E8Yj43xh7vwiIKmVPkZOQ668O7A_MvAYjHURGp3pKjKoSOX-7YZxXz1-ppCy3sAp0GNkpBFD_XdGjUITH4MM83jhqfClthmBAUDsBIOLQGL65suT4JfyugsnihepNW-Ftnz3prcDGCzkQbjN8MDZbQYjXfJ0UttIa1AlxUpGji37dTA9HSDA"
                  />
                  <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="primary-gradient text-white px-6 py-3 rounded-lg shadow-ambient scale-95 hover:scale-100 transition-transform">Quick Buy</button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-on-surface mb-1">Draped Silk Blouse</h3>
                <p className="text-on-surface-variant mb-2">Parchment</p>
                <p className="text-primary font-bold">$245.00</p>
              </div>
              {/* Product 2 */}
              <div className="group">
                <div className="aspect-[3/4] bg-surface-container-highest overflow-hidden mb-6 rounded-lg relative">
                  <img
                    alt="Running Shoe"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCPYonEKVxQrpe7JyKoOBJxanMi6mw7fFT2rnpbGfnfLVMQZLVD0azn6nPn2I0nhL7CxD-VaQVLEYpCJmMkjSru0pd5dRuFqchVhEP3XdscWSuV7sYsrUBsCljFtLO6daUgmqX-LyK5Z4BwRShW6-qSC56r1zfEDNM2pr6WRL5t2xlNDbf2ONhWF_-XyfTB8v-SRTTmItCIE1LjyDiJsN6pQVpYmDhUgBshXlmv-NpjpoQFa9RQ37p33W-Rv3iRj8BQFjkcYxyZ61g"
                  />
                  <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="primary-gradient text-white px-6 py-3 rounded-lg shadow-ambient scale-95 hover:scale-100 transition-transform">Quick Buy</button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-on-surface mb-1">Aero-Luxe Runner</h3>
                <p className="text-on-surface-variant mb-2">Cloud / Slate</p>
                <p className="text-primary font-bold">$180.00</p>
              </div>
              {/* Product 3 */}
              <div className="group">
                <div className="aspect-[3/4] bg-surface-container-highest overflow-hidden mb-6 rounded-lg relative">
                  <img
                    alt="Trench Coat"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuACZ67ThldhMay2zcJCf38Y5Tu03fComC9FvY2fJwKapvmH_ynMKbhDUIqB6P3CAAT6TnG13xnV_hwRc8aOxSXwvKezwfdMJPK1sokWQC7e-WNC1AtKOZEG6hBhCKHfCPmczQOJk-yHs9iSwDQpp7syDt2pzhmH3vtNzhey1gQJ-TG1tllpodtrmi2_MYlq9BH77nodOUTJkas9KettenC_Go4bQFU6Qz_zytLfVtmAaegZR26fcA1W_4VENap1G_pUYxFayyHhgMc"
                  />
                  <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="primary-gradient text-white px-6 py-3 rounded-lg shadow-ambient scale-95 hover:scale-100 transition-transform">Quick Buy</button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-on-surface mb-1">Sculpted Trench</h3>
                <p className="text-on-surface-variant mb-2">Sienna</p>
                <p className="text-primary font-bold">$495.00</p>
              </div>
              {/* Product 4 */}
              <div className="group">
                <div className="aspect-[3/4] bg-surface-container-highest overflow-hidden mb-6 rounded-lg relative">
                  <img
                    alt="Leather Boot"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCxkG_E-Y33RcglSMcwZm_hB3IbgsFZ9ntjtPTW4buRuUAJQQ5wR3aCfQ6h7MGZRERl42POeGi9JlxShV5BzdJwldPU0eMBUkcDptAWiiHVCdHFSpwQKXjX3cicAQre8WvShPjyKa0juPYCzdZn4WDpgdTlq_oiU4UQRgN7mm7SW7ssaCFJnXUADnxUPviOmMoXoSIGrN_XMCBzVIbAN_0kkd_NBzN5V4DV-thoPpJmoAV2ewQVEP72C0SrOuomdFTYwecuk2bi5Y8"
                  />
                  <div className="absolute inset-0 glass-panel opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button className="primary-gradient text-white px-6 py-3 rounded-lg shadow-ambient scale-95 hover:scale-100 transition-transform">Quick Buy</button>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-on-surface mb-1">Heritage Chelsea Boot</h3>
                <p className="text-on-surface-variant mb-2">Deep Walnut</p>
                <p className="text-primary font-bold">$320.00</p>
              </div>
            </div>
          </div>
        </section>

        {/* Brand Story (Asymmetric Layout) */}
        <section className="py-32 bg-surface-container-low overflow-hidden">
          <div className="container mx-auto px-8">
            <div className="flex flex-col md:flex-row items-center gap-20">
              <div className="md:w-1/2 relative">
                <div className="relative z-10 rounded-xl overflow-hidden shadow-ambient transform -rotate-2">
                  <img
                    alt="Brand Story"
                    className="w-full h-[600px] object-cover"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuCCGkYTjRtnVz_zJb8yZsBMzxqgtscJOl6pVSNRT1FvzUavD90XzbU-99wAUzpxHSTbU8S1m2SoZVqsjLZxh-YEsFXBSGGsefKR8ROh15mN4fEvi8tDDiB6ZFjqWRs7y9ClPz--5RYJ8rhjWLU8zW1UsP2lwhw39loqg-qmVtiA3Fz80-Q13FUkb4g9MKblfhrVc_hpu0zRRjAjL5kNHZvvFbhRFOoWADKkg6_sR5ejV0G9eWKGJ2ZGcjVX-I0da1_pCV1LnkNsyVQ"
                  />
                </div>
                <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-primary-container/20 rounded-full blur-3xl z-0"></div>
              </div>
              <div className="md:w-1/2">
                <span className="text-xs font-bold tracking-[0.2em] uppercase text-primary mb-6 block">Our Ethos</span>
                <h2 className="text-5xl font-extrabold tracking-tighter text-on-surface mb-8 leading-tight">Crafting the Future of Wardrobes</h2>
                <div className="space-y-6 text-lg text-on-surface-variant font-light leading-relaxed">
                  <p>
                    ATELIER was founded on the belief that clothing should be a reflection of intent. We reject the cycle of disposable trends in favor of enduring quality and architectural silhouettes.
                  </p>
                  <p>
                    Every piece is sourced from ethical mills and crafted by artisans who share our obsession with detail. From the weight of a silk blouse to the tension of a seam, we believe luxury is felt, not seen.
                  </p>
                </div>
                <div className="mt-12 flex space-x-12">
                  <div>
                    <p className="text-3xl font-bold text-on-surface">100%</p>
                    <p className="text-xs uppercase tracking-widest text-outline mt-1">Ethical Sourcing</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-on-surface">15+</p>
                    <p className="text-xs uppercase tracking-widest text-outline mt-1">Design Partners</p>
                  </div>
                  <div>
                    <p className="text-3xl font-bold text-on-surface">Zero</p>
                    <p className="text-xs uppercase tracking-widest text-outline mt-1">Waste Goal</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer className="w-full mt-auto bg-[#f6f3f2] dark:bg-[#1c1b1b] grid grid-cols-1 md:grid-cols-3 gap-8 px-12 py-16 border-t border-[#dcc1ba]/15 font-['Manrope']">
        <div className="space-y-6">
          <div className="text-lg font-bold text-[#1c1b1b] dark:text-[#fcf9f8]">ATELIER</div>
          <p className="text-[#56423d] dark:text-[#dcc1ba] max-w-xs text-sm leading-relaxed">
            Elevating the digital commerce experience through editorial curation and artisanal focus.
          </p>
          <div className="flex space-x-4">
            <span className="material-symbols-outlined text-[#994127] cursor-pointer hover:opacity-80 transition-opacity">public</span>
            <span className="material-symbols-outlined text-[#994127] cursor-pointer hover:opacity-80 transition-opacity">nest_eco_leaf</span>
            <span className="material-symbols-outlined text-[#994127] cursor-pointer hover:opacity-80 transition-opacity">share</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf9f8]">Support</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors" href="#">Shipping</a></li>
              <li><a className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors" href="#">Returns</a></li>
              <li><a className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors" href="#">Order Status</a></li>
            </ul>
          </div>
          <div className="space-y-4">
            <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf9f8]">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li><a className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors" href="#">Privacy Policy</a></li>
              <li><a className="text-[#56423d] dark:text-[#dcc1ba] hover:text-[#994127] transition-colors" href="#">Terms of Service</a></li>
            </ul>
          </div>
        </div>
        <div className="space-y-6">
          <h4 className="text-xs font-bold uppercase tracking-widest text-[#1c1b1b] dark:text-[#fcf9f8]">Newsletter</h4>
          <p className="text-sm text-[#56423d] dark:text-[#dcc1ba]">Join our inner circle for early access and editorial stories.</p>
          <form className="flex flex-col space-y-3">
            <input
              className="bg-surface-container-low border-none focus:ring-1 focus:ring-[#994127] text-sm py-3 px-4 rounded-lg outline-none transition-all"
              placeholder="Email address"
              type="email"
            />
            <button className="bg-[#994127] text-white py-3 px-6 rounded-lg text-sm font-semibold hover:opacity-90 transition-opacity">Subscribe</button>
          </form>
          <p className="text-[#56423d] dark:text-[#dcc1ba] text-xs pt-4 opacity-60">© 2024 Atelier Editorial. All rights reserved.</p>
        </div>
      </footer>

    </div>
  );
};

export default HomePage;
