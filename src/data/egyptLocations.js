/**
 * Comprehensive Egypt locations dataset
 * Structure: { governorate: string, cities: string[] }
 * Covers all 27 governorates with major cities, districts & neighborhoods
 */
const egyptLocations = [
  {
    governorate: "Cairo",
    cities: [
      "Nasr City", "Heliopolis", "Maadi", "New Cairo", "Zamalek",
      "Downtown Cairo", "Garden City", "Dokki", "Mohandessin", "Agouza",
      "Shubra", "Ain Shams", "Matariya", "Helwan", "15th of May City",
      "Badr City", "New Administrative Capital", "Obour City", "Shorouk City",
      "Al-Rehab City", "Madinaty", "Fifth Settlement", "First Settlement",
      "Tagamoa", "El Manteqah El Ola", "Ard El Lewa", "Boulaq", "Rod El Farag",
      "Zeitoun", "Basatin", "Dar El Salam", "Salam City", "El Marg", "El Matareya",
      "Badr", "10th of Ramadan", "Qattamiya", "Mokattam", "Manshiyat Nasser"
    ]
  },
  {
    governorate: "Giza",
    cities: [
      "6th of October City", "Sheikh Zayed", "Smart Village", "Haram",
      "Faisal", "Agouza (Giza)", "Imbaba", "Kit Kat", "Boulaq El Dakrour",
      "Omraneya", "Awsim", "Kerdasa", "Abu El Nomros", "Badrashin",
      "Saqqara", "Dahshour", "Abo Rawash", "Al Wahat Road", "Mansoureya",
      "Ard El Golf", "El Ahram", "El Remaya Square", "Tersa", "Giza City Centre"
    ]
  },
  {
    governorate: "Alexandria",
    cities: [
      "Smouha", "Gleem", "San Stefano", "Montazah", "Borg El Arab",
      "Sidi Bishr", "Miami", "Mandara", "Maamoura", "Stanley",
      "Bolkly", "Saba Pasha", "Azarita", "Ramleh Station", "Ibrahimiya",
      "Bahary", "El Anfushi", "El Gomrok", "Abu Qir", "Agami",
      "Hannoville", "King Mariout", "Amreya", "El Dekhila", "El Max",
      "Sidi Gaber", "Cleopatra", "Roshdi", "Loran", "Kafr Abdo",
      "El Asafra", "El Meks", "El Bitash", "New Borg El Arab"
    ]
  },
  {
    governorate: "Aswan",
    cities: [
      "Aswan City", "Kom Ombo", "Edfu", "Daraw", "Abu Simbel",
      "Nasr El Nuba", "El Sebaiya", "Gharb Saheil", "Kalabsha"
    ]
  },
  {
    governorate: "Luxor",
    cities: [
      "Luxor City", "Karnak", "West Bank", "New Gurna", "Armant",
      "Esna", "Isna", "Tod", "El Qurna", "East Luxor", "El Bayadiya"
    ]
  },
  {
    governorate: "Suez",
    cities: [
      "Suez City", "Port Tewfik", "El Arbaeen", "Faisal (Suez)",
      "Attaka", "El Genaina", "Ain Sokhna", "El Adabia", "Mostorod"
    ]
  },
  {
    governorate: "Port Said",
    cities: [
      "Port Said City", "Damietta Road", "El Arab District", "Zohour",
      "El Manakh", "Port Fuad", "El Dawahi", "El Sharq", "El Daoud"
    ]
  },
  {
    governorate: "Ismailia",
    cities: [
      "Ismailia City", "Abu Suweir", "El Tal El Kabir", "Fayed",
      "Qantara Sharq", "Qantara Gharb", "Abbasiya", "Kassassin"
    ]
  },
  {
    governorate: "Fayoum",
    cities: [
      "Fayoum City", "Ibsheway", "Sinnuris", "Yusuf El Seddiq",
      "Tamiya", "El Agameein", "Qarun Lake Area", "Tunis Village"
    ]
  },
  {
    governorate: "Minya",
    cities: [
      "Minya City", "Maghagha", "Beni Mazar", "Matai", "Samalut",
      "Abu Qirqas", "Mallawi", "Dairut", "El Adwa", "Hapo"
    ]
  },
  {
    governorate: "Assiut",
    cities: [
      "Assiut City", "Dayrout", "Manfalout", "Abnoub", "Abu Tig",
      "Sahel Selim", "El Ghanaim", "El Badari", "Qusiya"
    ]
  },
  {
    governorate: "Sohag",
    cities: [
      "Sohag City", "Akhmim", "Girga", "Tahta", "El Balyana",
      "El Maragha", "El Monsha'a", "Dar El Salam (Sohag)", "Juhayna"
    ]
  },
  {
    governorate: "Qena",
    cities: [
      "Qena City", "Nag Hammadi", "Qus", "Deshna", "Farshout",
      "Abu Tesht", "El Waqf", "Naqada"
    ]
  },
  {
    governorate: "Red Sea",
    cities: [
      "Hurghada", "El Gouna", "Safaga", "El Quseir", "Marsa Alam",
      "Ras Gharib", "Sharm El Sheikh (Red Sea side)", "Halayeb",
      "Shalatin", "Soma Bay", "Makadi Bay"
    ]
  },
  {
    governorate: "New Valley",
    cities: [
      "Kharga", "Dakhla", "Farafra", "Baris", "Mut",
      "El Qasr", "Paris", "Balat"
    ]
  },
  {
    governorate: "Matrouh",
    cities: [
      "Marsa Matrouh", "El Alamein", "Ras El Bar", "Siwa Oasis",
      "Dabaa", "El Hamam", "El Negila", "Sidi Barani"
    ]
  },
  {
    governorate: "North Sinai",
    cities: [
      "Arish", "Sheikh Zuweid", "Rafah", "Bir El Abd",
      "El Hasna", "Nakhl", "Nekhel", "Qantara Sharq (Sinai)"
    ]
  },
  {
    governorate: "South Sinai",
    cities: [
      "Sharm El Sheikh", "Dahab", "Nuweiba", "Taba",
      "Saint Catherine", "Ras El Naqab", "Abu Rudeis", "El Tor"
    ]
  },
  {
    governorate: "Dakahlia",
    cities: [
      "Mansoura", "Talkha", "Mit Ghamr", "Aga", "Belqas",
      "Dekernes", "El Senbellawein", "Manzala", "Shirbin", "Beni Obeid",
      "Gamasa", "Nabarouh", "Meit Shalsh", "Tamy El Amded"
    ]
  },
  {
    governorate: "Sharqia",
    cities: [
      "Zagazig", "10th of Ramadan City", "Bilbeis", "Minya El Qamh",
      "Abu Hammad", "Kafr Saqr", "Faqous", "El Husseiniya",
      "Hehia", "Diyarb Negm", "Abu Kebir", "El Ibrahimiya",
      "El Qanayat", "Awlad Saqr"
    ]
  },
  {
    governorate: "Qalyubia",
    cities: [
      "Banha", "Shubra El Kheima", "Qalyub", "Tukh", "Khanka",
      "El Khankah", "El Obour", "Shebin El Qanatir", "Abu Zaabal",
      "El Qanater El Khayria", "Qaha", "Mostorod"
    ]
  },
  {
    governorate: "Kafr El Sheikh",
    cities: [
      "Kafr El Sheikh City", "Desouq", "Fuwa", "El Hamoul",
      "Baltim", "Metobas", "Sidi Salem", "Qallin", "Burullus",
      "El Reyad", "El Borlos"
    ]
  },
  {
    governorate: "Gharbia",
    cities: [
      "Tanta", "El Mahalla El Kubra", "Kafr El Zayat", "Zefta",
      "El Santah", "Samanoud", "Qutour", "Basyoun"
    ]
  },
  {
    governorate: "Monufia",
    cities: [
      "Shebin El Kom", "Menouf", "Ashmoun", "Quesna", "Birket El Sab",
      "El Bagor", "Sirs El Layan", "Tala", "Sadat City"
    ]
  },
  {
    governorate: "Beheira",
    cities: [
      "Damanhur", "Kafr El Dawar", "Rashid (Rosetta)", "Abu El Matamir",
      "Desouq (Beheira)", "Housh Issa", "El Mahmoudiya", "Itay El Barud",
      "Wadi El Natrun", "El Delengat", "Shubrakhit", "Abu Hummus", "Edku"
    ]
  },
  {
    governorate: "Damietta",
    cities: [
      "Damietta City", "New Damietta", "Ras El Bar", "Faraskour",
      "Kafr Saad", "Kafr El Battikh", "Ez El Din", "Zarqa", "Meit Abou Ghalib"
    ]
  },
  {
    governorate: "Beni Suef",
    cities: [
      "Beni Suef City", "Nasser City (Beni Suef)", "El Wasta",
      "Beba", "Fashn", "Sumasta El Waqf", "Ihnasia El Madina", "Abu Sir El Malaaq"
    ]
  }
];

/**
 * Flattens the hierarchical data into a searchable list of location objects
 * Each item: { label: string, city: string, governorate: string }
 */
export const flatLocations = egyptLocations.flatMap(({ governorate, cities }) =>
  cities.map(city => ({
    label: `${city}, ${governorate}`,
    city,
    governorate,
  }))
);

// Also export governorates-only list for simple use cases
export const governorates = egyptLocations.map(g => g.governorate);

export default egyptLocations;
