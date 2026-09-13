export interface ExerciseMuscleFocus {
  name: string;
  percentage: number;
  role: 'primary' | 'secondary' | 'stabilizer';
  color: string;
}

export interface ExercisePhaseInfo {
  title: string;
  phaseName: string;
  posture: string;
  breathing: string;
  jointAngle: string;
  keyCue: string;
}

export interface ExerciseBiomechanicsData {
  gifUrl: string;
  startPhase: ExercisePhaseInfo;
  peakPhase: ExercisePhaseInfo;
  muscleFocus: ExerciseMuscleFocus[];
  tempoGuidance: string;
  kineticChain: string;
}

export const EXERCISE_BIOMECHANICS: Record<string, ExerciseBiomechanicsData> = {
  bench_press: {
    gifUrl: '/exercises/bench_press.gif',
    startPhase: {
      title: '1. Başlangıç / Negatif Faz (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Kürek kemikleri sehpaya kenetli, göğüs kafesi kabartılmış, ayaklar yere çakılı. Bar meme ucu hizasına 2 saniyede kontrollü iner.',
      breathing: 'Burnundan derin nefes al, göğüs kafesini havayla kilitle.',
      jointAngle: 'Dirsekler gövdeye 45° - 60° açıda',
      keyCue: 'Dirsekleri 90° yanlara açma, kürek kemiklerini asla bırakma.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve Faz (Konsantrik İtiş & Tepe Kasılma)',
      phaseName: 'Konsantrik (İtiş)',
      posture: 'Bar göğüsten patlayıcı bir güçle başlangıç konumuna itilir. Tepe noktada dirsekler kilitlenmeden göğüs kasları maksimum sıkılır.',
      breathing: 'Ağırlığı iterken ağzından güçlüce nefes ver.',
      jointAngle: '170° Dirsek açısı (Hafif yumuşak kilit)',
      keyCue: 'Barı ellerinle ortadan sıkıştırmak istercesine göğsünü kas.'
    },
    muscleFocus: [
      { name: 'Pectoralis Major (Orta & Ana Göğüs)', percentage: 70, role: 'primary', color: '#FACC15' },
      { name: 'Triceps Brachii (Arka Kol)', percentage: 20, role: 'secondary', color: '#38BDF8' },
      { name: 'Anterior Deltoid (Ön Omuz)', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn kontrollü iniş • 1 sn göğse temas • 1 sn patlayıcı itiş',
    kineticChain: 'Açık Kinetik Zincir • Yatay İtiş'
  },

  incline_dumbbell_press: {
    gifUrl: '/exercises/incline_dumbbell_press.gif',
    startPhase: {
      title: '1. Başlangıç / Esneme Fazı (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Sehpa 30-45° açıda. Dambıllar üst göğüs hizasında, avuç içleri hafif içe dönük, üst göğüs liflerinde derin gerilme hissi.',
      breathing: 'Dambılları aşağı indirirken nefes al.',
      jointAngle: '35° - 45° Sehpa Açısı • 45° Dirsek Açısı',
      keyCue: 'Dambılları omuz kapsülünü zorlayacak kadar aşırı derin düşürme.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve Kasılma Fazı (Konsantrik İtiş)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Dambıllar üst göğüs hizasında yukarı kavis çizerek itilir. Tepe noktada birbirine çarpmadan köprücük kemiği altındaki üst göğüs sıkılır.',
      breathing: 'Yukarı preslerken nefes ver.',
      jointAngle: '170° Üstte Dirsek Açısı',
      keyCue: 'Dambılları birbirine vurma; sürekli kas gerilimini koru.'
    },
    muscleFocus: [
      { name: 'Clavicular Pectoral (Üst Göğüs)', percentage: 75, role: 'primary', color: '#FACC15' },
      { name: 'Anterior Deltoid (Ön Omuz)', percentage: 15, role: 'secondary', color: '#38BDF8' },
      { name: 'Triceps (Arka Kol)', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '3 sn yavaş iniş • 1 sn üstte sıkıştırma • 1 sn itiş',
    kineticChain: 'Açık Kinetik Zincir • Eğimli İtiş'
  },

  push_ups: {
    gifUrl: '/exercises/push_ups.gif',
    startPhase: {
      title: '1. Başlangıç / İniş Fazı (Plank Hattı)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Eller omuz genişliğinden biraz geniş. Vücut baştan topuğa dümdüz plank hattında. Göğüs yere 2-3 cm yaklaşana kadar kontrollü alçalma.',
      breathing: 'Aşağı inerken burnundan nefes al.',
      jointAngle: 'Dirsekler geriye 45° açıda • 180° Omurga',
      keyCue: 'Kalçayı yukarı kaldırma, beli asla aşağı sarkıtma.'
    },
    peakPhase: {
      title: '2. Bitiş / Tepe Kilit Fazı (Güçlü İtiş)',
      phaseName: 'Konsantrik (Kalkış)',
      posture: 'Avuç içleriyle zemin güçlüce itilerek kollar düzleştirilir. Karın, kalça ve göğüs tepe noktada taş gibi sıkılır.',
      breathing: 'Yeri iterken güçlüce nefes ver.',
      jointAngle: 'Kollar tam uzanık, kürek kemikleri doğal protraksiyonda',
      keyCue: 'Yeri kendinden uzağa itiyormuş gibi kuvvet uygula.'
    },
    muscleFocus: [
      { name: 'Pectoralis Major (Tüm Göğüs)', percentage: 65, role: 'primary', color: '#FACC15' },
      { name: 'Triceps & Deltoids', percentage: 20, role: 'secondary', color: '#38BDF8' },
      { name: 'Core & Karın Stabilizasyonu', percentage: 15, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn iniş • 0 sn dip bekleme • 1 sn patlayıcı itiş',
    kineticChain: 'Kapalı Kinetik Zincir • Vücut Ağırlığı İtiş'
  },

  dips: {
    gifUrl: '/exercises/dips.gif',
    startPhase: {
      title: '1. Başlangıç / Derin İniş Fazı (Alt Göğüs Esnemesi)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Gövde 20-30° öne eğik, dirsekler 90° bükülerek vücut kontrollü alçaltılır. Alt göğüs kaslarında derin esneme hissedilir.',
      breathing: 'İnerken kontrollü nefes al.',
      jointAngle: '90° Dirsek Açısı • 25° Gövde Eğimi',
      keyCue: '90 dereceden daha derine inip omuz eklemini riske atma.'
    },
    peakPhase: {
      title: '2. Bitiş / Tepe İtiş Fazı (Alt Göğüs & Triceps Sıkışması)',
      phaseName: 'Konsantrik (Yükseliş)',
      posture: 'Barlardan güç alınarak gövde yukarı itilir. Tepe noktada alt göğüs çizgisi ve arka kollar sıkılır, omuzlar kulaktan uzak kalır.',
      breathing: 'Yukarı yükselirken nefes ver.',
      jointAngle: 'Kollar neredeyse düz, omuzlar kilitli aşağıda',
      keyCue: 'Gövde açısını dikleştirirsen yük tricepse kayar; öne eğik kal.'
    },
    muscleFocus: [
      { name: 'Alt Göğüs (Lower Pectoral)', percentage: 55, role: 'primary', color: '#FACC15' },
      { name: 'Triceps Brachii (Arka Kol)', percentage: 35, role: 'secondary', color: '#38BDF8' },
      { name: 'Anterior Deltoid & Core', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn iniş • 1 sn dip duraklama • 1 sn tepe itiş',
    kineticChain: 'Kapalı Kinetik Zincir • Dikey İtiş'
  },

  pull_ups: {
    gifUrl: '/exercises/pull_ups.gif',
    startPhase: {
      title: '1. Başlangıç / Asılma Fazı (Dead Hang & Scapular Hazırlık)',
      phaseName: 'Eksantrik (Asılma)',
      posture: 'Barda tam asılı pozisyon, kollar omuz genişliğinden biraz açık. Kürek kemikleri aşağı ve içeri kilitlenerek kanatlar aktif hale getirilir.',
      breathing: 'Aşağıda asılıyken derin nefes al.',
      jointAngle: '180° Kollar • Nötr Omurga',
      keyCue: 'Bacaklarını arkada çaprazlayıp gövdeyi sallantısız sabitle.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve Çekiş Fazı (Kanat Kasılması)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Dirsekler aşağı ve arka ceplere doğru çekilir. Çene barı geçer, göğüs bara yaklaşır ve sırt kanat kasları tepe noktada ezilircesine sıkılır.',
      breathing: 'Yukarı çekerken patlayıcı nefes ver.',
      jointAngle: 'Dirsekler tam fleksiyonda ve geride',
      keyCue: 'Kollarla değil, dirsekleri yere batırarak çek.'
    },
    muscleFocus: [
      { name: 'Latissimus Dorsi (Kanat)', percentage: 70, role: 'primary', color: '#FACC15' },
      { name: 'Biceps & Brachialis', percentage: 20, role: 'secondary', color: '#38BDF8' },
      { name: 'Rhomboids & Arka Omuz', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1 sn patlayıcı çekiş • 1 sn tepe kasılma • 3 sn yavaş iniş',
    kineticChain: 'Kapalı Kinetik Zincir • Dikey Çekiş'
  },

  lat_pulldown: {
    gifUrl: '/exercises/lat_pulldown.gif',
    startPhase: {
      title: '1. Başlangıç / Esneme Fazı (Kollar Açık Uzanış)',
      phaseName: 'Eksantrik (Uzanış)',
      posture: 'Kollar yukarıda uzanık, gövde 10-15° geriye eğik. Kanat kasları tam gergin, ağırlık plakasının geriliminde kontrol sağlanmış.',
      breathing: 'Bar yukarı uzanırken nefes al.',
      jointAngle: 'Kollar dikey uzanışta, omuzlar kontrollü serbest',
      keyCue: 'Aşırı geriye yatıp gövdeyi 45 dereceye çekme.'
    },
    peakPhase: {
      title: '2. Bitiş / Göğse Çekiş Fazı (Tepe Kanat Sıkışması)',
      phaseName: 'Konsantrik (Çekiş)',
      posture: 'Bar üst göğse (köprücük kemiği altına) doğru çekilir. Dirsekler yanlardan aşağıya iner, sırt kasları 1 saniye kilitlenir.',
      breathing: 'Barı göğse çekerken nefes ver.',
      jointAngle: 'Bar köprücük kemiği üstünde, dirsekler 80° bükük',
      keyCue: 'Barı asla enseye çekme; köprücük kemiğine doğru yönlendir.'
    },
    muscleFocus: [
      { name: 'Latissimus Dorsi (Geniş Sırt)', percentage: 75, role: 'primary', color: '#FACC15' },
      { name: 'Biceps & Ön Kol', percentage: 15, role: 'secondary', color: '#38BDF8' },
      { name: 'Orta Sırt & Trapezler', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1.5 sn çekiş • 1 sn tepe sıkıştırma • 2.5 sn bırakış',
    kineticChain: 'Açık Kinetik Zincir • Dikey Çekiş'
  },

  barbell_row: {
    gifUrl: '/exercises/barbell_row.gif',
    startPhase: {
      title: '1. Başlangıç / Eğilme Pozisyonu (45° Nötr Omurga)',
      phaseName: 'Eksantrik (Uzanış)',
      posture: 'Dizler hafif kırık, kalça geride, gövde yere 45° açıyla eğik. Bel nötr ve kilitli, kollar barı kaval kemiği hizasında tutar.',
      breathing: 'Ağırlık aşağıdayken nefes al.',
      jointAngle: '45° Gövde Eğimi • 20° Diz Fleksiyonu',
      keyCue: 'Sırtını asla kamburlaştırma, başını omurganla aynı hizada tut.'
    },
    peakPhase: {
      title: '2. Bitiş / Göbeğe Çekiş Fazı (Kürek Kemiği Kenetlenmesi)',
      phaseName: 'Konsantrik (Çekiş)',
      posture: 'Bar göbek deliğine doğru kürek kemikleri birbirine yapıştırılarak çekilir. Dirsekler tavanı gösterir, orta sırt kasılır.',
      breathing: 'Barı çekerken nefes ver.',
      jointAngle: 'Dirsekler geride, kürek kemikleri maksimum retrakte',
      keyCue: 'Gövdeni zıplatma; saf sırt çekişiyle ağırlığı kaldır.'
    },
    muscleFocus: [
      { name: 'Rhomboids & Orta Sırt', percentage: 60, role: 'primary', color: '#FACC15' },
      { name: 'Latissimus Dorsi', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Erector Spinae (Bel) & Biceps', percentage: 15, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1 sn patlayıcı çekiş • 1 sn sıkma • 2 sn kontrollü iniş',
    kineticChain: 'Açık Kinetik Zincir • Yatay Çekiş'
  },

  deadlift: {
    gifUrl: '/exercises/deadlift.gif',
    startPhase: {
      title: '1. Başlangıç / Yerden Kurulum (Çelik Omurga & Kalça Menteşesi)',
      phaseName: 'Hazırlık / Menteşe',
      posture: 'Bar kaval kemiğine 2-3 cm mesafede. Kalça geride, dizler bükük, göğüs yukarıda. Karın basıncı maksimum, sırt düz.',
      breathing: 'Karnına derin nefes çek ve karın duvarını kilitle (Valsalva).',
      jointAngle: 'Kaval kemiği hafif dik • Kalça dizden yukarıda, omuzdan aşağıda',
      keyCue: 'Ağırlığı kollarınla çekme; ayaklarınla yeri itmeye odaklan.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve Kilit Fazı (Kalça Sıkışması & Dik Duruş)',
      phaseName: 'Konsantrik Kilit',
      posture: 'Bacaklar yeri iter, kalça ve dizler aynı anda açılır. Tepe noktada kalça sıkılarak dik durulur; bel geriye bükülmez.',
      breathing: 'Tepe kilitlendikten sonra nefesi kontrollü ver.',
      jointAngle: '180° Tam Dikey Postür • Sıfır Geriye Eğim',
      keyCue: 'Tepe noktada geriye aşırı kaykılma; dik durup kalçayı sık.'
    },
    muscleFocus: [
      { name: 'Gluteus & Hamstrings (Arka Zincir)', percentage: 50, role: 'primary', color: '#FACC15' },
      { name: 'Erector Spinae & Sırt Kasları', percentage: 35, role: 'secondary', color: '#38BDF8' },
      { name: 'Trapezler & Kavrama (Grip)', percentage: 15, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: 'Patlayıcı kalkış • 1 sn dik kilit • 2 sn kontrollü zemin bırakışı',
    kineticChain: 'Kapalı Kinetik Zincir • Tüm Vücut Posterior Zincir'
  },

  barbell_squat: {
    gifUrl: '/exercises/barbell_squat.gif',
    startPhase: {
      title: '1. Başlangıç / Ayakta Kurulum (Trapezde Bar & Karın Kilidi)',
      phaseName: 'Kurulum & Dik Duruş',
      posture: 'Bar üst trapezde oturur. Ayaklar omuz genişliğinde, parmak uçları 15-30° dışa dönük. Karın kasları taş gibi sıkılı.',
      breathing: 'Derin nefes al, karnı şişirip iç basınç oluştur.',
      jointAngle: '180° Kalça & Diz • Dik Torso',
      keyCue: 'Topukların zemine çakılı olduğundan emin ol.'
    },
    peakPhase: {
      title: '2. Bitiş / Derin Çömelme & Kalkış (Paralel Altı & Topuk İtişi)',
      phaseName: 'Eksantrik Dip & Konsantrik Kalkış',
      posture: 'Kalça geriye ve aşağıya çömelir, uyluk kemiği yere paralel veya daha derine iner. Topuklardan yeri iterek patlayıcı doğrulunur.',
      breathing: 'Dipte nefesi tut, kalkışın son 1/3 fazında güçlüce ver.',
      jointAngle: '≤ 90° Diz Açısı (Paralel Derinlik)',
      keyCue: 'Dizlerin içeri çökmesine izin verme; dizler ayak ucunu takip etsin.'
    },
    muscleFocus: [
      { name: 'Quadriceps (Ön Bacak)', percentage: 65, role: 'primary', color: '#FACC15' },
      { name: 'Gluteus Maximus (Büyük Kalça)', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Core, Bel & Hamstrings', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2.5 sn kontrollü iniş • 1 sn dip kontrolü • 1 sn patlayıcı kalkış',
    kineticChain: 'Kapalı Kinetik Zincir • Alt Vücut İtiş'
  },

  leg_press: {
    gifUrl: '/exercises/leg_press.gif',
    startPhase: {
      title: '1. Başlangıç / Negatif İniş (90° Diz Açısı)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Sırt ve baş koltuğa yapışık. Platform dizler yaklaşık 90° bükülene kadar kontrollü şekilde göğse yaklaşır. Kalça koltuktan kalkmaz.',
      breathing: 'Platform alçalırken burnundan nefes al.',
      jointAngle: '90° Diz Açısı • Kalça Koltuğa Tam Temas',
      keyCue: 'Kalçanın koltuktan kalkmasına izin verme (bel fıtığı riski).'
    },
    peakPhase: {
      title: '2. Bitiş / Güçlü İtiş (Yumuşak Kilit)',
      phaseName: 'Konsantrik (İtiş)',
      posture: 'Ayak tabanlarıyla platform yukarı itilir. Tepe noktada bacaklar düzleşir ancak diz eklemi asla tam kilitlenmez (tık diye vurmaz).',
      breathing: 'Platformu iterken nefes ver.',
      jointAngle: '170° Diz Açısı (Mikro bükük kilit koruması)',
      keyCue: 'Dizlerini tam kilitleme; yükü kemiğe değil sürekli kasa bindir.'
    },
    muscleFocus: [
      { name: 'Quadriceps (Ön Bacak)', percentage: 70, role: 'primary', color: '#FACC15' },
      { name: 'Gluteus (Kalça)', percentage: 20, role: 'secondary', color: '#38BDF8' },
      { name: 'Hamstrings & Kalf', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2.5 sn iniş • 0 sn duraklama • 1.5 sn güçlü itiş',
    kineticChain: 'Kapalı Kinetik Zincir • Makine Destekli Bacak İtiş'
  },

  romanian_deadlift: {
    gifUrl: '/exercises/romanian_deadlift.gif',
    startPhase: {
      title: '1. Başlangıç / Kalça Menteşesi (Arka Bacak Gerilmesi)',
      phaseName: 'Eksantrik (Eğilme)',
      posture: 'Dizler hafif kırık ve sabit. Kalça arkadaki duvara değmek ister gibi geriye itilir. Bar bacaklara yapışık kaval kemiğine iner.',
      breathing: 'Aşağı eğilirken nefes al.',
      jointAngle: '15° Diz Açısı (Sabit) • 90° Kalça Menteşesi',
      keyCue: 'Squat yapma; sadece kalçayı geriye it ve arka bacağı ger.'
    },
    peakPhase: {
      title: '2. Bitiş / Kalça Sıkışması & Doğrulma',
      phaseName: 'Konsantrik (Doğrulma)',
      posture: 'Arka bacaklardaki gerilim zirveye ulaştığında kalça güçlüce öne sürülür ve dik duruşa gelinerek kalça kasları sıkılır.',
      breathing: 'Doğrulurken güçlü nefes ver.',
      jointAngle: '180° Tam Dik Postür',
      keyCue: 'Barı vücuttan uzaklaştırma; kaval kemiğine sürtünür gibi kalsın.'
    },
    muscleFocus: [
      { name: 'Hamstrings (Arka Bacak)', percentage: 60, role: 'primary', color: '#FACC15' },
      { name: 'Gluteus (Kalça Kasları)', percentage: 30, role: 'secondary', color: '#38BDF8' },
      { name: 'Erector Spinae (Bel)', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '3 sn yavaş iniş • 1 sn gerilme • 1 sn patlayıcı doğrulma',
    kineticChain: 'Kapalı Kinetik Zincir • Kalça Menteşesi'
  },

  lunges: {
    gifUrl: '/exercises/lunges.gif',
    startPhase: {
      title: '1. Başlangıç / Adım & 90-90 Çömelme',
      phaseName: 'Eksantrik (Adımlama)',
      posture: 'Öne geniş adım atılır. Gövde dimdik. Her iki diz de 90° bükülene kadar alçalınır. Arka diz yere hafifçe yaklaşır.',
      breathing: 'Adım atıp çömelirken nefes al.',
      jointAngle: 'Ön Diz 90° • Arka Diz 90°',
      keyCue: 'Ön diz ayak parmak ucunu aşırı geçmesin, ağırlık ön topukta.'
    },
    peakPhase: {
      title: '2. Bitiş / Topuk İtişi & Doğrulma',
      phaseName: 'Konsantrik (Geri İtiş)',
      posture: 'Öndeki ayağın topuğundan kuvvet alınarak gövde yukarı ve geriye itilir, başlangıç dik duruşuna dönülür.',
      breathing: 'Kendini geri iterken nefes ver.',
      jointAngle: '180° Tam Bacak Doğrulması',
      keyCue: 'Gövdeyi öne eğme; asansör gibi dik inip dik çık.'
    },
    muscleFocus: [
      { name: 'Quadriceps (Ön Bacak)', percentage: 55, role: 'primary', color: '#FACC15' },
      { name: 'Gluteus (Kalça)', percentage: 35, role: 'secondary', color: '#38BDF8' },
      { name: 'Core Dengeleyici Kaslar', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn kontrollü iniş • 1 sn güçlü geri itiş',
    kineticChain: 'Unilateral (Tek Taraflı) • Bacak İtiş'
  },

  overhead_press: {
    gifUrl: '/exercises/overhead_press.gif',
    startPhase: {
      title: '1. Başlangıç / Köprücük Kemiğinde Tutuş',
      phaseName: 'Kurulum & Ön Yükleme',
      posture: 'Bar köprücük kemiğinde, eller omuz genişliğinde. Dirsekler barın hafifçe önünde. Karın ve kalça kenetlenmiş, omurga nötr.',
      breathing: 'Kaldırmadan önce karnına derin nefes çek.',
      jointAngle: 'Dirsekler göğüs önünde dikey hizada',
      keyCue: 'Belini geriye doğru yay gibi bükme; kalçanı taş gibi sık.'
    },
    peakPhase: {
      title: '2. Bitiş / Baş Üstü Kilit (Omuz Tepe Noktası)',
      phaseName: 'Konsantrik (Zirve İtiş)',
      posture: 'Bar başın üzerinden dikey hatta yukarı itilir. Bar alnı geçince baş hafifçe öne girer. Kollar baş üstünde kilitlenir.',
      breathing: 'Bar baş üstüne kilitlendiğinde nefes ver.',
      jointAngle: '180° Dikey Kollar • Kollar Kulak Hizası Arkasında',
      keyCue: 'Barı öne fırlatma; başının tam tepesine dik çizgide presle.'
    },
    muscleFocus: [
      { name: 'Anterior & Lateral Deltoid (Omuz)', percentage: 70, role: 'primary', color: '#FACC15' },
      { name: 'Triceps (Arka Kol)', percentage: 20, role: 'secondary', color: '#38BDF8' },
      { name: 'Üst Göğüs & Core', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1 sn patlayıcı itiş • 1 sn tepe duruş • 2.5 sn kontrollü iniş',
    kineticChain: 'Açık Kinetik Zincir • Dikey İtiş'
  },

  lateral_raise: {
    gifUrl: '/exercises/lateral_raise.gif',
    startPhase: {
      title: '1. Başlangıç / Yanlarda Hazırlık (Mikro Kırık Dirsek)',
      phaseName: 'Hazırlık',
      posture: 'Dambıllar uylukların yanında, dirsekler mikro bükük. Gövde 5° hafifçe öne eğik, omuzlar gevşek ama kontrollü.',
      breathing: 'Ağırlıklar yanlardayken nefes al.',
      jointAngle: '15° Dirsek Fleksiyonu (Sabit kilit)',
      keyCue: 'Ağır kilo alıp sallanma; hafif kilo ile saf izolasyon yap.'
    },
    peakPhase: {
      title: '2. Bitiş / T-Pozisyonu Yan Açış (Yan Omuz Zirvesi)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Dirseklerle ağırlıklar iki yana omuz hizasına kaldırılır. Tepe noktada serçe parmak hafif yukarı bakar (su dökme pozu). 1 sn duraklama.',
      breathing: 'Kolları yana açarken nefes ver.',
      jointAngle: '90° Omuz Açısı (Yere Paralel)',
      keyCue: 'Omuz seviyesinden yukarı fırlatma; yük trapeze kaçmasın.'
    },
    muscleFocus: [
      { name: 'Lateral Deltoid (Yan Omuz)', percentage: 80, role: 'primary', color: '#FACC15' },
      { name: 'Üst Trapezler', percentage: 15, role: 'secondary', color: '#38BDF8' },
      { name: 'Ön Kol Sabitleyiciler', percentage: 5, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1 sn kaldırış • 1 sn tepe bekleme • 2 sn yavaş iniş',
    kineticChain: 'Açık Kinetik Zincir • Omuz İzolasyonu'
  },

  face_pull: {
    gifUrl: '/exercises/face_pull.gif',
    startPhase: {
      title: '1. Başlangıç / Kollar Uzanık (Kablo Gerilimi)',
      phaseName: 'Hazırlık',
      posture: 'Halat göz hizasında tutulur. Baş parmaklar geriye bakar. Bir adım geri çekilerek kabloda sürekli gerginlik sağlanır.',
      breathing: 'Kollar öne uzanırken nefes al.',
      jointAngle: 'Kollar göz hizasında tam uzanık',
      keyCue: 'Omuzlarını yukarı kaldırma; göğsünü dik tut.'
    },
    peakPhase: {
      title: '2. Bitiş / Yüze Çekiş & Dış Rotasyon (Postür Kilidi)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Halat burna/gözlere doğru çekilir. Dirsekler yüksekte ve geride, eller dışa doğru döndürülür (double biceps duruşu). Arka omuz sıkılır.',
      breathing: 'Halatı çekerken nefes ver.',
      jointAngle: 'Dirsekler 90° yüksekte, omuzlar dışa dönük',
      keyCue: 'Hareketi göğse çekme; tam göz hizasına çekerek dışa çevir.'
    },
    muscleFocus: [
      { name: 'Rear Deltoid (Arka Omuz)', percentage: 65, role: 'primary', color: '#FACC15' },
      { name: 'Rotator Manşet & Rhomboids', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Üst Trapez', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1.5 sn çekiş • 1.5 sn tepe sıkıştırma • 2 sn kontrollü bırakış',
    kineticChain: 'Açık Kinetik Zincir • Postür Düzeltici Çekiş'
  },

  barbell_curl: {
    gifUrl: '/exercises/barbell_curl.gif',
    startPhase: {
      title: '1. Başlangıç / Tam Kol Uzanışı (Kaburgalara Kilitli Dirsek)',
      phaseName: 'Hazırlık',
      posture: 'Ayakta dik duruş. Bar omuz genişliğinde kavranır, kollar tam uzanır. Dirsekler kaburgalara kenetlenir.',
      breathing: 'Bar aşağıdayken burnundan nefes al.',
      jointAngle: '180° Kol Açısı • Sabit Dirsek',
      keyCue: 'Dirseklerini öne doğru fırlatma; gövdenin yanında sabit tut.'
    },
    peakPhase: {
      title: '2. Bitiş / Tepe Pazu Kasılması (Biceps Peak)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Sadece ön kollar hareket ederek bar göğüs hizasına bükülür. Tepe noktada biceps maksimum güçle 1 saniye sıkıştırılır.',
      breathing: 'Barı yukarı kaldırırken nefes ver.',
      jointAngle: '60° Dirsek Fleksiyonu • Tam Pazu Sıkışması',
      keyCue: 'Beli sallayarak ivme kazanma; saf kol gücüyle kaldır.'
    },
    muscleFocus: [
      { name: 'Biceps Brachii (Pazu)', percentage: 80, role: 'primary', color: '#FACC15' },
      { name: 'Brachialis & Brachioradialis', percentage: 15, role: 'secondary', color: '#38BDF8' },
      { name: 'Ön Kol & Core', percentage: 5, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1 sn patlayıcı kaldırış • 1 sn tepe sıkma • 2.5 sn yavaş iniş',
    kineticChain: 'Açık Kinetik Zincir • Kol Fleksiyonu'
  },

  triceps_pushdown: {
    gifUrl: '/exercises/triceps_pushdown.gif',
    startPhase: {
      title: '1. Başlangıç / Göğüs Hizası (Dirsekler Kilitli)',
      phaseName: 'Hazırlık',
      posture: 'Gövde hafifçe öne eğik. Dirsekler vücudun iki yanına çivilenmiş. Ön kollar 90° açıyla göğüs hizasında.',
      breathing: 'Ön kollar yukarı dönerken nefes al.',
      jointAngle: '90° Dirsek Açısı • Sabit Kol Pozisyonu',
      keyCue: 'Dirseklerin öne arkaya kanat gibi oynamasına izin verme.'
    },
    peakPhase: {
      title: '2. Bitiş / Düz Kol Kilit & Halat Açışı (Triceps Zirvesi)',
      phaseName: 'Konsantrik (Kilit)',
      posture: 'Kollar aşağı doğru tamamen düzleştirilir. Dip noktada halat uçları dışa doğru açılarak triceps dış başı taş gibi kilitlenir.',
      breathing: 'Aşağı bastırırken güçlü nefes ver.',
      jointAngle: '180° Tam Düz Kol • Halat Dışa Açık',
      keyCue: 'Dip noktada halatı iki yana açarak ekstra sıkıştırma sağla.'
    },
    muscleFocus: [
      { name: 'Triceps Brachii (Dış & Yan Baş)', percentage: 85, role: 'primary', color: '#FACC15' },
      { name: 'Ön Kol & Bilek Stabilizasyonu', percentage: 15, role: 'secondary', color: '#38BDF8' }
    ],
    tempoGuidance: '1 sn güçlü itiş • 1 sn dip sıkıştırma • 2 sn kontrollü dönüş',
    kineticChain: 'Açık Kinetik Zincir • Triceps İzolasyonu'
  },

  hammer_curl: {
    gifUrl: '/exercises/hammer_curl.gif',
    startPhase: {
      title: '1. Başlangıç / Nötr Tutuş (Çekiç Pozisyonu)',
      phaseName: 'Hazırlık',
      posture: 'Dambıllar avuç içleri birbirine bakacak şekilde yanlarda tutulur. Bilekler dimdik, kollar tam uzanık.',
      breathing: 'Dambıllar aşağıdayken nefes al.',
      jointAngle: 'Nötr Bilek (Sıfır Rotasyon) • 180° Kol',
      keyCue: 'Bileklerini bükme; dambılları sıkıca kavra.'
    },
    peakPhase: {
      title: '2. Bitiş / Tepe Çekiç Büküş (Kol Kalınlığı)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Dambıllar omuz hizasına doğru dikey bükülür. Tepe noktada brachialis ve ön kol kasları maksimum sıkışır.',
      breathing: 'Yukarı kaldırırken nefes ver.',
      jointAngle: '60° Dirsek Fleksiyonu',
      keyCue: 'Önden bakıldığında kola kalınlık katan brachialis kasını hisset.'
    },
    muscleFocus: [
      { name: 'Brachialis (Kol Kalınlığı)', percentage: 60, role: 'primary', color: '#FACC15' },
      { name: 'Brachioradialis (Ön Kol)', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Biceps Brachii', percentage: 15, role: 'secondary', color: '#34D399' }
    ],
    tempoGuidance: '1.5 sn kaldırış • 1 sn sıkma • 2 sn kontrollü iniş',
    kineticChain: 'Açık Kinetik Zincir • Kol İzolasyonu'
  },

  plank: {
    gifUrl: '/exercises/plank.gif',
    startPhase: {
      title: '1. Başlangıç / Ön Kol & Ayak Duruşu',
      phaseName: 'Kurulum',
      posture: 'Dirsekler tam omuzların altında, ön kollar yerde paralel. Ayak parmak uçlarında yükselinir, gövde düz bir hat alır.',
      breathing: 'Pozisyona girerken sakin nefes al.',
      jointAngle: '90° Dirsek Açısı • 180° Omurga',
      keyCue: 'Kafanı aşağı sarkıtma; gözlerin ellerinin arasına baksın.'
    },
    peakPhase: {
      title: '2. Bitiş / Statik Çelik Karın Kilidi (İzometrik Yanma)',
      phaseName: 'İzometrik Tutuş',
      posture: 'Karnı içeri çekip yumruk yiyecekmiş gibi sık. Kalça ve kuadrisepsler taş gibi sıkılı, bel sarkmadan sabit beklenir.',
      breathing: 'Ritmik, derin ve kesintisiz nefes alıp ver; nefesi asla tutma.',
      jointAngle: '180° Kusursuz Baş-Topuk Hattı',
      keyCue: 'Beli aşağı sarkıtma; kalçanı hafifçe içeri doğru sık (posterior pelvik tilt).'
    },
    muscleFocus: [
      { name: 'Transversus Abdominis (Derin Karın)', percentage: 65, role: 'primary', color: '#FACC15' },
      { name: 'Rectus Abdominis & Obliques', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Omuz & Gluteus Stabilizatörleri', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '30 - 60 saniye kesintisiz statik gerilim',
    kineticChain: 'Statik İzometrik • Merkez Bölge (Core)'
  },

  hanging_leg_raise: {
    gifUrl: '/exercises/hanging_leg_raise.gif',
    startPhase: {
      title: '1. Başlangıç / Sallantısız Asılma',
      phaseName: 'Hazırlık',
      posture: 'Barfiks barında tam asılı duruş. Vücut ileri geri sallanmadan sabitlenmiş, karın hafif aktif.',
      breathing: 'Bacaklar aşağıdayken nefes al.',
      jointAngle: '180° Bacaklar • Dikey Gövde Hattı',
      keyCue: 'Gövdenin sallanmasına izin verme; momentum kullanma.'
    },
    peakPhase: {
      title: '2. Bitiş / 90° Bacak & Kalça Yuvarlama (Alt Karın Zirvesi)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Bacaklar karın kaslarıyla 90° veya daha yukarı kaldırılır. Kalça göğse doğru hafifçe yuvarlanarak alt karın maksimum sıkışır.',
      breathing: 'Bacakları kaldırırken nefesi tamamen boşalt.',
      jointAngle: '90° - 110° Bacak Açısı • Yuvarlanan Pelvis',
      keyCue: 'Sadece bacağı sallama; kalçanı da yukarı kıvırarak alt karını ez.'
    },
    muscleFocus: [
      { name: 'Alt Karın (Lower Rectus Abdominis)', percentage: 70, role: 'primary', color: '#FACC15' },
      { name: 'Iliopsoas (Kalça Fleksörleri)', percentage: 20, role: 'secondary', color: '#38BDF8' },
      { name: 'Ön Kol Kavrama & Üst Karın', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1 sn patlayıcı kaldırış • 1 sn tepe sıkma • 2 sn yavaş iniş',
    kineticChain: 'Açık Kinetik Zincir • Karın Fleksiyonu'
  },

  bicycle_crunches: {
    gifUrl: '/exercises/bicycle_crunches.gif',
    startPhase: {
      title: '1. Başlangıç / Sırtüstü Masa Pozisyonu',
      phaseName: 'Hazırlık',
      posture: 'Sırtüstü yatış. Eller baş arkasında destek, dizler 90° bükük havada. Kürek kemikleri yerden 2 cm kalkık.',
      breathing: 'Hazırlık nefesi al.',
      jointAngle: '90° Diz Açısı • Nötr Boyun',
      keyCue: 'Ellerinle boynunu öne doğru zorla çekme.'
    },
    peakPhase: {
      title: '2. Bitiş / Çapraz Dirsek-Diz Teması (Yan Karın Yanması)',
      phaseName: 'Konsantrik Rotasyon',
      posture: 'Bir bacak ileri uzanırken karşı diz göğse çekilir, zıt dirsek dize yaklaşır. Gövde dönerek yan karın lifleri sıkışır.',
      breathing: 'Her dirsek-diz buluşmasında ritmik nefes ver.',
      jointAngle: '45° Uzanan Bacak • 90° Gövde Rotasyonu',
      keyCue: 'Hızlı savurma; yavaş ve kasılarak yan karınları yak.'
    },
    muscleFocus: [
      { name: 'Internal & External Obliques (Yan Karın)', percentage: 60, role: 'primary', color: '#FACC15' },
      { name: 'Rectus Abdominis (Tüm Karın)', percentage: 30, role: 'secondary', color: '#38BDF8' },
      { name: 'Kalça Fleksörleri', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '20-30 kontrollü tekrar • Ritmik pedal temposu',
    kineticChain: 'Kapalı / Açık Kinetik Karın Rotasyonu'
  },

  // --- EVDE ANTRENMAN ÖZEL HAREKETLERİ ---
  bodyweight_squat: {
    gifUrl: '/exercises/bodyweight_squat.gif',
    startPhase: {
      title: '1. Başlangıç / Çömelme Fazı (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Ayaklar omuz genişliğinde, ayak parmak uçları hafif dışarı bakar (15-30°). Göğüs dik, kollar dengede önde. Kalçayı geriye doğru iterek çömel.',
      breathing: 'Aşağı inerken burnundan derin nefes al, karın içi basıncını koru.',
      jointAngle: '90° veya biraz altı (Paralel derinlik)',
      keyCue: 'Dizlerin içe çökmesine izin verme, topuklarını yerden kaldırma.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve İtiş Fazı (Konsantrik Yükseliş)',
      phaseName: 'Konsantrik (Kalkış)',
      posture: 'Topuklardan güç alarak dik konuma yüksel. Tepe noktada kalça kaslarını (glutes) 1 saniye sıkıştır.',
      breathing: 'Yukarı doğrulurken ağzından güçlüce nefes ver.',
      jointAngle: '180° Kalça & Diz Uzaması',
      keyCue: 'Dizleri aniden geriye kitleme; kas gerilimini tepe noktada kalçayla hisset.'
    },
    muscleFocus: [
      { name: 'Quadriceps (Ön Bacak)', percentage: 55, role: 'primary', color: '#FACC15' },
      { name: 'Gluteus Maximus (Kalça)', percentage: 35, role: 'secondary', color: '#38BDF8' },
      { name: 'Core & Denge Kasları', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '3 sn yavaş iniş • 1 sn dipte bekle • 1 sn patlayıcı kalkış',
    kineticChain: 'Kapalı Kinetik Zincir • Evde Bacak Temeli'
  },

  chair_dips: {
    gifUrl: '/exercises/chair_dips.gif',
    startPhase: {
      title: '1. Başlangıç / Negatif Faz (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Eller sağlam bir sandalyenin veya koltuğun kenarında, kalça sandalyeye yakın. Dirsekleri geriye doğru bükerek gövdeyi yavaşça indir.',
      breathing: 'Gövdeni kontrollü indirirken nefes al.',
      jointAngle: '90° Dirsek Açısı (Omuzları aşırı zorlamadan)',
      keyCue: 'Kalçanı sandalyeden uzaklaştırma; omurga dik kalsın.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve Fazı (Konsantrik İtiş)',
      phaseName: 'Konsantrik (İtiş)',
      posture: 'Avuç içleriyle sandalyeyi iterek arka kol (triceps) gücüyle doğrul. Tepe noktada arka kolları maksimum sıkıştır.',
      breathing: 'Yukarı iterken güçlüce nefes ver.',
      jointAngle: '175° Dirsek Açısı',
      keyCue: 'Tepe noktada triceps kasını zihin-kas bağlantısıyla kaskatı yap.'
    },
    muscleFocus: [
      { name: 'Triceps Brachii (Arka Kol)', percentage: 75, role: 'primary', color: '#FACC15' },
      { name: 'Ön Omuz (Anterior Deltoid)', percentage: 15, role: 'secondary', color: '#38BDF8' },
      { name: 'Alt Göğüs', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn iniş • 1 sn tepe kasılma • 10-15 tekrar',
    kineticChain: 'Kapalı Kinetik Zincir • Evde İtiş'
  },

  diamond_pushup: {
    gifUrl: '/exercises/diamond_pushup.gif',
    startPhase: {
      title: '1. Başlangıç / Negatif Faz (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Başparmak ve işaret parmaklarını birleştirip göğsün altında elmas (üçgen) şekli oluştur. Vücut düz bir çizgi halinde, göğsü elmasın merkezine doğru yaklaştır.',
      breathing: 'Aşağı inerken nefes al.',
      jointAngle: '45° Dirsek Açısı (Vücuda yakın)',
      keyCue: 'Belini aşağı sarkıtma, kalçanı sık.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve İtiş Fazı (Konsantrik İtiş)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Yeri elmas pozisyonundan güçlüce it. Tepe noktada iç göğüs liflerini ve arka kolları (triceps) kitlemeden sıkıştır.',
      breathing: 'Yukarı iterken nefes ver.',
      jointAngle: '175° Dirsek Açısı',
      keyCue: 'Arka kol ve iç göğüs kasılmasını 1 saniye dondur.'
    },
    muscleFocus: [
      { name: 'Triceps Brachii (Arka Kol)', percentage: 65, role: 'primary', color: '#FACC15' },
      { name: 'İç & Alt Göğüs', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Core & Ön Omuz', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn iniş • 1 sn tepe sıkma • 8-12 tekrar',
    kineticChain: 'Kapalı Kinetik Zincir • İleri Seviye Ev İtişi'
  },

  bulgarian_split_squat: {
    gifUrl: '/exercises/bulgarian_split_squat.gif',
    startPhase: {
      title: '1. Başlangıç / Çömelme Fazı (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Arka ayak koltuk veya sandalyede dinlenir. Öndeki bacakla dik açıyla aşağı doğru in. Arka diz yere yaklaşır.',
      breathing: 'Aşağı inerken nefes al.',
      jointAngle: 'Ön Diz 90° Açıda',
      keyCue: 'Ön topuğunu yerden kaldırma; yük ön bacaktadır.'
    },
    peakPhase: {
      title: '2. Bitiş / Yükseliş Fazı (Konsantrik Güç)',
      phaseName: 'Konsantrik (Kalkış)',
      posture: 'Ön topuktan güç alarak gövdeyi başlangıç yüksekliğine it. Kalça ve ön bacağı tepe noktada ateşle.',
      breathing: 'Yukarı kalkarken nefes ver.',
      jointAngle: '180° Kalça Hizası',
      keyCue: 'Dengeyi kaybetmemek için gözlerini sabit bir noktaya odakla.'
    },
    muscleFocus: [
      { name: 'Quadriceps (Ön Bacak)', percentage: 50, role: 'primary', color: '#FACC15' },
      { name: 'Gluteus Maximus (Kalça)', percentage: 35, role: 'secondary', color: '#38BDF8' },
      { name: 'Hamstrings & Dengeleyici Kaslar', percentage: 15, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '3 sn yavaş iniş • 1 sn kalkış • Her bacak 10-12 tekrar',
    kineticChain: 'Tek Taraflı (Unilateral) Kapalı Kinetik Zincir'
  },

  glute_bridge: {
    gifUrl: '/exercises/glute_bridge.gif',
    startPhase: {
      title: '1. Başlangıç Pozisyonu (Zemin Duruşu)',
      phaseName: 'Eksantrik (Hazırlık)',
      posture: 'Sırtüstü yat, dizler bükülü, ayak tabanları kalça genişliğinde yere basar. Kollar iki yanda destek pozisyonunda.',
      breathing: 'Zemindeyken derin nefes al.',
      jointAngle: '90° Diz Açısı',
      keyCue: 'Belini aşırı çukurlaştırma; omurganı nötr tut.'
    },
    peakPhase: {
      title: '2. Bitiş / Tepe Köprü Fazı (Konsantrik Kasılma)',
      phaseName: 'Konsantrik (Zirve)',
      posture: 'Topuklardan iterek kalçayı tavana doğru kaldır. Omuzlardan dizlere düz bir köprü hattı oluştur ve kalçayı 2 saniye kaskatı sık.',
      breathing: 'Kalçayı kaldırırken nefes ver.',
      jointAngle: '180° Düz Gövde Köprü Hattı',
      keyCue: 'Belinle değil, saf kalça kaslarınla kaldır.'
    },
    muscleFocus: [
      { name: 'Gluteus Maximus (Büyük Kalça)', percentage: 70, role: 'primary', color: '#FACC15' },
      { name: 'Hamstrings (Arka Bacak)', percentage: 20, role: 'secondary', color: '#38BDF8' },
      { name: 'Core & Bel Destekçileri', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '1 sn kalkış • 2 sn tepe sıkıştırma • 2 sn iniş',
    kineticChain: 'Kapalı Kinetik Zincir • Evde Kalça & Duruş'
  },

  mountain_climbers: {
    gifUrl: '/exercises/mountain_climbers.gif',
    startPhase: {
      title: '1. Başlangıç (Yüksek Plank Duruşu)',
      phaseName: 'Stabilizasyon',
      posture: 'Eller omuz altında, şınav pozisyonunda stabil gövde. Boyun nötr, karın sımsıkı kilitli.',
      breathing: 'Doğal ritmik solunum.',
      jointAngle: 'Düz Gövde Hattı',
      keyCue: 'Kalçayı havaya dikme veya aşağı düşürme.'
    },
    peakPhase: {
      title: '2. Çekiş & Kardiyo Fazı',
      phaseName: 'Patlayıcı Çekiş',
      posture: 'Bir dizi göğse doğru çek, ardından seri şekilde bacak değiştirerek dağ tırmanışı temposu uygula.',
      breathing: 'Her diz çekişte tempolu nefes ver.',
      jointAngle: '90° Diz Göğüs Açısı',
      keyCue: 'Zemine parmak uçlarıyla yumuşak bas, tempoyu koru.'
    },
    muscleFocus: [
      { name: 'Rectus Abdominis (Karın)', percentage: 50, role: 'primary', color: '#FACC15' },
      { name: 'Kalça Fleksörleri & Kardiyo', percentage: 35, role: 'secondary', color: '#38BDF8' },
      { name: 'Omuz & Üst Vücut Denge', percentage: 15, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '30-45 saniye aralıksız seri tempo',
    kineticChain: 'Dinamik Core & Kondisyon Zinciri'
  },

  pike_pushup: {
    gifUrl: '/exercises/pike_pushup.gif',
    startPhase: {
      title: '1. Başlangıç / Çatı Duruşu (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Eller yerde, kalça tavana doğru dikilmiş (V şeklinde duruş). Başını iki elinin arasına doğru öne doğru yavaşça indir.',
      breathing: 'Aşağı inerken nefes al.',
      jointAngle: 'Ters V Gövde Açısı',
      keyCue: 'Omuzlara yük bindirmek için kalçayı yüksekte tut.'
    },
    peakPhase: {
      title: '2. Bitiş / Omuz İtiş Fazı (Konsantrik)',
      phaseName: 'Konsantrik (İtiş)',
      posture: 'Yeri güçlüce iterek başı geriye ve yukarı doğru başlangıç konumuna çıkar. Omuz başlarını sıkıştır.',
      breathing: 'Yukarı iterken nefes ver.',
      jointAngle: '180° Kol Açısı',
      keyCue: 'Evde dumbell olmadan en iyi omuz geliştirici harekettir.'
    },
    muscleFocus: [
      { name: 'Anterior & Medial Deltoid (Omuz)', percentage: 65, role: 'primary', color: '#FACC15' },
      { name: 'Triceps (Arka Kol)', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Üst Göğüs & Core', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn kontrollü iniş • 1 sn itiş • 8-12 tekrar',
    kineticChain: 'Kapalı Kinetik Zincir • Ev Omuz Presi'
  },

  crunches: {
    gifUrl: '/exercises/crunches.gif',
    startPhase: {
      title: '1. Başlangıç (Zeminde Esneme)',
      phaseName: 'Eksantrik (Yatış)',
      posture: 'Sırtüstü yat, dizler bükük, eller başın arkasında nazikçe durur (boynu çekme). Karın gevşek değil, hafif gergin.',
      breathing: 'Zemindeyken nefes al.',
      jointAngle: '90° Bükük Dizler',
      keyCue: 'Ellerle boynunu öne çekme; sadece karnınla kalk.'
    },
    peakPhase: {
      title: '2. Zirve Karın Sıkıştırma (Konsantrik Kasılma)',
      phaseName: 'Konsantrik (Sıkıştırma)',
      posture: 'Kürek kemiklerini yerden 5-10 cm kaldırarak göğüs kafesini leğen kemiğine doğru yaklaştır. Tepe noktada karın kaslarını kaskatı sık.',
      breathing: 'Kalkarken ağzındaki tüm havayı dışarı üfle.',
      jointAngle: 'Maksimum Omurga Fleksiyonu',
      keyCue: 'Tepe noktada 1 saniye bekle ve karnındaki yanmayı hisset.'
    },
    muscleFocus: [
      { name: 'Rectus Abdominis (Üst & Orta Karın)', percentage: 75, role: 'primary', color: '#FACC15' },
      { name: 'Transversus Abdominis', percentage: 15, role: 'secondary', color: '#38BDF8' },
      { name: 'Yan Karın (Obliques)', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '15-20 kontrollü tekrar • 1 sn tepe duraklama',
    kineticChain: 'Kapalı / Açık Karın Fleksiyonu'
  },

  russian_twist: {
    gifUrl: '/exercises/russian_twist.gif',
    startPhase: {
      title: '1. Başlangıç (V Pozisyonu)',
      phaseName: 'Core Denge',
      posture: 'Zeminde otur, gövdeyi 45° geriye yatır, dizleri hafif kaldır. Karın kilitli.',
      breathing: 'Ritmik nefes düzeni.',
      jointAngle: '45° Gövde Eğimi',
      keyCue: 'Belini yuvarlama, göğsünü açık tut.'
    },
    peakPhase: {
      title: '2. Yan Rotasyon Fazı (Oblik Sıkıştırma)',
      phaseName: 'Konsantrik Rotasyon',
      posture: 'Gövdeyi kontrollü şekilde sağa ve sola çevirerek elleri zemine yaklaştır.',
      breathing: 'Her dönüşte nefes ver.',
      jointAngle: '45° Gövde Rotasyonu',
      keyCue: 'Sadece kolları değil, omuzları ve göğsü çevir.'
    },
    muscleFocus: [
      { name: 'Obliques (Yan Karın)', percentage: 65, role: 'primary', color: '#FACC15' },
      { name: 'Rectus Abdominis', percentage: 25, role: 'secondary', color: '#38BDF8' },
      { name: 'Kalça Fleksörleri', percentage: 10, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '20-30 kontrollü dönüş',
    kineticChain: 'Core Rotasyonel Denge'
  },

  seated_cable_row: {
    gifUrl: '/exercises/seated_cable_row.gif',
    startPhase: {
      title: '1. Başlangıç / Esneme Fazı (Eksantrik Bırakış)',
      phaseName: 'Eksantrik (Uzanış)',
      posture: 'Gövde dik, dizler hafif kırık. Ağırlık kolları öne doğru çekerken sırt kanat lifleri derinlemesine esner.',
      breathing: 'Ağırlığı bırakırken nefes al.',
      jointAngle: 'Düz Bel • 170° Dirsek Açısı',
      keyCue: 'Gövdeni aşırı öne bükme; beli nötr tut.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve Çekiş Fazı (Konsantrik Kasılma)',
      phaseName: 'Konsantrik (Çekiş)',
      posture: 'Aparatı göbeğe doğru çek, dirsekleri geriye sür ve kürek kemiklerini birbirine yapıştırırcasına sıkıştır.',
      breathing: 'Karnına çekerken nefes ver.',
      jointAngle: '90° Dirsek Açısı • Geriye Çekili Omuzlar',
      keyCue: 'Tepe noktada 1 saniye bekle ve sırt kalınlığını hisset.'
    },
    muscleFocus: [
      { name: 'Rhomboids & Orta Trapez', percentage: 50, role: 'primary', color: '#FACC15' },
      { name: 'Latissimus Dorsi (Kanat)', percentage: 35, role: 'secondary', color: '#38BDF8' },
      { name: 'Biceps & Arka Omuz', percentage: 15, role: 'stabilizer', color: '#34D399' }
    ],
    tempoGuidance: '2 sn bırakış • 1 sn çekiş • 1 sn tepe sıkma',
    kineticChain: 'Açık Kinetik Zincir • Yatay Sırt Çekişi'
  },

  dumbbell_curl: {
    gifUrl: '/exercises/dumbbell_curl.gif',
    startPhase: {
      title: '1. Başlangıç / Negatif Faz (Eksantrik İniş)',
      phaseName: 'Eksantrik (İniş)',
      posture: 'Ayaklar omuz genişliğinde, dambıllar yanlarda, avuç içleri içe dönük. Dambılları 2 saniyede kontrollü indir.',
      breathing: 'İndirirken nefes al.',
      jointAngle: '175° Dirsek Açısı',
      keyCue: 'Dirsekleri öne arkaya savurma, gövdeye sabitle.'
    },
    peakPhase: {
      title: '2. Bitiş / Zirve Pazu Fazı (Konsantrik Kasılma)',
      phaseName: 'Konsantrik (Büküş)',
      posture: 'Dambılları yukarı doğru bükerken bilekleri hafif dışa çevir (supinasyon). Tepe noktada pazuyu maksimum sık.',
      breathing: 'Kaldırırken nefes ver.',
      jointAngle: '45° Dirsek Fleksiyonu',
      keyCue: 'Tepe noktada pazunu taşa dönüştür.'
    },
    muscleFocus: [
      { name: 'Biceps Brachii (Pazu)', percentage: 80, role: 'primary', color: '#FACC15' },
      { name: 'Brachialis & Ön Kol', percentage: 20, role: 'secondary', color: '#38BDF8' }
    ],
    tempoGuidance: '2 sn iniş • 1 sn tepe kasılma • 10-12 tekrar',
    kineticChain: 'Açık Kinetik Zincir • Pazu İzolasyonu'
  }
};

export function getExerciseBiomechanics(id: string): ExerciseBiomechanicsData {
  if (!id) return EXERCISE_BIOMECHANICS['push_ups'];
  const cleanId = id.toLowerCase().trim();

  // 1. Direct match
  if (EXERCISE_BIOMECHANICS[cleanId]) {
    return EXERCISE_BIOMECHANICS[cleanId];
  }

  // 2. Substring match
  for (const [key, val] of Object.entries(EXERCISE_BIOMECHANICS)) {
    if (cleanId.includes(key) || key.includes(cleanId)) {
      return val;
    }
  }

  // 3. Smart Semantic Category Mapping to a GUARANTEED existing GIF
  if (cleanId.includes('push') || cleanId.includes('şınav') || cleanId.includes('sinav') || cleanId.includes('chest') || cleanId.includes('göğüs')) {
    if (cleanId.includes('elmas') || cleanId.includes('diamond')) return EXERCISE_BIOMECHANICS['diamond_pushup'];
    if (cleanId.includes('pike') || cleanId.includes('omuz')) return EXERCISE_BIOMECHANICS['pike_pushup'];
    return EXERCISE_BIOMECHANICS['push_ups'];
  }

  if (cleanId.includes('squat') || cleanId.includes('çömel') || cleanId.includes('bacak') || cleanId.includes('leg')) {
    if (cleanId.includes('split') || cleanId.includes('bulgar')) return EXERCISE_BIOMECHANICS['bulgarian_split_squat'];
    if (cleanId.includes('barbell') || cleanId.includes('salon')) return EXERCISE_BIOMECHANICS['barbell_squat'];
    return EXERCISE_BIOMECHANICS['bodyweight_squat'];
  }

  if (cleanId.includes('lunge') || cleanId.includes('adımlama')) {
    return EXERCISE_BIOMECHANICS['lunges'];
  }

  if (cleanId.includes('dip') || cleanId.includes('sandalye') || cleanId.includes('koltuk')) {
    return EXERCISE_BIOMECHANICS['chair_dips'];
  }

  if (cleanId.includes('pull') || cleanId.includes('barfiks') || cleanId.includes('lat') || cleanId.includes('sırt') || cleanId.includes('kanat')) {
    return EXERCISE_BIOMECHANICS['pull_ups'];
  }

  if (cleanId.includes('row') || cleanId.includes('çekiş') || cleanId.includes('cekis')) {
    return EXERCISE_BIOMECHANICS['barbell_row'];
  }

  if (cleanId.includes('plank') || cleanId.includes('core')) {
    return EXERCISE_BIOMECHANICS['plank'];
  }

  if (cleanId.includes('mekik') || cleanId.includes('crunch') || cleanId.includes('karın') || cleanId.includes('karin')) {
    if (cleanId.includes('bisiklet') || cleanId.includes('bicycle')) return EXERCISE_BIOMECHANICS['bicycle_crunches'];
    return EXERCISE_BIOMECHANICS['crunches'];
  }

  if (cleanId.includes('bicep') || cleanId.includes('curl') || cleanId.includes('pazu') || cleanId.includes('kol')) {
    if (cleanId.includes('hammer') || cleanId.includes('çekiç')) return EXERCISE_BIOMECHANICS['hammer_curl'];
    return EXERCISE_BIOMECHANICS['dumbbell_curl'];
  }

  if (cleanId.includes('omuz') || cleanId.includes('shoulder') || cleanId.includes('lateral') || cleanId.includes('açış')) {
    return EXERCISE_BIOMECHANICS['lateral_raise'];
  }

  if (cleanId.includes('tricep') || cleanId.includes('arka kol')) {
    return EXERCISE_BIOMECHANICS['chair_dips'];
  }

  // 4. Guaranteed fallback to push-up (always exists)
  return EXERCISE_BIOMECHANICS['push_ups'];
}
