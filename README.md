# Shadowrun 4 kezdeményezés meséglet

## Oldalsó gombok

- **Köv. kör:** új kört kezd, átugorva a maradék fázisokat és karaktereket.
- **Vissza 1 kört:** egy kört visszalép (a címkék nem számolnak visszafelé ilyenkor!)
- **Sorrendbe:** előfordulhat, hogy a karakterek nem kezdeményezési sorrendben vannak a listában. Ez sorba rakja őket.
- **Új karakter:** felugró ablakban meg lehet adni egy karaktert. Név és fázisok kötelező, a Kezdeményezést később is meg lehet adni. Ha a "Megtart" be van jelölve, akkor "Új harc" indításakor nem törli a karaktert a listából.
- **Új harc:** kitöröl minden njk-t, a kezdeményezés értékeket és 1. kör 1. fázisra áll, illetve az első karakterre.
- **Mentés fájlba:** letölti fájlba az aktuális állapotot.
- **Betöltés fájlból:** fel lehet tölteni egy elmetett állapotot.

## Karakter lista

Felette a nyíl gombbal lehet a következő karakterre léptetni a kezdeményezést. A listán a háromszög jelőli, hogy ki jön most. A lista elemeit egérrel át lehet rendezni. A sor elején a ceruza (vagy szám) gombra kattintva lehet átírni a kezdeményezés értékét.

## Részletek nézet (jobb oldal)

### Felső gombok

- **\>:** erre a karaterre mozgatja a kezdeményezést.
- **Ceruza:** a karakter nevét, fázisát lehet átírni, vagy másolatot készíteni róla.
- **Kuka:** törli a karaktert a listából (megerősítés nélkül).

### Címkék

A néhány előre definiált címkére bal gombbal kattintva hozzáadja a karakterhez. Újra bal gombbal a címke időtartamát növeli. Jobb gombbal csökkenti. Időtartam nélküli címke mindig rajta marad. Középső gombbal eltávolítja a címkét.

Alatta egyedi címkét lehet hozzáadni.

### Jegyzetek

Szabad szöveges mező.

### Számlálók

Az új számláló mezőbe a nevét beírva, majd +-ra kattintva, hozzáad egy szám mezőt. Utána a szám mezőbe be lehet írni az értékét, vagy matematikai műveletet, amit Enter megnyomására végrehajt. Pl. "25-4"-et beírva, Enterre 21-et ír be.

## Kockadobó

A szám billentyűket megnyomva annyi kockával dob. Mázlit nem kezel. Ha előbb a
"t", vagy "h" billentyűt nyomod meg, akkor tizen-, huszon annyi kockát
dob. "t4" 14 kockával dob. Az értesítés a dobott kockákat és a sikereket is
mutatja, piros, ha glitch.

## Dev env

```
yarn
yarn dev
```

## Deployment

```
yarn deploy
```

Ide: https://csakip.github.io/sr-initiative/
