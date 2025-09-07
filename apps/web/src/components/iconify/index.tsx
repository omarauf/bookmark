import { Icon, type IconProps } from "@iconify/react";

export type IconifyProps = Omit<IconProps, "icon"> & {
  icon: string;
  ref?: React.Ref<SVGSVGElement>;
};

export function Iconify({ className, width = 20, ref, ...other }: IconifyProps) {
  return <Icon ref={ref} width={width} className={className} {...other} />;
}

// // https://iconify.design/docs/iconify-icon/disable-cache.html
// disableCache("local");
