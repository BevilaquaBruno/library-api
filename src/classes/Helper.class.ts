export default class Helper {
  /**
   * 1.This is used to save NULL in mysql when the field is empty
   * @param v: @any
   * @returns null or the v: @any
   */
  public static nullForEmpty(v: any): null | any {
    if ("" === v) return null;
    return v;
  }

  /**
   * 1.This is used to turn field an empty string in all @toJson methods in classes
   * @param v: @any
   * @returns empty string or the v: @any
   */
  public static emptyforNull(v: any): string | any {
    if (null === v) return "";
    return v;
  }
}
