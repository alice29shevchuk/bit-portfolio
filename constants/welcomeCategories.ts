export type WelcomeClusterIcons = readonly [number, number, number];

const ICON_PLACEHOLDER = require('../assets/images/welcome-category-placeholder.svg');

const ICON_CROWD_LENDING_FIRST = require('../assets/images/welcome-crowd-lending-icon-1.svg');
const ICON_CROWD_LENDING_CENTER = require('../assets/images/welcome-crowd-lending-icon-2.svg');
const ICON_CROWD_LENDING_LAST = require('../assets/images/welcome-crowd-lending-icon-1.svg');

const ICON_CROWD_REAL_ESTATE_FIRST = require('../assets/images/welcome-crowd-real-estate-icon-1.svg');
const ICON_CROWD_REAL_ESTATE_CENTER = require('../assets/images/welcome-crowd-real-estate-icon-2.svg');
const ICON_CROWD_REAL_ESTATE_LAST = require('../assets/images/welcome-crowd-real-estate-icon-3.svg');

const ICON_COMMODITIES_FIRST = require('../assets/images/welcome-commodities-icon-1.svg');
const ICON_COMMODITIES_CENTER = require('../assets/images/welcome-commodities-icon-2.svg');
const ICON_COMMODITIES_LAST = require('../assets/images/welcome-commodities-icon-3.svg');

const ICON_ETFS_FIRST = require('../assets/images/welcome-etfs-icon-1.svg');
const ICON_ETFS_CENTER = require('../assets/images/welcome-etfs-icon-2.svg');
const ICON_ETFS_LAST = require('../assets/images/welcome-etfs-icon-3.svg');

const ICON_CRYPTO_FIRST = require('../assets/images/welcome-crypto-icon-1.svg');
const ICON_CRYPTO_CENTER = require('../assets/images/welcome-crypto-icon-2.svg');
const ICON_CRYPTO_LAST = require('../assets/images/welcome-crypto-icon-3.svg');

function triplePlaceholder(): WelcomeClusterIcons {
  return [ICON_PLACEHOLDER, ICON_PLACEHOLDER, ICON_PLACEHOLDER];
}

export const defaultWelcomeClusterIcons: WelcomeClusterIcons = triplePlaceholder();

export const welcomeCategories = {
  crowdLending: {
    titleKey: 'welcome.categories.crowdLending' as const,
    icons: [
      ICON_CROWD_LENDING_FIRST,
      ICON_CROWD_LENDING_CENTER,
      ICON_CROWD_LENDING_LAST,
    ] as const satisfies WelcomeClusterIcons,
  },
  crowdRealEstate: {
    titleKey: 'welcome.categories.crowdRealEstate' as const,
    icons: [
      ICON_CROWD_REAL_ESTATE_FIRST,
      ICON_CROWD_REAL_ESTATE_CENTER,
      ICON_CROWD_REAL_ESTATE_LAST,
    ] as const satisfies WelcomeClusterIcons,
  },
  commodities: {
    titleKey: 'welcome.categories.commodities' as const,
    icons: [
      ICON_COMMODITIES_FIRST,
      ICON_COMMODITIES_CENTER,
      ICON_COMMODITIES_LAST,
    ] as const satisfies WelcomeClusterIcons,
  },
  etfs: {
    titleKey: 'welcome.categories.etfs' as const,
    icons: [
      ICON_ETFS_FIRST,
      ICON_ETFS_CENTER,
      ICON_ETFS_LAST,
    ] as const satisfies WelcomeClusterIcons,
  },
  crypto: {
    titleKey: 'welcome.categories.crypto' as const,
    icons: [
      ICON_CRYPTO_FIRST,
      ICON_CRYPTO_CENTER,
      ICON_CRYPTO_LAST,
    ] as const satisfies WelcomeClusterIcons,
  },
} as const;

export type WelcomeCategoryId = keyof typeof welcomeCategories;
