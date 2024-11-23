import { Button } from "react-bootstrap";

export function HelpText() {
  return (
    <>
      <h3>Oldalsó gombok</h3>
      <ul>
        <li>
          <b>Köv. kör:</b> új kört kezd, átugorva a maradék fázisokat és karaktereket.
        </li>
        <li>
          <b>Vissza 1 kört:</b> egy kört visszalép (a címkék nem számolnak visszafelé ilyenkor!)
        </li>
        <li>
          <b>Sorrendbe:</b> előfordulhat, hogy a karakterek nem kezdeményezési sorrendben vannak a
          listában. Ez sorba rakja őket.
        </li>
        <li>
          <b>Új karakter:</b> felugró ablakban meg lehet adni egy karaktert. Név és fázisok
          kötelező, a Kezdeményezést később is meg lehet adni. Ha a &quot;Megtart&quot; be van
          jelölve, akkor &quot;Új harc&quot; indításakor nem törli a karaktert a listából.
        </li>
        <li>
          <b>Új harc:</b> kitöröl minden njk-t, a kezdeményezés értékeket és 1. kör 1. fázisra áll,
          illetve az első karakterre.
        </li>
        <li>
          <b>Mentés fájlba:</b> letölti fájlba az aktuális állapotot.
        </li>
        <li>
          <b>Betöltés fájlból:</b> fel lehet tölteni egy elmetett állapotot.
        </li>
      </ul>
      <h3>Karakter lista</h3>
      <p>
        Felette a
        <Button size='sm' className='mx-2 py-0' variant='info'>
          <i className='bi bi-arrow-down'></i>
        </Button>
        gombbal lehet a következő karakterre léptetni a kezdeményezést. A listán a háromszög jelőli,
        hogy ki jön most. A lista elemeit egérrel át lehet rendezni. A sor elején a ceruza (vagy
        szám) gombra kattintva lehet átírni a kezdeményezés értékét.
      </p>
      <h3>Részletek nézet (jobb oldal)</h3>
      <h4>Felső gombok</h4>
      <ul>
        <li>
          <b>&gt;:</b> erre a karaterre mozgatja a kezdeményezést.
        </li>
        <li>
          <b>Ceruza:</b> a karakter nevét, fázisát lehet átírni, vagy másolatot készíteni róla.
        </li>
        <li>
          <b>Kuka:</b> törli a karaktert a listából (megerősítés nélkül).
        </li>
      </ul>
      <h4>Címkék</h4>
      <p>
        A néhány előre definiált címkére bal gombbal kattintva hozzáadja a karakterhez. Újra bal
        gombbal a címke időtartamát növeli. Jobb gombbal csökkenti. Időtartam nélküli címke mindig
        rajta marad. Középső gombbal eltávolítja a címkét.
      </p>
      <p>Alatta egyedi címkét lehet hozzáadni.</p>
      <h4>Jegyzetek</h4>
      <p>Szabad szöveges mező.</p>
      <h4>Számlálók</h4>
      <p>
        Az új számláló mezőbe a nevét beírva, majd +-ra kattintva, hozzáad egy szám mezőt. Utána a
        szám mezőbe be lehet írni az értékét, vagy matematikai műveletet, amit Enter megnyomására
        végrehajt. Pl. &quot;25-4&quot;-et beírva, Enterre 21-et ír be.
      </p>
      <h4>Kockadobó</h4>
      <p>
        A szám billentyűket megnyomva annyi kockával dob. Mázlit nem kezel. Ha előbb a
        &quot;t&quot;, vagy &quot;h&quot; billentyűt nyomod meg, akkor tizen-, huszon annyi kockát
        dob. &quot;t4&quot; 14 kockával dob. Az értesítés a dobott kockákat és a sikereket is
        mutatja, piros, ha glitch.
      </p>

      <p>
        Csokáv - 2024.11.22. -
        <a
          className='ms-2'
          href='https://github.com/csakip/sr-initiative'
          target='_blank'
          rel='noreferrer'>
          GitHub
        </a>
      </p>
    </>
  );
}
