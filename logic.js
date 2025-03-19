if (!sessionStorage.getItem('pageLoaded')) {
    sessionStorage.setItem('pageLoaded', true);
    location.reload();
}

// Fetch CSV file containing channels and create provider and channel lists
//#region
let myvar=""
$.ajax({
  contentType: "application/x-www-form-urlencoded;charset=utf-8",
  async:false,
  url: "https://raw.githubusercontent.com/CWJNor/kanalcsv/main/kanal_oversigt.csv",
  success: function(csv) {
      const output = Papa.parse(csv, {
        header: true, // Convert rows to Objects using headers as properties
      });
      if (output.data) {
        myvar=output.data;
      } else {
        console.log(output.errors);
      }
  },
  error: function(jqXHR, textStatus, errorThrow){
      console.log(textStatus);
  }

});
let kanalliste=[];
let udbyderdict={}

//Hvis tom så ignorer
for(v of myvar.slice(0,-1)){
let overskrift=Object.keys(v);
let kanalnavn=v["Kanal"];
overskrift.shift();
kanalliste.push(kanalnavn);

for (ov of overskrift){
  if (!udbyderdict[ov]) {
    udbyderdict[ov] = {};
  }
if (v[ov].length==0){
    v[ov]="Løsning ikke mulig";
}
  udbyderdict[ov][kanalnavn]=v[ov];
}
}

kanalliste.sort();

for(key of Object.keys(udbyderdict)){
const sortedObject = Object.fromEntries(
    Object.entries(udbyderdict[key]).sort((a, b) => a[0].localeCompare(b[0]))
  );
  udbyderdict[key] = sortedObject;
}
//#endregion

//Hente csv fil med genre
//#region
let genre=""
$.ajax({
  contentType: "application/x-www-form-urlencoded;charset=utf-8",
  async:false,
  url: "https://raw.githubusercontent.com/CWJNor/kanalcsv/main/kategorier.csv",
  success: function(csv) {
      const output = Papa.parse(csv, {
        header: true, // Convert rows to Objects using headers as properties
      });
      if (output.data) {
        genre=output.data;
      } else {
        console.log(output.errors);
      }
  },
  error: function(jqXHR, textStatus, errorThrow){
      console.log(textStatus);
  }

});
let kanallistegenre=[];
let genreliste=[];
let genredict={}


// Process CSV data to populate lists
for(v of genre){
    let kanalnavn=v["provider_name"];
    kanallistegenre.push(kanalnavn);
    genreliste.push(v["genre_name"])
    if (!genredict[kanalnavn]) {
        genredict[kanalnavn] = [];
    }
    genredict[kanalnavn].push(v["genre_name"]);

}
kanallistegenre.sort();
genreliste.sort();
genreliste.splice(0,1);

//#endregion

let beskrivelser=[{"TV2":"Danmarks mest sete tv-kanal, som samler danskerne om alt det vi deler gennem et mangfoldigt programudbud, der omfatter nyheder, aktualitet, dansk fiktion, underholdning, sport, dokumentar og livsstil, spillefilm, morgen-tv og meget mere.",
"TV2 Charlie":"Kanalen henvender sig til voksne og nysgerrige danskere med lyst til at blive underholdtog  prioriterer den gode danske underholdning og musik, dansk fiktion, talkshows, danske filmklassikere, events og de bedste europæiske serier, herunder både dramaer og prisbelønnede krimiserier.",
"TV2 Fri":"En unik fritids- og friluftskanal for dig, der vil inspireres. Oplev programmer om hus, have, madlavning og gør-det-selv arbejde.",
"TV2 News":"Danmarks største nyhedskanal for dig, der vil have breaking news og følge med i begivenhederne, mens de sker.",
"TV2 Sport":"Her får du mere end sublime sportsoplevelser. Du får også knivskarpe analyser og journalistiske sportsmagasiner.",
"TV2 SportX":"TV 2 SPORT X har fokus på store internationale stjerner indenfor verdens bedste fodboldliga, tennis, basketball, X-Games, atletik og meget mere.",
"TV2 Echo":"TV 2 Echo giver et ungt, nysgerrigt og undersøgende perspektiv på alt hvad livet indebærer. Her finder du reality, dokumentarer, nyskabende fiktion, comedy samt store events. Kanalen fokuserer desuden meget på E-sport, hvor vi tilbyder en dedikeret dansk dækning, blandt andet med 700 timers Counter-Strike årligt.",
"TV3":"TV3 er din kanal for sport, reality og underholdning. Det er her du finder programmer som 'Paradise Hotel', 'Divaer i Junglen' og meget mere.",
"TV3 Max":"TV3 Max har en stærk sammensætning af verdensklasse sport og comedy. Her kan du se Premier League, Champions League, Superligaen og The Simpsons.",
"TV3+":"TV3+ viser sport, spænding og spas. Følg kampene i Champions League, Premier League og Superligaen, se masser af Formel 1 og bliv underholdt af en lang række komedieserier.",
"TV3 Puls":"TV3 Puls er kanalen, der fornemmer tendenserne inden for blandt andet mad, mode, indretning og design, og formidler dem gennem fascinerende og inspirerende livsstilsprogrammer i et univers, der aldrig får for travlt til nærvær og indlevelse.",
"TV3 Sport":"TV3 Sport er den ultimative kanal for enhver sportselsker. Her kan du bl.a. følge med i Champions League, Superligaen, Formel 1, NFL, NHL og en række golfturneringer.",
"Kanal 4":"Kanal 4 er for dig, der elsker reality og big characters med en humoristisk, uhøjtidelig, modig og ærlig tilgang til verden. Fascination, drømme og ekstravagance er i højsædet, når du får indblik i nogle af Danmarks største personligheders liv, når de lukker op og giver et eksklusivt indblik i det liv, mange af os kun tør drømme om.",
"Kanal 5":"Kanal 5 samler familien og giver dig et underholdende pusterum, når vi blænder op for tempofyldte underholdningsprogrammer, fængslende krimiserier og stærke faktaprogrammer fra virkelighedens verden og nye, spændende fiktionsserier. Med andre ord - underholdning for hele familien.",
"6'eren": "6’eren er for dig, der elsker både sport, actionfilm og serier. Der er fart over feltet, både når 3F Superligaens tophold spiller og speedway-stjernerne gasser op. Oplev verdensklasse fodbold fra FA Cup og Carabao Cup sammen med et eksperthold bestående af blandt andet Brian Laudrup og Thomas Gravesen.",
"Canal 9":"Canal 9 giver dig spændende fodbold og programmer, der undersøger verden omkring os, uanset om det er mad eller leveforhold. Du får herrefight fra 3F Superligaen og FA Cuppen, og programmer om f.eks. hårdføre typer fra Alaska.",
"Discovery Channel":"En kanal for den kvalitetsbevidste seer, der er til prisvindende dokumentarer, fascinerende serier og intelligent underholdning.",
"DK4":"På dk4 er der nemlig masser af lyttevenlig musik, god gedigen underholdning i musikkens tegn, sidste nyt om den danske teaterscene, aktuelle samtaleprogrammer om litteratur og kunst og indsigtsfulde programmer om alt det, vi elsker at lave i fritiden – lige fra camping og sejlsportsliv til skiløb, lystfiskeri og jagt. dk4 er dansk tv døgnet rundt.",
"National Geographic":"Klog, faktuel underholdning til dig, der vil vide mere om teknologi, naturhistorie, arkæologi og naturens mysterier.",
"3Sat":"Videnskab, litteratur, dokumentar og musik. Teater, kunst og litteratur. 3SAT har forventninger til seernes intelligens – og du får smæk for skillingen.",
"Al-Jazeera":"Aljazeera International sender arabiske nyheder på engelsk til hele verden.",
"Animal Planet":"En dyrekanal for dig, der vil helt tæt på verdens dyreliv og menneskets liv med dyr.",
"ARD":"Hver dag finder du nyproducerede film, serier og dokumentarer på Tysklands største tv-kanal, og mange af dem sendes med danske undertekster, når du ser med fra Danmark.",
"ARTE":"Kultur-kanal med film, temaaftener, dokumentarfilm, debat og reportager.",
"BBC News":"BBC News er en britisk 24-timers nyhedskanal. Nyhedsudsendelserne på kanalen bliver kombineret med dybdeborende reportager, interviews, magasinprogrammer samt økonomiprogrammer.",
"BBC Nordic":"BBC Nordic er det bedste fra BBC Brit og BBC Earth samlet ét sted! På BBC Nordic vil du blandt andet kunne se dine BBC-favoritter som Top Gear og The Graham Norton Show, samt helt nye sæsoner af Serengeti og Live at the Apollo.",
"Blue Hustler":"Blue Hustler er en amerikansk erotisk kanal.",
"Cartoonito":"Catoonito er en børnekanal for de mindste, men mange programmer appellerer også til resten af familien. Her finder du klassiske tegnefilm som Tom & Jerry, og nyere tegnefilm som Mr Bean. Alt tale er naturligvis på dansk. På Catoonito finder du et bredt udvalg af tegnefilm, der kan samle familien på kryds og tværs. Her er både underholdning til fredag aften og søndag morgen.",
"Cartoon Network":"Cartoon Network er en kanal for børn i alle aldre og er fyldt med sjov, eventyr og underholdning. Her får du en blanding af moderne klassikere og helt nye tegnefilm. Alt tale er naturligvis på dansk.",
"CBS Reality":"Kanalen der bringer dig tæt på hverdagsdramaer. Her får du spænding og action fra virkelighedens verden.",
"CNN":"Er du nyhedsjunkie, får du din trang stillet på CNN – en amerikansk nyhedskanal, der giver dig seneste nyt døgnet rundt.",
"Disney Channel":"En familiekanal der giver adgang til alt det bedste fra Disneys magiske verden – med dansk tale eller danske undertekster.",
"Disney Junior":"En kanal i øjenhøjde med de to-seks årige, der blander kendte figurer, musik og magiske fortællinger med læring.",
"Euronews":"Euronews er nyheder fra hele verden, præsenteret i et pan-europæisk perspektiv og på flere europæiske sprog.",
"Eurosport 1":"Uanset om du er til cykling, tennis, motorsport, de største World Cups fra vinterlandskabet, snooker eller atletik – er Eurosport 1 kanalen for dig.",
"Eurosport 2":"Kanalen for dig, der ikke kan få nok af sport. Eurosport 2 byder på vintersport, cykling, tennis og fede fodboldoplevelser.",
"ID-Investigation Discovery":"ID - Investigation Discovery er Danmarks eneste kanal kun med krimi. Her kan du se stærke dokumentarer med rekonstruktioner af virkelighedens mest rå og bestialske forbrydelser. Du kan se drabssager, familiefejder og efterforskning af nogle af de største og vildeste sager, ligesom du kan møde ofre og pårørende i stærke programmer.",
"Mezzo":"Mezzo er en fransk tv-kanal, der er afsat til klassisk musik, jazz og verdensmusik.",
"MTV":"MTV - verdens største musik- og ungdomskanal. En global tv-kanal med lokalt fokus, som giver den bedste blanding af musik og nytænkende underholdning.",
"MTV 80s":"Musikkanalen for de modne seere. Her får du Golden Oldie's på stribe både som musikvideoer og live-optræden fra de bedste koncerter verden over.",
"MTV 90s":"MTV 90s er dedikeret til rock og alternativ musik.",
"MTV Hits":"MTV Hits er et stærkt supplement til MTV. MTV Hits sender alt det bedste og nyeste fra hitlisterne.",
"National Geographic Wild":"Kom helt tæt på naturen og oplev de mest nærgående optagelser med vilde dyr – det hele i en knivskarp billedkvalitet.",
"NDR": "NDR er en tysk kanal med fokus på Nordtyskland",
"Nick jr.":"Nick Jr. er en tv-kanal for de mindste børn mellem to og seks år. Kanalen viser sjove og lærerige tegnefilm, der er tilpasset de yngste og opfordrer til leg og læring.",
"Nickelodeon":"Nickelodeon viser et bredt udbud af tegneserier og serier for børn.",
"NRK1":"NRK1 er en norsk kanal, der rummer lige dele provokerende serier og afmålte dokumentarprogrammer. Mange af dem sendes med danske undertekster, når du ser med fra Danmark. Og se med bør du gøre, hvis du vil være først til helt nye formater.",
"ZDF":"Tysklands public service-kanal ZDF sender hver dag film og serier, kærlighedsdramaer og dokumentariske analyser af krigen og historien – og en stor del af dem med danske undertekster. Nogle af dem har du sikkert hørt om, men dykker du ned i ZDF's program, er der altid nyt og spændende at se.",
"SVT1":"På SVT1 finder du tv med stærke fortællinger om både Sverige, Norden og om verden, og mange af udsendelserne sendes med danske undertekster, når du ser med fra Danmark. SVT1 er for dig, der vil have mere af det, du kender og elsker, men som også gerne vil udfordres.",
"Folketinget":"Folketinget har sin egen tv-kanal, som viser live-tv fra møderne i Folketinget. Folketingets tv sikrer, at du som borger har let adgang til at følge de politiske processer og kan få indblik i, hvad der sker i henholdsvis Folketingssalen og de åbne møder.",
"NRK2":"Norsk kanal fra NRK",
"TV4 Sverige":"TV4 Sverige er den største kommercielle tv-kanal i Sverige",
"SVT2":"SVT2 er Sveriges kanal dedikeret til kultur, viden og nicheprogrammer, og på kanalen finder du derfor et væld af udsendelser, som er både underholdende og en lille smule mere end det. SVT2 sender et udvalg af deres programmer med danske undertekster, når du ser med fra Danmark.",
"TV2 Norge": "TV2 Norge er Norges største kommercielle tv-kanal",
"ProSieben":"Pro 7 satser på underholdning med internationale topserier, film, shows, hurtige nyheder og diverse magasiner.",
"Rai 1":"Rai Uno sender underholdning, nyheder, sport og film 24 timer i døgnet.",
"See":"See byder på originalt dansk indhold, populære serier og masser af sport.",
"TLC":"På TLC er der både tid til refleksion, gråd og grin. Her finder du inspirerende og autentiske programmer med humor og kant.",
"Nick Music":"Nick Music erstatter VH1",
"V sport golf":"V Sport Golf sender masser af live-golf året rundt med danske kommentatorer.",
"Viasat Explore":"Viasat Explore udfordrer din eventyrlyst. Kanalen er garant for eventyr og ekstreme oplevelser. Viasat Explore sender en god blanding af dybdeborende dokumentarserier og udfordrende ekspeditioner.",
"Viasat History":"Hvis du er vild med historiens vingesus og dokumentarer om fordums tid, kan du booste din viden med Viasat History.",
"Viasat Nature":"Viasat Nature viser spændende og lærerige dokumentarer samt natur- og dyreudsendelser. Bliv klog på dyrenes adfærd og naturens mange hemmeligheder med Viasat Nature.",
"Discovery Science":"Kanalen for den nysgerrige seer, der søger svar på universelle spørgsmål i prisvindende dokumentarer og serier om videnskab og teknologi.",
"ESC/ESC1":"Generel underholdningskanal fra Egypten, der indeholder et væld af tv-underholdning.",
"Extreme Sport":"Her er tempoet højt. Kanalen der giver dig det mest nervepirrende og inspirerende inden for livsstil, eventyr og ekstremsport.",
"HRT-TV1":"En kroatisk kanal der sender underholdning, dokumentarer, undervisningsprogrammer, komedieserier, filmer og talkshow.",
"MTV Club":"MTV Club er en musikkanal, der helt og holdent er tilegnet dansemusik. Du får drum’n’bass, trance, garage, house og fest i en fantastisk dansepakke.",
"MTV Live":"MTV Live er en musikbaseret underholdningskanal, som tager udgangspunkt i legendariske, klassiske og splinternye MTV og Vh1 programmer.",
"Polonia":"Følg med i nyheder og tv-programmer direkte fra Polen.",
"Sport Live":"SPORT LIVE er en dansk sportskanal, som sender live mindst 10 timer om dagen. Kanalen sender hestevæddeløb fra hele verden og har et dagligt studieprogram med eksperter. Derudover sender SPORT LIVE fra en række danske sportsbegivenheder.",
"TVE":"Televisión Española Internacional er en spansk tv-kanal, der tilbyder programmer fra det spanske tv-netværk RTVE (Radiotelevisión Española) til spansktalende seere rundt omkring i verden. Kanalen sender et bredt udvalg af indhold, herunder nyheder, underholdning, sportsbegivenheder, dokumentarer, serier og kulturprogrammer.",
"TV5 Monde":"TV5 Monde Europe er en international fransksproget tv-kanal, der tilbyder nyheder, kulturprogrammer, underholdning, sprogundervisning og sportsbegivenheder fra Frankrig og resten af verden. Kanalen er dedikeret til at fremme fransk sprog og kultur på globalt plan."
                  }]          
beskrivelser.sort();

let left = document.querySelector(".left");
let middleleft=document.querySelector(".middleleft");
let middleright=document.querySelector(".middleright");
let right = document.querySelector(".right");

  
  let names=kanalliste;

//TV2 Dropdown
//#region
let TV2list=["Vælg alle","TV2","TV2 Charlie","TV2 News","TV2 Echo","TV2 Fri","TV2 Sport", "TV2 SportX"]
let TV2drop=document.querySelector("#tv2dropchild");
let clicked2=false;

for (let tv2 of TV2list){
    let node=document.createElement("a");
    let text=document.createTextNode(tv2);
    node.appendChild(text);
    node.classList.add("dropdown-item");
    if(tv2!=="Vælg alle"){
        node.addEventListener("click",function(){
            let kan=document.getElementsByName("Kanal");
                for (let k of kan){
                    if (k.value==tv2){
                        k.checked = !k.checked;
                        triggerEvent(k, 'change');
                    }
                    }
            if(Array.from(TV2drop.childNodes).slice(2).every(item => item.classList.contains("is-active"))){
                TV2drop.childNodes[1].click();
            }
            if(!Array.from(TV2drop.childNodes).slice(2).every(item => item.classList.contains("is-active"))){
                TV2drop.childNodes[1].classList.remove("is-active");
            }
                })
    }
    else{
        node.addEventListener("click",function(){
            node.classList.toggle("is-active");
            let kan=document.getElementsByName("Kanal");
            for (let k of kan){
                if (k.value.includes("TV2")){
                    if(k.value.includes("TV2 PLAY")||k.value.includes("TV2 Norge")){
        
                    }
                    else{
                    if(node.classList.contains("is-active")){
                        k.checked=true;
                        triggerEvent(k, 'change');
                    }
                    else{
                            k.checked=false;
                        }
                       
                    }
                }
                }
            })}
    if(tv2=="Vælg alle"){
        TV2drop.appendChild(node);
        let breakline=document.createElement("hr");
        //Horisontal line after "Vælg Alle" 
        breakline.classList.add("dropdown-divider");
        TV2drop.appendChild(breakline)
        }
    else{
        TV2drop.appendChild(node);
    }
}

TV2drop.childNodes[1].addEventListener("click",function(){
    TV2array=Array.from(TV2drop.getElementsByTagName("a"))
    TV2array.forEach((c)=>{
        if (Array.from(TV2drop.childNodes[1].classList).indexOf("is-active")!==-1){
            c.classList.add("is-active");
        }
        else{
            c.classList.remove("is-active");
        }
        }
       
    )})
//#endregion

//Kategori dropdown
//#region
let kategorilist=Array.from(new Set(genreliste));
let katdrop=document.querySelector("#kategoridropchild");

Fjernkategori=["Musik","Film","Serier"]
for(let k of Fjernkategori){
    fjernidx=kategorilist.indexOf(k)
    kategorilist.splice(fjernidx,1)
}


//Hent kanaler
for (let kat of kategorilist){
    let node=document.createElement("a");
    let text=document.createTextNode(kat);
    node.appendChild(text);
    node.classList.add("dropdown-item");
    node.addEventListener("click",function(){
        if (Array.from(node.classList).indexOf("is-active")==-1){
            node.classList.add("is-active");
        }
        else{
            node.classList.remove("is-active");
        }
        let kan=document.getElementsByName("Kanal");
            for (let k of kan){
                for (let kanal of Array.from(new Set(kanallistegenre))){
                    if (k.value==kanal){
                        if(genredict[kanal].includes(kat)){
                            if(Array.from(node.classList).indexOf("is-active")==-1){
                                if(genredict[kanal].length>1){
                                    let once=false;
                                    for (let kat of Array.from(katdrop.childNodes).slice(1)){
                                        if(Array.from(kat.classList).includes("is-active") && genredict[k.value].includes(kat.innerHTML.replace("&amp;","&"))){
                                            k.checked=true;
                                            once=true;
                                        }
                                        else{
                                            if(once==false){
                                                k.checked=false;
                                            }
                                           
                                        }
                                }
                                }
                                else{
                                    k.checked=false;
                                
                            }
                        }
                            else{
                                k.checked=true;
                            }
                            triggerEvent(k, 'change');
                        }}
                        }}
                })
    
    katdrop.appendChild(node);
    }
//#endregion

//Viaplay Group dropdown
//#region
let vialist=["Vælg alle","TV3","TV3+","TV3 Puls","TV3 Sport","TV3 Max","See"]
let viadrop=document.querySelector("#viadropchild");

for (let via of vialist){
    let node=document.createElement("a");
    let text=document.createTextNode(via);
    node.appendChild(text);
    node.classList.add("dropdown-item");
    if(via!=="Vælg alle"){
        node.addEventListener("click",function(){
            let kan=document.getElementsByName("Kanal");
                for (let k of kan){
                    if (k.value==via){
                        k.checked = !k.checked;
                        triggerEvent(k, 'change');
                    }
                    }
            if(Array.from(viadrop.childNodes).slice(2).every(item => item.classList.contains("is-active"))){
                viadrop.childNodes[1].click();
            }
            if(!Array.from(viadrop.childNodes).slice(2).every(item => item.classList.contains("is-active"))){
                viadrop.childNodes[1].classList.remove("is-active");
            }
                })
    }
    else{
        node.addEventListener("click",function(){
            node.classList.toggle("is-active");
            let kan=document.getElementsByName("Kanal");
            for (let k of kan){
                if (vialist.includes(k.value)){
                    if(node.classList.contains("is-active")){
                        k.checked=true;
                        triggerEvent(k, 'change');
                    }
                    else{
                            k.checked=false;
                        }
                       
                    }
                    //Hvis "is-active"=>k.checked true , ellers k.checked false
                }
            })}
    if(via=="Vælg alle"){
        viadrop.appendChild(node);
        let breakline=document.createElement("hr");
        //Horisontal linje efter Vælg alle
        breakline.classList.add("dropdown-divider");
        viadrop.appendChild(breakline)
        }
    else{
        viadrop.appendChild(node);
    }
}

viadrop.childNodes[1].addEventListener("click",function(){
    viaarray=Array.from(viadrop.getElementsByTagName("a"))
    viaarray.forEach((c)=>{
        if (Array.from(viadrop.childNodes[1].classList).indexOf("is-active")!==-1){
            c.classList.add("is-active");
        }
        else{
            c.classList.remove("is-active");
        }
        }
       
    )})
//#endregion

//Discovery dropdown
//#region
let dislist=["Vælg alle","6'eren","Animal Planet","Canal 9","Discovery Channel","Discovery Science","Eurosport 1","Eurosport 2","ID-Investigation Discovery","Kanal 4","Kanal 5","TLC"];
let disdrop=document.querySelector("#disdropchild");

for (let dis of dislist){
    let node=document.createElement("a");
    let text=document.createTextNode(dis);
    node.appendChild(text);
    node.classList.add("dropdown-item");
    if(dis!=="Vælg alle"){
        node.addEventListener("click",function(){
            let kan=document.getElementsByName("Kanal");
                for (let k of kan){
                    if (k.value==dis){
                        k.checked = !k.checked;
                        triggerEvent(k, 'change');
                    }
                    }
            if(Array.from(disdrop.childNodes).slice(2).every(item => item.classList.contains("is-active"))){
                disdrop.childNodes[1].click();
            }
            if(!Array.from(disdrop.childNodes).slice(2).every(item => item.classList.contains("is-active"))){
                disdrop.childNodes[1].classList.remove("is-active");
            }
                })
    }
    else{
        node.addEventListener("click",function(){
            node.classList.toggle("is-active");
            let kan=document.getElementsByName("Kanal");
            for (let k of kan){
                if (dislist.includes(k.value)){
                    if(node.classList.contains("is-active")){
                        k.checked=true;
                        triggerEvent(k, 'change');
                    }
                    else{
                            k.checked=false;
                        }
                       
                    }
                    //Hvis "is-active"=>k.checked true , ellers k.checked false
                }
            })}
    if(dis=="Vælg alle"){
        disdrop.appendChild(node);
        let breakline=document.createElement("hr");
        //Horisontal linje efter Vælg alle
        breakline.classList.add("dropdown-divider");
        disdrop.appendChild(breakline);
        }
    else{
        disdrop.appendChild(node);
    }
    
}

disdrop.childNodes[1].addEventListener("click",function(){
    disarray=Array.from(disdrop.getElementsByTagName("a"))
    disarray.forEach((c)=>{
        if (Array.from(disdrop.childNodes[1].classList).indexOf("is-active")!==-1){
            c.classList.add("is-active");
        }
        else{
            c.classList.remove("is-active");
        }
        }
       
    )})
   
//#endregion

//Ryd knap
//#region
let ryd = document.querySelector("#ryd");
ryd.addEventListener("click",function(){
    let kan=document.getElementsByName("Kanal");
        for (let k of kan){
                k.checked=false;
                triggerEvent(k, 'change');
                TV2drop.childNodes[1].classList.remove("is-active");
                viadrop.childNodes[1].classList.remove("is-active");
                disdrop.childNodes[1].classList.remove("is-active");
                for(let f of Array.from(katdrop.childNodes).slice(1)){
                    f.classList.remove("is-active");
                }
                
            }
})
//#endregion

//Feedback buttom
//#region
let newwindow = null;

function openWindow(mailtoLink) {
  newwindow = window.open(mailtoLink, 'emailWindow');
  return newwindow;
}

function closeNewWindow() {
  if (newwindow && !newwindow.closed) {
    newwindow.close();
    window.focus();
  }
}
let feedbackknap = document.querySelector("#feedback");

feedbackknap.addEventListener("click", function () {
  Swal.fire({
    title: 'Feedback',
    html: `<input type="text" id="feedbacknavn" class="swal2-input" placeholder="Navn">
           <textarea type="text" id="feedbackbesked" class="swal2-input" placeholder="Feedback"></textarea>`,
    customClass: "swall_feed",
    confirmButtonText: 'Send feedback',
    focusConfirm: false,
    preConfirm: () => {
      const feedbacknavn = Swal.getPopup().querySelector('#feedbacknavn').value;
      const feedbackbesked = Swal.getPopup().querySelector('#feedbackbesked').value;
     

      if (!feedbackbesked || !feedbacknavn) {
        Swal.showValidationMessage(`Udfyld venligst alle felter`);
        return false;
      }

      let recipient = 'torsch@norlys.dk; clajes@norlys.dk';
      let body = feedbackbesked;
      let subject="Feedback fra Prisberegneren: "+feedbacknavn;

      let mailtoLink = 'mailto:' + recipient + '?subject=' + encodeURIComponent(subject) + '&body=Feedback til prisberegneren:%0A%0A' + encodeURIComponent(body);
      newwindow = openWindow(mailtoLink);

      return { feedbacknavn: feedbacknavn, feedbackbesked: feedbackbesked}
    }
  }).then((result) => {
    if (result.isConfirmed) {
      Swal.fire({title:"Nyt mailvindue åbner. <br> Tak for din feedback!"})
    }
  });

  window.addEventListener('visibilitychange', () => {
    console.log(document.visibilityState);
    if (document.visibilityState === 'visible') {
        closeNewWindow();
    }
  });
});
//#endregion

//Button to show channels always included

//#region
let Kampagneknap=document.querySelector("#btn2");
Kampagneknap.addEventListener("click",function(){
    Swal.fire({
        customClass:"kampagne",
        title: 'Kanaler som altid er inkluderet',
        html: '<div id="kbillede"> <img alt="Kanaler som altid er inkluderet" src="Altidmed.png" style="Width:80%"></div>',
        position:"top",
        confirmButtonText: 'OK'
      });
})

function triggerEvent (element, eventName) {
    var event = new Event(eventName);
    element.dispatchEvent(event);
  }

//#endregion

//Tilføj kanaler
//#region

new_names=[]
remove_channels=["ARD","Blue Hustler","Disney Junior","NDR","NRK1","NRK2","SVT1","SVT2","TV2 Norge","TV4 Sverige", "ZDF"]  //Hvorfor er Disney Junior her?
for (let i=0;i<names.length;i++) {
    if(!remove_channels.includes(names[i])){
        new_names.push(names[i])
    }
}

names=new_names

for (let i=0;i<names.length;i++) {
    let side=left;
    if (i>=names.length/4){
        if(i>3*(names.length/4)){
            side=right;
        }
        else{
            if(i>2*(names.length/4)){
                side=middleright;
            }
            else{
            side=middleleft;
            }
        }
    }
    let infohover=document.createElement("div");
    infohover.classList.add("hoverable");
    infohover.innerText="i";
    let hiddeninfo=document.createElement("div");
    hiddeninfo.classList.add("hidden");
    if(names[i] in beskrivelser[0]){
        hiddeninfo.innerHTML="<span class='bigtext'>"+names[i]+"</span>"+":<br>"+beskrivelser[0][names[i]];
    }
    else{
        hiddeninfo.innerHTML="<span class='bigtext'>"+names[i]+"</span>"+":<br> Info her";
    }
    let mycheck = document.createElement("input");
    mycheck.setAttribute("type","checkbox");
    mycheck.setAttribute("name","Kanal");
    mycheck.setAttribute("value",names[i]);
    mycheck.setAttribute("id","checkbox");
    mycheck.addEventListener("change",function(){
        if(this.checked){
            //Hvis TV2 kanal
            if (TV2list.indexOf(names[i])!==-1){
                TV2drop.childNodes.forEach(function(child){
                    if (child.text==String(names[i])){
                        child.classList.add("is-active")
                    }
                })
            }
            //Viaplay
            if (vialist.indexOf(names[i])!==-1){
                viadrop.childNodes.forEach(function(child){
                    if (child.text==String(names[i])){
                        child.classList.add("is-active")
                    }
                })
            }
            //Discovery
            if (dislist.indexOf(names[i])!==-1){
                disdrop.childNodes.forEach(function(child){
                    if (child.text==String(names[i])){
                        child.classList.add("is-active")
                    }
                })
            }
        }
        else{
            //TV2
            if (TV2list.indexOf(names[i])!==-1){
                TV2drop.childNodes.forEach(function(child){
                    if (child.text==String(names[i])){
                        child.classList.remove("is-active")
                    }
                })
            }

            //Viaplay
            if (vialist.indexOf(names[i])!==-1){
                viadrop.childNodes.forEach(function(child){
                    if (child.text==String(names[i])){
                        child.classList.remove("is-active")
                    }
                })
            }
            //Discovery
            if (dislist.indexOf(names[i])!==-1){
                disdrop.childNodes.forEach(function(child){
                    if (child.text==String(names[i])){
                        child.classList.remove("is-active")
                    }
                })
            }
            }
    })
    let label = document.createElement('label');
    label.appendChild(document.createTextNode(names[i]));
    label.classList.add("is-size-5");
    label.setAttribute("id","navn");
    //label.style.setProperty("font-size","17px");
    label.addEventListener("click",function(){
        mycheck.checked = !mycheck.checked;
        //triggerEvent(mycheck, 'change');
    })

    let pointtal=document.createElement("div");
    pointtal.classList.add("stofapoint");
    pointtal.classList.add("hidden");
    //Stofa pointknap

    let mellem= document.createElement("br");
    side.appendChild(pointtal);
    side.appendChild(infohover);
    side.appendChild(hiddeninfo);
    side.appendChild(mycheck);
    side.appendChild(label);
    side.appendChild(mellem);
    mycheck.classList.add("mycheck");
    mellem.classList.add("mellem");

}

//#endregion


//Streaming
//#region

let mystream="";
    $.ajax({
      contentType: "application/x-www-form-urlencoded;charset=utf-8",
      async:false,
      url: "https://raw.githubusercontent.com/CWJNor/kanalcsv/main/streaming_oversigt.csv",
      success: function(csv) {
          const output = Papa.parse(csv, {
            header: true, // Convert rows to Objects using headers as properties
          });
          if (output.data) {
            mystream=output.data;
          } else {
            console.log(output.errors);
          }
      },
      error: function(jqXHR, textStatus, errorThrow){
          console.log(textStatus);
      }
    
  });
  let streamliste=[];
  let streamdict={}


for(v of mystream.slice(0,-1)){
  let overskrift=Object.keys(v);
  let streamnavn=v["Streamingtjeneste"];
  overskrift.shift();
  streamliste.push(streamnavn);
  for (ov of overskrift){
    if (!streamdict[ov]) {
      streamdict[ov] = {};
    }
  if (v[ov].length==0){
      v[ov]="Løsning ikke mulig";
  }
    streamdict[ov][streamnavn]=v[ov];
  }
}
streamliste.sort();

for(key of Object.keys(streamdict)){
const sortedObject = Object.fromEntries(
    Object.entries(streamdict[key]).sort((a, b) => a[0].localeCompare(b[0]))
    );
    streamdict[key] = sortedObject;
}

//Adding checkboxes for streaming
let stream=streamliste;
stream.sort();

let streamcol1 = document.querySelector(".streamcol1");
let streamcol2 = document.querySelector(".streamcol2");
let streamcol3 = document.querySelector(".streamcol3");
let streamcol4 = document.querySelector(".streamcol4");

for (let i=0;i<stream.length;i++) {
    let side=streamcol1;
    if (i>=3){ //used to be stream.length/4
        if(i>=3*3){
            side=streamcol4;
        }
        else{
            if(i>=2*3){
                side=streamcol3;
            }
            else{
            side=streamcol2;
            }
        }
    }
    let mycheck = document.createElement("input");
    mycheck.setAttribute("type","checkbox");
    mycheck.setAttribute("name","Kanal");
    mycheck.setAttribute("value",stream[i]);
    mycheck.setAttribute("id","checkbox");
    let label = document.createElement('label');
    label.appendChild(document.createTextNode(stream[i]));
    label.setAttribute("id","navn");
    label.classList.add("is-size-5");
    label.addEventListener("click",function(){
        mycheck.checked = !mycheck.checked;
    })

    let pointtal=document.createElement("div");
    pointtal.classList.add("stofapoint");
    pointtal.classList.add("hidden");

    let mellem= document.createElement("br");
    side.appendChild(pointtal);
    side.appendChild(mycheck);
    side.appendChild(label);
    side.appendChild(mellem);
    mycheck.classList.add("mycheck");
    mellem.classList.add("mellem");

}
//#endregion


//UDREGNER PRISER


//Importerer streamingpriser
//#region
let mystreamall="";
    $.ajax({
      contentType: "application/x-www-form-urlencoded;charset=utf-8",
      async:false,
      url: "https://raw.githubusercontent.com/CWJNor/kanalcsv/main/streamingpriser_direkte.csv",
      success: function(csv) {
          const output = Papa.parse(csv, {
            header: true, // Convert rows to Objects using headers as properties
          });
          if (output.data) {
            mystreamall=output.data;
          } else {
            console.log(output.errors);
          }
      },
      error: function(jqXHR, textStatus, errorThrow){
          console.log(textStatus);
      }
    
  });

  let streamalldict={}

for(v of mystreamall.slice(0,-1)){
    let overskrift=Object.keys(v);
    let navn=v["Streamingtjeneste"];
    overskrift.shift();

    for (ov of overskrift){
      if (!streamalldict[ov]) {
        streamalldict[ov] = {};
      }
    streamalldict[ov][navn]=Number(v[ov]);
    }
  }
  
  for(key of Object.keys(streamalldict)){
  const sortedObject = Object.fromEntries(
      Object.entries(streamalldict[key]).sort((a, b) => a[0].localeCompare(b[0]))
      );
      streamalldict[key] = sortedObject;
  }


streampris=[streamalldict["Pris"]]
//#endregion

//Importerer pakkepriser
//#region
let mypakke="";
    $.ajax({
      contentType: "application/x-www-form-urlencoded;charset=utf-8",
      async:false,
      url: "https://raw.githubusercontent.com/CWJNor/kanalcsv/main/pakkepriser.csv",
      success: function(csv) {
          const output = Papa.parse(csv, {
            header: true, // Convert rows to Objects using headers as properties
          });
          if (output.data) {
            mypakke=output.data;
          } else {
            console.log(output.errors);
          }
      },
      error: function(jqXHR, textStatus, errorThrow){
          console.log(textStatus);
      }
    
  });


  let pakkeliste=[];
  let pakkedict={}

for(v of mypakke.slice(0,-1)){
  let overskrift=Object.keys(v);
  let pakkenavn=v["Pakke"];
  overskrift.shift();
  pakkeliste.push(pakkenavn);
  for (ov of overskrift){
    if (!pakkedict[ov]) {
      pakkedict[ov] = {};
    }
  if (v[ov].length==0){
      v[ov]="Løsning ikke mulig";
  }
  pakkedict[ov][pakkenavn]=v[ov];
  }
}
pakkeliste.sort();

for(key of Object.keys(pakkedict)){
const sortedObject = Object.fromEntries(
    Object.entries(pakkedict[key]).sort((a, b) => a[0].localeCompare(b[0]))
    );
    pakkedict[key] = sortedObject;
}

let pakkepris=pakkeliste;
pakkepris.sort();
//#endregion

//OTT - different subscription types:

//Norlys Vælg 4 - en streamingtjeneste max
let NV4func=function(){
    let ikkem=[];
    let streamlist=[];
    let kanaler=[udbyderdict["NorlysVaelg4OTT_binaer"]];
    let stream=[streamdict["NorlysVaelg4OTT_binaer"]];
    let pakke=[pakkedict["NorlysVaelg4OTT_binaer"]]
    kanaler.sort();
    stream.sort();
    let NV4=0;
    let NV4stream=0;
    let streamnum=0;
    Object.keys(kanaler[0]).forEach(navn=>{
        if(kanaler[0][navn]!=="Løsning ikke mulig"){
          kanaler[0][navn]=Number(kanaler[0][navn])
        }
      })
      Object.keys(stream[0]).forEach(stnavn=>{
        if(stream[0][stnavn]!=="Løsning ikke mulig"){
          stream[0][stnavn]=Number(stream[0][stnavn])
        }
      })
      Object.keys(pakke[0]).forEach(pnavn=>{
        if(pakke[0][pnavn]!=="Løsning ikke mulig"){
            pakke[0][pnavn]=Number(pakke[0][pnavn])
        }  
    })
            for (let kanal of kanaler){
                    for (let k of Object.keys(kanal)){
                        if(values.includes(k)){
                            if(kanal[k]=="Løsning ikke mulig"||NV4=="Løsning ikke mulig"){
                                NV4="Løsning ikke mulig";
                                if (kanal[k]=="Løsning ikke mulig"){
                                    ikkem.push(k);}
                            }
                            else{
                                NV4=NV4+kanal[k];
                            }
                        }
                    }
                }
                
                for (let st of stream){
                    for (let s of Object.keys(st)){
                        if(values.includes(s)){
                            if(st[s]=="Løsning ikke mulig"){
                                if(streampris[0][s]=="Løsning ikke mulig"){
                                    NV4="Løsning ikke mulig";
                                    ikkem.push(s);
                                }
                                else{
                                    NV4stream+=streampris[0][s];
                                    streamlist.push(s);
                                
                                }
                            }
                            else{
                                if(NV4!=="Løsning ikke mulig"){
                                    NV4=NV4+st[s];
                                    streamnum+=1;
                                }
                            }
                        }
                    }
                }
        let basepris=pakke[0]["Basispris"]
        if(NV4=="Løsning ikke mulig"){
            return "Løsning ikke mulig pga.:"+"<br>("+ikkem.join(", ")+")";
        }
        else{
            if(NV4>4){
                return "Mere end 4 valgt"
            }
            if(streamnum>1){
                return "Løsning ikke mulig (Mere end 1 streamingtjeneste valgt)"
            }
            if(NV4stream==0){
                return basepris+" kr."+" ("+NV4+" ud af 4 kanaler valgt)";
            }
            else{
                return NV4stream+basepris+" kr. (inkl. tilkøb af "+streamlist.join(", ")+" direkte hos streamingudbyderen)"+"<br>"+basepris+" kr. (ekskl. "+streamlist.join(", ")+") ("+NV4+" ud af 4 kanaler valgt)";
                 }
            }
} 
//Norlys Vælg 8 - 3 streamingtjenester max
let NVOfunc=function(){
    let ikkem=[];
    let streamlist=[];
    let kanaler=[udbyderdict["NorlysVaelg8OTT_binaer"]];
    let stream=[streamdict["NorlysVaelg8OTT_binaer"]];
    let pakke=[pakkedict["NorlysVaelg8OTT_binaer"]]
    Object.keys(kanaler[0]).forEach(navn=>{
        if(kanaler[0][navn]!=="Løsning ikke mulig"){
          kanaler[0][navn]=Number(kanaler[0][navn])
        }
      })
      Object.keys(stream[0]).forEach(stnavn=>{
        if(stream[0][stnavn]!=="Løsning ikke mulig"){
          stream[0][stnavn]=Number(stream[0][stnavn])
        }
      })
      Object.keys(pakke[0]).forEach(pnavn=>{
        if(pakke[0][pnavn]!=="Løsning ikke mulig"){
            pakke[0][pnavn]=Number(pakke[0][pnavn])
        }  
    })
    kanaler.sort();
    stream.sort();
    let NVO=0;
    let NVOstream=0;
    let streamnum=0;
            for (let kanal of kanaler){
                    for (let k of Object.keys(kanal)){
                        if(values.includes(k)){
                            if(kanal[k]=="Løsning ikke mulig"||NVO=="Løsning ikke mulig"){
                                NVO="Løsning ikke mulig";
                                if (kanal[k]=="Løsning ikke mulig"){
                                    ikkem.push(k);}
                            }
                            else{
                                NVO=NVO+kanal[k];
                            }
                        }
                    }
                }
                
                for (let st of stream){
                    for (let s of Object.keys(st)){
                        if(values.includes(s)){
                            if(st[s]=="Løsning ikke mulig"){
                                if(streampris[0][s]=="Løsning ikke mulig"){
                                    NVO="Løsning ikke mulig";
                                    ikkem.push(s);
                                }
                                else{
                                    NVOstream+=streampris[0][s];
                                    streamlist.push(s);
                                
                                }
                            }
                            else{
                                if(NVO!=="Løsning ikke mulig"){
                                    NVO=NVO+st[s];
                                    streamnum+=1;
                                }
                            }
                        }
                    }
                }
        let basepris=pakke[0]["Basispris"]
        if(NVO=="Løsning ikke mulig"){
            return "Løsning ikke mulig pga.:"+"<br>("+ikkem.join(", ")+")";
        }
        else{
            if(NVO>8){
                return "Mere end 8 valgt"
            }
            if(streamnum>3){
                return "Løsning ikke mulig (Mere end 3 streamingtjeneste valgt)"
            }
            if(NVOstream==0){
                return basepris+" kr."+" ("+NVO+" ud af 8 kanaler valgt)";
            }
            else{
                return NVOstream+basepris+" kr. (inkl. tilkøb af "+streamlist.join(", ")+" direkte hos streamingudbyderen)"+"<br>"+basepris+" kr. (ekskl. "+streamlist.join(", ")+") ("+NVO+" ud af 8 kanaler valgt)";
                 }
            }
} 

//Norlys Vælg 20 - 5 streamingtjenester max
let NVTfunc=function(){
    let ikkem=[];
    let streamlist=[];
    let kanaler=[udbyderdict["NorlysVaelg20OTT_binaer"]];
    let stream=[streamdict["NorlysVaelg20OTT_binaer"]];
    let pakke=[pakkedict["NorlysVaelg20OTT_binaer"]]
    kanaler.sort();
    stream.sort();
    let NVT=0;
    let NVTstream=0;
    let streamnum=0;
    Object.keys(kanaler[0]).forEach(navn=>{
        if(kanaler[0][navn]!=="Løsning ikke mulig"){
          kanaler[0][navn]=Number(kanaler[0][navn])
        }
      })
      Object.keys(stream[0]).forEach(stnavn=>{
        if(stream[0][stnavn]!=="Løsning ikke mulig"){
          stream[0][stnavn]=Number(stream[0][stnavn])
        }
      })
      Object.keys(pakke[0]).forEach(pnavn=>{
        if(pakke[0][pnavn]!=="Løsning ikke mulig"){
            pakke[0][pnavn]=Number(pakke[0][pnavn])
        }  
    })
            for (let kanal of kanaler){
                    for (let k of Object.keys(kanal)){
                        if(values.includes(k)){
                            if(kanal[k]=="Løsning ikke mulig"||NVT=="Løsning ikke mulig"){
                                NVT="Løsning ikke mulig";
                                if (kanal[k]=="Løsning ikke mulig"){
                                    ikkem.push(k);}
                            }
                            else{
                                NVT=NVT+kanal[k];
                            }
                        }
                    }
                }
                
                for (let st of stream){
                    for (let s of Object.keys(st)){
                        if(values.includes(s)){
                            if(st[s]=="Løsning ikke mulig"){
                                if(streampris[0][s]=="Løsning ikke mulig"){
                                    NVT="Løsning ikke mulig";
                                    ikkem.push(s);
                                }
                                else{
                                    NVTstream+=streampris[0][s];
                                    streamlist.push(s);
                                
                                }
                            }
                            else{
                                if(NVT!=="Løsning ikke mulig"){
                                    NVT=NVT+st[s];
                                    streamnum+=1;
                                }
                            }
                        }
                    }
                }
        basepris=pakke[0]["Basispris"];
        if(NVT=="Løsning ikke mulig"){
            return "Løsning ikke mulig pga.:"+"<br>("+ikkem.join(", ")+")";
        }
        else{
            if(NVT>20){
                return "Mere end 20 valgt"
            }
            if(streamnum>5){
                return "Løsning ikke mulig (Mere end 5 streamingtjeneste valgt)"
            }
            if(NVTstream==0){
                return basepris+" kr."+" ("+NVT+" ud af 20 kanaler valgt)";
            }
            else{
                return NVTstream+basepris+" kr. (inkl. tilkøb af "+streamlist.join(", ")+" direkte hos streamingudbyderen)"+"<br>"+basepris+" kr. (ekskl. "+streamlist.join(", ")+") ("+NVT+" ud af 20 kanaler valgt)";
                 }
            }
} 

//Norlys Pakkeløsning
let NPLfunc=function(){
    let ikkem=[];
    let streamlist=[];
    let kanaler=[udbyderdict["NorlysPakkeloesningOTT_pakker"]];
    let stream=[streamdict["NorlysPakkeloesningOTT_pakker"]];
    let pakke=[pakkedict["NorlysPakkeloesningOTT_pakker"]]
    kanaler.sort();
    stream.sort();
    let NPL=0;
    let NPLstream=0;
    Object.keys(kanaler[0]).forEach(navn=>{
        if(kanaler[0][navn]!=="Løsning ikke mulig"){
          kanaler[0][navn]=Number(kanaler[0][navn])
        }
      })
      Object.keys(stream[0]).forEach(stnavn=>{
        if(stream[0][stnavn]!=="Løsning ikke mulig"){
          stream[0][stnavn]=Number(stream[0][stnavn])
        }
      })
      Object.keys(pakke[0]).forEach(pnavn=>{
        if(pakke[0][pnavn]!=="Løsning ikke mulig"){
            pakke[0][pnavn]=Number(pakke[0][pnavn])
        }  
    })
                for (let kanal of kanaler){
                    for (let k of Object.keys(kanal)){
                        if(values.includes(k)){
                            if(kanal[k]=="Løsning ikke mulig"||NPL=="Løsning ikke mulig"){
                                NPL="Løsning ikke mulig";
                                if (kanal[k]=="Løsning ikke mulig"){
                                    ikkem.push(k);}
                            }
                            if(NPL<kanal[k]){
                                NPL=kanal[k];
                            }
                        }
                    }
                }
                for (let st of stream){
                    for (let s of Object.keys(st)){
                        if(values.includes(s)){
                            if(st[s]=="Løsning ikke mulig"){
                                if(streampris[0][s]=="Løsning ikke mulig"){
                                    NPL="Løsning ikke mulig";
                                    ikkem.push(s);
                                }
                                else{
                                    NPLstream+=streampris[0][s];
                                    streamlist.push(s);
                                }
                            }
                            if(NPL<st[s]){
                                NPL=st[s];
                            }
                        }
                    }
                }
        let NPLp=pakke[0]
        let pakkepris=[NPLp["Lille pakke"],NPLp["Mellem pakke"],NPLp["Stor pakke"]]
        let pakken=[" (lille pakke)"," (mellem pakke)", " (stor pakke)"]
        if(NPL=="Løsning ikke mulig"){
            return "Løsning ikke mulig pga.:<br>("+ikkem.join(", ")+")";
        }
        else{
            if(NPLstream==0){
                return pakkepris[NPL]+" kr." +pakken[NPL];
            }
            else{
                return NPLstream+pakkepris[NPL]+" kr."+pakken[NPL]+" (inkl. tilkøb af "+streamlist.join(", ")+" direkte hos streamingudbyderen)"+"<br>"+pakkepris[NPL]+" kr. (ekskl. "+streamlist.join(", ")+")";
            }
    }
}


//Getting the selected channels and the prices for those for each type of subscription, pushing them to the pop-up
let values = [];
let pris=[];

const btn = document.querySelector('#btn');
        btn.addEventListener('click', (event) => {
            let checkboxes = document.querySelectorAll('input[name="Kanal"]:checked');
            
            checkboxes.forEach((checkbox) => {
                values.push(checkbox.value);
            });
            let NV4=NV4func();
            let NVO=NVOfunc();
            let NVT=NVTfunc();
            let NPL=NPLfunc();

            let minpris=Number.MAX_VALUE;
            let expr="([0-9]+) .*"
            Udbyderliste=[{name:"NPL",val:NPL},{name:"NVO",val:NVO},{name:"NV4",val:NV4},{name:"NVT",val:NVT}];
            for (let u of Udbyderliste){
                val=u.val.replace(expr,"");
                val=parseInt(val);
                if(val<minpris){
                    minpris=val;
                }
            }
            for (let u of Udbyderliste){
                val=u.val.replace(expr,"");
                val=parseInt(val);
                if(val==minpris){
                    if (u.name=="NPL"){
                        NPL="<span class=cheap>"+NPL+'</span>'
                    }
                    if (u.name=="NV4"){
                        NV4="<span class=cheap>"+NV4+"</span>";
                    }
                    if (u.name=="NVO"){
                        NVO="<span class=cheap>"+NVO+"</span>";
                    }
                    if (u.name=="NVT"){
                        NVT="<span class=cheap>"+NVT+"</span>";
                    }
                }
            }
            
            pris.push("Norlys pakkeløsning <img  alt='streaming' src='streaming.png' class='icon'>: ".bold()+NPL);
            pris.push("<br>");
            pris.push("<br>"+"Norlys Vælg 4 <img  alt='streaming' src='streaming.png' class='icon'></img>: ".bold()+NV4);
            pris.push("<br>");
            pris.push("<br>"+"Norlys Vælg 8 <img  alt='streaming' src='streaming.png' class='icon'></img>: ".bold()+NVO);
            pris.push("<br>");
            pris.push("<br>"+"Norlys Vælg 20 <img  alt='streaming' src='streaming.png' class='icon'></img>: ".bold()+NVT);

            if (values.length==0){
                swal.fire("Ingen kanaler valgt");
            }
            else{
                swal.fire({title:"Priser:",html:'<div class="align-left">'+pris.join("")+'<br><br></div>',customClass:"swall_wide"});
            };
            pris=[];
            values=[];
        });    

let streamingpriser=[streamalldict["Pris"]];
streamingpriser.sort();


//Pop up that shows the prices for streamingservices bought directly at the provider
const btn1=document.querySelector("#btn1");
        btn1.addEventListener('click',(event)=>{
            streamprint=[]
            for (let stream of streamingpriser){
                for (let s of Object.keys(stream)){
                    streamprint.push(s.bold()+":  "+stream[s]+" kr."+"<br><br>");
                }
                }
                
            ;
            let middleIndex = Math.ceil(streamprint.length / 2);

            let firstHalf = streamprint.splice(0, middleIndex);   
            let secondHalf = streamprint.splice(-middleIndex);
            swal.fire({title:"Priser på streaming<hr>",html:"<div class=align-left id=streamingpris>"+"<div>"+firstHalf.join("")+"</div>"+"<div>"+secondHalf.join("")+"</div>"+"</div>",width:"1000px"});
            });


//Stofa vælg frit
//#region
//#endregion
