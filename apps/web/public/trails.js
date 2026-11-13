/* DNA Trails prototype 2: trails, stops and hosts.
   Everything about hosts, call notes and road notes is SAMPLE content written for the design.
   Real ones exist only after a team member has driven the trail. */
(function(){
const D=window.DNA;

/* car classes used by last-kilometre notes */
D.CARS={small:{label:'Small rental',hint:'Low clearance, city tyres'},regular:{label:'Regular car',hint:'Any normal car'},suv:{label:'High car or 4x4',hint:'SUV, Duster, Niva'}};
D.TYPES={quest:{label:'Quick Quest',len:'One day',price:12},pack:{label:'Pack & Go',len:'A weekend',price:19},long:{label:'Pack & Go',len:'3 to 5 days',price:29},composed:{label:'Trip-it-Yourself',len:'Composed for you',price:29}};
D.APPETITES=[['food','Village tables'],['wine','Wine and rakija'],['stones','Old stones'],['water','Water and gorges'],['heights','High places'],['hands','Hands-on']];

/* face: skin 0-2, hair colour, style: short|bun|scarf|cap|bald|long, extras */
D.HOSTS={
 riste:{name:'Riste',role:'Shepherd',where:'Bistra, above Galičnik',since:'Called 6 times since April',face:{skin:1,hair:'#8C8C86',style:'cap',mous:1,top:'#1C562B'},line:'Keeps about 300 sheep on Bistra from May to October. Makes the cheese himself, in the hut.',phone:'Phone, mornings'},
 vesna:{name:'Vesna',role:'Cooks in her stone house',where:'Galičnik',since:'Called 6 times since April',face:{skin:0,hair:'#5A3A22',style:'bun',top:'#B3602A'},line:'Opens her kitchen from May, when the road is clear of snow. Asks one thing: tell her if you do not eat lamb.',phone:'Viber, after 18:00'},
 teodora:{name:'Teodora',role:'Ajvar and a full table',where:'Prosenikovo',since:'Called 4 times since April',face:{skin:0,hair:'#E6E3DA',style:'scarf',scarf:'#B3602A',top:'#383838'},line:'In her seventies and faster with a pepper than anyone you know. Ajvar days run from mid-September.',phone:'Phone, any time'},
 stevce:{name:'Stevče',role:'Keeps the tower keys',where:'Kratovo',since:'Called 5 times since April',face:{skin:1,hair:'#3A3A3A',style:'short',beard:1,top:'#132B18'},line:'Walks you over the old bridges and up one of the medieval towers. He decides which one on the day.',phone:'Viber'},
 lence:{name:'Lenče',role:'Pastrmajlija from a wood oven',where:'Kratovo',since:'Called 5 times since April',face:{skin:0,hair:'#2B2B2B',style:'long',top:'#B8A559'},line:'Bakes to order, so she needs to know you are coming. That is the whole reason we call.',phone:'Phone, mornings'},
 mara:{name:'Mara',role:'Has the church key',where:'Lesnovo',since:'Called 3 times since April',face:{skin:0,hair:'#D8D4C8',style:'scarf',scarf:'#1C562B',glasses:1,top:'#5B685F'},line:'The small church above the village is locked. The key lives in her kitchen drawer.',phone:'Landline, lunchtime'},
 zoran:{name:'Zoran',role:'Family cellar',where:'Vataša, Tikveš',since:'Called 7 times since April',face:{skin:1,hair:'#4A4A4A',style:'short',mous:1,top:'#7B2D43'},line:'Third generation on the same vines. Pours vranec from the barrel and talks about 1987 as if it were last week.',phone:'Viber'},
 marija:{name:'Marija',role:'Winemaker',where:'Demir Kapija',since:'Called 4 times since April',face:{skin:0,hair:'#8A4B2A',style:'long',glasses:1,top:'#1C562B'},line:'Came back from Skopje to run her grandfather\'s cellar. Tastings are in the yard, under the walnut tree.',phone:'Viber or phone'},
 kiro:{name:'Kiro',role:'Runs the village still',where:'Dolni Disan',since:'Called 3 times since April',face:{skin:2,hair:'#CFCBBF',style:'bald',mous:1,top:'#B3602A'},line:'The copper still is older than he is. He will insist you try the rakija before noon. You may decline once.',phone:'Phone, evenings'},
 blagoj:{name:'Blagoj',role:'Beekeeper',where:'Berovo',since:'Called 5 times since April',face:{skin:1,hair:'#B9B5A8',style:'cap',glasses:1,top:'#B8A559'},line:'Around 80 hives in the Maleševo hills. Lets you taste straight from the frame if the bees agree.',phone:'Phone, mornings'},
 slavica:{name:'Slavica',role:'Sheep cheese and potatoes',where:'Rusinovo',since:'Called 5 times since April',face:{skin:0,hair:'#6B4A2E',style:'scarf',scarf:'#B8A559',top:'#1C562B'},line:'Her table is the reason people drive to Maleševo twice. Lunch is whatever the garden gave that week.',phone:'Viber, after 17:00'},
 ljupco:{name:'Ljupčo',role:'Boatman',where:'Konjsko, Lake Prespa',since:'Called 4 times since April',face:{skin:2,hair:'#3A3A3A',style:'cap',beard:1,top:'#4F8FA6'},line:'Takes you across to Golem Grad when the lake is calm. If the wind is up he says no, and so do we.',phone:'Phone, before 08:00'},
 nada:{name:'Nada',role:'Guesthouse kitchen',where:'Brajčino',since:'Called 6 times since April',face:{skin:0,hair:'#7A7A74',style:'bun',top:'#B3602A'},line:'Cooks for walkers coming down from Pelister. Beans in a clay pot, pie, and plums in every form.',phone:'Viber'},
 dimce:{name:'Dimče',role:'Lokum maker',where:'Kruševo',since:'Called 3 times since April',face:{skin:1,hair:'#2B2B2B',style:'short',glasses:1,top:'#132B18'},line:'Cuts lokum by hand in a shop the size of a cupboard. Ask for the rose one.',phone:'Phone, shop hours'},
 petar:{name:'Petar',role:'Potter',where:'Resen',since:'Called 4 times since April',face:{skin:1,hair:'#A8A49A',style:'short',beard:1,top:'#8A5A2B'},line:'Throws on a kick wheel and lets you ruin a pot or two. Fired pieces can be posted to you.',phone:'Viber'}
};

/* helper to keep stop definitions short */
const S=(id,o)=>Object.assign({id,mins:60,spend:0,tags:[],closed:[],minCar:'small'},o);

D.TRAILS=[
{id:'galicnik',type:'quest',title:'The High Road to Galičnik',sub:'A church in a lake, a shepherd, a stone village',img:'galicnik',region:'polog',cap:4,km:95,audio:true,start:'Mavrovo village',best:'May to October',driven:'28 Apr 2027',drivenBy:'Bozhin and Natasha',
 pitch:'One day in Mavrovo National Park. You start at a church that stands in a lake, climb to a sheepfold where the cheese is still warm, and eat lunch in a village that is nearly empty all winter.',
 days:[{t:'Mavrovo to Galičnik',sleep:null,stops:[
  S('church',{name:'The sunken church of St Nicholas',where:'Mavrovo',lat:41.7036,lon:20.7466,img:'mavrovo',time:'09:30',mins:40,tags:['stones','water'],
    what:'Built in 1850 and flooded in 1953 when the valley became a lake. In a dry spring you can walk inside. In a wet one the water is at the windows.',
    road:{small:'Asphalt to the shore. Park by the dam road and walk three minutes.',regular:'Asphalt to the shore.',suv:'Asphalt to the shore.'},cash:'Nothing to pay.',fuel:'Fill up in Gostivar. The next pump after this is 60 km away.',signal:'Full signal.',
    story:{t:'The church that would not drown',mins:4,text:'When the engineers closed the dam in 1953, the village moved uphill and the church stayed. Every summer since, the lake decides how much of it you get to see.'}}),
  S('sheep',{name:'Warm cheese at the sheepfold',where:'Bistra, above Galičnik',lat:41.618,lon:20.676,img:'sheep',host:'riste',time:'11:00',mins:60,spend:15,tags:['food','hands','heights'],
    what:'Riste milks at dawn and makes cheese before the sun is high. You taste it warm, with bread, on a bench that looks at half the park.',note:'Riste is at the hut until 13:00. He kept a wheel of yesterday\'s kashkaval for you.',
    road:{small:'Leave the car at the lay-by after km 9 and walk 15 minutes. The track is too rough for a small rental.',regular:'Gravel for the last 1.2 km. Slow is fine.',suv:'Drive right up to the hut.'},cash:'Cash only. About EUR 15 for two.',fuel:'None nearby.',signal:'No signal after km 6. The map and audio are saved offline.',extra:'Three sheepdogs. Loud, harmless, wait by the car until Riste whistles.',
    backup:'Cheese from the dairy shop in Mavrovi Anovi, 20 minutes back',
    story:{t:'Why the men walked away every autumn',mins:6,text:'For centuries the men of these villages left after the harvest to work abroad and came home for one summer month. They called it pečalba. Everything here, the weddings included, was planned around that month.'}}),
  S('lunch',{name:'Lunch in a stone house',where:'Galičnik',lat:41.5948,lon:20.6542,img:'village',host:'vesna',time:'13:00',mins:90,spend:36,tags:['food','stones'],
    what:'Vesna cooks one menu a day in her own kitchen. Expect pie, slow lamb or beans, and a view down the valley from the table.',note:'Vesna is cooking lamb under the sač for 13:00. She has beans for anyone who would rather not.',
    road:{small:'Asphalt all the way, narrow in the village. Park at the square.',regular:'Asphalt. Park at the square.',suv:'Asphalt. Park at the square.'},cash:'Cash only. About EUR 18 a person. The nearest ATM is in Gostivar.',fuel:'None in the village.',signal:'Signal on the square, none in the lower lanes.',
    backup:'The inn on the square, open daily in season',
    story:{t:'A wedding the whole village waits for',mins:5,text:'On St Peter\'s Day in July the drums start at dawn. One couple marries the old way, in front of everyone who ever left and came back for it.'}}),
  S('duf',{name:'Duf waterfall',where:'Rostuše',lat:41.613,lon:20.598,img:'duf',time:'15:30',mins:75,tags:['water'],
    what:'A 25 minute walk up a narrow canyon to a waterfall that stays cold in August. The path is shaded the whole way.',
    road:{small:'Asphalt to Rostuše. Park by the school.',regular:'Asphalt to Rostuše.',suv:'Asphalt to Rostuše.'},cash:'Nothing to pay.',fuel:'Pump in Debar, 25 km on.',signal:'Signal in the village, none in the canyon.',extra:'Wet stones near the top. Proper shoes, not sandals.'})
 ]}]},

{id:'belasica',type:'quest',title:'Waterfalls and a Village Table',sub:'Two falls under Belasica and lunch with Teodora',img:'smolare',region:'southeastern',cap:5,km:60,audio:false,start:'Strumica',best:'April to October',driven:'30 Apr 2027',drivenBy:'Dukica and Tea',
 pitch:'The quiet south-east in one day. Walk to the tallest waterfall in the country before the heat, cool off at a second one, then sit down at a table that takes Teodora two days to prepare.',
 days:[{t:'Under Belasica',sleep:null,stops:[
  S('smolare',{name:'Smolare waterfall',where:'Smolare',lat:41.3647,lon:22.9006,img:'smolare',time:'09:00',mins:70,tags:['water','heights'],
    what:'At 39.5 metres it is the tallest waterfall in Macedonia. About 300 wooden steps through beech forest get you there.',
    road:{small:'Asphalt to the car park above the village.',regular:'Asphalt to the car park.',suv:'Asphalt to the car park.'},cash:'Small parking fee, coins help.',fuel:'Pump in Novo Selo, 7 km.',signal:'Good signal at the car park.',extra:'Village stalls on the path sell dried peppers and honey. They are not on our call list, but they are usually there.'}),
  S('kolesino',{name:'Kolešino waterfall',where:'Kolešino',lat:41.3806,lon:22.8136,img:'kolesino',time:'10:45',mins:50,tags:['water'],
    what:'Smaller and wider than Smolare, with a wooden bridge right under the spray. Ten flat minutes from the car.',
    road:{small:'Asphalt, then 400 m of good gravel.',regular:'Asphalt, then good gravel.',suv:'Drive to the picnic area.'},cash:'Nothing to pay.',fuel:'Same pump in Novo Selo.',signal:'Weak. Enough for a message.'}),
  S('table',{name:'Teodora\'s table',where:'Prosenikovo',lat:41.456,lon:22.69,img:'ajvar',host:'teodora',time:'12:30',mins:120,spend:30,tags:['food','hands'],
    what:'A yard, a long table and whatever Teodora decided on. In ajvar season you take a turn at the pot. Out of season she opens a jar from October and tells you what you missed.',note:'Teodora is home and has been cooking since morning. She asked how many of you eat spicy.',
    road:{small:'Asphalt to her gate. Second house after the shop, green fence.',regular:'Asphalt to her gate.',suv:'Asphalt to her gate.'},cash:'Cash only. About EUR 15 a person, jar included.',fuel:'Pumps in Strumica, 6 km.',signal:'Full signal.',
    backup:'A family restaurant in Bansko, 10 minutes away, confirmed the same evening',
    story:{t:'Paprika caviar',mins:5,text:'Ajvar takes a day of roasting, an evening of peeling and four hours of stirring. Nobody makes it alone, which is the point.'}})
 ]}]},

{id:'kratovo',type:'quest',title:'Stone Dolls, Towers and a Crater',sub:'Kuklica, Kratovo and the key to a locked church',img:'kuklica',region:'northeastern',cap:4,km:110,audio:true,start:'Kumanovo or Skopje',best:'April to November',driven:'3 May 2027',drivenBy:'Bozhin and Stefanija',
 pitch:'The north-east that tour buses skip. A petrified wedding, a town built inside a dead volcano, lunch from a wood oven, and a church that only opens if someone calls Mara first. We call Mara.',
 days:[{t:'Kuklica, Kratovo, Lesnovo',sleep:null,stops:[
  S('kuklica',{name:'The stone dolls of Kuklica',where:'Kuklica',lat:42.104,lon:22.074,img:'kuklica',time:'09:30',mins:50,tags:['stones'],
    what:'More than a hundred stone pillars on a hillside. The legend says a wedding party was cursed and turned to stone. Geology says rain, wind and a very long time.',
    road:{small:'Asphalt to the gate.',regular:'Asphalt to the gate.',suv:'Asphalt to the gate.'},cash:'Small entry fee, cash.',fuel:'Fill up in Kratovo.',signal:'Good signal.',
    story:{t:'The groom who promised two brides',mins:4,text:'He set both weddings for the same day and hoped nobody would notice. One bride noticed. She cursed the lot of them, and here they still stand.'}}),
  S('towers',{name:'Bridges and towers with Stevče',where:'Kratovo',lat:42.0793,lon:22.1802,img:'kratovo',host:'stevce',time:'10:45',mins:75,spend:10,tags:['stones','heights'],
    what:'Kratovo sits in the crater of an extinct volcano, stitched together by old stone bridges. Stevče has the keys to the towers and opinions about all of them.',note:'Stevče meets you at the clock tower at 10:45. He will have the keys to Simić\'s tower.',
    road:{small:'Asphalt. Park at the lower square, the upper lanes are tight.',regular:'Asphalt. Park at the lower square.',suv:'Asphalt. Park at the lower square.'},cash:'Cash, about EUR 5 a person.',fuel:'Pump at the town entrance.',signal:'Full signal.',
    backup:'A self-guided bridge walk with the audio story, towers seen from outside',
    story:{t:'Six towers and a town of miners',mins:6,text:'Metal has come out of these hills since Roman times. The towers were strongrooms as much as homes, and the bridges let miners cross town without getting their feet wet.'}}),
  S('oven',{name:'Pastrmajlija from Lenče\'s oven',where:'Kratovo',lat:42.0775,lon:22.176,img:'village',host:'lence',time:'12:15',mins:75,spend:20,tags:['food'],
    what:'A boat of dough, salted pork and an egg, baked in a wood oven. Lenče makes them to order, which is why she needs a call.',note:'Lenče is firing the oven for 12:15. Two pastrmajlii, one without egg, as you asked.',
    road:{small:'Three minutes on foot from the lower square.',regular:'Three minutes on foot from the lower square.',suv:'Three minutes on foot from the lower square.'},cash:'Cash only. About EUR 10 a person.',fuel:'In town.',signal:'Full signal.',
    backup:'The bakery by the bridge, open until 15:00'}),
  S('key',{name:'Lesnovo and the key in the drawer',where:'Lesnovo',lat:42.014,lon:22.2293,img:'lesnovo',host:'mara',time:'14:30',mins:70,spend:5,tags:['stones'],
    what:'A 14th century monastery in another volcanic crater. The monastery is open. The small church above the village is not, unless Mara walks up with the key.',note:'Mara will be home after lunch. Knock at the blue door, she has the key ready.',
    road:{small:'Asphalt, steep and narrow for the last 3 km. Use first gear on the way down.',regular:'Asphalt, steep in places.',suv:'Asphalt.'},cash:'A few coins for the candle box. Mara refuses money, a thank you works.',fuel:'None. Back in Kratovo or Probištip.',signal:'One bar at the monastery gate.',
    backup:'The monastery church and its frescoes are open without a key',
    story:{t:'The despot who built in a crater',mins:5,text:'Jovan Oliver paid for this church in 1341 and had himself painted on its wall, holding the church in his hands.'}})
 ]}]},

{id:'tikves',type:'pack',title:'Tikveš Wine Villages',sub:'Two days of cellars, a Roman city and an iron gate',img:'tikves',region:'vardar',cap:4,km:140,audio:true,start:'Kavadarci or Negotino',best:'May to October',driven:'24 Apr 2027',drivenBy:'Dukica and Bozhin',
 pitch:'A weekend in the country\'s wine valley, without a single tasting room that has a gift shop. Family cellars, a still older than its owner, and the gorge the Vardar cut on its way to the sea.',
 days:[{t:'Stobi and the first cellar',sleep:'Stay in Kavadarci or Negotino. Rooms from about EUR 35. We send three we have slept in.',stops:[
  S('stobi',{name:'Stobi',where:'Gradsko',lat:41.5517,lon:21.9742,img:'stobi',time:'10:00',mins:80,tags:['stones'],
    what:'An ancient city where the Crna river meets the Vardar. Mosaic floors, a theatre, and peacocks that behave as if they own it.',
    road:{small:'Right off the motorway. Asphalt car park.',regular:'Asphalt car park.',suv:'Asphalt car park.'},cash:'Entry ticket, card accepted.',fuel:'Motorway pumps both directions.',signal:'Full signal.',
    story:{t:'A city at the meeting of two rivers',mins:6,text:'Traders, legions and bishops all passed through here. An earthquake in 518 finished what the centuries had started.'}}),
  S('zoran',{name:'Vranec from the barrel',where:'Vataša',lat:41.417,lon:22.02,img:'wine',host:'zoran',time:'12:30',mins:120,spend:40,tags:['wine','food'],
    what:'Zoran pours five wines in a cellar his grandfather dug. Lunch comes from his mother\'s kitchen whether you ordered it or not.',note:'Zoran is expecting you at 12:30. His mother is making stuffed peppers. Bring the driver something to do, he pours generously.',
    road:{small:'Asphalt to the village. His gate is the one with the barrel.',regular:'Asphalt to the village.',suv:'Asphalt to the village.'},cash:'Cash only. About EUR 20 a person with lunch. Bottles from EUR 5.',fuel:'Pumps in Kavadarci, 4 km.',signal:'Full signal.',extra:'One of you is driving. Zoran packs a bottle for the driver to open later.',
    backup:'A second family cellar in Sopot, 15 minutes away, on our call list',
    story:{t:'The black one',mins:5,text:'Vranec means black stallion. The grape is dark, stubborn and does best in exactly this heat.'}}),
  S('lake',{name:'Sunset at Tikveš Lake',where:'Tikveš Lake',lat:41.37,lon:21.95,img:'lakeside',time:'18:00',mins:60,tags:['water'],
    what:'The road ends at a small pier. Bring the bottle Zoran gave the driver.',
    road:{small:'Asphalt with potholes for the last 6 km. Take it slowly.',regular:'Asphalt with potholes.',suv:'Easy.'},cash:'Nothing to pay.',fuel:'Back in Kavadarci.',signal:'Patchy by the water.'})
 ]},{t:'The iron gate and the still',sleep:null,stops:[
  S('gorge',{name:'Demir Kapija gorge',where:'Demir Kapija',lat:41.404,lon:22.262,img:'demirkapija',time:'09:30',mins:70,tags:['water','heights'],
    what:'Limestone walls where the Vardar squeezes through. The name is Turkish for iron gate. Walk the old road along the river, look up for vultures and climbers.',
    road:{small:'Asphalt. Park by the old tunnel.',regular:'Asphalt.',suv:'Asphalt.'},cash:'Nothing to pay.',fuel:'Pump in town.',signal:'Drops inside the gorge.',
    story:{t:'The gate every army had to use',mins:5,text:'There is one way through these mountains, and it is 20 metres wide. Everyone who ever marched south came through this gap.'}}),
  S('marija',{name:'Tasting under the walnut tree',where:'Demir Kapija',lat:41.412,lon:22.245,img:'tikves',host:'marija',time:'11:15',mins:90,spend:30,tags:['wine'],
    what:'Marija makes small lots from her grandfather\'s vines and explains them without a single word of wine talk.',note:'Marija has the table set in the yard for 11:15. She opened the 2024 stanušina for you to try.',
    road:{small:'Asphalt, then 300 m of gravel lane. Fine for any car.',regular:'Short gravel lane.',suv:'Short gravel lane.'},cash:'Cash or bank transfer. About EUR 15 a person.',fuel:'Pump in town.',signal:'Full signal.',
    backup:'The town winery, open daily, no call needed'}),
  S('kiro',{name:'Rakija at the village still',where:'Dolni Disan',lat:41.45,lon:22.12,img:'village',host:'kiro',time:'13:30',mins:60,spend:10,tags:['wine','hands'],
    what:'A copper still in a shed that the whole village shares. Kiro runs it, tastes it and signs off on it.',note:'Kiro will be at the still from 13:00. He says the plum one is ready and you are to bring an empty bottle.',
    road:{small:'Asphalt to the village. The shed is behind the church.',regular:'Asphalt to the village.',suv:'Asphalt to the village.'},cash:'Cash. A bottle is about EUR 6.',fuel:'Pumps in Negotino, 5 km.',signal:'Full signal.',closed:[1],
    backup:'A bottle left for you at Marija\'s if Kiro is away'})
 ]}]},

{id:'malesevo',type:'pack',title:'Maleševo Highlands',sub:'Honey, sheep cheese and a lake in the pines',img:'berovo',region:'eastern',cap:5,km:120,audio:true,start:'Berovo',best:'May to October',driven:'26 Apr 2027',drivenBy:'Natasha and Tea',
 pitch:'The far east of the country sits at a thousand metres and smells of pine and wood smoke. Two slow days of bees, cheese, potatoes that people cross the country for, and a lake you will mostly have to yourself.',
 days:[{t:'Bees and the lake',sleep:'Stay by the lake or in Berovo. Rooms from about EUR 30. We send three we have slept in.',stops:[
  S('bees',{name:'Honey from the frame',where:'Berovo',lat:41.703,lon:22.857,img:'honey',host:'blagoj',time:'10:30',mins:75,spend:15,tags:['food','hands'],
    what:'Blagoj suits you up, opens a hive and hands you a piece of comb. Then tea, and a table of jars he will pretend not to be selling.',note:'Blagoj says the weather is right for opening the hives at 10:30. Wear long sleeves.',
    road:{small:'Asphalt, then 800 m of firm gravel to the apiary.',regular:'Firm gravel for the last stretch.',suv:'Drive to the hives.'},cash:'Cash. Tasting about EUR 5 a person, jars from EUR 7.',fuel:'Pump in Berovo.',signal:'Good signal.',extra:'Tell us about bee allergies before the trip, not at the gate.',
    backup:'A honey tasting at the town market stall, mornings only'}),
  S('lake',{name:'Berovo Lake loop',where:'Berovo Lake',lat:41.676,lon:22.91,img:'berovo',time:'12:30',mins:120,tags:['water','heights'],
    what:'A reservoir ringed by pine forest at about 1,000 metres. Walk a stretch of the shore path, swim if you are brave, picnic with what Blagoj sold you.',
    road:{small:'Asphalt to the dam.',regular:'Asphalt to the dam.',suv:'Asphalt. Forest tracks beyond the dam are fine for you.'},cash:'Nothing to pay.',fuel:'Back in Berovo, 7 km.',signal:'Good near the dam, none on the far shore.',
    story:{t:'The cold corner of a warm country',mins:4,text:'Maleševo keeps snow longer and summers cooler than anywhere around it. People here will tell you it is the cleanest air in the Balkans.'}})
 ]},{t:'Cheese and the long table',sleep:null,stops:[
  S('cheese',{name:'Slavica\'s cheese and potatoes',where:'Rusinovo',lat:41.685,lon:22.80,img:'sheep',host:'slavica',time:'11:00',mins:150,spend:32,tags:['food','hands'],
    what:'You help press the morning\'s cheese, then eat for two hours. The potatoes are a local point of pride and you will be asked your opinion.',note:'Slavica is expecting you at 11:00. Lunch is potatoes in the clay pot, cheese pie and whatever the garden has.',
    road:{small:'Asphalt to Rusinovo. Her house is past the fountain, gravel yard.',regular:'Asphalt to Rusinovo.',suv:'Asphalt to Rusinovo.'},cash:'Cash only. About EUR 16 a person.',fuel:'Berovo, 6 km.',signal:'Good signal.',closed:[0],
    backup:'Lunch at a family restaurant in Berovo that serves the same cheese',
    story:{t:'A cheese with a reputation',mins:5,text:'Berovo cheese has a reputation older than anyone alive here, and half the families claim the original recipe.'}}),
  S('monastery',{name:'The convent in Berovo',where:'Berovo',lat:41.708,lon:22.862,img:'osogovo',time:'14:30',mins:45,tags:['stones'],
    what:'A small 19th century convent at the edge of town. Quiet courtyard, old wooden porch. A calm way to end the trail.',
    road:{small:'Asphalt, in town.',regular:'In town.',suv:'In town.'},cash:'Nothing to pay.',fuel:'In town.',signal:'Full signal.'})
 ]}]},

{id:'prespa',type:'long',title:'Prespa and the High Plain',sub:'Four days from Kruševo to a snake island',img:'krusevo',region:'pelagonia',cap:3,km:330,audio:false,start:'Prilep or Bitola',best:'May to September',driven:'5 May 2027',drivenBy:'Bozhin and Dukica',
 pitch:'The longest trail we sell. The highest town in the country, a monastery on a granite mountain, mosaics, a potter, a village under Pelister and a boat to an island with more snakes than people have ever counted.',
 days:[{t:'Kruševo and Treskavec',sleep:'Stay in Kruševo. Rooms from about EUR 30.',stops:[
  S('lokum',{name:'Lokum, cut by hand',where:'Kruševo',lat:41.3678,lon:21.2524,img:'krusevo',host:'dimce',time:'10:30',mins:60,spend:10,tags:['food','stones'],
    what:'The highest town in Macedonia, all steep lanes and old houses. Dimče\'s shop is the size of a cupboard and smells of rose and walnut.',note:'Dimče opens at 10:00 and is keeping a box of the rose lokum aside for you.',
    road:{small:'Asphalt. Park below the centre, the lanes are steep.',regular:'Asphalt.',suv:'Asphalt.'},cash:'Cash. A box is about EUR 4.',fuel:'Pump at the town entrance.',signal:'Full signal.',closed:[0],
    backup:'The sweet shop on the main square',
    story:{t:'Ten days of a republic',mins:6,text:'In August 1903 this town declared itself a republic. It lasted ten days, and the country has never stopped talking about it.'}}),
  S('treskavec',{name:'Treskavec monastery',where:'Above Prilep',lat:41.4017,lon:21.5372,img:'treskavec',time:'15:00',mins:90,tags:['stones','heights'],
    what:'A monastery among granite boulders under Zlatovrv peak. The view runs across the whole Pelagonia plain.',
    road:{small:'Do not drive up. Take the 90 minute footpath from Dabnica or share a ride from Prilep.',regular:'A narrow mountain road with hairpins. Dry weather only.',suv:'Fine in any weather short of snow.'},cash:'A few coins for candles.',fuel:'Prilep.',signal:'One bar at the gate.',extra:'Cover shoulders and knees.',minCar:'regular'})
 ]},{t:'Heraclea and Brajčino',sleep:'Stay with Nada in Brajčino. About EUR 25 a person with breakfast.',stops:[
  S('heraclea',{name:'Heraclea Lyncestis',where:'Bitola',lat:41.011,lon:21.3425,img:'heraclea',time:'10:00',mins:70,tags:['stones'],
    what:'A city founded by Philip II of Macedon. The floor mosaics are among the best preserved in the Balkans.',
    road:{small:'Asphalt, edge of Bitola.',regular:'Asphalt.',suv:'Asphalt.'},cash:'Entry ticket, cash is safer.',fuel:'Bitola.',signal:'Full signal.'}),
  S('nada',{name:'Lunch and a bed in Brajčino',where:'Brajčino',lat:40.9074,lon:21.16,img:'brajcino',host:'nada',time:'13:30',mins:120,spend:30,tags:['food','heights'],
    what:'A stone village under Pelister with a marked walk between six small churches. Nada feeds you first and points you at the path second.',note:'Nada has your room ready and beans in the clay pot for 13:30. She says the cherries are in.',
    road:{small:'Asphalt to the village square.',regular:'Asphalt.',suv:'Asphalt.'},cash:'Cash only. Lunch about EUR 12 a person.',fuel:'Last pump is in Resen or Bitola.',signal:'Weak. Viber works at the square.',
    backup:'A second guesthouse in the village, on our call list'})
 ]},{t:'Clay and the island',sleep:'Stay in Brajčino again, or by the lake in Stenje.',stops:[
  S('pottery',{name:'A turn at the kick wheel',where:'Resen',lat:41.0896,lon:21.0122,img:'pottery',host:'petar',time:'10:00',mins:90,spend:20,tags:['hands'],
    what:'Petar throws on a wheel he drives with his foot. You get clay, an apron and no judgement.',note:'Petar has the studio warm and clay ready for 10:00. Wear something you do not love.',
    road:{small:'Asphalt, in town.',regular:'In town.',suv:'In town.'},cash:'Cash or card. About EUR 10 a person.',fuel:'Resen.',signal:'Full signal.',closed:[0,1],
    backup:'The ceramics colony gallery, open without a call'}),
  S('island',{name:'Boat to Golem Grad',where:'Konjsko, Lake Prespa',lat:40.905,lon:20.985,img:'golemgrad',host:'ljupco',time:'14:00',mins:180,spend:40,tags:['water','stones'],
    what:'An uninhabited island of juniper trees, ruined churches, pelicans and a great many water snakes. Ljupčo takes you over and waits.',note:'Ljupčo says the lake is calm tomorrow. Be at the Konjsko pier at 14:00, he has life vests for four.',
    road:{small:'Asphalt to Stenje, then 6 km of rough track. Leave the car in Stenje, Ljupčo collects you by boat.',regular:'Rough track after Stenje. Slow, possible when dry.',suv:'Drive to the Konjsko pier.'},cash:'Cash only. About EUR 40 for the boat, up to four people.',fuel:'Resen. Nothing by the lake.',signal:'None on the island.',extra:'Closed shoes. The snakes are harmless and everywhere.',
    backup:'If the wind is up nobody sails. You get the shore walk at Stenje and this stop comes off your price'})
 ]},{t:'The movie bridge',sleep:null,stops:[
  S('zovik',{name:'Zovik and the stone bridge',where:'Mariovo',lat:41.1163,lon:21.712,img:'mariovo',time:'11:00',mins:120,tags:['stones','heights','water'],
    what:'A stone bridge over the Gradeška river in the emptiest region of the country. It played a part in the film Dust, and has been called the movie bridge since.',
    road:{small:'Not for a small rental. Stop at the last asphalt village and walk, or swap this day for our Bitola old town walk.',regular:'Asphalt, then a long broken stretch. Dry weather and patience.',suv:'Comfortable. Allow 90 minutes from Bitola.'},cash:'Nothing to pay. Nothing to buy either, bring lunch.',fuel:'Fill up in Bitola. There is nothing in Mariovo.',signal:'None for most of the drive. Everything is saved offline.',minCar:'regular',
    story:{t:'Where the villages emptied',mins:6,text:'Mariovo once had thousands of people. Today you can drive for an hour and meet three, and all three will wave.'}})
 ]}]}
];

/* trails being driven: visible, not for sale */
D.SOON=[
 {title:'Vevčani and the Quiet Side of the Lake',sub:'Springs, a carnival village and a cave church',img:'vevcani',type:'pack',when:'We drive it in June 2027'},
 {title:'Dawn with the Dojran Fishermen',sub:'Reed huts, a slow lake and breakfast on the shore',img:'fishing',type:'quest',when:'We drive it in June 2027'}
];

D.FAQS=[
 ['Trails',[
  ['What exactly is a Trail?','A self-guided route of one to five days through rural Macedonia, with three to eight stops a day. You drive your own or a rented car. We have driven every kilometre first, and we call every host on the route before you set off.'],
  ['Why is the price per car and not per person?','Because the car is the thing that travels. One pass covers everyone in it, whether that is two of you or five.'],
  ['Do I pay the hosts through you?','No. You pay each host directly, in cash, on the spot. We take no commission from them. Each stop tells you roughly how much to bring.'],
  ['Do I need an app?','No. A Trail opens in your phone\'s browser and saves itself for offline use, map and stories included. The app does the same and adds notifications when your hosts answer.'],
  ['Do I need an account?','You make a profile the first time you buy: a name and an email or mobile number. There is no password. We send a six-digit code when you sign in on a new phone. The profile keeps your passes, receipts and stamps.'],
  ['How do I pay?','By card, Apple Pay or Google Pay, once, when you take the pass. The card is typed on the payment provider\'s secure form and we never see the number. Hosts are paid by you, in cash, on the day.'],
  ['Can I change my date?','Yes, free, until 18:00 the evening before. After that the calls have been made and hosts are expecting you.']
 ]],
 ['The guarantee',[
  ['What does "Works or it\'s free" mean?','If a stop we marked as confirmed is closed when you arrive, your pass is refunded in full. Tap "This stop is closed" on the road view. There are no forms.'],
  ['What if a host cancels the evening before?','Then you hear it from us that evening, with the reason, and the backup stop is already confirmed in its place. That is the system working, so no refund is due.'],
  ['What about weather?','Stops that depend on weather, like the boat to Golem Grad, say so. If it is called off, that stop comes off your price.']
 ]],
 ['On the road',[
  ['What if I have no signal?','Then you are in the right place. Route, notes and stories are saved to your phone before you leave. Stories start by GPS, which works without a network.'],
  ['My rental is small. Will I get stuck?','Tell us your car when you buy. Every stop has road notes for a small rental, a regular car and a high car. If a stop needs more car than you have, we say so before you pay.'],
  ['Do hosts speak English?','Some do. All of them know you are coming, what time, and how many you are, because we told them in Macedonian.']
 ]],
 ['Prices',[
  ['What does a pass cost?','EUR 12 for a one-day Quick Quest, EUR 19 for a weekend Pack & Go, EUR 29 for a longer trail or one composed for you. Roots Trails are quoted individually.'],
  ['Is there a local price?','Yes. Passes bought in denars from inside Macedonia are about 40% lower.'],
  ['Is there a subscription?','No. You buy one trail for one trip.']
 ]]
];
})();
