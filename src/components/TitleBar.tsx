import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type TitleBarProps = {
  title?: string;
  ctaLabel?: string;
  ctaLoadingLabel?: string;
  ctaAction?: () => void;
  ctaClassName?: string;
  isCtaVisible?: boolean;
  isCtaDisabled?: boolean;
  isCtaLoading?: boolean;
  extra?: React.ReactNode;
};

export default function TitleBar({
  title,
  ctaLabel,
  ctaLoadingLabel,
  ctaAction,
  ctaClassName,
  isCtaVisible,
  isCtaDisabled,
  isCtaLoading,
  extra,
}: TitleBarProps) {
  return (
    <div className="grid grid-cols-3 gap-4 mb-2">
      <div className="col-start-2">
        <h1 className="text-center text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex justify-end">
        {isCtaVisible && (
          <Button
            variant="outline"
            className={cn("font-semibold w-fit", ctaClassName)}
            disabled={isCtaDisabled}
            isLoading={isCtaLoading}
            loadingText={ctaLoadingLabel}
            onClick={ctaAction}
          >
            {ctaLabel}
          </Button>
        )}
        {extra}
      </div>
    </div>
  );
}
