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
    <div className="mb-2 grid grid-cols-3 gap-4">
      <div className="col-start-2">
        <h1 className="text-center font-virgil text-2xl font-bold">{title}</h1>
      </div>
      <div className="flex justify-end">
        {isCtaVisible && (
          <Button
            variant="outline"
            className={cn("w-fit font-semibold", ctaClassName)}
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
