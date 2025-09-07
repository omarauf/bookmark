import { hexToRgb, isLight } from "../lib/color";

export type LabelColor =
  | "default"
  | "primary"
  | "secondary"
  | "info"
  | "success"
  | "warning"
  | "error";

export type LabelVariant = "filled" | "outlined" | "soft" | "inverted";
export type LabelShape = "rounded" | "fullRounded" | "square";
export type LabelSize = "small" | "medium" | "large";

export interface LabelProps {
  startIcon?: React.ReactElement | null;
  endIcon?: React.ReactElement | null;
  color?: LabelColor;
  customColor?: string;
  variant?: LabelVariant;
  shape?: LabelShape;
  size?: LabelSize;
  style?: React.CSSProperties;
  children?: React.ReactNode;
  className?: string;
}

const iconStyles = {
  width: 16,
  height: 16,
};

export function Label({
  children,
  color = "default",
  variant = "soft",
  shape = "rounded",
  size = "medium",
  customColor,
  startIcon,
  endIcon,
  style,
  className,
}: LabelProps) {
  return (
    <span
      className={className}
      style={{
        ...labelStyle({ color, variant, customColor, shape, size }),
        ...(startIcon && { paddingLeft: "3px" }),
        ...(endIcon && { paddingRight: "3px" }),
        ...style,
      }}
    >
      {startIcon && <span style={{ marginRight: "3px", ...iconStyles }}>{startIcon}</span>}

      {children}

      {endIcon && <span style={{ marginLeft: "3px", ...iconStyles }}>{endIcon}</span>}
    </span>
  );
}

export function labelStyle({
  color,
  variant,
  customColor,
  shape,
  size,
}: {
  color: LabelColor;
  customColor?: string;
  variant: LabelVariant;
  shape: LabelShape;
  size: LabelSize;
}) {
  let style: {
    color?: string | undefined;
    backgroundColor?: string | undefined;
    border?: string | undefined;
  } = {};

  //   const { resolvedTheme } = useTheme();
  const resolvedTheme = "dark";

  // if there is a custom color it will override the default color
  if (customColor) {
    const rgb = hexToRgb(customColor);
    style = {
      // FILLED
      ...(variant === "filled" && {
        color: isLight(customColor) ? "white" : "black",
        backgroundColor: customColor,
      }),
      // OUTLINED
      ...(variant === "outlined" && {
        backgroundColor: "transparent",
        color,
        border: `2px solid ${customColor}`,
      }),
      // SOFT
      ...(variant === "soft" && {
        color,
        backgroundColor: `rgba(${rgb.r} ${rgb.g} ${rgb.b} 0.16)`,
      }),
    };
  } else {
    const rgb = hexToRgb(COLORS[color].main);

    style = {
      /**
       * @variant filled
       */
      ...(variant === "filled" && {
        // color: theme.vars.palette[color].contrastText,
        color: "#fff",
        backgroundColor: COLORS[color].main,
      }),
      /**
       * @variant outlined
       */
      ...(variant === "outlined" && {
        backgroundColor: "transparent",
        color: COLORS[color].main,
        border: `2px solid ${COLORS[color].main}`,
      }),
      /**
       * @variant soft
       */
      ...(variant === "soft" && {
        color: resolvedTheme === "dark" ? COLORS[color].light : COLORS[color].dark,
        backgroundColor: `rgba(${rgb.r} ${rgb.g} ${rgb.b} 0.16)`,
      }),
      /**
       * @variant inverted
       */
      ...(variant === "inverted" && {
        color: COLORS[color].darker,
        backgroundColor: COLORS[color].lighter,
      }),
    };
  }

  const shapeStyle = {
    borderRadius: "",
    padding: "",
  };

  if (shape === "rounded") {
    shapeStyle.borderRadius = "6px";
    shapeStyle.padding = "0 6px";
  } else if (shape === "square") {
    shapeStyle.borderRadius = "0px";
    shapeStyle.padding = "0 6px";
  } else if (shape === "fullRounded") {
    shapeStyle.borderRadius = "9999px";
    shapeStyle.padding = "0 12px";
  }

  const sizeStyle = {
    fontSize: "",
    fontWeight: 700,
  };

  if (size === "small") {
    sizeStyle.fontSize = "10px";
    sizeStyle.fontWeight = 700;
  } else if (size === "medium") {
    sizeStyle.fontSize = "12px";
    sizeStyle.fontWeight = 700;
  } else if (size === "large") {
    sizeStyle.fontSize = "14px";
    sizeStyle.fontWeight = 400;
  }

  return {
    height: 24,
    minWidth: 24,
    lineHeight: 0,
    cursor: "default",
    alignItems: "center",
    whiteSpace: "nowrap",
    display: "inline-flex",
    justifyContent: "center",
    transition: "all",
    ...shapeStyle,
    ...sizeStyle,
    ...style,
  };
}

export const COLORS = {
  primary: {
    lighter: "#C8FAD6",
    light: "#5BE49B",
    main: "#00A76F",
    dark: "#007867",
    darker: "#004B50",
  },
  secondary: {
    lighter: "#EFD6FF",
    light: "#C684FF",
    main: "#8E33FF",
    dark: "#5119B7",
    darker: "#27097A",
  },
  info: {
    lighter: "#CAFDF5",
    light: "#61F3F3",
    main: "#00B8D9",
    dark: "#006C9C",
    darker: "#003768",
  },
  success: {
    lighter: "#D3FCD2",
    light: "#77ED8B",
    main: "#22C55E",
    dark: "#118D57",
    darker: "#065E49",
  },
  warning: {
    lighter: "#FFF5CC",
    light: "#FFD666",
    main: "#FFAB00",
    dark: "#B76E00",
    darker: "#7A4100",
  },
  error: {
    lighter: "#FFE9D5",
    light: "#FFAC82",
    main: "#FF5630",
    dark: "#B71D18",
    darker: "#7A0916",
  },
  default: {
    lighter: "#F9FAFB",
    light: "#F4F6F8",
    main: "#919EAB",
    dark: "#637381",
    darker: "#212B36",
  },
  grey: {
    50: "#FCFDFD",
    100: "#F9FAFB",
    200: "#F4F6F8",
    300: "#DFE3E8",
    400: "#C4CDD5",
    500: "#919EAB",
    "500Channel": "145 158 171",
    600: "#637381",
    700: "#454F5B",
    800: "#1C252E",
    900: "#141A21",
  },
};
