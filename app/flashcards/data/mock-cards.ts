// app/flashcards/data/mock-cards.ts
import { Flashcard } from '../types';

export const mockFlashcards: Flashcard[] = [
  {
    id: '1',
    category: 'React',
    front: 'What are **React Hooks**?',
    back: 'Hooks are functions that let you "hook into" React state and lifecycle features from function components.\n\n### Key Rules:\n- Only call Hooks **at the top level**.\n- Only call Hooks **from React functions**.',
    tags: ['frontend', 'core'],
  },
  {
    id: '2',
    category: 'Next.js',
    front: 'What is the difference between `Server Components` and `Client Components`?',
    back: '- **Server Components**: Render on the server. Better performance, smaller bundle size, no client-side hydration.\n- **Client Components**: Hydrate on the client. Needed for interactivity, hooks (`useState`, `useEffect`), and browser APIs.',
    tags: ['routing', 'rendering'],
  },
  {
    id: '3',
    category: 'CSS',
    front: 'How do you center a div using **CSS Flexbox**?',
    back: 'You can apply the following properties to the container:\n\n```css\n.container {\n  display: flex;\n  justify-content: center; /* horizontal */\n  align-items: center;     /* vertical */\n}\n```',
    tags: ['styling'],
  },
  {
    id: '4',
    front:
      'Valdyba vakar ______ svarbų sprendimą dėl įmonės ateities.\n\n*(Phrase hint: [______ sprendimą] — to make/take a decision)*',
    back: 'priėmė — made / took (a decision)\nIPA: [pʲrʲɪˈæːmʲæː]\nPronunciation: pryah-myae\n\n### Sentence Translations:\n* **Natural:** The board made an important decision yesterday regarding the company\'s future.\n* **Literal / Grammatical:** Board [nominative] yesterday [adverb] accepted [verb, past] important [accusative] decision [accusative] regarding [preposition governing genitive] company\'s [genitive] future [genitive].\n\n### Base word:\npriimti — to accept / to take / to receive\n\n### Grammar:\nVerb, past simple tense, 3rd person singular/plural. In this construct, it acts as the light verb combining with the noun *sprendimą* (accusative singular of *sprendimas*) to form the idiomatic phrase meaning "to make/take a decision."\n\n### Related:\n* priėmimas — acceptance / admission / reception\n* išspręsti — to solve (perfective)\n\n### Other common uses of "sprendimas" (decision / solution):\n* **rasti sprendimą** — to find a solution\n  * *Example:* Mes privalome rasti šios problemos sprendimą. (We must find a solution to this problem.)\n* **pakeisti sprendimą** — to change one\'s decision / mind\n  * *Example:* Direktorius netikėtai pakeitė savo sprendimą. (The director unexpectedly changed his decision.)\n* **atidėti sprendimą** — to postpone a decision\n  * *Example:* Seimas nusprendė atidėti sprendimą kitai savaitei. (The Parliament decided to postpone the decision until next week.)\n* **teismo sprendimas** — court ruling / judicial decision\n  * *Example:* Teismo sprendimas bus paskelbtas penktadienį. (The court ruling will be announced on Friday.)',
  },
  {
    id: '5',
    front:
      'Draugai visada ______ didelę įtaką mano vaikams.\n\n*(Phrase hint: [______ įtaką] — to influence / to have an influence)*',
    back: 'daro — make / have (an influence)\nIPA: [ˈdaːroː]\nPronunciation: dah-roh\n\n### Sentence Translations:\n* **Natural:** Friends always have a big influence on my children.\n* **Literal / Grammatical:** Friends [nominative] always [adverb] make [verb, present, 3rd person plural] big [accusative] influence [accusative] my [genitive] children [dative].\n\n### Base word:\ndaryti — to make / to do\n\n### Grammar:\nVerb, present tense, 3rd person plural. Combined with the noun *įtaką* (accusative of *įtaka*), this phrase requires the dative case for the object of influence (*vaikams*).\n\n### Related:\n* įtakingas — influential\n* poveikis — impact / effect\n\n### Other common uses of "įtaka" (influence):\n* **pasiduoti įtakai** — to yield to influence\n  * *Example:* Svarbu nepasiduoti blogai įtakai. (It is important not to yield to bad influence.)\n* **prarasti įtaką** — to lose influence\n  * *Example:* Ši įmonė greitai praranda savo įtaką. (This company is quickly losing its influence.)',
  },
  {
    id: '6',
    front:
      'Prašau ______ dėmesį į šį naują tekstą.\n\n*(Phrase hint: [______ dėmesį] — to pay/draw attention)*',
    back: 'atkreipti — to draw / to direct (attention)\nIPA: [ɐtˈkʲrʲæɪ̯pʲtʲɪ]\nPronunciation: uht-KRYAP-tee\n\n### Sentence Translations:\n* **Natural:** Please pay attention to this new text.\n* **Literal / Grammatical:** Please [adverb] to-draw [verb, infinitive] attention [accusative] into [preposition governing accusative] this [accusative] new [accusative] text [accusative].\n\n### Base word:\natkreipti — to turn / to draw / to direct\n\n### Grammar:\nVerb, infinitive. In this collocation, it is used with the preposition *į* followed by the accusative case (*į šį naują tekstą*).\n\n### Related:\n* kreiptis — to turn to / to address\n* atkreipimas — drawing / directing (of attention)\n\n### Other common uses of "dėmesys" (attention):\n* **rodyti dėmesį** — to show attention / care\n  * *Example:* Jis visada rodo dėmesį savo šeimai. (He always shows attention to his family.)\n* **stokoti dėmesio** — to lack attention\n  * *Example:* Šis vaikas tiesiog stokoja dėmesio. (This child simply lacks attention.)',
  },
  {
    id: '7',
    front:
      'Ši nauja problema ______ daug rimtų klausimų.\n\n*(Phrase hint: [______ klausimus] — to raise questions)*',
    back: 'kelia — raises / poses\nIPA: [ˈkʲæːlʲɪɐ]\nPronunciation: KYAE-lyuh\n\n### Sentence Translations:\n* **Natural:** This new problem raises many serious questions.\n* **Literal / Grammatical:** This [nominative] new [nominative] problem [nominative] raises [verb, present, 3rd person] many [accusative] serious [genitive] questions [genitive].\n\n### Base word:\nkelti — to raise / to lift\n\n### Grammar:\nVerb, present tense, 3rd person singular. Combined with the direct object *klausimus* (accusative plural of *klausimas*). The word "daug" governs the genitive case (*klausimų*).\n\n### Related:\n* pakelti — to raise / to lift up\n* kėlimas — raising / lifting\n\n### Other common uses of "klausimas" (question / issue):\n* **spręsti klausimą** — to solve / to address an issue\n  * *Example:* Mes turime greitai spręsti šį klausimą. (We must address this issue quickly.)\n* **atsakyti į klausimą** — to answer a question\n  * *Example:* Lengva atsakyti į šį klausimą. (It is easy to answer this question.)',
  },
  {
    id: '8',
    front:
      'Mes turime skubiai ______ griežtų priemonių prieš krizę.\n\n*(Phrase hint: [______ priemonių] — to take measures/actions)*',
    back: 'imtis — to take (upon oneself)\nIPA: [ˈɪmʲtʲɪsʲ]\nPronunciation: EEM-tees\n\n### Sentence Translations:\n* **Natural:** We have to urgently take strict measures against the crisis.\n* **Literal / Grammatical:** We [pronoun] have [verb, present, 1st person plural] urgently [adverb] to-take [verb, infinitive, reflexive] strict [genitive] measures [genitive] against [preposition governing accusative] crisis [accusative].\n\n### Base word:\nimtis — to take up / to undertake\n\n### Grammar:\nVerb, infinitive, reflexive. In this collocation, the reflexive verb *imtis* governs the genitive case (*griežtų priemonių*).\n\n### Related:\n* priemonė — measure / tool\n* ėmimasis — undertaking / initiative\n\n### Other common uses of "priemonė" (measure / means):\n* **apsaugos priemonė** — safety / protective measure\n  * *Example:* Tai svarbi apsaugos priemonė darbe. (This is an important safety measure at work.)\n* **transporto priemonė** — vehicle / means of transport\n  * *Example:* Mašina yra mano transporto priemonė. (The car is my vehicle.)',
  },
  {
    id: '9',
    front:
      'Jis ______ mažą klaidą savo šiame darbe.\n\n*(Phrase hint: [______ klaidą] — to make a mistake)*',
    back: 'padarė — made / committed\nIPA: [pɐˈdaːreː]\nPronunciation: puh-DAH-rae\n\n### Sentence Translations:\n* **Natural:** He made a small mistake in his this work.\n* **Literal / Grammatical:** He [nominative] made [verb, past, 3rd person] small [accusative] mistake [accusative] his [genitive] this [locative] work [locative].\n\n### Base word:\npadaryti — to make / to do\n\n### Grammar:\nVerb, past simple tense, 3rd person singular. Governs the direct object in the accusative case (*klaidą*).\n\n### Related:\n* klaidingas — erroneous / mistaken\n* klysti — to make a mistake / to err\n\n### Other common uses of "klaida" (mistake / error):\n* **ištaisyti klaidą** — to correct a mistake\n  * *Example:* Aš noriu ištaisyti savo klaidą. (I want to correct my mistake.)\n* **pripažinti klaidą** — to admit a mistake\n  * *Example:* Svarbu pripažinti savo klaidą. (It is important to admit one\'s mistake.)',
  },
  {
    id: '10',
    front:
      'Mano tėvai ______ pirmenybę sveikam maistui.\n\n*(Phrase hint: [______ pirmenybę] — to give priority / to prefer)*',
    back: 'teikia — give / grant / provide\nIPA: [ˈtʲæɪ̯kʲɪɐ]\nPronunciation: TYAY-kyuh\n\n### Sentence Translations:\n* **Natural:** My parents give priority to healthy food.\n* **Literal / Grammatical:** My [genitive] parents [nominative] give [verb, present, 3rd person plural] priority [accusative] healthy [dative] food [dative].\n\n### Base word:\nteikti — to provide / to submit / to offer\n\n### Grammar:\nVerb, present tense, 3rd person plural. Governs the accusative case for the object of priority (*pirmenybę*) and the dative case for the recipient of the priority (*sveikam maistui*).\n\n### Related:\n* pirmenybė — priority / preference\n* teikimas — provision / submission\n\n### Other common uses of "pirmenybė" (priority):\n* **pirmenybės teisė** — right of priority\n  * *Example:* Kas turi pirmenybės teisę kelyje? (Who has the right of priority on the road?)\n* **teikti pagalbą** — to provide help / assistance\n  * *Example:* Mes norime teikti pagalbą vaikams. (We want to provide help to children.)',
  },
  {
    id: '11',
    front:
      'Pinigai man ______ labai mažai reikšmės.\n\n*(Phrase hint: [______ reikšmės] — to have significance / to matter)*',
    back: 'turi — has / have\nIPA: [ˈtʊrʲɪ]\nPronunciation: TOO-ree\n\n### Sentence Translations:\n* **Natural:** Money has very little significance to me.\n* **Literal / Grammatical:** Money [nominative] me [dative] has [verb, present, 3rd person] very [adverb] little [adverb] significance [genitive].\n\n### Base word:\nturėti — to have\n\n### Grammar:\nVerb, present tense, 3rd person singular. Governs the genitive case (*reikšmės*) due to the quantifier *mažai*.\n\n### Related:\n* reikšmingas — significant / important\n* reikšti — to mean / to signify\n\n### Other common uses of "reikšmė" (significance / meaning):\n* **prarasti reikšmę** — to lose significance\n  * *Example:* Šis įstatymas praranda savo reikšmę. (This law is losing its significance.)\n* **žodžio reikšmė** — word meaning\n  * *Example:* Kokia yra šio žodžio reikšmė? (What is the meaning of this word?)',
  },
  {
    id: '12',
    front:
      'Ši šeima ______ didelę finansinę paramą iš valstybės.\n\n*(Phrase hint: [______ paramą] — to receive/get support)*',
    back: 'gavo — received / got\nIPA: [ˈɡaːvoː]\nPronunciation: GAH-voh\n\n### Sentence Translations:\n* **Natural:** This family received big financial support from the state.\n* **Literal / Grammatical:** This [nominative] family [nominative] received [verb, past, 3rd person] big [accusative] financial [accusative] support [accusative] from [preposition governing genitive] state [genitive].\n\n### Base word:\ngauti — to get / to receive\n\n### Grammar:\nVerb, past simple tense, 3rd person singular. Governs the direct object in the accusative case (*paramą*).\n\n### Related:\n* gavėjas — recipient\n* paramos fondas — support fund\n\n### Other common uses of "parama" (support / assistance):\n* **teikti paramą** — to provide support / aid\n  * *Example:* Jie teikia paramą gyvūnų prieglaudai. (They provide support to the animal shelter.)\n* **prašyti paramos** — to ask for support\n  * *Example:* Mes nusprendėme prašyti paramos iš draugų. (We decided to ask for support from friends.)',
  },
  {
    id: '13',
    front:
      'Sportas ______ labai svarbų vaidmenį mano gyvenime.\n\n*(Phrase hint: [______ vaidmenį] — to play a role)*',
    back: 'vaidina — plays\nIPA: [vɐɪ̯ˈdʲɪnɐ]\nPronunciation: vy-DEE-nuh\n\n### Sentence Translations:\n* **Natural:** Sport plays a very important role in my life.\n* **Literal / Grammatical:** Sport [nominative] plays [verb, present, 3rd person] very [adverb] important [accusative] role [accusative] my [genitive] life [locative].\n\n### Base word:\nvaidinti — to play / to act\n\n### Grammar:\nVerb, present tense, 3rd person singular. Combined with the direct object *vaidmenį* (accusative singular of *vaidmuo*).\n\n### Related:\n* vaidmuo — role\n* vaidyba — acting\n\n### Other common uses of "vaidmuo" (role):\n* **pagrindinis vaidmuo** — lead / main role\n  * *Example:* Kas vaidina pagrindinį vaidmenį? (Who plays the lead role?)\n* **atlikti vaidmenį** — to perform / fulfill a role\n  * *Example:* Jis gerai atlieka savo vaidmenį darbe. (He performs his role at work well.)',
  },
  {
    id: '14',
    front:
      'Tu turi ______ daugiau laiko savo šeimai.\n\n*(Phrase hint: [______ laiko] — to dedicate/devote time)*',
    back: 'skirti — to dedicate / to devote / to allocate\nIPA: [ˈsʲkʲɪrʲtʲɪ]\nPronunciation: SKEER-tee\n\n### Sentence Translations:\n* **Natural:** You have to dedicate more time to your family.\n* **Literal / Grammatical:** You [pronoun] have [verb, present, 2nd person singular] to-dedicate [verb, infinitive] more [adverb] time [genitive] your [genitive] family [dative].\n\n### Base word:\nskirti — to dedicate / to separate / to allocate\n\n### Grammar:\nVerb, infinitive. In this collocation, the verb governs the genitive case (*laiko*) due to the comparative adverb *daugiau*, and the dative case for the recipient (*šeimai*).\n\n### Related:\n* skirtumas — difference\n* paskyrimas — appointment / allocation\n\n### Other common uses of "laikas" (time):\n* **leisti laiką** — to spend time\n  * *Example:* Kaip tu nori leisti laiką šiandien? (How do you want to spend time today?)\n* **taupyti laiką** — to save time\n  * *Example:* Aš stengiuosi visada taupyti laiką. (I try to always save time.)',
  },
  {
    id: '15',
    front:
      'Mūsų įmonė šiais metais ______ daug nuostolių.\n\n*(Phrase hint: [______ nuostolių] — to suffer losses)*',
    back: 'patyrė — suffered / experienced\nIPA: [pɐˈtʲiːreː]\nPronunciation: puh-TYEE-rae\n\n### Sentence Translations:\n* **Natural:** Our company suffered many losses this year.\n* **Literal / Grammatical:** Our [genitive] company [nominative] this [locative] years [locative] suffered [verb, past, 3rd person] many [accusative] losses [genitive].\n\n### Base word:\npatirti — to suffer / to experience\n\n### Grammar:\nVerb, past simple tense, 3rd person singular. Governs the accusative pronoun "daug", which in turn requires the noun in the genitive plural (*nuostolių*).\n\n### Related:\n* patirtis — experience\n* nuostolingas — unprofitable / loss-making\n\n### Other common uses of "nuostolis" (loss / damage):\n* **atnešti nuostolių** — to bring / cause losses\n  * *Example:* Šis sprendimas atnešė tik nuostolių. (This decision only brought losses.)\n* **finansiniai nuostoliai** — financial losses\n  * *Example:* Mes norime išvengti finansinių nuostolių. (We want to avoid financial losses.)',
  },
  {
    id: '16',
    front:
      'Mes norime ______ geras sąlygas vaikams mokytis.\n\n*(Phrase hint: [______ sąlygas] — to create/constitute conditions)*',
    back: 'sudaryti — to form / to create / to make up\nIPA: [sʊˈdaːrʲiːtʲɪ]\nPronunciation: soo-dah-ryee-tee\n\n### Sentence Translations:\n* **Natural:** We want to create good conditions for children to study.\n* **Literal / Grammatical:** We [pronoun] want [verb, present, 1st person plural] to-create [verb, infinitive] good [accusative] conditions [accusative] children [dative] to-study [verb, infinitive].\n\n### Base word:\nsudaryti — to form / to create / to make up\n\n### Grammar:\nVerb, infinitive. Combined with the direct object *sąlygas* (accusative plural of *sąlyga*). The beneficiaries of the conditions are in the dative case (*vaikams*).\n\n### Related:\n* sudarymas — formation / creation\n* sąlyginis — conditional\n\n### Other common uses of "sąlyga" (condition / term):\n* **darbo sąlygos** — working conditions\n  * *Example:* Man patinka mano darbo sąlygos. (I like my working conditions.)\n* **sutarties sąlygos** — terms of the contract\n  * *Example:* Kvapą gniaužiančios sutarties sąlygos buvo aiškios. (The terms of the contract were clear.)',
  },
  {
    id: '17',
    front:
      'Mums labai sunku ______ bendrą kalbą su piktu kaimynu.\n\n*(Phrase hint: [______ bendrą kalbą] — to find common ground / common language)*',
    back: 'rasti — to find\nIPA: [ˈrɐsʲtʲɪ]\nPronunciation: RAHS-tee\n\n### Sentence Translations:\n* **Natural:** It is very difficult for us to find common ground with the angry neighbor.\n* **Literal / Grammatical:** Us [dative] very [adverb] difficult [adverb] to-find [verb, infinitive] common [accusative] language [accusative] with [preposition governing instrumental] angry [instrumental] neighbor [instrumental].\n\n### Base word:\nrasti — to find\n\n### Grammar:\nVerb, infinitive. In this idiom, it is paired with *bendrą kalbą* (accusative singular). The phrase uses the adverb *sunku* (difficult) which requires the person experiencing the difficulty to be in the dative case (*mums*).\n\n### Related:\n* radinys — find / discovery\n* surasti — to locate / to find out\n\n### Other common uses of "kalba" (language / speech):\n* **užmegzti kalbą** — to strike up a conversation\n  * *Example:* Man sunku užmegzti kalbą su nepažįstamaisiais. (It is hard for me to strike up a conversation with strangers.)\n* **kalbos barjeras** — language barrier\n  * *Example:* Mes neturime kalbos barjero. (We do not have a language barrier.)',
  },
  {
    id: '18',
    front:
      'Šis senas namas ______ rimtą pavojų visiems žmonėms.\n\n*(Phrase hint: [______ pavojų] — to pose/raise a danger)*',
    back: 'kelia — poses / raises\nIPA: [ˈkʲæːlʲɪɐ]\nPronunciation: KYAE-lyuh\n\n### Sentence Translations:\n* **Natural:** This old house poses a serious danger to all people.\n* **Literal / Grammatical:** This [nominative] old [nominative] house [nominative] poses [verb, present, 3rd person] serious [accusative] danger [accusative] all [dative] people [dative].\n\n### Base word:\nkelti — to raise / to lift / to pose\n\n### Grammar:\nVerb, present tense, 3rd person singular. Combined with the direct object *pavojų* (accusative singular of *pavojus*). The target of the danger is in the dative case (*žmonėms*).\n\n### Related:\n* pavojingas — dangerous\n* sukelti — to cause / to induce\n\n### Other common uses of "pavojus" (danger / hazard):\n* **išvengti pavojaus** — to avoid danger\n  * *Example:* Mes norime greitai išvengti pavojaus. (We want to avoid the danger quickly.)\n* **gyvybės pavojus** — danger to life\n  * *Example:* Ar čia yra gyvybės pavojus? (Is there a danger to life here?)',
  },
];
