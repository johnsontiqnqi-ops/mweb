// Product structure confirmed by the manufacturer. Brand and company names are confirmed; contact details remain placeholders.
export const brand = {
  name: 'ARHAT', companyName: 'Arhat trade services LLC.', email: '', phone: '',
  address: 'Company location to be announced',
  heroVideo: '/media/combo-hero-blue.webm',
  companyImage: '/media/company.jpg', factoryImage: '/media/factory.jpg',
};
export const products = [
  {
    id: 'modular-combo', type: 'combo', name: 'The Modular Combo',
    line: 'Three layers. One personal fit.', category: '01 / THE COMPLETE COMBO',
    description: 'A 5cm soft top, a 10cm medium middle and a 10cm firm base. Three individually covered layers, joined by button straps and a zipper connection. A mattress built in parts, designed to work as one.',
    height: '25 cm', feel: 'Soft / Medium / Firm',
    construction: 'The 5cm soft top attaches with button straps. The 10cm medium middle and 10cm firm base each have a zipper on one connecting face. Their facing zippers join the two layers. Add a separately supplied 10cm double-sided zipper module between them for a 35cm configuration.',
  },
  {
    id: 'zip-extension', type: 'extension', name: 'The Zip Extension',
    line: 'More height. The same connection.', category: '02 / THE EXTENSION MODULE',
    description: 'An additional 10cm mattress module with a zipper on both connecting faces. Insert it between the middle layer and the base of the Combo to increase the total height from 25cm to 35cm. Available in medium or firm.',
    height: '+10 cm', feel: 'Medium or Firm',
    construction: 'A 10cm module with zippers on both upper and lower connecting faces. The upper zipper connects to the Combo’s medium middle layer; the lower zipper connects to its firm base. Choose medium or firm. This product is the extension module only; the Combo is separate.',
  },
];
export function getConfiguration(product, extension, firmness) {
  return product.type === 'extension'
    ? `10cm Zip Extension · ${firmness} · module only`
    : extension ? `35cm Combo configuration · 5cm Soft + 10cm Medium + 10cm ${firmness} extension + 10cm Firm base`
    : '25cm Combo · 5cm Soft + 10cm Medium + 10cm Firm';
}
