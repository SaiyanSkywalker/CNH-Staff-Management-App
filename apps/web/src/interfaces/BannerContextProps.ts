export interface BannerContextProps {
  bannerText: string;
  isError: boolean;
  isVisible: boolean;
  showBanner: (text: string, isError?: boolean) => void;
  hideBanner: () => void;
}
