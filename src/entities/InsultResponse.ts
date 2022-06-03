type Args = {
  who: string;
  lang: string;
  template: string;
};

export type Insult = {
  error: boolean;
  args: Args;
  insult: string;
};
