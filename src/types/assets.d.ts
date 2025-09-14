// src/types/assets.d.ts
declare module "*.svg" {
  const src: string;  // default = URL
  export default src;
  // 선택: 컴포넌트 alias를 위한 named export 타입
  //import * as React from "react";
  //export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;

  /*
  import * as React from "react";
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
  const src: string;         // asset/resource 쓸 때는 문자열 URL
  export default src;

  const content: React.FunctionComponent<React.SVGAttributes<SVGElement>>;
  export default content;
  */
}

declare module "*.png" {
  const value: string;
  export default value;
}
declare module "*.jpg" {
  const value: string;
  export default value;
}
declare module "*.jpeg" {
  const value: string;
  export default value;
}
declare module "*.gif" {
  const value: string;
  export default value;
}
