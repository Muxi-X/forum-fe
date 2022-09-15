import { Interface, BaseClass, Property, CodeGenerator } from 'pont-engine';

export default class MyGenerator extends CodeGenerator {
  getInterfaceContentInDeclaration(inter: Interface) {
    const method = inter.method.toUpperCase();
    const paramsCode = inter.getParamsCode('Params');
    const requestParams = inter.getRequestParams();

    return `
      export ${paramsCode}

      export type HooksParams = (() => Params) | Params;

      export type Response = ResponseTypeWarpper<${inter.responseType}>

      export const method: string;

      export function request(${requestParams}): Promise<Response>;
    `;
  }

  getBaseClassInDeclaration(base: BaseClass) {
    const originProps = base.properties;

    base.properties = base.properties.map((prop) => {
      return new Property({
        ...prop,
        required: false,
      });
    });

    const result = super.getBaseClassInDeclaration(base);
    base.properties = originProps;

    return result;
  }

  getCommonDeclaration() {
    return `       
     interface ResponseTypeWarpper<T> {
      code: number;
      data: T;
      message: string;
  };`;
  }

  getInterfaceContent(inter: Interface) {
    const method = inter.method.toUpperCase();
    const relativePath = this.usingMultipleOrigins ? '../../../' : '../../';
    const requestParams = inter.getRequestParams(this.surrounding);

    return `
    /**
     * @desc ${inter.description}
     */


    import * as defs from '../../baseClass';
    import { PontCore } from '${relativePath}pontCore';


    export ${inter.getParamsCode('Params', this.surrounding)}

    export const method = "${method}";

    export function request(${requestParams}) {
      return PontCore.fetch(PontCore.getUrl("${
        inter.path
      }", params, "${method}"), ${inter.getRequestContent()});
    }`;
  }
}
