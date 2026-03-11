// Philippine Geographic Data: Region → Province → City/Municipality
// Covers all 17 regions with major provinces and cities

const philippineLocations = {
  'NCR': {
    name: 'National Capital Region (NCR)',
    provinces: {
      'Metro Manila': [
        'Caloocan', 'Las Piñas', 'Makati', 'Malabon', 'Mandaluyong',
        'Manila', 'Marikina', 'Muntinlupa', 'Navotas', 'Parañaque',
        'Pasay', 'Pasig', 'Pateros', 'Quezon City', 'San Juan',
        'Taguig', 'Valenzuela'
      ]
    }
  },
  'Region I': {
    name: 'Ilocos Region',
    provinces: {
      'Ilocos Norte': ['Laoag', 'Batac', 'Pagudpud', 'Paoay', 'Currimao', 'Sarrat', 'Dingras', 'San Nicolas'],
      'Ilocos Sur': ['Vigan', 'Candon', 'Narvacan', 'Bantay', 'Santa', 'Cabugao', 'San Esteban'],
      'La Union': ['San Fernando', 'Agoo', 'Bauang', 'Naguilian', 'Rosario', 'Bacnotan', 'San Juan'],
      'Pangasinan': ['Dagupan', 'San Carlos', 'Urdaneta', 'Alaminos', 'Lingayen', 'Mangaldan', 'Binmaley', 'Calasiao', 'Malasiqui', 'Rosales']
    }
  },
  'Region II': {
    name: 'Cagayan Valley',
    provinces: {
      'Batanes': ['Basco', 'Itbayat', 'Ivana', 'Mahatao', 'Sabtang', 'Uyugan'],
      'Cagayan': ['Tuguegarao', 'Aparri', 'Lal-lo', 'Gonzaga', 'Sanchez-Mira', 'Gattaran', 'Baggao', 'Solana'],
      'Isabela': ['Ilagan', 'Cauayan', 'Santiago', 'Roxas', 'San Mateo', 'Cordon', 'Echague', 'Alicia'],
      'Nueva Vizcaya': ['Bayombong', 'Solano', 'Bambang', 'Aritao', 'Bagabag', 'Villaverde'],
      'Quirino': ['Cabarroguis', 'Diffun', 'Saguday', 'Aglipay', 'Maddela', 'Nagtipunan']
    }
  },
  'Region III': {
    name: 'Central Luzon',
    provinces: {
      'Aurora': ['Baler', 'Casiguran', 'Maria Aurora', 'Dingalan', 'Dipaculao', 'San Luis'],
      'Bataan': ['Balanga', 'Mariveles', 'Orani', 'Dinalupihan', 'Hermosa', 'Samal', 'Pilar', 'Limay'],
      'Bulacan': ['Malolos', 'Meycauayan', 'San Jose del Monte', 'Marilao', 'Bocaue', 'Balagtas', 'Guiguinto', 'Plaridel', 'Pulilan', 'Obando', 'Sta. Maria'],
      'Nueva Ecija': ['Cabanatuan', 'Palayan', 'San Jose', 'Gapan', 'Muñoz', 'Talavera', 'Guimba', 'Zaragoza'],
      'Pampanga': ['San Fernando', 'Angeles', 'Mabalacat', 'Apalit', 'Guagua', 'Lubao', 'Mexico', 'Porac', 'Sta. Ana', 'Magalang'],
      'Tarlac': ['Tarlac City', 'Concepcion', 'Paniqui', 'Gerona', 'Capas', 'Bamban', 'Victoria', 'Camiling'],
      'Zambales': ['Olongapo', 'Iba', 'Subic', 'San Narciso', 'Botolan', 'Castillejos', 'San Felipe', 'Sta. Cruz']
    }
  },
  'Region IV-A': {
    name: 'CALABARZON',
    provinces: {
      'Batangas': ['Batangas City', 'Lipa', 'Tanauan', 'Sto. Tomas', 'Nasugbu', 'Rosario', 'Bauan', 'San Jose', 'Lemery', 'Calaca'],
      'Cavite': ['Imus', 'Bacoor', 'Dasmariñas', 'General Trias', 'Cavite City', 'Tagaytay', 'Trece Martires', 'Silang', 'Rosario', 'Tanza', 'Gen. Mariano Alvarez'],
      'Laguna': ['Santa Rosa', 'San Pedro', 'Biñan', 'Calamba', 'Cabuyao', 'Los Baños', 'San Pablo', 'Sta. Cruz', 'Bay', 'Pagsanjan'],
      'Quezon': ['Lucena', 'Tayabas', 'Sariaya', 'Candelaria', 'Tiaong', 'Pagbilao', 'Gumaca', 'Infanta', 'Real'],
      'Rizal': ['Antipolo', 'Cainta', 'Taytay', 'Angono', 'Binangonan', 'Rodriguez', 'San Mateo', 'Tanay', 'Teresa', 'Morong']
    }
  },
  'Region IV-B': {
    name: 'MIMAROPA',
    provinces: {
      'Marinduque': ['Boac', 'Mogpog', 'Gasan', 'Buenavista', 'Torrijos', 'Sta. Cruz'],
      'Occidental Mindoro': ['Mamburao', 'San Jose', 'Sablayan', 'Abra de Ilog', 'Calintaan'],
      'Oriental Mindoro': ['Calapan', 'Puerto Galera', 'Naujan', 'Pinamalayan', 'Roxas', 'Bongabong', 'Socorro'],
      'Palawan': ['Puerto Princesa', 'El Nido', 'Coron', 'Brooke\'s Point', 'Roxas', 'Narra', 'Aborlan', 'Taytay'],
      'Romblon': ['Romblon', 'Odiongan', 'San Fernando', 'Cajidiocan', 'Magdiwang']
    }
  },
  'Region V': {
    name: 'Bicol Region',
    provinces: {
      'Albay': ['Legazpi', 'Tabaco', 'Ligao', 'Daraga', 'Guinobatan', 'Polangui', 'Camalig', 'Sto. Domingo'],
      'Camarines Norte': ['Daet', 'Jose Panganiban', 'Labo', 'Vinzons', 'Paracale', 'Mercedes'],
      'Camarines Sur': ['Naga', 'Iriga', 'Pili', 'Nabua', 'Goa', 'Sipocot', 'Libmanan', 'Calabanga'],
      'Catanduanes': ['Virac', 'San Andres', 'Bato', 'Baras', 'Pandan'],
      'Masbate': ['Masbate City', 'Aroroy', 'Mandaon', 'Milagros', 'Mobo'],
      'Sorsogon': ['Sorsogon City', 'Bulusan', 'Irosin', 'Gubat', 'Castilla', 'Pilar', 'Bulan']
    }
  },
  'Region VI': {
    name: 'Western Visayas',
    provinces: {
      'Aklan': ['Kalibo', 'Malay (Boracay)', 'Ibajay', 'Numancia', 'Altavas', 'Banga'],
      'Antique': ['San Jose de Buenavista', 'Sibalom', 'Hamtic', 'Culasi', 'Pandan', 'Barbaza'],
      'Capiz': ['Roxas City', 'Panay', 'Pilar', 'Pontevedra', 'President Roxas', 'Sigma'],
      'Guimaras': ['Jordan', 'Buenavista', 'Nueva Valencia', 'San Lorenzo', 'Sibunag'],
      'Iloilo': ['Iloilo City', 'Passi', 'Oton', 'Pavia', 'Sta. Barbara', 'Cabatuan', 'Jaro', 'Miagao', 'San Miguel'],
      'Negros Occidental': ['Bacolod', 'Silay', 'Talisay', 'Sagay', 'Cadiz', 'San Carlos', 'Kabankalan', 'La Carlota', 'Victorias']
    }
  },
  'Region VII': {
    name: 'Central Visayas',
    provinces: {
      'Bohol': ['Tagbilaran', 'Panglao', 'Loboc', 'Carmen', 'Tubigon', 'Talibon', 'Ubay', 'Jagna'],
      'Cebu': ['Cebu City', 'Mandaue', 'Lapu-Lapu', 'Talisay', 'Danao', 'Toledo', 'Naga', 'Carcar', 'Minglanilla', 'Consolacion', 'Liloan', 'Compostela'],
      'Negros Oriental': ['Dumaguete', 'Bais', 'Tanjay', 'Bayawan', 'Guihulngan', 'Canlaon', 'Sibulan'],
      'Siquijor': ['Siquijor', 'Larena', 'San Juan', 'Lazi', 'Maria', 'Enrique Villanueva']
    }
  },
  'Region VIII': {
    name: 'Eastern Visayas',
    provinces: {
      'Biliran': ['Naval', 'Biliran', 'Almeria', 'Kawayan', 'Cabucgayan'],
      'Eastern Samar': ['Borongan', 'Guiuan', 'Dolores', 'Oras', 'Salcedo', 'Balangiga'],
      'Leyte': ['Tacloban', 'Ormoc', 'Palo', 'Baybay', 'Carigara', 'Abuyog', 'Tanauan'],
      'Northern Samar': ['Catarman', 'Allen', 'Laoang', 'San Jose', 'Victoria', 'Lavezares'],
      'Samar': ['Catbalogan', 'Calbayog', 'Basey', 'Marabut', 'Paranas', 'Sta. Rita'],
      'Southern Leyte': ['Maasin', 'Sogod', 'Bontoc', 'Malitbog', 'Tomas Oppus', 'Liloan']
    }
  },
  'Region IX': {
    name: 'Zamboanga Peninsula',
    provinces: {
      'Zamboanga del Norte': ['Dipolog', 'Dapitan', 'Sindangan', 'Liloy', 'Polanco', 'Labason'],
      'Zamboanga del Sur': ['Pagadian', 'Zamboanga City', 'Aurora', 'Molave', 'Tukuran', 'Labangan'],
      'Zamboanga Sibugay': ['Ipil', 'Buug', 'Kabasalan', 'Siay', 'Diplahan', 'R.T. Lim']
    }
  },
  'Region X': {
    name: 'Northern Mindanao',
    provinces: {
      'Bukidnon': ['Malaybalay', 'Valencia', 'Manolo Fortich', 'Quezon', 'Don Carlos', 'Maramag', 'Lantapan'],
      'Camiguin': ['Mambajao', 'Catarman', 'Guinsiliban', 'Mahinog', 'Sagay'],
      'Lanao del Norte': ['Iligan', 'Tubod', 'Kapatagan', 'Lala', 'Maigo', 'Kolambugan'],
      'Misamis Occidental': ['Oroquieta', 'Ozamiz', 'Tangub', 'Clarin', 'Jimenez', 'Plaridel'],
      'Misamis Oriental': ['Cagayan de Oro', 'Gingoog', 'El Salvador', 'Villanueva', 'Opol', 'Jasaan', 'Tagoloan']
    }
  },
  'Region XI': {
    name: 'Davao Region',
    provinces: {
      'Davao de Oro': ['Nabunturan', 'Monkayo', 'Compostela', 'Pantukan', 'Montevista', 'New Bataan'],
      'Davao del Norte': ['Tagum', 'Panabo', 'Island Garden City of Samal', 'Carmen', 'Sto. Tomas', 'Kapalong'],
      'Davao del Sur': ['Davao City', 'Digos', 'Bansalan', 'Sta. Cruz', 'Hagonoy', 'Sulop', 'Magsaysay'],
      'Davao Occidental': ['Malita', 'Sta. Maria', 'Don Marcelino', 'Jose Abad Santos', 'Sarangani'],
      'Davao Oriental': ['Mati', 'Baganga', 'Cateel', 'Boston', 'Lupon', 'Banaybanay', 'Governor Generoso']
    }
  },
  'Region XII': {
    name: 'SOCCSKSARGEN',
    provinces: {
      'Cotabato': ['Kidapawan', 'Kabacan', 'Matalam', 'Midsayap', 'Pigcawayan', 'Carmen', 'Tulunan'],
      'Sarangani': ['Alabel', 'Glan', 'Malapatan', 'Malungon', 'Kiamba', 'Maasim'],
      'South Cotabato': ['Koronadal', 'General Santos', 'Polomolok', 'Tupi', 'Tampakan', 'Surallah', 'Tboli', 'Lake Sebu'],
      'Sultan Kudarat': ['Isulan', 'Tacurong', 'Kalamansig', 'Lebak', 'Esperanza', 'Bagumbayan']
    }
  },
  'Region XIII': {
    name: 'Caraga',
    provinces: {
      'Agusan del Norte': ['Butuan', 'Cabadbaran', 'Nasipit', 'Buenavista', 'Carmen', 'Tubay'],
      'Agusan del Sur': ['Prosperidad', 'Bayugan', 'San Francisco', 'Rosario', 'Bunawan', 'Trento'],
      'Dinagat Islands': ['San Jose', 'Dinagat', 'Loreto', 'Basilisa', 'Cagdianao', 'Libjo', 'Tubajon'],
      'Surigao del Norte': ['Surigao City', 'Dapa', 'Del Carmen', 'General Luna (Siargao)', 'Placer', 'Mainit'],
      'Surigao del Sur': ['Tandag', 'Bislig', 'Cantilan', 'Lanuza', 'Lianga', 'Cagwait', 'Barobo']
    }
  },
  'CAR': {
    name: 'Cordillera Administrative Region',
    provinces: {
      'Abra': ['Bangued', 'Dolores', 'La Paz', 'Tayum', 'Pidigan', 'Manabo'],
      'Apayao': ['Kabugao', 'Luna', 'Pudtol', 'Conner', 'Flora', 'Santa Marcela'],
      'Benguet': ['Baguio', 'La Trinidad', 'Itogon', 'Tuba', 'Tublay', 'Sablan', 'Bokod', 'Kabayan'],
      'Ifugao': ['Lagawe', 'Banaue', 'Kiangan', 'Lamut', 'Hungduan', 'Mayoyao'],
      'Kalinga': ['Tabuk', 'Balbalan', 'Pasil', 'Lubuagan', 'Pinukpuk', 'Rizal', 'Tanudan', 'Tinglayan'],
      'Mountain Province': ['Bontoc', 'Sagada', 'Besao', 'Sabangan', 'Tadian', 'Bauko', 'Barlig']
    }
  },
  'BARMM': {
    name: 'Bangsamoro Autonomous Region',
    provinces: {
      'Basilan': ['Isabela City', 'Lamitan', 'Tipo-Tipo', 'Tuburan', 'Maluso'],
      'Lanao del Sur': ['Marawi', 'Wao', 'Malabang', 'Ganassi', 'Masiu', 'Tamparan', 'Tugaya'],
      'Maguindanao del Norte': ['Datu Odin Sinsuat', 'Sultan Kudarat', 'Cotabato City', 'Upi', 'Parang'],
      'Maguindanao del Sur': ['Buluan', 'Datu Paglas', 'Maganoy', 'Datu Piang', 'Talayan'],
      'Sulu': ['Jolo', 'Patikul', 'Indanan', 'Maimbung', 'Talipao', 'Panamao'],
      'Tawi-Tawi': ['Bongao', 'Panglima Sugala', 'Mapun', 'Simunul', 'Sitangkai', 'South Ubian']
    }
  }
};

export default philippineLocations;
