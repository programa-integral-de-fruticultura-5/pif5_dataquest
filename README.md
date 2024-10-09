<p align="center">
  <img src="src\assets\icon\app-logo.png" width="60%" alt="DATAQUEST-logo">
</p>
<p align="center">
    <h1 align="center">DATAQUEST</h1>
</p>
<p align="center">
	<img src="https://img.shields.io/github/license/programa-integral-de-fruticultura-5/dataquest?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
	<img src="https://img.shields.io/github/last-commit/programa-integral-de-fruticultura-5/dataquest?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
	<img src="https://img.shields.io/github/languages/top/programa-integral-de-fruticultura-5/dataquest?style=flat&color=0080ff" alt="repo-top-language">
	<img src="https://img.shields.io/github/languages/count/programa-integral-de-fruticultura-5/dataquest?style=flat&color=0080ff" alt="repo-language-count">
</p>
<p align="center">
		<em>Built with the tools and technologies:</em>
</p>
<p align="center">
	<img src="https://img.shields.io/badge/GNU%20Bash-4EAA25.svg?style=flat&logo=GNU-Bash&logoColor=white" alt="GNU%20Bash">
	<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
	<img src="https://img.shields.io/badge/HTML5-E34F26.svg?style=flat&logo=HTML5&logoColor=white" alt="HTML5">
	<img src="https://img.shields.io/badge/YAML-CB171E.svg?style=flat&logo=YAML&logoColor=white" alt="YAML">
	<img src="https://img.shields.io/badge/datefns-770C56.svg?style=flat&logo=date-fns&logoColor=white" alt="datefns">
	<img src="https://img.shields.io/badge/ESLint-4B32C3.svg?style=flat&logo=ESLint&logoColor=white" alt="ESLint">
	<img src="https://img.shields.io/badge/Google-4285F4.svg?style=flat&logo=Google&logoColor=white" alt="Google">
	<img src="https://img.shields.io/badge/Android-3DDC84.svg?style=flat&logo=Android&logoColor=white" alt="Android">
	<br>
	<img src="https://img.shields.io/badge/Lodash-3492FF.svg?style=flat&logo=Lodash&logoColor=white" alt="Lodash">
	<img src="https://img.shields.io/badge/TypeScript-3178C6.svg?style=flat&logo=TypeScript&logoColor=white" alt="TypeScript">
	<img src="https://img.shields.io/badge/tsnode-3178C6.svg?style=flat&logo=ts-node&logoColor=white" alt="tsnode">
	<img src="https://img.shields.io/badge/Docker-2496ED.svg?style=flat&logo=Docker&logoColor=white" alt="Docker">
	<img src="https://img.shields.io/badge/GitHub%20Actions-2088FF.svg?style=flat&logo=GitHub-Actions&logoColor=white" alt="GitHub%20Actions">
	<img src="https://img.shields.io/badge/Gradle-02303A.svg?style=flat&logo=Gradle&logoColor=white" alt="Gradle">
	<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
	<img src="https://img.shields.io/badge/java-%23ED8B00.svg?style=flat&logo=openjdk&logoColor=white" alt="java">
</p>

<br>

##### 🔗 Table of Contents

- [📂 Repository Structure](#-repository-structure)
- [🚀 Getting Started](#-getting-started)
    - [🔖 Prerequisites](#-prerequisites)
    - [📦 Installation](#-installation)
    - [🤖 Usage](#-usage)
- [🤝 Contributing](#-contributing)


## 📂 Repository Structure

```sh
└── dataquest/
    ├── .github
    │   └── workflows
    ├── Dockerfile
    ├── Jenkinsfile
    ├── android
    │   ├── .gitignore
    │   ├── app
    │   ├── build.gradle
    │   ├── capacitor.settings.gradle
    │   ├── dataquest-keystore.jks
    │   ├── gradle
    │   ├── gradle.properties
    │   ├── gradlew
    │   ├── gradlew.bat
    │   ├── settings.gradle
    │   └── variables.gradle
    ├── angular.json
    ├── bitbucket-pipelines.yml
    ├── capacitor.config.ts
    ├── documentation
    │   ├── components
    │   ├── coverage.html
    │   ├── dependencies.html
    │   ├── fonts
    │   ├── graph
    │   ├── images
    │   ├── index.html
    │   ├── injectables
    │   ├── interfaces
    │   ├── js
    │   ├── miscellaneous
    │   ├── modules.html
    │   ├── properties.html
    │   └── styles
    ├── extract-version.sh
    ├── icons
    │   ├── icon-128.webp
    │   ├── icon-192.webp
    │   ├── icon-256.webp
    │   ├── icon-48.webp
    │   ├── icon-512.webp
    │   ├── icon-72.webp
    │   └── icon-96.webp
    ├── ionic.config.json
    ├── karma.conf.js
    ├── package-lock.json
    ├── package.json
    ├── project-summary.md
    ├── resources
    │   ├── icon.png
    │   ├── splash-dark.png
    │   └── splash.png
    ├── src
    │   ├── app
    │   │   ├── components
    │   │   ├── guards
    │   │   ├── models
    │   │   ├── pages
    │   │   ├── services
    │   │   └── utils
    │   ├── assets
    │   ├── data
    │   ├── environments
    │   ├── global.scss
    │   ├── index.html
    │   ├── main.ts
    │   ├── manifest.webmanifest
    │   ├── polyfills.ts
    │   ├── test.ts
    │   ├── theme
    │   └── zone-flags.ts
    ├── tsconfig.app.json
    ├── tsconfig.doc.json
    ├── tsconfig.json
    └── tsconfig.spec.json
```

---

## 🚀 Getting Started

### 🔖 Prerequisites

- **TypeScript**: `version ~5.0.2`
- **Angular**: `version ^16.0.0`
- **Node.js**: `version ^18.20.4`
- **Ionic**: `version ^7.0.0`
- **Capacitor**: `version ^5.0.0`
- **Java Development Kit**: `version 17.0.0`
- **Android Studio**: `version 2022.2.1 or greater`
- **Android SDK**: `API 31.0.0 or greater`

### 📦 Installation

Build the project from source:

1. Clone the dataquest repository:
```sh
❯ git clone https://github.com/programa-integral-de-fruticultura-5/dataquest
```

2. Navigate to the project directory:
```sh
❯ cd dataquest
```

3. Install the required dependencies:
```sh
❯ npm install
```

4. Install Ionic CLI:
```sh
❯ npm install -g @ionic/cli
```

### 🤖 Usage

To run the project, execute the following command:

```sh
❯ ionic capacitor run --list
```

This will list your available devices. Select the desired device and run the project:

```sh
❯ ionic capacitor run android --target=<device-id> --prod
```

If you want to reload for every change made in code use the following command:

```sh
❯ ionic capacitor run android --target=<device-id> --prod --livereload
```

---

## 🤝 Contributing

To contribute to the project, please follow this guidelines

<details closed>
<summary>Add Form Validations</summary>

1. **Add the new form**: Add the form that will be validated in the `src/app/models/FormDetai.namespace.ts` file.

    ```typescript
    export enum FormType {
      SPECIALIZED = 1,
      SUPPORT = 5,
      SUPPLY = 7,
      PARCEL = 11,
      PARCEL_SUPPLIES = 12,
      GREENHOUSE = 13,
      GREENHOUSE_SUPPLIES = 14,
      PARCEL_SUPPORT = 15,
      GREENHOUSE_SUPPORT = 16,
      NEW_FORM = 20,    // Add the new form here (the end)
    }
    ```
2. **Add the attribute to be validated**: Add the attribute to the interfaces to be validated with the beneficiary (producer/association) in the `src/app/models/Beneficiary.namespace.ts` file.
   ```typescript
    export interface Producer {
      cedula: string;
      firstname: string;
      middlename: string;
      lastname: string;
      secondLastname: string;
      id: string;
      specialized: boolean;
      technicalAssistance: boolean;
      demonstrationPlot: boolean;
      supportDemonstrationPlot: boolean;
      greenhouse: boolean;
      supplies: boolean;
      newAttribute: boolean;  // new attribute to be validated in the form
      associationId: number;
      transplantDate: string;
      recommendedActions: SelectedQuestions
      support: boolean; // Support visit / Technical Assistance
      preloadedQuestions: PreloadedQuestion;
    }

    export const ProducerBaseParams = {
      cedula: '',
      firstname: '',
      middlename: '',
      lastname: '',
      secondLastname: '',
      id: '',
      specialized: false,
      technicalAssistance: false,
      demonstrationPlot: false,
      supportDemonstrationPlot: false,
      greenhouse: false,
      newAtribute: false,   // new attribute to be validated with the base value
      supplies: false,
      associationId: 0,
      transplantDate: '',
      recommendedActions: {},
      support: false,
      preloadedQuestions: {}
    };

    export type ProducerResponse = {
      cedula: string;
      primer_nombre: string;
      segundo_nombre: string;
      primer_apellido: string;
      segundo_apellido: string;
      identification: string;
      has_especializada: number;
      sost_p5: number;        // support visit
      at_p5: number;          // asistencia técnica
      pd_p5: number;          // parcela demostrativa
      cm_p5: number;          // casa malla (invernadero espacial)
      pd_at: number;          // parcela demostrativa asistencia técnica
      insumo_p5: number;      // insumos
      association_id: number; // id de la asociacion
      transplantDate: string;
      new_attribute: number;  // new attribute to be validated from the backend response
      selectedQuestionIds: SelectedQuestions
      QuestionPreloaded: PreloadedQuestion;
    };
    ```
3. **Add the attribute to the builder**: Add the attribute to the builder to be build when the response is fetched in the `src/utils/builder.ts` file.
   
   ```typescript
    export function producerBuilder(
      producer: Beneficiary.ProducerResponse
    ): Beneficiary.Producer {
      return {
        cedula: producer.cedula,
        firstname: producer.primer_nombre,
        middlename: producer.segundo_nombre,
        lastname: producer.primer_apellido,
        secondLastname: producer.segundo_apellido,
        id: producer.identification,
        specialized: producer.has_especializada === 1,
        technicalAssistance: producer.at_p5 === 1,
        demonstrationPlot: producer.pd_p5 === 1,
        supportDemonstrationPlot: producer.pd_at === 1,
        newAttribute: producer.new_attribute === 1,   // new attribute to be validated
        greenhouse: producer.cm_p5 === 1,
        supplies: producer.insumo_p5 === 1,
        associationId: producer.association_id,
        transplantDate: producer.transplantDate,
        recommendedActions: producer.selectedQuestionIds,
        support: producer.sost_p5 === 1,
        preloadedQuestions: producer.QuestionPreloaded
      };
    }
   ```
4. **Add the new form to the switch case**: Add the new form to the switch case in the `src/app/services/detailed-form.service.ts` file.

   ```typescript
    private canSetBeneficiary(
      selectedBeneficiary: Beneficiary.Producer
    ): boolean | undefined {
      const formId = this.selectedForm.id;

      switch (formId) {
        case FormDetail.FormType.SPECIALIZED:
          return this.canSetSpecializedBeneficiary(selectedBeneficiary);
        case FormDetail.FormType.SUPPORT:
          return true; /* this.canSetSupportBeneficiary(selectedBeneficiary) */
        case FormDetail.FormType.SUPPLY:
          return this.canSetSupplyBeneficiary(selectedBeneficiary);
        case FormDetail.FormType.PARCEL:
        case FormDetail.FormType.PARCEL_SUPPLIES:
          return this.canSetParcelBeneficiary(selectedBeneficiary);
        case FormDetail.FormType.GREENHOUSE:
        case FormDetail.FormType.GREENHOUSE_SUPPLIES:
        case FormDetail.FormType.GREENHOUSE_SUPPORT:
          return this.canSetGreenhouseBeneficiary(selectedBeneficiary);
        case FormDetail.FormType.PARCEL_SUPPORT:
          return this.canSetParcelSupportBeneficiary(selectedBeneficiary);
        case FormDetail.FormType.NEW_FORM:  // Add the new form here
          return this.canSetNewFormBeneficiary(selectedBeneficiary);
        default:
          return true;
      }
    }
   ```
   
5. **Create the method**: Create the method to validate the new attribute and its alert in the `src/app/services/detailed-form.service.ts` file. Take the example with the greenhouse form. Do not forget to modify the alert message.

   ```typescript
    private canSetGreenhouseBeneficiary(selectedBeneficiary: Beneficiary.Producer): boolean {
      const isGreenhouseBeneficiary: boolean = selectedBeneficiary.greenhouse;

      if (isGreenhouseBeneficiary) {
        return true;
      } else {
        this.showNoGreenhouseBeneficiaryAlert();
        return false;
      }
    }

    private async showNoGreenhouseBeneficiaryAlert(): Promise<void> {
      const alert = await this.alertController.create({
        header: 'Beneficiario no es candidato de casa malla',
        message: 'Escoge otro beneficiario',
        buttons: ['OK'],
      });
      await alert.present();
    }
   ```

6. **Change the version name and code**: Change the version name and code in the `android\app\build.gradle` file.

   ```gradle
    android {
      ...
      defaultConfig {
        applicationId "com.blaucastmedia.dataquest.app"
        minSdkVersion rootProject.ext.minSdkVersion
        targetSdkVersion rootProject.ext.targetSdkVersion
        versionCode 90 
        versionName "1.12.25"
        testInstrumentationRunner "androidx.test.runner.AndroidJUnitRunner"
        ...
      }
    }
   ```

   - **versionCode**: An integer value that represents the version of the application code, relative to other versions. Change the version code +1 each time you want to release a new version independently of the environment (otherwise the app will not update and will show an error on the deploy)
   - **versionName**: A string value that represents the version of the application, shown to users. Change the version name each time you want to release a new version in the form `mayor.minor.patch`
</details>

<details closed>
<summary>Contributor Graph</summary>
<br>
<p align="left">
   <a href="https://github.com{/programa-integral-de-fruticultura-5/dataquest/}graphs/contributors">
      <img src="https://contrib.rocks/image?repo=programa-integral-de-fruticultura-5/dataquest">
   </a>
</p>
</details>

---
