export default class Helper {
  public static nullForEmpty(v: any): null | any {
    if("" === v)
      return null;
    return v;
  }
}