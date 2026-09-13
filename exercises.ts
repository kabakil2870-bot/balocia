import { 
  ExercisePhaseInfo, 
  ExerciseMuscleFocus, 
  ExerciseBiomechanicsData, 
  getExerciseBiomechanics, 
  EXERCISE_BIOMECHANICS 
} from './exerciseBiomechanics';

export type { ExercisePhaseInfo, ExerciseMuscleFocus, ExerciseBiomechanicsData };
export { getExerciseBiomechanics, EXERCISE_BIOMECHANICS };

export interface ExerciseItem {
  id: string;
  name: string;
  turkishName: string;
  category: 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core';
  categoryLabel: string;
  difficulty: 'Başlangıç' | 'Orta' | 'İleri';
  equipment: string;
  locationType?: 'home' | 'gym' | 'both';
  primaryMuscles: string[];
  secondaryMuscles: string[];
  motionType: 'push' | 'pull' | 'legs' | 'core' | 'arms';
  shortDesc: string;
  stepByStep: string[];
  biloProTip: string;
  commonMistakes: string[];
  breathingTip: string;
  recommendedTempo: string; // e.g. "2-1-1-0 (2 sn iniş, 1 sn duraklama, 1 sn itiş)"
  alternatives: string[];
  gifUrl?: string;
  startPhase?: ExercisePhaseInfo;
  peakPhase?: ExercisePhaseInfo;
  muscleFocus?: ExerciseMuscleFocus[];
}

export const EXERCISES_DATABASE: ExerciseItem[] = [
  // --- GÖĞÜS (CHEST) ---
  {
    id: 'bench_press',
    name: 'Bench Press',
    turkishName: 'Yatarak Halter Göğüs İtiş',
    category: 'chest',
    categoryLabel: 'Göğüs',
    difficulty: 'Orta',
    equipment: 'Barbell & Düz Sehpa',
    primaryMuscles: ['Göğüs (Pectoralis Major)', 'Orta Göğüs'],
    secondaryMuscles: ['Ön Omuz (Anterior Deltoid)', 'Triceps (Arka Kol)'],
    motionType: 'push',
    shortDesc: 'Üst vücut itiş gücünün ve hacimli göğüs kaslarının temel direğidir.',
    stepByStep: [
      'Düz sehpaya uzan, gözlerin barın tam altına gelsin. Ayaklarını yere sağlam bas.',
      'Kürek kemiklerini (scapula) geriye ve aşağıya kilitle. Göğsünü yukarı doğru kabart.',
      'Barı omuz genişliğinden biraz daha geniş bir açıklıkla kavra.',
      'Derin nefes alarak barı göğüs ucuna (meme ucu hizası) kontrollü şekilde 2 saniyede indir.',
      'Dirseklerini gövdenle yaklaşık 45-60 derece açıda tut, yanlara 90 derece açma.',
      'Nefesini vererek barı patlayıcı bir güçle başlangıç konumuna it. Dirseklerini tam kitleme.'
    ],
    biloProTip: 'Kanka en büyük hata dirsekleri 90 derece açıp omuzları feda etmektir! Kürek kemiklerini sehpaya çivile, dirseklerini 45 dereceye çek, göğsün patlasın! 💪🔥',
    commonMistakes: [
      'Barı göğüsten sektirmek (kaburgalara ve eklemlere zarar verir).',
      'Popoyu sehpadan havaya kaldırmak (omurga sakatlığı riski).',
      'Dirsekleri tepe noktada aşırı kilitlemek (eklem aşınması).'
    ],
    breathingTip: 'Barı indirirken burnundan derin nefes al, göğsünden yukarı iterken ağzından patlayıcı şekilde ver.',
    recommendedTempo: '2 sn iniş • 1 sn göğüste temas • 1 sn patlayıcı itiş',
    alternatives: ['Dumbbell Press', 'Push-up (Şınav)', 'Chest Press Makinesi']
  },
  {
    id: 'incline_dumbbell_press',
    name: 'Incline Dumbbell Press',
    turkishName: 'Eğimli Sehpada Dambıl İtiş',
    category: 'chest',
    categoryLabel: 'Göğüs',
    difficulty: 'Orta',
    equipment: 'Ayarlanabilir Sehpa (30-45°) & Dambıllar',
    primaryMuscles: ['Üst Göğüs (Clavicular Pectoral)'],
    secondaryMuscles: ['Ön Omuz', 'Triceps'],
    motionType: 'push',
    shortDesc: 'Göğsün üst çizgisini doldurur ve köprücük kemiği altındaki kasları belirginleştirir.',
    stepByStep: [
      'Sehpayı 30 veya maksimum 45 derece eğime ayarla (fazla dik olursa omuza biner).',
      'Dambılları dizlerinin üzerine koy, geriye yaslanırken dizlerinle destek alarak yukarı fırlat.',
      'Avuç içlerin öne bakacak şekilde göğüs hizasında tut, dirseklerini 45 derece içe al.',
      'Dambılları yukarı doğru üçgen bir yay çizerek it, ancak tepe noktada birbirine çarptırma.',
      'Üst göğüsteki kasılmayı 1 saniye hisset ve ağırlıkları yavaşça indir.'
    ],
    biloProTip: 'Kanka sehpa açısını 60 derece yaparsan hareket omuz presine döner! 30-45 derece tam üst göğüsün tatlı noktasıdır! 🎯',
    commonMistakes: [
      'Sehpa açısını çok dik tutarak omuzları aşırı yormak.',
      'Dambılları tepe noktada birbirine sertçe çarparak gerginliği kaybetmek.',
      'Ağırlığı aniden serbest bırakıp omuz eklemine şok bindirmek.'
    ],
    breathingTip: 'İndirirken nefes al, yukarı doğru preslerken nefes ver.',
    recommendedTempo: '3 sn yavaş iniş • tepe noktada 1 sn sıkıştırma',
    alternatives: ['Incline Barbell Press', 'Low-to-High Cable Fly', 'Decline Push-up']
  },
  {
    id: 'push_ups',
    name: 'Push-up (Şınav)',
    turkishName: 'Klasik Şınav',
    category: 'chest',
    categoryLabel: 'Göğüs',
    difficulty: 'Başlangıç',
    equipment: 'Vücut Ağırlığı',
    primaryMuscles: ['Göğüs Kasları', 'Merkez Bölge (Core)'],
    secondaryMuscles: ['Triceps', 'Ön Omuz', 'Ön Bacak'],
    motionType: 'push',
    shortDesc: 'Sıfır ekipmanla her yerde yapılabilen tüm üst vücut ve core güçlendirici.',
    stepByStep: [
      'Ellerini omuz genişliğinden biraz geniş olarak yere yerleştir.',
      'Vücudunu baştan topuklara kadar düz bir çizgi halinde (plank pozisyonunda) tut.',
      'Karın ve kalça kaslarını taş gibi sık, belini aşağı sarkıtma.',
      'Göğsün yere 2-3 cm yaklaşana kadar dirseklerini geriye doğru bükerek alçal.',
      'Avuç içlerinle yeri iterek başlangıç pozisyonuna geri dön.'
    ],
    biloProTip: 'Kanka belin aşağı çöküyorsa şınav çekmiyorsun demektir! Vücudunu mızrak gibi dümdüz tut, tam göğsünü yere dokundur! ⚡',
    commonMistakes: [
      'Kalçayı havada tutmak ya da belin aşağı çökmesine izin vermek.',
      'Boynu aşağı sarkıtıp sadece kafayı yere yaklaştırmak.',
      'Yarım tekrar yapmak (göğsü yeterince indirmemek).'
    ],
    breathingTip: 'Aşağı inerken nefes al, yukarı kalkarken güçlüce üfle.',
    recommendedTempo: '2 sn iniş • 1 sn patlayıcı kalkış',
    alternatives: ['Diz Üstü Şınav', 'Dips', 'Elmas Şınav (Diamond Push-up)']
  },
  {
    id: 'dips',
    name: 'Dips',
    turkishName: 'Paralel Bar İtişi',
    category: 'chest',
    categoryLabel: 'Göğüs',
    difficulty: 'Orta',
    equipment: 'Paralel Bar İstasyonu',
    primaryMuscles: ['Alt Göğüs', 'Triceps (Arka Kol)'],
    secondaryMuscles: ['Ön Omuz', 'Rhomboids'],
    motionType: 'push',
    shortDesc: 'Alt göğüs çizgisini bıçak gibi keskinleştiren ve tricepsleri büyüten kral hareket.',
    stepByStep: [
      'Paralel barlara tutunup kendini yukarı kaldır, kollarını düzle.',
      'Gövdeni yaklaşık 20-30 derece öne eğ (bu açı yükü tricepsten göğse aktarır).',
      'Dirseklerini 90 derece bükene kadar vücudunu kontrollü şekilde alçalt.',
      'Alt göğüste derin esnemeyi hissettiğinde göğsünü sıkarak yukarı it.'
    ],
    biloProTip: 'Göğüs için gövdeni hafif öne eğ! Dik durursan hareket tamamen arka kola (triceps) kayar kanka! 🦍',
    commonMistakes: [
      'Omuzları kulaklara doğru yukarı kaldırmak.',
      'Aşırı derin inerek omuz kapsülünü zorlamak (90 derece dirsek açısı yeterlidir).',
      'Vücudu sallayarak ivmeden yararlanmak.'
    ],
    breathingTip: 'İnerken nefes al, göğsünle kendini yukarı iterken nefes ver.',
    recommendedTempo: '2 sn kontrollü iniş • 1 sn tepe itiş',
    alternatives: ['Decline Bench Press', 'Sehpa Dips (Bench Dips)']
  },

  // --- SIRT & KANAT (BACK) ---
  {
    id: 'pull_ups',
    name: 'Pull-up (Barfiks)',
    turkishName: 'Geniş Tutuş Barfiks',
    category: 'back',
    categoryLabel: 'Sırt',
    difficulty: 'İleri',
    equipment: 'Barfiks Barı',
    primaryMuscles: ['Latissimus Dorsi (Kanat Kasları)'],
    secondaryMuscles: ['Biceps (Pazu)', 'Arka Omuz', 'Orta Sırt'],
    motionType: 'pull',
    shortDesc: 'V şeklinde geniş bir sırt ve sırt kalınlığı için en etkili vücut ağırlığı egzersizi.',
    stepByStep: [
      'Barı omuz genişliğinden biraz daha geniş, avuç içleri karşıya bakacak şekilde tut.',
      'Harekete başlamadan önce kürek kemiklerini aşağı çekerek sırtını aktive et (scapular depression).',
      'Kendini kollarınla değil, dirseklerini yere doğru çekiyormuş gibi hayal ederek yukarı çek.',
      'Çenen barın hizasına gelene kadar çekişi sürdür ve sırt kaslarını tepe noktada sık.',
      'Kendini serbest bırakmadan 2-3 saniyede kontrollü şekilde başlangıç pozisyonuna indir.'
    ],
    biloProTip: 'Kanka kendini kollarınla çekmeye çalışma! Dirseklerini pantolonunun arka ceplerine sokmaya çalışıyormuş gibi düşün, kanatların alev alsın! 🔥🦅',
    commonMistakes: [
      'Bacakları sallayarak ve savrularak (kipping) ivme kazanmak.',
      'Tam aşağı inmeden yarım tekrar yapmak.',
      'Çeneyi barın üstüne çıkarmak için boynu aşırı uzatmak.'
    ],
    breathingTip: 'Aşağıda asılıyken nefes al, yukarı çekerken nefesini güçlüce dışarı ver.',
    recommendedTempo: '1 sn patlayıcı çekiş • 1 sn tepe sıkma • 3 sn yavaş iniş',
    alternatives: ['Lat Pulldown', 'Direnç Bandı Destekli Barfiks', 'Inverted Row']
  },
  {
    id: 'lat_pulldown',
    name: 'Lat Pulldown',
    turkishName: 'Kablo Geniş Kanat Çekiş',
    category: 'back',
    categoryLabel: 'Sırt',
    difficulty: 'Başlangıç',
    equipment: 'Lat Pulldown Makinesi & Bar',
    primaryMuscles: ['Latissimus Dorsi (Kanat)'],
    secondaryMuscles: ['Biceps', 'Trapezler', 'Arka Omuz'],
    motionType: 'pull',
    shortDesc: 'Barfiks çekemeyenler ve sırt kaslarını izole etmek isteyenler için mükemmel çözüm.',
    stepByStep: [
      'Bacak pedlerini dizlerinin üzerine tam oturacak şekilde ayarla.',
      'Barı geniş tutuşla kavra ve gövdeni hafifçe (10-15 derece) geriye yasla.',
      'Göğsünü kabart ve barı göğsünün üst kısmına (köprücük kemiği altına) doğru çek.',
      'Çekiş esnasında dirseklerini geriye değil, yanlardan aşağıya doğru yönlendir.',
      'Tepe noktada sırtını 1 saniye sıkıştır ve ağırlığı yavaşça yukarı bırak.'
    ],
    biloProTip: 'Barı ensene çekme kanka! Ensene çekmek boyun omurlarına baskı yapar. Her zaman üst göğse doğru kontrollü çek!',
    commonMistakes: [
      'Aşırı geriye yatarak hareketi bel/sırt itişine çevirmek.',
      'Ağırlığı çok hızlı bırakıp kontrolü kaybetmek.',
      'Bilekleri aşırı bükerek kol kaslarını erkenden yormak.'
    ],
    breathingTip: 'Barı göğsüne çekerken nefes ver, yukarı uzatırken nefes al.',
    recommendedTempo: '1.5 sn çekiş • 1 sn sıkıştırma • 2.5 sn bırakış',
    alternatives: ['Pull-up', 'Tek Kol Cable Pulldown', 'Dumbbell Pullover']
  },
  {
    id: 'barbell_row',
    name: 'Bent Over Barbell Row',
    turkishName: 'Eğilerek Halter Sırt Çekiş',
    category: 'back',
    categoryLabel: 'Sırt',
    difficulty: 'Orta',
    equipment: 'Barbell & Plakalar',
    primaryMuscles: ['Orta Sırt (Rhomboids)', 'Latissimus Dorsi'],
    secondaryMuscles: ['Bel (Erector Spinae)', 'Biceps', 'Arka Omuz'],
    motionType: 'pull',
    shortDesc: 'Sırtı kalınlaştıran, duruşu düzelten ve devasa bir sırt gücü sağlayan temel hareket.',
    stepByStep: [
      'Ayaklarını omuz genişliğinde aç, barı kaval kemiklerine yakın tut.',
      'Dizlerini hafif bük, kalçanı geriye iterek gövdeni yere yaklaşık 45 derece eğ.',
      'Belini kesinlikle düz ve nötr tut, omurganı asla yuvarlama.',
      'Barı göbek deliğine doğru kürek kemiklerini birbirine kenetleyerek çek.',
      'Tepe noktada 1 saniye bekle ve barı kontrollü şekilde indir.'
    ],
    biloProTip: 'Belini bükersen fıtığa davetiye çıkarırsın kanka! Göğsünü dışarı çıkar, kalçanı geri ver, karın kaslarını sıkı tut! 🛡️',
    commonMistakes: [
      'Sırtı kamburlaştırarak ağırlık çekmek.',
      'Ağırlığı çekmek için gövdeyi yukarı zıplatmak (hileli tekrar).',
      'Barı göğse doğru çok yukarı çekip omuzları zorlamak.'
    ],
    breathingTip: 'Ağırlık aşağıdayken nefes al, karnına çekerken ver.',
    recommendedTempo: '1 sn patlayıcı çekiş • 2 sn kontrollü iniş',
    alternatives: ['T-Bar Row', 'Dumbbell Row', 'Seated Cable Row']
  },
  {
    id: 'deadlift',
    name: 'Deadlift (Konvansiyonel)',
    turkishName: 'Klasik Yerden Ağırlık Kaldırma',
    category: 'back',
    categoryLabel: 'Sırt / Tüm Vücut',
    difficulty: 'İleri',
    equipment: 'Barbell & Plakalar',
    primaryMuscles: ['Tüm Arka Zincir', 'Bel', 'Kalça (Glutes)', 'Hamstrings'],
    secondaryMuscles: ['Trapezler', 'Ön Kol (Grip)', 'Core'],
    motionType: 'pull',
    shortDesc: 'Yeryüzündeki en saf güç gösterisi! Vücuttaki neredeyse tüm kasları aynı anda çalıştırır.',
    stepByStep: [
      'Barı ayağının ortasının tam üstüne gelecek şekilde ayarla (kaval kemiğine 2-3 cm mesafe).',
      'Kalçanı geriye doğru iterek çömel, dizlerini bük ve barı omuz genişliğinde kavra.',
      'Göğsünü kaldır, sırtını çelik gibi düzleştir ve omuzlarını barın hafifçe önünde tut.',
      'Yeri bacaklarınla iterek kalça ve dizleri aynı anda düzleştir.',
      'Tepe noktada kalçanı sık, geriye aşırı kaykılmadan dik dur.',
      'Aynı açıyla kontrollü şekilde barı yere bırak.'
    ],
    biloProTip: 'Deadlift ağırlığı kaldırmak değil, yeri ayaklarınla aşağıya itmektir kanka! Omurganı kitle, kendini bir vinç gibi hayal et! 🏗️💥',
    commonMistakes: [
      'Sırtı kedi gibi yuvarlamak (en tehlikeli hata!).',
      'Tepe noktada beli aşırı geriye bükmek (hiperextension).',
      'Barı vücuttan uzakta tutarak bele binen yükü 3 katına çıkarmak.'
    ],
    breathingTip: 'Kaldırmadan önce karnına derin nefes çekip karnını kilitle (Valsalva manevrası), zirvede nefesi kontrollü ver.',
    recommendedTempo: 'Patlayıcı kalkış • 2 sn kontrollü iniş',
    alternatives: ['Trap Bar Deadlift', 'Romanian Deadlift', 'Sumo Deadlift']
  },

  // --- BACAK (LEGS) ---
  {
    id: 'barbell_squat',
    name: 'Barbell Back Squat',
    turkishName: 'Halterle Çömelme',
    category: 'legs',
    categoryLabel: 'Bacak',
    difficulty: 'Orta',
    equipment: 'Squat Rack & Barbell',
    primaryMuscles: ['Ön Bacak (Quadriceps)', 'Kalça (Gluteus Maximus)'],
    secondaryMuscles: ['Arka Bacak (Hamstrings)', 'Bel', 'Karın (Core)'],
    motionType: 'legs',
    shortDesc: 'Bacak günlerinin kralı, testosteron ve genel kas gelişiminin bir numaralı tetikleyicisi.',
    stepByStep: [
      'Barı üst sırt / trapez kaslarının üzerine sağlamca oturt, ellerinle sabitle.',
      'Ayaklarını omuz genişliğinde aç, ayak parmak uçlarını hafifçe (15-30 derece) dışarı çevir.',
      'Nefes alıp karın kaslarını kilitle, kalçanı geriye ve aşağıya doğru çömelerek indir.',
      'Uyluk kemiğin en az yere paralel olana kadar derinliğe in (dizler ayak uçlarını takip etsin).',
      'Topuklarından yeri iterek patlayıcı bir şekilde başlangıç konumuna geri yüksel.'
    ],
    biloProTip: 'Kanka bacak günü atlanmaz! Derin inmeyen squat yarım squattır. Topuklarından it, göğsünü dik tut, şampiyon gibi kalk! 👑🦵',
    commonMistakes: [
      'Dizlerin içeri doğru çökmesi (valgus - diz bağlarını riske atar).',
      'Topukların yerden kalkması (ağırlık merkezinin öne kaçması).',
      'Yeterli derinliğe inmemek.'
    ],
    breathingTip: 'İnmeden önce derin nefes alıp karın basıncını koru, yukarı iterken son aşamada nefes ver.',
    recommendedTempo: '2-3 sn kontrollü iniş • 1 sn patlayıcı kalkış',
    alternatives: ['Goblet Squat', 'Front Squat', 'Leg Press']
  },
  {
    id: 'leg_press',
    name: 'Leg Press',
    turkishName: 'Bacak İtiş Makinesi',
    category: 'legs',
    categoryLabel: 'Bacak',
    difficulty: 'Başlangıç',
    equipment: '45 Derece Leg Press Makinesi',
    primaryMuscles: ['Ön Bacak (Quadriceps)', 'Kalça'],
    secondaryMuscles: ['Arka Bacak', 'Kalf'],
    motionType: 'legs',
    shortDesc: 'Omurgaya yük bindirmeden bacak kaslarını maksimum ağırlıkla zorlamanın güvenli yolu.',
    stepByStep: [
      'Sırtını ve başını makinenin koltuğuna tamamen yasla, kalçanın kalkmadığından emin ol.',
      'Ayaklarını platformun ortasına omuz genişliğinde yerleştir.',
      'Güvenlik kilitlerini aç ve platformu dizlerin yaklaşık 90 derece bükülene kadar kontrollü indir.',
      'Topuklarınla platformu iterek bacaklarını düzleştir, ancak dizlerini tam kilitleme!'
    ],
    biloProTip: 'DİKKAT KANKA: Tepe noktada dizlerini asla tık diye kilitleme! Sürekli kas geriliminde kal, eklemlerini koru! ⚠️',
    commonMistakes: [
      'Tepe noktada diz eklemini tamamen kilitleyip yükü kemiğe bindirmek.',
      'Ağırlığı çok indirip kalçayı koltuktan kaldırmak (bel fıtığı riski).',
      'Ellerle dizleri iterek yardım almak.'
    ],
    breathingTip: 'Platform inerken nefes al, yukarı iterken nefes ver.',
    recommendedTempo: '2.5 sn iniş • 1.5 sn güçlü itiş',
    alternatives: ['Hack Squat', 'Barbell Squat', 'Dumbbell Lunge']
  },
  {
    id: 'romanian_deadlift',
    name: 'Romanian Deadlift (RDL)',
    turkishName: 'Romen Tipi Arka Bacak Kaldırışı',
    category: 'legs',
    categoryLabel: 'Bacak',
    difficulty: 'Orta',
    equipment: 'Barbell veya Dambıllar',
    primaryMuscles: ['Arka Bacak (Hamstrings)', 'Kalça (Glutes)'],
    secondaryMuscles: ['Bel (Erector Spinae)'],
    motionType: 'legs',
    shortDesc: 'Arka bacak ve kalça hattını kusursuz esnetip güçlendiren en etkili hareket.',
    stepByStep: [
      'Barı kalça hizasında tutarak ayakta dik dur, dizlerini çok hafif kırık (yumuşak) tut.',
      'Diz açını değiştirmeden kalçanı arkandaki duvara değdirmek ister gibi geriye it.',
      'Barı bacaklarına yapışık şekilde kaval kemiklerinin ortasına kadar indir.',
      'Arka bacaklarında güçlü bir esneme hissettiğinde kalçanı öne iterek doğrul.'
    ],
    biloProTip: 'Kanka bu harekette dizleri büküp squat yapma! Tek olay kalçayı geriye itip arka bacakları yay gibi germektir! 🏹',
    commonMistakes: [
      'Dizleri fazla bükerek hareketi squata dönüştürmek.',
      'Barı vücuttan uzakta tutarak beli sakatlamak.',
      'Sırtı yuvarlamak.'
    ],
    breathingTip: 'Aşağı eğilirken nefes al, kalçanı sıkıp doğrulurken nefes ver.',
    recommendedTempo: '3 sn yavaş iniş • 1 sn gerilme • 1 sn doğrulma',
    alternatives: ['Dumbbell RDL', 'Leg Curl Makinesi', 'Good Morning']
  },
  {
    id: 'lunges',
    name: 'Walking / Stationary Lunges',
    turkishName: 'Adımlama & Çömelme',
    category: 'legs',
    categoryLabel: 'Bacak',
    difficulty: 'Başlangıç',
    equipment: 'Vücut Ağırlığı veya Dambıllar',
    primaryMuscles: ['Ön Bacak', 'Kalça Kasları'],
    secondaryMuscles: ['Arka Bacak', 'Denge & Core'],
    motionType: 'legs',
    shortDesc: 'Tek bacak kuvvetini eşitleyen, kalçayı kaldıran ve dengeyi geliştiren dinamik egzersiz.',
    stepByStep: [
      'Ayakta dik dur, bir ayağınla öne doğru geniş bir adım at.',
      'Her iki dizin de 90 derece bükülene kadar gövdeni dik tutarak alçal.',
      'Arkada kalan dizin yere hafifçe yaklaşsın ancak çarpmamalı.',
      'Öndeki ayağının topuğundan güç alarak başlangıç pozisyonuna geri dön.'
    ],
    biloProTip: 'Öndeki dizin ayak parmak ucunu çok fazla geçmesin kanka! Ağırlığı öndeki topuğuna ver, kalçandaki alevi hisset! 🔥',
    commonMistakes: [
      'Gövdeyi aşırı öne eğmek.',
      'Arka dizi yere sertçe çarpmak.',
      'Adımı çok dar atarak diz eklemine fazla baskı uygulamak.'
    ],
    breathingTip: 'Adım atıp alçalırken nefes al, kendini geri iterken nefes ver.',
    recommendedTempo: '2 sn alçalma • 1 sn kalkış',
    alternatives: ['Bulgarian Split Squat', 'Step-up', 'Reverse Lunge']
  },

  // --- OMUZ (SHOULDERS) ---
  {
    id: 'overhead_press',
    name: 'Overhead Shoulder Press',
    turkishName: 'Baş Üstü Omuz Presi (OHP)',
    category: 'shoulders',
    categoryLabel: 'Omuz',
    difficulty: 'Orta',
    equipment: 'Barbell veya Dambıllar',
    primaryMuscles: ['Ön Omuz (Anterior Deltoid)', 'Yan Omuz'],
    secondaryMuscles: ['Triceps', 'Üst Göğüs', 'Core'],
    motionType: 'push',
    shortDesc: 'Geniş ve top gibi yuvarlak omuzlar inşa etmenin en saf bileşik hareketi.',
    stepByStep: [
      'Barı köprücük kemiği hizasında, eller omuz genişliğinde tut.',
      'Karın ve kalça kaslarını taş gibi sık, belini geriye yay yapma.',
      'Barı başının üzerinden yukarı doğru dümdüz bir çizgide it.',
      'Bar alnını geçerken başını hafifçe öne alarak barın tam altına gir.',
      'Kollar yukarıda uzandığında ağırlığı kontrollü şekilde göğüs üstüne indir.'
    ],
    biloProTip: 'Kanka belini geriye bükme! Omuz presi yaparken beli arkaya atarsan hareket eğimli göğüs presine döner ve belini zorlar. Dik dur!',
    commonMistakes: [
      'Aşırı bel kavislenmesi (arka bel ağrısının 1 numaralı sebebi).',
      'Barı yukarı iterken kafayı geri çekmemek ve bara çarpmak.',
      'Bacaklardan dizleri büküp zıplayarak itmek (strict pres kurallarına uy).'
    ],
    breathingTip: 'Kaldırmadan önce nefes al, bar tepeye ulaştığında nefes ver.',
    recommendedTempo: '1 sn patlayıcı itiş • 2.5 sn kontrollü iniş',
    alternatives: ['Dumbbell Shoulder Press', 'Seated OHP', 'Pike Push-up']
  },
  {
    id: 'lateral_raise',
    name: 'Dumbbell Lateral Raise',
    turkishName: 'Yana Dambıl Açış',
    category: 'shoulders',
    categoryLabel: 'Omuz',
    difficulty: 'Başlangıç',
    equipment: 'Hafif/Orta Dambıllar',
    primaryMuscles: ['Yan Omuz (Lateral Deltoid)'],
    secondaryMuscles: ['Trapezler'],
    motionType: 'push',
    shortDesc: 'V-vücut siluetinin anahtarı olan yan omuz başlarını büyütür ve omuzları geniş gösterir.',
    stepByStep: [
      'Dambılları yanlarında tut, dizlerini ve dirseklerini çok hafif kırık tut.',
      'Gövdeni 5-10 derece hafifçe öne eğ.',
      'Ağırlıkları ellerinle değil, dirseklerinle iki yana doğru omuz hizasına kadar kaldır.',
      'Tepe noktada sanki elindeki sürahiden su döküyormuş gibi serçe parmağın hafif yukarı baksın.',
      'Omuz hizasında 1 saniye bekleyip yavaşça indir.'
    ],
    biloProTip: 'Kanka burada ağır kilo şovunu unut! 20 kilo alıp sallanarak yapacağına 6-8 kilo alıp dirseklerinle izole et, yan omuzların alev alsın! 🔥🥥',
    commonMistakes: [
      'Vücudu öne arkaya sallayarak ivmeyle kaldırmak.',
      'Dambılları omuz seviyesinden çok daha yukarı fırlatıp trapeze devretmek.',
      'Kolları tamamen dümdüz kitlemek.'
    ],
    breathingTip: 'Kolları yana açarken nefes ver, indirirken yavaşça nefes al.',
    recommendedTempo: '1 sn kaldırış • 1 sn tepe bekleme • 2 sn yavaş iniş',
    alternatives: ['Cable Lateral Raise', 'Tek Kol Lateral Raise', 'Makine Yana Açış']
  },
  {
    id: 'face_pull',
    name: 'Face Pull',
    turkishName: 'Halatla Yüze Çekiş',
    category: 'shoulders',
    categoryLabel: 'Omuz / Duruş',
    difficulty: 'Başlangıç',
    equipment: 'Kablo İstasyonu & Çift Halat Aparatı',
    primaryMuscles: ['Arka Omuz (Rear Deltoid)', 'Rotator Manşet'],
    secondaryMuscles: ['Trapezler', 'Rhomboids'],
    motionType: 'pull',
    shortDesc: 'Hem arka omuzu geliştirir hem de masa başı kamburluğunu düzelten bir postür mucizesidir.',
    stepByStep: [
      'Kablo makinesini göz hizasına ayarla ve halatı baş parmakların geriye bakacak şekilde kavra.',
      'Birkaç adım geriye çekilerek kabloda sürekli gerginlik sağla.',
      'Halatı burnuna / göz hizana doğru çekerken dirseklerini yukarıda ve geniş tut.',
      'Tepe noktada ellerini birbirinden ayırarak dışa doğru döndür (external rotation).',
      'Arka omuzları sıkarak kontrollü şekilde geri uzat.'
    ],
    biloProTip: 'Her antrenmanına mutlaka Face Pull ekle kanka! Omuz sakatlıklarından korunmak ve dik bir duruş kazanmak için en değerli hareket budur! 🛡️✨',
    commonMistakes: [
      'Aşırı ağırlık takıp gövdeyi geriye fırlatmak.',
      'Dirsekleri aşağı düşürmek (arka omuz aktivasyonu kaybolur).',
      'Hareketi göğse doğru çekip sırt egzersizine dönüştürmek.'
    ],
    breathingTip: 'Halatı yüzüne çekerken nefes ver, öne uzatırken nefes al.',
    recommendedTempo: '1.5 sn çekiş • 1.5 sn tepe sıkma • 2 sn dönüş',
    alternatives: ['Rear Delt Fly (Ters Kelebek)', 'Eğilerek Yana Açış (Bent Over Raise)']
  },

  // --- KOL (ARMS) ---
  {
    id: 'barbell_curl',
    name: 'Barbell Biceps Curl',
    turkishName: 'Halterle Pazu Bükme',
    category: 'arms',
    categoryLabel: 'Kol',
    difficulty: 'Başlangıç',
    equipment: 'Düz veya Z-Barbell',
    primaryMuscles: ['Biceps (Pazu Kasları)'],
    secondaryMuscles: ['Ön Kol (Brachioradialis)'],
    motionType: 'arms',
    shortDesc: 'Daha büyük ve tepe noktalı (peak) bicepsler için en popüler kol egzersizi.',
    stepByStep: [
      'Ayakta dik dur, barı avuç içleri yukarı bakacak şekilde omuz genişliğinde tut.',
      'Dirseklerini gövdenin iki yanına sabitle (öne veya arkaya kaymamalı).',
      'Sadece ön kollarını hareket ettirerek barı göğüs hizasına doğru bük.',
      'Tepe noktada pazu kaslarını maksimum güçle 1 saniye sıkıştır.',
      'Ağırlığı kontrollü şekilde ve kollarını tam açana kadar yavaşça indir.'
    ],
    biloProTip: 'Kanka dirseklerini göğsüne doğru öne kaydırma! Dirsekleri kaburgalarına yapıştır, saf kol gücüyle kaldır! 💪',
    commonMistakes: [
      'Beli öne arkaya sallayarak ivme kullanmak.',
      'Dirsekleri öne fırlatarak yükü ön omuza aktarmak.',
      'İniş aşamasında ağırlığı aniden serbest bırakmak.'
    ],
    breathingTip: 'Barı kaldırırken nefes ver, aşağı indirirken nefes al.',
    recommendedTempo: '1 sn kaldırış • 1 sn sıkıştırma • 2.5 sn yavaş iniş',
    alternatives: ['Dumbbell Curl', 'Incline Dumbbell Curl', 'Cable Curl']
  },
  {
    id: 'triceps_pushdown',
    name: 'Triceps Rope Pushdown',
    turkishName: 'Kablo Halat Arka Kol İtiş',
    category: 'arms',
    categoryLabel: 'Kol',
    difficulty: 'Başlangıç',
    equipment: 'Kablo İstasyonu & Halat Aparatı',
    primaryMuscles: ['Triceps (Arka Kol - Yan & Dış Baş)'],
    secondaryMuscles: ['Ön Kol'],
    motionType: 'arms',
    shortDesc: 'Kolun 3’te 2’sini oluşturan triceps kaslarını parçalayarak kola kalınlık kazandırır.',
    stepByStep: [
      'Kabloyu üst makaraya tak, halatı nötr tutuşla kavra.',
      'Gövdeni hafifçe öne eğ, dirseklerini vücudunun yanlarına kilitle.',
      'Kollarını aşağıya doğru tamamen dümdüz olana kadar uzat.',
      'Dip noktada halatın iki ucunu dışarıya doğru açarak tricepsleri kilitler gibi sık.',
      'Dirseklerini oynatmadan ön kollarını göğüs hizasına kadar yavaşça geri bırak.'
    ],
    biloProTip: 'Kolunun büyük görünmesini istiyorsan biceps değil triceps çalış kanka! Kol hacminin %65’i tricepstir! Dip noktada halatı iki yana açmayı unutma! ⚡',
    commonMistakes: [
      'Dirsekleri öne arkaya kanat gibi oynatmak.',
      'Omuzları kullanarak ağırlığı aşağı ezmeye çalışmak.',
      'Tam düzleşme yapmadan yarım tekrar yapmak.'
    ],
    breathingTip: 'Aşağı itip sıkarken nefes ver, yukarı dönüşte nefes al.',
    recommendedTempo: '1 sn itiş • 1 sn kasılma • 2 sn kontrollü dönüş',
    alternatives: ['Skull Crusher (Alna Triceps)', 'Dips', 'Overhead Dumbbell Extension']
  },
  {
    id: 'hammer_curl',
    name: 'Dumbbell Hammer Curl',
    turkishName: 'Çekiç Büküş (Hammer Curl)',
    category: 'arms',
    categoryLabel: 'Kol',
    difficulty: 'Başlangıç',
    equipment: 'Dambıllar',
    primaryMuscles: ['Brachialis (Kol Kalınlığı)', 'Biceps'],
    secondaryMuscles: ['Ön Kol (Brachioradialis)'],
    motionType: 'arms',
    shortDesc: 'Kolları önden bakıldığında daha geniş ve kalın gösteren brachialis kasını hedefler.',
    stepByStep: [
      'Dambılları avuç içlerin birbirine bakacak şekilde (çekiç tutuşu) yanlarında tut.',
      'Dirseklerini gövdeye sabitleyerek dambılları yukarı doğru bük.',
      'Bileklerini döndürme; tutuş daima nötr kalsın.',
      'Tepe noktada 1 saniye sıkıştır ve kontrollüce başlangıç pozisyonuna indir.'
    ],
    biloProTip: 'Kollarına önden bakınca kalınlık katmak istiyorsan Hammer Curl şart kanka! Bileklerini dimdik tut, sağlam kavra! 🔨',
    commonMistakes: [
      'Bilekleri gevşetmek veya içe bükmek.',
      'Gövdeyi sallamak.',
      'Hareketi çok hızlı ve kontrolsüz yapmak.'
    ],
    breathingTip: 'Kaldırırken nefes ver, indirirken nefes al.',
    recommendedTempo: '1.5 sn kaldırış • 2 sn iniş',
    alternatives: ['Rope Cable Hammer Curl', 'Preacher Hammer Curl']
  },

  // --- KARIN & CORE (ABS) ---
  {
    id: 'plank',
    name: 'Plank',
    turkishName: 'Statik Karın Duruşu',
    category: 'core',
    categoryLabel: 'Karın / Core',
    difficulty: 'Başlangıç',
    equipment: 'Vücut Ağırlığı & Mat',
    primaryMuscles: ['Transversus Abdominis (Derin Karın)', 'Tüm Core'],
    secondaryMuscles: ['Omuzlar', 'Kalça', 'Ön Bacak'],
    motionType: 'core',
    shortDesc: 'Korse etkisi yaratarak beli incelten ve omurgayı koruyan en temel izometrik egzersiz.',
    stepByStep: [
      'Ön kollarını yere koy, dirseklerin tam omuzlarının altında olsun.',
      'Bacaklarını geriye uzat, ayak parmak uçlarında yüksel.',
      'Başından topuklarına kadar dümdüz bir tahta (plank) hattı oluştur.',
      'Karnını içeri çekip taş gibi sık, kalçanı da sıkıca kenetle.',
      'Nefesini tutmadan derin nefes alıp vererek belirlenen süre boyunca sabit kal.'
    ],
    biloProTip: 'Kanka belin aşağı çöküyorsa omurgana yük biner! Karnını birisi karnına yumruk atacakmış gibi sık ve nefes alıp vermeyi asla unutma! ⏱️🧱',
    commonMistakes: [
      'Belin aşağı çöküp yay gibi olması.',
      'Kalçayı tepe gibi yukarı kaldırmak.',
      'Nefesi tutmak (tansiyonu yükseltir).'
    ],
    breathingTip: 'Pozisyon boyunca ritmik, sakin ve derin nefes alıp ver.',
    recommendedTempo: '30 - 60 saniye kesintisiz statik duruş',
    alternatives: ['Side Plank', 'Hollow Body Hold', 'Ab Wheel Rollout']
  },
  {
    id: 'hanging_leg_raise',
    name: 'Hanging Leg Raise',
    turkishName: 'Barfikste Bacak Kaldırma',
    category: 'core',
    categoryLabel: 'Karın / Core',
    difficulty: 'Orta',
    equipment: 'Barfiks Barı veya Kaptan Koltuğu',
    primaryMuscles: ['Alt Karın (Lower Abs)', 'Iliopsoas'],
    secondaryMuscles: ['Ön Kol (Grip)', 'Üst Karın'],
    motionType: 'core',
    shortDesc: 'En inatçı bölge olan alt karın kaslarını en sert çalıştıran ve parçalayan hareket.',
    stepByStep: [
      'Barfiks barına tutunup kendini serbest bırak, vücudunu sabit tut.',
      'Gövdeni sallamadan, karın kaslarını sıkarak bacaklarını öne ve yukarı doğru kaldır.',
      'Başlangıçta dizlerini bükerek (knee raise) yapabilirsin; ilerledikçe bacaklarını düz tut.',
      'Bacaklarını yere paralel veya daha yukarı kaldırdığında kalçanı da hafifçe yukarı yuvarla.',
      'Bacaklarını yavaşça ve sallanmadan başlangıç konumuna indir.'
    ],
    biloProTip: 'Kanka sırf bacaklarını kaldırma! Kalçanı da göğsüne doğru yuvarla ki asıl karın kası sıkışsın. Sallanmayı tamamen yok et! 🎯',
    commonMistakes: [
      'İleri geri sallanarak ivmeyle bacak savurmak.',
      'Sadece kalça fleksörlerini kullanıp karın kaslarını devreye sokmamak.',
      'Bacakları çok hızlı aşağı bırakmak.'
    ],
    breathingTip: 'Bacakları yukarı çekerken nefesini tamamen boşalt, indirirken nefes al.',
    recommendedTempo: '1 sn patlayıcı kaldırış • 1 sn tepe sıkma • 2 sn kontrollü iniş',
    alternatives: ['Knee Raise (Diz Çekme)', 'Yatarak Leg Raise', 'L-Sit']
  },
  {
    id: 'bicycle_crunches',
    name: 'Bicycle Crunches',
    turkishName: 'Bisiklet Mekiği',
    category: 'core',
    categoryLabel: 'Karın / Core',
    difficulty: 'Başlangıç',
    equipment: 'Vücut Ağırlığı & Mat',
    primaryMuscles: ['Yan Karın (Obliques)', 'Tüm Karın Kasları'],
    secondaryMuscles: ['Kalça Fleksörleri'],
    motionType: 'core',
    shortDesc: 'Bilimsel EMG testlerinde en yüksek karın kası aktivasyonuna sahip egzersizlerden biri.',
    stepByStep: [
      'Sırtüstü uzan, ellerini başının arkasına hafifçe koy (boynunu çekme).',
      'Dizlerini 90 derece büküp havaya kaldır, kürek kemiklerini yerden hafifçe ayır.',
      'Sol bacağını ileri uzatırken sağ dizini göğsüne çek ve sol dirseğini sağ dizine yaklaştır.',
      'Ardından hareketi tersine çevirerek pedal çevirir gibi ritmik ve kontrollü şekilde devam et.'
    ],
    biloProTip: 'Hızlı hızlı sallanma kanka! Hareketi ne kadar yavaş ve dönerek yaparsan yan karın kasların o kadar cayır cayır yanar! 🔥🚲',
    commonMistakes: [
      'Ellerle boynu öne doğru aşırı çekmek.',
      'Dönüş hareketini yapmadan sadece dirsekleri oynatmak.',
      'Bacakları kontrolsüzce savurmak.'
    ],
    breathingTip: 'Her rotasyonda (dizle dirsek buluştuğunda) nefes ver.',
    recommendedTempo: '20-30 tekrar kontrollü tempo',
    alternatives: ['Russian Twist', 'Mountain Climbers', 'Klasik Mekik'],
    locationType: 'home',
    gifUrl: '/exercises/bicycle_crunches.gif'
  },

  // --- EVDE ANTRENMAN İÇİN ÖZEL HAREKETLER ---
  {
    id: 'bodyweight_squat',
    name: 'Bodyweight Squat (Air Squat)',
    turkishName: 'Vücut Ağırlığı Squat (Çömelme)',
    category: 'legs',
    categoryLabel: 'Bacak / Kalça',
    difficulty: 'Başlangıç',
    equipment: 'Vücut Ağırlığı (Sıfır Ekipman)',
    locationType: 'home',
    gifUrl: '/exercises/bodyweight_squat.gif',
    primaryMuscles: ['Ön Bacak (Quadriceps)', 'Büyük Kalça (Gluteus Maximus)'],
    secondaryMuscles: ['Arka Bacak (Hamstrings)', 'Core'],
    motionType: 'legs',
    shortDesc: 'Evde bacak ve kalça gelişimi için en temel ve etkili serbest çömelme hareketi.',
    stepByStep: [
      'Ayaklarını omuz genişliğinde aç, ayak parmak uçlarını hafifçe (15-30 derece) dışarı döndür.',
      'Göğsünü dik tut, kollarını öne uzatarak dengeni sağla.',
      'Kalçanı geriye bir sandalyeye oturur gibi iterek uylukların yere paralel olana dek alçal.',
      'Topuklarından güç alarak kendini patlayıcı şekilde yukarı it ve tepe noktada kalçanı 1 saniye sık.'
    ],
    biloProTip: 'Kanka dizlerin içe çökmesin ve topukların yerden kalkmasın! Ağırlığı tam topuklarına ver, bacakların alev alsın! 🦵🔥',
    commonMistakes: [
      'Topukları yerden kaldırmak veya dizleri içe doğru bükmek.',
      'Sırtı aşırı öne büküp beli kamburlaştırmak.',
      'Yeterli derinliğe inmemek (paralelin üstünde kalmak).'
    ],
    breathingTip: 'Aşağı çömelirken burnundan derin nefes al, yukarı kalkarken ağzından nefes ver.',
    recommendedTempo: '3 sn iniş • 1 sn dipte bekle • 1 sn kalkış',
    alternatives: ['Bulgarian Split Squat', 'Lunges', 'Goblet Squat']
  },
  {
    id: 'chair_dips',
    name: 'Chair / Couch Dips',
    turkishName: 'Sandalye & Koltuk Kenarı Dips',
    category: 'arms',
    categoryLabel: 'Arka Kol (Triceps)',
    difficulty: 'Başlangıç',
    equipment: 'Sandalye veya Koltuk',
    locationType: 'home',
    gifUrl: '/exercises/chair_dips.gif',
    primaryMuscles: ['Triceps (Arka Kol)'],
    secondaryMuscles: ['Ön Omuz', 'Alt Göğüs'],
    motionType: 'push',
    shortDesc: 'Evdeki bir sandalye veya koltukla arka kollarınızı şişiren efsanevi vücut ağırlığı itişi.',
    stepByStep: [
      'Sağlam bir sandalyenin veya koltuğun ucuna otur, ellerini kalçanın iki yanına yerleştir.',
      'Kalçanı sandalyeden birkaç santim öne kaydır, bacaklarını 90 derece bük veya ileri uzat.',
      'Dirseklerini 90 derece bükerek gövdeni dik bir şekilde aşağı doğru kontrollü indir.',
      'Avuç içlerinle sandalyeyi aşağı iterek gövdeni yukarı kaldır ve tepe noktada arka kollarını sık.'
    ],
    biloProTip: 'Kanka kalçanı sandalyeden çok ileri açma, omurgan sandalyeye yakın insin ki omuzlarını zorlamadan doğrudan arka kolları hedeflesin! 💥',
    commonMistakes: [
      'Dirsekleri yanlara doğru aşırı açmak.',
      'Gövdeyi sandalyeden çok uzağa taşımak (omuz sakatlığı riski).',
      'Tepe noktada arka kolu yeterince kasmamak.'
    ],
    breathingTip: 'İnerken nefes al, yukarı iterken nefes ver.',
    recommendedTempo: '2 sn iniş • 1 sn tepe kasılma • 12-15 tekrar',
    alternatives: ['Diamond Push-up', 'Triceps Pushdown', 'Dips']
  },
  {
    id: 'diamond_pushup',
    name: 'Diamond Push-up',
    turkishName: 'Elmas Şınav (İç Göğüs & Triceps)',
    category: 'chest',
    categoryLabel: 'Göğüs & Kol',
    difficulty: 'Orta',
    equipment: 'Vücut Ağırlığı',
    locationType: 'home',
    gifUrl: '/exercises/diamond_pushup.gif',
    primaryMuscles: ['Triceps (Arka Kol)', 'İç Göğüs'],
    secondaryMuscles: ['Ön Omuz', 'Core'],
    motionType: 'push',
    shortDesc: 'Elleri birleştirerek yapılan, arka kolları ve iç göğüs çizgisini inşa eden yoğun şınav türü.',
    stepByStep: [
      'Yere şınav pozisyonu al, ellerini göğsünün tam altında başparmak ve işaret parmakların üçgen (elmas) oluşturacak şekilde birleştir.',
      'Vücudunu düz bir tahta gibi tut, belini sarkıtma.',
      'Göğsünü ellerinin tam ortasına değdirecek kadar kontrollü indir.',
      'Avuç içlerinle yeri iterek kalk ve tepe noktada arka kolları ve iç göğsü kitlemeden sık.'
    ],
    biloProTip: 'Kanka standart şınav hafif geliyorsa elmas şınav arka kolları fırın gibi yakar! Dirseklerini vücuduna yakın tut! 💎⚡',
    commonMistakes: [
      'Belin aşağı çökmesi veya kalçanın yukarı fırlaması.',
      'Elleri göğüs yerine kafanın çok ilerisine koymak.'
    ],
    breathingTip: 'İnerken nefes al, yeri iterken güçlüce nefes ver.',
    recommendedTempo: '2 sn iniş • 1 sn tepe kasılma • 8-12 tekrar',
    alternatives: ['Chair Dips', 'Klasik Şınav', 'Close-grip Bench']
  },
  {
    id: 'bulgarian_split_squat',
    name: 'Bulgarian Split Squat',
    turkishName: 'Koltuk Destekli Bulgar Split Squat',
    category: 'legs',
    categoryLabel: 'Bacak & Kalça',
    difficulty: 'Orta',
    equipment: 'Koltuk, Sandalye veya Yatak Kenarı',
    locationType: 'home',
    gifUrl: '/exercises/bulgarian_split_squat.gif',
    primaryMuscles: ['Ön Bacak (Quadriceps)', 'Kalça (Gluteus Maximus)'],
    secondaryMuscles: ['Arka Bacak (Hamstrings)', 'Denge Kasları'],
    motionType: 'legs',
    shortDesc: 'Evde ağırlık kullanmadan bacak ve kalçayı salon seviyesinde yoran tek bacak dev egzersizi.',
    stepByStep: [
      'Koltuktan veya sandalyeden bir adım öne çık, bir ayağının üstünü koltuğun kenarına yerleştir.',
      'Gövdeni dik tut, ağırlığını öndeki bacağına ver.',
      'Öndeki diz 90 derece bükülene ve arkadaki diz yere yaklaşana dek kontrollü çömel.',
      'Ön topuktan yeri iterek başlangıç pozisyonuna dön.'
    ],
    biloProTip: 'Kanka bu hareket bacakların gizli silahıdır! Bacak başına 10 tekrar yap, salondaki leg press makinesini aratmaz! 🔥🦵',
    commonMistakes: [
      'Ön ayağı koltuğa çok yakın basıp dizin aşırı öne fırlaması.',
      'Ağırlığı arka bacağa bindirmek.'
    ],
    breathingTip: 'İnerken nefes al, öndeki bacakla kalkarken ver.',
    recommendedTempo: '3 sn iniş • 1 sn kalkış • Her bacak 10-12 tekrar',
    alternatives: ['Lunges', 'Bodyweight Squat', 'Step-up']
  },
  {
    id: 'glute_bridge',
    name: 'Glute Bridge (Köprü Hareketi)',
    turkishName: 'Zeminde Kalça Köprüsü',
    category: 'legs',
    categoryLabel: 'Kalça & Arka Bacak',
    difficulty: 'Başlangıç',
    equipment: 'Zemin & Mat',
    locationType: 'home',
    gifUrl: '/exercises/glute_bridge.gif',
    primaryMuscles: ['Kalça (Gluteus Maximus)', 'Arka Bacak (Hamstring)'],
    secondaryMuscles: ['Bel ve Core Dengeleyicileri'],
    motionType: 'legs',
    shortDesc: 'Bel sağlığını korurken kalça kaslarını izole eden sıfır ekipmanlı ev favorisi.',
    stepByStep: [
      'Sırtüstü yat, dizlerini büküp ayak tabanlarını kalça genişliğinde yere bas.',
      'Kollarını iki yana destek olarak uzat.',
      'Topuklarından güç alarak kalçanı yukarı kaldır; dizlerden omuzlara düz bir hat oluştur.',
      'Tepe noktada kalçanı 2 saniye boyunca kaskatı sık ve yavaşça indir.'
    ],
    biloProTip: 'Kanka hareketi belinle değil kalçanla yap! Tepe noktada kalçanı 2 saniye sık, farkı anında göreceksin! 🍑💪',
    commonMistakes: [
      'Beli aşırı çukurlaştırarak omurgaya yük bindirmek.',
      'Hızlıca inip kalkarak kalçayı sıkıştırmayı atlamak.'
    ],
    breathingTip: 'Kalçayı kaldırırken nefes ver, indirirken nefes al.',
    recommendedTempo: '1 sn kalkış • 2 sn tepe sıkma • 2 sn iniş',
    alternatives: ['Romanian Deadlift', 'Hip Thrust', 'Bulgarian Split Squat']
  },
  {
    id: 'mountain_climbers',
    name: 'Mountain Climbers',
    turkishName: 'Dağ Tırmanışı (Kardiyo & Karın)',
    category: 'core',
    categoryLabel: 'Karın / Kardiyo',
    difficulty: 'Başlangıç',
    equipment: 'Vücut Ağırlığı',
    locationType: 'home',
    gifUrl: '/exercises/mountain_climbers.gif',
    primaryMuscles: ['Karın Kasları (Rectus Abdominis)', 'Kardiyovasküler Kondisyon'],
    secondaryMuscles: ['Omuzlar', 'Kalça Fleksörleri'],
    motionType: 'core',
    shortDesc: 'Hem kalori yakan hem de karın kaslarını çelik gibi sertleştiren dinamik ev kardiyosu.',
    stepByStep: [
      'Şınav (yüksek plank) pozisyonuna geç, ellerini omuzlarının tam altına koy.',
      'Gövdeni düz tut, bir dizini göğsüne doğru seri şekilde çek.',
      'Bacakları sırayla değiştirerek dağa tırmanır gibi ritmik ve tempolu koşu hareketi yap.'
    ],
    biloProTip: 'Kanka kalçanı tavana dikme, gövdeni şınav tahtası gibi tut ve tempoyu koru! ⚡🔥',
    commonMistakes: [
      'Kalçayı havaya dikmek.',
      'Elleri omuzların gerisinde bırakmak.'
    ],
    breathingTip: 'Ritmik nefes alıp vererek tempoyu destekle.',
    recommendedTempo: '30-45 saniye aralıksız seri tempo',
    alternatives: ['Bicycle Crunches', 'Plank', 'Burpee']
  },
  {
    id: 'pike_pushup',
    name: 'Pike Push-up',
    turkishName: 'Pike Şınav (Evde Omuz Geliştirici)',
    category: 'shoulders',
    categoryLabel: 'Omuz',
    difficulty: 'Orta',
    equipment: 'Vücut Ağırlığı',
    locationType: 'home',
    gifUrl: '/exercises/pike_pushup.gif',
    primaryMuscles: ['Ön ve Yan Omuz (Deltoids)'],
    secondaryMuscles: ['Triceps', 'Üst Göğüs'],
    motionType: 'push',
    shortDesc: 'Dambıl olmadan evde hacimli ve geniş omuzlar inşa etmenin 1 numaralı vücut ağırlığı hareketi.',
    stepByStep: [
      'Şınav pozisyonu al, ardından ayaklarını ellerine doğru yaklaştırarak kalçanı yukarı kaldır (Ters V duruşu).',
      'Başını iki elinin arasına doğru öne ve aşağı doğru kontrollü indir.',
      'Yeri avuçlarınla iterek başını yukarı çıkar ve omuz kaslarını sık.'
    ],
    biloProTip: 'Kanka evde dambıl yok diye omuz çalışamayacağını sanma! Pike şınav omuz başlarını taş gibi yapar! 🥥💪',
    commonMistakes: [
      'Kalçayı indirip standart şınava dönüştürmek.',
      'Boynu aşırı zorlamak.'
    ],
    breathingTip: 'İnerken nefes al, yukarı iterken nefes ver.',
    recommendedTempo: '2 sn iniş • 1 sn itiş • 8-12 tekrar',
    alternatives: ['Overhead Press', 'Lateral Raise', 'Handstand Push-up']
  },
  {
    id: 'crunches',
    name: 'Crunches',
    turkishName: 'Klasik Karın Mekiği (Crunch)',
    category: 'core',
    categoryLabel: 'Karın / Core',
    difficulty: 'Başlangıç',
    equipment: 'Mat / Zemin',
    locationType: 'home',
    gifUrl: '/exercises/crunches.gif',
    primaryMuscles: ['Üst ve Orta Karın (Rectus Abdominis)'],
    secondaryMuscles: ['Transversus Abdominis'],
    motionType: 'core',
    shortDesc: 'Beli zorlamadan üst karın liflerini maksimum oranda sıkıştıran temel karın hareketi.',
    stepByStep: [
      'Sırtüstü uzan, dizlerini bük ve ayak tabanlarını yere bas.',
      'Ellerini şakaklarına koy veya göğsünde çapraz yap (boynunu çekme).',
      'Sadece kürek kemiklerini yerden 10 cm kaldırarak karnını sık ve tepe noktada 1 saniye bekle.',
      'Yavaşça geri in ve karındaki gerilimi koru.'
    ],
    biloProTip: 'Kanka belini yerden kaldırma, sadece kürek kemiklerin kalksın! Karnını havlu sıkar gibi sık! 🧱🔥',
    commonMistakes: [
      'Ellerle boynu zorlayıp boyun fıtığı riski yaratmak.',
      'Hareketi momentumla sallanarak yapmak.'
    ],
    breathingTip: 'Kalkarken nefesini tamamen boşalt, inerken nefes al.',
    recommendedTempo: '15-20 kontrollü tekrar',
    alternatives: ['Plank', 'Bicycle Crunches', 'Leg Raise']
  },
  {
    id: 'russian_twist',
    name: 'Russian Twist',
    turkishName: 'Russian Twist (Yan Karın Burgusu)',
    category: 'core',
    categoryLabel: 'Karın / Core',
    difficulty: 'Başlangıç',
    equipment: 'Vücut Ağırlığı veya Su Şişesi',
    locationType: 'home',
    gifUrl: '/exercises/russian_twist.gif',
    primaryMuscles: ['Yan Karın (Obliques)'],
    secondaryMuscles: ['Tüm Karın', 'Kalça Fleksörleri'],
    motionType: 'core',
    shortDesc: 'Bel inceltme ve adonis çizgilerini belirginleştirme için harika bir rotasyonel core hareketi.',
    stepByStep: [
      'Yere otur, gövdeni 45 derece geriye yatır ve dizlerini hafifçe kırarak dengede dur.',
      'Ellerini önünde birleştir (istersen su şişesi tut).',
      'Gövdeni kontrollüce sağa çevirip ellerini yere yaklaştır, ardından sola çevir.'
    ],
    biloProTip: 'Kanka sadece kollarını değil bütün göğüs kafesini çevir ki yan karınların cayır cayır çalışsın! 🔥',
    commonMistakes: [
      'Sırtı kamburlaştırmak.',
      'Yalnızca kolları sallamak.'
    ],
    breathingTip: 'Her dönüşte nefes ver.',
    recommendedTempo: '20-30 tekrar',
    alternatives: ['Bicycle Crunches', 'Side Plank']
  },
  {
    id: 'dumbbell_curl',
    name: 'Dumbbell Biceps Curl',
    turkishName: 'Dambıl Pazu Bükme',
    category: 'arms',
    categoryLabel: 'Ön Kol / Pazu',
    difficulty: 'Başlangıç',
    equipment: 'Dambıllar veya Su Şişeleri',
    locationType: 'both',
    gifUrl: '/exercises/dumbbell_curl.gif',
    primaryMuscles: ['Biceps Brachii (Pazu)'],
    secondaryMuscles: ['Brachialis', 'Ön Kol'],
    motionType: 'arms',
    shortDesc: 'Evde veya salonda kolların tepe noktasını (peak) inşa eden en popüler pazu hareketi.',
    stepByStep: [
      'Ayakta dik dur, ellerinde dambıllar (veya su şişeleri) olsun, avuç içleri vücuda baksın.',
      'Dirseklerini gövdenin yanına sabitle.',
      'Ağırlıkları yukarı doğru bükerken bileğini dışa çevir (supinasyon) ve tepe noktada pazunu taş gibi sık.',
      '2 saniyede kontrollü şekilde başlangıç noktasına indir.'
    ],
    biloProTip: 'Kanka dirseklerini arkaya veya öne sallama! Dirsekler çiviyle gövdene çakılmış gibi sabit kalsın! 💪🎯',
    commonMistakes: [
      'Gövdeyi geriye sallayarak belden güç almak.',
      'Ağırlığı serbest düşüşe bırakmak.'
    ],
    breathingTip: 'Kaldırırken nefes ver, indirirken nefes al.',
    recommendedTempo: '2 sn iniş • 1 sn tepe kasılma • 10-12 tekrar',
    alternatives: ['Barbell Curl', 'Hammer Curl', 'Direnç Lastiği Büküş']
  },
  {
    id: 'seated_cable_row',
    name: 'Seated Cable Row',
    turkishName: 'Oturarak Kablo Kürek Çekiş',
    category: 'back',
    categoryLabel: 'Sırt & Kanat',
    difficulty: 'Orta',
    equipment: 'Kablo Kürek İstasyonu',
    locationType: 'gym',
    gifUrl: '/exercises/seated_cable_row.gif',
    primaryMuscles: ['Orta Sırt (Rhomboids)', 'Kanat (Latissimus Dorsi)'],
    secondaryMuscles: ['Biceps', 'Arka Omuz'],
    motionType: 'pull',
    shortDesc: 'Sırta kalınlık, derinlik ve güçlü bir duruş kazandıran mükemmel bir salon çekiş hareketi.',
    stepByStep: [
      'Kablo istasyonuna otur, ayaklarını plakalara daya, dizlerini hafif kırık tut.',
      'Gövdeni dikleştir, kürek kemiklerini geriye çekerek aparatı karnına doğru çek.',
      'Dirseklerini arkaya sür ve kürek kemiklerini birbirine yapıştır.',
      'Kolları yavaşça öne uzatarak sırt kaslarını esnet.'
    ],
    biloProTip: 'Kanka geriye aşırı yatıp yaylanma! Gövden 90 derecede kalsın, sırtını sıkıştır! 🦅💪',
    commonMistakes: [
      'Beli bükerek kambur çekmek.',
      'Sadece kollarla çekip kürek kemiklerini sıkıştırmamak.'
    ],
    breathingTip: 'Çekerken nefes ver, bırakırken nefes al.',
    recommendedTempo: '2 sn bırakış • 1 sn çekiş • 1 sn sıkma',
    alternatives: ['Barbell Row', 'Dumbbell Row', 'Inverted Row']
  }
];

// Helper to find exercise by any keyword or name match
export function findExercise(query: string): ExerciseItem {
  if (!query) return EXERCISES_DATABASE[0];
  const clean = query.toLowerCase().trim();

  // 1. Exact or partial ID match
  const byId = EXERCISES_DATABASE.find((e) => e.id === clean || clean.includes(e.id));
  if (byId) return byId;

  // 2. Name or Turkish name match
  const byName = EXERCISES_DATABASE.find(
    (e) =>
      e.name.toLowerCase().includes(clean) ||
      clean.includes(e.name.toLowerCase()) ||
      e.turkishName.toLowerCase().includes(clean) ||
      clean.includes(e.turkishName.toLowerCase())
  );
  if (byName) return byName;

  // 3. Keyword matching (Extensive for both Home and Gym)
  const keywords: Record<string, string> = {
    // Evde Egzersizler
    'elmas şınav': 'diamond_pushup',
    'diamond push': 'diamond_pushup',
    'sandalye dips': 'chair_dips',
    'koltuk dips': 'chair_dips',
    'chair dip': 'chair_dips',
    'bench dip': 'chair_dips',
    'air squat': 'bodyweight_squat',
    'vücut ağırlığı squat': 'bodyweight_squat',
    'vucut agirligi squat': 'bodyweight_squat',
    'serbest squat': 'bodyweight_squat',
    'bulgar': 'bulgarian_split_squat',
    'bulgarian': 'bulgarian_split_squat',
    'köprü': 'glute_bridge',
    'kopru': 'glute_bridge',
    'bridge': 'glute_bridge',
    'glute bridge': 'glute_bridge',
    'tırmanış': 'mountain_climbers',
    'tirmanis': 'mountain_climbers',
    'mountain': 'mountain_climbers',
    'climber': 'mountain_climbers',
    'dağ tırmanışı': 'mountain_climbers',
    'pike': 'pike_pushup',
    'omuz şınav': 'pike_pushup',
    'twist': 'russian_twist',
    'russian': 'russian_twist',
    'yan karın': 'russian_twist',

    // Temel Hareketler
    bench: 'bench_press',
    göğüs: 'push_ups',
    chest: 'push_ups',
    şınav: 'push_ups',
    sinav: 'push_ups',
    pushup: 'push_ups',
    'push up': 'push_ups',
    squat: 'bodyweight_squat',
    çömelme: 'bodyweight_squat',
    bacak: 'bodyweight_squat',
    deadlift: 'deadlift',
    barfiks: 'pull_ups',
    pullup: 'pull_ups',
    'pull up': 'pull_ups',
    lat: 'lat_pulldown',
    kanat: 'lat_pulldown',
    pulldown: 'lat_pulldown',
    row: 'barbell_row',
    kürek: 'seated_cable_row',
    'kablo row': 'seated_cable_row',
    'seated row': 'seated_cable_row',
    omuz: 'overhead_press',
    shoulder: 'overhead_press',
    ohp: 'overhead_press',
    lateral: 'lateral_raise',
    'yana açış': 'lateral_raise',
    'yan açış': 'lateral_raise',
    'dambıl curl': 'dumbbell_curl',
    'dumbbell curl': 'dumbbell_curl',
    curl: 'dumbbell_curl',
    pazu: 'dumbbell_curl',
    biceps: 'dumbbell_curl',
    hammer: 'hammer_curl',
    çekiç: 'hammer_curl',
    triceps: 'chair_dips',
    'arka kol': 'chair_dips',
    dips: 'chair_dips',
    plank: 'plank',
    karın: 'crunches',
    karin: 'crunches',
    mekik: 'crunches',
    crunch: 'crunches',
    bisiklet: 'bicycle_crunches',
    bicycle: 'bicycle_crunches',
    lunge: 'lunges',
    adımlama: 'lunges',
    rdl: 'romanian_deadlift',
    'face pull': 'face_pull',
    'leg press': 'leg_press',
  };

  for (const [key, exId] of Object.entries(keywords)) {
    if (clean.includes(key)) {
      const found = EXERCISES_DATABASE.find((e) => e.id === exId);
      if (found) return found;
    }
  }

  // 4. Safe fallback: push_ups (always available, has verified GIF)
  return EXERCISES_DATABASE.find((e) => e.id === 'push_ups') || EXERCISES_DATABASE[0];
}

// Find all exercises mentioned in a text
export function detectExercisesInText(text: string): ExerciseItem[] {
  if (!text) return [];
  const lower = text.toLowerCase();
  const detected: ExerciseItem[] = [];

  for (const ex of EXERCISES_DATABASE) {
    const nameMatch = lower.includes(ex.name.toLowerCase());
    const trMatch = lower.includes(ex.turkishName.toLowerCase().split(' ')[0]);
    if (nameMatch || (trMatch && ex.turkishName.length > 3)) {
      if (!detected.some((d) => d.id === ex.id)) {
        detected.push(ex);
      }
    }
  }

  // Quick fallback keywords
  if (detected.length === 0) {
    if (lower.includes('bench')) {
      const e = EXERCISES_DATABASE.find((x) => x.id === 'bench_press');
      if (e) detected.push(e);
    }
    if (lower.includes('squat')) {
      const e = EXERCISES_DATABASE.find((x) => x.id === 'bodyweight_squat');
      if (e) detected.push(e);
    }
    if (lower.includes('şınav')) {
      const e = EXERCISES_DATABASE.find((x) => x.id === 'push_ups');
      if (e) detected.push(e);
    }
    if (lower.includes('plank') || lower.includes('karın')) {
      const e = EXERCISES_DATABASE.find((x) => x.id === 'plank');
      if (e) detected.push(e);
    }
  }

  return detected.slice(0, 4);
}

