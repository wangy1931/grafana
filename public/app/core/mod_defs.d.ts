declare module "app/core/controllers/all" {
  let json: any;
  export {json};
}

declare module "app/core/routes/all" {
  let json: any;
  export {json};
}

declare module "app/core/services/all" {
  let json: any;
  export default json;
}

// declare module angular.i18n {
//     interface II18nProvider {
//         allowPartialFileLoading: boolean;
//         baseHref: string;
//         debug: boolean;
//         defaultLanguage: string;
//         fallback: JSON;
//         fileURL: string|Array<string>;
//         fileURLLanguageToken: RegExp|string;
//         fileURLPartToken: RegExp|string;
//         language: string;
//         onTranslationFailed: Function;
//         useBaseHrefTag: boolean;
//     }

//     interface II18n {
//         debug: boolean;
//         language: string;
//         onTranslationFailed: Function;
//         addTranslation(lang: string, json: string, section?: string): void;
//         removeTranslation(lang: string, section?:string): void;
//         switchTranslation(lang: string, section?:string): void;
//         loadTranslation(lang:string, section?: string): void;
//         hasTranslation(lang:string, section?: string, key?: string): void;
//         isTranslationLoaded(lang:string, section?: string): void;
//         translate (id:string, section?: string, placeholders?: (string|number)[]): II18nPromise;
//     }

//     interface II18nPromiseCallback {
//         (translation:string): void;
//     }

//     interface II18nPromise extends ng.IPromise<string> {
//         success(callback:II18nPromiseCallback): II18nPromise;
//         error(callback:II18nPromiseCallback): II18nPromise;
//     }

// }


