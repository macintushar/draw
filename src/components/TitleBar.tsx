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
  titleExtra?: React.ReactNode;
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
  titleExtra,
  extra,
}: TitleBarProps) {
  return (
    <div className="mb-6 flex items-center justify-between gap-4">
      <div className="flex flex-col items-start gap-2">
        <h1 className="font-virgil text-3xl font-bold text-gray-900 dark:text-gray-50">{title}</h1>
        {titleExtra}
      </div>
      <div className="flex items-center gap-3">
        {extra}
        {isCtaVisible && (
          <Button
            className={cn("font-semibold", ctaClassName)}
            disabled={isCtaDisabled}
            isLoading={isCtaLoading}
            loadingText={ctaLoadingLabel}
            onClick={ctaAction}
          >
            {ctaLabel}
          </Button>
        )}
      </div>
    </div>
  );
}
