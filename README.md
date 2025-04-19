# Welcome to your Expo app 👋

This is an [Expo](https://expo.dev) project created with [`create-expo-app`](https://www.npmjs.com/package/create-expo-app).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
    npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.


## 📦 Cómo generar los paquetes Android (AAB / APK)

> **Requisitos previos**
>
> - Node ≥ 18  
> - Yarn o NPM instalado  
> - Cuenta en [Expo](https://expo.dev) y haber iniciado sesión (`npx expo login`)  
> - EAS CLI global (`npm i -g eas-cli`)  
> - Certificados (keystore) configurados en Expo ► **Build Credentials**  
> - Variables de entorno necesarias definidas en **eas.json** o en el Dashboard


### 1. Instalación de dependencias

git clone https://github.com/angeljrcurtido/managerFinanceV1.git
cd managerFinanceV1
yarn           # o  npm install

## 2. Seleccionar el perfil de compilación

El archivo eas.json contiene tres perfiles:

Perfil	Uso principal	Tipo de paquete
1.development|	Cliente dev + instalación interna |	APK
2.preview	 |Beta testers / QA (interno)	APK
3.production |	Google Play / producción estable	AAB (Play Bundle)

### 3. Comandos principales

Objetivo	Comando
AAB de producción (recomendado para Play Store):	eas build --platform android --profile production
APK para testing rápido (profile preview):	eas build --platform android --profile preview --artifact-type apk
APK local sin subir a la nube
(requiere Android SDK + NDK instalados):	eas build --platform android --profile preview --local --output-name app-preview.apk
Cliente dev con live‑reload:	eas build -p android --profile development
Instala el APK en tu dispositivo y luego npx expo start --dev-client

Nota: sin especificar --artifact-type, EAS genera:
AAB en perfiles de distribución (preview, production)
APK en perfiles development


