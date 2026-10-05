# game-schedule

Horarios y torneos

App en React Native + Expo para organizar tus horarios de juego y torneos: anota cuándo vas a jugar, con quién, y lleva el registro de las rondas de tus torneos.

## Stack

- Expo SDK 57 + Expo Router (rutas en `src/app`)
- NativeWind (Tailwind CSS para React Native)
- AsyncStorage para persistencia local (sin backend por ahora)

## Empezar

```sh
npm install
npx expo start
```

## Estructura

```
src/
  app/          # rutas (Expo Router)
  components/   # componentes UI reutilizables
  hooks/        # useSchedules, useTournaments
  models/       # tipos de datos
  storage/      # capa de persistencia (AsyncStorage)
  utils/        # utilidades varias
```
