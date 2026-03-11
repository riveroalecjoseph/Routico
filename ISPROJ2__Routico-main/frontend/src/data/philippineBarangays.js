// Barangay data organized by City name
// Covers major cities across the Philippines

const philippineBarangays = {
  // === NCR - Metro Manila ===
  'Quezon City': [
    'Bagong Pag-asa', 'Bahay Toro', 'Balintawak', 'Bago Bantay', 'Batasan Hills',
    'Commonwealth', 'Culiat', 'Diliman', 'Fairview', 'Holy Spirit',
    'Kamuning', 'Katipunan', 'Krus na Ligas', 'Loyola Heights', 'Matandang Balara',
    'New Era', 'Novaliches Proper', 'Pag-asa', 'Pinyahan', 'Project 6',
    'San Francisco del Monte', 'Sikatuna Village', 'South Triangle', 'Tandang Sora',
    'Teachers Village East', 'Teachers Village West', 'U.P. Campus', 'Vasra', 'West Triangle'
  ],
  'Manila': [
    'Binondo', 'Ermita', 'Intramuros', 'Malate', 'Paco',
    'Pandacan', 'Quiapo', 'Sampaloc', 'San Andres', 'San Miguel',
    'San Nicolas', 'Santa Ana', 'Santa Cruz', 'Santa Mesa', 'Tondo',
    'Port Area', 'San Antonio', 'Sta. Mesa Heights'
  ],
  'Makati': [
    'Bangkal', 'Bel-Air', 'Carmona', 'Cembo', 'Comembo',
    'Dasmariñas', 'Forbes Park', 'Guadalupe Nuevo', 'Guadalupe Viejo', 'Kasilawan',
    'La Paz', 'Legaspi Village', 'Magallanes', 'Olympia', 'Palanan',
    'Pembo', 'Pinagkaisahan', 'Pio del Pilar', 'Poblacion', 'Rizal',
    'Salcedo Village', 'San Antonio', 'San Isidro', 'San Lorenzo', 'Santa Cruz',
    'Singkamas', 'Tejeros', 'Urdaneta', 'Valenzuela'
  ],
  'Taguig': [
    'Bagumbayan', 'Bambang', 'Calzada', 'Central Bicutan', 'Central Signal Village',
    'Fort Bonifacio', 'Hagonoy', 'Ibayo-Tipas', 'Katuparan', 'Ligid-Tipas',
    'Lower Bicutan', 'Maharlika Village', 'Napindan', 'New Lower Bicutan', 'North Daang Hari',
    'North Signal Village', 'Palingon', 'Pinagsama', 'San Miguel', 'Santa Ana',
    'South Daang Hari', 'South Signal Village', 'Tanyag', 'Tuktukan', 'Upper Bicutan',
    'Ususan', 'Wawa', 'Western Bicutan'
  ],
  'Pasig': [
    'Bagong Ilog', 'Bagong Katipunan', 'Bambang', 'Buting', 'Caniogan',
    'Dela Paz', 'Kalawaan', 'Kapasigan', 'Kapitolyo', 'Malinao',
    'Manggahan', 'Maybunga', 'Oranbo', 'Palatiw', 'Pinagbuhatan',
    'Pineda', 'Rosario', 'Sagad', 'San Antonio', 'San Joaquin',
    'San Jose', 'San Miguel', 'San Nicolas', 'Santa Cruz', 'Santa Lucia',
    'Santa Rosa', 'Santo Tomas', 'Santolan', 'Sumilang', 'Ugong'
  ],
  'Parañaque': [
    'B.F. Homes', 'Baclaran', 'Don Bosco', 'Don Galo', 'La Huerta',
    'Merville', 'Moonwalk', 'San Antonio', 'San Dionisio', 'San Isidro',
    'San Martin de Porres', 'Santo Niño', 'Sun Valley', 'Sucat', 'Tambo',
    'Vitalez'
  ],
  'Pasay': [
    'Barangay 1', 'Barangay 2', 'Barangay 3', 'Barangay 4', 'Barangay 5',
    'Malibay', 'San Isidro', 'San Jose', 'San Rafael', 'Santa Clara',
    'Santo Niño', 'Villamor Airbase'
  ],
  'Las Piñas': [
    'Almanza Uno', 'Almanza Dos', 'BF International', 'CAA', 'Daniel Fajardo',
    'Elias Aldana', 'Ilaya', 'Manuyo Uno', 'Manuyo Dos', 'Pamplona Uno',
    'Pamplona Dos', 'Pamplona Tres', 'Pilar', 'Pulang Lupa Uno', 'Pulang Lupa Dos',
    'Talon Uno', 'Talon Dos', 'Talon Tres', 'Talon Kuatro', 'Talon Singko',
    'Zapote'
  ],
  'Muntinlupa': [
    'Alabang', 'Ayala Alabang', 'Bayanan', 'Buli', 'Cupang',
    'New Alabang Village', 'Poblacion', 'Putatan', 'Sucat', 'Tunasan'
  ],
  'Caloocan': [
    'Bagong Barrio', 'Bagong Silang', 'Camarin', 'Deparo', 'Grace Park',
    'Llano', 'Maypajo', 'Morning Breeze', 'Sangandaan', 'Tala',
    'Amparo', 'Bagumbong', 'Kaybiga', 'Novaliches North', 'Novaliches South'
  ],
  'Valenzuela': [
    'Arkong Bato', 'Balangkas', 'Bignay', 'Bisig', 'Canumay East',
    'Canumay West', 'Coloong', 'Dalandanan', 'Gen. T. de Leon', 'Isla',
    'Karuhatan', 'Lawang Bato', 'Lingunan', 'Mabolo', 'Malanday',
    'Malinta', 'Mapulang Lupa', 'Marulas', 'Maysan', 'Palasan',
    'Parada', 'Paso de Blas', 'Pariancillo Villa', 'Poblacion', 'Polo',
    'Punturin', 'Rincon', 'Tagalag', 'Ugong', 'Viente Reales', 'Wawang Pulo'
  ],
  'Mandaluyong': [
    'Addition Hills', 'Bagong Silang', 'Barangka Drive', 'Barangka Ibaba',
    'Barangka Ilaya', 'Buayang Bato', 'Burol', 'Daang Bakal', 'Hagdang Bato Itaas',
    'Hagdang Bato Libis', 'Harapin Ang Bukas', 'Highway Hills', 'Hulo',
    'Mabini-J. Rizal', 'Malamig', 'Mauway', 'Namayan', 'New Zañiga',
    'Old Zañiga', 'Pag-asa', 'Plainview', 'Pleasant Hills', 'Poblacion',
    'San Jose', 'Vergara', 'Wack-Wack Greenhills'
  ],
  'San Juan': [
    'Addition Hills', 'Balong-Bato', 'Batis', 'Corazon de Jesus', 'Ermitaño',
    'Greenhills', 'Isabelita', 'Kabayanan', 'Little Baguio', 'Maytunas',
    'Onse', 'Pasadena', 'Pedro Cruz', 'Progreso', 'Rivera',
    'Salapan', 'San Perfecto', 'Santa Lucia', 'Tibagan', 'West Crame'
  ],
  'Marikina': [
    'Barangka', 'Calumpang', 'Concepcion Uno', 'Concepcion Dos', 'Fortune',
    'Industrial Valley', 'Jesus dela Peña', 'Malanday', 'Nangka',
    'Parang', 'San Roque', 'Santa Elena', 'Santo Niño', 'Tañong', 'Tumana'
  ],
  'Malabon': [
    'Acacia', 'Baritan', 'Bayan-Bayanan', 'Catmon', 'Concepcion',
    'Dampalit', 'Flores', 'Hulong Duhat', 'Ibaba', 'Longos',
    'Maysilo', 'Muzon', 'Niugan', 'Panghulo', 'Potrero',
    'San Agustin', 'Santolan', 'Tañong', 'Tinajeros', 'Tonsuya', 'Tugatog'
  ],
  'Navotas': [
    'Bagumbayan North', 'Bagumbayan South', 'Bangculasi', 'Daanghari',
    'Navotas East', 'Navotas West', 'North Bay Boulevard North',
    'North Bay Boulevard South', 'San Jose', 'San Rafael Village',
    'San Roque', 'Sipac-Almacen', 'Tangos', 'Tanza'
  ],
  'Pateros': [
    'Aguho', 'Magtanggol', 'Martires del 96', 'Poblacion', 'San Pedro',
    'San Roque', 'Santa Ana', 'Santo Rosario', 'Tabacalera'
  ],

  // === Region III - Central Luzon ===
  'San Fernando': [
    'Alasas', 'Baliti', 'Bulaon', 'Calulut', 'Dela Paz Norte',
    'Dela Paz Sur', 'Del Carmen', 'Del Pilar', 'Del Rosario', 'Dolores',
    'Juliana', 'Lara', 'Lourdes', 'Magliman', 'Maimpis',
    'Malino', 'Malpitic', 'Pandaras', 'Panipuan', 'Pulung Bulu',
    'Quebiawan', 'Saguin', 'San Agustin', 'San Felipe', 'San Isidro',
    'San Jose', 'San Juan', 'San Nicolas', 'San Pedro', 'Santa Lucia',
    'Santa Teresita', 'Santo Niño', 'Santo Rosario', 'Sindalan', 'Telabastagan'
  ],
  'Angeles': [
    'Agapito del Rosario', 'Anunas', 'Balibago', 'Capaya', 'Claro M. Recto',
    'Cuayan', 'Cutcut', 'Cutud', 'Hensonville', 'Lourdes North West',
    'Lourdes Sur', 'Lourdes Sur East', 'Malabanias', 'Margot', 'Mining',
    'Ninoy Aquino', 'Pampang', 'Pandan', 'Pulung Maragul', 'Salapungan',
    'San Jose', 'San Nicolas', 'Santa Teresita', 'Santo Cristo', 'Santo Domingo',
    'Santo Rosario', 'Sapalibutad', 'Tabun'
  ],
  'Malolos': [
    'Anilao', 'Atlag', 'Babatnin', 'Bagna', 'Balayong',
    'Balite', 'Bangkal', 'Barihan', 'Bulihan', 'Bungahan',
    'Caingin', 'Calero', 'Caliligawan', 'Canalate', 'Catmon',
    'Cofradia', 'Dakila', 'Guinhawa', 'Ligas', 'Longos',
    'Look 1st', 'Look 2nd', 'Lugam', 'Mabolo', 'Mambog',
    'Masile', 'Matimbo', 'Mojon', 'Namayan', 'Niugan',
    'Pamarawan', 'Panasahan', 'Pinagbakahan', 'San Agustin', 'San Gabriel',
    'San Juan', 'San Pablo', 'San Vicente', 'Santiago', 'Santisima Trinidad',
    'Santo Cristo', 'Santo Niño', 'Santo Rosario', 'Sumapang Bata', 'Sumapang Matanda',
    'Taal', 'Tikay'
  ],
  'San Jose del Monte': [
    'Assumption', 'Bagong Buhay', 'Citrus', 'Ciudad Real', 'Dulong Bayan',
    'Fatima', 'Francisco Homes-Guijo', 'Francisco Homes-Mulawin', 'Francisco Homes-Narra',
    'Francisco Homes-Yakal', 'Graceville', 'Gumaoc East', 'Gumaoc West', 'Kaypian',
    'Lawang Pari', 'Maharlika', 'Minuyan Proper', 'Muzon', 'Paradise III',
    'Poblacion', 'San Isidro', 'San Manuel', 'San Martin', 'San Pedro',
    'San Rafael', 'San Roque', 'Santa Cruz', 'Santo Cristo', 'Santo Niño',
    'Sapang Palay', 'Tungkong Mangga'
  ],

  // === Region IV-A - CALABARZON ===
  'Antipolo': [
    'Bagong Nayon', 'Beverly Hills', 'Calawis', 'Cupang', 'Dalig',
    'Dela Paz', 'Inarawan', 'Mambugan', 'Mayamot', 'Muntingdilaw',
    'San Isidro', 'San Jose', 'San Juan', 'San Luis', 'San Roque',
    'Santa Cruz', 'Santo Niño'
  ],
  'Santa Rosa': [
    'Aplaya', 'Balibago', 'Caingin', 'Dila', 'Dita',
    'Don Jose', 'Ibaba', 'Kanluran', 'Labas', 'Macabling',
    'Malitlit', 'Malusak', 'Market Area', 'Pook', 'Pooc',
    'Pulong Santa Cruz', 'Santo Domingo', 'Sinalhan', 'Tagapo'
  ],
  'Calamba': [
    'Bagong Kalsada', 'Banlic', 'Barandal', 'Batino', 'Bubuyan',
    'Bucal', 'Bunggo', 'Burol', 'Camaligan', 'Canlubang',
    'Halang', 'Hornalan', 'Kay-anlog', 'La Mesa', 'Laguerta',
    'Lawa', 'Lecheria', 'Lingga', 'Looc', 'Mabato',
    'Makiling', 'Mapagong', 'Masili', 'Maunong', 'Milagrosa',
    'Paciano Rizal', 'Palingon', 'Palo-Alto', 'Pansol', 'Parian',
    'Real', 'Saimsim', 'Sampiruhan East', 'Sampiruhan West', 'San Cristobal',
    'San Jose', 'San Juan', 'Sirang Lupa', 'Sucol', 'Turbina', 'Ulango', 'Uwisan'
  ],
  'Imus': [
    'Alapan I-A', 'Alapan I-B', 'Alapan I-C', 'Alapan II-A', 'Alapan II-B',
    'Anabu I-A', 'Anabu I-B', 'Anabu I-C', 'Anabu I-D', 'Anabu II-A',
    'Anabu II-B', 'Anabu II-C', 'Anabu II-D', 'Bayan Luma I', 'Bayan Luma II',
    'Bayan Luma III', 'Bayan Luma IV', 'Bayan Luma V', 'Bayan Luma VI',
    'Buhay na Tubig', 'Carsadang Bago I', 'Carsadang Bago II', 'Magdalo',
    'Malagasang I-A', 'Malagasang I-B', 'Malagasang I-C', 'Malagasang I-D',
    'Malagasang II-A', 'Malagasang II-B', 'Mariano Espeleta I', 'Mariano Espeleta II',
    'Mariano Espeleta III', 'Medicion I-A', 'Medicion I-B', 'Medicion II-A',
    'Medicion II-B', 'Palico I', 'Palico II', 'Palico III', 'Palico IV',
    'Pasong Buaya I', 'Pasong Buaya II', 'Poblacion I-A', 'Poblacion I-B',
    'Poblacion II-A', 'Poblacion II-B', 'Poblacion III-A', 'Poblacion III-B',
    'Poblacion IV-A', 'Poblacion IV-B', 'Tanzang Luma I', 'Tanzang Luma II',
    'Tanzang Luma III', 'Tanzang Luma IV', 'Tanzang Luma V', 'Tanzang Luma VI',
    'Toclong I-A', 'Toclong I-B', 'Toclong I-C', 'Toclong II-A', 'Toclong II-B'
  ],
  'Bacoor': [
    'Alima', 'Aniban I', 'Aniban II', 'Aniban III', 'Aniban IV',
    'Aniban V', 'Daang Bukid', 'Habay I', 'Habay II', 'Kaingin',
    'Ligas I', 'Ligas II', 'Ligas III', 'Mabolo I', 'Mabolo II',
    'Mabolo III', 'Maliksi I', 'Maliksi II', 'Maliksi III', 'Molino I',
    'Molino II', 'Molino III', 'Molino IV', 'Molino V', 'Molino VI',
    'Molino VII', 'Niog I', 'Niog II', 'Niog III', 'Poblacion',
    'Queens Row East', 'Queens Row West', 'Real I', 'Real II', 'Salinas I',
    'Salinas II', 'Salinas III', 'Salinas IV', 'San Nicolas I', 'San Nicolas II',
    'San Nicolas III', 'Sineguelasan', 'Tabing Dagat', 'Talaba I', 'Talaba II',
    'Talaba III', 'Talaba IV', 'Talaba V', 'Talaba VI', 'Talaba VII', 'Zapote I',
    'Zapote II', 'Zapote III', 'Zapote IV', 'Zapote V'
  ],
  'Dasmariñas': [
    'Burol I', 'Burol II', 'Burol III', 'Datu Esmael', 'Emmanuel Bergado I',
    'Emmanuel Bergado II', 'Fatima I', 'Fatima II', 'Fatima III', 'Langkaan I',
    'Langkaan II', 'Luzviminda I', 'Luzviminda II', 'Paliparan I', 'Paliparan II',
    'Paliparan III', 'Sabang', 'Salawag', 'Salitran I', 'Salitran II',
    'Salitran III', 'Salitran IV', 'Sampaloc I', 'Sampaloc II', 'Sampaloc III',
    'Sampaloc IV', 'Sampaloc V', 'San Agustin I', 'San Agustin II', 'San Agustin III',
    'San Andres I', 'San Andres II', 'San Isidro Labrador I', 'San Isidro Labrador II',
    'San Jose', 'San Luis I', 'San Luis II', 'San Manuel I', 'San Manuel II',
    'San Miguel I', 'San Miguel II', 'San Simon', 'Santa Cristina I', 'Santa Cristina II',
    'Santa Fe', 'Santa Lucia', 'Santo Cristo', 'Santo Niño I', 'Santo Niño II',
    'Zone I', 'Zone I-A', 'Zone II', 'Zone III', 'Zone IV'
  ],
  'General Trias': [
    'Alingaro', 'Arnaldo', 'Bacao I', 'Bacao II', 'Bagumbayan',
    'Biclatan', 'Buenavista I', 'Buenavista II', 'Buenavista III', 'Corregidor',
    'Dulong Bayan', 'Gov. F. Catigtig', 'Javalera', 'Manggahan', 'Navarro',
    'Panungyanan', 'Pasong Camachile I', 'Pasong Camachile II', 'Pinagtipunan',
    'Poblacion I', 'Poblacion II', 'Poblacion III', 'Prinza', 'San Francisco',
    'San Gabriel', 'San Juan I', 'San Juan II', 'Santa Clara', 'Santiago',
    'Tapia', 'Tejero'
  ],
  'Batangas City': [
    'Alangilan', 'Balagtas', 'Balete', 'Banaba Center', 'Banaba Ibaba',
    'Banaba Kanluran', 'Bolbok', 'Bukal', 'Calicanto', 'Cuta',
    'Diversion Road', 'Gulod Itaas', 'Kumintang Ibaba', 'Kumintang Ilaya', 'Libjo',
    'Mahabang Dahilig', 'Malitam', 'Pallocan Kanluran', 'Pallocan Silangan',
    'Pinamucan Ibaba', 'Poblacion', 'San Isidro', 'Simlong', 'Sorosoro Ibaba',
    'Sorosoro Ilaya', 'Tabangao', 'Talahib Pandayan', 'Talahib Payapa', 'Tinga Itaas', 'Wawa'
  ],
  'Lucena': [
    'Barra', 'Bocohan', 'Cotta', 'Dalahican', 'Domoit',
    'Gulang-Gulang', 'Ibabang Dupay', 'Ibabang Iyam', 'Ilayang Dupay', 'Ilayang Iyam',
    'Isabang', 'Market View', 'Mayao Crossing', 'Mayao Kanluran', 'Mayao Silangan',
    'Poblacion I', 'Poblacion II', 'Poblacion III'
  ],

  // === Region VII - Central Visayas ===
  'Cebu City': [
    'Apas', 'Banilad', 'Basak Pardo', 'Basak San Nicolas', 'Busay',
    'Calamba', 'Capitol Site', 'Carreta', 'Cogon Pardo', 'Cogon Ramos',
    'Day-as', 'Duljo-Fatima', 'Ermita', 'Guadalupe', 'Hipodromo',
    'Inayawan', 'Kasambagan', 'Labangon', 'Lahug', 'Lorega San Miguel',
    'Luz', 'Mabolo', 'Mambaling', 'Pahina Central', 'Pahina San Nicolas',
    'Pardo', 'Pari-an', 'Poblacion Pardo', 'Sambag I', 'Sambag II',
    'San Antonio', 'San Jose', 'San Nicolas Proper', 'San Roque',
    'Santa Cruz', 'Suba', 'T. Padilla', 'Talamban', 'Tisa', 'Zapatera'
  ],
  'Mandaue': [
    'Alang-Alang', 'Bakilid', 'Banilad', 'Basak', 'Cabancalan',
    'Canduman', 'Casili', 'Casuntingan', 'Centro', 'Cubacub',
    'Guizo', 'Ibabao-Estancia', 'Jagobiao', 'Labogon', 'Looc',
    'Maguikay', 'Mantuyong', 'Opao', 'Pagsabungan', 'Subangdaku',
    'Tabok', 'Tawason', 'Tingub', 'Tipolo', 'Umapad'
  ],
  'Lapu-Lapu': [
    'Agus', 'Babag', 'Bankal', 'Basak', 'Buaya',
    'Calawisan', 'Canjulao', 'Caubian', 'Gun-ob', 'Ibo',
    'Looc', 'Mactan', 'Maribago', 'Marigondon', 'Pajac',
    'Pajo', 'Poblacion', 'Punta Engaño', 'Pusok', 'Sabang',
    'Santa Rosa', 'Subabasbas', 'Talima', 'Tingo', 'Tungasan'
  ],

  // === Region XI - Davao ===
  'Davao City': [
    'Agdao', 'Bajada', 'Bangkal', 'Bago Aplaya', 'Bago Gallera',
    'Bago Oshiro', 'Buhangin', 'Bunawan', 'Cabantian', 'Calinan',
    'Catalunan Grande', 'Catalunan Pequeño', 'Ecoland', 'Guadalupe',
    'Indangan', 'Langub', 'Ma-a', 'Maa', 'Mabini', 'Mandug',
    'Matina Aplaya', 'Matina Crossing', 'Matina Pangi', 'Mintal',
    'Pampanga', 'Panacan', 'Poblacion', 'Sasa', 'Talomo',
    'Tigatto', 'Toril', 'Vicente Hizon'
  ],

  // === Region X - Northern Mindanao ===
  'Cagayan de Oro': [
    'Agusan', 'Balulang', 'Bayabas', 'Bonbon', 'Bugo',
    'Bulua', 'Camaman-an', 'Carmen', 'Consolacion', 'Cugman',
    'Gusa', 'Iponan', 'Kauswagan', 'Lapasan', 'Macabalan',
    'Macasandig', 'Nazareth', 'Patag', 'Puerto', 'Puntod',
    'Tablon', 'Tignapoloan', 'Tuburan', 'Westbound'
  ],

  // === Region XII - SOCCSKSARGEN ===
  'General Santos': [
    'Apopong', 'Baluan', 'Bula', 'Calumpang', 'City Heights',
    'Conel', 'Dadiangas East', 'Dadiangas North', 'Dadiangas South', 'Dadiangas West',
    'Fatima', 'Katangawan', 'Labangal', 'Lagao', 'Mabuhay',
    'San Isidro', 'Siguel', 'Sinawal', 'Tambler', 'Tinagacan', 'Upper Labay'
  ],

  // === CAR ===
  'Baguio': [
    'A. Bonifacio-Caguioa-Rimando', 'Abanao-Zandueta-Kayong-Chugum-Otek',
    'Andres Bonifacio', 'Aurora Hill Proper', 'Aurora Hill North Central',
    'Aurora Hill South Central', 'BGH Compound', 'Brookside', 'Burnham-Legarda',
    'Cabinet Hill-Teacher\'s Camp', 'Camp 7', 'Camp 8', 'Camp Allen',
    'City Camp Central', 'Country Club Village', 'DPS Area', 'Dizon Subdivision',
    'Dominican Hill-Mirador', 'Engineers\' Hill', 'Ferdinand', 'General Luna Lower',
    'General Luna Upper', 'Gibraltar', 'Greenwater Village', 'Guisad Central',
    'Happy Hollow', 'Harrison-Claudio Carantes', 'Hillside', 'Holy Ghost Proper',
    'Honeymoon', 'Imelda Village', 'Irisan', 'Kabayanihan', 'Kias',
    'Legarda-Burnham-Kisad', 'Loakan Proper', 'Lopez Jaena', 'Lourdes Subdivision',
    'Lualhati', 'Lucnab', 'Magsaysay Lower', 'Magsaysay Upper', 'Malcolm Square',
    'Manuel A. Roxas', 'MRR-Queen of Peace', 'Middle Quezon Hill', 'Military Cut-Off',
    'Mines View Park', 'Modern Site', 'North Sanitary Camp', 'Outlook Drive',
    'Pacdal', 'Pinsao Pilot Project', 'Pinsao Proper', 'Quezon Hill Proper',
    'Quirino Hill East', 'Quirino Hill West', 'Saint Joseph Village',
    'Salud Mitra', 'San Luis Village', 'San Roque Village', 'San Vicente',
    'Sanitary Camp South', 'Santa Escolastica', 'Session Road Area',
    'Slaughter House Area', 'South Drive', 'Teodora Alonzo', 'Trancoville',
    'Upper General Luna'
  ],

  // === Zambales ===
  'Olongapo': [
    'Asinan', 'Banicain', 'Barretto', 'East Bajac-Bajac', 'East Tapinac',
    'Gordon Heights', 'Kalaklan', 'Mabayuan', 'New Cabalan', 'New Ilalim',
    'New Kababae', 'New Kalalake', 'Old Cabalan', 'Pag-asa', 'Santa Rita',
    'West Bajac-Bajac', 'West Tapinac', 'Elisa', 'Habagat Heights'
  ],
  'Subic': [
    'Aningway Sacatihan', 'Asinan Poblacion', 'Asinan Proper', 'Baraca-Camachile',
    'Batiawan', 'Calapacuan', 'Calapandayan', 'Cawag', 'Ilwas',
    'Mangan-Vaca', 'Matain', 'Naugsol', 'Pamatawan', 'San Isidro',
    'Santo Tomas', 'Wawandue'
  ],
  'Iba': [
    'Amungan', 'Bangantalinga', 'Dirita-Baloguen', 'Lipay', 'Palanginan',
    'Poblacion', 'San Agustin', 'Santa Barbara', 'Santo Rosario', 'Zone 1',
    'Zone 2', 'Zone 3', 'Zone 4', 'Zone 5', 'Zone 6'
  ],

  // === Bataan ===
  'Balanga': [
    'Bagong Silang', 'Cabog-Cabog', 'Camacho', 'Cataning', 'Central',
    'Cupang North', 'Cupang Proper', 'Cupang West', 'Dangcol', 'Ibaba',
    'Malabia', 'Munting Batangas', 'Poblacion', 'Puerto Rivas Ibaba',
    'Puerto Rivas Itaas', 'San Jose', 'Sibacan', 'Talisay', 'Tanato',
    'Tenejero', 'Tortugas', 'Tuyo'
  ],

  // === Bulacan ===
  'Meycauayan': [
    'Bagbaguin', 'Bahay Pare', 'Bancal', 'Banga', 'Bayugo',
    'Caingin', 'Calvario', 'Camalig', 'Hulo', 'Iba',
    'Langka', 'Lawa', 'Libtong', 'Liputan', 'Longos',
    'Malhacan', 'Pajo', 'Pandayan', 'Pantoc', 'Perez',
    'Poblacion', 'Saluysoy', 'Saint Francis', 'Tugatog', 'Ubihan'
  ],
  'Marilao': [
    'Abangan Norte', 'Abangan Sur', 'Ibayo', 'Lambakin', 'Lias',
    'Loma de Gato', 'Nagbalon', 'Patubig', 'Poblacion I', 'Poblacion II',
    'Prenza I', 'Prenza II', 'Santa Rosa I', 'Santa Rosa II', 'Saog',
    'Tabing Ilog'
  ],

  // === Pampanga ===
  'Mabalacat': [
    'Atlu-Bola', 'Bical', 'Bundagul', 'Cacutud', 'Calumpang',
    'Camachiles', 'Dapdap', 'Dau', 'Dolores', 'Duquit',
    'Lakandula', 'Mabiga', 'Macapagal Village', 'Mamatitang', 'Mangalit',
    'Marcos Village', 'Mawaque', 'Paralayunan', 'Poblacion', 'San Francisco',
    'San Joaquin', 'Santa Ines', 'Santa Maria', 'Santo Rosario',
    'Sapang Balen', 'Sapang Biabas', 'Tabun'
  ],

  // === Nueva Ecija ===
  'Cabanatuan': [
    'Aduas Centro', 'Aduas Norte', 'Aduas Sur', 'Bagong Buhay', 'Bagong Sikat',
    'Bakero', 'Bakod Bayan', 'Bantug Bulalo', 'Bantug Norte', 'Barlis',
    'Caalibangbangan', 'Cabu', 'Calabasa', 'Camp Tinio', 'Capitol Site',
    'Dicarma', 'Dionisio S. Garcia', 'Hermogenes C. Concepcion Sr.',
    'Imelda District', 'Isla', 'Kalikid Norte', 'Kalikid Sur',
    'Kapitan Pepe', 'Lagare', 'Matadero', 'Padre Burgos', 'Pagas',
    'Pula', 'Sangitan East', 'Sangitan West', 'San Isidro', 'San Josef Norte',
    'San Josef Sur', 'Santa Arcadia', 'Sumacab Este', 'Sumacab Norte',
    'Sumacab Sur', 'Talipapa', 'Valle Cruz', 'Zulueta'
  ],

  // === Tarlac ===
  'Tarlac City': [
    'Aguso', 'Alvindia', 'Amucao', 'Armenia', 'Asturias',
    'Balanti', 'Balete', 'Balibago I', 'Balibago II', 'Balingcanaway',
    'Banaba', 'Bantog', 'Baras-Baras', 'Batang-Batang', 'Binauganan',
    'Bora', 'Buenavista', 'Buhilit', 'Burot', 'Calingcuan',
    'Capehan', 'Carangian', 'Care', 'Central', 'Cut-Cut I',
    'Cut-Cut II', 'Dalayap', 'Dela Paz', 'Dolores', 'Laoang',
    'Ligtasan', 'Lourdes', 'Mabini', 'Maligaya', 'Maliwalo',
    'Mapalacsiao', 'Matatalaib', 'Paraiso', 'Poblacion', 'Salapungan',
    'San Carlos', 'San Francisco', 'San Isidro', 'San Jose',
    'San Juan de Mata', 'San Luis', 'San Manuel', 'San Miguel',
    'San Nicolas', 'San Rafael', 'San Roque', 'San Sebastian',
    'San Vicente', 'Santa Cruz', 'Santa Maria', 'Santo Cristo',
    'Santo Niño', 'Sapang Maragul', 'Sapang Tagalog', 'Sepung Calzada',
    'Sinait', 'Suizo', 'Tariji', 'Tibag', 'Tibagan', 'Trinidad'
  ],

  // === Laguna ===
  'San Pedro': [
    'Bagong Silang', 'Calendola', 'Chrysanthemum', 'Cuyab', 'Estrella',
    'Fatima', 'G.S.I.S.', 'Landayan', 'Langgam', 'Laram',
    'Magsaysay', 'Maharlika', 'Narra', 'Nueva', 'Pacita 1',
    'Pacita 2', 'Poblacion', 'Riverside', 'Rosario', 'Sampaguita Village',
    'San Antonio', 'San Lorenzo Ruiz', 'San Roque', 'San Vicente',
    'Santo Niño', 'United Bayanihan', 'United Better Living'
  ],
  'Biñan': [
    'Bungahan', 'Canlalay', 'Casile', 'De La Paz', 'Ganado',
    'Langkiwa', 'Loma', 'Malaban', 'Malamig', 'Mamplasan',
    'Platero', 'Poblacion', 'San Antonio', 'San Francisco',
    'San Jose', 'San Vicente', 'Santo Domingo', 'Santo Niño',
    'Santo Tomas', 'Soro-Soro', 'Timbao', 'Tubigan', 'Zapote'
  ],
  'Cabuyao': [
    'Baclaran', 'Banay-Banay', 'Banlic', 'Bigaa', 'Butong',
    'Casile', 'Diezmo', 'Gulod', 'Mamatid', 'Marinig',
    'Niugan', 'Pittland', 'Poblacion Uno', 'Poblacion Dos', 'Poblacion Tres',
    'Pulo', 'Sala', 'San Isidro'
  ],
  'Los Baños': [
    'Bagong Silang', 'Bambang', 'Batong Malake', 'Baybayin', 'Bayog',
    'Anos', 'Lalakay', 'Maahas', 'Malinta', 'Mayondon',
    'Poblacion', 'Putho-Tuntungin', 'San Antonio', 'Tadlak', 'Timugan'
  ],

  // === Cavite ===
  'Cavite City': [
    'Barangay 1 (San Roque)', 'Barangay 2 (Tres Cruses)', 'Barangay 3 (Ilaya)',
    'Barangay 4 (Calacaruhan)', 'Barangay 5 (Ligtong I)', 'Barangay 6 (Ligtong II)',
    'Barangay 7 (Ligtong III)', 'Barangay 8 (Ligtong IV)', 'Barangay 9 (Kanluran)',
    'Barangay 10 (Silangan)', 'Barangay 22 (Tora-tora)', 'Dalahican',
    'San Antonio', 'Santa Cruz', 'Caridad', 'Rosario'
  ],
  'Tagaytay': [
    'Asisan', 'Bagong Tubig', 'Calabuso', 'Dapdap East', 'Dapdap West',
    'Francisco', 'Guinhawa North', 'Guinhawa South', 'Iruhin Central',
    'Iruhin East', 'Iruhin South', 'Iruhin West', 'Kaybagal Central',
    'Kaybagal North', 'Kaybagal South', 'Mag-Asawang Ilat', 'Maharlika East',
    'Maharlika West', 'Maitim I Central', 'Maitim I East', 'Maitim II Central',
    'Maitim II East', 'Maitim II West', 'Mendez Crossing East',
    'Mendez Crossing West', 'Neogan', 'Patutong Malaki North',
    'Patutong Malaki South', 'Sambong', 'San Jose', 'Silang Junction North',
    'Silang Junction South', 'Sungay East', 'Sungay West', 'Tolentino East',
    'Tolentino West', 'Zambal'
  ],

  // === Rizal ===
  'Cainta': [
    'San Andres', 'San Isidro', 'San Juan', 'San Roque', 'Santa Rosa',
    'Santo Domingo', 'Santo Niño', 'Sto. Niño'
  ],
  'Taytay': [
    'Dolores', 'Muzon', 'San Isidro', 'San Juan', 'Santa Ana',
    'Santo Niño', 'Club Manila East', 'Floodway'
  ],
  'Rodriguez': [
    'Balite', 'Burgos', 'Geronimo', 'Macabud', 'Manggahan',
    'Mascap', 'Montalban', 'Puray', 'Rosario', 'San Isidro',
    'San Jose', 'San Rafael'
  ],

  // === Iloilo ===
  'Iloilo City': [
    'Arevalo', 'City Proper', 'Jaro', 'La Paz', 'Lapuz',
    'Mandurriao', 'Molo', 'San Pedro', 'Santa Cruz', 'Tacas',
    'Tagbak', 'Ungka'
  ],

  // === Negros Occidental ===
  'Bacolod': [
    'Alijis', 'Alangilan', 'Banago', 'Bata', 'Cabug',
    'Estefania', 'Felisa', 'Granada', 'Handumanan', 'Hilaoan',
    'Mandalagan', 'Mansilingan', 'Montevista', 'Pahanocoy', 'Punta Taytay',
    'Singcang-Airport', 'Sum-ag', 'Taculing', 'Tangub', 'Villamonte', 'Vista Alegre'
  ],

  // === Bohol ===
  'Tagbilaran': [
    'Bool', 'Booy', 'Cabawan', 'Cogon', 'Dao',
    'Dampas', 'Manga', 'Mansasa', 'Poblacion I', 'Poblacion II',
    'Poblacion III', 'San Isidro', 'Taloto', 'Tiptip', 'Ubujan'
  ],

  // === Leyte ===
  'Tacloban': [
    'Abucay', 'Anibong', 'Bagacay', 'Cabalawan', 'Caibaan',
    'Calanipawan', 'Diit', 'Fatima Village', 'Marasbaras', 'Nula-Tula',
    'Palanog', 'Rizal', 'Sagkahan', 'San Jose', 'Santo Niño',
    'Suhi', 'V&G Subdivision', 'Villa Kananga', 'Yolanda Village'
  ],

  // === Zamboanga ===
  'Zamboanga City': [
    'Baliwasan', 'Canelar', 'Guiwan', 'Labuan', 'Lunzuran',
    'Mercedes', 'Pasonanca', 'Putik', 'Recodo', 'San Jose Gusu',
    'San Ramon', 'San Roque', 'Santa Barbara', 'Santa Catalina',
    'Santa Maria', 'Santo Niño', 'Sinunuc', 'Sta. Lucia', 'Talon-Talon',
    'Tetuan', 'Tumaga', 'Victoria', 'Zamboanwood', 'Zone I', 'Zone IV'
  ],

  // === Lanao del Norte ===
  'Iligan': [
    'Acmac', 'Bagong Silang', 'Bonbonon', 'Buru-un', 'Dalipuga',
    'Del Carmen', 'Digkilaan', 'Hinaplanon', 'Kiwalan', 'Mahayahay',
    'Mainit', 'Mandulog', 'Maria Cristina', 'Pala-o', 'Poblacion',
    'Rogongon', 'Santiago', 'Santo Rosario', 'Saray', 'Suarez',
    'Tambacan', 'Tibanga', 'Tipanoy', 'Tomas Cabili', 'Tubod',
    'Ubaldo Laya', 'Upper Hinaplanon', 'Villa Verde'
  ],

  // === Davao del Norte ===
  'Tagum': [
    'Apokon', 'Bincungan', 'Busaon', 'Canocotan', 'Cuambogan',
    'La Filipina', 'Liboganon', 'Madaum', 'Magdum', 'Magugpo East',
    'Magugpo North', 'Magugpo Poblacion', 'Magugpo South', 'Magugpo West',
    'Mankilam', 'New Balamban', 'Nueva Fuerza', 'Pagsabangan',
    'Pandapan', 'San Agustin', 'San Isidro', 'San Miguel', 'Visayan Village'
  ],

  // === South Cotabato ===
  'Koronadal': [
    'Assumption', 'Avanceña', 'Cacub', 'Caloocan', 'Carpenter Hill',
    'Concepcion', 'Esperanza', 'General Paulino Santos', 'Mabini',
    'Magsaysay', 'Morales', 'Namnama', 'New Pangasinan',
    'Paraiso', 'Poblacion', 'Rotonda', 'San Isidro', 'San Jose',
    'San Roque', 'Santa Cruz', 'Santo Niño', 'Sarabia', 'Zulueta'
  ],

  // === Agusan del Norte ===
  'Butuan': [
    'Agusan Pequeño', 'Ambago', 'Amparo', 'Ampayon', 'Anticala',
    'Baan KM 3', 'Baan Riverside', 'Babag', 'Bading', 'Bancasi',
    'Banza', 'Baobaoan', 'Buhangin', 'Dagohoy', 'De Gracia',
    'Diego Silang', 'Doongan', 'Dulag', 'Dumalagan', 'Florida',
    'Golden Ribbon', 'Holy Redeemer', 'Humabon', 'Imadejas',
    'Jose Rizal', 'Libertad', 'Limaha', 'Mahay', 'Mahogany',
    'Maon', 'Masao', 'Obrero', 'Ong Yiu', 'Pinamanculan',
    'Poblacion', 'San Ignacio', 'San Vicente', 'Sumile', 'Taligaman',
    'Villa Kananga'
  ],

  // === Surigao del Norte ===
  'Surigao City': [
    'Bonifacio', 'Cagniog', 'Canlanipa', 'Danao', 'De Gracia',
    'Ipil', 'Lipata', 'Luna', 'Mabini', 'Mabua',
    'Nabago', 'Nonoc', 'Poctoy', 'Poblacion', 'Rizal',
    'Sabang', 'San Isidro', 'San Juan', 'Taft', 'Togbongon',
    'Trinidad', 'Washington'
  ],

  // === Pangasinan ===
  'Dagupan': [
    'Bacayao Norte', 'Bacayao Sur', 'Barangay I (T. Bugallon)',
    'Barangay II', 'Barangay IV', 'Bolosan', 'Bonuan Boquig',
    'Bonuan Gueset', 'Calmay', 'Carael', 'Lasip Chico',
    'Lasip Grande', 'Lomboy', 'Lucao', 'Malued', 'Mamalingling',
    'Mangin', 'Mayombo', 'Pantal', 'Poblacion Oeste', 'Pogo Chico',
    'Pogo Grande', 'Pugaro Suit', 'Salapingao', 'Salisay',
    'Tambac', 'Tapuac', 'Tebeng'
  ],

  // === Isabela ===
  'Cauayan': [
    'Alicaocao', 'Alinam', 'Amobocan', 'Andarayan', 'Baringin Norte',
    'Baringin Sur', 'Buena Suerte', 'Cabaruan', 'Cabugao',
    'District I (Poblacion)', 'District II (Poblacion)', 'District III (Poblacion)',
    'Dianao', 'Dummun', 'Gappal', 'Guayabal', 'Labinab',
    'Linglingay', 'Magassi', 'Minante I', 'Minante II',
    'Pinoma', 'Rizal', 'San Antonio', 'San Fermin',
    'San Pablo', 'Sillawit', 'Siniloan', 'Tagaran',
    'Villa Flor Norte', 'Villa Flor Sur', 'Villaluz'
  ],

  // === Cagayan ===
  'Tuguegarao': [
    'Annafunan East', 'Annafunan West', 'Atulayan Norte', 'Atulayan Sur',
    'Bagay', 'Buntun', 'Caggay', 'Capatan', 'Carig Norte',
    'Carig Sur', 'Caritan Centro', 'Caritan Norte', 'Caritan Sur',
    'Centro (Poblacion)', 'Cataggaman Nuevo', 'Cataggaman Pardo',
    'Cataggaman Viejo', 'Gosi Norte', 'Gosi Sur', 'Larion Alto',
    'Larion Bajo', 'Leonarda', 'Libag Norte', 'Libag Sur',
    'Linao East', 'Linao Norte', 'Linao West', 'Namabbalan Norte',
    'Namabbalan Sur', 'Pallua Norte', 'Pallua Sur', 'Pengue-Ruyu',
    'Reyes', 'San Gabriel', 'Tagga', 'Tanza', 'Ugac Norte',
    'Ugac Sur'
  ]
};

export default philippineBarangays;
