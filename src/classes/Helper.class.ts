export default class Helper {
  public static nullForEmpty(v: any): null | any {
    if("" === v)
      return null;
    return v;
  }

  public static emptyforNull(v: any): string | any {
    if(null === v)
      return "";
    return v;
  }
}