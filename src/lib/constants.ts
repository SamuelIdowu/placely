// src/lib/constants.ts
// Single source of truth for Placely engineering disciplines and app-wide constants.

export const DISCIPLINES = [
  'Electrical',
  'Mechanical',
  'Civil',
  'Computer',
  'Chemical',
  'Petroleum',
  'Agricultural',
  'Biomedical',
  'Systems',
  'Structural',
  'Mechatronics',
  'Aeronautical',
  'Environmental',
  'Software',
  'Industrial',
] as const;

export type DisciplineTag = (typeof DISCIPLINES)[number];

// Nigerian states with major SIWES-relevant cities for location dropdowns
export interface StateCity {
  state: string;
  cities: string[];
}

export const NIGERIAN_STATES_AND_CITIES: StateCity[] = [
  { state: 'Lagos', cities: ['Ikeja', 'Victoria Island', 'Lekki', 'Surulere', 'Yaba', 'Apapa', 'Ikorodu', 'Ogba', 'Ajah', 'Badagry'] },
  { state: 'Abuja (FCT)', cities: ['Garki', 'Wuse', 'Maitama', 'Asokoro', 'Jabi', 'Utako', 'Gwarinpa', 'Kubwa', 'Lugbe'] },
  { state: 'Oyo', cities: ['Ibadan', 'Oyo', 'Ogbomoso', 'Iseyin', 'Saki'] },
  { state: 'Ogun', cities: ['Abeokuta', 'Sango Ota', 'Ijebu Ode', 'Ilaro', 'Shagamu'] },
  { state: 'Rivers', cities: ['Port Harcourt', 'Obio-Akpor', 'Eleme', 'Bonny', 'Degema'] },
  { state: 'Kano', cities: ['Kano', 'Fagge', 'Ungogo', 'Kumbotso', 'Dawakin Kudu'] },
  { state: 'Kaduna', cities: ['Kaduna', 'Zaria', 'Kafanchan', 'Soba'] },
  { state: 'Edo', cities: ['Benin City', 'Auchi', 'Ekpoma', 'Uromi'] },
  { state: 'Enugu', cities: ['Enugu', 'Nsukka', 'Oji River', 'Udi'] },
  { state: 'Anambra', cities: ['Awka', 'Onitsha', 'Nnewi', 'Ekwulobia'] },
  { state: 'Delta', cities: ['Warri', 'Sapele', 'Ughelli', 'Asaba', 'Agbor'] },
  { state: 'Abia', cities: ['Umuahia', 'Aba', 'Ohafia'] },
  { state: 'Imo', cities: ['Owerri', 'Orlu', 'Okigwe'] },
  { state: 'Akwa Ibom', cities: ['Uyo', 'Eket', 'Ikot Ekpene', 'Abak'] },
  { state: 'Cross River', cities: ['Calabar', 'Ikom', 'Ogoja'] },
  { state: 'Osun', cities: ['Osogbo', 'Ile-Ife', 'Iwo', 'Ede'] },
  { state: 'Ondo', cities: ['Akure', 'Ondo', 'Owo', 'Ikare'] },
  { state: 'Ekiti', cities: ['Ado-Ekiti', 'Ikere-Ekiti', 'Oye-Ekiti'] },
  { state: 'Kwara', cities: ['Ilorin', 'Offa', 'Omu-Aran'] },
  { state: 'Niger', cities: ['Minna', 'Bida', 'Suleja', 'Kontagora'] },
  { state: 'Kogi', cities: ['Lokoja', 'Okene', 'Idah', 'Kabba'] },
  { state: 'Plateau', cities: ['Jos', 'Bukuru', 'Shendam'] },
  { state: 'Adamawa', cities: ['Yola', 'Mubi', 'Jimeta'] },
  { state: 'Bauchi', cities: ['Bauchi', 'Azare', 'Misau'] },
  { state: 'Borno', cities: ['Maiduguri', 'Biu', 'Bama'] },
  { state: 'Gombe', cities: ['Gombe', 'Dukku', 'Kaltungo'] },
  { state: 'Taraba', cities: ['Jalingo', 'Wukari', 'Bali'] },
  { state: 'Yobe', cities: ['Damaturu', 'Potiskum', 'Gujba'] },
  { state: 'Sokoto', cities: ['Sokoto', 'Tambuwal', 'Gwadabawa'] },
  { state: 'Zamfara', cities: ['Gusau', 'Kaura Namoda', 'Talata Mafara'] },
  { state: 'Kebbi', cities: ['Birnin Kebbi', 'Argungu', 'Yauri'] },
  { state: 'Katsina', cities: ['Katsina', 'Daura', 'Funtua', 'Dutsin-Ma'] },
  { state: 'Jigawa', cities: ['Dutse', 'Hadejia', 'Kazaure'] },
  { state: 'Benue', cities: ['Makurdi', 'Gboko', 'Otukpo'] },
  { state: 'Nasarawa', cities: ['Lafia', 'Keffi', 'Akwanga', 'Nasarawa'] },
  { state: 'Bayelsa', cities: ['Yenagoa', 'Brass', 'Sagbama'] },
  { state: 'Ebonyi', cities: ['Abakaliki', 'Afikpo', 'Onueke'] },
] as const;
