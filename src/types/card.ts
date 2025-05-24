export const CardType = {
  Normal: "Normal",
  Intermediate: "Intermediate",
  HighlightedTopic: "HighlightedTopic",
} as const;

export const CardStatus = {
  Draft: "Draft",
  Published: "Published",
  Archived: "Archived",
} as const;

export type CardType = (typeof CardType)[keyof typeof CardType];
export type CardStatus = (typeof CardStatus)[keyof typeof CardStatus];

export interface Subtitle {
  text: string;
  value: string;
}

export interface DisplayConfig {
  isEnabledOnNonBusinessDay: boolean;
  enabledOnChannels: string[];
}

export interface Tag {
  id: string;
  value: string;
  categoryId: string;
  categoryName: string;
}

export interface HtmlTabContent {
  title: string;
  html: string;
}

export interface Multimedia {
  title: string;
  url: string;
  fileType: string;
}

export interface HtmlStepContent {
  title: string;
  html: string;
}

export interface Card {
  title: string;
  icon?: string;
  description?: string;
  url: string;
  to?: string;
  subtitle?: Subtitle;
  type: CardType;
  level: number;
  status?: CardStatus;
  order?: number;
  parent?: string;
  content?: string;
  children?: string[];
  displayConfig?: DisplayConfig;
  childrens?: Card[];
  guruId?: string;
  htmlContent?: string;
  htmlCleanContent?: string;
  digitalType?: string;
  digitalSubType?: string;
  tags?: Tag[];
  htmlTabContent?: HtmlTabContent[];
  multimedia?: Multimedia[];
  htmlStepContent?: HtmlStepContent[];
}

export type CardData = Card[];
