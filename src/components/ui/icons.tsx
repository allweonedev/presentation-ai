import { cn } from "@/lib/utils";
import {
  Book,
  CandlestickChart,
  Circle,
  CircleDot,
  ClipboardListIcon,
  Cloud,
  Command,
  Diamond,
  Eye,
  Facebook,
  Globe,
  Heart,
  Lightbulb,
  Mail,
  Network,
  Newspaper,
  NotebookPen,
  PanelsTopLeft,
  PartyPopper,
  Pencil,
  Plane,
  Puzzle,
  Shirt,
  Square,
  Star,
  Terminal,
  Triangle,
  User,
  Youtube,
} from "lucide-react";
import { forwardRef, type SVGProps } from "react";

interface Props {
  className?: string;
}

export const ICON_MAP = {
  calendar: CalendarIcon,
  cake: CakeIcon,
  "shopping-cart": ShoppingCartIcon,
  car: CarIcon,
  fork: UtensilsIcon,
  "cooking-pot": CookingPotIcon,
  bottle: PillBottleIcon,
  brain: Brain,
  lightbulb: Lightbulb,
  puzzle: Puzzle,
  star: Star,
  heart: Heart,
  diamond: Diamond,
  circle: Circle,
  square: Square,
  triangle: Triangle,
  eye: Eye,
  browser: Globe,
  notebook: NotebookPen,
  mouth: Mouth,
  network: Network,
  youtube: Youtube,
  google: GoogleLogo,
  facebook: Facebook,
  cloud: Cloud,
  weather: Cloud,
  stock: CandlestickChart,
  plane: Plane,
  user: User,
  book: Book,
  news: Newspaper,
  shirt: Shirt,
  party: PartyPopper,
  command: Command,
  terminal: Terminal,
  pencil: Pencil,
  "circle-dot": CircleDot,
  website: PanelsTopLeft,
  mail: Mail,
  clipboard: ClipboardListIcon,
};

export type Icons = keyof typeof ICON_MAP;

export function FontColor(props: { className?: string }) {
  return (
    <div className={cn("h-full w-full", props.className)}>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 20">
        <path
          d="M11 2 5.5 16h2.25l1.12-3h6.25l1.12 3h2.25L13 2h-2zm-1.38 9L12 4.67 14.38 11H9.62z"
          fill="currentColor"
        ></path>
      </svg>
      <div className="h-2 w-full rounded-full bg-linear-to-r from-red-500 via-yellow-500 to-blue-500"></div>
    </div>
  );
}

export function GoogleLogo(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-full w-full", props.className)}
      viewBox="0 0 186.69 190.5"
    >
      <g transform="translate(1184.583 765.171)">
        <path
          clipPath="none"
          mask="none"
          d="M-1089.333-687.239v36.888h51.262c-2.251 11.863-9.006 21.908-19.137 28.662l30.913 23.986c18.011-16.625 28.402-41.044 28.402-70.052 0-6.754-.606-13.249-1.732-19.483z"
          fill="#4285f4"
        />
        <path
          clipPath="none"
          mask="none"
          d="M-1142.714-651.791l-6.972 5.337-24.679 19.223h0c15.673 31.086 47.796 52.561 85.03 52.561 25.717 0 47.278-8.486 63.038-23.033l-30.913-23.986c-8.486 5.715-19.31 9.179-32.125 9.179-24.765 0-45.806-16.712-53.34-39.226z"
          fill="#34a853"
        />
        <path
          clipPath="none"
          mask="none"
          d="M-1174.365-712.61c-6.494 12.815-10.217 27.276-10.217 42.689s3.723 29.874 10.217 42.689c0 .086 31.693-24.592 31.693-24.592-1.905-5.715-3.031-11.776-3.031-18.098s1.126-12.383 3.031-18.098z"
          fill="#fbbc05"
        />
        <path
          d="M-1089.333-727.244c14.028 0 26.497 4.849 36.455 14.201l27.276-27.276c-16.539-15.413-38.013-24.852-63.731-24.852-37.234 0-69.359 21.388-85.032 52.561l31.692 24.592c7.533-22.514 28.575-39.226 53.34-39.226z"
          fill="#ea4335"
          clipPath="none"
          mask="none"
        />
      </g>
    </svg>
  );
}

export function Temple(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="0"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "relative mt-[-.125em] mr-0.5 inline-block size-[1em] shrink-0 transform-cpu text-[1.25em]",
        props.className,
      )}
    >
      <path d="M19.255 16.605a.527.527 0 0 0-.528-.527h-.188v-.779c0-3.34-1.793-6.4-4.694-8.033v-.444a3.48 3.48 0 0 0-1.318-2.73v-.565a.527.527 0 1 0-1.055 0v.565a3.48 3.48 0 0 0-1.317 2.73v.444a9.204 9.204 0 0 0-4.694 8.033v.779h-.188a.527.527 0 0 0 0 1.055h.188V21h13.078v-3.867h.188a.527.527 0 0 0 .527-.528Zm-1.77-1.306v.779H14.53v-2.702a10.76 10.76 0 0 0-1.38-5.27h.035a8.152 8.152 0 0 1 4.299 7.193Zm-6.962.779v-2.702c0-1.716.458-3.406 1.323-4.888L12 8.224l.154.264a9.704 9.704 0 0 1 1.323 4.888v2.702h-2.954Zm2.954 1.055v2.812h-2.954v-2.813h2.954ZM12 5.027c.5.457.79 1.105.79 1.795v.23h-1.58v-.23c0-.69.29-1.338.79-1.795ZM6.515 15.299a8.152 8.152 0 0 1 4.3-7.192h.034a10.76 10.76 0 0 0-1.38 5.27v2.7H6.515V15.3Zm0 1.834H9.47v2.812H6.515v-2.813Zm10.97 2.812H14.53v-2.813h2.954v2.813Z"></path>
      <path d="M11.473 18.539a.527.527 0 0 1 1.055 0 .527.527 0 0 1-1.055 0ZM15.48 18.539a.527.527 0 0 1 1.055 0 .527.527 0 0 1-1.055 0ZM7.465 18.539a.527.527 0 0 1 1.055 0 .527.527 0 0 1-1.055 0Z"></path>
    </svg>
  );
}

export function Museum(props: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.3125"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={cn(
        "relative mt-[-.125em] mr-0.5 inline-block size-[1em] shrink-0 transform-cpu text-[1.25em]",
        props.className,
      )}
    >
      <path d="M19.599 10.071H4.402c-.72 0-1.03-.784-.463-1.157l7.598-4.975a.913.913 0 0 1 .926 0l7.598 4.975c.566.373.258 1.157-.462 1.157ZM19.714 17.143H4.286a.643.643 0 0 0-.643.643v1.928c0 .355.288.643.643.643h15.428a.643.643 0 0 0 .643-.643v-1.928a.643.643 0 0 0-.643-.643ZM5.571 10.071v7.072M8.786 10.071v7.072M12 10.071v7.072M15.214 10.071v7.072M18.428 10.071v7.072"></path>
    </svg>
  );
}

function PillBottleIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M18 11h-4a1 1 0 0 0-1 1v5a1 1 0 0 0 1 1h4" />
      <path d="M6 7v13a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2V7" />
      <rect width="16" height="5" x="4" y="2" rx="1" />
    </svg>
  );
}
export function Brain({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={cn("h-6 w-6", className)}
    >
      <path d="M11.9563 2.53666C10.5312 2.63106 9.01178 3.02217 7.48332 3.69649C7.26304 3.79089 6.97983 3.8853 6.85396 3.90777C6.39093 3.97521 5.53679 4.25392 5.01082 4.51466C3.85998 5.0721 3.01483 5.89027 2.39446 7.02313C2.27758 7.23891 2.03482 7.60304 1.855 7.83231C0.133241 10.0351 0.0523227 12.1345 1.61225 14.2024C1.77858 14.4227 1.98987 14.7194 2.08427 14.8632C2.29106 15.1779 2.82602 15.6949 3.12272 15.8612C3.9364 16.3153 4.9344 16.3557 6.0223 15.9736C6.23358 15.9017 6.43588 15.8297 6.48083 15.8163C6.53478 15.7983 6.59772 15.8567 6.70561 16.032C7.19561 16.7918 7.88342 17.3132 8.71958 17.5515C9.21408 17.6954 10.1671 17.7223 10.8549 17.6189L11.3764 17.5425L11.5922 17.7448C11.8394 17.9786 12.1271 18.1359 12.5452 18.2663C12.8464 18.3607 13.4128 18.4506 13.7095 18.4506C13.8759 18.4506 13.9028 18.4776 15.0042 19.7003C15.6246 20.3881 16.1865 20.977 16.2585 21.013C16.4293 21.0984 17.9712 21.1344 18.2545 21.058C18.4972 20.9905 18.722 20.7703 18.7849 20.5365C18.8254 20.3881 18.8164 20.2802 18.722 19.8936C18.659 19.6419 18.6096 19.4171 18.6096 19.3991C18.6096 19.3812 18.7265 19.3362 18.8703 19.3047C19.2479 19.2193 19.8413 19.0035 20.2504 18.8012C21.653 18.0955 22.6825 16.9806 23.0151 15.7983C23.132 15.3757 23.141 14.7194 23.0331 14.3597C22.9612 14.108 22.7454 13.6809 22.624 13.5416C22.5611 13.4741 22.5701 13.4471 22.687 13.2943C23.8423 11.8018 23.7614 9.88674 22.4757 8.33131C22.3139 8.13351 22.0216 7.77837 21.8283 7.54011C21.2439 6.82533 19.5626 5.17549 18.9468 4.71246C17.1396 3.35933 15.3594 2.68051 13.26 2.53666C12.9004 2.51418 12.5767 2.4962 12.5407 2.50069C12.5048 2.50069 12.2395 2.51868 11.9563 2.53666ZM13.714 4.02466C13.9208 4.05163 14.1006 4.0831 14.1096 4.09209C14.1186 4.10108 14.0467 4.20447 13.9478 4.32136C13.4893 4.8698 13.1881 5.48568 13.0262 6.19147C12.9183 6.66799 12.8914 7.81883 12.9813 8.13351C13.1521 8.73141 13.9748 8.84829 14.2939 8.32232C14.3704 8.19645 14.3794 8.09755 14.3794 7.45919C14.3749 6.62753 14.4513 6.24991 14.7255 5.72844C14.9548 5.28788 15.6561 4.60457 15.8764 4.60457C16.1101 4.60457 18.0791 5.7644 18.1466 5.93523C18.16 5.97569 18.1016 6.13752 18.0207 6.30386C17.8903 6.5556 17.8229 6.63202 17.5352 6.82533C17.3374 6.96469 17.171 7.11753 17.1216 7.21194C17.0092 7.42323 17.0137 7.68846 17.1396 7.90424C17.3688 8.30434 17.8319 8.35379 18.3444 8.03011C18.686 7.81433 19.0322 7.46369 19.212 7.15799L19.3379 6.94671L19.7065 7.33781C19.9133 7.55359 20.21 7.88176 20.3673 8.07057C20.5247 8.25938 20.7854 8.56957 20.9472 8.75838C21.5496 9.47316 21.6305 9.58105 21.7834 9.88674C22.2779 10.8802 22.0981 11.8198 21.2394 12.7414C20.7989 13.2134 20.718 13.3932 20.8124 13.6944C20.8483 13.8203 20.9293 13.9461 21.0461 14.045C21.4327 14.3867 21.5586 14.5306 21.6126 14.7059C21.8463 15.4791 21.2709 16.4501 20.138 17.1874C19.4727 17.6189 18.7355 17.8932 17.8678 18.0235C17.3464 18.1 17.1486 18.2258 17.0362 18.536C16.9777 18.7023 16.9777 18.7608 17.0497 19.1024C17.0901 19.3092 17.1396 19.5115 17.1531 19.552C17.1755 19.6059 17.1486 19.6194 17.0317 19.6194C16.8878 19.6194 16.8024 19.534 15.7595 18.3787C15.0447 17.583 14.5906 17.1154 14.5007 17.0795C14.4243 17.048 14.1096 17.012 13.7994 16.9986C12.9138 16.9536 12.6261 16.8232 12.3384 16.3377C12.289 16.2523 12.1766 16.1354 12.0912 16.077C11.9024 15.9511 11.7001 15.9556 11.0572 16.113C10.7066 16.2029 10.5088 16.2208 9.93335 16.2208C9.15564 16.2253 8.94884 16.1714 8.50829 15.8702C8.29251 15.7218 7.86544 15.2408 7.86544 15.1464C7.86544 15.1195 7.99581 14.9891 8.15315 14.8632C8.70159 14.4272 9.07921 13.8023 9.17811 13.1774C9.21857 12.9122 9.21408 12.7908 9.15563 12.5031C9.07022 12.076 8.94435 11.8692 8.71508 11.7524C8.38241 11.5815 7.96883 11.6894 7.77553 11.9996C7.66764 12.1704 7.65865 12.3098 7.7081 12.8088C7.73507 13.1055 7.73057 13.1325 7.6047 13.3348C7.24506 13.8877 5.92789 14.5935 4.9254 14.7688C4.17017 14.8992 3.88246 14.7239 2.96538 13.573C2.28657 12.7189 2.02134 12.1659 1.9539 11.4602C1.92244 11.1275 2.00335 10.5521 2.12024 10.2733L2.18317 10.116L2.30905 10.3722C2.80804 11.3972 3.84649 12.0715 4.95238 12.085C5.4244 12.0895 5.5278 12.0491 5.7256 11.7793C5.85596 11.604 5.85596 11.1814 5.7256 11.0016C5.57725 10.7993 5.35697 10.6734 5.15018 10.6734C4.25108 10.6689 3.55429 10.0351 3.40594 9.08205C3.30704 8.4437 3.50034 7.85479 4.04879 7.12203C4.74559 6.19596 5.7211 5.61605 7.03378 5.34632C7.68562 5.21146 8.02278 5.34183 8.40489 5.8678C8.66113 6.21844 8.81398 6.31285 9.13765 6.31285C9.51078 6.31285 9.81647 5.98917 9.81647 5.59357C9.81647 5.3643 9.72656 5.18898 9.40738 4.79788L9.21408 4.56411L9.59169 4.44723C10.1132 4.28989 10.9044 4.11457 11.4169 4.04264C11.9563 3.97071 13.215 3.96172 13.714 4.02466Z"></path>
      <path d="M10.248 6.68169C10.1356 6.74013 10.0008 6.85701 9.94234 6.94243C9.84794 7.08178 9.83895 7.13573 9.86142 7.40995C9.8794 7.64372 9.86592 7.7606 9.81197 7.87299C9.60518 8.31354 8.6926 8.71813 8.10819 8.62822C7.95984 8.60575 7.85195 8.5518 7.68562 8.40345C7.51929 8.2551 7.4114 8.20115 7.25855 8.17418C6.80001 8.10675 6.37744 8.52932 6.44487 8.98336C6.50331 9.35649 7.00231 9.81952 7.51929 9.98136C8.08122 10.1522 8.91288 10.0937 9.54225 9.8375L9.81197 9.72961L10.0502 9.99035C10.5312 10.5208 11.1112 10.8085 11.7136 10.8085C12.28 10.8085 12.6981 10.6107 12.8374 10.2826C12.9813 9.94539 12.8689 9.59924 12.5407 9.37897C12.3789 9.27107 12.235 9.26658 11.772 9.3475C11.5652 9.38796 11.4169 9.31153 11.1471 9.03731L10.9448 8.82602L11.0662 8.61474C11.4483 7.92693 11.3944 6.99637 10.9493 6.72215C10.7066 6.5693 10.4908 6.55582 10.248 6.68169Z"></path>
      <path d="M15.0134 8.92943C14.7527 9.0643 14.6088 9.27558 14.6088 9.53632C14.6088 9.82403 14.7212 10.0218 14.9909 10.2106C15.1213 10.3005 15.2697 10.4444 15.3281 10.5253C15.4585 10.7141 15.5529 11.0738 15.5529 11.3705C15.5529 11.5863 15.445 12.1931 15.3955 12.2381C15.3865 12.2516 15.2202 12.2291 15.0359 12.1886C14.3166 12.0268 13.3771 12.1167 12.8241 12.3999C12.3161 12.6562 11.7767 13.2541 11.7048 13.6317C11.6104 14.1307 12.1004 14.5802 12.5949 14.4454C12.7792 14.3959 12.9051 14.288 13.1883 13.9329C13.3906 13.6811 13.6243 13.5822 14.0829 13.5598C14.5684 13.5328 14.973 13.6227 15.4989 13.8699C16.1822 14.1846 16.6902 14.6162 16.9105 15.0702C16.9869 15.2321 17.0139 15.3669 17.0184 15.6412C17.0229 16.0637 17.0678 16.1896 17.2567 16.3514C17.6163 16.6526 18.1198 16.5672 18.358 16.1581C18.4794 15.9513 18.5064 15.4164 18.412 15.0163C18.2502 14.3375 17.6882 13.5598 17.0049 13.0698C16.7936 12.9214 16.7262 12.845 16.7442 12.791C16.9734 12.2021 17.0544 11.2356 16.9285 10.6647C16.7622 9.92293 16.2677 9.23512 15.6922 8.95191C15.391 8.80356 15.2697 8.79906 15.0134 8.92943Z"></path>
      <path d="M19.3469 10.2691C18.6411 10.4084 18.4838 10.4714 18.3354 10.6782C18.0073 11.1367 18.3534 11.7975 18.9198 11.7975C19.1671 11.7975 20.2595 11.5817 20.4123 11.5008C20.5742 11.4199 20.709 11.2401 20.7675 11.0423C20.8574 10.7006 20.6146 10.2736 20.273 10.1792C20.0707 10.1207 20.0932 10.1207 19.3469 10.2691Z"></path>
    </svg>
  );
}
export function Mouth({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      className={cn("h-6 w-6 text-inherit", className)}
      viewBox="0 0 192.756 192.756"
    >
      <g>
        <path
          fill="currentColor"
          fillOpacity="0"
          d="M0 0h192.756v192.756H0V0z"
        />
        <path
          stroke="currentColor"
          strokeWidth={"16"}
          d="M175.15 62.206c-25.258-14.837-22.475-27.994-31.605-45.447 0 0-1.57-4.625-9.143-7.469-16.357-3.759-28.65 11.285-31.596 13.776.545-4.99-11.155-25.778-33.425-6.568-15.29 10.952-15.257 37.678-41.136 47.984-.426-.237-4.285 2.525-.299 6.32 0 0 11.583 7.47 11.965 20.924-.715 2.699-10.044 12.34-15.183 34.234-9.724 55.166 50.81 82.287 79.378 31.068 0 0 21.273.236 33.455-28.638 7.789-16.68 8.318-30.546 27.967-51.973 5.504-5.822 9.221-9.219 9.221-9.219s3.573-2.727.401-4.992z"
        />
        <path
          d="M58.741 51.183c.989-2.379 2.006-2.686 2.006-2.686s4.436-4.226 12.465-5.28c9.168-.639 13.028 3.791 15.831 4.895 2.208 1.444 7.99 3.783 16.119-.557 6.877-4.609 14.867-4.03 14.867-4.03s6.043 0 10.27 4.225c7.137 7.521 9.812 14.802 9.984 15.481-1.105.509-11.736 7.104-16.258-5.697-12.084 14.212-24.387 6.738-26.68.623-15.348 12.282-24.249 2.933-24.504-3.948-1.868 2.209-11.681 5.559-14.1-3.026zM74.173 22.164c2.337-8.487 12.677-9.083 12.677-9.083s9.064.057 10.173 6.321c1.547 5.582-2.686 7.648-2.686 7.648s-4.499 3.183-7.781-1.517c-4.197-2.171-6.204-.217-6.204-.217s-8.379 4.001-6.179-3.152zM122.289 24.51c-2.492.906-6.572 1.92-7.152-3.349 1.629-5.391 8.662-7.182 8.662-7.182s10.305-1.926 13.393 3.477c0 0 1.656 3.778.848 6.45-5.355 7.246-10.098.928-10.098.928s-3.268-1.878-5.653-.324zM66.893 79.77c-1.132 1.019-30.346 20.819-29.736 55.84.845 7.604 5.493 7.393 5.493 7.393s4.89.392 5.947-8.058c.377-9.242 3.059-32.363 22.933-51.804 6.941-7.72-1.692-5.41-4.637-3.371zM110.023 88.602c-7.588 8.042-17.262 40.638-23.044 50.005-.113.68-10.603 14.648-2.268 20.678 8.41 2.348 14.144-8.815 16.437-17.31 1.193-3.659 4.609-37.272 21.383-53.406 3.365-3.237 4.887-4.854 5.279-6.847.238-1.218.135-2.364-.42-2.736-1.154-2.122-7.168.87-7.168.87s-5.386 2.602-10.199 8.746z"
          fill="white"
        />
      </g>
    </svg>
  );
}
function CookingPotIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 12h20" />
      <path d="M20 12v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-8" />
      <path d="m4 8 16-4" />
      <path d="m8.86 6.78-.45-1.81a2 2 0 0 1 1.45-2.43l1.94-.48a2 2 0 0 1 2.43 1.46l.45 1.8" />
    </svg>
  );
}
export function CakeIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8" />
      <path d="M4 16s.5-1 2-1 2.5 2 4 2 2.5-2 4-2 2.5 2 4 2 2-1 2-1" />
      <path d="M2 21h20" />
      <path d="M7 8v3" />
      <path d="M12 8v3" />
      <path d="M17 8v3" />
      <path d="M7 4h0.01" />
      <path d="M12 4h0.01" />
      <path d="M17 4h0.01" />
    </svg>
  );
}

function UtensilsIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" />
      <path d="M7 2v20" />
      <path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3Zm0 0v7" />
    </svg>
  );
}

export function CalendarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M8 2v4" />
      <path d="M16 2v4" />
      <rect width="18" height="18" x="3" y="4" rx="2" />
      <path d="M3 10h18" />
    </svg>
  );
}

export function CarIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M19 17h2c.6 0 1-.4 1-1v-3c0-.9-.7-1.7-1.5-1.9C18.7 10.6 16 10 16 10s-1.3-1.4-2.2-2.3c-.5-.4-1.1-.7-1.8-.7H5c-.6 0-1.1.4-1.4.9l-1.4 2.9A3.7 3.7 0 0 0 2 12v4c0 .6.4 1 1 1h2" />
      <circle cx="7" cy="17" r="2" />
      <path d="M9 17h6" />
      <circle cx="17" cy="17" r="2" />
    </svg>
  );
}

export function PenToolIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M15.707 21.293a1 1 0 0 1-1.414 0l-1.586-1.586a1 1 0 0 1 0-1.414l5.586-5.586a1 1 0 0 1 1.414 0l1.586 1.586a1 1 0 0 1 0 1.414z" />
      <path d="m18 13-1.375-6.874a1 1 0 0 0-.746-.776L3.235 2.028a1 1 0 0 0-1.207 1.207L5.35 15.879a1 1 0 0 0 .776.746L13 18" />
      <path d="m2.3 2.3 7.286 7.286" />
      <circle cx="11" cy="11" r="2" />
    </svg>
  );
}

export function ShoppingCartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="8" cy="21" r="1" />
      <circle cx="19" cy="21" r="1" />
      <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
    </svg>
  );
}

export function GoogleIcon({ className }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 48 48"
      className={className}
    >
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );
}

type IconSvgProps = SVGProps<SVGSVGElement>;

export const MindMapIcon = forwardRef<SVGSVGElement, IconSvgProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className={cn("h-4 w-4", props.className)}
        {...props}
      >
        <path
          d="M21 5H18.6C15 5 15 10.0313 15 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M3 5H5.4C8.99996 5 9 10.0313 9 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M21 19H18.6C15 19 15 13.9688 15 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M3 19H5.4C8.99996 19 9 13.9688 9 12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M11 12H21"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M3 12H12"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
    );
  },
);
MindMapIcon.displayName = "MindMapIcon";

export const LogicChartIcon = forwardRef<SVGSVGElement, IconSvgProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-4 w-4", props.className)}
        {...props}
      >
        <path
          d="M20.0267 4H17.6C14 4 12.8267 9.8 12.8267 11.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M20.0267 19.2001L17.7 19.2001C13.5 19.2001 12.8267 13.4001 12.8267 11.6001"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M8.02663 11.6H20.0266M4.02535 13.6214L7.02531 13.6054C7.57811 13.6024 8.02364 13.1515 8.01995 12.5987L8.0066 10.5987C8.00291 10.047 7.55303 9.60248 7.00128 9.60543L4.00132 9.62145C3.44852 9.6244 3.00299 10.0753 3.00668 10.6281L3.02004 12.6281C3.02372 13.1798 3.4736 13.6243 4.02535 13.6214Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
    );
  },
);
LogicChartIcon.displayName = "LogicChartIcon";
export const ReverseLogicChartIcon = forwardRef<SVGSVGElement, IconSvgProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn("h-4 w-4 rotate-180", props.className)}
        {...props}
      >
        <path
          d="M20.0267 4H17.6C14 4 12.8267 9.8 12.8267 11.6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M20.0267 19.2001L17.7 19.2001C13.5 19.2001 12.8267 13.4001 12.8267 11.6001"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M8.02663 11.6H20.0266M4.02535 13.6214L7.02531 13.6054C7.57811 13.6024 8.02364 13.1515 8.01995 12.5987L8.0066 10.5987C8.00291 10.047 7.55303 9.60248 7.00128 9.60543L4.00132 9.62145C3.44852 9.6244 3.00299 10.0753 3.00668 10.6281L3.02004 12.6281C3.02372 13.1798 3.4736 13.6243 4.02535 13.6214Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
    );
  },
);
ReverseLogicChartIcon.displayName = "ReverseLogicChartIcon";

export const TreeChartIcon = forwardRef<SVGSVGElement, IconSvgProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className={cn("h-4 w-4", props.className)}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path
          d="M4 18V17.8C4 16.1198 4 15.2798 4.32698 14.638C4.6146 14.0735 5.07354 13.6146 5.63803 13.327C6.27976 13 7.11984 13 8.8 13H15.2C16.8802 13 17.7202 13 18.362 13.327C18.9265 13.6146 19.3854 14.0735 19.673 14.638C20 15.2798 20 16.1198 20 17.8V18M4 18C2.89543 18 2 18.8954 2 20C2 21.1046 2.89543 22 4 22C5.10457 22 6 21.1046 6 20C6 18.8954 5.10457 18 4 18ZM20 18C18.8954 18 18 18.8954 18 20C18 21.1046 18.8954 22 20 22C21.1046 22 22 21.1046 22 20C22 18.8954 21.1046 18 20 18ZM12 18C10.8954 18 10 18.8954 10 20C10 21.1046 10.8954 22 12 22C13.1046 22 14 21.1046 14 20C14 18.8954 13.1046 18 12 18ZM12 18V8M6 8H18C18.9319 8 19.3978 8 19.7654 7.84776C20.2554 7.64477 20.6448 7.25542 20.8478 6.76537C21 6.39782 21 5.93188 21 5C21 4.06812 21 3.60218 20.8478 3.23463C20.6448 2.74458 20.2554 2.35523 19.7654 2.15224C19.3978 2 18.9319 2 18 2H6C5.06812 2 4.60218 2 4.23463 2.15224C3.74458 2.35523 3.35523 2.74458 3.15224 3.23463C3 3.60218 3 4.06812 3 5C3 5.93188 3 6.39782 3.15224 6.76537C3.35523 7.25542 3.74458 7.64477 4.23463 7.84776C4.60218 8 5.06812 8 6 8Z"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        ></path>
      </svg>
    );
  },
);
TreeChartIcon.displayName = "TreeChartIcon";

export const TimelineChartIcon = forwardRef<SVGSVGElement, IconSvgProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className={cn("h-4 w-4", props.className)}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path
          d="M2 11.8999H22"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M4 11.5V5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M12 5.5V11.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M7 12.5V18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M16 12.5V18.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M19 11.5V5.5"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
      </svg>
    );
  },
);
TimelineChartIcon.displayName = "TimelineChartIcon";

export const FishboneChartIcon = forwardRef<SVGSVGElement, IconSvgProps>(
  (props, ref) => {
    return (
      <svg
        ref={ref}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        className={cn("h-4 w-4", props.className)}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        {...props}
      >
        <path
          d="M6 12.0586H22.2"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M8 12.0585L11.6 6.05859"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M10.3999 12.0586L13.9999 18.0586"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M16.8 12.0586L20.4 18.0586"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M14.3999 12.0585L17.9999 6.05859"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        ></path>
        <path
          d="M2 11.5C2 10.6716 2.67157 10 3.5 10H4.5C5.32843 10 6 10.6716 6 11.5V12.5C6 13.3284 5.32843 14 4.5 14H3.5C2.67157 14 2 13.3284 2 12.5V11.5Z"
          stroke="currentColor"
          strokeWidth="2"
        ></path>
      </svg>
    );
  },
);
FishboneChartIcon.displayName = "FishboneChartIcon";
