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

// declare module "app/core/i18n/locale_provider" {
//   interface $translateProvider {}
//   interface $translate {
//     use: Function;
//   }
// }