export interface Category {
  label: string;
  emoji: string;
  color: string;
  name: string;
}

export const DEFAULT_CATEGORIES: Record<string, Category> = {
  rossbacher: { label: '🏢 Rossbacher', emoji: '🏢', color: '#4a90d9', name: 'Rossbacher' },
  ki: { label: '🤖 KI & Lernen', emoji: '🤖', color: '#9b6dd7', name: 'KI & Lernen' },
  kreativ: { label: '📖 Kreativ', emoji: '📖', color: '#c9a84c', name: 'Kreativ' },
  familie: { label: '👨‍👩‍👧 Familie', emoji: '👨‍👩‍👧', color: '#d9739e', name: 'Familie' },
  persoenlich: { label: '🧘 Persönlich', emoji: '🧘', color: '#4ecdc4', name: 'Persönlich' },
};

export const AUTO_CAT_KEYWORDS: Record<string, string[]> = {
  rossbacher: ['rossbacher','büro','office','meeting','chef','kollege','kollegin','arbeit','projekt','deadline','präsentation','email','mail','angebot','kunde','kundin','rechnung','lieferung','lieferschein','bestellung','firma','geschäft','call','zoom','teams','anruf','besprechung','protokoll','kunden','auftrag','lager','versand','buchhaltung','steuer','mitarbeiter','rechnungen','gehalt','umsatz','vertrag','lieferant'],
  ki: ['ki','ai','python','code','programmier','lernen','kurs','tutorial','claude','chatgpt','machine learning','neural','daten','api','prompt','openai','anthropic','model','training','chatbot','algorithmus','deep learning','tensorflow','pytorch','notebook','jupyter','gpt','llm','copilot','automation','bot'],
  kreativ: ['schreib','buch','lesen','blog','zeichn','malen','foto','video','musik','design','kreativ','gedicht','tagebuch','journal','roman','geschichte','text','artikel','notiz','brainstorm','idee','skizze','aquarell','kalligraph','poesie','lyrics','song','album','podcast','youtube','content','essay'],
  familie: ['letizia','mama','papa','schwester','bruder','oma','opa','kindergarten','schule','kind','kinder','familie','eltern','geburtstag','familien','abend','gemeinsam','spielen','vorlesen','basteln','kochen zusammen','ausflug','zoo','spielplatz','kinderarzt','kita','abholen','bringen','wochenende','großeltern','onkel','tante','nichte','neffe','babysitter'],
  persoenlich: ['yoga','meditation','sport','laufen','gym','fitness','arzt','termin','zahnarzt','friseur','wohnung','putzen','waschen','bügeln','kochen','einkauf','staubsaugen','aufräumen','bad','dusche','schlaf','ruhe','spazier','natur','garten','balkon','apotheke','rezept','therapie','massage','sauna','schwimmen','radfahren','wandern','wellness','entspann','self-care','pause','auszeit'],
};

export const CAT_EMOJIS = ['🏢','🤖','📖','👨‍👩‍👧','🧘','💼','🎯','🏠','💪','🎨','📚','💡','🌱','🎵','🏋️','🍳','✈️','💰','❤️','🎓','🔧','📱','🛒','⭐','🌍','🧠','📝','🎮','🐾','🌸'];

export const CAT_COLORS = ['#4a90d9','#9b6dd7','#c9a84c','#d9739e','#4ecdc4','#ef5350','#66bb6a','#ff7043','#ab47bc','#5c6bc0','#26a69a','#ffa726','#8d6e63','#78909c','#ec407a','#7e57c2'];

export const SHOP_CATEGORIES: Record<string, { label: string; keywords: string[] }> = {
  obst: { label: '🍎 Obst & Gemüse', keywords: ['apfel','äpfel','birne','banane','bananen','orange','orangen','tomate','tomaten','gurke','salat','kartoffel','kartoffeln','zwiebel','zwiebeln','paprika','zucchini','karotte','karotten','brokkoli','spinat','trauben','erdbeeren','heidelbeeren','avocado','mango','kiwi','ananas','zitrone','zitronen','knoblauch','pilze','champignons'] },
  milch: { label: '🥛 Milchprodukte', keywords: ['milch','butter','käse','joghurt','sahne','quark','frischkäse','schmand','skyr','mascarpone','mozzarella','parmesan','gouda','emmentaler','buttermilch','schlagsahne','sauerrahm','crème fraîche'] },
  fleisch: { label: '🥩 Fleisch & Fisch', keywords: ['fleisch','huhn','hähnchen','rind','schwein','lachs','fisch','wurst','schinken','speck','hack','hackfleisch','salami','thunfisch','garnelen','pute','truthahn'] },
  brot: { label: '🍞 Brot & Backwaren', keywords: ['brot','brötchen','semmel','toast','croissant','brezel','kuchen','mehl','hefe','backpulver','tortilla','wrap','baguette'] },
  trocken: { label: '🥫 Trockenwaren', keywords: ['nudeln','reis','pasta','spaghetti','linsen','bohnen','kichererbsen','haferflocken','müsli','zucker','salz','pfeffer','öl','olivenöl','essig','senf','ketchup','soja','dose','konserve','nüsse','mandeln','rosinen','couscous','bulgur'] },
  haushalt: { label: '🧴 Haushalt', keywords: ['spülmittel','waschmittel','toilettenpapier','küchenrolle','seife','shampoo','duschgel','zahnpasta','deo','creme','taschentücher','müllbeutel','schwamm','reiniger','weichspüler'] },
  tk: { label: '❄️ Tiefkühl', keywords: ['tiefkühl','eis','pizza','pommes','tk-','gefrorene','fischstäbchen'] },
  sonstiges: { label: '📦 Sonstiges', keywords: [] },
};
