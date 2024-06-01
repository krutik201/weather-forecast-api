export interface AppResponse<ResClass = object | object[]> {
  message: String;
  data: ResClass;
}

