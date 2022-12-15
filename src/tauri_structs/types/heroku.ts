export type Release = {
  id: String;
  version: Number;
};

export type App = {
  id: String;
  name: String;
};

export type Dyno = {
  app: App;
  attach_url: String | null;
  command: String;
  created_at: String;
  id: String;
  name: String;
  release: Release;
  size: String;
  state: String;
  'r#type': String;
  updated_at: String;
};
